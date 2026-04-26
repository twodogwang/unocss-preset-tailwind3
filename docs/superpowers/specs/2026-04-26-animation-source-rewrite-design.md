# Animation Source Rewrite Design

状态日期：2026-04-26  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `animation` 纳入 Tailwind 3 source rewrite 模板：shared fixture、runtime/parity、Tailwind-style theme 语义、utility spec、独立过程文档，以及总表同步。

本轮目标是明确：

- `animate-*` 只接受 Tailwind 3 官方 `theme.animation` key、`animate-none` 与 bracket arbitrary value
- `theme.keyframes` 改为根级入口，而不是仓库私有的 `theme.animation.keyframes`
- prefix 模式下生成的 `@keyframes` 名称和 `animation` 声明都与 Tailwind 一样带上 prefix
- `animate-inherit`、`animate-initial`、`animate-revert` 这类 global keyword shortcut 被 runtime 拒绝

## 范围

包含：

- `animate-none`
- `animate-spin`
- `animate-ping`
- `animate-pulse`
- `animate-bounce`
- `animate-[...]`
- root `theme.animation`
- root `theme.keyframes`
- prefix 下的 keyframe 重写

不包含：

- `appearance`
- `transition`
- 旧 animation alias 的自动 migration replacement

## 当前现状

当前实现位于 [src/_rules-wind3/animation.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules-wind3/animation.ts) 与 [src/theme.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/theme.ts)。

已确认的偏差：

- runtime 仍依赖仓库自定义的 `theme.animation.keyframes/durations/timingFns/counts` 结构，而不是 Tailwind 官方的根级 `theme.animation` 与 `theme.keyframes`
- prefix 模式下，生成的 `@keyframes` 名称不会像 Tailwind 一样附带 prefix
- `animate-inherit`、`animate-initial`、`animate-revert` 这类 global keyword 被错误接纳

通过本地 Tailwind 3.4 主源 `node_modules/tailwindcss/lib/corePlugins.js` 与 `node_modules/tailwindcss/stubs/config.full.js` 确认：

- animation core plugin 只从 `theme.animation` 读取 utility value
- keyframes 从根级 `theme.keyframes` 读取
- prefix 开启时，Tailwind 会同时重写生成的 keyframe 名和 `animation` 声明里的动画名
- 官方默认动画 key 只有 `none / spin / ping / pulse / bounce`

## 设计原则

### 1. theme 结构对齐 Tailwind，而不是保留仓库私有 DSL

rewrite 目标是以 Tailwind 3 正式语义为唯一标准，因此 animation theme 配置也要向官方结构收敛。

### 2. prefix 语义必须端到端一致

不仅 selector 要带 prefix，`@keyframes` 与 `animation` value 中的动画名也要同步重写，否则与 Tailwind 输出不一致。

### 3. 不为歧义旧写法提供迁移提示

`animate-duration-*`、`animate-ease-*`、`keyframes-*` 这类历史写法不是单义映射，继续保留 raw blocklist 拒绝，不升级成 migration replacement。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-animation-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-animation-rewrite.ts)

### 2. runtime / parity

更新：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. runtime / theme

更新：

- [src/_rules-wind3/animation.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules-wind3/animation.ts)
- [src/theme.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/theme.ts)
- [src/_theme/types.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_theme/types.ts)

### 4. utility spec

登记 family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-26-animation-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-26-animation-source-rewrite-log.md)
- [docs/2026-04-26-animation-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-26-animation-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
- [docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md)
