# Rewrite Session Automation Design

状态日期：2026-04-23  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

为当前规则族 rewrite 流程补一套“自动切上下文”脚本：当前规则族完成后，先生成 handoff，再调用本机 `codex` CLI 自动开启下一会话，让新会话从固定文档和 handoff 文件恢复上下文，而不是继续依赖单个超长聊天线程。

## 范围

包含：

- 生成 handoff 文件
- 生成下一会话 prompt 文件
- 从 inventory 文档解析下一个 `pending_wave_*` family
- 调用本机 `codex` CLI 启动下一会话
- 提供单独的兜底命令，在自动启动失败时重试下一会话

不包含：

- 自动跑测试
- 自动提交当前规则族改动
- 自动修改 inventory 或任务状态文档

## 设计原则

### 1. 先落盘，再切会话

即使目标是自动启动下一会话，也必须先生成 handoff。  
这样自动启动失败时仍有稳定的外部上下文入口。

### 2. 切上下文脚本不判断“业务是否完成”

脚本只负责交接和启动，不替代当前人工验收流程。  
也就是说，调用脚本前，用户自己要先保证当前规则族已经完成并提交。

### 3. 下一个规则族只从 inventory 推导

不从聊天上下文或脚本参数里猜“下一规则族”。  
唯一来源是：

- `docs/2026-04-22-tailwind3-full-rule-family-inventory.md`

脚本只取第一个 `pending_wave_*` family 作为下一项。

### 4. 允许固定本地脏文件，但不忽略未知脏改动

当前仓库长期存在两处用户本地修改：

- `.vscode/settings.json`
- `fixtures/ide-eslint/src/demo.jsx`

脚本会把它们写进 handoff，但对其他未知未提交改动保持可见，并在 handoff 中列出。

## 目标结构

### 1. helper 模块

新增：

- `scripts/rewrite-session.mjs`

职责：

- 解析 inventory
- 生成 handoff / prompt 内容
- 生成 handoff / prompt / latest state 路径
- 过滤允许的本地脏文件

### 2. CLI 入口

新增：

- `scripts/rewrite-finish-family.mjs`
- `scripts/rewrite-next-family.mjs`

职责：

- `rewrite-finish-family.mjs`
  - 接收刚完成的 family
  - 校验 inventory 已经把它标为完成
  - 生成 handoff / prompt / latest state
  - 自动启动下一会话
- `rewrite-next-family.mjs`
  - 读取 `docs/handoffs/latest.json`
  - 重新启动下一会话

### 3. 包管理脚本

在 `package.json` 中新增：

- `rewrite:finish-family`
- `rewrite:next-family`

### 4. handoff 目录

运行时输出目录：

- `docs/handoffs/`

至少包含：

- `YYYY-MM-DD-<completed>-to-<next>-handoff.md`
- `YYYY-MM-DD-<completed>-to-<next>-prompt.txt`
- `latest.json`

## 验收标准

实现完成后应满足：

- `package.json` 中存在两条 rewrite automation 命令
- helper 模块能从 inventory 解析出已完成和待处理 family
- handoff 文件包含当前分支、当前 HEAD、完成项、下一项、必读文档、验证命令和本地脏文件说明
- prompt 文件包含中文、禁用 sub agent、读取 handoff 和固定文档的上下文说明
- `rewrite-next-family` 可以根据 `latest.json` 重启下一会话
