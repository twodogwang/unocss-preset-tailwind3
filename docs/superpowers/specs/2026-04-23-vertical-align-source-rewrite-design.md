# Vertical Align Source Rewrite Design

状态日期：2026-04-23  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `vertical-align` 主规则族从当前 `src/_rules/align.ts` 的宽匹配实现中拆出，纳入已经稳定的 source rewrite 模板：shared fixture、runtime、Tailwind parity、utility spec、blocklist migration 子集，以及独立的过程文档与总表同步。

本轮目标只覆盖：

- `align-baseline`
- `align-top`
- `align-middle`
- `align-bottom`
- `align-text-top`
- `align-text-bottom`
- `align-sub`
- `align-super`
- `align-[4px]`
- `vertical-align` 相关高置信度 blocklist migration

## 范围

包含：

- `align-baseline`
- `align-top`
- `align-middle`
- `align-bottom`
- `align-text-top`
- `align-text-bottom`
- `align-sub`
- `align-super`
- `align-[4px]`
- `vertical-baseline`
- `v-baseline`
- `align-base`
- `align-mid`
- `align-btm`
- `align-start`
- `align-end`
- `align-10px`

不包含：

- `text-align`
- `align-(--my-alignment)`
- `align-inherit`
- `vertical-align` 以外的 layout align utilities

## 当前现状

当前实现位于 [src/_rules/align.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/align.ts)：

- 旧实现通过 `^(?:vertical|align|v)-(.+)$` 同时接纳正式入口和历史别名
- 当前会错误放行 `vertical-*`、`v-*`、`align-base|mid|btm|start|end`、`align-inherit` 与裸长度 `align-10px`
- runtime 与 parity 之前没有 `vertical-align` 专用模板

当前已知正式写法包括：

- `align-baseline`
- `align-top`
- `align-middle`
- `align-bottom`
- `align-text-top`
- `align-text-bottom`
- `align-sub`
- `align-super`
- `align-[4px]`

当前已知必须拒绝或迁移的旧写法包括：

- `vertical-baseline`
- `v-baseline`
- `align-base`
- `align-mid`
- `align-btm`
- `align-start`
- `align-end`
- `align-inherit`
- `align-10px`
- `align-(--my-alignment)`

其中高置信度迁移覆盖：

- `vertical-baseline -> align-baseline`
- `v-baseline -> align-baseline`
- `align-base -> align-baseline`
- `align-mid -> align-middle`
- `align-btm -> align-bottom`
- `align-start -> align-top`
- `align-end -> align-bottom`
- `align-10px -> align-[10px]`

## 设计原则

### 1. vertical-align 只治理自身

这一轮只建立 `vertical-align` 专用模板，不顺手把 `text-decoration` 或其他 typography family 一并并入。

### 2. 保留官方 `align-[...]`，拒绝裸长度

Tailwind 3 正式支持 `align-[4px]` 这类 bracket arbitrary value。  
本轮要收紧的是裸长度 `align-10px`，不是 arbitrary value 本身。

### 3. blocklist 只保留高置信度迁移

这组 blocklist 只覆盖可以无歧义迁移到正式语法的旧写法：

- `vertical-*`
- `v-*`
- `align-base|mid|btm|start|end`
- `align-10px`

`align-inherit` 与 `align-(--my-alignment)` 不提供 replacement，只保留为非法样例。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-vertical-align-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-vertical-align-rewrite.ts)

至少包含：

- `canonical`
- `invalid`
- `semantic`

### 2. runtime / parity

新增 `vertical-align` 专用测试入口：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. utility spec

在以下文件登记 `vertical-align` family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

### 4. blocklist migration

为这组新增 `vertical-align` 专用迁移子集：

- [test/fixtures/blocklist-migration.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/blocklist-migration.ts)
- [test/preset-tailwind3-blocklist-messages.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-messages.test.ts)
- [test/preset-tailwind3-blocklist-prefix-audit.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-prefix-audit.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-23-vertical-align-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-vertical-align-source-rewrite-log.md)
- [docs/2026-04-23-vertical-align-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-vertical-align-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
