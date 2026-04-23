# Shadow Source Rewrite Design

状态日期：2026-04-23  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `shadow` 主规则族从当前与 `effects / filters / transform` 混合测试段中拆出，纳入已经验证过的 source rewrite 模板：shared fixture、runtime、Tailwind parity、utility spec、blocklist migration 子集、过程日志和任务状态都单独落盘。

本轮目标只覆盖：

- `shadow`
- `shadow-<themeKey>`
- `shadow-inner`
- `shadow-none`
- `shadow-<color>`
- `shadow-[#000]`
- `shadow-[...]`
- `shadow` 相关高置信度 blocklist migration

## 范围

包含：

- `shadow`
- `shadow-md`
- `shadow-inner`
- `shadow-none`
- `shadow-red-500`
- `shadow-[#000]`
- `shadow-[0_0_10px_rgba(0,0,0,0.35)]`
- `shadowmd`
- `shadow-inset`

不包含：

- `shadow-op50`
- `shadow-opacity-50`
- `drop-shadow-*`
- `filter-*`
- `backdrop-*`

`shadow-op50` 与 `shadow-opacity-50` 继续只作为非法样例保留，不在本轮强行设计迁移提示。

## 当前现状

当前实现位于 [src/_rules/shadow.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/shadow.ts)：

- `shadow(?:-(.+))?` 同时承担 theme shadow 与 color shadow 分发
- runtime 与 parity 目前主要通过 `effects / filters / transform` 混合测试约束
- `shadow-inset` 和紧凑写法 `shadowmd` 当前会被拒绝，但没有专用 migration 提示

当前已知正式写法包括：

- `shadow`
- `shadow-md`
- `shadow-inner`
- `shadow-none`
- `shadow-red-500`
- `shadow-[#000]`
- `shadow-[0_0_10px_rgba(0,0,0,0.35)]`

当前已知必须拒绝或迁移的旧写法包括：

- `shadowmd`
- `shadow-op50`
- `shadow-opacity-50`
- `shadow-inset`

其中高置信度迁移覆盖：

- `shadowmd -> shadow-md`
- `shadow-inset -> shadow-inner`

## 设计原则

### 1. 只治理 shadow，不把 drop-shadow 一起拖进来

这一轮只建立 `shadow` 专用模板，不顺手扩到 `drop-shadow`、`filter` 或 `backdrop`。

### 2. 没有真实偏差就不改 runtime

`src/_rules/shadow.ts` 当前实现已经基本对齐 Tailwind 3。  
本轮主要是模板化治理：fixture、专用测试、utility spec、blocklist migration 子集和过程文档。只有新测试暴露真实偏差时才修改运行时实现。

### 3. blocklist 只保留高置信度迁移

这组 blocklist 只覆盖明确可自动建议的旧写法：

- 紧凑 theme key `shadowmd`
- 旧语义别名 `shadow-inset`

`shadow-op50` 与 `shadow-opacity-50` 由于没有不误导的 replacement，继续只保留为非法样例。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-shadow-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-shadow-rewrite.ts)

至少包含：

- `canonical`
- `invalid`
- `semantic`

### 2. runtime / parity

新增 `shadow` 专用测试入口：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

要求：

- 正向样例直接消费 `shadowFixtures.canonical`
- 反向样例直接消费 `shadowFixtures.invalid`
- 语义样例至少断言 `box-shadow`、`--un-shadow` 和 `--un-shadow-color`

### 3. utility spec

在以下文件登记 `shadow` family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

### 4. blocklist migration

为这组新增 shadow 专用迁移子集：

- [src/blocklist.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/blocklist.ts)
- [test/fixtures/blocklist-migration.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/blocklist-migration.ts)
- [test/preset-tailwind3-blocklist-messages.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-messages.test.ts)
- [test/preset-tailwind3-blocklist-prefix-audit.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-prefix-audit.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-23-shadow-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-shadow-source-rewrite-log.md)
- [docs/2026-04-23-shadow-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-shadow-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
