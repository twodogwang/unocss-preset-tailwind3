# Line Clamp Source Rewrite Design

状态日期：2026-04-23  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `line-clamp` 从当前 `src/_rules-wind3/line-clamp.ts` 的宽匹配实现收敛到 Tailwind 3 正式语法，并纳入 source rewrite 模板：shared fixture、runtime/parity、utility spec、blocklist 治理、独立过程文档，以及总表同步。

本轮目标是明确：

- `line-clamp` 在 Tailwind 3 中是官方 utility family
- 只接受正整数、`none` 和 arbitrary value 语义
- 不再放行 `line-clamp-0` 与裸 global keyword 变体

## 范围

包含：

- `line-clamp-1`
- `line-clamp-3`
- `line-clamp-6`
- `line-clamp-none`
- `line-clamp-[3]`
- `line-clamp-[var(--n)]`
- `line-clamp-[inherit]`
- `line-clamp-[calc(var(--n))]`
- `line-clamp-0`
- `line-clamp-inherit`
- `line-clamp-initial`
- `line-clamp-unset`
- `line-clamp-revert`
- `line-clamp-revert-layer`
- `line-clamp` 相关高置信度 blocklist migration

不包含：

- `text-shadow`
- `font-variant-numeric`

## 当前现状

当前实现位于 [src/_rules-wind3/line-clamp.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules-wind3/line-clamp.ts)：

- 旧实现支持 `line-clamp-<num>`
- 旧实现还额外放行了 `line-clamp-inherit|initial|unset|revert|revert-layer`
- 旧实现缺少 Tailwind 3 官方支持的 `line-clamp-[...]` arbitrary value
- 旧实现还把 `line-clamp-0` 当作有效值，而 Tailwind 3 不支持这个 shorthand

当前已知正式写法包括：

- `line-clamp-1`
- `line-clamp-3`
- `line-clamp-6`
- `line-clamp-none`
- `line-clamp-[3]`
- `line-clamp-[var(--n)]`
- `line-clamp-[inherit]`
- `line-clamp-[calc(var(--n))]`

当前已知必须拒绝或迁移的旧写法包括：

- `line-clamp-0`
- `line-clamp-inherit`
- `line-clamp-initial`
- `line-clamp-unset`
- `line-clamp-revert`
- `line-clamp-revert-layer`

其中高置信度迁移覆盖：

- `line-clamp-0 -> line-clamp-[0]`
- `line-clamp-inherit -> line-clamp-[inherit]`
- `line-clamp-initial -> line-clamp-[initial]`
- `line-clamp-unset -> line-clamp-[unset]`
- `line-clamp-revert -> line-clamp-[revert]`
- `line-clamp-revert-layer -> line-clamp-[revert-layer]`

## 设计原则

### 1. 对齐 Tailwind 3 官方边界

`line-clamp` 是官方 family，本轮不移除整族，而是精确对齐 Tailwind 3：

- 支持正整数
- 支持 `none`
- 支持 arbitrary value
- 拒绝 `0` shorthand
- 拒绝裸 global keyword

### 2. blocklist 只承接稳定的一对一迁移

`line-clamp-0` 与这些 global keyword 都能直接映射到 `line-clamp-[...]`，迁移关系稳定、可逆，因此纳入 blocklist migration。

### 3. 输出语义与 Tailwind plugin 保持一致

收口后输出只保留：

- `overflow`
- `display`
- `-webkit-box-orient`
- `-webkit-line-clamp`

不再额外写入非官方的 `line-clamp` 属性。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-line-clamp-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-line-clamp-rewrite.ts)

### 2. runtime / parity

新增 `line-clamp` 专用测试入口：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. utility spec

在以下文件登记 `line-clamp` family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

### 4. blocklist

为这组新增 `line-clamp` 专用治理：

- [src/blocklist.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/blocklist.ts)
- [test/fixtures/blocklist-migration.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/blocklist-migration.ts)
- [test/preset-tailwind3-blocklist-messages.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-messages.test.ts)
- [test/preset-tailwind3-blocklist-prefix-audit.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-prefix-audit.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-23-line-clamp-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-line-clamp-source-rewrite-log.md)
- [docs/2026-04-23-line-clamp-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-line-clamp-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
