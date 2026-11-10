// @vitest-environment jsdom
/**
 * The records page's stars and star-only view, undo and redo, relations
 * between results, and colours: behaviour through the real components and the
 * real BoardSync over an in-memory host. jsdom lays nothing out, so what is
 * checked is state and markup, not positions.
 */
import { act, cleanup, createEvent, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { KanbanView } from '../src/client/KanbanView'
import { resetRecordsPageMemory } from '../src/client/RecordsView'
import { BoardSync, type FetchLike } from '../src/client/sync'
import { recordsOf, type Op } from '../src/shared/board'
import { BOARD_ENDPOINT } from '../src/shared/protocol'
import { categoriesOf, relationsOf, type RecordNode } from '../src/shared/records'
import { createMemoryStore, type BoardStore } from '../src/store'

const AT = '2024-03-01T00:00:00.000Z'

beforeEach(resetRecordsPageMemory)

afterEach(() => {
  const back = document.querySelector<HTMLElement>('.kb-back')
  if (back) fireEvent.click(back)
  cleanup()
})

function json(body: unknown): Response {
  return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } })
}

function createHost(): { store: BoardStore; sync: BoardSync } {
  const store = createMemoryStore()
  const fetchImpl: FetchLike = async (input, init) => {
    if (input === BOARD_ENDPOINT) return json({ ok: true, value: store.read() })
    const ops = (JSON.parse(String(init?.body ?? '{}')) as { ops: Op[] }).ops
    const result = store.apply(ops)
    return json({ ok: true, value: result.board, refused: result.refused })
  }
  return { store, sync: new BoardSync({ fetch: fetchImpl, retryDelays: [10, 10] }) }
}

async function settle(): Promise<void> {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })
}

/** data: 第一章 > (原始计数 ★, 过滤后), 参考 · results: 图 1 ★, 图 2, 图 3 · link 原始计数 → 图 1 · palette: 节点类别 c1 原始, 连线类别 e1 推断 */
function seed(store: BoardStore): void {
  store.apply([
    { type: 'project.add', id: 'p1', name: 'Alpha', at: AT },
    { type: 'category.add', projectId: 'p1', kind: 'node', id: 'c1', name: '原始', color: '#4d6bfe' },
    { type: 'category.add', projectId: 'p1', kind: 'edge', id: 'e1', name: '推断', color: '#8b5cf6' },
    { type: 'node.add', projectId: 'p1', side: 'data', id: 'd1', name: '第一章', at: AT },
    { type: 'node.add', projectId: 'p1', side: 'data', id: 'd2', name: '原始计数', path: '/data/raw.h5ad', parentId: 'd1', starred: true, at: AT },
    { type: 'node.add', projectId: 'p1', side: 'data', id: 'd3', name: '过滤后', parentId: 'd1', at: AT },
    { type: 'node.add', projectId: 'p1', side: 'data', id: 'd4', name: '参考', at: AT },
    { type: 'node.add', projectId: 'p1', side: 'result', id: 'r1', name: '图 1', starred: true, at: AT },
    { type: 'node.add', projectId: 'p1', side: 'result', id: 'r2', name: '图 2', at: AT },
    { type: 'node.add', projectId: 'p1', side: 'result', id: 'r3', name: '图 3', at: AT },
    { type: 'link.add', projectId: 'p1', id: 'l1', dataId: 'd2', resultId: 'r1', at: AT },
    { type: 'link.add', projectId: 'p1', id: 'l2', dataId: 'd3', resultId: 'r2', at: AT },
  ])
}

async function renderPage(): Promise<{ store: BoardStore; sync: BoardSync; container: HTMLElement }> {
  const { store, sync } = createHost()
  seed(store)
  const { container } = render(<KanbanView sync={sync} />)
  await waitFor(() => expect(container.querySelector('.kb-project-name')).toBeTruthy())
  fireEvent.click(container.querySelector('.kb-project-name')!)
  await waitFor(() => expect(container.querySelector('.kb-rec')).toBeTruthy())
  return { store, sync, container }
}

const records = (store: BoardStore) => recordsOf(store.read().projects[0]!)
const node = (store: BoardStore, id: string): RecordNode => [...records(store).data, ...records(store).results].find((item) => item.id === id)!
const kids = (store: BoardStore, side: 'data' | 'results', parentId: string | null): string[] => records(store)[side].filter((item) => item.parentId === parentId).map((item) => item.id)
const line = (container: HTMLElement, id: string): HTMLElement => {
  const found = container.querySelector<HTMLElement>(`[data-rec-node="${id}"]`)
  if (!found) throw new Error(`no row ${id}`)
  return found
}
const row = (container: HTMLElement, id: string): HTMLElement => line(container, id).querySelector<HTMLElement>('.kb-node-row')!
const panel = (container: HTMLElement, side: 'data' | 'result'): HTMLElement => container.querySelector<HTMLElement>(`.kb-tree[data-side="${side}"]`)!
const names = (container: HTMLElement, side: 'data' | 'result'): string[] => Array.from(panel(container, side).querySelectorAll('.kb-node-name')).map((item) => item.textContent ?? '')
const header = (name: string): HTMLElement => screen.getByRole('button', { name })
const toastUndo = (container: HTMLElement): HTMLElement => {
  const button = Array.from(container.querySelectorAll<HTMLElement>('.kb-toast button')).find((item) => item.textContent?.includes('撤销'))
  if (!button) throw new Error('no 撤销 button in a toast')
  return button
}
const pressUndo = (shift = false, target: Element = document.body): void => {
  fireEvent.keyDown(target, { key: shift ? 'Z' : 'z', metaKey: true, shiftKey: shift })
}

function dragEvent(type: 'dragStart' | 'dragOver' | 'drop' | 'dragEnd', target: Element, ratio = 0.5): void {
  const event = createEvent[type](target, { dataTransfer: { setData() {}, effectAllowed: '', dropEffect: '' } } as never)
  Object.defineProperty(event, 'clientY', { value: 40 * ratio })
  fireEvent(target, event)
}

describe('stars', () => {
  it('star and unstar from the row, with the count in the header', async () => {
    const { container, store } = await renderPage()
    expect(screen.getByRole('button', { name: /只看星标/ }).textContent).toContain('2')
    expect(within(line(container, 'd2')).getByRole('button', { name: '取消星标「原始计数」' }).getAttribute('aria-pressed')).toBe('true')
    fireEvent.click(within(line(container, 'd3')).getByRole('button', { name: '给「过滤后」加星标' }))
    await settle()
    expect(node(store, 'd3').starred).toBe(true)
    expect(screen.getByRole('button', { name: /只看星标/ }).textContent).toContain('3')
    fireEvent.click(within(line(container, 'd3')).getByRole('button', { name: '取消星标「过滤后」' }))
    await settle()
    expect(node(store, 'd3')).not.toHaveProperty('starred')
  })

  it('a group can be starred with everything below it, and unstarred again', async () => {
    const { container, store } = await renderPage()
    fireEvent.click(within(line(container, 'd1')).getByRole('button', { name: '更多操作' }))
    fireEvent.click(within(line(container, 'd1')).getByRole('menuitem', { name: '整组加星标' }))
    await settle()
    expect(['d1', 'd2', 'd3'].every((id) => node(store, id).starred === true)).toBe(true)
    fireEvent.click(within(line(container, 'd1')).getByRole('button', { name: '更多操作' }))
    fireEvent.click(within(line(container, 'd1')).getByRole('menuitem', { name: '整组取消星标' }))
    await settle()
    expect(['d1', 'd2', 'd3'].some((id) => node(store, id).starred === true)).toBe(false)
  })

  it('a line touching a starred node is drawn in the star colour, others are not', async () => {
    const { container } = await renderPage()
    const starred = container.querySelector<SVGElement>('[data-line="d2>r1"]')!
    const plain = container.querySelector<SVGElement>('[data-line="d3>r2"]')!
    expect(starred.style.getPropertyValue('--kb-line')).toBe('#f0777d')
    expect(starred.getAttribute('class')).toContain('has-color')
    expect(plain.style.getPropertyValue('--kb-line')).toBe('')
  })

  it('the star colour can be changed in the palette and the lines follow', async () => {
    const { container } = await renderPage()
    fireEvent.click(header('颜色'))
    fireEvent.click(screen.getByRole('button', { name: '修改星标' }))
    fireEvent.click(screen.getByRole('button', { name: '星标 #22a06b' }))
    await settle()
    expect(container.querySelector<SVGElement>('[data-line="d2>r1"]')!.style.getPropertyValue('--kb-line')).toBe('#22a06b')
    expect(container.querySelector<HTMLElement>('.kb-rec')!.style.getPropertyValue('--kb-star')).toBe('#22a06b')
  })
})

describe('the star-only view', () => {
  it('shows the starred nodes and the groups they sit in (the groups greyed), and only lines between starred ends', async () => {
    const { container } = await renderPage()
    expect(names(container, 'data')).toEqual(['第一章', '原始计数', '过滤后', '参考'])
    fireEvent.click(screen.getByRole('button', { name: /只看星标/ }))
    expect(names(container, 'data')).toEqual(['第一章', '原始计数'])
    expect(names(container, 'result')).toEqual(['图 1'])
    expect(line(container, 'd1').className).toContain('is-context')
    expect(line(container, 'd2').className).not.toContain('is-context')
    expect(container.querySelectorAll('.kb-link:not(.kb-relation)')).toHaveLength(1)
    expect(screen.getByRole('note').textContent).toContain('不是副本')
    // No fold buttons: the view shows every group open.
    expect(within(line(container, 'd1')).queryByRole('button', { name: /收起|展开/ })).toBeNull()
    fireEvent.click(within(screen.getByRole('note')).getByRole('button', { name: '显示全部' }))
    expect(names(container, 'data')).toEqual(['第一章', '原始计数', '过滤后', '参考'])
    expect(container.querySelectorAll('.kb-link:not(.kb-relation)')).toHaveLength(2)
  })

  it('a node added there is starred so it stays in view; nothing else changes', async () => {
    const { container, store } = await renderPage()
    fireEvent.click(screen.getByRole('button', { name: /只看星标/ }))
    fireEvent.click(within(panel(container, 'data')).getByRole('button', { name: /添加数据/ }))
    expect(screen.getByRole('group', { name: '添加数据' }).textContent).toContain('自动加上星标')
    const input = within(panel(container, 'data')).getByLabelText('简单名字')
    fireEvent.change(input, { target: { value: '新数据' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    await settle()
    const added = records(store).data.find((item) => item.name === '新数据')!
    expect(added.starred).toBe(true)
    expect(names(container, 'data')).toContain('新数据')
    fireEvent.click(screen.getByRole('button', { name: '显示全部' }))
    expect(names(container, 'data')).toEqual(['第一章', '原始计数', '过滤后', '参考', '新数据'])
  })

  it('moving and linking there act on the whole tree: hidden siblings and links are untouched', async () => {
    const { container, store } = await renderPage()
    // Star a second data node and a second result so there is something to link and move.
    fireEvent.click(within(line(container, 'd4')).getByRole('button', { name: '给「参考」加星标' }))
    fireEvent.click(within(line(container, 'r3')).getByRole('button', { name: '给「图 3」加星标' }))
    await settle()
    fireEvent.click(screen.getByRole('button', { name: /只看星标/ }))
    expect(names(container, 'data')).toEqual(['第一章', '原始计数', '参考'])
    // Drag 参考 into 第一章: the hidden sibling 过滤后 stays where it is.
    const from = row(container, 'd4')
    const target = row(container, 'd1')
    target.getBoundingClientRect = () => ({ top: 0, left: 0, bottom: 40, right: 200, width: 200, height: 40, x: 0, y: 0, toJSON: () => ({}) })
    dragEvent('dragStart', from)
    dragEvent('dragOver', target)
    dragEvent('drop', target)
    dragEvent('dragEnd', from)
    await settle()
    expect(kids(store, 'data', 'd1')).toEqual(['d2', 'd3', 'd4'])
    // Link two starred nodes.
    const port = container.querySelector<HTMLElement>('[data-port="d4"]')!
    fireEvent.pointerDown(port, { button: 0, pointerType: 'mouse' })
    fireEvent.pointerUp(line(container, 'r3'), { button: 0, pointerType: 'mouse' })
    await settle()
    expect(records(store).links.map((link) => `${link.dataId}>${link.resultId}`)).toEqual(['d2>r1', 'd3>r2', 'd4>r3'])
    // Out of the view, everything is there.
    fireEvent.click(screen.getByRole('button', { name: '显示全部' }))
    expect(names(container, 'data')).toEqual(['第一章', '原始计数', '过滤后', '参考'])
    expect(container.querySelectorAll('.kb-link:not(.kb-relation)')).toHaveLength(3)
  })

  it('deleting a group there says how many of its nodes the view hides', async () => {
    const { container, store } = await renderPage()
    fireEvent.click(screen.getByRole('button', { name: /只看星标/ }))
    fireEvent.click(within(line(container, 'd1')).getByRole('button', { name: '更多操作' }))
    fireEvent.click(within(line(container, 'd1')).getByRole('menuitem', { name: /删除/ }))
    const dialog = await screen.findByRole('alertdialog')
    expect(dialog.textContent).toContain('2 个子节点')
    expect(dialog.textContent).toContain('1 个现在被「只看星标」隐藏')
    fireEvent.click(within(dialog).getByRole('button', { name: '删除' }))
    await settle()
    expect(records(store).data.map((item) => item.id)).toEqual(['d4'])
  })

  it('shows what to do when nothing is starred, and remembers the view when the page is left', async () => {
    const { container } = await renderPage()
    fireEvent.click(within(line(container, 'd2')).getByRole('button', { name: '取消星标「原始计数」' }))
    fireEvent.click(within(line(container, 'r1')).getByRole('button', { name: '取消星标「图 1」' }))
    await settle()
    fireEvent.click(screen.getByRole('button', { name: /只看星标/ }))
    expect(panel(container, 'data').textContent).toContain('还没有加星标的节点')
    fireEvent.click(container.querySelector('.kb-back')!)
    await waitFor(() => expect(container.querySelector('.kb-rec')).toBeNull())
    fireEvent.click(container.querySelector('.kb-project-name')!)
    await waitFor(() => expect(container.querySelector('.kb-rec')).toBeTruthy())
    expect(screen.getByRole('button', { name: /只看星标/ }).getAttribute('aria-pressed')).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: /只看星标/ }))
  })
})

describe('undo and redo', () => {
  it('the header buttons start disabled, then undo and redo what was done', async () => {
    const { container, store } = await renderPage()
    expect((header('撤销') as HTMLButtonElement).disabled).toBe(true)
    expect((header('重做') as HTMLButtonElement).disabled).toBe(true)
    fireEvent.click(within(line(container, 'd3')).getByRole('button', { name: '给「过滤后」加星标' }))
    await settle()
    expect((header('撤销') as HTMLButtonElement).disabled).toBe(false)
    expect(header('撤销').getAttribute('title')).toContain('加星标「过滤后」')
    fireEvent.click(header('撤销'))
    await settle()
    expect(node(store, 'd3')).not.toHaveProperty('starred')
    expect((header('重做') as HTMLButtonElement).disabled).toBe(false)
    expect(header('重做').getAttribute('title')).toContain('加星标「过滤后」')
    fireEvent.click(header('重做'))
    await settle()
    expect(node(store, 'd3').starred).toBe(true)
  })

  it('⌘Z undoes and ⇧⌘Z redoes, one step at a time, in the order they were done', async () => {
    const { container, store } = await renderPage()
    fireEvent.click(within(line(container, 'd3')).getByRole('button', { name: '给「过滤后」加星标' }))
    await settle()
    fireEvent.click(within(line(container, 'd4')).getByRole('button', { name: '给「参考」加星标' }))
    await settle()
    pressUndo()
    await settle()
    expect(node(store, 'd4')).not.toHaveProperty('starred')
    expect(node(store, 'd3').starred).toBe(true)
    pressUndo()
    await settle()
    expect(node(store, 'd3')).not.toHaveProperty('starred')
    pressUndo(true)
    await settle()
    expect(node(store, 'd3').starred).toBe(true)
    expect(node(store, 'd4')).not.toHaveProperty('starred')
    pressUndo(true)
    await settle()
    expect(node(store, 'd4').starred).toBe(true)
    // Ctrl+Y is redo too, for the systems where that is the habit.
    pressUndo()
    await settle()
    fireEvent.keyDown(document.body, { key: 'y', ctrlKey: true })
    await settle()
    expect(node(store, 'd4').starred).toBe(true)
  })

  it('doing something new drops the steps that were undone', async () => {
    const { container, store } = await renderPage()
    fireEvent.click(within(line(container, 'd3')).getByRole('button', { name: '给「过滤后」加星标' }))
    await settle()
    pressUndo()
    await settle()
    expect((header('重做') as HTMLButtonElement).disabled).toBe(false)
    fireEvent.click(within(line(container, 'd4')).getByRole('button', { name: '给「参考」加星标' }))
    await settle()
    expect((header('重做') as HTMLButtonElement).disabled).toBe(true)
    pressUndo(true)
    await settle()
    expect(node(store, 'd3')).not.toHaveProperty('starred')
  })

  it('leaves ⌘Z alone while text is being typed, so the text keeps its own undo', async () => {
    const { container, store } = await renderPage()
    fireEvent.click(within(line(container, 'd3')).getByRole('button', { name: '给「过滤后」加星标' }))
    await settle()
    fireEvent.click(within(panel(container, 'data')).getByRole('button', { name: /添加数据/ }))
    const input = within(panel(container, 'data')).getByLabelText('简单名字')
    const event = createEvent.keyDown(input, { key: 'z', metaKey: true, bubbles: true, cancelable: true })
    fireEvent(input, event)
    await settle()
    expect(event.defaultPrevented).toBe(false)
    expect(node(store, 'd3').starred).toBe(true)
  })

  it('undoes a delete with its links, a merge into a group, and a drag, each as one step', async () => {
    const { container, store } = await renderPage()
    const before = JSON.stringify(records(store))
    // delete a node that has a link
    fireEvent.click(within(line(container, 'd2')).getByRole('button', { name: '更多操作' }))
    fireEvent.click(within(line(container, 'd2')).getByRole('menuitem', { name: /^删除/ }))
    await settle()
    expect(records(store).links.map((link) => link.id)).toEqual(['l2'])
    pressUndo()
    await settle()
    // restored links come back at the end of the list; compare ignoring that
    const sorted = (s: BoardStore): string => JSON.stringify({ ...records(s), links: [...records(s).links].sort((a, b) => a.id.localeCompare(b.id)) })
    expect(sorted(store)).toBe(JSON.stringify({ ...JSON.parse(before), links: [...JSON.parse(before).links].sort((a: { id: string }, b: { id: string }) => a.id.localeCompare(b.id)) }))
    // merge two into a group
    fireEvent.click(within(line(container, 'd3')).getByRole('checkbox', { name: '选择「过滤后」' }))
    fireEvent.click(within(line(container, 'd4')).getByRole('checkbox', { name: '选择「参考」' }))
    fireEvent.click(screen.getByRole('button', { name: /合并为分组/ }))
    await settle()
    expect(records(store).data.some((item) => item.name === '新分组')).toBe(true)
    pressUndo()
    await settle()
    expect(records(store).data.some((item) => item.name === '新分组')).toBe(false)
    expect(kids(store, 'data', 'd1')).toEqual(['d2', 'd3'])
    expect(kids(store, 'data', null)).toEqual(['d1', 'd4'])
  })

  it('folding is not a step of the history', async () => {
    const { container, store } = await renderPage()
    fireEvent.click(within(line(container, 'd1')).getByRole('button', { name: '收起「第一章」' }))
    await settle()
    expect(node(store, 'd1').collapsed).toBe(true)
    expect((header('撤销') as HTMLButtonElement).disabled).toBe(true)
  })

  it('the 撤销 in a toast takes back its own step; later steps need ⌘Z', async () => {
    const { container, store } = await renderPage()
    fireEvent.click(within(line(container, 'd4')).getByRole('button', { name: '更多操作' }))
    fireEvent.click(within(line(container, 'd4')).getByRole('menuitem', { name: /^删除/ }))
    await settle()
    expect(records(store).data.map((item) => item.id)).not.toContain('d4')
    // something else happens before the toast is used
    fireEvent.click(within(line(container, 'd3')).getByRole('button', { name: '给「过滤后」加星标' }))
    await settle()
    fireEvent.click(toastUndo(container))
    await settle()
    expect(screen.getByText(/请用 ⌘Z 依次撤销/)).toBeTruthy()
    expect(records(store).data.map((item) => item.id)).not.toContain('d4')
    pressUndo()
    pressUndo()
    await settle()
    expect(records(store).data.map((item) => item.id)).toContain('d4')
  })

  it('keeps its history when the page is left and opened again', async () => {
    const { container } = await renderPage()
    fireEvent.click(within(line(container, 'd3')).getByRole('button', { name: '给「过滤后」加星标' }))
    await settle()
    fireEvent.click(container.querySelector('.kb-back')!)
    await waitFor(() => expect(container.querySelector('.kb-rec')).toBeNull())
    fireEvent.click(container.querySelector('.kb-project-name')!)
    await waitFor(() => expect(container.querySelector('.kb-rec')).toBeTruthy())
    expect((header('撤销') as HTMLButtonElement).disabled).toBe(false)
  })
})

describe('relations between results', () => {
  const rightPort = (container: HTMLElement, id: string): HTMLElement => container.querySelector<HTMLElement>(`[data-port="${id}:r"]`)!

  it('only results have a right-hand port, and the data side has none', async () => {
    const { container } = await renderPage()
    expect(container.querySelectorAll('.kb-port-right')).toHaveLength(3)
    expect(panel(container, 'data').querySelector('.kb-port-right')).toBeNull()
  })

  it('the relation node is its own node: a column titled 关系 on the far right, apart from the round data node on the left', async () => {
    const { container } = await renderPage()
    expect(container.querySelector('.kb-gutter-right .kb-rel-head')?.textContent).toBe('关系')
    for (const id of ['r1', 'r2', 'r3']) {
      const relation = rightPort(container, id)
      const data = container.querySelector<HTMLElement>(`[data-port="${id}"]`)!
      expect(relation).not.toBe(data)
      expect(relation.className).toContain('kb-port-right')
      expect(data.className).not.toContain('kb-port-right')
      // the relation node is the last thing in the row, the data node the first
      const parts = Array.from(row(container, id).parentElement!.querySelectorAll('[data-port]')).map((item) => item.getAttribute('data-port'))
      expect(parts).toEqual([id, `${id}:r`])
      expect(relation.getAttribute('title')).toContain('关系点')
    }
  })

  it('while a relation is drawn, the start is marked and only the nodes of results that can take it light up', async () => {
    const { container, store } = await renderPage()
    // 图 1 and 图 2 are related already
    fireEvent.pointerDown(rightPort(container, 'r1'), { button: 0, pointerType: 'mouse' })
    fireEvent.pointerUp(row(container, 'r2'), { button: 0, pointerType: 'mouse' })
    await settle()
    expect(relationsOf(records(store))).toHaveLength(1)
    // now start again from 图 1
    fireEvent.pointerDown(rightPort(container, 'r1'), { button: 0, pointerType: 'mouse' })
    expect(container.querySelector('.kb-diagram.is-relating')).toBeTruthy()
    expect(container.querySelector('.kb-diagram.is-linking')).toBeNull()
    expect(rightPort(container, 'r1').className).toContain('is-source')
    // 图 2 is already related to it, so it is not offered; 图 3 is
    expect(rightPort(container, 'r2').className).not.toContain('is-ready')
    expect(rightPort(container, 'r3').className).toContain('is-ready')
    expect(row(container, 'r2').className).not.toContain('can-link')
    expect(row(container, 'r3').className).toContain('can-link')
    expect(row(container, 'd4').className).not.toContain('can-link')
    fireEvent.pointerMove(row(container, 'r3'), { clientX: 10, clientY: 10 })
    await waitFor(() => expect(rightPort(container, 'r3').className).toContain('is-target'))
    expect(row(container, 'r3').className).toContain('is-link-target')
    // over 图 2 nothing is targeted
    fireEvent.pointerMove(row(container, 'r2'), { clientX: 10, clientY: 10 })
    await waitFor(() => expect(container.querySelector('.is-target')).toBeNull())
    fireEvent.pointerUp(row(container, 'r2'), { button: 0, pointerType: 'mouse' })
    await settle()
    expect(relationsOf(records(store))).toHaveLength(1)
    // all the marks are gone with the drag
    expect(container.querySelector('.kb-diagram.is-relating')).toBeNull()
    expect(container.querySelector('.is-ready, .is-source, .is-target')).toBeNull()
  })

  it('a data line being drawn does not offer the relation nodes, and none of the relation marks appear', async () => {
    const { container } = await renderPage()
    fireEvent.pointerDown(container.querySelector<HTMLElement>('[data-port="d4"]')!, { button: 0, pointerType: 'mouse' })
    expect(container.querySelector('.kb-diagram.is-linking')).toBeTruthy()
    expect(container.querySelector('.kb-diagram.is-relating')).toBeNull()
    expect(container.querySelector('.is-ready, .is-source, .is-target')).toBeNull()
    fireEvent.pointerUp(document.body)
    await settle()
    expect(container.querySelector('.kb-diagram.is-linking')).toBeNull()
  })

  it('the add buttons keep their names when the narrow layout shows only the +', async () => {
    const { container } = await renderPage()
    for (const [side, name] of [['data', '添加数据'], ['result', '添加结果']] as const) {
      const button = within(panel(container, side)).getByRole('button', { name })
      expect(button.getAttribute('aria-label')).toBe(name)
      expect(button.querySelector('.kb-add-text')?.textContent).toBe(name)
    }
  })

  it('dragging from a right-hand port to another result makes an undirected relation', async () => {
    const { container, store } = await renderPage()
    fireEvent.pointerDown(rightPort(container, 'r1'), { button: 0, pointerType: 'mouse' })
    expect(container.querySelector('.kb-diagram.is-connecting')).toBeTruthy()
    fireEvent.pointerMove(row(container, 'r2'), { clientX: 10, clientY: 10 })
    await waitFor(() => expect(container.querySelector('.is-link-target')).toBeTruthy())
    fireEvent.pointerUp(row(container, 'r2'), { button: 0, pointerType: 'mouse' })
    await settle()
    expect(relationsOf(records(store))).toHaveLength(1)
    expect(relationsOf(records(store))[0]).toMatchObject({ fromId: 'r1', toId: 'r2' })
    expect(relationsOf(records(store))[0]).not.toHaveProperty('directed')
    expect(container.querySelectorAll('.kb-relation')).toHaveLength(1)
    expect(container.querySelector('.kb-relation')!.getAttribute('class')).not.toContain('is-directed')
    expect(rightPort(container, 'r1').className).toContain('has-links')
  })

  it('releasing with Alt/Option held makes it directed, and it draws an arrow', async () => {
    const { container, store } = await renderPage()
    fireEvent.pointerDown(rightPort(container, 'r1'), { button: 0, pointerType: 'mouse' })
    fireEvent.pointerUp(row(container, 'r3'), { button: 0, pointerType: 'mouse', altKey: true })
    await settle()
    expect(relationsOf(records(store))[0]).toMatchObject({ fromId: 'r1', toId: 'r3', directed: true })
    expect(container.querySelector('.kb-relation.is-directed')).toBeTruthy()
    expect(container.querySelectorAll('.kb-link-arrow')).toHaveLength(1)
  })

  it('ignores a relation dropped on data, on itself, or on a result that is already related', async () => {
    const { container, store } = await renderPage()
    fireEvent.pointerDown(rightPort(container, 'r1'), { button: 0, pointerType: 'mouse' })
    fireEvent.pointerUp(row(container, 'd4'), { button: 0, pointerType: 'mouse' })
    fireEvent.pointerDown(rightPort(container, 'r1'), { button: 0, pointerType: 'mouse' })
    fireEvent.pointerUp(row(container, 'r1'), { button: 0, pointerType: 'mouse' })
    fireEvent.pointerDown(rightPort(container, 'r1'), { button: 0, pointerType: 'mouse' })
    fireEvent.pointerUp(row(container, 'r2'), { button: 0, pointerType: 'mouse' })
    fireEvent.pointerDown(rightPort(container, 'r2'), { button: 0, pointerType: 'mouse' })
    fireEvent.pointerUp(row(container, 'r1'), { button: 0, pointerType: 'mouse' })
    await settle()
    expect(relationsOf(records(store))).toHaveLength(1)
  })

  it('the left-hand port of a result still makes data links, not relations', async () => {
    const { container, store } = await renderPage()
    fireEvent.pointerDown(container.querySelector<HTMLElement>('[data-port="r3"]')!, { button: 0, pointerType: 'mouse' })
    fireEvent.pointerUp(row(container, 'd4'), { button: 0, pointerType: 'mouse' })
    await settle()
    expect(records(store).links.some((link) => link.dataId === 'd4' && link.resultId === 'r3')).toBe(true)
    expect(relationsOf(records(store))).toHaveLength(0)
  })

  it('the result card lists the related results and cycles the direction: none → points away → points here → none', async () => {
    const { container, store } = await renderPage()
    fireEvent.click(within(line(container, 'r1')).getByRole('button', { name: '图 1' }))
    const card = await screen.findByRole('region', { name: '图 1 的详情' })
    expect(card.textContent).toContain('还没有和别的结果连线')
    fireEvent.change(within(card).getByLabelText('连到其他结果'), { target: { value: 'r2' } })
    await settle()
    expect(relationsOf(records(store))[0]).toMatchObject({ fromId: 'r1', toId: 'r2' })
    const glyph = (): HTMLElement => within(card).getByRole('button', { name: /^图 2：/ })
    expect(glyph().textContent).toBe('—')
    fireEvent.click(glyph())
    await settle()
    expect(relationsOf(records(store))[0]).toMatchObject({ fromId: 'r1', toId: 'r2', directed: true })
    expect(glyph().textContent).toBe('→')
    fireEvent.click(glyph())
    await settle()
    expect(relationsOf(records(store))[0]).toMatchObject({ fromId: 'r2', toId: 'r1', directed: true })
    expect(glyph().textContent).toBe('←')
    fireEvent.click(glyph())
    await settle()
    expect(relationsOf(records(store))[0]).not.toHaveProperty('directed')
    fireEvent.click(within(card).getByRole('button', { name: '取消与「图 2」的连线' }))
    await settle()
    expect(relationsOf(records(store))).toHaveLength(0)
  })

  it('the line toolbar sets the direction, reverses it, picks a category and deletes the relation', async () => {
    const { container, store } = await renderPage()
    fireEvent.pointerDown(rightPort(container, 'r2'), { button: 0, pointerType: 'mouse' })
    fireEvent.pointerUp(row(container, 'r3'), { button: 0, pointerType: 'mouse' })
    await settle()
    const hit = (): Element => container.querySelector('.kb-relation .kb-link-hit')!
    fireEvent.pointerOver(hit())
    const bar = await screen.findByRole('toolbar', { name: '结果之间的连线' })
    fireEvent.click(within(bar).getByRole('button', { name: '改为有向' }))
    await settle()
    expect(relationsOf(records(store))[0]!.directed).toBe(true)
    fireEvent.pointerOver(hit())
    fireEvent.click(within(await screen.findByRole('toolbar', { name: '结果之间的连线' })).getByRole('button', { name: '反向' }))
    await settle()
    expect(relationsOf(records(store))[0]).toMatchObject({ fromId: 'r3', toId: 'r2' })
    fireEvent.pointerOver(hit())
    fireEvent.click(within(await screen.findByRole('toolbar', { name: '结果之间的连线' })).getByRole('button', { name: '类别：推断' }))
    await settle()
    expect(relationsOf(records(store))[0]!.category).toBe('e1')
    expect(container.querySelector<SVGElement>('.kb-relation')!.style.getPropertyValue('--kb-line')).toBe('#8b5cf6')
    fireEvent.pointerOver(hit())
    fireEvent.click(within(await screen.findByRole('toolbar', { name: '结果之间的连线' })).getByRole('button', { name: '删除连线' }))
    await settle()
    expect(relationsOf(records(store))).toHaveLength(0)
    // The whole thing can be taken back, step by step: delete, category, reverse, direction ...
    for (let i = 0; i < 4; i++) pressUndo()
    await settle()
    expect(relationsOf(records(store))).toHaveLength(1)
    expect(relationsOf(records(store))[0]).toMatchObject({ fromId: 'r2', toId: 'r3' })
    expect(relationsOf(records(store))[0]).not.toHaveProperty('directed')
    expect(relationsOf(records(store))[0]).not.toHaveProperty('category')
    // ... and finally the relation itself.
    pressUndo()
    await settle()
    expect(relationsOf(records(store))).toHaveLength(0)
    expect(container.querySelectorAll('.kb-relation')).toHaveLength(0)
  })

  it('a relation to something inside a folded group is drawn to the group; one inside the group is not drawn', async () => {
    const { container, store } = await renderPage()
    store.apply([
      { type: 'node.add', projectId: 'p1', side: 'result', id: 'r4', name: '图 4', parentId: 'r3', at: AT },
      { type: 'node.add', projectId: 'p1', side: 'result', id: 'r5', name: '图 5', parentId: 'r3', at: AT },
      { type: 'relation.add', projectId: 'p1', id: 'x1', fromId: 'r1', toId: 'r4', at: AT },
      { type: 'relation.add', projectId: 'p1', id: 'x2', fromId: 'r4', toId: 'r5', at: AT },
    ])
    fireEvent.focus(window)
    await act(async () => {
      document.dispatchEvent(new Event('visibilitychange'))
      await new Promise((resolve) => setTimeout(resolve, 0))
    })
    await waitFor(() => expect(container.querySelectorAll('.kb-relation')).toHaveLength(2))
    fireEvent.click(within(line(container, 'r3')).getByRole('button', { name: '收起「图 3」' }))
    await settle()
    // x1 now ends at the group (dashed), x2 is inside it and gone from the picture.
    expect(container.querySelectorAll('.kb-relation')).toHaveLength(1)
    expect(container.querySelector('.kb-relation')!.getAttribute('class')).toContain('is-folded')
    expect(line(container, 'r3').querySelector('.kb-node-links.is-relation')!.textContent).toBe('1')
  })

  it('deleting a result takes its relations with it, and undo brings them back', async () => {
    const { container, store } = await renderPage()
    fireEvent.pointerDown(rightPort(container, 'r2'), { button: 0, pointerType: 'mouse' })
    fireEvent.pointerUp(row(container, 'r3'), { button: 0, pointerType: 'mouse' })
    await settle()
    fireEvent.click(within(line(container, 'r3')).getByRole('button', { name: '更多操作' }))
    fireEvent.click(within(line(container, 'r3')).getByRole('menuitem', { name: /^删除/ }))
    await settle()
    expect(relationsOf(records(store))).toHaveLength(0)
    pressUndo()
    await settle()
    expect(relationsOf(records(store))).toHaveLength(1)
  })
})

describe('colours', () => {
  const openPalette = (): void => fireEvent.click(header('颜色'))

  it('adds a node category with a chosen colour, and a node takes it from its card', async () => {
    const { container, store } = await renderPage()
    openPalette()
    const section = screen.getByRole('region', { name: '节点类别' })
    fireEvent.change(within(section).getByLabelText('节点类别：新类别名称'), { target: { value: '最终结果' } })
    fireEvent.click(within(section).getByRole('radio', { name: '新类别的颜色 #e09400' }))
    fireEvent.click(within(section).getByRole('button', { name: /添加/ }))
    await settle()
    const added = categoriesOf(records(store), 'node').find((category) => category.name === '最终结果')!
    expect(added.color).toBe('#e09400')
    fireEvent.click(within(line(container, 'r2')).getByRole('button', { name: '图 2' }))
    const card = await screen.findByRole('region', { name: '图 2 的详情' })
    fireEvent.click(within(card).getByRole('radio', { name: '最终结果' }))
    await settle()
    expect(node(store, 'r2').category).toBe(added.id)
    expect(line(container, 'r2').style.getPropertyValue('--kb-node-color')).toBe('#e09400')
    fireEvent.click(within(card).getByRole('radio', { name: '默认' }))
    await settle()
    expect(line(container, 'r2').style.getPropertyValue('--kb-node-color')).toBe('')
  })

  it('the default node colour applies to nodes without a category; a category wins', async () => {
    const { container, store } = await renderPage()
    store.apply([{ type: 'node.update', projectId: 'p1', nodeId: 'd4', category: 'c1' }])
    openPalette()
    fireEvent.click(screen.getByRole('button', { name: '修改节点' }))
    fireEvent.click(screen.getByRole('button', { name: '节点 #8b5cf6' }))
    await settle()
    expect(line(container, 'd3').style.getPropertyValue('--kb-node-color')).toBe('#8b5cf6')
    expect(line(container, 'r1').style.getPropertyValue('--kb-node-color')).toBe('#8b5cf6')
    fireEvent.focus(window)
    await act(async () => {
      document.dispatchEvent(new Event('visibilitychange'))
      await new Promise((resolve) => setTimeout(resolve, 0))
    })
    await waitFor(() => expect(line(container, 'd4').style.getPropertyValue('--kb-node-color')).toBe('#4d6bfe'))
    // 恢复默认 clears it again.
    fireEvent.click(within(screen.getByRole('group', { name: '颜色与类别' })).getAllByRole('button', { name: '恢复默认' })[0]!)
    await settle()
    expect(line(container, 'd3').style.getPropertyValue('--kb-node-color')).toBe('')
  })

  it('a custom colour can be typed as #RRGGBB, and a bad one is ignored', async () => {
    const { container, store } = await renderPage()
    openPalette()
    fireEvent.click(screen.getByRole('button', { name: '修改连线' }))
    const field = screen.getByLabelText('连线（#RRGGBB）')
    fireEvent.change(field, { target: { value: 'blue' } })
    fireEvent.blur(field)
    await settle()
    expect(records(store).palette?.defaults?.edge).toBeUndefined()
    fireEvent.change(field, { target: { value: '#112233' } })
    fireEvent.keyDown(field, { key: 'Enter' })
    await settle()
    expect(records(store).palette?.defaults?.edge).toBe('#112233')
    expect(container.querySelector<SVGElement>('[data-line="d3>r2"]')!.style.getPropertyValue('--kb-line')).toBe('#112233')
    // a line with a starred end still uses the star colour, not the default
    expect(container.querySelector<SVGElement>('[data-line="d2>r1"]')!.style.getPropertyValue('--kb-line')).toBe('#f0777d')
  })

  it('renames and recolours a category; deleting it sends its users back to the default look, and undo restores both', async () => {
    const { container, store } = await renderPage()
    store.apply([{ type: 'node.update', projectId: 'p1', nodeId: 'd4', category: 'c1' }])
    openPalette()
    const name = screen.getByLabelText('类别名称：原始')
    fireEvent.change(name, { target: { value: '原始数据' } })
    fireEvent.blur(name)
    await settle()
    expect(categoriesOf(records(store), 'node')[0]!.name).toBe('原始数据')
    fireEvent.click(screen.getByRole('button', { name: '修改「原始数据」的颜色' }))
    fireEvent.click(screen.getByRole('button', { name: '「原始数据」的颜色 #e5484d' }))
    await settle()
    expect(categoriesOf(records(store), 'node')[0]!.color).toBe('#e5484d')
    fireEvent.click(screen.getByRole('button', { name: '删除类别「原始数据」' }))
    await settle()
    expect(categoriesOf(records(store), 'node')).toHaveLength(0)
    expect(node(store, 'd4')).not.toHaveProperty('category')
    pressUndo()
    await settle()
    expect(categoriesOf(records(store), 'node')[0]).toMatchObject({ id: 'c1', name: '原始数据', color: '#e5484d' })
    expect(node(store, 'd4').category).toBe('c1')
    expect(container.querySelector('.kb-palette')).toBeTruthy()
  })

  it('the selection bar stars and categorises everything selected, as one step', async () => {
    const { container, store } = await renderPage()
    fireEvent.click(within(line(container, 'd3')).getByRole('checkbox', { name: '选择「过滤后」' }))
    fireEvent.click(within(line(container, 'd4')).getByRole('checkbox', { name: '选择「参考」' }))
    const bar = screen.getByRole('toolbar', { name: '批量操作' })
    fireEvent.click(within(bar).getByRole('button', { name: /加星标/ }))
    await settle()
    expect(node(store, 'd3').starred).toBe(true)
    expect(node(store, 'd4').starred).toBe(true)
    fireEvent.change(within(screen.getByRole('toolbar', { name: '批量操作' })).getByLabelText('给所选设置类别'), { target: { value: 'c1' } })
    await settle()
    expect(node(store, 'd3').category).toBe('c1')
    expect(node(store, 'd4').category).toBe('c1')
    pressUndo()
    await settle()
    expect(node(store, 'd3')).not.toHaveProperty('category')
    pressUndo()
    await settle()
    expect(node(store, 'd3')).not.toHaveProperty('starred')
    expect(node(store, 'd4')).not.toHaveProperty('starred')
  })

  it('the palette closes when clicking outside it, and when the card asks for it, opens', async () => {
    const { container } = await renderPage()
    openPalette()
    expect(container.querySelector('.kb-palette')).toBeTruthy()
    fireEvent.pointerDown(document.body)
    expect(container.querySelector('.kb-palette')).toBeNull()
    fireEvent.click(within(line(container, 'd3')).getByRole('button', { name: '过滤后' }))
    fireEvent.click(within(await screen.findByRole('region', { name: '过滤后 的详情' })).getByRole('button', { name: /类别/ }))
    expect(container.querySelector('.kb-palette')).toBeTruthy()
  })
})

describe('deleting a clicked line from the keyboard', () => {
  const linkHit = (container: HTMLElement, key: string): Element => container.querySelector(`[data-line="${key}"]:not([data-relation]) .kb-link-hit`)!
  const relationHit = (container: HTMLElement): Element => container.querySelector('[data-relation] .kb-link-hit')!
  const press = (key: string, init: KeyboardEventInit = {}, target: Element = document.body): boolean => fireEvent.keyDown(target, { key, ...init })
  const relate = async (container: HTMLElement): Promise<void> => {
    fireEvent.pointerDown(container.querySelector<HTMLElement>('[data-port="r1:r"]')!, { button: 0, pointerType: 'mouse' })
    fireEvent.pointerUp(row(container, 'r2'), { button: 0, pointerType: 'mouse' })
    await settle()
  }

  it('Delete removes a data line that was clicked, and ⌘Z brings it back', async () => {
    const { container, store } = await renderPage()
    expect(records(store).links.map((link) => link.id).sort()).toEqual(['l1', 'l2'])
    fireEvent.click(linkHit(container, 'd2>r1'))
    expect(container.querySelector('.kb-line-tools')).toBeTruthy()
    expect(press('Delete')).toBe(false) // handled: the default was prevented
    await settle()
    expect(records(store).links.map((link) => link.id)).toEqual(['l2'])
    expect(container.querySelector('.kb-line-tools')).toBeNull()
    expect(container.querySelector('.kb-toasts')!.textContent).toContain('已取消关联')
    pressUndo()
    await settle()
    expect(records(store).links.map((link) => link.id).sort()).toEqual(['l1', 'l2'])
  })

  it('Backspace does the same (the delete key of a Mac)', async () => {
    const { container, store } = await renderPage()
    fireEvent.click(linkHit(container, 'd3>r2'))
    press('Backspace')
    await settle()
    expect(records(store).links.map((link) => link.id)).toEqual(['l1'])
  })

  it('removes a line between two results the same way', async () => {
    const { container, store } = await renderPage()
    await relate(container)
    expect(relationsOf(records(store))).toHaveLength(1)
    fireEvent.click(relationHit(container))
    press('Delete')
    await settle()
    expect(relationsOf(records(store))).toHaveLength(0)
    expect(container.querySelector('.kb-relation')).toBeNull()
    pressUndo()
    await settle()
    expect(relationsOf(records(store))).toHaveLength(1)
  })

  it('does nothing when no line was clicked, or the click was on the line a moment ago and then elsewhere', async () => {
    const { container, store } = await renderPage()
    expect(press('Delete')).toBe(true) // not handled
    fireEvent.click(linkHit(container, 'd2>r1'))
    fireEvent.pointerDown(container.querySelector('.kb-diagram')!) // a click on the empty page lets go of it
    press('Delete')
    await settle()
    expect(records(store).links).toHaveLength(2)
  })

  it('leaves the key to a text field, and to ⌘/Ctrl/Alt/Shift combinations', async () => {
    const { container, store } = await renderPage()
    fireEvent.click(linkHit(container, 'd2>r1'))
    const field = document.createElement('input')
    document.body.appendChild(field)
    press('Backspace', {}, field)
    press('Delete', { metaKey: true })
    press('Delete', { ctrlKey: true })
    press('Delete', { altKey: true })
    press('Delete', { shiftKey: true })
    await settle()
    expect(records(store).links).toHaveLength(2)
    field.remove()
    press('Delete')
    await settle()
    expect(records(store).links).toHaveLength(1)
  })

  it('does not guess for a line into a folded group: it says what to do instead', async () => {
    const { container, store } = await renderPage()
    fireEvent.click(within(line(container, 'd1')).getByRole('button', { name: '收起「第一章」' }))
    await settle()
    const hit = container.querySelector('[data-line="d1>r1"] .kb-link-hit')!
    expect(hit).toBeTruthy()
    fireEvent.click(hit)
    press('Delete')
    await settle()
    expect(records(store).links).toHaveLength(2)
    expect(container.querySelector('.kb-toasts')!.textContent).toContain('展开分组')
  })

  it('the button on the line says the key works too', async () => {
    const { container } = await renderPage()
    fireEvent.click(linkHit(container, 'd2>r1'))
    expect(within(container.querySelector<HTMLElement>('.kb-line-tools')!).getByRole('button', { name: '删除连线' }).getAttribute('title')).toContain('Delete')
  })
})

describe('not mistaken for something of dsh or of other plugins', () => {
  // dsh-oh-my-claude watches the whole page: a [role=dialog] beside a button[aria-haspopup=dialog] with a ring
  // (two adjacent circles) is taken for dsh's context-meter popover and gets the Claude usage poured into it;
  // a [role=status][aria-live=polite] element is taken for the chat's turn-status row.
  const lookalikes = (root: ParentNode): string[] =>
    [
      ...Array.from(root.querySelectorAll('[role="dialog"]')).map(() => 'role=dialog'),
      ...Array.from(root.querySelectorAll('[aria-haspopup="dialog"]')).map(() => 'aria-haspopup=dialog'),
      ...Array.from(root.querySelectorAll('[role="status"][aria-live="polite"]')).map(() => 'role=status+aria-live=polite'),
    ]

  it('the page, its menus, the colour panel and the line toolbar carry none of those marks', async () => {
    const { container } = await renderPage()
    expect(lookalikes(container)).toEqual([])
    fireEvent.click(header('颜色'))
    expect(container.querySelector('.kb-palette')).toBeTruthy()
    expect(lookalikes(container)).toEqual([])
    fireEvent.pointerDown(document.body)
    fireEvent.click(within(line(container, 'd3')).getByRole('button', { name: '更多操作' }))
    expect(lookalikes(container)).toEqual([])
    fireEvent.click(screen.getByRole('button', { name: /只看星标/ }))
    expect(lookalikes(container)).toEqual([])
  })

  it('and neither does the board', async () => {
    const { store, sync } = createHost()
    seed(store)
    const { container } = render(<KanbanView sync={sync} />)
    await waitFor(() => expect(container.querySelector('.kb-project-name')).toBeTruthy())
    expect(lookalikes(container)).toEqual([])
    fireEvent.click(screen.getByRole('button', { name: '项目操作' }))
    expect(lookalikes(container)).toEqual([])
  })
})
