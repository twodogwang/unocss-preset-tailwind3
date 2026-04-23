export const aspectRatioFixtures = {
  canonical: [
    'aspect-auto',
    'aspect-square',
    'aspect-video',
    'aspect-[4/3]',
    'aspect-[var(--ratio)]',
    'aspect-[calc(4/3)]',
  ],
  invalid: [
    'aspect-1/1',
    'aspect-16/9',
    'aspect-4/3',
    'aspect-ratio-auto',
    'aspect-ratio-square',
    'aspect-ratio-video',
    'aspect-ratio-[4/3]',
    'size-aspect-square',
    'aspect-square/2',
    'aspect-none',
  ],
  semantic: [
    'aspect-auto',
    'aspect-square',
    'aspect-video',
    'aspect-[4/3]',
  ],
} as const
