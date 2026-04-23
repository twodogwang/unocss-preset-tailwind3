import { accentFixtures } from './fixtures/tailwind-accent-rewrite'
import { caretFixtures } from './fixtures/tailwind-caret-rewrite'
import { backgroundColorFixtures } from './fixtures/tailwind-background-color-rewrite'
import { backgroundStyleFixtures } from './fixtures/tailwind-background-style-rewrite'
import { borderWidthFixtures, roundedFixtures } from './fixtures/tailwind-border-rewrite'
import { decorationFixtures } from './fixtures/tailwind-decoration-rewrite'
import { divideFixtures } from './fixtures/tailwind-divide-rewrite'
import { fillFixtures } from './fixtures/tailwind-fill-rewrite'
import { fontFixtures } from './fixtures/tailwind-font-rewrite'
import { leadingFixtures } from './fixtures/tailwind-leading-rewrite'
import { outlineFixtures } from './fixtures/tailwind-outline-rewrite'
import { ringFixtures } from './fixtures/tailwind-ring-rewrite'
import { shadowFixtures } from './fixtures/tailwind-shadow-rewrite'
import { borderSpacingSpaceFixtures } from './fixtures/tailwind-spacing-border-spacing-space-rewrite'
import { gapInsetScrollFixtures } from './fixtures/tailwind-spacing-gap-inset-scroll-rewrite'
import { paddingMarginFixtures } from './fixtures/tailwind-spacing-padding-margin-rewrite'
import { strokeFixtures } from './fixtures/tailwind-stroke-rewrite'
import { trackingFixtures } from './fixtures/tailwind-tracking-rewrite'
import { transitionFixtures } from './fixtures/tailwind-transition-rewrite'
import { textFixtures } from './fixtures/tailwind-text-rewrite'

export interface TailwindUtilitySpec {
  id: string
  sourceFiles: string[]
  category: 'border' | 'typography' | 'layout' | 'behavior' | 'color' | 'transform'
  canonical: string[]
  invalid: string[]
  supportsPrefix: boolean
  supportsNegative?: boolean
  supportsVariants?: boolean
  notes?: string[]
}

export const tailwindUtilitySpecs: TailwindUtilitySpec[] = [
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
    notes: ['用于锁定 decoration / underline-offset 主规则族的 thickness、style、color 与 offset 语义边界。'],
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
