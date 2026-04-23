import type { Rule, RuleContext } from '@unocss/core'
import type { Theme } from '../theme'
import { h, resolveBreakpoints, resolveTailwindSpacing } from '../utils'

const sizeMapping: Record<string, string> = {
  h: 'height',
  w: 'width',
  inline: 'inline-size',
  block: 'block-size',
}

function getPropName(minmax: string, hw: string) {
  return `${minmax || ''}${sizeMapping[hw]}`
}

type SizeProps = 'width' | 'height' | 'maxWidth' | 'maxHeight' | 'minWidth' | 'minHeight' | 'inlineSize' | 'blockSize' | 'maxInlineSize' | 'maxBlockSize' | 'minInlineSize' | 'minBlockSize'

function getSizeValue(minmax: string, hw: string, theme: Theme, prop: string) {
  const key = getPropName(minmax, hw).replace(/-(\w)/g, (_, p) => p.toUpperCase()) as SizeProps
  const v = theme[key]?.[prop]
  if (v != null)
    return v

  if (prop === 'none')
    return

  const spacingValue = resolveTailwindSpacing(theme, prop, { allowFraction: true })
  if (spacingValue != null)
    return spacingValue

  switch (prop) {
    case 'fit':
    case 'max':
    case 'min':
      return `${prop}-content`
    case 'stretch':
      return 'stretch'
  }
}

function getSquareSizeValue(theme: Theme, prop: string) {
  if (prop === 'none')
    return

  const spacingValue = resolveTailwindSpacing(theme, prop, { allowAuto: true, allowFraction: true })
  if (spacingValue != null)
    return spacingValue

  switch (prop) {
    case 'full':
      return '100%'
    case 'fit':
    case 'max':
    case 'min':
      return `${prop}-content`
  }
}

export const sizes: Rule<Theme>[] = [
  [/^size-(.+)$/, ([, s], { theme }) => {
    const value = getSquareSizeValue(theme, s)
    if (value != null)
      return { width: value, height: value }
  }],
  [/^(min-|max-)?([wh])-(.+)$/, ([, m, w, s], { theme }) => ({ [getPropName(m, w)]: getSizeValue(m, w, theme, s) }), {
    autocomplete: [
      '(w|h)-$width|height|maxWidth|maxHeight|minWidth|minHeight',
      '(max|min)-(w|h)',
      '(max|min)-(w|h)-$width|height|maxWidth|maxHeight|minWidth|minHeight',
      '(w|h)-full',
      '(max|min)-(w|h)-full',
    ],
  }],
  [/^(max-)(w)-screen-(.+)$/, ([, m, w, p], context) => ({ [getPropName(m, w)]: handleBreakpoint(context, p) }), {
    autocomplete: [
      'max-w-screen-$breakpoints',
    ],
  }],
]

function handleBreakpoint(context: Readonly<RuleContext<Theme>>, point: string, key: 'breakpoints' | 'verticalBreakpoints' = 'breakpoints') {
  const bp = resolveBreakpoints(context, key)
  if (bp)
    return bp.find(i => i.point === point)?.size
}

function getAspectRatio(prop: string) {
  if (/^\d+\/\d+$/.test(prop))
    return prop

  switch (prop) {
    case 'square': return '1/1'
    case 'video': return '16/9'
  }

  return h.bracket.cssvar.global.auto.number(prop)
}

export const aspectRatio: Rule[] = [
  [/^(?:size-)?aspect-(?:ratio-)?(.+)$/, ([, d]: string[]) => ({ 'aspect-ratio': getAspectRatio(d) }), { autocomplete: ['aspect-(square|video|ratio)', 'aspect-ratio-(square|video)'] }],
]
