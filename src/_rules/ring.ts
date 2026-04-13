import type { CSSObject, Rule, RuleContext } from '@unocss/core'
import type { Theme } from '../theme'
import { colorResolver, h } from '../utils'
import { varEmpty } from './static'

export const ringBase = {
  '--un-ring-inset': varEmpty,
  '--un-ring-offset-width': '0px',
  '--un-ring-offset-color': '#fff',
  '--un-ring-width': '0px',
  '--un-ring-color': 'rgb(147 197 253 / 0.5)',
  '--un-shadow': '0 0 rgb(0 0 0 / 0)',
}
const preflightKeys = Object.keys(ringBase)

export const rings: Rule<Theme>[] = [
  // ring
  [/^ring(?:-(.+))?$/, ([, d], { theme }) => {
    const value = d == null
      ? (theme.ringWidth?.DEFAULT ?? '1px')
      : (theme.ringWidth?.[d] ?? h.bracket.cssvar.px(d))
    if (value) {
      return {
        '--un-ring-width': value,
        '--un-ring-offset-shadow': 'var(--un-ring-inset) 0 0 0 var(--un-ring-offset-width) var(--un-ring-offset-color)',
        '--un-ring-shadow': 'var(--un-ring-inset) 0 0 0 calc(var(--un-ring-width) + var(--un-ring-offset-width)) var(--un-ring-color)',
        'box-shadow': 'var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow)',
      }
    }
  }, { custom: { preflightKeys }, autocomplete: 'ring-$ringWidth' }],

  // offset size
  [/^ring-offset-(.+)$/, handleOffsetWidth, { autocomplete: 'ring-offset-$lineWidth' }],

  // colors
  [/^ring-(.+)$/, handleColor, { autocomplete: 'ring-$colors' }],
  [/^ring-opacity-(.+)$/, ([, opacity]) => ({ '--un-ring-opacity': h.bracket.percent.cssvar(opacity) }), { autocomplete: 'ring-opacity-<percent>' }],

  // offset color
  [/^ring-offset-(.+)$/, colorResolver('--un-ring-offset-color', 'ring-offset', 'borderColor'), { autocomplete: 'ring-offset-$colors' }],

  // style
  ['ring-inset', { '--un-ring-inset': 'inset' }],
]

function handleOffsetWidth([, d]: string[], { theme }: RuleContext<Theme>): CSSObject | undefined {
  const value = theme.lineWidth?.[d] ?? h.bracket.cssvar.px(d)
  if (value)
    return { '--un-ring-offset-width': value }
}

function handleColor(match: RegExpMatchArray, ctx: RuleContext<Theme>): CSSObject | undefined {
  return colorResolver('--un-ring-color', 'ring', 'borderColor')(match, ctx) as CSSObject | undefined
}
