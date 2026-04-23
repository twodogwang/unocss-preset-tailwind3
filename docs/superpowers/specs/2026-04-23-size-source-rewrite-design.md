# Size Source Rewrite Design

状态日期：2026-04-23  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `size / width / height / min / max` 从综合测试里的零散覆盖纳入 Tailwind 3 source rewrite 模板：shared fixture、runtime/parity、utility spec、blocklist 治理、独立过程文档，以及总表同步。

本轮目标是明确：

- `src/_rules/size.ts` 只接受 Tailwind CSS 3.4 官方尺寸语法
- 默认 theme 不再把 container size key 泄漏到 `w-*`、`h-*`、`min-*` 或 `max-h-*`
- `size-*` 是独立 core plugin，只接受 spacing/fraction、`auto`、`full`、`min`、`max`、`fit` 和 arbitrary value，不继承 viewport 或 screen breakpoint key
- 高置信度旧写法通过 blocklist 给出迁移提示

## 范围

包含：

- `w-*` / `h-*`
- `min-w-*` / `min-h-*`
- `max-w-*` / `max-h-*`
- `size-*`
- bracket arbitrary value，例如 `w-[100px]`、`size-[32rem]`
- Tailwind 3.4 viewport key，例如 `w-svw`、`h-dvh`、`min-h-svh`、`max-h-dvh`
- `max-w-screen-*`
- 高置信度 migration，例如 `w4 -> w-4`、`minw0 -> min-w-0`、`w-100px -> w-[100px]`

不包含：

- `aspect-ratio`
- `display`
- layout / position 其余 wave_3 family
- 非官方 logical size aliases，例如 `inline-*`、`block-*`

## 当前现状

当前实现位于 [src/_rules/size.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/size.ts)。

已确认的偏差：

- 缺少 `svw` / `lvw` / `dvw` 和 `svh` / `lvh` / `dvh`
- 错误接受 `w-xs`、`h-sm`、`min-w-none`、`min-h-none`、`max-h-xs`
- 错误接受 `w-screen-md`、`min-w-screen-md`、`h-screen-sm`、`min-h-screen-sm`
- 错误接受 `size-screen`、`size-min-4`、`size-max-4`

通过本地 Tailwind 3.4/PostCSS 实测确认，官方支持 `max-w-screen-md`，但不支持 `w-screen-md`、`min-w-screen-md`、`max-w-screen`。

## 设计原则

### 1. 分离 width / height / min / max / size 的默认 key

`max-w-*` 可以使用 container size key 和 breakpoint screen key；`w-*` / `h-*` / `min-*` / `max-h-*` 不能继承这些 key。

### 2. `size-*` 不复用 `w-*` 和 `h-*` 的 viewport key

Tailwind 3.4 的 `size-*` 不是 `w-*` + `h-*` 的无条件并集。  
它接受 spacing、fraction、`auto`、`full`、`min`、`max`、`fit` 与 arbitrary value，但不接受 `screen`、`svw` 或 `dvh`。

### 3. blocklist 只迁移高置信度写法

迁移提示只覆盖唯一目标明确的旧写法：

- compact shorthand: `w4`、`h10`、`minw0`、`maxhfull`
- bare raw values: `w-100px`、`max-h-400px`、`min-w-20ch`、`size-32rem`

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-size-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-size-rewrite.ts)

### 2. runtime / parity

更新：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. utility spec

登记 `size` family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

### 4. blocklist

新增 size migration 子集：

- [src/blocklist.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/blocklist.ts)
- [test/fixtures/blocklist-migration.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/blocklist-migration.ts)
- [test/preset-tailwind3-blocklist-messages.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-messages.test.ts)
- [test/preset-tailwind3-blocklist-prefix-audit.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-prefix-audit.test.ts)

## 文档与总表

新增并同步：

- [docs/2026-04-23-size-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-size-source-rewrite-log.md)
- [docs/2026-04-23-size-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-size-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
