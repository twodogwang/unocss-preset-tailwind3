# Ring Source Rewrite Design

状态日期：2026-04-23  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `ring` 主规则族从当前与 `border / decoration` 混合测试段中拆出，纳入已经验证过的 source rewrite 模板：shared fixture、runtime、Tailwind parity、utility spec、blocklist migration 子集、过程日志和任务状态都单独落盘。

本轮目标只覆盖：

- `ring`
- `ring-<width>`
- `ring-[...]`
- `ring-<color>`
- `ring-<color>/<alpha>`
- `ring-opacity-*`
- `ring-offset-<width>`
- `ring-offset-<color>`
- `ring-inset`
- `ring` 相关 blocklist migration

## 范围

包含：

- `ring`
- `ring-2`
- `ring-[3px]`
- `ring-[#fff]`
- `ring-blue-500/50`
- `ring-opacity-50`
- `ring-offset-2`
- `ring-offset-[3px]`
- `ring-offset-red-500`
- `ring-inset`
- `ring-op50`
- `ring-width-2`
- `ring-size-2`

不包含：

- `ring-offset`
- `ring-offset-op50`
- `ring-offset-opacity-50`
- `decoration-*`
- `underline-offset-*`

`ring-offset` 的 opacity 旧写法继续只作为非法样例保留，不在本轮强行设计迁移提示。

## 当前现状

当前实现位于 [src/_rules/ring.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/ring.ts)：

- `ring(?:-(.+))?` 同时负责默认宽度与 width arbitrary
- `ring-offset-(.+)` 同时承担 offset width 与 offset color
- `ring-(.+)` 颜色逻辑独立存在
- runtime 与 parity 目前主要通过 `ring / decoration` 混合测试约束

当前已知正式写法包括：

- `ring`
- `ring-2`
- `ring-[3px]`
- `ring-[#fff]`
- `ring-blue-500/50`
- `ring-opacity-50`
- `ring-offset-2`
- `ring-offset-[3px]`
- `ring-offset-red-500`
- `ring-inset`

当前已知必须拒绝或迁移的旧写法包括：

- `ring-offset`
- `ring-op50`
- `ring-width-2`
- `ring-size-2`
- `ring-offset-op50`
- `ring-offset-opacity-50`

其中高置信度迁移只覆盖：

- `ring-op50 -> ring-opacity-50`
- `ring-width-2 -> ring-2`
- `ring-size-2 -> ring-2`

## 设计原则

### 1. 只治理 ring，不把 decoration 一起拖进来

这一轮只建立 `ring` 专用模板，不顺手扩到 `decoration` 与 `underline-offset`。

### 2. 没有真实偏差就不改 runtime

`src/_rules/ring.ts` 当前实现已经基本对齐 Tailwind 3。  
本轮主要是模板化治理：fixture、专用测试、utility spec、blocklist migration 子集和过程文档。只有新测试暴露真实偏差时才修改运行时实现。

### 3. blocklist 只保留高置信度迁移

这组 blocklist 只覆盖明确可自动建议的旧写法：

- `ring-op50`
- `ring-width-*`
- `ring-size-*`

`ring-offset-op50` 与 `ring-offset-opacity-50` 先保留为非法 runtime/parity 样例，不进入 migration fixture。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-ring-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-ring-rewrite.ts)

至少包含：

- `canonical`
- `invalid`
- `semantic`

### 2. runtime / parity

新增 `ring` 专用测试入口：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

要求：

- 正向样例直接消费 `ringFixtures.canonical`
- 反向样例直接消费 `ringFixtures.invalid`
- 语义样例至少断言 `--un-ring-width`、`--un-ring-color`、`--un-ring-offset-width`、`--un-ring-offset-color`、`--un-ring-inset` 和 `box-shadow`

### 3. utility spec

在以下文件登记 `ring` family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

### 4. blocklist migration

为这组新增 ring 专用迁移子集：

- [test/fixtures/blocklist-migration.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/blocklist-migration.ts)
- [test/preset-tailwind3-blocklist-messages.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-messages.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-23-ring-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-ring-source-rewrite-log.md)
- [docs/2026-04-23-ring-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-ring-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)

## 风险与边界

- `ring-offset-(.+)` 同时吃 width 与 color，实施时必须靠 fixture 明确锁边界
- `ring` 与 `shadow` 都使用 box-shadow 变量，不能因为补 `ring` 模板误伤 `shadow`
- 如果不把 `ring` 从 `border / decoration` 混合测试中拆出来，后续仍很难看清 `ring` 自身的语法边界
