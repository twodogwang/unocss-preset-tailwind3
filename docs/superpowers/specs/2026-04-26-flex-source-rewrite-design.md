# Flex Source Rewrite Design

状态日期：2026-04-26  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `flex` 纳入 Tailwind 3 source rewrite 模板：shared fixture、runtime/parity、utility spec、blocklist 治理、独立过程文档，以及总表同步。

本轮目标是明确：

- `flex` / `inline-flex` / `flex-*` shorthand 只接受 Tailwind 3 官方语义
- `grow` / `shrink` 支持 Tailwind 3 的默认值、bracket arbitrary 与 `theme.flexGrow` / `theme.flexShrink`
- `basis-*` 支持 Tailwind 3 默认 `flexBasis` key、fraction、arbitrary value 与 `theme.flexBasis`
- 通过 blocklist 收口高置信度旧别名：`flex-inline`、`flex-basis-*`

## 范围

包含：

- `flex`
- `inline-flex`
- `flex-{1|auto|initial|none}`
- `flex-[...]`
- `grow` / `grow-0` / `grow-[...]` / `theme.flexGrow`
- `shrink` / `shrink-0` / `shrink-[...]` / `theme.flexShrink`
- `basis-*`
- `flex-row` / `flex-col` / `flex-wrap*`

不包含：

- `grid`
- `justify / align / place`
- `transform`

## 当前现状

当前实现位于 [src/_rules/flex.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/flex.ts)。

已确认的偏差：

- `grow` / `shrink` 只支持默认 `1` 与 `0`，不支持 bracket arbitrary
- `grow-*` / `shrink-*` 不读取 theme key
- `basis-*` 只走 spacing / fraction / auto，不读取 `theme.flexBasis`
- 默认 theme 没有 `flexBasis` / `flexGrow` / `flexShrink` 类型与基线 key
- blocklist 里 `flex-inline` / `flex-basis-*` 仍是 raw 拦截，没有迁移提示

通过本地 Tailwind 3.4 主源 `node_modules/tailwindcss/lib/corePlugins.js`、`node_modules/tailwindcss/stubs/config.full.js` 与运行时实测确认：

- `grow-[2]` / `shrink-[2]` 属于合法 arbitrary value
- `grow-2` / `shrink-2` 默认不合法，但在 `theme.extend.flexGrow` / `theme.extend.flexShrink` 下合法
- `basis-full` 属于默认 `theme.flexBasis`
- `basis-sidebar` 在 `theme.extend.flexBasis` 下合法

## 设计原则

### 1. 以 Tailwind core plugin 与默认 theme 为唯一主源

`flexGrow`、`flexShrink`、`flexBasis` 的默认 key 和 theme 扩展语义直接对齐 Tailwind 3.4。

### 2. grow / shrink 不接受裸数字扩展

`grow-2` / `shrink-2` 只有在 theme key 存在时才成立；默认只接受 `grow`、`grow-0`、`shrink`、`shrink-0` 与 bracket arbitrary。

### 3. blocklist 只收单义别名

只收可以稳定改写到官方类名、且不会与 Tailwind 官方长写法冲突的 `flex-inline`、`flex-basis-*`。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-flex-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-flex-rewrite.ts)

### 2. runtime / parity

更新：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. runtime / theme

更新：

- [src/_rules/flex.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/flex.ts)
- [src/_theme/default.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_theme/default.ts)
- [src/_theme/misc.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_theme/misc.ts)
- [src/_theme/size.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_theme/size.ts)
- [src/_theme/types.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_theme/types.ts)

### 4. utility spec

登记 family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

### 5. blocklist

新增 migration 子集：

- [src/blocklist.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/blocklist.ts)
- [test/fixtures/blocklist-migration.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/blocklist-migration.ts)
- [test/preset-tailwind3-blocklist-messages.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-messages.test.ts)
- [test/preset-tailwind3-blocklist-prefix-audit.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-prefix-audit.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-26-flex-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-26-flex-source-rewrite-log.md)
- [docs/2026-04-26-flex-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-26-flex-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
- [docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md)
