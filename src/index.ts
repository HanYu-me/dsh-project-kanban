/**
 * Host half of the project-kanban plugin: stores the board on disk and
 * serves it under /project-kanban. The browser half (exports "./client")
 * adds the sidebar entry and the board view.
 * @module dsh-project-kanban
 */
import type { Context } from '@deepseek-ai/cordis'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { KANBAN_PREFIX } from './shared/protocol'
import { serveKanban } from './routes'
import { createFileStore, type BoardStore } from './store'

export const name = 'project-kanban'
/**
 * No hard dependencies: the route waits for `webServer` through
 * `ctx.inject`, so a composition without one simply has no route instead of
 * a pending entry.
 */
export const inject: string[] = []

export { createFileStore, createMemoryStore, defaultBoardPath } from './store'
export { serveKanban } from './routes'
export * from './shared/board'
export * from './shared/protocol'

/** Mount the host half. */
export function apply(ctx: Context, _config?: unknown, store: BoardStore = createFileStore()): void {
  ctx.inject(['webServer'], (routeCtx: Context) => {
    const webserver = routeCtx.get('webServer') as unknown as { register(route: unknown): unknown } | undefined
    if (webserver === undefined) return
    routeCtx.effect(() => {
      const dispose = webserver.register({
        kind: 'prefix',
        path: KANBAN_PREFIX,
        handler: (req: IncomingMessage, res: ServerResponse): Promise<void> => serveKanban(store, req, res),
      })
      return typeof dispose === 'function' ? (dispose as () => void) : (): void => {}
    }, 'project-kanban: route')
  })
}
