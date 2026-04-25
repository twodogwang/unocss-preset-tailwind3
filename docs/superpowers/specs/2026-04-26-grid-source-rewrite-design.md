# Grid Source Rewrite Design

状态日期：2026-04-26  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `grid` 纳入 Tailwind 3 source rewrite 模板：shared fixture、runtime/parity、utility spec、blocklist 治理、独立过程文档，以及总表同步。

本轮目标是明确：

- `grid` / `inline-grid` / `grid-cols-*` / `grid-rows-*` 只接受 Tailwind 3 官方语义
- `col-*` / `row-*` line placement、`auto-cols-*` / `auto-rows-*` 与 `grid-flow-*` 对齐 Tailwind 3
- theme key 对齐 Tailwind 的 plural 命名：`gridTemplateColumns`、`gridAutoColumns`、`gridColumnStart` 等
- 通过 blocklist 收口高置信度旧别名：`auto-flow-*`、`rows-*`、`cols-*`

## 范围

包含：

- `grid`
- `inline-grid`
- `grid-cols-*`
- `grid-rows-*`
- `col-*`
- `row-*`
- `auto-cols-*`
- `auto-rows-*`
- `grid-flow-*`

不包含：

- `justify / align / place / flexGridJustifiesAlignments`
- `transform`
- `grid-area(s)` 仓库扩展

## 当前现状

当前实现位于 [src/_rules/grid.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/grid.ts)。

已确认的偏差：

- 旧实现仍保留 `grid-cols-minmax-*` 与 `grid-area(s)-*` 这类非 Tailwind 3 扩展
- theme key 仍使用仓库里的 singular 命名，未对齐 Tailwind 的 plural 形式
- blocklist 中 `auto-flow-*` / `rows-*` / `cols-*` 还是 raw 拦截，没有迁移提示

通过本地 Tailwind 3.4 主源 `node_modules/tailwindcss/lib/corePlugins.js`、`node_modules/tailwindcss/stubs/config.full.js` 与运行时实测确认：

- `gridTemplateColumns` / `gridTemplateRows`、`gridAutoColumns` / `gridAutoRows`、`gridColumnStart` / `gridColumnEnd`、`gridRowStart` / `gridRowEnd` 都是官方 theme key
- `grid-cols-none` / `grid-cols-subgrid`、`auto-cols-fr`、`col-auto`、`row-end-auto` 都属于官方语义
- `grid-cols-minmax-*`、`grid-area-*`、`grid-areas-*` 不是 Tailwind 3 官方 utility

## 设计原则

### 1. 以 Tailwind core plugin 与默认 theme 为唯一主源

默认 grid theme key、theme 扩展命名与 runtime 语义都直接对齐 Tailwind 3.4。

### 2. 删除非官方 grid 扩展

`grid-cols-minmax-*` 与 `grid-area(s)-*` 不再保留在 runtime 暴露面里。

### 3. blocklist 只收单义别名

只收可以稳定改写到官方类名的 `auto-flow-*`、`rows-*`、`cols-*`。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-grid-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-grid-rewrite.ts)

### 2. runtime / parity

更新：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. runtime / theme

更新：

- [src/_rules/grid.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/grid.ts)
- [src/_theme/default.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_theme/default.ts)
- [src/_theme/size.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_theme/size.ts)
- [src/_theme/types.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_theme/types.ts)

### 4. utility spec

登记 family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

### 5. blocklist

新增 migration 子集：

- [src/blocklist.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/blocklist.ts)
- [test/fixtures/blocklist-migration.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/blocklist-migration.ts)
- [test/preset-tailwind3-blocklist-messages.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-messages.test.ts)
- [test/preset-tailwind3-blocklist-prefix-audit.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-prefix-audit.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-26-grid-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-26-grid-source-rewrite-log.md)
- [docs/2026-04-26-grid-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-26-grid-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
- [docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md)
