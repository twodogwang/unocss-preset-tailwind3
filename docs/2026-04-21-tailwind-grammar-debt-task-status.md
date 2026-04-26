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
- `text-align` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-23-text-align-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-23-text-align-source-rewrite.md`
  - `docs/2026-04-23-text-align-source-rewrite-log.md`
  - `docs/2026-04-23-text-align-source-rewrite-status.md`
- `vertical-align` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-23-vertical-align-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-23-vertical-align-source-rewrite.md`
  - `docs/2026-04-23-vertical-align-source-rewrite-log.md`
  - `docs/2026-04-23-vertical-align-source-rewrite-status.md`
- `text-decoration` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-23-text-decoration-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-23-text-decoration-source-rewrite.md`
  - `docs/2026-04-23-text-decoration-source-rewrite-log.md`
  - `docs/2026-04-23-text-decoration-source-rewrite-status.md`
- `text-indent` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-23-text-indent-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-23-text-indent-source-rewrite.md`
  - `docs/2026-04-23-text-indent-source-rewrite-log.md`
  - `docs/2026-04-23-text-indent-source-rewrite-status.md`
- `text-wrap / text-overflow / text-transform` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-23-text-wrap-text-overflow-text-transform-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-23-text-wrap-text-overflow-text-transform-source-rewrite.md`
  - `docs/2026-04-23-text-wrap-text-overflow-text-transform-source-rewrite-log.md`
  - `docs/2026-04-23-text-wrap-text-overflow-text-transform-source-rewrite-status.md`
- `tab-size` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-23-tab-size-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-23-tab-size-source-rewrite.md`
  - `docs/2026-04-23-tab-size-source-rewrite-log.md`
  - `docs/2026-04-23-tab-size-source-rewrite-status.md`
- `text-stroke` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-23-text-stroke-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-23-text-stroke-source-rewrite.md`
  - `docs/2026-04-23-text-stroke-source-rewrite-log.md`
  - `docs/2026-04-23-text-stroke-source-rewrite-status.md`
- `text-shadow` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-23-text-shadow-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-23-text-shadow-source-rewrite.md`
  - `docs/2026-04-23-text-shadow-source-rewrite-log.md`
  - `docs/2026-04-23-text-shadow-source-rewrite-status.md`
- `line-clamp` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-23-line-clamp-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-23-line-clamp-source-rewrite.md`
  - `docs/2026-04-23-line-clamp-source-rewrite-log.md`
  - `docs/2026-04-23-line-clamp-source-rewrite-status.md`
- `font-variant-numeric` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-23-font-variant-numeric-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-23-font-variant-numeric-source-rewrite.md`
  - `docs/2026-04-23-font-variant-numeric-source-rewrite-log.md`
  - `docs/2026-04-23-font-variant-numeric-source-rewrite-status.md`
- `size / width / height / min / max` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-23-size-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-23-size-source-rewrite.md`
  - `docs/2026-04-23-size-source-rewrite-log.md`
  - `docs/2026-04-23-size-source-rewrite-status.md`
- `aspect-ratio` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-24-aspect-ratio-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-24-aspect-ratio-source-rewrite.md`
  - `docs/2026-04-24-aspect-ratio-source-rewrite-log.md`
  - `docs/2026-04-24-aspect-ratio-source-rewrite-status.md`
- `display` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-24-display-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-24-display-source-rewrite.md`
  - `docs/2026-04-24-display-source-rewrite-log.md`
  - `docs/2026-04-24-display-source-rewrite-status.md`
- `overflow` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-25-overflow-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-25-overflow-source-rewrite.md`
  - `docs/2026-04-25-overflow-source-rewrite-log.md`
  - `docs/2026-04-25-overflow-source-rewrite-status.md`
- `position / inset leftovers / float / z / order / box-sizing` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-25-position-float-z-order-box-sizing-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-25-position-float-z-order-box-sizing-source-rewrite.md`
  - `docs/2026-04-25-position-float-z-order-box-sizing-source-rewrite-log.md`
  - `docs/2026-04-25-position-float-z-order-box-sizing-source-rewrite-status.md`
- `container` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-25-container-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-25-container-source-rewrite.md`
  - `docs/2026-04-25-container-source-rewrite-log.md`
  - `docs/2026-04-25-container-source-rewrite-status.md`
- `columns` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-25-columns-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-25-columns-source-rewrite.md`
  - `docs/2026-04-25-columns-source-rewrite-log.md`
  - `docs/2026-04-25-columns-source-rewrite-status.md`
- `table display / caption / collapse` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-25-table-display-caption-collapse-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-25-table-display-caption-collapse-source-rewrite.md`
  - `docs/2026-04-25-table-display-caption-collapse-source-rewrite-log.md`
  - `docs/2026-04-25-table-display-caption-collapse-source-rewrite-status.md`
- `flex` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-26-flex-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-26-flex-source-rewrite.md`
  - `docs/2026-04-26-flex-source-rewrite-log.md`
  - `docs/2026-04-26-flex-source-rewrite-status.md`
- `grid` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-26-grid-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-26-grid-source-rewrite.md`
  - `docs/2026-04-26-grid-source-rewrite-log.md`
  - `docs/2026-04-26-grid-source-rewrite-status.md`
- `justify / align / place / flexGridJustifiesAlignments` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-26-justify-align-place-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-26-justify-align-place-source-rewrite.md`
  - `docs/2026-04-26-justify-align-place-source-rewrite-log.md`
  - `docs/2026-04-26-justify-align-place-source-rewrite-status.md`
- `transform` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-26-transform-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-26-transform-source-rewrite.md`
  - `docs/2026-04-26-transform-source-rewrite-log.md`
  - `docs/2026-04-26-transform-source-rewrite-status.md`
- `filters / backdrop-filters` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-26-filters-backdrop-filters-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-26-filters-backdrop-filters-source-rewrite.md`
  - `docs/2026-04-26-filters-backdrop-filters-source-rewrite-log.md`
  - `docs/2026-04-26-filters-backdrop-filters-source-rewrite-status.md`
- `animation` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-26-animation-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-26-animation-source-rewrite.md`
  - `docs/2026-04-26-animation-source-rewrite-log.md`
  - `docs/2026-04-26-animation-source-rewrite-status.md`
- `appearance` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-26-appearance-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-26-appearance-source-rewrite.md`
  - `docs/2026-04-26-appearance-source-rewrite-log.md`
  - `docs/2026-04-26-appearance-source-rewrite-status.md`
- `will-change` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-26-will-change-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-26-will-change-source-rewrite.md`
  - `docs/2026-04-26-will-change-source-rewrite-log.md`
  - `docs/2026-04-26-will-change-source-rewrite-status.md`
- `overscroll` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-26-overscroll-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-26-overscroll-source-rewrite.md`
  - `docs/2026-04-26-overscroll-source-rewrite-log.md`
  - `docs/2026-04-26-overscroll-source-rewrite-status.md`
- `scroll-behavior` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-26-scroll-behavior-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-26-scroll-behavior-source-rewrite.md`
  - `docs/2026-04-26-scroll-behavior-source-rewrite-log.md`
  - `docs/2026-04-26-scroll-behavior-source-rewrite-status.md`
- `touch-action` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-26-touch-action-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-26-touch-action-source-rewrite.md`
  - `docs/2026-04-26-touch-action-source-rewrite-log.md`
  - `docs/2026-04-26-touch-action-source-rewrite-status.md`
- `list-style` 已完成模板化，相关文档已进入 git：
  - `docs/superpowers/specs/2026-04-26-list-style-source-rewrite-design.md`
  - `docs/superpowers/plans/2026-04-26-list-style-source-rewrite.md`
  - `docs/2026-04-26-list-style-source-rewrite-log.md`
  - `docs/2026-04-26-list-style-source-rewrite-status.md`

## 下一步

第一阶段主线已完成，第二阶段已完成 `wave_1` 全部 family，并已推进 `wave_2` 的 `fill`、`accent`、`caret`、`font`、`text-align`、`vertical-align`、`text-decoration`、`text-indent`、`text-wrap / text-overflow / text-transform`、`tab-size`、`text-stroke`、`text-shadow`、`line-clamp`、`font-variant-numeric`，`wave_3` 的 `size / width / height / min / max`、`aspect-ratio`、`display`、`overflow`、`position / inset leftovers / float / z / order / box-sizing`、`container`、`columns`、`table display / caption / collapse`，以及 `wave_4` 的 `flex`、`grid`、`justify / align / place / flexGridJustifiesAlignments`、`transform`、`filters / backdrop-filters`、`animation`，以及 `wave_5` 的 `appearance`、`will-change`、`overscroll`、`scroll-behavior`、`touch-action`、`list-style`。下一步应按 full inventory 继续推进：

1. `image-rendering`
2. `wave_5` 其余 behavior / static families

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
