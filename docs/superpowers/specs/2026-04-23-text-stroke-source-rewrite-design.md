# Text Stroke Source Rewrite Design

状态日期：2026-04-23  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `text-stroke` 从当前 `src/_rules/typography.ts` 的仓库扩展中拆出，纳入 source rewrite 模板：shared fixture、runtime/parity、utility spec、blocklist 治理、独立过程文档，以及总表同步。

本轮目标不是把 `text-stroke-*` 收紧成某个 Tailwind 3 官方子集，而是明确：

- Tailwind CSS 3 没有原生 `text-stroke*` utility family
- preset-tailwind3 不再放行旧 `text-stroke*` runtime
- 只有高置信度旧写法提供 arbitrary property 迁移提示

## 范围

包含：

- `text-stroke`
- `text-stroke-0`
- `text-stroke-1`
- `text-stroke-2`
- `text-stroke-none`
- `text-stroke-sm`
- `text-stroke-md`
- `text-stroke-lg`
- `text-stroke-red-500`
- `text-stroke-[#fff]`
- `text-stroke-[3px]`
- `text-stroke-[length:var(--stroke)]`
- `text-stroke-opacity-50`
- `text-stroke-op50`
- `text-stroke` 相关高置信度 blocklist migration

不包含：

- arbitrary property `[-webkit-text-stroke-width:...]`
- arbitrary property `[-webkit-text-stroke-color:...]`
- `text-shadow`

## 当前现状

当前实现位于 [src/_rules/typography.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/typography.ts)：

- 旧实现通过 `^text-stroke(?:-(.+))?$`、`^text-stroke-(.+)$` 与 `^text-stroke-op(?:acity)?-?(.+)$` 放行宽度、颜色与 opacity 变体
- Tailwind 3.4 core plugins 中没有 `text-stroke` family
- Tailwind 3 只能通过 arbitrary property 表达 `-webkit-text-stroke-*`

当前已知正式写法包括：

- 无原生 `text-stroke*` utility
- `[-webkit-text-stroke-width:2px]`
- `[-webkit-text-stroke-width:var(--stroke)]`
- `[-webkit-text-stroke-color:#fff]`

当前已知必须拒绝或迁移的旧写法包括：

- `text-stroke`
- `text-stroke-0`
- `text-stroke-1`
- `text-stroke-2`
- `text-stroke-none`
- `text-stroke-sm`
- `text-stroke-md`
- `text-stroke-lg`
- `text-stroke-red-500`
- `text-stroke-[#fff]`
- `text-stroke-[3px]`
- `text-stroke-[length:var(--stroke)]`
- `text-stroke-opacity-50`
- `text-stroke-op50`

其中高置信度迁移覆盖：

- `text-stroke -> [-webkit-text-stroke-width:1.5rem]`
- `text-stroke-2 -> [-webkit-text-stroke-width:2px]`
- `text-stroke-none -> [-webkit-text-stroke-width:0]`
- `text-stroke-lg -> [-webkit-text-stroke-width:thick]`
- `text-stroke-[#fff] -> [-webkit-text-stroke-color:#fff]`
- `text-stroke-[length:var(--stroke)] -> [-webkit-text-stroke-width:var(--stroke)]`

## 设计原则

### 1. 整族从 runtime 中移除

`text-stroke*` 不是 Tailwind 3 原生 utility。  
本轮 canonical fixture 允许为空，目标是让 preset-tailwind3 与 Tailwind 3 保持一致，不继续保留仓库扩展兼容面。

### 2. 只迁移可稳定还原的旧写法

仅对以下情况给 replacement：

- 默认宽度
- 数字宽度
- `none|sm|md|lg` 这些仓库主题关键字
- hex arbitrary color
- arbitrary length / css function

像 `text-stroke-red-500`、`text-stroke-opacity-50`、`text-stroke-op50` 这类旧写法，因为无法无损转换为单个稳定的 arbitrary property，本轮只拦截，不给自动 replacement。

### 3. utility spec 显式记录“无官方 canonical”

为了让 `text-stroke` 进入统一治理链路，仍需要 utility spec / docs / verification；  
但 spec 要显式记录 canonical 为空，避免后续自动化把它误判成漏测。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-text-stroke-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-text-stroke-rewrite.ts)

### 2. runtime / parity

新增 `text-stroke` 专用测试入口：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. utility spec

在以下文件登记 `text-stroke` family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

### 4. blocklist

为这组新增 `text-stroke` 专用治理：

- [src/blocklist.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/blocklist.ts)
- [test/fixtures/blocklist-migration.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/blocklist-migration.ts)
- [test/preset-tailwind3-blocklist-messages.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-messages.test.ts)
- [test/preset-tailwind3-blocklist-prefix-audit.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-prefix-audit.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-23-text-stroke-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-text-stroke-source-rewrite-log.md)
- [docs/2026-04-23-text-stroke-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-text-stroke-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
