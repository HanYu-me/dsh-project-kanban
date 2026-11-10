/**
 * The board model and every change to it, as pure functions shared by the
 * host (which stores the board) and the browser (which applies the same
 * operations optimistically before the host confirms them).
 *
 * Every change is an {@link Op}. Ids are created by the browser, so the
 * optimistic copy and the stored copy always agree on them. `applyOp` never
 * mutates its input and never throws: an op that does not fit the board
 * (unknown id, duplicate id, bad text) is refused with a reason and leaves
 * the board unchanged.
 * @module dsh-project-kanban/shared/board
 */

import { ID_PATTERN, cleanLine } from './text'
import { applyRecordOp, sanitizeRecords, EMPTY_RECORDS, type ProjectRecords, type RecordOp } from './records'

export { ID_PATTERN, cleanLine }

/** The four fixed columns, in board order. */
export const COLUMNS = ['todo', 'doing', 'review', 'done'] as const

/** One column id. */
export type ColumnId = (typeof COLUMNS)[number]

/** Column titles shown in the UI. */
export const COLUMN_LABELS: Record<ColumnId, string> = {
  todo: '待办',
  doing: '进行中',
  review: '待反馈',
  done: '已完成',
}

/** Project accent colours offered in the UI (ids, mapped to CSS in the client). */
export const PROJECT_COLORS = ['blue', 'violet', 'green', 'amber', 'rose', 'teal', 'slate'] as const

/** One accent colour id. */
export type ProjectColor = (typeof PROJECT_COLORS)[number]

/** Text limits, enforced on both sides. */
export const LIMITS = {
  projectName: 60,
  taskTitle: 200,
  taskNote: 2000,
  projects: 200,
  tasksPerProject: 2000,
} as const

/** One task card. */
export interface Task {
  id: string
  title: string
  /** Optional free-text details; empty string when absent. */
  note: string
  column: ColumnId
  createdAt: string
  updatedAt: string
  /** Set while the task sits in `done`; cleared when it leaves. */
  completedAt?: string
}

/** One project section. */
export interface Project {
  id: string
  name: string
  color: ProjectColor
  /** Whether the section is folded in the UI. */
  collapsed: boolean
  createdAt: string
  /**
   * All tasks of the project. Order inside one column is the order of the
   * tasks of that column in this array.
   */
  tasks: Task[]
  /**
   * The project's data and result trees and the links between them. Absent
   * until something is recorded; read it with {@link recordsOf}.
   */
  records?: ProjectRecords
}

/** The whole stored board. */
export interface Board {
  version: 1
  /** Bumped by the host on every stored change. */
  revision: number
  projects: Project[]
}

/** Every change the UI can make. */
export type Op =
  | { type: 'project.add'; id: string; name: string; color?: ProjectColor; at?: string }
  | { type: 'project.update'; projectId: string; name?: string; color?: ProjectColor; collapsed?: boolean }
  | { type: 'project.delete'; projectId: string }
  | { type: 'project.move'; projectId: string; toIndex: number }
  | { type: 'task.add'; projectId: string; id: string; title: string; note?: string; column?: ColumnId; at?: string }
  | { type: 'task.update'; projectId: string; taskId: string; title?: string; note?: string; at?: string }
  | { type: 'task.delete'; projectId: string; taskId: string }
  /**
   * Move a task one column to the right. `from` is the column the user saw
   * the task in: if it is somewhere else by now (a repeated or stale click),
   * the op is refused instead of skipping a column.
   */
  | { type: 'task.advance'; projectId: string; taskId: string; from: ColumnId; at?: string }
  /** Put a task in `to`, before `beforeTaskId` (or at the end when null/absent). */
  | { type: 'task.move'; projectId: string; taskId: string; to: ColumnId; beforeTaskId?: string | null; at?: string }
  /** Put a deleted task back (undo), at its old index when possible. */
  | { type: 'task.restore'; projectId: string; task: Task; index: number }
  /** Data / result trees and links of a project; see `shared/records.ts`. */
  | RecordOp

/** Result of applying one op. */
export type ApplyResult = { ok: true; board: Board } | { ok: false; board: Board; reason: string }

/** An empty board. */
export function emptyBoard(): Board {
  return { version: 1, revision: 0, projects: [] }
}

/**
 * The column after `column`, or undefined for the last one.
 * @param column - the current column.
 */
export function nextColumn(column: ColumnId): ColumnId | undefined {
  const index = COLUMNS.indexOf(column)
  return COLUMNS[index + 1]
}

/** Whether `value` is a column id. */
export function isColumn(value: unknown): value is ColumnId {
  return typeof value === 'string' && (COLUMNS as readonly string[]).includes(value)
}

/** Whether `value` is a colour id. */
export function isColor(value: unknown): value is ProjectColor {
  return typeof value === 'string' && (PROJECT_COLORS as readonly string[]).includes(value)
}

/**
 * Normalise a multi-line note; undefined when not a string or too long.
 * @param value - untrusted input.
 */
export function cleanNote(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const text = value.replace(/\r\n?/g, '\n').trim()
  return text.length > LIMITS.taskNote ? undefined : text
}

/** Tasks of one column, in display order. */
export function tasksIn(project: Project, column: ColumnId): Task[] {
  return project.tasks.filter((task) => task.column === column)
}

/** The data and result records of a project (empty when nothing is recorded). */
export function recordsOf(project: Project): ProjectRecords {
  return project.records ?? EMPTY_RECORDS
}

/** Count tasks per column. */
export function columnCounts(project: Project): Record<ColumnId, number> {
  const counts: Record<ColumnId, number> = { todo: 0, doing: 0, review: 0, done: 0 }
  for (const task of project.tasks) counts[task.column] += 1
  return counts
}

const refuse = (board: Board, reason: string): ApplyResult => ({ ok: false, board, reason })

function timeOf(op: { at?: string }): string {
  return typeof op.at === 'string' && !Number.isNaN(Date.parse(op.at)) ? op.at : new Date().toISOString()
}

function withProject(board: Board, projectId: string, change: (project: Project) => Project): Board {
  return { ...board, projects: board.projects.map((project) => (project.id === projectId ? change(project) : project)) }
}

/**
 * Place `task` into `tasks` (which must not contain it) so that it is the
 * task right before `beforeId` among its column, or the last of its column.
 */
function placeTask(tasks: Task[], task: Task, beforeId: string | null | undefined): Task[] {
  const out = tasks.slice()
  if (beforeId) {
    const index = out.findIndex((item) => item.id === beforeId && item.column === task.column)
    if (index >= 0) {
      out.splice(index, 0, task)
      return out
    }
  }
  // After the last task of the same column, else at the end.
  let last = -1
  out.forEach((item, index) => {
    if (item.column === task.column) last = index
  })
  out.splice(last >= 0 ? last + 1 : out.length, 0, task)
  return out
}

/** Re-column a task, keeping completedAt in step with the done column. */
function recolumn(task: Task, to: ColumnId, at: string): Task {
  const next: Task = { ...task, column: to, updatedAt: at }
  if (to === 'done') next.completedAt = task.column === 'done' && task.completedAt ? task.completedAt : at
  else delete next.completedAt
  return next
}

/**
 * Apply one op. Never mutates `board`; never throws.
 * @param board - the current board.
 * @param op - untrusted op (validated here).
 */
export function applyOp(board: Board, op: Op): ApplyResult {
  if (op === null || typeof op !== 'object') return refuse(board, '无效操作')
  const findProject = (id: unknown): Project | undefined => board.projects.find((project) => project.id === id)
  switch (op.type) {
    case 'project.add': {
      if (typeof op.id !== 'string' || !ID_PATTERN.test(op.id)) return refuse(board, '项目 id 无效')
      if (findProject(op.id)) return refuse(board, '项目已存在')
      if (board.projects.length >= LIMITS.projects) return refuse(board, `项目数量已达上限（${LIMITS.projects}）`)
      const name = cleanLine(op.name, LIMITS.projectName)
      if (name === undefined) return refuse(board, `项目名称需为 1–${LIMITS.projectName} 个字符`)
      if (op.color !== undefined && !isColor(op.color)) return refuse(board, '颜色无效')
      const color = op.color ?? PROJECT_COLORS[board.projects.length % PROJECT_COLORS.length]!
      const project: Project = { id: op.id, name, color, collapsed: false, createdAt: timeOf(op), tasks: [] }
      return { ok: true, board: { ...board, projects: [...board.projects, project] } }
    }
    case 'project.update': {
      const project = findProject(op.projectId)
      if (!project) return refuse(board, '项目不存在')
      const patch: Partial<Project> = {}
      if (op.name !== undefined) {
        const name = cleanLine(op.name, LIMITS.projectName)
        if (name === undefined) return refuse(board, `项目名称需为 1–${LIMITS.projectName} 个字符`)
        patch.name = name
      }
      if (op.color !== undefined) {
        if (!isColor(op.color)) return refuse(board, '颜色无效')
        patch.color = op.color
      }
      if (op.collapsed !== undefined) {
        if (typeof op.collapsed !== 'boolean') return refuse(board, '无效操作')
        patch.collapsed = op.collapsed
      }
      return { ok: true, board: withProject(board, project.id, (p) => ({ ...p, ...patch })) }
    }
    case 'project.delete': {
      if (!findProject(op.projectId)) return refuse(board, '项目不存在')
      return { ok: true, board: { ...board, projects: board.projects.filter((p) => p.id !== op.projectId) } }
    }
    case 'project.move': {
      const from = board.projects.findIndex((p) => p.id === op.projectId)
      if (from < 0) return refuse(board, '项目不存在')
      if (typeof op.toIndex !== 'number' || !Number.isInteger(op.toIndex)) return refuse(board, '无效操作')
      const to = Math.max(0, Math.min(board.projects.length - 1, op.toIndex))
      const projects = board.projects.slice()
      const [moved] = projects.splice(from, 1)
      projects.splice(to, 0, moved!)
      return { ok: true, board: { ...board, projects } }
    }
    case 'task.add': {
      const project = findProject(op.projectId)
      if (!project) return refuse(board, '项目不存在')
      if (typeof op.id !== 'string' || !ID_PATTERN.test(op.id)) return refuse(board, '任务 id 无效')
      if (project.tasks.some((task) => task.id === op.id)) return refuse(board, '任务已存在')
      if (project.tasks.length >= LIMITS.tasksPerProject) return refuse(board, `任务数量已达上限（${LIMITS.tasksPerProject}）`)
      const title = cleanLine(op.title, LIMITS.taskTitle)
      if (title === undefined) return refuse(board, `任务标题需为 1–${LIMITS.taskTitle} 个字符`)
      const note = op.note === undefined ? '' : cleanNote(op.note)
      if (note === undefined) return refuse(board, `备注不能超过 ${LIMITS.taskNote} 个字符`)
      const column = op.column ?? 'todo'
      if (!isColumn(column)) return refuse(board, '列无效')
      const at = timeOf(op)
      const task: Task = { id: op.id, title, note, column, createdAt: at, updatedAt: at }
      if (column === 'done') task.completedAt = at
      return { ok: true, board: withProject(board, project.id, (p) => ({ ...p, tasks: placeTask(p.tasks, task, null) })) }
    }
    case 'task.update': {
      const project = findProject(op.projectId)
      const task = project?.tasks.find((t) => t.id === op.taskId)
      if (!project || !task) return refuse(board, '任务不存在')
      const patch: Partial<Task> = {}
      if (op.title !== undefined) {
        const title = cleanLine(op.title, LIMITS.taskTitle)
        if (title === undefined) return refuse(board, `任务标题需为 1–${LIMITS.taskTitle} 个字符`)
        patch.title = title
      }
      if (op.note !== undefined) {
        const note = cleanNote(op.note)
        if (note === undefined) return refuse(board, `备注不能超过 ${LIMITS.taskNote} 个字符`)
        patch.note = note
      }
      patch.updatedAt = timeOf(op)
      return {
        ok: true,
        board: withProject(board, project.id, (p) => ({ ...p, tasks: p.tasks.map((t) => (t.id === task.id ? { ...t, ...patch } : t)) })),
      }
    }
    case 'task.delete': {
      const project = findProject(op.projectId)
      if (!project || !project.tasks.some((t) => t.id === op.taskId)) return refuse(board, '任务不存在')
      return { ok: true, board: withProject(board, project.id, (p) => ({ ...p, tasks: p.tasks.filter((t) => t.id !== op.taskId) })) }
    }
    case 'task.advance': {
      const project = findProject(op.projectId)
      const task = project?.tasks.find((t) => t.id === op.taskId)
      if (!project || !task) return refuse(board, '任务不存在')
      if (!isColumn(op.from)) return refuse(board, '列无效')
      if (task.column !== op.from) return refuse(board, '任务已被移动，请刷新后再试')
      const to = nextColumn(task.column)
      if (to === undefined) return refuse(board, '任务已在“已完成”列')
      const moved = recolumn(task, to, timeOf(op))
      // An advanced task goes to the top of its new column, where the user sees it land.
      const rest = project.tasks.filter((t) => t.id !== task.id)
      const firstInTarget = rest.find((t) => t.column === to)
      return { ok: true, board: withProject(board, project.id, (p) => ({ ...p, tasks: placeTask(rest, moved, firstInTarget?.id ?? null) })) }
    }
    case 'task.move': {
      const project = findProject(op.projectId)
      const task = project?.tasks.find((t) => t.id === op.taskId)
      if (!project || !task) return refuse(board, '任务不存在')
      if (!isColumn(op.to)) return refuse(board, '列无效')
      if (op.beforeTaskId === task.id) return { ok: true, board }
      const moved = op.to === task.column ? task : recolumn(task, op.to, timeOf(op))
      const rest = project.tasks.filter((t) => t.id !== task.id)
      return { ok: true, board: withProject(board, project.id, (p) => ({ ...p, tasks: placeTask(rest, moved, op.beforeTaskId ?? null) })) }
    }
    case 'task.restore': {
      const project = findProject(op.projectId)
      if (!project) return refuse(board, '项目不存在')
      const task = sanitizeTask(op.task)
      if (!task) return refuse(board, '任务数据无效')
      if (project.tasks.some((t) => t.id === task.id)) return refuse(board, '任务已存在')
      const index = typeof op.index === 'number' && Number.isInteger(op.index) ? Math.max(0, Math.min(project.tasks.length, op.index)) : project.tasks.length
      return {
        ok: true,
        board: withProject(board, project.id, (p) => {
          const tasks = p.tasks.slice()
          tasks.splice(index, 0, task)
          return { ...p, tasks }
        }),
      }
    }
    case 'node.add':
    case 'node.update':
    case 'node.move':
    case 'node.delete':
    case 'node.restore':
    case 'link.add':
    case 'link.update':
    case 'link.delete':
    case 'relation.add':
    case 'relation.update':
    case 'relation.delete':
    case 'category.add':
    case 'category.update':
    case 'category.delete':
    case 'palette.update': {
      const project = findProject(op.projectId)
      if (!project) return refuse(board, '项目不存在')
      const before = recordsOf(project)
      const result = applyRecordOp(before, op, timeOf(op as { at?: string }))
      if (!result.ok) return refuse(board, result.reason)
      // Nothing changed: hand back the very same board so no revision is spent.
      if (result.records === before) return { ok: true, board }
      return { ok: true, board: withProject(board, project.id, (p) => ({ ...p, records: result.records })) }
    }
    default:
      return refuse(board, '未知操作')
  }
}

/**
 * Apply ops in order, skipping refused ones.
 * @returns the final board and the reasons of refused ops (by index).
 */
export function applyOps(board: Board, ops: readonly Op[]): { board: Board; refused: { index: number; reason: string }[] } {
  let current = board
  const refused: { index: number; reason: string }[] = []
  ops.forEach((op, index) => {
    const result = applyOp(current, op)
    if (result.ok) current = result.board
    else refused.push({ index, reason: result.reason })
  })
  return { board: current, refused }
}

/** Narrow untrusted data to a task, or undefined. */
export function sanitizeTask(value: unknown): Task | undefined {
  const raw = value as Partial<Task> | null
  if (raw === null || typeof raw !== 'object') return undefined
  if (typeof raw.id !== 'string' || !ID_PATTERN.test(raw.id)) return undefined
  const title = cleanLine(raw.title, LIMITS.taskTitle)
  const note = raw.note === undefined ? '' : cleanNote(raw.note)
  if (title === undefined || note === undefined || !isColumn(raw.column)) return undefined
  const now = new Date().toISOString()
  const createdAt = typeof raw.createdAt === 'string' ? raw.createdAt : now
  const task: Task = { id: raw.id, title, note, column: raw.column, createdAt, updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : createdAt }
  if (raw.column === 'done') task.completedAt = typeof raw.completedAt === 'string' ? raw.completedAt : task.updatedAt
  return task
}

/**
 * Narrow an untrusted stored file to a board, dropping malformed or
 * duplicate entries instead of failing the whole board.
 */
export function sanitizeBoard(value: unknown): Board {
  const raw = value as { revision?: unknown; projects?: unknown } | null
  const board = emptyBoard()
  if (raw === null || typeof raw !== 'object') return board
  if (typeof raw.revision === 'number' && Number.isInteger(raw.revision) && raw.revision >= 0) board.revision = raw.revision
  if (!Array.isArray(raw.projects)) return board
  const seen = new Set<string>()
  for (const item of raw.projects) {
    const p = item as Partial<Project> | null
    if (p === null || typeof p !== 'object' || typeof p.id !== 'string' || !ID_PATTERN.test(p.id) || seen.has(p.id)) continue
    const name = cleanLine(p.name, LIMITS.projectName)
    if (name === undefined) continue
    seen.add(p.id)
    const taskIds = new Set<string>()
    const tasks: Task[] = []
    for (const t of Array.isArray(p.tasks) ? p.tasks : []) {
      const task = sanitizeTask(t)
      if (task && !taskIds.has(task.id)) {
        taskIds.add(task.id)
        tasks.push(task)
      }
    }
    const records = sanitizeRecords(p.records)
    board.projects.push({
      id: p.id,
      name,
      color: isColor(p.color) ? p.color : 'blue',
      collapsed: p.collapsed === true,
      createdAt: typeof p.createdAt === 'string' ? p.createdAt : new Date().toISOString(),
      tasks,
      ...(records ? { records } : {}),
    })
  }
  return board
}

/** A fresh random id (browser and Node both have crypto.getRandomValues). */
export function newId(prefix: 'p' | 't' | 'n' | 'l' | 'c'): string {
  const bytes = new Uint8Array(8)
  globalThis.crypto.getRandomValues(bytes)
  let text = ''
  for (const byte of bytes) text += byte.toString(36).padStart(2, '0')
  return `${prefix}_${text.slice(0, 12)}`
}
