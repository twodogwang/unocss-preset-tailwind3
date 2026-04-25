# Position Float Z Order Box Sizing Source Rewrite Design

状态日期：2026-04-25  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `position / inset leftovers / float / z / order / box-sizing` 从 [src/_rules/position.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/position.ts) 里的宽匹配实现纳入 Tailwind 3 source rewrite 模板：shared fixture、runtime/parity、utility spec、blocklist 治理、独立过程文档，以及总表同步。

本轮目标是明确：

- `position` 只接受 Tailwind 3 官方静态 utility：`static`、`fixed`、`absolute`、`relative`、`sticky`
- `order` 只接受 Tailwind 3 官方默认 key、`first/last/none`、`order-[...]` 与 `theme.extend.order`
- `z-index` 只接受 Tailwind 3 官方默认 key、`auto`、negative 变体、`z-[...]` 与 `theme.extend.zIndex`
- `float` / `clear` / `box-sizing` 只接受 Tailwind 3 官方静态 utility
- 移除 `order-999`、`z-inherit`、`float-inherit`、`box-inherit` 等 runtime 误接纳
- 通过 blocklist 收口高置信度旧别名

## 范围

包含：

- `static` / `fixed` / `absolute` / `relative` / `sticky`
- `order-1..12`、`order-first`、`order-last`、`order-none`、`order-[...]`
- `z-0|10|20|30|40|50`、`z-auto`、`-z-10`、`z-[...]`
- `float-*`
- `clear-*`
- `box-border` / `box-content`
- 高置信度 migration，例如 `pos-absolute -> absolute`、`z10 -> z-10`、`order2 -> order-2`

不包含：

- `inset` 主体 spacing 语义
- `justify / align / place / flexGridJustifiesAlignments`
- `container`
- `columns`

## 当前现状

当前实现位于 [src/_rules/position.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/position.ts)。

已确认的偏差：

- `order` 当前会错误接受裸数字，例如 `order-999`
- `z-index` 当前会错误接受 global keyword，例如 `z-inherit`、`z-initial`
- `float` / `clear` / `box-sizing` 当前通过 `makeGlobalStaticRules` 错误接受：
  - `float-inherit`
  - `clear-inherit`
  - `box-inherit`
  - `box-initial`
- 当前没有为 `order2`、`z10` 这类高置信度旧别名提供明确迁移提示

通过本地 Tailwind 3.4 主源 `node_modules/tailwindcss/lib/corePlugins.js`、`node_modules/tailwindcss/stubs/config.full.js` 与运行时实测确认：

- `order` 默认 key 只有 `1..12`、`first`、`last`、`none`
- `zIndex` 默认 key 只有 `auto`、`0`、`10`、`20`、`30`、`40`、`50`
- `float` / `clear` / `box-sizing` 都只有静态 utility，不支持 global keyword

## 设计原则

### 1. 以 Tailwind core plugin 与默认 theme 为唯一主源

runtime 只保留 Tailwind 3 官方静态语义、默认 key、theme key 与 bracket arbitrary，不再接受 global keyword 或裸数字扩展。

### 2. 只治理当前 family 自己的误接纳

`inset` 主体已在 earlier family 治理完成，本轮不重复覆盖；这里只处理 `position.ts` 里同族的 position、order、z、float/clear、box-sizing strictness。

### 3. blocklist 只迁移高置信度旧别名

只迁移目标唯一明确的历史写法：

- `pos-absolute -> absolute`
- `z10 -> z-10`
- `order2 -> order-2`

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-position-float-z-order-box-sizing-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-position-float-z-order-box-sizing-rewrite.ts)

### 2. runtime / parity

更新：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. utility spec

登记 family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

### 4. blocklist

新增 migration 子集：

- [src/blocklist.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/blocklist.ts)
- [test/fixtures/blocklist-migration.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/blocklist-migration.ts)
- [test/preset-tailwind3-blocklist-messages.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-messages.test.ts)
- [test/preset-tailwind3-blocklist-prefix-audit.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-prefix-audit.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-25-position-float-z-order-box-sizing-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-25-position-float-z-order-box-sizing-source-rewrite-log.md)
- [docs/2026-04-25-position-float-z-order-box-sizing-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-25-position-float-z-order-box-sizing-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
