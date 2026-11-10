/**
 * The undo history of one project's records page: steps with the ops that
 * did them and the ops that undo them. Kept per project outside React, so
 * leaving the page and coming back (the view unmounts in between) does not
 * lose it. It is not saved: a reload starts empty.
 * @module dsh-project-kanban/client/recordsHistory
 */
import type { RecordOp } from '../shared/records'

/** One thing the user did, as one undo step. */
export interface Step {
  id: number
  /** What it was, for the button's tooltip: "删除「原始计数」". */
  label: string
  /** The ops that did it (run again to redo it). */
  forward: RecordOp[]
  /** The ops that undo it, in the order to run them. */
  inverse: RecordOp[]
}

/** The undo and redo stacks of one project. */
export class RecordHistory {
  private undoStack: Step[] = []
  private redoStack: Step[] = []
  private readonly listeners = new Set<() => void>()
  private seq = 0
  /** Changes whenever a stack does, for `useSyncExternalStore`. */
  version = 0

  constructor(private readonly limit = 100) {}

  /** Remember a step. Doing something new makes the undone steps unreachable. */
  record(label: string, forward: RecordOp[], inverse: RecordOp[]): Step {
    this.seq += 1
    const step: Step = { id: this.seq, label, forward, inverse }
    this.undoStack.push(step)
    if (this.undoStack.length > this.limit) this.undoStack.shift()
    this.redoStack = []
    this.emit()
    return step
  }

  get canUndo(): boolean {
    return this.undoStack.length > 0
  }

  get canRedo(): boolean {
    return this.redoStack.length > 0
  }

  /** What the next undo would take back. */
  get undoLabel(): string | undefined {
    return this.undoStack.at(-1)?.label
  }

  /** What the next redo would do again. */
  get redoLabel(): string | undefined {
    return this.redoStack.at(-1)?.label
  }

  /** Whether `step` is the one an undo would take back now. */
  isLatest(step: Step): boolean {
    return this.undoStack.at(-1) === step
  }

  /** Take the latest step off the undo stack and onto the redo stack. */
  takeUndo(): Step | undefined {
    const step = this.undoStack.pop()
    if (!step) return undefined
    this.redoStack.push(step)
    this.emit()
    return step
  }

  /** Take the latest undone step off the redo stack and back onto the undo stack. */
  takeRedo(): Step | undefined {
    const step = this.redoStack.pop()
    if (!step) return undefined
    this.undoStack.push(step)
    this.emit()
    return step
  }

  clear(): void {
    this.undoStack = []
    this.redoStack = []
    this.emit()
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  getVersion = (): number => this.version

  private emit(): void {
    this.version += 1
    for (const listener of this.listeners) listener()
  }
}

const histories = new Map<string, RecordHistory>()

/** The history of one project's records. */
export function historyOf(projectId: string): RecordHistory {
  let history = histories.get(projectId)
  if (!history) {
    history = new RecordHistory()
    histories.set(projectId, history)
  }
  return history
}

/** Forget every project's history (for tests: the histories live outside React). */
export function forgetAllHistories(): void {
  histories.clear()
}
