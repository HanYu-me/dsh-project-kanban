/**
 * The board view shown in DSH's main area: one section per project, each
 * with the four fixed columns. All changes go through {@link BoardSync}.
 * @module dsh-project-kanban/client/KanbanView
 */
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type DragEvent, type KeyboardEvent, type ReactNode } from 'react'
import {
  COLUMNS,
  COLUMN_LABELS,
  LIMITS,
  PROJECT_COLORS,
  columnCounts,
  newId,
  recordsOf,
  nextColumn,
  tasksIn,
  type Board,
  type ColumnId,
  type Op,
  type Project,
  type ProjectColor,
  type Task,
} from '../shared/board'
import { recordCounts } from '../shared/records'
import { Actions, COLOR_NAMES, COLOR_VALUES, Menu, SaveStatus, shortDate, useActions, type BoardActions, type Toast } from './common'
import { RecordsPage } from './RecordsView'
import type { BoardSync } from './sync'
import {
  AlertIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  BoardIcon,
  CheckIcon,
  ChevronIcon,
  CloseIcon,
  EmptyIllustration,
  MoreIcon,
  NoteIcon,
  PencilIcon,
  PlusIcon,
  RecordsIcon,
  StatusIcon,
  TrashIcon,
  UndoIcon,
} from './icons'

export { COLOR_VALUES, shortDate }

const EMPTY_HINTS: Record<ColumnId, string> = {
  todo: '暂无待办',
  doing: '标记待办完成后会来到这里',
  review: '等待反馈的任务',
  done: '完成的任务会出现在这里',
}

// ---------------------------------------------------------------- task editor

interface EditorProps {
  initialTitle?: string
  initialNote?: string
  submitLabel: string
  /** Keep the editor open (cleared) after a submit, for quick entry. */
  keepOpen?: boolean
  onSubmit(title: string, note: string): boolean
  onCancel(): void
}

function TaskEditor({ initialTitle = '', initialNote = '', submitLabel, keepOpen, onSubmit, onCancel }: EditorProps) {
  const [title, setTitle] = useState(initialTitle)
  const [note, setNote] = useState(initialNote)
  const [showNote, setShowNote] = useState(initialNote !== '')
  const titleRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    titleRef.current?.focus()
    titleRef.current?.select()
  }, [])
  const trimmed = title.trim()
  const tooLong = trimmed.length > LIMITS.taskTitle
  const submit = (): void => {
    if (trimmed === '' || tooLong) return
    if (!onSubmit(trimmed, note)) return
    if (keepOpen) {
      setTitle('')
      setNote('')
      setShowNote(false)
      titleRef.current?.focus()
    }
  }
  const onKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onCancel()
    } else if (event.key === 'Enter' && (event.target instanceof HTMLInputElement || event.metaKey || event.ctrlKey)) {
      if (event.nativeEvent.isComposing) return
      event.preventDefault()
      submit()
    }
  }
  return (
    <div className="kb-card is-editing" onKeyDown={onKey}>
      <input
        ref={titleRef}
        className="kb-input"
        placeholder="任务标题"
        value={title}
        maxLength={LIMITS.taskTitle}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="任务标题"
      />
      {showNote ? (
        <textarea className="kb-textarea" placeholder="备注（可选）" value={note} rows={3} maxLength={LIMITS.taskNote} onChange={(e) => setNote(e.target.value)} aria-label="备注" />
      ) : null}
      {tooLong ? <span className="kb-hint is-error">标题最多 {LIMITS.taskTitle} 个字符</span> : null}
      <div className="kb-edit-row">
        {!showNote ? (
          <button type="button" className="kb-btn kb-btn-ghost kb-btn-sm" onClick={() => setShowNote(true)}>
            <NoteIcon size={14} /> 备注
          </button>
        ) : (
          <span className="kb-hint">⌘/Ctrl + Enter 保存</span>
        )}
        <div>
          <button type="button" className="kb-btn kb-btn-ghost kb-btn-sm" onClick={onCancel}>
            取消
          </button>
          <button type="button" className="kb-btn kb-btn-primary kb-btn-sm" disabled={trimmed === '' || tooLong} onClick={submit}>
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- card

function TaskCard({ project, task, index }: { project: Project; task: Task; index: number }) {
  const actions = useActions()
  const [editing, setEditing] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dragging, setDragging] = useState(false)
  const next = nextColumn(task.column)

  if (editing) {
    return (
      <TaskEditor
        initialTitle={task.title}
        initialNote={task.note}
        submitLabel="保存"
        onCancel={() => setEditing(false)}
        onSubmit={(title, note) => {
          const ok = actions.dispatch({ type: 'task.update', projectId: project.id, taskId: task.id, title, note })
          if (ok) setEditing(false)
          return ok
        }}
      />
    )
  }

  const advance = (): void => {
    if (!next) return
    if (actions.dispatch({ type: 'task.advance', projectId: project.id, taskId: task.id, from: task.column })) actions.land(task.id)
  }
  const moveTo = (to: ColumnId): void => {
    if (actions.dispatch({ type: 'task.move', projectId: project.id, taskId: task.id, to, beforeTaskId: null })) actions.land(task.id)
  }
  const remove = (): void => {
    const position = project.tasks.findIndex((t) => t.id === task.id)
    if (!actions.dispatch({ type: 'task.delete', projectId: project.id, taskId: task.id })) return
    actions.toast(`已删除「${task.title.length > 18 ? task.title.slice(0, 18) + '…' : task.title}」`, {
      action: { label: '撤销', run: () => actions.dispatch({ type: 'task.restore', projectId: project.id, task, index: position }) },
    })
  }
  const onDragStart = (event: DragEvent): void => {
    actions.drag.current = { projectId: project.id, taskId: task.id }
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', task.title)
    setDragging(true)
  }
  const onDragEnd = (): void => {
    actions.drag.current = null
    setDragging(false)
  }
  const meta = task.column === 'done' ? `完成于 ${shortDate(task.completedAt)}` : `创建于 ${shortDate(task.createdAt)}`

  return (
    <div
      className={'kb-card' + (dragging ? ' is-dragging' : '') + (actions.landedId === task.id ? ' is-landed' : '')}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      data-task-id={task.id}
      data-index={index}
      onDoubleClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) return
        setEditing(true)
      }}
    >
      {next ? (
        <button type="button" className="kb-check" onClick={advance} aria-label={`标记完成，移到「${COLUMN_LABELS[next]}」`} title={`标记完成 → ${COLUMN_LABELS[next]}`}>
          <CheckIcon size={11} />
        </button>
      ) : (
        <span className="kb-check is-done" role="img" aria-label="已完成" title="已完成">
          <CheckIcon size={11} />
        </span>
      )}
      <div className="kb-card-main">
        <p className="kb-card-title">{task.title}</p>
        {task.note ? <p className="kb-card-note">{task.note}</p> : null}
        <div className="kb-card-meta">{meta}</div>
      </div>
      <div className={'kb-card-actions' + (menuOpen ? ' is-open' : '')}>
        <button type="button" className="kb-icon-btn" aria-label="编辑任务" title="编辑" onClick={() => setEditing(true)}>
          <PencilIcon size={14} />
        </button>
        <Menu label="更多操作" onOpenChange={setMenuOpen}>
          {(close) => (
            <>
              <div className="kb-menu-label">移动到</div>
              {COLUMNS.map((column) => (
                <button
                  key={column}
                  type="button"
                  role="menuitem"
                  className="kb-menu-item"
                  disabled={column === task.column}
                  onClick={() => {
                    close()
                    moveTo(column)
                  }}
                >
                  <StatusIcon column={column} />
                  {column === 'todo' && task.column === 'done' ? '重新打开（待办）' : COLUMN_LABELS[column]}
                </button>
              ))}
              <div className="kb-menu-sep" />
              <button
                type="button"
                role="menuitem"
                className="kb-menu-item is-danger"
                onClick={() => {
                  close()
                  remove()
                }}
              >
                <TrashIcon size={14} /> 删除任务
              </button>
            </>
          )}
        </Menu>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- column

function Column({ project, column }: { project: Project; column: ColumnId }) {
  const actions = useActions()
  const tasks = tasksIn(project, column)
  const [adding, setAdding] = useState(false)
  const [drop, setDrop] = useState<{ before: string | null } | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const accepts = (): boolean => actions.drag.current?.projectId === project.id
  const beforeAt = (clientY: number): string | null => {
    const cards = listRef.current?.querySelectorAll<HTMLElement>(':scope > .kb-card[data-task-id]') ?? []
    for (const card of cards) {
      const box = card.getBoundingClientRect()
      if (clientY < box.top + box.height / 2) return card.dataset.taskId ?? null
    }
    return null
  }
  const onDragOver = (event: DragEvent): void => {
    if (!accepts()) return
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    const before = beforeAt(event.clientY)
    if (drop?.before !== before || drop === null) setDrop({ before })
  }
  const onDragLeave = (event: DragEvent): void => {
    if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) setDrop(null)
  }
  const onDrop = (event: DragEvent): void => {
    const dragged = actions.drag.current
    setDrop(null)
    if (!dragged || dragged.projectId !== project.id) return
    event.preventDefault()
    const before = beforeAt(event.clientY)
    if (before === dragged.taskId) return
    if (actions.dispatch({ type: 'task.move', projectId: project.id, taskId: dragged.taskId, to: column, beforeTaskId: before })) actions.land(dragged.taskId)
  }

  const draggedId = actions.drag.current?.taskId
  const line = <div className="kb-drop-line" aria-hidden="true" />
  return (
    <section className={'kb-column' + (drop ? ' is-drop' : '')} data-column={column} aria-label={`${project.name} · ${COLUMN_LABELS[column]}`} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
      <header className="kb-column-head">
        <StatusIcon column={column} />
        <span>{COLUMN_LABELS[column]}</span>
        <span className="kb-count">{tasks.length}</span>
        <button type="button" className="kb-icon-btn" aria-label={`在「${COLUMN_LABELS[column]}」添加任务`} title="添加任务" onClick={() => setAdding(true)}>
          <PlusIcon size={15} />
        </button>
      </header>
      <div className="kb-cards" ref={listRef}>
        {tasks.map((task, index) => (
          <FragmentWithLine key={task.id} show={drop !== null && drop.before === task.id && draggedId !== task.id} line={line}>
            <TaskCard project={project} task={task} index={index} />
          </FragmentWithLine>
        ))}
        {drop !== null && drop.before === null && tasks.length > 0 ? line : null}
        {tasks.length === 0 && !adding ? <div className="kb-placeholder">{drop ? '放到这里' : EMPTY_HINTS[column]}</div> : null}
        {adding ? (
          <TaskEditor
            submitLabel="添加"
            keepOpen
            onCancel={() => setAdding(false)}
            onSubmit={(title, note) => {
              const id = newId('t')
              const ok = actions.dispatch({ type: 'task.add', projectId: project.id, id, title, note, column })
              if (ok) actions.land(id)
              return ok
            }}
          />
        ) : null}
      </div>
      {!adding ? (
        <button type="button" className="kb-add-task" onClick={() => setAdding(true)}>
          <PlusIcon size={14} /> 添加任务
        </button>
      ) : null}
    </section>
  )
}

function FragmentWithLine({ show, line, children }: { show: boolean; line: ReactNode; children: ReactNode }) {
  return (
    <>
      {show ? line : null}
      {children}
    </>
  )
}

// ---------------------------------------------------------------- project

/** What the "delete project" dialog says goes with the project. */
export function deleteBody(tasks: number, recorded: number): string {
  const parts = [tasks > 0 ? `${tasks} 个任务` : '', recorded > 0 ? `${recorded} 条数据与结果记录` : ''].filter((part) => part !== '')
  return parts.length > 0 ? `项目中的${parts.join('和')}会一起删除，此操作不能撤销。` : '此操作不能撤销。'
}

function ProjectSection({ project, index, total }: { project: Project; index: number; total: number }) {
  const actions = useActions()
  const [renaming, setRenaming] = useState(false)
  const [name, setName] = useState(project.name)
  const counts = columnCounts(project)
  const total_ = project.tasks.length
  const percent = total_ === 0 ? 0 : Math.round((counts.done / total_) * 100)
  const recordTotals = recordCounts(recordsOf(project))
  const recorded = recordTotals.data + recordTotals.results

  const saveName = (): void => {
    const trimmed = name.trim()
    if (trimmed === '' || trimmed === project.name) {
      setName(project.name)
      setRenaming(false)
      return
    }
    if (actions.dispatch({ type: 'project.update', projectId: project.id, name: trimmed })) setRenaming(false)
  }
  const toggle = (): void => {
    actions.dispatch({ type: 'project.update', projectId: project.id, collapsed: !project.collapsed })
  }

  return (
    <article className={'kb-project' + (project.collapsed ? ' is-collapsed' : '')} style={{ ['--kb-accent' as string]: COLOR_VALUES[project.color] }} aria-label={`项目 ${project.name}`}>
      <header className="kb-project-head">
        <button type="button" className="kb-icon-btn" aria-label={project.collapsed ? '展开项目' : '收起项目'} aria-expanded={!project.collapsed} onClick={toggle}>
          <ChevronIcon className="kb-collapse" />
        </button>
        {renaming ? (
          <input
            className="kb-input kb-project-name-input"
            value={name}
            autoFocus
            maxLength={LIMITS.projectName}
            aria-label="项目名称"
            onChange={(e) => setName(e.target.value)}
            onBlur={saveName}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) saveName()
              if (e.key === 'Escape') {
                setName(project.name)
                setRenaming(false)
              }
            }}
          />
        ) : (
          <h2
            className="kb-project-name"
            title="打开数据与结果"
            role="button"
            tabIndex={0}
            aria-label={`${project.name}（按 Enter 打开数据与结果）`}
            onClick={() => actions.openProject(project.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                actions.openProject(project.id)
              }
            }}
          >
            {project.name}
          </h2>
        )}
        <div className="kb-chips" aria-hidden="true">
          {COLUMNS.map((column) => (
            <span key={column} className="kb-chip" style={{ ['--c' as string]: `var(--kb-c-${column})` }}>
              <i />
              {COLUMN_LABELS[column]} {counts[column]}
            </span>
          ))}
        </div>
        <button type="button" className="kb-btn kb-btn-sm kb-open-records" title="打开这个项目的数据与结果" onClick={() => actions.openProject(project.id)}>
          <RecordsIcon size={14} /> 数据与结果
          {recorded > 0 ? <span className="kb-count">{recorded}</span> : null}
        </button>
        <div className="kb-progress" title={`${counts.done}/${total_} 已完成`}>
          <div className="kb-progress-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label="完成进度">
            <span style={{ width: `${percent}%` }} />
          </div>
          <span>{percent}%</span>
        </div>
        <Menu label="项目操作">
          {(close) => (
            <>
              <button
                type="button"
                role="menuitem"
                className="kb-menu-item"
                onClick={() => {
                  close()
                  setName(project.name)
                  setRenaming(true)
                }}
              >
                <PencilIcon size={14} /> 重命名
              </button>
              <div className="kb-menu-label">颜色</div>
              <div className="kb-swatches" role="group" aria-label="项目颜色">
                {PROJECT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    role="menuitemradio"
                    aria-checked={color === project.color}
                    className={'kb-swatch' + (color === project.color ? ' is-current' : '')}
                    style={{ ['--s' as string]: COLOR_VALUES[color] }}
                    aria-label={`${COLOR_NAMES[color]}色`}
                    onClick={() => actions.dispatch({ type: 'project.update', projectId: project.id, color })}
                  />
                ))}
              </div>
              <div className="kb-menu-sep" />
              <button
                type="button"
                role="menuitem"
                className="kb-menu-item"
                disabled={index === 0}
                onClick={() => {
                  close()
                  actions.dispatch({ type: 'project.move', projectId: project.id, toIndex: index - 1 })
                }}
              >
                <ArrowUpIcon size={14} /> 上移
              </button>
              <button
                type="button"
                role="menuitem"
                className="kb-menu-item"
                disabled={index === total - 1}
                onClick={() => {
                  close()
                  actions.dispatch({ type: 'project.move', projectId: project.id, toIndex: index + 1 })
                }}
              >
                <ArrowDownIcon size={14} /> 下移
              </button>
              <div className="kb-menu-sep" />
              <button
                type="button"
                role="menuitem"
                className="kb-menu-item is-danger"
                onClick={() => {
                  close()
                  actions.confirm({
                    title: `删除项目「${project.name}」？`,
                    body: deleteBody(total_, recorded),
                    confirmLabel: '删除项目',
                    onConfirm: () => {
                      if (actions.dispatch({ type: 'project.delete', projectId: project.id })) actions.toast(`已删除项目「${project.name}」`)
                    },
                  })
                }}
              >
                <TrashIcon size={14} /> 删除项目
              </button>
            </>
          )}
        </Menu>
      </header>
      <div className="kb-project-body">
        <div className="kb-columns">
          {COLUMNS.map((column) => (
            <Column key={column} project={project} column={column} />
          ))}
        </div>
      </div>
    </article>
  )
}

// ---------------------------------------------------------------- new project

function NewProjectForm({ onDone, autoColor }: { onDone(): void; autoColor: ProjectColor }) {
  const actions = useActions()
  const [name, setName] = useState('')
  const [color, setColor] = useState<ProjectColor>(autoColor)
  const trimmed = name.trim()
  const submit = (): void => {
    if (trimmed === '') return
    if (actions.dispatch({ type: 'project.add', id: newId('p'), name: trimmed, color })) onDone()
  }
  return (
    <div className="kb-new-project" role="group" aria-label="新建项目">
      <input
        className="kb-input"
        autoFocus
        placeholder="项目名称，例如：官网改版"
        value={name}
        maxLength={LIMITS.projectName}
        aria-label="项目名称"
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.nativeEvent.isComposing) submit()
          if (e.key === 'Escape') onDone()
        }}
      />
      <div className="kb-swatches" role="radiogroup" aria-label="项目颜色">
        {PROJECT_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={c === color}
            aria-label={`${COLOR_NAMES[c]}色`}
            className={'kb-swatch' + (c === color ? ' is-current' : '')}
            style={{ ['--s' as string]: COLOR_VALUES[c] }}
            onClick={() => setColor(c)}
          />
        ))}
      </div>
      <button type="button" className="kb-btn kb-btn-ghost" onClick={onDone}>
        取消
      </button>
      <button type="button" className="kb-btn kb-btn-primary" disabled={trimmed === ''} onClick={submit}>
        创建项目
      </button>
    </div>
  )
}

// ---------------------------------------------------------------- dialog

function ConfirmDialog({ title, body, confirmLabel, onConfirm, onClose }: { title: string; body: string; confirmLabel: string; onConfirm(): void; onClose(): void }) {
  const box = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    box.current?.querySelector<HTMLElement>('button')?.focus()
    const onKey = (event: globalThis.KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeRef.current()
      } else if (event.key === 'Tab' && box.current) {
        const buttons = Array.from(box.current.querySelectorAll<HTMLElement>('button'))
        const first = buttons[0]
        const last = buttons[buttons.length - 1]
        if (!first || !last) return
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('keydown', onKey, true)
      if (previous && document.contains(previous)) previous.focus()
    }
  }, [])
  return (
    <div className="kb-overlay" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="kb-dialog" role="alertdialog" aria-modal="true" aria-labelledby="kb-dialog-title" aria-describedby="kb-dialog-body" ref={box}>
        <h3 id="kb-dialog-title">{title}</h3>
        <p id="kb-dialog-body">{body}</p>
        <div className="kb-dialog-actions">
          <button type="button" className="kb-btn" onClick={onClose}>
            取消
          </button>
          <button
            type="button"
            className="kb-btn kb-btn-danger"
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- view

function Stats({ board }: { board: Board }) {
  let tasks = 0
  let done = 0
  let doing = 0
  for (const project of board.projects) {
    for (const task of project.tasks) {
      tasks += 1
      if (task.column === 'done') done += 1
      if (task.column === 'doing') doing += 1
    }
  }
  return (
    <p className="kb-subtitle">
      <span>
        <b>{board.projects.length}</b> 个项目
      </span>
      <span>
        <b>{tasks}</b> 个任务
      </span>
      <span>
        <b>{doing}</b> 进行中
      </span>
      <span>
        <b>{done}</b> 已完成
      </span>
    </p>
  )
}

/**
 * Which project's page is open. Kept outside React so leaving the panel and
 * coming back (the view unmounts in between) lands on the same page.
 */
const navigation: { projectId: string | null } = { projectId: null }

/** The whole board view. */
export function KanbanView({ sync }: { sync: BoardSync }) {
  const snapshot = useSyncExternalStore(sync.subscribe, sync.getSnapshot)
  const { board, status } = snapshot
  const [creating, setCreating] = useState(false)
  const [openId, setOpenId] = useState<string | null>(() => navigation.projectId)
  const scroller = useRef<HTMLDivElement>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [landedId, setLandedId] = useState<string | null>(null)
  const [dialog, setDialog] = useState<{ title: string; body: string; confirmLabel: string; onConfirm: () => void } | null>(null)
  const drag = useRef<{ projectId: string; taskId: string } | null>(null)
  const toastSeq = useRef(0)
  const landTimer = useRef<ReturnType<typeof setTimeout>>()

  const dismiss = useCallback((id: number) => setToasts((list) => list.filter((t) => t.id !== id)), [])
  const toast = useCallback(
    (text: string, options: { tone?: 'error'; action?: Toast['action'] } = {}) => {
      toastSeq.current += 1
      const id = toastSeq.current
      setToasts((list) => [...list.slice(-2), { id, text, ...options }])
      setTimeout(() => dismiss(id), options.action ? 6000 : 3500)
    },
    [dismiss],
  )
  const land = useCallback((taskId: string) => {
    setLandedId(taskId)
    if (landTimer.current) clearTimeout(landTimer.current)
    landTimer.current = setTimeout(() => setLandedId(null), 900)
  }, [])

  // Refusals reported by the sync layer surface as error toasts.
  useEffect(() => {
    refusedSink.current = (reason) => toast(reason, { tone: 'error' })
    return () => {
      refusedSink.current = null
    }
  }, [toast])

  // Load now, and re-check when the window comes back (another window may have changed the board).
  useEffect(() => {
    void sync.load()
    const onFocus = (): void => {
      if (document.visibilityState === 'visible') void sync.load()
    }
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onFocus)
    return () => {
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onFocus)
      if (landTimer.current) clearTimeout(landTimer.current)
    }
  }, [sync])

  const openProject = useCallback((id: string | null) => {
    navigation.projectId = id
    setOpenId(id)
  }, [])

  const actions = useMemo<BoardActions>(
    () => ({
      dispatch: (op) => sync.dispatch(op),
      toast,
      land,
      landedId,
      drag,
      confirm: setDialog,
      openProject,
    }),
    [sync, toast, land, landedId, openProject],
  )

  const autoColor = PROJECT_COLORS[board.projects.length % PROJECT_COLORS.length]!
  const ready = status !== 'loading' && status !== 'load-failed'
  const page = ready && openId !== null ? board.projects.find((project) => project.id === openId) : undefined

  // The project is gone (deleted elsewhere): back to the board.
  useEffect(() => {
    if (ready && openId !== null && page === undefined) openProject(null)
  }, [ready, openId, page, openProject])
  // Each page starts at its top.
  useEffect(() => {
    scroller.current?.scrollTo?.({ top: 0 })
  }, [page?.id])

  return (
    <Actions.Provider value={actions}>
      <div className="kb-root">
        <div className="kb-scroll" ref={scroller}>
          <div className="kb-inner">
            {page ? <RecordsPage key={page.id} project={page} status={status} onBack={() => openProject(null)} /> : null}
            <div className="kb-header" hidden={page !== undefined}>
              <div>
                <h1 className="kb-title">
                  <span className="kb-title-mark">
                    <BoardIcon size={18} />
                  </span>
                  项目看板
                </h1>
                {ready ? <Stats board={board} /> : null}
              </div>
              <div className="kb-header-actions">
                {ready ? <SaveStatus status={status} /> : null}
                {ready && board.projects.length > 0 ? (
                  <button type="button" className="kb-btn kb-btn-primary" onClick={() => setCreating(true)} disabled={creating}>
                    <PlusIcon size={15} /> 新建项目
                  </button>
                ) : null}
              </div>
            </div>

            {page ? null : status === 'loading' ? (
              <div className="kb-loading" aria-busy="true" aria-label="加载中">
                <div className="kb-skeleton" />
                <div className="kb-skeleton" />
              </div>
            ) : status === 'load-failed' ? (
              <div className="kb-error" role="alert">
                <AlertIcon size={28} />
                <strong>无法加载看板</strong>
                <span className="kb-hint">{snapshot.error ?? '宿主服务没有响应'}。请确认插件已启用，然后重试。</span>
                <button type="button" className="kb-btn" onClick={() => void sync.load()}>
                  重试
                </button>
              </div>
            ) : (
              <>
                {creating ? <NewProjectForm autoColor={autoColor} onDone={() => setCreating(false)} /> : null}
                {board.projects.length === 0 && !creating ? (
                  <div className="kb-empty">
                    <EmptyIllustration />
                    <h2>还没有项目</h2>
                    <p>为每个项目建一个分区，任务按下面的顺序流转。点任务左侧的圆圈即可完成当前阶段，进入下一列。</p>
                    <div className="kb-empty-flow" aria-hidden="true">
                      {COLUMNS.map((column, i) => (
                        <span key={column} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <span className="kb-chip" style={{ ['--c' as string]: `var(--kb-c-${column})` }}>
                            <i />
                            {COLUMN_LABELS[column]}
                          </span>
                          {i < COLUMNS.length - 1 ? <ArrowRightIcon size={13} /> : null}
                        </span>
                      ))}
                    </div>
                    <button type="button" className="kb-btn kb-btn-primary" onClick={() => setCreating(true)}>
                      <PlusIcon size={15} /> 新建第一个项目
                    </button>
                  </div>
                ) : null}
                <div className="kb-projects">
                  {board.projects.map((project, index) => (
                    <ProjectSection key={project.id} project={project} index={index} total={board.projects.length} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="kb-toasts" aria-live="polite">
          {toasts.map((t) => (
            <div key={t.id} className={'kb-toast' + (t.tone === 'error' ? ' is-error' : '')} role={t.tone === 'error' ? 'alert' : 'status'}>
              <span>{t.text}</span>
              {t.action ? (
                <button
                  type="button"
                  className="kb-btn kb-btn-sm"
                  onClick={() => {
                    t.action!.run()
                    dismiss(t.id)
                  }}
                >
                  <UndoIcon size={13} /> {t.action.label}
                </button>
              ) : null}
              <button type="button" className="kb-icon-btn" aria-label="关闭提示" onClick={() => dismiss(t.id)}>
                <CloseIcon size={13} />
              </button>
            </div>
          ))}
        </div>

        {dialog ? <ConfirmDialog {...dialog} onClose={() => setDialog(null)} /> : null}
      </div>
    </Actions.Provider>
  )
}

/**
 * Where the sync layer's refusals go: the mounted view installs its toast
 * here. Kept outside React so the (long-lived) sync object can report even
 * between mounts without holding a stale component.
 */
export const refusedSink: { current: ((reason: string) => void) | null } = { current: null }
