/**
 * Browser copy of the board, kept in step with the host.
 *
 * The view is always "last board the host confirmed, plus the ops not yet
 * confirmed, replayed on top" — so a click shows up at once, and whatever
 * the host answers, the view is rebuilt from the host's board instead of
 * being patched. Ops are sent one batch at a time, in order.
 *
 * Retrying is safe because every op is idempotent on the host: adds carry
 * browser-made ids (a repeat is refused as a duplicate), moves name the
 * target column, and an advance names the column it starts from (a repeat
 * is refused instead of skipping a column).
 * @module dsh-project-kanban/client/sync
 */
import { applyOps, emptyBoard, sanitizeBoard, type Board, type Op } from '../shared/board'
import { BOARD_ENDPOINT, MAX_BODY_BYTES, MAX_OPS_PER_REQUEST, OPS_ENDPOINT, type BoardResponse, type OpsResponse } from '../shared/protocol'

/** Body budget per request, kept well under the host's cap. */
const BODY_BUDGET = Math.floor(MAX_BODY_BYTES * 0.75)

/**
 * The longest prefix of `ops` that fits one request: at most
 * MAX_OPS_PER_REQUEST ops and BODY_BUDGET bytes (always at least one op).
 */
export function takeBatch(ops: readonly Op[]): Op[] {
  const encoder = new TextEncoder()
  let bytes = 16
  const batch: Op[] = []
  for (const op of ops) {
    if (batch.length >= MAX_OPS_PER_REQUEST) break
    const size = encoder.encode(JSON.stringify(op)).length + 1
    if (batch.length > 0 && bytes + size > BODY_BUDGET) break
    bytes += size
    batch.push(op)
  }
  return batch
}

/** What the UI shows about saving. */
export type SyncStatus = 'loading' | 'saved' | 'saving' | 'offline' | 'load-failed'

/** Snapshot read by the UI. */
export interface SyncSnapshot {
  board: Board
  status: SyncStatus
  /** Set when the first load failed. */
  error?: string
}

/** Fetch face, so tests can replace the network. */
export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>

/** Options of {@link BoardSync}. */
export interface BoardSyncOptions {
  fetch?: FetchLike
  /** Called with the reason when the host refuses an op. */
  onRefused?: (reason: string) => void
  /** Retry delays in ms after a failed save (last one repeats). */
  retryDelays?: number[]
}

/** Keeps the board, the queue and the save loop. */
export class BoardSync {
  private confirmed: Board = emptyBoard()
  private inflight: Op[] = []
  private pending: Op[] = []
  private status: SyncStatus = 'loading'
  private error: string | undefined
  private snapshot: SyncSnapshot
  private readonly listeners = new Set<() => void>()
  private readonly fetchImpl: FetchLike
  private readonly onRefused: (reason: string) => void
  private readonly retryDelays: number[]
  private failures = 0
  private retryTimer: ReturnType<typeof setTimeout> | undefined
  private loaded = false
  private disposed = false
  /** Set when a background refresh failed; cleared by the next success. */
  private refreshFailed = false
  /** Bumped whenever `confirmed` changes, so an older load answer is dropped. */
  private generation = 0
  private loadSeq = 0

  constructor(options: BoardSyncOptions = {}) {
    this.fetchImpl = options.fetch ?? ((input, init) => fetch(input, init))
    this.onRefused = options.onRefused ?? (() => {})
    this.retryDelays = options.retryDelays ?? [1000, 2000, 4000, 8000, 15000]
    this.snapshot = { board: this.confirmed, status: this.status }
  }

  /** Current snapshot (stable reference until something changes). */
  getSnapshot = (): SyncSnapshot => this.snapshot

  /** Subscribe to snapshot changes. */
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /** Whether some changes are not yet confirmed by the host. */
  get busy(): boolean {
    return this.inflight.length > 0 || this.pending.length > 0
  }

  /**
   * Load (or re-load) the board from the host. Skipped while changes are
   * queued, so a refresh can never roll back a click.
   */
  async load(): Promise<void> {
    if (this.busy || this.disposed) return
    const seq = ++this.loadSeq
    const generation = this.generation
    try {
      const response = await this.fetchImpl(BOARD_ENDPOINT, { method: 'GET', cache: 'no-store' })
      const body = (await response.json()) as BoardResponse
      if (!body.ok) throw new Error(body.error)
      // Drop the answer when changes were queued or confirmed meanwhile, or a
      // newer load was started: it may describe an older board.
      if (this.busy || this.disposed || seq !== this.loadSeq || generation !== this.generation) return
      const board = sanitizeBoard(body.value)
      this.loaded = true
      this.error = undefined
      this.refreshFailed = false
      if (board.revision !== this.confirmed.revision || this.status === 'loading' || this.status === 'load-failed') {
        this.setConfirmed(board)
      }
      this.status = 'saved'
    } catch (error) {
      if (seq !== this.loadSeq || this.disposed) return
      if (!this.loaded) {
        this.status = 'load-failed'
        this.error = error instanceof Error ? error.message : String(error)
      } else {
        this.refreshFailed = true
      }
    }
    this.publish()
  }

  /**
   * Apply an op now and queue it for the host.
   * @returns false (and changes nothing) when the op does not fit the current view.
   */
  dispatch(op: Op): boolean {
    if (this.disposed) return false
    const view = this.snapshot.board
    const { refused } = applyOps(view, [op])
    if (refused.length > 0) {
      this.onRefused(refused[0]!.reason)
      return false
    }
    this.pending.push(op)
    this.publish()
    void this.flush()
    return true
  }

  /** Stop timers; later dispatches are ignored. */
  dispose(): void {
    this.disposed = true
    if (this.retryTimer) clearTimeout(this.retryTimer)
    this.listeners.clear()
  }

  private async flush(): Promise<void> {
    if (this.inflight.length > 0 || this.pending.length === 0 || this.disposed || this.retryTimer) return
    this.inflight = takeBatch(this.pending)
    this.pending = this.pending.slice(this.inflight.length)
    this.publish()
    let body: OpsResponse | undefined
    try {
      const response = await this.fetchImpl(OPS_ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ops: this.inflight }),
      })
      body = (await response.json()) as OpsResponse
      if (!body.ok) {
        // The request itself was rejected (too large, bad body): retrying it
        // unchanged cannot help, so drop it and resync with the host.
        this.onRefused(body.error)
        this.inflight = []
        this.failures = 0
        this.publish()
        await this.load()
        void this.flush()
        return
      }
    } catch {
      // Network or host down: keep the ops, in order, and retry later.
      this.pending = [...this.inflight, ...this.pending]
      this.inflight = []
      const delay = this.retryDelays[Math.min(this.failures, this.retryDelays.length - 1)] ?? 15000
      this.failures += 1
      this.retryTimer = setTimeout(() => {
        this.retryTimer = undefined
        void this.flush()
      }, delay)
      this.publish()
      return
    }
    this.failures = 0
    this.refreshFailed = false
    this.setConfirmed(sanitizeBoard(body.value))
    this.loaded = true
    const sent = this.inflight
    this.inflight = []
    for (const item of body.refused) {
      // Ops refused because a repeat already landed are not news to the user.
      if (/已存在|已被移动|已在/.test(item.reason) && sent[item.index]?.type !== 'project.update') continue
      this.onRefused(item.reason)
    }
    this.publish()
    void this.flush()
  }

  private setConfirmed(board: Board): void {
    this.confirmed = board
    this.generation += 1
  }

  private publish(): void {
    const queued = [...this.inflight, ...this.pending]
    const board = queued.length > 0 ? applyOps(this.confirmed, queued).board : this.confirmed
    let status: SyncStatus
    if (this.status === 'load-failed' && !this.loaded) status = 'load-failed'
    else if (!this.loaded && this.status === 'loading') status = 'loading'
    else if (this.retryTimer || (this.refreshFailed && queued.length === 0)) status = 'offline'
    else if (queued.length > 0) status = 'saving'
    else status = 'saved'
    this.status = status
    this.snapshot = { board, status, ...(this.error !== undefined ? { error: this.error } : {}) }
    for (const listener of this.listeners) listener()
  }
}
