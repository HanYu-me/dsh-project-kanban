/**
 * The colours of a project's records: the default colours of nodes, lines and
 * stars, and the named categories ("原始数据" is blue, "最终结果" is orange)
 * that nodes and lines can be given. A popover on the page header.
 * @module dsh-project-kanban/client/PalettePanel
 */
import { useEffect, useState, type ReactNode } from 'react'
import { RECORD_LIMITS, categoriesOf, cleanColor, type CategoryKind, type RecordCategory } from '../shared/records'
import { useDismiss } from './common'
import { CloseIcon, PaletteIcon, PlusIcon } from './icons'
import { useRecords } from './recordsContext'
import { DEFAULT_STAR_COLOR } from './recordsModel'

/** The colours offered as one-click swatches. */
export const PRESET_COLORS = ['#4d6bfe', '#8b5cf6', '#22a06b', '#e09400', '#e5484d', '#f0777d', '#0ea5a4', '#ec4899', '#84cc16', '#64748b'] as const

/** Swatches plus a hex field: pick a colour in one click, or type one. */
function ColorPicker({ value, label, onPick }: { value: string | undefined; label: string; onPick(color: string): void }) {
  const [hex, setHex] = useState(value ?? '')
  useEffect(() => setHex(value ?? ''), [value])
  const commit = (): void => {
    const color = cleanColor(hex)
    if (color !== undefined && color !== value) onPick(color)
    else setHex(value ?? '')
  }
  return (
    <div className="kb-colorpick" role="group" aria-label={label}>
      <div className="kb-swatches">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            className={'kb-swatch' + (color === value ? ' is-current' : '')}
            style={{ ['--s' as string]: color }}
            aria-label={`${label} ${color}`}
            title={color}
            onClick={() => onPick(color)}
          />
        ))}
      </div>
      <input
        className="kb-input kb-hex"
        value={hex}
        placeholder="#RRGGBB"
        maxLength={7}
        aria-label={`${label}（#RRGGBB）`}
        onChange={(event) => setHex(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
            event.preventDefault()
            commit()
          }
        }}
      />
    </div>
  )
}

function Dot({ color }: { color: string | undefined }) {
  return <i className="kb-dot" style={color ? { background: color } : undefined} />
}

/** One of the three default colours, with a way back to the built-in look. */
function DefaultRow({ which, label, builtin, value }: { which: 'node' | 'edge' | 'star'; label: string; builtin: string; value: string | undefined }) {
  const ui = useRecords()
  const [open, setOpen] = useState(false)
  return (
    <div className="kb-pal-default">
      <div className="kb-pal-line">
        <button type="button" className="kb-pal-dotbtn" aria-expanded={open} aria-label={`修改${label}`} onClick={() => setOpen(!open)}>
          <Dot color={value} />
          <span>{label}</span>
        </button>
        <span className="kb-hint">{value ?? builtin}</span>
        <button type="button" className="kb-btn kb-btn-ghost kb-btn-sm" disabled={value === undefined} onClick={() => ui.setDefaultColor(which, null)}>
          恢复默认
        </button>
      </div>
      {open ? <ColorPicker value={value} label={label} onPick={(color) => ui.setDefaultColor(which, color)} /> : null}
    </div>
  )
}

/** One category: its colour, its name, and a way to remove it. */
function CategoryRow({ kind, category }: { kind: CategoryKind; category: RecordCategory }) {
  const ui = useRecords()
  const [name, setName] = useState(category.name)
  const [open, setOpen] = useState(false)
  useEffect(() => setName(category.name), [category.name])
  const commit = (): void => {
    const text = name.trim()
    if (text !== '' && text !== category.name) ui.updateCategory(kind, category.id, { name: text })
    else setName(category.name)
  }
  return (
    <div className="kb-pal-cat">
      <div className="kb-pal-line">
        <button type="button" className="kb-pal-dotbtn" aria-expanded={open} aria-label={`修改「${category.name}」的颜色`} onClick={() => setOpen(!open)}>
          <Dot color={category.color} />
        </button>
        <input
          className="kb-input kb-pal-name"
          value={name}
          maxLength={RECORD_LIMITS.categoryName}
          aria-label={`类别名称：${category.name}`}
          onChange={(event) => setName(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
              event.preventDefault()
              commit()
            }
          }}
        />
        <button type="button" className="kb-icon-btn is-danger" aria-label={`删除类别「${category.name}」`} title="删除类别（用了它的回到默认色）" onClick={() => ui.removeCategory(kind, category.id)}>
          <CloseIcon size={13} />
        </button>
      </div>
      {open ? <ColorPicker value={category.color} label={`「${category.name}」的颜色`} onPick={(color) => ui.updateCategory(kind, category.id, { color })} /> : null}
    </div>
  )
}

/** The categories of one kind, with a row to add one. */
function CategorySection({ kind, title, hint }: { kind: CategoryKind; title: string; hint: string }) {
  const ui = useRecords()
  const categories = categoriesOf(ui.records, kind)
  const [name, setName] = useState('')
  const [color, setColor] = useState<string>(PRESET_COLORS[kind === 'node' ? 0 : 2])
  const trimmed = name.trim()
  const full = categories.length >= RECORD_LIMITS.categories
  const add = (): void => {
    if (trimmed === '' || full) return
    ui.addCategory(kind, trimmed, color)
    setName('')
  }
  return (
    <section className="kb-pal-section" aria-label={title}>
      <h3>{title}</h3>
      <p className="kb-hint">{hint}</p>
      {categories.map((category) => (
        <CategoryRow key={category.id} kind={kind} category={category} />
      ))}
      <div className="kb-pal-add">
        <div className="kb-pal-line">
          <input
            className="kb-input kb-pal-name"
            value={name}
            maxLength={RECORD_LIMITS.categoryName}
            placeholder={kind === 'node' ? '新类别名称，例如：原始数据' : '新类别名称，例如：推断'}
            aria-label={`${title}：新类别名称`}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
                event.preventDefault()
                add()
              }
            }}
          />
          <button type="button" className="kb-btn kb-btn-sm kb-btn-primary" disabled={trimmed === '' || full} onClick={add}>
            <PlusIcon size={13} /> 添加
          </button>
        </div>
        <div className="kb-swatches" role="radiogroup" aria-label={`${title}：新类别的颜色`}>
          {PRESET_COLORS.map((preset) => (
            <button
              key={preset}
              type="button"
              role="radio"
              aria-checked={preset === color}
              className={'kb-swatch' + (preset === color ? ' is-current' : '')}
              style={{ ['--s' as string]: preset }}
              aria-label={`新类别的颜色 ${preset}`}
              title={preset}
              onClick={() => setColor(preset)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/** The panel itself. */
function PaletteBody() {
  const ui = useRecords()
  const defaults = ui.records.palette?.defaults
  return (
    // Not role="dialog": dsh-oh-my-claude treats any [role=dialog] next to a button[aria-haspopup=dialog]
    // as dsh's context-meter popover and fills it with the Claude usage.
    <div className="kb-palette" role="group" aria-label="颜色与类别">
      <section className="kb-pal-section" aria-label="默认颜色">
        <h3>默认颜色</h3>
        <DefaultRow which="node" label="节点" builtin="主题默认" value={defaults?.node} />
        <DefaultRow which="edge" label="连线" builtin="跟随项目色" value={defaults?.edge} />
        <DefaultRow which="star" label="星标" builtin={`浅红 ${DEFAULT_STAR_COLOR}`} value={defaults?.star} />
        <p className="kb-hint">连到星标节点的线用星标色；自己指定了类别的线，用类别的颜色。</p>
      </section>
      <CategorySection kind="node" title="节点类别" hint="给数据或结果指定类别，它的图标和圆点就用这个颜色。" />
      <CategorySection kind="edge" title="连线类别" hint="给连线（数据到结果、结果之间）指定类别。" />
    </div>
  )
}

/** The header button and the popover it opens. */
export function PaletteButton({ open, onOpenChange, children }: { open: boolean; onOpenChange(open: boolean): void; children?: ReactNode }) {
  const ref = useDismiss(open, () => onOpenChange(false))
  return (
    <div className="kb-pop-anchor" ref={ref}>
      <button type="button" className={'kb-btn kb-btn-sm' + (open ? ' is-on' : '')} aria-expanded={open} title="颜色与类别：设置节点和连线的颜色" onClick={() => onOpenChange(!open)}>
        <PaletteIcon size={14} /> 颜色
      </button>
      {open ? <PaletteBody /> : null}
      {children}
    </div>
  )
}
