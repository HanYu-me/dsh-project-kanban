/**
 * Independent test suite for the pure board model in src/shared/board.ts.
 *
 * The model is shared by the host (which stores the board) and the browser
 * (which applies the same ops optimistically), so the suite treats it as a
 * black box: every change goes through `applyOp` / `applyOps`, and the board
 * is inspected as plain data. Timestamps are always passed explicitly so no
 * assertion depends on the wall clock.
 */
import { describe, expect, it } from 'vitest'
import {
  COLUMNS,
  ID_PATTERN,
  LIMITS,
  PROJECT_COLORS,
  applyOp,
  applyOps,
  cleanLine,
  cleanNote,
  columnCounts,
  emptyBoard,
  isColor,
  isColumn,
  newId,
  nextColumn,
  sanitizeBoard,
  sanitizeTask,
  tasksIn,
} from '../src/shared/board'
import type { Board, ColumnId, Op, Project, ProjectColor, Task } from '../src/shared/board'

const AT = '2024-01-01T00:00:00.000Z'
const LATER = '2024-01-02T03:04:05.000Z'

/** A deterministic ISO timestamp for stress/sequence tests. */
function isoAt(seconds: number): string {
  return new Date(Date.UTC(2024, 0, 1, 0, 0, seconds)).toISOString()
}

/** Apply an op that must be accepted. */
function mustApply(board: Board, op: Op): Board {
  const result = applyOp(board, op)
  if (!result.ok) throw new Error(`expected op to apply, refused with: ${result.reason}`)
  return result.board
}

/** Apply an op that must be refused, asserting the board came back untouched. */
function mustRefuse(board: Board, op: Op): string {
  const result = applyOp(board, op)
  if (result.ok) throw new Error(`expected op to be refused: ${JSON.stringify(op)}`)
  expect(result.board).toBe(board)
  expect(result.reason.length).toBeGreaterThan(0)
  return result.reason
}

function projectOf(board: Board, projectId = 'p1'): Project {
  const project = board.projects.find((item) => item.id === projectId)
  if (!project) throw new Error(`missing project ${projectId}`)
  return project
}

function taskOf(board: Board, taskId: string, projectId = 'p1'): Task {
  const task = projectOf(board, projectId).tasks.find((item) => item.id === taskId)
  if (!task) throw new Error(`missing task ${taskId}`)
  return task
}

function taskIds(board: Board, projectId = 'p1'): string[] {
  return projectOf(board, projectId).tasks.map((task) => task.id)
}

function columnIds(board: Board, column: ColumnId, projectId = 'p1'): string[] {
  return tasksIn(projectOf(board, projectId), column).map((task) => task.id)
}

/** One project with a fixed colour, used as the fixture for most tests. */
function baseBoard(): Board {
  return mustApply(emptyBoard(), { type: 'project.add', id: 'p1', name: 'Alpha', color: 'green', at: AT })
}

function addTask(board: Board, id: string, column: ColumnId = 'todo', at = AT): Board {
  return mustApply(board, { type: 'task.add', projectId: 'p1', id, title: `Task ${id}`, column, at })
}

/** Freeze an object graph so any in-place mutation would throw in strict mode. */
function deepFreeze(value: unknown): void {
  if (value === null || typeof value !== 'object') return
  for (const key of Object.keys(value)) deepFreeze((value as Record<string, unknown>)[key])
  Object.freeze(value)
}

/** A plain-data copy, for before/after comparisons. */
function snapshot(value: unknown): unknown {
  return JSON.parse(JSON.stringify(value)) as unknown
}

function pick<T>(random: () => number, items: readonly T[]): T | undefined {
  if (items.length === 0) return undefined
  return items[Math.floor(random() * items.length)]
}

/** Small seeded PRNG (mulberry32) so the stress test is reproducible. */
function mulberry32(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

describe('project.add', () => {
  it('adds a project with defaults', () => {
    const board = mustApply(emptyBoard(), { type: 'project.add', id: 'p1', name: 'Alpha', at: AT })
    expect(board.version).toBe(1)
    expect(board.revision).toBe(0)
    expect(board.projects).toHaveLength(1)
    expect(projectOf(board)).toEqual({
      id: 'p1',
      name: 'Alpha',
      color: 'blue',
      collapsed: false,
      createdAt: AT,
      tasks: [],
    })
  })

  it('rotates the default colour by current project count', () => {
    let board = emptyBoard()
    for (let index = 0; index < 8; index += 1) {
      board = mustApply(board, { type: 'project.add', id: `p${index}`, name: `Project ${index}`, at: AT })
    }
    const colors = board.projects.map((project) => project.color)
    expect(colors).toEqual([...PROJECT_COLORS, PROJECT_COLORS[0]])
    expect(colors).toHaveLength(8)
  })

  it('honours an explicit colour', () => {
    const board = mustApply(emptyBoard(), { type: 'project.add', id: 'p1', name: 'Alpha', color: 'rose', at: AT })
    expect(projectOf(board).color).toBe('rose')
  })

  it('refuses a duplicate id', () => {
    const board = baseBoard()
    const reason = mustRefuse(board, { type: 'project.add', id: 'p1', name: 'Other', at: AT })
    expect(reason).toContain('已存在')
    expect(board.projects).toHaveLength(1)
  })

  it('refuses malformed ids', () => {
    const board = emptyBoard()
    const badIds: unknown[] = ['', 'has space', 'p1!', 'a'.repeat(41), 42, null, undefined]
    for (const id of badIds) {
      const op = { type: 'project.add', id, name: 'Alpha', at: AT } as unknown as Op
      expect(mustRefuse(board, op)).toContain('id')
    }
    const longest = mustApply(board, { type: 'project.add', id: 'a'.repeat(40), name: 'Alpha', at: AT })
    expect(longest.projects).toHaveLength(1)
  })

  it('refuses empty and too-long names', () => {
    const board = emptyBoard()
    for (const name of ['', '   ', 'a'.repeat(LIMITS.projectName + 1)]) {
      const reason = mustRefuse(board, { type: 'project.add', id: 'p1', name, at: AT })
      expect(reason).toContain(String(LIMITS.projectName))
    }
    const longest = mustApply(board, {
      type: 'project.add',
      id: 'p1',
      name: 'a'.repeat(LIMITS.projectName),
      at: AT,
    })
    expect(projectOf(longest).name).toHaveLength(LIMITS.projectName)
  })

  it('collapses whitespace in names', () => {
    const board = mustApply(emptyBoard(), { type: 'project.add', id: 'p1', name: '  Alpha\t\n  Beta  ', at: AT })
    expect(projectOf(board).name).toBe('Alpha Beta')
  })

  it('refuses an unknown colour', () => {
    const op = { type: 'project.add', id: 'p1', name: 'Alpha', color: 'chartreuse', at: AT } as unknown as Op
    expect(mustRefuse(emptyBoard(), op)).toContain('颜色')
  })
})

describe('project.update', () => {
  it('renames, recolours and collapses without touching the rest', () => {
    let board = baseBoard()
    board = addTask(board, 't1')
    const updated = mustApply(board, {
      type: 'project.update',
      projectId: 'p1',
      name: '  Renamed\tBoard ',
      color: 'violet',
      collapsed: true,
    })
    const project = projectOf(updated)
    expect(project.name).toBe('Renamed Board')
    expect(project.color).toBe('violet')
    expect(project.collapsed).toBe(true)
    expect(project.createdAt).toBe(AT)
    expect(project.tasks.map((task) => task.id)).toEqual(['t1'])
    // the input board is untouched
    expect(projectOf(board).name).toBe('Alpha')
    expect(projectOf(board).color).toBe('green')
  })

  it('applies a partial update', () => {
    const updated = mustApply(baseBoard(), { type: 'project.update', projectId: 'p1', collapsed: true })
    expect(projectOf(updated).name).toBe('Alpha')
    expect(projectOf(updated).color).toBe('green')
    expect(projectOf(updated).collapsed).toBe(true)
  })

  it('refuses invalid values', () => {
    const board = baseBoard()
    expect(mustRefuse(board, { type: 'project.update', projectId: 'p1', name: '   ' })).toContain('名称')
    expect(mustRefuse(board, { type: 'project.update', projectId: 'p1', name: 'a'.repeat(61) })).toContain('名称')
    expect(
      mustRefuse(board, { type: 'project.update', projectId: 'p1', color: 'pink' as unknown as ProjectColor }),
    ).toContain('颜色')
    expect(
      mustRefuse(board, { type: 'project.update', projectId: 'p1', collapsed: 'yes' as unknown as boolean }),
    ).toContain('无效')
    expect(mustRefuse(board, { type: 'project.update', projectId: 'nope', name: 'X' })).toContain('不存在')
  })
})

describe('project.delete', () => {
  it('removes only the requested project', () => {
    let board = baseBoard()
    board = mustApply(board, { type: 'project.add', id: 'p2', name: 'Beta', at: AT })
    board = addTask(board, 't1')
    const after = mustApply(board, { type: 'project.delete', projectId: 'p1' })
    expect(after.projects.map((project) => project.id)).toEqual(['p2'])
    expect(mustRefuse(after, { type: 'project.delete', projectId: 'p1' })).toContain('不存在')
  })
})

describe('project.move', () => {
  function threeProjects(): Board {
    let board = emptyBoard()
    board = mustApply(board, { type: 'project.add', id: 'a', name: 'A', at: AT })
    board = mustApply(board, { type: 'project.add', id: 'b', name: 'B', at: AT })
    board = mustApply(board, { type: 'project.add', id: 'c', name: 'C', at: AT })
    return board
  }

  it('moves a project to a new index', () => {
    const board = mustApply(threeProjects(), { type: 'project.move', projectId: 'a', toIndex: 2 })
    expect(board.projects.map((project) => project.id)).toEqual(['b', 'c', 'a'])
  })

  it('clamps the target index into range', () => {
    const high = mustApply(threeProjects(), { type: 'project.move', projectId: 'a', toIndex: 99 })
    expect(high.projects.map((project) => project.id)).toEqual(['b', 'c', 'a'])
    const low = mustApply(threeProjects(), { type: 'project.move', projectId: 'c', toIndex: -99 })
    expect(low.projects.map((project) => project.id)).toEqual(['c', 'a', 'b'])
  })

  it('refuses unknown projects and non-integer indexes', () => {
    const board = threeProjects()
    expect(mustRefuse(board, { type: 'project.move', projectId: 'zzz', toIndex: 0 })).toContain('不存在')
    expect(mustRefuse(board, { type: 'project.move', projectId: 'a', toIndex: 1.5 })).toContain('无效')
    expect(mustRefuse(board, { type: 'project.move', projectId: 'a', toIndex: Number.NaN })).toContain('无效')
    expect(
      mustRefuse(board, { type: 'project.move', projectId: 'a', toIndex: '1' as unknown as number }),
    ).toContain('无效')
  })
})

describe('task.add', () => {
  it('defaults to todo and appends at the end of its column', () => {
    let board = baseBoard()
    board = addTask(board, 'd1', 'doing')
    board = addTask(board, 't1')
    board = addTask(board, 't2')
    board = addTask(board, 't3')
    expect(taskIds(board)).toEqual(['d1', 't1', 't2', 't3'])
    expect(columnIds(board, 'todo')).toEqual(['t1', 't2', 't3'])
    expect(columnIds(board, 'doing')).toEqual(['d1'])
    expect(taskOf(board, 't1')).toEqual({
      id: 't1',
      title: 'Task t1',
      note: '',
      column: 'todo',
      createdAt: AT,
      updatedAt: AT,
    })
  })

  it('sets completedAt when added directly into done', () => {
    const board = addTask(baseBoard(), 'd1', 'done')
    const task = taskOf(board, 'd1')
    expect(task.column).toBe('done')
    expect(task.completedAt).toBe(AT)
    expect(task.createdAt).toBe(AT)
  })

  it('enforces the title limit', () => {
    let board = baseBoard()
    expect(
      mustRefuse(board, { type: 'task.add', projectId: 'p1', id: 't1', title: 'a'.repeat(LIMITS.taskTitle + 1), at: AT }),
    ).toContain('标题')
    expect(
      mustRefuse(board, { type: 'task.add', projectId: 'p1', id: 't1', title: '   ', at: AT }),
    ).toContain('标题')
    board = mustApply(board, {
      type: 'task.add',
      projectId: 'p1',
      id: 't1',
      title: 'a'.repeat(LIMITS.taskTitle),
      at: AT,
    })
    expect(taskOf(board, 't1').title).toHaveLength(LIMITS.taskTitle)
  })

  it('collapses whitespace in titles', () => {
    const board = mustApply(baseBoard(), {
      type: 'task.add',
      projectId: 'p1',
      id: 't1',
      title: '  Do   the\nthing ',
      at: AT,
    })
    expect(taskOf(board, 't1').title).toBe('Do the thing')
  })

  it('enforces the note limit and normalises line endings', () => {
    const board = baseBoard()
    expect(
      mustRefuse(board, {
        type: 'task.add',
        projectId: 'p1',
        id: 't1',
        title: 'x',
        note: 'a'.repeat(LIMITS.taskNote + 1),
        at: AT,
      }),
    ).toContain('备注')
    const longest = mustApply(board, {
      type: 'task.add',
      projectId: 'p1',
      id: 't1',
      title: 'x',
      note: 'a'.repeat(LIMITS.taskNote),
      at: AT,
    })
    expect(taskOf(longest, 't1').note).toHaveLength(LIMITS.taskNote)
    const normalized = mustApply(board, {
      type: 'task.add',
      projectId: 'p1',
      id: 't2',
      title: 'x',
      note: '  line1\r\nline2\rline3  ',
      at: AT,
    })
    expect(taskOf(normalized, 't2').note).toBe('line1\nline2\nline3')
  })

  it('refuses duplicates, bad ids, bad columns and unknown projects', () => {
    const board = addTask(baseBoard(), 't1')
    expect(mustRefuse(board, { type: 'task.add', projectId: 'p1', id: 't1', title: 'Again', at: AT })).toContain('已存在')
    expect(mustRefuse(board, { type: 'task.add', projectId: 'p1', id: 'bad id', title: 'X', at: AT })).toContain('id')
    expect(mustRefuse(board, { type: 'task.add', projectId: 'nope', id: 't2', title: 'X', at: AT })).toContain('不存在')
    const badColumn = { type: 'task.add', projectId: 'p1', id: 't2', title: 'X', column: 'nope', at: AT } as unknown as Op
    expect(mustRefuse(board, badColumn)).toContain('列')
  })
})

describe('task.advance', () => {
  it('walks todo -> doing -> review -> done and stamps completedAt on entry', () => {
    let board = addTask(baseBoard(), 't1', 'todo', AT)
    const steps: { from: ColumnId; to: ColumnId; at: string }[] = [
      { from: 'todo', to: 'doing', at: isoAt(1) },
      { from: 'doing', to: 'review', at: isoAt(2) },
      { from: 'review', to: 'done', at: isoAt(3) },
    ]
    for (const step of steps) {
      board = mustApply(board, { type: 'task.advance', projectId: 'p1', taskId: 't1', from: step.from, at: step.at })
      const task = taskOf(board, 't1')
      expect(task.column).toBe(step.to)
      expect(task.updatedAt).toBe(step.at)
      if (step.to === 'done') expect(task.completedAt).toBe(step.at)
      else expect(task.completedAt).toBeUndefined()
    }
  })

  it('lands the advanced task at the top of the target column', () => {
    let board = baseBoard()
    board = addTask(board, 'd1', 'doing', isoAt(1))
    board = addTask(board, 'd2', 'doing', isoAt(2))
    board = addTask(board, 't1', 'todo', isoAt(3))
    board = mustApply(board, { type: 'task.advance', projectId: 'p1', taskId: 't1', from: 'todo', at: isoAt(4) })
    expect(columnIds(board, 'doing')).toEqual(['t1', 'd1', 'd2'])
    expect(columnIds(board, 'todo')).toEqual([])
    expect(taskIds(board).indexOf('t1')).toBeLessThan(taskIds(board).indexOf('d1'))
  })

  it('refuses to advance out of done', () => {
    const board = addTask(baseBoard(), 't1', 'done')
    expect(
      mustRefuse(board, { type: 'task.advance', projectId: 'p1', taskId: 't1', from: 'done', at: isoAt(9) }),
    ).toContain('已完成')
  })

  it('refuses a stale from and returns the very same board object', () => {
    const board = addTask(baseBoard(), 't1', 'doing')
    const result = applyOp(board, { type: 'task.advance', projectId: 'p1', taskId: 't1', from: 'todo', at: isoAt(5) })
    if (result.ok) throw new Error('expected the stale advance to be refused')
    expect(result.board).toBe(board)
    expect(taskOf(result.board, 't1').column).toBe('doing')
    expect(taskOf(result.board, 't1').updatedAt).toBe(AT)
  })

  it('does not skip a column on a repeated from=todo advance', () => {
    let board = addTask(baseBoard(), 't1', 'todo')
    board = mustApply(board, { type: 'task.advance', projectId: 'p1', taskId: 't1', from: 'todo', at: isoAt(1) })
    expect(taskOf(board, 't1').column).toBe('doing')
    const second = applyOp(board, { type: 'task.advance', projectId: 'p1', taskId: 't1', from: 'todo', at: isoAt(2) })
    if (second.ok) throw new Error('expected the repeated advance to be refused')
    expect(second.board).toBe(board)
    expect(taskOf(second.board, 't1').column).toBe('doing')
    board = mustApply(second.board, { type: 'task.advance', projectId: 'p1', taskId: 't1', from: 'doing', at: isoAt(3) })
    expect(taskOf(board, 't1').column).toBe('review')
  })

  it('refuses invalid columns, unknown tasks and unknown projects', () => {
    const board = addTask(baseBoard(), 't1')
    const badFrom = { type: 'task.advance', projectId: 'p1', taskId: 't1', from: 'bogus', at: AT } as unknown as Op
    expect(mustRefuse(board, badFrom)).toContain('列')
    expect(mustRefuse(board, { type: 'task.advance', projectId: 'p1', taskId: 'nope', from: 'todo', at: AT })).toContain(
      '不存在',
    )
    expect(mustRefuse(board, { type: 'task.advance', projectId: 'nope', taskId: 't1', from: 'todo', at: AT })).toContain(
      '不存在',
    )
  })
})

describe('task.move', () => {
  it('places the task before beforeTaskId', () => {
    let board = baseBoard()
    board = addTask(board, 't1')
    board = addTask(board, 't2')
    board = addTask(board, 't3')
    board = mustApply(board, { type: 'task.move', projectId: 'p1', taskId: 't3', to: 'todo', beforeTaskId: 't1', at: LATER })
    expect(columnIds(board, 'todo')).toEqual(['t3', 't1', 't2'])
  })

  it('puts the task at the end of its column when beforeTaskId is null', () => {
    let board = baseBoard()
    board = addTask(board, 't1')
    board = addTask(board, 't2')
    board = addTask(board, 't3')
    board = mustApply(board, { type: 'task.move', projectId: 'p1', taskId: 't1', to: 'todo', beforeTaskId: null, at: LATER })
    expect(columnIds(board, 'todo')).toEqual(['t2', 't3', 't1'])
  })

  it('clears completedAt when a task leaves done', () => {
    let board = addTask(baseBoard(), 'd1', 'done', AT)
    board = mustApply(board, { type: 'task.move', projectId: 'p1', taskId: 'd1', to: 'review', at: LATER })
    const task = taskOf(board, 'd1')
    expect(task.column).toBe('review')
    expect(task.completedAt).toBeUndefined()
    expect(task.updatedAt).toBe(LATER)
  })

  it('keeps completedAt when a task moves inside done', () => {
    let board = baseBoard()
    board = addTask(board, 'd1', 'done', AT)
    board = addTask(board, 'd2', 'done', isoAt(10))
    const completed = taskOf(board, 'd2').completedAt
    expect(completed).toBe(isoAt(10))
    board = mustApply(board, {
      type: 'task.move',
      projectId: 'p1',
      taskId: 'd2',
      to: 'done',
      beforeTaskId: 'd1',
      at: LATER,
    })
    expect(columnIds(board, 'done')).toEqual(['d2', 'd1'])
    expect(taskOf(board, 'd2').completedAt).toBe(completed)
  })

  it('stamps completedAt when a task enters done', () => {
    let board = addTask(baseBoard(), 't1', 'todo', AT)
    board = mustApply(board, { type: 'task.move', projectId: 'p1', taskId: 't1', to: 'done', at: LATER })
    expect(taskOf(board, 't1').completedAt).toBe(LATER)
    expect(taskOf(board, 't1').updatedAt).toBe(LATER)
  })

  it('treats a beforeTaskId in another column as no anchor', () => {
    let board = baseBoard()
    board = addTask(board, 'a', 'todo')
    board = addTask(board, 'b', 'todo')
    board = addTask(board, 'x', 'doing')
    board = mustApply(board, { type: 'task.move', projectId: 'p1', taskId: 'a', to: 'todo', beforeTaskId: 'x', at: LATER })
    expect(columnIds(board, 'todo')).toEqual(['b', 'a'])
  })

  it('is a no-op when beforeTaskId is the task itself', () => {
    const board = addTask(baseBoard(), 't1')
    const result = applyOp(board, {
      type: 'task.move',
      projectId: 'p1',
      taskId: 't1',
      to: 'doing',
      beforeTaskId: 't1',
      at: LATER,
    })
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.board).toBe(board)
    expect(taskOf(result.board, 't1').column).toBe('todo')
  })

  it('refuses invalid columns and unknown tasks', () => {
    const board = addTask(baseBoard(), 't1')
    const badTo = { type: 'task.move', projectId: 'p1', taskId: 't1', to: 'nope', at: AT } as unknown as Op
    expect(mustRefuse(board, badTo)).toContain('列')
    expect(mustRefuse(board, { type: 'task.move', projectId: 'p1', taskId: 'nope', to: 'doing', at: AT })).toContain(
      '不存在',
    )
  })
})

describe('task.delete and task.restore', () => {
  function boardWithFour(): Board {
    let board = baseBoard()
    board = addTask(board, 'a', 'todo', isoAt(1))
    board = addTask(board, 'b', 'todo', isoAt(2))
    board = addTask(board, 'c', 'doing', isoAt(3))
    board = addTask(board, 'd', 'done', isoAt(4))
    return board
  }

  it('restores a deleted task at its original index', () => {
    const original = boardWithFour()
    const before = projectOf(original).tasks
    const deletedTask = taskOf(original, 'b')
    const afterDelete = mustApply(original, { type: 'task.delete', projectId: 'p1', taskId: 'b' })
    expect(taskIds(afterDelete)).toEqual(['a', 'c', 'd'])
    const restored = mustApply(afterDelete, { type: 'task.restore', projectId: 'p1', task: deletedTask, index: 1 })
    expect(taskIds(restored)).toEqual(['a', 'b', 'c', 'd'])
    expect(projectOf(restored).tasks).toEqual(before)
  })

  it('preserves completedAt when restoring a done task', () => {
    const original = boardWithFour()
    const deletedTask = taskOf(original, 'd')
    expect(deletedTask.completedAt).toBe(isoAt(4))
    const afterDelete = mustApply(original, { type: 'task.delete', projectId: 'p1', taskId: 'd' })
    const restored = mustApply(afterDelete, { type: 'task.restore', projectId: 'p1', task: deletedTask, index: 3 })
    expect(taskIds(restored)).toEqual(['a', 'b', 'c', 'd'])
    expect(taskOf(restored, 'd').completedAt).toBe(isoAt(4))
  })

  it('clamps the restore index', () => {
    const original = boardWithFour()
    const deletedTask = taskOf(original, 'a')
    const afterDelete = mustApply(original, { type: 'task.delete', projectId: 'p1', taskId: 'a' })
    const atEnd = mustApply(afterDelete, { type: 'task.restore', projectId: 'p1', task: deletedTask, index: 99 })
    expect(taskIds(atEnd)).toEqual(['b', 'c', 'd', 'a'])
    const atStart = mustApply(afterDelete, { type: 'task.restore', projectId: 'p1', task: deletedTask, index: -5 })
    expect(taskIds(atStart)).toEqual(['a', 'b', 'c', 'd'])
  })

  it('refuses to restore an id that still exists', () => {
    const board = boardWithFour()
    expect(mustRefuse(board, { type: 'task.restore', projectId: 'p1', task: taskOf(board, 'a'), index: 0 })).toContain(
      '已存在',
    )
  })

  it('refuses malformed tasks and unknown projects', () => {
    const board = boardWithFour()
    const malformed: unknown[] = [
      { ...taskOf(board, 'a'), id: 'bad id' },
      { ...taskOf(board, 'a'), id: 'zz', title: '   ' },
      { ...taskOf(board, 'a'), id: 'zz', column: 'nope' },
      { ...taskOf(board, 'a'), id: 'zz', note: 'a'.repeat(LIMITS.taskNote + 1) },
      null,
      'garbage',
    ]
    for (const task of malformed) {
      const op = { type: 'task.restore', projectId: 'p1', task, index: 0 } as unknown as Op
      expect(mustRefuse(board, op)).toContain('无效')
    }
    const valid = { ...taskOf(board, 'a'), id: 'zz' }
    expect(mustRefuse(board, { type: 'task.restore', projectId: 'nope', task: valid, index: 0 })).toContain('不存在')
  })

  it('refuses to delete an unknown task twice', () => {
    const board = boardWithFour()
    const once = mustApply(board, { type: 'task.delete', projectId: 'p1', taskId: 'c' })
    expect(mustRefuse(once, { type: 'task.delete', projectId: 'p1', taskId: 'c' })).toContain('不存在')
  })
})

describe('task.update', () => {
  it('updates title and note without touching the column', () => {
    const board = addTask(baseBoard(), 't1', 'doing', AT)
    const updated = mustApply(board, {
      type: 'task.update',
      projectId: 'p1',
      taskId: 't1',
      title: '  New\n title ',
      note: ' details ',
      at: LATER,
    })
    const task = taskOf(updated, 't1')
    expect(task.title).toBe('New title')
    expect(task.note).toBe('details')
    expect(task.column).toBe('doing')
    expect(task.createdAt).toBe(AT)
    expect(task.updatedAt).toBe(LATER)
  })

  it('refuses invalid text and unknown tasks', () => {
    const board = addTask(baseBoard(), 't1')
    expect(
      mustRefuse(board, { type: 'task.update', projectId: 'p1', taskId: 't1', title: 'a'.repeat(201) }),
    ).toContain('标题')
    expect(
      mustRefuse(board, { type: 'task.update', projectId: 'p1', taskId: 't1', note: 'a'.repeat(2001) }),
    ).toContain('备注')
    expect(mustRefuse(board, { type: 'task.update', projectId: 'p1', taskId: 'nope', title: 'x' })).toContain('不存在')
  })
})

describe('applyOp immutability', () => {
  it('never mutates a deep-frozen board, for every op type', () => {
    let source = baseBoard()
    source = mustApply(source, { type: 'project.add', id: 'p2', name: 'Beta', at: AT })
    source = addTask(source, 'todo1', 'todo', AT)
    source = addTask(source, 'doing1', 'doing', AT)
    source = addTask(source, 'review1', 'review', AT)
    source = addTask(source, 'done1', 'done', AT)

    const expected = snapshot(source)
    deepFreeze(source)
    expect(Object.isFrozen(source)).toBe(true)
    expect(Object.isFrozen(projectOf(source).tasks)).toBe(true)
    expect(Object.isFrozen(taskOf(source, 'todo1'))).toBe(true)

    const ghost: Task = { id: 'ghost', title: 'Ghost', note: '', column: 'todo', createdAt: AT, updatedAt: AT }
    const ops: Op[] = [
      { type: 'project.add', id: 'p3', name: 'Gamma', at: AT },
      { type: 'project.add', id: 'p1', name: 'Duplicate', at: AT },
      { type: 'project.update', projectId: 'p1', name: 'Renamed', color: 'teal', collapsed: true },
      { type: 'project.update', projectId: 'p1', color: 'pink' as unknown as ProjectColor },
      { type: 'project.delete', projectId: 'p2' },
      { type: 'project.delete', projectId: 'nope' },
      { type: 'project.move', projectId: 'p2', toIndex: 0 },
      { type: 'project.move', projectId: 'p1', toIndex: 99 },
      { type: 'project.move', projectId: 'p1', toIndex: 1.5 },
      { type: 'task.add', projectId: 'p1', id: 'new1', title: 'New', at: AT },
      { type: 'task.add', projectId: 'p1', id: 'new2', title: 'New done', column: 'done', at: AT },
      { type: 'task.add', projectId: 'p1', id: 'todo1', title: 'Duplicate', at: AT },
      { type: 'task.update', projectId: 'p1', taskId: 'todo1', title: 'Changed', note: 'Note', at: LATER },
      { type: 'task.update', projectId: 'p1', taskId: 'todo1', title: '   ', at: LATER },
      { type: 'task.delete', projectId: 'p1', taskId: 'review1' },
      { type: 'task.delete', projectId: 'p1', taskId: 'nope' },
      { type: 'task.advance', projectId: 'p1', taskId: 'todo1', from: 'todo', at: LATER },
      { type: 'task.advance', projectId: 'p1', taskId: 'done1', from: 'done', at: LATER },
      { type: 'task.advance', projectId: 'p1', taskId: 'doing1', from: 'todo', at: LATER },
      { type: 'task.move', projectId: 'p1', taskId: 'todo1', to: 'doing', beforeTaskId: 'doing1', at: LATER },
      { type: 'task.move', projectId: 'p1', taskId: 'doing1', to: 'doing', beforeTaskId: 'doing1', at: LATER },
      { type: 'task.move', projectId: 'p1', taskId: 'done1', to: 'review', at: LATER },
      { type: 'task.move', projectId: 'p1', taskId: 'todo1', to: 'nope' as unknown as ColumnId, at: LATER },
      { type: 'task.restore', projectId: 'p1', task: ghost, index: 0 },
      { type: 'task.restore', projectId: 'p1', task: { ...ghost, id: 'todo1' }, index: 0 },
      null as unknown as Op,
      { type: 'unknown.op' } as unknown as Op,
    ]

    // `unknown.op` is the deliberate "not a real op type" probe, not coverage.
    const covered = new Set(
      ops
        .map((op) => (op as { type?: unknown } | null)?.type)
        .filter((type): type is string => typeof type === 'string' && type !== 'unknown.op'),
    )
    expect([...covered].sort()).toEqual([
      'project.add',
      'project.delete',
      'project.move',
      'project.update',
      'task.add',
      'task.advance',
      'task.delete',
      'task.move',
      'task.restore',
      'task.update',
    ])

    for (const op of ops) {
      const label = JSON.stringify(op) ?? String(op)
      expect(() => applyOp(source, op), label).not.toThrow()
      expect(snapshot(source), label).toEqual(expected)
    }
  })
})

describe('applyOps', () => {
  it('applies valid ops in order and reports the refused indexes', () => {
    const start = baseBoard()
    const startSnapshot = snapshot(start)
    const ops: Op[] = [
      { type: 'project.add', id: 'p2', name: 'Beta', at: AT }, // 0 ok
      { type: 'project.add', id: 'p2', name: 'Beta again', at: AT }, // 1 refused
      { type: 'task.add', projectId: 'p1', id: 't1', title: 'One', at: AT }, // 2 ok
      { type: 'task.advance', projectId: 'p1', taskId: 't1', from: 'review', at: AT }, // 3 refused (stale)
      { type: 'task.add', projectId: 'p1', id: 't2', title: 'Two', column: 'doing', at: AT }, // 4 ok
      { type: 'project.delete', projectId: 'nope' }, // 5 refused
      { type: 'task.advance', projectId: 'p1', taskId: 't1', from: 'todo', at: LATER }, // 6 ok
    ]
    const { board, refused } = applyOps(start, ops)
    expect(refused.map((item) => item.index)).toEqual([1, 3, 5])
    for (const item of refused) expect(item.reason.length).toBeGreaterThan(0)
    expect(board.projects.map((project) => project.id)).toEqual(['p1', 'p2'])
    expect(taskOf(board, 't1').column).toBe('doing')
    expect(taskOf(board, 't1').updatedAt).toBe(LATER)
    expect(taskOf(board, 't2').column).toBe('doing')
    expect(columnIds(board, 'doing')).toEqual(['t1', 't2'])
    expect(snapshot(start)).toEqual(startSnapshot)
  })

  it('returns the input board when there is nothing to apply', () => {
    const start = baseBoard()
    const empty = applyOps(start, [])
    expect(empty.board).toBe(start)
    expect(empty.refused).toEqual([])
    const refusedOnly = applyOps(start, [{ type: 'project.delete', projectId: 'nope' }])
    expect(refusedOnly.board).toBe(start)
    expect(refusedOnly.refused.map((item) => item.index)).toEqual([0])
  })
})

describe('sanitizeBoard', () => {
  it('keeps valid projects and tasks and drops malformed and duplicate entries', () => {
    const raw = {
      version: 99,
      revision: 7,
      projects: [
        {
          id: 'p1',
          name: '  Alpha  ',
          color: 'rose',
          collapsed: true,
          createdAt: AT,
          tasks: [
            { id: 't1', title: 'First', note: 'note', column: 'todo', createdAt: AT, updatedAt: AT },
            { id: 't1', title: 'Duplicate', column: 'todo' },
            { id: 't2', title: 'Done task', column: 'done', createdAt: AT, updatedAt: AT },
            { id: 'bad id', title: 'x', column: 'todo' },
            { id: 't3', title: '   ', column: 'todo' },
            { id: 't4', title: 'x', column: 'nope' },
            { id: 't5', title: 'x', note: 'a'.repeat(LIMITS.taskNote + 1), column: 'todo' },
            null,
            'garbage',
            42,
            [],
          ],
        },
        { id: 'p1', name: 'Duplicate project', tasks: [] },
        { id: 'bad id', name: 'Bad', tasks: [] },
        { id: 'p2', name: '   ', tasks: [] },
        { id: 'p3', name: 'Gamma', color: 'chartreuse', collapsed: 'yes', createdAt: AT, tasks: 'not-an-array' },
        null,
        'garbage',
        42,
        [],
      ],
    }
    const board = sanitizeBoard(raw)
    expect(board.version).toBe(1)
    expect(board.revision).toBe(7)
    expect(board.projects.map((project) => project.id)).toEqual(['p1', 'p3'])

    const p1 = projectOf(board, 'p1')
    expect(p1.name).toBe('Alpha')
    expect(p1.color).toBe('rose')
    expect(p1.collapsed).toBe(true)
    expect(p1.createdAt).toBe(AT)
    expect(p1.tasks.map((task) => task.id)).toEqual(['t1', 't2'])
    expect(taskOf(board, 't1').title).toBe('First')
    expect(taskOf(board, 't1').note).toBe('note')
    expect(taskOf(board, 't2').completedAt).toBe(AT)

    const p3 = projectOf(board, 'p3')
    expect(p3.color).toBe('blue')
    expect(p3.collapsed).toBe(false)
    expect(p3.tasks).toEqual([])
  })

  it('tolerates null, garbage and bad revisions', () => {
    for (const value of [null, undefined, 'garbage', 42, true, [], { projects: 'nope' }]) {
      expect(sanitizeBoard(value)).toEqual({ version: 1, revision: 0, projects: [] })
    }
    expect(sanitizeBoard({ revision: -1, projects: [] }).revision).toBe(0)
    expect(sanitizeBoard({ revision: 1.5, projects: [] }).revision).toBe(0)
    expect(sanitizeBoard({ revision: 3, projects: [] }).revision).toBe(3)
  })

  it('round-trips a valid board', () => {
    let board = baseBoard()
    board = addTask(board, 't1', 'todo', AT)
    board = addTask(board, 't2', 'done', LATER)
    expect(sanitizeBoard(snapshot(board))).toEqual(board)
  })

  it('sanitizeTask fills completedAt for done tasks and rejects garbage', () => {
    const done = sanitizeTask({ id: 't1', title: 'x', column: 'done', createdAt: AT, updatedAt: LATER })
    expect(done?.completedAt).toBe(LATER)
    const todo = sanitizeTask({ id: 't1', title: 'x', column: 'todo', createdAt: AT, updatedAt: LATER })
    expect(todo?.completedAt).toBeUndefined()
    expect(sanitizeTask(null)).toBeUndefined()
    expect(sanitizeTask({ id: 'bad id', title: 'x', column: 'todo' })).toBeUndefined()
  })
})

describe('text and column helpers', () => {
  it('cleanLine trims, collapses and enforces the limit', () => {
    expect(cleanLine('  a \n b  ', 10)).toBe('a b')
    expect(cleanLine('', 10)).toBeUndefined()
    expect(cleanLine('   ', 10)).toBeUndefined()
    expect(cleanLine(42, 10)).toBeUndefined()
    expect(cleanLine('abcdef', 5)).toBeUndefined()
    expect(cleanLine('abcde', 5)).toBe('abcde')
  })

  it('cleanNote normalises line endings and enforces the limit', () => {
    expect(cleanNote(' a\r\nb\rc ')).toBe('a\nb\nc')
    expect(cleanNote('x'.repeat(LIMITS.taskNote + 1))).toBeUndefined()
    expect(cleanNote(null)).toBeUndefined()
    expect(cleanNote('')).toBe('')
  })

  it('nextColumn, isColumn and isColor follow the fixed column order', () => {
    expect(nextColumn('todo')).toBe('doing')
    expect(nextColumn('doing')).toBe('review')
    expect(nextColumn('review')).toBe('done')
    expect(nextColumn('done')).toBeUndefined()
    expect(isColumn('review')).toBe(true)
    expect(isColumn('bogus')).toBe(false)
    expect(isColumn(null)).toBe(false)
    expect(isColor('teal')).toBe(true)
    expect(isColor('pink')).toBe(false)
  })

  it('tasksIn and columnCounts agree with the task array', () => {
    let board = baseBoard()
    board = addTask(board, 'a', 'todo')
    board = addTask(board, 'b', 'todo')
    board = addTask(board, 'c', 'done')
    const project = projectOf(board)
    expect(tasksIn(project, 'todo').map((task) => task.id)).toEqual(['a', 'b'])
    expect(columnCounts(project)).toEqual({ todo: 2, doing: 0, review: 0, done: 1 })
  })

  it('newId makes ids the model accepts', () => {
    const taskId = newId('t')
    expect(taskId.startsWith('t_')).toBe(true)
    expect(ID_PATTERN.test(taskId)).toBe(true)
    expect(newId('p').startsWith('p_')).toBe(true)
  })
})

describe('stress', () => {
  it('keeps ids unique, columns valid and completedAt consistent across 2000 random ops', () => {
    const random = mulberry32(0x5eed)
    let board = mustApply(emptyBoard(), { type: 'project.add', id: 'p1', name: 'Stress', at: AT })
    for (let index = 0; index < 20; index += 1) {
      board = mustApply(board, {
        type: 'task.add',
        projectId: 'p1',
        id: `t${index}`,
        title: `Task ${index}`,
        column: COLUMNS[index % COLUMNS.length]!,
        at: isoAt(index),
      })
    }

    const deleted: Task[] = []
    let nextAddId = 0
    let applied = 0
    let refused = 0

    for (let step = 0; step < 2000; step += 1) {
      const project = projectOf(board)
      const tasks = project.tasks
      const task = pick(random, tasks)
      const roll = random()
      let op: Op
      if (roll < 0.4 && task) {
        // Mostly a truthful `from`, sometimes a stale one on purpose.
        const from = random() < 0.8 ? task.column : pick(random, COLUMNS)!
        op = { type: 'task.advance', projectId: 'p1', taskId: task.id, from, at: isoAt(step) }
      } else if (roll < 0.65 && task) {
        const to = pick(random, COLUMNS)!
        const anchor = random() < 0.5 ? pick(random, tasks) : undefined
        op = {
          type: 'task.move',
          projectId: 'p1',
          taskId: task.id,
          to,
          beforeTaskId: anchor ? anchor.id : null,
          at: isoAt(step),
        }
      } else if (roll < 0.8 && task) {
        op = { type: 'task.delete', projectId: 'p1', taskId: task.id }
      } else if (roll < 0.9 && deleted.length > 0) {
        op = {
          type: 'task.restore',
          projectId: 'p1',
          task: pick(random, deleted)!,
          index: Math.floor(random() * (tasks.length + 1)),
        }
      } else {
        op = {
          type: 'task.add',
          projectId: 'p1',
          id: `n${nextAddId}`,
          title: `New ${nextAddId}`,
          column: pick(random, COLUMNS)!,
          at: isoAt(step),
        }
        nextAddId += 1
      }

      let deleteId: string | undefined
      if (op.type === 'task.delete') deleteId = op.taskId
      const removed = deleteId === undefined ? undefined : tasks.find((item) => item.id === deleteId)

      const result = applyOp(board, op)
      if (result.ok) {
        applied += 1
        if (removed) deleted.push({ ...removed })
      } else {
        refused += 1
      }
      board = result.board

      const all = board.projects.flatMap((item) => item.tasks)
      const ids = all.map((item) => item.id)
      expect(new Set(ids).size, `duplicate task id at step ${step}`).toBe(ids.length)
      expect(all.every((item) => isColumn(item.column)), `invalid column at step ${step}`).toBe(true)
      expect(
        all.map((item) => item.completedAt !== undefined),
        `completedAt/column mismatch at step ${step}`,
      ).toEqual(all.map((item) => item.column === 'done'))
      expect(board.projects.length, `project lost at step ${step}`).toBe(1)
    }

    expect(applied + refused).toBe(2000)
    expect(applied).toBeGreaterThan(0)
    expect(refused).toBeGreaterThan(0)
    expect(projectOf(board).tasks.every((task) => isColumn(task.column))).toBe(true)
  })
})
