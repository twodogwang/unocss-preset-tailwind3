# Text Indent Source Rewrite Design

状态日期：2026-04-23  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `text-indent` 主规则族从当前 `src/_rules/typography.ts` 的宽匹配实现中拆出，纳入已经稳定的 source rewrite 模板：shared fixture、runtime、Tailwind parity、utility spec、blocklist migration 子集，以及独立的过程文档与总表同步。

本轮目标只覆盖：

- `indent-0`
- `indent-px`
- `indent-<spacing>`
- `indent-[...]`
- `-indent-<spacing>`
- `-indent-[...]`
- `indent-<theme key>`
- `text-indent` 相关高置信度 blocklist migration

## 范围

包含：

- `indent-0`
- `indent-px`
- `indent-1.5`
- `indent-2.5`
- `indent-4`
- `indent-[10px]`
- `-indent-4`
- `-indent-[10px]`
- `indent-gutter`
- `text-indent-4`
- `text-indent-[10px]`
- `indent-10px`

不包含：

- `indent`
- `indent-1/2`
- `-indent-1/2`
- `indent-full`
- `tab-size`
- `text-wrap / text-overflow / text-transform`

## 当前现状

当前实现位于 [src/_rules/typography.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/typography.ts)：

- 旧实现通过 `^indent(?:-(.+))?$` 接纳 bare `indent`
- 旧实现通过 `h.bracket.cssvar.global.fraction.rem(s)` 错误放行 `indent-1/2`、`indent-full`、`indent-10px`
- runtime 与 parity 之前没有 `text-indent` 专用模板

当前已知正式写法包括：

- `indent-0`
- `indent-px`
- `indent-1.5`
- `indent-2.5`
- `indent-4`
- `indent-[10px]`
- `-indent-4`
- `-indent-[10px]`
- `indent-gutter`

当前已知必须拒绝或迁移的旧写法包括：

- `indent`
- `indent-1/2`
- `-indent-1/2`
- `indent-full`
- `indent-10px`
- `text-indent-4`
- `text-indent-[10px]`

其中高置信度迁移覆盖：

- `text-indent-4 -> indent-4`
- `text-indent-[10px] -> indent-[10px]`
- `indent-10px -> indent-[10px]`

## 设计原则

### 1. 只治理 text-indent

这一轮只建立 `text-indent` 专用模板，不顺手把 `tab-size`、`text-wrap` 或其他 typography family 一并并入。

### 2. 只接受 spacing / theme / arbitrary

Tailwind 3 对 `text-indent` 的正式入口是 spacing、theme key 与 bracket arbitrary value。  
本轮要收紧的是 bare `indent`、分数值 `indent-1/2`、主题外 token `indent-full` 和裸长度 `indent-10px`。

### 3. blocklist 只保留高置信度迁移

这组 blocklist 只覆盖可以无歧义迁移到正式语法的旧写法：

- `text-indent-4`
- `text-indent-[10px]`
- `indent-10px`

`indent`、`indent-1/2`、`-indent-1/2` 与 `indent-full` 不提供 replacement，只保留为非法样例。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-text-indent-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-text-indent-rewrite.ts)

### 2. runtime / parity

新增 `text-indent` 专用测试入口：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. utility spec

在以下文件登记 `text-indent` family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

### 4. blocklist migration

为这组新增 `text-indent` 专用迁移子集：

- [src/blocklist.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/blocklist.ts)
- [test/fixtures/blocklist-migration.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/blocklist-migration.ts)
- [test/preset-tailwind3-blocklist-messages.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-messages.test.ts)
- [test/preset-tailwind3-blocklist-prefix-audit.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-prefix-audit.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-23-text-indent-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-text-indent-source-rewrite-log.md)
- [docs/2026-04-23-text-indent-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-text-indent-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
