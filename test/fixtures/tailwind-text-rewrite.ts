export const textFixtures = {
  canonical: [
    'text-sm',
    'text-lg/7',
    'text-[14px]',
    'text-[14px]/[20px]',
    'text-white',
    'text-red-500/50',
    'text-[#fff]',
    'text-opacity-50',
  ],
  invalid: [
    'text-10px',
    'text-2rem',
    'text-size-sm',
    'font-size-sm',
    'text-#fff',
    'text-red500',
    'text-color-red-500',
  ],
  semantic: [
    'text-sm',
    'text-lg/7',
    'text-[14px]',
    'text-[14px]/[20px]',
    'text-white',
    'text-opacity-50',
  ],
} as const
