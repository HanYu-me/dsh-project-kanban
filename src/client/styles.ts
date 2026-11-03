/**
 * Self-contained stylesheet, injected once. Every neutral colour, radius and
 * shadow comes from DSH's design tokens (`--dsw-*`, with light fallbacks), so
 * the board follows DSH's own light/dark theme. Status and project accents
 * are fixed hues that read on both backgrounds.
 * @module dsh-project-kanban/client/styles
 */

const STYLE_ID = 'dsh-project-kanban-styles'

const TOKENS = `
  --kb-fg: var(--dsw-alias-label-primary, #1a1d24);
  --kb-fg-2: var(--dsw-alias-label-secondary, #4b5160);
  --kb-fg-3: var(--dsw-alias-label-tertiary, #7b8191);
  --kb-fg-4: var(--dsw-alias-label-caption, #9aa0ad);
  --kb-surface: var(--dsw-alias-bg-layer-3, #ffffff);
  --kb-sunk: color-mix(in srgb, var(--kb-fg) 3.5%, var(--kb-surface));
  --kb-sunk-2: color-mix(in srgb, var(--kb-fg) 6%, var(--kb-surface));
  --kb-border: var(--dsw-alias-border-l1, rgba(17, 24, 39, 0.08));
  --kb-border-2: var(--dsw-alias-border-l3, rgba(17, 24, 39, 0.16));
  --kb-hover: var(--dsw-alias-interactive-bg-hover, rgba(17, 24, 39, 0.05));
  --kb-active: var(--dsw-alias-interactive-bg-active, rgba(17, 24, 39, 0.09));
  --kb-brand: var(--dsw-alias-brand-primary, #4d6bfe);
  --kb-on-accent: var(--dsw-alias-label-primary-inverted, #ffffff);
  --kb-danger: var(--dsw-alias-state-error-primary, #e5484d);
  --kb-success: var(--dsw-alias-state-success-primary, #2f9e6a);
  --kb-r-xs: var(--dsw-radius-xs, 4px);
  --kb-r-sm: var(--dsw-radius-sm, 8px);
  --kb-r-md: var(--dsw-radius-md, 12px);
  --kb-r-lg: var(--dsw-radius-lg, 16px);
  --kb-shadow-pop: var(--dsw-elevation-prominent, 0 0 0 0.5px rgba(17,24,39,.08), 0 6px 16px rgba(0,0,0,.08), 0 0 28px rgba(0,0,0,.06));
  --kb-shadow-card: 0 1px 2px color-mix(in srgb, var(--kb-fg) 6%, transparent);
  --kb-focus: 0 0 0 2px color-mix(in srgb, var(--kb-brand) 45%, transparent);
  --kb-font: var(--dsw-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif);
  --kb-c-todo: #8a93a6;
  --kb-c-doing: #4d6bfe;
  --kb-c-review: #e09a00;
  --kb-c-done: var(--kb-success);
`

export const CSS = `
.kb-root {${TOKENS}
  position: relative; height: 100%; min-height: 0; display: flex; flex-direction: column;
  font-family: var(--kb-font); color: var(--kb-fg); font-size: 13px; line-height: 1.45;
  container-type: inline-size; container-name: kb;
}
.kb-root *, .kb-root *::before, .kb-root *::after { box-sizing: border-box; }
.kb-scroll { flex: 1; min-height: 0; overflow: auto; scrollbar-width: thin; scrollbar-color: var(--dsw-alias-scrollbar-bg-l2, rgba(0,0,0,.15)) transparent; }
.kb-inner { max-width: 1480px; margin: 0 auto; padding: 28px 32px 64px; }

/* buttons */
.kb-btn { display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 12px; border-radius: var(--kb-r-sm);
  border: 1px solid var(--kb-border-2); background: var(--kb-surface); color: var(--kb-fg); font: inherit; font-weight: 500; cursor: pointer;
  transition: background .15s, border-color .15s, box-shadow .15s, transform .1s; white-space: nowrap; }
.kb-btn:hover { background: var(--kb-hover); }
.kb-btn:active { transform: translateY(.5px); }
.kb-btn:focus-visible, .kb-icon-btn:focus-visible, .kb-check:focus-visible, .kb-input:focus-visible, .kb-textarea:focus-visible, .kb-menu-item:focus-visible, .kb-swatch:focus-visible { outline: none; box-shadow: var(--kb-focus); }
.kb-btn-primary { background: var(--kb-brand); border-color: transparent; color: var(--kb-on-accent); }
.kb-btn-primary:hover { background: color-mix(in srgb, var(--kb-brand) 88%, #000); }
.kb-btn-danger { background: var(--kb-danger); border-color: transparent; color: #fff; }
.kb-btn-danger:hover { background: color-mix(in srgb, var(--kb-danger) 88%, #000); }
.kb-btn-ghost { border-color: transparent; background: transparent; color: var(--kb-fg-2); }
.kb-btn-ghost:hover { background: var(--kb-hover); color: var(--kb-fg); }
.kb-btn-sm { height: 28px; padding: 0 10px; font-size: 12.5px; }
.kb-btn:disabled { opacity: .5; cursor: default; }
.kb-icon-btn { display: inline-grid; place-items: center; width: 26px; height: 26px; border-radius: var(--kb-r-xs); border: 0; background: transparent;
  color: var(--kb-fg-3); cursor: pointer; transition: background .15s, color .15s; padding: 0; flex: none; }
.kb-icon-btn:hover { background: var(--kb-hover); color: var(--kb-fg); }
.kb-icon-btn.is-danger:hover { color: var(--kb-danger); background: color-mix(in srgb, var(--kb-danger) 10%, transparent); }

/* header */
.kb-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 22px; flex-wrap: wrap; }
.kb-title { display: flex; align-items: center; gap: 10px; margin: 0; font-size: 22px; font-weight: 650; letter-spacing: -.01em; }
.kb-title-mark { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 10px; color: var(--kb-brand);
  background: color-mix(in srgb, var(--kb-brand) 12%, transparent); }
.kb-subtitle { margin: 6px 0 0 44px; color: var(--kb-fg-3); font-size: 12.5px; display: flex; gap: 14px; flex-wrap: wrap; }
.kb-subtitle b { color: var(--kb-fg); font-weight: 600; font-variant-numeric: tabular-nums; }
.kb-header-actions { display: flex; align-items: center; gap: 10px; }
.kb-status { display: inline-flex; align-items: center; gap: 6px; height: 26px; padding: 0 10px; border-radius: 999px; font-size: 12px; color: var(--kb-fg-3); background: var(--kb-sunk); }
.kb-status i { width: 6px; height: 6px; border-radius: 50%; background: var(--kb-success); }
.kb-status.is-saving i { background: var(--kb-brand); animation: kb-pulse 1s ease-in-out infinite; }
.kb-status.is-offline { color: var(--kb-c-review); background: color-mix(in srgb, var(--kb-c-review) 12%, transparent); }
.kb-status.is-offline i { background: var(--kb-c-review); }

/* new project form */
.kb-new-project { display: flex; gap: 8px; align-items: center; padding: 12px; margin-bottom: 16px; border-radius: var(--kb-r-lg);
  border: 1px dashed var(--kb-border-2); background: var(--kb-sunk); animation: kb-pop .16s ease-out; flex-wrap: wrap; }
.kb-new-project .kb-input { flex: 1 1 220px; }

/* inputs */
.kb-input, .kb-textarea { width: 100%; font: inherit; color: var(--kb-fg); background: var(--kb-surface); border: 1px solid var(--kb-border-2);
  border-radius: var(--kb-r-sm); padding: 6px 10px; transition: border-color .15s, box-shadow .15s; }
.kb-input { height: 32px; }
.kb-input:focus, .kb-textarea:focus { outline: none; border-color: var(--kb-brand); box-shadow: var(--kb-focus); }
.kb-input::placeholder, .kb-textarea::placeholder { color: var(--kb-fg-4); }
.kb-textarea { resize: vertical; min-height: 56px; line-height: 1.5; }
.kb-hint { font-size: 11.5px; color: var(--kb-fg-4); }
.kb-hint.is-error { color: var(--kb-danger); }

/* project section */
.kb-projects { display: flex; flex-direction: column; gap: 18px; }
.kb-project { --kb-accent: var(--kb-brand); background: var(--kb-surface); border: 1px solid var(--kb-border); border-radius: var(--kb-r-lg);
  box-shadow: var(--kb-shadow-card); overflow: visible; animation: kb-pop .2s ease-out; }
.kb-project-head { display: flex; align-items: center; gap: 10px; padding: 12px 14px 12px 12px; position: relative; }
.kb-project-head::before { content: ""; position: absolute; left: 0; top: 14px; bottom: 14px; width: 3px; border-radius: 0 3px 3px 0; background: var(--kb-accent); }
.kb-collapse { transition: transform .18s; }
.kb-project:not(.is-collapsed) .kb-collapse { transform: rotate(90deg); }
.kb-project-name { font-size: 15px; font-weight: 620; margin: 0; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: text; border-radius: var(--kb-r-xs); padding: 2px 4px; }
.kb-project-name:hover { background: var(--kb-hover); }
.kb-project-name-input { font-size: 15px; font-weight: 620; height: 30px; max-width: 360px; }
.kb-chips { display: flex; gap: 6px; flex-wrap: wrap; }
.kb-chip { display: inline-flex; align-items: center; gap: 5px; height: 22px; padding: 0 8px; border-radius: 999px; background: var(--kb-sunk);
  color: var(--kb-fg-3); font-size: 11.5px; font-variant-numeric: tabular-nums; }
.kb-chip i { width: 6px; height: 6px; border-radius: 50%; background: var(--c); }
.kb-progress { margin-left: auto; display: flex; align-items: center; gap: 8px; color: var(--kb-fg-3); font-size: 12px; font-variant-numeric: tabular-nums; flex: none; }
.kb-progress-bar { width: 96px; height: 6px; border-radius: 999px; background: var(--kb-sunk-2); overflow: hidden; }
.kb-progress-bar > span { display: block; height: 100%; border-radius: inherit; background: var(--kb-c-done); transition: width .35s cubic-bezier(.2,.8,.2,1); }
.kb-project-body { padding: 0 12px 12px; }
.kb-project.is-collapsed .kb-project-body { display: none; }

/* columns */
.kb-columns { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
.kb-column { --c: var(--kb-c-todo); display: flex; flex-direction: column; min-width: 0; background: var(--kb-sunk); border-radius: var(--kb-r-md);
  padding: 8px; min-height: 140px; border: 1px solid transparent; transition: border-color .15s, background .15s; }
.kb-column[data-column="doing"] { --c: var(--kb-c-doing); }
.kb-column[data-column="review"] { --c: var(--kb-c-review); }
.kb-column[data-column="done"] { --c: var(--kb-c-done); }
.kb-column.is-drop { border-color: color-mix(in srgb, var(--c) 60%, transparent); background: color-mix(in srgb, var(--c) 7%, var(--kb-sunk)); }
.kb-column-head { display: flex; align-items: center; gap: 7px; padding: 2px 4px 8px; color: var(--kb-fg-2); font-weight: 600; font-size: 12.5px; }
.kb-column-head > svg { color: var(--c); flex: none; }
.kb-count { min-width: 20px; height: 18px; padding: 0 6px; border-radius: 999px; background: var(--kb-sunk-2); color: var(--kb-fg-3);
  font-size: 11px; font-weight: 600; display: inline-grid; place-items: center; font-variant-numeric: tabular-nums; }
.kb-column-head .kb-icon-btn { margin-left: auto; width: 24px; height: 24px; }
.kb-cards { display: flex; flex-direction: column; gap: 6px; flex: 1; min-height: 40px; }
.kb-placeholder { flex: 1; display: grid; place-items: center; min-height: 56px; border: 1px dashed var(--kb-border-2); border-radius: var(--kb-r-sm);
  color: var(--kb-fg-4); font-size: 12px; text-align: center; padding: 10px; }
.kb-add-task { display: flex; align-items: center; gap: 6px; width: 100%; margin-top: 6px; height: 30px; padding: 0 8px; border: 0; border-radius: var(--kb-r-sm);
  background: transparent; color: var(--kb-fg-3); font: inherit; cursor: pointer; transition: background .15s, color .15s; }
.kb-add-task:hover { background: var(--kb-hover); color: var(--kb-fg); }

/* card */
.kb-card { position: relative; display: flex; gap: 8px; align-items: flex-start; padding: 9px 8px 9px 9px; background: var(--kb-surface);
  border: 1px solid var(--kb-border); border-radius: var(--kb-r-sm); box-shadow: var(--kb-shadow-card); cursor: grab;
  transition: box-shadow .15s, border-color .15s, transform .15s, opacity .15s; }
.kb-card:hover { border-color: var(--kb-border-2); box-shadow: 0 2px 8px color-mix(in srgb, var(--kb-fg) 8%, transparent); }
.kb-card.is-dragging { opacity: .35; }
.kb-card.is-landed { animation: kb-land .9s ease-out; }
.kb-card.is-editing { cursor: default; flex-direction: column; gap: 6px; border-color: var(--kb-brand); box-shadow: var(--kb-focus); }
.kb-drop-line { height: 2px; border-radius: 2px; background: var(--c); margin: -4px 2px; }
.kb-check { flex: none; width: 18px; height: 18px; margin-top: 1px; border-radius: 50%; border: 1.6px solid color-mix(in srgb, var(--c) 75%, var(--kb-fg-4));
  background: transparent; color: transparent; display: grid; place-items: center; cursor: pointer; padding: 0;
  transition: background .15s, color .15s, border-color .15s, transform .12s; }
.kb-check:hover { background: color-mix(in srgb, var(--c) 16%, transparent); color: var(--c); border-color: var(--c); }
.kb-check:active { transform: scale(.88); }
.kb-check.is-done { background: var(--kb-c-done); border-color: var(--kb-c-done); color: #fff; cursor: default; }
.kb-card-main { min-width: 0; flex: 1; }
.kb-card-title { margin: 0; font-size: 13px; font-weight: 500; color: var(--kb-fg); word-break: break-word; }
.kb-column[data-column="done"] .kb-card-title { color: var(--kb-fg-3); text-decoration: line-through; text-decoration-color: color-mix(in srgb, var(--kb-fg-3) 50%, transparent); }
.kb-card-note { margin: 3px 0 0; color: var(--kb-fg-3); font-size: 12px; white-space: pre-wrap; word-break: break-word;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.kb-card-meta { margin-top: 5px; display: flex; gap: 8px; color: var(--kb-fg-4); font-size: 11px; font-variant-numeric: tabular-nums; }
.kb-card-actions { position: absolute; top: 5px; right: 5px; display: flex; gap: 1px; padding: 1px; border-radius: var(--kb-r-sm);
  background: var(--kb-surface); box-shadow: 0 0 0 1px var(--kb-border); opacity: 0; pointer-events: none; transition: opacity .12s; }
.kb-card:hover .kb-card-actions, .kb-card:focus-within .kb-card-actions, .kb-card-actions.is-open { opacity: 1; pointer-events: auto; }
.kb-card-actions .kb-icon-btn { width: 24px; height: 24px; }
.kb-edit-row { display: flex; justify-content: space-between; align-items: center; gap: 6px; }
.kb-edit-row > div { display: flex; gap: 6px; }

/* menu */
.kb-menu-anchor { position: relative; display: inline-flex; }
.kb-menu { position: absolute; z-index: 40; top: calc(100% + 4px); right: 0; min-width: 180px; padding: 5px; border-radius: var(--kb-r-md);
  background: var(--kb-surface); box-shadow: var(--kb-shadow-pop); animation: kb-pop .12s ease-out; }
.kb-menu-label { padding: 6px 8px 4px; font-size: 11px; color: var(--kb-fg-4); font-weight: 600; }
.kb-menu-item { display: flex; align-items: center; gap: 8px; width: 100%; height: 30px; padding: 0 8px; border: 0; border-radius: var(--kb-r-xs);
  background: transparent; color: var(--kb-fg); font: inherit; font-size: 12.5px; cursor: pointer; text-align: left; white-space: nowrap; }
.kb-menu-item:hover:not(:disabled) { background: var(--kb-hover); }
.kb-menu-item:disabled { color: var(--kb-fg-4); cursor: default; }
.kb-menu-item > svg { color: var(--kb-fg-3); flex: none; }
.kb-menu-item.is-danger, .kb-menu-item.is-danger > svg { color: var(--kb-danger); }
.kb-menu-sep { height: 1px; margin: 4px 2px; background: var(--kb-border); }
.kb-swatches { display: flex; gap: 6px; padding: 4px 8px 6px; }
.kb-swatch { width: 18px; height: 18px; border-radius: 50%; border: 0; padding: 0; cursor: pointer; background: var(--s);
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.08); transition: transform .12s; }
.kb-swatch:hover { transform: scale(1.12); }
.kb-swatch.is-current { box-shadow: 0 0 0 2px var(--kb-surface), 0 0 0 3.5px var(--s); }

/* empty state */
.kb-empty { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 72px 24px; border: 1px dashed var(--kb-border-2);
  border-radius: var(--kb-r-lg); background: var(--kb-sunk); animation: kb-pop .25s ease-out; }
.kb-empty h2 { margin: 18px 0 6px; font-size: 16px; font-weight: 620; }
.kb-empty p { margin: 0 0 18px; color: var(--kb-fg-3); max-width: 420px; }
.kb-empty-flow { display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap; justify-content: center; margin-bottom: 20px; }
.kb-art-col { fill: var(--kb-surface); stroke: var(--kb-border); }
.kb-art-card { fill: var(--kb-sunk-2); }
.kb-art-head { opacity: .85; }
.kb-art-c0 { fill: var(--kb-c-todo); } .kb-art-c1 { fill: var(--kb-c-doing); } .kb-art-c2 { fill: var(--kb-c-review); } .kb-art-c3 { fill: var(--kb-c-done); }
.kb-loading { display: grid; gap: 18px; }
.kb-skeleton { height: 220px; border-radius: var(--kb-r-lg); background: linear-gradient(90deg, var(--kb-sunk) 0%, var(--kb-sunk-2) 50%, var(--kb-sunk) 100%);
  background-size: 200% 100%; animation: kb-shimmer 1.4s linear infinite; }
.kb-error { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 56px 24px; color: var(--kb-fg-2); text-align: center; }
.kb-error > svg { color: var(--kb-danger); }

/* toasts + dialog */
.kb-toasts { position: absolute; left: 50%; bottom: 20px; transform: translateX(-50%); display: flex; flex-direction: column; gap: 8px; z-index: 60; pointer-events: none; align-items: center; width: max-content; max-width: calc(100% - 32px); }
.kb-toast { pointer-events: auto; display: flex; align-items: center; gap: 10px; padding: 8px 8px 8px 14px; border-radius: var(--kb-r-md);
  background: color-mix(in srgb, var(--kb-fg) 92%, var(--kb-surface)); color: var(--kb-surface); box-shadow: var(--kb-shadow-pop); font-size: 12.5px; animation: kb-rise .18s ease-out; }
.kb-toast.is-error { background: var(--kb-danger); color: #fff; }
.kb-toast .kb-btn { height: 26px; background: transparent; color: inherit; border-color: color-mix(in srgb, currentColor 35%, transparent); }
.kb-toast .kb-btn:hover { background: color-mix(in srgb, currentColor 14%, transparent); }
.kb-toast .kb-icon-btn { color: inherit; opacity: .7; }
.kb-toast .kb-icon-btn:hover { opacity: 1; background: color-mix(in srgb, currentColor 14%, transparent); color: inherit; }
.kb-overlay { position: absolute; inset: 0; z-index: 70; display: grid; place-items: center; padding: 16px; background: var(--dsw-alias-bg-mask-1, rgba(0,0,0,.28)); animation: kb-fade .15s ease-out; }
.kb-dialog { width: min(420px, 100%); padding: 20px; border-radius: var(--kb-r-lg); background: var(--kb-surface); box-shadow: var(--kb-shadow-pop); animation: kb-pop .16s ease-out; }
.kb-dialog h3 { margin: 0 0 8px; font-size: 15px; font-weight: 620; }
.kb-dialog p { margin: 0 0 18px; color: var(--kb-fg-2); }
.kb-dialog-actions { display: flex; justify-content: flex-end; gap: 8px; }
.kb-sr { position: absolute !important; width: 1px; height: 1px; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

/* sidebar glyph */
.kb-entry { display: inline-grid; place-items: center; color: currentColor; }

@keyframes kb-pop { from { opacity: 0; transform: translateY(4px) scale(.985); } to { opacity: 1; transform: none; } }
@keyframes kb-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@keyframes kb-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes kb-pulse { 0%, 100% { opacity: .35; } 50% { opacity: 1; } }
@keyframes kb-shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
@keyframes kb-land { 0% { transform: scale(.97); box-shadow: 0 0 0 3px color-mix(in srgb, var(--c) 45%, transparent); } 60% { box-shadow: 0 0 0 3px color-mix(in srgb, var(--c) 20%, transparent); } 100% { transform: none; } }
@media (prefers-reduced-motion: reduce) { .kb-root *, .kb-root *::before, .kb-root *::after { animation: none !important; transition: none !important; } }

/* responsive: follow the width of the main area, not the window */
@container kb (max-width: 980px) { .kb-columns { grid-template-columns: repeat(2, minmax(0, 1fr)); } .kb-chips { display: none; } }
@container kb (max-width: 640px) {
  .kb-inner { padding: 18px 14px 56px; }
  .kb-progress-bar { width: 56px; }
  .kb-subtitle { margin-left: 0; }
}
@container kb (max-width: 520px) { .kb-columns { grid-template-columns: minmax(0, 1fr); } .kb-column { min-height: 0; } }
`

/** Inject the stylesheet once. */
export function ensureStyles(): void {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID) !== null) return
  const element = document.createElement('style')
  element.id = STYLE_ID
  element.textContent = CSS
  document.head.appendChild(element)
}
