/**
 * Pieces shared by the board view and the records view: the actions every
 * component reaches through context, small helpers, and the "⋯" menu.
 * @module dsh-project-kanban/client/common
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import type { Op, ProjectColor } from '../shared/board'
import type { SyncStatus } from './sync'
import { MoreIcon } from './icons'

/** CSS colour of each project accent. */
export const COLOR_VALUES: Record<ProjectColor, string> = {
  blue: '#4d6bfe',
  violet: '#8b5cf6',
  green: '#22a06b',
  amber: '#e09400',
  rose: '#e5484d',
  teal: '#0ea5a4',
  slate: '#64748b',
}

export const COLOR_NAMES: Record<ProjectColor, string> = {
  blue: '蓝',
  violet: '紫',
  green: '绿',
  amber: '橙',
  rose: '红',
  teal: '青',
  slate: '灰',
}

// ---------------------------------------------------------------- context

export interface Toast {
  id: number
  text: string
  tone?: 'error'
  action?: { label: string; run: () => void }
}

export interface BoardActions {
  dispatch(op: Op): boolean
  toast(text: string, options?: { tone?: 'error'; action?: Toast['action'] }): void
  /** Briefly highlight a card after it moved. */
  land(taskId: string): void
  landedId: string | null
  drag: { current: { projectId: string; taskId: string } | null }
  confirm(options: { title: string; body: string; confirmLabel: string; onConfirm: () => void }): void
  /** Open the data-and-results page of a project (null = back to the board). */
  openProject(id: string | null): void
}

export const Actions = createContext<BoardActions | null>(null)

export function useActions(): BoardActions {
  const value = useContext(Actions)
  if (!value) throw new Error('KanbanView context missing')
  return value
}

// ---------------------------------------------------------------- helpers

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/** Short local date, with the time for today. */
export function shortDate(iso: string | undefined, now: Date = new Date()): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const sameDay = d.toDateString() === now.toDateString()
  if (sameDay) return `今天 ${pad(d.getHours())}:${pad(d.getMinutes())}`
  const md = `${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  return d.getFullYear() === now.getFullYear() ? md : `${d.getFullYear()}-${md}`
}

/** Close on outside pointer-down and Escape. */
export function useDismiss(open: boolean, close: () => void): React.RefObject<HTMLDivElement> {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onDown = (event: PointerEvent): void => {
      if (ref.current && !ref.current.contains(event.target as Node)) close()
    }
    const onKey = (event: globalThis.KeyboardEvent): void => {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('pointerdown', onDown, true)
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('pointerdown', onDown, true)
      document.removeEventListener('keydown', onKey, true)
    }
  }, [open, close])
  return ref
}

// ---------------------------------------------------------------- menu

export function Menu({ label, children, onOpenChange }: { label: string; children: (close: () => void) => ReactNode; onOpenChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false)
  const set = useCallback(
    (value: boolean) => {
      setOpen(value)
      onOpenChange?.(value)
    },
    [onOpenChange],
  )
  const trigger = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const close = useCallback(() => {
    set(false)
    trigger.current?.focus()
  }, [set])
  const ref = useDismiss(open, close)
  const items = (): HTMLElement[] => Array.from(menu.current?.querySelectorAll<HTMLElement>('[role^="menuitem"]:not(:disabled)') ?? [])
  useEffect(() => {
    if (open) items()[0]?.focus()
  }, [open])
  const onMenuKey = (event: KeyboardEvent): void => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Home' && event.key !== 'End') return
    event.preventDefault()
    const list = items()
    if (list.length === 0) return
    const current = list.indexOf(document.activeElement as HTMLElement)
    const next =
      event.key === 'Home' ? 0 : event.key === 'End' ? list.length - 1 : event.key === 'ArrowDown' ? (current + 1) % list.length : (current - 1 + list.length) % list.length
    list[next]?.focus()
  }
  return (
    <div className="kb-menu-anchor" ref={ref}>
      <button ref={trigger} type="button" className="kb-icon-btn" aria-label={label} title={label} aria-haspopup="menu" aria-expanded={open} onClick={() => set(!open)}>
        <MoreIcon />
      </button>
      {open ? (
        <div className="kb-menu" role="menu" aria-label={label} ref={menu} onKeyDown={onMenuKey}>
          {children(close)}
        </div>
      ) : null}
    </div>
  )
}


// ---------------------------------------------------------------- save status

const STATUS_TEXT: Record<SyncStatus, string> = {
  loading: '加载中',
  saved: '已保存',
  saving: '保存中…',
  offline: '未连接，稍后自动重试',
  'load-failed': '加载失败',
}

/** The little "saved / saving / offline" pill in a page header. */
export function SaveStatus({ status }: { status: SyncStatus }) {
  return (
    <span className={'kb-status' + (status === 'saving' ? ' is-saving' : '') + (status === 'offline' ? ' is-offline' : '')} role="status" data-kb-save-status="">
      <i />
      {STATUS_TEXT[status]}
    </span>
  )
}
