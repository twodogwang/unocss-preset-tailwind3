import type { Arrayable, CSSObject } from '@unocss/core'

export type ThemeAnimation = Record<string, string>
export type ThemeKeyframes = Record<string, string>

export interface Colors {
  [key: string]: Colors & { DEFAULT?: string } | string
}

export interface Theme {
  aspectRatio?: Record<string, string>
  width?: Record<string, string>
  height?: Record<string, string>
  maxWidth?: Record<string, string>
  maxHeight?: Record<string, string>
  minWidth?: Record<string, string>
  minHeight?: Record<string, string>
  inlineSize?: Record<string, string>
  blockSize?: Record<string, string>
  maxInlineSize?: Record<string, string>
  maxBlockSize?: Record<string, string>
  minInlineSize?: Record<string, string>
  minBlockSize?: Record<string, string>
  borderRadius?: Record<string, string>
  breakpoints?: Record<string, string>
  verticalBreakpoints?: Record<string, string>
  colors?: Colors
  borderColor?: Colors
  backgroundColor?: Colors
  textColor?: Colors
  shadowColor?: Colors
  accentColor?: Colors
  fontFamily?: Record<string, string>
  fontSize?: Record<string, string | [string, string | CSSObject] | [string, string, string]>
  fontWeight?: Record<string, string>
  lineHeight?: Record<string, string>
  letterSpacing?: Record<string, string>
  wordSpacing?: Record<string, string>
  boxShadow?: Record<string, string | string[]>
  textIndent?: Record<string, string>
  textShadow?: Record<string, string | string[]>
  textStrokeWidth?: Record<string, string>
  ringWidth?: Record<string, string>
  lineWidth?: Record<string, string>
  spacing?: Record<string, string>
  translate?: Record<string, string>
  rotate?: Record<string, string>
  scale?: Record<string, string>
  skew?: Record<string, string>
  transformOrigin?: Record<string, string>
  duration?: Record<string, string>
  aria?: Record<string, string>
  data?: Record<string, string>
  order?: Record<string, string>
  zIndex?: Record<string, string>
  // filters
  blur?: Record<string, string>
  brightness?: Record<string, string>
  contrast?: Record<string, string>
  dropShadow?: Record<string, string | string[]>
  grayscale?: Record<string, string>
  hueRotate?: Record<string, string>
  invert?: Record<string, string>
  opacity?: Record<string, string>
  saturate?: Record<string, string>
  sepia?: Record<string, string>
  // transitions
  easing?: Record<string, string>
  transitionProperty?: Record<string, string>
  willChange?: Record<string, string>
  // media queries
  media?: Record<string, string>
  // supports queries
  supports?: Record<string, string>
  // container queries
  containers?: Record<string, string>
  // columns
  columns?: Record<string, string>
  // flex
  flexBasis?: Record<string, string>
  flexGrow?: Record<string, string>
  flexShrink?: Record<string, string>
  // animation
  animation?: ThemeAnimation
  keyframes?: ThemeKeyframes
  // grids
  gridAutoColumns?: Record<string, string>
  gridAutoRows?: Record<string, string>
  gridAutoColumn?: Record<string, string>
  gridAutoRow?: Record<string, string>
  gridColumn?: Record<string, string>
  gridColumnEnd?: Record<string, string>
  gridColumnStart?: Record<string, string>
  gridRow?: Record<string, string>
  gridRowEnd?: Record<string, string>
  gridRowStart?: Record<string, string>
  gridTemplateColumns?: Record<string, string>
  gridTemplateRows?: Record<string, string>
  gridTemplateColumn?: Record<string, string>
  gridTemplateRow?: Record<string, string>
  // container
  container?: {
    center?: boolean
    padding?: string | Record<string, string>
    screens?: Record<string, string>
  }
  // vars
  /** Used to generate CSS custom properties placeholder in preflight */
  preflightRoot?: Arrayable<string>
  preflightBase?: Record<string, string | number>
}
