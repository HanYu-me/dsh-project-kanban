/**
 * The page that opens when a project is clicked: the project's key data as a
 * tree on the left, its results as a tree on the right, and lines between
 * them that say which result came from which data. Results can also be
 * connected to each other (lines on the right of the result tree); data and
 * results can be starred, coloured by category, and filtered to the starred.
 *
 * All changes are ops through the same optimistic sync as the board, and each
 * user action is one step of an undo history (⌘Z / ⇧⌘Z). The lines are an SVG
 * laid over the trees; the page measures the ports of the visible rows after
 * every render and draws the curves between them.
 * @module dsh-project-kanban/client/RecordsView
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { newId, recordsOf, type Project } from '../shared/board'
import { categoriesOf, childrenOf, indexNodes, listOf, recordCounts, relationsOf, subtreeIds, type CategoryKind, type RecordNode, type RecordOp, type RecordRelation, type RecordSide } from '../shared/records'
import { planOps } from '../shared/records-history'
import { COLOR_VALUES, SaveStatus, useActions } from './common'
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon, FolderPlusIcon, MinusIcon, RecordsIcon, RedoIcon, StarIcon, SwapIcon, UndoIcon } from './icons'
import { PaletteButton } from './PalettePanel'
import { TreePanel } from './RecordTree'
import { RecordsContext, type ConnectMode, type DropHint, type NodeFields, type RecordsUi } from './recordsContext'
import { forgetAllHistories, historyOf, type Step } from './recordsHistory'
import {
  arc,
  arcMiddle,
  arrowPoints,
  curve,
  curveMiddle,
  dropTarget,
  edgeColor,
  flattenTree,
  highlightFor,
  inRowOrder,
  linesOf,
  movableIds,
  nodeColor,
  relationLinesOf,
  starColor,
  starViewOf,
  type DropZone,
} from './recordsModel'
import type { SyncStatus } from './sync'

/** Measured port positions, relative to the diagram. */
interface Geometry {
  width: number
  height: number
  ports: Record<string, { x: number; y: number }>
}

const EMPTY_GEOMETRY: Geometry = { width: 0, height: 0, ports: {} }

function sameGeometry(a: Geometry, b: Geometry): boolean {
  if (Math.abs(a.width - b.width) > 0.5 || Math.abs(a.height - b.height) > 0.5) return false
  const keys = Object.keys(b.ports)
  if (keys.length !== Object.keys(a.ports).length) return false
  return keys.every((key) => {
    const before = a.ports[key]
    const after = b.ports[key]!
    return before !== undefined && Math.abs(before.x - after.x) < 0.5 && Math.abs(before.y - after.y) < 0.5
  })
}

const round = (n: number): number => Math.round(n * 10) / 10

/** The record node a pointer event landed on (its row or its port), if any. */
function nodeUnder(target: EventTarget | null): { side: RecordSide; id: string } | null {
  const element = (target as Element | null)?.closest?.('[data-rec-node]') as HTMLElement | null | undefined
  const id = element?.dataset.recNode
  const side = element?.dataset.recSide
  return id !== undefined && (side === 'data' || side === 'result') ? { side, id } : null
}

/** Whether the keyboard focus is somewhere text is typed (where ⌘Z means the text's own undo). */
function typingIn(target: EventTarget | null): boolean {
  return (target as Element | null)?.closest?.('input, textarea, select, [contenteditable=""], [contenteditable="true"]') != null
}

/** Whether the star-only view was on, per project, so leaving the page and coming back keeps it. */
const starOnlyMemory = new Map<string, boolean>()

/** Forget what the records pages remember between visits (the star-only view, the undo history). For tests. */
export function resetRecordsPageMemory(): void {
  starOnlyMemory.clear()
  forgetAllHistories()
}

const shortName = (name: string): string => (name.length > 18 ? `${name.slice(0, 18)}…` : name)

/** The records page of one project. */
export function RecordsPage({ project, status, onBack }: { project: Project; status: SyncStatus; onBack(): void }) {
  const actions = useActions()
  const { dispatch, toast, confirm, land, landedId } = actions
  const records = recordsOf(project)
  const projectId = project.id
  const history = historyOf(projectId)
  useSyncExternalStore(history.subscribe, history.getVersion)
  // The freshest records, also between a change and the render that shows it.
  const recordsRef = useRef(records)
  recordsRef.current = records
  const indexes = useMemo(() => ({ data: indexNodes(records.data), result: indexNodes(records.results) }), [records.data, records.results])

  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(() => new Set())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [pickedId, setPickedId] = useState<string | null>(null)
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [selection, setSelection] = useState<{ side: RecordSide; ids: ReadonlySet<string> } | null>(null)
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [adding, setAdding] = useState<{ side: RecordSide; parentId: string | null } | null>(null)
  const [dropHint, setDropHint] = useState<DropHint | null>(null)
  const [connecting, setConnecting] = useState<{ side: RecordSide; id: string; overId: string | null; mode: ConnectMode; blocked?: ReadonlySet<string> } | null>(null)
  // Kept apart from `connecting`: it changes on every pointer move and only the line needs it.
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null)
  const [hoverLine, setHoverLine] = useState<string | null>(null)
  const [pickedLine, setPickedLine] = useState<string | null>(null)
  const [geometry, setGeometry] = useState<Geometry>(EMPTY_GEOMETRY)
  const geometryRef = useRef<Geometry>(EMPTY_GEOMETRY)
  const [starOnly, setStarOnlyState] = useState<boolean>(() => starOnlyMemory.get(projectId) ?? false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const drag = useRef<{ side: RecordSide; ids: string[] } | null>(null)
  const portRefs = useRef(new Map<string, HTMLElement>())
  const diagramRef = useRef<HTMLDivElement>(null)
  const cleanupConnect = useRef<(() => void) | null>(null)
  const lineTimer = useRef<ReturnType<typeof setTimeout>>()
  const setStarOnly = useCallback(
    (on: boolean): void => {
      starOnlyMemory.set(projectId, on)
      setStarOnlyState(on)
      setSelection(null)
    },
    [projectId],
  )

  // ------------------------------------------------------------ derived

  const starredIds = useMemo(() => new Set([...records.data, ...records.results].filter((node) => node.starred === true).map((node) => node.id)), [records.data, records.results])
  const views = useMemo(() => (starOnly ? { data: starViewOf(indexes.data, records.data), result: starViewOf(indexes.result, records.results) } : undefined), [starOnly, indexes, records.data, records.results])
  const flats = useMemo(
    () => ({
      data: flattenTree(indexes.data, adding?.side === 'data' ? adding.parentId : undefined, views?.data),
      result: flattenTree(indexes.result, adding?.side === 'result' ? adding.parentId : undefined, views?.result),
    }),
    [indexes, adding, views],
  )
  const focusId = hoverId ?? pickedId
  const highlight = useMemo(() => highlightFor(records, indexes, focusId), [records, indexes, focusId])
  // What the star-only view draws: only lines between two starred ends.
  const shownLinks = useMemo(() => (starOnly ? records.links.filter((link) => starredIds.has(link.dataId) && starredIds.has(link.resultId)) : records.links), [starOnly, records.links, starredIds])
  const relations = relationsOf(records)
  const shownRelations = useMemo(() => (starOnly ? relations.filter((relation) => starredIds.has(relation.fromId) && starredIds.has(relation.toId)) : relations), [starOnly, relations, starredIds])
  const lines = useMemo(() => linesOf(shownLinks, flats.data.anchor, flats.result.anchor), [shownLinks, flats])
  const relationLines = useMemo(() => relationLinesOf(shownRelations, flats.result.anchor), [shownRelations, flats])
  const linkedRows = useMemo(() => {
    const rows = new Set<string>()
    for (const id of highlight.linked) {
      const row = flats.data.anchor.get(id) ?? flats.result.anchor.get(id)
      if (row !== undefined) rows.add(row)
    }
    return rows
  }, [highlight, flats])
  const linkCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const link of shownLinks) {
      for (const row of [flats.data.anchor.get(link.dataId), flats.result.anchor.get(link.resultId)]) {
        if (row !== undefined) counts.set(row, (counts.get(row) ?? 0) + 1)
      }
    }
    return counts
  }, [shownLinks, flats])
  const relationCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const relation of shownRelations) {
      const from = flats.result.anchor.get(relation.fromId)
      const to = flats.result.anchor.get(relation.toId)
      if (from === undefined || to === undefined || from === to) continue
      counts.set(from, (counts.get(from) ?? 0) + 1)
      counts.set(to, (counts.get(to) ?? 0) + 1)
    }
    return counts
  }, [shownRelations, flats])
  const counts = recordCounts(records)
  const star = starColor(records)
  const edgeDefault = records.palette?.defaults?.edge

  // The project may disappear (deleted in another window) or lose what is open.
  useEffect(() => {
    const known = new Set([...records.data, ...records.results].map((node) => node.id))
    setOpenIds((ids) => (ids.size === 0 || [...ids].every((id) => known.has(id)) ? ids : new Set([...ids].filter((id) => known.has(id)))))
    setEditingId((id) => (id !== null && !known.has(id) ? null : id))
    setPickedId((id) => (id !== null && !known.has(id) ? null : id))
    setRenamingId((id) => (id !== null && !known.has(id) ? null : id))
    setSelection((current) => {
      if (!current) return current
      const kept = [...current.ids].filter((id) => known.has(id))
      return kept.length === current.ids.size ? current : kept.length === 0 ? null : { side: current.side, ids: new Set(kept) }
    })
  }, [records.data, records.results])

  // ------------------------------------------------------------ geometry

  const measure = useCallback(() => {
    const root = diagramRef.current
    if (!root) return
    const box = root.getBoundingClientRect()
    const ports: Geometry['ports'] = {}
    portRefs.current.forEach((element, key) => {
      const rect = element.getBoundingClientRect()
      ports[key] = { x: round(rect.left + rect.width / 2 - box.left), y: round(rect.top + rect.height / 2 - box.top) }
    })
    const next: Geometry = { width: round(box.width), height: round(box.height), ports }
    // Compare with the last measurement here, and only then touch state: this runs after every
    // render, and even a state update that changes nothing can keep React re-rendering.
    if (sameGeometry(geometryRef.current, next)) return
    geometryRef.current = next
    setGeometry(next)
  }, [])
  // After every render: rows may have moved, opened or folded.
  useLayoutEffect(() => {
    measure()
  })
  useEffect(() => {
    const root = diagramRef.current
    if (!root) return
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => measure())
    observer?.observe(root)
    window.addEventListener('resize', measure)
    // Web fonts and the first paint can still move rows a little.
    const frame = requestAnimationFrame(measure)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', measure)
      cancelAnimationFrame(frame)
    }
  }, [measure])

  useEffect(
    () => () => {
      cleanupConnect.current?.()
      if (lineTimer.current) clearTimeout(lineTimer.current)
    },
    [],
  )

  // ------------------------------------------------------------ changes

  const undoRef = useRef<() => void>(() => {})

  /**
   * Run ops as one step of the undo history: the ones that fit are sent to the
   * host, and the ops that would undo them are remembered with the step.
   */
  const perform = useCallback(
    (label: string, ops: RecordOp[], options: { toast?: string } = {}): boolean => {
      const plan = planOps(recordsRef.current, ops, new Date().toISOString())
      if (plan.refused.length > 0) toast(plan.refused[0]!.reason, { tone: 'error' })
      if (plan.applied.length === 0) return false
      let ok = true
      for (const op of plan.applied) if (!dispatch(op)) ok = false
      recordsRef.current = plan.after
      const step: Step = history.record(label, plan.applied, plan.inverse)
      if (options.toast) {
        toast(options.toast, {
          action: {
            label: '撤销',
            // Only the latest step can be taken back from here; older ones go through ⌘Z, one after the other.
            run: () => (history.isLatest(step) ? undoRef.current() : toast('这之后又有新的操作，请用 ⌘Z 依次撤销')),
          },
        })
      }
      return ok && plan.refused.length === 0
    },
    [dispatch, history, toast],
  )

  /** Run ops that are not a step of their own (folding, the other half of an undo). */
  const quietly = useCallback(
    (ops: RecordOp[]): void => {
      const plan = planOps(recordsRef.current, ops, new Date().toISOString())
      for (const op of plan.applied) dispatch(op)
      recordsRef.current = plan.after
    },
    [dispatch],
  )

  const undo = useCallback((): void => {
    const step = history.takeUndo()
    if (!step) return
    const plan = planOps(recordsRef.current, step.inverse, new Date().toISOString())
    for (const op of plan.applied) dispatch(op)
    recordsRef.current = plan.after
    if (plan.refused.length > 0) toast(`「${step.label}」之后有改动被别处改过，没能完全撤销`, { tone: 'error' })
    else toast(`已撤销：${step.label}`)
  }, [dispatch, history, toast])
  undoRef.current = undo

  const redo = useCallback((): void => {
    const step = history.takeRedo()
    if (!step) return
    const plan = planOps(recordsRef.current, step.forward, new Date().toISOString())
    for (const op of plan.applied) dispatch(op)
    recordsRef.current = plan.after
    if (plan.refused.length > 0) toast(`「${step.label}」之后有改动被别处改过，没能完全重做`, { tone: 'error' })
    else toast(`已重做：${step.label}`)
  }, [dispatch, history, toast])

  // ⌘Z / ⇧⌘Z (Ctrl on other systems), except where text is being typed: there it is the text's own.
  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      if (!(event.metaKey || event.ctrlKey) || event.altKey) return
      const key = event.key.toLowerCase()
      if (key !== 'z' && key !== 'y') return
      if (typingIn(event.target) || document.querySelector('.kb-overlay') || cleanupConnect.current) return
      event.preventDefault()
      if (key === 'y' || event.shiftKey) redo()
      else undo()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [undo, redo])

  const nodeOf = useCallback((id: string): RecordNode | undefined => indexes.data.byId.get(id) ?? indexes.result.byId.get(id), [indexes])
  const sideOf = useCallback((id: string): RecordSide | undefined => (indexes.data.byId.has(id) ? 'data' : indexes.result.byId.has(id) ? 'result' : undefined), [indexes])

  const addNode = useCallback(
    (side: RecordSide, parentId: string | null, fields: NodeFields): boolean => {
      const id = newId('n')
      // In the star-only view a new node would vanish at once, so it starts starred.
      const ok = perform(`添加「${shortName(fields.name)}」`, [
        { type: 'node.add', projectId, side, id, name: fields.name, path: fields.path, description: fields.description, parentId, beforeId: null, ...(starOnly ? { starred: true } : {}) },
      ])
      if (ok) land(id)
      return ok
    },
    [perform, projectId, starOnly, land],
  )

  const updateNode = useCallback(
    (id: string, fields: Partial<NodeFields>): boolean => perform(`修改「${shortName(nodeOf(id)?.name ?? '')}」`, [{ type: 'node.update', projectId, nodeId: id, ...fields }]),
    [perform, projectId, nodeOf],
  )

  const toggleFold = useCallback(
    (node: RecordNode): void => {
      quietly([{ type: 'node.update', projectId, nodeId: node.id, collapsed: !node.collapsed }])
    },
    [quietly, projectId],
  )

  const startAdd = useCallback(
    (side: RecordSide, parentId: string | null): void => {
      const parent = parentId === null ? undefined : indexes[side].byId.get(parentId)
      if (parent?.collapsed) quietly([{ type: 'node.update', projectId, nodeId: parent.id, collapsed: false }])
      setEditingId(null)
      setAdding({ side, parentId })
    },
    [quietly, indexes, projectId],
  )

  const toggleStar = useCallback(
    (node: RecordNode): void => {
      const on = node.starred !== true
      perform(`${on ? '加星标' : '取消星标'}「${shortName(node.name)}」`, [{ type: 'node.update', projectId, nodeId: node.id, starred: on }])
    },
    [perform, projectId],
  )

  const toggleStarTree = useCallback(
    (node: RecordNode): void => {
      const side = sideOf(node.id)
      if (side === undefined) return
      const ids = subtreeIds(indexes[side], node.id)
      const on = !ids.every((id) => indexes[side].byId.get(id)?.starred === true)
      perform(
        `${on ? '整组加星标' : '整组取消星标'}「${shortName(node.name)}」`,
        ids.map((id): RecordOp => ({ type: 'node.update', projectId, nodeId: id, starred: on })),
      )
    },
    [perform, projectId, indexes, sideOf],
  )

  const setCategory = useCallback(
    (ids: readonly string[], category: string | null): void => {
      perform(
        ids.length === 1 ? `设置「${shortName(nodeOf(ids[0]!)?.name ?? '')}」的类别` : `设置 ${ids.length} 项的类别`,
        ids.map((id): RecordOp => ({ type: 'node.update', projectId, nodeId: id, category })),
      )
    },
    [perform, projectId, nodeOf],
  )

  const addLink = useCallback(
    (dataId: string, resultId: string): boolean => {
      if (recordsRef.current.links.some((link) => link.dataId === dataId && link.resultId === resultId)) return false
      return perform('添加连线', [{ type: 'link.add', projectId, id: newId('l'), dataId, resultId }])
    },
    [perform, projectId],
  )

  const removeLink = useCallback(
    (id: string): void => {
      perform('删除连线', [{ type: 'link.delete', projectId, linkId: id }], { toast: '已取消关联' })
    },
    [perform, projectId],
  )

  const addRelation = useCallback(
    (fromId: string, toId: string, directed = false): boolean => {
      if (relationsOf(recordsRef.current).some((relation) => (relation.fromId === fromId && relation.toId === toId) || (relation.fromId === toId && relation.toId === fromId))) return false
      return perform('添加结果之间的连线', [{ type: 'relation.add', projectId, id: newId('l'), fromId, toId, directed }])
    },
    [perform, projectId],
  )

  const updateRelation = useCallback(
    (id: string, patch: { directed?: boolean; reverse?: boolean }): void => {
      perform(patch.reverse ? '反向' : patch.directed ? '改为有向连线' : '改为无向连线', [{ type: 'relation.update', projectId, relationId: id, ...patch }])
    },
    [perform, projectId],
  )

  const removeRelation = useCallback(
    (relation: RecordRelation): void => {
      perform('删除结果之间的连线', [{ type: 'relation.delete', projectId, relationId: relation.id }], { toast: '已取消连线' })
    },
    [perform, projectId],
  )

  // Delete removes the line that was clicked (a Mac's "delete" key is Backspace), unless text is being typed or something is open on top.
  useEffect(() => {
    if (pickedLine === null) return undefined
    const onKey = (event: KeyboardEvent): void => {
      if (event.key !== 'Delete' && event.key !== 'Backspace') return
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || event.isComposing) return
      if (typingIn(event.target) || document.querySelector('.kb-overlay, .kb-menu') || cleanupConnect.current) return
      const link = lines.find((item) => item.key === pickedLine)
      const relation = relationLines.find((item) => item.key === pickedLine)
      if (!link && !relation) return
      event.preventDefault()
      if (link && !link.folded && link.links.length === 1) removeLink(link.links[0]!.id)
      else if (relation && !relation.folded && relation.relations.length === 1) removeRelation(relation.relations[0]!)
      else {
        // A line into a folded group stands for what is inside it: do not guess which of those to take away.
        const count = link ? link.links.length : relation!.relations.length
        toast(`这条线连着折叠的分组（共 ${count} 条）：展开分组后，点选其中一条再按 Delete`)
        return
      }
      setHoverLine(null)
      setPickedLine(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [pickedLine, lines, relationLines, removeLink, removeRelation, toast])

  const setEdgeCategory = useCallback(
    (edge: { kind: 'link' | 'relation'; id: string }, category: string | null): void => {
      perform('设置连线类别', [edge.kind === 'link' ? { type: 'link.update', projectId, linkId: edge.id, category } : { type: 'relation.update', projectId, relationId: edge.id, category }])
    },
    [perform, projectId],
  )

  const addCategory = useCallback(
    (kind: CategoryKind, name: string, color: string): void => {
      perform(`添加${kind === 'node' ? '节点' : '连线'}类别「${shortName(name)}」`, [{ type: 'category.add', projectId, kind, id: newId('c'), name, color }])
    },
    [perform, projectId],
  )

  const updateCategory = useCallback(
    (kind: CategoryKind, id: string, patch: { name?: string; color?: string }): void => {
      perform('修改类别', [{ type: 'category.update', projectId, kind, categoryId: id, ...patch }])
    },
    [perform, projectId],
  )

  const removeCategory = useCallback(
    (kind: CategoryKind, id: string): void => {
      const name = categoriesOf(recordsRef.current, kind).find((category) => category.id === id)?.name ?? ''
      perform(`删除类别「${shortName(name)}」`, [{ type: 'category.delete', projectId, kind, categoryId: id }], { toast: `已删除类别「${shortName(name)}」，用了它的回到默认色` })
    },
    [perform, projectId],
  )

  const setDefaultColor = useCallback(
    (which: 'node' | 'edge' | 'star', color: string | null): void => {
      perform(`修改${which === 'node' ? '节点' : which === 'edge' ? '连线' : '星标'}的默认颜色`, [{ type: 'palette.update', projectId, [which]: color }])
    },
    [perform, projectId],
  )

  const removeNode = useCallback(
    (node: RecordNode): void => {
      const side = sideOf(node.id)
      if (side === undefined) return
      const gone = subtreeIds(indexes[side], node.id)
      const hidden = views ? gone.filter((id) => !views[side].only.has(id)).length : 0
      const links = records.links.filter((link) => gone.includes(link.dataId) || gone.includes(link.resultId)).length
      const run = (): void => {
        const label = shortName(node.name)
        perform(`删除「${label}」`, [{ type: 'node.delete', projectId, nodeId: node.id }], { toast: gone.length > 1 ? `已删除「${label}」及其 ${gone.length - 1} 个子节点` : `已删除「${label}」` })
      }
      if (gone.length > 1) {
        confirm({
          title: `删除「${node.name}」？`,
          body: `它下面的 ${gone.length - 1} 个子节点会一起删除${hidden > 0 ? `（其中 ${hidden} 个现在被「只看星标」隐藏）` : ''}${links > 0 ? `，相关的 ${links} 条连线也会删除` : ''}。删除后可以马上撤销。`,
          confirmLabel: '删除',
          onConfirm: run,
        })
      } else run()
    },
    [confirm, indexes, perform, projectId, records.links, sideOf, views],
  )

  const dissolveNode = useCallback(
    (node: RecordNode): void => {
      const side = sideOf(node.id)
      if (side === undefined) return
      const kids = childrenOf(indexes[side], node.id).length
      const label = shortName(node.name)
      perform(`解散「${label}」`, [{ type: 'node.delete', projectId, nodeId: node.id, lift: true }], { toast: `已解散「${label}」，${kids} 个子节点已上移` })
    },
    [indexes, perform, projectId, sideOf],
  )

  const shift = useCallback(
    (node: RecordNode, how: 'up' | 'down' | 'in' | 'out'): void => {
      const side = sideOf(node.id)
      if (side === undefined) return
      const index = indexes[side]
      const siblings = childrenOf(index, node.parentId)
      const at = siblings.findIndex((item) => item.id === node.id)
      const label = `移动「${shortName(node.name)}」`
      const move = (parentId: string | null, beforeId: string | null): void => {
        perform(label, [{ type: 'node.move', projectId, nodeId: node.id, parentId, beforeId }])
      }
      if (how === 'up' && at > 0) move(node.parentId, siblings[at - 1]!.id)
      else if (how === 'down' && at >= 0 && at < siblings.length - 1) move(node.parentId, siblings[at + 2]?.id ?? null)
      else if (how === 'in' && at > 0) {
        const parent = siblings[at - 1]!
        if (parent.collapsed) quietly([{ type: 'node.update', projectId, nodeId: parent.id, collapsed: false }])
        move(parent.id, null)
      } else if (how === 'out' && node.parentId !== null) {
        const parent = index.byId.get(node.parentId)
        if (parent) {
          const uncles = childrenOf(index, parent.parentId)
          move(parent.parentId, uncles[uncles.findIndex((item) => item.id === parent.id) + 1]?.id ?? null)
        }
      }
    },
    [indexes, perform, projectId, quietly, sideOf],
  )

  const dropOn = useCallback(
    (side: RecordSide, targetId: string | null, zone: DropZone | 'end'): void => {
      const dragged = drag.current
      drag.current = null
      if (!dragged || dragged.side !== side) return
      const index = indexes[side]
      const position = new Map(listOf(records, side).map((node, i) => [node.id, i]))
      const ordered = dragged.ids.filter((id) => position.has(id)).sort((a, b) => position.get(a)! - position.get(b)!)
      const aimed = (skip: ReadonlySet<string>): { parentId: string | null; beforeId: string | null } | undefined =>
        targetId === null || zone === 'end' ? { parentId: null, beforeId: null } : dropTarget(index, targetId, zone, skip)
      const first = aimed(new Set(ordered))
      if (!first) return
      const moving = movableIds(index, ordered, first.parentId)
      if (moving.length === 0) return
      const target = aimed(new Set(moving))
      if (!target) return
      const ops: RecordOp[] = []
      if (target.parentId !== null && index.byId.get(target.parentId)?.collapsed) quietly([{ type: 'node.update', projectId, nodeId: target.parentId, collapsed: false }])
      for (const id of moving) ops.push({ type: 'node.move', projectId, nodeId: id, parentId: target.parentId, beforeId: target.beforeId })
      perform(moving.length === 1 ? `移动「${shortName(index.byId.get(moving[0]!)?.name ?? '')}」` : `移动 ${moving.length} 项`, ops)
      land(moving[0]!)
      setSelection(null)
    },
    [indexes, land, perform, projectId, quietly, records],
  )

  const mergeSelection = useCallback((): void => {
    if (!selection) return
    const side = selection.side
    const index = indexes[side]
    const ordered = inRowOrder(flats[side].rows, selection.ids)
    const moving = movableIds(index, ordered, null)
    const first = moving[0] === undefined ? undefined : index.byId.get(moving[0])
    if (!first) return
    const groupId = newId('n')
    const ops: RecordOp[] = [{ type: 'node.add', projectId, side, id: groupId, name: '新分组', parentId: first.parentId, beforeId: first.id, ...(starOnly ? { starred: true } : {}) }]
    for (const id of moving) ops.push({ type: 'node.move', projectId, nodeId: id, parentId: groupId, beforeId: null })
    if (!perform('合并为分组', ops)) return
    setSelection(null)
    setRenamingId(groupId)
    land(groupId)
  }, [flats, indexes, land, perform, projectId, selection, starOnly])

  const bulkStar = useCallback((): void => {
    if (!selection) return
    const ids = [...selection.ids]
    const on = !ids.every((id) => starredIds.has(id))
    perform(on ? `给 ${ids.length} 项加星标` : `取消 ${ids.length} 项的星标`, ids.map((id): RecordOp => ({ type: 'node.update', projectId, nodeId: id, starred: on })))
  }, [perform, projectId, selection, starredIds])

  // ------------------------------------------------------------ connecting

  const latest = useRef({ addLink, addRelation })
  latest.current = { addLink, addRelation }

  const beginConnect = useCallback((side: RecordSide, id: string, event: ReactPointerEvent, mode: ConnectMode): void => {
    if (event.button !== 0 && event.pointerType === 'mouse') return
    event.preventDefault()
    event.stopPropagation()
    cleanupConnect.current?.()
    // A pair of results can be related once: the ones already related to this one are not offered.
    const blocked =
      mode === 'relation'
        ? new Set(relationsOf(recordsRef.current).flatMap((relation) => (relation.fromId === id ? [relation.toId] : relation.toId === id ? [relation.fromId] : [])))
        : undefined
    setConnecting({ side, id, overId: null, mode, ...(blocked ? { blocked } : {}) })
    setPointer({ x: event.clientX, y: event.clientY })
    const accepts = (over: { side: RecordSide; id: string } | null): over is { side: RecordSide; id: string } =>
      over !== null && (mode === 'relation' ? over.side === 'result' && over.id !== id && blocked?.has(over.id) !== true : over.side !== side)
    const stop = (): void => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onCancel)
      window.removeEventListener('keydown', onKey, true)
      cleanupConnect.current = null
      setConnecting(null)
      setPointer(null)
    }
    const onMove = (ev: PointerEvent): void => {
      const over = nodeUnder(ev.target)
      setPointer({ x: ev.clientX, y: ev.clientY })
      setConnecting((current) => {
        const overId = current && accepts(over) ? over.id : null
        return current && current.overId !== overId ? { ...current, overId } : current
      })
    }
    const onUp = (ev: PointerEvent): void => {
      const over = nodeUnder(ev.target)
      stop()
      if (!accepts(over)) return
      if (mode === 'relation') latest.current.addRelation(id, over.id, ev.altKey)
      else {
        const [dataId, resultId] = side === 'data' ? [id, over.id] : [over.id, id]
        latest.current.addLink(dataId, resultId)
      }
    }
    const onCancel = (): void => stop()
    const onKey = (ev: KeyboardEvent): void => {
      if (ev.key === 'Escape') stop()
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onCancel)
    window.addEventListener('keydown', onKey, true)
    cleanupConnect.current = stop
  }, [])

  const reveal = useCallback(
    (id: string): void => {
      const side = sideOf(id)
      if (side === undefined) return
      const index = indexes[side]
      // The star-only view may not show it: leave that view rather than point at nothing.
      if (views && !views[side].only.has(id)) setStarOnly(false)
      // Unfold the groups that hide it.
      for (let parent = index.byId.get(id)?.parentId ?? null; parent !== null; parent = index.byId.get(parent)?.parentId ?? null) {
        const group = index.byId.get(parent)
        if (group?.collapsed) quietly([{ type: 'node.update', projectId, nodeId: group.id, collapsed: false }])
      }
      setPickedId(id)
      setOpenIds((ids) => new Set(ids).add(id))
      requestAnimationFrame(() => {
        const row = diagramRef.current?.querySelector<HTMLElement>(`[data-rec-node="${id}"]`)
        row?.scrollIntoView?.({ block: 'center', behavior: 'smooth' })
      })
    },
    [indexes, projectId, quietly, setStarOnly, sideOf, views],
  )

  // ------------------------------------------------------------ context

  const ui = useMemo<RecordsUi>(
    () => ({
      project,
      records,
      indexes,
      openIds,
      editingId,
      focusId,
      withinIds: highlight.active,
      linkedRows,
      linkCounts,
      relationCounts,
      selection,
      renamingId,
      adding,
      dropHint,
      connecting,
      drag,
      landedId,
      starOnly,
      colorOf: (node) => nodeColor(records, node),
      toggleOpen: (id) =>
        setOpenIds((ids) => {
          const next = new Set(ids)
          if (!next.delete(id)) next.add(id)
          return next
        }),
      setEditing: setEditingId,
      pick: setPickedId,
      hover: setHoverId,
      toggleSelect: (side, id) =>
        setSelection((current) => {
          const ids = new Set(current?.side === side ? current.ids : [])
          if (!ids.delete(id)) ids.add(id)
          return ids.size === 0 ? null : { side, ids }
        }),
      setRenaming: setRenamingId,
      startAdd,
      stopAdd: () => setAdding(null),
      setDropHint,
      registerPort: (key, element) => {
        if (element) portRefs.current.set(key, element)
        else portRefs.current.delete(key)
      },
      beginConnect,
      reveal,
      openPalette: () => setPaletteOpen(true),
      perform,
      addNode,
      updateNode,
      removeNode,
      dissolveNode,
      shift,
      dropOn,
      addLink,
      removeLink,
      addRelation,
      updateRelation,
      removeRelation,
      toggleFold,
      toggleStar,
      toggleStarTree,
      setCategory,
      setEdgeCategory,
      addCategory,
      updateCategory,
      removeCategory,
      setDefaultColor,
    }),
    [project, records, indexes, openIds, editingId, focusId, highlight, linkedRows, linkCounts, relationCounts, selection, renamingId, adding, dropHint, connecting, landedId, starOnly, startAdd, beginConnect, reveal, perform, addNode, updateNode, removeNode, dissolveNode, shift, dropOn, addLink, removeLink, addRelation, updateRelation, removeRelation, toggleFold, toggleStar, toggleStarTree, setCategory, setEdgeCategory, addCategory, updateCategory, removeCategory, setDefaultColor],
  )

  // ------------------------------------------------------------ lines

  const point = (key: string): { x: number; y: number } | undefined => geometry.ports[key]
  const hoverLineTimer = (key: string | null): void => {
    if (lineTimer.current) clearTimeout(lineTimer.current)
    if (key !== null) setHoverLine(key)
    else lineTimer.current = setTimeout(() => setHoverLine(null), 160)
  }
  const activeLine = hoverLine ?? pickedLine
  const starredEnd = (ids: readonly string[]): boolean => ids.some((id) => starredIds.has(id))

  const rubber = (() => {
    if (!connecting || !pointer) return undefined
    const relating = connecting.mode === 'relation'
    const from = point(relating ? `${connecting.id}:r` : connecting.id)
    const box = diagramRef.current?.getBoundingClientRect()
    if (!from || !box) return undefined
    // Over something that can take the line, it goes to that node, so it shows which two dots it would join.
    const target = connecting.overId !== null ? point(relating ? `${connecting.overId}:r` : connecting.overId) : undefined
    if (relating && target) return arc(from.x, from.y, target.y)
    const x = target ? target.x : pointer.x - box.left
    const y = target ? target.y : pointer.y - box.top
    if (relating) return `M${from.x},${from.y} C${from.x + 56},${from.y} ${x + 56},${y} ${x},${y}`
    return connecting.side === 'data' ? curve(from.x, from.y, x, y) : curve(x, y, from.x, from.y)
  })()

  /** The toolbar on the line that is hovered or picked. */
  const toolbar = (() => {
    if (activeLine === null) return undefined
    const edgeCategories = categoriesOf(records, 'edge')
    const dots = (current: string | undefined, assign: (category: string | null) => void) => (
      <>
        <button type="button" className={'kb-cat-dot is-default' + (current === undefined ? ' is-on' : '')} aria-label="默认颜色" aria-pressed={current === undefined} title="默认颜色" onClick={() => assign(null)} />
        {edgeCategories.map((category) => (
          <button key={category.id} type="button" className={'kb-cat-dot' + (current === category.id ? ' is-on' : '')} style={{ ['--cat' as string]: category.color }} aria-label={`类别：${category.name}`} aria-pressed={current === category.id} title={category.name} onClick={() => assign(category.id)} />
        ))}
      </>
    )
    const keep = { onPointerEnter: () => hoverLineTimer(activeLine), onPointerLeave: () => hoverLineTimer(null) }
    const line = lines.find((item) => item.key === activeLine)
    if (line && !line.folded && line.links.length === 1) {
      const a = point(line.from)
      const b = point(line.to)
      const link = line.links[0]!
      if (!a || !b) return undefined
      const mid = curveMiddle(a.x, a.y, b.x, b.y)
      // Just under the middle of the line, not on it: the middle is where one clicks to pick a line, and the toolbar would take that click.
      return (
        <div className="kb-line-tools" style={{ left: mid.x, top: mid.y + 14, transform: 'translate(-50%, 0)' }} role="toolbar" aria-label="连线" {...keep}>
          {dots(link.category, (category) => setEdgeCategory({ kind: 'link', id: link.id }, category))}
          <button type="button" className="kb-link-del" aria-label="删除连线" title="删除连线（点选这条线后，按 Delete 键也可以）" onClick={() => { removeLink(link.id); setHoverLine(null); setPickedLine(null) }}>
            <CloseIcon size={11} />
          </button>
        </div>
      )
    }
    const relationLine = relationLines.find((item) => item.key === activeLine)
    if (relationLine && !relationLine.folded && relationLine.relations.length === 1) {
      const a = point(`${relationLine.from}:r`)
      const b = point(`${relationLine.to}:r`)
      const relation = relationLine.relations[0]!
      if (!a || !b) return undefined
      const mid = arcMiddle(a.x, a.y, b.y)
      const directed = relation.directed === true
      // Beside the arc, not on it (see above): on the right when the window has room there, else on the left, over the ends of the rows.
      const box = diagramRef.current?.getBoundingClientRect()
      const onRight = box !== undefined && window.innerWidth - (box.left + mid.x) >= 130
      return (
        <div className="kb-line-tools" style={{ left: onRight ? mid.x + 14 : mid.x - 14, top: mid.y, transform: onRight ? 'translate(0, -50%)' : 'translate(-100%, -50%)' }} role="toolbar" aria-label="结果之间的连线" {...keep}>
          <button type="button" className="kb-line-btn" aria-label={directed ? '改为无向' : '改为有向'} aria-pressed={directed} title={directed ? '有向：点击改为无向' : '无向：点击改为有向'} onClick={() => updateRelation(relation.id, { directed: !directed })}>
            {directed ? <ArrowRightIcon size={12} /> : <MinusIcon size={12} />}
          </button>
          {directed ? (
            <button type="button" className="kb-line-btn" aria-label="反向" title="反向" onClick={() => updateRelation(relation.id, { reverse: true })}>
              <SwapIcon size={12} />
            </button>
          ) : null}
          {dots(relation.category, (category) => setEdgeCategory({ kind: 'relation', id: relation.id }, category))}
          <button type="button" className="kb-link-del" aria-label="删除连线" title="删除连线（点选这条线后，按 Delete 键也可以）" onClick={() => { removeRelation(relation); setHoverLine(null); setPickedLine(null) }}>
            <CloseIcon size={11} />
          </button>
        </div>
      )
    }
    return undefined
  })()

  const onRootKey = (event: ReactKeyboardEvent): void => {
    if (event.key !== 'Escape') return
    if (selection) setSelection(null)
    else if (pickedId !== null) setPickedId(null)
    else if (adding) setAdding(null)
  }

  const empty = counts.data === 0 && counts.results === 0 && adding === null && records.palette === undefined
  const selected = selection?.ids.size ?? 0
  const nodeCategories = categoriesOf(records, 'node')
  const allSelectedStarred = selection !== null && [...selection.ids].every((id) => starredIds.has(id))
  const rootStyle = { ['--kb-accent' as string]: COLOR_VALUES[project.color], ['--kb-star' as string]: star, ...(edgeDefault ? { ['--kb-edge' as string]: edgeDefault } : {}) }

  return (
    <RecordsContext.Provider value={ui}>
      <div className="kb-rec" style={rootStyle} onKeyDown={onRootKey}>
        <div className="kb-rec-head">
          <button type="button" className="kb-btn kb-btn-ghost kb-btn-sm kb-back" onClick={onBack}>
            <ArrowLeftIcon size={14} /> 项目看板
          </button>
          <div className="kb-rec-heading">
            <h1 className="kb-rec-title">{project.name}</h1>
            <p className="kb-subtitle">
              <span>
                <b>{counts.data}</b> 项数据
              </span>
              <span>
                <b>{counts.results}</b> 个结果
              </span>
              <span>
                <b>{counts.links}</b> 条连线
              </span>
              {relations.length > 0 ? (
                <span>
                  <b>{relations.length}</b> 条结果间连线
                </span>
              ) : null}
            </p>
          </div>
          <div className="kb-rec-tools">
            <button type="button" className="kb-btn kb-btn-sm kb-btn-icon" aria-label="撤销" title={history.canUndo ? `撤销：${history.undoLabel}（⌘Z）` : '没有可以撤销的操作'} disabled={!history.canUndo} onClick={undo}>
              <UndoIcon size={14} />
            </button>
            <button type="button" className="kb-btn kb-btn-sm kb-btn-icon" aria-label="重做" title={history.canRedo ? `重做：${history.redoLabel}（⇧⌘Z）` : '没有可以重做的操作'} disabled={!history.canRedo} onClick={redo}>
              <RedoIcon size={14} />
            </button>
            <button type="button" className={'kb-btn kb-btn-sm kb-star-toggle' + (starOnly ? ' is-on' : '')} aria-pressed={starOnly} title="只显示加了星标的节点（它们所在的分组会灰色显示）" onClick={() => setStarOnly(!starOnly)}>
              <StarIcon size={14} filled={starOnly} /> 只看星标
              <span className="kb-count">{starredIds.size}</span>
            </button>
            <PaletteButton open={paletteOpen} onOpenChange={setPaletteOpen} />
          </div>
          <SaveStatus status={status} />
        </div>

        {starOnly ? (
          <div className="kb-starbar" role="note">
            <StarIcon size={14} filled />
            <span>
              只看星标：灰色的是星标节点所在的分组。<b>这是同一棵树的筛选视图，不是副本</b>，在这里做的修改会直接作用在完整的树上；新建的节点会自动加星标。
            </span>
            <button type="button" className="kb-btn kb-btn-sm kb-btn-ghost" onClick={() => setStarOnly(false)}>
              显示全部
            </button>
          </div>
        ) : null}

        {selected > 0 ? (
          <div className="kb-selbar" role="toolbar" aria-label="批量操作">
            <span>
              已选 <b>{selected}</b> 项
            </span>
            <button type="button" className="kb-btn kb-btn-sm kb-btn-primary" onClick={mergeSelection}>
              <FolderPlusIcon size={14} /> 合并为分组
            </button>
            <button type="button" className="kb-btn kb-btn-sm" onClick={bulkStar}>
              <StarIcon size={14} filled={allSelectedStarred} /> {allSelectedStarred ? '取消星标' : '加星标'}
            </button>
            {nodeCategories.length > 0 ? (
              <select
                className="kb-select"
                aria-label="给所选设置类别"
                value=""
                onChange={(event) => {
                  const value = event.target.value
                  if (value !== '' && selection) setCategory([...selection.ids], value === '__default' ? null : value)
                }}
              >
                <option value="">类别…</option>
                <option value="__default">默认</option>
                {nodeCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            ) : null}
            <span className="kb-hint">也可以直接拖动其中一项，一起移到别处</span>
            <button type="button" className="kb-btn kb-btn-sm kb-btn-ghost" onClick={() => setSelection(null)}>
              取消选择
            </button>
          </div>
        ) : null}

        {empty ? (
          <div className="kb-empty">
            <RecordsIcon size={40} />
            <h2>记录这个项目的关键数据和结果</h2>
            <p>左边记数据：简单名字、完整路径、描述；右边记结果。把一侧的圆点拖到另一侧，就能标出哪些结果来自哪些数据。数据和结果都可以拖动合并成章节，重要的加星标。</p>
            <div className="kb-empty-actions">
              <button type="button" className="kb-btn kb-btn-primary" onClick={() => startAdd('data', null)}>
                添加第一项数据
              </button>
              <button type="button" className="kb-btn" onClick={() => startAdd('result', null)}>
                添加第一个结果
              </button>
            </div>
          </div>
        ) : (
          <div className="kb-diagram-scroll">
            <div
              className={'kb-diagram' + (connecting ? ' is-connecting' : '') + (connecting?.mode === 'relation' ? ' is-relating' : connecting ? ' is-linking' : '') + (focusId !== null ? ' has-focus' : '') + (selected > 0 ? ' has-selection' : '')}
              ref={diagramRef}
              onPointerDown={(event) => {
                if (!(event.target as Element).closest('.kb-node, .kb-rec-card, .kb-rec-form, .kb-line-tools, .kb-tree-head')) {
                  setPickedId(null)
                  setPickedLine(null)
                }
              }}
            >
              <TreePanel side="data" flat={flats.data} />
              <div className="kb-gutter" aria-hidden="true">
                {shownLinks.length === 0 && counts.data > 0 && counts.results > 0 ? <span>从圆点拖到另一侧的节点上，标出结果来自哪些数据</span> : null}
              </div>
              <TreePanel side="result" flat={flats.result} />
              <div className="kb-gutter kb-gutter-right" aria-hidden="true">
                {counts.results > 0 ? <div className="kb-rel-head">关系</div> : null}
                {relations.length === 0 && counts.results > 1 ? <span>拖菱形点，连到别的结果</span> : null}
              </div>

              <svg className="kb-links" width={geometry.width} height={geometry.height} role="presentation" focusable="false">
                {lines.map((line) => {
                  const a = point(line.from)
                  const b = point(line.to)
                  if (!a || !b) return null
                  const path = curve(a.x, a.y, b.x, b.y)
                  const color = line.folded || line.links.length > 1 ? (starredEnd(line.links.flatMap((link) => [link.dataId, link.resultId])) ? star : edgeDefault) : edgeColor(records, line.links[0]!, starredEnd([line.links[0]!.dataId, line.links[0]!.resultId]))
                  const hot = line.links.some((link) => highlight.linkIds.has(link.id)) || line.key === activeLine
                  const dim = focusId !== null && !hot
                  return (
                    <g
                      key={line.key}
                      className={'kb-link' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '') + (line.folded ? ' is-folded' : '') + (color ? ' has-color' : '')}
                      style={color ? { ['--kb-line' as string]: color } : undefined}
                      data-line={line.key}
                    >
                      <path className="kb-link-line" d={path} />
                      <path
                        className="kb-link-hit"
                        d={path}
                        onPointerEnter={() => hoverLineTimer(line.key)}
                        onPointerLeave={() => hoverLineTimer(null)}
                        onClick={() => setPickedLine((current) => (current === line.key ? null : line.key))}
                      />
                    </g>
                  )
                })}
                {relationLines.map((line) => {
                  const a = point(`${line.from}:r`)
                  const b = point(`${line.to}:r`)
                  if (!a || !b) return null
                  const path = arc(a.x, a.y, b.y)
                  const color = line.folded || line.relations.length > 1 ? (starredEnd(line.relations.flatMap((relation) => [relation.fromId, relation.toId])) ? star : edgeDefault) : edgeColor(records, line.relations[0]!, starredEnd([line.relations[0]!.fromId, line.relations[0]!.toId]))
                  const hot = line.relations.some((relation) => highlight.relationIds.has(relation.id)) || line.key === activeLine
                  const dim = focusId !== null && !hot
                  return (
                    <g
                      key={`rel:${line.key}`}
                      className={'kb-link kb-relation' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '') + (line.folded ? ' is-folded' : '') + (line.directed ? ' is-directed' : '') + (color ? ' has-color' : '')}
                      style={color ? { ['--kb-line' as string]: color } : undefined}
                      data-line={line.key}
                      data-relation=""
                    >
                      <path className="kb-link-line" d={path} />
                      {line.directed ? <polygon className="kb-link-arrow" points={arrowPoints(b.x + 9, b.y)} /> : null}
                      <path
                        className="kb-link-hit"
                        d={path}
                        onPointerEnter={() => hoverLineTimer(line.key)}
                        onPointerLeave={() => hoverLineTimer(null)}
                        onClick={() => setPickedLine((current) => (current === line.key ? null : line.key))}
                      />
                    </g>
                  )
                })}
                {rubber ? <path className="kb-link-temp" d={rubber} /> : null}
              </svg>
              {toolbar}
            </div>
          </div>
        )}
      </div>
    </RecordsContext.Provider>
  )
}
