/**
 * The pure parts of the records page: which rows a tree shows, where a drop
 * lands, which links light up, the shape of a line, and which colour things
 * get. Kept apart from the components so they can be tested without a DOM.
 * @module dsh-project-kanban/client/recordsModel
 */
import {
  categoriesOf,
  childrenOf,
  isInSubtree,
  pairKey,
  subtreeIds,
  relationsOf,
  type CategoryKind,
  type ProjectRecords,
  type RecordIndex,
  type RecordLink,
  type RecordNode,
  type RecordRelation,
  type RecordSide,
} from '../shared/records'

/** One visible node of a tree. */
export interface NodeRow {
  kind: 'node'
  node: RecordNode
  depth: number
  childCount: number
  /** Children are showing. */
  expanded: boolean
  /** In the star-only view: not starred itself, shown only because something below it is. */
  context: boolean
}

/** The inline "add" form, shown under the node it adds to (or at the end of the tree). */
export interface FormRow {
  kind: 'form'
  parentId: string | null
  depth: number
}

export type Row = NodeRow | FormRow

/** What a tree shows. */
export interface Flat {
  rows: Row[]
  /**
   * For every shown node, the id of the row that stands for it: itself, or
   * the nearest ancestor that is showing when it sits inside a folded group.
   * Nodes the view leaves out have no entry.
   */
  anchor: Map<string, string>
}

/** The star-only view: the nodes it shows and which of them are starred. */
export interface StarView {
  /** Starred nodes and their ancestors. */
  only: ReadonlySet<string>
  starred: ReadonlySet<string>
}

/**
 * The nodes the star-only view shows for one tree: the starred ones and, so
 * they stay in their place, everything above them.
 */
export function starViewOf(index: RecordIndex, nodes: readonly RecordNode[]): StarView {
  const starred = new Set<string>()
  const only = new Set<string>()
  for (const node of nodes) {
    if (node.starred !== true) continue
    starred.add(node.id)
    for (let current: RecordNode | undefined = node, steps = 0; current && !only.has(current.id) && steps <= nodes.length; steps++) {
      only.add(current.id)
      current = current.parentId === null ? undefined : index.byId.get(current.parentId)
    }
    only.add(node.id)
  }
  return { only, starred }
}

/**
 * The rows of one tree, parents first, skipping folded subtrees.
 * @param index - the indexed tree.
 * @param formParent - show the add form as the last child of this node
 *   (null = at the end of the tree, undefined = no form).
 * @param view - the star-only view: leave out what it does not show, and
 *   show every group open (folding is not part of that view).
 */
export function flattenTree(index: RecordIndex, formParent?: string | null, view?: StarView): Flat {
  const rows: Row[] = []
  const anchor = new Map<string, string>()
  const shown = (parentId: string | null): readonly RecordNode[] => {
    const kids = childrenOf(index, parentId)
    return view ? kids.filter((kid) => view.only.has(kid.id)) : kids
  }
  const walk = (parentId: string | null, depth: number, hiddenBy: string | null): void => {
    for (const node of shown(parentId)) {
      const kids = shown(node.id)
      anchor.set(node.id, hiddenBy ?? node.id)
      const folded = view === undefined && node.collapsed && kids.length > 0
      if (hiddenBy === null) rows.push({ kind: 'node', node, depth, childCount: kids.length, expanded: kids.length > 0 && !folded, context: view !== undefined && !view.starred.has(node.id) })
      walk(node.id, depth + 1, hiddenBy ?? (folded ? node.id : null))
    }
    if (hiddenBy === null && formParent !== undefined && formParent === parentId) rows.push({ kind: 'form', parentId, depth })
  }
  walk(null, 0, null)
  return { rows, anchor }
}

// ------------------------------------------------------------------ dropping

/** Where on a row a drop is aimed: above it, onto it (becomes a child), or below it. */
export type DropZone = 'before' | 'inside' | 'after'

/**
 * Which third of a row the pointer is over: the top and bottom edges mean
 * "next to it", the middle means "into it". A row without height (not laid
 * out yet) always means "into it".
 */
export function zoneAt(clientY: number, top: number, height: number): DropZone {
  if (!(height > 0)) return 'inside'
  const ratio = (clientY - top) / height
  return ratio < 0.3 ? 'before' : ratio > 0.7 ? 'after' : 'inside'
}

/** The parent and sibling a moved node lands under. */
export interface DropTarget {
  parentId: string | null
  beforeId: string | null
}

/**
 * Where a drop on `zone` of the row `targetId` puts the moved nodes.
 * @param index - the indexed tree.
 * @param targetId - the row that was dropped on.
 * @param zone - the part of the row.
 * @param skip - the nodes being moved (they never serve as the anchor).
 */
export function dropTarget(index: RecordIndex, targetId: string, zone: DropZone, skip: ReadonlySet<string>): DropTarget | undefined {
  const target = index.byId.get(targetId)
  if (!target) return undefined
  const firstFree = (nodes: readonly RecordNode[]): string | null => nodes.find((node) => !skip.has(node.id))?.id ?? null
  if (zone === 'inside') return { parentId: target.id, beforeId: null }
  if (zone === 'before') return { parentId: target.parentId, beforeId: target.id }
  const kids = childrenOf(index, target.id)
  // The bottom edge of an open group means "first thing inside it": that is where the line is drawn.
  if (kids.length > 0 && !target.collapsed) return { parentId: target.id, beforeId: firstFree(kids) }
  const siblings = childrenOf(index, target.parentId)
  const at = siblings.findIndex((node) => node.id === target.id)
  return { parentId: target.parentId, beforeId: firstFree(siblings.slice(at + 1)) }
}

/**
 * The nodes that can really move to `parentId`: not a node that already
 * travels inside another moved node, and not a node that is (or contains)
 * the new parent. Keeps the given order.
 */
export function movableIds(index: RecordIndex, ids: readonly string[], parentId: string | null): string[] {
  const chosen = new Set(ids)
  return ids.filter((id) => {
    if (!index.byId.has(id)) return false
    if (parentId !== null && isInSubtree(index, id, parentId)) return false
    // An ancestor that is moving too carries this one along.
    for (let parent = index.byId.get(id)?.parentId ?? null, steps = 0; parent !== null && steps <= index.byId.size; steps++) {
      if (chosen.has(parent)) return false
      parent = index.byId.get(parent)?.parentId ?? null
    }
    return true
  })
}

/** The ids in the order the rows show them (selection order is click order, not tree order). */
export function inRowOrder(rows: readonly Row[], ids: ReadonlySet<string>): string[] {
  const out: string[] = []
  for (const row of rows) if (row.kind === 'node' && ids.has(row.node.id)) out.push(row.node.id)
  return out
}

// ------------------------------------------------------------------ links

/** What is lit while a node is hovered or picked. */
export interface Highlight {
  /** The focused node and everything below it. */
  active: Set<string>
  /** Links (data → result) that touch the active nodes. */
  linkIds: Set<string>
  /** Relations (result — result) that touch the active nodes. */
  relationIds: Set<string>
  /** The nodes on the other end of those links and relations. */
  linked: Set<string>
}

const NO_HIGHLIGHT: Highlight = { active: new Set(), linkIds: new Set(), relationIds: new Set(), linked: new Set() }

/**
 * What lights up when `focusId` is hovered or picked: the node and its
 * subtree, the links and relations that leave them, and the nodes those reach.
 */
export function highlightFor(records: ProjectRecords, indexes: Record<RecordSide, RecordIndex>, focusId: string | null): Highlight {
  if (focusId === null) return NO_HIGHLIGHT
  const side: RecordSide | undefined = indexes.data.byId.has(focusId) ? 'data' : indexes.result.byId.has(focusId) ? 'result' : undefined
  if (side === undefined) return NO_HIGHLIGHT
  const active = new Set(subtreeIds(indexes[side], focusId))
  const linkIds = new Set<string>()
  const relationIds = new Set<string>()
  const linked = new Set<string>()
  for (const link of records.links) {
    const near = side === 'data' ? link.dataId : link.resultId
    if (!active.has(near)) continue
    linkIds.add(link.id)
    linked.add(side === 'data' ? link.resultId : link.dataId)
  }
  if (side === 'result') {
    for (const relation of relationsOf(records)) {
      const from = active.has(relation.fromId)
      const to = active.has(relation.toId)
      if (!from && !to) continue
      relationIds.add(relation.id)
      if (from && !to) linked.add(relation.toId)
      else if (to && !from) linked.add(relation.fromId)
    }
  }
  return { active, linkIds, relationIds, linked }
}

/** One line drawn between a data row and a result row (several links can share it when groups are folded). */
export interface Line {
  key: string
  /** The row ports it runs between. */
  from: string
  to: string
  /** The links it stands for. */
  links: RecordLink[]
  /** At least one end is a folded-away node, shown through its group. */
  folded: boolean
}

/**
 * The lines to draw: one per pair of visible rows. A link whose end sits in
 * a folded group is drawn to the group instead, and links that then run
 * between the same two rows are drawn once.
 */
export function linesOf(links: readonly RecordLink[], dataAnchor: ReadonlyMap<string, string>, resultAnchor: ReadonlyMap<string, string>): Line[] {
  const lines = new Map<string, Line>()
  for (const link of links) {
    const from = dataAnchor.get(link.dataId)
    const to = resultAnchor.get(link.resultId)
    if (from === undefined || to === undefined) continue
    const key = `${from}>${to}`
    const folded = from !== link.dataId || to !== link.resultId
    const line = lines.get(key)
    if (line) {
      line.links.push(link)
      line.folded = line.folded || folded
    } else {
      lines.set(key, { key, from, to, links: [link], folded })
    }
  }
  return [...lines.values()]
}

/** One line drawn between two result rows, on the right of the result tree. */
export interface RelationLine {
  key: string
  /** The rows it runs between (the row of `fromId` first). */
  from: string
  to: string
  relations: RecordRelation[]
  folded: boolean
  /** Shows an arrow, pointing at `to`. */
  directed: boolean
}

/**
 * The relation lines to draw: one per pair of visible result rows. A relation
 * that ends inside a folded group is drawn to the group; a relation between
 * two things of the same folded group is not drawn at all. Lines that stand
 * for several relations only show an arrow when they all point the same way.
 */
export function relationLinesOf(relations: readonly RecordRelation[], anchor: ReadonlyMap<string, string>): RelationLine[] {
  const lines = new Map<string, RelationLine>()
  for (const relation of relations) {
    const from = anchor.get(relation.fromId)
    const to = anchor.get(relation.toId)
    if (from === undefined || to === undefined || from === to) continue
    const key = pairKey(from, to)
    const folded = from !== relation.fromId || to !== relation.toId
    const line = lines.get(key)
    if (line) {
      line.relations.push(relation)
      line.folded = line.folded || folded
      line.directed = line.directed && relation.directed === true && from === line.from
    } else {
      lines.set(key, { key, from, to, relations: [relation], folded, directed: relation.directed === true })
    }
  }
  return [...lines.values()]
}

/** A smooth S-curve from (x1, y1) to (x2, y2), leaving and arriving horizontally. */
export function curve(x1: number, y1: number, x2: number, y2: number): string {
  const reach = Math.max(36, Math.abs(x2 - x1) * 0.5)
  return `M${x1},${y1} C${x1 + reach},${y1} ${x2 - reach},${y2} ${x2},${y2}`
}

/** The middle of that curve (its control points are symmetric, so this is exact). */
export function curveMiddle(x1: number, y1: number, x2: number, y2: number): { x: number; y: number } {
  return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 }
}

/** How far a bracket between two rows bulges to the right: more for rows further apart. */
export function arcReach(y1: number, y2: number): number {
  return Math.max(24, Math.min(72, Math.abs(y2 - y1) * 0.35))
}

/** A bracket on the right of a tree joining the ports at (x, y1) and (x, y2). */
export function arc(x: number, y1: number, y2: number): string {
  const reach = arcReach(y1, y2)
  return `M${x},${y1} C${x + reach},${y1} ${x + reach},${y2} ${x},${y2}`
}

/** The middle of that bracket. */
export function arcMiddle(x: number, y1: number, y2: number): { x: number; y: number } {
  return { x: x + arcReach(y1, y2) * 0.75, y: (y1 + y2) / 2 }
}

/** The corners of an arrowhead whose tip is at (x, y) and that points left, into a port. */
export function arrowPoints(x: number, y: number, size = 9): string {
  return `${x},${y} ${x + size},${y - size * 0.5} ${x + size},${y + size * 0.5}`
}

// ------------------------------------------------------------------ colours

/** The star colour when the project has not chosen one: a light red. */
export const DEFAULT_STAR_COLOR = '#f0777d'

/** The colour of a category of one kind, if it exists. */
export function categoryColor(records: ProjectRecords, kind: CategoryKind, id: string | undefined): string | undefined {
  return id === undefined ? undefined : categoriesOf(records, kind).find((category) => category.id === id)?.color
}

/** The star colour in use. */
export function starColor(records: ProjectRecords): string {
  return records.palette?.defaults?.star ?? DEFAULT_STAR_COLOR
}

/**
 * The colour a node's marks (icon, port) take: its category's, else the
 * default node colour, else nothing (the built-in look).
 */
export function nodeColor(records: ProjectRecords, node: RecordNode): string | undefined {
  return categoryColor(records, 'node', node.category) ?? records.palette?.defaults?.node
}

/**
 * The colour of an edge: its category's, else the star colour when one of its
 * ends is starred, else the default edge colour, else nothing (the built-in
 * look, which follows the project's colour).
 */
export function edgeColor(records: ProjectRecords, edge: { category?: string }, starred: boolean): string | undefined {
  return categoryColor(records, 'edge', edge.category) ?? (starred ? starColor(records) : records.palette?.defaults?.edge)
}
