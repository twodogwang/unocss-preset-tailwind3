import type { CSSObject, Rule, RuleContext } from '@unocss/core'
import type { Theme } from '../theme'
import { colorResolver, h, isCSSMathFn } from '../utils'

export const svgUtilities: Rule<Theme>[] = [
  // fills
  [/^fill-(.+)$/, colorResolver('fill', 'fill', 'backgroundColor'), { autocomplete: 'fill-$colors' }],
  ['fill-none', { fill: 'none' }],

  // stroke dash
  [/^stroke-dash-(.+)$/, ([, s]) => ({ 'stroke-dasharray': h.bracket.cssvar.number(s) }), { autocomplete: 'stroke-dash-<num>' }],
  [/^stroke-offset-(.+)$/, ([, s], { theme }) => ({ 'stroke-dashoffset': theme.lineWidth?.[s] ?? h.bracket.cssvar.px.numberWithUnit(s) }), { autocomplete: 'stroke-offset-$lineWidth' }],

  // stroke colors
  [/^stroke-(.+)$/, handleColorOrWidth, { autocomplete: ['stroke-$lineWidth', 'stroke-$colors'] }],

  // line cap
  ['stroke-cap-square', { 'stroke-linecap': 'square' }],
  ['stroke-cap-round', { 'stroke-linecap': 'round' }],
  ['stroke-cap-auto', { 'stroke-linecap': 'butt' }],

  // line join
  ['stroke-join-arcs', { 'stroke-linejoin': 'arcs' }],
  ['stroke-join-bevel', { 'stroke-linejoin': 'bevel' }],
  ['stroke-join-clip', { 'stroke-linejoin': 'miter-clip' }],
  ['stroke-join-round', { 'stroke-linejoin': 'round' }],
  ['stroke-join-auto', { 'stroke-linejoin': 'miter' }],

  // none
  ['stroke-none', { stroke: 'none' }],
]

function handleWidth([, b]: string[], { theme }: RuleContext<Theme>): CSSObject {
  return { 'stroke-width': resolveStrokeWidthValue(b, theme) }
}

function handleColorOrWidth(match: RegExpMatchArray, ctx: RuleContext<Theme>): CSSObject | undefined {
  const color = colorResolver('stroke', 'stroke', 'borderColor')(match, ctx) as CSSObject | undefined
  if (color != null && Object.keys(color).length > 0 && !isCSSMathFn(h.bracket(match[1])))
    return color

  const width = resolveStrokeWidthValue(match[1], ctx.theme)
  if (width != null || isCSSMathFn(h.bracket(match[1])))
    return { 'stroke-width': width ?? h.bracket.cssvar.fraction.px.number(match[1]) }

  return color
}

function resolveStrokeWidthValue(value: string, theme: Theme): string | number | undefined {
  if (theme.lineWidth?.[value] != null)
    return theme.lineWidth[value]

  if (/^\d+(?:\.\d+)?$/.test(value))
    return Number(value)

  if (value.startsWith('[') && value.endsWith(']'))
    return h.bracket.cssvar.fraction.px.number(value)
}
