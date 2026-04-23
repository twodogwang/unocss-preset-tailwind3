# Text Decoration Source Rewrite Design

状态日期：2026-04-23  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `text-decoration-line` 从已经完成模板化的 `decoration / underline-offset` 中拆出，形成独立的 shared fixture、runtime/parity、utility spec、blocklist migration 子集，以及独立的过程文档与总表同步。

本轮目标只覆盖：

- `underline`
- `overline`
- `line-through`
- `no-underline`
- `text-decoration` 相关高置信度 blocklist migration

## 范围

包含：

- `underline`
- `overline`
- `line-through`
- `no-underline`
- `decoration-none`
- `decoration-underline`
- `decoration-overline`
- `decoration-line-through`

不包含：

- `decoration-<thickness>`
- `decoration-<style>`
- `decoration-<color>`
- `underline-offset-*`
- `text-indent`

## 当前现状

当前实现位于 [src/_rules/decoration.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/decoration.ts)：

- `underline|overline|line-through` 已直接映射到 `text-decoration-line`
- `no-underline` 已直接映射到 `text-decoration: none`
- 历史上 `text-decoration-line` 与 `decoration / underline-offset` 共用同一套 fixture 与测试

当前已知正式写法包括：

- `underline`
- `overline`
- `line-through`
- `no-underline`

当前已知必须拒绝或迁移的旧写法包括：

- `decoration-none`
- `decoration-underline`
- `decoration-overline`
- `decoration-line-through`

其中高置信度迁移覆盖：

- `decoration-none -> no-underline`
- `decoration-underline -> underline`
- `decoration-overline -> overline`
- `decoration-line-through -> line-through`

## 设计原则

### 1. 只治理 line 入口

这一轮只建立 `text-decoration-line` 专用模板，不顺手把 thickness / style / color / underline-offset 再拖回来。

### 2. 没有真实偏差就不改 runtime

`src/_rules/decoration.ts` 当前 line 入口已经对齐 Tailwind 3。  
本轮主要工作是模板拆分与文档同步；只有新测试暴露真实偏差时才修改运行时实现。

### 3. blocklist 只保留高置信度迁移

只保留可以一对一迁移到正式 Tailwind 3 line utility 的旧写法：

- `decoration-none`
- `decoration-underline`
- `decoration-overline`
- `decoration-line-through`

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-text-decoration-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-text-decoration-rewrite.ts)

### 2. runtime / parity

新增 `text-decoration` 专用测试入口：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. utility spec

在以下文件登记 `text-decoration` family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

### 4. blocklist migration

为这组新增 `text-decoration` 专用迁移子集：

- [src/blocklist.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/blocklist.ts)
- [test/fixtures/blocklist-migration.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/blocklist-migration.ts)
- [test/preset-tailwind3-blocklist-messages.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-messages.test.ts)
- [test/preset-tailwind3-blocklist-prefix-audit.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-prefix-audit.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-23-text-decoration-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-text-decoration-source-rewrite-log.md)
- [docs/2026-04-23-text-decoration-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-text-decoration-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
