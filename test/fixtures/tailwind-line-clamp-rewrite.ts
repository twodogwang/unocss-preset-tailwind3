export const lineClampFixtures = {
  canonical: [
    'line-clamp-1',
    'line-clamp-3',
    'line-clamp-6',
    'line-clamp-none',
    'line-clamp-[3]',
    'line-clamp-[var(--n)]',
    'line-clamp-[inherit]',
    'line-clamp-[calc(var(--n))]',
  ],
  invalid: [
    'line-clamp-0',
    'line-clamp-inherit',
    'line-clamp-initial',
    'line-clamp-unset',
    'line-clamp-revert',
    'line-clamp-revert-layer',
  ],
  semantic: [
    'line-clamp-3',
    'line-clamp-none',
    'line-clamp-[var(--n)]',
    'line-clamp-[inherit]',
  ],
} as const
