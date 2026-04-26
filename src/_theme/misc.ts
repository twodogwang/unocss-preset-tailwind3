import type { Theme } from './types'

// keep in ASC order: container.ts and breakpoints.ts need that order
export const breakpoints = {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
} satisfies Theme['breakpoints']

export const verticalBreakpoints = { ...breakpoints } satisfies Theme['breakpoints']

export const lineWidth = {
  DEFAULT: '1px',
  none: '0',
} satisfies Theme['lineWidth']

export const spacing = {
  'none': '0',
  'px': '1px',
  '0': '0px',
  '0.5': '0.125rem',
  '1': '0.25rem',
  '1.5': '0.375rem',
  '2': '0.5rem',
  '2.5': '0.625rem',
  '3': '0.75rem',
  '3.5': '0.875rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '7': '1.75rem',
  '8': '2rem',
  '9': '2.25rem',
  '10': '2.5rem',
  '11': '2.75rem',
  '12': '3rem',
  '14': '3.5rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem',
  '28': '7rem',
  '32': '8rem',
  '36': '9rem',
  '40': '10rem',
  '44': '11rem',
  '48': '12rem',
  '52': '13rem',
  '56': '14rem',
  '60': '15rem',
  '64': '16rem',
  '72': '18rem',
  '80': '20rem',
  '96': '24rem',
} satisfies Theme['spacing']

export const translate = {
  ...spacing,
  '1/2': '50%',
  '1/3': '33.333333%',
  '2/3': '66.666667%',
  '1/4': '25%',
  '2/4': '50%',
  '3/4': '75%',
  full: '100%',
} satisfies Theme['translate']

export const rotate = {
  0: '0deg',
  1: '1deg',
  2: '2deg',
  3: '3deg',
  6: '6deg',
  12: '12deg',
  45: '45deg',
  90: '90deg',
  180: '180deg',
} satisfies Theme['rotate']

export const scale = {
  0: '0',
  50: '.5',
  75: '.75',
  90: '.9',
  95: '.95',
  100: '1',
  105: '1.05',
  110: '1.1',
  125: '1.25',
  150: '1.5',
} satisfies Theme['scale']

export const skew = {
  0: '0deg',
  1: '1deg',
  2: '2deg',
  3: '3deg',
  6: '6deg',
  12: '12deg',
} satisfies Theme['skew']

export const transformOrigin = {
  center: 'center',
  top: 'top',
  'top-right': 'top right',
  right: 'right',
  'bottom-right': 'bottom right',
  bottom: 'bottom',
  'bottom-left': 'bottom left',
  left: 'left',
  'top-left': 'top left',
} satisfies Theme['transformOrigin']

export const duration = {
  DEFAULT: '150ms',
  none: '0s',
  75: '75ms',
  100: '100ms',
  150: '150ms',
  200: '200ms',
  300: '300ms',
  500: '500ms',
  700: '700ms',
  1000: '1000ms',
} satisfies Theme['duration']

export const borderRadius = {
  'DEFAULT': '0.25rem',
  'none': '0',
  'sm': '0.125rem',
  'md': '0.375rem',
  'lg': '0.5rem',
  'xl': '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  'full': '9999px',
} satisfies Theme['borderRadius']

export const boxShadow = {
  'DEFAULT': ['var(--un-shadow-inset) 0 1px 3px 0 rgb(0 0 0 / 0.1)', 'var(--un-shadow-inset) 0 1px 2px -1px rgb(0 0 0 / 0.1)'],
  'none': '0 0 rgb(0 0 0 / 0)',
  'sm': 'var(--un-shadow-inset) 0 1px 2px 0 rgb(0 0 0 / 0.05)',
  'md': ['var(--un-shadow-inset) 0 4px 6px -1px rgb(0 0 0 / 0.1)', 'var(--un-shadow-inset) 0 2px 4px -2px rgb(0 0 0 / 0.1)'],
  'lg': ['var(--un-shadow-inset) 0 10px 15px -3px rgb(0 0 0 / 0.1)', 'var(--un-shadow-inset) 0 4px 6px -4px rgb(0 0 0 / 0.1)'],
  'xl': ['var(--un-shadow-inset) 0 20px 25px -5px rgb(0 0 0 / 0.1)', 'var(--un-shadow-inset) 0 8px 10px -6px rgb(0 0 0 / 0.1)'],
  '2xl': 'var(--un-shadow-inset) 0 25px 50px -12px rgb(0 0 0 / 0.25)',
  'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} satisfies Theme['boxShadow']

export const ringWidth = {
  DEFAULT: '3px',
  none: '0',
} satisfies Theme['ringWidth']

export const zIndex = {
  auto: 'auto',
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
}

export const order = {
  first: '-9999',
  last: '9999',
  none: '0',
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: '11',
  12: '12',
}

export const flexGrow = {
  0: '0',
  DEFAULT: '1',
} satisfies Theme['flexGrow']

export const flexShrink = {
  0: '0',
  DEFAULT: '1',
} satisfies Theme['flexShrink']

export const media = {
  mouse: '(hover) and (pointer: fine)',
}
