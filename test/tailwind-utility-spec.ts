import { accentFixtures } from './fixtures/tailwind-accent-rewrite'
import { aspectRatioFixtures } from './fixtures/tailwind-aspect-ratio-rewrite'
import { caretFixtures } from './fixtures/tailwind-caret-rewrite'
import { backgroundColorFixtures } from './fixtures/tailwind-background-color-rewrite'
import { animationFixtures } from './fixtures/tailwind-animation-rewrite'
import { appearanceFixtures } from './fixtures/tailwind-appearance-rewrite'
import { backgroundStyleFixtures } from './fixtures/tailwind-background-style-rewrite'
import { borderWidthFixtures, roundedFixtures } from './fixtures/tailwind-border-rewrite'
import { containerFixtures } from './fixtures/tailwind-container-rewrite'
import { columnsFixtures } from './fixtures/tailwind-columns-rewrite'
import { displayFixtures } from './fixtures/tailwind-display-rewrite'
import { tableFixtures } from './fixtures/tailwind-table-rewrite'
import { decorationFixtures } from './fixtures/tailwind-decoration-rewrite'
import { textDecorationFixtures } from './fixtures/tailwind-text-decoration-rewrite'
import { textIndentFixtures } from './fixtures/tailwind-text-indent-rewrite'
import { textShadowFixtures } from './fixtures/tailwind-text-shadow-rewrite'
import { textStrokeFixtures } from './fixtures/tailwind-text-stroke-rewrite'
import { tabSizeFixtures } from './fixtures/tailwind-tab-size-rewrite'
import { textWrapOverflowTransformFixtures } from './fixtures/tailwind-text-wrap-overflow-transform-rewrite'
import { filtersFixtures } from './fixtures/tailwind-filters-rewrite'
import { divideFixtures } from './fixtures/tailwind-divide-rewrite'
import { flexFixtures } from './fixtures/tailwind-flex-rewrite'
import { fillFixtures } from './fixtures/tailwind-fill-rewrite'
import { fontFixtures } from './fixtures/tailwind-font-rewrite'
import { fontVariantNumericFixtures } from './fixtures/tailwind-font-variant-numeric-rewrite'
import { gridFixtures } from './fixtures/tailwind-grid-rewrite'
import { justifyAlignPlaceFixtures } from './fixtures/tailwind-justify-align-place-rewrite'
import { leadingFixtures } from './fixtures/tailwind-leading-rewrite'
import { lineClampFixtures } from './fixtures/tailwind-line-clamp-rewrite'
import { outlineFixtures } from './fixtures/tailwind-outline-rewrite'
import { overflowFixtures } from './fixtures/tailwind-overflow-rewrite'
import { positionFloatZOrderBoxSizingFixtures } from './fixtures/tailwind-position-float-z-order-box-sizing-rewrite'
import { ringFixtures } from './fixtures/tailwind-ring-rewrite'
import { shadowFixtures } from './fixtures/tailwind-shadow-rewrite'
import { sizeFixtures } from './fixtures/tailwind-size-rewrite'
import { borderSpacingSpaceFixtures } from './fixtures/tailwind-spacing-border-spacing-space-rewrite'
import { gapInsetScrollFixtures } from './fixtures/tailwind-spacing-gap-inset-scroll-rewrite'
import { paddingMarginFixtures } from './fixtures/tailwind-spacing-padding-margin-rewrite'
import { strokeFixtures } from './fixtures/tailwind-stroke-rewrite'
import { textAlignFixtures } from './fixtures/tailwind-text-align-rewrite'
import { transformFixtures } from './fixtures/tailwind-transform-rewrite'
import { verticalAlignFixtures } from './fixtures/tailwind-vertical-align-rewrite'
import { trackingFixtures } from './fixtures/tailwind-tracking-rewrite'
import { transitionFixtures } from './fixtures/tailwind-transition-rewrite'
import { textFixtures } from './fixtures/tailwind-text-rewrite'

export interface TailwindUtilitySpec {
  id: string
  sourceFiles: string[]
  category: 'border' | 'typography' | 'layout' | 'behavior' | 'color' | 'transform' | 'effect'
  canonical: string[]
  invalid: string[]
  supportsPrefix: boolean
  supportsNegative?: boolean
  supportsVariants?: boolean
  notes?: string[]
}

export const tailwindUtilitySpecs: TailwindUtilitySpec[] = [
  {
    id: 'animation',
    sourceFiles: ['src/_rules-wind3/animation.ts', 'src/theme.ts', 'src/_theme/types.ts'],
    category: 'effect',
    canonical: [...animationFixtures.canonical],
    invalid: [...animationFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 animation 主规则族只接受 Tailwind 3 的 `animate-*` theme key、`animate-none` 与 bracket arbitrary value，并对齐根级 `theme.animation` / `theme.keyframes` 与 prefix 下的 keyframe 重写语义。'],
  },
  {
    id: 'appearance',
    sourceFiles: ['src/_rules/behaviors.ts'],
    category: 'behavior',
    canonical: [...appearanceFixtures.canonical],
    invalid: [...appearanceFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 appearance 主规则族只接受 Tailwind 3 的 `appearance-auto` 与 `appearance-none`，并拒绝 global keyword 与浏览器特定 keyword shortcut。'],
  },
  {
    id: 'display',
    sourceFiles: ['src/_rules/static.ts'],
    category: 'layout',
    canonical: [...displayFixtures.canonical],
    invalid: [...displayFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 display 主规则族只接受 Tailwind 3 的静态 display utilities，并拒绝历史 display-* 别名与 arbitrary value。'],
  },
  {
    id: 'overflow',
    sourceFiles: ['src/_rules/layout.ts'],
    category: 'layout',
    canonical: [...overflowFixtures.canonical],
    invalid: [...overflowFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 overflow 主规则族只接受 Tailwind 3 的五个静态 overflow 值与 x/y 变体，并拒绝 overlay、global keyword 与 of-* 旧别名。'],
  },
  {
    id: 'position-float-z-order-box-sizing',
    sourceFiles: ['src/_rules/position.ts'],
    category: 'layout',
    canonical: [...positionFloatZOrderBoxSizingFixtures.canonical],
    invalid: [...positionFloatZOrderBoxSizingFixtures.invalid],
    supportsPrefix: true,
    supportsNegative: true,
    supportsVariants: true,
    notes: ['用于锁定 position / float / z-index / order / box-sizing 只接受 Tailwind 3 官方静态语义、默认 key、theme key 与 bracket arbitrary，并拒绝 global keyword 与紧凑旧别名。'],
  },
  {
    id: 'container',
    sourceFiles: ['src/_rules-wind3/container.ts', 'src/shortcuts.ts'],
    category: 'layout',
    canonical: [...containerFixtures.canonical],
    invalid: [...containerFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 container 只接受 Tailwind 3 的 `container` 与响应式变体，并对齐 `theme.container.screens` / `center` / `padding` 语义；`container-*` 后缀与 `@container` query class 不在当前 preset 的默认暴露面。'],
  },
  {
    id: 'columns',
    sourceFiles: ['src/_rules-wind3/columns.ts', 'src/_theme/size.ts', 'src/_theme/default.ts', 'src/_theme/types.ts'],
    category: 'layout',
    canonical: [...columnsFixtures.canonical],
    invalid: [...columnsFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 columns / break-before / break-inside / break-after 只接受 Tailwind 3 官方静态语义、默认 columns key、theme.columns key 与 arbitrary value，并拒绝 break-* global keyword 与紧凑旧别名。'],
  },
  {
    id: 'table-display-caption-collapse',
    sourceFiles: ['src/_rules-wind3/table.ts'],
    category: 'layout',
    canonical: [...tableFixtures.canonical],
    invalid: [...tableFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 table display / table-layout / caption-side / border-collapse 只接受 Tailwind 3 官方静态语义，并排除 `table-empty-cells-*` 等仓库扩展。'],
  },
  {
    id: 'flex',
    sourceFiles: ['src/_rules/flex.ts', 'src/_theme/default.ts', 'src/_theme/size.ts', 'src/_theme/types.ts'],
    category: 'layout',
    canonical: [...flexFixtures.canonical],
    invalid: [...flexFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 flex 主规则族只接受 Tailwind 3 的 display、flex shorthand、grow / shrink、basis、direction 与 wrap 语义，并拒绝 flex-inline、flex-grow-*、flex-basis-* 旧别名。'],
  },
  {
    id: 'grid',
    sourceFiles: ['src/_rules/grid.ts', 'src/_theme/default.ts', 'src/_theme/types.ts'],
    category: 'layout',
    canonical: [...gridFixtures.canonical],
    invalid: [...gridFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 grid 主规则族只接受 Tailwind 3 的 grid template、line placement、auto rows/cols 与 flow 语义，并拒绝 auto-flow、rows/cols 紧凑别名以及 grid-areas / minmax 扩展。'],
  },
  {
    id: 'justify-align-place-flex-grid-prefixes',
    sourceFiles: ['src/_rules/position.ts', 'src/rules.ts', 'src/_rules/default.ts'],
    category: 'layout',
    canonical: [...justifyAlignPlaceFixtures.canonical],
    invalid: [...justifyAlignPlaceFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 justify / align / place 主规则族只接受 Tailwind 3 官方静态 utility，并移除 `*-safe`、global keyword、`justify-left/right` 以及 `flex-*` / `grid-*` 前缀复刻扩展。'],
  },
  {
    id: 'transform',
    sourceFiles: ['src/_rules/transform.ts', 'src/rules.ts', 'src/_rules/default.ts', 'src/_theme/default.ts', 'src/_theme/misc.ts', 'src/_theme/types.ts'],
    category: 'transform',
    canonical: [...transformFixtures.canonical],
    invalid: [...transformFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 transform 主规则族只接受 Tailwind 3 的 origin / translate / rotate / skew / scale / transform 静态类，补齐默认 `translate` / `rotate` / `scale` / `skew` / `transformOrigin` theme key，并移除 `rotate-x/y/z`、`scale-z`、裸值扩展与 global keyword。'],
  },
  {
    id: 'filters-backdrop-filters',
    sourceFiles: ['src/_rules-wind3/filters.ts', 'src/_theme/default.ts', 'src/_theme/filters.ts', 'src/_theme/types.ts'],
    category: 'effect',
    canonical: [...filtersFixtures.canonical],
    invalid: [...filtersFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 filters / backdrop-filters 主规则族只接受 Tailwind 3 的 blur / brightness / contrast / drop-shadow / grayscale / hue-rotate / invert / saturate / sepia / backdrop-* / filter 静态类，补齐默认 filter theme key，并移除 `filter-*` 前缀旧别名、`backdrop-op-*` 简写与 global keyword。'],
  },
  {
    id: 'aspect-ratio',
    sourceFiles: ['src/_rules/size.ts'],
    category: 'layout',
    canonical: [...aspectRatioFixtures.canonical],
    invalid: [...aspectRatioFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 aspect-ratio 主规则族只接受 Tailwind 3 的 auto、square、video 与 aspect-[...] 语义，并拒绝历史别名与裸 ratio shorthand。'],
  },
  {
    id: 'size',
    sourceFiles: ['src/_rules/size.ts'],
    category: 'layout',
    canonical: [...sizeFixtures.canonical],
    invalid: [...sizeFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 size / width / height / min-* / max-* 主规则族只接受 Tailwind 3 官方的 spacing、fraction、viewport 与 screen/max-width 语义。'],
  },
  {
    id: 'background-color',
    sourceFiles: ['src/_rules/color.ts'],
    category: 'color',
    canonical: [...backgroundColorFixtures.canonical],
    invalid: [...backgroundColorFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 background-color / bg-opacity 主规则族只接受 Tailwind 3 正式颜色与 opacity 语法。'],
  },
  {
    id: 'accent',
    sourceFiles: ['src/_rules-wind3/behaviors.ts'],
    category: 'color',
    canonical: [...accentFixtures.canonical],
    invalid: [...accentFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 accent 主规则族只接受 Tailwind 3 的 accent color 语义。'],
  },
  {
    id: 'caret',
    sourceFiles: ['src/_rules-wind3/behaviors.ts'],
    category: 'color',
    canonical: [...caretFixtures.canonical],
    invalid: [...caretFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 caret 主规则族只接受 Tailwind 3 的 caret color 语义。'],
  },
  {
    id: 'background-style',
    sourceFiles: ['src/_rules-wind3/background.ts'],
    category: 'layout',
    canonical: [...backgroundStyleFixtures.canonical],
    invalid: [...backgroundStyleFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 background-style / gradient / clip / origin / repeat / position 主规则族的 Tailwind 3 语义边界。'],
  },
  {
    id: 'border-width',
    sourceFiles: ['src/_rules/border.ts'],
    category: 'border',
    canonical: [...borderWidthFixtures.canonical],
    invalid: [...borderWidthFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于建立“数字刻度合法、裸单位值非法”的重写模板。'],
  },
  {
    id: 'border-radius',
    sourceFiles: ['src/_rules/border.ts'],
    category: 'border',
    canonical: [...roundedFixtures.canonical],
    invalid: [...roundedFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于建立“圆角别名收敛到 Tailwind 3 语义”的重写模板。'],
  },
  {
    id: 'decoration',
    sourceFiles: ['src/_rules/decoration.ts'],
    category: 'typography',
    canonical: [...decorationFixtures.canonical],
    invalid: [...decorationFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 decoration / underline-offset 主规则族的 thickness、style、color 与 offset 语义边界，不再混入 line 入口。'],
  },
  {
    id: 'text-decoration',
    sourceFiles: ['src/_rules/decoration.ts'],
    category: 'typography',
    canonical: [...textDecorationFixtures.canonical],
    invalid: [...textDecorationFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 text-decoration-line 主规则族只接受 Tailwind 3 的 underline / overline / line-through / no-underline 语义。'],
  },
  {
    id: 'text-indent',
    sourceFiles: ['src/_rules/typography.ts'],
    category: 'typography',
    canonical: [...textIndentFixtures.canonical],
    invalid: [...textIndentFixtures.invalid],
    supportsPrefix: true,
    supportsNegative: true,
    supportsVariants: true,
    notes: ['用于锁定 text-indent 主规则族只接受 Tailwind 3 的 spacing/theme/arbitrary 语义，并拒绝 bare raw values 与旧前缀。'],
  },
  {
    id: 'text-wrap-overflow-transform',
    sourceFiles: ['src/_rules/static.ts'],
    category: 'typography',
    canonical: [...textWrapOverflowTransformFixtures.canonical],
    invalid: [...textWrapOverflowTransformFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 text-wrap / text-overflow / text-transform 主规则族只接受 Tailwind 3 的 truncate、text-wrap-* 与 uppercase/lowercase/capitalize/normal-case 语义。'],
  },
  {
    id: 'line-clamp',
    sourceFiles: ['src/_rules-wind3/line-clamp.ts'],
    category: 'typography',
    canonical: [...lineClampFixtures.canonical],
    invalid: [...lineClampFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 line-clamp 主规则族只接受 Tailwind 3 的正整数、none 与 arbitrary value 语义，并拒绝裸 global keyword 与 0 shorthand。'],
  },
  {
    id: 'text-shadow',
    sourceFiles: ['src/_rules/typography.ts'],
    category: 'typography',
    canonical: [...textShadowFixtures.canonical],
    invalid: [...textShadowFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 text-shadow 在 Tailwind 3 中没有原生 utility family，旧 text-shadow* 与 text-shadow-color* 语法需要迁移到 arbitrary property 或直接移除。'],
  },
  {
    id: 'text-stroke',
    sourceFiles: ['src/_rules/typography.ts'],
    category: 'typography',
    canonical: [...textStrokeFixtures.canonical],
    invalid: [...textStrokeFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 text-stroke 在 Tailwind 3 中没有原生 utility family，旧 text-stroke* 语法只能迁移到 arbitrary property 或直接移除。'],
  },
  {
    id: 'tab-size',
    sourceFiles: ['src/_rules/typography.ts'],
    category: 'typography',
    canonical: [...tabSizeFixtures.canonical],
    invalid: [...tabSizeFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 tab-size 在 Tailwind 3 中没有原生 utility，旧 tab-* 语法应迁移到 arbitrary property [tab-size:...]。'],
  },
  {
    id: 'divide',
    sourceFiles: ['src/_rules-wind3/divide.ts'],
    category: 'border',
    canonical: [...divideFixtures.canonical],
    invalid: [...divideFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 divide 主规则族的 width、reverse、style、color 与 opacity 语义边界。'],
  },
  {
    id: 'fill',
    sourceFiles: ['src/_rules/svg.ts'],
    category: 'color',
    canonical: [...fillFixtures.canonical],
    invalid: [...fillFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 fill 主规则族只接受 Tailwind 3 的 fill color 与 none 语义。'],
  },
  {
    id: 'font-variant-numeric',
    sourceFiles: ['src/_rules-wind3/typography.ts'],
    category: 'typography',
    canonical: [...fontVariantNumericFixtures.canonical],
    invalid: [...fontVariantNumericFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 font-variant-numeric 主规则族只接受 Tailwind 3 官方的 numeric feature utilities，并拒绝旧别名与伪前缀写法。'],
  },
  {
    id: 'font',
    sourceFiles: ['src/_rules/typography.ts'],
    category: 'typography',
    canonical: [...fontFixtures.canonical],
    invalid: [...fontFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 font 主规则族只接受 Tailwind 3 的 font family 与 font weight 语义。'],
  },
  {
    id: 'text-align',
    sourceFiles: ['src/_rules/align.ts'],
    category: 'typography',
    canonical: [...textAlignFixtures.canonical],
    invalid: [...textAlignFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 text-align 主规则族只接受 Tailwind 3 的 text-left/right/center/justify/start/end 语义。'],
  },
  {
    id: 'vertical-align',
    sourceFiles: ['src/_rules/align.ts'],
    category: 'typography',
    canonical: [...verticalAlignFixtures.canonical],
    invalid: [...verticalAlignFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 vertical-align 主规则族只接受 Tailwind 3 的 align-* 与 align-[...] 语义。'],
  },
  {
    id: 'outline',
    sourceFiles: ['src/_rules/behaviors.ts'],
    category: 'behavior',
    canonical: [...outlineFixtures.canonical],
    invalid: [...outlineFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于建立“outline 语义锁定为 Tailwind 3 规则”的重写模板。'],
  },
  {
    id: 'ring',
    sourceFiles: ['src/_rules/ring.ts'],
    category: 'behavior',
    canonical: [...ringFixtures.canonical],
    invalid: [...ringFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 ring 主规则族的 width、color、offset、inset 与 opacity 语义边界。'],
  },
  {
    id: 'shadow',
    sourceFiles: ['src/_rules/shadow.ts'],
    category: 'behavior',
    canonical: [...shadowFixtures.canonical],
    invalid: [...shadowFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 shadow 主规则族的 theme、color、inner、none 与 arbitrary 语义边界。'],
  },
  {
    id: 'border-spacing-space',
    sourceFiles: ['src/_rules-wind3/table.ts', 'src/_rules-wind3/spacing.ts', 'src/rules.ts'],
    category: 'layout',
    canonical: [...borderSpacingSpaceFixtures.canonical],
    invalid: [...borderSpacingSpaceFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 spacing 第三子阶段的 border-spacing 与 space-x/y 主语法边界。'],
  },
  {
    id: 'gap-inset-scroll',
    sourceFiles: ['src/_rules/gap.ts', 'src/_rules/position.ts', 'src/_rules-wind3/scrolls.ts'],
    category: 'layout',
    canonical: [...gapInsetScrollFixtures.canonical],
    invalid: [...gapInsetScrollFixtures.invalid],
    supportsPrefix: true,
    supportsNegative: true,
    supportsVariants: true,
    notes: ['用于锁定 spacing 第二子阶段的 gap / inset / scroll 主语法边界。'],
  },
  {
    id: 'padding-margin',
    sourceFiles: ['src/_rules/spacing.ts'],
    category: 'layout',
    canonical: [...paddingMarginFixtures.canonical],
    invalid: [...paddingMarginFixtures.invalid],
    supportsPrefix: true,
    supportsNegative: true,
    supportsVariants: true,
    notes: ['用于锁定 spacing 第一子阶段的 padding / margin 语义边界。'],
  },
  {
    id: 'stroke',
    sourceFiles: ['src/_rules/svg.ts'],
    category: 'color',
    canonical: [...strokeFixtures.canonical],
    invalid: [...strokeFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 stroke 主规则族只接受 stroke-* 的颜色与宽度语义边界。'],
  },
  {
    id: 'transition',
    sourceFiles: ['src/_rules/transition.ts', 'src/_theme/transition.ts'],
    category: 'behavior',
    canonical: [...transitionFixtures.canonical],
    invalid: [...transitionFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 behavior 最后一轮的 transition / duration / delay / ease 主语法边界。'],
  },
  {
    id: 'text',
    sourceFiles: ['src/_rules/typography.ts'],
    category: 'typography',
    canonical: [...textFixtures.canonical],
    invalid: [...textFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 text 主规则族的 size、color 与 opacity 语义边界。'],
  },
  {
    id: 'leading',
    sourceFiles: ['src/_rules/typography.ts'],
    category: 'typography',
    canonical: [...leadingFixtures.canonical],
    invalid: [...leadingFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 leading 主规则族只接受 leading-* 的语义边界。'],
  },
  {
    id: 'tracking',
    sourceFiles: ['src/_rules/typography.ts'],
    category: 'typography',
    canonical: [...trackingFixtures.canonical],
    invalid: [...trackingFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于锁定 tracking 主规则族只接受 tracking-* 的语义边界。'],
  },
]
