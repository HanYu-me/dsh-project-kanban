/**
 * Host-side tests for the data/result records: they are stored in the same
 * board file as everything else, survive a restart, and an older file without
 * any records still loads. Files live under a fresh temp directory.
 */
import { existsSync } from 'node:fs'
import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { createServer, type Server } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { recordsOf, type Board, type Op } from '../src/shared/board'
import { OPS_ENDPOINT, BOARD_ENDPOINT, type BoardResponse, type OpsResponse } from '../src/shared/protocol'
import { serveKanban } from '../src/routes'
import { createFileStore, type BoardStore } from '../src/store'

const AT = '2024-05-01T00:00:00.000Z'
const tempDirs: string[] = []
const servers: Server[] = []

afterEach(async () => {
  for (const server of servers.splice(0)) {
    server.closeAllConnections()
    if (server.listening) await new Promise<void>((resolve) => server.close(() => resolve()))
  }
  for (const dir of tempDirs.splice(0)) await rm(dir, { recursive: true, force: true })
})

async function tempBoard(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'dsh-kanban-records-'))
  tempDirs.push(dir)
  return join(dir, 'board.json')
}

const RECORD_OPS: Op[] = [
  { type: 'project.add', id: 'p1', name: 'Alpha', at: AT },
  { type: 'node.add', projectId: 'p1', side: 'data', id: 'd1', name: '第一章', at: AT },
  { type: 'node.add', projectId: 'p1', side: 'data', id: 'd2', name: '原始计数', path: '/data/raw.h5ad', description: '10x', parentId: 'd1', at: AT },
  { type: 'node.add', projectId: 'p1', side: 'result', id: 'r1', name: '图 1', at: AT },
  { type: 'link.add', projectId: 'p1', id: 'l1', dataId: 'd2', resultId: 'r1', at: AT },
]

describe('records in the board file', () => {
  it('are written to board.json and read back by a new store (a restart)', async () => {
    const path = await tempBoard()
    const first = createFileStore(path)
    expect(first.apply(RECORD_OPS).refused).toEqual([])

    const file = JSON.parse(await readFile(path, 'utf8')) as Board
    const stored = recordsOf(file.projects[0]!)
    expect(stored.data.map((node) => node.id)).toEqual(['d1', 'd2'])
    expect(stored.results.map((node) => node.id)).toEqual(['r1'])
    expect(stored.links).toEqual([{ id: 'l1', dataId: 'd2', resultId: 'r1', createdAt: AT }])

    const second = createFileStore(path)
    expect(second.read()).toEqual(first.read())
    expect(recordsOf(second.read().projects[0]!).data[1]).toMatchObject({ path: '/data/raw.h5ad', description: '10x', parentId: 'd1' })
  })

  it('merge, move and delete keep the stored file consistent', async () => {
    const path = await tempBoard()
    const store = createFileStore(path)
    store.apply(RECORD_OPS)
    store.apply([
      { type: 'node.add', projectId: 'p1', side: 'data', id: 'd3', name: '另一份', at: AT },
      { type: 'node.move', projectId: 'p1', nodeId: 'd3', parentId: 'd1', beforeId: 'd2' },
    ])
    expect(recordsOf(createFileStore(path).read().projects[0]!).data.map((node) => `${node.id}<${node.parentId}`)).toEqual(['d1<null', 'd3<d1', 'd2<d1'])
    store.apply([{ type: 'node.delete', projectId: 'p1', nodeId: 'd1' }])
    const after = recordsOf(createFileStore(path).read().projects[0]!)
    expect(after.data).toEqual([])
    // The link went with its data node.
    expect(after.links).toEqual([])
    expect(after.results.map((node) => node.id)).toEqual(['r1'])
  })

  it('an older file without records loads as before and can start recording', async () => {
    const path = await tempBoard()
    await writeFile(path, JSON.stringify({ version: 1, revision: 7, projects: [{ id: 'p1', name: 'Old', color: 'teal', collapsed: false, createdAt: AT, tasks: [] }] }))
    const store = createFileStore(path)
    expect(store.read().projects[0]).not.toHaveProperty('records')
    expect(store.read().revision).toBe(7)
    const result = store.apply([{ type: 'node.add', projectId: 'p1', side: 'data', id: 'd1', name: '第一项', at: AT }])
    expect(result.refused).toEqual([])
    expect(result.board.revision).toBe(8)
    expect(recordsOf(result.board.projects[0]!).data).toHaveLength(1)
  })

  it('a hand-edited file with a broken tree is repaired on load instead of failing the board', async () => {
    const path = await tempBoard()
    const node = (id: string, parentId: string | null, name = id): object => ({ id, name, path: '', description: '', parentId, collapsed: false, createdAt: AT, updatedAt: AT })
    await writeFile(
      path,
      JSON.stringify({
        version: 1,
        revision: 2,
        projects: [
          {
            id: 'p1',
            name: 'Edited',
            color: 'blue',
            collapsed: false,
            createdAt: AT,
            tasks: [{ id: 't1', title: 'keeps working', note: '', column: 'todo', createdAt: AT, updatedAt: AT }],
            records: {
              data: [node('child', 'parent'), node('parent', 'child'), node('orphan', 'nobody'), node('d1', null)],
              results: [node('r1', null)],
              links: [
                { id: 'l1', dataId: 'd1', resultId: 'r1', createdAt: AT },
                { id: 'l2', dataId: 'ghost', resultId: 'r1', createdAt: AT },
              ],
            },
          },
        ],
      }),
    )
    const board = createFileStore(path).read()
    const project = board.projects[0]!
    expect(project.tasks.map((task) => task.title)).toEqual(['keeps working'])
    const records = recordsOf(project)
    expect(records.data.map((item) => item.id).sort()).toEqual(['child', 'd1', 'orphan', 'parent'])
    // Everything ends at the top: no cycle, no missing parent.
    const byId = new Map(records.data.map((item) => [item.id, item]))
    for (const item of records.data) {
      let current = item
      for (let steps = 0; current.parentId !== null; steps++) {
        expect(steps).toBeLessThan(records.data.length)
        current = byId.get(current.parentId)!
        expect(current).toBeTruthy()
      }
    }
    expect(records.links.map((link) => link.id)).toEqual(['l1'])
  })

  it('a change that does not change anything does not rewrite the file or spend a revision', async () => {
    const path = await tempBoard()
    const store = createFileStore(path)
    store.apply(RECORD_OPS)
    const before = await stat(path)
    const revision = store.read().revision
    const result = store.apply([
      { type: 'node.move', projectId: 'p1', nodeId: 'd2', parentId: 'd1', beforeId: null },
      { type: 'node.update', projectId: 'p1', nodeId: 'd1', name: '第一章', collapsed: false },
    ])
    expect(result.refused).toEqual([])
    expect(result.board.revision).toBe(revision)
    expect((await stat(path)).mtimeMs).toBe(before.mtimeMs)
  })
})

describe('record ops over HTTP', () => {
  async function start(store: BoardStore): Promise<string> {
    const server = createServer((req, res) => void serveKanban(store, req, res))
    servers.push(server)
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()))
    const address = server.address()
    if (address === null || typeof address === 'string') throw new Error('no port')
    return `http://127.0.0.1:${address.port}`
  }

  it('applies record ops, reports the refused ones by index, and serves the records back', async () => {
    const path = await tempBoard()
    const base = await start(createFileStore(path))
    const response = await fetch(`${base}${OPS_ENDPOINT}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        ops: [
          ...RECORD_OPS,
          { type: 'node.move', projectId: 'p1', nodeId: 'd1', parentId: 'd2' }, // into its own child
          { type: 'link.add', projectId: 'p1', id: 'l9', dataId: 'd2', resultId: 'r1' }, // already linked
          { type: 'node.add', projectId: 'p1', side: 'data', id: 'd9', name: 'ok' },
        ],
      }),
    })
    const body = (await response.json()) as OpsResponse
    expect(body.ok).toBe(true)
    if (!body.ok) return
    expect(body.refused).toEqual([
      { index: 5, reason: '不能把节点移到它自己的下级' },
      { index: 6, reason: '连线已存在' },
    ])
    const records = recordsOf(body.value.projects[0]!)
    expect(records.data.map((item) => item.id)).toEqual(['d1', 'd2', 'd9'])

    const board = (await (await fetch(`${base}${BOARD_ENDPOINT}`)).json()) as BoardResponse
    expect(board.ok && recordsOf(board.value.projects[0]!).links).toHaveLength(1)
    expect(existsSync(path)).toBe(true)
  })
})
