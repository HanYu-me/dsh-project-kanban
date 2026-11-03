# dsh-project-kanban · 项目看板

DeepSeek Harness (DSH) 插件：左侧边栏出现「项目看板」入口，点开后在主区域按项目分区管理任务。每个项目固定四列：**待办 → 进行中 → 待反馈 → 已完成**。

## 功能

- **侧边栏入口**：图标 + 「项目看板」，位于「插件市场」与「定时任务」之间。
- **按项目分区**：每个项目一个区块，显示各列计数和完成进度条；可折叠、重命名（点项目名）、换颜色、上移/下移、删除（需确认）。
- **添加**：新建项目（名称 + 颜色）；在任意列点「添加任务」或列头「＋」，输入标题（可加备注），回车保存并可连续录入。
- **完成即流转**：点任务左侧圆圈 = 完成当前阶段，任务移到右侧下一列的**最上方**，并有短暂高亮。已完成列的圆圈是静态的绿色勾，不会误触。
- **手动调整**：拖拽卡片到同一项目的任意列/位置；或用卡片「⋯」菜单「移动到」（含「重新打开（待办）」）。
- **编辑/删除**：卡片悬停出现编辑按钮（或双击卡片）；删除后底部提示可「撤销」。
- **空状态**：无项目时显示引导与流转说明；空列显示提示文案。
- **外观**：颜色/圆角/阴影全部取自 DSH 主题变量，自动跟随 DSH 的浅色/深色主题；按主区域宽度自适应（宽屏 4 列，中等 2×2，窄屏单列）。

## 需求假设（原需求中的待确认项）

| 待确认项 | 采用的假设 |
| --- | --- |
| 「个性化添加」的范围 | 添加/编辑/删除**项目**（名称、颜色）和**任务**（标题、可选备注）。**不含**自定义列、自定义字段——四列保持固定。 |
| 完成后「自动移动到下一项」 | 移到**右侧相邻列**（待办→进行中→待反馈→已完成），不是直接跳到已完成。 |
| 在「已完成」列再次点击 | 不做任何事（显示静态勾）。如需退回，用「⋯ → 移动到 / 重新打开」。 |
| 视觉风格 / 暗色 / 响应式 | 跟随 DSH 设计变量与主题（含暗色），按主区域宽度响应式布局。 |
| 数据存放位置 | 宿主机本地文件 `~/.dsh/project-kanban/board.json`（可用环境变量 `DSH_PROJECT_KANBAN_FILE` 改）。只在本机，无同步、无权限、无统计（未确认，不扩展）。 |

## 安装与运行

需要 Node ≥ 22.19。

```bash
cd ~/dsh-plugins/dsh-project-kanban
npm install
npm run build        # 生成 lib/index.js（宿主端）和 lib/client.js（浏览器端）
npm test             # 89 个测试
```

装入 DSH（链接方式，改代码后重新 build 即可）：

- 在 DSH 会话里让 Agent 调用 `plugin_manager install_bundle`，target 为 `link:/Users/yhan0/dsh-plugins/dsh-project-kanban`；或命令行 `dsh plugin --profile desktop add link:<本目录>`。
- 插件条目 id：`include:project-kanban`。停用/启用：`plugin_manager set_plugin include:project-kanban enabled=false/true`。
- 修改宿主端代码后需停用再启用（或重启 DSH）；修改浏览器端代码后刷新 DSH 页面即可。

## 结构

```
src/
  shared/board.ts      数据模型 + 所有操作（纯函数，宿主与浏览器共用）
  shared/protocol.ts   接口路径与请求/响应类型
  store.ts             board.json 读写（临时文件 + 重命名，坏文件自动另存）
  routes.ts            GET /project-kanban/board、POST /project-kanban/ops
  index.ts             宿主端入口：把路由挂到 DSH webServer
  client/index.tsx     浏览器端入口：注册 sidebar.panellist（入口）与 main（看板）
  client/sync.ts       乐观更新 + 有序批量保存 + 断线重试
  client/KanbanView.tsx 看板界面
  client/styles.ts     样式（DSH 主题变量）
  client/icons.tsx     SVG 图标
tests/                 board / host / sync / view 四组测试
```

### 数据一致性设计

- 每次改动都是一个「操作」（如 `task.advance`），浏览器先在本地应用（界面即时更新），再按顺序批量发给宿主；界面始终 =「宿主确认的看板 + 尚未确认的操作」重放，宿主回包后用宿主的看板重建，不做局部修补。
- 所有操作可安全重试：新增带浏览器生成的 id（重复会被拒绝）；`task.advance` 带「起始列」，任务已不在该列则拒绝，所以快速连点或网络重发**不会跳列、不会重复、不会丢失**。
- 一次请求最多 200 个操作且不超过约 384KB，超出自动分批；断线时操作保留在队列中，1s/2s/4s/8s/15s 退避重试，状态显示「未连接，稍后自动重试」。

## 协作说明

本插件由 Claude（架构、核心逻辑、界面）与 DeepSeek V4.1 Flash（DSH Agent Team 成员，编写测试与代码审查）协作完成；DeepSeek 审查发现的「离线积压超过 200 个操作会整批丢失」问题已修复，其复现测试现已通过。

## 安装

```bash
dsh plugin --profile web add github:HanYu-me/dsh-project-kanban
# 桌面版：dsh plugin --profile desktop add github:HanYu-me/dsh-project-kanban
```

需要 dsh `>= 0.2.0-rc.1 < 0.3.0`。装好后重启 dsh。也可以从 [Releases](https://github.com/HanYu-me/dsh-project-kanban/releases) 下载预构建的 `dsh-project-kanban.tgz`。

## 许可

[Apache-2.0](./LICENSE) © Yu Han
