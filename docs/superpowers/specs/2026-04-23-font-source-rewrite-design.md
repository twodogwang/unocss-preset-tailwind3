# Font Source Rewrite Design

状态日期：2026-04-23  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `font` 主规则族从当前 `typography / columns / tables / behaviors` 混合测试段中拆出，纳入已经稳定的 source rewrite 模板：shared fixture、runtime、Tailwind parity、utility spec、blocklist migration 子集，以及独立的过程文档与总表同步。

本轮目标只覆盖：

- `font-<family>`
- `font-<weight>`
- `font-[650]`
- 主题扩展场景 `font-brand`
- `font` 相关高置信度 blocklist migration

## 范围

包含：

- `font-sans`
- `font-mono`
- `font-bold`
- `font-[650]`
- `font-brand`
- `fw-bold`
- `font-650`

不包含：

- `fontbold`
- `font-style-*`
- `font-stretch-*`
- `font-synthesis-*`
- `word-spacing-*`

## 当前现状

当前实现位于 [src/_rules/typography.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/typography.ts)：

- `font-([^-]+)` 处理权重
- `font-(.+)` 处理 family
- runtime 与 parity 之前主要通过 `typography / columns / tables / behaviors` 混合测试约束
- blocklist 中已有 `fw-bold -> font-bold`，但尚未形成 `font` 专用共享 fixture

当前已知正式写法包括：

- `font-sans`
- `font-mono`
- `font-bold`
- `font-[650]`
- `font-brand`

当前已知必须拒绝或迁移的旧写法包括：

- `fw-bold`
- `fontbold`
- `font-650`

其中高置信度迁移覆盖：

- `fw-bold -> font-bold`
- `font-650 -> font-[650]`

## 设计原则

### 1. font 只治理主入口

这一轮只建立 `font family / font weight` 的专用模板，不顺手把 `text-align`、`font-stretch` 或 `font-synthesis` 一并并入。

### 2. 运行时只收紧真实偏差

当前 `font` 的主要真实偏差是错误接纳了裸数字权重 `font-650`。  
本轮只把它收敛为 Tailwind 3 的 bracket 语法 `font-[650]`，不对其他无证据的子入口做额外重构。

### 3. blocklist 只保留高置信度迁移

这组 blocklist 只覆盖明确可自动建议的旧写法：

- `fw-bold`
- `font-650`

`fontbold` 只保留为非法样例，不提供 replacement。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-font-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-font-rewrite.ts)

至少包含：

- `canonical`
- `invalid`
- `semantic`

### 2. runtime / parity

新增 `font` 专用测试入口：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. utility spec

在以下文件登记 `font` family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

### 4. blocklist migration

为这组新增 `font` 专用迁移子集：

- [test/fixtures/blocklist-migration.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/blocklist-migration.ts)
- [test/preset-tailwind3-blocklist-messages.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-messages.test.ts)
- [test/preset-tailwind3-blocklist-prefix-audit.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-prefix-audit.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-23-font-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-font-source-rewrite-log.md)
- [docs/2026-04-23-font-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-font-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
