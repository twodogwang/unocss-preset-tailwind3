import type { CSSEntries, CSSObject, Rule, RuleContext } from '@unocss/core'
import type { CSSColorValue } from '@unocss/rule-utils'
import type { Theme } from '../theme'
import { colorOpacityToString, colorToString } from '@unocss/rule-utils'
import { cornerMap, directionMap, h, parseColor } from '../utils'

export const borderStyles = ['solid', 'dashed', 'dotted', 'double', 'hidden', 'none']
const borderWidthDefaults = new Set(['0', '2', '4', '8', 'px'])

export const borders: Rule[] = [
  // size
  [/^border()(?:-(.+))?$/, handlerBorderSize, { autocomplete: 'border-<num>' }],
  [/^border-([xy])(?:-(.+))?$/, handlerBorderSize],
  [/^border-([trblse])(?:-(.+))?$/, handlerBorderSize],

  // colors
  [/^border-([xy])-(.+)$/, handlerBorderColorOrSize],
  [/^border-([trblse])-(.+)$/, handlerBorderColorOrSize],
  [/^border-()(.+)$/, handlerBorderColorOrSize, { autocomplete: ['border-$colors', 'border-<directions>-$colors'] }],

  // opacity
  [/^border-opacity-(.+)$/, handlerBorderOpacity, { autocomplete: 'border-opacity-<percent>' }],

  // radius
  [/^rounded()(?:-(.+))?$/, handlerRounded, { autocomplete: ['rounded', 'rounded-$borderRadius'] }],
  [/^rounded-([trblse])(?:-(.+))?$/, handlerRounded],
  [/^rounded-([trbl]{2})(?:-(.+))?$/, handlerRounded],
  [/^rounded-([se][se])(?:-(.+))?$/, handlerRounded],

  // style
  [/^border-(.+)$/, handlerBorderStyle, { autocomplete: [`border-(${borderStyles.join('|')})`] }],
]

function transformBorderColor(color: string | CSSColorValue, alpha: string | number | undefined, direction: string | undefined): CSSObject {
  if (alpha != null) {
    return {
      [`border${direction}-color`]: colorToString(color, alpha),
    }
  }
  if (direction === '') {
    const object: CSSObject = {}
    const opacityVar = `--un-border-opacity`
    const result = colorToString(color, `var(${opacityVar})`)

    if (result.includes(opacityVar))
      object[opacityVar] = typeof color === 'string' ? 1 : colorOpacityToString(color)
    object['border-color'] = result

    return object
  }
  else {
    const object: CSSObject = {}
    const opacityVar = '--un-border-opacity'
    const opacityDirectionVar = `--un-border${direction}-opacity`
    const result = colorToString(color, `var(${opacityDirectionVar})`)
    if (result.includes(opacityDirectionVar)) {
      object[opacityVar] = typeof color === 'string' ? 1 : colorOpacityToString(color)
      object[opacityDirectionVar] = `var(${opacityVar})`
    }
    object[`border${direction}-color`] = result

    return object
  }
}

function borderColorResolver(direction: string) {
  return ([, body]: string[], theme: Theme): CSSObject | undefined => {
    const data = parseColor(body, theme, 'borderColor')

    if (!data)
      return

    const { alpha, color, cssColor } = data

    if (cssColor)
      return transformBorderColor(cssColor, alpha, direction)

    else if (color)
      return transformBorderColor(color, alpha, direction)
  }
}

function handlerBorderSize([, a = '', b]: string[], { theme }: RuleContext<Theme>): CSSEntries | undefined {
  const lineWidth = theme.lineWidth ?? {}
  const v = !b
    ? lineWidth.DEFAULT ?? '1px'
    : b in lineWidth
      ? lineWidth[b]
      : borderWidthDefaults.has(b)
        ? h.bracket.cssvar.global.px(b)
      : b.startsWith('[') && b.endsWith(']')
        ? h.bracket.cssvar.global.px(b)
        : undefined
  if (a in directionMap && v != null)
    return directionMap[a].map(i => [`border${i}-width`, v])
}

function handlerBorderColorOrSize([, a = '', b]: string[], ctx: RuleContext<Theme>): CSSEntries | undefined {
  if (a in directionMap) {
    const results = directionMap[a]
      .map(i => borderColorResolver(i)(['', b], ctx.theme))
      .filter(Boolean)

    if (results.length)
      return Object.assign({}, ...results)
  }
}

function handlerBorderOpacity([, opacity]: string[]): CSSEntries | undefined {
  const v = h.bracket.percent.cssvar(opacity)
  if (v != null)
    return [['--un-border-opacity', v]]
}

function handlerRounded([, a = '', s]: string[], { theme }: RuleContext<Theme>): CSSEntries | undefined {
  const v = theme.borderRadius?.[s || 'DEFAULT'] || h.bracket.cssvar.global.fraction.rem(s || '1')
  if (a in cornerMap && v != null)
    return cornerMap[a].map(i => [`border${i}-radius`, v])
}

export function handlerBorderStyle([, s]: string[]): CSSEntries | undefined {
  if (borderStyles.includes(s))
    return [['border-style', s]]
}
