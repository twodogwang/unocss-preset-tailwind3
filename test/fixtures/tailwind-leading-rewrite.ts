export const leadingFixtures = {
  canonical: [
    'leading-none',
    'leading-tight',
    'leading-snug',
    'leading-normal',
    'leading-relaxed',
    'leading-loose',
    'leading-6',
    'leading-[20px]',
    'leading-[calc(100%-1px)]',
  ],
  invalid: [
    'lh-6',
    'line-height-6',
    'font-leading-6',
    'leading-20px',
  ],
  semantic: [
    'leading-none',
    'leading-6',
    'leading-[20px]',
    'leading-[calc(100%-1px)]',
  ],
} as const

export const leadingTextShorthandRegressionFixtures = [
  'text-lg/7',
  'text-[14px]/[20px]',
] as const
