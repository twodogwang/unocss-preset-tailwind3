# Justify Align Place Source Rewrite Design

状态日期：2026-04-26  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `justify / align / place / flexGridJustifiesAlignments` 纳入 Tailwind 3 source rewrite 模板：shared fixture、runtime/parity、utility spec、blocklist 治理、独立过程文档，以及总表同步。

本轮目标是明确：

- `justify-*`、`justify-items-*`、`justify-self-*` 只接受 Tailwind 3 官方静态 utility
- `content-*`、`items-*`、`self-*`、`place-*` 只接受 Tailwind 3 官方静态 utility
- 移除 `*-safe`、global keyword、`justify-left/right`、`items-baseline-last` 等仓库扩展
- 移除 `flex-*` / `grid-*` 前缀复刻 runtime，并通过 blocklist 提供单义迁移提示

## 范围

包含：

- `justify-*`
- `justify-items-*`
- `justify-self-*`
- `content-*`
- `items-*`
- `self-*`
- `place-content-*`
- `place-items-*`
- `place-self-*`
- `flexGridJustifiesAlignments` legacy runtime exposure

不包含：

- `text-align`
- `vertical-align`
- `transform`

## 当前现状

当前实现位于 [src/_rules/position.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/position.ts)。

已确认的偏差：

- `justify-left` / `justify-right` 被 runtime 错误接纳
- `justify-center-safe`、`content-center-safe`、`items-end-safe`、`place-self-end-safe` 等 `*-safe` 扩展被接纳
- `justify-inherit`、`items-revert`、`self-inherit` 等 global keyword 通过 `makeGlobalStaticRules` 被误接纳
- `items-baseline-last`、`place-content-normal`、`justify-self-baseline` 等非官方组合被误接纳
- `flex-justify-center`、`grid-items-center`、`flex-place-content-between` 这类 `flex-*` / `grid-*` 前缀复刻仍在 runtime 暴露面里

通过本地 Tailwind 3.4 主源 `node_modules/tailwindcss/lib/corePlugins.js` 与运行时实测确认：

- `justify-content` 官方只支持 `normal/start/end/center/between/around/evenly/stretch`
- `align-content` 官方只支持 `normal/center/start/end/between/around/evenly/baseline/stretch`
- `place-content` 不支持 `normal`
- `justify-items` / `justify-self` 不支持 `baseline`
- `flex-*` / `grid-*` 前缀复刻不是 Tailwind 3 官方 utility

## 设计原则

### 1. 以 Tailwind core plugin 为唯一主源

这一族完全是静态 utility，不再从仓库扩展或 global keyword helper 推导。

### 2. 删除前缀复刻 runtime

`flexGridJustifiesAlignments` 作为 Tailwind-facing runtime 暴露面被清空，不再接受 `flex-justify-*` / `grid-items-*` 这一类入口。

### 3. blocklist 只收单义别名

只收可以稳定回写到官方 utility 的 `flex-*` / `grid-*` 前缀复刻；`*-safe`、`justify-left/right` 与 global keyword 不做自动迁移。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-justify-align-place-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-justify-align-place-rewrite.ts)

### 2. runtime / parity

更新：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. runtime

更新：

- [src/_rules/position.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/position.ts)
- [src/rules.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/rules.ts)
- [src/_rules/default.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/default.ts)

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

- [docs/2026-04-26-justify-align-place-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-26-justify-align-place-source-rewrite-log.md)
- [docs/2026-04-26-justify-align-place-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-26-justify-align-place-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
- [docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md)
