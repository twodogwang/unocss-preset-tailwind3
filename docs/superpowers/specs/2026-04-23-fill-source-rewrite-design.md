# Fill Source Rewrite Design

状态日期：2026-04-23  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `fill` 主规则族从当前 `svg / accent / caret colors` 混合测试段中拆出，纳入已经稳定的 source rewrite 模板：shared fixture、runtime、Tailwind parity、utility spec、blocklist migration 子集，以及独立的过程文档与总表同步。

本轮目标只覆盖：

- `fill-<color>`
- `fill-[#fff]`
- `fill-none`
- 主题扩展场景 `fill-brand`
- `fill` 相关高置信度 blocklist migration

## 范围

包含：

- `fill-red-500`
- `fill-[#fff]`
- `fill-none`
- `fill-brand`
- `fill-#fff`

不包含：

- `fill-red500`
- `fill-opacity-50`
- `fill-op50`

`fill` 不像 `text` / `bg` / `stroke` 那样有独立 opacity utility；这两类 opacity 旧写法继续只作为非法样例保留。

## 当前现状

当前实现位于 [src/_rules/svg.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/svg.ts)：

- `fill-(.+)` 通过 color resolver 处理颜色
- `fill-none` 作为静态规则处理
- runtime 与 parity 目前主要通过 `svg / accent / caret colors` 混合测试约束
- blocklist 中已有 `fill-#fff -> fill-[#fff]`，但尚未形成 `fill` 专用共享 fixture

当前已知正式写法包括：

- `fill-red-500`
- `fill-[#fff]`
- `fill-none`
- `fill-brand`

当前已知必须拒绝或迁移的旧写法包括：

- `fill-#fff`
- `fill-red500`
- `fill-opacity-50`
- `fill-op50`

其中高置信度迁移覆盖：

- `fill-#fff -> fill-[#fff]`

## 设计原则

### 1. fill 只治理自身，不把 accent / caret 一起拖进来

这一轮只建立 `fill` 专用模板，不顺手把 `accent`、`caret` 或 `stroke` 一并并入。

### 2. 没有真实偏差就不改 runtime

`src/_rules/svg.ts` 当前实现已经与 Tailwind 3 `fill` 语义一致。  
本轮主要是模板化治理：fixture、专用测试、utility spec、blocklist migration 子集和过程文档。只有新测试暴露真实偏差时才修改运行时实现。

### 3. blocklist 只保留高置信度迁移

这组 blocklist 只覆盖明确可自动建议的旧写法：

- `fill-#fff`

`fill-red500`、`fill-opacity-50` 与 `fill-op50` 不提供 replacement，只保留为非法样例。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-fill-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-fill-rewrite.ts)

至少包含：

- `canonical`
- `invalid`
- `semantic`

### 2. runtime / parity

新增 `fill` 专用测试入口：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

要求：

- 正向样例直接消费 `fillFixtures.canonical`
- 反向样例直接消费 `fillFixtures.invalid`
- 语义样例至少断言 color resolver 生成的 opacity 变量、rgb 颜色输出和 `fill-none`

### 3. utility spec

在以下文件登记 `fill` family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

### 4. blocklist migration

为这组新增 `fill` 专用迁移子集：

- [test/fixtures/blocklist-migration.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/blocklist-migration.ts)
- [test/preset-tailwind3-blocklist-messages.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-messages.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-23-fill-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-fill-source-rewrite-log.md)
- [docs/2026-04-23-fill-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-fill-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
