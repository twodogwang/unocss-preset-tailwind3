# Scroll-Behavior Source Rewrite Design

状态日期：2026-04-26  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `scroll-behavior` 纳入 Tailwind 3 source rewrite 模板：shared fixture、runtime/parity、utility spec、独立过程文档，以及总表同步。

本轮目标是明确：

- `scroll-behavior` 主规则族只接受 `scroll-auto` 与 `scroll-smooth`
- `scroll-inherit`、`scroll-initial`、`scroll-revert` 这类 global keyword shortcut 被 runtime 拒绝

## 范围

包含：

- `scroll-auto`
- `scroll-smooth`

不包含：

- `touch-action`
- scroll-behavior migration 子集

## 当前现状

当前实现位于 [src/_rules-wind3/behaviors.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules-wind3/behaviors.ts)。

已确认的偏差：

- runtime 通过 `makeGlobalStaticRules('scroll', 'scroll-behavior')` 错误接纳了 `scroll-inherit`、`scroll-initial`、`scroll-revert`

通过本地 Tailwind 3.4 主源 `node_modules/tailwindcss/lib/corePlugins.js` 确认：

- 官方 scrollBehavior core plugin 只暴露 `scroll-auto` 与 `scroll-smooth`
- 不支持 global keyword shortcut

## 设计原则

### 1. 对静态族优先做 strictness 收口

和 `overscroll` 一样，这一族的 rewrite 重点是移除多余扩展，而不是新增解析路径。

### 2. 不为 global keyword 新增 migration

这组 global keyword shortcut 不保留迁移提示，只通过 runtime 拒绝收口。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-scroll-behavior-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-scroll-behavior-rewrite.ts)

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

- [docs/2026-04-26-scroll-behavior-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-26-scroll-behavior-source-rewrite-log.md)
- [docs/2026-04-26-scroll-behavior-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-26-scroll-behavior-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
- [docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md)
