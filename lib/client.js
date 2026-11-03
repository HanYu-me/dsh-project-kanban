window.__ModuleLoader__.load({
	id: "dsh-project-kanban",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/client/index.tsx
var index_exports = {};
__export(index_exports, {
  PANEL_ID: () => PANEL_ID,
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);

// src/client/icons.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function svg(size, className, children, strokeWidth = 1.7) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      focusable: "false",
      className,
      children
    }
  );
}
var BoardIcon = ({ size = 16, className }) => svg(size, className, [
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "3", y: "4", width: "18", height: "16", rx: "3" }, "a"),
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 4v16M15 4v16" }, "b"),
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5.5 8h1.5M11 8h2M11 11.5h2M17 8h1.5", strokeWidth: 2.2 }, "c")
]);
var PlusIcon = ({ size = 16, className }) => svg(size, className, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 5v14M5 12h14" }));
var ChevronIcon = ({ size = 16, className }) => svg(size, className, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m9 6 6 6-6 6" }));
var MoreIcon = ({ size = 16, className }) => svg(size, className, [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "5.5", cy: "12", r: "1.2" }, "a"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "12", r: "1.2" }, "b"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "18.5", cy: "12", r: "1.2" }, "c")], 2);
var PencilIcon = ({ size = 16, className }) => svg(size, className, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Z M14.5 7.5l3 3" }));
var TrashIcon = ({ size = 16, className }) => svg(size, className, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" }));
var ArrowRightIcon = ({ size = 16, className }) => svg(size, className, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 12h14M13 6l6 6-6 6" }));
var UndoIcon = ({ size = 16, className }) => svg(size, className, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3" }));
var CheckIcon = ({ size = 16, className }) => svg(size, className, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m5 12.5 4.5 4.5L19 7.5" }), 2.2);
var CloseIcon = ({ size = 16, className }) => svg(size, className, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M6 6l12 12M18 6 6 18" }));
var NoteIcon = ({ size = 16, className }) => svg(size, className, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 6h14M5 12h14M5 18h9" }));
var ArrowUpIcon = ({ size = 16, className }) => svg(size, className, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 19V5M6 11l6-6 6 6" }));
var ArrowDownIcon = ({ size = 16, className }) => svg(size, className, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 5v14M6 13l6 6 6-6" }));
var AlertIcon = ({ size = 16, className }) => svg(size, className, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 8v5M12 16.5v.01M10.3 3.9 2.6 17.3A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.7L13.7 3.9a2 2 0 0 0-3.4 0Z" }));
var StatusIcon = ({ column, size = 14 }) => {
  switch (column) {
    case "todo":
      return svg(size, void 0, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "12", r: "8", strokeDasharray: "3 2.6" }), 2);
    case "doing":
      return svg(size, void 0, [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "12", r: "8" }, "a"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 4a8 8 0 0 1 0 16Z", fill: "currentColor", stroke: "none" }, "b")], 2);
    case "review":
      return svg(size, void 0, [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "12", r: "8" }, "a"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 8v4.5l3 1.8" }, "b")], 2);
    case "done":
      return svg(size, void 0, [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "12", r: "9", fill: "currentColor", stroke: "none" }, "a"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m8 12.3 2.8 2.8L16.2 9.6", stroke: "var(--kb-on-accent, #fff)" }, "b")], 2.2);
  }
};
var EmptyIllustration = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "168", height: "104", viewBox: "0 0 168 104", "aria-hidden": "true", focusable: "false", className: "kb-empty-art", children: [0, 1, 2, 3].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { transform: `translate(${4 + i * 41} 4)`, children: [
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { width: "37", height: "96", rx: "8", className: "kb-art-col" }),
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "5", y: "9", width: "18", height: "4", rx: "2", className: `kb-art-head kb-art-c${i}` }),
  Array.from({ length: [3, 2, 1, 2][i] }, (_, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "5", y: 20 + j * 20, width: "27", height: "15", rx: "4", className: "kb-art-card" }, j))
] }, i)) });

// src/client/KanbanView.tsx
var import_react = require("react");

// src/shared/board.ts
var COLUMNS = ["todo", "doing", "review", "done"];
var COLUMN_LABELS = {
  todo: "\u5F85\u529E",
  doing: "\u8FDB\u884C\u4E2D",
  review: "\u5F85\u53CD\u9988",
  done: "\u5DF2\u5B8C\u6210"
};
var PROJECT_COLORS = ["blue", "violet", "green", "amber", "rose", "teal", "slate"];
var LIMITS = {
  projectName: 60,
  taskTitle: 200,
  taskNote: 2e3,
  projects: 200,
  tasksPerProject: 2e3
};
var ID_PATTERN = /^[A-Za-z0-9_-]{1,40}$/;
function emptyBoard() {
  return { version: 1, revision: 0, projects: [] };
}
function nextColumn(column) {
  const index = COLUMNS.indexOf(column);
  return COLUMNS[index + 1];
}
function isColumn(value) {
  return typeof value === "string" && COLUMNS.includes(value);
}
function isColor(value) {
  return typeof value === "string" && PROJECT_COLORS.includes(value);
}
function cleanLine(value, max) {
  if (typeof value !== "string") return void 0;
  const text = value.replace(/\s+/g, " ").trim();
  if (text === "" || text.length > max) return void 0;
  return text;
}
function cleanNote(value) {
  if (typeof value !== "string") return void 0;
  const text = value.replace(/\r\n?/g, "\n").trim();
  return text.length > LIMITS.taskNote ? void 0 : text;
}
function tasksIn(project, column) {
  return project.tasks.filter((task) => task.column === column);
}
function columnCounts(project) {
  const counts = { todo: 0, doing: 0, review: 0, done: 0 };
  for (const task of project.tasks) counts[task.column] += 1;
  return counts;
}
var refuse = (board, reason) => ({ ok: false, board, reason });
function timeOf(op) {
  return typeof op.at === "string" && !Number.isNaN(Date.parse(op.at)) ? op.at : (/* @__PURE__ */ new Date()).toISOString();
}
function withProject(board, projectId, change) {
  return { ...board, projects: board.projects.map((project) => project.id === projectId ? change(project) : project) };
}
function placeTask(tasks, task, beforeId) {
  const out = tasks.slice();
  if (beforeId) {
    const index = out.findIndex((item) => item.id === beforeId && item.column === task.column);
    if (index >= 0) {
      out.splice(index, 0, task);
      return out;
    }
  }
  let last = -1;
  out.forEach((item, index) => {
    if (item.column === task.column) last = index;
  });
  out.splice(last >= 0 ? last + 1 : out.length, 0, task);
  return out;
}
function recolumn(task, to, at) {
  const next = { ...task, column: to, updatedAt: at };
  if (to === "done") next.completedAt = task.column === "done" && task.completedAt ? task.completedAt : at;
  else delete next.completedAt;
  return next;
}
function applyOp(board, op) {
  if (op === null || typeof op !== "object") return refuse(board, "\u65E0\u6548\u64CD\u4F5C");
  const findProject = (id) => board.projects.find((project) => project.id === id);
  switch (op.type) {
    case "project.add": {
      if (typeof op.id !== "string" || !ID_PATTERN.test(op.id)) return refuse(board, "\u9879\u76EE id \u65E0\u6548");
      if (findProject(op.id)) return refuse(board, "\u9879\u76EE\u5DF2\u5B58\u5728");
      if (board.projects.length >= LIMITS.projects) return refuse(board, `\u9879\u76EE\u6570\u91CF\u5DF2\u8FBE\u4E0A\u9650\uFF08${LIMITS.projects}\uFF09`);
      const name = cleanLine(op.name, LIMITS.projectName);
      if (name === void 0) return refuse(board, `\u9879\u76EE\u540D\u79F0\u9700\u4E3A 1\u2013${LIMITS.projectName} \u4E2A\u5B57\u7B26`);
      if (op.color !== void 0 && !isColor(op.color)) return refuse(board, "\u989C\u8272\u65E0\u6548");
      const color = op.color ?? PROJECT_COLORS[board.projects.length % PROJECT_COLORS.length];
      const project = { id: op.id, name, color, collapsed: false, createdAt: timeOf(op), tasks: [] };
      return { ok: true, board: { ...board, projects: [...board.projects, project] } };
    }
    case "project.update": {
      const project = findProject(op.projectId);
      if (!project) return refuse(board, "\u9879\u76EE\u4E0D\u5B58\u5728");
      const patch = {};
      if (op.name !== void 0) {
        const name = cleanLine(op.name, LIMITS.projectName);
        if (name === void 0) return refuse(board, `\u9879\u76EE\u540D\u79F0\u9700\u4E3A 1\u2013${LIMITS.projectName} \u4E2A\u5B57\u7B26`);
        patch.name = name;
      }
      if (op.color !== void 0) {
        if (!isColor(op.color)) return refuse(board, "\u989C\u8272\u65E0\u6548");
        patch.color = op.color;
      }
      if (op.collapsed !== void 0) {
        if (typeof op.collapsed !== "boolean") return refuse(board, "\u65E0\u6548\u64CD\u4F5C");
        patch.collapsed = op.collapsed;
      }
      return { ok: true, board: withProject(board, project.id, (p) => ({ ...p, ...patch })) };
    }
    case "project.delete": {
      if (!findProject(op.projectId)) return refuse(board, "\u9879\u76EE\u4E0D\u5B58\u5728");
      return { ok: true, board: { ...board, projects: board.projects.filter((p) => p.id !== op.projectId) } };
    }
    case "project.move": {
      const from = board.projects.findIndex((p) => p.id === op.projectId);
      if (from < 0) return refuse(board, "\u9879\u76EE\u4E0D\u5B58\u5728");
      if (typeof op.toIndex !== "number" || !Number.isInteger(op.toIndex)) return refuse(board, "\u65E0\u6548\u64CD\u4F5C");
      const to = Math.max(0, Math.min(board.projects.length - 1, op.toIndex));
      const projects = board.projects.slice();
      const [moved] = projects.splice(from, 1);
      projects.splice(to, 0, moved);
      return { ok: true, board: { ...board, projects } };
    }
    case "task.add": {
      const project = findProject(op.projectId);
      if (!project) return refuse(board, "\u9879\u76EE\u4E0D\u5B58\u5728");
      if (typeof op.id !== "string" || !ID_PATTERN.test(op.id)) return refuse(board, "\u4EFB\u52A1 id \u65E0\u6548");
      if (project.tasks.some((task2) => task2.id === op.id)) return refuse(board, "\u4EFB\u52A1\u5DF2\u5B58\u5728");
      if (project.tasks.length >= LIMITS.tasksPerProject) return refuse(board, `\u4EFB\u52A1\u6570\u91CF\u5DF2\u8FBE\u4E0A\u9650\uFF08${LIMITS.tasksPerProject}\uFF09`);
      const title = cleanLine(op.title, LIMITS.taskTitle);
      if (title === void 0) return refuse(board, `\u4EFB\u52A1\u6807\u9898\u9700\u4E3A 1\u2013${LIMITS.taskTitle} \u4E2A\u5B57\u7B26`);
      const note = op.note === void 0 ? "" : cleanNote(op.note);
      if (note === void 0) return refuse(board, `\u5907\u6CE8\u4E0D\u80FD\u8D85\u8FC7 ${LIMITS.taskNote} \u4E2A\u5B57\u7B26`);
      const column = op.column ?? "todo";
      if (!isColumn(column)) return refuse(board, "\u5217\u65E0\u6548");
      const at = timeOf(op);
      const task = { id: op.id, title, note, column, createdAt: at, updatedAt: at };
      if (column === "done") task.completedAt = at;
      return { ok: true, board: withProject(board, project.id, (p) => ({ ...p, tasks: placeTask(p.tasks, task, null) })) };
    }
    case "task.update": {
      const project = findProject(op.projectId);
      const task = project?.tasks.find((t) => t.id === op.taskId);
      if (!project || !task) return refuse(board, "\u4EFB\u52A1\u4E0D\u5B58\u5728");
      const patch = {};
      if (op.title !== void 0) {
        const title = cleanLine(op.title, LIMITS.taskTitle);
        if (title === void 0) return refuse(board, `\u4EFB\u52A1\u6807\u9898\u9700\u4E3A 1\u2013${LIMITS.taskTitle} \u4E2A\u5B57\u7B26`);
        patch.title = title;
      }
      if (op.note !== void 0) {
        const note = cleanNote(op.note);
        if (note === void 0) return refuse(board, `\u5907\u6CE8\u4E0D\u80FD\u8D85\u8FC7 ${LIMITS.taskNote} \u4E2A\u5B57\u7B26`);
        patch.note = note;
      }
      patch.updatedAt = timeOf(op);
      return {
        ok: true,
        board: withProject(board, project.id, (p) => ({ ...p, tasks: p.tasks.map((t) => t.id === task.id ? { ...t, ...patch } : t) }))
      };
    }
    case "task.delete": {
      const project = findProject(op.projectId);
      if (!project || !project.tasks.some((t) => t.id === op.taskId)) return refuse(board, "\u4EFB\u52A1\u4E0D\u5B58\u5728");
      return { ok: true, board: withProject(board, project.id, (p) => ({ ...p, tasks: p.tasks.filter((t) => t.id !== op.taskId) })) };
    }
    case "task.advance": {
      const project = findProject(op.projectId);
      const task = project?.tasks.find((t) => t.id === op.taskId);
      if (!project || !task) return refuse(board, "\u4EFB\u52A1\u4E0D\u5B58\u5728");
      if (!isColumn(op.from)) return refuse(board, "\u5217\u65E0\u6548");
      if (task.column !== op.from) return refuse(board, "\u4EFB\u52A1\u5DF2\u88AB\u79FB\u52A8\uFF0C\u8BF7\u5237\u65B0\u540E\u518D\u8BD5");
      const to = nextColumn(task.column);
      if (to === void 0) return refuse(board, "\u4EFB\u52A1\u5DF2\u5728\u201C\u5DF2\u5B8C\u6210\u201D\u5217");
      const moved = recolumn(task, to, timeOf(op));
      const rest = project.tasks.filter((t) => t.id !== task.id);
      const firstInTarget = rest.find((t) => t.column === to);
      return { ok: true, board: withProject(board, project.id, (p) => ({ ...p, tasks: placeTask(rest, moved, firstInTarget?.id ?? null) })) };
    }
    case "task.move": {
      const project = findProject(op.projectId);
      const task = project?.tasks.find((t) => t.id === op.taskId);
      if (!project || !task) return refuse(board, "\u4EFB\u52A1\u4E0D\u5B58\u5728");
      if (!isColumn(op.to)) return refuse(board, "\u5217\u65E0\u6548");
      if (op.beforeTaskId === task.id) return { ok: true, board };
      const moved = op.to === task.column ? task : recolumn(task, op.to, timeOf(op));
      const rest = project.tasks.filter((t) => t.id !== task.id);
      return { ok: true, board: withProject(board, project.id, (p) => ({ ...p, tasks: placeTask(rest, moved, op.beforeTaskId ?? null) })) };
    }
    case "task.restore": {
      const project = findProject(op.projectId);
      if (!project) return refuse(board, "\u9879\u76EE\u4E0D\u5B58\u5728");
      const task = sanitizeTask(op.task);
      if (!task) return refuse(board, "\u4EFB\u52A1\u6570\u636E\u65E0\u6548");
      if (project.tasks.some((t) => t.id === task.id)) return refuse(board, "\u4EFB\u52A1\u5DF2\u5B58\u5728");
      const index = typeof op.index === "number" && Number.isInteger(op.index) ? Math.max(0, Math.min(project.tasks.length, op.index)) : project.tasks.length;
      return {
        ok: true,
        board: withProject(board, project.id, (p) => {
          const tasks = p.tasks.slice();
          tasks.splice(index, 0, task);
          return { ...p, tasks };
        })
      };
    }
    default:
      return refuse(board, "\u672A\u77E5\u64CD\u4F5C");
  }
}
function applyOps(board, ops) {
  let current = board;
  const refused = [];
  ops.forEach((op, index) => {
    const result = applyOp(current, op);
    if (result.ok) current = result.board;
    else refused.push({ index, reason: result.reason });
  });
  return { board: current, refused };
}
function sanitizeTask(value) {
  const raw = value;
  if (raw === null || typeof raw !== "object") return void 0;
  if (typeof raw.id !== "string" || !ID_PATTERN.test(raw.id)) return void 0;
  const title = cleanLine(raw.title, LIMITS.taskTitle);
  const note = raw.note === void 0 ? "" : cleanNote(raw.note);
  if (title === void 0 || note === void 0 || !isColumn(raw.column)) return void 0;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const createdAt = typeof raw.createdAt === "string" ? raw.createdAt : now;
  const task = { id: raw.id, title, note, column: raw.column, createdAt, updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : createdAt };
  if (raw.column === "done") task.completedAt = typeof raw.completedAt === "string" ? raw.completedAt : task.updatedAt;
  return task;
}
function sanitizeBoard(value) {
  const raw = value;
  const board = emptyBoard();
  if (raw === null || typeof raw !== "object") return board;
  if (typeof raw.revision === "number" && Number.isInteger(raw.revision) && raw.revision >= 0) board.revision = raw.revision;
  if (!Array.isArray(raw.projects)) return board;
  const seen = /* @__PURE__ */ new Set();
  for (const item of raw.projects) {
    const p = item;
    if (p === null || typeof p !== "object" || typeof p.id !== "string" || !ID_PATTERN.test(p.id) || seen.has(p.id)) continue;
    const name = cleanLine(p.name, LIMITS.projectName);
    if (name === void 0) continue;
    seen.add(p.id);
    const taskIds = /* @__PURE__ */ new Set();
    const tasks = [];
    for (const t of Array.isArray(p.tasks) ? p.tasks : []) {
      const task = sanitizeTask(t);
      if (task && !taskIds.has(task.id)) {
        taskIds.add(task.id);
        tasks.push(task);
      }
    }
    board.projects.push({
      id: p.id,
      name,
      color: isColor(p.color) ? p.color : "blue",
      collapsed: p.collapsed === true,
      createdAt: typeof p.createdAt === "string" ? p.createdAt : (/* @__PURE__ */ new Date()).toISOString(),
      tasks
    });
  }
  return board;
}
function newId(prefix) {
  const bytes = new Uint8Array(8);
  globalThis.crypto.getRandomValues(bytes);
  let text = "";
  for (const byte of bytes) text += byte.toString(36).padStart(2, "0");
  return `${prefix}_${text.slice(0, 12)}`;
}

// src/client/KanbanView.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var COLOR_VALUES = {
  blue: "#4d6bfe",
  violet: "#8b5cf6",
  green: "#22a06b",
  amber: "#e09400",
  rose: "#e5484d",
  teal: "#0ea5a4",
  slate: "#64748b"
};
var COLOR_NAMES = {
  blue: "\u84DD",
  violet: "\u7D2B",
  green: "\u7EFF",
  amber: "\u6A59",
  rose: "\u7EA2",
  teal: "\u9752",
  slate: "\u7070"
};
var EMPTY_HINTS = {
  todo: "\u6682\u65E0\u5F85\u529E",
  doing: "\u6807\u8BB0\u5F85\u529E\u5B8C\u6210\u540E\u4F1A\u6765\u5230\u8FD9\u91CC",
  review: "\u7B49\u5F85\u53CD\u9988\u7684\u4EFB\u52A1",
  done: "\u5B8C\u6210\u7684\u4EFB\u52A1\u4F1A\u51FA\u73B0\u5728\u8FD9\u91CC"
};
var Actions = (0, import_react.createContext)(null);
function useActions() {
  const value = (0, import_react.useContext)(Actions);
  if (!value) throw new Error("KanbanView context missing");
  return value;
}
function pad(n) {
  return String(n).padStart(2, "0");
}
function shortDate(iso, now = /* @__PURE__ */ new Date()) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return `\u4ECA\u5929 ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const md = `${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return d.getFullYear() === now.getFullYear() ? md : `${d.getFullYear()}-${md}`;
}
function useDismiss(open, close) {
  const ref = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    if (!open) return;
    const onDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) close();
    };
    const onKey = (event) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open, close]);
  return ref;
}
function Menu({ label, children, onOpenChange }) {
  const [open, setOpen] = (0, import_react.useState)(false);
  const set = (0, import_react.useCallback)(
    (value) => {
      setOpen(value);
      onOpenChange?.(value);
    },
    [onOpenChange]
  );
  const trigger = (0, import_react.useRef)(null);
  const menu = (0, import_react.useRef)(null);
  const close = (0, import_react.useCallback)(() => {
    set(false);
    trigger.current?.focus();
  }, [set]);
  const ref = useDismiss(open, close);
  const items = () => Array.from(menu.current?.querySelectorAll('[role^="menuitem"]:not(:disabled)') ?? []);
  (0, import_react.useEffect)(() => {
    if (open) items()[0]?.focus();
  }, [open]);
  const onMenuKey = (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const list = items();
    if (list.length === 0) return;
    const current = list.indexOf(document.activeElement);
    const next = event.key === "Home" ? 0 : event.key === "End" ? list.length - 1 : event.key === "ArrowDown" ? (current + 1) % list.length : (current - 1 + list.length) % list.length;
    list[next]?.focus();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "kb-menu-anchor", ref, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { ref: trigger, type: "button", className: "kb-icon-btn", "aria-label": label, title: label, "aria-haspopup": "menu", "aria-expanded": open, onClick: () => set(!open), children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(MoreIcon, {}) }),
    open ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "kb-menu", role: "menu", "aria-label": label, ref: menu, onKeyDown: onMenuKey, children: children(close) }) : null
  ] });
}
function TaskEditor({ initialTitle = "", initialNote = "", submitLabel, keepOpen, onSubmit, onCancel }) {
  const [title, setTitle] = (0, import_react.useState)(initialTitle);
  const [note, setNote] = (0, import_react.useState)(initialNote);
  const [showNote, setShowNote] = (0, import_react.useState)(initialNote !== "");
  const titleRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    titleRef.current?.focus();
    titleRef.current?.select();
  }, []);
  const trimmed = title.trim();
  const tooLong = trimmed.length > LIMITS.taskTitle;
  const submit = () => {
    if (trimmed === "" || tooLong) return;
    if (!onSubmit(trimmed, note)) return;
    if (keepOpen) {
      setTitle("");
      setNote("");
      setShowNote(false);
      titleRef.current?.focus();
    }
  };
  const onKey = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onCancel();
    } else if (event.key === "Enter" && (event.target instanceof HTMLInputElement || event.metaKey || event.ctrlKey)) {
      if (event.nativeEvent.isComposing) return;
      event.preventDefault();
      submit();
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "kb-card is-editing", onKeyDown: onKey, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "input",
      {
        ref: titleRef,
        className: "kb-input",
        placeholder: "\u4EFB\u52A1\u6807\u9898",
        value: title,
        maxLength: LIMITS.taskTitle,
        onChange: (e) => setTitle(e.target.value),
        "aria-label": "\u4EFB\u52A1\u6807\u9898"
      }
    ),
    showNote ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("textarea", { className: "kb-textarea", placeholder: "\u5907\u6CE8\uFF08\u53EF\u9009\uFF09", value: note, rows: 3, maxLength: LIMITS.taskNote, onChange: (e) => setNote(e.target.value), "aria-label": "\u5907\u6CE8" }) : null,
    tooLong ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "kb-hint is-error", children: [
      "\u6807\u9898\u6700\u591A ",
      LIMITS.taskTitle,
      " \u4E2A\u5B57\u7B26"
    ] }) : null,
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "kb-edit-row", children: [
      !showNote ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("button", { type: "button", className: "kb-btn kb-btn-ghost kb-btn-sm", onClick: () => setShowNote(true), children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(NoteIcon, { size: 14 }),
        " \u5907\u6CE8"
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "kb-hint", children: "\u2318/Ctrl + Enter \u4FDD\u5B58" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "kb-btn kb-btn-ghost kb-btn-sm", onClick: onCancel, children: "\u53D6\u6D88" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "kb-btn kb-btn-primary kb-btn-sm", disabled: trimmed === "" || tooLong, onClick: submit, children: submitLabel })
      ] })
    ] })
  ] });
}
function TaskCard({ project, task, index }) {
  const actions = useActions();
  const [editing, setEditing] = (0, import_react.useState)(false);
  const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
  const [dragging, setDragging] = (0, import_react.useState)(false);
  const next = nextColumn(task.column);
  if (editing) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      TaskEditor,
      {
        initialTitle: task.title,
        initialNote: task.note,
        submitLabel: "\u4FDD\u5B58",
        onCancel: () => setEditing(false),
        onSubmit: (title, note) => {
          const ok = actions.dispatch({ type: "task.update", projectId: project.id, taskId: task.id, title, note });
          if (ok) setEditing(false);
          return ok;
        }
      }
    );
  }
  const advance = () => {
    if (!next) return;
    if (actions.dispatch({ type: "task.advance", projectId: project.id, taskId: task.id, from: task.column })) actions.land(task.id);
  };
  const moveTo = (to) => {
    if (actions.dispatch({ type: "task.move", projectId: project.id, taskId: task.id, to, beforeTaskId: null })) actions.land(task.id);
  };
  const remove = () => {
    const position = project.tasks.findIndex((t) => t.id === task.id);
    if (!actions.dispatch({ type: "task.delete", projectId: project.id, taskId: task.id })) return;
    actions.toast(`\u5DF2\u5220\u9664\u300C${task.title.length > 18 ? task.title.slice(0, 18) + "\u2026" : task.title}\u300D`, {
      action: { label: "\u64A4\u9500", run: () => actions.dispatch({ type: "task.restore", projectId: project.id, task, index: position }) }
    });
  };
  const onDragStart = (event) => {
    actions.drag.current = { projectId: project.id, taskId: task.id };
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", task.title);
    setDragging(true);
  };
  const onDragEnd = () => {
    actions.drag.current = null;
    setDragging(false);
  };
  const meta = task.column === "done" ? `\u5B8C\u6210\u4E8E ${shortDate(task.completedAt)}` : `\u521B\u5EFA\u4E8E ${shortDate(task.createdAt)}`;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    "div",
    {
      className: "kb-card" + (dragging ? " is-dragging" : "") + (actions.landedId === task.id ? " is-landed" : ""),
      draggable: true,
      onDragStart,
      onDragEnd,
      "data-task-id": task.id,
      "data-index": index,
      onDoubleClick: (e) => {
        if (e.target.closest("button")) return;
        setEditing(true);
      },
      children: [
        next ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "kb-check", onClick: advance, "aria-label": `\u6807\u8BB0\u5B8C\u6210\uFF0C\u79FB\u5230\u300C${COLUMN_LABELS[next]}\u300D`, title: `\u6807\u8BB0\u5B8C\u6210 \u2192 ${COLUMN_LABELS[next]}`, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(CheckIcon, { size: 11 }) }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "kb-check is-done", role: "img", "aria-label": "\u5DF2\u5B8C\u6210", title: "\u5DF2\u5B8C\u6210", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(CheckIcon, { size: 11 }) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "kb-card-main", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "kb-card-title", children: task.title }),
          task.note ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "kb-card-note", children: task.note }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "kb-card-meta", children: meta })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "kb-card-actions" + (menuOpen ? " is-open" : ""), children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "kb-icon-btn", "aria-label": "\u7F16\u8F91\u4EFB\u52A1", title: "\u7F16\u8F91", onClick: () => setEditing(true), children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PencilIcon, { size: 14 }) }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Menu, { label: "\u66F4\u591A\u64CD\u4F5C", onOpenChange: setMenuOpen, children: (close) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "kb-menu-label", children: "\u79FB\u52A8\u5230" }),
            COLUMNS.map((column) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
              "button",
              {
                type: "button",
                role: "menuitem",
                className: "kb-menu-item",
                disabled: column === task.column,
                onClick: () => {
                  close();
                  moveTo(column);
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(StatusIcon, { column }),
                  column === "todo" && task.column === "done" ? "\u91CD\u65B0\u6253\u5F00\uFF08\u5F85\u529E\uFF09" : COLUMN_LABELS[column]
                ]
              },
              column
            )),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "kb-menu-sep" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
              "button",
              {
                type: "button",
                role: "menuitem",
                className: "kb-menu-item is-danger",
                onClick: () => {
                  close();
                  remove();
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(TrashIcon, { size: 14 }),
                  " \u5220\u9664\u4EFB\u52A1"
                ]
              }
            )
          ] }) })
        ] })
      ]
    }
  );
}
function Column({ project, column }) {
  const actions = useActions();
  const tasks = tasksIn(project, column);
  const [adding, setAdding] = (0, import_react.useState)(false);
  const [drop, setDrop] = (0, import_react.useState)(null);
  const listRef = (0, import_react.useRef)(null);
  const accepts = () => actions.drag.current?.projectId === project.id;
  const beforeAt = (clientY) => {
    const cards = listRef.current?.querySelectorAll(":scope > .kb-card[data-task-id]") ?? [];
    for (const card of cards) {
      const box = card.getBoundingClientRect();
      if (clientY < box.top + box.height / 2) return card.dataset.taskId ?? null;
    }
    return null;
  };
  const onDragOver = (event) => {
    if (!accepts()) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    const before = beforeAt(event.clientY);
    if (drop?.before !== before || drop === null) setDrop({ before });
  };
  const onDragLeave = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setDrop(null);
  };
  const onDrop = (event) => {
    const dragged = actions.drag.current;
    setDrop(null);
    if (!dragged || dragged.projectId !== project.id) return;
    event.preventDefault();
    const before = beforeAt(event.clientY);
    if (before === dragged.taskId) return;
    if (actions.dispatch({ type: "task.move", projectId: project.id, taskId: dragged.taskId, to: column, beforeTaskId: before })) actions.land(dragged.taskId);
  };
  const draggedId = actions.drag.current?.taskId;
  const line = /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "kb-drop-line", "aria-hidden": "true" });
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("section", { className: "kb-column" + (drop ? " is-drop" : ""), "data-column": column, "aria-label": `${project.name} \xB7 ${COLUMN_LABELS[column]}`, onDragOver, onDragLeave, onDrop, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("header", { className: "kb-column-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(StatusIcon, { column }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: COLUMN_LABELS[column] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "kb-count", children: tasks.length }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "kb-icon-btn", "aria-label": `\u5728\u300C${COLUMN_LABELS[column]}\u300D\u6DFB\u52A0\u4EFB\u52A1`, title: "\u6DFB\u52A0\u4EFB\u52A1", onClick: () => setAdding(true), children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PlusIcon, { size: 15 }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "kb-cards", ref: listRef, children: [
      tasks.map((task, index) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(FragmentWithLine, { show: drop !== null && drop.before === task.id && draggedId !== task.id, line, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(TaskCard, { project, task, index }) }, task.id)),
      drop !== null && drop.before === null && tasks.length > 0 ? line : null,
      tasks.length === 0 && !adding ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "kb-placeholder", children: drop ? "\u653E\u5230\u8FD9\u91CC" : EMPTY_HINTS[column] }) : null,
      adding ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        TaskEditor,
        {
          submitLabel: "\u6DFB\u52A0",
          keepOpen: true,
          onCancel: () => setAdding(false),
          onSubmit: (title, note) => {
            const id = newId("t");
            const ok = actions.dispatch({ type: "task.add", projectId: project.id, id, title, note, column });
            if (ok) actions.land(id);
            return ok;
          }
        }
      ) : null
    ] }),
    !adding ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("button", { type: "button", className: "kb-add-task", onClick: () => setAdding(true), children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PlusIcon, { size: 14 }),
      " \u6DFB\u52A0\u4EFB\u52A1"
    ] }) : null
  ] });
}
function FragmentWithLine({ show, line, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    show ? line : null,
    children
  ] });
}
function ProjectSection({ project, index, total }) {
  const actions = useActions();
  const [renaming, setRenaming] = (0, import_react.useState)(false);
  const [name, setName] = (0, import_react.useState)(project.name);
  const counts = columnCounts(project);
  const total_ = project.tasks.length;
  const percent = total_ === 0 ? 0 : Math.round(counts.done / total_ * 100);
  const saveName = () => {
    const trimmed = name.trim();
    if (trimmed === "" || trimmed === project.name) {
      setName(project.name);
      setRenaming(false);
      return;
    }
    if (actions.dispatch({ type: "project.update", projectId: project.id, name: trimmed })) setRenaming(false);
  };
  const toggle = () => {
    actions.dispatch({ type: "project.update", projectId: project.id, collapsed: !project.collapsed });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("article", { className: "kb-project" + (project.collapsed ? " is-collapsed" : ""), style: { ["--kb-accent"]: COLOR_VALUES[project.color] }, "aria-label": `\u9879\u76EE ${project.name}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("header", { className: "kb-project-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "kb-icon-btn", "aria-label": project.collapsed ? "\u5C55\u5F00\u9879\u76EE" : "\u6536\u8D77\u9879\u76EE", "aria-expanded": !project.collapsed, onClick: toggle, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ChevronIcon, { className: "kb-collapse" }) }),
      renaming ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "input",
        {
          className: "kb-input kb-project-name-input",
          value: name,
          autoFocus: true,
          maxLength: LIMITS.projectName,
          "aria-label": "\u9879\u76EE\u540D\u79F0",
          onChange: (e) => setName(e.target.value),
          onBlur: saveName,
          onKeyDown: (e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) saveName();
            if (e.key === "Escape") {
              setName(project.name);
              setRenaming(false);
            }
          }
        }
      ) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "h2",
        {
          className: "kb-project-name",
          title: "\u70B9\u51FB\u91CD\u547D\u540D",
          role: "button",
          tabIndex: 0,
          "aria-label": `${project.name}\uFF08\u6309 Enter \u91CD\u547D\u540D\uFF09`,
          onClick: () => {
            setName(project.name);
            setRenaming(true);
          },
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setName(project.name);
              setRenaming(true);
            }
          },
          children: project.name
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "kb-chips", "aria-hidden": "true", children: COLUMNS.map((column) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "kb-chip", style: { ["--c"]: `var(--kb-c-${column})` }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("i", {}),
        COLUMN_LABELS[column],
        " ",
        counts[column]
      ] }, column)) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "kb-progress", title: `${counts.done}/${total_} \u5DF2\u5B8C\u6210`, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "kb-progress-bar", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": percent, "aria-label": "\u5B8C\u6210\u8FDB\u5EA6", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { width: `${percent}%` } }) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { children: [
          percent,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Menu, { label: "\u9879\u76EE\u64CD\u4F5C", children: (close) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
          "button",
          {
            type: "button",
            role: "menuitem",
            className: "kb-menu-item",
            onClick: () => {
              close();
              setName(project.name);
              setRenaming(true);
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PencilIcon, { size: 14 }),
              " \u91CD\u547D\u540D"
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "kb-menu-label", children: "\u989C\u8272" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "kb-swatches", role: "group", "aria-label": "\u9879\u76EE\u989C\u8272", children: PROJECT_COLORS.map((color) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            type: "button",
            role: "menuitemradio",
            "aria-checked": color === project.color,
            className: "kb-swatch" + (color === project.color ? " is-current" : ""),
            style: { ["--s"]: COLOR_VALUES[color] },
            "aria-label": `${COLOR_NAMES[color]}\u8272`,
            onClick: () => actions.dispatch({ type: "project.update", projectId: project.id, color })
          },
          color
        )) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "kb-menu-sep" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
          "button",
          {
            type: "button",
            role: "menuitem",
            className: "kb-menu-item",
            disabled: index === 0,
            onClick: () => {
              close();
              actions.dispatch({ type: "project.move", projectId: project.id, toIndex: index - 1 });
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ArrowUpIcon, { size: 14 }),
              " \u4E0A\u79FB"
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
          "button",
          {
            type: "button",
            role: "menuitem",
            className: "kb-menu-item",
            disabled: index === total - 1,
            onClick: () => {
              close();
              actions.dispatch({ type: "project.move", projectId: project.id, toIndex: index + 1 });
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ArrowDownIcon, { size: 14 }),
              " \u4E0B\u79FB"
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "kb-menu-sep" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
          "button",
          {
            type: "button",
            role: "menuitem",
            className: "kb-menu-item is-danger",
            onClick: () => {
              close();
              actions.confirm({
                title: `\u5220\u9664\u9879\u76EE\u300C${project.name}\u300D\uFF1F`,
                body: total_ > 0 ? `\u9879\u76EE\u4E2D\u7684 ${total_} \u4E2A\u4EFB\u52A1\u4F1A\u4E00\u8D77\u5220\u9664\uFF0C\u6B64\u64CD\u4F5C\u4E0D\u80FD\u64A4\u9500\u3002` : "\u6B64\u64CD\u4F5C\u4E0D\u80FD\u64A4\u9500\u3002",
                confirmLabel: "\u5220\u9664\u9879\u76EE",
                onConfirm: () => {
                  if (actions.dispatch({ type: "project.delete", projectId: project.id })) actions.toast(`\u5DF2\u5220\u9664\u9879\u76EE\u300C${project.name}\u300D`);
                }
              });
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(TrashIcon, { size: 14 }),
              " \u5220\u9664\u9879\u76EE"
            ]
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "kb-project-body", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "kb-columns", children: COLUMNS.map((column) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Column, { project, column }, column)) }) })
  ] });
}
function NewProjectForm({ onDone, autoColor }) {
  const actions = useActions();
  const [name, setName] = (0, import_react.useState)("");
  const [color, setColor] = (0, import_react.useState)(autoColor);
  const trimmed = name.trim();
  const submit = () => {
    if (trimmed === "") return;
    if (actions.dispatch({ type: "project.add", id: newId("p"), name: trimmed, color })) onDone();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "kb-new-project", role: "group", "aria-label": "\u65B0\u5EFA\u9879\u76EE", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "input",
      {
        className: "kb-input",
        autoFocus: true,
        placeholder: "\u9879\u76EE\u540D\u79F0\uFF0C\u4F8B\u5982\uFF1A\u5B98\u7F51\u6539\u7248",
        value: name,
        maxLength: LIMITS.projectName,
        "aria-label": "\u9879\u76EE\u540D\u79F0",
        onChange: (e) => setName(e.target.value),
        onKeyDown: (e) => {
          if (e.key === "Enter" && !e.nativeEvent.isComposing) submit();
          if (e.key === "Escape") onDone();
        }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "kb-swatches", role: "radiogroup", "aria-label": "\u9879\u76EE\u989C\u8272", children: PROJECT_COLORS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "button",
      {
        type: "button",
        role: "radio",
        "aria-checked": c === color,
        "aria-label": `${COLOR_NAMES[c]}\u8272`,
        className: "kb-swatch" + (c === color ? " is-current" : ""),
        style: { ["--s"]: COLOR_VALUES[c] },
        onClick: () => setColor(c)
      },
      c
    )) }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "kb-btn kb-btn-ghost", onClick: onDone, children: "\u53D6\u6D88" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "kb-btn kb-btn-primary", disabled: trimmed === "", onClick: submit, children: "\u521B\u5EFA\u9879\u76EE" })
  ] });
}
function ConfirmDialog({ title, body, confirmLabel, onConfirm, onClose }) {
  const box = (0, import_react.useRef)(null);
  const closeRef = (0, import_react.useRef)(onClose);
  closeRef.current = onClose;
  (0, import_react.useEffect)(() => {
    const previous = document.activeElement;
    box.current?.querySelector("button")?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
      } else if (event.key === "Tab" && box.current) {
        const buttons = Array.from(box.current.querySelectorAll("button"));
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      if (previous && document.contains(previous)) previous.focus();
    };
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "kb-overlay", onPointerDown: (e) => e.target === e.currentTarget && onClose(), children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "kb-dialog", role: "alertdialog", "aria-modal": "true", "aria-labelledby": "kb-dialog-title", "aria-describedby": "kb-dialog-body", ref: box, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h3", { id: "kb-dialog-title", children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { id: "kb-dialog-body", children: body }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "kb-dialog-actions", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "kb-btn", onClick: onClose, children: "\u53D6\u6D88" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "button",
        {
          type: "button",
          className: "kb-btn kb-btn-danger",
          onClick: () => {
            onConfirm();
            onClose();
          },
          children: confirmLabel
        }
      )
    ] })
  ] }) });
}
var STATUS_TEXT = {
  loading: "\u52A0\u8F7D\u4E2D",
  saved: "\u5DF2\u4FDD\u5B58",
  saving: "\u4FDD\u5B58\u4E2D\u2026",
  offline: "\u672A\u8FDE\u63A5\uFF0C\u7A0D\u540E\u81EA\u52A8\u91CD\u8BD5",
  "load-failed": "\u52A0\u8F7D\u5931\u8D25"
};
function Stats({ board }) {
  let tasks = 0;
  let done = 0;
  let doing = 0;
  for (const project of board.projects) {
    for (const task of project.tasks) {
      tasks += 1;
      if (task.column === "done") done += 1;
      if (task.column === "doing") doing += 1;
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { className: "kb-subtitle", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("b", { children: board.projects.length }),
      " \u4E2A\u9879\u76EE"
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("b", { children: tasks }),
      " \u4E2A\u4EFB\u52A1"
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("b", { children: doing }),
      " \u8FDB\u884C\u4E2D"
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("b", { children: done }),
      " \u5DF2\u5B8C\u6210"
    ] })
  ] });
}
function KanbanView({ sync }) {
  const snapshot = (0, import_react.useSyncExternalStore)(sync.subscribe, sync.getSnapshot);
  const { board, status } = snapshot;
  const [creating, setCreating] = (0, import_react.useState)(false);
  const [toasts, setToasts] = (0, import_react.useState)([]);
  const [landedId, setLandedId] = (0, import_react.useState)(null);
  const [dialog, setDialog] = (0, import_react.useState)(null);
  const drag = (0, import_react.useRef)(null);
  const toastSeq = (0, import_react.useRef)(0);
  const landTimer = (0, import_react.useRef)();
  const dismiss = (0, import_react.useCallback)((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);
  const toast = (0, import_react.useCallback)(
    (text, options = {}) => {
      toastSeq.current += 1;
      const id = toastSeq.current;
      setToasts((list) => [...list.slice(-2), { id, text, ...options }]);
      setTimeout(() => dismiss(id), options.action ? 6e3 : 3500);
    },
    [dismiss]
  );
  const land = (0, import_react.useCallback)((taskId) => {
    setLandedId(taskId);
    if (landTimer.current) clearTimeout(landTimer.current);
    landTimer.current = setTimeout(() => setLandedId(null), 900);
  }, []);
  (0, import_react.useEffect)(() => {
    refusedSink.current = (reason) => toast(reason, { tone: "error" });
    return () => {
      refusedSink.current = null;
    };
  }, [toast]);
  (0, import_react.useEffect)(() => {
    void sync.load();
    const onFocus = () => {
      if (document.visibilityState === "visible") void sync.load();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
      if (landTimer.current) clearTimeout(landTimer.current);
    };
  }, [sync]);
  const actions = (0, import_react.useMemo)(
    () => ({
      dispatch: (op) => sync.dispatch(op),
      toast,
      land,
      landedId,
      drag,
      confirm: setDialog
    }),
    [sync, toast, land, landedId]
  );
  const autoColor = PROJECT_COLORS[board.projects.length % PROJECT_COLORS.length];
  const ready = status !== "loading" && status !== "load-failed";
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Actions.Provider, { value: actions, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "kb-root", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "kb-scroll", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "kb-inner", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "kb-header", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("h1", { className: "kb-title", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "kb-title-mark", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(BoardIcon, { size: 18 }) }),
            "\u9879\u76EE\u770B\u677F"
          ] }),
          ready ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Stats, { board }) : null
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "kb-header-actions", children: [
          ready ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "kb-status" + (status === "saving" ? " is-saving" : "") + (status === "offline" ? " is-offline" : ""), role: "status", "data-kb-save-status": "", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("i", {}),
            STATUS_TEXT[status]
          ] }) : null,
          ready && board.projects.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("button", { type: "button", className: "kb-btn kb-btn-primary", onClick: () => setCreating(true), disabled: creating, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PlusIcon, { size: 15 }),
            " \u65B0\u5EFA\u9879\u76EE"
          ] }) : null
        ] })
      ] }),
      status === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "kb-loading", "aria-busy": "true", "aria-label": "\u52A0\u8F7D\u4E2D", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "kb-skeleton" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "kb-skeleton" })
      ] }) : status === "load-failed" ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "kb-error", role: "alert", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(AlertIcon, { size: 28 }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: "\u65E0\u6CD5\u52A0\u8F7D\u770B\u677F" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "kb-hint", children: [
          snapshot.error ?? "\u5BBF\u4E3B\u670D\u52A1\u6CA1\u6709\u54CD\u5E94",
          "\u3002\u8BF7\u786E\u8BA4\u63D2\u4EF6\u5DF2\u542F\u7528\uFF0C\u7136\u540E\u91CD\u8BD5\u3002"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "kb-btn", onClick: () => void sync.load(), children: "\u91CD\u8BD5" })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
        creating ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(NewProjectForm, { autoColor, onDone: () => setCreating(false) }) : null,
        board.projects.length === 0 && !creating ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "kb-empty", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(EmptyIllustration, {}),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h2", { children: "\u8FD8\u6CA1\u6709\u9879\u76EE" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { children: "\u4E3A\u6BCF\u4E2A\u9879\u76EE\u5EFA\u4E00\u4E2A\u5206\u533A\uFF0C\u4EFB\u52A1\u6309\u4E0B\u9762\u7684\u987A\u5E8F\u6D41\u8F6C\u3002\u70B9\u4EFB\u52A1\u5DE6\u4FA7\u7684\u5706\u5708\u5373\u53EF\u5B8C\u6210\u5F53\u524D\u9636\u6BB5\uFF0C\u8FDB\u5165\u4E0B\u4E00\u5217\u3002" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "kb-empty-flow", "aria-hidden": "true", children: COLUMNS.map((column, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { display: "inline-flex", alignItems: "center", gap: 6 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "kb-chip", style: { ["--c"]: `var(--kb-c-${column})` }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("i", {}),
              COLUMN_LABELS[column]
            ] }),
            i < COLUMNS.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ArrowRightIcon, { size: 13 }) : null
          ] }, column)) }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("button", { type: "button", className: "kb-btn kb-btn-primary", onClick: () => setCreating(true), children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PlusIcon, { size: 15 }),
            " \u65B0\u5EFA\u7B2C\u4E00\u4E2A\u9879\u76EE"
          ] })
        ] }) : null,
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "kb-projects", children: board.projects.map((project, index) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ProjectSection, { project, index, total: board.projects.length }, project.id)) })
      ] })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "kb-toasts", "aria-live": "polite", children: toasts.map((t) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "kb-toast" + (t.tone === "error" ? " is-error" : ""), role: t.tone === "error" ? "alert" : "status", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: t.text }),
      t.action ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
        "button",
        {
          type: "button",
          className: "kb-btn kb-btn-sm",
          onClick: () => {
            t.action.run();
            dismiss(t.id);
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(UndoIcon, { size: 13 }),
            " ",
            t.action.label
          ]
        }
      ) : null,
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "kb-icon-btn", "aria-label": "\u5173\u95ED\u63D0\u793A", onClick: () => dismiss(t.id), children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(CloseIcon, { size: 13 }) })
    ] }, t.id)) }),
    dialog ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ConfirmDialog, { ...dialog, onClose: () => setDialog(null) }) : null
  ] }) });
}
var refusedSink = { current: null };

// src/client/styles.ts
var STYLE_ID = "dsh-project-kanban-styles";
var TOKENS = `
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
`;
var CSS = `
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
`;
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById(STYLE_ID) !== null) return;
  const element = document.createElement("style");
  element.id = STYLE_ID;
  element.textContent = CSS;
  document.head.appendChild(element);
}

// src/shared/protocol.ts
var BOARD_ENDPOINT = "/project-kanban/board";
var OPS_ENDPOINT = "/project-kanban/ops";
var MAX_BODY_BYTES = 512 * 1024;
var MAX_OPS_PER_REQUEST = 200;

// src/client/sync.ts
var BODY_BUDGET = Math.floor(MAX_BODY_BYTES * 0.75);
function takeBatch(ops) {
  const encoder = new TextEncoder();
  let bytes = 16;
  const batch = [];
  for (const op of ops) {
    if (batch.length >= MAX_OPS_PER_REQUEST) break;
    const size = encoder.encode(JSON.stringify(op)).length + 1;
    if (batch.length > 0 && bytes + size > BODY_BUDGET) break;
    bytes += size;
    batch.push(op);
  }
  return batch;
}
var BoardSync = class {
  constructor(options = {}) {
    __publicField(this, "confirmed", emptyBoard());
    __publicField(this, "inflight", []);
    __publicField(this, "pending", []);
    __publicField(this, "status", "loading");
    __publicField(this, "error");
    __publicField(this, "snapshot");
    __publicField(this, "listeners", /* @__PURE__ */ new Set());
    __publicField(this, "fetchImpl");
    __publicField(this, "onRefused");
    __publicField(this, "retryDelays");
    __publicField(this, "failures", 0);
    __publicField(this, "retryTimer");
    __publicField(this, "loaded", false);
    __publicField(this, "disposed", false);
    /** Set when a background refresh failed; cleared by the next success. */
    __publicField(this, "refreshFailed", false);
    /** Bumped whenever `confirmed` changes, so an older load answer is dropped. */
    __publicField(this, "generation", 0);
    __publicField(this, "loadSeq", 0);
    /** Current snapshot (stable reference until something changes). */
    __publicField(this, "getSnapshot", () => this.snapshot);
    /** Subscribe to snapshot changes. */
    __publicField(this, "subscribe", (listener) => {
      this.listeners.add(listener);
      return () => {
        this.listeners.delete(listener);
      };
    });
    this.fetchImpl = options.fetch ?? ((input, init) => fetch(input, init));
    this.onRefused = options.onRefused ?? (() => {
    });
    this.retryDelays = options.retryDelays ?? [1e3, 2e3, 4e3, 8e3, 15e3];
    this.snapshot = { board: this.confirmed, status: this.status };
  }
  /** Whether some changes are not yet confirmed by the host. */
  get busy() {
    return this.inflight.length > 0 || this.pending.length > 0;
  }
  /**
   * Load (or re-load) the board from the host. Skipped while changes are
   * queued, so a refresh can never roll back a click.
   */
  async load() {
    if (this.busy || this.disposed) return;
    const seq = ++this.loadSeq;
    const generation = this.generation;
    try {
      const response = await this.fetchImpl(BOARD_ENDPOINT, { method: "GET", cache: "no-store" });
      const body = await response.json();
      if (!body.ok) throw new Error(body.error);
      if (this.busy || this.disposed || seq !== this.loadSeq || generation !== this.generation) return;
      const board = sanitizeBoard(body.value);
      this.loaded = true;
      this.error = void 0;
      this.refreshFailed = false;
      if (board.revision !== this.confirmed.revision || this.status === "loading" || this.status === "load-failed") {
        this.setConfirmed(board);
      }
      this.status = "saved";
    } catch (error) {
      if (seq !== this.loadSeq || this.disposed) return;
      if (!this.loaded) {
        this.status = "load-failed";
        this.error = error instanceof Error ? error.message : String(error);
      } else {
        this.refreshFailed = true;
      }
    }
    this.publish();
  }
  /**
   * Apply an op now and queue it for the host.
   * @returns false (and changes nothing) when the op does not fit the current view.
   */
  dispatch(op) {
    if (this.disposed) return false;
    const view = this.snapshot.board;
    const { refused } = applyOps(view, [op]);
    if (refused.length > 0) {
      this.onRefused(refused[0].reason);
      return false;
    }
    this.pending.push(op);
    this.publish();
    void this.flush();
    return true;
  }
  /** Stop timers; later dispatches are ignored. */
  dispose() {
    this.disposed = true;
    if (this.retryTimer) clearTimeout(this.retryTimer);
    this.listeners.clear();
  }
  async flush() {
    if (this.inflight.length > 0 || this.pending.length === 0 || this.disposed || this.retryTimer) return;
    this.inflight = takeBatch(this.pending);
    this.pending = this.pending.slice(this.inflight.length);
    this.publish();
    let body;
    try {
      const response = await this.fetchImpl(OPS_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ops: this.inflight })
      });
      body = await response.json();
      if (!body.ok) {
        this.onRefused(body.error);
        this.inflight = [];
        this.failures = 0;
        this.publish();
        await this.load();
        void this.flush();
        return;
      }
    } catch {
      this.pending = [...this.inflight, ...this.pending];
      this.inflight = [];
      const delay = this.retryDelays[Math.min(this.failures, this.retryDelays.length - 1)] ?? 15e3;
      this.failures += 1;
      this.retryTimer = setTimeout(() => {
        this.retryTimer = void 0;
        void this.flush();
      }, delay);
      this.publish();
      return;
    }
    this.failures = 0;
    this.refreshFailed = false;
    this.setConfirmed(sanitizeBoard(body.value));
    this.loaded = true;
    const sent = this.inflight;
    this.inflight = [];
    for (const item of body.refused) {
      if (/已存在|已被移动|已在/.test(item.reason) && sent[item.index]?.type !== "project.update") continue;
      this.onRefused(item.reason);
    }
    this.publish();
    void this.flush();
  }
  setConfirmed(board) {
    this.confirmed = board;
    this.generation += 1;
  }
  publish() {
    const queued = [...this.inflight, ...this.pending];
    const board = queued.length > 0 ? applyOps(this.confirmed, queued).board : this.confirmed;
    let status;
    if (this.status === "load-failed" && !this.loaded) status = "load-failed";
    else if (!this.loaded && this.status === "loading") status = "loading";
    else if (this.retryTimer || this.refreshFailed && queued.length === 0) status = "offline";
    else if (queued.length > 0) status = "saving";
    else status = "saved";
    this.status = status;
    this.snapshot = { board, status, ...this.error !== void 0 ? { error: this.error } : {} };
    for (const listener of this.listeners) listener();
  }
};

// src/client/index.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var PANEL_ID = "dsh-project-kanban:board";
var inject = [];
function report(step, error) {
  try {
    console.warn(`[project-kanban] ${step} failed; that part stays off.`, error);
  } catch {
  }
  return () => {
  };
}
function Entry(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "kb-entry", "data-active": String(Boolean(props.active)), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(BoardIcon, { size: props.size ?? 16 }) });
}
function apply(ctx) {
  try {
    ensureStyles();
  } catch (error) {
    report("stylesheet", error);
  }
  const sync = new BoardSync({ onRefused: (reason) => refusedSink.current?.(reason) });
  const Board = () => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(KanbanView, { sync });
  ctx.inject(["slots"], (slotsCtx) => {
    const slots = slotsCtx.slots;
    if (slots === void 0) return;
    slotsCtx.effect(() => {
      try {
        return slots.inject("main", () => {
          try {
            return slots.register({ name: "main", key: PANEL_ID }, Board);
          } catch (error) {
            return report("main view registration", error);
          }
        });
      } catch (error) {
        return report("main view", error);
      }
    }, "project-kanban: main view");
    slotsCtx.effect(() => {
      try {
        return slots.inject("sidebar.panellist", () => {
          try {
            return slots.register({ name: "sidebar.panellist", id: PANEL_ID, order: 6, label: "\u9879\u76EE\u770B\u677F" }, Entry);
          } catch (error) {
            return report("sidebar entry registration", error);
          }
        });
      } catch (error) {
        return report("sidebar entry", error);
      }
    }, "project-kanban: sidebar entry");
  });
  ctx.effect(() => () => sync.dispose(), "project-kanban: sync");
}

		return module.exports;
	}
});

