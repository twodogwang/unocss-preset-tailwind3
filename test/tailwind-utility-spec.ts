import { borderWidthFixtures } from './fixtures/tailwind-border-rewrite'

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
    canonical: [
      'rounded',
      'rounded-md',
      'rounded-t-lg',
      'rounded-s-xl',
      'rounded-se-2xl',
      'rounded-[10px]',
    ],
    invalid: [
      'rd-md',
      'rounded-10px',
      'roundedt-lg',
      'border-rounded-md',
    ],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['用于建立“方向修饰合法、紧凑别名非法”的重写模板。'],
  },
]
