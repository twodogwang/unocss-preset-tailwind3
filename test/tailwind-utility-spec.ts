import { borderWidthFixtures, roundedFixtures } from './fixtures/tailwind-border-rewrite'
import { leadingFixtures } from './fixtures/tailwind-leading-rewrite'
import { outlineFixtures } from './fixtures/tailwind-outline-rewrite'
import { trackingFixtures } from './fixtures/tailwind-tracking-rewrite'
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
