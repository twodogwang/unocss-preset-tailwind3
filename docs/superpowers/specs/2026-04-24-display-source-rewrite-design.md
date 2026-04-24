# Display Source Rewrite Design

状态日期：2026-04-24  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `display` 从 `src/_rules/static.ts` 里的宽匹配实现纳入 Tailwind 3 source rewrite 模板：shared fixture、runtime/parity、utility spec、blocklist 治理、独立过程文档，以及总表同步。

本轮目标是明确：

- `display` 只接受 Tailwind 3 官方静态 utility：`block`、`inline`、`inline-block`、`contents`、`flow-root`、`list-item`、`hidden`
- 移除 `display-[...]` arbitrary value 与 `display-*` 历史别名的 runtime 误接纳
- 通过 blocklist 收口高置信度旧别名

## 范围

包含：

- `block`
- `inline`
- `inline-block`
- `contents`
- `flow-root`
- `list-item`
- `hidden`
- 高置信度 migration，例如 `display-block -> block`、`display-none -> hidden`

不包含：

- `flex` / `inline-flex`
- `grid` / `inline-grid`
- `table` / `inline-table` / `table-row` 等表格 display utilities
- `caption-*`、`border-collapse`、`table-layout`
- `overflow`

## 当前现状

当前实现位于 [src/_rules/static.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/static.ts)。

已确认的偏差：

- 当前 regex `^display-(.+)$` 会错误接受：
  - `display-[none]`
  - `display-[inherit]`
  - `display-[var(--display)]`
- 当前 runtime 不会把 `display-block`、`display-inline` 这类旧别名显式 block 掉，因此缺少明确迁移提示

通过本地 Tailwind 3.4 主源 `node_modules/tailwindcss/lib/corePlugins.js` 与运行时实测确认，`display` core plugin 只注册静态 display utilities，不提供 `display-[...]` arbitrary value 入口。

## 设计原则

### 1. 以 Tailwind core plugin 为唯一主源

`src/_rules/static.ts` 中的 `display` 只保留静态映射，不再接受 `display-[...]` 或其它宽匹配写法。

### 2. 只治理当前 family 自己的误接纳

本轮只覆盖 `static.ts` 里的 display 子族，不顺带吞并 `flex`、`grid` 或 `table` family，避免把下一轮 handoff 的边界打乱。

### 3. blocklist 只迁移高置信度旧别名

只迁移目标唯一明确的历史写法：

- `display-block -> block`
- `display-inline -> inline`
- `display-inline-block -> inline-block`
- `display-none -> hidden`
- `display-contents -> contents`
- `display-flow-root -> flow-root`
- `display-list-item -> list-item`

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-display-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-display-rewrite.ts)

### 2. runtime / parity

更新：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. utility spec

登记 `display` family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

### 4. blocklist

新增 `display` migration 子集：

- [src/blocklist.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/blocklist.ts)
- [test/fixtures/blocklist-migration.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/blocklist-migration.ts)
- [test/preset-tailwind3-blocklist-messages.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-messages.test.ts)
- [test/preset-tailwind3-blocklist-prefix-audit.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-prefix-audit.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-24-display-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-24-display-source-rewrite-log.md)
- [docs/2026-04-24-display-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-24-display-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
