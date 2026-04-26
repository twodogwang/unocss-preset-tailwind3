export const overscrollFixtures = {
  canonical: [
    'overscroll-auto',
    'overscroll-contain',
    'overscroll-none',
    'overscroll-x-auto',
    'overscroll-x-contain',
    'overscroll-x-none',
    'overscroll-y-auto',
    'overscroll-y-contain',
    'overscroll-y-none',
  ],
  invalid: [
    'overscroll-inherit',
    'overscroll-initial',
    'overscroll-revert',
    'overscroll-x-inherit',
    'overscroll-y-initial',
  ],
  semantic: [
    'overscroll-auto',
    'overscroll-x-none',
    'overscroll-y-contain',
  ],
} as const
