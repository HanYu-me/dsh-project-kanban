/**
 * Data and result records of one project: two trees (the key data you
 * produced, and the results you drew from it), the links that say which
 * result came from which data, the relations between results, stars, and the
 * colour categories that style them.
 *
 * Like the board model this is a set of pure functions shared by the host
 * (which stores the records) and the browser (which applies the same ops
 * optimistically). `applyRecordOp` never mutates its input and never throws:
 * an op that does not fit (unknown id, a cycle, a limit) is refused with a
 * reason and leaves the records unchanged.
 *
 * Both trees are flat arrays with a `parentId`. The order of the siblings of
 * one parent is the order of those nodes in the array, so moving a node is
 * "take it out, put it back before another sibling". After every structural
 * change the array is put back in parents-first order (see `inPreorder`).
 *
 * Everything added after the first release (stars, categories, relations,
 * the palette) is optional and absent until used, so older files load as
 * they were.
 * @module dsh-project-kanban/shared/records
 */
import { ID_PATTERN, cleanLine, cleanPath, cleanText } from './text'

/** The two trees of a project. */
export const RECORD_SIDES = ['data', 'result'] as const

/** One tree: the data you have, or the results drawn from it. */
export type RecordSide = (typeof RECORD_SIDES)[number]

/** Text and size limits, enforced on both sides. */
export const RECORD_LIMITS = {
  name: 80,
  path: 1000,
  description: 4000,
  nodesPerSide: 2000,
  links: 5000,
  /** Most levels a tree may have (top level counts as one). */
  depth: 12,
  /** Connections between two results. */
  relations: 5000,
  /** Colour categories of one kind (node or edge). */
  categories: 40,
  categoryName: 30,
} as const

/** One node of a tree: a piece of data, a result, or a group of them. */
export interface RecordNode {
  id: string
  /** The short name shown in the tree. */
  name: string
  /** Full path (data) or where the figure/table lives (result); may be empty. */
  path: string
  /** Free-text description; may be empty. */
  description: string
  /** Parent in the same tree; null = top level. */
  parentId: string | null
  /** Whether the children are folded in the UI. */
  collapsed: boolean
  createdAt: string
  /** Changes when the name, path or description changes (not on moves, stars or colours). */
  updatedAt: string
  /** Marked as important. Absent = not starred. */
  starred?: true
  /** A node category of the palette; absent = the default look. */
  category?: string
}

/** "This result comes from this data." */
export interface RecordLink {
  id: string
  dataId: string
  resultId: string
  createdAt: string
  /** An edge category of the palette; absent = the default look. */
  category?: string
}

/**
 * A connection between two results. Undirected unless `directed`, in which
 * case it points from `fromId` to `toId`.
 */
export interface RecordRelation {
  id: string
  fromId: string
  toId: string
  createdAt: string
  directed?: true
  category?: string
}

/** Which colour list a category belongs to. */
export type CategoryKind = 'node' | 'edge'

/** A named colour: "原始数据" is blue, "最终结果" is orange. */
export interface RecordCategory {
  id: string
  name: string
  /** `#rrggbb`. */
  color: string
}

/** The project's colours. Absent = everything in the built-in look. */
export interface RecordPalette {
  nodeCategories: RecordCategory[]
  edgeCategories: RecordCategory[]
  /** Colours (`#rrggbb`) that replace the built-in defaults. */
  defaults?: { node?: string; edge?: string; star?: string }
}

/** Everything recorded for one project. */
export interface ProjectRecords {
  data: RecordNode[]
  results: RecordNode[]
  links: RecordLink[]
  relations?: RecordRelation[]
  palette?: RecordPalette
}

/** Shared empty value for projects that have no records yet. */
export const EMPTY_RECORDS: ProjectRecords = Object.freeze({
  data: Object.freeze([]) as unknown as RecordNode[],
  results: Object.freeze([]) as unknown as RecordNode[],
  links: Object.freeze([]) as unknown as RecordLink[],
})

/** Every change the records UI can make (each carries the project it is for). */
export type RecordOp =
  /** Add a node as the last child of `parentId` (or before `beforeId` when that is a sibling). */
  | { type: 'node.add'; projectId: string; side: RecordSide; id: string; name: string; path?: string; description?: string; parentId?: string | null; beforeId?: string | null; starred?: boolean; category?: string; at?: string }
  /** `category: null` clears the category. */
  | { type: 'node.update'; projectId: string; nodeId: string; name?: string; path?: string; description?: string; collapsed?: boolean; starred?: boolean; category?: string | null; at?: string }
  /** Put a node under `parentId` (null = top level), before `beforeId` or at the end. */
  | { type: 'node.move'; projectId: string; nodeId: string; parentId: string | null; beforeId?: string | null }
  /** Delete a node with its subtree; with `lift`, delete only the node and move its children up. */
  | { type: 'node.delete'; projectId: string; nodeId: string; lift?: boolean }
  /** Put a deleted subtree (and the links and relations it had) back at `index` of its tree (undo). */
  | { type: 'node.restore'; projectId: string; side: RecordSide; nodes: RecordNode[]; links: RecordLink[]; relations?: RecordRelation[]; index: number }
  | { type: 'link.add'; projectId: string; id: string; dataId: string; resultId: string; category?: string; at?: string }
  | { type: 'link.update'; projectId: string; linkId: string; category?: string | null }
  | { type: 'link.delete'; projectId: string; linkId: string }
  /** Connect two results. Undirected unless `directed`. */
  | { type: 'relation.add'; projectId: string; id: string; fromId: string; toId: string; directed?: boolean; category?: string; at?: string }
  /** `reverse` swaps the two ends. */
  | { type: 'relation.update'; projectId: string; relationId: string; directed?: boolean; reverse?: boolean; category?: string | null }
  | { type: 'relation.delete'; projectId: string; relationId: string }
  | { type: 'category.add'; projectId: string; kind: CategoryKind; id: string; name: string; color: string; index?: number }
  | { type: 'category.update'; projectId: string; kind: CategoryKind; categoryId: string; name?: string; color?: string }
  /** Delete a category; whatever used it goes back to the default look. */
  | { type: 'category.delete'; projectId: string; kind: CategoryKind; categoryId: string }
  /** Set (a colour) or clear (`null`) the default colours. */
  | { type: 'palette.update'; projectId: string; node?: string | null; edge?: string | null; star?: string | null }

/** Result of applying one record op. */
export type RecordResult = { ok: true; records: ProjectRecords } | { ok: false; reason: string }

/** Whether `value` names one of the two trees. */
export function isSide(value: unknown): value is RecordSide {
  return value === 'data' || value === 'result'
}

/** The nodes of one tree. */
export function listOf(records: ProjectRecords, side: RecordSide): RecordNode[] {
  return side === 'data' ? records.data : records.results
}

/** How much is recorded, for badges. */
export function recordCounts(records: ProjectRecords): { data: number; results: number; links: number } {
  return { data: records.data.length, results: records.results.length, links: records.links.length }
}

const NO_RELATIONS: readonly RecordRelation[] = Object.freeze([])
const NO_CATEGORIES: readonly RecordCategory[] = Object.freeze([])

/** The relations between results (none until one is drawn). */
export function relationsOf(records: ProjectRecords): readonly RecordRelation[] {
  return records.relations ?? NO_RELATIONS
}

/** The categories of one kind (none until one is added). */
export function categoriesOf(records: ProjectRecords, kind: CategoryKind): readonly RecordCategory[] {
  const palette = records.palette
  if (!palette) return NO_CATEGORIES
  return kind === 'node' ? palette.nodeCategories : palette.edgeCategories
}

function hasCategory(records: ProjectRecords, kind: CategoryKind, id: unknown): boolean {
  return typeof id === 'string' && categoriesOf(records, kind).some((category) => category.id === id)
}

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/

/** `#rrggbb` (lower case) or undefined. */
export function cleanColor(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const text = value.trim()
  return HEX_COLOR.test(text) ? text.toLowerCase() : undefined
}

/** The same pair of results, whichever way round. */
export function pairKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`
}

// ------------------------------------------------------------------ tree helpers

/** A tree indexed for lookups. */
export interface RecordIndex {
  byId: Map<string, RecordNode>
  /** Children by parent id (null = top level), in sibling order. */
  children: Map<string | null, RecordNode[]>
}

const NO_NODES: readonly RecordNode[] = Object.freeze([])

/** Index one tree. */
export function indexNodes(nodes: readonly RecordNode[]): RecordIndex {
  const byId = new Map<string, RecordNode>()
  const children = new Map<string | null, RecordNode[]>()
  for (const node of nodes) {
    byId.set(node.id, node)
    const list = children.get(node.parentId)
    if (list) list.push(node)
    else children.set(node.parentId, [node])
  }
  return { byId, children }
}

/** The children of `parentId` (null = top level), in order. */
export function childrenOf(index: RecordIndex, parentId: string | null): readonly RecordNode[] {
  return index.children.get(parentId) ?? NO_NODES
}

/** How many ancestors a node has (0 = top level). A broken chain stops counting. */
export function levelOf(index: RecordIndex, id: string): number {
  let level = 0
  let current = index.byId.get(id)
  while (current && current.parentId !== null && level <= index.byId.size) {
    level += 1
    current = index.byId.get(current.parentId)
  }
  return level
}

/** `id` and all its descendants, parents before children. */
export function subtreeIds(index: RecordIndex, id: string): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  const stack = [id]
  while (stack.length > 0) {
    const current = stack.pop()!
    if (seen.has(current)) continue
    seen.add(current)
    out.push(current)
    const kids = childrenOf(index, current)
    for (let i = kids.length - 1; i >= 0; i--) stack.push(kids[i]!.id)
  }
  return out
}

/** Levels below a node: 0 for a leaf. */
export function heightBelow(index: RecordIndex, id: string): number {
  let max = 0
  const seen = new Set<string>()
  const stack: [string, number][] = [[id, 0]]
  while (stack.length > 0) {
    const [current, depth] = stack.pop()!
    if (seen.has(current)) continue
    seen.add(current)
    max = Math.max(max, depth)
    for (const kid of childrenOf(index, current)) stack.push([kid.id, depth + 1])
  }
  return max
}

/** Whether `id` is `rootId` or lies below it. */
export function isInSubtree(index: RecordIndex, rootId: string, id: string): boolean {
  let current = index.byId.get(id)
  let steps = 0
  while (current && steps <= index.byId.size) {
    if (current.id === rootId) return true
    if (current.parentId === null) return false
    current = index.byId.get(current.parentId)
    steps += 1
  }
  return false
}

// ------------------------------------------------------------------ ops

const bad = (reason: string): RecordResult => ({ ok: false, reason })

/** Find a node in either tree. */
function locate(records: ProjectRecords, id: unknown): { side: RecordSide; node: RecordNode } | undefined {
  if (typeof id !== 'string') return undefined
  const data = records.data.find((node) => node.id === id)
  if (data) return { side: 'data', node: data }
  const result = records.results.find((node) => node.id === id)
  return result ? { side: 'result', node: result } : undefined
}

function withList(records: ProjectRecords, side: RecordSide, list: RecordNode[]): ProjectRecords {
  return side === 'data' ? { ...records, data: list } : { ...records, results: list }
}

/** Set the relations; an empty list leaves the field out, like a project that never had any. */
function withRelations(records: ProjectRecords, list: RecordRelation[]): ProjectRecords {
  if (list.length > 0) return { ...records, relations: list }
  if (records.relations === undefined) return records
  const { relations: _dropped, ...rest } = records
  return rest
}

/** Set the palette; an empty palette leaves the field out. */
function withPalette(records: ProjectRecords, palette: RecordPalette): ProjectRecords {
  const hasDefaults = palette.defaults !== undefined && Object.keys(palette.defaults).length > 0
  const clean: RecordPalette = { nodeCategories: palette.nodeCategories, edgeCategories: palette.edgeCategories, ...(hasDefaults ? { defaults: palette.defaults } : {}) }
  if (clean.nodeCategories.length > 0 || clean.edgeCategories.length > 0 || hasDefaults) return { ...records, palette: clean }
  if (records.palette === undefined) return records
  const { palette: _dropped, ...rest } = records
  return rest
}

/**
 * Put `node` into `list` (which must not contain it) as a child of
 * `node.parentId`: right before `beforeId` when that is one of its siblings,
 * else after the last sibling.
 */
function place(list: readonly RecordNode[], node: RecordNode, beforeId: string | null | undefined): RecordNode[] {
  const out = list.slice()
  if (beforeId) {
    const at = out.findIndex((item) => item.id === beforeId && item.parentId === node.parentId)
    if (at >= 0) {
      out.splice(at, 0, node)
      return out
    }
  }
  let last = -1
  out.forEach((item, index) => {
    if (item.parentId === node.parentId) last = index
  })
  out.splice(last >= 0 ? last + 1 : out.length, 0, node)
  return out
}

/**
 * The nodes ordered parents-first: every node is followed by its whole
 * subtree, and siblings keep their relative order. The stored arrays are
 * always kept like this, so the file reads top to bottom as the tree looks
 * and a subtree is one contiguous block.
 * @returns `list` itself when it is already in that order.
 */
export function inPreorder(list: readonly RecordNode[]): RecordNode[] {
  const index = indexNodes(list)
  const out: RecordNode[] = []
  const seen = new Set<string>()
  const walk = (parentId: string | null): void => {
    for (const node of index.children.get(parentId) ?? []) {
      if (seen.has(node.id)) continue
      seen.add(node.id)
      out.push(node)
      walk(node.id)
    }
  }
  walk(null)
  // Nodes whose parent chain is broken cannot be reached; keep them rather than lose them.
  for (const node of list) if (!seen.has(node.id)) out.push(node)
  return out.length === list.length && out.every((node, i) => node === list[i]) ? (list as RecordNode[]) : out
}

function siblingIds(list: readonly RecordNode[], parentId: string | null): string[] {
  return list.filter((node) => node.parentId === parentId).map((node) => node.id)
}

function sameList(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index])
}

/**
 * Apply one record op to a project's records.
 * @param records - the project's current records.
 * @param op - untrusted op (validated here).
 * @param at - the timestamp to stamp new and changed nodes with.
 * @returns the new records (the same object when nothing changed), or a reason.
 */
export function applyRecordOp(records: ProjectRecords, op: RecordOp, at: string): RecordResult {
  switch (op.type) {
    case 'node.add':
      return addNode(records, op, at)
    case 'node.update':
      return updateNode(records, op, at)
    case 'node.move':
      return moveNode(records, op)
    case 'node.delete':
      return deleteNode(records, op)
    case 'node.restore':
      return restoreNodes(records, op)
    case 'link.add':
      return addLink(records, op, at)
    case 'link.update':
      return updateLink(records, op)
    case 'link.delete': {
      if (typeof op.linkId !== 'string' || !records.links.some((link) => link.id === op.linkId)) return bad('连线不存在')
      return { ok: true, records: { ...records, links: records.links.filter((link) => link.id !== op.linkId) } }
    }
    case 'relation.add':
      return addRelation(records, op, at)
    case 'relation.update':
      return updateRelation(records, op)
    case 'relation.delete': {
      const relations = relationsOf(records)
      if (typeof op.relationId !== 'string' || !relations.some((relation) => relation.id === op.relationId)) return bad('连线不存在')
      return { ok: true, records: withRelations(records, relations.filter((relation) => relation.id !== op.relationId)) }
    }
    case 'category.add':
      return addCategory(records, op)
    case 'category.update':
      return updateCategory(records, op)
    case 'category.delete':
      return deleteCategory(records, op)
    case 'palette.update':
      return updatePalette(records, op)
    default:
      return bad('未知操作')
  }
}

function addNode(records: ProjectRecords, op: Extract<RecordOp, { type: 'node.add' }>, at: string): RecordResult {
  if (!isSide(op.side)) return bad('分类无效')
  if (typeof op.id !== 'string' || !ID_PATTERN.test(op.id)) return bad('节点 id 无效')
  if (locate(records, op.id)) return bad('节点已存在')
  const list = listOf(records, op.side)
  if (list.length >= RECORD_LIMITS.nodesPerSide) return bad(`节点数量已达上限（${RECORD_LIMITS.nodesPerSide}）`)
  const name = cleanLine(op.name, RECORD_LIMITS.name)
  if (name === undefined) return bad(`名称需为 1–${RECORD_LIMITS.name} 个字符`)
  const path = op.path === undefined ? '' : cleanPath(op.path, RECORD_LIMITS.path)
  if (path === undefined) return bad(`完整路径不能超过 ${RECORD_LIMITS.path} 个字符`)
  const description = op.description === undefined ? '' : cleanText(op.description, RECORD_LIMITS.description)
  if (description === undefined) return bad(`描述不能超过 ${RECORD_LIMITS.description} 个字符`)
  if (op.starred !== undefined && typeof op.starred !== 'boolean') return bad('无效操作')
  if (op.category !== undefined && !hasCategory(records, 'node', op.category)) return bad('类别不存在')
  const parentId = op.parentId ?? null
  if (parentId !== null) {
    const index = indexNodes(list)
    if (typeof parentId !== 'string' || !index.byId.has(parentId)) return bad('上级节点不存在')
    if (levelOf(index, parentId) + 1 > RECORD_LIMITS.depth - 1) return bad(`层级最多 ${RECORD_LIMITS.depth} 层`)
  }
  const node: RecordNode = {
    id: op.id,
    name,
    path,
    description,
    parentId,
    collapsed: false,
    createdAt: at,
    updatedAt: at,
    ...(op.starred === true ? { starred: true as const } : {}),
    ...(op.category !== undefined ? { category: op.category } : {}),
  }
  return { ok: true, records: withList(records, op.side, inPreorder(place(list, node, op.beforeId))) }
}

function updateNode(records: ProjectRecords, op: Extract<RecordOp, { type: 'node.update' }>, at: string): RecordResult {
  const found = locate(records, op.nodeId)
  if (!found) return bad('节点不存在')
  const patch: { name?: string; path?: string; description?: string; collapsed?: boolean; starred?: boolean; category?: string | null } = {}
  if (op.name !== undefined) {
    const name = cleanLine(op.name, RECORD_LIMITS.name)
    if (name === undefined) return bad(`名称需为 1–${RECORD_LIMITS.name} 个字符`)
    patch.name = name
  }
  if (op.path !== undefined) {
    const path = cleanPath(op.path, RECORD_LIMITS.path)
    if (path === undefined) return bad(`完整路径不能超过 ${RECORD_LIMITS.path} 个字符`)
    patch.path = path
  }
  if (op.description !== undefined) {
    const description = cleanText(op.description, RECORD_LIMITS.description)
    if (description === undefined) return bad(`描述不能超过 ${RECORD_LIMITS.description} 个字符`)
    patch.description = description
  }
  if (op.collapsed !== undefined) {
    if (typeof op.collapsed !== 'boolean') return bad('无效操作')
    patch.collapsed = op.collapsed
  }
  if (op.starred !== undefined) {
    if (typeof op.starred !== 'boolean') return bad('无效操作')
    patch.starred = op.starred
  }
  if (op.category !== undefined) {
    if (op.category !== null && !hasCategory(records, 'node', op.category)) return bad('类别不存在')
    patch.category = op.category
  }
  const node = found.node
  const content =
    (patch.name !== undefined && patch.name !== node.name) ||
    (patch.path !== undefined && patch.path !== node.path) ||
    (patch.description !== undefined && patch.description !== node.description)
  const meta =
    (patch.collapsed !== undefined && patch.collapsed !== node.collapsed) ||
    (patch.starred !== undefined && patch.starred !== (node.starred === true)) ||
    (patch.category !== undefined && (patch.category ?? undefined) !== node.category)
  if (!content && !meta) return { ok: true, records }
  const next: RecordNode = { ...node }
  if (patch.name !== undefined) next.name = patch.name
  if (patch.path !== undefined) next.path = patch.path
  if (patch.description !== undefined) next.description = patch.description
  if (patch.collapsed !== undefined) next.collapsed = patch.collapsed
  if (patch.starred === true) next.starred = true
  else if (patch.starred === false) delete next.starred
  if (patch.category === null) delete next.category
  else if (patch.category !== undefined) next.category = patch.category
  if (content) next.updatedAt = at
  const list = listOf(records, found.side).map((item) => (item.id === node.id ? next : item))
  return { ok: true, records: withList(records, found.side, list) }
}

function moveNode(records: ProjectRecords, op: Extract<RecordOp, { type: 'node.move' }>): RecordResult {
  const found = locate(records, op.nodeId)
  if (!found) return bad('节点不存在')
  if (op.parentId !== null && typeof op.parentId !== 'string') return bad('无效操作')
  const list = listOf(records, found.side)
  const index = indexNodes(list)
  const parentId = op.parentId
  if (parentId !== null) {
    if (!index.byId.has(parentId)) return bad('上级节点不存在')
    if (isInSubtree(index, found.node.id, parentId)) return bad('不能把节点移到它自己的下级')
    if (levelOf(index, parentId) + 1 + heightBelow(index, found.node.id) > RECORD_LIMITS.depth - 1) return bad(`层级最多 ${RECORD_LIMITS.depth} 层`)
  }
  const beforeId = op.beforeId ?? null
  if (beforeId === found.node.id) return { ok: true, records }
  const moved = parentId === found.node.parentId ? found.node : { ...found.node, parentId }
  const next = inPreorder(place(list.filter((node) => node.id !== found.node.id), moved, beforeId))
  if (parentId === found.node.parentId && sameList(siblingIds(list, parentId), siblingIds(next, parentId))) return { ok: true, records }
  return { ok: true, records: withList(records, found.side, next) }
}

function deleteNode(records: ProjectRecords, op: Extract<RecordOp, { type: 'node.delete' }>): RecordResult {
  const found = locate(records, op.nodeId)
  if (!found) return bad('节点不存在')
  const list = listOf(records, found.side)
  const index = indexNodes(list)
  const id = found.node.id
  if (op.lift === true) {
    const kids = childrenOf(index, id)
    const kidIds = new Set(kids.map((kid) => kid.id))
    const at = list.findIndex((node) => node.id === id)
    // Where the node sat, counted without the children (they are re-inserted there).
    const slot = list.slice(0, at).filter((node) => !kidIds.has(node.id)).length
    const next = list.filter((node) => node.id !== id && !kidIds.has(node.id))
    next.splice(slot, 0, ...kids.map((kid) => ({ ...kid, parentId: found.node.parentId })))
    const links = records.links.filter((link) => link.dataId !== id && link.resultId !== id)
    const relations = relationsOf(records).filter((relation) => relation.fromId !== id && relation.toId !== id)
    return { ok: true, records: withRelations({ ...withList(records, found.side, inPreorder(next)), links }, relations) }
  }
  const gone = new Set(subtreeIds(index, id))
  const links = records.links.filter((link) => !gone.has(link.dataId) && !gone.has(link.resultId))
  const relations = relationsOf(records).filter((relation) => !gone.has(relation.fromId) && !gone.has(relation.toId))
  return { ok: true, records: withRelations({ ...withList(records, found.side, list.filter((node) => !gone.has(node.id))), links }, relations) }
}

function restoreNodes(records: ProjectRecords, op: Extract<RecordOp, { type: 'node.restore' }>): RecordResult {
  if (!isSide(op.side)) return bad('分类无效')
  if (!Array.isArray(op.nodes) || op.nodes.length === 0) return bad('节点数据无效')
  const list = listOf(records, op.side)
  if (list.length + op.nodes.length > RECORD_LIMITS.nodesPerSide) return bad(`节点数量已达上限（${RECORD_LIMITS.nodesPerSide}）`)
  const nodes: RecordNode[] = []
  const ids = new Set<string>()
  for (const raw of op.nodes) {
    const node = sanitizeNode(raw)
    if (!node) return bad('节点数据无效')
    if (ids.has(node.id) || locate(records, node.id)) return bad('节点已存在')
    // A category deleted in the meantime cannot come back with the node.
    if (node.category !== undefined && !hasCategory(records, 'node', node.category)) delete node.category
    ids.add(node.id)
    nodes.push(node)
  }
  // The block is one subtree: exactly one node hangs from something outside it.
  const roots = nodes.filter((node) => node.parentId === null || !ids.has(node.parentId))
  if (roots.length !== 1) return bad('节点数据无效')
  const root = roots[0]!
  const block = indexNodes(nodes)
  if (subtreeIds(block, root.id).length !== nodes.length) return bad('节点数据无效')
  const index = indexNodes(list)
  if (root.parentId !== null && !index.byId.has(root.parentId)) return bad('上级节点不存在')
  const rootLevel = root.parentId === null ? 0 : levelOf(index, root.parentId) + 1
  if (rootLevel + heightBelow(block, root.id) > RECORD_LIMITS.depth - 1) return bad(`层级最多 ${RECORD_LIMITS.depth} 层`)

  const dataIds = new Set((op.side === 'data' ? [...list, ...nodes] : records.data).map((node) => node.id))
  const resultIds = new Set((op.side === 'result' ? [...list, ...nodes] : records.results).map((node) => node.id))
  const linkIds = new Set(records.links.map((link) => link.id))
  const pairs = new Set(records.links.map((link) => `${link.dataId}>${link.resultId}`))
  const links = records.links.slice()
  for (const raw of Array.isArray(op.links) ? op.links : []) {
    const link = sanitizeLink(raw)
    // A link whose other end has been deleted in the meantime cannot come back.
    if (!link || !dataIds.has(link.dataId) || !resultIds.has(link.resultId)) continue
    const pair = `${link.dataId}>${link.resultId}`
    if (linkIds.has(link.id) || pairs.has(pair) || links.length >= RECORD_LIMITS.links) continue
    if (link.category !== undefined && !hasCategory(records, 'edge', link.category)) delete link.category
    linkIds.add(link.id)
    pairs.add(pair)
    links.push(link)
  }
  const relations = relationsOf(records).slice()
  const relationIds = new Set(relations.map((relation) => relation.id))
  const relationPairs = new Set(relations.map((relation) => pairKey(relation.fromId, relation.toId)))
  for (const raw of Array.isArray(op.relations) ? op.relations : []) {
    const relation = sanitizeRelation(raw)
    if (!relation || relation.fromId === relation.toId || !resultIds.has(relation.fromId) || !resultIds.has(relation.toId)) continue
    const pair = pairKey(relation.fromId, relation.toId)
    if (relationIds.has(relation.id) || relationPairs.has(pair) || relations.length >= RECORD_LIMITS.relations) continue
    if (relation.category !== undefined && !hasCategory(records, 'edge', relation.category)) delete relation.category
    relationIds.add(relation.id)
    relationPairs.add(pair)
    relations.push(relation)
  }
  const at = typeof op.index === 'number' && Number.isInteger(op.index) ? Math.max(0, Math.min(list.length, op.index)) : list.length
  const next = list.slice()
  next.splice(at, 0, ...nodes)
  return { ok: true, records: withRelations({ ...withList(records, op.side, inPreorder(next)), links }, relations) }
}

function addLink(records: ProjectRecords, op: Extract<RecordOp, { type: 'link.add' }>, at: string): RecordResult {
  if (typeof op.id !== 'string' || !ID_PATTERN.test(op.id)) return bad('连线 id 无效')
  if (records.links.some((link) => link.id === op.id)) return bad('连线已存在')
  if (!records.data.some((node) => node.id === op.dataId)) return bad('数据节点不存在')
  if (!records.results.some((node) => node.id === op.resultId)) return bad('结果节点不存在')
  if (records.links.some((link) => link.dataId === op.dataId && link.resultId === op.resultId)) return bad('连线已存在')
  if (records.links.length >= RECORD_LIMITS.links) return bad(`连线数量已达上限（${RECORD_LIMITS.links}）`)
  if (op.category !== undefined && !hasCategory(records, 'edge', op.category)) return bad('类别不存在')
  const link: RecordLink = { id: op.id, dataId: op.dataId, resultId: op.resultId, createdAt: at, ...(op.category !== undefined ? { category: op.category } : {}) }
  return { ok: true, records: { ...records, links: [...records.links, link] } }
}

function updateLink(records: ProjectRecords, op: Extract<RecordOp, { type: 'link.update' }>): RecordResult {
  const found = typeof op.linkId === 'string' ? records.links.find((link) => link.id === op.linkId) : undefined
  if (!found) return bad('连线不存在')
  if (op.category === undefined) return { ok: true, records }
  if (op.category !== null && !hasCategory(records, 'edge', op.category)) return bad('类别不存在')
  if ((op.category ?? undefined) === found.category) return { ok: true, records }
  const next: RecordLink = { ...found }
  if (op.category === null) delete next.category
  else next.category = op.category
  return { ok: true, records: { ...records, links: records.links.map((link) => (link.id === found.id ? next : link)) } }
}

function addRelation(records: ProjectRecords, op: Extract<RecordOp, { type: 'relation.add' }>, at: string): RecordResult {
  if (typeof op.id !== 'string' || !ID_PATTERN.test(op.id)) return bad('连线 id 无效')
  const relations = relationsOf(records)
  if (relations.some((relation) => relation.id === op.id)) return bad('连线已存在')
  if (typeof op.fromId !== 'string' || typeof op.toId !== 'string' || !records.results.some((node) => node.id === op.fromId) || !records.results.some((node) => node.id === op.toId)) {
    return bad('结果节点不存在')
  }
  if (op.fromId === op.toId) return bad('不能把结果连到它自己')
  const pair = pairKey(op.fromId, op.toId)
  if (relations.some((relation) => pairKey(relation.fromId, relation.toId) === pair)) return bad('连线已存在')
  if (relations.length >= RECORD_LIMITS.relations) return bad(`连线数量已达上限（${RECORD_LIMITS.relations}）`)
  if (op.directed !== undefined && typeof op.directed !== 'boolean') return bad('无效操作')
  if (op.category !== undefined && !hasCategory(records, 'edge', op.category)) return bad('类别不存在')
  const relation: RecordRelation = {
    id: op.id,
    fromId: op.fromId,
    toId: op.toId,
    createdAt: at,
    ...(op.directed === true ? { directed: true as const } : {}),
    ...(op.category !== undefined ? { category: op.category } : {}),
  }
  return { ok: true, records: withRelations(records, [...relations, relation]) }
}

function updateRelation(records: ProjectRecords, op: Extract<RecordOp, { type: 'relation.update' }>): RecordResult {
  const relations = relationsOf(records)
  const found = typeof op.relationId === 'string' ? relations.find((relation) => relation.id === op.relationId) : undefined
  if (!found) return bad('连线不存在')
  if (op.directed !== undefined && typeof op.directed !== 'boolean') return bad('无效操作')
  if (op.reverse !== undefined && typeof op.reverse !== 'boolean') return bad('无效操作')
  if (op.category !== undefined && op.category !== null && !hasCategory(records, 'edge', op.category)) return bad('类别不存在')
  let next: RecordRelation = { ...found }
  if (op.directed === true) next.directed = true
  else if (op.directed === false) delete next.directed
  if (op.reverse === true) next = { ...next, fromId: found.toId, toId: found.fromId }
  if (op.category === null) delete next.category
  else if (op.category !== undefined) next.category = op.category
  const same = next.fromId === found.fromId && next.toId === found.toId && next.directed === found.directed && next.category === found.category
  if (same) return { ok: true, records }
  return { ok: true, records: withRelations(records, relations.map((relation) => (relation.id === found.id ? next : relation))) }
}

const EMPTY_PALETTE: RecordPalette = { nodeCategories: [], edgeCategories: [] }

function paletteOf(records: ProjectRecords): RecordPalette {
  return records.palette ?? EMPTY_PALETTE
}

function addCategory(records: ProjectRecords, op: Extract<RecordOp, { type: 'category.add' }>): RecordResult {
  if (op.kind !== 'node' && op.kind !== 'edge') return bad('类别种类无效')
  if (typeof op.id !== 'string' || !ID_PATTERN.test(op.id)) return bad('类别 id 无效')
  const palette = paletteOf(records)
  if ([...palette.nodeCategories, ...palette.edgeCategories].some((category) => category.id === op.id)) return bad('类别已存在')
  const name = cleanLine(op.name, RECORD_LIMITS.categoryName)
  if (name === undefined) return bad(`类别名称需为 1–${RECORD_LIMITS.categoryName} 个字符`)
  const color = cleanColor(op.color)
  if (color === undefined) return bad('颜色需要是 #RRGGBB')
  const list = op.kind === 'node' ? palette.nodeCategories : palette.edgeCategories
  if (list.length >= RECORD_LIMITS.categories) return bad(`类别数量已达上限（${RECORD_LIMITS.categories}）`)
  const at = typeof op.index === 'number' && Number.isInteger(op.index) ? Math.max(0, Math.min(list.length, op.index)) : list.length
  const next = list.slice()
  next.splice(at, 0, { id: op.id, name, color })
  return { ok: true, records: withPalette(records, op.kind === 'node' ? { ...palette, nodeCategories: next } : { ...palette, edgeCategories: next }) }
}

function updateCategory(records: ProjectRecords, op: Extract<RecordOp, { type: 'category.update' }>): RecordResult {
  if (op.kind !== 'node' && op.kind !== 'edge') return bad('类别种类无效')
  const palette = paletteOf(records)
  const list = op.kind === 'node' ? palette.nodeCategories : palette.edgeCategories
  const found = typeof op.categoryId === 'string' ? list.find((category) => category.id === op.categoryId) : undefined
  if (!found) return bad('类别不存在')
  let name = found.name
  let color = found.color
  if (op.name !== undefined) {
    const cleaned = cleanLine(op.name, RECORD_LIMITS.categoryName)
    if (cleaned === undefined) return bad(`类别名称需为 1–${RECORD_LIMITS.categoryName} 个字符`)
    name = cleaned
  }
  if (op.color !== undefined) {
    const cleaned = cleanColor(op.color)
    if (cleaned === undefined) return bad('颜色需要是 #RRGGBB')
    color = cleaned
  }
  if (name === found.name && color === found.color) return { ok: true, records }
  const next = list.map((category) => (category.id === found.id ? { ...category, name, color } : category))
  return { ok: true, records: withPalette(records, op.kind === 'node' ? { ...palette, nodeCategories: next } : { ...palette, edgeCategories: next }) }
}

function deleteCategory(records: ProjectRecords, op: Extract<RecordOp, { type: 'category.delete' }>): RecordResult {
  if (op.kind !== 'node' && op.kind !== 'edge') return bad('类别种类无效')
  const palette = paletteOf(records)
  const list = op.kind === 'node' ? palette.nodeCategories : palette.edgeCategories
  if (typeof op.categoryId !== 'string' || !list.some((category) => category.id === op.categoryId)) return bad('类别不存在')
  const id = op.categoryId
  const without = list.filter((category) => category.id !== id)
  let next = withPalette(records, op.kind === 'node' ? { ...palette, nodeCategories: without } : { ...palette, edgeCategories: without })
  // Whatever used the category goes back to the default look.
  const clear = <T extends { category?: string }>(items: T[]): T[] =>
    items.some((item) => item.category === id)
      ? items.map((item) => {
          if (item.category !== id) return item
          const { category: _dropped, ...rest } = item
          return rest as T
        })
      : items
  if (op.kind === 'node') next = { ...next, data: clear(next.data), results: clear(next.results) }
  else next = withRelations({ ...next, links: clear(next.links) }, clear(relationsOf(next).slice()))
  return { ok: true, records: next }
}

function updatePalette(records: ProjectRecords, op: Extract<RecordOp, { type: 'palette.update' }>): RecordResult {
  const palette = paletteOf(records)
  const defaults: { node?: string; edge?: string; star?: string } = { ...(palette.defaults ?? {}) }
  let changed = false
  for (const key of ['node', 'edge', 'star'] as const) {
    const value = op[key]
    if (value === undefined) continue
    if (value === null) {
      if (defaults[key] !== undefined) changed = true
      delete defaults[key]
      continue
    }
    const color = cleanColor(value)
    if (color === undefined) return bad('颜色需要是 #RRGGBB')
    if (defaults[key] !== color) changed = true
    defaults[key] = color
  }
  if (!changed) return { ok: true, records }
  return { ok: true, records: withPalette(records, { ...palette, defaults }) }
}

// ------------------------------------------------------------------ sanitizing

const nowIso = (): string => new Date().toISOString()

const validId = (value: unknown): value is string => typeof value === 'string' && ID_PATTERN.test(value)

/** Narrow untrusted data to a node, or undefined. */
export function sanitizeNode(value: unknown): RecordNode | undefined {
  const raw = value as Partial<RecordNode> | null
  if (raw === null || typeof raw !== 'object') return undefined
  if (!validId(raw.id)) return undefined
  const name = cleanLine(raw.name, RECORD_LIMITS.name)
  const path = raw.path === undefined ? '' : cleanPath(raw.path, RECORD_LIMITS.path)
  const description = raw.description === undefined ? '' : cleanText(raw.description, RECORD_LIMITS.description)
  if (name === undefined || path === undefined || description === undefined) return undefined
  const parentId = raw.parentId === null || raw.parentId === undefined ? null : validId(raw.parentId) ? raw.parentId : undefined
  if (parentId === undefined) return undefined
  const createdAt = typeof raw.createdAt === 'string' ? raw.createdAt : nowIso()
  const node: RecordNode = { id: raw.id, name, path, description, parentId, collapsed: raw.collapsed === true, createdAt, updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : createdAt }
  if (raw.starred === true) node.starred = true
  if (validId(raw.category)) node.category = raw.category
  return node
}

/** Narrow untrusted data to a link, or undefined. */
export function sanitizeLink(value: unknown): RecordLink | undefined {
  const raw = value as Partial<RecordLink> | null
  if (raw === null || typeof raw !== 'object') return undefined
  if (!validId(raw.id) || !validId(raw.dataId) || !validId(raw.resultId)) return undefined
  const link: RecordLink = { id: raw.id, dataId: raw.dataId, resultId: raw.resultId, createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : nowIso() }
  if (validId(raw.category)) link.category = raw.category
  return link
}

/** Narrow untrusted data to a relation between results, or undefined. */
export function sanitizeRelation(value: unknown): RecordRelation | undefined {
  const raw = value as Partial<RecordRelation> | null
  if (raw === null || typeof raw !== 'object') return undefined
  if (!validId(raw.id) || !validId(raw.fromId) || !validId(raw.toId)) return undefined
  const relation: RecordRelation = { id: raw.id, fromId: raw.fromId, toId: raw.toId, createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : nowIso() }
  if (raw.directed === true) relation.directed = true
  if (validId(raw.category)) relation.category = raw.category
  return relation
}

function sanitizeCategories(value: unknown, seen: Set<string>): RecordCategory[] {
  const out: RecordCategory[] = []
  for (const item of Array.isArray(value) ? value : []) {
    const raw = item as Partial<RecordCategory> | null
    if (raw === null || typeof raw !== 'object' || !validId(raw.id) || seen.has(raw.id)) continue
    const name = cleanLine(raw.name, RECORD_LIMITS.categoryName)
    const color = cleanColor(raw.color)
    if (name === undefined || color === undefined) continue
    if (out.length >= RECORD_LIMITS.categories) break
    seen.add(raw.id)
    out.push({ id: raw.id, name, color })
  }
  return out
}

function sanitizePalette(value: unknown): RecordPalette | undefined {
  if (value === null || typeof value !== 'object') return undefined
  const raw = value as { nodeCategories?: unknown; edgeCategories?: unknown; defaults?: unknown }
  const seen = new Set<string>()
  const nodeCategories = sanitizeCategories(raw.nodeCategories, seen)
  const edgeCategories = sanitizeCategories(raw.edgeCategories, seen)
  const defaults: { node?: string; edge?: string; star?: string } = {}
  if (raw.defaults !== null && typeof raw.defaults === 'object') {
    const given = raw.defaults as Record<string, unknown>
    for (const key of ['node', 'edge', 'star'] as const) {
      const color = cleanColor(given[key])
      if (color !== undefined) defaults[key] = color
    }
  }
  const hasDefaults = Object.keys(defaults).length > 0
  if (nodeCategories.length === 0 && edgeCategories.length === 0 && !hasDefaults) return undefined
  return { nodeCategories, edgeCategories, ...(hasDefaults ? { defaults } : {}) }
}

/** Keep the valid, unique nodes of one tree and make every parent chain end at the top. */
function sanitizeNodeList(value: unknown, seen: Set<string>): RecordNode[] {
  const nodes: RecordNode[] = []
  for (const item of Array.isArray(value) ? value : []) {
    const node = sanitizeNode(item)
    if (!node || seen.has(node.id)) continue
    if (nodes.length >= RECORD_LIMITS.nodesPerSide) break
    seen.add(node.id)
    nodes.push(node)
  }
  const byId = new Map(nodes.map((node) => [node.id, node]))
  for (const node of nodes) {
    // A parent that is missing (or is the node itself) leaves the node at the top.
    if (node.parentId !== null && (node.parentId === node.id || !byId.has(node.parentId))) node.parentId = null
  }
  for (const node of nodes) {
    // Cut a cycle at the first node that comes round again.
    const chain = new Set<string>()
    let current: RecordNode | undefined = node
    while (current && current.parentId !== null) {
      if (chain.has(current.id)) {
        current.parentId = null
        break
      }
      chain.add(current.id)
      current = byId.get(current.parentId)
    }
  }
  return inPreorder(nodes)
}

/**
 * Narrow untrusted stored records, dropping what is malformed: duplicate or
 * invalid nodes, parents that do not exist, cycles, links and relations whose
 * ends are missing or on the wrong side, and categories that do not exist.
 * @returns the records, or undefined when there is nothing to keep.
 */
export function sanitizeRecords(value: unknown): ProjectRecords | undefined {
  if (value === null || typeof value !== 'object') return undefined
  const raw = value as { data?: unknown; results?: unknown; links?: unknown; relations?: unknown; palette?: unknown }
  const palette = sanitizePalette(raw.palette)
  const nodeCategoryIds = new Set(palette?.nodeCategories.map((category) => category.id))
  const edgeCategoryIds = new Set(palette?.edgeCategories.map((category) => category.id))
  const seen = new Set<string>()
  const data = sanitizeNodeList(raw.data, seen)
  const results = sanitizeNodeList(raw.results, seen)
  if (data.length === 0 && results.length === 0 && !palette) return undefined
  for (const node of [...data, ...results]) if (node.category !== undefined && !nodeCategoryIds.has(node.category)) delete node.category
  const dataIds = new Set(data.map((node) => node.id))
  const resultIds = new Set(results.map((node) => node.id))
  const linkIds = new Set<string>()
  const pairs = new Set<string>()
  const links: RecordLink[] = []
  for (const item of Array.isArray(raw.links) ? raw.links : []) {
    const link = sanitizeLink(item)
    if (!link || !dataIds.has(link.dataId) || !resultIds.has(link.resultId) || linkIds.has(link.id)) continue
    const pair = `${link.dataId}>${link.resultId}`
    if (pairs.has(pair)) continue
    if (links.length >= RECORD_LIMITS.links) break
    if (link.category !== undefined && !edgeCategoryIds.has(link.category)) delete link.category
    linkIds.add(link.id)
    pairs.add(pair)
    links.push(link)
  }
  const relationIds = new Set<string>()
  const relationPairs = new Set<string>()
  const relations: RecordRelation[] = []
  for (const item of Array.isArray(raw.relations) ? raw.relations : []) {
    const relation = sanitizeRelation(item)
    if (!relation || relation.fromId === relation.toId || !resultIds.has(relation.fromId) || !resultIds.has(relation.toId) || relationIds.has(relation.id)) continue
    const pair = pairKey(relation.fromId, relation.toId)
    if (relationPairs.has(pair)) continue
    if (relations.length >= RECORD_LIMITS.relations) break
    if (relation.category !== undefined && !edgeCategoryIds.has(relation.category)) delete relation.category
    relationIds.add(relation.id)
    relationPairs.add(pair)
    relations.push(relation)
  }
  return { data, results, links, ...(relations.length > 0 ? { relations } : {}), ...(palette ? { palette } : {}) }
}
