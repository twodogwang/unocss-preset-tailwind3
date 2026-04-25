# Tailwind 3 Source Rewrite Index

当前分支：`codex/tailwind3-source-rewrite`

这份文档是当前源头重写任务的唯一实时入口。

> 重要说明：当前表格记录的是第一阶段主线 utility 的交付状态。  
> 第一阶段主线已经完成，第二阶段已从 `background-color / bg-opacity` 开始，但不直接并入下表。  
> 它不等于“整个仓库所有 Tailwind-facing 规则族都已经重写完成”。  
> 全量规则族盘点请查看：
> [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)

## 任务摘要

- 目标：把各个 utility 收敛到 Tailwind CSS 3 正式语法
- 已完成：`border`、`outline`、`text`、`leading`、`tracking`、`stroke`、`spacing`、`behavior`
- 第二阶段已完成模板化：`background-color / bg-opacity`、`background-style / gradient / clip / origin / repeat / position`、`ring`、`decoration / underline-offset`、`shadow`、`divide`、`fill`、`accent`、`caret`、`font`、`text-align`、`vertical-align`、`text-decoration`、`text-indent`、`text-wrap / text-overflow / text-transform`、`tab-size`、`text-stroke`、`text-shadow`、`line-clamp`、`font-variant-numeric`、`size / width / height / min / max`、`aspect-ratio`、`display`、`overflow`、`position / inset leftovers / float / z / order / box-sizing`、`container`、`columns`、`table display / caption / collapse`

## Utility Manifest

如果某个 utility 当前确实没有对应文档，则该列明确写 `-`，不伪造链接。

| utility | status | spec | plan | log | statusDoc |
| --- | --- | --- | --- | --- | --- |
| border | completed | - | docs/superpowers/plans/2026-04-21-tailwind3-border-source-rewrite.md | - | - |
| outline | completed | docs/superpowers/specs/2026-04-22-outline-source-rewrite-design.md | docs/superpowers/plans/2026-04-22-outline-source-rewrite.md | docs/2026-04-22-outline-source-rewrite-log.md | docs/2026-04-22-outline-source-rewrite-status.md |
| text | completed | docs/superpowers/specs/2026-04-22-text-source-rewrite-design.md | docs/superpowers/plans/2026-04-22-text-source-rewrite.md | docs/2026-04-22-text-source-rewrite-log.md | docs/2026-04-22-text-source-rewrite-status.md |
| leading | completed | docs/superpowers/specs/2026-04-22-leading-source-rewrite-design.md | docs/superpowers/plans/2026-04-22-leading-source-rewrite.md | docs/2026-04-22-leading-source-rewrite-log.md | docs/2026-04-22-leading-source-rewrite-status.md |
| tracking | completed | docs/superpowers/specs/2026-04-22-tracking-source-rewrite-design.md | docs/superpowers/plans/2026-04-22-tracking-source-rewrite.md | docs/2026-04-22-tracking-source-rewrite-log.md | docs/2026-04-22-tracking-source-rewrite-status.md |
| stroke | completed | docs/superpowers/specs/2026-04-22-stroke-source-rewrite-design.md | docs/superpowers/plans/2026-04-22-stroke-source-rewrite.md | docs/2026-04-22-stroke-source-rewrite-log.md | docs/2026-04-22-stroke-source-rewrite-status.md |
| spacing | completed | docs/superpowers/specs/2026-04-22-spacing-border-spacing-space-source-rewrite-design.md | docs/superpowers/plans/2026-04-22-spacing-border-spacing-space-source-rewrite.md | docs/2026-04-22-spacing-border-spacing-space-source-rewrite-log.md | docs/2026-04-22-spacing-border-spacing-space-source-rewrite-status.md |
| behavior | completed | docs/superpowers/specs/2026-04-22-behavior-transition-source-rewrite-design.md | docs/superpowers/plans/2026-04-22-behavior-transition-source-rewrite.md | docs/2026-04-22-behavior-transition-source-rewrite-log.md | docs/2026-04-22-behavior-transition-source-rewrite-status.md |

## 第二阶段起点

- `background-color / bg-opacity` 已完成模板化：
  - spec: `docs/superpowers/specs/2026-04-22-background-color-bg-opacity-source-rewrite-design.md`
  - plan: `docs/superpowers/plans/2026-04-22-background-color-bg-opacity-source-rewrite.md`
  - log: `docs/2026-04-22-background-color-bg-opacity-source-rewrite-log.md`
  - status: `docs/2026-04-22-background-color-bg-opacity-source-rewrite-status.md`
- `background-style / gradient / clip / origin / repeat / position` 已完成模板化：
  - spec: `docs/superpowers/specs/2026-04-23-background-style-gradient-clip-origin-repeat-position-source-rewrite-design.md`
  - plan: `docs/superpowers/plans/2026-04-23-background-style-gradient-clip-origin-repeat-position-source-rewrite.md`
  - log: `docs/2026-04-23-background-style-gradient-clip-origin-repeat-position-source-rewrite-log.md`
  - status: `docs/2026-04-23-background-style-gradient-clip-origin-repeat-position-source-rewrite-status.md`
- `ring` 已完成模板化：
  - spec: `docs/superpowers/specs/2026-04-23-ring-source-rewrite-design.md`
  - plan: `docs/superpowers/plans/2026-04-23-ring-source-rewrite.md`
  - log: `docs/2026-04-23-ring-source-rewrite-log.md`
  - status: `docs/2026-04-23-ring-source-rewrite-status.md`
- `decoration / underline-offset` 已完成模板化：
  - spec: `docs/superpowers/specs/2026-04-23-decoration-underline-offset-source-rewrite-design.md`
  - plan: `docs/superpowers/plans/2026-04-23-decoration-underline-offset-source-rewrite.md`
  - log: `docs/2026-04-23-decoration-underline-offset-source-rewrite-log.md`
  - status: `docs/2026-04-23-decoration-underline-offset-source-rewrite-status.md`
- `shadow` 已完成模板化：
  - spec: `docs/superpowers/specs/2026-04-23-shadow-source-rewrite-design.md`
  - plan: `docs/superpowers/plans/2026-04-23-shadow-source-rewrite.md`
  - log: `docs/2026-04-23-shadow-source-rewrite-log.md`
  - status: `docs/2026-04-23-shadow-source-rewrite-status.md`
- `divide` 已完成模板化：
  - spec: `docs/superpowers/specs/2026-04-23-divide-source-rewrite-design.md`
  - plan: `docs/superpowers/plans/2026-04-23-divide-source-rewrite.md`
  - log: `docs/2026-04-23-divide-source-rewrite-log.md`
  - status: `docs/2026-04-23-divide-source-rewrite-status.md`
- `fill` 已完成模板化：
  - spec: `docs/superpowers/specs/2026-04-23-fill-source-rewrite-design.md`
  - plan: `docs/superpowers/plans/2026-04-23-fill-source-rewrite.md`
  - log: `docs/2026-04-23-fill-source-rewrite-log.md`
  - status: `docs/2026-04-23-fill-source-rewrite-status.md`
- `accent` 已完成模板化：
  - spec: `docs/superpowers/specs/2026-04-23-accent-source-rewrite-design.md`
  - plan: `docs/superpowers/plans/2026-04-23-accent-source-rewrite.md`
  - log: `docs/2026-04-23-accent-source-rewrite-log.md`
  - status: `docs/2026-04-23-accent-source-rewrite-status.md`
- `caret` 已完成模板化：
  - spec: `docs/superpowers/specs/2026-04-23-caret-source-rewrite-design.md`
  - plan: `docs/superpowers/plans/2026-04-23-caret-source-rewrite.md`
  - log: `docs/2026-04-23-caret-source-rewrite-log.md`
  - status: `docs/2026-04-23-caret-source-rewrite-status.md`
- `font` 已完成模板化：
  - spec: `docs/superpowers/specs/2026-04-23-font-source-rewrite-design.md`
  - plan: `docs/superpowers/plans/2026-04-23-font-source-rewrite.md`
  - log: `docs/2026-04-23-font-source-rewrite-log.md`
  - status: `docs/2026-04-23-font-source-rewrite-status.md`
- `text-align` 已完成模板化：
  - spec: `docs/superpowers/specs/2026-04-23-text-align-source-rewrite-design.md`
  - plan: `docs/superpowers/plans/2026-04-23-text-align-source-rewrite.md`
  - log: `docs/2026-04-23-text-align-source-rewrite-log.md`
  - status: `docs/2026-04-23-text-align-source-rewrite-status.md`
- `vertical-align` 已完成模板化：
  - spec: `docs/superpowers/specs/2026-04-23-vertical-align-source-rewrite-design.md`
  - plan: `docs/superpowers/plans/2026-04-23-vertical-align-source-rewrite.md`
  - log: `docs/2026-04-23-vertical-align-source-rewrite-log.md`
  - status: `docs/2026-04-23-vertical-align-source-rewrite-status.md`
- `text-decoration` 已完成模板化：
  - spec: `docs/superpowers/specs/2026-04-23-text-decoration-source-rewrite-design.md`
  - plan: `docs/superpowers/plans/2026-04-23-text-decoration-source-rewrite.md`
  - log: `docs/2026-04-23-text-decoration-source-rewrite-log.md`
  - status: `docs/2026-04-23-text-decoration-source-rewrite-status.md`
- `text-indent` 已完成模板化：
  - spec: `docs/superpowers/specs/2026-04-23-text-indent-source-rewrite-design.md`
  - plan: `docs/superpowers/plans/2026-04-23-text-indent-source-rewrite.md`
  - log: `docs/2026-04-23-text-indent-source-rewrite-log.md`
  - status: `docs/2026-04-23-text-indent-source-rewrite-status.md`
- `text-wrap / text-overflow / text-transform` 已完成模板化：
  - spec: `docs/superpowers/specs/2026-04-23-text-wrap-text-overflow-text-transform-source-rewrite-design.md`
  - plan: `docs/superpowers/plans/2026-04-23-text-wrap-text-overflow-text-transform-source-rewrite.md`
  - log: `docs/2026-04-23-text-wrap-text-overflow-text-transform-source-rewrite-log.md`
  - status: `docs/2026-04-23-text-wrap-text-overflow-text-transform-source-rewrite-status.md`
- `tab-size` 已完成模板化：
  - spec: `docs/superpowers/specs/2026-04-23-tab-size-source-rewrite-design.md`
  - plan: `docs/superpowers/plans/2026-04-23-tab-size-source-rewrite.md`
  - log: `docs/2026-04-23-tab-size-source-rewrite-log.md`
  - status: `docs/2026-04-23-tab-size-source-rewrite-status.md`
- `text-stroke` 已完成模板化：
  - spec: `docs/superpowers/specs/2026-04-23-text-stroke-source-rewrite-design.md`
  - plan: `docs/superpowers/plans/2026-04-23-text-stroke-source-rewrite.md`
  - log: `docs/2026-04-23-text-stroke-source-rewrite-log.md`
  - status: `docs/2026-04-23-text-stroke-source-rewrite-status.md`
- `text-shadow` 已完成模板化：
  - spec: `docs/superpowers/specs/2026-04-23-text-shadow-source-rewrite-design.md`
  - plan: `docs/superpowers/plans/2026-04-23-text-shadow-source-rewrite.md`
  - log: `docs/2026-04-23-text-shadow-source-rewrite-log.md`
  - status: `docs/2026-04-23-text-shadow-source-rewrite-status.md`
- `line-clamp` 已完成模板化：
  - spec: `docs/superpowers/specs/2026-04-23-line-clamp-source-rewrite-design.md`
  - plan: `docs/superpowers/plans/2026-04-23-line-clamp-source-rewrite.md`
  - log: `docs/2026-04-23-line-clamp-source-rewrite-log.md`
  - status: `docs/2026-04-23-line-clamp-source-rewrite-status.md`
- `font-variant-numeric` 已完成模板化：
  - spec: `docs/superpowers/specs/2026-04-23-font-variant-numeric-source-rewrite-design.md`
  - plan: `docs/superpowers/plans/2026-04-23-font-variant-numeric-source-rewrite.md`
  - log: `docs/2026-04-23-font-variant-numeric-source-rewrite-log.md`
  - status: `docs/2026-04-23-font-variant-numeric-source-rewrite-status.md`
- `size / width / height / min / max` 已完成模板化：
  - spec: `docs/superpowers/specs/2026-04-23-size-source-rewrite-design.md`
  - plan: `docs/superpowers/plans/2026-04-23-size-source-rewrite.md`
  - log: `docs/2026-04-23-size-source-rewrite-log.md`
  - status: `docs/2026-04-23-size-source-rewrite-status.md`
- `aspect-ratio` 已完成模板化：
  - spec: `docs/superpowers/specs/2026-04-24-aspect-ratio-source-rewrite-design.md`
  - plan: `docs/superpowers/plans/2026-04-24-aspect-ratio-source-rewrite.md`
  - log: `docs/2026-04-24-aspect-ratio-source-rewrite-log.md`
  - status: `docs/2026-04-24-aspect-ratio-source-rewrite-status.md`
- `display` 已完成模板化：
  - spec: `docs/superpowers/specs/2026-04-24-display-source-rewrite-design.md`
  - plan: `docs/superpowers/plans/2026-04-24-display-source-rewrite.md`
  - log: `docs/2026-04-24-display-source-rewrite-log.md`
  - status: `docs/2026-04-24-display-source-rewrite-status.md`
- `overflow` 已完成模板化：
  - spec: `docs/superpowers/specs/2026-04-25-overflow-source-rewrite-design.md`
  - plan: `docs/superpowers/plans/2026-04-25-overflow-source-rewrite.md`
  - log: `docs/2026-04-25-overflow-source-rewrite-log.md`
  - status: `docs/2026-04-25-overflow-source-rewrite-status.md`
- `position / inset leftovers / float / z / order / box-sizing` 已完成模板化：
  - spec: `docs/superpowers/specs/2026-04-25-position-float-z-order-box-sizing-source-rewrite-design.md`
  - plan: `docs/superpowers/plans/2026-04-25-position-float-z-order-box-sizing-source-rewrite.md`
  - log: `docs/2026-04-25-position-float-z-order-box-sizing-source-rewrite-log.md`
  - status: `docs/2026-04-25-position-float-z-order-box-sizing-source-rewrite-status.md`
- `container` 已完成模板化：
  - spec: `docs/superpowers/specs/2026-04-25-container-source-rewrite-design.md`
  - plan: `docs/superpowers/plans/2026-04-25-container-source-rewrite.md`
  - log: `docs/2026-04-25-container-source-rewrite-log.md`
  - status: `docs/2026-04-25-container-source-rewrite-status.md`
- `columns` 已完成模板化：
  - spec: `docs/superpowers/specs/2026-04-25-columns-source-rewrite-design.md`
  - plan: `docs/superpowers/plans/2026-04-25-columns-source-rewrite.md`
  - log: `docs/2026-04-25-columns-source-rewrite-log.md`
  - status: `docs/2026-04-25-columns-source-rewrite-status.md`
- `table display / caption / collapse` 已完成模板化：
  - spec: `docs/superpowers/specs/2026-04-25-table-display-caption-collapse-source-rewrite-design.md`
  - plan: `docs/superpowers/plans/2026-04-25-table-display-caption-collapse-source-rewrite.md`
  - log: `docs/2026-04-25-table-display-caption-collapse-source-rewrite-log.md`
  - status: `docs/2026-04-25-table-display-caption-collapse-source-rewrite-status.md`

## 相关文档

- 原始总需求文档：[internal-docs/tailwind3-source-rewrite/2026-04-21-tailwind3-source-rewrite-plan.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/internal-docs/tailwind3-source-rewrite/2026-04-21-tailwind3-source-rewrite-plan.md)
- 全量规则族总表：[docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- 第二阶段计划：[docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md)
- 整体状态文档：[docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
- 背景基线文档：[docs/2026-04-21-tailwind-grammar-debt-baseline.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-baseline.md)
