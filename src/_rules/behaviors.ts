import type { CSSObject, Rule, RuleContext } from '@unocss/core'
import type { Theme } from '../theme'
import { colorResolver, h } from '../utils'

export const outline: Rule<Theme>[] = [
  // size / color / style
  [/^outline-(.+)$/, handleOutlineValue, { autocomplete: 'outline-$colors' }],

  // offset
  [/^outline-offset-(.+)$/, ([, d], { theme }) => ({ 'outline-offset': theme.lineWidth?.[d] ?? h.bracket.cssvar.global.px(d) }), { autocomplete: 'outline-(offset)-<num>' }],

  // style
  ['outline', { 'outline-style': 'solid' }],
  ['outline-none', { 'outline': '2px solid transparent', 'outline-offset': '2px' }],
]

const outlineStyles = new Set(['dashed', 'dotted', 'double'])
const nonTailwindOutlineKeywords = new Set(['initial', 'unset', 'revert', 'revert-layer'])

function handleOutlineValue([, value]: string[], ctx: RuleContext<Theme>): CSSObject | undefined {
  if (outlineStyles.has(value))
    return { 'outline-style': value }

  if (nonTailwindOutlineKeywords.has(value))
    return

  const width = ctx.theme.lineWidth?.[value]
    ?? (/^\d+$/.test(value) ? `${value}px` : undefined)
    ?? h.bracket.cssvar.global.px(value)
  if (width)
    return { 'outline-width': width }

  const color = colorResolver('outline-color', 'outline-color', 'borderColor')(['', value], ctx) as CSSObject | undefined
  if (color)
    return color
}

export const appearance: Rule[] = [
  ['appearance-auto', { '-webkit-appearance': 'auto', 'appearance': 'auto' }],
  ['appearance-none', { '-webkit-appearance': 'none', 'appearance': 'none' }],
]

function willChangeProperty(prop: string): string | undefined {
  return h.properties.auto.global(prop) ?? {
    contents: 'contents',
    scroll: 'scroll-position',
  }[prop]
}

export const willChange: Rule[] = [
  [/^will-change-(.+)/, ([, p]) => ({ 'will-change': willChangeProperty(p) })],
]
