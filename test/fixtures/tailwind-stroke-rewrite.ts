export const strokeFixtures = {
  canonical: [
    'stroke-0',
    'stroke-1',
    'stroke-2',
    'stroke-red-500',
    'stroke-[#fff]',
    'stroke-[3px]',
    'stroke-[length:var(--stroke)]',
    'stroke-none',
  ],
  invalid: [
    'stroke-width-2',
    'stroke-size-2',
    'stroke-#fff',
    'stroke-red500',
    'stroke-opacity-50',
    'stroke-op50',
  ],
  semantic: [
    'stroke-2',
    'stroke-red-500',
    'stroke-[#fff]',
    'stroke-[3px]',
    'stroke-none',
  ],
} as const
