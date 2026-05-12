import type { CSSObject, Rule, RuleContext } from '@unocss/core'
import type { Theme } from '../theme'
import { colorResolver, h, isCSSMathFn } from '../utils'

export const svgUtilities: Rule<Theme>[] = [
  // fills
  [/^fill-(.+)$/, colorResolver('fill', 'fill', 'backgroundColor'), { autocomplete: 'fill-$colors' }],
  ['fill-none', { fill: 'none' }],

  // stroke colors
  [/^stroke-(.+)$/, handleColorOrWidth, { autocomplete: ['stroke-$lineWidth', 'stroke-$colors'] }],

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
