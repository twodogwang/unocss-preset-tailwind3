# Will-Change Source Rewrite Design

状态日期：2026-04-26  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `will-change` 纳入 Tailwind 3 source rewrite 模板：shared fixture、runtime/parity、Tailwind-style theme 语义、utility spec、独立过程文档，以及总表同步。

本轮目标是明确：

- `will-change-*` 只接受 Tailwind 3 官方默认 key、`theme.willChange` key 与 bracket arbitrary value
- `will-change-inherit`、`will-change-initial`、`will-change-revert` 这类 global keyword shortcut 被 runtime 拒绝
- 未命中的裸 property shortcut，如 `will-change-opacity`、`will-change-scroll-position`，不再被 runtime 宽松接纳

## 范围

包含：

- `will-change-auto`
- `will-change-scroll`
- `will-change-contents`
- `will-change-transform`
- `will-change-[...]`
- root `theme.willChange`

不包含：

- `overscroll`
- `scroll-behavior`
- `will-change` migration 子集

## 当前现状

当前实现位于 [src/_rules/behaviors.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/behaviors.ts)。

已确认的偏差：

- runtime 通过 `h.properties.auto.global(...)` 接纳 `inherit`、`initial`、`revert` 这类 Tailwind 3 不支持的 global keyword
- runtime 会把任意裸 property 当作合法值，导致 `will-change-opacity`、`will-change-scroll-position` 被错误接纳
- theme 侧还没有显式补齐 Tailwind 默认 `willChange` key

通过本地 Tailwind 3.4 主源 `node_modules/tailwindcss/lib/corePlugins.js` 与 `node_modules/tailwindcss/stubs/config.full.js` 确认：

- 官方 `willChange` core plugin 从 `theme.willChange` 读取默认与扩展 key
- 默认 key 只有 `auto / scroll / contents / transform`
- 自定义值通过 arbitrary value 语法承接，而不是任意裸 property shortcut

## 设计原则

### 1. theme key 优先，裸 property 只保留 bracket arbitrary

这一族和 `animation` 一样，目标是对齐 Tailwind 官方 theme 入口，而不是继续保留宽松 parser。

### 2. blocklist 不新增歧义 migration

`will-change-opacity` 这类旧写法没有单义官方替代，因此不新增 migration replacement，只通过 runtime 拒绝收口。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-will-change-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-will-change-rewrite.ts)

### 2. runtime / parity

更新：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. runtime / theme

更新：

- [src/_rules/behaviors.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/behaviors.ts)
- [src/_theme/default.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_theme/default.ts)
- [src/_theme/misc.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_theme/misc.ts)
- [src/_theme/types.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_theme/types.ts)

### 4. utility spec

登记 family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-26-will-change-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-26-will-change-source-rewrite-log.md)
- [docs/2026-04-26-will-change-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-26-will-change-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
- [docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md)
