# Tailwind 源头重写整体状态

状态日期：2026-04-23  
当前分支：`codex/tailwind3-source-rewrite`

> 这份文档用于说明整体推进状态，不是唯一实时入口。  
> 当前实时状态入口请查看：
> [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)

## 当前任务目标

当前主线任务不是继续零散修补个别类名，而是把 Tailwind 3 源头重写推进成可持续维护的规则族治理流程：

- 每个 utility 以 Tailwind 3 正式语法为唯一标准
- 非 Tailwind 3 写法通过运行时拒绝或 blocklist 迁移提示收口
- utility 级文档与整体任务状态同步更新

当前需要额外说明的是：

- 第一阶段主线 utility 已完成
- 但“全规则族 Tailwind 3 rewrite”尚未完成
- 完整剩余范围现已单独记录在：
  [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)

## 当前源头重写状态

### 已完成 utility

- `border`
- `outline`
- `text`
- `leading`
- `tracking`
- `stroke`
- `spacing`
- `behavior`

## 已完成的配套治理

- 总需求文档已进入 git
- `outline`、`text`、`leading`、`tracking`、`stroke` 与 `spacing` 的 spec / plan / log / status 已进入 git
- `border` 当前已有的计划文档已进入 git
- 已建立整体任务总入口，用统一 manifest 表维护 utility 状态与文档链接

## 第二阶段里程碑

- `background-color / bg-opacity` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-22-background-color-bg-opacity-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-22-background-color-bg-opacity-source-rewrite.md`
  - `docs/2026-04-22-background-color-bg-opacity-source-rewrite-log.md`
  - `docs/2026-04-22-background-color-bg-opacity-source-rewrite-status.md`
- `background-style / gradient / clip / origin / repeat / position` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-23-background-style-gradient-clip-origin-repeat-position-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-23-background-style-gradient-clip-origin-repeat-position-source-rewrite.md`
  - `docs/2026-04-23-background-style-gradient-clip-origin-repeat-position-source-rewrite-log.md`
  - `docs/2026-04-23-background-style-gradient-clip-origin-repeat-position-source-rewrite-status.md`
- `ring` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-23-ring-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-23-ring-source-rewrite.md`
  - `docs/2026-04-23-ring-source-rewrite-log.md`
  - `docs/2026-04-23-ring-source-rewrite-status.md`
- `decoration / underline-offset` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-23-decoration-underline-offset-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-23-decoration-underline-offset-source-rewrite.md`
  - `docs/2026-04-23-decoration-underline-offset-source-rewrite-log.md`
  - `docs/2026-04-23-decoration-underline-offset-source-rewrite-status.md`
- `shadow` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-23-shadow-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-23-shadow-source-rewrite.md`
  - `docs/2026-04-23-shadow-source-rewrite-log.md`
  - `docs/2026-04-23-shadow-source-rewrite-status.md`
- `divide` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-23-divide-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-23-divide-source-rewrite.md`
  - `docs/2026-04-23-divide-source-rewrite-log.md`
  - `docs/2026-04-23-divide-source-rewrite-status.md`
- `fill` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-23-fill-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-23-fill-source-rewrite.md`
  - `docs/2026-04-23-fill-source-rewrite-log.md`
  - `docs/2026-04-23-fill-source-rewrite-status.md`
- `accent` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-23-accent-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-23-accent-source-rewrite.md`
  - `docs/2026-04-23-accent-source-rewrite-log.md`
  - `docs/2026-04-23-accent-source-rewrite-status.md`
- `caret` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-23-caret-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-23-caret-source-rewrite.md`
  - `docs/2026-04-23-caret-source-rewrite-log.md`
  - `docs/2026-04-23-caret-source-rewrite-status.md`
- `font` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-23-font-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-23-font-source-rewrite.md`
  - `docs/2026-04-23-font-source-rewrite-log.md`
  - `docs/2026-04-23-font-source-rewrite-status.md`

## 下一步

第一阶段主线已完成，第二阶段已完成 `wave_1` 全部 family，并已推进 `wave_2` 的 `fill`、`accent`、`caret` 与 `font`。下一步应按 full inventory 继续推进：

1. `text-align`
2. typography 剩余主规则族

## 文档职责

- 原始总需求文档：
  [internal-docs/tailwind3-source-rewrite/2026-04-21-tailwind3-source-rewrite-plan.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/internal-docs/tailwind3-source-rewrite/2026-04-21-tailwind3-source-rewrite-plan.md)
- 当前唯一实时入口：
  [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- 全量规则族总表：
  [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- 第二阶段计划：
  [docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md)
- 背景基线文档：
  [docs/2026-04-21-tailwind-grammar-debt-baseline.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-baseline.md)
