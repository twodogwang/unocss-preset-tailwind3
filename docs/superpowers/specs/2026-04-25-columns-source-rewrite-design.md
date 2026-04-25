# Columns Source Rewrite Design

状态日期：2026-04-25  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `columns` 纳入 Tailwind 3 source rewrite 模板：shared fixture、runtime/parity、utility spec、blocklist 治理、独立过程文档，以及总表同步。

本轮目标是明确：

- `columns-*` 只接受 Tailwind 3 官方默认 key、`theme.columns` key 与 arbitrary value
- `break-before` / `break-inside` / `break-after` 只接受 Tailwind 3 官方静态 utility
- 移除 `break-*` 的 global keyword runtime 误接纳
- 通过 blocklist 收口高置信度紧凑旧别名 `columns3 -> columns-3`

## 范围

包含：

- `columns-{1..12}`
- `columns-{3xs|2xs|xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl}`
- `columns-auto`
- `columns-[...]`
- `theme.columns`
- `break-before-*`
- `break-inside-*`
- `break-after-*`

不包含：

- `table display / caption / collapse`
- `grid-cols-*`
- `multicol` 其他非 Tailwind 扩展

## 当前现状

当前实现位于 [src/_rules-wind3/columns.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules-wind3/columns.ts)。

已确认的偏差：

- 旧实现把 theme 入口错误绑定到 `theme.containers`
- 旧默认 theme 没有 Tailwind 3 的 `columns` key 集合，因此默认不支持 `columns-3xs`
- `break-before` / `break-inside` / `break-after` 当前通过 `makeGlobalStaticRules` 错误接受 `inherit` / `initial` / `revert` 等 global keyword

通过本地 Tailwind 3.4 主源 `node_modules/tailwindcss/lib/corePlugins.js`、`node_modules/tailwindcss/stubs/config.full.js` 与运行时实测确认：

- `columns` core plugin 读取的是 `theme.columns`
- 默认 columns key 包含 `1..12`、`3xs`、`2xs`、`xs..7xl`
- `break-*` 只提供官方静态 utility，不支持 global keyword

## 设计原则

### 1. 以 Tailwind core plugin 与默认 theme 为唯一主源

`columns` runtime 与默认 theme 都直接对齐 Tailwind 3.4。

### 2. break utilities 只保留静态官方语义

本轮不再复用 `makeGlobalStaticRules`，避免把 global keyword 带入 `break-*`。

### 3. blocklist 只收单义别名

只收 `columns3 -> columns-3`。`cols-*` 与 `grid-cols-*` 存在语义歧义，不纳入自动迁移提示。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-columns-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-columns-rewrite.ts)

### 2. runtime / parity

更新：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. runtime / theme

更新：

- [src/_rules-wind3/columns.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules-wind3/columns.ts)
- [src/_theme/size.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_theme/size.ts)
- [src/_theme/default.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_theme/default.ts)
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

- [docs/2026-04-25-columns-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-25-columns-source-rewrite-log.md)
- [docs/2026-04-25-columns-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-25-columns-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
- [docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md)
