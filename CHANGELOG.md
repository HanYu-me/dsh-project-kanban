# Changelog

## 0.2.0 — 2026-11-10

Data and results for every project.

- Click a project's name (or the new「数据与结果」button in its header) to open that project's page: the key **data** as a tree on the left, the **results** as a tree on the right. Every node has a short name (the only thing the tree shows), a full path and a description; clicking a name opens a card with all of it (copy the path, edit in place).
- Arrange the trees by drag and drop: drop a node onto another to merge it in, onto a row's top or bottom edge to put it next to that row, onto the empty space to move it to the top level. Select several nodes (icon, or ⌘/Ctrl/Shift + click) to drag them together or **merge them into a new group** in one go. The node menu offers up / down / indent / outdent / dissolve / delete for when dragging is not an option.
- **Link** a result to the data it came from by dragging from a node's dot to a node on the other side (or from the card). Hovering or picking a node lights its links and the nodes on the other end; links of a folded group run to the group. Delete a link with the × on it.
- Deleting a node (with its subtree), dissolving a group and deleting a link can all be undone; deleting a group with children asks first.
- Stored in the same `board.json`: each project gets a `records` field (older files load unchanged). Loading repairs hand-edited records (missing parents, cycles, dangling links).
- **Stars.** Star data and results (the ☆ beside a name, the node menu, or the selection bar); a line with a starred end is drawn in the star colour (light red). **「只看星标」** is a filtered view of the same tree, not a copy: edits made there act on the whole tree, and a node created there is starred so it stays in view.
- **Undo / redo** with ⌘Z / ⇧⌘Z (Ctrl on other systems; header buttons too) on the records page: every action is one step, done by inverse ops so changes made by someone else in between survive; typing in a field keeps its own undo.
- **Relations between results**: every result has its own **relation node**, a diamond on its far right edge (a column titled 「关系」), apart from the round node on the left that links data. Drag from it to another result for a line on the right of the result tree, undirected by default, directed with Alt/Option on release (arrowhead), switchable and reversible from the line's toolbar or the result card. While drawing, the relation nodes that can take the line light up (results already related to the start do not), the data nodes step back, and the line snaps to the target's node.
- **Colours**: default colours for nodes, lines and stars, plus named categories for nodes and for lines (`新增节点/边类别：颜色`), assigned from the card, the selection bar or the line toolbar. Categories and relations are part of delete / undo.
- Fixed while testing in a real browser: opening a card after any change could put the page in an endless re-render (the port measurement now only updates state when something moved).
- `docs/AGENT.md`: how another conversation can fill the trees and links through the local API (ops reference, an example script that is safe to re-run, house rules).
- Behaviour change: clicking a project's name now opens the page instead of renaming; rename is in the project's ⋯ menu.
- The delete-project dialog also counts the recorded data and results.
- Fixes found while testing: refused drops no longer fall through to "move to the end"; narrow layouts keep both trees visible.
- **Delete a line from the keyboard**: click a line (data line or line between results) to pick it, then press Delete (the delete key of a Mac is Backspace); ⌘Z brings it back. A line into a folded group does not guess: it says to unfold first. The line toolbar now sits beside its line instead of on top of it, so a line can always be clicked, even a short one.
- The stylesheet is refreshed when the plugin is swapped live. A page that kept the stylesheet of an older build showed new markup with old rules: the relation node on top of the data node, star buttons with the browser's default look.
- Narrow windows (a main area of about 380 px): the counts on result rows no longer spill over the right node, the tree headers keep their titles on one line (the add button shrinks to a +), and names wrap onto a second line instead of being cut to a stub.
- The 「颜色」panel was mistaken by another plugin (dsh-oh-my-claude) for DSH's context-meter popover and filled with the Claude usage: it no longer carries `role="dialog"` / `aria-haspopup="dialog"` (a test now guards the whole page against those marks).
- 270 tests (was 89); new screenshots.

## 0.1.0 — 2026-10-30

First release.

- Sidebar entry「项目看板」that opens a board in the main area, one section per project, with four fixed columns (待办 → 进行中 → 待反馈 → 已完成) and a per-project progress bar.
- Projects: add (name + color), rename, recolor, reorder, delete with confirmation; collapse a section.
- Tasks: add from a column (title + optional note, Enter to save and keep typing), edit, delete with undo, and advance to the next column with one click (the completed column shows a static check).
- Reordering by drag and drop, or with the card menu (including "reopen").
- Styling comes from DSH theme tokens, follows the light/dark theme, and adapts 4 / 2×2 / 1 column to the available width.
