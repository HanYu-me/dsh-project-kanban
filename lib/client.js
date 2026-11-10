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
var ArrowLeftIcon = ({ size = 16, className }) => svg(size, className, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M19 12H5M11 6l-6 6 6 6" }));
var FolderIcon = ({ size = 16, className }) => svg(size, className, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" }));
var FolderPlusIcon = ({ size = 16, className }) => svg(size, className, [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" }, "a"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 11v5M9.5 13.5h5" }, "b")]);
var FileIcon = ({ size = 16, className }) => svg(size, className, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM14 3v5h5" }));
var ChartIcon = ({ size = 16, className }) => svg(size, className, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 20v-7M12 20V5M19 20v-10" }), 2);
var LinkIcon = ({ size = 16, className }) => svg(size, className, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" }));
var CopyIcon = ({ size = 16, className }) => svg(size, className, [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "9", y: "9", width: "11", height: "11", rx: "2" }, "a"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 15V6a2 2 0 0 1 2-2h8" }, "b")]);
var RecordsIcon = ({ size = 16, className }) => svg(size, className, [
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "5.5", cy: "6.5", r: "2" }, "a"),
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "5.5", cy: "17.5", r: "2" }, "b"),
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "18.5", cy: "12", r: "2" }, "c"),
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M7.5 6.5h3a3 3 0 0 1 3 3v.5a2 2 0 0 0 2 2h1M7.5 17.5h3a3 3 0 0 0 3-3V14a2 2 0 0 1 2-2" }, "d")
]);
var IndentIcon = ({ size = 16, className }) => svg(size, className, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 6h18M11 12h10M11 18h10M3 9l4 3-4 3Z" }));
var OutdentIcon = ({ size = 16, className }) => svg(size, className, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 6h18M11 12h10M11 18h10M7 9l-4 3 4 3Z" }));
var StarIcon = ({ size = 16, className, filled = false }) => svg(size, className, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m12 3.8 2.5 5.1 5.6.8-4.1 4 1 5.6-5-2.7-5 2.7 1-5.6-4.1-4 5.6-.8L12 3.8Z", fill: filled ? "currentColor" : "none" }), 1.6);
var RedoIcon = ({ size = 16, className }) => svg(size, className, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m15 14 5-5-5-5M20 9H10a6 6 0 0 0 0 12h3" }));
var PaletteIcon = ({ size = 16, className }) => svg(size, className, [
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 3a9 9 0 1 0 0 18c1.1 0 1.9-.8 1.9-1.8 0-.5-.2-.9-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4C21 6 17 3 12 3Z" }, "a"),
  // Dots as round-capped zero-length strokes, not <circle>s: dsh-oh-my-claude looks for two adjacent circles to find its usage ring.
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M7.6 11.2h.01M10.2 7.4h.01M14.6 7.4h.01", strokeWidth: 2.2 }, "b")
]);
var SwapIcon = ({ size = 16, className }) => svg(size, className, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m7 4-4 4 4 4M3 8h14M17 20l4-4-4-4M21 16H7" }));
var MinusIcon = ({ size = 16, className }) => svg(size, className, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 12h14" }));
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
var import_react6 = require("react");

// src/shared/text.ts
var ID_PATTERN = /^[A-Za-z0-9_-]{1,40}$/;
function cleanLine(value, max) {
  if (typeof value !== "string") return void 0;
  const text = value.replace(/\s+/g, " ").trim();
  if (text === "" || text.length > max) return void 0;
  return text;
}
function cleanPath(value, max) {
  if (typeof value !== "string") return void 0;
  const text = value.replace(/[\r\n]+/g, " ").trim();
  return text.length > max ? void 0 : text;
}
function cleanText(value, max) {
  if (typeof value !== "string") return void 0;
  const text = value.replace(/\r\n?/g, "\n").trim();
  return text.length > max ? void 0 : text;
}

// src/shared/records.ts
var RECORD_LIMITS = {
  name: 80,
  path: 1e3,
  description: 4e3,
  nodesPerSide: 2e3,
  links: 5e3,
  /** Most levels a tree may have (top level counts as one). */
  depth: 12,
  /** Connections between two results. */
  relations: 5e3,
  /** Colour categories of one kind (node or edge). */
  categories: 40,
  categoryName: 30
};
var EMPTY_RECORDS = Object.freeze({
  data: Object.freeze([]),
  results: Object.freeze([]),
  links: Object.freeze([])
});
function isSide(value) {
  return value === "data" || value === "result";
}
function listOf(records, side) {
  return side === "data" ? records.data : records.results;
}
function recordCounts(records) {
  return { data: records.data.length, results: records.results.length, links: records.links.length };
}
var NO_RELATIONS = Object.freeze([]);
var NO_CATEGORIES = Object.freeze([]);
function relationsOf(records) {
  return records.relations ?? NO_RELATIONS;
}
function categoriesOf(records, kind) {
  const palette = records.palette;
  if (!palette) return NO_CATEGORIES;
  return kind === "node" ? palette.nodeCategories : palette.edgeCategories;
}
function hasCategory(records, kind, id) {
  return typeof id === "string" && categoriesOf(records, kind).some((category) => category.id === id);
}
var HEX_COLOR = /^#[0-9a-fA-F]{6}$/;
function cleanColor(value) {
  if (typeof value !== "string") return void 0;
  const text = value.trim();
  return HEX_COLOR.test(text) ? text.toLowerCase() : void 0;
}
function pairKey(a, b) {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}
var NO_NODES = Object.freeze([]);
function indexNodes(nodes) {
  const byId = /* @__PURE__ */ new Map();
  const children = /* @__PURE__ */ new Map();
  for (const node of nodes) {
    byId.set(node.id, node);
    const list = children.get(node.parentId);
    if (list) list.push(node);
    else children.set(node.parentId, [node]);
  }
  return { byId, children };
}
function childrenOf(index, parentId) {
  return index.children.get(parentId) ?? NO_NODES;
}
function levelOf(index, id) {
  let level = 0;
  let current = index.byId.get(id);
  while (current && current.parentId !== null && level <= index.byId.size) {
    level += 1;
    current = index.byId.get(current.parentId);
  }
  return level;
}
function subtreeIds(index, id) {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  const stack = [id];
  while (stack.length > 0) {
    const current = stack.pop();
    if (seen.has(current)) continue;
    seen.add(current);
    out.push(current);
    const kids = childrenOf(index, current);
    for (let i = kids.length - 1; i >= 0; i--) stack.push(kids[i].id);
  }
  return out;
}
function heightBelow(index, id) {
  let max = 0;
  const seen = /* @__PURE__ */ new Set();
  const stack = [[id, 0]];
  while (stack.length > 0) {
    const [current, depth] = stack.pop();
    if (seen.has(current)) continue;
    seen.add(current);
    max = Math.max(max, depth);
    for (const kid of childrenOf(index, current)) stack.push([kid.id, depth + 1]);
  }
  return max;
}
function isInSubtree(index, rootId, id) {
  let current = index.byId.get(id);
  let steps = 0;
  while (current && steps <= index.byId.size) {
    if (current.id === rootId) return true;
    if (current.parentId === null) return false;
    current = index.byId.get(current.parentId);
    steps += 1;
  }
  return false;
}
var bad = (reason) => ({ ok: false, reason });
function locate(records, id) {
  if (typeof id !== "string") return void 0;
  const data = records.data.find((node) => node.id === id);
  if (data) return { side: "data", node: data };
  const result = records.results.find((node) => node.id === id);
  return result ? { side: "result", node: result } : void 0;
}
function withList(records, side, list) {
  return side === "data" ? { ...records, data: list } : { ...records, results: list };
}
function withRelations(records, list) {
  if (list.length > 0) return { ...records, relations: list };
  if (records.relations === void 0) return records;
  const { relations: _dropped, ...rest } = records;
  return rest;
}
function withPalette(records, palette) {
  const hasDefaults = palette.defaults !== void 0 && Object.keys(palette.defaults).length > 0;
  const clean = { nodeCategories: palette.nodeCategories, edgeCategories: palette.edgeCategories, ...hasDefaults ? { defaults: palette.defaults } : {} };
  if (clean.nodeCategories.length > 0 || clean.edgeCategories.length > 0 || hasDefaults) return { ...records, palette: clean };
  if (records.palette === void 0) return records;
  const { palette: _dropped, ...rest } = records;
  return rest;
}
function place(list, node, beforeId) {
  const out = list.slice();
  if (beforeId) {
    const at = out.findIndex((item) => item.id === beforeId && item.parentId === node.parentId);
    if (at >= 0) {
      out.splice(at, 0, node);
      return out;
    }
  }
  let last = -1;
  out.forEach((item, index) => {
    if (item.parentId === node.parentId) last = index;
  });
  out.splice(last >= 0 ? last + 1 : out.length, 0, node);
  return out;
}
function inPreorder(list) {
  const index = indexNodes(list);
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  const walk = (parentId) => {
    for (const node of index.children.get(parentId) ?? []) {
      if (seen.has(node.id)) continue;
      seen.add(node.id);
      out.push(node);
      walk(node.id);
    }
  };
  walk(null);
  for (const node of list) if (!seen.has(node.id)) out.push(node);
  return out.length === list.length && out.every((node, i) => node === list[i]) ? list : out;
}
function siblingIds(list, parentId) {
  return list.filter((node) => node.parentId === parentId).map((node) => node.id);
}
function sameList(a, b) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}
function applyRecordOp(records, op, at) {
  switch (op.type) {
    case "node.add":
      return addNode(records, op, at);
    case "node.update":
      return updateNode(records, op, at);
    case "node.move":
      return moveNode(records, op);
    case "node.delete":
      return deleteNode(records, op);
    case "node.restore":
      return restoreNodes(records, op);
    case "link.add":
      return addLink(records, op, at);
    case "link.update":
      return updateLink(records, op);
    case "link.delete": {
      if (typeof op.linkId !== "string" || !records.links.some((link) => link.id === op.linkId)) return bad("\u8FDE\u7EBF\u4E0D\u5B58\u5728");
      return { ok: true, records: { ...records, links: records.links.filter((link) => link.id !== op.linkId) } };
    }
    case "relation.add":
      return addRelation(records, op, at);
    case "relation.update":
      return updateRelation(records, op);
    case "relation.delete": {
      const relations = relationsOf(records);
      if (typeof op.relationId !== "string" || !relations.some((relation) => relation.id === op.relationId)) return bad("\u8FDE\u7EBF\u4E0D\u5B58\u5728");
      return { ok: true, records: withRelations(records, relations.filter((relation) => relation.id !== op.relationId)) };
    }
    case "category.add":
      return addCategory(records, op);
    case "category.update":
      return updateCategory(records, op);
    case "category.delete":
      return deleteCategory(records, op);
    case "palette.update":
      return updatePalette(records, op);
    default:
      return bad("\u672A\u77E5\u64CD\u4F5C");
  }
}
function addNode(records, op, at) {
  if (!isSide(op.side)) return bad("\u5206\u7C7B\u65E0\u6548");
  if (typeof op.id !== "string" || !ID_PATTERN.test(op.id)) return bad("\u8282\u70B9 id \u65E0\u6548");
  if (locate(records, op.id)) return bad("\u8282\u70B9\u5DF2\u5B58\u5728");
  const list = listOf(records, op.side);
  if (list.length >= RECORD_LIMITS.nodesPerSide) return bad(`\u8282\u70B9\u6570\u91CF\u5DF2\u8FBE\u4E0A\u9650\uFF08${RECORD_LIMITS.nodesPerSide}\uFF09`);
  const name = cleanLine(op.name, RECORD_LIMITS.name);
  if (name === void 0) return bad(`\u540D\u79F0\u9700\u4E3A 1\u2013${RECORD_LIMITS.name} \u4E2A\u5B57\u7B26`);
  const path = op.path === void 0 ? "" : cleanPath(op.path, RECORD_LIMITS.path);
  if (path === void 0) return bad(`\u5B8C\u6574\u8DEF\u5F84\u4E0D\u80FD\u8D85\u8FC7 ${RECORD_LIMITS.path} \u4E2A\u5B57\u7B26`);
  const description = op.description === void 0 ? "" : cleanText(op.description, RECORD_LIMITS.description);
  if (description === void 0) return bad(`\u63CF\u8FF0\u4E0D\u80FD\u8D85\u8FC7 ${RECORD_LIMITS.description} \u4E2A\u5B57\u7B26`);
  if (op.starred !== void 0 && typeof op.starred !== "boolean") return bad("\u65E0\u6548\u64CD\u4F5C");
  if (op.category !== void 0 && !hasCategory(records, "node", op.category)) return bad("\u7C7B\u522B\u4E0D\u5B58\u5728");
  const parentId = op.parentId ?? null;
  if (parentId !== null) {
    const index = indexNodes(list);
    if (typeof parentId !== "string" || !index.byId.has(parentId)) return bad("\u4E0A\u7EA7\u8282\u70B9\u4E0D\u5B58\u5728");
    if (levelOf(index, parentId) + 1 > RECORD_LIMITS.depth - 1) return bad(`\u5C42\u7EA7\u6700\u591A ${RECORD_LIMITS.depth} \u5C42`);
  }
  const node = {
    id: op.id,
    name,
    path,
    description,
    parentId,
    collapsed: false,
    createdAt: at,
    updatedAt: at,
    ...op.starred === true ? { starred: true } : {},
    ...op.category !== void 0 ? { category: op.category } : {}
  };
  return { ok: true, records: withList(records, op.side, inPreorder(place(list, node, op.beforeId))) };
}
function updateNode(records, op, at) {
  const found = locate(records, op.nodeId);
  if (!found) return bad("\u8282\u70B9\u4E0D\u5B58\u5728");
  const patch = {};
  if (op.name !== void 0) {
    const name = cleanLine(op.name, RECORD_LIMITS.name);
    if (name === void 0) return bad(`\u540D\u79F0\u9700\u4E3A 1\u2013${RECORD_LIMITS.name} \u4E2A\u5B57\u7B26`);
    patch.name = name;
  }
  if (op.path !== void 0) {
    const path = cleanPath(op.path, RECORD_LIMITS.path);
    if (path === void 0) return bad(`\u5B8C\u6574\u8DEF\u5F84\u4E0D\u80FD\u8D85\u8FC7 ${RECORD_LIMITS.path} \u4E2A\u5B57\u7B26`);
    patch.path = path;
  }
  if (op.description !== void 0) {
    const description = cleanText(op.description, RECORD_LIMITS.description);
    if (description === void 0) return bad(`\u63CF\u8FF0\u4E0D\u80FD\u8D85\u8FC7 ${RECORD_LIMITS.description} \u4E2A\u5B57\u7B26`);
    patch.description = description;
  }
  if (op.collapsed !== void 0) {
    if (typeof op.collapsed !== "boolean") return bad("\u65E0\u6548\u64CD\u4F5C");
    patch.collapsed = op.collapsed;
  }
  if (op.starred !== void 0) {
    if (typeof op.starred !== "boolean") return bad("\u65E0\u6548\u64CD\u4F5C");
    patch.starred = op.starred;
  }
  if (op.category !== void 0) {
    if (op.category !== null && !hasCategory(records, "node", op.category)) return bad("\u7C7B\u522B\u4E0D\u5B58\u5728");
    patch.category = op.category;
  }
  const node = found.node;
  const content = patch.name !== void 0 && patch.name !== node.name || patch.path !== void 0 && patch.path !== node.path || patch.description !== void 0 && patch.description !== node.description;
  const meta = patch.collapsed !== void 0 && patch.collapsed !== node.collapsed || patch.starred !== void 0 && patch.starred !== (node.starred === true) || patch.category !== void 0 && (patch.category ?? void 0) !== node.category;
  if (!content && !meta) return { ok: true, records };
  const next = { ...node };
  if (patch.name !== void 0) next.name = patch.name;
  if (patch.path !== void 0) next.path = patch.path;
  if (patch.description !== void 0) next.description = patch.description;
  if (patch.collapsed !== void 0) next.collapsed = patch.collapsed;
  if (patch.starred === true) next.starred = true;
  else if (patch.starred === false) delete next.starred;
  if (patch.category === null) delete next.category;
  else if (patch.category !== void 0) next.category = patch.category;
  if (content) next.updatedAt = at;
  const list = listOf(records, found.side).map((item) => item.id === node.id ? next : item);
  return { ok: true, records: withList(records, found.side, list) };
}
function moveNode(records, op) {
  const found = locate(records, op.nodeId);
  if (!found) return bad("\u8282\u70B9\u4E0D\u5B58\u5728");
  if (op.parentId !== null && typeof op.parentId !== "string") return bad("\u65E0\u6548\u64CD\u4F5C");
  const list = listOf(records, found.side);
  const index = indexNodes(list);
  const parentId = op.parentId;
  if (parentId !== null) {
    if (!index.byId.has(parentId)) return bad("\u4E0A\u7EA7\u8282\u70B9\u4E0D\u5B58\u5728");
    if (isInSubtree(index, found.node.id, parentId)) return bad("\u4E0D\u80FD\u628A\u8282\u70B9\u79FB\u5230\u5B83\u81EA\u5DF1\u7684\u4E0B\u7EA7");
    if (levelOf(index, parentId) + 1 + heightBelow(index, found.node.id) > RECORD_LIMITS.depth - 1) return bad(`\u5C42\u7EA7\u6700\u591A ${RECORD_LIMITS.depth} \u5C42`);
  }
  const beforeId = op.beforeId ?? null;
  if (beforeId === found.node.id) return { ok: true, records };
  const moved = parentId === found.node.parentId ? found.node : { ...found.node, parentId };
  const next = inPreorder(place(list.filter((node) => node.id !== found.node.id), moved, beforeId));
  if (parentId === found.node.parentId && sameList(siblingIds(list, parentId), siblingIds(next, parentId))) return { ok: true, records };
  return { ok: true, records: withList(records, found.side, next) };
}
function deleteNode(records, op) {
  const found = locate(records, op.nodeId);
  if (!found) return bad("\u8282\u70B9\u4E0D\u5B58\u5728");
  const list = listOf(records, found.side);
  const index = indexNodes(list);
  const id = found.node.id;
  if (op.lift === true) {
    const kids = childrenOf(index, id);
    const kidIds = new Set(kids.map((kid) => kid.id));
    const at = list.findIndex((node) => node.id === id);
    const slot = list.slice(0, at).filter((node) => !kidIds.has(node.id)).length;
    const next = list.filter((node) => node.id !== id && !kidIds.has(node.id));
    next.splice(slot, 0, ...kids.map((kid) => ({ ...kid, parentId: found.node.parentId })));
    const links2 = records.links.filter((link) => link.dataId !== id && link.resultId !== id);
    const relations2 = relationsOf(records).filter((relation) => relation.fromId !== id && relation.toId !== id);
    return { ok: true, records: withRelations({ ...withList(records, found.side, inPreorder(next)), links: links2 }, relations2) };
  }
  const gone = new Set(subtreeIds(index, id));
  const links = records.links.filter((link) => !gone.has(link.dataId) && !gone.has(link.resultId));
  const relations = relationsOf(records).filter((relation) => !gone.has(relation.fromId) && !gone.has(relation.toId));
  return { ok: true, records: withRelations({ ...withList(records, found.side, list.filter((node) => !gone.has(node.id))), links }, relations) };
}
function restoreNodes(records, op) {
  if (!isSide(op.side)) return bad("\u5206\u7C7B\u65E0\u6548");
  if (!Array.isArray(op.nodes) || op.nodes.length === 0) return bad("\u8282\u70B9\u6570\u636E\u65E0\u6548");
  const list = listOf(records, op.side);
  if (list.length + op.nodes.length > RECORD_LIMITS.nodesPerSide) return bad(`\u8282\u70B9\u6570\u91CF\u5DF2\u8FBE\u4E0A\u9650\uFF08${RECORD_LIMITS.nodesPerSide}\uFF09`);
  const nodes = [];
  const ids = /* @__PURE__ */ new Set();
  for (const raw of op.nodes) {
    const node = sanitizeNode(raw);
    if (!node) return bad("\u8282\u70B9\u6570\u636E\u65E0\u6548");
    if (ids.has(node.id) || locate(records, node.id)) return bad("\u8282\u70B9\u5DF2\u5B58\u5728");
    if (node.category !== void 0 && !hasCategory(records, "node", node.category)) delete node.category;
    ids.add(node.id);
    nodes.push(node);
  }
  const roots = nodes.filter((node) => node.parentId === null || !ids.has(node.parentId));
  if (roots.length !== 1) return bad("\u8282\u70B9\u6570\u636E\u65E0\u6548");
  const root = roots[0];
  const block = indexNodes(nodes);
  if (subtreeIds(block, root.id).length !== nodes.length) return bad("\u8282\u70B9\u6570\u636E\u65E0\u6548");
  const index = indexNodes(list);
  if (root.parentId !== null && !index.byId.has(root.parentId)) return bad("\u4E0A\u7EA7\u8282\u70B9\u4E0D\u5B58\u5728");
  const rootLevel = root.parentId === null ? 0 : levelOf(index, root.parentId) + 1;
  if (rootLevel + heightBelow(block, root.id) > RECORD_LIMITS.depth - 1) return bad(`\u5C42\u7EA7\u6700\u591A ${RECORD_LIMITS.depth} \u5C42`);
  const dataIds = new Set((op.side === "data" ? [...list, ...nodes] : records.data).map((node) => node.id));
  const resultIds = new Set((op.side === "result" ? [...list, ...nodes] : records.results).map((node) => node.id));
  const linkIds = new Set(records.links.map((link) => link.id));
  const pairs = new Set(records.links.map((link) => `${link.dataId}>${link.resultId}`));
  const links = records.links.slice();
  for (const raw of Array.isArray(op.links) ? op.links : []) {
    const link = sanitizeLink(raw);
    if (!link || !dataIds.has(link.dataId) || !resultIds.has(link.resultId)) continue;
    const pair = `${link.dataId}>${link.resultId}`;
    if (linkIds.has(link.id) || pairs.has(pair) || links.length >= RECORD_LIMITS.links) continue;
    if (link.category !== void 0 && !hasCategory(records, "edge", link.category)) delete link.category;
    linkIds.add(link.id);
    pairs.add(pair);
    links.push(link);
  }
  const relations = relationsOf(records).slice();
  const relationIds = new Set(relations.map((relation) => relation.id));
  const relationPairs = new Set(relations.map((relation) => pairKey(relation.fromId, relation.toId)));
  for (const raw of Array.isArray(op.relations) ? op.relations : []) {
    const relation = sanitizeRelation(raw);
    if (!relation || relation.fromId === relation.toId || !resultIds.has(relation.fromId) || !resultIds.has(relation.toId)) continue;
    const pair = pairKey(relation.fromId, relation.toId);
    if (relationIds.has(relation.id) || relationPairs.has(pair) || relations.length >= RECORD_LIMITS.relations) continue;
    if (relation.category !== void 0 && !hasCategory(records, "edge", relation.category)) delete relation.category;
    relationIds.add(relation.id);
    relationPairs.add(pair);
    relations.push(relation);
  }
  const at = typeof op.index === "number" && Number.isInteger(op.index) ? Math.max(0, Math.min(list.length, op.index)) : list.length;
  const next = list.slice();
  next.splice(at, 0, ...nodes);
  return { ok: true, records: withRelations({ ...withList(records, op.side, inPreorder(next)), links }, relations) };
}
function addLink(records, op, at) {
  if (typeof op.id !== "string" || !ID_PATTERN.test(op.id)) return bad("\u8FDE\u7EBF id \u65E0\u6548");
  if (records.links.some((link2) => link2.id === op.id)) return bad("\u8FDE\u7EBF\u5DF2\u5B58\u5728");
  if (!records.data.some((node) => node.id === op.dataId)) return bad("\u6570\u636E\u8282\u70B9\u4E0D\u5B58\u5728");
  if (!records.results.some((node) => node.id === op.resultId)) return bad("\u7ED3\u679C\u8282\u70B9\u4E0D\u5B58\u5728");
  if (records.links.some((link2) => link2.dataId === op.dataId && link2.resultId === op.resultId)) return bad("\u8FDE\u7EBF\u5DF2\u5B58\u5728");
  if (records.links.length >= RECORD_LIMITS.links) return bad(`\u8FDE\u7EBF\u6570\u91CF\u5DF2\u8FBE\u4E0A\u9650\uFF08${RECORD_LIMITS.links}\uFF09`);
  if (op.category !== void 0 && !hasCategory(records, "edge", op.category)) return bad("\u7C7B\u522B\u4E0D\u5B58\u5728");
  const link = { id: op.id, dataId: op.dataId, resultId: op.resultId, createdAt: at, ...op.category !== void 0 ? { category: op.category } : {} };
  return { ok: true, records: { ...records, links: [...records.links, link] } };
}
function updateLink(records, op) {
  const found = typeof op.linkId === "string" ? records.links.find((link) => link.id === op.linkId) : void 0;
  if (!found) return bad("\u8FDE\u7EBF\u4E0D\u5B58\u5728");
  if (op.category === void 0) return { ok: true, records };
  if (op.category !== null && !hasCategory(records, "edge", op.category)) return bad("\u7C7B\u522B\u4E0D\u5B58\u5728");
  if ((op.category ?? void 0) === found.category) return { ok: true, records };
  const next = { ...found };
  if (op.category === null) delete next.category;
  else next.category = op.category;
  return { ok: true, records: { ...records, links: records.links.map((link) => link.id === found.id ? next : link) } };
}
function addRelation(records, op, at) {
  if (typeof op.id !== "string" || !ID_PATTERN.test(op.id)) return bad("\u8FDE\u7EBF id \u65E0\u6548");
  const relations = relationsOf(records);
  if (relations.some((relation2) => relation2.id === op.id)) return bad("\u8FDE\u7EBF\u5DF2\u5B58\u5728");
  if (typeof op.fromId !== "string" || typeof op.toId !== "string" || !records.results.some((node) => node.id === op.fromId) || !records.results.some((node) => node.id === op.toId)) {
    return bad("\u7ED3\u679C\u8282\u70B9\u4E0D\u5B58\u5728");
  }
  if (op.fromId === op.toId) return bad("\u4E0D\u80FD\u628A\u7ED3\u679C\u8FDE\u5230\u5B83\u81EA\u5DF1");
  const pair = pairKey(op.fromId, op.toId);
  if (relations.some((relation2) => pairKey(relation2.fromId, relation2.toId) === pair)) return bad("\u8FDE\u7EBF\u5DF2\u5B58\u5728");
  if (relations.length >= RECORD_LIMITS.relations) return bad(`\u8FDE\u7EBF\u6570\u91CF\u5DF2\u8FBE\u4E0A\u9650\uFF08${RECORD_LIMITS.relations}\uFF09`);
  if (op.directed !== void 0 && typeof op.directed !== "boolean") return bad("\u65E0\u6548\u64CD\u4F5C");
  if (op.category !== void 0 && !hasCategory(records, "edge", op.category)) return bad("\u7C7B\u522B\u4E0D\u5B58\u5728");
  const relation = {
    id: op.id,
    fromId: op.fromId,
    toId: op.toId,
    createdAt: at,
    ...op.directed === true ? { directed: true } : {},
    ...op.category !== void 0 ? { category: op.category } : {}
  };
  return { ok: true, records: withRelations(records, [...relations, relation]) };
}
function updateRelation(records, op) {
  const relations = relationsOf(records);
  const found = typeof op.relationId === "string" ? relations.find((relation) => relation.id === op.relationId) : void 0;
  if (!found) return bad("\u8FDE\u7EBF\u4E0D\u5B58\u5728");
  if (op.directed !== void 0 && typeof op.directed !== "boolean") return bad("\u65E0\u6548\u64CD\u4F5C");
  if (op.reverse !== void 0 && typeof op.reverse !== "boolean") return bad("\u65E0\u6548\u64CD\u4F5C");
  if (op.category !== void 0 && op.category !== null && !hasCategory(records, "edge", op.category)) return bad("\u7C7B\u522B\u4E0D\u5B58\u5728");
  let next = { ...found };
  if (op.directed === true) next.directed = true;
  else if (op.directed === false) delete next.directed;
  if (op.reverse === true) next = { ...next, fromId: found.toId, toId: found.fromId };
  if (op.category === null) delete next.category;
  else if (op.category !== void 0) next.category = op.category;
  const same = next.fromId === found.fromId && next.toId === found.toId && next.directed === found.directed && next.category === found.category;
  if (same) return { ok: true, records };
  return { ok: true, records: withRelations(records, relations.map((relation) => relation.id === found.id ? next : relation)) };
}
var EMPTY_PALETTE = { nodeCategories: [], edgeCategories: [] };
function paletteOf(records) {
  return records.palette ?? EMPTY_PALETTE;
}
function addCategory(records, op) {
  if (op.kind !== "node" && op.kind !== "edge") return bad("\u7C7B\u522B\u79CD\u7C7B\u65E0\u6548");
  if (typeof op.id !== "string" || !ID_PATTERN.test(op.id)) return bad("\u7C7B\u522B id \u65E0\u6548");
  const palette = paletteOf(records);
  if ([...palette.nodeCategories, ...palette.edgeCategories].some((category) => category.id === op.id)) return bad("\u7C7B\u522B\u5DF2\u5B58\u5728");
  const name = cleanLine(op.name, RECORD_LIMITS.categoryName);
  if (name === void 0) return bad(`\u7C7B\u522B\u540D\u79F0\u9700\u4E3A 1\u2013${RECORD_LIMITS.categoryName} \u4E2A\u5B57\u7B26`);
  const color = cleanColor(op.color);
  if (color === void 0) return bad("\u989C\u8272\u9700\u8981\u662F #RRGGBB");
  const list = op.kind === "node" ? palette.nodeCategories : palette.edgeCategories;
  if (list.length >= RECORD_LIMITS.categories) return bad(`\u7C7B\u522B\u6570\u91CF\u5DF2\u8FBE\u4E0A\u9650\uFF08${RECORD_LIMITS.categories}\uFF09`);
  const at = typeof op.index === "number" && Number.isInteger(op.index) ? Math.max(0, Math.min(list.length, op.index)) : list.length;
  const next = list.slice();
  next.splice(at, 0, { id: op.id, name, color });
  return { ok: true, records: withPalette(records, op.kind === "node" ? { ...palette, nodeCategories: next } : { ...palette, edgeCategories: next }) };
}
function updateCategory(records, op) {
  if (op.kind !== "node" && op.kind !== "edge") return bad("\u7C7B\u522B\u79CD\u7C7B\u65E0\u6548");
  const palette = paletteOf(records);
  const list = op.kind === "node" ? palette.nodeCategories : palette.edgeCategories;
  const found = typeof op.categoryId === "string" ? list.find((category) => category.id === op.categoryId) : void 0;
  if (!found) return bad("\u7C7B\u522B\u4E0D\u5B58\u5728");
  let name = found.name;
  let color = found.color;
  if (op.name !== void 0) {
    const cleaned = cleanLine(op.name, RECORD_LIMITS.categoryName);
    if (cleaned === void 0) return bad(`\u7C7B\u522B\u540D\u79F0\u9700\u4E3A 1\u2013${RECORD_LIMITS.categoryName} \u4E2A\u5B57\u7B26`);
    name = cleaned;
  }
  if (op.color !== void 0) {
    const cleaned = cleanColor(op.color);
    if (cleaned === void 0) return bad("\u989C\u8272\u9700\u8981\u662F #RRGGBB");
    color = cleaned;
  }
  if (name === found.name && color === found.color) return { ok: true, records };
  const next = list.map((category) => category.id === found.id ? { ...category, name, color } : category);
  return { ok: true, records: withPalette(records, op.kind === "node" ? { ...palette, nodeCategories: next } : { ...palette, edgeCategories: next }) };
}
function deleteCategory(records, op) {
  if (op.kind !== "node" && op.kind !== "edge") return bad("\u7C7B\u522B\u79CD\u7C7B\u65E0\u6548");
  const palette = paletteOf(records);
  const list = op.kind === "node" ? palette.nodeCategories : palette.edgeCategories;
  if (typeof op.categoryId !== "string" || !list.some((category) => category.id === op.categoryId)) return bad("\u7C7B\u522B\u4E0D\u5B58\u5728");
  const id = op.categoryId;
  const without = list.filter((category) => category.id !== id);
  let next = withPalette(records, op.kind === "node" ? { ...palette, nodeCategories: without } : { ...palette, edgeCategories: without });
  const clear = (items) => items.some((item) => item.category === id) ? items.map((item) => {
    if (item.category !== id) return item;
    const { category: _dropped, ...rest } = item;
    return rest;
  }) : items;
  if (op.kind === "node") next = { ...next, data: clear(next.data), results: clear(next.results) };
  else next = withRelations({ ...next, links: clear(next.links) }, clear(relationsOf(next).slice()));
  return { ok: true, records: next };
}
function updatePalette(records, op) {
  const palette = paletteOf(records);
  const defaults = { ...palette.defaults ?? {} };
  let changed = false;
  for (const key of ["node", "edge", "star"]) {
    const value = op[key];
    if (value === void 0) continue;
    if (value === null) {
      if (defaults[key] !== void 0) changed = true;
      delete defaults[key];
      continue;
    }
    const color = cleanColor(value);
    if (color === void 0) return bad("\u989C\u8272\u9700\u8981\u662F #RRGGBB");
    if (defaults[key] !== color) changed = true;
    defaults[key] = color;
  }
  if (!changed) return { ok: true, records };
  return { ok: true, records: withPalette(records, { ...palette, defaults }) };
}
var nowIso = () => (/* @__PURE__ */ new Date()).toISOString();
var validId = (value) => typeof value === "string" && ID_PATTERN.test(value);
function sanitizeNode(value) {
  const raw = value;
  if (raw === null || typeof raw !== "object") return void 0;
  if (!validId(raw.id)) return void 0;
  const name = cleanLine(raw.name, RECORD_LIMITS.name);
  const path = raw.path === void 0 ? "" : cleanPath(raw.path, RECORD_LIMITS.path);
  const description = raw.description === void 0 ? "" : cleanText(raw.description, RECORD_LIMITS.description);
  if (name === void 0 || path === void 0 || description === void 0) return void 0;
  const parentId = raw.parentId === null || raw.parentId === void 0 ? null : validId(raw.parentId) ? raw.parentId : void 0;
  if (parentId === void 0) return void 0;
  const createdAt = typeof raw.createdAt === "string" ? raw.createdAt : nowIso();
  const node = { id: raw.id, name, path, description, parentId, collapsed: raw.collapsed === true, createdAt, updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : createdAt };
  if (raw.starred === true) node.starred = true;
  if (validId(raw.category)) node.category = raw.category;
  return node;
}
function sanitizeLink(value) {
  const raw = value;
  if (raw === null || typeof raw !== "object") return void 0;
  if (!validId(raw.id) || !validId(raw.dataId) || !validId(raw.resultId)) return void 0;
  const link = { id: raw.id, dataId: raw.dataId, resultId: raw.resultId, createdAt: typeof raw.createdAt === "string" ? raw.createdAt : nowIso() };
  if (validId(raw.category)) link.category = raw.category;
  return link;
}
function sanitizeRelation(value) {
  const raw = value;
  if (raw === null || typeof raw !== "object") return void 0;
  if (!validId(raw.id) || !validId(raw.fromId) || !validId(raw.toId)) return void 0;
  const relation = { id: raw.id, fromId: raw.fromId, toId: raw.toId, createdAt: typeof raw.createdAt === "string" ? raw.createdAt : nowIso() };
  if (raw.directed === true) relation.directed = true;
  if (validId(raw.category)) relation.category = raw.category;
  return relation;
}
function sanitizeCategories(value, seen) {
  const out = [];
  for (const item of Array.isArray(value) ? value : []) {
    const raw = item;
    if (raw === null || typeof raw !== "object" || !validId(raw.id) || seen.has(raw.id)) continue;
    const name = cleanLine(raw.name, RECORD_LIMITS.categoryName);
    const color = cleanColor(raw.color);
    if (name === void 0 || color === void 0) continue;
    if (out.length >= RECORD_LIMITS.categories) break;
    seen.add(raw.id);
    out.push({ id: raw.id, name, color });
  }
  return out;
}
function sanitizePalette(value) {
  if (value === null || typeof value !== "object") return void 0;
  const raw = value;
  const seen = /* @__PURE__ */ new Set();
  const nodeCategories = sanitizeCategories(raw.nodeCategories, seen);
  const edgeCategories = sanitizeCategories(raw.edgeCategories, seen);
  const defaults = {};
  if (raw.defaults !== null && typeof raw.defaults === "object") {
    const given = raw.defaults;
    for (const key of ["node", "edge", "star"]) {
      const color = cleanColor(given[key]);
      if (color !== void 0) defaults[key] = color;
    }
  }
  const hasDefaults = Object.keys(defaults).length > 0;
  if (nodeCategories.length === 0 && edgeCategories.length === 0 && !hasDefaults) return void 0;
  return { nodeCategories, edgeCategories, ...hasDefaults ? { defaults } : {} };
}
function sanitizeNodeList(value, seen) {
  const nodes = [];
  for (const item of Array.isArray(value) ? value : []) {
    const node = sanitizeNode(item);
    if (!node || seen.has(node.id)) continue;
    if (nodes.length >= RECORD_LIMITS.nodesPerSide) break;
    seen.add(node.id);
    nodes.push(node);
  }
  const byId = new Map(nodes.map((node) => [node.id, node]));
  for (const node of nodes) {
    if (node.parentId !== null && (node.parentId === node.id || !byId.has(node.parentId))) node.parentId = null;
  }
  for (const node of nodes) {
    const chain = /* @__PURE__ */ new Set();
    let current = node;
    while (current && current.parentId !== null) {
      if (chain.has(current.id)) {
        current.parentId = null;
        break;
      }
      chain.add(current.id);
      current = byId.get(current.parentId);
    }
  }
  return inPreorder(nodes);
}
function sanitizeRecords(value) {
  if (value === null || typeof value !== "object") return void 0;
  const raw = value;
  const palette = sanitizePalette(raw.palette);
  const nodeCategoryIds = new Set(palette?.nodeCategories.map((category) => category.id));
  const edgeCategoryIds = new Set(palette?.edgeCategories.map((category) => category.id));
  const seen = /* @__PURE__ */ new Set();
  const data = sanitizeNodeList(raw.data, seen);
  const results = sanitizeNodeList(raw.results, seen);
  if (data.length === 0 && results.length === 0 && !palette) return void 0;
  for (const node of [...data, ...results]) if (node.category !== void 0 && !nodeCategoryIds.has(node.category)) delete node.category;
  const dataIds = new Set(data.map((node) => node.id));
  const resultIds = new Set(results.map((node) => node.id));
  const linkIds = /* @__PURE__ */ new Set();
  const pairs = /* @__PURE__ */ new Set();
  const links = [];
  for (const item of Array.isArray(raw.links) ? raw.links : []) {
    const link = sanitizeLink(item);
    if (!link || !dataIds.has(link.dataId) || !resultIds.has(link.resultId) || linkIds.has(link.id)) continue;
    const pair = `${link.dataId}>${link.resultId}`;
    if (pairs.has(pair)) continue;
    if (links.length >= RECORD_LIMITS.links) break;
    if (link.category !== void 0 && !edgeCategoryIds.has(link.category)) delete link.category;
    linkIds.add(link.id);
    pairs.add(pair);
    links.push(link);
  }
  const relationIds = /* @__PURE__ */ new Set();
  const relationPairs = /* @__PURE__ */ new Set();
  const relations = [];
  for (const item of Array.isArray(raw.relations) ? raw.relations : []) {
    const relation = sanitizeRelation(item);
    if (!relation || relation.fromId === relation.toId || !resultIds.has(relation.fromId) || !resultIds.has(relation.toId) || relationIds.has(relation.id)) continue;
    const pair = pairKey(relation.fromId, relation.toId);
    if (relationPairs.has(pair)) continue;
    if (relations.length >= RECORD_LIMITS.relations) break;
    if (relation.category !== void 0 && !edgeCategoryIds.has(relation.category)) delete relation.category;
    relationIds.add(relation.id);
    relationPairs.add(pair);
    relations.push(relation);
  }
  return { data, results, links, ...relations.length > 0 ? { relations } : {}, ...palette ? { palette } : {} };
}

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
function cleanNote(value) {
  if (typeof value !== "string") return void 0;
  const text = value.replace(/\r\n?/g, "\n").trim();
  return text.length > LIMITS.taskNote ? void 0 : text;
}
function tasksIn(project, column) {
  return project.tasks.filter((task) => task.column === column);
}
function recordsOf(project) {
  return project.records ?? EMPTY_RECORDS;
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
    case "node.add":
    case "node.update":
    case "node.move":
    case "node.delete":
    case "node.restore":
    case "link.add":
    case "link.update":
    case "link.delete":
    case "relation.add":
    case "relation.update":
    case "relation.delete":
    case "category.add":
    case "category.update":
    case "category.delete":
    case "palette.update": {
      const project = findProject(op.projectId);
      if (!project) return refuse(board, "\u9879\u76EE\u4E0D\u5B58\u5728");
      const before = recordsOf(project);
      const result = applyRecordOp(before, op, timeOf(op));
      if (!result.ok) return refuse(board, result.reason);
      if (result.records === before) return { ok: true, board };
      return { ok: true, board: withProject(board, project.id, (p) => ({ ...p, records: result.records })) };
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
    const records = sanitizeRecords(p.records);
    board.projects.push({
      id: p.id,
      name,
      color: isColor(p.color) ? p.color : "blue",
      collapsed: p.collapsed === true,
      createdAt: typeof p.createdAt === "string" ? p.createdAt : (/* @__PURE__ */ new Date()).toISOString(),
      tasks,
      ...records ? { records } : {}
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

// src/client/common.tsx
var import_react = require("react");
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
var STATUS_TEXT = {
  loading: "\u52A0\u8F7D\u4E2D",
  saved: "\u5DF2\u4FDD\u5B58",
  saving: "\u4FDD\u5B58\u4E2D\u2026",
  offline: "\u672A\u8FDE\u63A5\uFF0C\u7A0D\u540E\u81EA\u52A8\u91CD\u8BD5",
  "load-failed": "\u52A0\u8F7D\u5931\u8D25"
};
function SaveStatus({ status }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "kb-status" + (status === "saving" ? " is-saving" : "") + (status === "offline" ? " is-offline" : ""), role: "status", "data-kb-save-status": "", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("i", {}),
    STATUS_TEXT[status]
  ] });
}

// src/client/RecordsView.tsx
var import_react5 = require("react");

// src/shared/records-history.ts
function find(records, id) {
  const data = records.data.find((node) => node.id === id);
  if (data) return { side: "data", node: data };
  const result = records.results.find((node) => node.id === id);
  return result ? { side: "result", node: result } : void 0;
}
function invertRecordOp(before, op) {
  const projectId = op.projectId;
  switch (op.type) {
    case "node.add":
      return [{ type: "node.delete", projectId, nodeId: op.id }];
    case "node.update": {
      const found = find(before, op.nodeId);
      if (!found) return [];
      const back = { type: "node.update", projectId, nodeId: op.nodeId };
      if (op.name !== void 0) back.name = found.node.name;
      if (op.path !== void 0) back.path = found.node.path;
      if (op.description !== void 0) back.description = found.node.description;
      if (op.collapsed !== void 0) back.collapsed = found.node.collapsed;
      if (op.starred !== void 0) back.starred = found.node.starred === true;
      if (op.category !== void 0) back.category = found.node.category ?? null;
      return [back];
    }
    case "node.move": {
      const found = find(before, op.nodeId);
      if (!found) return [];
      const siblings = childrenOf(indexNodes(listOf(before, found.side)), found.node.parentId);
      const at = siblings.findIndex((node) => node.id === found.node.id);
      return [{ type: "node.move", projectId, nodeId: found.node.id, parentId: found.node.parentId, beforeId: siblings[at + 1]?.id ?? null }];
    }
    case "node.delete": {
      const found = find(before, op.nodeId);
      if (!found) return [];
      const list = listOf(before, found.side);
      const index = indexNodes(list);
      const at = list.findIndex((node) => node.id === found.node.id);
      if (op.lift === true) {
        const own = (id) => id === found.node.id;
        return [
          {
            type: "node.restore",
            projectId,
            side: found.side,
            nodes: [found.node],
            links: before.links.filter((link) => own(link.dataId) || own(link.resultId)),
            relations: relationsOf(before).filter((relation) => own(relation.fromId) || own(relation.toId)),
            index: at
          },
          ...childrenOf(index, found.node.id).map((kid) => ({ type: "node.move", projectId, nodeId: kid.id, parentId: found.node.id, beforeId: null }))
        ];
      }
      const gone = new Set(subtreeIds(index, found.node.id));
      const slot = at - list.slice(0, at).filter((node) => gone.has(node.id)).length;
      return [
        {
          type: "node.restore",
          projectId,
          side: found.side,
          nodes: list.filter((node) => gone.has(node.id)),
          links: before.links.filter((link) => gone.has(link.dataId) || gone.has(link.resultId)),
          relations: relationsOf(before).filter((relation) => gone.has(relation.fromId) || gone.has(relation.toId)),
          index: slot
        }
      ];
    }
    case "node.restore": {
      const ids = new Set(op.nodes.map((node) => node.id));
      const root = op.nodes.find((node) => node.parentId === null || !ids.has(node.parentId));
      return root ? [{ type: "node.delete", projectId, nodeId: root.id }] : [];
    }
    case "link.add":
      return [{ type: "link.delete", projectId, linkId: op.id }];
    case "link.update": {
      const link = before.links.find((item) => item.id === op.linkId);
      return link ? [{ type: "link.update", projectId, linkId: link.id, category: link.category ?? null }] : [];
    }
    case "link.delete": {
      const link = before.links.find((item) => item.id === op.linkId);
      if (!link) return [];
      return [{ type: "link.add", projectId, id: link.id, dataId: link.dataId, resultId: link.resultId, at: link.createdAt, ...link.category !== void 0 ? { category: link.category } : {} }];
    }
    case "relation.add":
      return [{ type: "relation.delete", projectId, relationId: op.id }];
    case "relation.update": {
      const relation = relationsOf(before).find((item) => item.id === op.relationId);
      if (!relation) return [];
      const back = { type: "relation.update", projectId, relationId: relation.id };
      if (op.directed !== void 0) back.directed = relation.directed === true;
      if (op.reverse === true) back.reverse = true;
      if (op.category !== void 0) back.category = relation.category ?? null;
      return [back];
    }
    case "relation.delete": {
      const relation = relationsOf(before).find((item) => item.id === op.relationId);
      if (!relation) return [];
      return [
        {
          type: "relation.add",
          projectId,
          id: relation.id,
          fromId: relation.fromId,
          toId: relation.toId,
          at: relation.createdAt,
          ...relation.directed === true ? { directed: true } : {},
          ...relation.category !== void 0 ? { category: relation.category } : {}
        }
      ];
    }
    case "category.add":
      return [{ type: "category.delete", projectId, kind: op.kind, categoryId: op.id }];
    case "category.update": {
      const category = categoriesOf(before, op.kind).find((item) => item.id === op.categoryId);
      if (!category) return [];
      return [{ type: "category.update", projectId, kind: op.kind, categoryId: category.id, ...op.name !== void 0 ? { name: category.name } : {}, ...op.color !== void 0 ? { color: category.color } : {} }];
    }
    case "category.delete": {
      const list = categoriesOf(before, op.kind);
      const at = list.findIndex((item) => item.id === op.categoryId);
      const category = list[at];
      if (!category) return [];
      const back = [{ type: "category.add", projectId, kind: op.kind, id: category.id, name: category.name, color: category.color, index: at }];
      if (op.kind === "node") {
        for (const node of [...before.data, ...before.results]) if (node.category === category.id) back.push({ type: "node.update", projectId, nodeId: node.id, category: category.id });
      } else {
        for (const link of before.links) if (link.category === category.id) back.push({ type: "link.update", projectId, linkId: link.id, category: category.id });
        for (const relation of relationsOf(before)) if (relation.category === category.id) back.push({ type: "relation.update", projectId, relationId: relation.id, category: category.id });
      }
      return back;
    }
    case "palette.update": {
      const back = { type: "palette.update", projectId };
      for (const key of ["node", "edge", "star"]) if (op[key] !== void 0) back[key] = before.palette?.defaults?.[key] ?? null;
      return [back];
    }
    default:
      return [];
  }
}
function planOps(records, ops, at) {
  let current = records;
  const applied = [];
  const inverses = [];
  const refused = [];
  ops.forEach((op, index) => {
    const result = applyRecordOp(current, op, at);
    if (!result.ok) {
      refused.push({ index, reason: result.reason });
      return;
    }
    if (result.records === current) return;
    inverses.push(invertRecordOp(current, op));
    applied.push(op);
    current = result.records;
  });
  return { applied, inverse: inverses.reverse().flat(), after: current, refused };
}

// src/client/PalettePanel.tsx
var import_react3 = require("react");

// src/client/recordsContext.ts
var import_react2 = require("react");
var RecordsContext = (0, import_react2.createContext)(null);
function useRecords() {
  const value = (0, import_react2.useContext)(RecordsContext);
  if (!value) throw new Error("RecordsView context missing");
  return value;
}

// src/client/recordsModel.ts
function starViewOf(index, nodes) {
  const starred = /* @__PURE__ */ new Set();
  const only = /* @__PURE__ */ new Set();
  for (const node of nodes) {
    if (node.starred !== true) continue;
    starred.add(node.id);
    for (let current = node, steps = 0; current && !only.has(current.id) && steps <= nodes.length; steps++) {
      only.add(current.id);
      current = current.parentId === null ? void 0 : index.byId.get(current.parentId);
    }
    only.add(node.id);
  }
  return { only, starred };
}
function flattenTree(index, formParent, view) {
  const rows = [];
  const anchor = /* @__PURE__ */ new Map();
  const shown = (parentId) => {
    const kids = childrenOf(index, parentId);
    return view ? kids.filter((kid) => view.only.has(kid.id)) : kids;
  };
  const walk = (parentId, depth, hiddenBy) => {
    for (const node of shown(parentId)) {
      const kids = shown(node.id);
      anchor.set(node.id, hiddenBy ?? node.id);
      const folded = view === void 0 && node.collapsed && kids.length > 0;
      if (hiddenBy === null) rows.push({ kind: "node", node, depth, childCount: kids.length, expanded: kids.length > 0 && !folded, context: view !== void 0 && !view.starred.has(node.id) });
      walk(node.id, depth + 1, hiddenBy ?? (folded ? node.id : null));
    }
    if (hiddenBy === null && formParent !== void 0 && formParent === parentId) rows.push({ kind: "form", parentId, depth });
  };
  walk(null, 0, null);
  return { rows, anchor };
}
function zoneAt(clientY, top, height) {
  if (!(height > 0)) return "inside";
  const ratio = (clientY - top) / height;
  return ratio < 0.3 ? "before" : ratio > 0.7 ? "after" : "inside";
}
function dropTarget(index, targetId, zone, skip) {
  const target = index.byId.get(targetId);
  if (!target) return void 0;
  const firstFree = (nodes) => nodes.find((node) => !skip.has(node.id))?.id ?? null;
  if (zone === "inside") return { parentId: target.id, beforeId: null };
  if (zone === "before") return { parentId: target.parentId, beforeId: target.id };
  const kids = childrenOf(index, target.id);
  if (kids.length > 0 && !target.collapsed) return { parentId: target.id, beforeId: firstFree(kids) };
  const siblings = childrenOf(index, target.parentId);
  const at = siblings.findIndex((node) => node.id === target.id);
  return { parentId: target.parentId, beforeId: firstFree(siblings.slice(at + 1)) };
}
function movableIds(index, ids, parentId) {
  const chosen = new Set(ids);
  return ids.filter((id) => {
    if (!index.byId.has(id)) return false;
    if (parentId !== null && isInSubtree(index, id, parentId)) return false;
    for (let parent = index.byId.get(id)?.parentId ?? null, steps = 0; parent !== null && steps <= index.byId.size; steps++) {
      if (chosen.has(parent)) return false;
      parent = index.byId.get(parent)?.parentId ?? null;
    }
    return true;
  });
}
function inRowOrder(rows, ids) {
  const out = [];
  for (const row of rows) if (row.kind === "node" && ids.has(row.node.id)) out.push(row.node.id);
  return out;
}
var NO_HIGHLIGHT = { active: /* @__PURE__ */ new Set(), linkIds: /* @__PURE__ */ new Set(), relationIds: /* @__PURE__ */ new Set(), linked: /* @__PURE__ */ new Set() };
function highlightFor(records, indexes, focusId) {
  if (focusId === null) return NO_HIGHLIGHT;
  const side = indexes.data.byId.has(focusId) ? "data" : indexes.result.byId.has(focusId) ? "result" : void 0;
  if (side === void 0) return NO_HIGHLIGHT;
  const active = new Set(subtreeIds(indexes[side], focusId));
  const linkIds = /* @__PURE__ */ new Set();
  const relationIds = /* @__PURE__ */ new Set();
  const linked = /* @__PURE__ */ new Set();
  for (const link of records.links) {
    const near = side === "data" ? link.dataId : link.resultId;
    if (!active.has(near)) continue;
    linkIds.add(link.id);
    linked.add(side === "data" ? link.resultId : link.dataId);
  }
  if (side === "result") {
    for (const relation of relationsOf(records)) {
      const from = active.has(relation.fromId);
      const to = active.has(relation.toId);
      if (!from && !to) continue;
      relationIds.add(relation.id);
      if (from && !to) linked.add(relation.toId);
      else if (to && !from) linked.add(relation.fromId);
    }
  }
  return { active, linkIds, relationIds, linked };
}
function linesOf(links, dataAnchor, resultAnchor) {
  const lines = /* @__PURE__ */ new Map();
  for (const link of links) {
    const from = dataAnchor.get(link.dataId);
    const to = resultAnchor.get(link.resultId);
    if (from === void 0 || to === void 0) continue;
    const key = `${from}>${to}`;
    const folded = from !== link.dataId || to !== link.resultId;
    const line = lines.get(key);
    if (line) {
      line.links.push(link);
      line.folded = line.folded || folded;
    } else {
      lines.set(key, { key, from, to, links: [link], folded });
    }
  }
  return [...lines.values()];
}
function relationLinesOf(relations, anchor) {
  const lines = /* @__PURE__ */ new Map();
  for (const relation of relations) {
    const from = anchor.get(relation.fromId);
    const to = anchor.get(relation.toId);
    if (from === void 0 || to === void 0 || from === to) continue;
    const key = pairKey(from, to);
    const folded = from !== relation.fromId || to !== relation.toId;
    const line = lines.get(key);
    if (line) {
      line.relations.push(relation);
      line.folded = line.folded || folded;
      line.directed = line.directed && relation.directed === true && from === line.from;
    } else {
      lines.set(key, { key, from, to, relations: [relation], folded, directed: relation.directed === true });
    }
  }
  return [...lines.values()];
}
function curve(x1, y1, x2, y2) {
  const reach = Math.max(36, Math.abs(x2 - x1) * 0.5);
  return `M${x1},${y1} C${x1 + reach},${y1} ${x2 - reach},${y2} ${x2},${y2}`;
}
function curveMiddle(x1, y1, x2, y2) {
  return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
}
function arcReach(y1, y2) {
  return Math.max(24, Math.min(72, Math.abs(y2 - y1) * 0.35));
}
function arc(x, y1, y2) {
  const reach = arcReach(y1, y2);
  return `M${x},${y1} C${x + reach},${y1} ${x + reach},${y2} ${x},${y2}`;
}
function arcMiddle(x, y1, y2) {
  return { x: x + arcReach(y1, y2) * 0.75, y: (y1 + y2) / 2 };
}
function arrowPoints(x, y, size = 9) {
  return `${x},${y} ${x + size},${y - size * 0.5} ${x + size},${y + size * 0.5}`;
}
var DEFAULT_STAR_COLOR = "#f0777d";
function categoryColor(records, kind, id) {
  return id === void 0 ? void 0 : categoriesOf(records, kind).find((category) => category.id === id)?.color;
}
function starColor(records) {
  return records.palette?.defaults?.star ?? DEFAULT_STAR_COLOR;
}
function nodeColor(records, node) {
  return categoryColor(records, "node", node.category) ?? records.palette?.defaults?.node;
}
function edgeColor(records, edge, starred) {
  return categoryColor(records, "edge", edge.category) ?? (starred ? starColor(records) : records.palette?.defaults?.edge);
}

// src/client/PalettePanel.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var PRESET_COLORS = ["#4d6bfe", "#8b5cf6", "#22a06b", "#e09400", "#e5484d", "#f0777d", "#0ea5a4", "#ec4899", "#84cc16", "#64748b"];
function ColorPicker({ value, label, onPick }) {
  const [hex, setHex] = (0, import_react3.useState)(value ?? "");
  (0, import_react3.useEffect)(() => setHex(value ?? ""), [value]);
  const commit = () => {
    const color = cleanColor(hex);
    if (color !== void 0 && color !== value) onPick(color);
    else setHex(value ?? "");
  };
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "kb-colorpick", role: "group", "aria-label": label, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "kb-swatches", children: PRESET_COLORS.map((color) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "button",
      {
        type: "button",
        className: "kb-swatch" + (color === value ? " is-current" : ""),
        style: { ["--s"]: color },
        "aria-label": `${label} ${color}`,
        title: color,
        onClick: () => onPick(color)
      },
      color
    )) }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "input",
      {
        className: "kb-input kb-hex",
        value: hex,
        placeholder: "#RRGGBB",
        maxLength: 7,
        "aria-label": `${label}\uFF08#RRGGBB\uFF09`,
        onChange: (event) => setHex(event.target.value),
        onBlur: commit,
        onKeyDown: (event) => {
          if (event.key === "Enter" && !event.nativeEvent.isComposing) {
            event.preventDefault();
            commit();
          }
        }
      }
    )
  ] });
}
function Dot({ color }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "kb-dot", style: color ? { background: color } : void 0 });
}
function DefaultRow({ which, label, builtin, value }) {
  const ui = useRecords();
  const [open, setOpen] = (0, import_react3.useState)(false);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "kb-pal-default", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "kb-pal-line", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { type: "button", className: "kb-pal-dotbtn", "aria-expanded": open, "aria-label": `\u4FEE\u6539${label}`, onClick: () => setOpen(!open), children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Dot, { color: value }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: label })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "kb-hint", children: value ?? builtin }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", className: "kb-btn kb-btn-ghost kb-btn-sm", disabled: value === void 0, onClick: () => ui.setDefaultColor(which, null), children: "\u6062\u590D\u9ED8\u8BA4" })
    ] }),
    open ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ColorPicker, { value, label, onPick: (color) => ui.setDefaultColor(which, color) }) : null
  ] });
}
function CategoryRow({ kind, category }) {
  const ui = useRecords();
  const [name, setName] = (0, import_react3.useState)(category.name);
  const [open, setOpen] = (0, import_react3.useState)(false);
  (0, import_react3.useEffect)(() => setName(category.name), [category.name]);
  const commit = () => {
    const text = name.trim();
    if (text !== "" && text !== category.name) ui.updateCategory(kind, category.id, { name: text });
    else setName(category.name);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "kb-pal-cat", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "kb-pal-line", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", className: "kb-pal-dotbtn", "aria-expanded": open, "aria-label": `\u4FEE\u6539\u300C${category.name}\u300D\u7684\u989C\u8272`, onClick: () => setOpen(!open), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Dot, { color: category.color }) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "input",
        {
          className: "kb-input kb-pal-name",
          value: name,
          maxLength: RECORD_LIMITS.categoryName,
          "aria-label": `\u7C7B\u522B\u540D\u79F0\uFF1A${category.name}`,
          onChange: (event) => setName(event.target.value),
          onBlur: commit,
          onKeyDown: (event) => {
            if (event.key === "Enter" && !event.nativeEvent.isComposing) {
              event.preventDefault();
              commit();
            }
          }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", className: "kb-icon-btn is-danger", "aria-label": `\u5220\u9664\u7C7B\u522B\u300C${category.name}\u300D`, title: "\u5220\u9664\u7C7B\u522B\uFF08\u7528\u4E86\u5B83\u7684\u56DE\u5230\u9ED8\u8BA4\u8272\uFF09", onClick: () => ui.removeCategory(kind, category.id), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(CloseIcon, { size: 13 }) })
    ] }),
    open ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ColorPicker, { value: category.color, label: `\u300C${category.name}\u300D\u7684\u989C\u8272`, onPick: (color) => ui.updateCategory(kind, category.id, { color }) }) : null
  ] });
}
function CategorySection({ kind, title, hint }) {
  const ui = useRecords();
  const categories = categoriesOf(ui.records, kind);
  const [name, setName] = (0, import_react3.useState)("");
  const [color, setColor] = (0, import_react3.useState)(PRESET_COLORS[kind === "node" ? 0 : 2]);
  const trimmed = name.trim();
  const full = categories.length >= RECORD_LIMITS.categories;
  const add = () => {
    if (trimmed === "" || full) return;
    ui.addCategory(kind, trimmed, color);
    setName("");
  };
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { className: "kb-pal-section", "aria-label": title, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "kb-hint", children: hint }),
    categories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(CategoryRow, { kind, category }, category.id)),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "kb-pal-add", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "kb-pal-line", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "input",
          {
            className: "kb-input kb-pal-name",
            value: name,
            maxLength: RECORD_LIMITS.categoryName,
            placeholder: kind === "node" ? "\u65B0\u7C7B\u522B\u540D\u79F0\uFF0C\u4F8B\u5982\uFF1A\u539F\u59CB\u6570\u636E" : "\u65B0\u7C7B\u522B\u540D\u79F0\uFF0C\u4F8B\u5982\uFF1A\u63A8\u65AD",
            "aria-label": `${title}\uFF1A\u65B0\u7C7B\u522B\u540D\u79F0`,
            onChange: (event) => setName(event.target.value),
            onKeyDown: (event) => {
              if (event.key === "Enter" && !event.nativeEvent.isComposing) {
                event.preventDefault();
                add();
              }
            }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { type: "button", className: "kb-btn kb-btn-sm kb-btn-primary", disabled: trimmed === "" || full, onClick: add, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(PlusIcon, { size: 13 }),
          " \u6DFB\u52A0"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "kb-swatches", role: "radiogroup", "aria-label": `${title}\uFF1A\u65B0\u7C7B\u522B\u7684\u989C\u8272`, children: PRESET_COLORS.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "button",
        {
          type: "button",
          role: "radio",
          "aria-checked": preset === color,
          className: "kb-swatch" + (preset === color ? " is-current" : ""),
          style: { ["--s"]: preset },
          "aria-label": `\u65B0\u7C7B\u522B\u7684\u989C\u8272 ${preset}`,
          title: preset,
          onClick: () => setColor(preset)
        },
        preset
      )) })
    ] })
  ] });
}
function PaletteBody() {
  const ui = useRecords();
  const defaults = ui.records.palette?.defaults;
  return (
    // Not role="dialog": dsh-oh-my-claude treats any [role=dialog] next to a button[aria-haspopup=dialog]
    // as dsh's context-meter popover and fills it with the Claude usage.
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "kb-palette", role: "group", "aria-label": "\u989C\u8272\u4E0E\u7C7B\u522B", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { className: "kb-pal-section", "aria-label": "\u9ED8\u8BA4\u989C\u8272", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { children: "\u9ED8\u8BA4\u989C\u8272" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(DefaultRow, { which: "node", label: "\u8282\u70B9", builtin: "\u4E3B\u9898\u9ED8\u8BA4", value: defaults?.node }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(DefaultRow, { which: "edge", label: "\u8FDE\u7EBF", builtin: "\u8DDF\u968F\u9879\u76EE\u8272", value: defaults?.edge }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(DefaultRow, { which: "star", label: "\u661F\u6807", builtin: `\u6D45\u7EA2 ${DEFAULT_STAR_COLOR}`, value: defaults?.star }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "kb-hint", children: "\u8FDE\u5230\u661F\u6807\u8282\u70B9\u7684\u7EBF\u7528\u661F\u6807\u8272\uFF1B\u81EA\u5DF1\u6307\u5B9A\u4E86\u7C7B\u522B\u7684\u7EBF\uFF0C\u7528\u7C7B\u522B\u7684\u989C\u8272\u3002" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(CategorySection, { kind: "node", title: "\u8282\u70B9\u7C7B\u522B", hint: "\u7ED9\u6570\u636E\u6216\u7ED3\u679C\u6307\u5B9A\u7C7B\u522B\uFF0C\u5B83\u7684\u56FE\u6807\u548C\u5706\u70B9\u5C31\u7528\u8FD9\u4E2A\u989C\u8272\u3002" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(CategorySection, { kind: "edge", title: "\u8FDE\u7EBF\u7C7B\u522B", hint: "\u7ED9\u8FDE\u7EBF\uFF08\u6570\u636E\u5230\u7ED3\u679C\u3001\u7ED3\u679C\u4E4B\u95F4\uFF09\u6307\u5B9A\u7C7B\u522B\u3002" })
    ] })
  );
}
function PaletteButton({ open, onOpenChange, children }) {
  const ref = useDismiss(open, () => onOpenChange(false));
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "kb-pop-anchor", ref, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { type: "button", className: "kb-btn kb-btn-sm" + (open ? " is-on" : ""), "aria-expanded": open, title: "\u989C\u8272\u4E0E\u7C7B\u522B\uFF1A\u8BBE\u7F6E\u8282\u70B9\u548C\u8FDE\u7EBF\u7684\u989C\u8272", onClick: () => onOpenChange(!open), children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(PaletteIcon, { size: 14 }),
      " \u989C\u8272"
    ] }),
    open ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(PaletteBody, {}) : null,
    children
  ] });
}

// src/client/RecordTree.tsx
var import_react4 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
var COPY = {
  data: {
    title: "\u6570\u636E",
    add: "\u6DFB\u52A0\u6570\u636E",
    pathLabel: "\u5B8C\u6574\u8DEF\u5F84",
    pathHint: "\u5B8C\u6574\u8DEF\u5F84\uFF0C\u4F8B\u5982\uFF1A/data/gwas/face_sumstats.tsv.gz",
    nameHint: "\u7B80\u5355\u540D\u5B57\uFF0C\u4F8B\u5982\uFF1AGWAS \u6C47\u603B\u7EDF\u8BA1",
    empty: "\u8FD8\u6CA1\u6709\u6570\u636E\u3002\u8BB0\u4E0B\u5173\u952E\u6570\u636E\u7684\u7B80\u5355\u540D\u5B57\u3001\u5B8C\u6574\u8DEF\u5F84\u548C\u63CF\u8FF0\uFF1B\u53EA\u5199\u540D\u5B57\u7684\u8282\u70B9\u53EF\u4EE5\u5F53\u4F5C\u7AE0\u8282\u6765\u653E\u522B\u7684\u6570\u636E\u3002",
    linksTitle: "\u5173\u8054\u7684\u7ED3\u679C",
    linksAdd: "\uFF0B \u5173\u8054\u7ED3\u679C\u2026",
    linksNone: "\u8FD8\u6CA1\u6709\u5173\u8054\u5230\u4EFB\u4F55\u7ED3\u679C",
    portTitle: "\u62D6\u5230\u53F3\u8FB9\u7684\u7ED3\u679C\u4E0A\uFF0C\u6807\u51FA\u5B83\u6765\u81EA\u8FD9\u4EFD\u6570\u636E"
  },
  result: {
    title: "\u7ED3\u679C",
    add: "\u6DFB\u52A0\u7ED3\u679C",
    pathLabel: "\u6587\u4EF6 / \u4F4D\u7F6E",
    pathHint: "\u6587\u4EF6\u6216\u4F4D\u7F6E\uFF0C\u4F8B\u5982\uFF1Afigures/fig3_manhattan.png",
    nameHint: "\u7B80\u5355\u540D\u5B57\uFF0C\u4F8B\u5982\uFF1A\u56FE 3 \u66FC\u54C8\u987F\u56FE",
    empty: "\u8FD8\u6CA1\u6709\u7ED3\u679C\u3002\u8BB0\u4E0B\u5F97\u5230\u7684\u7ED3\u679C\uFF0C\u518D\u4ECE\u6570\u636E\u4E00\u4FA7\u62D6\u7EBF\u8FC7\u6765\uFF0C\u8BF4\u660E\u5B83\u6765\u81EA\u54EA\u4E9B\u6570\u636E\u3002",
    linksTitle: "\u6765\u6E90\u6570\u636E",
    linksAdd: "\uFF0B \u6DFB\u52A0\u6765\u6E90\u6570\u636E\u2026",
    linksNone: "\u8FD8\u6CA1\u6709\u5173\u8054\u6765\u6E90\u6570\u636E",
    portTitle: "\u62D6\u5230\u5DE6\u8FB9\u7684\u6570\u636E\u4E0A\uFF0C\u6807\u51FA\u8FD9\u4E2A\u7ED3\u679C\u6765\u81EA\u54EA\u4EFD\u6570\u636E"
  }
};
var OTHER = { data: "result", result: "data" };
function NodeForm({ side, initial, submitLabel, keepOpen, depth, note, onSubmit, onCancel }) {
  const copy = COPY[side];
  const [name, setName] = (0, import_react4.useState)(initial?.name ?? "");
  const [path, setPath] = (0, import_react4.useState)(initial?.path ?? "");
  const [description, setDescription] = (0, import_react4.useState)(initial?.description ?? "");
  const nameRef = (0, import_react4.useRef)(null);
  (0, import_react4.useEffect)(() => {
    nameRef.current?.focus();
    nameRef.current?.select();
  }, []);
  const trimmed = name.trim();
  const invalid = trimmed === "" || trimmed.length > RECORD_LIMITS.name || path.length > RECORD_LIMITS.path || description.length > RECORD_LIMITS.description;
  const submit = () => {
    if (invalid) return;
    if (!onSubmit({ name: trimmed, path: path.trim(), description })) return;
    if (keepOpen) {
      setName("");
      setPath("");
      setDescription("");
      nameRef.current?.focus();
    }
  };
  const onKey = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onCancel();
    } else if (event.key === "Enter" && (event.target instanceof HTMLInputElement || event.metaKey || event.ctrlKey)) {
      if (event.nativeEvent.isComposing) return;
      event.preventDefault();
      submit();
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "kb-rec-form", style: { ["--depth"]: depth }, role: "group", "aria-label": initial ? "\u7F16\u8F91\u8282\u70B9" : copy.add, onKeyDown: onKey, children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { ref: nameRef, className: "kb-input", placeholder: copy.nameHint, value: name, maxLength: RECORD_LIMITS.name, "aria-label": "\u7B80\u5355\u540D\u5B57", onChange: (e) => setName(e.target.value) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { className: "kb-input kb-mono", placeholder: copy.pathHint, value: path, maxLength: RECORD_LIMITS.path, "aria-label": copy.pathLabel, onChange: (e) => setPath(e.target.value) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("textarea", { className: "kb-textarea", rows: 2, placeholder: "\u63CF\u8FF0\uFF08\u53EF\u9009\uFF09", value: description, maxLength: RECORD_LIMITS.description, "aria-label": "\u63CF\u8FF0", onChange: (e) => setDescription(e.target.value) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "kb-edit-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "kb-hint", children: initial ? "\u2318/Ctrl + Enter \u4FDD\u5B58" : note ?? "\u53EA\u586B\u540D\u5B57\u4E5F\u884C\uFF1BEnter \u4FDD\u5B58\u5E76\u7EE7\u7EED\u6DFB\u52A0" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", className: "kb-btn kb-btn-ghost kb-btn-sm", onClick: onCancel, children: "\u53D6\u6D88" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", className: "kb-btn kb-btn-primary kb-btn-sm", disabled: invalid, onClick: submit, children: submitLabel })
      ] })
    ] })
  ] });
}
function CategoryPills({ node }) {
  const ui = useRecords();
  const categories = categoriesOf(ui.records, "node");
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "kb-rec-cats", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "kb-rec-links-head", children: "\u7C7B\u522B" }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "kb-pills", role: "radiogroup", "aria-label": "\u8282\u70B9\u7C7B\u522B", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", role: "radio", "aria-checked": node.category === void 0, className: "kb-pill" + (node.category === void 0 ? " is-on" : ""), onClick: () => ui.setCategory([node.id], null), children: "\u9ED8\u8BA4" }),
      categories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
        "button",
        {
          type: "button",
          role: "radio",
          "aria-checked": node.category === category.id,
          className: "kb-pill" + (node.category === category.id ? " is-on" : ""),
          style: { ["--pill"]: category.color },
          onClick: () => ui.setCategory([node.id], category.id),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", {}),
            category.name
          ]
        },
        category.id
      )),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { type: "button", className: "kb-pill is-add", title: "\u6DFB\u52A0\u6216\u4FEE\u6539\u7C7B\u522B\u7684\u989C\u8272", onClick: ui.openPalette, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PlusIcon, { size: 11 }),
        " ",
        categories.length === 0 ? "\u6DFB\u52A0\u7C7B\u522B" : "\u7C7B\u522B"
      ] })
    ] })
  ] });
}
function relationGlyph(relation, from) {
  if (relation.directed !== true) return { text: "\u2014", title: "\u65E0\u5411\uFF1A\u70B9\u51FB\u6539\u4E3A\u6307\u5411\u5BF9\u65B9" };
  return relation.fromId === from ? { text: "\u2192", title: "\u6307\u5411\u5BF9\u65B9\uFF1A\u70B9\u51FB\u6539\u4E3A\u6307\u5411\u8FD9\u91CC" } : { text: "\u2190", title: "\u6307\u5411\u8FD9\u91CC\uFF1A\u70B9\u51FB\u6539\u4E3A\u65E0\u5411" };
}
function RelationsSection({ node }) {
  const ui = useRecords();
  const own = relationsOf(ui.records).filter((relation) => relation.fromId === node.id || relation.toId === node.id);
  const related = new Set(own.map((relation) => relation.fromId === node.id ? relation.toId : relation.fromId));
  const choices = ui.records.results.filter((item) => item.id !== node.id && !related.has(item.id));
  const index = ui.indexes.result;
  const cycle = (relation) => {
    if (relation.directed !== true) ui.updateRelation(relation.id, relation.fromId === node.id ? { directed: true } : { directed: true, reverse: true });
    else if (relation.fromId === node.id) ui.updateRelation(relation.id, { reverse: true });
    else ui.updateRelation(relation.id, { directed: false });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "kb-rec-links", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "kb-rec-links-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(SwapIcon, { size: 13 }),
      " \u76F8\u5173\u7684\u7ED3\u679C",
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "kb-count", children: own.length })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "kb-rec-chips", children: [
      own.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "kb-muted", children: "\u8FD8\u6CA1\u6709\u548C\u522B\u7684\u7ED3\u679C\u8FDE\u7EBF\uFF08\u4ECE\u7ED3\u679C\u53F3\u8FB9\u7F18\u7684\u5706\u70B9\u62D6\u5230\u53E6\u4E00\u4E2A\u7ED3\u679C\u4E0A\uFF09" }) : null,
      own.map((relation) => {
        const otherId = relation.fromId === node.id ? relation.toId : relation.fromId;
        const other = index.byId.get(otherId);
        const glyph = relationGlyph(relation, node.id);
        return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "kb-link-chip", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", className: "kb-link-chip-glyph", title: glyph.title, "aria-label": `${other?.name ?? otherId}\uFF1A${glyph.title}`, onClick: () => cycle(relation), children: glyph.text }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", className: "kb-link-chip-name", title: "\u5728\u5217\u8868\u91CC\u5B9A\u4F4D", onClick: () => ui.reveal(otherId), children: other?.name ?? otherId }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", className: "kb-link-chip-x", "aria-label": `\u53D6\u6D88\u4E0E\u300C${other?.name ?? otherId}\u300D\u7684\u8FDE\u7EBF`, title: "\u53D6\u6D88\u8FDE\u7EBF", onClick: () => ui.removeRelation(relation), children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(CloseIcon, { size: 11 }) })
        ] }, relation.id);
      }),
      choices.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
        "select",
        {
          className: "kb-select",
          "aria-label": "\u8FDE\u5230\u5176\u4ED6\u7ED3\u679C",
          value: "",
          onChange: (event) => {
            if (event.target.value !== "") ui.addRelation(node.id, event.target.value);
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "", children: "\uFF0B \u8FDE\u5230\u5176\u4ED6\u7ED3\u679C\u2026" }),
            choices.map((item) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: item.id, children: "\u3000".repeat(levelOf(index, item.id)) + item.name }, item.id))
          ]
        }
      ) : null
    ] })
  ] });
}
function NodeCard({ node, side, depth }) {
  const ui = useRecords();
  const { toast } = useActions();
  const copy = COPY[side];
  const other = OTHER[side];
  const editing = ui.editingId === node.id;
  if (editing) {
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      NodeForm,
      {
        side,
        depth,
        initial: { name: node.name, path: node.path, description: node.description },
        submitLabel: "\u4FDD\u5B58",
        onCancel: () => ui.setEditing(null),
        onSubmit: (fields) => {
          const ok = ui.updateNode(node.id, fields);
          if (ok) ui.setEditing(null);
          return ok;
        }
      }
    );
  }
  const own = ui.records.links.filter((link) => (side === "data" ? link.dataId : link.resultId) === node.id);
  const linkedIds = new Set(own.map((link) => side === "data" ? link.resultId : link.dataId));
  const otherIndex = ui.indexes[other];
  const choices = listOf(ui.records, other).filter((item) => !linkedIds.has(item.id));
  const copyPath = async () => {
    try {
      await navigator.clipboard.writeText(node.path);
      toast("\u5DF2\u590D\u5236\u8DEF\u5F84");
    } catch {
      toast("\u590D\u5236\u5931\u8D25\uFF0C\u8BF7\u624B\u52A8\u9009\u4E2D\u8DEF\u5F84", { tone: "error" });
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "kb-rec-card", style: { ["--depth"]: depth }, role: "region", "aria-label": `${node.name} \u7684\u8BE6\u60C5`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("dl", { className: "kb-rec-fields", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("dt", { children: copy.pathLabel }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("dd", { children: node.path ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "kb-mono kb-rec-path", children: node.path }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", className: "kb-icon-btn", "aria-label": "\u590D\u5236\u8DEF\u5F84", title: "\u590D\u5236\u8DEF\u5F84", onClick: () => void copyPath(), children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(CopyIcon, { size: 14 }) })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "kb-muted", children: "\u672A\u586B\u5199" }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("dt", { children: "\u63CF\u8FF0" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("dd", { children: node.description ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "kb-rec-desc", children: node.description }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "kb-muted", children: "\u672A\u586B\u5199" }) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(CategoryPills, { node }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "kb-rec-links", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "kb-rec-links-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(LinkIcon, { size: 13 }),
        " ",
        copy.linksTitle,
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "kb-count", children: own.length })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "kb-rec-chips", children: [
        own.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "kb-muted", children: copy.linksNone }) : null,
        own.map((link) => {
          const otherId = side === "data" ? link.resultId : link.dataId;
          const target = otherIndex.byId.get(otherId);
          return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "kb-link-chip", children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", className: "kb-link-chip-name", title: "\u5728\u53E6\u4E00\u4FA7\u5B9A\u4F4D", onClick: () => ui.reveal(otherId), children: target?.name ?? otherId }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", className: "kb-link-chip-x", "aria-label": `\u53D6\u6D88\u4E0E\u300C${target?.name ?? otherId}\u300D\u7684\u5173\u8054`, title: "\u53D6\u6D88\u5173\u8054", onClick: () => ui.removeLink(link.id), children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(CloseIcon, { size: 11 }) })
          ] }, link.id);
        }),
        choices.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
          "select",
          {
            className: "kb-select",
            "aria-label": copy.linksAdd.replace("\uFF0B ", "").replace("\u2026", ""),
            value: "",
            onChange: (event) => {
              const value = event.target.value;
              if (value !== "") ui.addLink(side === "data" ? node.id : value, side === "data" ? value : node.id);
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "", children: copy.linksAdd }),
              choices.map((item) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: item.id, children: "\u3000".repeat(levelOf(otherIndex, item.id)) + item.name }, item.id))
            ]
          }
        ) : null
      ] })
    ] }),
    side === "result" ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(RelationsSection, { node }) : null,
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "kb-rec-foot", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "kb-hint", children: [
        "\u66F4\u65B0\u4E8E ",
        shortDate(node.updatedAt)
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { type: "button", className: "kb-btn kb-btn-ghost kb-btn-sm", onClick: () => ui.setEditing(node.id), children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PencilIcon, { size: 13 }),
          " \u7F16\u8F91"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", className: "kb-btn kb-btn-ghost kb-btn-sm", onClick: () => ui.toggleOpen(node.id), children: "\u6536\u8D77" })
      ] })
    ] })
  ] });
}
function RenameInput({ node }) {
  const ui = useRecords();
  const [value, setValue] = (0, import_react4.useState)(node.name);
  const finished = (0, import_react4.useRef)(false);
  const finish = (save) => {
    if (finished.current) return;
    finished.current = true;
    const text = value.trim();
    ui.setRenaming(null);
    if (save && text !== "" && text !== node.name) ui.updateNode(node.id, { name: text });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "input",
    {
      className: "kb-input kb-node-rename",
      value,
      autoFocus: true,
      maxLength: RECORD_LIMITS.name,
      "aria-label": "\u8282\u70B9\u540D\u79F0",
      onFocus: (e) => e.target.select(),
      onChange: (e) => setValue(e.target.value),
      onBlur: () => finish(true),
      onKeyDown: (e) => {
        if (e.key === "Enter" && !e.nativeEvent.isComposing) finish(true);
        if (e.key === "Escape") {
          e.stopPropagation();
          finish(false);
        }
      }
    }
  );
}
function NodeItem({ row, side }) {
  const ui = useRecords();
  const [dragging, setDragging] = (0, import_react4.useState)(false);
  const { node, depth, childCount, expanded, context } = row;
  const index = ui.indexes[side];
  const open = ui.openIds.has(node.id);
  const selected = ui.selection?.side === side && ui.selection.ids.has(node.id);
  const starred = node.starred === true;
  const hint = ui.dropHint?.side === side && ui.dropHint.targetId === node.id ? ui.dropHint.zone : null;
  const connecting = ui.connecting;
  const linkCount = ui.linkCounts.get(node.id) ?? 0;
  const relationCount = ui.relationCounts.get(node.id) ?? 0;
  const siblings = childrenOf(index, node.parentId);
  const position = siblings.findIndex((item) => item.id === node.id);
  const Glyph = childCount > 0 ? FolderIcon : side === "data" ? FileIcon : ChartIcon;
  const color = ui.colorOf(node);
  const everyStarred = childCount > 0 && subtreeIds(index, node.id).every((id) => index.byId.get(id)?.starred === true);
  const canRelate = connecting?.mode === "relation" ? side === "result" && connecting.id !== node.id && connecting.blocked?.has(node.id) !== true : connecting !== null && connecting.side !== side;
  const className = "kb-node-row" + (open ? " is-open" : "") + (ui.focusId === node.id ? " is-focus" : ui.withinIds.has(node.id) ? " is-within" : "") + (ui.linkedRows.has(node.id) ? " is-linked" : "") + (selected ? " is-selected" : "") + (starred ? " is-starred" : "") + (context ? " is-context" : "") + (ui.landedId === node.id ? " is-landed" : "") + (dragging ? " is-dragging" : "") + (hint === "before" ? " is-drop-before" : "") + (hint === "after" ? expanded ? " is-drop-child" : " is-drop-after" : "") + (hint === "inside" ? " is-drop-inside" : "") + (canRelate ? " can-link" : "") + (connecting?.overId === node.id ? " is-link-target" : "");
  const onDragStart = (event) => {
    const ids = ui.selection?.side === side && ui.selection.ids.has(node.id) ? [...ui.selection.ids] : [node.id];
    ui.drag.current = { side, ids };
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", node.name);
    setDragging(true);
  };
  const onDragEnd = () => {
    ui.drag.current = null;
    ui.setDropHint(null);
    setDragging(false);
  };
  const zoneOf = (event) => {
    const box = event.currentTarget.getBoundingClientRect();
    return zoneAt(event.clientY, box.top, box.height);
  };
  const verdict = () => {
    const dragged = ui.drag.current;
    if (!dragged || dragged.side !== side) return "ignore";
    return dragged.ids.some((id) => isInSubtree(index, id, node.id)) ? "refuse" : "accept";
  };
  const onDragOver = (event) => {
    const what = verdict();
    if (what === "ignore") return;
    event.stopPropagation();
    if (what === "refuse") {
      if (ui.dropHint !== null) ui.setDropHint(null);
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    const zone = zoneOf(event);
    if (hint !== zone) ui.setDropHint({ side, targetId: node.id, zone });
  };
  const onDrop = (event) => {
    const what = verdict();
    if (what === "ignore") return;
    event.stopPropagation();
    if (what === "refuse") {
      ui.setDropHint(null);
      return;
    }
    event.preventDefault();
    const zone = zoneOf(event);
    ui.setDropHint(null);
    ui.dropOn(side, node.id, zone);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "kb-node", style: { ["--depth"]: depth }, role: "treeitem", "aria-level": depth + 1, "aria-expanded": childCount > 0 ? expanded : void 0, "aria-selected": selected, children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
      "div",
      {
        className: "kb-node-line" + (context ? " is-context" : ""),
        "data-rec-node": node.id,
        "data-rec-side": side,
        style: color ? { ["--kb-node-color"]: color } : void 0,
        onMouseEnter: () => ui.hover(node.id),
        onMouseLeave: () => ui.hover(null),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className, draggable: ui.renamingId !== node.id && connecting === null, onDragStart, onDragEnd, onDragOver, onDrop, children: [
            childCount > 0 && !ui.starOnly ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", className: "kb-node-chevron", "aria-label": expanded ? `\u6536\u8D77\u300C${node.name}\u300D` : `\u5C55\u5F00\u300C${node.name}\u300D`, onClick: () => ui.toggleFold(node), children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(ChevronIcon, { size: 14, className: expanded ? "is-down" : void 0 }) }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "kb-node-chevron is-blank", "aria-hidden": "true" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { type: "button", className: "kb-node-icon", role: "checkbox", "aria-checked": selected, "aria-label": `\u9009\u62E9\u300C${node.name}\u300D`, title: "\u9009\u62E9\uFF08\u53EF\u4EE5\u4E00\u8D77\u62D6\u52A8\u3001\u5408\u5E76\u4E3A\u5206\u7EC4\u6216\u52A0\u661F\u6807\uFF09", onClick: () => ui.toggleSelect(side, node.id), children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "kb-node-glyph" + (childCount > 0 ? " is-group" : ""), children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Glyph, { size: 15 }) }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "kb-node-box", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(CheckIcon, { size: 11 }) })
            ] }),
            ui.renamingId === node.id ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(RenameInput, { node }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
              "button",
              {
                type: "button",
                className: "kb-node-name",
                "aria-expanded": open,
                title: open ? "\u6536\u8D77\u8BE6\u60C5" : "\u67E5\u770B\u8BE6\u60C5\uFF08\u53CC\u51FB\u91CD\u547D\u540D\uFF09",
                onClick: (event) => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey) ui.toggleSelect(side, node.id);
                  else {
                    ui.pick(node.id);
                    ui.toggleOpen(node.id);
                  }
                },
                onDoubleClick: () => ui.setRenaming(node.id),
                children: node.name
              }
            ),
            !context ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
              "button",
              {
                type: "button",
                className: "kb-node-star" + (starred ? " is-on" : ""),
                "aria-pressed": starred,
                "aria-label": starred ? `\u53D6\u6D88\u661F\u6807\u300C${node.name}\u300D` : `\u7ED9\u300C${node.name}\u300D\u52A0\u661F\u6807`,
                title: starred ? "\u53D6\u6D88\u661F\u6807" : "\u52A0\u661F\u6807\uFF1A\u7A81\u51FA\u91CD\u8981\u6027\uFF0C\u8FDE\u7EBF\u53D8\u6210\u661F\u6807\u8272",
                onClick: () => ui.toggleStar(node),
                children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StarIcon, { size: 14, filled: starred })
              }
            ) : null,
            childCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "kb-node-count", title: `${childCount} \u4E2A\u5B50\u8282\u70B9`, children: childCount }) : null,
            linkCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "kb-node-links", title: side === "data" ? `\u5173\u8054\u4E86 ${linkCount} \u4E2A\u7ED3\u679C` : `\u6765\u81EA ${linkCount} \u9879\u6570\u636E`, children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(LinkIcon, { size: 11 }),
              linkCount
            ] }) : null,
            relationCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "kb-node-links is-relation", title: `\u548C ${relationCount} \u4E2A\u7ED3\u679C\u6709\u8FDE\u7EBF`, children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(SwapIcon, { size: 11 }),
              relationCount
            ] }) : null,
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "kb-node-actions", children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", className: "kb-icon-btn", "aria-label": "\u6DFB\u52A0\u5B50\u8282\u70B9", title: "\u6DFB\u52A0\u5B50\u8282\u70B9", onClick: () => ui.startAdd(side, node.id), children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PlusIcon, { size: 14 }) }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                "button",
                {
                  type: "button",
                  className: "kb-icon-btn",
                  "aria-label": "\u7F16\u8F91\u8282\u70B9",
                  title: "\u7F16\u8F91",
                  onClick: () => {
                    if (!open) ui.toggleOpen(node.id);
                    ui.setEditing(node.id);
                  },
                  children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PencilIcon, { size: 14 })
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Menu, { label: "\u66F4\u591A\u64CD\u4F5C", children: (close) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { type: "button", role: "menuitem", className: "kb-menu-item", onClick: () => {
                  close();
                  ui.toggleStar(node);
                }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StarIcon, { size: 14, filled: starred }),
                  " ",
                  starred ? "\u53D6\u6D88\u661F\u6807" : "\u52A0\u661F\u6807"
                ] }),
                childCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { type: "button", role: "menuitem", className: "kb-menu-item", onClick: () => {
                  close();
                  ui.toggleStarTree(node);
                }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StarIcon, { size: 14, filled: everyStarred }),
                  " ",
                  everyStarred ? "\u6574\u7EC4\u53D6\u6D88\u661F\u6807" : "\u6574\u7EC4\u52A0\u661F\u6807"
                ] }) : null,
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "kb-menu-sep" }),
                /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { type: "button", role: "menuitem", className: "kb-menu-item", disabled: position <= 0, onClick: () => {
                  close();
                  ui.shift(node, "up");
                }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(ArrowUpIcon, { size: 14 }),
                  " \u4E0A\u79FB"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { type: "button", role: "menuitem", className: "kb-menu-item", disabled: position < 0 || position >= siblings.length - 1, onClick: () => {
                  close();
                  ui.shift(node, "down");
                }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(ArrowDownIcon, { size: 14 }),
                  " \u4E0B\u79FB"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { type: "button", role: "menuitem", className: "kb-menu-item", disabled: position <= 0, onClick: () => {
                  close();
                  ui.shift(node, "in");
                }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(IndentIcon, { size: 14 }),
                  " \u79FB\u5165\u4E0A\u4E00\u9879"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { type: "button", role: "menuitem", className: "kb-menu-item", disabled: node.parentId === null, onClick: () => {
                  close();
                  ui.shift(node, "out");
                }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(OutdentIcon, { size: 14 }),
                  " \u79FB\u51FA\u4E0A\u4E00\u7EA7"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "kb-menu-sep" }),
                childCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { type: "button", role: "menuitem", className: "kb-menu-item", onClick: () => {
                  close();
                  ui.dissolveNode(node);
                }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(OutdentIcon, { size: 14 }),
                  " \u89E3\u6563\uFF08\u5B50\u8282\u70B9\u4E0A\u79FB\uFF09"
                ] }) : null,
                /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { type: "button", role: "menuitem", className: "kb-menu-item is-danger", onClick: () => {
                  close();
                  ui.removeNode(node);
                }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(TrashIcon, { size: 14 }),
                  " ",
                  childCount > 0 ? "\u5220\u9664\uFF08\u542B\u5B50\u8282\u70B9\uFF09" : "\u5220\u9664"
                ] })
              ] }) })
            ] })
          ] }),
          !context ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            "span",
            {
              className: "kb-port kb-port-main" + (linkCount > 0 ? " has-links" : ""),
              "data-port": node.id,
              "aria-hidden": "true",
              title: COPY[side].portTitle,
              ref: (element) => ui.registerPort(node.id, element),
              onPointerDown: (event) => ui.beginConnect(side, node.id, event, "link")
            }
          ) : null,
          side === "result" && !context ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            "span",
            {
              className: "kb-port kb-port-right" + (relationCount > 0 ? " has-links" : "") + (connecting?.mode === "relation" && connecting.id === node.id ? " is-source" : "") + (connecting?.mode === "relation" && canRelate ? " is-ready" : "") + (connecting?.mode === "relation" && connecting.overId === node.id ? " is-target" : ""),
              "data-port": `${node.id}:r`,
              "aria-hidden": "true",
              title: "\u5173\u7CFB\u70B9\uFF1A\u62D6\u5230\u53E6\u4E00\u4E2A\u7ED3\u679C\u4E0A\uFF0C\u6807\u51FA\u4E24\u4E2A\u7ED3\u679C\u7684\u5173\u7CFB\uFF08\u9ED8\u8BA4\u65E0\u5411\uFF1B\u677E\u5F00\u65F6\u6309\u4F4F Option/Alt = \u6709\u5411\uFF09\u3002\u6570\u636E\u8FDE\u7EBF\u7528\u5DE6\u8FB9\u7684\u5706\u70B9",
              ref: (element) => ui.registerPort(`${node.id}:r`, element),
              onPointerDown: (event) => ui.beginConnect(side, node.id, event, "relation")
            }
          ) : null
        ]
      }
    ),
    open ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(NodeCard, { node, side, depth }) : null
  ] });
}
var TreePanel = (0, import_react4.memo)(function TreePanel2({ side, flat }) {
  const ui = useRecords();
  const copy = COPY[side];
  const total = listOf(ui.records, side).length;
  const dragged = () => ui.drag.current?.side === side;
  const endHint = ui.dropHint?.side === side && ui.dropHint.zone === "end";
  const nothingShown = flat.rows.length === 0 && ui.adding?.side !== side;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "kb-tree", "data-side": side, "aria-label": copy.title, children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("header", { className: "kb-tree-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { children: copy.title }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "kb-count", children: total }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { type: "button", className: "kb-btn kb-btn-ghost kb-btn-sm", "aria-label": copy.add, title: copy.add, onClick: () => ui.startAdd(side, null), children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PlusIcon, { size: 14 }),
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "kb-add-text", children: copy.add })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
      "div",
      {
        className: "kb-tree-body" + (endHint ? " is-drop-end" : ""),
        role: "tree",
        "aria-label": copy.title,
        onDragOver: (event) => {
          if (!dragged()) return;
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
          if (!endHint) ui.setDropHint({ side, targetId: null, zone: "end" });
        },
        onDragLeave: (event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) ui.setDropHint(null);
        },
        onDrop: (event) => {
          if (!dragged()) return;
          event.preventDefault();
          ui.setDropHint(null);
          ui.dropOn(side, null, "end");
        },
        children: [
          flat.rows.map(
            (row) => row.kind === "node" ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(NodeItem, { row, side }, row.node.id) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
              NodeForm,
              {
                side,
                depth: row.depth,
                submitLabel: "\u6DFB\u52A0",
                keepOpen: true,
                note: ui.starOnly ? "\u300C\u53EA\u770B\u661F\u6807\u300D\u4E0B\uFF0C\u65B0\u8282\u70B9\u4F1A\u81EA\u52A8\u52A0\u4E0A\u661F\u6807\uFF0C\u8FD9\u6837\u5B83\u4E0D\u4F1A\u7ACB\u523B\u4ECE\u8FD9\u91CC\u6D88\u5931" : void 0,
                onCancel: ui.stopAdd,
                onSubmit: (fields) => ui.addNode(side, row.parentId, fields)
              },
              "add-form"
            )
          ),
          nothingShown && total === 0 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "kb-placeholder", children: copy.empty }) : null,
          nothingShown && total > 0 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "kb-placeholder", children: ui.starOnly ? "\u8FD9\u4E00\u4FA7\u8FD8\u6CA1\u6709\u52A0\u661F\u6807\u7684\u8282\u70B9\u3002\u70B9\u8282\u70B9\u540D\u5B57\u53F3\u8FB9\u7684 \u2606 \u52A0\u661F\u6807\u3002" : copy.empty }) : null
        ]
      }
    )
  ] });
});

// src/client/recordsHistory.ts
var RecordHistory = class {
  constructor(limit = 100) {
    this.limit = limit;
    __publicField(this, "undoStack", []);
    __publicField(this, "redoStack", []);
    __publicField(this, "listeners", /* @__PURE__ */ new Set());
    __publicField(this, "seq", 0);
    /** Changes whenever a stack does, for `useSyncExternalStore`. */
    __publicField(this, "version", 0);
    __publicField(this, "subscribe", (listener) => {
      this.listeners.add(listener);
      return () => {
        this.listeners.delete(listener);
      };
    });
    __publicField(this, "getVersion", () => this.version);
  }
  /** Remember a step. Doing something new makes the undone steps unreachable. */
  record(label, forward, inverse) {
    this.seq += 1;
    const step = { id: this.seq, label, forward, inverse };
    this.undoStack.push(step);
    if (this.undoStack.length > this.limit) this.undoStack.shift();
    this.redoStack = [];
    this.emit();
    return step;
  }
  get canUndo() {
    return this.undoStack.length > 0;
  }
  get canRedo() {
    return this.redoStack.length > 0;
  }
  /** What the next undo would take back. */
  get undoLabel() {
    return this.undoStack.at(-1)?.label;
  }
  /** What the next redo would do again. */
  get redoLabel() {
    return this.redoStack.at(-1)?.label;
  }
  /** Whether `step` is the one an undo would take back now. */
  isLatest(step) {
    return this.undoStack.at(-1) === step;
  }
  /** Take the latest step off the undo stack and onto the redo stack. */
  takeUndo() {
    const step = this.undoStack.pop();
    if (!step) return void 0;
    this.redoStack.push(step);
    this.emit();
    return step;
  }
  /** Take the latest undone step off the redo stack and back onto the undo stack. */
  takeRedo() {
    const step = this.redoStack.pop();
    if (!step) return void 0;
    this.undoStack.push(step);
    this.emit();
    return step;
  }
  clear() {
    this.undoStack = [];
    this.redoStack = [];
    this.emit();
  }
  emit() {
    this.version += 1;
    for (const listener of this.listeners) listener();
  }
};
var histories = /* @__PURE__ */ new Map();
function historyOf(projectId) {
  let history = histories.get(projectId);
  if (!history) {
    history = new RecordHistory();
    histories.set(projectId, history);
  }
  return history;
}

// src/client/RecordsView.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
var EMPTY_GEOMETRY = { width: 0, height: 0, ports: {} };
function sameGeometry(a, b) {
  if (Math.abs(a.width - b.width) > 0.5 || Math.abs(a.height - b.height) > 0.5) return false;
  const keys = Object.keys(b.ports);
  if (keys.length !== Object.keys(a.ports).length) return false;
  return keys.every((key) => {
    const before = a.ports[key];
    const after = b.ports[key];
    return before !== void 0 && Math.abs(before.x - after.x) < 0.5 && Math.abs(before.y - after.y) < 0.5;
  });
}
var round = (n) => Math.round(n * 10) / 10;
function nodeUnder(target) {
  const element = target?.closest?.("[data-rec-node]");
  const id = element?.dataset.recNode;
  const side = element?.dataset.recSide;
  return id !== void 0 && (side === "data" || side === "result") ? { side, id } : null;
}
function typingIn(target) {
  return target?.closest?.('input, textarea, select, [contenteditable=""], [contenteditable="true"]') != null;
}
var starOnlyMemory = /* @__PURE__ */ new Map();
var shortName = (name) => name.length > 18 ? `${name.slice(0, 18)}\u2026` : name;
function RecordsPage({ project, status, onBack }) {
  const actions = useActions();
  const { dispatch, toast, confirm, land, landedId } = actions;
  const records = recordsOf(project);
  const projectId = project.id;
  const history = historyOf(projectId);
  (0, import_react5.useSyncExternalStore)(history.subscribe, history.getVersion);
  const recordsRef = (0, import_react5.useRef)(records);
  recordsRef.current = records;
  const indexes = (0, import_react5.useMemo)(() => ({ data: indexNodes(records.data), result: indexNodes(records.results) }), [records.data, records.results]);
  const [openIds, setOpenIds] = (0, import_react5.useState)(() => /* @__PURE__ */ new Set());
  const [editingId, setEditingId] = (0, import_react5.useState)(null);
  const [pickedId, setPickedId] = (0, import_react5.useState)(null);
  const [hoverId, setHoverId] = (0, import_react5.useState)(null);
  const [selection, setSelection] = (0, import_react5.useState)(null);
  const [renamingId, setRenamingId] = (0, import_react5.useState)(null);
  const [adding, setAdding] = (0, import_react5.useState)(null);
  const [dropHint, setDropHint] = (0, import_react5.useState)(null);
  const [connecting, setConnecting] = (0, import_react5.useState)(null);
  const [pointer, setPointer] = (0, import_react5.useState)(null);
  const [hoverLine, setHoverLine] = (0, import_react5.useState)(null);
  const [pickedLine, setPickedLine] = (0, import_react5.useState)(null);
  const [geometry, setGeometry] = (0, import_react5.useState)(EMPTY_GEOMETRY);
  const geometryRef = (0, import_react5.useRef)(EMPTY_GEOMETRY);
  const [starOnly, setStarOnlyState] = (0, import_react5.useState)(() => starOnlyMemory.get(projectId) ?? false);
  const [paletteOpen, setPaletteOpen] = (0, import_react5.useState)(false);
  const drag = (0, import_react5.useRef)(null);
  const portRefs = (0, import_react5.useRef)(/* @__PURE__ */ new Map());
  const diagramRef = (0, import_react5.useRef)(null);
  const cleanupConnect = (0, import_react5.useRef)(null);
  const lineTimer = (0, import_react5.useRef)();
  const setStarOnly = (0, import_react5.useCallback)(
    (on) => {
      starOnlyMemory.set(projectId, on);
      setStarOnlyState(on);
      setSelection(null);
    },
    [projectId]
  );
  const starredIds = (0, import_react5.useMemo)(() => new Set([...records.data, ...records.results].filter((node) => node.starred === true).map((node) => node.id)), [records.data, records.results]);
  const views = (0, import_react5.useMemo)(() => starOnly ? { data: starViewOf(indexes.data, records.data), result: starViewOf(indexes.result, records.results) } : void 0, [starOnly, indexes, records.data, records.results]);
  const flats = (0, import_react5.useMemo)(
    () => ({
      data: flattenTree(indexes.data, adding?.side === "data" ? adding.parentId : void 0, views?.data),
      result: flattenTree(indexes.result, adding?.side === "result" ? adding.parentId : void 0, views?.result)
    }),
    [indexes, adding, views]
  );
  const focusId = hoverId ?? pickedId;
  const highlight = (0, import_react5.useMemo)(() => highlightFor(records, indexes, focusId), [records, indexes, focusId]);
  const shownLinks = (0, import_react5.useMemo)(() => starOnly ? records.links.filter((link) => starredIds.has(link.dataId) && starredIds.has(link.resultId)) : records.links, [starOnly, records.links, starredIds]);
  const relations = relationsOf(records);
  const shownRelations = (0, import_react5.useMemo)(() => starOnly ? relations.filter((relation) => starredIds.has(relation.fromId) && starredIds.has(relation.toId)) : relations, [starOnly, relations, starredIds]);
  const lines = (0, import_react5.useMemo)(() => linesOf(shownLinks, flats.data.anchor, flats.result.anchor), [shownLinks, flats]);
  const relationLines = (0, import_react5.useMemo)(() => relationLinesOf(shownRelations, flats.result.anchor), [shownRelations, flats]);
  const linkedRows = (0, import_react5.useMemo)(() => {
    const rows = /* @__PURE__ */ new Set();
    for (const id of highlight.linked) {
      const row = flats.data.anchor.get(id) ?? flats.result.anchor.get(id);
      if (row !== void 0) rows.add(row);
    }
    return rows;
  }, [highlight, flats]);
  const linkCounts = (0, import_react5.useMemo)(() => {
    const counts2 = /* @__PURE__ */ new Map();
    for (const link of shownLinks) {
      for (const row of [flats.data.anchor.get(link.dataId), flats.result.anchor.get(link.resultId)]) {
        if (row !== void 0) counts2.set(row, (counts2.get(row) ?? 0) + 1);
      }
    }
    return counts2;
  }, [shownLinks, flats]);
  const relationCounts = (0, import_react5.useMemo)(() => {
    const counts2 = /* @__PURE__ */ new Map();
    for (const relation of shownRelations) {
      const from = flats.result.anchor.get(relation.fromId);
      const to = flats.result.anchor.get(relation.toId);
      if (from === void 0 || to === void 0 || from === to) continue;
      counts2.set(from, (counts2.get(from) ?? 0) + 1);
      counts2.set(to, (counts2.get(to) ?? 0) + 1);
    }
    return counts2;
  }, [shownRelations, flats]);
  const counts = recordCounts(records);
  const star = starColor(records);
  const edgeDefault = records.palette?.defaults?.edge;
  (0, import_react5.useEffect)(() => {
    const known = new Set([...records.data, ...records.results].map((node) => node.id));
    setOpenIds((ids) => ids.size === 0 || [...ids].every((id) => known.has(id)) ? ids : new Set([...ids].filter((id) => known.has(id))));
    setEditingId((id) => id !== null && !known.has(id) ? null : id);
    setPickedId((id) => id !== null && !known.has(id) ? null : id);
    setRenamingId((id) => id !== null && !known.has(id) ? null : id);
    setSelection((current) => {
      if (!current) return current;
      const kept = [...current.ids].filter((id) => known.has(id));
      return kept.length === current.ids.size ? current : kept.length === 0 ? null : { side: current.side, ids: new Set(kept) };
    });
  }, [records.data, records.results]);
  const measure = (0, import_react5.useCallback)(() => {
    const root = diagramRef.current;
    if (!root) return;
    const box = root.getBoundingClientRect();
    const ports = {};
    portRefs.current.forEach((element, key) => {
      const rect = element.getBoundingClientRect();
      ports[key] = { x: round(rect.left + rect.width / 2 - box.left), y: round(rect.top + rect.height / 2 - box.top) };
    });
    const next = { width: round(box.width), height: round(box.height), ports };
    if (sameGeometry(geometryRef.current, next)) return;
    geometryRef.current = next;
    setGeometry(next);
  }, []);
  (0, import_react5.useLayoutEffect)(() => {
    measure();
  });
  (0, import_react5.useEffect)(() => {
    const root = diagramRef.current;
    if (!root) return;
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => measure());
    observer?.observe(root);
    window.addEventListener("resize", measure);
    const frame = requestAnimationFrame(measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(frame);
    };
  }, [measure]);
  (0, import_react5.useEffect)(
    () => () => {
      cleanupConnect.current?.();
      if (lineTimer.current) clearTimeout(lineTimer.current);
    },
    []
  );
  const undoRef = (0, import_react5.useRef)(() => {
  });
  const perform = (0, import_react5.useCallback)(
    (label, ops, options = {}) => {
      const plan = planOps(recordsRef.current, ops, (/* @__PURE__ */ new Date()).toISOString());
      if (plan.refused.length > 0) toast(plan.refused[0].reason, { tone: "error" });
      if (plan.applied.length === 0) return false;
      let ok = true;
      for (const op of plan.applied) if (!dispatch(op)) ok = false;
      recordsRef.current = plan.after;
      const step = history.record(label, plan.applied, plan.inverse);
      if (options.toast) {
        toast(options.toast, {
          action: {
            label: "\u64A4\u9500",
            // Only the latest step can be taken back from here; older ones go through ⌘Z, one after the other.
            run: () => history.isLatest(step) ? undoRef.current() : toast("\u8FD9\u4E4B\u540E\u53C8\u6709\u65B0\u7684\u64CD\u4F5C\uFF0C\u8BF7\u7528 \u2318Z \u4F9D\u6B21\u64A4\u9500")
          }
        });
      }
      return ok && plan.refused.length === 0;
    },
    [dispatch, history, toast]
  );
  const quietly = (0, import_react5.useCallback)(
    (ops) => {
      const plan = planOps(recordsRef.current, ops, (/* @__PURE__ */ new Date()).toISOString());
      for (const op of plan.applied) dispatch(op);
      recordsRef.current = plan.after;
    },
    [dispatch]
  );
  const undo = (0, import_react5.useCallback)(() => {
    const step = history.takeUndo();
    if (!step) return;
    const plan = planOps(recordsRef.current, step.inverse, (/* @__PURE__ */ new Date()).toISOString());
    for (const op of plan.applied) dispatch(op);
    recordsRef.current = plan.after;
    if (plan.refused.length > 0) toast(`\u300C${step.label}\u300D\u4E4B\u540E\u6709\u6539\u52A8\u88AB\u522B\u5904\u6539\u8FC7\uFF0C\u6CA1\u80FD\u5B8C\u5168\u64A4\u9500`, { tone: "error" });
    else toast(`\u5DF2\u64A4\u9500\uFF1A${step.label}`);
  }, [dispatch, history, toast]);
  undoRef.current = undo;
  const redo = (0, import_react5.useCallback)(() => {
    const step = history.takeRedo();
    if (!step) return;
    const plan = planOps(recordsRef.current, step.forward, (/* @__PURE__ */ new Date()).toISOString());
    for (const op of plan.applied) dispatch(op);
    recordsRef.current = plan.after;
    if (plan.refused.length > 0) toast(`\u300C${step.label}\u300D\u4E4B\u540E\u6709\u6539\u52A8\u88AB\u522B\u5904\u6539\u8FC7\uFF0C\u6CA1\u80FD\u5B8C\u5168\u91CD\u505A`, { tone: "error" });
    else toast(`\u5DF2\u91CD\u505A\uFF1A${step.label}`);
  }, [dispatch, history, toast]);
  (0, import_react5.useEffect)(() => {
    const onKey = (event) => {
      if (!(event.metaKey || event.ctrlKey) || event.altKey) return;
      const key = event.key.toLowerCase();
      if (key !== "z" && key !== "y") return;
      if (typingIn(event.target) || document.querySelector(".kb-overlay") || cleanupConnect.current) return;
      event.preventDefault();
      if (key === "y" || event.shiftKey) redo();
      else undo();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [undo, redo]);
  const nodeOf = (0, import_react5.useCallback)((id) => indexes.data.byId.get(id) ?? indexes.result.byId.get(id), [indexes]);
  const sideOf = (0, import_react5.useCallback)((id) => indexes.data.byId.has(id) ? "data" : indexes.result.byId.has(id) ? "result" : void 0, [indexes]);
  const addNode2 = (0, import_react5.useCallback)(
    (side, parentId, fields) => {
      const id = newId("n");
      const ok = perform(`\u6DFB\u52A0\u300C${shortName(fields.name)}\u300D`, [
        { type: "node.add", projectId, side, id, name: fields.name, path: fields.path, description: fields.description, parentId, beforeId: null, ...starOnly ? { starred: true } : {} }
      ]);
      if (ok) land(id);
      return ok;
    },
    [perform, projectId, starOnly, land]
  );
  const updateNode2 = (0, import_react5.useCallback)(
    (id, fields) => perform(`\u4FEE\u6539\u300C${shortName(nodeOf(id)?.name ?? "")}\u300D`, [{ type: "node.update", projectId, nodeId: id, ...fields }]),
    [perform, projectId, nodeOf]
  );
  const toggleFold = (0, import_react5.useCallback)(
    (node) => {
      quietly([{ type: "node.update", projectId, nodeId: node.id, collapsed: !node.collapsed }]);
    },
    [quietly, projectId]
  );
  const startAdd = (0, import_react5.useCallback)(
    (side, parentId) => {
      const parent = parentId === null ? void 0 : indexes[side].byId.get(parentId);
      if (parent?.collapsed) quietly([{ type: "node.update", projectId, nodeId: parent.id, collapsed: false }]);
      setEditingId(null);
      setAdding({ side, parentId });
    },
    [quietly, indexes, projectId]
  );
  const toggleStar = (0, import_react5.useCallback)(
    (node) => {
      const on = node.starred !== true;
      perform(`${on ? "\u52A0\u661F\u6807" : "\u53D6\u6D88\u661F\u6807"}\u300C${shortName(node.name)}\u300D`, [{ type: "node.update", projectId, nodeId: node.id, starred: on }]);
    },
    [perform, projectId]
  );
  const toggleStarTree = (0, import_react5.useCallback)(
    (node) => {
      const side = sideOf(node.id);
      if (side === void 0) return;
      const ids = subtreeIds(indexes[side], node.id);
      const on = !ids.every((id) => indexes[side].byId.get(id)?.starred === true);
      perform(
        `${on ? "\u6574\u7EC4\u52A0\u661F\u6807" : "\u6574\u7EC4\u53D6\u6D88\u661F\u6807"}\u300C${shortName(node.name)}\u300D`,
        ids.map((id) => ({ type: "node.update", projectId, nodeId: id, starred: on }))
      );
    },
    [perform, projectId, indexes, sideOf]
  );
  const setCategory = (0, import_react5.useCallback)(
    (ids, category) => {
      perform(
        ids.length === 1 ? `\u8BBE\u7F6E\u300C${shortName(nodeOf(ids[0])?.name ?? "")}\u300D\u7684\u7C7B\u522B` : `\u8BBE\u7F6E ${ids.length} \u9879\u7684\u7C7B\u522B`,
        ids.map((id) => ({ type: "node.update", projectId, nodeId: id, category }))
      );
    },
    [perform, projectId, nodeOf]
  );
  const addLink2 = (0, import_react5.useCallback)(
    (dataId, resultId) => {
      if (recordsRef.current.links.some((link) => link.dataId === dataId && link.resultId === resultId)) return false;
      return perform("\u6DFB\u52A0\u8FDE\u7EBF", [{ type: "link.add", projectId, id: newId("l"), dataId, resultId }]);
    },
    [perform, projectId]
  );
  const removeLink = (0, import_react5.useCallback)(
    (id) => {
      perform("\u5220\u9664\u8FDE\u7EBF", [{ type: "link.delete", projectId, linkId: id }], { toast: "\u5DF2\u53D6\u6D88\u5173\u8054" });
    },
    [perform, projectId]
  );
  const addRelation2 = (0, import_react5.useCallback)(
    (fromId, toId, directed = false) => {
      if (relationsOf(recordsRef.current).some((relation) => relation.fromId === fromId && relation.toId === toId || relation.fromId === toId && relation.toId === fromId)) return false;
      return perform("\u6DFB\u52A0\u7ED3\u679C\u4E4B\u95F4\u7684\u8FDE\u7EBF", [{ type: "relation.add", projectId, id: newId("l"), fromId, toId, directed }]);
    },
    [perform, projectId]
  );
  const updateRelation2 = (0, import_react5.useCallback)(
    (id, patch) => {
      perform(patch.reverse ? "\u53CD\u5411" : patch.directed ? "\u6539\u4E3A\u6709\u5411\u8FDE\u7EBF" : "\u6539\u4E3A\u65E0\u5411\u8FDE\u7EBF", [{ type: "relation.update", projectId, relationId: id, ...patch }]);
    },
    [perform, projectId]
  );
  const removeRelation = (0, import_react5.useCallback)(
    (relation) => {
      perform("\u5220\u9664\u7ED3\u679C\u4E4B\u95F4\u7684\u8FDE\u7EBF", [{ type: "relation.delete", projectId, relationId: relation.id }], { toast: "\u5DF2\u53D6\u6D88\u8FDE\u7EBF" });
    },
    [perform, projectId]
  );
  (0, import_react5.useEffect)(() => {
    if (pickedLine === null) return void 0;
    const onKey = (event) => {
      if (event.key !== "Delete" && event.key !== "Backspace") return;
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || event.isComposing) return;
      if (typingIn(event.target) || document.querySelector(".kb-overlay, .kb-menu") || cleanupConnect.current) return;
      const link = lines.find((item) => item.key === pickedLine);
      const relation = relationLines.find((item) => item.key === pickedLine);
      if (!link && !relation) return;
      event.preventDefault();
      if (link && !link.folded && link.links.length === 1) removeLink(link.links[0].id);
      else if (relation && !relation.folded && relation.relations.length === 1) removeRelation(relation.relations[0]);
      else {
        const count = link ? link.links.length : relation.relations.length;
        toast(`\u8FD9\u6761\u7EBF\u8FDE\u7740\u6298\u53E0\u7684\u5206\u7EC4\uFF08\u5171 ${count} \u6761\uFF09\uFF1A\u5C55\u5F00\u5206\u7EC4\u540E\uFF0C\u70B9\u9009\u5176\u4E2D\u4E00\u6761\u518D\u6309 Delete`);
        return;
      }
      setHoverLine(null);
      setPickedLine(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [pickedLine, lines, relationLines, removeLink, removeRelation, toast]);
  const setEdgeCategory = (0, import_react5.useCallback)(
    (edge, category) => {
      perform("\u8BBE\u7F6E\u8FDE\u7EBF\u7C7B\u522B", [edge.kind === "link" ? { type: "link.update", projectId, linkId: edge.id, category } : { type: "relation.update", projectId, relationId: edge.id, category }]);
    },
    [perform, projectId]
  );
  const addCategory2 = (0, import_react5.useCallback)(
    (kind, name, color) => {
      perform(`\u6DFB\u52A0${kind === "node" ? "\u8282\u70B9" : "\u8FDE\u7EBF"}\u7C7B\u522B\u300C${shortName(name)}\u300D`, [{ type: "category.add", projectId, kind, id: newId("c"), name, color }]);
    },
    [perform, projectId]
  );
  const updateCategory2 = (0, import_react5.useCallback)(
    (kind, id, patch) => {
      perform("\u4FEE\u6539\u7C7B\u522B", [{ type: "category.update", projectId, kind, categoryId: id, ...patch }]);
    },
    [perform, projectId]
  );
  const removeCategory = (0, import_react5.useCallback)(
    (kind, id) => {
      const name = categoriesOf(recordsRef.current, kind).find((category) => category.id === id)?.name ?? "";
      perform(`\u5220\u9664\u7C7B\u522B\u300C${shortName(name)}\u300D`, [{ type: "category.delete", projectId, kind, categoryId: id }], { toast: `\u5DF2\u5220\u9664\u7C7B\u522B\u300C${shortName(name)}\u300D\uFF0C\u7528\u4E86\u5B83\u7684\u56DE\u5230\u9ED8\u8BA4\u8272` });
    },
    [perform, projectId]
  );
  const setDefaultColor = (0, import_react5.useCallback)(
    (which, color) => {
      perform(`\u4FEE\u6539${which === "node" ? "\u8282\u70B9" : which === "edge" ? "\u8FDE\u7EBF" : "\u661F\u6807"}\u7684\u9ED8\u8BA4\u989C\u8272`, [{ type: "palette.update", projectId, [which]: color }]);
    },
    [perform, projectId]
  );
  const removeNode = (0, import_react5.useCallback)(
    (node) => {
      const side = sideOf(node.id);
      if (side === void 0) return;
      const gone = subtreeIds(indexes[side], node.id);
      const hidden = views ? gone.filter((id) => !views[side].only.has(id)).length : 0;
      const links = records.links.filter((link) => gone.includes(link.dataId) || gone.includes(link.resultId)).length;
      const run = () => {
        const label = shortName(node.name);
        perform(`\u5220\u9664\u300C${label}\u300D`, [{ type: "node.delete", projectId, nodeId: node.id }], { toast: gone.length > 1 ? `\u5DF2\u5220\u9664\u300C${label}\u300D\u53CA\u5176 ${gone.length - 1} \u4E2A\u5B50\u8282\u70B9` : `\u5DF2\u5220\u9664\u300C${label}\u300D` });
      };
      if (gone.length > 1) {
        confirm({
          title: `\u5220\u9664\u300C${node.name}\u300D\uFF1F`,
          body: `\u5B83\u4E0B\u9762\u7684 ${gone.length - 1} \u4E2A\u5B50\u8282\u70B9\u4F1A\u4E00\u8D77\u5220\u9664${hidden > 0 ? `\uFF08\u5176\u4E2D ${hidden} \u4E2A\u73B0\u5728\u88AB\u300C\u53EA\u770B\u661F\u6807\u300D\u9690\u85CF\uFF09` : ""}${links > 0 ? `\uFF0C\u76F8\u5173\u7684 ${links} \u6761\u8FDE\u7EBF\u4E5F\u4F1A\u5220\u9664` : ""}\u3002\u5220\u9664\u540E\u53EF\u4EE5\u9A6C\u4E0A\u64A4\u9500\u3002`,
          confirmLabel: "\u5220\u9664",
          onConfirm: run
        });
      } else run();
    },
    [confirm, indexes, perform, projectId, records.links, sideOf, views]
  );
  const dissolveNode = (0, import_react5.useCallback)(
    (node) => {
      const side = sideOf(node.id);
      if (side === void 0) return;
      const kids = childrenOf(indexes[side], node.id).length;
      const label = shortName(node.name);
      perform(`\u89E3\u6563\u300C${label}\u300D`, [{ type: "node.delete", projectId, nodeId: node.id, lift: true }], { toast: `\u5DF2\u89E3\u6563\u300C${label}\u300D\uFF0C${kids} \u4E2A\u5B50\u8282\u70B9\u5DF2\u4E0A\u79FB` });
    },
    [indexes, perform, projectId, sideOf]
  );
  const shift = (0, import_react5.useCallback)(
    (node, how) => {
      const side = sideOf(node.id);
      if (side === void 0) return;
      const index = indexes[side];
      const siblings = childrenOf(index, node.parentId);
      const at = siblings.findIndex((item) => item.id === node.id);
      const label = `\u79FB\u52A8\u300C${shortName(node.name)}\u300D`;
      const move = (parentId, beforeId) => {
        perform(label, [{ type: "node.move", projectId, nodeId: node.id, parentId, beforeId }]);
      };
      if (how === "up" && at > 0) move(node.parentId, siblings[at - 1].id);
      else if (how === "down" && at >= 0 && at < siblings.length - 1) move(node.parentId, siblings[at + 2]?.id ?? null);
      else if (how === "in" && at > 0) {
        const parent = siblings[at - 1];
        if (parent.collapsed) quietly([{ type: "node.update", projectId, nodeId: parent.id, collapsed: false }]);
        move(parent.id, null);
      } else if (how === "out" && node.parentId !== null) {
        const parent = index.byId.get(node.parentId);
        if (parent) {
          const uncles = childrenOf(index, parent.parentId);
          move(parent.parentId, uncles[uncles.findIndex((item) => item.id === parent.id) + 1]?.id ?? null);
        }
      }
    },
    [indexes, perform, projectId, quietly, sideOf]
  );
  const dropOn = (0, import_react5.useCallback)(
    (side, targetId, zone) => {
      const dragged = drag.current;
      drag.current = null;
      if (!dragged || dragged.side !== side) return;
      const index = indexes[side];
      const position = new Map(listOf(records, side).map((node, i) => [node.id, i]));
      const ordered = dragged.ids.filter((id) => position.has(id)).sort((a, b) => position.get(a) - position.get(b));
      const aimed = (skip) => targetId === null || zone === "end" ? { parentId: null, beforeId: null } : dropTarget(index, targetId, zone, skip);
      const first = aimed(new Set(ordered));
      if (!first) return;
      const moving = movableIds(index, ordered, first.parentId);
      if (moving.length === 0) return;
      const target = aimed(new Set(moving));
      if (!target) return;
      const ops = [];
      if (target.parentId !== null && index.byId.get(target.parentId)?.collapsed) quietly([{ type: "node.update", projectId, nodeId: target.parentId, collapsed: false }]);
      for (const id of moving) ops.push({ type: "node.move", projectId, nodeId: id, parentId: target.parentId, beforeId: target.beforeId });
      perform(moving.length === 1 ? `\u79FB\u52A8\u300C${shortName(index.byId.get(moving[0])?.name ?? "")}\u300D` : `\u79FB\u52A8 ${moving.length} \u9879`, ops);
      land(moving[0]);
      setSelection(null);
    },
    [indexes, land, perform, projectId, quietly, records]
  );
  const mergeSelection = (0, import_react5.useCallback)(() => {
    if (!selection) return;
    const side = selection.side;
    const index = indexes[side];
    const ordered = inRowOrder(flats[side].rows, selection.ids);
    const moving = movableIds(index, ordered, null);
    const first = moving[0] === void 0 ? void 0 : index.byId.get(moving[0]);
    if (!first) return;
    const groupId = newId("n");
    const ops = [{ type: "node.add", projectId, side, id: groupId, name: "\u65B0\u5206\u7EC4", parentId: first.parentId, beforeId: first.id, ...starOnly ? { starred: true } : {} }];
    for (const id of moving) ops.push({ type: "node.move", projectId, nodeId: id, parentId: groupId, beforeId: null });
    if (!perform("\u5408\u5E76\u4E3A\u5206\u7EC4", ops)) return;
    setSelection(null);
    setRenamingId(groupId);
    land(groupId);
  }, [flats, indexes, land, perform, projectId, selection, starOnly]);
  const bulkStar = (0, import_react5.useCallback)(() => {
    if (!selection) return;
    const ids = [...selection.ids];
    const on = !ids.every((id) => starredIds.has(id));
    perform(on ? `\u7ED9 ${ids.length} \u9879\u52A0\u661F\u6807` : `\u53D6\u6D88 ${ids.length} \u9879\u7684\u661F\u6807`, ids.map((id) => ({ type: "node.update", projectId, nodeId: id, starred: on })));
  }, [perform, projectId, selection, starredIds]);
  const latest = (0, import_react5.useRef)({ addLink: addLink2, addRelation: addRelation2 });
  latest.current = { addLink: addLink2, addRelation: addRelation2 };
  const beginConnect = (0, import_react5.useCallback)((side, id, event, mode) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    event.preventDefault();
    event.stopPropagation();
    cleanupConnect.current?.();
    const blocked = mode === "relation" ? new Set(relationsOf(recordsRef.current).flatMap((relation) => relation.fromId === id ? [relation.toId] : relation.toId === id ? [relation.fromId] : [])) : void 0;
    setConnecting({ side, id, overId: null, mode, ...blocked ? { blocked } : {} });
    setPointer({ x: event.clientX, y: event.clientY });
    const accepts = (over) => over !== null && (mode === "relation" ? over.side === "result" && over.id !== id && blocked?.has(over.id) !== true : over.side !== side);
    const stop = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      window.removeEventListener("keydown", onKey, true);
      cleanupConnect.current = null;
      setConnecting(null);
      setPointer(null);
    };
    const onMove = (ev) => {
      const over = nodeUnder(ev.target);
      setPointer({ x: ev.clientX, y: ev.clientY });
      setConnecting((current) => {
        const overId = current && accepts(over) ? over.id : null;
        return current && current.overId !== overId ? { ...current, overId } : current;
      });
    };
    const onUp = (ev) => {
      const over = nodeUnder(ev.target);
      stop();
      if (!accepts(over)) return;
      if (mode === "relation") latest.current.addRelation(id, over.id, ev.altKey);
      else {
        const [dataId, resultId] = side === "data" ? [id, over.id] : [over.id, id];
        latest.current.addLink(dataId, resultId);
      }
    };
    const onCancel = () => stop();
    const onKey = (ev) => {
      if (ev.key === "Escape") stop();
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
    window.addEventListener("keydown", onKey, true);
    cleanupConnect.current = stop;
  }, []);
  const reveal = (0, import_react5.useCallback)(
    (id) => {
      const side = sideOf(id);
      if (side === void 0) return;
      const index = indexes[side];
      if (views && !views[side].only.has(id)) setStarOnly(false);
      for (let parent = index.byId.get(id)?.parentId ?? null; parent !== null; parent = index.byId.get(parent)?.parentId ?? null) {
        const group = index.byId.get(parent);
        if (group?.collapsed) quietly([{ type: "node.update", projectId, nodeId: group.id, collapsed: false }]);
      }
      setPickedId(id);
      setOpenIds((ids) => new Set(ids).add(id));
      requestAnimationFrame(() => {
        const row = diagramRef.current?.querySelector(`[data-rec-node="${id}"]`);
        row?.scrollIntoView?.({ block: "center", behavior: "smooth" });
      });
    },
    [indexes, projectId, quietly, setStarOnly, sideOf, views]
  );
  const ui = (0, import_react5.useMemo)(
    () => ({
      project,
      records,
      indexes,
      openIds,
      editingId,
      focusId,
      withinIds: highlight.active,
      linkedRows,
      linkCounts,
      relationCounts,
      selection,
      renamingId,
      adding,
      dropHint,
      connecting,
      drag,
      landedId,
      starOnly,
      colorOf: (node) => nodeColor(records, node),
      toggleOpen: (id) => setOpenIds((ids) => {
        const next = new Set(ids);
        if (!next.delete(id)) next.add(id);
        return next;
      }),
      setEditing: setEditingId,
      pick: setPickedId,
      hover: setHoverId,
      toggleSelect: (side, id) => setSelection((current) => {
        const ids = new Set(current?.side === side ? current.ids : []);
        if (!ids.delete(id)) ids.add(id);
        return ids.size === 0 ? null : { side, ids };
      }),
      setRenaming: setRenamingId,
      startAdd,
      stopAdd: () => setAdding(null),
      setDropHint,
      registerPort: (key, element) => {
        if (element) portRefs.current.set(key, element);
        else portRefs.current.delete(key);
      },
      beginConnect,
      reveal,
      openPalette: () => setPaletteOpen(true),
      perform,
      addNode: addNode2,
      updateNode: updateNode2,
      removeNode,
      dissolveNode,
      shift,
      dropOn,
      addLink: addLink2,
      removeLink,
      addRelation: addRelation2,
      updateRelation: updateRelation2,
      removeRelation,
      toggleFold,
      toggleStar,
      toggleStarTree,
      setCategory,
      setEdgeCategory,
      addCategory: addCategory2,
      updateCategory: updateCategory2,
      removeCategory,
      setDefaultColor
    }),
    [project, records, indexes, openIds, editingId, focusId, highlight, linkedRows, linkCounts, relationCounts, selection, renamingId, adding, dropHint, connecting, landedId, starOnly, startAdd, beginConnect, reveal, perform, addNode2, updateNode2, removeNode, dissolveNode, shift, dropOn, addLink2, removeLink, addRelation2, updateRelation2, removeRelation, toggleFold, toggleStar, toggleStarTree, setCategory, setEdgeCategory, addCategory2, updateCategory2, removeCategory, setDefaultColor]
  );
  const point = (key) => geometry.ports[key];
  const hoverLineTimer = (key) => {
    if (lineTimer.current) clearTimeout(lineTimer.current);
    if (key !== null) setHoverLine(key);
    else lineTimer.current = setTimeout(() => setHoverLine(null), 160);
  };
  const activeLine = hoverLine ?? pickedLine;
  const starredEnd = (ids) => ids.some((id) => starredIds.has(id));
  const rubber = (() => {
    if (!connecting || !pointer) return void 0;
    const relating = connecting.mode === "relation";
    const from = point(relating ? `${connecting.id}:r` : connecting.id);
    const box = diagramRef.current?.getBoundingClientRect();
    if (!from || !box) return void 0;
    const target = connecting.overId !== null ? point(relating ? `${connecting.overId}:r` : connecting.overId) : void 0;
    if (relating && target) return arc(from.x, from.y, target.y);
    const x = target ? target.x : pointer.x - box.left;
    const y = target ? target.y : pointer.y - box.top;
    if (relating) return `M${from.x},${from.y} C${from.x + 56},${from.y} ${x + 56},${y} ${x},${y}`;
    return connecting.side === "data" ? curve(from.x, from.y, x, y) : curve(x, y, from.x, from.y);
  })();
  const toolbar = (() => {
    if (activeLine === null) return void 0;
    const edgeCategories = categoriesOf(records, "edge");
    const dots = (current, assign) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: "kb-cat-dot is-default" + (current === void 0 ? " is-on" : ""), "aria-label": "\u9ED8\u8BA4\u989C\u8272", "aria-pressed": current === void 0, title: "\u9ED8\u8BA4\u989C\u8272", onClick: () => assign(null) }),
      edgeCategories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: "kb-cat-dot" + (current === category.id ? " is-on" : ""), style: { ["--cat"]: category.color }, "aria-label": `\u7C7B\u522B\uFF1A${category.name}`, "aria-pressed": current === category.id, title: category.name, onClick: () => assign(category.id) }, category.id))
    ] });
    const keep = { onPointerEnter: () => hoverLineTimer(activeLine), onPointerLeave: () => hoverLineTimer(null) };
    const line = lines.find((item) => item.key === activeLine);
    if (line && !line.folded && line.links.length === 1) {
      const a = point(line.from);
      const b = point(line.to);
      const link = line.links[0];
      if (!a || !b) return void 0;
      const mid = curveMiddle(a.x, a.y, b.x, b.y);
      return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "kb-line-tools", style: { left: mid.x, top: mid.y + 14, transform: "translate(-50%, 0)" }, role: "toolbar", "aria-label": "\u8FDE\u7EBF", ...keep, children: [
        dots(link.category, (category) => setEdgeCategory({ kind: "link", id: link.id }, category)),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: "kb-link-del", "aria-label": "\u5220\u9664\u8FDE\u7EBF", title: "\u5220\u9664\u8FDE\u7EBF\uFF08\u70B9\u9009\u8FD9\u6761\u7EBF\u540E\uFF0C\u6309 Delete \u952E\u4E5F\u53EF\u4EE5\uFF09", onClick: () => {
          removeLink(link.id);
          setHoverLine(null);
          setPickedLine(null);
        }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(CloseIcon, { size: 11 }) })
      ] });
    }
    const relationLine = relationLines.find((item) => item.key === activeLine);
    if (relationLine && !relationLine.folded && relationLine.relations.length === 1) {
      const a = point(`${relationLine.from}:r`);
      const b = point(`${relationLine.to}:r`);
      const relation = relationLine.relations[0];
      if (!a || !b) return void 0;
      const mid = arcMiddle(a.x, a.y, b.y);
      const directed = relation.directed === true;
      const box = diagramRef.current?.getBoundingClientRect();
      const onRight = box !== void 0 && window.innerWidth - (box.left + mid.x) >= 130;
      return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "kb-line-tools", style: { left: onRight ? mid.x + 14 : mid.x - 14, top: mid.y, transform: onRight ? "translate(0, -50%)" : "translate(-100%, -50%)" }, role: "toolbar", "aria-label": "\u7ED3\u679C\u4E4B\u95F4\u7684\u8FDE\u7EBF", ...keep, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: "kb-line-btn", "aria-label": directed ? "\u6539\u4E3A\u65E0\u5411" : "\u6539\u4E3A\u6709\u5411", "aria-pressed": directed, title: directed ? "\u6709\u5411\uFF1A\u70B9\u51FB\u6539\u4E3A\u65E0\u5411" : "\u65E0\u5411\uFF1A\u70B9\u51FB\u6539\u4E3A\u6709\u5411", onClick: () => updateRelation2(relation.id, { directed: !directed }), children: directed ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(ArrowRightIcon, { size: 12 }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(MinusIcon, { size: 12 }) }),
        directed ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: "kb-line-btn", "aria-label": "\u53CD\u5411", title: "\u53CD\u5411", onClick: () => updateRelation2(relation.id, { reverse: true }), children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(SwapIcon, { size: 12 }) }) : null,
        dots(relation.category, (category) => setEdgeCategory({ kind: "relation", id: relation.id }, category)),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: "kb-link-del", "aria-label": "\u5220\u9664\u8FDE\u7EBF", title: "\u5220\u9664\u8FDE\u7EBF\uFF08\u70B9\u9009\u8FD9\u6761\u7EBF\u540E\uFF0C\u6309 Delete \u952E\u4E5F\u53EF\u4EE5\uFF09", onClick: () => {
          removeRelation(relation);
          setHoverLine(null);
          setPickedLine(null);
        }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(CloseIcon, { size: 11 }) })
      ] });
    }
    return void 0;
  })();
  const onRootKey = (event) => {
    if (event.key !== "Escape") return;
    if (selection) setSelection(null);
    else if (pickedId !== null) setPickedId(null);
    else if (adding) setAdding(null);
  };
  const empty = counts.data === 0 && counts.results === 0 && adding === null && records.palette === void 0;
  const selected = selection?.ids.size ?? 0;
  const nodeCategories = categoriesOf(records, "node");
  const allSelectedStarred = selection !== null && [...selection.ids].every((id) => starredIds.has(id));
  const rootStyle = { ["--kb-accent"]: COLOR_VALUES[project.color], ["--kb-star"]: star, ...edgeDefault ? { ["--kb-edge"]: edgeDefault } : {} };
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(RecordsContext.Provider, { value: ui, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "kb-rec", style: rootStyle, onKeyDown: onRootKey, children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "kb-rec-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("button", { type: "button", className: "kb-btn kb-btn-ghost kb-btn-sm kb-back", onClick: onBack, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(ArrowLeftIcon, { size: 14 }),
        " \u9879\u76EE\u770B\u677F"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "kb-rec-heading", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("h1", { className: "kb-rec-title", children: project.name }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("p", { className: "kb-subtitle", children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("b", { children: counts.data }),
            " \u9879\u6570\u636E"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("b", { children: counts.results }),
            " \u4E2A\u7ED3\u679C"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("b", { children: counts.links }),
            " \u6761\u8FDE\u7EBF"
          ] }),
          relations.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("b", { children: relations.length }),
            " \u6761\u7ED3\u679C\u95F4\u8FDE\u7EBF"
          ] }) : null
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "kb-rec-tools", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: "kb-btn kb-btn-sm kb-btn-icon", "aria-label": "\u64A4\u9500", title: history.canUndo ? `\u64A4\u9500\uFF1A${history.undoLabel}\uFF08\u2318Z\uFF09` : "\u6CA1\u6709\u53EF\u4EE5\u64A4\u9500\u7684\u64CD\u4F5C", disabled: !history.canUndo, onClick: undo, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(UndoIcon, { size: 14 }) }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: "kb-btn kb-btn-sm kb-btn-icon", "aria-label": "\u91CD\u505A", title: history.canRedo ? `\u91CD\u505A\uFF1A${history.redoLabel}\uFF08\u21E7\u2318Z\uFF09` : "\u6CA1\u6709\u53EF\u4EE5\u91CD\u505A\u7684\u64CD\u4F5C", disabled: !history.canRedo, onClick: redo, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(RedoIcon, { size: 14 }) }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("button", { type: "button", className: "kb-btn kb-btn-sm kb-star-toggle" + (starOnly ? " is-on" : ""), "aria-pressed": starOnly, title: "\u53EA\u663E\u793A\u52A0\u4E86\u661F\u6807\u7684\u8282\u70B9\uFF08\u5B83\u4EEC\u6240\u5728\u7684\u5206\u7EC4\u4F1A\u7070\u8272\u663E\u793A\uFF09", onClick: () => setStarOnly(!starOnly), children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(StarIcon, { size: 14, filled: starOnly }),
          " \u53EA\u770B\u661F\u6807",
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "kb-count", children: starredIds.size })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(PaletteButton, { open: paletteOpen, onOpenChange: setPaletteOpen })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(SaveStatus, { status })
    ] }),
    starOnly ? /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "kb-starbar", role: "note", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(StarIcon, { size: 14, filled: true }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { children: [
        "\u53EA\u770B\u661F\u6807\uFF1A\u7070\u8272\u7684\u662F\u661F\u6807\u8282\u70B9\u6240\u5728\u7684\u5206\u7EC4\u3002",
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("b", { children: "\u8FD9\u662F\u540C\u4E00\u68F5\u6811\u7684\u7B5B\u9009\u89C6\u56FE\uFF0C\u4E0D\u662F\u526F\u672C" }),
        "\uFF0C\u5728\u8FD9\u91CC\u505A\u7684\u4FEE\u6539\u4F1A\u76F4\u63A5\u4F5C\u7528\u5728\u5B8C\u6574\u7684\u6811\u4E0A\uFF1B\u65B0\u5EFA\u7684\u8282\u70B9\u4F1A\u81EA\u52A8\u52A0\u661F\u6807\u3002"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: "kb-btn kb-btn-sm kb-btn-ghost", onClick: () => setStarOnly(false), children: "\u663E\u793A\u5168\u90E8" })
    ] }) : null,
    selected > 0 ? /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "kb-selbar", role: "toolbar", "aria-label": "\u6279\u91CF\u64CD\u4F5C", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { children: [
        "\u5DF2\u9009 ",
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("b", { children: selected }),
        " \u9879"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("button", { type: "button", className: "kb-btn kb-btn-sm kb-btn-primary", onClick: mergeSelection, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(FolderPlusIcon, { size: 14 }),
        " \u5408\u5E76\u4E3A\u5206\u7EC4"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("button", { type: "button", className: "kb-btn kb-btn-sm", onClick: bulkStar, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(StarIcon, { size: 14, filled: allSelectedStarred }),
        " ",
        allSelectedStarred ? "\u53D6\u6D88\u661F\u6807" : "\u52A0\u661F\u6807"
      ] }),
      nodeCategories.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
        "select",
        {
          className: "kb-select",
          "aria-label": "\u7ED9\u6240\u9009\u8BBE\u7F6E\u7C7B\u522B",
          value: "",
          onChange: (event) => {
            const value = event.target.value;
            if (value !== "" && selection) setCategory([...selection.ids], value === "__default" ? null : value);
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: "", children: "\u7C7B\u522B\u2026" }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: "__default", children: "\u9ED8\u8BA4" }),
            nodeCategories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: category.id, children: category.name }, category.id))
          ]
        }
      ) : null,
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "kb-hint", children: "\u4E5F\u53EF\u4EE5\u76F4\u63A5\u62D6\u52A8\u5176\u4E2D\u4E00\u9879\uFF0C\u4E00\u8D77\u79FB\u5230\u522B\u5904" }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: "kb-btn kb-btn-sm kb-btn-ghost", onClick: () => setSelection(null), children: "\u53D6\u6D88\u9009\u62E9" })
    ] }) : null,
    empty ? /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "kb-empty", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(RecordsIcon, { size: 40 }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("h2", { children: "\u8BB0\u5F55\u8FD9\u4E2A\u9879\u76EE\u7684\u5173\u952E\u6570\u636E\u548C\u7ED3\u679C" }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { children: "\u5DE6\u8FB9\u8BB0\u6570\u636E\uFF1A\u7B80\u5355\u540D\u5B57\u3001\u5B8C\u6574\u8DEF\u5F84\u3001\u63CF\u8FF0\uFF1B\u53F3\u8FB9\u8BB0\u7ED3\u679C\u3002\u628A\u4E00\u4FA7\u7684\u5706\u70B9\u62D6\u5230\u53E6\u4E00\u4FA7\uFF0C\u5C31\u80FD\u6807\u51FA\u54EA\u4E9B\u7ED3\u679C\u6765\u81EA\u54EA\u4E9B\u6570\u636E\u3002\u6570\u636E\u548C\u7ED3\u679C\u90FD\u53EF\u4EE5\u62D6\u52A8\u5408\u5E76\u6210\u7AE0\u8282\uFF0C\u91CD\u8981\u7684\u52A0\u661F\u6807\u3002" }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "kb-empty-actions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: "kb-btn kb-btn-primary", onClick: () => startAdd("data", null), children: "\u6DFB\u52A0\u7B2C\u4E00\u9879\u6570\u636E" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: "kb-btn", onClick: () => startAdd("result", null), children: "\u6DFB\u52A0\u7B2C\u4E00\u4E2A\u7ED3\u679C" })
      ] })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "kb-diagram-scroll", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
      "div",
      {
        className: "kb-diagram" + (connecting ? " is-connecting" : "") + (connecting?.mode === "relation" ? " is-relating" : connecting ? " is-linking" : "") + (focusId !== null ? " has-focus" : "") + (selected > 0 ? " has-selection" : ""),
        ref: diagramRef,
        onPointerDown: (event) => {
          if (!event.target.closest(".kb-node, .kb-rec-card, .kb-rec-form, .kb-line-tools, .kb-tree-head")) {
            setPickedId(null);
            setPickedLine(null);
          }
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TreePanel, { side: "data", flat: flats.data }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "kb-gutter", "aria-hidden": "true", children: shownLinks.length === 0 && counts.data > 0 && counts.results > 0 ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: "\u4ECE\u5706\u70B9\u62D6\u5230\u53E6\u4E00\u4FA7\u7684\u8282\u70B9\u4E0A\uFF0C\u6807\u51FA\u7ED3\u679C\u6765\u81EA\u54EA\u4E9B\u6570\u636E" }) : null }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TreePanel, { side: "result", flat: flats.result }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "kb-gutter kb-gutter-right", "aria-hidden": "true", children: [
            counts.results > 0 ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "kb-rel-head", children: "\u5173\u7CFB" }) : null,
            relations.length === 0 && counts.results > 1 ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: "\u62D6\u83F1\u5F62\u70B9\uFF0C\u8FDE\u5230\u522B\u7684\u7ED3\u679C" }) : null
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { className: "kb-links", width: geometry.width, height: geometry.height, role: "presentation", focusable: "false", children: [
            lines.map((line) => {
              const a = point(line.from);
              const b = point(line.to);
              if (!a || !b) return null;
              const path = curve(a.x, a.y, b.x, b.y);
              const color = line.folded || line.links.length > 1 ? starredEnd(line.links.flatMap((link) => [link.dataId, link.resultId])) ? star : edgeDefault : edgeColor(records, line.links[0], starredEnd([line.links[0].dataId, line.links[0].resultId]));
              const hot = line.links.some((link) => highlight.linkIds.has(link.id)) || line.key === activeLine;
              const dim = focusId !== null && !hot;
              return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
                "g",
                {
                  className: "kb-link" + (hot ? " is-hot" : "") + (dim ? " is-dim" : "") + (line.folded ? " is-folded" : "") + (color ? " has-color" : ""),
                  style: color ? { ["--kb-line"]: color } : void 0,
                  "data-line": line.key,
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { className: "kb-link-line", d: path }),
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                      "path",
                      {
                        className: "kb-link-hit",
                        d: path,
                        onPointerEnter: () => hoverLineTimer(line.key),
                        onPointerLeave: () => hoverLineTimer(null),
                        onClick: () => setPickedLine((current) => current === line.key ? null : line.key)
                      }
                    )
                  ]
                },
                line.key
              );
            }),
            relationLines.map((line) => {
              const a = point(`${line.from}:r`);
              const b = point(`${line.to}:r`);
              if (!a || !b) return null;
              const path = arc(a.x, a.y, b.y);
              const color = line.folded || line.relations.length > 1 ? starredEnd(line.relations.flatMap((relation) => [relation.fromId, relation.toId])) ? star : edgeDefault : edgeColor(records, line.relations[0], starredEnd([line.relations[0].fromId, line.relations[0].toId]));
              const hot = line.relations.some((relation) => highlight.relationIds.has(relation.id)) || line.key === activeLine;
              const dim = focusId !== null && !hot;
              return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
                "g",
                {
                  className: "kb-link kb-relation" + (hot ? " is-hot" : "") + (dim ? " is-dim" : "") + (line.folded ? " is-folded" : "") + (line.directed ? " is-directed" : "") + (color ? " has-color" : ""),
                  style: color ? { ["--kb-line"]: color } : void 0,
                  "data-line": line.key,
                  "data-relation": "",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { className: "kb-link-line", d: path }),
                    line.directed ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("polygon", { className: "kb-link-arrow", points: arrowPoints(b.x + 9, b.y) }) : null,
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                      "path",
                      {
                        className: "kb-link-hit",
                        d: path,
                        onPointerEnter: () => hoverLineTimer(line.key),
                        onPointerLeave: () => hoverLineTimer(null),
                        onClick: () => setPickedLine((current) => current === line.key ? null : line.key)
                      }
                    )
                  ]
                },
                `rel:${line.key}`
              );
            }),
            rubber ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { className: "kb-link-temp", d: rubber }) : null
          ] }),
          toolbar
        ]
      }
    ) })
  ] }) });
}

// src/client/KanbanView.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
var EMPTY_HINTS = {
  todo: "\u6682\u65E0\u5F85\u529E",
  doing: "\u6807\u8BB0\u5F85\u529E\u5B8C\u6210\u540E\u4F1A\u6765\u5230\u8FD9\u91CC",
  review: "\u7B49\u5F85\u53CD\u9988\u7684\u4EFB\u52A1",
  done: "\u5B8C\u6210\u7684\u4EFB\u52A1\u4F1A\u51FA\u73B0\u5728\u8FD9\u91CC"
};
function TaskEditor({ initialTitle = "", initialNote = "", submitLabel, keepOpen, onSubmit, onCancel }) {
  const [title, setTitle] = (0, import_react6.useState)(initialTitle);
  const [note, setNote] = (0, import_react6.useState)(initialNote);
  const [showNote, setShowNote] = (0, import_react6.useState)(initialNote !== "");
  const titleRef = (0, import_react6.useRef)(null);
  (0, import_react6.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "kb-card is-editing", onKeyDown: onKey, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
    showNote ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("textarea", { className: "kb-textarea", placeholder: "\u5907\u6CE8\uFF08\u53EF\u9009\uFF09", value: note, rows: 3, maxLength: LIMITS.taskNote, onChange: (e) => setNote(e.target.value), "aria-label": "\u5907\u6CE8" }) : null,
    tooLong ? /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "kb-hint is-error", children: [
      "\u6807\u9898\u6700\u591A ",
      LIMITS.taskTitle,
      " \u4E2A\u5B57\u7B26"
    ] }) : null,
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "kb-edit-row", children: [
      !showNote ? /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("button", { type: "button", className: "kb-btn kb-btn-ghost kb-btn-sm", onClick: () => setShowNote(true), children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(NoteIcon, { size: 14 }),
        " \u5907\u6CE8"
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "kb-hint", children: "\u2318/Ctrl + Enter \u4FDD\u5B58" }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { type: "button", className: "kb-btn kb-btn-ghost kb-btn-sm", onClick: onCancel, children: "\u53D6\u6D88" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { type: "button", className: "kb-btn kb-btn-primary kb-btn-sm", disabled: trimmed === "" || tooLong, onClick: submit, children: submitLabel })
      ] })
    ] })
  ] });
}
function TaskCard({ project, task, index }) {
  const actions = useActions();
  const [editing, setEditing] = (0, import_react6.useState)(false);
  const [menuOpen, setMenuOpen] = (0, import_react6.useState)(false);
  const [dragging, setDragging] = (0, import_react6.useState)(false);
  const next = nextColumn(task.column);
  if (editing) {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
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
        next ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { type: "button", className: "kb-check", onClick: advance, "aria-label": `\u6807\u8BB0\u5B8C\u6210\uFF0C\u79FB\u5230\u300C${COLUMN_LABELS[next]}\u300D`, title: `\u6807\u8BB0\u5B8C\u6210 \u2192 ${COLUMN_LABELS[next]}`, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(CheckIcon, { size: 11 }) }) : /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "kb-check is-done", role: "img", "aria-label": "\u5DF2\u5B8C\u6210", title: "\u5DF2\u5B8C\u6210", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(CheckIcon, { size: 11 }) }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "kb-card-main", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: "kb-card-title", children: task.title }),
          task.note ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: "kb-card-note", children: task.note }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "kb-card-meta", children: meta })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "kb-card-actions" + (menuOpen ? " is-open" : ""), children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { type: "button", className: "kb-icon-btn", "aria-label": "\u7F16\u8F91\u4EFB\u52A1", title: "\u7F16\u8F91", onClick: () => setEditing(true), children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(PencilIcon, { size: 14 }) }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Menu, { label: "\u66F4\u591A\u64CD\u4F5C", onOpenChange: setMenuOpen, children: (close) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "kb-menu-label", children: "\u79FB\u52A8\u5230" }),
            COLUMNS.map((column) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
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
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(StatusIcon, { column }),
                  column === "todo" && task.column === "done" ? "\u91CD\u65B0\u6253\u5F00\uFF08\u5F85\u529E\uFF09" : COLUMN_LABELS[column]
                ]
              },
              column
            )),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "kb-menu-sep" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
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
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(TrashIcon, { size: 14 }),
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
  const [adding, setAdding] = (0, import_react6.useState)(false);
  const [drop, setDrop] = (0, import_react6.useState)(null);
  const listRef = (0, import_react6.useRef)(null);
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
  const line = /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "kb-drop-line", "aria-hidden": "true" });
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("section", { className: "kb-column" + (drop ? " is-drop" : ""), "data-column": column, "aria-label": `${project.name} \xB7 ${COLUMN_LABELS[column]}`, onDragOver, onDragLeave, onDrop, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("header", { className: "kb-column-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(StatusIcon, { column }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: COLUMN_LABELS[column] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "kb-count", children: tasks.length }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { type: "button", className: "kb-icon-btn", "aria-label": `\u5728\u300C${COLUMN_LABELS[column]}\u300D\u6DFB\u52A0\u4EFB\u52A1`, title: "\u6DFB\u52A0\u4EFB\u52A1", onClick: () => setAdding(true), children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(PlusIcon, { size: 15 }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "kb-cards", ref: listRef, children: [
      tasks.map((task, index) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(FragmentWithLine, { show: drop !== null && drop.before === task.id && draggedId !== task.id, line, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(TaskCard, { project, task, index }) }, task.id)),
      drop !== null && drop.before === null && tasks.length > 0 ? line : null,
      tasks.length === 0 && !adding ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "kb-placeholder", children: drop ? "\u653E\u5230\u8FD9\u91CC" : EMPTY_HINTS[column] }) : null,
      adding ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
    !adding ? /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("button", { type: "button", className: "kb-add-task", onClick: () => setAdding(true), children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(PlusIcon, { size: 14 }),
      " \u6DFB\u52A0\u4EFB\u52A1"
    ] }) : null
  ] });
}
function FragmentWithLine({ show, line, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
    show ? line : null,
    children
  ] });
}
function deleteBody(tasks, recorded) {
  const parts = [tasks > 0 ? `${tasks} \u4E2A\u4EFB\u52A1` : "", recorded > 0 ? `${recorded} \u6761\u6570\u636E\u4E0E\u7ED3\u679C\u8BB0\u5F55` : ""].filter((part) => part !== "");
  return parts.length > 0 ? `\u9879\u76EE\u4E2D\u7684${parts.join("\u548C")}\u4F1A\u4E00\u8D77\u5220\u9664\uFF0C\u6B64\u64CD\u4F5C\u4E0D\u80FD\u64A4\u9500\u3002` : "\u6B64\u64CD\u4F5C\u4E0D\u80FD\u64A4\u9500\u3002";
}
function ProjectSection({ project, index, total }) {
  const actions = useActions();
  const [renaming, setRenaming] = (0, import_react6.useState)(false);
  const [name, setName] = (0, import_react6.useState)(project.name);
  const counts = columnCounts(project);
  const total_ = project.tasks.length;
  const percent = total_ === 0 ? 0 : Math.round(counts.done / total_ * 100);
  const recordTotals = recordCounts(recordsOf(project));
  const recorded = recordTotals.data + recordTotals.results;
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
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("article", { className: "kb-project" + (project.collapsed ? " is-collapsed" : ""), style: { ["--kb-accent"]: COLOR_VALUES[project.color] }, "aria-label": `\u9879\u76EE ${project.name}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("header", { className: "kb-project-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { type: "button", className: "kb-icon-btn", "aria-label": project.collapsed ? "\u5C55\u5F00\u9879\u76EE" : "\u6536\u8D77\u9879\u76EE", "aria-expanded": !project.collapsed, onClick: toggle, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(ChevronIcon, { className: "kb-collapse" }) }),
      renaming ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
      ) : /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        "h2",
        {
          className: "kb-project-name",
          title: "\u6253\u5F00\u6570\u636E\u4E0E\u7ED3\u679C",
          role: "button",
          tabIndex: 0,
          "aria-label": `${project.name}\uFF08\u6309 Enter \u6253\u5F00\u6570\u636E\u4E0E\u7ED3\u679C\uFF09`,
          onClick: () => actions.openProject(project.id),
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              actions.openProject(project.id);
            }
          },
          children: project.name
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "kb-chips", "aria-hidden": "true", children: COLUMNS.map((column) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "kb-chip", style: { ["--c"]: `var(--kb-c-${column})` }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("i", {}),
        COLUMN_LABELS[column],
        " ",
        counts[column]
      ] }, column)) }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("button", { type: "button", className: "kb-btn kb-btn-sm kb-open-records", title: "\u6253\u5F00\u8FD9\u4E2A\u9879\u76EE\u7684\u6570\u636E\u4E0E\u7ED3\u679C", onClick: () => actions.openProject(project.id), children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(RecordsIcon, { size: 14 }),
        " \u6570\u636E\u4E0E\u7ED3\u679C",
        recorded > 0 ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "kb-count", children: recorded }) : null
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "kb-progress", title: `${counts.done}/${total_} \u5DF2\u5B8C\u6210`, children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "kb-progress-bar", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": percent, "aria-label": "\u5B8C\u6210\u8FDB\u5EA6", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: { width: `${percent}%` } }) }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { children: [
          percent,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Menu, { label: "\u9879\u76EE\u64CD\u4F5C", children: (close) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
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
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(PencilIcon, { size: 14 }),
              " \u91CD\u547D\u540D"
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "kb-menu-label", children: "\u989C\u8272" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "kb-swatches", role: "group", "aria-label": "\u9879\u76EE\u989C\u8272", children: PROJECT_COLORS.map((color) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "kb-menu-sep" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
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
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(ArrowUpIcon, { size: 14 }),
              " \u4E0A\u79FB"
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
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
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(ArrowDownIcon, { size: 14 }),
              " \u4E0B\u79FB"
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "kb-menu-sep" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
          "button",
          {
            type: "button",
            role: "menuitem",
            className: "kb-menu-item is-danger",
            onClick: () => {
              close();
              actions.confirm({
                title: `\u5220\u9664\u9879\u76EE\u300C${project.name}\u300D\uFF1F`,
                body: deleteBody(total_, recorded),
                confirmLabel: "\u5220\u9664\u9879\u76EE",
                onConfirm: () => {
                  if (actions.dispatch({ type: "project.delete", projectId: project.id })) actions.toast(`\u5DF2\u5220\u9664\u9879\u76EE\u300C${project.name}\u300D`);
                }
              });
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(TrashIcon, { size: 14 }),
              " \u5220\u9664\u9879\u76EE"
            ]
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "kb-project-body", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "kb-columns", children: COLUMNS.map((column) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Column, { project, column }, column)) }) })
  ] });
}
function NewProjectForm({ onDone, autoColor }) {
  const actions = useActions();
  const [name, setName] = (0, import_react6.useState)("");
  const [color, setColor] = (0, import_react6.useState)(autoColor);
  const trimmed = name.trim();
  const submit = () => {
    if (trimmed === "") return;
    if (actions.dispatch({ type: "project.add", id: newId("p"), name: trimmed, color })) onDone();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "kb-new-project", role: "group", "aria-label": "\u65B0\u5EFA\u9879\u76EE", children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "kb-swatches", role: "radiogroup", "aria-label": "\u9879\u76EE\u989C\u8272", children: PROJECT_COLORS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { type: "button", className: "kb-btn kb-btn-ghost", onClick: onDone, children: "\u53D6\u6D88" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { type: "button", className: "kb-btn kb-btn-primary", disabled: trimmed === "", onClick: submit, children: "\u521B\u5EFA\u9879\u76EE" })
  ] });
}
function ConfirmDialog({ title, body, confirmLabel, onConfirm, onClose }) {
  const box = (0, import_react6.useRef)(null);
  const closeRef = (0, import_react6.useRef)(onClose);
  closeRef.current = onClose;
  (0, import_react6.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "kb-overlay", onPointerDown: (e) => e.target === e.currentTarget && onClose(), children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "kb-dialog", role: "alertdialog", "aria-modal": "true", "aria-labelledby": "kb-dialog-title", "aria-describedby": "kb-dialog-body", ref: box, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h3", { id: "kb-dialog-title", children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { id: "kb-dialog-body", children: body }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "kb-dialog-actions", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { type: "button", className: "kb-btn", onClick: onClose, children: "\u53D6\u6D88" }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("p", { className: "kb-subtitle", children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { children: board.projects.length }),
      " \u4E2A\u9879\u76EE"
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { children: tasks }),
      " \u4E2A\u4EFB\u52A1"
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { children: doing }),
      " \u8FDB\u884C\u4E2D"
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { children: done }),
      " \u5DF2\u5B8C\u6210"
    ] })
  ] });
}
var navigation = { projectId: null };
function KanbanView({ sync }) {
  const snapshot = (0, import_react6.useSyncExternalStore)(sync.subscribe, sync.getSnapshot);
  const { board, status } = snapshot;
  const [creating, setCreating] = (0, import_react6.useState)(false);
  const [openId, setOpenId] = (0, import_react6.useState)(() => navigation.projectId);
  const scroller = (0, import_react6.useRef)(null);
  const [toasts, setToasts] = (0, import_react6.useState)([]);
  const [landedId, setLandedId] = (0, import_react6.useState)(null);
  const [dialog, setDialog] = (0, import_react6.useState)(null);
  const drag = (0, import_react6.useRef)(null);
  const toastSeq = (0, import_react6.useRef)(0);
  const landTimer = (0, import_react6.useRef)();
  const dismiss = (0, import_react6.useCallback)((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);
  const toast = (0, import_react6.useCallback)(
    (text, options = {}) => {
      toastSeq.current += 1;
      const id = toastSeq.current;
      setToasts((list) => [...list.slice(-2), { id, text, ...options }]);
      setTimeout(() => dismiss(id), options.action ? 6e3 : 3500);
    },
    [dismiss]
  );
  const land = (0, import_react6.useCallback)((taskId) => {
    setLandedId(taskId);
    if (landTimer.current) clearTimeout(landTimer.current);
    landTimer.current = setTimeout(() => setLandedId(null), 900);
  }, []);
  (0, import_react6.useEffect)(() => {
    refusedSink.current = (reason) => toast(reason, { tone: "error" });
    return () => {
      refusedSink.current = null;
    };
  }, [toast]);
  (0, import_react6.useEffect)(() => {
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
  const openProject = (0, import_react6.useCallback)((id) => {
    navigation.projectId = id;
    setOpenId(id);
  }, []);
  const actions = (0, import_react6.useMemo)(
    () => ({
      dispatch: (op) => sync.dispatch(op),
      toast,
      land,
      landedId,
      drag,
      confirm: setDialog,
      openProject
    }),
    [sync, toast, land, landedId, openProject]
  );
  const autoColor = PROJECT_COLORS[board.projects.length % PROJECT_COLORS.length];
  const ready = status !== "loading" && status !== "load-failed";
  const page = ready && openId !== null ? board.projects.find((project) => project.id === openId) : void 0;
  (0, import_react6.useEffect)(() => {
    if (ready && openId !== null && page === void 0) openProject(null);
  }, [ready, openId, page, openProject]);
  (0, import_react6.useEffect)(() => {
    scroller.current?.scrollTo?.({ top: 0 });
  }, [page?.id]);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Actions.Provider, { value: actions, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "kb-root", children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "kb-scroll", ref: scroller, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "kb-inner", children: [
      page ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(RecordsPage, { project: page, status, onBack: () => openProject(null) }, page.id) : null,
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "kb-header", hidden: page !== void 0, children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("h1", { className: "kb-title", children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "kb-title-mark", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(BoardIcon, { size: 18 }) }),
            "\u9879\u76EE\u770B\u677F"
          ] }),
          ready ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Stats, { board }) : null
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "kb-header-actions", children: [
          ready ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(SaveStatus, { status }) : null,
          ready && board.projects.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("button", { type: "button", className: "kb-btn kb-btn-primary", onClick: () => setCreating(true), disabled: creating, children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(PlusIcon, { size: 15 }),
            " \u65B0\u5EFA\u9879\u76EE"
          ] }) : null
        ] })
      ] }),
      page ? null : status === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "kb-loading", "aria-busy": "true", "aria-label": "\u52A0\u8F7D\u4E2D", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "kb-skeleton" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "kb-skeleton" })
      ] }) : status === "load-failed" ? /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "kb-error", role: "alert", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(AlertIcon, { size: 28 }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("strong", { children: "\u65E0\u6CD5\u52A0\u8F7D\u770B\u677F" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "kb-hint", children: [
          snapshot.error ?? "\u5BBF\u4E3B\u670D\u52A1\u6CA1\u6709\u54CD\u5E94",
          "\u3002\u8BF7\u786E\u8BA4\u63D2\u4EF6\u5DF2\u542F\u7528\uFF0C\u7136\u540E\u91CD\u8BD5\u3002"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { type: "button", className: "kb-btn", onClick: () => void sync.load(), children: "\u91CD\u8BD5" })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
        creating ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(NewProjectForm, { autoColor, onDone: () => setCreating(false) }) : null,
        board.projects.length === 0 && !creating ? /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "kb-empty", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(EmptyIllustration, {}),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h2", { children: "\u8FD8\u6CA1\u6709\u9879\u76EE" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { children: "\u4E3A\u6BCF\u4E2A\u9879\u76EE\u5EFA\u4E00\u4E2A\u5206\u533A\uFF0C\u4EFB\u52A1\u6309\u4E0B\u9762\u7684\u987A\u5E8F\u6D41\u8F6C\u3002\u70B9\u4EFB\u52A1\u5DE6\u4FA7\u7684\u5706\u5708\u5373\u53EF\u5B8C\u6210\u5F53\u524D\u9636\u6BB5\uFF0C\u8FDB\u5165\u4E0B\u4E00\u5217\u3002" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "kb-empty-flow", "aria-hidden": "true", children: COLUMNS.map((column, i) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { style: { display: "inline-flex", alignItems: "center", gap: 6 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "kb-chip", style: { ["--c"]: `var(--kb-c-${column})` }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("i", {}),
              COLUMN_LABELS[column]
            ] }),
            i < COLUMNS.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(ArrowRightIcon, { size: 13 }) : null
          ] }, column)) }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("button", { type: "button", className: "kb-btn kb-btn-primary", onClick: () => setCreating(true), children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(PlusIcon, { size: 15 }),
            " \u65B0\u5EFA\u7B2C\u4E00\u4E2A\u9879\u76EE"
          ] })
        ] }) : null,
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "kb-projects", children: board.projects.map((project, index) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(ProjectSection, { project, index, total: board.projects.length }, project.id)) })
      ] })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "kb-toasts", "aria-live": "polite", children: toasts.map((t) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "kb-toast" + (t.tone === "error" ? " is-error" : ""), role: t.tone === "error" ? "alert" : "status", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: t.text }),
      t.action ? /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
        "button",
        {
          type: "button",
          className: "kb-btn kb-btn-sm",
          onClick: () => {
            t.action.run();
            dismiss(t.id);
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(UndoIcon, { size: 13 }),
            " ",
            t.action.label
          ]
        }
      ) : null,
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { type: "button", className: "kb-icon-btn", "aria-label": "\u5173\u95ED\u63D0\u793A", onClick: () => dismiss(t.id), children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(CloseIcon, { size: 13 }) })
    ] }, t.id)) }),
    dialog ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(ConfirmDialog, { ...dialog, onClose: () => setDialog(null) }) : null
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
  /* The counts (\u{1F517} 2, \u21C6 1) push the names out of the row and over the right node; the filled nodes and the card say the same. */
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
`;
function ensureStyles() {
  if (typeof document === "undefined") return;
  for (const other of Array.from(document.querySelectorAll('style[id^="dsh-project-kanban"]'))) if (other.id !== STYLE_ID) other.remove();
  const existing = document.getElementById(STYLE_ID);
  if (existing !== null) {
    if (existing.textContent !== CSS) existing.textContent = CSS;
    return;
  }
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
var import_jsx_runtime7 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "kb-entry", "data-active": String(Boolean(props.active)), children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(BoardIcon, { size: props.size ?? 16 }) });
}
function apply(ctx) {
  try {
    ensureStyles();
  } catch (error) {
    report("stylesheet", error);
  }
  const sync = new BoardSync({ onRefused: (reason) => refusedSink.current?.(reason) });
  const Board = () => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(KanbanView, { sync });
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

