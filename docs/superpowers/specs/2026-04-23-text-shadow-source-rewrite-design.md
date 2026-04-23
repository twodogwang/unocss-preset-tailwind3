# Text Shadow Source Rewrite Design

状态日期：2026-04-23  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `text-shadow` 从当前 `src/_rules/typography.ts` 的仓库扩展中拆出，纳入 source rewrite 模板：shared fixture、runtime/parity、utility spec、blocklist 治理、独立过程文档，以及总表同步。

本轮目标不是把 `text-shadow*` 收紧成某个 Tailwind 3 官方子集，而是明确：

- Tailwind CSS 3 没有原生 `text-shadow*` utility family
- preset-tailwind3 不再放行旧 `text-shadow*` 与 `text-shadow-color*` runtime
- 只有极少数可确定的旧写法提供 arbitrary property 迁移提示

## 范围

包含：

- `text-shadow`
- `text-shadow-none`
- `text-shadow-sm`
- `text-shadow-md`
- `text-shadow-lg`
- `text-shadow-xl`
- `text-shadow-red-500`
- `text-shadow-[#fff]`
- `text-shadow-[0_0_#000]`
- `text-shadow-[0_0_10px_var(--x)]`
- `text-shadow-color-red-500`
- `text-shadow-color-[#fff]`
- `text-shadow-color-opacity-50`
- `text-shadow-color-op50`
- `text-shadow` 相关高置信度 blocklist migration

不包含：

- arbitrary property `[text-shadow:...]`
- `text-stroke`
- `line-clamp`

## 当前现状

当前实现位于 [src/_rules/typography.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/typography.ts)：

- 旧实现通过 `^text-shadow(?:-(.+))?$` 放行 theme key 与 arbitrary value
- 同时通过 `^text-shadow-color-(.+)$` 与 `^text-shadow-color-op(?:acity)?-?(.+)$` 放行颜色与 opacity 变体
- Tailwind 3.4 core plugins 中没有 `text-shadow` family
- Tailwind 3 只能通过 arbitrary property `[text-shadow:...]` 表达文本阴影

当前已知正式写法包括：

- 无原生 `text-shadow*` utility
- `[text-shadow:0_0_#000]`
- `[text-shadow:0_0_10px_var(--x)]`

当前已知必须拒绝或迁移的旧写法包括：

- `text-shadow`
- `text-shadow-none`
- `text-shadow-sm`
- `text-shadow-md`
- `text-shadow-lg`
- `text-shadow-xl`
- `text-shadow-red-500`
- `text-shadow-[#fff]`
- `text-shadow-[0_0_#000]`
- `text-shadow-[0_0_10px_var(--x)]`
- `text-shadow-color-red-500`
- `text-shadow-color-[#fff]`
- `text-shadow-color-opacity-50`
- `text-shadow-color-op50`

其中高置信度迁移覆盖：

- `text-shadow-none -> [text-shadow:0_0_#0000]`
- `text-shadow-[0_0_#000] -> [text-shadow:0_0_#000]`
- `text-shadow-[0_0_10px_var(--x)] -> [text-shadow:0_0_10px_var(--x)]`

## 设计原则

### 1. 整族从 runtime 中移除

`text-shadow*` 不是 Tailwind 3 原生 utility。  
本轮 canonical fixture 允许为空，目标是让 preset-tailwind3 与 Tailwind 3 保持一致，不继续保留仓库扩展兼容面。

### 2. 只迁移可稳定表达成单个 arbitrary property 的旧写法

仅对以下情况给 replacement：

- `none`
- 已经是完整 shadow value 的 arbitrary 旧写法

像 `text-shadow-sm`、`text-shadow-md`、`text-shadow-lg`、`text-shadow-xl` 这些 theme key，虽然理论上可展开成复杂值，但会把仓库主题细节硬编码进 blocklist replacement，而且多层阴影写法可读性很差；本轮不提供自动 replacement。  
`text-shadow-color*` 也不提供 replacement，因为它们原本依赖仓库私有变量链路，无法无损映射为单个稳定类名。

### 3. utility spec 显式记录“无官方 canonical”

为了让 `text-shadow` 进入统一治理链路，仍需要 utility spec / docs / verification；  
但 spec 要显式记录 canonical 为空，避免后续自动化把它误判成漏测。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-text-shadow-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-text-shadow-rewrite.ts)

### 2. runtime / parity

新增 `text-shadow` 专用测试入口：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. utility spec

在以下文件登记 `text-shadow` family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

### 4. blocklist

为这组新增 `text-shadow` 专用治理：

- [src/blocklist.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/blocklist.ts)
- [test/fixtures/blocklist-migration.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/blocklist-migration.ts)
- [test/preset-tailwind3-blocklist-messages.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-messages.test.ts)
- [test/preset-tailwind3-blocklist-prefix-audit.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-prefix-audit.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-23-text-shadow-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-text-shadow-source-rewrite-log.md)
- [docs/2026-04-23-text-shadow-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-text-shadow-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
