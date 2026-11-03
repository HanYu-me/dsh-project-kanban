/**
 * Host-half tests: the board stores (memory + file) and the HTTP routes,
 * exercised through a real node:http server and global fetch.
 *
 * Every file used here lives under a fresh os.tmpdir() directory and is
 * removed afterwards, so the user's real board file is never touched.
 */
import { existsSync } from 'node:fs'
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { createServer, type Server } from 'node:http'
import { tmpdir } from 'node:os'
import { basename, join } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Board, Op } from '../src/shared/board'
import { ID_PATTERN, emptyBoard } from '../src/shared/board'
import type { BoardResponse, OpsResponse } from '../src/shared/protocol'
import { BOARD_ENDPOINT, MAX_BODY_BYTES, MAX_OPS_PER_REQUEST, OPS_ENDPOINT } from '../src/shared/protocol'
import { serveKanban } from '../src/routes'
import { createFileStore, createMemoryStore, type BoardStore } from '../src/store'

const PROJECT_ID = 'p_alpha'
const PROJECT: Op = { type: 'project.add', id: PROJECT_ID, name: 'Alpha' }

/** A task.add op for the one project every test sets up. */
function taskAdd(id: string, title = `Task ${id}`): Op {
  return { type: 'task.add', projectId: PROJECT_ID, id, title }
}

/** Temp directories created by a test, removed in afterEach. */
const tempDirs: string[] = []
/** HTTP servers started by a test, closed in afterEach. */
const servers: Server[] = []

/** A fresh temp directory plus the board path inside it. */
async function tempBoard(): Promise<{ dir: string; path: string }> {
  const dir = await mkdtemp(join(tmpdir(), 'dsh-kanban-test-'))
  tempDirs.push(dir)
  return { dir, path: join(dir, 'board.json') }
}

/** Serve `store` on an ephemeral loopback port; returns the base URL. */
async function startServer(store: BoardStore): Promise<string> {
  const server = createServer((req, res) => {
    void serveKanban(store, req, res)
  })
  servers.push(server)
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })
  const address = server.address()
  if (address === null || typeof address === 'string') throw new Error('server did not bind a port')
  return `http://127.0.0.1:${address.port}`
}

/** POST a JSON body to `url` (the caller decides what is JSON-shaped). */
function postJson(url: string, body: string): Promise<Response> {
  return fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body })
}

/** POST an ops batch. */
function postOps(base: string, ops: readonly Op[]): Promise<Response> {
  return postJson(`${base}${OPS_ENDPOINT}`, JSON.stringify({ ops }))
}

/** Parse an OpsResponse and require ok:true, returning its value. */
async function okOps(res: Response): Promise<{ value: Board; refused: { index: number; reason: string }[] }> {
  expect(res.status).toBe(200)
  const body = (await res.json()) as OpsResponse
  expect(body.ok).toBe(true)
  if (!body.ok) throw new Error(`expected ok response, got: ${body.error}`)
  return body
}

/** Parse a BoardResponse and require ok:true, returning its value. */
async function okBoard(res: Response): Promise<Board> {
  expect(res.status).toBe(200)
  const body = (await res.json()) as BoardResponse
  expect(body.ok).toBe(true)
  if (!body.ok) throw new Error(`expected ok response, got: ${body.error}`)
  return body.value
}

afterEach(async () => {
  vi.restoreAllMocks()
  for (const server of servers.splice(0)) {
    server.closeAllConnections()
    if (!server.listening) continue
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
  for (const dir of tempDirs.splice(0)) await rm(dir, { recursive: true, force: true })
})

describe('createMemoryStore', () => {
  it('starts empty and bumps the revision by one per changed apply', () => {
    const store = createMemoryStore()
    expect(store.read()).toEqual({ version: 1, revision: 0, projects: [] })

    const first = store.apply([PROJECT])
    expect(first.refused).toEqual([])
    expect(first.board.revision).toBe(1)
    expect(first.board.projects.map((p) => p.id)).toEqual([PROJECT_ID])
    expect(store.read().revision).toBe(1)

    const second = store.apply([taskAdd('t_one')])
    expect(second.refused).toEqual([])
    expect(second.board.revision).toBe(2)
    expect(second.board.projects[0]?.tasks.map((t) => t.id)).toEqual(['t_one'])
    expect(store.read().revision).toBe(2)
  })

  it('bumps the revision once for a mixed batch and reports refused indexes', () => {
    const store = createMemoryStore()
    store.apply([PROJECT])
    const before = store.read()

    const result = store.apply([
      taskAdd('t_ok'),
      { type: 'task.add', projectId: 'p_missing', id: 't_bad', title: 'Nope' },
      { type: 'project.add', id: 'not a valid id!', name: 'Bad' },
    ])
    expect(result.refused.map((r) => r.index)).toEqual([1, 2])
    expect(result.board.revision).toBe(before.revision + 1)
    expect(result.board.projects[0]?.tasks.map((t) => t.id)).toEqual(['t_ok'])
  })

  it('leaves the board and revision untouched when every op is refused', () => {
    const store = createMemoryStore()
    store.apply([PROJECT])
    const before = store.read()

    const result = store.apply([
      { type: 'task.add', projectId: 'p_missing', id: 't_ghost', title: 'Ghost' },
      { type: 'project.update', projectId: 'p_missing', name: 'Ghost' },
      { type: 'task.delete', projectId: PROJECT_ID, taskId: 't_ghost' },
    ])
    expect(result.refused.map((r) => r.index)).toEqual([0, 1, 2])
    expect(result.board.revision).toBe(before.revision)
    expect(result.board).toBe(before)
    expect(store.read()).toBe(before)
  })

  it('does not bump the revision for an accepted op that changes nothing', () => {
    const store = createMemoryStore()
    store.apply([PROJECT, taskAdd('t_still')])
    const before = store.read()

    const result = store.apply([{ type: 'task.move', projectId: PROJECT_ID, taskId: 't_still', to: 'todo', beforeTaskId: 't_still' }])
    expect(result.refused).toEqual([])
    expect(result.board.revision).toBe(before.revision)
    expect(store.read()).toBe(before)
  })
})

describe('createFileStore', () => {
  it('reads a missing file as an empty board without creating it', async () => {
    const { path } = await tempBoard()
    const store = createFileStore(path)

    expect(store.read()).toEqual(emptyBoard())
    expect(existsSync(path)).toBe(false)
  })

  it('does not write the file for a fully refused batch', async () => {
    const { path } = await tempBoard()
    const store = createFileStore(path)

    const result = store.apply([{ type: 'task.delete', projectId: PROJECT_ID, taskId: 't_missing' }])
    expect(result.refused.map((r) => r.index)).toEqual([0])
    expect(existsSync(path)).toBe(false)
  })

  it('persists an apply and a new store instance reads the same board', async () => {
    const { dir, path } = await tempBoard()
    const store = createFileStore(path)

    const result = store.apply([PROJECT, taskAdd('t_persist')])
    expect(result.refused).toEqual([])
    expect(result.board.revision).toBe(1)
    expect(existsSync(path)).toBe(true)

    const onDisk = JSON.parse(await readFile(path, 'utf8')) as Board
    expect(onDisk).toEqual(result.board)

    const reopened = createFileStore(path)
    expect(reopened.read()).toEqual(result.board)
    expect(reopened.read().projects[0]?.tasks.map((t) => t.id)).toEqual(['t_persist'])

    // No temp file from the temp+rename write may survive.
    const names = await readdir(dir)
    expect(names.filter((name) => name.endsWith('.tmp'))).toEqual([])
    expect(names).toEqual(['board.json'])
  })

  it('moves a corrupt file aside to <path>.broken-* and starts empty', async () => {
    const { dir, path } = await tempBoard()
    await writeFile(path, 'not json', 'utf8')
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const store = createFileStore(path)
    const board = store.read()

    expect(board).toEqual(emptyBoard())
    expect(warn).toHaveBeenCalled()
    // The corrupt file is preserved, never silently overwritten.
    expect(existsSync(path)).toBe(false)
    const names = await readdir(dir)
    const broken = names.filter((name) => name.startsWith(`${basename(path)}.broken-`))
    expect(broken).toHaveLength(1)
    expect(await readFile(join(dir, broken[0]!), 'utf8')).toBe('not json')

    // A later change starts a fresh file and leaves the broken copy alone.
    const result = store.apply([PROJECT])
    expect(result.board.revision).toBe(1)
    expect(existsSync(path)).toBe(true)
    expect((await readdir(dir)).filter((name) => name.startsWith(`${basename(path)}.broken-`))).toHaveLength(1)
  })
})

describe('serveKanban', () => {
  it('GET /project-kanban/board returns 200 {ok:true,value}', async () => {
    const store = createMemoryStore()
    const base = await startServer(store)

    const res = await fetch(`${base}${BOARD_ENDPOINT}`)
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('application/json')
    expect(await okBoard(res)).toEqual(emptyBoard())
  })

  it('POST /project-kanban/ops applies project.add, task.add and task.advance', async () => {
    const store = createMemoryStore()
    const base = await startServer(store)

    const res = await postOps(base, [
      PROJECT,
      taskAdd('t_flow'),
      { type: 'task.advance', projectId: PROJECT_ID, taskId: 't_flow', from: 'todo' },
    ])
    const { value, refused } = await okOps(res)
    expect(refused).toEqual([])
    expect(value.revision).toBe(1)
    const project = value.projects.find((p) => p.id === PROJECT_ID)
    expect(project).toBeDefined()
    expect(project?.tasks.map((t) => t.id)).toEqual(['t_flow'])
    expect(project?.tasks[0]?.column).toBe('doing')

    // The GET endpoint serves what the POST stored.
    const read = await okBoard(await fetch(`${base}${BOARD_ENDPOINT}`))
    expect(read).toEqual(value)
  })

  it('POST /project-kanban/ops rejects invalid JSON with 400', async () => {
    const base = await startServer(createMemoryStore())

    const res = await postJson(`${base}${OPS_ENDPOINT}`, '{not json')
    expect(res.status).toBe(400)
    const body = (await res.json()) as { ok: boolean }
    expect(body.ok).toBe(false)
  })

  it('POST /project-kanban/ops rejects a body without an ops array with 400', async () => {
    const base = await startServer(createMemoryStore())

    for (const body of ['{}', '{"ops":"nope"}', '{"ops":null}', 'null']) {
      const res = await postJson(`${base}${OPS_ENDPOINT}`, body)
      expect(res.status, `body: ${body}`).toBe(400)
      expect(((await res.json()) as { ok: boolean }).ok).toBe(false)
    }
  })

  it('POST /project-kanban/ops rejects more than 200 ops with 413', async () => {
    const base = await startServer(createMemoryStore())
    const tooMany: Op[] = Array.from({ length: MAX_OPS_PER_REQUEST + 1 }, () => ({
      type: 'project.delete' as const,
      projectId: 'p_missing',
    }))

    const res = await postOps(base, tooMany)
    expect(res.status).toBe(413)
    expect(((await res.json()) as { ok: boolean }).ok).toBe(false)
  })

  it('POST /project-kanban/ops rejects a body over 512KB with 413', async () => {
    const base = await startServer(createMemoryStore())
    const body = JSON.stringify({ ops: [], pad: 'x'.repeat(MAX_BODY_BYTES + 1) })
    expect(body.length).toBeGreaterThan(MAX_BODY_BYTES)

    const res = await postJson(`${base}${OPS_ENDPOINT}`, body)
    expect(res.status).toBe(413)
    expect(((await res.json()) as { ok: boolean }).ok).toBe(false)
  })

  it('rejects a wrong method on each endpoint with 405', async () => {
    const base = await startServer(createMemoryStore())

    const postBoard = await fetch(`${base}${BOARD_ENDPOINT}`, { method: 'POST' })
    expect(postBoard.status).toBe(405)
    expect(((await postBoard.json()) as { ok: boolean }).ok).toBe(false)

    const getOps = await fetch(`${base}${OPS_ENDPOINT}`)
    expect(getOps.status).toBe(405)
    expect(((await getOps.json()) as { ok: boolean }).ok).toBe(false)
  })

  it('returns 404 for an unknown path', async () => {
    const base = await startServer(createMemoryStore())

    for (const path of ['/project-kanban/nope', '/', '/project-kanban/ops/extra']) {
      const res = await fetch(`${base}${path}`)
      expect(res.status, `path: ${path}`).toBe(404)
      expect(((await res.json()) as { ok: boolean }).ok).toBe(false)
    }
  })

  it('accepts a trailing slash on /project-kanban/board/', async () => {
    const store = createMemoryStore()
    store.apply([PROJECT])
    const base = await startServer(store)

    const board = await okBoard(await fetch(`${base}${BOARD_ENDPOINT}/`))
    expect(board.revision).toBe(1)
    expect(board.projects.map((p) => p.id)).toEqual([PROJECT_ID])
  })
})

describe('concurrent writes', () => {
  it('keeps all 50 parallel task.add ops on a file store', async () => {
    const { path } = await tempBoard()
    const store = createFileStore(path)
    const seed = store.apply([PROJECT])
    const baseRevision = seed.board.revision
    const base = await startServer(store)

    const ids = Array.from({ length: 50 }, (_, index) => `t_conc_${index}`)
    for (const id of ids) expect(id).toMatch(ID_PATTERN)

    const responses = await Promise.all(ids.map((id) => postOps(base, [taskAdd(id)])))
    for (const res of responses) expect(res.status).toBe(200)
    const bodies = await Promise.all(responses.map((res) => res.json() as Promise<OpsResponse>))
    for (const body of bodies) {
      expect(body.ok).toBe(true)
      if (body.ok) expect(body.refused).toEqual([])
    }

    const board = await okBoard(await fetch(`${base}${BOARD_ENDPOINT}`))
    const project = board.projects.find((p) => p.id === PROJECT_ID)
    expect(project).toBeDefined()
    const tasks = project?.tasks ?? []
    expect(tasks).toHaveLength(50)
    expect(new Set(tasks.map((t) => t.id)).size).toBe(50)
    for (const task of tasks) expect(task.id).toMatch(ID_PATTERN)
    expect(tasks.map((t) => t.id).sort()).toEqual([...ids].sort())
    expect(tasks.every((t) => t.column === 'todo')).toBe(true)
    // One bump per changed apply: no lost updates.
    expect(board.revision).toBe(baseRevision + 50)

    // The same 50 tasks made it to disk, not just the in-memory cache.
    const reopened = createFileStore(path)
    expect(reopened.read().projects.find((p) => p.id === PROJECT_ID)?.tasks).toHaveLength(50)
  })
})
