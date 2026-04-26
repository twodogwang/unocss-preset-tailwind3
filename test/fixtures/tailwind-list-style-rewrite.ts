export const listStyleFixtures = {
  canonical: [
    'list-none',
    'list-disc',
    'list-decimal',
    'list-inside',
    'list-outside',
    'list-image-none',
    'list-[upper-roman]',
    'list-image-[url(/img/marker.svg)]',
  ],
  invalid: [
    'list-circle',
    'list-square',
    'list-decimal-inside',
    'list-greek',
    'list-roman',
    'list-inherit',
    'list-image-url(/img/marker.svg)',
  ],
  semantic: [
    'list-none',
    'list-disc',
    'list-inside',
    'list-image-none',
    'list-[upper-roman]',
    'list-image-[url(/img/marker.svg)]',
  ],
} as const
