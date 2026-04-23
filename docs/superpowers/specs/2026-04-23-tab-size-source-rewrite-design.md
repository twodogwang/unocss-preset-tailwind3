# Tab Size Source Rewrite Design

状态日期：2026-04-23  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `tab-size` 从当前 `src/_rules/typography.ts` 的仓库自带扩展中拆出，纳入 source rewrite 模板：shared fixture、runtime/parity、utility spec、blocklist migration 子集，以及独立的过程文档与总表同步。

本轮目标不是收紧到某个 Tailwind 3 官方子集，而是明确：

- Tailwind CSS 3 没有原生 `tab-*` utility family
- 现有 `tab-*` 应从 preset-tailwind3 中移除
- 高置信度旧写法迁移到 arbitrary property `[tab-size:...]`

## 范围

包含：

- `tab`
- `tab-1`
- `tab-4`
- `tab-8`
- `tab-[3]`
- `tab-[8]`
- `tab-[var(--n)]`
- `-tab-4`
- `tab-size-4`
- `tab-1/2`
- `tab-size` 相关高置信度 blocklist migration

不包含：

- arbitrary property `[tab-size:4]`
- `text-stroke`
- `text-shadow`

## 当前现状

当前实现位于 [src/_rules/typography.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/typography.ts)：

- 旧实现通过 `^tab(?:-(.+))?$` 放行 `tab`、`tab-4`、`tab-[8]` 等仓库自带扩展
- Tailwind 3.4 的 core plugins 中没有 `tabSize`
- Tailwind 3 只支持 arbitrary property `[tab-size:...]`，不支持 `tab-*`

当前已知正式写法包括：

- 无原生 `tab-*` utility
- `[tab-size:4]`
- `[tab-size:8]`
- `[tab-size:var(--n)]`

当前已知必须拒绝或迁移的旧写法包括：

- `tab`
- `tab-1`
- `tab-4`
- `tab-8`
- `tab-[3]`
- `tab-[8]`
- `tab-[var(--n)]`
- `-tab-4`
- `tab-size-4`
- `tab-1/2`

其中高置信度迁移覆盖：

- `tab -> [tab-size:4]`
- `tab-4 -> [tab-size:4]`
- `tab-8 -> [tab-size:8]`
- `tab-[8] -> [tab-size:8]`
- `tab-[var(--n)] -> [tab-size:var(--n)]`

## 设计原则

### 1. 明确移除整族，不伪造官方 canonical

`tab-*` 不是 Tailwind 3 原生 utility，因此本轮 canonical fixture 允许为空。  
本轮目标是把这组旧扩展彻底从 preset-tailwind3 runtime 中移除，而不是继续保留一个“看起来合理”的兼容子集。

### 2. 只提供高置信度迁移

只为能稳定映射到 arbitrary property 的旧写法提供 migration：

- bare `tab` 迁到 `[tab-size:4]`
- 数字值 `tab-4` / `tab-8`
- arbitrary 值 `tab-[8]` / `tab-[var(--n)]`

`-tab-4`、`tab-size-4`、`tab-1/2` 不提供 replacement，只保留为非法样例。

### 3. utility spec 显式记录“无官方 canonical”

为了把这一 family 纳入统一治理链路，仍需要 utility spec / docs / verification；  
但 spec 要显式记录 canonical 为空，避免后续自动化把它误判成漏测。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-tab-size-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-tab-size-rewrite.ts)

### 2. runtime / parity

新增 `tab-size` 专用测试入口：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. utility spec

在以下文件登记 `tab-size` family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

### 4. blocklist migration

为这组新增 `tab-size` 专用迁移子集：

- [src/blocklist.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/blocklist.ts)
- [test/fixtures/blocklist-migration.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/blocklist-migration.ts)
- [test/preset-tailwind3-blocklist-messages.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-messages.test.ts)
- [test/preset-tailwind3-blocklist-prefix-audit.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-prefix-audit.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-23-tab-size-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-tab-size-source-rewrite-log.md)
- [docs/2026-04-23-tab-size-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-tab-size-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
