import type { Theme } from './types'
import { spacing } from './misc'

export const aspectRatio = {
  auto: 'auto',
  square: '1 / 1',
  video: '16 / 9',
} satisfies Theme['aspectRatio']

export const baseSize = {
  'xs': '20rem',
  'sm': '24rem',
  'md': '28rem',
  'lg': '32rem',
  'xl': '36rem',
  '2xl': '42rem',
  '3xl': '48rem',
  '4xl': '56rem',
  '5xl': '64rem',
  '6xl': '72rem',
  '7xl': '80rem',
  'prose': '65ch',
}

export const width = {
  auto: 'auto',
  full: '100%',
  screen: '100vw',
  svw: '100svw',
  lvw: '100lvw',
  dvw: '100dvw',
  min: 'min-content',
  max: 'max-content',
  fit: 'fit-content',
} satisfies Theme['width']

export const maxWidth = {
  none: 'none',
  ...baseSize,
  full: '100%',
  min: 'min-content',
  max: 'max-content',
  fit: 'fit-content',
} satisfies Theme['maxWidth']

export const minWidth = {
  full: '100%',
  min: 'min-content',
  max: 'max-content',
  fit: 'fit-content',
} satisfies Theme['minWidth']

export const blockSize = {
  auto: 'auto',
  ...baseSize,
  screen: '100vb',
} satisfies Theme['blockSize']

export const inlineSize = {
  auto: 'auto',
  ...baseSize,
  screen: '100vi',
} satisfies Theme['inlineSize']

export const height = {
  auto: 'auto',
  full: '100%',
  screen: '100vh',
  svh: '100svh',
  lvh: '100lvh',
  dvh: '100dvh',
  min: 'min-content',
  max: 'max-content',
  fit: 'fit-content',
} satisfies Theme['height']

export const maxHeight = {
  none: 'none',
  full: '100%',
  screen: '100vh',
  svh: '100svh',
  lvh: '100lvh',
  dvh: '100dvh',
  min: 'min-content',
  max: 'max-content',
  fit: 'fit-content',
} satisfies Theme['maxHeight']

export const minHeight = {
  full: '100%',
  screen: '100vh',
  svh: '100svh',
  lvh: '100lvh',
  dvh: '100dvh',
  min: 'min-content',
  max: 'max-content',
  fit: 'fit-content',
} satisfies Theme['minHeight']

export const maxBlockSize = {
  none: 'none',
  ...baseSize,
  screen: '100vb',
} satisfies Theme['maxBlockSize']

export const maxInlineSize = {
  none: 'none',
  ...baseSize,
  screen: '100vi',
} satisfies Theme['maxInlineSize']

export const containers = { ...baseSize } satisfies Theme['containers']

export const columns = {
  auto: 'auto',
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
  '3xs': '16rem',
  '2xs': '18rem',
  ...baseSize,
} satisfies Theme['columns']

export const flexBasis = {
  auto: 'auto',
  ...spacing,
  '1/2': '50%',
  '1/3': '33.333333%',
  '2/3': '66.666667%',
  '1/4': '25%',
  '2/4': '50%',
  '3/4': '75%',
  '1/5': '20%',
  '2/5': '40%',
  '3/5': '60%',
  '4/5': '80%',
  '1/6': '16.666667%',
  '2/6': '33.333333%',
  '3/6': '50%',
  '4/6': '66.666667%',
  '5/6': '83.333333%',
  '1/12': '8.333333%',
  '2/12': '16.666667%',
  '3/12': '25%',
  '4/12': '33.333333%',
  '5/12': '41.666667%',
  '6/12': '50%',
  '7/12': '58.333333%',
  '8/12': '66.666667%',
  '9/12': '75%',
  '10/12': '83.333333%',
  '11/12': '91.666667%',
  full: '100%',
} satisfies Theme['flexBasis']

export const gridAutoColumns = {
  auto: 'auto',
  min: 'min-content',
  max: 'max-content',
  fr: 'minmax(0, 1fr)',
} satisfies Theme['gridAutoColumns']

export const gridAutoRows = { ...gridAutoColumns } satisfies Theme['gridAutoRows']

export const gridColumn = {
  auto: 'auto',
  'span-1': 'span 1 / span 1',
  'span-2': 'span 2 / span 2',
  'span-3': 'span 3 / span 3',
  'span-4': 'span 4 / span 4',
  'span-5': 'span 5 / span 5',
  'span-6': 'span 6 / span 6',
  'span-7': 'span 7 / span 7',
  'span-8': 'span 8 / span 8',
  'span-9': 'span 9 / span 9',
  'span-10': 'span 10 / span 10',
  'span-11': 'span 11 / span 11',
  'span-12': 'span 12 / span 12',
  'span-full': '1 / -1',
} satisfies Theme['gridColumn']

export const gridRow = { ...gridColumn } satisfies Theme['gridRow']

const gridLineNumbers = {
  auto: 'auto',
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
  13: '13',
}

export const gridColumnStart = { ...gridLineNumbers } satisfies Theme['gridColumnStart']
export const gridColumnEnd = { ...gridLineNumbers } satisfies Theme['gridColumnEnd']
export const gridRowStart = { ...gridLineNumbers } satisfies Theme['gridRowStart']
export const gridRowEnd = { ...gridLineNumbers } satisfies Theme['gridRowEnd']

export const gridTemplateColumns = {
  none: 'none',
  subgrid: 'subgrid',
  1: 'repeat(1, minmax(0, 1fr))',
  2: 'repeat(2, minmax(0, 1fr))',
  3: 'repeat(3, minmax(0, 1fr))',
  4: 'repeat(4, minmax(0, 1fr))',
  5: 'repeat(5, minmax(0, 1fr))',
  6: 'repeat(6, minmax(0, 1fr))',
  7: 'repeat(7, minmax(0, 1fr))',
  8: 'repeat(8, minmax(0, 1fr))',
  9: 'repeat(9, minmax(0, 1fr))',
  10: 'repeat(10, minmax(0, 1fr))',
  11: 'repeat(11, minmax(0, 1fr))',
  12: 'repeat(12, minmax(0, 1fr))',
} satisfies Theme['gridTemplateColumns']

export const gridTemplateRows = { ...gridTemplateColumns } satisfies Theme['gridTemplateRows']
