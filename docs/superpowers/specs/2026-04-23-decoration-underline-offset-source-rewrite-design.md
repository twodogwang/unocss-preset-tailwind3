# Decoration And Underline Offset Source Rewrite Design

状态日期：2026-04-23  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `decoration / underline-offset` 从当前与 `ring` 混合的测试段中拆出，纳入已经验证过的 source rewrite 模板：shared fixture、runtime、Tailwind parity、utility spec、blocklist migration 子集、过程日志和任务状态都单独落盘。

本轮目标只覆盖：

- `underline / overline / line-through / no-underline`
- `decoration-<thickness>`
- `decoration-[...]`
- `decoration-auto / decoration-from-font`
- `decoration-<style>`
- `decoration-<color>`
- `underline-offset-*`
- `decoration` 相关高置信度 blocklist migration

## 范围

包含：

- `underline`
- `overline`
- `line-through`
- `no-underline`
- `decoration-2`
- `decoration-[3px]`
- `decoration-auto`
- `decoration-from-font`
- `decoration-solid`
- `decoration-dashed`
- `decoration-wavy`
- `decoration-red-500`
- `decoration-[#fff]`
- `underline-offset-4`
- `underline-offset-[3px]`
- `decoration-none`
- `decoration-underline`
- `decoration-offset-4`
- `underline-2`
- `underline-[3px]`
- `underline-auto`
- `underline-dashed`
- `underline-wavy`

不包含：

- `text-decoration` 其他长期拆分主题
- `decoration-op50`
- `decoration-opacity-50`
- `ring-*`

`decoration-op50` 与 `decoration-opacity-50` 继续只作为非法样例保留，不在本轮强行设计迁移提示。

## 当前现状

当前实现位于 [src/_rules/decoration.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/decoration.ts)：

- `underline|overline|line-through` 走 line 规则
- `decoration-(.+)` 同时承担 thickness / style / color
- `underline-offset-(.+)` 独立处理 offset
- runtime 与 parity 目前主要通过 `ring / decoration` 混合测试约束

当前已知正式写法包括：

- `underline`
- `no-underline`
- `decoration-2`
- `decoration-[3px]`
- `decoration-auto`
- `decoration-from-font`
- `decoration-dashed`
- `decoration-wavy`
- `decoration-red-500`
- `decoration-[#fff]`
- `underline-offset-4`

当前已知必须拒绝或迁移的旧写法包括：

- `decoration-none`
- `decoration-underline`
- `decoration-offset-4`
- `decoration-op50`
- `decoration-opacity-50`
- `underline-2`
- `underline-[3px]`
- `underline-auto`
- `underline-dashed`
- `underline-wavy`

其中高置信度迁移覆盖：

- `decoration-none -> no-underline`
- `decoration-underline -> underline`
- `decoration-offset-4 -> underline-offset-4`
- `underline-2 -> decoration-2`
- `underline-[3px] -> decoration-[3px]`
- `underline-auto -> decoration-auto`
- `underline-dashed -> decoration-dashed`
- `underline-wavy -> decoration-wavy`

## 设计原则

### 1. 只治理 decoration / underline-offset

这一轮只建立 `decoration / underline-offset` 专用模板，不顺手扩到 `text-decoration` 其他子主题，也不再把 `ring` 一起拖回来。

### 2. 没有真实偏差就不改 runtime

`src/_rules/decoration.ts` 当前实现已经基本对齐 Tailwind 3。  
本轮主要是模板化治理：fixture、专用测试、utility spec、blocklist migration 子集和过程文档。只有新测试暴露真实偏差时才修改运行时实现。

### 3. blocklist 只保留高置信度迁移

这组 blocklist 只覆盖“旧写法 -> Tailwind 3 正式写法”一对一、稳定的映射。  
`decoration-op50` 与 `decoration-opacity-50` 由于无法给出不误导的 replacement，继续只保留为非法 runtime/parity 样例。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-decoration-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-decoration-rewrite.ts)

至少包含：

- `canonical`
- `invalid`
- `semantic`

### 2. runtime / parity

新增 `decoration` 专用测试入口：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

要求：

- 正向样例直接消费 `decorationFixtures.canonical`
- 反向样例直接消费 `decorationFixtures.invalid`
- 语义样例至少断言 `text-decoration-line`、`text-decoration-thickness`、`text-decoration-style`、`text-decoration-color`、`-webkit-text-decoration-color` 和 `text-underline-offset`

### 3. utility spec

在以下文件登记 `decoration` family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

### 4. blocklist migration

为这组新增 decoration 专用迁移子集：

- [src/blocklist.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/blocklist.ts)
- [test/fixtures/blocklist-migration.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/blocklist-migration.ts)
- [test/preset-tailwind3-blocklist-messages.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-messages.test.ts)
- [test/preset-tailwind3-blocklist-prefix-audit.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-prefix-audit.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-23-decoration-underline-offset-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-decoration-underline-offset-source-rewrite-log.md)
- [docs/2026-04-23-decoration-underline-offset-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-decoration-underline-offset-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)

## 风险与边界

- `decoration-(.+)` 同时承接 thickness / style / color，实施时必须靠 fixture 明确锁边界
- `underline-offset-*` 是独立路径，不能在补 `decoration` 时被 line/style 规则误吸收
- blocklist 的迁移提示如果给错，会误导用户从 line utility 跳到 thickness utility，因此只保留高置信度映射
