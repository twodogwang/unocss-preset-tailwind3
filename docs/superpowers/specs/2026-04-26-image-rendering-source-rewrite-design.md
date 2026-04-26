# Image-Rendering Source Rewrite Design

状态日期：2026-04-26  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `image-rendering` 纳入 Tailwind 3 source rewrite 模板：shared fixture、runtime/parity、utility spec、独立过程文档，以及总表同步。

本轮目标是明确：

- Tailwind 3 默认 preset 不暴露任何 `image-render-*` utility
- 仓库当前 `image-render-auto` / `image-render-edge` / `image-render-pixel` 扩展类在默认 preset 中全部被 runtime 拒绝

## 范围

包含：

- `image-render-auto`
- `image-render-edge`
- `image-render-pixel`

不包含：

- `cursor / pointer-events / resize / user-select`
- image-rendering migration 子集

## 当前现状

当前实现位于 [src/_rules-wind3/behaviors.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules-wind3/behaviors.ts)。

已确认的偏差：

- runtime 默认暴露 `image-render-auto`、`image-render-edge`、`image-render-pixel`

通过本地 Tailwind 3.4 主源 `node_modules/tailwindcss/lib/corePlugins.js` 与 `node_modules/tailwindcss/stubs/config.full.js` 确认：

- 官方默认 preset 不包含 `imageRendering` core plugin
- 也没有对应默认 theme key
- 因此 `image-render-*` 不属于 Tailwind 3 默认 utility 集合

## 设计原则

### 1. 对非官方扩展直接收口到零暴露

这一族不是“缩小支持值集”，而是确认官方根本没有默认暴露面，因此 runtime 应直接移除整组扩展类。

### 2. 不新增 migration / blocklist 子集

这组类当前只做默认匹配面收口，不额外补迁移提示。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-image-rendering-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-image-rendering-rewrite.ts)

### 2. runtime / parity

更新：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. runtime

更新：

- [src/_rules-wind3/behaviors.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules-wind3/behaviors.ts)

### 4. utility spec

登记 family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-26-image-rendering-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-26-image-rendering-source-rewrite-log.md)
- [docs/2026-04-26-image-rendering-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-26-image-rendering-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
- [docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md)
