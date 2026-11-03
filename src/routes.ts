/**
 * HTTP routes under /project-kanban, mounted on the DSH webserver.
 * @module dsh-project-kanban/routes
 */
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Op } from './shared/board'
import { BOARD_ENDPOINT, MAX_BODY_BYTES, MAX_OPS_PER_REQUEST, OPS_ENDPOINT } from './shared/protocol'
import type { BoardStore } from './store'

/** Write one JSON response that is never cached. */
export function writeJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'referrer-policy': 'no-referrer',
  })
  res.end(JSON.stringify(body))
}

/** Read a JSON body of at most `maxBytes`. */
export async function readBoundedJson(req: IncomingMessage, maxBytes: number): Promise<unknown> {
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of req) {
    const buffer = chunk as Buffer
    size += buffer.length
    if (size > maxBytes) throw new Error('body too large')
    chunks.push(buffer)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

/**
 * Serve one request under the prefix.
 * @param store - the board store.
 */
export async function serveKanban(store: BoardStore, req: IncomingMessage, res: ServerResponse): Promise<void> {
  const pathname = new URL(req.url ?? '/', 'http://x').pathname.replace(/\/+$/, '')
  try {
    if (pathname === BOARD_ENDPOINT) {
      if (req.method !== 'GET') return writeJson(res, 405, { ok: false, error: '只支持 GET' })
      return writeJson(res, 200, { ok: true, value: store.read() })
    }
    if (pathname === OPS_ENDPOINT) {
      if (req.method !== 'POST') return writeJson(res, 405, { ok: false, error: '只支持 POST' })
      let body: unknown
      try {
        body = await readBoundedJson(req, MAX_BODY_BYTES)
      } catch (error) {
        const tooLarge = error instanceof Error && error.message === 'body too large'
        return writeJson(res, tooLarge ? 413 : 400, { ok: false, error: tooLarge ? '请求过大' : '请求不是有效的 JSON' })
      }
      const ops = (body as { ops?: unknown } | null)?.ops
      if (!Array.isArray(ops)) return writeJson(res, 400, { ok: false, error: '缺少 ops 数组' })
      if (ops.length > MAX_OPS_PER_REQUEST) return writeJson(res, 413, { ok: false, error: `一次最多 ${MAX_OPS_PER_REQUEST} 个操作` })
      const result = store.apply(ops as Op[])
      return writeJson(res, 200, { ok: true, value: result.board, refused: result.refused })
    }
    return writeJson(res, 404, { ok: false, error: '未知路径' })
  } catch (error) {
    console.warn('[project-kanban] request failed', error)
    if (!res.headersSent) writeJson(res, 500, { ok: false, error: error instanceof Error ? error.message : '服务器错误' })
    else res.end()
  }
}
