# List-Style Source Rewrite Design

状态日期：2026-04-26  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `list-style` 纳入 Tailwind 3 source rewrite 模板：shared fixture、runtime/parity、utility spec、独立过程文档，以及总表同步。

本轮目标是明确：

- `list-style` 主规则族只接受 Tailwind 3 官方的 `listStyleType` / `listStylePosition` / `listStyleImage` 语义
- runtime 支持默认 key、theme key 与 bracket arbitrary value
- `list-circle`、`list-roman`、`list-decimal-inside`、`list-inherit` 这类历史 alias、组合后缀与 global keyword shortcut 被 runtime 拒绝

## 范围

包含：

- `list-none`
- `list-disc`
- `list-decimal`
- `list-inside`
- `list-outside`
- `list-image-none`
- `list-[...]`
- `list-image-[...]`
- `theme.listStyleType`
- `theme.listStyleImage`

不包含：

- `image-rendering`
- list-style migration 子集

## 当前现状

当前实现位于 [src/_rules-wind3/behaviors.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules-wind3/behaviors.ts)。

已确认的偏差：

- runtime 通过自定义 `listStyles` alias map 接纳了 `list-circle`、`list-square`、`list-greek`、`list-roman` 等 Tailwind 3 默认未暴露的旧别名
- runtime 支持 `list-decimal-inside` 这类 Tailwind 3 不支持的位置组合后缀
- runtime 通过 `makeGlobalStaticRules('list', 'list-style-type')` 错误接纳了 `list-inherit` 之类的 global keyword shortcut
- runtime 未显式登记 Tailwind 3 默认 `theme.listStyleType` / `theme.listStyleImage` key

通过本地 Tailwind 3.4 主源 `node_modules/tailwindcss/lib/corePlugins.js` 与 `node_modules/tailwindcss/stubs/config.full.js` 确认：

- 官方通过 `listStyleType` / `listStylePosition` / `listStyleImage` 三个 core plugin 暴露 `list-style`
- 默认 `listStyleType` 只有 `none` / `disc` / `decimal`
- 默认 `listStyleImage` 只有 `none`
- 支持 theme key 与 bracket arbitrary value，不支持历史 alias、组合后缀和 global keyword shortcut

## 设计原则

### 1. 以 Tailwind plugin 拆分语义为准

不再保留仓库自定义 alias map，而是按 `listStyleType` / `listStylePosition` / `listStyleImage` 三块正式暴露面重写。

### 2. 用默认 theme key 替代写死静态分支

`list-none` / `list-disc` / `list-decimal` / `list-image-none` 通过默认 theme key 统一产出，避免再保留特殊旁路。

### 3. bracket arbitrary value 只保留官方形式

保留 `list-[upper-roman]`、`list-image-[url(...)]` 这类 Tailwind 3 官方 arbitrary value 语法，不保留未加 bracket 的旧写法。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-list-style-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-list-style-rewrite.ts)

### 2. runtime / parity

更新：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. runtime / theme

更新：

- [src/_rules-wind3/behaviors.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules-wind3/behaviors.ts)
- [src/_theme/default.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_theme/default.ts)
- [src/_theme/misc.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_theme/misc.ts)
- [src/_theme/types.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_theme/types.ts)

### 4. utility spec

登记 family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-26-list-style-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-26-list-style-source-rewrite-log.md)
- [docs/2026-04-26-list-style-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-26-list-style-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
- [docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md)
