export const trackingFixtures = {
  canonical: [
    'tracking-tighter',
    'tracking-tight',
    'tracking-normal',
    'tracking-wide',
    'tracking-wider',
    'tracking-widest',
    'tracking-[0.2em]',
    'tracking-[calc(1em-1px)]',
  ],
  invalid: [
    'font-tracking-wide',
    'tracking-0.2em',
    'letter-spacing-wide',
  ],
  semantic: [
    'tracking-tight',
    'tracking-wide',
    'tracking-[0.2em]',
    'tracking-[calc(1em-1px)]',
  ],
} as const
