import type { CSSObject, Rule, RuleContext } from '@unocss/core'
import type { Theme } from '../theme'
import { colorResolver, h } from '../utils'

const decorationStyles = ['solid', 'double', 'dotted', 'dashed', 'wavy']

export const textDecorations: Rule<Theme>[] = [
  [/^(underline|overline|line-through)$/, ([, s]) => ({ 'text-decoration-line': s }), { autocomplete: 'decoration-(underline|overline|line-through)' }],

  // size / colors
  [/^decoration-(.+)$/, handleDecorationValue, { autocomplete: 'decoration-$colors' }],

  // offset
  [/^underline-offset-(.+)$/, ([, s], { theme }) => ({ 'text-underline-offset': theme.lineWidth?.[s] ?? h.auto.bracket.cssvar.global.px(s) }), { autocomplete: 'underline-offset-<num>' }],

  // style
  ...decorationStyles.map(v => [`decoration-${v}`, { 'text-decoration-style': v }] as Rule<Theme>),
  ['no-underline', { 'text-decoration': 'none' }],
]

function resolveDecorationThickness(b: string, theme: Theme): string | undefined {
  if (b === 'auto' || b === 'from-font')
    return b
  return theme.lineWidth?.[b] ?? h.bracket.cssvar.global.px(b)
}

function handleDecorationValue([, value]: string[], ctx: RuleContext<Theme>): CSSObject | undefined {
  if (value === 'none')
    return

  const width = resolveDecorationThickness(value, ctx.theme)
  if (width)
    return { 'text-decoration-thickness': width }

  const result = colorResolver('text-decoration-color', 'line', 'borderColor')(['', value], ctx) as CSSObject | undefined
  if (result) {
    return {
      '-webkit-text-decoration-color': result['text-decoration-color'],
      ...result,
    }
  }
}
