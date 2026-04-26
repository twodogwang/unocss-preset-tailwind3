import type { CSSObject, Rule, RuleContext } from '@unocss/core'
import type { Theme } from '../theme'
import { colorResolver, h } from '../utils'

export const outline: Rule<Theme>[] = [
  // size / color / style
  [/^outline-(.+)$/, handleOutlineValue, { autocomplete: 'outline-$colors' }],

  // offset
  [/^outline-offset-(.+)$/, ([, d], { theme }) => {
    if (d === 'none')
      return

    const offset = resolveOutlineSize(d, theme)
    if (offset)
      return { 'outline-offset': offset }
  }, { autocomplete: 'outline-(offset)-<num>' }],

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

  const width = resolveOutlineSize(value, ctx.theme)
  if (width)
    return { 'outline-width': width }

  const color = colorResolver('outline-color', 'outline-color', 'borderColor')(['', value], ctx) as CSSObject | undefined
  if (color)
    return color
}

function resolveOutlineSize(value: string, theme: Theme): string | undefined {
  return theme.lineWidth?.[value]
    ?? (outlineSizeDefaults.has(value) ? `${value}px` : undefined)
    ?? (value.startsWith('[') && value.endsWith(']') ? h.bracket.cssvar.global.px(value) : undefined)
}

const outlineSizeDefaults = new Set(['0', '1', '2', '4', '8'])

export const appearance: Rule[] = [
  ['appearance-auto', { '-webkit-appearance': 'auto', 'appearance': 'auto' }],
  ['appearance-none', { '-webkit-appearance': 'none', 'appearance': 'none' }],
]

function willChangeProperty(prop: string): string | undefined {
  return h.bracket.cssvar(prop)
}

export const willChange: Rule<Theme>[] = [
  [/^will-change-(.+)/, ([, p], { theme }) => {
    const value = theme.willChange?.[p] ?? willChangeProperty(p)
    if (value == null)
      return
    return { 'will-change': value }
  }, { autocomplete: 'will-change-$willChange' }],
]
