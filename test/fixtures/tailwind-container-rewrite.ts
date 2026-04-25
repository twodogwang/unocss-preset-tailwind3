export const containerFixtures = {
  canonical: [
    'container',
    'sm:container',
    'md:container',
    'lg:container',
    'max-md:container',
  ],
  invalid: [
    'container-normal',
    'container-size',
    'container-inline-size',
    '@container',
    '@container/sidebar',
    '@container-normal',
    '@container-size',
    '@container-inline-size',
  ],
  semantic: [
    'container',
    'md:container',
    'max-md:container',
  ],
} as const
