import type { Theme } from './types'

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
