# Static Interaction Source Rewrite Design

状态日期：2026-04-26  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `cursor / pointer-events / resize / user-select` 纳入 Tailwind 3 source rewrite 模板：shared fixture、runtime/parity、utility spec、独立过程文档，以及总表同步。

本轮目标是明确：

- `cursor` 主规则族只接受 Tailwind 3 默认 `theme.cursor` key、扩展 `theme.cursor` key 与 `cursor-[...]` arbitrary value
- `pointer-events` 只接受 `pointer-events-auto` 与 `pointer-events-none`
- `resize` 只接受 `resize` / `resize-x` / `resize-y` / `resize-none`
- `user-select` 只接受 `select-auto` / `select-all` / `select-text` / `select-none`，且输出与 Tailwind 3 一致，不附带多余 vendor 前缀

## 范围

包含：

- `theme.cursor`
- `cursor-[...]`
- `pointer-events-auto`
- `pointer-events-none`
- `resize`
- `resize-x`
- `resize-y`
- `resize-none`
- `select-auto`
- `select-all`
- `select-text`
- `select-none`

不包含：

- `white-space / breaks / hyphens / content-visibility / contents / field-sizing / color-scheme`
- static interaction migration 子集

## 当前现状

当前实现位于 [src/_rules/static.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/static.ts)。

已确认的偏差：

- `cursor` 当前通过 `h.bracket.cssvar.global` 错误接纳 `cursor-inherit`、`cursor-initial` 等 global keyword shortcut 与任意裸值
- runtime 未显式登记 Tailwind 3 默认 `theme.cursor` key
- `pointer-events` 当前通过 `makeGlobalStaticRules` 错误接纳 `pointer-events-inherit` 等 global keyword shortcut
- `resize` 当前通过 `makeGlobalStaticRules` 错误接纳 `resize-inherit` 等 global keyword shortcut
- `user-select` 当前通过 `makeGlobalStaticRules` 错误接纳 `select-inherit` 等 global keyword shortcut，并额外输出 `-webkit-user-select`

通过本地 Tailwind 3.4 主源 `node_modules/tailwindcss/lib/corePlugins.js` 与 `node_modules/tailwindcss/stubs/config.full.js` 确认：

- `cursor` 通过 `theme.cursor` 暴露默认 key，并支持 arbitrary value
- `pointer-events` 只暴露 `auto` / `none`
- `resize` 只暴露 `none` / `x` / `y` / `both`
- `user-select` 只暴露 `none` / `text` / `all` / `auto`，且官方 utility 输出只包含 `user-select`

## 设计原则

### 1. `cursor` 改回 theme 驱动

不再维护本地硬编码静态数组，统一使用 `theme.cursor` 默认 key 与扩展 key，再补 bracket arbitrary value。

### 2. 静态族优先做 strictness 收口

`pointer-events` / `resize` / `user-select` 这三组都不保留 global keyword shortcut，只保留 Tailwind 官方静态 utility。

### 3. 输出与官方 CSS 结构对齐

`user-select` 不再额外输出 `-webkit-user-select`，保持 parity 测试稳定。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-static-interaction-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-static-interaction-rewrite.ts)

### 2. runtime / parity

更新：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. runtime / theme

更新：

- [src/_rules/static.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/static.ts)
- [src/_theme/default.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_theme/default.ts)
- [src/_theme/misc.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_theme/misc.ts)
- [src/_theme/types.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_theme/types.ts)

### 4. utility spec

登记 family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-26-static-interaction-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-26-static-interaction-source-rewrite-log.md)
- [docs/2026-04-26-static-interaction-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-26-static-interaction-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
- [docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md)
