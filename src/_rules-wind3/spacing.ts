import type { CSSObject, Rule, RuleContext } from '@unocss/core'
import { symbols } from '@unocss/core'
import type { Theme } from '../theme'
import { resolveTailwindSpacing } from '../utils'

export const spaces: Rule[] = [
  [/^space-([xy])-(.+)$/, handlerSpace, { autocomplete: ['space-(x|y)', 'space-(x|y)-reverse', 'space-(x|y)-$spacing'] }],
  [/^space-([xy])-reverse$/, ([, d]) => createSpaceRule(d, 1)],
]

function handlerSpace([, d, s]: string[], { theme }: RuleContext<Theme>): CSSObject | undefined {
  let v = resolveTailwindSpacing(theme, s)
  if (v != null) {
    if (v === '0')
      v = '0px'
    return createSpaceRule(d, 0, v)
  }
}

function createSpaceRule(direction: string, reverse: number, spacing?: string): CSSObject {
  const rule: CSSObject = {
    [symbols.selector]: (selector: string) => `${selector} > :not([hidden]) ~ :not([hidden])`,
    [`--un-space-${direction}-reverse`]: reverse,
  }

  if (!spacing)
    return rule

  if (direction === 'x') {
    rule['margin-right'] = `calc(${spacing} * var(--un-space-x-reverse))`
    rule['margin-left'] = `calc(${spacing} * calc(1 - var(--un-space-x-reverse)))`
    return rule
  }

  rule['margin-top'] = `calc(${spacing} * calc(1 - var(--un-space-y-reverse)))`
  rule['margin-bottom'] = `calc(${spacing} * var(--un-space-y-reverse))`
  return rule
}
