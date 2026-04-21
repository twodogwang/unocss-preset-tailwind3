import type { Rule, RuleContext } from '@unocss/core'
import type { Theme } from '../theme'
import type { CSSColorValue } from '@unocss/rule-utils'
import { h, makeGlobalStaticRules, parseColor, positionMap } from '../utils'
import { colorOpacityToString, colorToString } from '@unocss/rule-utils'

function bgGradientToValue(cssColor: CSSColorValue | undefined) {
  if (cssColor)
    return colorToString(cssColor, 0)

  return 'rgb(255 255 255 / 0)'
}

function bgGradientColorValue(mode: string, cssColor: CSSColorValue | undefined, color: string, alpha: any) {
  if (cssColor) {
    if (alpha != null)
      return colorToString(cssColor, alpha)
    else
      return colorToString(cssColor, `var(--un-${mode}-opacity, ${colorOpacityToString(cssColor)})`)
  }

  return colorToString(color, alpha)
}

function bgGradientColorResolver() {
  return ([, mode, body]: string[], { theme }: RuleContext<Theme>) => {
    const data = parseColor(body, theme, 'backgroundColor')

    if (!data)
      return

    const { alpha, color, cssColor } = data

    if (!color)
      return

    const colorString = bgGradientColorValue(mode, cssColor, color, alpha)

    switch (mode) {
      case 'from':
        return {
          '--un-gradient-from-position': '0%',
          '--un-gradient-from': `${colorString} var(--un-gradient-from-position)`,
          '--un-gradient-to-position': '100%',
          '--un-gradient-to': `${bgGradientToValue(cssColor)} var(--un-gradient-to-position)`,
          '--un-gradient-stops': 'var(--un-gradient-from), var(--un-gradient-to)',
        }
      case 'via':
        return {
          '--un-gradient-via-position': '50%',
          '--un-gradient-to': bgGradientToValue(cssColor),
          '--un-gradient-stops': `var(--un-gradient-from), ${colorString} var(--un-gradient-via-position), var(--un-gradient-to)`,
        }
      case 'to':
        return {
          '--un-gradient-to-position': '100%',
          '--un-gradient-to': `${colorString} var(--un-gradient-to-position)`,
        }
    }
  }
}

function bgGradientPositionResolver() {
  return ([, mode, body]: string[]) => {
    return {
      [`--un-gradient-${mode}-position`]: `${Number(h.bracket.cssvar.percent(body)) * 100}%`,
    }
  }
}

export const backgroundStyles: Rule[] = [
  // gradients
  [/^bg-gradient-(.+)$/, ([, d]) => {
    const value = h.bracket(d)
    if (value != null)
      return { '--un-gradient': value }
  }, {
    autocomplete: ['bg-gradient', 'bg-gradient-(from|to|via)', 'bg-gradient-(from|to|via)-$colors', 'bg-gradient-(from|to|via)-(op|opacity)', 'bg-gradient-(from|to|via)-(op|opacity)-<percent>'],
  }],
  [/^(from)-(.+)$/, bgGradientColorResolver()],
  [/^(via)-(.+)$/, bgGradientColorResolver()],
  [/^(to)-(.+)$/, bgGradientColorResolver()],
  [/^(from|via|to)-([\d.]+)%$/, bgGradientPositionResolver()],
  // ignore any center position
  [/^bg-gradient-to-([rltb]{1,2})$/, ([, d]) => {
    if (d in positionMap) {
      return {
        '--un-gradient-shape': `to ${positionMap[d]} in oklch`,
        '--un-gradient': 'var(--un-gradient-shape), var(--un-gradient-stops)',
        'background-image': 'linear-gradient(var(--un-gradient))',
      }
    }
  }, { autocomplete: `bg-gradient-to-(${Object.keys(positionMap).filter(k => k.length <= 2 && Array.from(k).every(c => 'rltb'.includes(c))).join('|')})` }],
  ['bg-none', { 'background-image': 'none' }],

  ['box-decoration-slice', { 'box-decoration-break': 'slice' }],
  ['box-decoration-clone', { 'box-decoration-break': 'clone' }],
  ...makeGlobalStaticRules('box-decoration', 'box-decoration-break'),

  // size
  ['bg-auto', { 'background-size': 'auto' }],
  ['bg-cover', { 'background-size': 'cover' }],
  ['bg-contain', { 'background-size': 'contain' }],

  // attachments
  ['bg-fixed', { 'background-attachment': 'fixed' }],
  ['bg-local', { 'background-attachment': 'local' }],
  ['bg-scroll', { 'background-attachment': 'scroll' }],

  // clips
  ['bg-clip-border', { '-webkit-background-clip': 'border-box', 'background-clip': 'border-box' }],
  ['bg-clip-content', { '-webkit-background-clip': 'content-box', 'background-clip': 'content-box' }],
  ['bg-clip-padding', { '-webkit-background-clip': 'padding-box', 'background-clip': 'padding-box' }],
  ['bg-clip-text', { '-webkit-background-clip': 'text', 'background-clip': 'text' }],

  // positions
  // skip 1 & 2 letters shortcut
  [/^bg-([-\w]{3,})$/, ([, s]) => ({ 'background-position': positionMap[s] })],

  // repeats
  ['bg-repeat', { 'background-repeat': 'repeat' }],
  ['bg-no-repeat', { 'background-repeat': 'no-repeat' }],
  ['bg-repeat-x', { 'background-repeat': 'repeat-x' }],
  ['bg-repeat-y', { 'background-repeat': 'repeat-y' }],
  ['bg-repeat-round', { 'background-repeat': 'round' }],
  ['bg-repeat-space', { 'background-repeat': 'space' }],

  // origins
  ['bg-origin-border', { 'background-origin': 'border-box' }],
  ['bg-origin-padding', { 'background-origin': 'padding-box' }],
  ['bg-origin-content', { 'background-origin': 'content-box' }],
]
