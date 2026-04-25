# Overflow Source Rewrite Design

状态日期：2026-04-25  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `overflow` 从 `src/_rules/layout.ts` 里的宽匹配实现纳入 Tailwind 3 source rewrite 模板：shared fixture、runtime/parity、utility spec、blocklist 治理、独立过程文档，以及总表同步。

本轮目标是明确：

- `overflow` 只接受 Tailwind 3 官方静态 utility：`overflow-{auto|hidden|clip|visible|scroll}` 与 `overflow-{x|y}-{...}`
- 移除 `overlay`、global keyword 与 `of-*` 历史别名的 runtime 误接纳
- 通过 blocklist 收口高置信度旧别名

## 范围

包含：

- `overflow-auto`
- `overflow-hidden`
- `overflow-clip`
- `overflow-visible`
- `overflow-scroll`
- `overflow-x-*`
- `overflow-y-*`
- 高置信度 migration，例如 `of-hidden -> overflow-hidden`、`of-x-auto -> overflow-x-auto`

不包含：

- `overscroll`
- `text-overflow`
- `overflow-anchor`
- `position / inset leftovers / float / z / order / box-sizing`

## 当前现状

当前实现位于 [src/_rules/layout.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/layout.ts)。

已确认的偏差：

- 当前 `overflowValues` 错误包含：
  - `overlay`
  - `inherit`
  - `initial`
  - `unset`
  - `revert`
  - `revert-layer`
- 当前 `of-*` 旧别名只有 raw blocklist 拦截，没有明确迁移提示

通过本地 Tailwind 3.4 主源 `node_modules/tailwindcss/lib/corePlugins.js` 与运行时实测确认，官方 `overflow` core plugin 只注册静态的五个 overflow 值及 x/y 变体，不提供 arbitrary value、`overlay` 或 global keyword 入口。

## 设计原则

### 1. 以 Tailwind core plugin 为唯一主源

`src/_rules/layout.ts` 中的 `overflow` 只保留 Tailwind 3 官方五个静态值，不再接受 `overlay` 或 global keyword。

### 2. 只治理当前 family 自己的误接纳

本轮只覆盖 `layout.ts` 里的 overflow 子族，不顺带吞并 `overscroll` 或 `text-overflow`，保持 handoff 边界稳定。

### 3. blocklist 只迁移高置信度旧别名

只迁移目标唯一明确的历史写法：

- `of-hidden -> overflow-hidden`
- `of-x-auto -> overflow-x-auto`
- `of-y-scroll -> overflow-y-scroll`

其余 `of-*` 写法仍可由 raw blocklist 兜底拦截。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-overflow-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-overflow-rewrite.ts)

### 2. runtime / parity

更新：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. utility spec

登记 `overflow` family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

### 4. blocklist

新增 `overflow` migration 子集：

- [src/blocklist.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/blocklist.ts)
- [test/fixtures/blocklist-migration.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/blocklist-migration.ts)
- [test/preset-tailwind3-blocklist-messages.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-messages.test.ts)
- [test/preset-tailwind3-blocklist-prefix-audit.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-prefix-audit.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-25-overflow-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-25-overflow-source-rewrite-log.md)
- [docs/2026-04-25-overflow-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-25-overflow-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
