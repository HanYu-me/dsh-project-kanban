// @vitest-environment jsdom
/**
 * Component tests for the records page of {@link KanbanView}: a project's
 * data tree and result tree, the cards, the drag-and-drop merging and the
 * links. Everything goes through the real BoardSync with a fake `fetch`
 * backed by an in-memory host, like the board tests.
 *
 * jsdom lays nothing out, so rows are given a fixed height where a drop zone
 * matters, and drag events get their `clientY` set by hand (jsdom has no
 * DragEvent).
 */
import { act, cleanup, createEvent, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { KanbanView, deleteBody } from '../src/client/KanbanView'
import { BoardSync, type FetchLike } from '../src/client/sync'
import { recordsOf, type Op } from '../src/shared/board'
import { BOARD_ENDPOINT } from '../src/shared/protocol'
import type { RecordNode } from '../src/shared/records'
import { createMemoryStore, type BoardStore } from '../src/store'

const AT = '2024-03-01T00:00:00.000Z'

// A page left open by one test would reopen in the next one: always go back.
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

/** data: 第一章 > (原始计数, 过滤后), 参考 · results: 图 1, 表 1 · link 原始计数 → 图 1 */
function seed(store: BoardStore): void {
  store.apply([
    { type: 'project.add', id: 'p1', name: 'Alpha', at: AT },
    { type: 'node.add', projectId: 'p1', side: 'data', id: 'd1', name: '第一章', at: AT },
    { type: 'node.add', projectId: 'p1', side: 'data', id: 'd2', name: '原始计数', path: '/data/raw.h5ad', description: '10x 原始计数', parentId: 'd1', at: AT },
    { type: 'node.add', projectId: 'p1', side: 'data', id: 'd3', name: '过滤后', parentId: 'd1', at: AT },
    { type: 'node.add', projectId: 'p1', side: 'data', id: 'd4', name: '参考', at: AT },
    { type: 'node.add', projectId: 'p1', side: 'result', id: 'r1', name: '图 1', path: 'figures/fig1.pdf', at: AT },
    { type: 'node.add', projectId: 'p1', side: 'result', id: 'r2', name: '表 1', at: AT },
    { type: 'link.add', projectId: 'p1', id: 'l1', dataId: 'd2', resultId: 'r1', at: AT },
  ])
}

interface Rendered {
  store: BoardStore
  sync: BoardSync
  container: HTMLElement
}

async function renderPage(seedFn: ((store: BoardStore) => void) | undefined = seed): Promise<Rendered> {
  const { store, sync } = createHost()
  seedFn?.(store)
  const { container } = render(<KanbanView sync={sync} />)
  await waitFor(() => expect(container.querySelector('.kb-project-name')).toBeTruthy())
  fireEvent.click(container.querySelector('.kb-project-name')!)
  await waitFor(() => expect(container.querySelector('.kb-rec')).toBeTruthy())
  return { store, sync, container }
}

const records = (store: BoardStore) => recordsOf(store.read().projects[0]!)
const node = (store: BoardStore, id: string): RecordNode => [...records(store).data, ...records(store).results].find((item) => item.id === id)!
const kids = (store: BoardStore, side: 'data' | 'results', parentId: string | null): string[] => records(store)[side].filter((item) => item.parentId === parentId).map((item) => item.id)


/** The 撤销 button of the toast at the bottom (the page header has one too). */
function toastUndo(container: HTMLElement): HTMLElement {
  const button = Array.from(container.querySelectorAll<HTMLElement>('.kb-toast button')).find((item) => item.textContent?.includes('撤销'))
  if (!button) throw new Error('no 撤销 button in a toast')
  return button
}

const line = (container: HTMLElement, id: string): HTMLElement => {
  const found = container.querySelector<HTMLElement>(`[data-rec-node="${id}"]`)
  if (!found) throw new Error(`no row ${id}`)
  return found
}
const row = (container: HTMLElement, id: string): HTMLElement => line(container, id).querySelector<HTMLElement>('.kb-node-row')!
const panel = (container: HTMLElement, side: 'data' | 'result'): HTMLElement => container.querySelector<HTMLElement>(`.kb-tree[data-side="${side}"]`)!

/** Fire a drag event with a clientY, the way a browser would for a pointer at `ratio` of a 40px row. */
function dragEvent(type: 'dragStart' | 'dragOver' | 'drop' | 'dragEnd', target: Element, ratio = 0.5): void {
  const event = createEvent[type](target, { dataTransfer: { setData() {}, effectAllowed: '', dropEffect: '' } } as never)
  Object.defineProperty(event, 'clientY', { value: 40 * ratio })
  fireEvent(target, event)
}

function withHeight(element: Element): void {
  element.getBoundingClientRect = () => ({ top: 0, left: 0, bottom: 40, right: 200, width: 200, height: 40, x: 0, y: 0, toJSON: () => ({}) })
}

/** Drag `fromId` onto `toId` (or onto the empty end of the data tree), pointer at `ratio` of the row. */
async function drag(container: HTMLElement, fromId: string, toId: string | null, ratio = 0.5): Promise<void> {
  const from = row(container, fromId)
  const target = toId === null ? panel(container, 'data').querySelector<HTMLElement>('.kb-tree-body')! : row(container, toId)
  withHeight(target)
  dragEvent('dragStart', from)
  dragEvent('dragOver', target, ratio)
  dragEvent('drop', target, ratio)
  dragEvent('dragEnd', from)
  await settle()
}

describe('opening the page', () => {
  it('opens from the project name, shows both trees with their counts, and goes back', async () => {
    const { container } = await renderPage()
    expect(screen.getByRole('heading', { name: 'Alpha' })).toBeTruthy()
    expect(container.querySelector('.kb-rec-head')!.textContent).toContain('4 项数据')
    expect(container.querySelector('.kb-rec-head')!.textContent).toContain('2 个结果')
    expect(container.querySelector('.kb-rec-head')!.textContent).toContain('1 条连线')
    expect(within(panel(container, 'data')).getByText('第一章')).toBeTruthy()
    expect(within(panel(container, 'result')).getByText('图 1')).toBeTruthy()
    // The board itself is not shown while a page is open.
    expect(container.querySelector('section[data-column]')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: /项目看板/ }))
    await waitFor(() => expect(container.querySelector('.kb-rec')).toBeNull())
    expect(screen.getByRole('article', { name: '项目 Alpha' })).toBeTruthy()
  })

  it('opens from the keyboard and from the 数据与结果 button; the name no longer renames', async () => {
    const { store, sync } = createHost()
    seed(store)
    const first = render(<KanbanView sync={sync} />)
    await waitFor(() => expect(first.container.querySelector('.kb-project-name')).toBeTruthy())
    fireEvent.keyDown(first.container.querySelector('.kb-project-name')!, { key: 'Enter' })
    await waitFor(() => expect(first.container.querySelector('.kb-rec')).toBeTruthy())
    fireEvent.click(first.container.querySelector('.kb-back')!)
    await waitFor(() => expect(first.container.querySelector('.kb-rec')).toBeNull())
    expect(first.container.querySelector('input[aria-label="项目名称"]')).toBeNull()
    const button = first.container.querySelector<HTMLElement>('.kb-open-records')!
    expect(button.textContent).toContain('数据与结果')
    expect(button.textContent).toContain('6')
    fireEvent.click(button)
    await waitFor(() => expect(first.container.querySelector('.kb-rec')).toBeTruthy())
  })

  it('renames from the project menu', async () => {
    const { store, sync } = createHost()
    seed(store)
    const { container } = render(<KanbanView sync={sync} />)
    await waitFor(() => expect(container.querySelector('.kb-project-name')).toBeTruthy())
    fireEvent.click(screen.getByRole('button', { name: '项目操作' }))
    fireEvent.click(screen.getByRole('menuitem', { name: /重命名/ }))
    const input = screen.getByLabelText('项目名称')
    fireEvent.change(input, { target: { value: 'Beta' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    await settle()
    expect(store.read().projects[0]!.name).toBe('Beta')
  })

  it('the delete-project dialog counts the recorded data and results too', async () => {
    const { store, sync } = createHost()
    seed(store)
    store.apply([{ type: 'task.add', projectId: 'p1', id: 't1', title: '一个任务', at: AT }])
    const { container } = render(<KanbanView sync={sync} />)
    await waitFor(() => expect(container.querySelector('.kb-project-name')).toBeTruthy())
    fireEvent.click(screen.getByRole('button', { name: '项目操作' }))
    fireEvent.click(screen.getByRole('menuitem', { name: /删除项目/ }))
    const dialog = await screen.findByRole('alertdialog')
    expect(dialog.textContent).toContain('1 个任务和6 条数据与结果记录')
    fireEvent.click(within(dialog).getByRole('button', { name: '取消' }))
    expect(store.read().projects).toHaveLength(1)
  })

  it('comes back to the same page when the view is mounted again', async () => {
    const { store, sync } = createHost()
    seed(store)
    const first = render(<KanbanView sync={sync} />)
    await waitFor(() => expect(first.container.querySelector('.kb-project-name')).toBeTruthy())
    fireEvent.click(first.container.querySelector('.kb-project-name')!)
    await waitFor(() => expect(first.container.querySelector('.kb-rec')).toBeTruthy())
    first.unmount()
    const second = render(<KanbanView sync={sync} />)
    await waitFor(() => expect(second.container.querySelector('.kb-rec')).toBeTruthy())
    expect(screen.getByRole('heading', { name: 'Alpha' })).toBeTruthy()
  })

  it('goes back to the board when the project is deleted elsewhere', async () => {
    const { container, store, sync } = await renderPage()
    store.apply([{ type: 'project.delete', projectId: 'p1' }])
    await act(async () => {
      await sync.load()
    })
    await waitFor(() => expect(container.querySelector('.kb-rec')).toBeNull())
    expect(screen.getByText('还没有项目')).toBeTruthy()
  })

  it('invites to record the first data and result when there is nothing yet', async () => {
    const { container, store } = await renderPage((s) => s.apply([{ type: 'project.add', id: 'p1', name: 'Alpha', at: AT }]))
    expect(screen.getByText('记录这个项目的关键数据和结果')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: '添加第一项数据' }))
    const form = await screen.findByRole('group', { name: '添加数据' })
    fireEvent.change(within(form).getByLabelText('简单名字'), { target: { value: '首个数据' } })
    fireEvent.keyDown(within(form).getByLabelText('简单名字'), { key: 'Enter' })
    await settle()
    expect(records(store).data.map((item) => item.name)).toEqual(['首个数据'])
    expect(container.querySelector('.kb-tree')).toBeTruthy()
  })
})

describe('deleteBody', () => {
  it('names what goes with the project', () => {
    expect(deleteBody(0, 0)).toBe('此操作不能撤销。')
    expect(deleteBody(3, 0)).toBe('项目中的3 个任务会一起删除，此操作不能撤销。')
    expect(deleteBody(0, 2)).toBe('项目中的2 条数据与结果记录会一起删除，此操作不能撤销。')
    expect(deleteBody(3, 2)).toBe('项目中的3 个任务和2 条数据与结果记录会一起删除，此操作不能撤销。')
  })
})

describe('adding, reading and editing nodes', () => {
  it('adds a node with name, path and description, and keeps the form open for the next one', async () => {
    const { container, store } = await renderPage()
    fireEvent.click(within(panel(container, 'data')).getByRole('button', { name: /添加数据/ }))
    const form = await screen.findByRole('group', { name: '添加数据' })
    fireEvent.change(within(form).getByLabelText('简单名字'), { target: { value: '新数据' } })
    fireEvent.change(within(form).getByLabelText('完整路径'), { target: { value: '/data/new.tsv' } })
    fireEvent.change(within(form).getByLabelText('描述'), { target: { value: '一段说明' } })
    fireEvent.click(within(form).getByRole('button', { name: '添加' }))
    await settle()
    const added = records(store).data.find((item) => item.name === '新数据')!
    expect(added).toMatchObject({ path: '/data/new.tsv', description: '一段说明', parentId: null })
    expect(records(store).data.at(-1)!.id).toBe(added.id)
    // The form is still there and empty, ready for the next entry.
    expect((within(panel(container, 'data')).getByLabelText('简单名字') as HTMLInputElement).value).toBe('')
    fireEvent.keyDown(within(panel(container, 'data')).getByLabelText('简单名字'), { key: 'Escape' })
    expect(container.querySelector('.kb-rec-form')).toBeNull()
  })

  it('adds a result in the result tree, and a child through the row button', async () => {
    const { container, store } = await renderPage()
    fireEvent.click(within(panel(container, 'result')).getByRole('button', { name: /添加结果/ }))
    const input = within(panel(container, 'result')).getByLabelText('简单名字')
    fireEvent.change(input, { target: { value: '图 2' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    await settle()
    expect(records(store).results.map((item) => item.name)).toEqual(['图 1', '表 1', '图 2'])
    expect(records(store).data).toHaveLength(4)

    fireEvent.click(within(line(container, 'd4')).getByRole('button', { name: '添加子节点' }))
    const childInput = within(panel(container, 'data')).getByLabelText('简单名字')
    fireEvent.change(childInput, { target: { value: '参考的子项' } })
    fireEvent.keyDown(childInput, { key: 'Enter' })
    await settle()
    const child = records(store).data.find((item) => item.name === '参考的子项')!
    expect(child.parentId).toBe('d4')
  })

  it('refuses an empty name and shows nothing is saved', async () => {
    const { container, store } = await renderPage()
    fireEvent.click(within(panel(container, 'data')).getByRole('button', { name: /添加数据/ }))
    const form = await screen.findByRole('group', { name: '添加数据' })
    const submit = within(form).getByRole('button', { name: '添加' }) as HTMLButtonElement
    expect(submit.disabled).toBe(true)
    fireEvent.keyDown(within(form).getByLabelText('简单名字'), { key: 'Enter' })
    await settle()
    expect(records(store).data).toHaveLength(4)
  })

  it('opens a card with the full information when the name is clicked, and closes it again', async () => {
    const { container } = await renderPage()
    expect(container.querySelector('.kb-rec-card')).toBeNull()
    fireEvent.click(within(line(container, 'd2')).getByRole('button', { name: '原始计数' }))
    const card = await screen.findByRole('region', { name: '原始计数 的详情' })
    expect(card.textContent).toContain('完整路径')
    expect(card.textContent).toContain('/data/raw.h5ad')
    expect(card.textContent).toContain('10x 原始计数')
    expect(card.textContent).toContain('图 1')
    fireEvent.click(within(line(container, 'd2')).getByRole('button', { name: '原始计数' }))
    expect(container.querySelector('.kb-rec-card')).toBeNull()
  })

  it('says so when path and description are empty, and uses the result words on the result side', async () => {
    const { container } = await renderPage()
    fireEvent.click(within(line(container, 'd3')).getByRole('button', { name: '过滤后' }))
    expect((await screen.findByRole('region', { name: '过滤后 的详情' })).textContent).toContain('未填写')
    fireEvent.click(within(line(container, 'r1')).getByRole('button', { name: '图 1' }))
    const card = await screen.findByRole('region', { name: '图 1 的详情' })
    expect(card.textContent).toContain('文件 / 位置')
    expect(card.textContent).toContain('figures/fig1.pdf')
    expect(card.textContent).toContain('来源数据')
  })

  it('edits a node in its card and saves with ⌘/Ctrl+Enter', async () => {
    const { container, store } = await renderPage()
    fireEvent.click(within(line(container, 'd2')).getByRole('button', { name: '编辑节点' }))
    const form = await screen.findByRole('group', { name: '编辑节点' })
    expect((within(form).getByLabelText('简单名字') as HTMLInputElement).value).toBe('原始计数')
    fireEvent.change(within(form).getByLabelText('简单名字'), { target: { value: '原始计数矩阵' } })
    fireEvent.change(within(form).getByLabelText('描述'), { target: { value: '改过的说明' } })
    fireEvent.keyDown(within(form).getByLabelText('描述'), { key: 'Enter', ctrlKey: true })
    await settle()
    expect(node(store, 'd2')).toMatchObject({ name: '原始计数矩阵', description: '改过的说明', path: '/data/raw.h5ad' })
    expect(container.querySelector('.kb-rec-form')).toBeNull()
    expect(screen.getByRole('region', { name: '原始计数矩阵 的详情' })).toBeTruthy()
  })

  it('Escape leaves the edit form without saving', async () => {
    const { container, store } = await renderPage()
    fireEvent.click(within(line(container, 'd2')).getByRole('button', { name: '编辑节点' }))
    const form = await screen.findByRole('group', { name: '编辑节点' })
    fireEvent.change(within(form).getByLabelText('简单名字'), { target: { value: '不会保存' } })
    fireEvent.keyDown(within(form).getByLabelText('简单名字'), { key: 'Escape' })
    await settle()
    expect(node(store, 'd2').name).toBe('原始计数')
  })

  it('renames in place on double click', async () => {
    const { container, store } = await renderPage()
    fireEvent.doubleClick(within(line(container, 'd4')).getByRole('button', { name: '参考' }))
    const input = await screen.findByLabelText('节点名称')
    fireEvent.change(input, { target: { value: '参考基因组' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    await settle()
    expect(node(store, 'd4').name).toBe('参考基因组')
  })
})

describe('links', () => {
  it('links a data node to a result from the data card, and removes it with the chip', async () => {
    const { container, store } = await renderPage()
    fireEvent.click(within(line(container, 'd3')).getByRole('button', { name: '过滤后' }))
    const card = await screen.findByRole('region', { name: '过滤后 的详情' })
    expect(card.textContent).toContain('还没有关联到任何结果')
    fireEvent.change(within(card).getByRole('combobox'), { target: { value: 'r2' } })
    await settle()
    expect(records(store).links.map((link) => `${link.dataId}>${link.resultId}`)).toEqual(['d2>r1', 'd3>r2'])
    expect(within(card).getByText('表 1')).toBeTruthy()

    fireEvent.click(within(card).getByRole('button', { name: '取消与「表 1」的关联' }))
    await settle()
    expect(records(store).links.map((link) => link.id)).toEqual(['l1'])
    expect(screen.getByText('已取消关联')).toBeTruthy()
    // 撤销 puts the same link back.
    fireEvent.click(toastUndo(container))
    await settle()
    expect(records(store).links).toHaveLength(2)
  })

  it('links from the result card the other way round, offering only what is not linked yet', async () => {
    const { container, store } = await renderPage()
    fireEvent.click(within(line(container, 'r1')).getByRole('button', { name: '图 1' }))
    const card = await screen.findByRole('region', { name: '图 1 的详情' })
    const select = within(card).getByLabelText('添加来源数据') as HTMLSelectElement
    const labels = Array.from(select.options).map((option) => option.textContent!.trim())
    expect(labels).toEqual(['＋ 添加来源数据…', '第一章', '过滤后', '参考'])
    fireEvent.change(select, { target: { value: 'd4' } })
    await settle()
    expect(records(store).links.some((link) => link.dataId === 'd4' && link.resultId === 'r1')).toBe(true)
  })

  it('connects by dragging from a port to a node of the other tree (either way round)', async () => {
    const { container, store } = await renderPage()
    const port = (id: string): HTMLElement => container.querySelector<HTMLElement>(`[data-port="${id}"]`)!
    fireEvent.pointerDown(port('d4'), { button: 0, pointerType: 'mouse', clientX: 10, clientY: 10 })
    expect(container.querySelector('.kb-diagram.is-connecting')).toBeTruthy()
    fireEvent.pointerMove(row(container, 'r2'), { clientX: 200, clientY: 40 })
    await waitFor(() => expect(container.querySelector('.is-link-target')).toBeTruthy())
    fireEvent.pointerUp(row(container, 'r2'), { button: 0, pointerType: 'mouse' })
    await settle()
    expect(records(store).links.some((link) => link.dataId === 'd4' && link.resultId === 'r2')).toBe(true)
    expect(container.querySelector('.kb-diagram.is-connecting')).toBeNull()

    // From the result side to a data node: still data → result.
    fireEvent.pointerDown(port('r2'), { button: 0, pointerType: 'mouse' })
    fireEvent.pointerUp(line(container, 'd3'), { button: 0, pointerType: 'mouse' })
    await settle()
    expect(records(store).links.some((link) => link.dataId === 'd3' && link.resultId === 'r2')).toBe(true)
  })

  it('drops a dragged line that does not end on the other tree, and on Escape', async () => {
    const { container, store } = await renderPage()
    const port = (id: string): HTMLElement => container.querySelector<HTMLElement>(`[data-port="${id}"]`)!
    fireEvent.pointerDown(port('d4'), { button: 0, pointerType: 'mouse' })
    fireEvent.pointerUp(line(container, 'd3'), { button: 0, pointerType: 'mouse' }) // same tree
    fireEvent.pointerDown(port('d4'), { button: 0, pointerType: 'mouse' })
    fireEvent.keyDown(window, { key: 'Escape' })
    fireEvent.pointerUp(row(container, 'r2'), { button: 0, pointerType: 'mouse' })
    await settle()
    expect(records(store).links).toHaveLength(1)
    expect(container.querySelector('.kb-diagram.is-connecting')).toBeNull()
  })

  it('lights the links of a hovered node and dims the rest', async () => {
    const { container } = await renderPage()
    expect(container.querySelectorAll('.kb-link')).toHaveLength(1)
    fireEvent.mouseEnter(line(container, 'd2'))
    expect(container.querySelectorAll('.kb-link.is-hot')).toHaveLength(1)
    expect(row(container, 'r1').className).toContain('is-linked')
    fireEvent.mouseEnter(line(container, 'd4'))
    expect(container.querySelectorAll('.kb-link.is-hot')).toHaveLength(0)
    expect(container.querySelectorAll('.kb-link.is-dim')).toHaveLength(1)
    // A group lights everything below it.
    fireEvent.mouseEnter(line(container, 'd1'))
    expect(container.querySelectorAll('.kb-link.is-hot')).toHaveLength(1)
    expect(row(container, 'd2').className).toContain('is-within')
  })

  it('draws the links of a folded group to the group, dashed and once per pair', async () => {
    const { container, store } = await renderPage()
    store.apply([{ type: 'link.add', projectId: 'p1', id: 'l2', dataId: 'd3', resultId: 'r1', at: AT }])
    // Pull the new state in, like a window coming back into focus.
    fireEvent.focus(window)
    await act(async () => {
      document.dispatchEvent(new Event('visibilitychange'))
      await new Promise((resolve) => setTimeout(resolve, 0))
    })
    await waitFor(() => expect(container.querySelectorAll('.kb-link')).toHaveLength(2))
    fireEvent.click(within(line(container, 'd1')).getByRole('button', { name: '收起「第一章」' }))
    await settle()
    expect(container.querySelector('[data-rec-node="d2"]')).toBeNull()
    expect(container.querySelectorAll('.kb-link')).toHaveLength(1)
    expect(container.querySelector('.kb-link.is-folded')).toBeTruthy()
    // The group carries the badge of both links.
    expect(line(container, 'd1').querySelector('.kb-node-links')!.textContent).toBe('2')
    expect(node(store, 'd1').collapsed).toBe(true)
  })
})

describe('arranging the trees', () => {
  it('drops a node onto the middle of a row to merge it into that node', async () => {
    const { container, store } = await renderPage()
    await drag(container, 'd4', 'd1', 0.5)
    expect(kids(store, 'data', 'd1')).toEqual(['d2', 'd3', 'd4'])
    expect(kids(store, 'data', null)).toEqual(['d1'])
    // The new member is shown under the group.
    expect(line(container, 'd4').querySelector('.kb-node-row')).toBeTruthy()
  })

  it('drops at the top or bottom edge of a row to place it next to that row', async () => {
    const { container, store } = await renderPage()
    await drag(container, 'd4', 'd2', 0.1)
    expect(kids(store, 'data', 'd1')).toEqual(['d4', 'd2', 'd3'])
    await drag(container, 'd2', 'd3', 0.9)
    expect(kids(store, 'data', 'd1')).toEqual(['d4', 'd3', 'd2'])
  })

  it('the bottom edge of an open group means "first inside it", of a leaf "right after it"', async () => {
    const { container, store } = await renderPage()
    await drag(container, 'd4', 'd1', 0.9)
    expect(kids(store, 'data', 'd1')).toEqual(['d4', 'd2', 'd3'])
    await drag(container, 'd2', 'd4', 0.9)
    expect(kids(store, 'data', 'd1')).toEqual(['d4', 'd2', 'd3'])
    expect(kids(store, 'data', null)).toEqual(['d1'])
  })

  it('drops into the empty space under the last row to move a node to the top level, at the end', async () => {
    const { container, store } = await renderPage()
    await drag(container, 'd2', null, 0.9)
    expect(kids(store, 'data', null)).toEqual(['d1', 'd4', 'd2'])
  })

  it('refuses to drop a group onto itself or into its own child', async () => {
    const { container, store } = await renderPage()
    const before = JSON.stringify(records(store).data)
    await drag(container, 'd1', 'd2', 0.5)
    await drag(container, 'd1', 'd1', 0.5)
    expect(JSON.stringify(records(store).data)).toBe(before)
  })

  it('does not take a drag from the other tree', async () => {
    const { container, store } = await renderPage()
    const before = JSON.stringify(records(store))
    const from = row(container, 'r2')
    const target = row(container, 'd4')
    withHeight(target)
    dragEvent('dragStart', from)
    dragEvent('dragOver', target)
    dragEvent('drop', target)
    dragEvent('dragEnd', from)
    await settle()
    expect(JSON.stringify(records(store))).toBe(before)
  })

  it('unfolds a folded group that something is dropped into', async () => {
    const { container, store } = await renderPage()
    fireEvent.click(within(line(container, 'd1')).getByRole('button', { name: '收起「第一章」' }))
    await settle()
    await drag(container, 'd4', 'd1', 0.5)
    expect(kids(store, 'data', 'd1')).toEqual(['d2', 'd3', 'd4'])
    expect(node(store, 'd1').collapsed).toBe(false)
  })

  it('selects with the icon and merges the selection into a new group, then names it', async () => {
    const { container, store } = await renderPage()
    fireEvent.click(within(line(container, 'd3')).getByRole('checkbox', { name: '选择「过滤后」' }))
    fireEvent.click(within(line(container, 'd4')).getByRole('checkbox', { name: '选择「参考」' }))
    expect(screen.getByRole('toolbar', { name: '批量操作' }).textContent).toContain('已选 2 项')
    fireEvent.click(screen.getByRole('button', { name: /合并为分组/ }))
    await settle()
    const group = records(store).data.find((item) => item.name === '新分组')!
    expect(group).toBeTruthy()
    // The group takes the place of the first selected node; both are inside, in tree order.
    expect(group.parentId).toBe('d1')
    expect(kids(store, 'data', group.id)).toEqual(['d3', 'd4'])
    expect(kids(store, 'data', 'd1')).toEqual(['d2', group.id])
    expect(screen.queryByRole('toolbar', { name: '批量操作' })).toBeNull()
    const input = await screen.findByLabelText('节点名称')
    fireEvent.change(input, { target: { value: '第二章' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    await settle()
    expect(node(store, group.id).name).toBe('第二章')
  })

  it('drags a whole selection together', async () => {
    const { container, store } = await renderPage()
    fireEvent.click(within(line(container, 'd2')).getByRole('checkbox', { name: '选择「原始计数」' }))
    fireEvent.click(within(line(container, 'd3')).getByRole('checkbox', { name: '选择「过滤后」' }))
    await drag(container, 'd2', 'd4', 0.5)
    expect(kids(store, 'data', 'd4')).toEqual(['d2', 'd3'])
    expect(kids(store, 'data', 'd1')).toEqual([])
  })

  it('ctrl/⌘/shift + click on a name toggles the selection instead of opening the card', async () => {
    const { container } = await renderPage()
    fireEvent.click(within(line(container, 'd4')).getByRole('button', { name: '参考' }), { metaKey: true })
    expect(screen.getByRole('toolbar', { name: '批量操作' })).toBeTruthy()
    expect(container.querySelector('.kb-rec-card')).toBeNull()
    fireEvent.keyDown(container.querySelector('.kb-rec')!, { key: 'Escape' })
    expect(screen.queryByRole('toolbar', { name: '批量操作' })).toBeNull()
  })

  it('the menu moves a node up, down, into the previous node and out of its parent', async () => {
    const { container, store } = await renderPage()
    const choose = (id: string, name: RegExp): void => {
      fireEvent.click(within(line(container, id)).getByRole('button', { name: '更多操作' }))
      fireEvent.click(within(line(container, id)).getByRole('menuitem', { name }))
    }
    choose('d3', /^上移/)
    await settle()
    expect(kids(store, 'data', 'd1')).toEqual(['d3', 'd2'])
    choose('d3', /^下移/)
    await settle()
    expect(kids(store, 'data', 'd1')).toEqual(['d2', 'd3'])
    choose('d3', /移入上一项/)
    await settle()
    expect(kids(store, 'data', 'd2')).toEqual(['d3'])
    choose('d3', /移出上一级/)
    await settle()
    expect(kids(store, 'data', 'd1')).toEqual(['d2', 'd3'])
    // The first sibling cannot move up or into a previous node; a top-level node cannot move out.
    fireEvent.click(within(line(container, 'd2')).getByRole('button', { name: '更多操作' }))
    expect((within(line(container, 'd2')).getByRole('menuitem', { name: /^上移/ }) as HTMLButtonElement).disabled).toBe(true)
    expect((within(line(container, 'd2')).getByRole('menuitem', { name: /移入上一项/ }) as HTMLButtonElement).disabled).toBe(true)
  })
})

describe('deleting', () => {
  it('deletes a leaf at once and 撤销 restores it with its link', async () => {
    const { container, store } = await renderPage()
    fireEvent.click(within(line(container, 'd2')).getByRole('button', { name: '更多操作' }))
    fireEvent.click(within(line(container, 'd2')).getByRole('menuitem', { name: /^删除/ }))
    await settle()
    expect(records(store).data.map((item) => item.id)).toEqual(['d1', 'd3', 'd4'])
    expect(records(store).links).toHaveLength(0)
    fireEvent.click(toastUndo(container))
    await settle()
    expect(records(store).data.map((item) => item.id)).toEqual(['d1', 'd2', 'd3', 'd4'])
    expect(records(store).links.map((link) => link.id)).toEqual(['l1'])
  })

  it('asks before deleting a group, and 撤销 brings the whole subtree back', async () => {
    const { container, store } = await renderPage()
    const before = JSON.stringify(records(store))
    fireEvent.click(within(line(container, 'd1')).getByRole('button', { name: '更多操作' }))
    fireEvent.click(within(line(container, 'd1')).getByRole('menuitem', { name: /删除（含子节点）/ }))
    const dialog = await screen.findByRole('alertdialog')
    expect(dialog.textContent).toContain('2 个子节点会一起删除')
    expect(dialog.textContent).toContain('1 条连线')
    fireEvent.click(within(dialog).getByRole('button', { name: '取消' }))
    expect(records(store).data).toHaveLength(4)
    fireEvent.click(within(line(container, 'd1')).getByRole('button', { name: '更多操作' }))
    fireEvent.click(within(line(container, 'd1')).getByRole('menuitem', { name: /删除（含子节点）/ }))
    fireEvent.click(within(await screen.findByRole('alertdialog')).getByRole('button', { name: '删除' }))
    await settle()
    expect(records(store).data.map((item) => item.id)).toEqual(['d4'])
    expect(records(store).links).toHaveLength(0)
    fireEvent.click(toastUndo(container))
    await settle()
    expect(JSON.stringify(records(store))).toBe(before)
  })

  it('dissolves a group: its children move up, 撤销 puts them back under it', async () => {
    const { container, store } = await renderPage()
    fireEvent.click(within(line(container, 'd1')).getByRole('button', { name: '更多操作' }))
    fireEvent.click(within(line(container, 'd1')).getByRole('menuitem', { name: /解散/ }))
    await settle()
    expect(kids(store, 'data', null)).toEqual(['d2', 'd3', 'd4'])
    expect(records(store).data.find((item) => item.id === 'd1')).toBeUndefined()
    // The children keep their links.
    expect(records(store).links).toHaveLength(1)
    fireEvent.click(toastUndo(container))
    await settle()
    expect(kids(store, 'data', 'd1')).toEqual(['d2', 'd3'])
    expect(kids(store, 'data', null)).toEqual(['d1', 'd4'])
  })
})
