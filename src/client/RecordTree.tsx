/**
 * One tree of the records page (the data tree or the result tree): its
 * rows, the card that opens under a row, and the forms that add and edit.
 * Everything it needs comes from {@link useRecords}.
 * @module dsh-project-kanban/client/RecordTree
 */
import { memo, useEffect, useRef, useState, type DragEvent, type KeyboardEvent } from 'react'
import { RECORD_LIMITS, categoriesOf, childrenOf, isInSubtree, levelOf, listOf, relationsOf, subtreeIds, type RecordNode, type RecordRelation, type RecordSide } from '../shared/records'
import { Menu, shortDate, useActions } from './common'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChartIcon,
  CheckIcon,
  ChevronIcon,
  CloseIcon,
  CopyIcon,
  FileIcon,
  FolderIcon,
  IndentIcon,
  LinkIcon,
  OutdentIcon,
  PencilIcon,
  PlusIcon,
  StarIcon,
  SwapIcon,
  TrashIcon,
} from './icons'
import { useRecords, type NodeFields } from './recordsContext'
import { zoneAt, type Flat, type NodeRow } from './recordsModel'

/** The words of each tree. */
const COPY: Record<RecordSide, { title: string; add: string; pathLabel: string; pathHint: string; nameHint: string; empty: string; linksTitle: string; linksAdd: string; linksNone: string; portTitle: string }> = {
  data: {
    title: '数据',
    add: '添加数据',
    pathLabel: '完整路径',
    pathHint: '完整路径，例如：/data/gwas/face_sumstats.tsv.gz',
    nameHint: '简单名字，例如：GWAS 汇总统计',
    empty: '还没有数据。记下关键数据的简单名字、完整路径和描述；只写名字的节点可以当作章节来放别的数据。',
    linksTitle: '关联的结果',
    linksAdd: '＋ 关联结果…',
    linksNone: '还没有关联到任何结果',
    portTitle: '拖到右边的结果上，标出它来自这份数据',
  },
  result: {
    title: '结果',
    add: '添加结果',
    pathLabel: '文件 / 位置',
    pathHint: '文件或位置，例如：figures/fig3_manhattan.png',
    nameHint: '简单名字，例如：图 3 曼哈顿图',
    empty: '还没有结果。记下得到的结果，再从数据一侧拖线过来，说明它来自哪些数据。',
    linksTitle: '来源数据',
    linksAdd: '＋ 添加来源数据…',
    linksNone: '还没有关联来源数据',
    portTitle: '拖到左边的数据上，标出这个结果来自哪份数据',
  },
}

const OTHER: Record<RecordSide, RecordSide> = { data: 'result', result: 'data' }

// ---------------------------------------------------------------- form

interface NodeFormProps {
  side: RecordSide
  initial?: NodeFields
  submitLabel: string
  /** Keep the form open (cleared) after a submit, for quick entry. */
  keepOpen?: boolean
  /** The tree level the form sits at, for its indentation. */
  depth: number
  /** Said under the form while adding in the star-only view. */
  note?: string
  onSubmit(fields: NodeFields): boolean
  onCancel(): void
}

/** Name, full path and description of one node. */
function NodeForm({ side, initial, submitLabel, keepOpen, depth, note, onSubmit, onCancel }: NodeFormProps) {
  const copy = COPY[side]
  const [name, setName] = useState(initial?.name ?? '')
  const [path, setPath] = useState(initial?.path ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const nameRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    nameRef.current?.focus()
    nameRef.current?.select()
  }, [])
  const trimmed = name.trim()
  const invalid = trimmed === '' || trimmed.length > RECORD_LIMITS.name || path.length > RECORD_LIMITS.path || description.length > RECORD_LIMITS.description
  const submit = (): void => {
    if (invalid) return
    if (!onSubmit({ name: trimmed, path: path.trim(), description })) return
    if (keepOpen) {
      setName('')
      setPath('')
      setDescription('')
      nameRef.current?.focus()
    }
  }
  const onKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      onCancel()
    } else if (event.key === 'Enter' && (event.target instanceof HTMLInputElement || event.metaKey || event.ctrlKey)) {
      if (event.nativeEvent.isComposing) return
      event.preventDefault()
      submit()
    }
  }
  return (
    <div className="kb-rec-form" style={{ ['--depth' as string]: depth }} role="group" aria-label={initial ? '编辑节点' : copy.add} onKeyDown={onKey}>
      <input ref={nameRef} className="kb-input" placeholder={copy.nameHint} value={name} maxLength={RECORD_LIMITS.name} aria-label="简单名字" onChange={(e) => setName(e.target.value)} />
      <input className="kb-input kb-mono" placeholder={copy.pathHint} value={path} maxLength={RECORD_LIMITS.path} aria-label={copy.pathLabel} onChange={(e) => setPath(e.target.value)} />
      <textarea className="kb-textarea" rows={2} placeholder="描述（可选）" value={description} maxLength={RECORD_LIMITS.description} aria-label="描述" onChange={(e) => setDescription(e.target.value)} />
      <div className="kb-edit-row">
        <span className="kb-hint">{initial ? '⌘/Ctrl + Enter 保存' : (note ?? '只填名字也行；Enter 保存并继续添加')}</span>
        <div>
          <button type="button" className="kb-btn kb-btn-ghost kb-btn-sm" onClick={onCancel}>
            取消
          </button>
          <button type="button" className="kb-btn kb-btn-primary kb-btn-sm" disabled={invalid} onClick={submit}>
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- card

/** Pick the colour category of a node (or go back to the default look). */
function CategoryPills({ node }: { node: RecordNode }) {
  const ui = useRecords()
  const categories = categoriesOf(ui.records, 'node')
  return (
    <div className="kb-rec-cats">
      <div className="kb-rec-links-head">类别</div>
      <div className="kb-pills" role="radiogroup" aria-label="节点类别">
        <button type="button" role="radio" aria-checked={node.category === undefined} className={'kb-pill' + (node.category === undefined ? ' is-on' : '')} onClick={() => ui.setCategory([node.id], null)}>
          默认
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            role="radio"
            aria-checked={node.category === category.id}
            className={'kb-pill' + (node.category === category.id ? ' is-on' : '')}
            style={{ ['--pill' as string]: category.color }}
            onClick={() => ui.setCategory([node.id], category.id)}
          >
            <i />
            {category.name}
          </button>
        ))}
        <button type="button" className="kb-pill is-add" title="添加或修改类别的颜色" onClick={ui.openPalette}>
          <PlusIcon size={11} /> {categories.length === 0 ? '添加类别' : '类别'}
        </button>
      </div>
    </div>
  )
}

/** What a chip says about the way a relation points, seen from one of its ends. */
function relationGlyph(relation: RecordRelation, from: string): { text: string; title: string } {
  if (relation.directed !== true) return { text: '—', title: '无向：点击改为指向对方' }
  return relation.fromId === from ? { text: '→', title: '指向对方：点击改为指向这里' } : { text: '←', title: '指向这里：点击改为无向' }
}

/** The relations of a result, as chips, with a way to add one. */
function RelationsSection({ node }: { node: RecordNode }) {
  const ui = useRecords()
  const own = relationsOf(ui.records).filter((relation) => relation.fromId === node.id || relation.toId === node.id)
  const related = new Set(own.map((relation) => (relation.fromId === node.id ? relation.toId : relation.fromId)))
  const choices = ui.records.results.filter((item) => item.id !== node.id && !related.has(item.id))
  const index = ui.indexes.result
  // none → points at the other end → points here → none
  const cycle = (relation: RecordRelation): void => {
    if (relation.directed !== true) ui.updateRelation(relation.id, relation.fromId === node.id ? { directed: true } : { directed: true, reverse: true })
    else if (relation.fromId === node.id) ui.updateRelation(relation.id, { reverse: true })
    else ui.updateRelation(relation.id, { directed: false })
  }
  return (
    <div className="kb-rec-links">
      <div className="kb-rec-links-head">
        <SwapIcon size={13} /> 相关的结果
        <span className="kb-count">{own.length}</span>
      </div>
      <div className="kb-rec-chips">
        {own.length === 0 ? <span className="kb-muted">还没有和别的结果连线（从结果右边缘的圆点拖到另一个结果上）</span> : null}
        {own.map((relation) => {
          const otherId = relation.fromId === node.id ? relation.toId : relation.fromId
          const other = index.byId.get(otherId)
          const glyph = relationGlyph(relation, node.id)
          return (
            <span key={relation.id} className="kb-link-chip">
              <button type="button" className="kb-link-chip-glyph" title={glyph.title} aria-label={`${other?.name ?? otherId}：${glyph.title}`} onClick={() => cycle(relation)}>
                {glyph.text}
              </button>
              <button type="button" className="kb-link-chip-name" title="在列表里定位" onClick={() => ui.reveal(otherId)}>
                {other?.name ?? otherId}
              </button>
              <button type="button" className="kb-link-chip-x" aria-label={`取消与「${other?.name ?? otherId}」的连线`} title="取消连线" onClick={() => ui.removeRelation(relation)}>
                <CloseIcon size={11} />
              </button>
            </span>
          )
        })}
        {choices.length > 0 ? (
          <select
            className="kb-select"
            aria-label="连到其他结果"
            value=""
            onChange={(event) => {
              if (event.target.value !== '') ui.addRelation(node.id, event.target.value)
            }}
          >
            <option value="">＋ 连到其他结果…</option>
            {choices.map((item) => (
              <option key={item.id} value={item.id}>
                {'　'.repeat(levelOf(index, item.id)) + item.name}
              </option>
            ))}
          </select>
        ) : null}
      </div>
    </div>
  )
}

/** The full information of one node, opened under its row. */
function NodeCard({ node, side, depth }: { node: RecordNode; side: RecordSide; depth: number }) {
  const ui = useRecords()
  const { toast } = useActions()
  const copy = COPY[side]
  const other = OTHER[side]
  const editing = ui.editingId === node.id

  if (editing) {
    return (
      <NodeForm
        side={side}
        depth={depth}
        initial={{ name: node.name, path: node.path, description: node.description }}
        submitLabel="保存"
        onCancel={() => ui.setEditing(null)}
        onSubmit={(fields) => {
          const ok = ui.updateNode(node.id, fields)
          if (ok) ui.setEditing(null)
          return ok
        }}
      />
    )
  }

  const own = ui.records.links.filter((link) => (side === 'data' ? link.dataId : link.resultId) === node.id)
  const linkedIds = new Set(own.map((link) => (side === 'data' ? link.resultId : link.dataId)))
  const otherIndex = ui.indexes[other]
  const choices = listOf(ui.records, other).filter((item) => !linkedIds.has(item.id))
  const copyPath = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(node.path)
      toast('已复制路径')
    } catch {
      toast('复制失败，请手动选中路径', { tone: 'error' })
    }
  }

  return (
    <div className="kb-rec-card" style={{ ['--depth' as string]: depth }} role="region" aria-label={`${node.name} 的详情`}>
      <dl className="kb-rec-fields">
        <div>
          <dt>{copy.pathLabel}</dt>
          <dd>
            {node.path ? (
              <>
                <span className="kb-mono kb-rec-path">{node.path}</span>
                <button type="button" className="kb-icon-btn" aria-label="复制路径" title="复制路径" onClick={() => void copyPath()}>
                  <CopyIcon size={14} />
                </button>
              </>
            ) : (
              <span className="kb-muted">未填写</span>
            )}
          </dd>
        </div>
        <div>
          <dt>描述</dt>
          <dd>{node.description ? <span className="kb-rec-desc">{node.description}</span> : <span className="kb-muted">未填写</span>}</dd>
        </div>
      </dl>
      <CategoryPills node={node} />
      <div className="kb-rec-links">
        <div className="kb-rec-links-head">
          <LinkIcon size={13} /> {copy.linksTitle}
          <span className="kb-count">{own.length}</span>
        </div>
        <div className="kb-rec-chips">
          {own.length === 0 ? <span className="kb-muted">{copy.linksNone}</span> : null}
          {own.map((link) => {
            const otherId = side === 'data' ? link.resultId : link.dataId
            const target = otherIndex.byId.get(otherId)
            return (
              <span key={link.id} className="kb-link-chip">
                <button type="button" className="kb-link-chip-name" title="在另一侧定位" onClick={() => ui.reveal(otherId)}>
                  {target?.name ?? otherId}
                </button>
                <button type="button" className="kb-link-chip-x" aria-label={`取消与「${target?.name ?? otherId}」的关联`} title="取消关联" onClick={() => ui.removeLink(link.id)}>
                  <CloseIcon size={11} />
                </button>
              </span>
            )
          })}
          {choices.length > 0 ? (
            <select
              className="kb-select"
              aria-label={copy.linksAdd.replace('＋ ', '').replace('…', '')}
              value=""
              onChange={(event) => {
                const value = event.target.value
                if (value !== '') ui.addLink(side === 'data' ? node.id : value, side === 'data' ? value : node.id)
              }}
            >
              <option value="">{copy.linksAdd}</option>
              {choices.map((item) => (
                <option key={item.id} value={item.id}>
                  {'　'.repeat(levelOf(otherIndex, item.id)) + item.name}
                </option>
              ))}
            </select>
          ) : null}
        </div>
      </div>
      {side === 'result' ? <RelationsSection node={node} /> : null}
      <div className="kb-rec-foot">
        <span className="kb-hint">更新于 {shortDate(node.updatedAt)}</span>
        <div>
          <button type="button" className="kb-btn kb-btn-ghost kb-btn-sm" onClick={() => ui.setEditing(node.id)}>
            <PencilIcon size={13} /> 编辑
          </button>
          <button type="button" className="kb-btn kb-btn-ghost kb-btn-sm" onClick={() => ui.toggleOpen(node.id)}>
            收起
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- row

/** The name of a node, edited in place. */
function RenameInput({ node }: { node: RecordNode }) {
  const ui = useRecords()
  const [value, setValue] = useState(node.name)
  const finished = useRef(false)
  const finish = (save: boolean): void => {
    if (finished.current) return
    finished.current = true
    const text = value.trim()
    ui.setRenaming(null)
    if (save && text !== '' && text !== node.name) ui.updateNode(node.id, { name: text })
  }
  return (
    <input
      className="kb-input kb-node-rename"
      value={value}
      autoFocus
      maxLength={RECORD_LIMITS.name}
      aria-label="节点名称"
      onFocus={(e) => e.target.select()}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => finish(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.nativeEvent.isComposing) finish(true)
        if (e.key === 'Escape') {
          e.stopPropagation()
          finish(false)
        }
      }}
    />
  )
}

function NodeItem({ row, side }: { row: NodeRow; side: RecordSide }) {
  const ui = useRecords()
  const [dragging, setDragging] = useState(false)
  const { node, depth, childCount, expanded, context } = row
  const index = ui.indexes[side]
  const open = ui.openIds.has(node.id)
  const selected = ui.selection?.side === side && ui.selection.ids.has(node.id)
  const starred = node.starred === true
  const hint = ui.dropHint?.side === side && ui.dropHint.targetId === node.id ? ui.dropHint.zone : null
  const connecting = ui.connecting
  const linkCount = ui.linkCounts.get(node.id) ?? 0
  const relationCount = ui.relationCounts.get(node.id) ?? 0
  const siblings = childrenOf(index, node.parentId)
  const position = siblings.findIndex((item) => item.id === node.id)
  const Glyph = childCount > 0 ? FolderIcon : side === 'data' ? FileIcon : ChartIcon
  const color = ui.colorOf(node)
  const everyStarred = childCount > 0 && subtreeIds(index, node.id).every((id) => index.byId.get(id)?.starred === true)
  const canRelate = connecting?.mode === 'relation' ? side === 'result' && connecting.id !== node.id && connecting.blocked?.has(node.id) !== true : connecting !== null && connecting.side !== side

  const className =
    'kb-node-row' +
    (open ? ' is-open' : '') +
    (ui.focusId === node.id ? ' is-focus' : ui.withinIds.has(node.id) ? ' is-within' : '') +
    (ui.linkedRows.has(node.id) ? ' is-linked' : '') +
    (selected ? ' is-selected' : '') +
    (starred ? ' is-starred' : '') +
    (context ? ' is-context' : '') +
    (ui.landedId === node.id ? ' is-landed' : '') +
    (dragging ? ' is-dragging' : '') +
    (hint === 'before' ? ' is-drop-before' : '') +
    (hint === 'after' ? (expanded ? ' is-drop-child' : ' is-drop-after') : '') +
    (hint === 'inside' ? ' is-drop-inside' : '') +
    (canRelate ? ' can-link' : '') +
    (connecting?.overId === node.id ? ' is-link-target' : '')

  const onDragStart = (event: DragEvent<HTMLDivElement>): void => {
    const ids = ui.selection?.side === side && ui.selection.ids.has(node.id) ? [...ui.selection.ids] : [node.id]
    ui.drag.current = { side, ids }
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', node.name)
    setDragging(true)
  }
  const onDragEnd = (): void => {
    ui.drag.current = null
    ui.setDropHint(null)
    setDragging(false)
  }
  const zoneOf = (event: DragEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    return zoneAt(event.clientY, box.top, box.height)
  }
  /**
   * What this row does with the drag in progress: nothing when it is not a
   * drag of this tree (the event moves on), "refuse" when the node would land
   * on itself or inside itself (stopped here, so the tree body below does not
   * turn it into "move to the end"), else "accept".
   */
  const verdict = (): 'ignore' | 'refuse' | 'accept' => {
    const dragged = ui.drag.current
    if (!dragged || dragged.side !== side) return 'ignore'
    return dragged.ids.some((id) => isInSubtree(index, id, node.id)) ? 'refuse' : 'accept'
  }
  const onDragOver = (event: DragEvent<HTMLDivElement>): void => {
    const what = verdict()
    if (what === 'ignore') return
    event.stopPropagation()
    if (what === 'refuse') {
      if (ui.dropHint !== null) ui.setDropHint(null)
      return
    }
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    const zone = zoneOf(event)
    if (hint !== zone) ui.setDropHint({ side, targetId: node.id, zone })
  }
  const onDrop = (event: DragEvent<HTMLDivElement>): void => {
    const what = verdict()
    if (what === 'ignore') return
    event.stopPropagation()
    if (what === 'refuse') {
      ui.setDropHint(null)
      return
    }
    event.preventDefault()
    const zone = zoneOf(event)
    ui.setDropHint(null)
    ui.dropOn(side, node.id, zone)
  }

  return (
    <div className="kb-node" style={{ ['--depth' as string]: depth }} role="treeitem" aria-level={depth + 1} aria-expanded={childCount > 0 ? expanded : undefined} aria-selected={selected}>
      <div
        className={'kb-node-line' + (context ? ' is-context' : '')}
        data-rec-node={node.id}
        data-rec-side={side}
        style={color ? { ['--kb-node-color' as string]: color } : undefined}
        onMouseEnter={() => ui.hover(node.id)}
        onMouseLeave={() => ui.hover(null)}
      >
        <div className={className} draggable={ui.renamingId !== node.id && connecting === null} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver} onDrop={onDrop}>
          {childCount > 0 && !ui.starOnly ? (
            <button type="button" className="kb-node-chevron" aria-label={expanded ? `收起「${node.name}」` : `展开「${node.name}」`} onClick={() => ui.toggleFold(node)}>
              <ChevronIcon size={14} className={expanded ? 'is-down' : undefined} />
            </button>
          ) : (
            <span className="kb-node-chevron is-blank" aria-hidden="true" />
          )}
          <button type="button" className="kb-node-icon" role="checkbox" aria-checked={selected} aria-label={`选择「${node.name}」`} title="选择（可以一起拖动、合并为分组或加星标）" onClick={() => ui.toggleSelect(side, node.id)}>
            <span className={'kb-node-glyph' + (childCount > 0 ? ' is-group' : '')}>
              <Glyph size={15} />
            </span>
            <span className="kb-node-box">
              <CheckIcon size={11} />
            </span>
          </button>
          {ui.renamingId === node.id ? (
            <RenameInput node={node} />
          ) : (
            <button
              type="button"
              className="kb-node-name"
              aria-expanded={open}
              title={open ? '收起详情' : '查看详情（双击重命名）'}
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey) ui.toggleSelect(side, node.id)
                else {
                  ui.pick(node.id)
                  ui.toggleOpen(node.id)
                }
              }}
              onDoubleClick={() => ui.setRenaming(node.id)}
            >
              {node.name}
            </button>
          )}
          {!context ? (
            <button
              type="button"
              className={'kb-node-star' + (starred ? ' is-on' : '')}
              aria-pressed={starred}
              aria-label={starred ? `取消星标「${node.name}」` : `给「${node.name}」加星标`}
              title={starred ? '取消星标' : '加星标：突出重要性，连线变成星标色'}
              onClick={() => ui.toggleStar(node)}
            >
              <StarIcon size={14} filled={starred} />
            </button>
          ) : null}
          {childCount > 0 ? <span className="kb-node-count" title={`${childCount} 个子节点`}>{childCount}</span> : null}
          {linkCount > 0 ? (
            <span className="kb-node-links" title={side === 'data' ? `关联了 ${linkCount} 个结果` : `来自 ${linkCount} 项数据`}>
              <LinkIcon size={11} />
              {linkCount}
            </span>
          ) : null}
          {relationCount > 0 ? (
            <span className="kb-node-links is-relation" title={`和 ${relationCount} 个结果有连线`}>
              <SwapIcon size={11} />
              {relationCount}
            </span>
          ) : null}
          <div className="kb-node-actions">
            <button type="button" className="kb-icon-btn" aria-label="添加子节点" title="添加子节点" onClick={() => ui.startAdd(side, node.id)}>
              <PlusIcon size={14} />
            </button>
            <button
              type="button"
              className="kb-icon-btn"
              aria-label="编辑节点"
              title="编辑"
              onClick={() => {
                if (!open) ui.toggleOpen(node.id)
                ui.setEditing(node.id)
              }}
            >
              <PencilIcon size={14} />
            </button>
            <Menu label="更多操作">
              {(close) => (
                <>
                  <button type="button" role="menuitem" className="kb-menu-item" onClick={() => { close(); ui.toggleStar(node) }}>
                    <StarIcon size={14} filled={starred} /> {starred ? '取消星标' : '加星标'}
                  </button>
                  {childCount > 0 ? (
                    <button type="button" role="menuitem" className="kb-menu-item" onClick={() => { close(); ui.toggleStarTree(node) }}>
                      <StarIcon size={14} filled={everyStarred} /> {everyStarred ? '整组取消星标' : '整组加星标'}
                    </button>
                  ) : null}
                  <div className="kb-menu-sep" />
                  <button type="button" role="menuitem" className="kb-menu-item" disabled={position <= 0} onClick={() => { close(); ui.shift(node, 'up') }}>
                    <ArrowUpIcon size={14} /> 上移
                  </button>
                  <button type="button" role="menuitem" className="kb-menu-item" disabled={position < 0 || position >= siblings.length - 1} onClick={() => { close(); ui.shift(node, 'down') }}>
                    <ArrowDownIcon size={14} /> 下移
                  </button>
                  <button type="button" role="menuitem" className="kb-menu-item" disabled={position <= 0} onClick={() => { close(); ui.shift(node, 'in') }}>
                    <IndentIcon size={14} /> 移入上一项
                  </button>
                  <button type="button" role="menuitem" className="kb-menu-item" disabled={node.parentId === null} onClick={() => { close(); ui.shift(node, 'out') }}>
                    <OutdentIcon size={14} /> 移出上一级
                  </button>
                  <div className="kb-menu-sep" />
                  {childCount > 0 ? (
                    <button type="button" role="menuitem" className="kb-menu-item" onClick={() => { close(); ui.dissolveNode(node) }}>
                      <OutdentIcon size={14} /> 解散（子节点上移）
                    </button>
                  ) : null}
                  <button type="button" role="menuitem" className="kb-menu-item is-danger" onClick={() => { close(); ui.removeNode(node) }}>
                    <TrashIcon size={14} /> {childCount > 0 ? '删除（含子节点）' : '删除'}
                  </button>
                </>
              )}
            </Menu>
          </div>
        </div>
        {!context ? (
          <span
            className={'kb-port kb-port-main' + (linkCount > 0 ? ' has-links' : '')}
            data-port={node.id}
            aria-hidden="true"
            title={COPY[side].portTitle}
            ref={(element) => ui.registerPort(node.id, element)}
            onPointerDown={(event) => ui.beginConnect(side, node.id, event, 'link')}
          />
        ) : null}
        {side === 'result' && !context ? (
          <span
            className={
              'kb-port kb-port-right' +
              (relationCount > 0 ? ' has-links' : '') +
              (connecting?.mode === 'relation' && connecting.id === node.id ? ' is-source' : '') +
              (connecting?.mode === 'relation' && canRelate ? ' is-ready' : '') +
              (connecting?.mode === 'relation' && connecting.overId === node.id ? ' is-target' : '')
            }
            data-port={`${node.id}:r`}
            aria-hidden="true"
            title="关系点：拖到另一个结果上，标出两个结果的关系（默认无向；松开时按住 Option/Alt = 有向）。数据连线用左边的圆点"
            ref={(element) => ui.registerPort(`${node.id}:r`, element)}
            onPointerDown={(event) => ui.beginConnect(side, node.id, event, 'relation')}
          />
        ) : null}
      </div>
      {open ? <NodeCard node={node} side={side} depth={depth} /> : null}
    </div>
  )
}

// ---------------------------------------------------------------- panel

/** One tree with its header. */
export const TreePanel = memo(function TreePanel({ side, flat }: { side: RecordSide; flat: Flat }) {
  const ui = useRecords()
  const copy = COPY[side]
  const total = listOf(ui.records, side).length
  const dragged = (): boolean => ui.drag.current?.side === side
  const endHint = ui.dropHint?.side === side && ui.dropHint.zone === 'end'
  const nothingShown = flat.rows.length === 0 && ui.adding?.side !== side
  return (
    <section className="kb-tree" data-side={side} aria-label={copy.title}>
      <header className="kb-tree-head">
        <h2>{copy.title}</h2>
        <span className="kb-count">{total}</span>
        <button type="button" className="kb-btn kb-btn-ghost kb-btn-sm" aria-label={copy.add} title={copy.add} onClick={() => ui.startAdd(side, null)}>
          <PlusIcon size={14} /> <span className="kb-add-text">{copy.add}</span>
        </button>
      </header>
      <div
        className={'kb-tree-body' + (endHint ? ' is-drop-end' : '')}
        role="tree"
        aria-label={copy.title}
        onDragOver={(event) => {
          if (!dragged()) return
          event.preventDefault()
          event.dataTransfer.dropEffect = 'move'
          if (!endHint) ui.setDropHint({ side, targetId: null, zone: 'end' })
        }}
        onDragLeave={(event) => {
          if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) ui.setDropHint(null)
        }}
        onDrop={(event) => {
          if (!dragged()) return
          event.preventDefault()
          ui.setDropHint(null)
          ui.dropOn(side, null, 'end')
        }}
      >
        {flat.rows.map((row) =>
          row.kind === 'node' ? (
            <NodeItem key={row.node.id} row={row} side={side} />
          ) : (
            <NodeForm
              key="add-form"
              side={side}
              depth={row.depth}
              submitLabel="添加"
              keepOpen
              note={ui.starOnly ? '「只看星标」下，新节点会自动加上星标，这样它不会立刻从这里消失' : undefined}
              onCancel={ui.stopAdd}
              onSubmit={(fields) => ui.addNode(side, row.parentId, fields)}
            />
          ),
        )}
        {nothingShown && total === 0 ? <div className="kb-placeholder">{copy.empty}</div> : null}
        {nothingShown && total > 0 ? <div className="kb-placeholder">{ui.starOnly ? '这一侧还没有加星标的节点。点节点名字右边的 ☆ 加星标。' : copy.empty}</div> : null}
      </div>
    </section>
  )
})
