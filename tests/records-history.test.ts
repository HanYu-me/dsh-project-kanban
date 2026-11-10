/**
 * Undo and redo for the records: the inverse of every op, checked by doing the
 * op, undoing it, and expecting the records we started with (leaving aside
 * `updatedAt` stamps and the order of links).
 */
import { describe, expect, it } from 'vitest'
import { applyOp } from '../src/shared/board'
import type { Board, Op } from '../src/shared/board'
import { applyRecordOp, relationsOf } from '../src/shared/records'
import type { ProjectRecords, RecordOp } from '../src/shared/records'
import { invertRecordOp, planOps } from '../src/shared/records-history'
import { AT, LATER, baseBoard, checkInvariants, normRecords, randomRecordOp, recordsIn, rng } from './helpers'

function apply(board: Board, op: Op): Board {
  const result = applyOp(board, op)
  if (!result.ok) throw new Error(`expected op to apply, refused with: ${result.reason}`)
  return result.board
}

function applyAll(board: Board, ops: readonly Op[]): Board {
  return ops.reduce((current, op) => apply(current, op), board)
}

/** A board that has a bit of everything: trees, stars, categories, links, relations, defaults. */
function rich(): Board {
  const p = 'p1'
  const ops: RecordOp[] = [
    { type: 'category.add', projectId: p, kind: 'node', id: 'c1', name: '原始', color: '#4d6bfe' },
    { type: 'category.add', projectId: p, kind: 'node', id: 'c2', name: '最终', color: '#e09400' },
    { type: 'category.add', projectId: p, kind: 'edge', id: 'e1', name: '来源', color: '#22a06b' },
    { type: 'palette.update', projectId: p, star: '#f0777d' },
    { type: 'node.add', projectId: p, side: 'data', id: 'd1', name: '第一章', at: AT },
    { type: 'node.add', projectId: p, side: 'data', id: 'd2', name: '原始计数', path: '/data/raw', description: '10x', parentId: 'd1', category: 'c1', at: AT },
    { type: 'node.add', projectId: p, side: 'data', id: 'd3', name: '过滤后', parentId: 'd1', starred: true, at: AT },
    { type: 'node.add', projectId: p, side: 'data', id: 'd4', name: '参考', at: AT },
    { type: 'node.add', projectId: p, side: 'result', id: 'r1', name: '图 1', at: AT },
    { type: 'node.add', projectId: p, side: 'result', id: 'r2', name: '图 1a', parentId: 'r1', category: 'c2', at: AT },
    { type: 'node.add', projectId: p, side: 'result', id: 'r3', name: '表 1', at: AT },
    { type: 'link.add', projectId: p, id: 'l1', dataId: 'd2', resultId: 'r2', category: 'e1', at: AT },
    { type: 'link.add', projectId: p, id: 'l2', dataId: 'd3', resultId: 'r3', at: AT },
    { type: 'relation.add', projectId: p, id: 'x1', fromId: 'r2', toId: 'r3', directed: true, category: 'e1', at: AT },
    { type: 'relation.add', projectId: p, id: 'x2', fromId: 'r1', toId: 'r3', at: AT },
  ]
  return applyAll(baseBoard(), ops)
}

/** Do `op`, then its inverse, and expect the records back as they were. */
function roundTrip(before: Board, op: RecordOp): void {
  const result = applyOp(before, op)
  if (!result.ok) throw new Error(`op refused: ${result.reason} ${JSON.stringify(op)}`)
  const inverse = invertRecordOp(recordsIn(before), op)
  const after = applyAll(result.board, inverse)
  expect(normRecords(recordsIn(after)), JSON.stringify(op)).toBe(normRecords(recordsIn(before)))
  checkInvariants(recordsIn(after))
}

const p = 'p1'

describe('invertRecordOp', () => {
  it('node.add is undone by deleting the node', () => {
    roundTrip(rich(), { type: 'node.add', projectId: p, side: 'data', id: 'dn', name: 'new', parentId: 'd1', beforeId: 'd3', starred: true, category: 'c1' })
    roundTrip(rich(), { type: 'node.add', projectId: p, side: 'result', id: 'rn', name: 'new' })
  })

  it('node.update puts back every field it changed, including no star and no category', () => {
    roundTrip(rich(), { type: 'node.update', projectId: p, nodeId: 'd2', name: 'x', path: '/y', description: 'z', collapsed: true, starred: true, category: null, at: LATER })
    roundTrip(rich(), { type: 'node.update', projectId: p, nodeId: 'd3', starred: false, category: 'c2' })
    roundTrip(rich(), { type: 'node.update', projectId: p, nodeId: 'd1', collapsed: true })
  })

  it('node.move puts the node back between the same neighbours, under the same parent', () => {
    roundTrip(rich(), { type: 'node.move', projectId: p, nodeId: 'd3', parentId: 'd1', beforeId: 'd2' })
    roundTrip(rich(), { type: 'node.move', projectId: p, nodeId: 'd2', parentId: null, beforeId: 'd1' })
    roundTrip(rich(), { type: 'node.move', projectId: p, nodeId: 'd1', parentId: 'd4' })
    roundTrip(rich(), { type: 'node.move', projectId: p, nodeId: 'r2', parentId: 'r3' })
  })

  it('node.delete brings back the whole subtree with its links, relations, stars and categories', () => {
    roundTrip(rich(), { type: 'node.delete', projectId: p, nodeId: 'd1' })
    roundTrip(rich(), { type: 'node.delete', projectId: p, nodeId: 'd2' })
    roundTrip(rich(), { type: 'node.delete', projectId: p, nodeId: 'r1' })
    roundTrip(rich(), { type: 'node.delete', projectId: p, nodeId: 'r3' })
    roundTrip(rich(), { type: 'node.delete', projectId: p, nodeId: 'd4' })
  })

  it('node.delete with lift brings back the node, its own links, and its children under it', () => {
    roundTrip(rich(), { type: 'node.delete', projectId: p, nodeId: 'd1', lift: true })
    roundTrip(rich(), { type: 'node.delete', projectId: p, nodeId: 'r1', lift: true })
    roundTrip(rich(), { type: 'node.delete', projectId: p, nodeId: 'd2', lift: true })
  })

  it('node.restore is undone by deleting what it put back', () => {
    const board = rich()
    const deleted = apply(board, { type: 'node.delete', projectId: p, nodeId: 'd1' })
    const restore = invertRecordOp(recordsIn(board), { type: 'node.delete', projectId: p, nodeId: 'd1' })[0]!
    roundTrip(deleted, restore)
  })

  it('link ops: add, update, delete', () => {
    roundTrip(rich(), { type: 'link.add', projectId: p, id: 'ln', dataId: 'd4', resultId: 'r1', category: 'e1' })
    roundTrip(rich(), { type: 'link.update', projectId: p, linkId: 'l1', category: null })
    roundTrip(rich(), { type: 'link.update', projectId: p, linkId: 'l2', category: 'e1' })
    roundTrip(rich(), { type: 'link.delete', projectId: p, linkId: 'l1' })
    roundTrip(rich(), { type: 'link.delete', projectId: p, linkId: 'l2' })
  })

  it('relation ops: add, direction, reverse, category, delete', () => {
    roundTrip(rich(), { type: 'relation.add', projectId: p, id: 'xn', fromId: 'r1', toId: 'r2', directed: true, category: 'e1' })
    roundTrip(rich(), { type: 'relation.update', projectId: p, relationId: 'x1', directed: false })
    roundTrip(rich(), { type: 'relation.update', projectId: p, relationId: 'x1', reverse: true })
    roundTrip(rich(), { type: 'relation.update', projectId: p, relationId: 'x2', directed: true, reverse: true, category: 'e1' })
    roundTrip(rich(), { type: 'relation.update', projectId: p, relationId: 'x1', category: null })
    roundTrip(rich(), { type: 'relation.delete', projectId: p, relationId: 'x1' })
    roundTrip(rich(), { type: 'relation.delete', projectId: p, relationId: 'x2' })
  })

  it('category ops: add, rename and recolour, delete (everything that used it takes it up again)', () => {
    roundTrip(rich(), { type: 'category.add', projectId: p, kind: 'edge', id: 'cn', name: '新', color: '#112233', index: 0 })
    roundTrip(rich(), { type: 'category.update', projectId: p, kind: 'node', categoryId: 'c1', name: '改名', color: '#000000' })
    roundTrip(rich(), { type: 'category.update', projectId: p, kind: 'edge', categoryId: 'e1', color: '#ffffff' })
    roundTrip(rich(), { type: 'category.delete', projectId: p, kind: 'node', categoryId: 'c1' })
    roundTrip(rich(), { type: 'category.delete', projectId: p, kind: 'node', categoryId: 'c2' })
    roundTrip(rich(), { type: 'category.delete', projectId: p, kind: 'edge', categoryId: 'e1' })
  })

  it('category.delete restores the category at its old place in the list', () => {
    const board = rich()
    const before = recordsIn(board).palette!.nodeCategories.map((c) => c.id)
    const after = recordsIn(apply(apply(board, { type: 'category.delete', projectId: p, kind: 'node', categoryId: 'c1' }), invertRecordOp(recordsIn(board), { type: 'category.delete', projectId: p, kind: 'node', categoryId: 'c1' })[0]!)).palette!.nodeCategories.map((c) => c.id)
    expect(after).toEqual(before)
  })

  it('palette.update puts back the old defaults, or none', () => {
    roundTrip(rich(), { type: 'palette.update', projectId: p, star: '#000000', node: '#111111' })
    roundTrip(rich(), { type: 'palette.update', projectId: p, star: null })
    roundTrip(baseBoard().projects[0] ? apply(baseBoard(), { type: 'node.add', projectId: p, side: 'data', id: 'd1', name: 'd1' }) : baseBoard(), { type: 'palette.update', projectId: p, edge: '#222222' })
  })

  it('gives nothing to undo for an op that could not have changed anything', () => {
    const records = recordsIn(rich())
    expect(invertRecordOp(records, { type: 'node.update', projectId: p, nodeId: 'nope', name: 'x' })).toEqual([])
    expect(invertRecordOp(records, { type: 'node.move', projectId: p, nodeId: 'nope', parentId: null })).toEqual([])
    expect(invertRecordOp(records, { type: 'node.delete', projectId: p, nodeId: 'nope' })).toEqual([])
    expect(invertRecordOp(records, { type: 'link.delete', projectId: p, linkId: 'nope' })).toEqual([])
    expect(invertRecordOp(records, { type: 'relation.delete', projectId: p, relationId: 'nope' })).toEqual([])
    expect(invertRecordOp(records, { type: 'category.delete', projectId: p, kind: 'node', categoryId: 'nope' })).toEqual([])
  })
})

describe('planOps', () => {
  it('keeps the ops that fit, reports the others, and gives an inverse that undoes the batch in reverse order', () => {
    const board = rich()
    const ops: RecordOp[] = [
      { type: 'node.add', projectId: p, side: 'data', id: 'g1', name: '新分组', parentId: 'd1', beforeId: 'd2', at: AT },
      { type: 'node.move', projectId: p, nodeId: 'd2', parentId: 'g1', beforeId: null },
      { type: 'node.move', projectId: p, nodeId: 'd3', parentId: 'g1', beforeId: null },
      { type: 'node.move', projectId: p, nodeId: 'd1', parentId: 'g1' }, // into its own child: refused
      { type: 'node.update', projectId: p, nodeId: 'g1', starred: true },
    ]
    const plan = planOps(recordsIn(board), ops, AT)
    expect(plan.refused).toEqual([{ index: 3, reason: '不能把节点移到它自己的下级' }])
    expect(plan.applied).toHaveLength(4)
    const done = applyAll(board, plan.applied)
    expect(normRecords(plan.after)).toBe(normRecords(recordsIn(done)))
    const undone = applyAll(done, plan.inverse)
    expect(normRecords(recordsIn(undone))).toBe(normRecords(recordsIn(board)))
  })

  it('leaves an op that changes nothing out of the batch', () => {
    const board = rich()
    const plan = planOps(recordsIn(board), [{ type: 'node.update', projectId: p, nodeId: 'd3', starred: true }, { type: 'link.update', projectId: p, linkId: 'l2', category: null }], AT)
    expect(plan.applied).toEqual([])
    expect(plan.inverse).toEqual([])
    expect(plan.refused).toEqual([])
    expect(plan.after).toBe(recordsIn(board))
  })

  it('redo is the same ops again: forward → inverse → forward lands where forward did', () => {
    const board = rich()
    const ops: RecordOp[] = [
      { type: 'node.delete', projectId: p, nodeId: 'd1' },
      { type: 'relation.update', projectId: p, relationId: 'x2', directed: true },
      { type: 'category.delete', projectId: p, kind: 'edge', categoryId: 'e1' },
    ]
    const plan = planOps(recordsIn(board), ops, AT)
    const forward = applyAll(board, plan.applied)
    const back = applyAll(forward, plan.inverse)
    expect(normRecords(recordsIn(back))).toBe(normRecords(recordsIn(board)))
    const again = applyAll(back, plan.applied)
    expect(normRecords(recordsIn(again))).toBe(normRecords(recordsIn(forward)))
    expect(relationsOf(recordsIn(again)).find((r) => r.id === 'x2')!.directed).toBe(true)
  })
})

describe('stress', () => {
  it('every random op can be undone exactly, and a whole run can be undone and redone', () => {
    const random = rng(99)
    let board = baseBoard()
    const stack: { forward: RecordOp; inverse: RecordOp[]; before: string }[] = []
    let checked = 0
    for (let step = 0; step < 3000; step++) {
      const op = randomRecordOp(random)
      const before: ProjectRecords = recordsIn(board)
      const result = applyRecordOp(before, op, AT)
      if (!result.ok || result.records === before) continue
      const inverse = invertRecordOp(before, op)
      // One op at a time: the inverse of the op brings the records back.
      const undone = applyAll(apply(board, op), inverse)
      expect(normRecords(recordsIn(undone)), JSON.stringify(op)).toBe(normRecords(before))
      checked += 1
      stack.push({ forward: op, inverse, before: normRecords(before) })
      board = apply(board, op)
    }
    expect(checked).toBeGreaterThan(300)
    // The whole run, undone from the end, passes through every earlier state.
    const final = normRecords(recordsIn(board))
    let walking = board
    for (let i = stack.length - 1; i >= 0; i--) {
      walking = applyAll(walking, stack[i]!.inverse)
      if (i % 25 === 0) expect(normRecords(recordsIn(walking)), `undo step ${i}`).toBe(stack[i]!.before)
    }
    expect(normRecords(recordsIn(walking))).toBe(stack[0]!.before)
    // And redone from the start, it ends where it ended.
    for (const entry of stack) walking = apply(walking, entry.forward)
    expect(normRecords(recordsIn(walking))).toBe(final)
    checkInvariants(recordsIn(walking))
  })
})
