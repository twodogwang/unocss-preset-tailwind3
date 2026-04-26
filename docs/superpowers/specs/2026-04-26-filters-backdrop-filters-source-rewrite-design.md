# Filters Backdrop-Filters Source Rewrite Design

状态日期：2026-04-26  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `filters / backdrop-filters` 纳入 Tailwind 3 source rewrite 模板：shared fixture、runtime/parity、theme key、utility spec、blocklist 治理、独立过程文档，以及总表同步。

本轮目标是明确：

- `blur`、`brightness`、`contrast`、`drop-shadow`、`grayscale`、`hue-rotate`、`invert`、`saturate`、`sepia` 只接受 Tailwind 3 官方 theme key 与 bracket arbitrary
- `backdrop-*` filter utilities 只接受 Tailwind 3 官方 theme key 与 bracket arbitrary
- `filter` 静态类只保留 `filter / filter-none`
- `backdrop-filter` 静态类只保留 `backdrop-filter / backdrop-filter-none`
- `filter-*` 前缀旧别名与 `backdrop-op-*` 简写通过 blocklist 提供单义迁移提示

## 范围

包含：

- `blur-*`
- `brightness-*`
- `contrast-*`
- `drop-shadow*`
- `grayscale*`
- `hue-rotate-*`
- `invert*`
- `saturate-*`
- `sepia*`
- `backdrop-*` filter utilities
- `filter / filter-none`
- `backdrop-filter / backdrop-filter-none`

不包含：

- `animation`
- `opacity` 主规则族重写
- `drop-shadow-color-*`

## 当前现状

当前实现位于 [src/_rules-wind3/filters.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules-wind3/filters.ts)。

已确认的偏差：

- `filter-inherit`、`backdrop-filter-revert` 这类 global keyword 被 runtime 错误接纳
- `blur-3px`、`brightness-76`、`contrast-120`、`hue-rotate-13` 等裸值被宽松 parser 接纳
- `grayscale-50`、`invert-50`、`sepia-50`、`saturate-175` 等非 theme key 值被接纳
- `backdrop-op-*` 简写不是 Tailwind 3 官方语法，但仍被 runtime 接纳
- `filterProperty` 顺序与 Tailwind 主源不一致，`drop-shadow` 被放在过早位置

通过本地 Tailwind 3.4 主源 `node_modules/tailwindcss/lib/corePlugins.js` 与 `node_modules/tailwindcss/stubs/config.full.js` 确认：

- filter 相关 utility 都以 theme key 为主，不接受任意裸值
- `grayscale`、`invert`、`sepia` 只支持 `DEFAULT` 与 `0`
- `brightness`、`contrast`、`saturate`、`hueRotate` 都有固定默认 key 集合
- `backdrop-opacity` 官方只接受 `backdrop-opacity-*`，不支持 `backdrop-op-*`
- `filter` 链顺序应为 `blur -> brightness -> contrast -> grayscale -> hue-rotate -> invert -> saturate -> sepia -> drop-shadow`

## 设计原则

### 1. theme key 优先，宽松 parser 只保留 bracket arbitrary

这一族不再允许裸值兜底，而是显式补齐 Tailwind 默认 theme key，再用 bracket arbitrary 承接合法自定义值。

### 2. blocklist 只收单义旧写法

只为可以稳定回写到官方语法的旧写法提供迁移提示；`drop-shadow-color-*` 不做自动迁移。

### 3. filter 链顺序严格对齐 Tailwind 主源

即使 class 名集合一致，filter 组合顺序也会影响最终渲染，本轮按主源顺序修正。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-filters-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-filters-rewrite.ts)

### 2. runtime / parity

更新：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. runtime / theme

更新：

- [src/_rules-wind3/filters.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules-wind3/filters.ts)
- [src/_theme/default.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_theme/default.ts)
- [src/_theme/filters.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_theme/filters.ts)
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

- [docs/2026-04-26-filters-backdrop-filters-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-26-filters-backdrop-filters-source-rewrite-log.md)
- [docs/2026-04-26-filters-backdrop-filters-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-26-filters-backdrop-filters-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
- [docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md)
