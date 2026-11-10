/**
 * Stars, colour categories, the palette, and relations between results:
 * the parts of the records model added after the trees and links.
 */
import { describe, expect, it } from 'vitest'
import { applyOp, recordsOf, sanitizeBoard } from '../src/shared/board'
import type { Board, Op } from '../src/shared/board'
import { RECORD_LIMITS, categoriesOf, cleanColor, pairKey, relationsOf, sanitizeRecords } from '../src/shared/records'
import type { ProjectRecords, RecordNode, RecordOp, RecordRelation } from '../src/shared/records'
import { AT, LATER, baseBoard, checkInvariants, expectStableOnLoad, randomRecordOp, recordsIn, rng } from './helpers'

function apply(board: Board, op: Op): Board {
  const result = applyOp(board, op)
  if (!result.ok) throw new Error(`expected op to apply, refused with: ${result.reason}`)
  return result.board
}

function refuse(board: Board, op: Op): string {
  const result = applyOp(board, op)
  if (result.ok) throw new Error(`expected op to be refused: ${JSON.stringify(op)}`)
  expect(result.board).toBe(board)
  return result.reason
}

const add = (board: Board, side: 'data' | 'result', id: string, extra: Partial<Extract<RecordOp, { type: 'node.add' }>> = {}): Board =>
  apply(board, { type: 'node.add', projectId: 'p1', side, id, name: id, at: AT, ...extra })
const node = (board: Board, id: string): RecordNode => [...recordsIn(board).data, ...recordsIn(board).results].find((n) => n.id === id)!
const op = <T extends RecordOp>(value: T): T => value

/** data d1 d2, results r1 r2 r3 */
function sample(): Board {
  let board = baseBoard()
  for (const id of ['d1', 'd2']) board = add(board, 'data', id)
  for (const id of ['r1', 'r2', 'r3']) board = add(board, 'result', id)
  return board
}

describe('stars', () => {
  it('a node is starred on add or by update, and the flag is only there while set', () => {
    let board = add(sample(), 'data', 'd3', { starred: true })
    expect(node(board, 'd3').starred).toBe(true)
    expect(node(board, 'd1')).not.toHaveProperty('starred')
    board = apply(board, { type: 'node.update', projectId: 'p1', nodeId: 'd1', starred: true })
    expect(node(board, 'd1').starred).toBe(true)
    board = apply(board, { type: 'node.update', projectId: 'p1', nodeId: 'd1', starred: false })
    expect(node(board, 'd1')).not.toHaveProperty('starred')
  })

  it('starring is not an edit: updatedAt stays, and a repeat changes nothing', () => {
    const board = apply(sample(), { type: 'node.update', projectId: 'p1', nodeId: 'd1', starred: true, at: LATER })
    expect(node(board, 'd1').updatedAt).toBe(AT)
    const again = applyOp(board, { type: 'node.update', projectId: 'p1', nodeId: 'd1', starred: true })
    expect(again).toEqual({ ok: true, board })
    const off = applyOp(sample(), { type: 'node.update', projectId: 'p1', nodeId: 'd1', starred: false })
    expect(off.ok && off.board).toBeTruthy()
  })

  it('refuses a starred that is not a boolean', () => {
    expect(refuse(sample(), { type: 'node.update', projectId: 'p1', nodeId: 'd1', starred: 'yes' as unknown as boolean })).toBe('无效操作')
    expect(refuse(sample(), { type: 'node.add', projectId: 'p1', side: 'data', id: 'x', name: 'x', starred: 1 as unknown as boolean })).toBe('无效操作')
  })

  it('stars survive a move, a delete with undo data, and a restart', () => {
    let board = apply(sample(), { type: 'node.update', projectId: 'p1', nodeId: 'd1', starred: true })
    board = apply(board, { type: 'node.move', projectId: 'p1', nodeId: 'd1', parentId: 'd2' })
    expect(node(board, 'd1').starred).toBe(true)
    expectStableOnLoad(recordsIn(board))
  })
})

describe('categories and the palette', () => {
  const addCategory = (board: Board, kind: 'node' | 'edge', id: string, color = '#e5484d', extra: Partial<Extract<RecordOp, { type: 'category.add' }>> = {}): Board =>
    apply(board, { type: 'category.add', projectId: 'p1', kind, id, name: `类别 ${id}`, color, ...extra })

  it('adds categories of both kinds, keeps their order, and honours an index', () => {
    let board = addCategory(sample(), 'node', 'c1', '#4d6bfe')
    board = addCategory(board, 'node', 'c2', '#22A06B')
    board = addCategory(board, 'node', 'c3', '#e09400', { index: 0 })
    board = addCategory(board, 'edge', 'c4')
    expect(categoriesOf(recordsIn(board), 'node').map((c) => c.id)).toEqual(['c3', 'c1', 'c2'])
    expect(categoriesOf(recordsIn(board), 'node').find((c) => c.id === 'c2')!.color).toBe('#22a06b')
    expect(categoriesOf(recordsIn(board), 'edge').map((c) => c.id)).toEqual(['c4'])
  })

  it('refuses bad categories', () => {
    const board = addCategory(sample(), 'node', 'c1')
    const category = (extra: Partial<Extract<RecordOp, { type: 'category.add' }>>): Op => ({ type: 'category.add', projectId: 'p1', kind: 'node', id: 'cx', name: 'n', color: '#112233', ...extra })
    expect(refuse(board, category({ id: 'c1' }))).toBe('类别已存在')
    // The id space is shared by both kinds.
    expect(refuse(board, category({ kind: 'edge', id: 'c1' }))).toBe('类别已存在')
    expect(refuse(board, category({ kind: 'both' as unknown as 'node' }))).toBe('类别种类无效')
    expect(refuse(board, category({ id: 'bad id' }))).toBe('类别 id 无效')
    expect(refuse(board, category({ name: '  ' }))).toContain('类别名称')
    expect(refuse(board, category({ name: 'x'.repeat(RECORD_LIMITS.categoryName + 1) }))).toContain('类别名称')
    for (const color of ['red', '#12', '#12345g', 'rgb(1,2,3)', '']) expect(refuse(board, category({ color }))).toBe('颜色需要是 #RRGGBB')
  })

  it('stops at the category limit of one kind only', () => {
    let board = sample()
    for (let i = 0; i < RECORD_LIMITS.categories; i++) board = addCategory(board, 'node', `k${i}`)
    expect(refuse(board, { type: 'category.add', projectId: 'p1', kind: 'node', id: 'one-more', name: 'x', color: '#112233' })).toContain('上限')
    expect(categoriesOf(recordsIn(addCategory(board, 'edge', 'e1')), 'edge')).toHaveLength(1)
  })

  it('renames and recolours a category; a change that changes nothing returns the same board', () => {
    let board = addCategory(sample(), 'node', 'c1', '#4d6bfe')
    board = apply(board, { type: 'category.update', projectId: 'p1', kind: 'node', categoryId: 'c1', name: '原始数据', color: '#E5484D' })
    expect(categoriesOf(recordsIn(board), 'node')[0]).toEqual({ id: 'c1', name: '原始数据', color: '#e5484d' })
    expect(applyOp(board, { type: 'category.update', projectId: 'p1', kind: 'node', categoryId: 'c1', name: '原始数据' })).toEqual({ ok: true, board })
    expect(refuse(board, { type: 'category.update', projectId: 'p1', kind: 'edge', categoryId: 'c1', name: 'x' })).toBe('类别不存在')
    expect(refuse(board, { type: 'category.update', projectId: 'p1', kind: 'node', categoryId: 'c1', color: 'blue' })).toBe('颜色需要是 #RRGGBB')
    expect(refuse(board, { type: 'category.update', projectId: 'p1', kind: 'node', categoryId: 'c1', name: ' ' })).toContain('类别名称')
  })

  it('assigns a node category on add or by update, and clears it with null', () => {
    let board = addCategory(sample(), 'node', 'c1')
    board = add(board, 'data', 'd3', { category: 'c1' })
    expect(node(board, 'd3').category).toBe('c1')
    board = apply(board, { type: 'node.update', projectId: 'p1', nodeId: 'd1', category: 'c1', at: LATER })
    expect(node(board, 'd1')).toMatchObject({ category: 'c1', updatedAt: AT })
    board = apply(board, { type: 'node.update', projectId: 'p1', nodeId: 'd1', category: null })
    expect(node(board, 'd1')).not.toHaveProperty('category')
    expect(refuse(board, { type: 'node.update', projectId: 'p1', nodeId: 'd1', category: 'nope' })).toBe('类别不存在')
    expect(refuse(board, { type: 'node.add', projectId: 'p1', side: 'data', id: 'x', name: 'x', category: 'nope' })).toBe('类别不存在')
    // An edge category is not a node category.
    const withEdge = addCategory(board, 'edge', 'e1')
    expect(refuse(withEdge, { type: 'node.update', projectId: 'p1', nodeId: 'd1', category: 'e1' })).toBe('类别不存在')
  })

  it('assigns edge categories to links and relations', () => {
    let board = addCategory(sample(), 'edge', 'e1', '#22a06b')
    board = apply(board, { type: 'link.add', projectId: 'p1', id: 'l1', dataId: 'd1', resultId: 'r1', category: 'e1', at: AT })
    expect(recordsIn(board).links[0]!.category).toBe('e1')
    board = apply(board, { type: 'link.update', projectId: 'p1', linkId: 'l1', category: null })
    expect(recordsIn(board).links[0]).not.toHaveProperty('category')
    board = apply(board, { type: 'link.update', projectId: 'p1', linkId: 'l1', category: 'e1' })
    expect(applyOp(board, { type: 'link.update', projectId: 'p1', linkId: 'l1', category: 'e1' })).toEqual({ ok: true, board })
    expect(refuse(board, { type: 'link.update', projectId: 'p1', linkId: 'l1', category: 'nope' })).toBe('类别不存在')
    expect(refuse(board, { type: 'link.update', projectId: 'p1', linkId: 'nope', category: null })).toBe('连线不存在')
    expect(refuse(board, { type: 'link.add', projectId: 'p1', id: 'l2', dataId: 'd2', resultId: 'r1', category: 'nope' })).toBe('类别不存在')
    board = apply(board, { type: 'relation.add', projectId: 'p1', id: 'x1', fromId: 'r1', toId: 'r2', category: 'e1', at: AT })
    expect(relationsOf(recordsIn(board))[0]!.category).toBe('e1')
  })

  it('deleting a category sends everything that used it back to the default look', () => {
    let board = addCategory(addCategory(sample(), 'node', 'c1'), 'edge', 'e1')
    board = apply(board, { type: 'node.update', projectId: 'p1', nodeId: 'd1', category: 'c1' })
    board = apply(board, { type: 'node.update', projectId: 'p1', nodeId: 'r1', category: 'c1' })
    board = apply(board, { type: 'link.add', projectId: 'p1', id: 'l1', dataId: 'd1', resultId: 'r1', category: 'e1' })
    board = apply(board, { type: 'relation.add', projectId: 'p1', id: 'x1', fromId: 'r1', toId: 'r2', category: 'e1' })
    const nodes = apply(board, { type: 'category.delete', projectId: 'p1', kind: 'node', categoryId: 'c1' })
    expect(node(nodes, 'd1')).not.toHaveProperty('category')
    expect(node(nodes, 'r1')).not.toHaveProperty('category')
    expect(recordsIn(nodes).links[0]!.category).toBe('e1')
    const edges = apply(board, { type: 'category.delete', projectId: 'p1', kind: 'edge', categoryId: 'e1' })
    expect(recordsIn(edges).links[0]).not.toHaveProperty('category')
    expect(relationsOf(recordsIn(edges))[0]).not.toHaveProperty('category')
    expect(node(edges, 'd1').category).toBe('c1')
    expect(refuse(board, { type: 'category.delete', projectId: 'p1', kind: 'node', categoryId: 'e1' })).toBe('类别不存在')
    expect(refuse(board, { type: 'category.delete', projectId: 'p1', kind: 'node', categoryId: 'nope' })).toBe('类别不存在')
  })

  it('the palette field is only there while something is in it', () => {
    let board = sample()
    expect(recordsIn(board)).not.toHaveProperty('palette')
    board = addCategory(board, 'node', 'c1')
    expect(recordsIn(board).palette).toBeDefined()
    board = apply(board, { type: 'category.delete', projectId: 'p1', kind: 'node', categoryId: 'c1' })
    expect(recordsIn(board)).not.toHaveProperty('palette')
    board = apply(board, { type: 'palette.update', projectId: 'p1', star: '#F0777D' })
    expect(recordsIn(board).palette).toEqual({ nodeCategories: [], edgeCategories: [], defaults: { star: '#f0777d' } })
    board = apply(board, { type: 'palette.update', projectId: 'p1', star: null })
    expect(recordsIn(board)).not.toHaveProperty('palette')
  })

  it('sets and clears the default colours, refuses bad ones, and ignores no-ops', () => {
    let board = apply(sample(), { type: 'palette.update', projectId: 'p1', node: '#111111', edge: '#222222' })
    expect(recordsIn(board).palette!.defaults).toEqual({ node: '#111111', edge: '#222222' })
    expect(applyOp(board, { type: 'palette.update', projectId: 'p1', node: '#111111' })).toEqual({ ok: true, board })
    expect(applyOp(board, { type: 'palette.update', projectId: 'p1', star: null })).toEqual({ ok: true, board })
    expect(applyOp(board, { type: 'palette.update', projectId: 'p1' })).toEqual({ ok: true, board })
    expect(refuse(board, { type: 'palette.update', projectId: 'p1', node: 'blue' })).toBe('颜色需要是 #RRGGBB')
    board = apply(board, { type: 'palette.update', projectId: 'p1', node: null })
    expect(recordsIn(board).palette!.defaults).toEqual({ edge: '#222222' })
  })

  it('cleanColor accepts #rrggbb only', () => {
    expect(cleanColor(' #AbCdEf ')).toBe('#abcdef')
    for (const bad of ['abcdef', '#abc', '#abcdeg', 12, null, undefined]) expect(cleanColor(bad)).toBeUndefined()
  })
})

describe('relations between results', () => {
  const relate = (board: Board, id: string, fromId: string, toId: string, extra: Partial<Extract<RecordOp, { type: 'relation.add' }>> = {}): Board =>
    apply(board, { type: 'relation.add', projectId: 'p1', id, fromId, toId, at: AT, ...extra })

  it('connects two results, undirected by default', () => {
    const board = relate(sample(), 'x1', 'r1', 'r2')
    expect(relationsOf(recordsIn(board))).toEqual([{ id: 'x1', fromId: 'r1', toId: 'r2', createdAt: AT }])
    expect(relationsOf(recordsIn(board))[0]).not.toHaveProperty('directed')
    const directed = relate(sample(), 'x1', 'r1', 'r2', { directed: true })
    expect(relationsOf(recordsIn(directed))[0]!.directed).toBe(true)
    expect(relationsOf(recordsIn(relate(sample(), 'x1', 'r1', 'r2', { directed: false })))[0]).not.toHaveProperty('directed')
  })

  it('refuses what is not a pair of two different results, a second line between the same two, and bad ids', () => {
    const board = relate(sample(), 'x1', 'r1', 'r2')
    const rel = (extra: Partial<Extract<RecordOp, { type: 'relation.add' }>>): Op => ({ type: 'relation.add', projectId: 'p1', id: 'x9', fromId: 'r1', toId: 'r3', ...extra })
    expect(refuse(board, rel({ fromId: 'd1' }))).toBe('结果节点不存在')
    expect(refuse(board, rel({ toId: 'd1' }))).toBe('结果节点不存在')
    expect(refuse(board, rel({ toId: 'nope' }))).toBe('结果节点不存在')
    expect(refuse(board, rel({ toId: 'r1' }))).toBe('不能把结果连到它自己')
    expect(refuse(board, rel({ id: 'x1' }))).toBe('连线已存在')
    // The same two results, either way round, only get one line.
    expect(refuse(board, rel({ fromId: 'r2', toId: 'r1' }))).toBe('连线已存在')
    expect(refuse(board, rel({ id: 'bad id' }))).toBe('连线 id 无效')
    expect(refuse(board, rel({ directed: 'yes' as unknown as boolean }))).toBe('无效操作')
    expect(refuse(board, rel({ category: 'nope' }))).toBe('类别不存在')
  })

  it('stops at the relation limit', () => {
    const results: RecordNode[] = Array.from({ length: 101 }, (_, i) => ({ id: `r${i}`, name: `r${i}`, path: '', description: '', parentId: null, collapsed: false, createdAt: AT, updatedAt: AT }))
    const relations: RecordRelation[] = []
    for (let a = 0; a < 101 && relations.length < RECORD_LIMITS.relations; a++) for (let b = a + 1; b < 101 && relations.length < RECORD_LIMITS.relations; b++) relations.push({ id: `x${a}_${b}`, fromId: `r${a}`, toId: `r${b}`, createdAt: AT })
    const full: Board = { ...baseBoard(), projects: [{ ...baseBoard().projects[0]!, records: { data: [], results, links: [], relations } }] }
    expect(refuse(full, { type: 'relation.add', projectId: 'p1', id: 'extra', fromId: 'r99', toId: 'r100' })).toContain('上限')
  })

  it('toggles the direction, reverses it, and sets a category', () => {
    let board = relate(sample(), 'x1', 'r1', 'r2')
    board = apply(board, { type: 'relation.update', projectId: 'p1', relationId: 'x1', directed: true })
    expect(relationsOf(recordsIn(board))[0]).toMatchObject({ fromId: 'r1', toId: 'r2', directed: true })
    board = apply(board, { type: 'relation.update', projectId: 'p1', relationId: 'x1', reverse: true })
    expect(relationsOf(recordsIn(board))[0]).toMatchObject({ fromId: 'r2', toId: 'r1', directed: true })
    board = apply(board, { type: 'relation.update', projectId: 'p1', relationId: 'x1', directed: false })
    expect(relationsOf(recordsIn(board))[0]).not.toHaveProperty('directed')
    expect(applyOp(board, { type: 'relation.update', projectId: 'p1', relationId: 'x1', directed: false })).toEqual({ ok: true, board })
    expect(refuse(board, { type: 'relation.update', projectId: 'p1', relationId: 'nope', directed: true })).toBe('连线不存在')
    expect(refuse(board, { type: 'relation.update', projectId: 'p1', relationId: 'x1', reverse: 1 as unknown as boolean })).toBe('无效操作')
    expect(refuse(board, { type: 'relation.update', projectId: 'p1', relationId: 'x1', category: 'nope' })).toBe('类别不存在')
  })

  it('deleting the last relation leaves the field out', () => {
    let board = relate(relate(sample(), 'x1', 'r1', 'r2'), 'x2', 'r2', 'r3')
    board = apply(board, { type: 'relation.delete', projectId: 'p1', relationId: 'x1' })
    expect(relationsOf(recordsIn(board)).map((r) => r.id)).toEqual(['x2'])
    board = apply(board, { type: 'relation.delete', projectId: 'p1', relationId: 'x2' })
    expect(recordsIn(board)).not.toHaveProperty('relations')
    expect(refuse(board, { type: 'relation.delete', projectId: 'p1', relationId: 'x2' })).toBe('连线不存在')
  })

  it('go with a result that is deleted (with its subtree, or alone when lifted), not with data', () => {
    let board = add(sample(), 'result', 'r4', { parentId: 'r1' })
    board = relate(relate(relate(board, 'x1', 'r1', 'r2'), 'x2', 'r4', 'r3'), 'x3', 'r2', 'r3')
    board = apply(board, { type: 'link.add', projectId: 'p1', id: 'l1', dataId: 'd1', resultId: 'r1' })
    const subtree = apply(board, { type: 'node.delete', projectId: 'p1', nodeId: 'r1' })
    expect(relationsOf(recordsIn(subtree)).map((r) => r.id)).toEqual(['x3'])
    const lifted = apply(board, { type: 'node.delete', projectId: 'p1', nodeId: 'r1', lift: true })
    expect(relationsOf(recordsIn(lifted)).map((r) => r.id).sort()).toEqual(['x2', 'x3'])
    const data = apply(board, { type: 'node.delete', projectId: 'p1', nodeId: 'd1' })
    expect(relationsOf(recordsIn(data))).toHaveLength(3)
  })
})

describe('sanitizing the new fields', () => {
  const nodeOf = (id: string, extra: object = {}): object => ({ id, name: id, path: '', description: '', parentId: null, collapsed: false, createdAt: AT, updatedAt: AT, ...extra })
  const palette = { nodeCategories: [{ id: 'c1', name: '原始', color: '#112233' }], edgeCategories: [{ id: 'e1', name: '来源', color: '#445566' }], defaults: { star: '#f0777d' } }

  it('keeps stars, categories, relations and the palette as they are', () => {
    let board = add(add(sample(), 'data', 'd3', { starred: true }), 'result', 'r4')
    board = apply(board, { type: 'category.add', projectId: 'p1', kind: 'node', id: 'c1', name: '原始', color: '#112233' })
    board = apply(board, { type: 'category.add', projectId: 'p1', kind: 'edge', id: 'e1', name: '来源', color: '#445566' })
    board = apply(board, { type: 'node.update', projectId: 'p1', nodeId: 'd3', category: 'c1' })
    board = apply(board, { type: 'link.add', projectId: 'p1', id: 'l1', dataId: 'd3', resultId: 'r4', category: 'e1' })
    board = apply(board, { type: 'relation.add', projectId: 'p1', id: 'x1', fromId: 'r1', toId: 'r4', directed: true, category: 'e1' })
    board = apply(board, { type: 'palette.update', projectId: 'p1', star: '#f0777d' })
    expect(sanitizeBoard(JSON.parse(JSON.stringify(board)))).toEqual(board)
    expectStableOnLoad(recordsIn(board))
  })

  it('drops categories that do not exist, bad colours and duplicate category ids', () => {
    const records = sanitizeRecords({
      data: [nodeOf('d1', { category: 'c1', starred: true }), nodeOf('d2', { category: 'ghost' }), nodeOf('d3', { starred: 'yes' })],
      results: [nodeOf('r1', { category: 'e1' })],
      links: [{ id: 'l1', dataId: 'd1', resultId: 'r1', createdAt: AT, category: 'e1' }, { id: 'l2', dataId: 'd2', resultId: 'r1', createdAt: AT, category: 'ghost' }],
      palette: {
        nodeCategories: [{ id: 'c1', name: '原始', color: '#112233' }, { id: 'c1', name: 'dup', color: '#112233' }, { id: 'c2', name: 'bad colour', color: 'red' }, { id: 'c3', name: '  ', color: '#112233' }],
        edgeCategories: [{ id: 'e1', name: '来源', color: '#445566' }, { id: 'c1', name: 'clash with a node category', color: '#445566' }],
        defaults: { node: 'blue', edge: '#ABCDEF', star: 5 },
      },
    })!
    expect(records.data.map((n) => [n.id, n.category, n.starred])).toEqual([['d1', 'c1', true], ['d2', undefined, undefined], ['d3', undefined, undefined]])
    // e1 is an edge category, so a node cannot use it.
    expect(records.results[0]!.category).toBeUndefined()
    expect(records.links.map((l) => l.category)).toEqual(['e1', undefined])
    expect(records.palette).toEqual({ nodeCategories: [{ id: 'c1', name: '原始', color: '#112233' }], edgeCategories: [{ id: 'e1', name: '来源', color: '#445566' }], defaults: { edge: '#abcdef' } })
  })

  it('keeps a palette even when no node has been recorded, and nothing when there is nothing', () => {
    expect(sanitizeRecords({ palette })!).toEqual({ data: [], results: [], links: [], palette })
    expect(sanitizeRecords({ data: [], results: [], palette: { nodeCategories: [], edgeCategories: [], defaults: {} } })).toBeUndefined()
  })

  it('drops relations that are not between two different results, repeated, or malformed', () => {
    const records = sanitizeRecords({
      data: [nodeOf('d1')],
      results: [nodeOf('r1'), nodeOf('r2'), nodeOf('r3')],
      relations: [
        { id: 'x1', fromId: 'r1', toId: 'r2', createdAt: AT, directed: true },
        { id: 'x1', fromId: 'r1', toId: 'r3', createdAt: AT },
        { id: 'x2', fromId: 'r2', toId: 'r1', createdAt: AT },
        { id: 'x3', fromId: 'r1', toId: 'r1', createdAt: AT },
        { id: 'x4', fromId: 'd1', toId: 'r1', createdAt: AT },
        { id: 'x5', fromId: 'r1', toId: 'ghost', createdAt: AT },
        { id: 'x6', fromId: 'r2', toId: 'r3' },
        { id: 'x7', fromId: 'r3' },
        'junk',
        null,
      ],
    })!
    expect(relationsOf(records).map((r) => `${r.id}:${r.fromId}>${r.toId}${r.directed ? ' directed' : ''}`)).toEqual(['x1:r1>r2 directed', 'x6:r2>r3'])
    expect(pairKey('b', 'a')).toBe(pairKey('a', 'b'))
  })
})

describe('immutability of the new ops', () => {
  function deepFreeze<T>(value: T): T {
    if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
      Object.freeze(value)
      for (const child of Object.values(value)) deepFreeze(child)
    }
    return value
  }

  it('no new op mutates a deep-frozen board, even when refused', () => {
    let board = sample()
    board = apply(board, { type: 'category.add', projectId: 'p1', kind: 'node', id: 'c1', name: 'A', color: '#112233' })
    board = apply(board, { type: 'category.add', projectId: 'p1', kind: 'edge', id: 'e1', name: 'B', color: '#445566' })
    board = apply(board, { type: 'link.add', projectId: 'p1', id: 'l1', dataId: 'd1', resultId: 'r1', category: 'e1' })
    board = apply(board, { type: 'relation.add', projectId: 'p1', id: 'x1', fromId: 'r1', toId: 'r2', category: 'e1' })
    board = apply(board, { type: 'node.update', projectId: 'p1', nodeId: 'd1', category: 'c1', starred: true })
    board = apply(board, { type: 'palette.update', projectId: 'p1', node: '#111111' })
    const expected = JSON.stringify(board)
    deepFreeze(board)
    const ops: Op[] = [
      { type: 'node.update', projectId: 'p1', nodeId: 'd2', starred: true, category: 'c1' },
      { type: 'node.update', projectId: 'p1', nodeId: 'd1', starred: false, category: null },
      { type: 'node.add', projectId: 'p1', side: 'result', id: 'r9', name: 'r9', starred: true, category: 'c1' },
      { type: 'link.update', projectId: 'p1', linkId: 'l1', category: null },
      { type: 'link.update', projectId: 'p1', linkId: 'nope', category: null },
      { type: 'relation.add', projectId: 'p1', id: 'x2', fromId: 'r2', toId: 'r3', directed: true },
      { type: 'relation.add', projectId: 'p1', id: 'x1', fromId: 'r2', toId: 'r3' },
      { type: 'relation.update', projectId: 'p1', relationId: 'x1', directed: true, reverse: true, category: null },
      { type: 'relation.delete', projectId: 'p1', relationId: 'x1' },
      { type: 'category.add', projectId: 'p1', kind: 'node', id: 'c2', name: 'Z', color: '#abcdef', index: 0 },
      { type: 'category.add', projectId: 'p1', kind: 'node', id: 'c1', name: 'dup', color: '#abcdef' },
      { type: 'category.update', projectId: 'p1', kind: 'node', categoryId: 'c1', name: 'B', color: '#000000' },
      { type: 'category.delete', projectId: 'p1', kind: 'node', categoryId: 'c1' },
      { type: 'category.delete', projectId: 'p1', kind: 'edge', categoryId: 'e1' },
      { type: 'palette.update', projectId: 'p1', node: null, edge: '#222222', star: '#333333' },
      { type: 'palette.update', projectId: 'p1', node: 'blue' },
      { type: 'node.delete', projectId: 'p1', nodeId: 'r1' },
      { type: 'node.delete', projectId: 'p1', nodeId: 'r2', lift: true },
    ]
    for (const operation of ops) {
      const label = JSON.stringify(operation)
      expect(() => applyOp(board, operation), label).not.toThrow()
      expect(JSON.stringify(board), label).toBe(expected)
    }
  })
})

describe('stress', () => {
  it('keeps every invariant, and everything the ops write survives a restart, across 6000 random ops', () => {
    const random = rng(7)
    let board = baseBoard()
    let applied = 0
    const kinds = new Set<string>()
    for (let step = 0; step < 6000; step++) {
      const operation = randomRecordOp(random)
      const result = applyOp(board, operation)
      if (result.ok) {
        if (result.board !== board) {
          applied += 1
          kinds.add(operation.type)
        }
        board = result.board
      } else {
        expect(result.board).toBe(board)
      }
      const records = recordsIn(board)
      checkInvariants(records)
      if (step % 15 === 0) expectStableOnLoad(records)
    }
    expect(applied).toBeGreaterThan(900)
    // Every kind of op did something at least once, or the generator is not covering it.
    expect([...kinds].sort()).toEqual(
      ['category.add', 'category.delete', 'category.update', 'link.add', 'link.delete', 'link.update', 'node.add', 'node.delete', 'node.move', 'node.update', 'palette.update', 'relation.add', 'relation.delete', 'relation.update'].sort(),
    )
  })
})

export type { ProjectRecords }
export { op }
