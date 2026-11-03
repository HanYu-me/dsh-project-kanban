# Changelog

## 0.1.0 — 2026-10-30

First release.

- Sidebar entry「项目看板」that opens a board in the main area, one section per project, with four fixed columns (待办 → 进行中 → 待反馈 → 已完成) and a per-project progress bar.
- Projects: add (name + color), rename, recolor, reorder, delete with confirmation; collapse a section.
- Tasks: add from a column (title + optional note, Enter to save and keep typing), edit, delete with undo, and advance to the next column with one click (the completed column shows a static check).
- Reordering by drag and drop, or with the card menu (including "reopen").
- Styling comes from DSH theme tokens, follows the light/dark theme, and adapts 4 / 2×2 / 1 column to the available width.
