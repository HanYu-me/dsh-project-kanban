// @vitest-environment jsdom
/**
 * The stylesheet is injected by the plugin's own script. DSH swaps a plugin
 * live, so the page can still hold the stylesheet of the version it replaced:
 * new markup with old rules (a port with no shape, a star button with the
 * browser's default look). Injecting again has to bring it up to date.
 */
import { afterEach, describe, expect, it } from 'vitest'
import { ensureStyles } from '../src/client/styles'

const ID = 'dsh-project-kanban-styles'
const sheets = (): HTMLElement[] => Array.from(document.querySelectorAll<HTMLElement>(`#${ID}`))

afterEach(() => {
  document.head.innerHTML = ''
})

describe('ensureStyles', () => {
  it('adds the stylesheet to the page', () => {
    ensureStyles()
    expect(sheets()).toHaveLength(1)
    expect(sheets()[0]!.tagName).toBe('STYLE')
    expect(sheets()[0]!.textContent).toContain('.kb-port-right')
  })

  it('leaves a current stylesheet alone, however often it is called', () => {
    ensureStyles()
    const element = sheets()[0]!
    const text = element.textContent
    ensureStyles()
    ensureStyles()
    expect(sheets()).toHaveLength(1)
    expect(sheets()[0]).toBe(element)
    expect(sheets()[0]!.textContent).toBe(text)
  })

  it('drops a sheet an earlier build left under another id, and leaves other plugins\' sheets alone', () => {
    document.head.innerHTML = '<style id="dsh-project-kanban-old">.kb-port { left: -7px }</style><style id="dsh-something-else">a { color: red }</style>'
    ensureStyles()
    expect(document.getElementById('dsh-project-kanban-old')).toBeNull()
    expect(document.getElementById('dsh-something-else')).toBeTruthy()
    expect(sheets()).toHaveLength(1)
  })

  it('brings the stylesheet of an older version up to date instead of trusting it', () => {
    const stale = '.kb-tree[data-side="result"] .kb-port { left: -7px; }'
    document.head.innerHTML = `<style id="${ID}">${stale}</style>`
    const element = sheets()[0]!
    ensureStyles()
    expect(sheets()).toHaveLength(1)
    expect(sheets()[0]).toBe(element)
    expect(element.textContent).not.toBe(stale)
    // the rules the old one lacked: the relation node apart from the data node, the star button
    expect(element.textContent).toContain('.kb-port-right')
    expect(element.textContent).toContain('.kb-node-star')
  })
})
