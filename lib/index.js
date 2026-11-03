// src/shared/protocol.ts
var KANBAN_PREFIX = "/project-kanban";
var BOARD_ENDPOINT = "/project-kanban/board";
var OPS_ENDPOINT = "/project-kanban/ops";
var MAX_BODY_BYTES = 512 * 1024;
var MAX_OPS_PER_REQUEST = 200;

// src/routes.ts
function writeJson(res, status, body) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "referrer-policy": "no-referrer"
  });
  res.end(JSON.stringify(body));
}
async function readBoundedJson(req, maxBytes) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = chunk;
    size += buffer.length;
    if (size > maxBytes) throw new Error("body too large");
    chunks.push(buffer);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
async function serveKanban(store, req, res) {
  const pathname = new URL(req.url ?? "/", "http://x").pathname.replace(/\/+$/, "");
  try {
    if (pathname === BOARD_ENDPOINT) {
      if (req.method !== "GET") return writeJson(res, 405, { ok: false, error: "\u53EA\u652F\u6301 GET" });
      return writeJson(res, 200, { ok: true, value: store.read() });
    }
    if (pathname === OPS_ENDPOINT) {
      if (req.method !== "POST") return writeJson(res, 405, { ok: false, error: "\u53EA\u652F\u6301 POST" });
      let body;
      try {
        body = await readBoundedJson(req, MAX_BODY_BYTES);
      } catch (error) {
        const tooLarge = error instanceof Error && error.message === "body too large";
        return writeJson(res, tooLarge ? 413 : 400, { ok: false, error: tooLarge ? "\u8BF7\u6C42\u8FC7\u5927" : "\u8BF7\u6C42\u4E0D\u662F\u6709\u6548\u7684 JSON" });
      }
      const ops = body?.ops;
      if (!Array.isArray(ops)) return writeJson(res, 400, { ok: false, error: "\u7F3A\u5C11 ops \u6570\u7EC4" });
      if (ops.length > MAX_OPS_PER_REQUEST) return writeJson(res, 413, { ok: false, error: `\u4E00\u6B21\u6700\u591A ${MAX_OPS_PER_REQUEST} \u4E2A\u64CD\u4F5C` });
      const result = store.apply(ops);
      return writeJson(res, 200, { ok: true, value: result.board, refused: result.refused });
    }
    return writeJson(res, 404, { ok: false, error: "\u672A\u77E5\u8DEF\u5F84" });
  } catch (error) {
    console.warn("[project-kanban] request failed", error);
    if (!res.headersSent) writeJson(res, 500, { ok: false, error: error instanceof Error ? error.message : "\u670D\u52A1\u5668\u9519\u8BEF" });
    else res.end();
  }
}

// src/store.ts
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

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
      const name2 = cleanLine(op.name, LIMITS.projectName);
      if (name2 === void 0) return refuse(board, `\u9879\u76EE\u540D\u79F0\u9700\u4E3A 1\u2013${LIMITS.projectName} \u4E2A\u5B57\u7B26`);
      if (op.color !== void 0 && !isColor(op.color)) return refuse(board, "\u989C\u8272\u65E0\u6548");
      const color = op.color ?? PROJECT_COLORS[board.projects.length % PROJECT_COLORS.length];
      const project = { id: op.id, name: name2, color, collapsed: false, createdAt: timeOf(op), tasks: [] };
      return { ok: true, board: { ...board, projects: [...board.projects, project] } };
    }
    case "project.update": {
      const project = findProject(op.projectId);
      if (!project) return refuse(board, "\u9879\u76EE\u4E0D\u5B58\u5728");
      const patch = {};
      if (op.name !== void 0) {
        const name2 = cleanLine(op.name, LIMITS.projectName);
        if (name2 === void 0) return refuse(board, `\u9879\u76EE\u540D\u79F0\u9700\u4E3A 1\u2013${LIMITS.projectName} \u4E2A\u5B57\u7B26`);
        patch.name = name2;
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
    const name2 = cleanLine(p.name, LIMITS.projectName);
    if (name2 === void 0) continue;
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
      name: name2,
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

// src/store.ts
function defaultBoardPath() {
  const override = process.env.DSH_PROJECT_KANBAN_FILE;
  if (typeof override === "string" && override !== "") return override;
  return join(homedir(), ".dsh", "project-kanban", "board.json");
}
function applyTo(current, ops) {
  const { board, refused } = applyOps(current, ops);
  const changed = board !== current;
  return { board: changed ? { ...board, revision: current.revision + 1 } : current, refused, changed };
}
function createFileStore(path = defaultBoardPath()) {
  let cache;
  const load = () => {
    if (cache) return cache;
    if (!existsSync(path)) return cache = emptyBoard();
    try {
      cache = sanitizeBoard(JSON.parse(readFileSync(path, "utf8")));
    } catch (error) {
      const aside = `${path}.broken-${Date.now()}`;
      console.warn(`[project-kanban] could not read ${path}; moved it to ${aside} and started an empty board.`, error);
      try {
        renameSync(path, aside);
      } catch {
      }
      cache = emptyBoard();
    }
    return cache;
  };
  const save = (board) => {
    mkdirSync(dirname(path), { recursive: true });
    const temp = `${path}.${process.pid}.tmp`;
    writeFileSync(temp, `${JSON.stringify(board, null, 2)}
`, { encoding: "utf8", mode: 384 });
    renameSync(temp, path);
  };
  return {
    read: () => load(),
    apply(ops) {
      const result = applyTo(load(), ops);
      if (result.changed) {
        save(result.board);
        cache = result.board;
      }
      return { board: result.board, refused: result.refused };
    }
  };
}
function createMemoryStore(initial = emptyBoard()) {
  let board = initial;
  return {
    read: () => board,
    apply(ops) {
      const result = applyTo(board, ops);
      board = result.board;
      return { board: result.board, refused: result.refused };
    }
  };
}

// src/index.ts
var name = "project-kanban";
var inject = [];
function apply(ctx, _config, store = createFileStore()) {
  ctx.inject(["webServer"], (routeCtx) => {
    const webserver = routeCtx.get("webServer");
    if (webserver === void 0) return;
    routeCtx.effect(() => {
      const dispose = webserver.register({
        kind: "prefix",
        path: KANBAN_PREFIX,
        handler: (req, res) => serveKanban(store, req, res)
      });
      return typeof dispose === "function" ? dispose : () => {
      };
    }, "project-kanban: route");
  });
}
export {
  BOARD_ENDPOINT,
  COLUMNS,
  COLUMN_LABELS,
  ID_PATTERN,
  KANBAN_PREFIX,
  LIMITS,
  MAX_BODY_BYTES,
  MAX_OPS_PER_REQUEST,
  OPS_ENDPOINT,
  PROJECT_COLORS,
  apply,
  applyOp,
  applyOps,
  cleanLine,
  cleanNote,
  columnCounts,
  createFileStore,
  createMemoryStore,
  defaultBoardPath,
  emptyBoard,
  inject,
  isColor,
  isColumn,
  name,
  newId,
  nextColumn,
  sanitizeBoard,
  sanitizeTask,
  serveKanban,
  tasksIn
};
