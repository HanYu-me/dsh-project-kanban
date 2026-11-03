/**
 * Browser sync-layer tests: {@link BoardSync} against a real in-memory host.
 *
 * The fake `fetch` speaks the real wire protocol (`GET /project-kanban/board`,
 * `POST /project-kanban/ops`) and delegates to `createMemoryStore`, so the
 * suite exercises the same request/response shapes the host routes produce,
 * including refusals, dropped connections and lost responses.
 */
import { describe, expect, it, vi } from 'vitest'
import { BoardSync, type FetchLike, type SyncSnapshot, type SyncStatus } from '../src/client/sync'
import { emptyBoard, type Board, type Op } from '../src/shared/board'
import { BOARD_ENDPOINT, MAX_OPS_PER_REQUEST, OPS_ENDPOINT } from '../src/shared/protocol'
import { createMemoryStore, type BoardStore } from '../src/store'

const AT = '2024-01-01T00:00:00.000Z'

/** A JSON response the way the host routes build one. */
function json(body: unknown): Response {
  return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } })
}

/**
 * A fake host: a memory store plus a `fetch` that routes the two real
 * endpoints to it. Switches let a test drop the connection, lose the response
 * after the store already applied the ops, or hold a POST open.
 */
class FakeHost {
  readonly store: BoardStore
  readonly requests: Op[][] = []
  getCount = 0
  postCount = 0
  inFlight = 0
  maxInFlight = 0
  /** Fail this many upcoming POSTs before they reach the store. */
  failNext = 0
  /** Apply this many upcoming POSTs to the store and then lose the response. */
  loseNext = 0
  /** Runs just before the store applies a POST. */
  beforeOps: ((ops: Op[]) => void) | null = null
  private gate: Promise<void> | null = null
  private releaseGate: (() => void) | null = null

  constructor(initial: Board = emptyBoard()) {
    this.store = createMemoryStore(initial)
  }

  /** Make the next POST wait until {@link release}. */
  hold(): void {
    this.gate = new Promise<void>((resolve) => {
      this.releaseGate = resolve
    })
  }

  /** Let a held POST continue. */
  release(): void {
    const release = this.releaseGate
    this.releaseGate = null
    this.gate = null
    release?.()
  }

  readonly fetch: FetchLike = async (input, init) => {
    if (input === BOARD_ENDPOINT) {
      this.getCount += 1
      return json({ ok: true, value: this.store.read() })
    }
    if (input !== OPS_ENDPOINT) throw new Error(`unexpected endpoint ${input}`)

    this.inFlight += 1
    this.maxInFlight = Math.max(this.maxInFlight, this.inFlight)
    this.postCount += 1
    const ops = (JSON.parse(String(init?.body ?? '{}')) as { ops: Op[] }).ops
    this.requests.push(ops)
    try {
      if (this.gate) await this.gate
      if (this.failNext > 0) {
        this.failNext -= 1
        throw new Error('network down')
      }
      // The real route rejects an oversized batch with `{ ok: false }`.
      if (ops.length > MAX_OPS_PER_REQUEST) {
        return json({ ok: false, error: `一次最多 ${MAX_OPS_PER_REQUEST} 个操作` })
      }
      this.beforeOps?.(ops)
      const result = this.store.apply(ops)
      if (this.loseNext > 0) {
        this.loseNext -= 1
        throw new Error('response lost')
      }
      return json({ ok: true, value: result.board, refused: result.refused })
    } finally {
      this.inFlight -= 1
    }
  }
}

function taskIds(board: Board): string[] {
  return board.projects[0]?.tasks.map((task) => task.id) ?? []
}

function tasks(board: Board) {
  return board.projects[0]?.tasks ?? []
}

describe('load', () => {
  it('fetches the host board and marks the view saved', async () => {
    const host = new FakeHost()
    host.store.apply([
      { type: 'project.add', id: 'p1', name: 'Alpha' },
      { type: 'task.add', projectId: 'p1', id: 't1', title: 'One' },
    ])
    const sync = new BoardSync({ fetch: host.fetch })
    expect(sync.getSnapshot().status).toBe('loading')
    expect(sync.busy).toBe(false)

    await sync.load()

    expect(host.getCount).toBe(1)
    expect(sync.getSnapshot().status).toBe('saved')
    expect(sync.getSnapshot().board).toEqual(host.store.read())
    expect(taskIds(sync.getSnapshot().board)).toEqual(['t1'])
  })

  it('reports load-failed with the error when the first load cannot reach the host', async () => {
    const sync = new BoardSync({
      fetch: async () => {
        throw new Error('host unreachable')
      },
      retryDelays: [10, 10],
    })
    await sync.load()
    expect(sync.getSnapshot().status).toBe('load-failed')
    expect(sync.getSnapshot().error).toContain('host unreachable')
    expect(sync.getSnapshot().board).toEqual(emptyBoard())
  })
})

describe('dispatch', () => {
  it('shows the change at once and converges to the host board', async () => {
    const host = new FakeHost()
    host.store.apply([{ type: 'project.add', id: 'p1', name: 'Alpha' }])
    const sync = new BoardSync({ fetch: host.fetch })
    await sync.load()

    host.hold()
    expect(sync.dispatch({ type: 'task.add', projectId: 'p1', id: 't1', title: 'One', at: AT })).toBe(true)

    const optimistic = sync.getSnapshot()
    expect(optimistic.status).toBe('saving')
    expect(sync.busy).toBe(true)
    expect(taskIds(optimistic.board)).toEqual(['t1'])
    // The host has not seen the op yet: this is the optimistic copy.
    expect(tasks(host.store.read())).toEqual([])
    expect(host.postCount).toBe(1)

    host.release()
    await vi.waitFor(() => expect(sync.getSnapshot().status).toBe('saved'))
    expect(sync.getSnapshot().board).toEqual(host.store.read())
    expect(taskIds(host.store.read())).toEqual(['t1'])
    expect(sync.busy).toBe(false)
  })

  it('batches 30 rapid dispatches behind at most one in-flight request', async () => {
    const host = new FakeHost()
    host.store.apply([{ type: 'project.add', id: 'p1', name: 'Alpha' }])
    const sync = new BoardSync({ fetch: host.fetch })
    await sync.load()

    host.hold()
    const ids = Array.from({ length: 15 }, (_, index) => `t${index}`)
    for (const id of ids) {
      expect(sync.dispatch({ type: 'task.add', projectId: 'p1', id, title: `Task ${id}`, at: AT })).toBe(true)
    }
    for (const id of ids) {
      expect(sync.dispatch({ type: 'task.advance', projectId: 'p1', taskId: id, from: 'todo', at: AT })).toBe(true)
    }
    // Only the very first op made it onto the wire; the other 29 wait in the queue.
    expect(host.postCount).toBe(1)
    expect(sync.getSnapshot().status).toBe('saving')

    host.release()
    await vi.waitFor(() => expect(sync.getSnapshot().status).toBe('saved'))

    expect(host.maxInFlight).toBe(1)
    expect(host.postCount).toBe(2)
    expect(host.requests[0]).toHaveLength(1)
    expect(host.requests[1]).toHaveLength(29)

    const stored = tasks(host.store.read())
    expect(stored).toHaveLength(15)
    expect(new Set(stored.map((task) => task.id)).size).toBe(15)
    expect(stored.every((task) => task.column === 'doing')).toBe(true)
    expect(sync.getSnapshot().board).toEqual(host.store.read())
  })

  it('returns false and reports the reason when an op does not fit the view', async () => {
    const host = new FakeHost()
    host.store.apply([{ type: 'project.add', id: 'p1', name: 'Alpha' }])
    const refused: string[] = []
    const sync = new BoardSync({ fetch: host.fetch, onRefused: (reason) => refused.push(reason) })
    await sync.load()
    const postsBefore = host.postCount

    expect(sync.dispatch({ type: 'task.advance', projectId: 'p1', taskId: 'missing', from: 'todo', at: AT })).toBe(false)
    expect(sync.dispatch({ type: 'project.add', id: 'p1', name: 'Duplicate', at: AT })).toBe(false)

    expect(refused).toEqual(['任务不存在', '项目已存在'])
    expect(host.postCount).toBe(postsBefore)
    expect(sync.busy).toBe(false)
    expect(sync.getSnapshot().status).toBe('saved')
  })
})

describe('offline handling', () => {
  it('keeps ops queued while offline and lands them exactly once after recovery', async () => {
    const host = new FakeHost()
    host.store.apply([{ type: 'project.add', id: 'p1', name: 'Alpha' }])
    const refused: string[] = []
    const sync = new BoardSync({
      fetch: host.fetch,
      retryDelays: [10, 10],
      onRefused: (reason) => refused.push(reason),
    })
    const statuses: SyncStatus[] = []
    let offline: SyncSnapshot | undefined
    sync.subscribe(() => {
      const snapshot = sync.getSnapshot()
      statuses.push(snapshot.status)
      if (snapshot.status === 'offline') offline = snapshot
    })
    await sync.load()

    host.failNext = 2
    expect(sync.dispatch({ type: 'task.add', projectId: 'p1', id: 't1', title: 'One', at: AT })).toBe(true)
    expect(sync.dispatch({ type: 'task.advance', projectId: 'p1', taskId: 't1', from: 'todo', at: AT })).toBe(true)

    await vi.waitFor(() => expect(sync.getSnapshot().status).toBe('saved'))

    expect(statuses).toContain('offline')
    expect(statuses).toContain('saving')
    // While offline the view still shows the optimistic board, ops stay queued.
    expect(taskIds(offline?.board ?? emptyBoard())).toEqual(['t1'])
    expect(tasks(offline?.board ?? emptyBoard())[0]?.column).toBe('doing')
    expect(host.postCount).toBe(3)

    const stored = tasks(host.store.read())
    expect(stored).toHaveLength(1)
    expect(stored[0]?.id).toBe('t1')
    expect(stored[0]?.column).toBe('doing')
    expect(refused).toEqual([])
    expect(sync.getSnapshot().board).toEqual(host.store.read())
  })

  it('does not duplicate tasks or skip columns when a response is lost', async () => {
    const host = new FakeHost()
    host.store.apply([{ type: 'project.add', id: 'p1', name: 'Alpha' }])
    const refused: string[] = []
    const sync = new BoardSync({
      fetch: host.fetch,
      retryDelays: [10, 10],
      onRefused: (reason) => refused.push(reason),
    })
    await sync.load()

    host.loseNext = 1
    expect(sync.dispatch({ type: 'task.add', projectId: 'p1', id: 't1', title: 'One', at: AT })).toBe(true)
    expect(sync.dispatch({ type: 'task.advance', projectId: 'p1', taskId: 't1', from: 'todo', at: AT })).toBe(true)

    await vi.waitFor(() => expect(sync.getSnapshot().status).toBe('saved'))

    const stored = tasks(host.store.read())
    expect(stored).toHaveLength(1)
    expect(stored[0]?.id).toBe('t1')
    // The retried advance must not have skipped review: the task stays in doing.
    expect(stored[0]?.column).toBe('doing')
    expect(host.postCount).toBe(2)
    // The lost batch carried the add; the retry carries the same add (now a
    // duplicate) plus the advance that was queued behind it.
    expect(host.requests[0]?.map((op) => op.type)).toEqual(['task.add'])
    expect(host.requests[1]?.map((op) => op.type)).toEqual(['task.add', 'task.advance'])
    // Repeat refusals ("already exists" / "already moved") are not shown to the user.
    expect(refused).toEqual([])
    expect(sync.getSnapshot().board).toEqual(host.store.read())
  })

  it('surfaces a host refusal with the host reason', async () => {
    const host = new FakeHost()
    host.store.apply([{ type: 'project.add', id: 'p1', name: 'Alpha' }])
    const refused: string[] = []
    const sync = new BoardSync({ fetch: host.fetch, onRefused: (reason) => refused.push(reason) })
    await sync.load()

    // Another window deletes the project on the host between load and save.
    host.store.apply([{ type: 'project.delete', projectId: 'p1' }])
    expect(sync.dispatch({ type: 'task.add', projectId: 'p1', id: 't1', title: 'One', at: AT })).toBe(true)

    await vi.waitFor(() => expect(sync.getSnapshot().status).toBe('saved'))
    expect(refused).toEqual(['项目不存在'])
    expect(host.postCount).toBe(1)
    expect(sync.getSnapshot().board.projects).toEqual([])
    expect(sync.getSnapshot().board).toEqual(host.store.read())
  })
})

describe('load while changes are queued', () => {
  it('skips load() so a refresh cannot roll back a click', async () => {
    const host = new FakeHost()
    host.store.apply([{ type: 'project.add', id: 'p1', name: 'Alpha' }])
    const sync = new BoardSync({ fetch: host.fetch, retryDelays: [10, 10] })
    await sync.load()

    host.hold()
    expect(sync.dispatch({ type: 'task.add', projectId: 'p1', id: 't1', title: 'One', at: AT })).toBe(true)
    const before = sync.getSnapshot()
    const getsBefore = host.getCount

    await sync.load()

    // No GET was issued and nothing was published, so the optimistic card survives.
    expect(host.getCount).toBe(getsBefore)
    expect(sync.getSnapshot()).toBe(before)
    expect(taskIds(sync.getSnapshot().board)).toEqual(['t1'])
    expect(tasks(host.store.read())).toEqual([])

    host.release()
    await vi.waitFor(() => expect(sync.getSnapshot().status).toBe('saved'))
    expect(taskIds(host.store.read())).toEqual(['t1'])
  })
})

describe('known bug (repro, skipped)', () => {
  /**
   * BUG: the host rejects a batch of more than MAX_OPS_PER_REQUEST (200) ops
   * with `{ ok: false }` (src/routes.ts:55), but `flush()` posts the whole
   * queue as one request and, when the request is refused, drops the entire
   * in-flight batch (src/client/sync.ts:146-156). A queue longer than 200 ops
   * is therefore lost, with only an error toast.
   *
   * Repro: load a board with one project, fail one save so ops pile up behind
   * the retry timer, dispatch 201 `task.add` ops, then let the retry fire: the
   * store still has no tasks and every queued change is gone.
   *
   * Suggested fix: split `inflight` into chunks of at most
   * MAX_OPS_PER_REQUEST (and keep each JSON body under MAX_BODY_BYTES), then
   * send the chunks one after another instead of dropping the batch.
   */
  it('loses no ops when the queue grows past MAX_OPS_PER_REQUEST', async () => {
    const host = new FakeHost()
    host.store.apply([{ type: 'project.add', id: 'p1', name: 'Alpha' }])
    const sync = new BoardSync({ fetch: host.fetch, retryDelays: [10, 10] })
    await sync.load()

    host.failNext = 1
    for (let index = 0; index < MAX_OPS_PER_REQUEST + 1; index += 1) {
      expect(sync.dispatch({ type: 'task.add', projectId: 'p1', id: `t${index}`, title: `Task ${index}`, at: AT })).toBe(true)
    }

    await vi.waitFor(() => expect(sync.getSnapshot().status).toBe('saved'), { timeout: 2000 })
    expect(tasks(host.store.read())).toHaveLength(MAX_OPS_PER_REQUEST + 1)
    expect(sync.getSnapshot().board).toEqual(host.store.read())
  })
})
