# Container Source Rewrite Design

状态日期：2026-04-25  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `container` 纳入 Tailwind 3 source rewrite 模板：shared fixture、runtime/parity、utility spec、独立过程文档，以及总表同步。

本轮目标是明确：

- `container` 只接受 Tailwind 3 官方的 `container` 与响应式变体
- `theme.container` 对齐 Tailwind 3.4 的 `screens` / `center` / `padding` 语义
- `container-normal` / `container-size` / `container-inline-size` 等后缀类名不进入默认暴露面
- `@container` query class 不属于当前 preset 主入口的默认暴露面

## 范围

包含：

- `container`
- `sm:container`
- `md:container`
- `lg:container`
- `max-md:container`
- `theme.container.screens`
- `theme.container.center`
- `theme.container.padding`

不包含：

- `@container`
- `@container/<name>`
- `container queries` 扩展语法
- `columns`
- `table display / caption / collapse`

## 当前现状

当前主入口使用 [src/_rules-wind3/container.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules-wind3/container.ts) 与 [src/shortcuts.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/shortcuts.ts) 生成 `container`。

已确认的偏差：

- 旧实现把 `container` 依赖于断点 shortcut 展开，导致 `theme.container.screens` 无法覆盖官方行为
- 旧 theme 类型仍使用 `container.maxWidth`，与 Tailwind 3.4 的 `container.screens` 不一致

通过本地 Tailwind 3.4 主源 `node_modules/tailwindcss/lib/corePlugins.js` 与运行时实测确认：

- `container` core plugin 读取的是 `theme('container.screens', theme('screens'))`
- `container.padding` 只映射 `DEFAULT` 与当前 `container.screens` 命名断点
- 默认包不提供 `container-normal` / `container-size` / `container-inline-size`
- 默认包不提供 `@container` query class

## 设计原则

### 1. 以 Tailwind core plugin 为唯一主源

`container` 输出直接对齐 Tailwind 3.4 core plugin，而不是沿用历史 shortcut 展开推导。

### 2. shortcut 只保留语法入口，不承载断点语义

`container` shortcut 收敛为单一 `container -> __container`，响应式包装交给现有 variants 机制处理。

### 3. 不强行补 blocklist

当前没有足够高置信度且唯一明确的旧 `container` 别名，因此本轮不新增 blocklist migration 子集，只在文档里明确这一点。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-container-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-container-rewrite.ts)

### 2. runtime / parity

更新：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. runtime / theme

更新：

- [src/_rules-wind3/container.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules-wind3/container.ts)
- [src/shortcuts.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/shortcuts.ts)
- [src/_theme/types.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_theme/types.ts)

### 4. utility spec

登记 family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-25-container-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-25-container-source-rewrite-log.md)
- [docs/2026-04-25-container-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-25-container-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
- [docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md)
