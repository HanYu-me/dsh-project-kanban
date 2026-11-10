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
var RECORD_SIDES = ["data", "result"];
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
  const name2 = cleanLine(op.name, RECORD_LIMITS.name);
  if (name2 === void 0) return bad(`\u540D\u79F0\u9700\u4E3A 1\u2013${RECORD_LIMITS.name} \u4E2A\u5B57\u7B26`);
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
    name: name2,
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
    const name2 = cleanLine(op.name, RECORD_LIMITS.name);
    if (name2 === void 0) return bad(`\u540D\u79F0\u9700\u4E3A 1\u2013${RECORD_LIMITS.name} \u4E2A\u5B57\u7B26`);
    patch.name = name2;
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
  const name2 = cleanLine(op.name, RECORD_LIMITS.categoryName);
  if (name2 === void 0) return bad(`\u7C7B\u522B\u540D\u79F0\u9700\u4E3A 1\u2013${RECORD_LIMITS.categoryName} \u4E2A\u5B57\u7B26`);
  const color = cleanColor(op.color);
  if (color === void 0) return bad("\u989C\u8272\u9700\u8981\u662F #RRGGBB");
  const list = op.kind === "node" ? palette.nodeCategories : palette.edgeCategories;
  if (list.length >= RECORD_LIMITS.categories) return bad(`\u7C7B\u522B\u6570\u91CF\u5DF2\u8FBE\u4E0A\u9650\uFF08${RECORD_LIMITS.categories}\uFF09`);
  const at = typeof op.index === "number" && Number.isInteger(op.index) ? Math.max(0, Math.min(list.length, op.index)) : list.length;
  const next = list.slice();
  next.splice(at, 0, { id: op.id, name: name2, color });
  return { ok: true, records: withPalette(records, op.kind === "node" ? { ...palette, nodeCategories: next } : { ...palette, edgeCategories: next }) };
}
function updateCategory(records, op) {
  if (op.kind !== "node" && op.kind !== "edge") return bad("\u7C7B\u522B\u79CD\u7C7B\u65E0\u6548");
  const palette = paletteOf(records);
  const list = op.kind === "node" ? palette.nodeCategories : palette.edgeCategories;
  const found = typeof op.categoryId === "string" ? list.find((category) => category.id === op.categoryId) : void 0;
  if (!found) return bad("\u7C7B\u522B\u4E0D\u5B58\u5728");
  let name2 = found.name;
  let color = found.color;
  if (op.name !== void 0) {
    const cleaned = cleanLine(op.name, RECORD_LIMITS.categoryName);
    if (cleaned === void 0) return bad(`\u7C7B\u522B\u540D\u79F0\u9700\u4E3A 1\u2013${RECORD_LIMITS.categoryName} \u4E2A\u5B57\u7B26`);
    name2 = cleaned;
  }
  if (op.color !== void 0) {
    const cleaned = cleanColor(op.color);
    if (cleaned === void 0) return bad("\u989C\u8272\u9700\u8981\u662F #RRGGBB");
    color = cleaned;
  }
  if (name2 === found.name && color === found.color) return { ok: true, records };
  const next = list.map((category) => category.id === found.id ? { ...category, name: name2, color } : category);
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
  const name2 = cleanLine(raw.name, RECORD_LIMITS.name);
  const path = raw.path === void 0 ? "" : cleanPath(raw.path, RECORD_LIMITS.path);
  const description = raw.description === void 0 ? "" : cleanText(raw.description, RECORD_LIMITS.description);
  if (name2 === void 0 || path === void 0 || description === void 0) return void 0;
  const parentId = raw.parentId === null || raw.parentId === void 0 ? null : validId(raw.parentId) ? raw.parentId : void 0;
  if (parentId === void 0) return void 0;
  const createdAt = typeof raw.createdAt === "string" ? raw.createdAt : nowIso();
  const node = { id: raw.id, name: name2, path, description, parentId, collapsed: raw.collapsed === true, createdAt, updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : createdAt };
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
    const name2 = cleanLine(raw.name, RECORD_LIMITS.categoryName);
    const color = cleanColor(raw.color);
    if (name2 === void 0 || color === void 0) continue;
    if (out.length >= RECORD_LIMITS.categories) break;
    seen.add(raw.id);
    out.push({ id: raw.id, name: name2, color });
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
    const records = sanitizeRecords(p.records);
    board.projects.push({
      id: p.id,
      name: name2,
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
  EMPTY_RECORDS,
  ID_PATTERN,
  KANBAN_PREFIX,
  LIMITS,
  MAX_BODY_BYTES,
  MAX_OPS_PER_REQUEST,
  OPS_ENDPOINT,
  PROJECT_COLORS,
  RECORD_LIMITS,
  RECORD_SIDES,
  apply,
  applyOp,
  applyOps,
  applyRecordOp,
  categoriesOf,
  childrenOf,
  cleanColor,
  cleanLine,
  cleanNote,
  columnCounts,
  createFileStore,
  createMemoryStore,
  defaultBoardPath,
  emptyBoard,
  heightBelow,
  inPreorder,
  indexNodes,
  inject,
  isColor,
  isColumn,
  isInSubtree,
  isSide,
  levelOf,
  listOf,
  name,
  newId,
  nextColumn,
  pairKey,
  recordCounts,
  recordsOf,
  relationsOf,
  sanitizeBoard,
  sanitizeLink,
  sanitizeNode,
  sanitizeRecords,
  sanitizeRelation,
  sanitizeTask,
  serveKanban,
  subtreeIds,
  tasksIn
};
