# Text Wrap Text Overflow Text Transform Source Rewrite Design

状态日期：2026-04-23  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `text-wrap / text-overflow / text-transform` 主规则族从当前 `src/_rules/static.ts` 的混合静态规则中拆出，纳入已经稳定的 source rewrite 模板：shared fixture、runtime、Tailwind parity、utility spec、blocklist migration 子集，以及独立的过程文档与总表同步。

本轮目标只覆盖：

- `truncate`
- `text-ellipsis`
- `text-clip`
- `text-wrap`
- `text-nowrap`
- `text-balance`
- `text-pretty`
- `uppercase`
- `lowercase`
- `capitalize`
- `normal-case`
- `text-wrap / text-overflow / text-transform` 相关高置信度 blocklist migration

## 范围

包含：

- `truncate`
- `text-ellipsis`
- `text-clip`
- `text-wrap`
- `text-nowrap`
- `text-balance`
- `text-pretty`
- `uppercase`
- `lowercase`
- `capitalize`
- `normal-case`
- `text-truncate`
- `case-upper`
- `case-lower`
- `case-capital`
- `case-normal`

不包含：

- `white-space`
- `break-*`
- `hyphens-*`
- `tab-size`
- `line-clamp`

## 当前现状

当前实现位于 [src/_rules/static.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/static.ts)：

- `text-wrap / text-overflow` 的正式 Tailwind 3 入口已经存在
- `text-transform` 之前错误使用了 `case-*` 入口，没有支持 `uppercase / lowercase / capitalize / normal-case`
- `text-overflow` 之前还错误放行了 `text-truncate`
- runtime 与 parity 之前没有这一规则族的专用模板

当前已知正式写法包括：

- `truncate`
- `text-ellipsis`
- `text-clip`
- `text-wrap`
- `text-nowrap`
- `text-balance`
- `text-pretty`
- `uppercase`
- `lowercase`
- `capitalize`
- `normal-case`

当前已知必须拒绝或迁移的旧写法包括：

- `text-truncate`
- `case-upper`
- `case-lower`
- `case-capital`
- `case-normal`

其中高置信度迁移覆盖：

- `text-truncate -> truncate`
- `case-upper -> uppercase`
- `case-lower -> lowercase`
- `case-capital -> capitalize`
- `case-normal -> normal-case`

## 设计原则

### 1. 只治理 text-wrap / text-overflow / text-transform

这一轮只建立这三个子主题的专用模板，不顺手把 `white-space / breaks / hyphens` 或 `tab-size / line-clamp` 一并并入。

### 2. 没有真实偏差就不动无关静态规则

本轮只修复探针已经证明的偏差：

- 增加 `uppercase / lowercase / capitalize / normal-case`
- 去掉 `case-*`
- 去掉 `text-truncate`

`white-space`、`break-*`、`hyphens-*` 继续留给后续 family。

### 3. blocklist 只保留高置信度迁移

这组 blocklist 只覆盖可以无歧义迁移到正式 Tailwind 3 语法的旧写法：

- `text-truncate`
- `case-upper`
- `case-lower`
- `case-capital`
- `case-normal`

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-text-wrap-overflow-transform-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-text-wrap-overflow-transform-rewrite.ts)

### 2. runtime / parity

新增 `text-wrap / text-overflow / text-transform` 专用测试入口：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. utility spec

在以下文件登记这一 family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

### 4. blocklist migration

为这组新增专用迁移子集：

- [src/blocklist.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/blocklist.ts)
- [test/fixtures/blocklist-migration.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/blocklist-migration.ts)
- [test/preset-tailwind3-blocklist-messages.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-messages.test.ts)
- [test/preset-tailwind3-blocklist-prefix-audit.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-prefix-audit.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-23-text-wrap-text-overflow-text-transform-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-text-wrap-text-overflow-text-transform-source-rewrite-log.md)
- [docs/2026-04-23-text-wrap-text-overflow-text-transform-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-text-wrap-text-overflow-text-transform-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
