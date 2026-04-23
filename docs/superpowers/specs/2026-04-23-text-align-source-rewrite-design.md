# Text Align Source Rewrite Design

状态日期：2026-04-23  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `text-align` 主规则族从当前零散运行时与混合测试约束中拆出，纳入已经稳定的 source rewrite 模板：shared fixture、runtime、Tailwind parity、utility spec、blocklist migration 子集，以及独立的过程文档与总表同步。

本轮目标只覆盖：

- `text-left`
- `text-center`
- `text-right`
- `text-justify`
- `text-start`
- `text-end`
- `text-align-*` 相关高置信度 blocklist migration

## 范围

包含：

- `text-left`
- `text-center`
- `text-right`
- `text-justify`
- `text-start`
- `text-end`
- `text-align-left`
- `text-align-center`
- `text-align-right`
- `text-align-justify`
- `text-align-start`
- `text-align-end`

不包含：

- `text-align-inherit`
- `vertical-align`
- `align-*`
- `v-*`

## 当前现状

当前实现位于 [src/_rules/align.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/align.ts)：

- `text-left/right/center/justify/start/end` 是正式入口
- 同时还错误放行 `text-align-*` 历史前缀与 global keyword 变体
- runtime 与 parity 之前没有 `text-align` 专用模板

当前已知正式写法包括：

- `text-left`
- `text-center`
- `text-right`
- `text-justify`
- `text-start`
- `text-end`

当前已知必须拒绝或迁移的旧写法包括：

- `text-align-left`
- `text-align-center`
- `text-align-right`
- `text-align-justify`
- `text-align-start`
- `text-align-end`
- `text-align-inherit`

其中高置信度迁移覆盖：

- `text-align-left -> text-left`
- `text-align-center -> text-center`
- `text-align-right -> text-right`
- `text-align-justify -> text-justify`
- `text-align-start -> text-start`
- `text-align-end -> text-end`

## 设计原则

### 1. text-align 只治理自身

这一轮只建立 `text-align` 专用模板，不顺手把 `vertical-align` 一并并入。

### 2. 没有证据就不动 vertical-align

`vertical-align` 与 `text-align` 共用同一个源码文件，但不是同一规则族。  
本轮只移除 `text-align-*` 历史前缀，不改 `vertical-align` 的当前行为。

### 3. blocklist 只保留高置信度迁移

这组 blocklist 只覆盖可无歧义替换的旧写法：

- `text-align-left`
- `text-align-center`
- `text-align-right`
- `text-align-justify`
- `text-align-start`
- `text-align-end`

`text-align-inherit` 不提供 replacement，只保留为非法样例。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-text-align-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-text-align-rewrite.ts)

至少包含：

- `canonical`
- `invalid`
- `semantic`

### 2. runtime / parity

新增 `text-align` 专用测试入口：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. utility spec

在以下文件登记 `text-align` family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

### 4. blocklist migration

为这组新增 `text-align` 专用迁移子集：

- [test/fixtures/blocklist-migration.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/blocklist-migration.ts)
- [test/preset-tailwind3-blocklist-messages.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-messages.test.ts)
- [test/preset-tailwind3-blocklist-prefix-audit.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-prefix-audit.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-23-text-align-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-text-align-source-rewrite-log.md)
- [docs/2026-04-23-text-align-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-text-align-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
