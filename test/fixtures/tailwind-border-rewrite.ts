export const borderWidthFixtures = {
  canonical: [
    'border',
    'border-2',
    'border-x',
    'border-x-2',
    'border-s-2',
    'border-[10px]',
    'border-x-[10px]',
  ],
  invalid: [
    'b-2',
    'border-10px',
    'border-x-10px',
    'border-color-red-500',
    'borderx',
  ],
} as const

export const roundedFixtures = {
  canonical: [
    'rounded',
    'rounded-md',
    'rounded-t-lg',
    'rounded-s-xl',
    'rounded-se-2xl',
    'rounded-ss-lg',
    'rounded-es-lg',
    'rounded-[10px]',
  ],
  invalid: [
    'rd-md',
    'rounded-10px',
    'roundedt-lg',
    'rounded-lt-lg',
    'rounded-rt-lg',
    'border-rounded-md',
  ],
} as const
