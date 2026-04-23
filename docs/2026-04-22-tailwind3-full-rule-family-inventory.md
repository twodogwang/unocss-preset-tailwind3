# Tailwind 3 Full Rule Family Inventory

状态日期：2026-04-23  
适用分支：`codex/tailwind3-source-rewrite`

> 这份文档用于补齐“全规则族重写”视角的总清单。  
> [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
> 记录的是第一阶段主线 utility，不等于整个仓库所有 Tailwind-facing 规则族都已经重写完成。
> 第二阶段推进计划请查看：
> [docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md)

## 目标

把当前 preset 中所有 Tailwind-facing 规则族，逐步从原先继承自 UnoCSS `preset-wind3` 的宽匹配实现，迁移为以 Tailwind CSS 3 正式语法为唯一标准的源头定义。

## 状态说明

- `completed_template`: 已进入当前 rewrite 模板，具备 shared fixture、runtime/parity、utility spec、migration subset、过程文档
- `pending_wave_n`: 尚未进入 rewrite 模板，已列入后续波次
- `special_review`: 不是标准 Tailwind 3 规则族，是否纳入 rewrite 需单独决定

## Completed Templates

| family | primary_sources | status | notes |
| --- | --- | --- | --- |
| `border-width` | `src/_rules/border.ts` | `completed_template` | 已锁住数字刻度与裸单位值边界 |
| `border-radius` | `src/_rules/border.ts` | `completed_template` | 已锁住 Tailwind 3 圆角方向语义 |
| `background-color / bg-opacity` | `src/_rules/color.ts` | `completed_template` | 已覆盖 `bg-*` 颜色、opacity 和高置信度 alias migration |
| `background-style / gradient / clip / origin / repeat / position` | `src/_rules-wind3/background.ts` | `completed_template` | 已覆盖 size / attachment / clip / origin / repeat / position / gradient，并锁住旧扩展 strictness 子集 |
| `ring` | `src/_rules/ring.ts` | `completed_template` | 已覆盖 width / color / opacity / offset / inset，并锁住高置信度 alias migration |
| `decoration / underline-offset` | `src/_rules/decoration.ts` | `completed_template` | 已覆盖 line / thickness / style / color / underline-offset，并锁住高置信度 alias migration |
| `text` | `src/_rules/typography.ts` | `completed_template` | 已覆盖 size / color / opacity 主规则族 |
| `leading` | `src/_rules/typography.ts` | `completed_template` | 已收敛到 `leading-*` |
| `tracking` | `src/_rules/typography.ts` | `completed_template` | 已收敛到 `tracking-*` |
| `stroke` | `src/_rules/svg.ts` | `completed_template` | 已覆盖 `stroke-*` 颜色与宽度 |
| `outline` | `src/_rules/behaviors.ts` | `completed_template` | 已覆盖 width / style / color / offset |
| `transition` | `src/_rules/transition.ts`, `src/_theme/transition.ts` | `completed_template` | 已覆盖 `transition / duration / delay / ease` |
| `spacing-padding-margin` | `src/_rules/spacing.ts` | `completed_template` | 已覆盖 `p-*` / `m-*` |
| `spacing-gap-inset-scroll` | `src/_rules/gap.ts`, `src/_rules/position.ts`, `src/_rules-wind3/scrolls.ts` | `completed_template` | 已覆盖 `gap / inset / scroll-m/p` |
| `spacing-border-spacing-space` | `src/_rules-wind3/table.ts`, `src/_rules-wind3/spacing.ts`, `src/rules.ts` | `completed_template` | 已覆盖 `border-spacing` 与 `space-x/y` |

## Pending Tailwind-Facing Families

| family | primary_sources | status | next_wave | notes |
| --- | --- | --- | --- | --- |
| `shadow` | `src/_rules/shadow.ts` | `pending_wave_1` | `wave_1` | 含颜色与 arbitrary value 边界 |
| `divide` | `src/_rules-wind3/divide.ts` | `pending_wave_1` | `wave_1` | 与 border 家族相邻，历史别名较多 |
| `fill` | `src/_rules/svg.ts` | `pending_wave_2` | `wave_2` | 与 `stroke` 同文件，但未独立治理 |
| `accent` | `src/_rules-wind3/behaviors.ts` | `pending_wave_2` | `wave_2` | 目前只有综合测试与 blocklist |
| `caret` | `src/_rules-wind3/behaviors.ts` | `pending_wave_2` | `wave_2` | 目前只有综合测试与 blocklist |
| `font` | `src/_rules/typography.ts` | `pending_wave_2` | `wave_2` | 含 font family / weight 等主规则族 |
| `text-align` | `src/_rules/align.ts` | `pending_wave_2` | `wave_2` | 尚未进入 rewrite 模板 |
| `vertical-align` | `src/_rules/align.ts` | `pending_wave_2` | `wave_2` | 尚未进入 rewrite 模板 |
| `text-decoration` | `src/_rules/decoration.ts` | `pending_wave_2` | `wave_2` | 与 decoration thickness/style 相邻但未拆开治理 |
| `text-indent` | `src/_rules/typography.ts` | `pending_wave_2` | `wave_2` | |
| `text-wrap / text-overflow / text-transform` | `src/_rules/static.ts` | `pending_wave_2` | `wave_2` | 目前只在综合测试中出现 |
| `tab-size` | `src/_rules/typography.ts` | `pending_wave_2` | `wave_2` | |
| `text-stroke` | `src/_rules/typography.ts` | `pending_wave_2` | `wave_2` | 与 `stroke` 不同，仍未治理 |
| `text-shadow` | `src/_rules/typography.ts` | `pending_wave_2` | `wave_2` | |
| `line-clamp` | `src/_rules-wind3/line-clamp.ts` | `pending_wave_2` | `wave_2` | |
| `font-variant-numeric` | `src/_rules-wind3/typography.ts` | `pending_wave_2` | `wave_2` | |
| `size / width / height / min / max` | `src/_rules/size.ts` | `pending_wave_3` | `wave_3` | 当前有综合测试，但无专用模板 |
| `aspect-ratio` | `src/_rules/size.ts` | `pending_wave_3` | `wave_3` | |
| `display` | `src/_rules/static.ts` | `pending_wave_3` | `wave_3` | |
| `overflow` | `src/_rules/layout.ts` | `pending_wave_3` | `wave_3` | |
| `position / inset leftovers / float / z / order / box-sizing` | `src/_rules/position.ts` | `pending_wave_3` | `wave_3` | `inset` 主体已完成，其他仍未模板化 |
| `container` | `src/_rules/container.ts`, `src/_rules-wind3/container.ts` | `pending_wave_3` | `wave_3` | |
| `columns` | `src/_rules-wind3/columns.ts` | `pending_wave_3` | `wave_3` | |
| `table display / caption / collapse` | `src/_rules-wind3/table.ts` | `pending_wave_3` | `wave_3` | `border-spacing` 已完成，但表格其余语义未治理 |
| `flex` | `src/_rules/flex.ts` | `pending_wave_4` | `wave_4` | |
| `grid` | `src/_rules/grid.ts` | `pending_wave_4` | `wave_4` | |
| `justify / align / place / flexGridJustifiesAlignments` | `src/_rules/position.ts` | `pending_wave_4` | `wave_4` | |
| `transform` | `src/_rules/transform.ts` | `pending_wave_4` | `wave_4` | 含 translate/rotate/scale/skew 等主体 |
| `filters / backdrop-filters` | `src/_rules-wind3/filters.ts` | `pending_wave_4` | `wave_4` | |
| `animation` | `src/_rules-wind3/animation.ts` | `pending_wave_4` | `wave_4` | |
| `appearance` | `src/_rules/behaviors.ts` | `pending_wave_5` | `wave_5` | `behavior` 第一阶段只完成了 `transition` |
| `will-change` | `src/_rules/behaviors.ts` | `pending_wave_5` | `wave_5` | |
| `overscroll` | `src/_rules-wind3/behaviors.ts` | `pending_wave_5` | `wave_5` | |
| `scroll-behavior` | `src/_rules-wind3/behaviors.ts` | `pending_wave_5` | `wave_5` | |
| `touch-action` | `src/_rules-wind3/touch-actions.ts` | `pending_wave_5` | `wave_5` | |
| `list-style` | `src/_rules-wind3/behaviors.ts` | `pending_wave_5` | `wave_5` | |
| `image-rendering` | `src/_rules-wind3/behaviors.ts` | `pending_wave_5` | `wave_5` | |
| `cursor / pointer-events / resize / user-select` | `src/_rules/static.ts` | `pending_wave_5` | `wave_5` | |
| `white-space / breaks / hyphens / content-visibility / contents / field-sizing / color-scheme` | `src/_rules/static.ts`, `src/_rules/color.ts` | `pending_wave_5` | `wave_5` | |

## Special Review Families

| family | primary_sources | status | notes |
| --- | --- | --- | --- |
| `css variables / css property shortcuts` | `src/_rules/variables.ts`, `src/_rules-wind3/variables.ts` | `special_review` | 这些不是标准 Tailwind 3 utility family，需要决定是否纳入同一 rewrite 主线 |
| `question-mark` | `src/_rules/question-mark.ts` | `special_review` | 明显是仓库特有扩展，不属于 Tailwind 3 规则族 |
| `container shortcuts` | `src/_rules-wind3/container.ts` | `special_review` | 更接近 shortcut 设计，不是核心规则族 |

## Recommended Execution Waves

1. `wave_1`
- `shadow`
- `divide`

2. `wave_2`
- typography 剩余主规则族
- `fill / accent / caret`

3. `wave_3`
- `size / layout / position / container / columns / tables`

4. `wave_4`
- `flex / grid / transform / filters / animation`

5. `wave_5`
- `appearance / will-change / overscroll / touch-action / list-style / static utilities`

## Next Step

如果目标改为“完成整个 preset 的所有规则族重写”，下一步应继续以这份 inventory 为总表，沿着 `wave_1` 进入 `shadow`。
