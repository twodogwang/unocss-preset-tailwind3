export const backgroundColorFixtures = {
  canonical: [
    'bg-red-500',
    'bg-red-500/50',
    'bg-[#fff]',
    'bg-opacity-50',
  ],
  invalid: [
    'bg-#fff',
    'bg-red500',
    'bg-op50',
    'bg-op-50',
    'bgred500',
  ],
  semantic: [
    'bg-red-500',
    'bg-red-500/50',
    'bg-[#fff]',
    'bg-opacity-50',
    'bg-brand',
  ],
} as const
