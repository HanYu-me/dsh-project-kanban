/**
 * Tests for the data/result records model (src/shared/records.ts) as it is
 * reached through the board: every change goes through `applyOp`, and the
 * records are inspected as plain data. Timestamps are passed explicitly.
 */
import { describe, expect, it } from 'vitest'
import { applyOp, applyOps, emptyBoard, newId, recordsOf, sanitizeBoard } from '../src/shared/board'
import type { Board, Op } from '../src/shared/board'
import {
  EMPTY_RECORDS,
  RECORD_LIMITS,
  childrenOf,
  heightBelow,
  inPreorder,
  indexNodes,
  isInSubtree,
  levelOf,
  listOf,
  recordCounts,
  sanitizeRecords,
  subtreeIds,
} from '../src/shared/records'
import type { ProjectRecords, RecordNode, RecordOp, RecordSide } from '../src/shared/records'

const AT = '2024-01-01T00:00:00.000Z'
const LATER = '2024-02-03T04:05:06.000Z'

function mustApply(board: Board, op: Op): Board {
  const result = applyOp(board, op)
  if (!result.ok) throw new Error(`expected op to apply, refused with: ${result.reason}`)
  return result.board
}

function mustRefuse(board: Board, op: Op): string {
  const result = applyOp(board, op)
  if (result.ok) throw new Error(`expected op to be refused: ${JSON.stringify(op)}`)
  expect(result.board).toBe(board)
  return result.reason
}

const base = (): Board => mustApply(emptyBoard(), { type: 'project.add', id: 'p1', name: 'Alpha', at: AT })
const rec = (board: Board): ProjectRecords => recordsOf(board.projects[0]!)

function add(board: Board, side: RecordSide, id: string, name = id, parentId?: string | null, beforeId?: string | null, extra: Partial<Extract<RecordOp, { type: 'node.add' }>> = {}): Board {
  return mustApply(board, { type: 'node.add', projectId: 'p1', side, id, name, parentId, beforeId, at: AT, ...extra })
}

const ids = (nodes: readonly RecordNode[]): string[] => nodes.map((node) => node.id)
const kids = (board: Board, side: RecordSide, parentId: string | null): string[] => ids(childrenOf(indexNodes(listOf(rec(board), side)), parentId))
const node = (board: Board, id: string): RecordNode => {
  const found = [...rec(board).data, ...rec(board).results].find((item) => item.id === id)
  if (!found) throw new Error(`no node ${id}`)
  return found
}

/** A small chapter tree: d1 > (d2, d3 > d4), d5; results r1 > r2, r3. */
function sample(): Board {
  let board = base()
  board = add(board, 'data', 'd1', '第一章')
  board = add(board, 'data', 'd2', '原始计数', 'd1')
  board = add(board, 'data', 'd3', '过滤后', 'd1')
  board = add(board, 'data', 'd4', '质控报告', 'd3')
  board = add(board, 'data', 'd5', '参考基因组')
  board = add(board, 'result', 'r1', '图 1')
  board = add(board, 'result', 'r2', '图 1a', 'r1')
  board = add(board, 'result', 'r3', '表 1')
  return board
}

describe('node.add', () => {
  it('adds a node with defaults at the end of its siblings', () => {
    const board = add(base(), 'data', 'd1', 'GWAS 汇总统计', null, null, { path: '/data/gwas/sumstats.tsv.gz', description: 'n=12,345' })
    expect(rec(board).data).toEqual([
      { id: 'd1', name: 'GWAS 汇总统计', path: '/data/gwas/sumstats.tsv.gz', description: 'n=12,345', parentId: null, collapsed: false, createdAt: AT, updatedAt: AT },
    ])
    expect(rec(board).results).toEqual([])
    expect(rec(board).links).toEqual([])
    const second = add(board, 'data', 'd2')
    expect(kids(second, 'data', null)).toEqual(['d1', 'd2'])
  })

  it('keeps the two trees apart and never touches other projects', () => {
    let board = mustApply(base(), { type: 'project.add', id: 'p2', name: 'Beta', at: AT })
    board = add(board, 'data', 'd1')
    board = add(board, 'result', 'r1')
    expect(rec(board).data.map((n) => n.id)).toEqual(['d1'])
    expect(rec(board).results.map((n) => n.id)).toEqual(['r1'])
    expect(board.projects[1]!.records).toBeUndefined()
  })

  it('nests under a parent and honours beforeId only among its siblings', () => {
    let board = sample()
    board = add(board, 'data', 'd6', '新的', 'd1', 'd3')
    expect(kids(board, 'data', 'd1')).toEqual(['d2', 'd6', 'd3'])
    // An anchor under a different parent is no anchor: the node goes last.
    board = add(board, 'data', 'd7', '另一个', 'd1', 'd5')
    expect(kids(board, 'data', 'd1')).toEqual(['d2', 'd6', 'd3', 'd7'])
    board = add(board, 'data', 'd8', '顶层', null, 'd5')
    expect(kids(board, 'data', null)).toEqual(['d1', 'd8', 'd5'])
  })

  it('collapses whitespace in names, keeps inner spacing in paths', () => {
    const board = add(base(), 'data', 'd1', '  两  个   空格 ', null, null, { path: '  /a b/  c.txt \n', description: ' 一\r\n二 ' })
    expect(node(board, 'd1')).toMatchObject({ name: '两 个 空格', path: '/a b/  c.txt', description: '一\n二' })
  })

  it('refuses bad input and reports why', () => {
    const board = sample()
    const op = (extra: Partial<Extract<RecordOp, { type: 'node.add' }>>): Op => ({ type: 'node.add', projectId: 'p1', side: 'data', id: 'x1', name: 'X', at: AT, ...extra })
    expect(mustRefuse(board, op({ projectId: 'nope' }))).toBe('项目不存在')
    expect(mustRefuse(board, op({ side: 'both' as unknown as RecordSide }))).toBe('分类无效')
    expect(mustRefuse(board, op({ id: 'bad id!' }))).toBe('节点 id 无效')
    expect(mustRefuse(board, op({ id: 'd1' }))).toBe('节点已存在')
    // Ids are unique across both trees, so a link can name a node without its side.
    expect(mustRefuse(board, op({ id: 'r1' }))).toBe('节点已存在')
    expect(mustRefuse(board, op({ name: '   ' }))).toContain('名称')
    expect(mustRefuse(board, op({ name: 'x'.repeat(RECORD_LIMITS.name + 1) }))).toContain('名称')
    expect(mustRefuse(board, op({ path: 'x'.repeat(RECORD_LIMITS.path + 1) }))).toContain('完整路径')
    expect(mustRefuse(board, op({ description: 'x'.repeat(RECORD_LIMITS.description + 1) }))).toContain('描述')
    expect(mustRefuse(board, op({ parentId: 'nope' }))).toBe('上级节点不存在')
    // A parent has to be in the same tree.
    expect(mustRefuse(board, op({ parentId: 'r1' }))).toBe('上级节点不存在')
    expect(mustRefuse(board, op({ name: 7 as unknown as string }))).toContain('名称')
  })

  it('accepts the longest allowed texts', () => {
    const board = add(base(), 'data', 'd1', 'n'.repeat(RECORD_LIMITS.name), null, null, { path: 'p'.repeat(RECORD_LIMITS.path), description: 'd'.repeat(RECORD_LIMITS.description) })
    expect(node(board, 'd1').path).toHaveLength(RECORD_LIMITS.path)
  })

  it('stops at the depth limit', () => {
    let board = add(base(), 'data', 'n0')
    for (let level = 1; level < RECORD_LIMITS.depth; level++) board = add(board, 'data', `n${level}`, `n${level}`, `n${level - 1}`)
    expect(levelOf(indexNodes(rec(board).data), `n${RECORD_LIMITS.depth - 1}`)).toBe(RECORD_LIMITS.depth - 1)
    expect(mustRefuse(board, { type: 'node.add', projectId: 'p1', side: 'data', id: 'deep', name: 'deep', parentId: `n${RECORD_LIMITS.depth - 1}` })).toContain('层级')
  })

  it('stops at the node limit of one tree only', () => {
    const data: RecordNode[] = Array.from({ length: RECORD_LIMITS.nodesPerSide }, (_, i) => ({ id: `n${i}`, name: `n${i}`, path: '', description: '', parentId: null, collapsed: false, createdAt: AT, updatedAt: AT }))
    const board = { ...base(), projects: [{ ...base().projects[0]!, records: { data, results: [], links: [] } }] }
    expect(mustRefuse(board, { type: 'node.add', projectId: 'p1', side: 'data', id: 'one-more', name: 'x' })).toContain('上限')
    expect(rec(add(board, 'result', 'r1')).results).toHaveLength(1)
  })
})

describe('node.update', () => {
  it('changes only the given fields and stamps updatedAt on content changes', () => {
    const board = mustApply(sample(), { type: 'node.update', projectId: 'p1', nodeId: 'd2', name: '  新名字 ', path: '/x/y', description: '说明', at: LATER })
    expect(node(board, 'd2')).toMatchObject({ name: '新名字', path: '/x/y', description: '说明', parentId: 'd1', createdAt: AT, updatedAt: LATER })
    const partial = mustApply(board, { type: 'node.update', projectId: 'p1', nodeId: 'd2', description: '', at: '2025-01-01T00:00:00.000Z' })
    expect(node(partial, 'd2')).toMatchObject({ name: '新名字', path: '/x/y', description: '' })
  })

  it('folding does not count as an edit', () => {
    const board = mustApply(sample(), { type: 'node.update', projectId: 'p1', nodeId: 'd1', collapsed: true, at: LATER })
    expect(node(board, 'd1')).toMatchObject({ collapsed: true, updatedAt: AT })
  })

  it('returns the very same board when nothing would change', () => {
    const board = sample()
    expect(applyOp(board, { type: 'node.update', projectId: 'p1', nodeId: 'd1', name: '第一章', at: LATER })).toEqual({ ok: true, board })
    expect(applyOp(board, { type: 'node.update', projectId: 'p1', nodeId: 'd1', collapsed: false })).toEqual({ ok: true, board })
    expect(applyOp(board, { type: 'node.update', projectId: 'p1', nodeId: 'd1' })).toEqual({ ok: true, board })
  })

  it('refuses unknown nodes and bad values', () => {
    const board = sample()
    expect(mustRefuse(board, { type: 'node.update', projectId: 'p1', nodeId: 'nope', name: 'x' })).toBe('节点不存在')
    expect(mustRefuse(board, { type: 'node.update', projectId: 'nope', nodeId: 'd1', name: 'x' })).toBe('项目不存在')
    expect(mustRefuse(board, { type: 'node.update', projectId: 'p1', nodeId: 'd1', name: ' ' })).toContain('名称')
    expect(mustRefuse(board, { type: 'node.update', projectId: 'p1', nodeId: 'd1', path: 'x'.repeat(RECORD_LIMITS.path + 1) })).toContain('完整路径')
    expect(mustRefuse(board, { type: 'node.update', projectId: 'p1', nodeId: 'd1', collapsed: 'yes' as unknown as boolean })).toBe('无效操作')
  })
})

describe('node.move', () => {
  const move = (board: Board, nodeId: string, parentId: string | null, beforeId?: string | null): Board => mustApply(board, { type: 'node.move', projectId: 'p1', nodeId, parentId, beforeId })

  it('reorders among siblings', () => {
    let board = move(sample(), 'd3', 'd1', 'd2')
    expect(kids(board, 'data', 'd1')).toEqual(['d3', 'd2'])
    board = move(board, 'd3', 'd1')
    expect(kids(board, 'data', 'd1')).toEqual(['d2', 'd3'])
    board = move(board, 'd5', null, 'd1')
    expect(kids(board, 'data', null)).toEqual(['d5', 'd1'])
  })

  it('merges a node into another one (it becomes the last child) and brings its subtree along', () => {
    const board = move(sample(), 'd5', 'd3')
    expect(kids(board, 'data', 'd3')).toEqual(['d4', 'd5'])
    const merged = move(sample(), 'd3', 'd5')
    expect(kids(merged, 'data', 'd5')).toEqual(['d3'])
    expect(kids(merged, 'data', null)).toEqual(['d1', 'd5'])
    expect(subtreeIds(indexNodes(rec(merged).data), 'd5').sort()).toEqual(['d3', 'd4', 'd5'])
    // The subtree travels as one block, right after its new parent.
    expect(ids(rec(merged).data)).toEqual(['d1', 'd2', 'd5', 'd3', 'd4'])
  })

  it('moves a node back to the top level', () => {
    const board = move(sample(), 'd4', null, 'd5')
    expect(kids(board, 'data', null)).toEqual(['d1', 'd4', 'd5'])
    expect(kids(board, 'data', 'd3')).toEqual([])
  })

  it('does not count a move as an edit', () => {
    expect(node(mustApply(sample(), { type: 'node.move', projectId: 'p1', nodeId: 'd5', parentId: 'd1' }), 'd5').updatedAt).toBe(AT)
  })

  it('refuses cycles, other-tree parents and unknown ids', () => {
    const board = sample()
    const refuse = (nodeId: string, parentId: string | null): string => mustRefuse(board, { type: 'node.move', projectId: 'p1', nodeId, parentId })
    expect(refuse('d1', 'd1')).toContain('下级')
    expect(refuse('d1', 'd4')).toContain('下级')
    expect(refuse('d3', 'd4')).toContain('下级')
    expect(refuse('d1', 'r1')).toBe('上级节点不存在')
    expect(refuse('d1', 'nope')).toBe('上级节点不存在')
    expect(refuse('nope', null)).toBe('节点不存在')
    expect(mustRefuse(board, { type: 'node.move', projectId: 'p1', nodeId: 'd1', parentId: undefined as unknown as null })).toBe('无效操作')
  })

  it('treats an anchor under another parent as no anchor', () => {
    const board = move(sample(), 'd5', 'd1', 'r1')
    expect(kids(board, 'data', 'd1')).toEqual(['d2', 'd3', 'd5'])
  })

  it('returns the very same board for a move that changes nothing', () => {
    const board = sample()
    for (const op of [
      { nodeId: 'd2', parentId: 'd1', beforeId: 'd3' },
      { nodeId: 'd3', parentId: 'd1', beforeId: null },
      { nodeId: 'd5', parentId: null, beforeId: null },
      { nodeId: 'd5', parentId: null, beforeId: 'd5' },
      { nodeId: 'd1', parentId: null, beforeId: 'd5' },
    ]) {
      expect(applyOp(board, { type: 'node.move', projectId: 'p1', ...op })).toEqual({ ok: true, board })
    }
  })

  it('stops a move that would make the tree too deep', () => {
    let board = add(base(), 'data', 'n0')
    for (let level = 1; level < RECORD_LIMITS.depth - 1; level++) board = add(board, 'data', `n${level}`, `n${level}`, `n${level - 1}`)
    board = add(board, 'data', 'top')
    board = add(board, 'data', 'sub', 'sub', 'top')
    const deepest = `n${RECORD_LIMITS.depth - 2}`
    // `top` has one level below it; hanging it under the deepest allowed node would need one level too many.
    expect(mustRefuse(board, { type: 'node.move', projectId: 'p1', nodeId: 'top', parentId: deepest })).toContain('层级')
    expect(kids(move(board, 'sub', deepest), 'data', deepest)).toEqual(['sub'])
  })
})

describe('node.delete', () => {
  function linked(): Board {
    let board = sample()
    for (const [id, dataId, resultId] of [
      ['l1', 'd2', 'r2'],
      ['l2', 'd4', 'r2'],
      ['l3', 'd3', 'r3'],
      ['l4', 'd5', 'r1'],
    ] as const) {
      board = mustApply(board, { type: 'link.add', projectId: 'p1', id, dataId, resultId, at: AT })
    }
    return board
  }

  it('removes the node, its subtree and every link that touched them', () => {
    const board = mustApply(linked(), { type: 'node.delete', projectId: 'p1', nodeId: 'd3' })
    expect(ids(rec(board).data)).toEqual(['d1', 'd2', 'd5'])
    expect(rec(board).links.map((link) => link.id)).toEqual(['l1', 'l4'])
    expect(ids(rec(board).results)).toEqual(['r1', 'r2', 'r3'])
  })

  it('with lift removes only the node: its children move up into its place and keep their links', () => {
    const board = mustApply(linked(), { type: 'node.delete', projectId: 'p1', nodeId: 'd3', lift: true })
    expect(kids(board, 'data', 'd1')).toEqual(['d2', 'd4'])
    expect(node(board, 'd4').parentId).toBe('d1')
    // The node's own link goes, its children's links stay.
    expect(rec(board).links.map((link) => link.id)).toEqual(['l1', 'l2', 'l4'])
    const top = mustApply(linked(), { type: 'node.delete', projectId: 'p1', nodeId: 'd1', lift: true })
    expect(kids(top, 'data', null)).toEqual(['d2', 'd3', 'd5'])
  })

  it('lifted children take the slot of the deleted node among its siblings', () => {
    let board = base()
    board = add(board, 'data', 'a')
    board = add(board, 'data', 'g')
    board = add(board, 'data', 'b')
    board = add(board, 'data', 'k1', 'k1', 'g')
    board = add(board, 'data', 'k2', 'k2', 'g')
    board = mustApply(board, { type: 'node.delete', projectId: 'p1', nodeId: 'g', lift: true })
    expect(kids(board, 'data', null)).toEqual(['a', 'k1', 'k2', 'b'])
  })

  it('refuses unknown nodes', () => {
    expect(mustRefuse(sample(), { type: 'node.delete', projectId: 'p1', nodeId: 'nope' })).toBe('节点不存在')
    expect(mustRefuse(sample(), { type: 'node.delete', projectId: 'nope', nodeId: 'd1' })).toBe('项目不存在')
  })
})

describe('node.restore', () => {
  /** What the UI sends to undo a delete: the subtree in array order, its links, and the root's slot. */
  function undoOf(board: Board, side: RecordSide, rootId: string): RecordOp {
    const records = rec(board)
    const list = listOf(records, side)
    const gone = new Set(subtreeIds(indexNodes(list), rootId))
    const rootAt = list.findIndex((item) => item.id === rootId)
    const before = list.slice(0, rootAt).filter((item) => gone.has(item.id)).length
    return {
      type: 'node.restore',
      projectId: 'p1',
      side,
      nodes: list.filter((item) => gone.has(item.id)),
      links: records.links.filter((link) => gone.has(link.dataId) || gone.has(link.resultId)),
      index: rootAt - before,
    }
  }

  function linked(): Board {
    let board = sample()
    board = mustApply(board, { type: 'link.add', projectId: 'p1', id: 'l1', dataId: 'd4', resultId: 'r2', at: AT })
    return mustApply(board, { type: 'link.add', projectId: 'p1', id: 'l2', dataId: 'd2', resultId: 'r3', at: AT })
  }

  it('undoes a subtree delete exactly, links included', () => {
    const board = linked()
    // Restored links come back at the end of the list; their order carries no meaning.
    const byLinkId = (b: Board): Board => ({ ...b, projects: [{ ...b.projects[0]!, records: { ...rec(b), links: rec(b).links.slice().sort((x, y) => x.id.localeCompare(y.id)) } }] })
    for (const [side, id] of [['data', 'd3'], ['data', 'd1'], ['data', 'd5'], ['result', 'r1']] as const) {
      const undo = undoOf(board, side, id)
      const deleted = mustApply(board, { type: 'node.delete', projectId: 'p1', nodeId: id })
      expect(byLinkId(mustApply(deleted, undo)), `${side}:${id}`).toEqual(byLinkId(board))
    }
  })

  it('restores into the right slot even when a child sits before its parent in the array', () => {
    let board = base()
    board = add(board, 'data', 'a')
    board = add(board, 'data', 'x')
    board = add(board, 'data', 'b')
    board = add(board, 'data', 'c', 'c', 'x')
    // Pull the child in front of everything: the array is now [c, a, x, b].
    board = mustApply(board, { type: 'node.move', projectId: 'p1', nodeId: 'c', parentId: 'x' })
    // Hand-edited file: the child comes first, before its parent.
    const list = [rec(board).data.find((n) => n.id === 'c')!, ...rec(board).data.filter((n) => n.id !== 'c')]
    board = { ...board, projects: [{ ...board.projects[0]!, records: { ...rec(board), data: list } }] }
    expect(ids(rec(board).data)).toEqual(['c', 'a', 'x', 'b'])
    const undo = undoOf(board, 'data', 'x')
    const restored = mustApply(mustApply(board, { type: 'node.delete', projectId: 'p1', nodeId: 'x' }), undo)
    expect(kids(restored, 'data', null)).toEqual(['a', 'x', 'b'])
    expect(kids(restored, 'data', 'x')).toEqual(['c'])
  })

  it('undoes a lift by restoring the node and moving its children back in', () => {
    const board = linked()
    const node3 = node(board, 'd3')
    const lifted = mustApply(board, { type: 'node.delete', projectId: 'p1', nodeId: 'd3', lift: true })
    const back = applyOps(lifted, [
      { type: 'node.restore', projectId: 'p1', side: 'data', nodes: [node3], links: [], index: 2 },
      { type: 'node.move', projectId: 'p1', nodeId: 'd4', parentId: 'd3', beforeId: null },
    ])
    expect(back.refused).toEqual([])
    expect(kids(back.board, 'data', 'd1')).toEqual(['d2', 'd3'])
    expect(kids(back.board, 'data', 'd3')).toEqual(['d4'])
  })

  it('drops links whose other end was deleted in the meantime', () => {
    const board = linked()
    const undo = undoOf(board, 'data', 'd3')
    const gone = mustApply(mustApply(board, { type: 'node.delete', projectId: 'p1', nodeId: 'd3' }), { type: 'node.delete', projectId: 'p1', nodeId: 'r1' })
    const restored = mustApply(gone, undo)
    expect(kids(restored, 'data', 'd3')).toEqual(['d4'])
    expect(rec(restored).links.map((link) => link.id)).toEqual(['l2'])
  })

  it('refuses data that cannot be put back', () => {
    const board = sample()
    const one = (extra: Partial<RecordNode> = {}): RecordNode => ({ id: 'x1', name: 'X', path: '', description: '', parentId: null, collapsed: false, createdAt: AT, updatedAt: AT, ...extra })
    const restore = (nodes: unknown[], extra: Partial<Extract<RecordOp, { type: 'node.restore' }>> = {}): Op => ({ type: 'node.restore', projectId: 'p1', side: 'data', nodes: nodes as RecordNode[], links: [], index: 0, ...extra })
    expect(mustRefuse(board, restore([]))).toBe('节点数据无效')
    expect(mustRefuse(board, restore('nope' as unknown as unknown[]))).toBe('节点数据无效')
    expect(mustRefuse(board, restore([{ id: 'x1' }]))).toBe('节点数据无效')
    expect(mustRefuse(board, restore([one({ id: 'd1' })]))).toBe('节点已存在')
    expect(mustRefuse(board, restore([one({ id: 'r1' })]))).toBe('节点已存在')
    expect(mustRefuse(board, restore([one(), one()]))).toBe('节点已存在')
    expect(mustRefuse(board, restore([one(), one({ id: 'x2' })]))).toBe('节点数据无效')
    expect(mustRefuse(board, restore([one({ parentId: 'x2' }), one({ id: 'x2', parentId: 'x1' })]))).toBe('节点数据无效')
    expect(mustRefuse(board, restore([one({ parentId: 'gone' })]))).toBe('上级节点不存在')
    expect(mustRefuse(board, restore([one()], { side: 'x' as unknown as RecordSide }))).toBe('分类无效')
    expect(mustRefuse(board, restore([one({ parentId: 'r1' })]))).toBe('上级节点不存在')
  })

  it('clamps the index', () => {
    const board = sample()
    const x: RecordNode = { id: 'x1', name: 'X', path: '', description: '', parentId: null, collapsed: false, createdAt: AT, updatedAt: AT }
    expect(kids(mustApply(board, { type: 'node.restore', projectId: 'p1', side: 'data', nodes: [x], links: [], index: 99 }), 'data', null)).toEqual(['d1', 'd5', 'x1'])
    expect(kids(mustApply(board, { type: 'node.restore', projectId: 'p1', side: 'data', nodes: [x], links: [], index: -5 }), 'data', null)).toEqual(['x1', 'd1', 'd5'])
  })
})

describe('link.add and link.delete', () => {
  it('links a data node to a result node', () => {
    const board = mustApply(sample(), { type: 'link.add', projectId: 'p1', id: 'l1', dataId: 'd2', resultId: 'r2', at: AT })
    expect(rec(board).links).toEqual([{ id: 'l1', dataId: 'd2', resultId: 'r2', createdAt: AT }])
    // Many-to-many: one data node feeds several results, one result has several sources.
    const more = mustApply(mustApply(board, { type: 'link.add', projectId: 'p1', id: 'l2', dataId: 'd2', resultId: 'r3', at: AT }), { type: 'link.add', projectId: 'p1', id: 'l3', dataId: 'd4', resultId: 'r2', at: AT })
    expect(recordCounts(rec(more))).toEqual({ data: 5, results: 3, links: 3 })
  })

  it('refuses duplicates, wrong sides, missing nodes and bad ids', () => {
    const board = mustApply(sample(), { type: 'link.add', projectId: 'p1', id: 'l1', dataId: 'd2', resultId: 'r2', at: AT })
    const link = (extra: Partial<Extract<RecordOp, { type: 'link.add' }>>): Op => ({ type: 'link.add', projectId: 'p1', id: 'l9', dataId: 'd1', resultId: 'r1', ...extra })
    expect(mustRefuse(board, link({ id: 'l1' }))).toBe('连线已存在')
    expect(mustRefuse(board, link({ dataId: 'd2', resultId: 'r2' }))).toBe('连线已存在')
    expect(mustRefuse(board, link({ dataId: 'r1', resultId: 'r2' }))).toBe('数据节点不存在')
    expect(mustRefuse(board, link({ dataId: 'd1', resultId: 'd2' }))).toBe('结果节点不存在')
    expect(mustRefuse(board, link({ dataId: 'nope' }))).toBe('数据节点不存在')
    expect(mustRefuse(board, link({ resultId: 'nope' }))).toBe('结果节点不存在')
    expect(mustRefuse(board, link({ id: 'bad id' }))).toBe('连线 id 无效')
    expect(mustRefuse(board, link({ projectId: 'nope' }))).toBe('项目不存在')
  })

  it('stops at the link limit', () => {
    const grid = 72
    const nodeOf = (id: string): RecordNode => ({ id, name: id, path: '', description: '', parentId: null, collapsed: false, createdAt: AT, updatedAt: AT })
    const data = Array.from({ length: grid }, (_, i) => nodeOf(`d${i}`))
    const results = Array.from({ length: grid }, (_, i) => nodeOf(`r${i}`))
    const links = Array.from({ length: RECORD_LIMITS.links }, (_, i) => ({ id: `l${i}`, dataId: `d${Math.floor(i / grid)}`, resultId: `r${i % grid}`, createdAt: AT }))
    const withLinks = (list: typeof links): Board => ({ ...base(), projects: [{ ...base().projects[0]!, records: { data, results, links: list } }] })
    // The next pair in the grid is not linked yet, so only the limit can refuse it.
    const next = { dataId: `d${Math.floor(RECORD_LIMITS.links / grid)}`, resultId: `r${RECORD_LIMITS.links % grid}` }
    expect(mustRefuse(withLinks(links), { type: 'link.add', projectId: 'p1', id: 'extra', ...next })).toContain('上限')
    expect(rec(mustApply(withLinks(links.slice(1)), { type: 'link.add', projectId: 'p1', id: 'extra', ...next })).links).toHaveLength(RECORD_LIMITS.links)
  })

  it('deletes a link and refuses unknown ones', () => {
    const board = mustApply(sample(), { type: 'link.add', projectId: 'p1', id: 'l1', dataId: 'd2', resultId: 'r2', at: AT })
    expect(rec(mustApply(board, { type: 'link.delete', projectId: 'p1', linkId: 'l1' })).links).toEqual([])
    expect(mustRefuse(board, { type: 'link.delete', projectId: 'p1', linkId: 'nope' })).toBe('连线不存在')
  })
})

describe('tree helpers', () => {
  const index = indexNodes(rec(sample()).data)

  it('index, level, subtree, height and membership agree', () => {
    expect(ids(childrenOf(index, null))).toEqual(['d1', 'd5'])
    expect(ids(childrenOf(index, 'd1'))).toEqual(['d2', 'd3'])
    expect(childrenOf(index, 'd4')).toEqual([])
    expect([levelOf(index, 'd1'), levelOf(index, 'd3'), levelOf(index, 'd4')]).toEqual([0, 1, 2])
    expect(subtreeIds(index, 'd1')).toEqual(['d1', 'd2', 'd3', 'd4'])
    expect([heightBelow(index, 'd1'), heightBelow(index, 'd3'), heightBelow(index, 'd4')]).toEqual([2, 1, 0])
    expect(isInSubtree(index, 'd1', 'd4')).toBe(true)
    expect(isInSubtree(index, 'd1', 'd1')).toBe(true)
    expect(isInSubtree(index, 'd3', 'd2')).toBe(false)
    expect(isInSubtree(index, 'd4', 'd1')).toBe(false)
  })

  it('survive a broken chain without looping', () => {
    const loop = indexNodes([
      { id: 'a', name: 'a', path: '', description: '', parentId: 'b', collapsed: false, createdAt: AT, updatedAt: AT },
      { id: 'b', name: 'b', path: '', description: '', parentId: 'a', collapsed: false, createdAt: AT, updatedAt: AT },
    ])
    expect(levelOf(loop, 'a')).toBeGreaterThan(0)
    expect(isInSubtree(loop, 'z', 'a')).toBe(false)
    expect(subtreeIds(loop, 'a').sort()).toEqual(['a', 'b'])
    expect(heightBelow(loop, 'a')).toBe(1)
  })
})

describe('inPreorder', () => {
  const nodeOf = (id: string, parentId: string | null): RecordNode => ({ id, name: id, path: '', description: '', parentId, collapsed: false, createdAt: AT, updatedAt: AT })

  it('puts every subtree right after its parent and keeps sibling order', () => {
    const list = [nodeOf('c1', 'p'), nodeOf('z', null), nodeOf('p', null), nodeOf('c2', 'p'), nodeOf('g', 'c1')]
    expect(ids(inPreorder(list))).toEqual(['z', 'p', 'c1', 'g', 'c2'])
  })

  it('returns the same array when it is already in order, and keeps unreachable nodes', () => {
    const ordered = [nodeOf('a', null), nodeOf('b', 'a'), nodeOf('c', null)]
    expect(inPreorder(ordered)).toBe(ordered)
    expect(ids(inPreorder([nodeOf('a', null), nodeOf('lost', 'nowhere')]))).toEqual(['a', 'lost'])
  })

  it('is what keeps the stored array readable after adds and moves', () => {
    let board = add(base(), 'data', 'a')
    board = add(board, 'data', 'b')
    board = add(board, 'data', 'a1', 'a1', 'a')
    board = add(board, 'data', 'c')
    board = add(board, 'data', 'b1', 'b1', 'b')
    expect(ids(rec(board).data)).toEqual(['a', 'a1', 'b', 'b1', 'c'])
    board = mustApply(board, { type: 'node.move', projectId: 'p1', nodeId: 'b', parentId: 'a' })
    expect(ids(rec(board).data)).toEqual(['a', 'a1', 'b', 'b1', 'c'])
    board = mustApply(board, { type: 'node.move', projectId: 'p1', nodeId: 'c', parentId: 'a', beforeId: 'a1' })
    expect(ids(rec(board).data)).toEqual(['a', 'c', 'a1', 'b', 'b1'])
  })
})

describe('sanitizeRecords and sanitizeBoard', () => {
  const nodeOf = (id: string, parentId: string | null = null, extra: object = {}): object => ({ id, name: id, path: '', description: '', parentId, collapsed: false, createdAt: AT, updatedAt: AT, ...extra })

  it('keeps a valid set as it is', () => {
    const board = mustApply(sample(), { type: 'link.add', projectId: 'p1', id: 'l1', dataId: 'd2', resultId: 'r2', at: AT })
    expect(sanitizeRecords(JSON.parse(JSON.stringify(rec(board))))).toEqual(rec(board))
    expect(sanitizeBoard(JSON.parse(JSON.stringify(board)))).toEqual(board)
  })

  it('returns nothing for an empty or malformed value, and boards without records stay without', () => {
    expect(sanitizeRecords(undefined)).toBeUndefined()
    expect(sanitizeRecords('x')).toBeUndefined()
    expect(sanitizeRecords({ data: [], results: [], links: [] })).toBeUndefined()
    expect(sanitizeRecords({ data: [{ id: '??' }], results: 7 })).toBeUndefined()
    expect(sanitizeBoard(JSON.parse(JSON.stringify(base()))).projects[0]).not.toHaveProperty('records')
    expect(recordsOf(base().projects[0]!)).toBe(EMPTY_RECORDS)
  })

  it('drops malformed and duplicate nodes, also across the two trees', () => {
    const records = sanitizeRecords({
      data: [nodeOf('a'), nodeOf('a', null, { name: 'again' }), { id: 'b' }, nodeOf('c', null, { name: '  ' }), nodeOf('d', null, { path: 5 }), 'junk', null, nodeOf('e', 7 as unknown as string)],
      results: [nodeOf('a'), nodeOf('x'), nodeOf('y', null, { description: 'z'.repeat(RECORD_LIMITS.description + 1) })],
    })
    expect(ids(records!.data)).toEqual(['a'])
    expect(ids(records!.results)).toEqual(['x'])
  })

  it('puts the nodes of a hand-edited file back in parents-first order', () => {
    const records = sanitizeRecords({ data: [nodeOf('child', 'parent'), nodeOf('parent')], results: [] })!
    expect(ids(records.data)).toEqual(['parent', 'child'])
  })

  it('repairs parents: missing, self, other tree, and cycles', () => {
    const records = sanitizeRecords({
      data: [nodeOf('a', 'gone'), nodeOf('b', 'b'), nodeOf('c', 'r1'), nodeOf('p', 'q'), nodeOf('q', 'p'), nodeOf('ok', 'a')],
      results: [nodeOf('r1')],
    })!
    const parent = (id: string): string | null => records.data.find((n) => n.id === id)!.parentId
    expect([parent('a'), parent('b'), parent('c'), parent('ok')]).toEqual([null, null, null, 'a'])
    // A cycle is cut once; what is left is a chain that ends at the top.
    const index = indexNodes(records.data)
    expect(isInSubtree(index, 'p', 'q') !== isInSubtree(index, 'q', 'p')).toBe(true)
    for (const n of records.data) expect(levelOf(index, n.id)).toBeLessThan(records.data.length)
  })

  it('drops links with missing ends, on the wrong side, duplicated or malformed', () => {
    const records = sanitizeRecords({
      data: [nodeOf('d1'), nodeOf('d2')],
      results: [nodeOf('r1')],
      links: [
        { id: 'l1', dataId: 'd1', resultId: 'r1', createdAt: AT },
        { id: 'l1', dataId: 'd2', resultId: 'r1', createdAt: AT },
        { id: 'l2', dataId: 'd1', resultId: 'r1', createdAt: AT },
        { id: 'l3', dataId: 'r1', resultId: 'd1', createdAt: AT },
        { id: 'l4', dataId: 'd9', resultId: 'r1', createdAt: AT },
        { id: 'l5', dataId: 'd2', resultId: 'r9', createdAt: AT },
        { id: 'l6', dataId: 'd2' },
        'junk',
        { id: 'l7', dataId: 'd2', resultId: 'r1' },
      ],
    })!
    expect(records.links.map((link) => link.id)).toEqual(['l1', 'l7'])
    expect(records.links[1]!.createdAt).toBeTruthy()
  })
})

describe('immutability', () => {
  function deepFreeze<T>(value: T): T {
    if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
      Object.freeze(value)
      for (const child of Object.values(value)) deepFreeze(child)
    }
    return value
  }

  it('no record op mutates a deep-frozen board, even when refused', () => {
    let source = sample()
    source = mustApply(source, { type: 'link.add', projectId: 'p1', id: 'l1', dataId: 'd2', resultId: 'r2', at: AT })
    const expected = JSON.stringify(source)
    deepFreeze(source)
    const ghost: RecordNode = { id: 'g1', name: 'Ghost', path: '', description: '', parentId: null, collapsed: false, createdAt: AT, updatedAt: AT }
    const ops: Op[] = [
      { type: 'node.add', projectId: 'p1', side: 'data', id: 'n1', name: 'N', parentId: 'd1', beforeId: 'd2', at: AT },
      { type: 'node.add', projectId: 'p1', side: 'data', id: 'd1', name: 'Dup' },
      { type: 'node.update', projectId: 'p1', nodeId: 'd1', name: 'Renamed', path: '/p', description: 'x', collapsed: true, at: LATER },
      { type: 'node.update', projectId: 'p1', nodeId: 'nope', name: 'x' },
      { type: 'node.move', projectId: 'p1', nodeId: 'd5', parentId: 'd3', beforeId: 'd4' },
      { type: 'node.move', projectId: 'p1', nodeId: 'd1', parentId: 'd4' },
      { type: 'node.delete', projectId: 'p1', nodeId: 'd3' },
      { type: 'node.delete', projectId: 'p1', nodeId: 'd3', lift: true },
      { type: 'node.delete', projectId: 'p1', nodeId: 'r1' },
      { type: 'node.restore', projectId: 'p1', side: 'data', nodes: [ghost], links: [], index: 1 },
      { type: 'node.restore', projectId: 'p1', side: 'data', nodes: [{ ...ghost, id: 'd1' }], links: [], index: 1 },
      { type: 'link.add', projectId: 'p1', id: 'l2', dataId: 'd4', resultId: 'r3', at: AT },
      { type: 'link.add', projectId: 'p1', id: 'l1', dataId: 'd4', resultId: 'r3' },
      { type: 'link.delete', projectId: 'p1', linkId: 'l1' },
      { type: 'link.delete', projectId: 'p1', linkId: 'nope' },
    ]
    for (const op of ops) {
      const label = JSON.stringify(op)
      expect(() => applyOp(source, op), label).not.toThrow()
      expect(JSON.stringify(source), label).toBe(expected)
    }
  })
})

describe('stress', () => {
  /** A tiny seeded generator so a failure can be replayed. */
  function rng(seed: number): () => number {
    let state = seed
    return () => {
      state = (state * 1664525 + 1013904223) % 4294967296
      return state / 4294967296
    }
  }

  function check(records: ProjectRecords): void {
    const seen = new Set<string>()
    for (const side of ['data', 'result'] as const) {
      const list = listOf(records, side)
      const index = indexNodes(list)
      expect(ids(inPreorder(list)), `${side} is not parents-first`).toEqual(ids(list))
      for (const item of list) {
        expect(seen.has(item.id), `duplicate id ${item.id}`).toBe(false)
        seen.add(item.id)
        if (item.parentId !== null) expect(index.byId.has(item.parentId), `${item.id} has no parent ${item.parentId}`).toBe(true)
        expect(levelOf(index, item.id)).toBeLessThan(RECORD_LIMITS.depth)
        // The chain up from every node must end at the top (no cycle).
        let current: RecordNode | undefined = item
        for (let steps = 0; current && current.parentId !== null; steps++) {
          expect(steps).toBeLessThan(list.length)
          current = index.byId.get(current.parentId)
        }
      }
    }
    const pairs = new Set<string>()
    const linkIds = new Set<string>()
    const dataIds = new Set(records.data.map((item) => item.id))
    const resultIds = new Set(records.results.map((item) => item.id))
    for (const link of records.links) {
      expect(dataIds.has(link.dataId) && resultIds.has(link.resultId), `dangling link ${link.id}`).toBe(true)
      expect(pairs.has(`${link.dataId}>${link.resultId}`)).toBe(false)
      expect(linkIds.has(link.id)).toBe(false)
      pairs.add(`${link.dataId}>${link.resultId}`)
      linkIds.add(link.id)
    }
  }

  it('keeps trees acyclic, ids unique and links attached across 4000 random ops', () => {
    const random = rng(20241109)
    const pick = <T,>(items: readonly T[]): T => items[Math.floor(random() * items.length)]!
    const pool = Array.from({ length: 24 }, (_, i) => `n${i}`)
    const linkPool = Array.from({ length: 12 }, (_, i) => `l${i}`)
    let board = base()
    let applied = 0
    for (let step = 0; step < 4000; step++) {
      const roll = random()
      const anyNode = pick(pool)
      const parent = random() < 0.3 ? null : pick(pool)
      let op: Op
      if (roll < 0.28) op = { type: 'node.add', projectId: 'p1', side: random() < 0.6 ? 'data' : 'result', id: anyNode, name: anyNode, parentId: parent, beforeId: random() < 0.3 ? pick(pool) : null, at: AT }
      else if (roll < 0.55) op = { type: 'node.move', projectId: 'p1', nodeId: anyNode, parentId: parent, beforeId: random() < 0.5 ? pick(pool) : null }
      else if (roll < 0.65) op = { type: 'node.delete', projectId: 'p1', nodeId: anyNode, lift: random() < 0.5 }
      else if (roll < 0.72) op = { type: 'node.update', projectId: 'p1', nodeId: anyNode, collapsed: random() < 0.5, name: random() < 0.5 ? 'renamed' : undefined, at: LATER }
      else if (roll < 0.92) op = { type: 'link.add', projectId: 'p1', id: pick(linkPool), dataId: pick(pool), resultId: pick(pool), at: AT }
      else op = { type: 'link.delete', projectId: 'p1', linkId: pick(linkPool) }
      const result = applyOp(board, op)
      if (result.ok) {
        board = result.board
        applied += 1
      } else {
        expect(result.board).toBe(board)
      }
      check(rec(board))
    }
    expect(applied).toBeGreaterThan(400)
    expect(rec(board).data.length + rec(board).results.length).toBeGreaterThan(0)
  })

  it('newId makes ids for nodes and links that the model accepts', () => {
    const board = mustApply(base(), { type: 'node.add', projectId: 'p1', side: 'data', id: newId('n'), name: 'x' })
    expect(rec(mustApply(board, { type: 'node.add', projectId: 'p1', side: 'result', id: newId('n'), name: 'y' })).results).toHaveLength(1)
    expect(newId('l')).toMatch(/^l_[0-9a-z]{12}$/)
    expect(newId('n')).toMatch(/^n_[0-9a-z]{12}$/)
  })
})
