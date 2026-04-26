# Static Leftovers Source Rewrite Design

状态日期：2026-04-26  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `white-space / breaks / hyphens / content-visibility / contents / field-sizing / color-scheme` 纳入 Tailwind 3 source rewrite 模板：shared fixture、runtime/parity、utility spec、独立过程文档，以及总表同步。

本轮目标是明确：

- `whitespace-*` 只接受 Tailwind 3 官方六个静态 utility
- `break-*` 只接受 Tailwind 3 官方 `break-normal` / `break-words` / `break-all` / `break-keep`
- `hyphens-*` 只接受官方三类静态 utility，且输出只保留标准 `hyphens`
- `content-*` 只接受默认 `theme.content` key、扩展 `theme.content` key 与 `content-[...]` arbitrary value，并对齐 Tailwind `--tw-content` 输出结构
- `content-visibility`、`field-sizing`、`color-scheme` 在 Tailwind 3 默认 preset 中不暴露

## 范围

包含：

- `whitespace-*`
- `break-normal`
- `break-words`
- `break-all`
- `break-keep`
- `hyphens-none`
- `hyphens-manual`
- `hyphens-auto`
- `theme.content`
- `content-[...]`

不包含：

- 额外 migration 子集

## 当前现状

当前实现位于 [src/_rules/static.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/static.ts) 与 [src/_rules/color.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/color.ts)。

已确认的偏差：

- `whitespace` 当前错误支持 `ws-*` 别名与 global keyword
- `breaks` 当前错误支持 `break-anywhere`
- `hyphens` 当前额外输出 `-webkit-hyphens` / `-ms-hyphens`
- `content-*` 当前使用 `content: h.bracket.cssvar(...)` 的扩展输出，并支持 `content-empty`
- runtime 未显式登记默认 `theme.content.none`
- `content-visibility`、`field-sizing`、`color-scheme` 当前默认暴露，但 Tailwind 3 官方默认 preset 没有对应 core plugin

通过本地 Tailwind 3.4 主源 `node_modules/tailwindcss/lib/corePlugins.js` 与 `node_modules/tailwindcss/stubs/config.full.js` 确认：

- `whitespace`、`wordBreak`、`hyphens`、`content` 在 Tailwind 3 默认 preset 中存在正式 core plugin
- `content` 通过 `--tw-content` + `content: var(--tw-content)` 输出，并默认只提供 `theme.content.none`
- `content-visibility`、`field-sizing`、`color-scheme` 在 Tailwind 3.4 默认 preset 中不存在对应 core plugin

## 设计原则

### 1. 官方仍存在的 utility 改回主源输出结构

`content-*` 不能只做“值相同”对齐，还要回到 Tailwind 的 `--tw-content` 变量结构。

### 2. 非官方默认暴露面直接收口到零

`content-visibility`、`field-sizing`、`color-scheme` 全部从默认匹配面移除。

### 3. 静态族只保留官方 class 名

移除 `ws-*` 与 `break-anywhere` 这类仓库扩展，不保留兼容旁路。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-static-leftovers-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-static-leftovers-rewrite.ts)

### 2. runtime / parity

更新：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. runtime / theme

更新：

- [src/_rules/static.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/static.ts)
- [src/_rules/color.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/color.ts)
- [src/_theme/default.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_theme/default.ts)
- [src/_theme/misc.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_theme/misc.ts)
- [src/_theme/types.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_theme/types.ts)

### 4. utility spec

登记 family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-26-static-leftovers-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-26-static-leftovers-source-rewrite-log.md)
- [docs/2026-04-26-static-leftovers-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-26-static-leftovers-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
- [docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md)
