import type { Rule, RuleContext } from '@unocss/core'
import type { Theme } from '../theme'
import { resolveTailwindSpacing } from '../utils'

const directions: Record<string, string> = {
  '': '',
  'x': 'column-',
  'y': 'row-',
  'col': 'column-',
  'row': 'row-',
}

function handleGap([, d = '', s]: string[], { theme }: RuleContext<Theme>) {
  const v = resolveTailwindSpacing(theme, s)
  if (v != null) {
    return {
      [`${directions[d]}gap`]: v,
    }
  }
}

export const gaps: Rule[] = [
  [/^gap-()(.+)$/, handleGap, { autocomplete: ['gap-$spacing', 'gap-<num>'] }],
  [/^gap-([xy])-(.+)$/, handleGap, { autocomplete: ['gap-(x|y)-$spacing', 'gap-(x|y)-<num>'] }],
]
