# 让别的对话来整理「数据与结果」（Agent 接口）

任何一个对话（或脚本）都可以不经过页面，直接读写某个项目的**数据树、结果树和连线**，效果和手在页面上点一样。改动立即存进看板；页面在下次打开项目页（或从别的面板切回看板）时显示。

> **给用户的一句话**（复制后把方括号里的换成自己的）：
>
> 整理看板里项目「**项目名**」的数据和结果：先读 `~/dsh-plugins/dsh-project-kanban/docs/AGENT.md`，然后分析 `项目文件夹路径`，把关键数据按「简单名字（完整路径（一句话描述））」记下来，把图表和结论记成结果，按分析步骤或章节分组，再把每个结果连到它来自的数据。只添加和补充，不要删除或移动我已经记的内容；拿不准的连线先别连，列出来问我。

## 接口（本机，无需登录）

地址 = 会话上下文里写的 **Web GUI URL**（形如 `http://127.0.0.1:55924`，DSH 每次启动端口会变）+ 路径。不在 DSH 会话里时：`lsof -nP -iTCP -sTCP:LISTEN | grep -i deepseek` 可以看到当前端口。

| 请求 | 作用 |
|---|---|
| `GET  /project-kanban/board` | 整个看板：`{ok, value:{revision, projects:[{id, name, tasks, records?}]}}`。`records` 在项目还没记过东西时不存在 |
| `POST /project-kanban/ops` | 请求体 `{"ops":[…]}`，**按顺序**执行；返回 `{ok, value:<新的整个看板>, refused:[{index, reason}]}`。被拒绝的操作被跳过，不影响其它；一次最多 200 个操作、约 500KB |

**不要直接改 `~/.dsh/project-kanban/board.json`**：插件进程把它缓存在内存里，下次保存时会覆盖你的改动。

## 数据长什么样

`project.records = { data: [节点…], results: [节点…], links: [连线…] }`。

节点：`{ id, name, path, description, parentId, collapsed, createdAt, updatedAt, starred?, category? }`（`starred: true` 表示用户标了星标；`category` 是节点类别的 id；这两个没用过就不出现）

| 字段 | 含义 | 限制 |
|---|---|---|
| `name` | **简单名字**，树里只显示它 | 必填，≤ 80 字 |
| `path` | **完整路径**（数据：绝对路径；结果：图表文件或位置）；没有就留空 | ≤ 1000 字，单行 |
| `description` | **描述**：它是什么、怎么来的、规模或关键参数，一两句话 | ≤ 4000 字 |
| `parentId` | 上级节点的 id（同一棵树里）；`null` = 最上层 | 层级最多 12 层 |

- **没有「分组」类型**：只写了 `name` 的节点就是章节（分组），把别的节点的 `parentId` 设成它即可。
- 连线：`{ id, dataId, resultId, category? }`，表示「这个结果来自这份数据」；多对多，一对节点只能连一条。分组节点也可以连线（代表整组）。
- 结果之间的连线 `project.records.relations`：`{ id, fromId, toId, directed?: true, category? }`，两端都是结果节点；默认无向，`directed: true` 时从 `fromId` 指向 `toId`；同一对结果只能有一条（不分方向），不能连自己。没有时这个字段不存在。
- 颜色 `project.records.palette`：`{ nodeCategories: [{id, name, color}], edgeCategories: [...], defaults?: {node?, edge?, star?} }`，颜色是 `#rrggbb`。类别是用户自己定的，**你不需要建类别**；用户让你用某个类别时，先在这里查它的 id。
- 星标的含义：用户觉得重要。连到星标节点的线在页面上是浅红色。
- 每棵树最多 2000 个节点，最多 5000 条连线、5000 条结果间连线；每种类别最多 40 个。
- **`id`**：`[A-Za-z0-9_-]` 1–40 个字符，**数据树和结果树里不能重复**；连线的 id 自成一套。

## 操作（ops）

每个操作都带 `projectId`（看板里项目的 `id`，形如 `p_14595i51490x`）。

| `type` | 字段 | 说明 |
|---|---|---|
| `node.add` | `side`(`"data"`/`"result"`), `id`, `name`, `path?`, `description?`, `parentId?`, `beforeId?`, `starred?`, `category?` | 新增节点，默认放在 `parentId` 下最后；`beforeId` 是同一个父节点下的另一个兄弟，则插在它前面。**父节点要先存在** |
| `node.update` | `nodeId`, `name?`, `path?`, `description?`, `collapsed?`, `starred?`, `category?` | 只改给了的字段；`category: null` 清除类别 |
| `node.move` | `nodeId`, `parentId`(`null`=最上层), `beforeId?` | 移动，整棵子树一起走；不能移进自己的下级 |
| `node.delete` | `nodeId`, `lift?` | 删除节点**和它的整棵子树**以及相关连线；`lift: true` 只删它自己，子节点上移 |
| `link.add` | `id`, `dataId`, `resultId`, `category?` | 连线；数据端必须在数据树，结果端必须在结果树 |
| `link.update` | `linkId`, `category` | 设置连线类别（`null` = 默认） |
| `link.delete` | `linkId` | 删连线 |
| `relation.add` | `id`, `fromId`, `toId`, `directed?`, `category?` | 连接两个结果；默认无向 |
| `relation.update` | `relationId`, `directed?`, `reverse?`, `category?` | `reverse: true` 交换两端 |
| `relation.delete` | `relationId` | 删结果间的连线 |
| `category.add` / `category.update` / `category.delete` | `kind`(`"node"`/`"edge"`), `id` / `categoryId`, `name`, `color` | 类别；删除时用了它的回到默认 |
| `palette.update` | `node?`, `edge?`, `star?` | 默认颜色（`#rrggbb`，`null` = 恢复内置） |

被拒绝时 `reason` 会说明原因，常见的有：`节点已存在`、`连线已存在`（重复写入，正常）、`上级节点不存在`（父节点还没建或被拒了）、`类别不存在`、`项目不存在`。

## 推荐流程

1. **确认项目**：`GET` 看板，按名字找到项目的 `id`。如果它已经有 `records`，先读一遍：已有的章节和节点直接沿用，不要再建一份。
2. **读项目**：README、脚本、流程文件（Snakemake / Nextflow / Makefile）、日志、目录结构。弄清楚输入数据、最终数据、每个结果（图、表、结论）是由哪个脚本从哪些数据生成的。
3. **先想好结构**：按分析步骤或论文章节分组；只记**以后会回头找的**关键数据和结果，不要把每个文件都记上（一般每组 3–15 条）。
4. **写入**：先建章节，再建节点，最后连线；一次请求不超过 150 个操作。
5. **检查 `refused`**：`节点已存在 / 连线已存在` 说明之前记过，没问题；其它原因要处理（比如父节点没建成）。
6. **汇报**：再 `GET` 一次，告诉用户新增了多少数据、结果、连线，**哪些连线是推断的、依据是什么**。

### 让重跑不产生重复：用确定的 id

用路径（或章节名）算出 id，同一个东西每次得到同一个 id，重跑时重复的操作只会被拒绝为「已存在」，不会多出一份。

```python
import json, hashlib, urllib.request

BASE = "http://127.0.0.1:55924"      # ← 换成会话上下文里的 Web GUI URL
PROJECT = "项目名"                    # ← 看板里的项目名

def api(path, body=None):
    req = urllib.request.Request(BASE + path, headers={"content-type": "application/json"},
                                 data=None if body is None else json.dumps(body).encode())
    return json.load(urllib.request.urlopen(req))

def sid(prefix, key):                 # 同一个 key 永远得到同一个 id（≤ 40 字符）
    return prefix + "_" + hashlib.sha1(key.encode()).hexdigest()[:12]

project = next(p for p in api("/project-kanban/board")["value"]["projects"] if p["name"] == PROJECT)
pid, ops = project["id"], []

def node(side, key, name, parent=None, path="", desc=""):
    nid = sid("d" if side == "data" else "r", key)      # key：路径；章节用章节名
    ops.append({"type": "node.add", "projectId": pid, "side": side, "id": nid,
                "name": name, "path": path, "description": desc, "parentId": parent})
    return nid

def link(data_id, result_id):
    ops.append({"type": "link.add", "projectId": pid, "id": sid("l", data_id + result_id),
                "dataId": data_id, "resultId": result_id})

# ---- 在这里按分析结果填：先章节，再数据/结果，最后连线 ----
qc = node("data", "章节:数据质控", "第 2 章 · 数据质控")
raw = node("data", "/data/raw.h5ad", "原始计数矩阵", qc, "/data/raw.h5ad", "10x 原始计数，48,213 个细胞")
fig = node("result", "/out/fig1.pdf", "图 1  QC 小提琴图", None, "/out/fig1.pdf", "由 scripts/qc_plot.R 读取 raw.h5ad 生成")
link(raw, fig)
# ----------------------------------------------------------

for i in range(0, len(ops), 150):                      # 一次最多 150 个
    for r in api("/project-kanban/ops", {"ops": ops[i:i + 150]})["refused"]:
        if "已存在" not in r["reason"]:
            print("refused:", ops[i + r["index"]], r["reason"])
```

没有 Python 时用 curl：把 `{"ops":[…]}` 写进文件，再 `curl -s -X POST $BASE/project-kanban/ops -H 'content-type: application/json' -d @ops.json`。

## 规矩

- **只添加**。除非用户明确要求，不要删除、移动、改名用户已经记的节点，也不要动任务（看板卡片，同一个接口里的 `task.*` 操作）。页面里的 ⌘Z 只撤销用户在页面里做的动作，不会撤销你通过接口写的内容。`node.update` 只用来补空白字段，或者改你自己建的节点。
- **星标和颜色是用户的判断**：不要自己加星标、建类别或改颜色，除非用户明确要求（比如「把最重要的几个结果标上星标」）；那时再按要求用 `starred: true` / 已有类别的 id。
- **路径要真实**：写进 `path` 的必须是你确认存在的文件或目录（`ls` 一下），不要凭印象编。
- **连线要有依据**：脚本里的读写关系、流程文件、日志或文件名对应。拿不准的不连，列出来问用户；依据写进结果的 `description`。
- 描述写事实（是什么、来自哪、规模、关键参数），不写评价。
- 默认的 `workspace-write` 会话也能调用这个接口（DSH 的沙箱只限制文件读写，不限制网络）；如果工具审批弹出来，批准一次即可。
