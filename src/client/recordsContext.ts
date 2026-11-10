/**
 * What the records page hands down to its trees, rows and cards: the data,
 * the small UI state, and every action. One context instead of a dozen
 * props; the page builds the value, the tree components only read it.
 * @module dsh-project-kanban/client/recordsContext
 */
import { createContext, useContext, type MutableRefObject, type PointerEvent as ReactPointerEvent } from 'react'
import type { Project } from '../shared/board'
import type { CategoryKind, ProjectRecords, RecordIndex, RecordNode, RecordOp, RecordRelation, RecordSide } from '../shared/records'
import type { DropZone } from './recordsModel'

/** Where a drag is currently aimed. */
export interface DropHint {
  side: RecordSide
  /** The row it is over; null for "the end of the tree" (below the last row). */
  targetId: string | null
  zone: DropZone | 'end'
}

/** The text fields of a node, as typed in a form. */
export interface NodeFields {
  name: string
  path: string
  description: string
}

/** What a line being dragged out of a port will become. */
export type ConnectMode = 'link' | 'relation'

export interface RecordsUi {
  project: Project
  records: ProjectRecords
  indexes: Record<RecordSide, RecordIndex>

  // ---- what is shown
  /** Cards that are expanded. */
  openIds: ReadonlySet<string>
  /** The card that is being edited. */
  editingId: string | null
  /** The node that is hovered, else the one that was picked last; its links light up. */
  focusId: string | null
  /** Nodes lit because they are the focus or lie below it. */
  withinIds: ReadonlySet<string>
  /** Rows lit because a link or relation of the focus ends there. */
  linkedRows: ReadonlySet<string>
  /** How many links end at each row (folded children counted into their group). */
  linkCounts: ReadonlyMap<string, number>
  /** How many relations end at each result row. */
  relationCounts: ReadonlyMap<string, number>
  selection: { side: RecordSide; ids: ReadonlySet<string> } | null
  renamingId: string | null
  adding: { side: RecordSide; parentId: string | null } | null
  dropHint: DropHint | null
  /** A line is being dragged from this node; `overId` is the row it is over. */
  /** `blocked`: for a relation, the results that are already related to the start (the line would be refused there). */
  connecting: { side: RecordSide; id: string; overId: string | null; mode: ConnectMode; blocked?: ReadonlySet<string> } | null
  /** The node being dragged in a tree (with the rest of the selection, if it was part of it). */
  drag: MutableRefObject<{ side: RecordSide; ids: string[] } | null>
  landedId: string | null
  /** Only the starred nodes (and what they sit in) are shown. */
  starOnly: boolean
  /** The colour a node's marks take, if it has one. */
  colorOf(node: RecordNode): string | undefined

  // ---- view state
  toggleOpen(id: string): void
  setEditing(id: string | null): void
  /** Pick a node (or nothing) as the focus that stays when the pointer leaves. */
  pick(id: string | null): void
  hover(id: string | null): void
  toggleSelect(side: RecordSide, id: string): void
  setRenaming(id: string | null): void
  startAdd(side: RecordSide, parentId: string | null): void
  stopAdd(): void
  setDropHint(hint: DropHint | null): void
  /** Ports are registered under the node id, or `<id>:r` for the right-hand port of a result. */
  registerPort(key: string, element: HTMLElement | null): void
  beginConnect(side: RecordSide, id: string, event: ReactPointerEvent, mode: ConnectMode): void
  /** Open a node's card, unfolding whatever hides it, and scroll to it. */
  reveal(id: string): void
  /** Open the colours and categories panel. */
  openPalette(): void

  // ---- changes (each is one undo step)
  /** Run ops as one step of the undo history. */
  perform(label: string, ops: RecordOp[], options?: { toast?: string }): boolean
  addNode(side: RecordSide, parentId: string | null, fields: NodeFields): boolean
  updateNode(id: string, fields: Partial<NodeFields>): boolean
  removeNode(node: RecordNode): void
  dissolveNode(node: RecordNode): void
  /** Outliner moves for the keyboard and the menu. */
  shift(node: RecordNode, how: 'up' | 'down' | 'in' | 'out'): void
  dropOn(side: RecordSide, targetId: string | null, zone: DropZone | 'end'): void
  addLink(dataId: string, resultId: string): boolean
  removeLink(id: string): void
  addRelation(fromId: string, toId: string, directed?: boolean): boolean
  updateRelation(id: string, patch: { directed?: boolean; reverse?: boolean }): void
  removeRelation(relation: RecordRelation): void
  toggleFold(node: RecordNode): void
  toggleStar(node: RecordNode): void
  /** Star (or unstar) a node and everything below it. */
  toggleStarTree(node: RecordNode): void
  setCategory(ids: readonly string[], category: string | null): void
  /** Give a link or relation a category (null = the default look). */
  setEdgeCategory(edge: { kind: 'link' | 'relation'; id: string }, category: string | null): void
  addCategory(kind: CategoryKind, name: string, color: string): void
  updateCategory(kind: CategoryKind, id: string, patch: { name?: string; color?: string }): void
  removeCategory(kind: CategoryKind, id: string): void
  setDefaultColor(which: 'node' | 'edge' | 'star', color: string | null): void
}

export const RecordsContext = createContext<RecordsUi | null>(null)

/** The records page's context; throws outside it. */
export function useRecords(): RecordsUi {
  const value = useContext(RecordsContext)
  if (!value) throw new Error('RecordsView context missing')
  return value
}
