/**
 * Shared helpers for the records tests: a seeded random op generator that
 * covers every op type, the invariants a records value must always satisfy,
 * and a comparison that ignores what an undo is allowed to change.
 */
import { expect } from 'vitest'
import { applyOp, emptyBoard, recordsOf, sanitizeBoard } from '../src/shared/board'
import type { Board, Op } from '../src/shared/board'
import { EMPTY_RECORDS, RECORD_LIMITS, categoriesOf, indexNodes, inPreorder, levelOf, listOf, pairKey, relationsOf, sanitizeRecords } from '../src/shared/records'
import type { ProjectRecords, RecordNode, RecordOp } from '../src/shared/records'

export const AT = '2024-06-01T00:00:00.000Z'
export const LATER = '2024-07-02T03:04:05.000Z'

/** A tiny seeded generator, so a failing run can be replayed. */
export function rng(seed: number): () => number {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

export const baseBoard = (): Board => {
  const result = applyOp(emptyBoard(), { type: 'project.add', id: 'p1', name: 'Alpha', at: AT })
  if (!result.ok) throw new Error(result.reason)
  return result.board
}

export const recordsIn = (board: Board): ProjectRecords => recordsOf(board.projects[0]!)

const COLORS = ['#4d6bfe', '#e5484d', '#22a06b', '#e09400', '#8b5cf6', '#0ea5a4', 'red', '#12']

/** One random record op over small id pools, so most ops have something to act on. */
export function randomRecordOp(random: () => number): RecordOp {
  const pick = <T>(items: readonly T[]): T => items[Math.floor(random() * items.length)]!
  const maybe = <T>(value: T, chance = 0.5): T | undefined => (random() < chance ? value : undefined)
  const projectId = 'p1'
  const node = pick(Array.from({ length: 18 }, (_, i) => `n${i}`))
  const parent = random() < 0.3 ? null : pick(Array.from({ length: 18 }, (_, i) => `n${i}`))
  const category = pick(['c0', 'c1', 'c2', 'c3', 'c4'])
  const roll = random()
  if (roll < 0.17) return { type: 'node.add', projectId, side: random() < 0.55 ? 'data' : 'result', id: node, name: node, parentId: parent, beforeId: maybe(pick(['n1', 'n2', 'n3', 'n4']), 0.3) ?? null, starred: maybe(true, 0.3), category: maybe(category, 0.3), at: AT }
  if (roll < 0.3) return { type: 'node.move', projectId, nodeId: node, parentId: parent, beforeId: maybe(pick(['n0', 'n5', 'n6', 'n7']), 0.4) ?? null }
  if (roll < 0.37) return { type: 'node.delete', projectId, nodeId: node, lift: random() < 0.5 }
  if (roll < 0.47) return { type: 'node.update', projectId, nodeId: node, name: maybe('renamed'), description: maybe('desc'), collapsed: maybe(random() < 0.5), starred: maybe(random() < 0.5, 0.6), category: random() < 0.4 ? (random() < 0.3 ? null : category) : undefined, at: LATER }
  if (roll < 0.55) return { type: 'link.add', projectId, id: pick(['l0', 'l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7']), dataId: node, resultId: pick(['n3', 'n6', 'n9', 'n12', 'n15']), category: maybe(pick(['c0', 'c1', 'c2', 'c3', 'c4']), 0.3), at: AT }
  if (roll < 0.59) return { type: 'link.update', projectId, linkId: pick(['l0', 'l1', 'l2', 'l3']), category: random() < 0.3 ? null : pick(['c0', 'c1', 'c2', 'c3', 'c4']) }
  if (roll < 0.62) return { type: 'link.delete', projectId, linkId: pick(['l0', 'l1', 'l2', 'l3', 'l4', 'l5']) }
  if (roll < 0.74) return { type: 'relation.add', projectId, id: pick(['x0', 'x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7']), fromId: node, toId: pick(['n3', 'n6', 'n9', 'n12', 'n15', 'n2', 'n4']), directed: maybe(true, 0.5), category: maybe(pick(['c0', 'c1', 'c2', 'c3', 'c4']), 0.3), at: AT }
  if (roll < 0.8) return { type: 'relation.update', projectId, relationId: pick(['x0', 'x1', 'x2', 'x3', 'x4']), directed: maybe(random() < 0.5, 0.5), reverse: maybe(true, 0.4), category: random() < 0.3 ? (random() < 0.4 ? null : pick(['c0', 'c1', 'c2'])) : undefined }
  if (roll < 0.83) return { type: 'relation.delete', projectId, relationId: pick(['x0', 'x1', 'x2', 'x3', 'x4']) }
  if (roll < 0.9) return { type: 'category.add', projectId, kind: random() < 0.5 ? 'node' : 'edge', id: category, name: `cat ${category}`, color: pick(COLORS), index: maybe(Math.floor(random() * 4), 0.4) }
  if (roll < 0.94) return { type: 'category.update', projectId, kind: random() < 0.5 ? 'node' : 'edge', categoryId: category, name: maybe('renamed cat'), color: maybe(pick(COLORS)) }
  if (roll < 0.97) return { type: 'category.delete', projectId, kind: random() < 0.5 ? 'node' : 'edge', categoryId: category }
  return { type: 'palette.update', projectId, node: maybe(random() < 0.3 ? null : pick(COLORS)), edge: maybe(random() < 0.3 ? null : pick(COLORS)), star: maybe(random() < 0.3 ? null : pick(COLORS)) }
}

/** What must be true of any records value, whatever ops produced it. */
export function checkInvariants(records: ProjectRecords): void {
  const seen = new Set<string>()
  for (const side of ['data', 'result'] as const) {
    const list = listOf(records, side)
    const index = indexNodes(list)
    expect(inPreorder(list).map((n) => n.id), `${side} is not parents-first`).toEqual(list.map((n) => n.id))
    for (const item of list) {
      expect(seen.has(item.id), `duplicate id ${item.id}`).toBe(false)
      seen.add(item.id)
      if (item.parentId !== null) expect(index.byId.has(item.parentId), `${item.id} has no parent ${item.parentId}`).toBe(true)
      expect(levelOf(index, item.id)).toBeLessThan(RECORD_LIMITS.depth)
      let current: RecordNode | undefined = item
      for (let steps = 0; current && current.parentId !== null; steps++) {
        expect(steps).toBeLessThan(list.length)
        current = index.byId.get(current.parentId)
      }
      if (item.starred !== undefined) expect(item.starred).toBe(true)
      if (item.category !== undefined) expect(categoriesOf(records, 'node').some((c) => c.id === item.category), `${item.id} uses missing category ${item.category}`).toBe(true)
    }
  }
  const dataIds = new Set(records.data.map((n) => n.id))
  const resultIds = new Set(records.results.map((n) => n.id))
  const pairs = new Set<string>()
  const linkIds = new Set<string>()
  for (const link of records.links) {
    expect(dataIds.has(link.dataId) && resultIds.has(link.resultId), `dangling link ${link.id}`).toBe(true)
    expect(pairs.has(`${link.dataId}>${link.resultId}`)).toBe(false)
    expect(linkIds.has(link.id)).toBe(false)
    pairs.add(`${link.dataId}>${link.resultId}`)
    linkIds.add(link.id)
    if (link.category !== undefined) expect(categoriesOf(records, 'edge').some((c) => c.id === link.category)).toBe(true)
  }
  const relationIds = new Set<string>()
  const relationPairs = new Set<string>()
  expect(records.relations === undefined || records.relations.length > 0, 'an empty relations list is left out').toBe(true)
  for (const relation of relationsOf(records)) {
    expect(resultIds.has(relation.fromId) && resultIds.has(relation.toId) && relation.fromId !== relation.toId, `bad relation ${relation.id}`).toBe(true)
    expect(relationIds.has(relation.id)).toBe(false)
    expect(relationPairs.has(pairKey(relation.fromId, relation.toId))).toBe(false)
    relationIds.add(relation.id)
    relationPairs.add(pairKey(relation.fromId, relation.toId))
    if (relation.directed !== undefined) expect(relation.directed).toBe(true)
    if (relation.category !== undefined) expect(categoriesOf(records, 'edge').some((c) => c.id === relation.category)).toBe(true)
  }
  const palette = records.palette
  if (palette) {
    const ids = [...palette.nodeCategories, ...palette.edgeCategories].map((c) => c.id)
    expect(new Set(ids).size, 'category ids are unique').toBe(ids.length)
    const hasDefaults = palette.defaults !== undefined && Object.keys(palette.defaults).length > 0
    expect(palette.nodeCategories.length > 0 || palette.edgeCategories.length > 0 || hasDefaults, 'an empty palette is left out').toBe(true)
    for (const c of [...palette.nodeCategories, ...palette.edgeCategories]) expect(c.color).toMatch(/^#[0-9a-f]{6}$/)
  }
}

/** Whatever the ops produced must survive a restart unchanged: saved, read back, sanitized. */
export function expectStableOnLoad(records: ProjectRecords): void {
  const reloaded = sanitizeRecords(JSON.parse(JSON.stringify(records)))
  const meaningful = records.data.length > 0 || records.results.length > 0 || records.palette !== undefined
  if (!meaningful) {
    expect(reloaded).toBeUndefined()
    return
  }
  expect(reloaded).toEqual(records)
}

/** Records as a comparable string, without what an undo may legitimately change (`updatedAt`, the order of links). */
export function normRecords(records: ProjectRecords | undefined): string {
  const r = records ?? EMPTY_RECORDS
  const strip = (node: RecordNode): Omit<RecordNode, 'updatedAt'> => {
    const { updatedAt: _ignored, ...rest } = node
    return rest
  }
  const byId = <T extends { id: string }>(items: readonly T[]): T[] => [...items].sort((a, b) => a.id.localeCompare(b.id))
  return JSON.stringify(sortKeys({ data: r.data.map(strip), results: r.results.map(strip), links: byId(r.links), relations: byId(relationsOf(r)), palette: r.palette ?? null }))
}

/** The same value with every object's keys in a fixed order, so only content is compared. */
function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys)
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, sortKeys(item)]))
  }
  return value
}

/** Apply an op to a board, returning the new board (or the same one when refused). */
export function tryApply(board: Board, op: Op): { board: Board; ok: boolean } {
  const result = applyOp(board, op)
  return { board: result.board, ok: result.ok }
}

export { sanitizeBoard }
