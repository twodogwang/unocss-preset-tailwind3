# Background Color And Bg Opacity Source Rewrite Design

状态日期：2026-04-22  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `background-color / bg-opacity` 从当前 `background` 混合测试段中拆出，纳入已经验证过的 source rewrite 模板：shared fixture、runtime、Tailwind parity、utility spec、blocklist migration、过程日志和任务状态都单独落盘。

本轮目标不是把整个 `background` 一次性重写，而是只完成：

- `bg-<color>`
- `bg-[#fff]`
- `bg-red-500/50` 这类颜色 alpha slash
- `bg-opacity-*`
- `background-color / bg-opacity` 相关 blocklist migration
- 过程文档与总表同步

## 范围

包含：

- `bg-red-500`
- `bg-red-500/50`
- `bg-[#fff]`
- `bg-opacity-50`
- 主题扩展下的 `bg-brand`
- `bg-#fff`
- `bg-op50`
- `bg-op-50`
- `bg-red500`

不包含：

- `bg-cover`
- `bg-center`
- `bg-no-repeat`
- `bg-fixed`
- `bg-clip-*`
- `bg-origin-*`
- `bg-gradient-*`
- `bg-[url(...)]`
- `bg-[length:...]`
- `bg-[position:...]`

这些继续留给下一组 `background-style / gradient / clip / origin / repeat / position`。

## 当前现状

当前实现位于 [src/_rules/color.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/color.ts)：

- `bg-(.+)` 仍同时承接背景色和一部分背景样式 arbitrary 分发
- `bg-opacity-(.+)` 已有独立入口
- runtime 和 parity 当前只在混合 `background` / `color` 测试段里约束，没有形成 background-color 专用模板

当前已知应继续成立的正式写法：

- `bg-red-500`
- `bg-red-500/50`
- `bg-[#fff]`
- `bg-opacity-50`
- 主题扩展下的 `bg-brand`

当前已知必须拒绝或迁移的旧写法：

- `bg-#fff`
- `bg-red500`
- `bg-op50`
- `bg-op-50`
- `bgred500`

其中高置信度迁移只覆盖：

- `bg-#fff -> bg-[#fff]`
- `bg-op50 -> bg-opacity-50`
- `bg-op-50 -> bg-opacity-50`

`bg-red500` 和 `bgred500` 暂不提供迁移提示，只作为反向样例保留。

## 设计原则

### 1. 只拆出 color / opacity，不提前碰 background-style

这一轮不去重构 `bg-cover`、`bg-gradient-to-r`、`bg-[url(...)]` 等背景样式路径，只把 `background-color / bg-opacity` 从测试、文档和规则清单上单独立项。

### 2. 没有真实偏差就不强改 runtime

`bg-*` 颜色和 `bg-opacity-*` 当前实现已基本符合 Tailwind 3。  
本轮主工作放在模板化治理：fixture、专用测试、utility spec、blocklist 子集和过程文档。只有新测试暴露真实偏差时才回头修改运行时实现。

### 3. blocklist 只保留高置信度迁移

这组 blocklist 只覆盖明确、可自动建议的老写法：

- hex alias
- `bg-op*` opacity alias

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-background-color-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-background-color-rewrite.ts)

至少包含：

- `canonical`
- `invalid`
- `semantic`

建议样例：

```ts
export const backgroundColorFixtures = {
  canonical: [
    'bg-red-500',
    'bg-red-500/50',
    'bg-[#fff]',
    'bg-opacity-50',
  ],
  invalid: [
    'bg-#fff',
    'bg-red500',
    'bg-op50',
    'bg-op-50',
    'bgred500',
  ],
  semantic: [
    'bg-red-500',
    'bg-red-500/50',
    'bg-[#fff]',
    'bg-opacity-50',
    'bg-brand',
  ],
} as const
```

### 2. runtime / parity

新增 background-color 专用测试入口：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

要求：

- 正向样例直接消费 `backgroundColorFixtures.canonical`
- 反向样例直接消费 `backgroundColorFixtures.invalid`
- 主题扩展下用 `bg-brand` 补一条语义级断言

### 3. utility spec

在以下文件登记 `background-color` family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

## 4. blocklist migration

为这组新增 background-color 专用迁移子集：

- [test/fixtures/blocklist-migration.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/blocklist-migration.ts)
- [test/preset-tailwind3-blocklist-messages.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-messages.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-22-background-color-bg-opacity-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-background-color-bg-opacity-source-rewrite-log.md)
- [docs/2026-04-22-background-color-bg-opacity-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-background-color-bg-opacity-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)

## 风险与边界

- `src/_rules/color.ts` 当前仍混入背景样式 arbitrary 路径，本轮不要顺手把 style family 一起改掉
- `background-color` family 如果只改文档不补专用 fixture，后续仍会退回到混合测试状态
- 主题扩展样例要分别对齐 Uno config 和 Tailwind config，避免只测到一边
