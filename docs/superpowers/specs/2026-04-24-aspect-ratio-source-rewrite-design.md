# Aspect Ratio Source Rewrite Design

状态日期：2026-04-24  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `aspect-ratio` 从 `src/_rules/size.ts` 里的宽匹配实现纳入 Tailwind 3 source rewrite 模板：shared fixture、runtime/parity、utility spec、blocklist 治理、独立过程文档，以及总表同步。

本轮目标是明确：

- `aspect-ratio` 只接受 Tailwind 3 官方的 `aspect-auto`、`aspect-square`、`aspect-video` 和 `aspect-[...]`
- 支持 `theme.extend.aspectRatio` 扩展 key，例如 `aspect-card`
- 移除 `aspect-ratio-*`、裸 ratio shorthand 与 `size-aspect-*` 这类历史别名的 runtime 误接纳
- 通过 blocklist 收口高置信度旧别名

## 范围

包含：

- `aspect-auto`
- `aspect-square`
- `aspect-video`
- `aspect-[4/3]`
- `aspect-[var(--ratio)]`
- `aspect-[calc(4/3)]`
- theme-driven key，例如 `aspect-card`
- 高置信度 migration，例如 `aspect-1/1 -> aspect-square`、`aspect-ratio-[4/3] -> aspect-[4/3]`

不包含：

- `size / width / height / min / max`
- `display`
- `object-fit` / `object-position`
- 非 Tailwind 3 的 `aspect-none` 或 `size-aspect-*` 扩展族

## 当前现状

当前实现位于 [src/_rules/size.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/size.ts)。

已确认的偏差：

- 当前 regex `^(?:size-)?aspect-(?:ratio-)?(.+)$` 会错误接受：
  - `aspect-1/1`
  - `aspect-16/9`
  - `aspect-4/3`
  - `aspect-ratio-auto`
  - `aspect-ratio-square`
  - `aspect-ratio-video`
  - `aspect-ratio-[4/3]`
  - `size-aspect-square`
- 当前 theme 没有 `aspectRatio`，因此 `aspect-card` 这类 Tailwind 3 扩展 key 无法匹配

通过本地 Tailwind 3.4/PostCSS 实测确认，官方支持：

- `aspect-auto`
- `aspect-square`
- `aspect-video`
- `aspect-[...]`
- `theme.extend.aspectRatio`

官方不支持上述历史别名或裸 ratio shorthand。

## 设计原则

### 1. 以 Tailwind core plugin 为唯一主源

runtime 只保留 `aspect-*` 正式入口，不再接受 `aspect-ratio-*` 或 `size-aspect-*` 的历史兼容写法。

### 2. 默认 key 与 theme extension 走同一入口

`auto`、`square`、`video` 进入默认 theme，运行时统一走 `theme.aspectRatio`，这样可以自然支持 `aspect-card` 这类用户扩展。

### 3. blocklist 只迁移高置信度旧别名

只迁移唯一目标明确的历史写法：

- `aspect-1/1 -> aspect-square`
- `aspect-16/9 -> aspect-video`
- `aspect-4/3 -> aspect-[4/3]`
- `aspect-ratio-auto -> aspect-auto`
- `aspect-ratio-square -> aspect-square`
- `aspect-ratio-video -> aspect-video`
- `aspect-ratio-[4/3] -> aspect-[4/3]`
- `size-aspect-square -> aspect-square`

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-aspect-ratio-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-aspect-ratio-rewrite.ts)

### 2. runtime / parity

更新：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. utility spec

登记 `aspect-ratio` family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

### 4. blocklist

新增 `aspect-ratio` migration 子集：

- [src/blocklist.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/blocklist.ts)
- [test/fixtures/blocklist-migration.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/blocklist-migration.ts)
- [test/preset-tailwind3-blocklist-messages.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-messages.test.ts)
- [test/preset-tailwind3-blocklist-prefix-audit.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-prefix-audit.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-24-aspect-ratio-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-24-aspect-ratio-source-rewrite-log.md)
- [docs/2026-04-24-aspect-ratio-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-24-aspect-ratio-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
