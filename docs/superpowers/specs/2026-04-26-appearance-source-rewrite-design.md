# Appearance Source Rewrite Design

状态日期：2026-04-26  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `appearance` 纳入 Tailwind 3 source rewrite 模板：shared fixture、runtime/parity、utility spec、独立过程文档，以及总表同步。

本轮目标是明确：

- `appearance` 主规则族只接受 `appearance-auto` 与 `appearance-none`
- `appearance-inherit`、`appearance-initial`、`appearance-revert` 这类 global keyword shortcut 被 runtime 拒绝
- 浏览器特定 keyword 如 `appearance-button`、`appearance-textfield` 不进入当前 preset 的 Tailwind 3 暴露面

## 范围

包含：

- `appearance-auto`
- `appearance-none`
- dedicated utility spec

不包含：

- `will-change`
- `overscroll`
- appearance alias migration

## 当前现状

当前实现位于 [src/_rules/behaviors.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/behaviors.ts)。

通过本地 Tailwind 3.4 主源 `node_modules/tailwindcss/lib/corePlugins.js` 确认：

- 官方 appearance core plugin 只暴露 `appearance-none` 与 `appearance-auto`
- 不支持 global keyword shortcut
- 不支持 `appearance-button`、`appearance-textfield` 这类浏览器关键字 utility

当前仓库实现已经与这组语义一致，因此本轮重点是把它补进统一 rewrite 模板，而不是改 runtime。

## 设计原则

### 1. 先用 shared fixture 锁住语义，再决定是否需要实现改动

对于已经接近 Tailwind 3 官方语义的族，优先用 dedicated fixture、runtime/parity 与 utility spec 把边界固化下来。

### 2. 不为非单义旧写法提供迁移提示

appearance 当前没有高置信度旧写法子集，因此不新增 blocklist migration。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-appearance-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-appearance-rewrite.ts)

### 2. runtime / parity

更新：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. utility spec

登记 family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-26-appearance-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-26-appearance-source-rewrite-log.md)
- [docs/2026-04-26-appearance-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-26-appearance-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
- [docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md)
