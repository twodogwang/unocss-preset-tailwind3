import type { Rule } from '@unocss/core'
import type { Theme } from '../theme'
import { h, makeGlobalStaticRules } from '../utils'

export const animations: Rule<Theme>[] = [
  [/^animate-(.+)$/, ([, name], { theme }) => {
    const kf = theme.animation?.keyframes?.[name]
    if (kf) {
      const duration = theme.animation?.durations?.[name] ?? '1s'
      const timing = theme.animation?.timingFns?.[name] ?? 'linear'
      const count = theme.animation?.counts?.[name] ?? 1
      const props = theme.animation?.properties?.[name]
      return [
        `@keyframes ${name}${kf}`,
        {
          animation: `${name} ${duration} ${timing} ${count}`,
          ...props,
        },
      ]
    }
    const value = h.bracket.cssvar(name)
    if (value != null)
      return { animation: value }
  }, { autocomplete: 'animate-$animation.keyframes' }],
  ['animate-none', { animation: 'none' }],
  ...makeGlobalStaticRules('animate', 'animation'),
]
