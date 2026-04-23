# Divide Source Rewrite Design

状态日期：2026-04-23  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `divide` 主规则族从当前 `border / divide` 综合测试段中拆出，纳入已经稳定的 source rewrite 模板：shared fixture、runtime、Tailwind parity、utility spec、blocklist migration 子集，以及独立的过程文档与总表同步。

本轮目标只覆盖：

- `divide-x`
- `divide-y-<lineWidth>`
- `divide-x-reverse`
- `divide-<style>`
- `divide-<color>`
- `divide-opacity-<percent>`
- `divide-x-[...]`
- 主题扩展场景 `divide-x-gutter`
- `divide` 相关高置信度 blocklist migration

## 范围

包含：

- `divide-x`
- `divide-y-2`
- `divide-x-reverse`
- `divide-dashed`
- `divide-red-500`
- `divide-opacity-50`
- `divide-x-[3px]`
- `divide-x-gutter`
- `dividex`
- `dividey2`
- `divide-op50`

不包含：

- `divide-block`
- `divide-inline`
- `divide-block-reverse`
- `divide-inline-reverse`

这些 logical axis 写法不是 Tailwind CSS 3 正式 `divide` 语法，本轮要明确收口为非法扩展，而不是继续保留。

## 当前现状

当前实现位于 [src/_rules-wind3/divide.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules-wind3/divide.ts)：

- `divide-x` / `divide-y`、reverse、color、opacity、style 已有基础实现
- runtime 与 parity 目前仍混在 `border / divide` 综合测试段中
- blocklist 只对紧凑写法做原始拦截，没有 divide 专用 migration 提示
- 运行时额外接受 `divide-block` / `divide-inline` 及其 reverse/width 扩展，需要本轮移除

当前已知必须覆盖的正式写法包括：

- `divide-x`
- `divide-y-2`
- `divide-x-reverse`
- `divide-dashed`
- `divide-red-500`
- `divide-opacity-50`
- `divide-x-[3px]`
- `divide-x-gutter`

当前已知必须拒绝或迁移的旧写法包括：

- `dividex`
- `dividey2`
- `divide-op50`
- `divide-block`
- `divide-inline`
- `divide-block-reverse`

其中高置信度迁移覆盖：

- `dividex -> divide-x`
- `dividey2 -> divide-y-2`
- `divide-op50 -> divide-opacity-50`

## 设计原则

### 1. divide 只保留 Tailwind 3 的 x/y 轴语义

本轮要把 `divide` 收口到 Tailwind 3 正式支持的 `x/y` 方向，不再保留 `block/inline` 逻辑方向扩展。

### 2. 没有真实偏差不重写其余 border 逻辑

`divide` 与 `border` 相邻，但这轮只处理 `divide` 自身的语法边界，不顺手改 `border` 主规则族。

### 3. blocklist 只保留高置信度迁移

这组 blocklist 只覆盖明确可自动建议的旧写法：

- `dividex`
- `dividey2`
- `divide-op50`

`divide-block*` / `divide-inline*` 只作为非法扩展拒绝，不设计 replacement。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-divide-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-divide-rewrite.ts)

至少包含：

- `canonical`
- `invalid`
- `semantic`

### 2. runtime / parity

新增 `divide` 专用测试入口：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

要求：

- 正向样例直接消费 `divideFixtures.canonical`
- 反向样例直接消费 `divideFixtures.invalid`
- 语义样例至少断言 reverse 变量、width 计算式、opacity 变量和 color 输出

### 3. utility spec

在以下文件登记 `divide` family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

### 4. blocklist migration

为这组新增 divide 专用迁移子集：

- [src/blocklist.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/blocklist.ts)
- [test/fixtures/blocklist-migration.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/blocklist-migration.ts)
- [test/preset-tailwind3-blocklist-messages.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-messages.test.ts)
- [test/preset-tailwind3-blocklist-prefix-audit.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-prefix-audit.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-23-divide-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-divide-source-rewrite-log.md)
- [docs/2026-04-23-divide-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-divide-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
