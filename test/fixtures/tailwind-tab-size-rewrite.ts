export const tabSizeFixtures = {
  canonical: [] as string[],
  invalid: [
    'tab',
    'tab-1',
    'tab-4',
    'tab-8',
    'tab-[3]',
    'tab-[8]',
    'tab-[var(--n)]',
    '-tab-4',
    'tab-size-4',
    'tab-1/2',
  ],
  semantic: [] as string[],
} as const
