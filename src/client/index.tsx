/**
 * Browser half of the project-kanban plugin.
 *
 * - `sidebar.panellist` (list slot): the left-sidebar row. Its component is
 *   only the glyph; the sidebar draws the label and handles the click by
 *   selecting the panel with the same id.
 * - `main` (keyed slot): the board, rendered when that panel is selected.
 *
 * Every wiring step is wrapped so a failure is logged and the rest of DSH
 * keeps booting (a throw from `apply` fails the whole web boot).
 * @module dsh-project-kanban/client
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis'
import { BoardIcon } from './icons'
import { KanbanView, refusedSink } from './KanbanView'
import { ensureStyles } from './styles'
import { BoardSync } from './sync'

/** Panel id shared by the sidebar row and the main view. */
export const PANEL_ID = 'dsh-project-kanban:board'

/** No hard service dependencies: `slots` is reached through `ctx.inject`. */
export const inject: string[] = []

interface SlotsFace {
  inject(name: string, callback: () => unknown): unknown
  register(spec: { name: string; id?: string; key?: string; order?: number; label?: string }, component: unknown): () => void
}

function report(step: string, error: unknown): () => void {
  try {
    console.warn(`[project-kanban] ${step} failed; that part stays off.`, error)
  } catch {
    // A throwing console must not fail the boot.
  }
  return () => {}
}

/** Sidebar glyph. Props come from the sidebar row. */
function Entry(props: { size?: number; active?: boolean }) {
  return (
    <span className="kb-entry" data-active={String(Boolean(props.active))}>
      <BoardIcon size={props.size ?? 16} />
    </span>
  )
}

/** Apply the browser half. */
export function apply(ctx: ClientContext): void {
  try {
    ensureStyles()
  } catch (error) {
    report('stylesheet', error)
  }
  // One board copy for the whole page, so leaving and re-opening the panel
  // keeps unsaved changes and does not refetch from scratch.
  const sync = new BoardSync({ onRefused: (reason) => refusedSink.current?.(reason) })
  const Board = () => <KanbanView sync={sync} />

  ctx.inject(['slots'], (slotsCtx: ClientContext) => {
    const slots = (slotsCtx as unknown as { slots?: SlotsFace }).slots
    if (slots === undefined) return
    slotsCtx.effect(() => {
      try {
        return slots.inject('main', () => {
          try {
            return slots.register({ name: 'main', key: PANEL_ID }, Board)
          } catch (error) {
            return report('main view registration', error)
          }
        }) as () => void
      } catch (error) {
        return report('main view', error)
      }
    }, 'project-kanban: main view')
    slotsCtx.effect(() => {
      try {
        return slots.inject('sidebar.panellist', () => {
          try {
            return slots.register({ name: 'sidebar.panellist', id: PANEL_ID, order: 6, label: '项目看板' }, Entry)
          } catch (error) {
            return report('sidebar entry registration', error)
          }
        }) as () => void
      } catch (error) {
        return report('sidebar entry', error)
      }
    }, 'project-kanban: sidebar entry')
  })
  ctx.effect(() => () => sync.dispose(), 'project-kanban: sync')
}
