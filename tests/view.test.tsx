// @vitest-environment jsdom
/**
 * Component tests for {@link KanbanView}, driven through the real BoardSync
 * with a fake `fetch` backed by an in-memory host. Everything the user does
 * goes through the same optimistic path as in the browser.
 */
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { KanbanView } from '../src/client/KanbanView'
import { BoardSync, type FetchLike } from '../src/client/sync'
import { emptyBoard, type ColumnId, type Op } from '../src/shared/board'
import { BOARD_ENDPOINT } from '../src/shared/protocol'
import { createMemoryStore, type BoardStore } from '../src/store'

afterEach(cleanup)

function json(body: unknown): Response {
  return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } })
}

/** A memory host + a sync object speaking the real two endpoints. */
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

interface Rendered {
  store: BoardStore
  sync: BoardSync
  container: HTMLElement
}

/** Render the view over a freshly seeded in-memory host. */
function renderView(seed?: (store: BoardStore) => void): Rendered {
  const { store, sync } = createHost()
  seed?.(store)
  const { container } = render(<KanbanView sync={sync} />)
  return { store, sync, container }
}

/** The `<section data-column=…>` of the single project on the board. */
function column(container: HTMLElement, id: ColumnId): HTMLElement {
  const section = container.querySelector<HTMLElement>(`section[data-column="${id}"]`)
  if (!section) throw new Error(`missing column ${id}`)
  return section
}

/** Let queued microtasks/timers run inside act, so saves can land. */
async function settle(): Promise<void> {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })
}

function seedProject(store: BoardStore): void {
  store.apply([{ type: 'project.add', id: 'p1', name: 'Alpha' }])
}

function seedProjectWithTask(store: BoardStore): void {
  store.apply([
    { type: 'project.add', id: 'p1', name: 'Alpha' },
    { type: 'task.add', projectId: 'p1', id: 't1', title: '写测试' },
  ])
}

describe('KanbanView', () => {
  it('shows the empty state with the first-project button', async () => {
    renderView()
    await waitFor(() => expect(screen.getByText('还没有项目')).toBeTruthy())
    expect(screen.getByRole('button', { name: /新建第一个项目/ })).toBeTruthy()
  })

  it('creates a project through the form and renders the four columns', async () => {
    const { container, store, sync } = renderView()
    await waitFor(() => expect(screen.getByText('还没有项目')).toBeTruthy())

    fireEvent.click(screen.getByRole('button', { name: /新建第一个项目/ }))
    fireEvent.change(screen.getByLabelText('项目名称'), { target: { value: '官网改版' } })
    fireEvent.click(screen.getByRole('button', { name: '创建项目' }))

    await waitFor(() => expect(container.querySelector('section[data-column="todo"]')).toBeTruthy())
    expect(screen.getByRole('article', { name: '项目 官网改版' })).toBeTruthy()
    const headers: [ColumnId, string][] = [
      ['todo', '待办'],
      ['doing', '进行中'],
      ['review', '待反馈'],
      ['done', '已完成'],
    ]
    for (const [id, label] of headers) {
      expect(within(column(container, id)).getByText(label)).toBeTruthy()
    }

    await waitFor(() => expect(sync.getSnapshot().status).toBe('saved'))
    expect(store.read().projects.map((project) => project.name)).toEqual(['官网改版'])
  })

  it('adds a task through the column editor and shows it in 待办', async () => {
    const { container, store, sync } = renderView(seedProject)
    await waitFor(() => expect(column(container, 'todo')).toBeTruthy())

    fireEvent.click(within(column(container, 'todo')).getByRole('button', { name: '添加任务' }))
    const input = within(column(container, 'todo')).getByLabelText('任务标题')
    fireEvent.change(input, { target: { value: '写同步测试' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    await settle()

    const todo = column(container, 'todo')
    expect(within(todo).getByText('写同步测试')).toBeTruthy()
    expect(todo.querySelectorAll('[data-task-id]')).toHaveLength(1)

    await waitFor(() => expect(sync.getSnapshot().status).toBe('saved'))
    expect(store.read().projects[0]?.tasks.map((task) => task.title)).toEqual(['写同步测试'])
  })

  it('advances a task through the columns and ends with a static done check', async () => {
    const { container, store, sync } = renderView(seedProjectWithTask)
    await waitFor(() => expect(within(column(container, 'todo')).getByText('写测试')).toBeTruthy())

    const advance = async (from: ColumnId, to: ColumnId): Promise<void> => {
      fireEvent.click(within(column(container, from)).getByRole('button', { name: /^标记完成/ }))
      await settle()
      expect(within(column(container, to)).getByText('写测试')).toBeTruthy()
      expect(within(column(container, from)).queryByText('写测试')).toBeNull()
    }
    await advance('todo', 'doing')
    await advance('doing', 'review')
    await advance('review', 'done')

    const done = column(container, 'done')
    expect(within(done).getByRole('img', { name: '已完成' })).toBeTruthy()
    expect(within(done).queryByRole('button', { name: /标记完成/ })).toBeNull()

    await waitFor(() => expect(sync.getSnapshot().status).toBe('saved'))
    const task = store.read().projects[0]?.tasks[0]
    expect(task?.column).toBe('done')
    expect(task?.completedAt).toBeTruthy()
  })

  it('deletes a task from the 更多操作 menu and restores it with 撤销', async () => {
    const { container, store, sync } = renderView(seedProjectWithTask)
    await waitFor(() => expect(within(column(container, 'todo')).getByText('写测试')).toBeTruthy())

    const todo = column(container, 'todo')
    fireEvent.click(within(todo).getByRole('button', { name: '更多操作' }))
    fireEvent.click(within(todo).getByRole('menuitem', { name: /删除任务/ }))
    await settle()

    expect(within(todo).queryByText('写测试')).toBeNull()
    expect(screen.getByText(/已删除「写测试」/)).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: /撤销/ }))
    await settle()

    expect(within(column(container, 'todo')).getByText('写测试')).toBeTruthy()
    await waitFor(() => expect(sync.getSnapshot().status).toBe('saved'))
    expect(store.read().projects[0]?.tasks.map((task) => task.id)).toEqual(['t1'])
    expect(store.read().projects[0]?.tasks[0]?.column).toBe('todo')
  })
})
