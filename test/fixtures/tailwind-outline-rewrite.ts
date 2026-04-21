export const outlineFixtures = {
  canonical: [
    'outline-0',
    'outline-2',
    'outline-[3px]',
    'outline-[calc(100%-1px)]',
    'outline-offset-0',
    'outline-offset-2',
    'outline-offset-[3px]',
    'outline-offset-[calc(100%-1px)]',
  ],
  invalid: [
    'outline-3px',
    'outline-offset-3px',
    'outline-offset-none',
    'outline-width-2',
  ],
  semantic: [
    'outline-2',
    'outline-offset-2',
  ],
} as const
