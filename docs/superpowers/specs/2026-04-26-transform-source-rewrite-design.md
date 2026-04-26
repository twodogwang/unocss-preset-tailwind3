# Transform Source Rewrite Design

状态日期：2026-04-26  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `transform` 纳入 Tailwind 3 source rewrite 模板：shared fixture、runtime/parity、theme key、utility spec、blocklist 治理、独立过程文档，以及总表同步。

本轮目标是明确：

- `origin-*` 只接受 Tailwind 3 官方 `transformOrigin` key 与 bracket arbitrary
- `translate-*` 只接受 Tailwind 3 官方 `translate` theme key 与 bracket arbitrary
- `rotate-*`、`skew-*`、`scale-*` 只接受 Tailwind 3 官方 theme key 与 bracket arbitrary
- `transform` 静态类只保留 `transform / transform-cpu / transform-gpu / transform-none`
- `transform-rotate-*`、`transform-origin-*`、`translate-x-12px` 通过 blocklist 提供单义迁移提示

## 范围

包含：

- `origin-*`
- `translate-x-*`
- `translate-y-*`
- `rotate-*`
- `skew-x-*`
- `skew-y-*`
- `scale-*`
- `scale-x-*`
- `scale-y-*`
- `transform` 静态类

不包含：

- `filters / backdrop-filters`
- `animation`
- `perspective / preserve-3d`

## 当前现状

当前实现位于 [src/_rules/transform.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/transform.ts)。

已确认的偏差：

- `origin-tl`、`origin-top-center` 这类 `positionMap` 别名被 runtime 错误接纳
- `translate` 复用 spacing + 任意 fraction，导致 `translate-x-1/5` 等非官方值被接纳
- `rotate` / `skew` / `scale` 复用宽松 parser，导致 `rotate-13`、`skew-y-7`、`scale-111` 这类裸值被接纳
- `rotate-x/y/z`、`scale-z`、`translate-z` 这类 3D/轴向扩展仍在 runtime 暴露面里
- `transform-inherit` 通过 global keyword helper 被误接纳

通过本地 Tailwind 3.4 主源 `node_modules/tailwindcss/lib/corePlugins.js` 与 `node_modules/tailwindcss/stubs/config.full.js` 确认：

- `transform` 相关 utility 都以 theme key 为主，不接受任意裸值
- `translate` 默认 key 来自 `spacing` 加 `1/2`、`1/3`、`2/3`、`1/4`、`2/4`、`3/4`、`full`
- `rotate` 默认 key 是 `0/1/2/3/6/12/45/90/180`
- `skew` 默认 key 是 `0/1/2/3/6/12`
- `scale` 默认 key 是 `0/50/75/90/95/100/105/110/125/150`
- `transformOrigin` 默认 key 只有九个官方位置值，不包含缩写或 center 扩展别名

## 设计原则

### 1. theme key 优先，宽松 parser 只保留 bracket arbitrary

这一族不再允许裸数字兜底，而是显式补齐 Tailwind 默认 theme key，再用 bracket arbitrary 承接合法自定义值。

### 2. 删除 3D 与非官方轴向扩展

`rotate-x/y/z`、`scale-z`、`translate-z` 都不是 Tailwind 3 官方 transform utility，本轮直接移除。

### 3. blocklist 只收单义旧写法

只为可以稳定回写到官方语法的旧写法提供迁移提示；`perspective-*`、`preserve-3d` 等不做自动迁移。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-transform-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-transform-rewrite.ts)

### 2. runtime / parity

更新：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. runtime / theme

更新：

- [src/_rules/transform.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/transform.ts)
- [src/_theme/default.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_theme/default.ts)
- [src/_theme/misc.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_theme/misc.ts)
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

- [docs/2026-04-26-transform-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-26-transform-source-rewrite-log.md)
- [docs/2026-04-26-transform-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-26-transform-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
- [docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md)
