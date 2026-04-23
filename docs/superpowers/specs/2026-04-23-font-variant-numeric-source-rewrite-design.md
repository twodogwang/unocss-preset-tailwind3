# Font Variant Numeric Source Rewrite Design

状态日期：2026-04-23  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `font-variant-numeric` 从当前 `src/_rules-wind3/typography.ts` 的散落实现纳入 source rewrite 模板：shared fixture、runtime/parity、utility spec、blocklist 治理、独立过程文档，以及总表同步。

本轮目标是明确：

- `font-variant-numeric` 在 Tailwind 3 中是官方 utility family
- 当前 runtime 已基本与 Tailwind 3 一致，本轮主要补齐模板化治理链路
- 通过 blocklist 收口一组高置信度旧别名

## 范围

包含：

- `normal-nums`
- `ordinal`
- `slashed-zero`
- `lining-nums`
- `oldstyle-nums`
- `proportional-nums`
- `tabular-nums`
- `diagonal-fractions`
- `stacked-fractions`
- `nums-normal`
- `numeric-ordinal`
- `numeric-slashed-zero`
- `numeric-lining`
- `numeric-oldstyle`
- `numeric-proportional`
- `numeric-tabular`
- `fractions-diagonal`
- `fractions-stacked`
- `font-variant-numeric` 相关高置信度 blocklist migration

不包含：

- `numeric-[...]` 这类探针噪音写法
- `size / width / height / min / max`

## 当前现状

当前实现位于 [src/_rules-wind3/typography.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules-wind3/typography.ts)：

- 已实现 Tailwind 3 官方的 9 个 numeric feature utility
- 输出结构与 Tailwind core plugin 一致，只是内部变量名使用 `--un-*`
- 当前缺的是专用 fixture、专用 runtime/parity、utility spec、blocklist migration 子集，以及完整文档链路

通过直接检查 Tailwind 源码 [corePlugins.js](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/node_modules/tailwindcss/src/corePlugins.js) 可确认，官方只声明了以下 static utilities：

- `normal-nums`
- `ordinal`
- `slashed-zero`
- `lining-nums`
- `oldstyle-nums`
- `proportional-nums`
- `tabular-nums`
- `diagonal-fractions`
- `stacked-fractions`

当前已知必须拒绝或迁移的旧写法包括：

- `nums-normal`
- `numeric-ordinal`
- `numeric-slashed-zero`
- `numeric-lining`
- `numeric-oldstyle`
- `numeric-proportional`
- `numeric-tabular`
- `fractions-diagonal`
- `fractions-stacked`
- `font-variant-numeric-normal`
- `font-variant-numeric-ordinal`
- `tabular`
- `oldstyle`

其中高置信度迁移覆盖：

- `nums-normal -> normal-nums`
- `numeric-ordinal -> ordinal`
- `numeric-slashed-zero -> slashed-zero`
- `numeric-lining -> lining-nums`
- `numeric-oldstyle -> oldstyle-nums`
- `numeric-proportional -> proportional-nums`
- `numeric-tabular -> tabular-nums`
- `fractions-diagonal -> diagonal-fractions`
- `fractions-stacked -> stacked-fractions`

## 设计原则

### 1. 以 Tailwind core plugin 为唯一主源

这轮不再凭“语义上可能合理”来放宽支持面。  
只接受 Tailwind core plugin 明确定义的 9 个 utilities。

### 2. runtime 不做不必要改动

当前 runtime 已经和官方语义边界一致。  
本轮重点是把它纳入统一治理模板，而不是制造无意义的实现抖动。

### 3. blocklist 只收敛高置信度旧别名

只对一眼能看出唯一目标类名的旧别名给 replacement。  
像 `tabular`、`oldstyle` 这种过短词，不做自动迁移，避免误伤其他语义。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-font-variant-numeric-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-font-variant-numeric-rewrite.ts)

### 2. runtime / parity

新增 `font-variant-numeric` 专用测试入口：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. utility spec

在以下文件登记 `font-variant-numeric` family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

### 4. blocklist

为这组新增 `font-variant-numeric` 专用治理：

- [src/blocklist.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/blocklist.ts)
- [test/fixtures/blocklist-migration.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/blocklist-migration.ts)
- [test/preset-tailwind3-blocklist-messages.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-messages.test.ts)
- [test/preset-tailwind3-blocklist-prefix-audit.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-prefix-audit.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-23-font-variant-numeric-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-font-variant-numeric-source-rewrite-log.md)
- [docs/2026-04-23-font-variant-numeric-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-font-variant-numeric-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
