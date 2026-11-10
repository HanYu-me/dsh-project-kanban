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

/* records page */
.kb-root [hidden] { display: none !important; }
.kb-open-records { color: var(--kb-fg-2); }
.kb-open-records .kb-count { background: color-mix(in srgb, var(--kb-accent) 16%, transparent); color: var(--kb-accent); }
.kb-project-name { cursor: pointer; }
.kb-rec { --kb-accent: var(--kb-brand); --c: var(--kb-accent); }
.kb-rec-head { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin-bottom: 20px; }
.kb-back { flex: none; }
.kb-rec-heading { flex: 1 1 240px; min-width: 0; }
.kb-rec-title { display: flex; align-items: center; gap: 10px; margin: 0; font-size: 20px; font-weight: 650; letter-spacing: -.01em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.kb-rec-title::before { content: ""; flex: none; width: 10px; height: 10px; border-radius: 50%; background: var(--kb-accent); }
.kb-rec-heading .kb-subtitle { margin: 4px 0 0 20px; }
.kb-selbar { position: sticky; top: 0; z-index: 8; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin: 0 0 12px; padding: 8px 10px 8px 14px;
  border-radius: var(--kb-r-md); background: var(--kb-surface); box-shadow: var(--kb-shadow-pop); animation: kb-pop .14s ease-out; }
.kb-selbar .kb-hint { margin-right: auto; }
.kb-empty-actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.kb-empty > svg { color: var(--kb-fg-4); }

.kb-diagram { position: relative; isolation: isolate; display: grid; align-items: start; grid-template-columns: minmax(0, 1fr) clamp(56px, 12cqw, 190px) minmax(0, 1fr) clamp(36px, 6cqw, 84px); }
.kb-diagram.is-connecting { user-select: none; -webkit-user-select: none; cursor: crosshair; }
.kb-diagram.is-connecting .kb-node-actions { opacity: 0; pointer-events: none; }
.kb-gutter { display: flex; justify-content: center; padding: 76px 6px 0; text-align: center; color: var(--kb-fg-4); font-size: 11.5px; line-height: 1.5; }
.kb-gutter span { max-width: 140px; }
.kb-tree { min-width: 0; background: var(--kb-surface); border: 1px solid var(--kb-border); border-radius: var(--kb-r-lg); box-shadow: var(--kb-shadow-card); }
.kb-tree-head { display: flex; align-items: center; gap: 8px; padding: 9px 10px 9px 14px; border-bottom: 1px solid var(--kb-border); }
.kb-tree-head h2 { margin: 0; font-size: 13.5px; font-weight: 640; }
.kb-tree-head .kb-btn { margin-left: auto; }
.kb-tree-body { padding: 6px 0 8px; min-height: 84px; }
.kb-tree-body.is-drop-end { box-shadow: inset 0 -2px 0 var(--kb-accent); }
.kb-tree-body > .kb-placeholder { margin: 8px 12px; min-height: 72px; }

/* rows */
.kb-node-line { position: relative; }
.kb-node-row { position: relative; display: flex; align-items: center; gap: 4px; min-height: 34px; padding: 2px 10px 2px calc(8px + var(--depth, 0) * 18px);
  cursor: grab; transition: background .12s, box-shadow .12s, opacity .12s; }
.kb-tree[data-side="result"] .kb-node-row { padding-right: 14px; }
.kb-node-row:hover { background: var(--kb-hover); }
.kb-node-row.is-within { background: color-mix(in srgb, var(--kb-accent) 5%, transparent); }
.kb-node-row.is-focus { background: color-mix(in srgb, var(--kb-accent) 10%, transparent); }
.kb-node-row.is-linked { background: color-mix(in srgb, var(--kb-accent) 13%, transparent); box-shadow: inset 3px 0 0 var(--kb-accent); }
.kb-node-row.is-selected { background: color-mix(in srgb, var(--kb-brand) 11%, transparent); }
.kb-node-row.is-dragging { opacity: .4; }
.kb-node-row.is-landed { animation: kb-land .9s ease-out; }
.kb-node-row.is-drop-before { box-shadow: inset 0 2px 0 var(--kb-accent); }
.kb-node-row.is-drop-after { box-shadow: inset 0 -2px 0 var(--kb-accent); }
.kb-node-row.is-drop-child { box-shadow: inset 0 -2px 0 var(--kb-accent); }
.kb-node-row.is-drop-child::after { content: ""; position: absolute; left: calc(8px + (var(--depth, 0) + 1) * 18px + 24px); right: 0; bottom: 0; height: 2px; background: var(--kb-accent); box-shadow: -999px 0 0 var(--kb-surface); }
.kb-node-row.is-drop-inside { box-shadow: inset 0 0 0 2px var(--kb-accent); background: color-mix(in srgb, var(--kb-accent) 10%, transparent); }
.kb-node-row.can-link { cursor: crosshair; }
.kb-node-row.is-link-target { background: color-mix(in srgb, var(--kb-accent) 16%, transparent); box-shadow: inset 0 0 0 2px var(--kb-accent); }
.kb-node-chevron { flex: none; display: inline-grid; place-items: center; width: 18px; height: 22px; padding: 0; border: 0; border-radius: var(--kb-r-xs); background: transparent; color: var(--kb-fg-3); cursor: pointer; }
.kb-node-chevron:hover { background: var(--kb-active); color: var(--kb-fg); }
.kb-node-chevron.is-blank { cursor: default; pointer-events: none; }
.kb-node-chevron svg { transition: transform .15s; }
.kb-node-chevron svg.is-down { transform: rotate(90deg); }
.kb-node-icon { flex: none; position: relative; display: grid; place-items: center; width: 22px; height: 22px; padding: 0; border: 0; border-radius: 6px; background: transparent; color: var(--kb-fg-3); cursor: pointer; }
.kb-node-icon > span { grid-area: 1 / 1; display: grid; place-items: center; transition: opacity .1s; }
.kb-node-icon:focus-visible { outline: none; box-shadow: var(--kb-focus); }
.kb-node-glyph { color: var(--kb-node-color, inherit); }
.kb-node-glyph.is-group { color: var(--kb-node-color, var(--kb-accent)); }
.kb-node-box { width: 16px; height: 16px; border-radius: 5px; border: 1.5px solid var(--kb-border-2); background: var(--kb-surface); color: transparent; opacity: 0; }
.kb-node-row:hover .kb-node-box, .kb-node-icon:focus-visible .kb-node-box, .kb-diagram.has-selection .kb-node-box { opacity: 1; }
.kb-node-row:hover .kb-node-glyph, .kb-node-icon:focus-visible .kb-node-glyph, .kb-diagram.has-selection .kb-node-glyph { opacity: 0; }
.kb-node-row.is-selected .kb-node-box { opacity: 1; background: var(--kb-brand); border-color: var(--kb-brand); color: #fff; }
.kb-node-row.is-selected .kb-node-glyph { opacity: 0; }
.kb-node-name { flex: 0 1 auto; min-width: 0; margin: 0 2px; padding: 3px 4px; border: 0; border-radius: var(--kb-r-xs); background: transparent; color: var(--kb-fg); font: inherit; font-weight: 500;
  text-align: left; cursor: pointer; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.kb-node-name:hover { background: var(--kb-active); }
.kb-node-name:focus-visible { outline: none; box-shadow: var(--kb-focus); }
.kb-node-row.is-open .kb-node-name { color: var(--kb-accent); }
.kb-node-rename { flex: 1; height: 26px; min-width: 60px; }
.kb-node-count, .kb-node-links { flex: none; display: inline-flex; align-items: center; gap: 3px; height: 18px; padding: 0 6px; border-radius: 999px; background: var(--kb-sunk-2); color: var(--kb-fg-3); font-size: 11px; font-weight: 600; font-variant-numeric: tabular-nums; }
.kb-node-links { background: color-mix(in srgb, var(--kb-accent) 14%, transparent); color: var(--kb-accent); }
.kb-node-actions { position: absolute; top: 4px; right: 12px; display: flex; gap: 1px; padding: 1px; border-radius: var(--kb-r-sm); background: var(--kb-surface); box-shadow: 0 0 0 1px var(--kb-border);
  opacity: 0; pointer-events: none; transition: opacity .12s; }
.kb-node-row:hover .kb-node-actions, .kb-node-row:focus-within .kb-node-actions { opacity: 1; pointer-events: auto; }
.kb-node-actions .kb-icon-btn { width: 24px; height: 24px; }

/* link ports: the dots on the inner edge of each tree */
.kb-port { position: absolute; top: 50%; z-index: 4; width: 12px; height: 12px; margin-top: -6px; border-radius: 50%; border: 2px solid var(--kb-accent); background: var(--kb-surface);
  cursor: crosshair; touch-action: none; transition: transform .12s, background .12s; }
.kb-tree[data-side="data"] .kb-port-main { right: -7px; }
.kb-tree[data-side="result"] .kb-port-main { left: -7px; }
.kb-port { border-color: var(--kb-node-color, var(--kb-accent)); }
.kb-port.has-links { background: var(--kb-node-color, var(--kb-accent)); }
.kb-port:hover { transform: scale(1.35); }
.kb-diagram.is-connecting .kb-port { pointer-events: none; }
/* The relation node: a diamond on the far right edge of each result, in the colour of the lines between results. The round dots stay for data. */
.kb-tree[data-side="result"] .kb-port-right { left: auto; right: -8px; width: 11px; height: 11px; margin-top: -5.5px; border-radius: 2.5px; border-color: var(--kb-edge); transform: rotate(45deg); }
.kb-tree[data-side="result"] .kb-port-right::before { content: ""; position: absolute; inset: -9px; }
.kb-tree[data-side="result"] .kb-port-right.has-links { background: var(--kb-edge); }
.kb-tree[data-side="result"] .kb-port-right:hover { transform: rotate(45deg) scale(1.3); }
/* While one kind of line is being drawn, the nodes of the other kind step back and the ones that can take it light up. */
.kb-diagram.is-relating .kb-port-main, .kb-diagram.is-linking .kb-port-right { opacity: .22; }
.kb-diagram.is-relating .kb-tree[data-side="result"] .kb-port-right.is-ready { box-shadow: 0 0 0 4px color-mix(in srgb, var(--kb-edge) 26%, transparent); }
.kb-diagram.is-relating .kb-tree[data-side="result"] .kb-port-right.is-source { background: var(--kb-accent); border-color: var(--kb-accent); }
.kb-diagram.is-relating .kb-tree[data-side="result"] .kb-port-right.is-target { background: var(--kb-accent); border-color: var(--kb-accent); transform: rotate(45deg) scale(1.45); box-shadow: 0 0 0 5px color-mix(in srgb, var(--kb-accent) 24%, transparent); }

/* the card that opens under a row */
.kb-rec-card, .kb-rec-form { margin: 2px 12px 8px calc(8px + var(--depth, 0) * 18px + 46px); padding: 10px 12px; border: 1px solid var(--kb-border); border-radius: var(--kb-r-md);
  background: var(--kb-sunk); animation: kb-pop .14s ease-out; }
.kb-rec-card { display: grid; gap: 10px; cursor: default; }
.kb-rec-form { display: flex; flex-direction: column; gap: 6px; background: var(--kb-surface); border-color: var(--kb-brand); box-shadow: var(--kb-focus); }
.kb-rec-fields { display: grid; gap: 8px; margin: 0; }
.kb-rec-fields dt { font-size: 11px; font-weight: 600; color: var(--kb-fg-4); }
.kb-rec-fields dd { display: flex; align-items: flex-start; gap: 6px; margin: 2px 0 0; min-width: 0; }
.kb-rec-path { word-break: break-all; user-select: text; }
.kb-rec-desc { white-space: pre-wrap; word-break: break-word; user-select: text; }
.kb-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 12px; }
.kb-muted { color: var(--kb-fg-4); }
.kb-rec-links-head { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; font-size: 11px; font-weight: 600; color: var(--kb-fg-4); }
.kb-rec-chips { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-size: 12px; }
.kb-link-chip { display: inline-flex; align-items: center; height: 24px; border-radius: 999px; background: color-mix(in srgb, var(--kb-accent) 12%, transparent); color: var(--kb-fg); max-width: 100%; }
.kb-link-chip-name, .kb-link-chip-x { border: 0; background: transparent; color: inherit; font: inherit; cursor: pointer; }
.kb-link-chip-name { padding: 0 4px 0 10px; height: 100%; border-radius: 999px 0 0 999px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 220px; }
.kb-link-chip-x { display: grid; place-items: center; width: 22px; height: 100%; border-radius: 0 999px 999px 0; color: var(--kb-fg-3); padding: 0; }
.kb-link-chip-name:hover, .kb-link-chip-x:hover { background: color-mix(in srgb, var(--kb-accent) 18%, transparent); }
.kb-link-chip-x:hover { color: var(--kb-danger); }
.kb-link-chip-name:focus-visible, .kb-link-chip-x:focus-visible { outline: none; box-shadow: var(--kb-focus); }
.kb-select { height: 24px; max-width: min(220px, 100%); padding: 0 6px; border: 1px dashed var(--kb-border-2); border-radius: 999px; background: transparent; color: var(--kb-fg-3); font: inherit; font-size: 12px; cursor: pointer; }
.kb-select:hover { color: var(--kb-fg); border-color: var(--kb-fg-4); }
.kb-select:focus-visible { outline: none; box-shadow: var(--kb-focus); }
.kb-rec-foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.kb-rec-foot > div { display: flex; gap: 4px; }

/* lines between the trees */
.kb-links { position: absolute; inset: 0; z-index: 3; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
.kb-rec { --kb-edge: color-mix(in srgb, var(--kb-accent) 55%, var(--kb-fg-4)); }
.kb-link-line { fill: none; stroke: var(--kb-line, var(--kb-edge)); stroke-width: 1.6; stroke-linecap: round; opacity: .8; transition: opacity .15s, stroke-width .15s; }
.kb-link-arrow { fill: var(--kb-line, var(--kb-edge)); opacity: .9; transition: opacity .15s; }
.kb-link.is-hot:not(.has-color) .kb-link-arrow { fill: var(--kb-accent); }
.kb-link.is-dim .kb-link-arrow { opacity: .15; }
.kb-link.is-folded .kb-link-line { stroke-dasharray: 5 4; }
.kb-link.is-hot .kb-link-line { stroke-width: 2.6; opacity: 1; }
.kb-link.is-hot:not(.has-color) .kb-link-line { stroke: var(--kb-accent); }
.kb-link.is-dim .kb-link-line { opacity: .13; }
.kb-link-hit { fill: none; stroke: transparent; stroke-width: 14; pointer-events: stroke; cursor: pointer; }
.kb-link-temp { fill: none; stroke: var(--kb-accent); stroke-width: 2.2; stroke-dasharray: 5 4; stroke-linecap: round; }
.kb-link-del { display: grid; place-items: center; flex: none; width: 22px; height: 22px; padding: 0; border: 0; border-radius: 50%; background: transparent; color: var(--kb-fg-3); cursor: pointer; }
.kb-link-del:hover { color: #fff; background: var(--kb-danger); }
.kb-link-del:focus-visible { outline: none; box-shadow: var(--kb-focus); }
@container kb (max-width: 640px) {
  .kb-diagram { grid-template-columns: minmax(0, 1fr) 40px minmax(0, 1fr) 26px; }
  /* Keep the gutter elements (they are grid cells); only their hint text goes. */
  .kb-gutter > span { display: none; }
  .kb-node-count { display: none; }
  .kb-node-row { gap: 2px; padding-left: calc(6px + var(--depth, 0) * 12px); }
  /* The counts (🔗 2, ⇆ 1) push the names out of the row and over the right node; the filled nodes and the card say the same. */
  .kb-node-links { display: none; }
  .kb-node-star:not(.is-on) { display: none; }
  .kb-node-row:hover .kb-node-star:not(.is-on) { display: inline-grid; }
  .kb-rec-card, .kb-rec-form { margin-left: 10px; margin-right: 10px; }
  .kb-tree-head .kb-btn { padding: 0 8px; }
}
/* Very narrow: the header keeps its title on one line (the add button is just the +), and long names take a second line instead of being cut to a stub. */
@container kb (max-width: 460px) {
  .kb-tree-head { gap: 6px; padding: 9px 8px 9px 12px; }
  .kb-tree-head h2 { white-space: nowrap; }
  .kb-add-text { display: none; }
  .kb-tree-head .kb-btn { padding: 0 6px; }
  /* No vertical padding (a third line would show through it), a margin instead. */
  .kb-node-name { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; white-space: normal; overflow: hidden; word-break: break-word; line-height: 1.3; padding: 0 4px; margin: 4px 2px; }
  .kb-node-row { padding-right: 10px; }
  .kb-tree[data-side="result"] .kb-node-row { padding-right: 12px; }
}

/* header tools, stars, colours */
.kb-rec-tools { display: flex; align-items: center; gap: 6px; margin-left: auto; flex-wrap: wrap; }
.kb-btn-icon { width: 30px; padding: 0; justify-content: center; }
.kb-btn.is-on { background: var(--kb-active); }
.kb-star-toggle.is-on { background: color-mix(in srgb, var(--kb-star) 14%, var(--kb-surface)); border-color: color-mix(in srgb, var(--kb-star) 55%, transparent); }
.kb-star-toggle > svg { color: var(--kb-star); }
.kb-starbar { display: flex; align-items: center; gap: 10px; margin: 0 0 12px; padding: 8px 8px 8px 12px; border-radius: var(--kb-r-md);
  background: color-mix(in srgb, var(--kb-star) 10%, var(--kb-surface)); border: 1px solid color-mix(in srgb, var(--kb-star) 35%, transparent); font-size: 12.5px; color: var(--kb-fg-2); }
.kb-starbar > svg { flex: none; color: var(--kb-star); }
.kb-starbar > span { flex: 1; min-width: 0; }
.kb-starbar b { color: var(--kb-fg); font-weight: 600; }
.kb-node-star { flex: none; display: inline-grid; place-items: center; width: 22px; height: 22px; padding: 0; border: 0; border-radius: var(--kb-r-xs); background: transparent; color: var(--kb-fg-4); cursor: pointer; opacity: 0; transition: opacity .12s, color .12s, background .12s; }
.kb-node-row:hover .kb-node-star, .kb-node-star:focus-visible, .kb-node-star.is-on { opacity: 1; }
.kb-node-star:hover { background: var(--kb-active); color: var(--kb-star); }
.kb-node-star.is-on { color: var(--kb-star); }
.kb-node-star:focus-visible { outline: none; box-shadow: var(--kb-focus); }
.kb-node-line.is-context .kb-node-row { cursor: default; }
.kb-node-line.is-context .kb-node-name, .kb-node-line.is-context .kb-node-glyph { color: var(--kb-fg-4); font-weight: 450; }
.kb-node-links.is-relation { background: var(--kb-sunk-2); color: var(--kb-fg-3); }
.kb-gutter-right { flex-direction: column; align-items: center; padding: 0 2px; }
.kb-gutter-right span { writing-mode: vertical-rl; max-height: 220px; margin-top: 30px; }
.kb-rel-head { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; height: 46px; font-size: 10.5px; line-height: 1; color: var(--kb-fg-4); white-space: nowrap; cursor: default; }
.kb-rel-head::before { content: ""; width: 7px; height: 7px; border: 1.5px solid var(--kb-edge); border-radius: 1.5px; transform: rotate(45deg); }
.kb-pop-anchor { position: relative; display: inline-flex; }
.kb-palette { position: absolute; z-index: 45; top: calc(100% + 6px); right: 0; width: min(380px, 86vw); max-height: min(72vh, 680px); overflow: auto; padding: 6px 14px 14px;
  border-radius: var(--kb-r-lg); background: var(--kb-surface); box-shadow: var(--kb-shadow-pop); animation: kb-pop .12s ease-out; }
.kb-pal-section { padding-top: 10px; }
.kb-pal-section + .kb-pal-section { margin-top: 10px; border-top: 1px solid var(--kb-border); }
.kb-pal-section h3 { margin: 0 0 4px; font-size: 12.5px; font-weight: 640; }
.kb-pal-section > .kb-hint { margin: 0 0 6px; line-height: 1.5; }
.kb-pal-line { display: flex; align-items: center; gap: 8px; min-height: 30px; }
.kb-pal-line .kb-hint { margin-left: auto; font-variant-numeric: tabular-nums; }
.kb-pal-dotbtn { display: inline-flex; align-items: center; gap: 8px; padding: 3px 6px 3px 4px; border: 0; border-radius: var(--kb-r-xs); background: transparent; color: var(--kb-fg); font: inherit; cursor: pointer; }
.kb-pal-dotbtn:hover { background: var(--kb-hover); }
.kb-pal-dotbtn:focus-visible { outline: none; box-shadow: var(--kb-focus); }
.kb-dot { display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: var(--kb-border-2); box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .1); flex: none; }
.kb-pal-name { flex: 1; min-width: 0; height: 28px; }
.kb-pal-cat, .kb-pal-default { padding: 1px 0; }
.kb-colorpick { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 4px 4px 8px 26px; }
.kb-colorpick .kb-swatches { padding: 0; flex-wrap: wrap; max-width: 250px; }
.kb-hex { width: 86px; height: 26px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 12px; }
.kb-pal-add { padding: 6px 0 2px; }
.kb-pal-add .kb-swatches { padding: 6px 2px 0; }
.kb-rec-cats { display: grid; gap: 4px; }
.kb-pills { display: flex; flex-wrap: wrap; gap: 6px; }
.kb-pill { display: inline-flex; align-items: center; gap: 6px; height: 24px; padding: 0 10px; border: 1px solid var(--kb-border-2); border-radius: 999px; background: transparent; color: var(--kb-fg-2); font: inherit; font-size: 12px; cursor: pointer; }
.kb-pill i { width: 8px; height: 8px; border-radius: 50%; background: var(--pill, var(--kb-fg-4)); }
.kb-pill:hover { background: var(--kb-hover); }
.kb-pill.is-on { border-color: var(--pill, var(--kb-brand)); background: color-mix(in srgb, var(--pill, var(--kb-brand)) 14%, transparent); color: var(--kb-fg); }
.kb-pill.is-add { border-style: dashed; color: var(--kb-fg-3); }
.kb-pill:focus-visible { outline: none; box-shadow: var(--kb-focus); }
.kb-link-chip-glyph { display: grid; place-items: center; min-width: 22px; height: 100%; padding: 0 2px 0 8px; border: 0; background: transparent; color: var(--kb-fg-3); font: inherit; font-weight: 600; cursor: pointer; border-radius: 999px 0 0 999px; }
.kb-link-chip-glyph:hover { background: color-mix(in srgb, var(--kb-accent) 18%, transparent); color: var(--kb-fg); }
.kb-link-chip-glyph + .kb-link-chip-name { padding-left: 2px; border-radius: 0; }
.kb-line-tools { position: absolute; z-index: 5; display: flex; align-items: center; gap: 2px; padding: 3px; transform: translate(-50%, -50%); border: 1px solid var(--kb-border-2); border-radius: 999px;
  background: var(--kb-surface); box-shadow: var(--kb-shadow-card); }
.kb-line-btn { display: grid; place-items: center; width: 22px; height: 22px; padding: 0; border: 0; border-radius: 50%; background: transparent; color: var(--kb-fg-2); cursor: pointer; }
.kb-line-btn:hover { background: var(--kb-hover); color: var(--kb-fg); }
.kb-line-btn:focus-visible, .kb-link-del:focus-visible, .kb-cat-dot:focus-visible { outline: none; box-shadow: var(--kb-focus); }
.kb-cat-dot { flex: none; width: 14px; height: 14px; margin: 0 2px; padding: 0; border: 0; border-radius: 50%; background: var(--cat); cursor: pointer; box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .12); transition: transform .12s; }
.kb-cat-dot.is-default { background: transparent; box-shadow: inset 0 0 0 1.5px var(--kb-fg-4); }
.kb-cat-dot:hover { transform: scale(1.2); }
.kb-cat-dot.is-on { box-shadow: 0 0 0 2px var(--kb-surface), 0 0 0 3.5px var(--cat, var(--kb-fg-3)); }
.kb-cat-dot.is-default.is-on { box-shadow: 0 0 0 2px var(--kb-surface), 0 0 0 3.5px var(--kb-fg-3); }

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
  if (typeof document === 'undefined') return
  // DSH swaps a plugin live (the old page stays open), and the stylesheet of the version it replaced would stay in <head>: new markup with
  // old rules (a port with no shape, a button with the browser's default look). So an existing element is brought up to date, not trusted.
  // (and any sheet an earlier build left under another id would only add old rules to the new ones)
  for (const other of Array.from(document.querySelectorAll('style[id^="dsh-project-kanban"]'))) if (other.id !== STYLE_ID) other.remove()
  const existing = document.getElementById(STYLE_ID)
  if (existing !== null) {
    if (existing.textContent !== CSS) existing.textContent = CSS
    return
  }
  const element = document.createElement('style')
  element.id = STYLE_ID
  element.textContent = CSS
  document.head.appendChild(element)
}
