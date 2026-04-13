import type { Shortcut, UserShortcuts } from '@unocss/core'
import type { Theme } from './theme'
import { resolveBreakpoints } from './breakpoints'

const containerShortcuts: Shortcut<Theme>[] = [
  [/^(?:(\w+)[:-])?container$/, ([, bp], context) => {
    let points = (resolveBreakpoints(context) ?? []).map(i => i.point)
    if (bp) {
      if (!points.includes(bp))
        return
      points = points.slice(points.indexOf(bp))
    }

    const shortcuts = points.map(point => `${point}:__container`)
    if (!bp)
      shortcuts.unshift('__container')
    return shortcuts
  }],
]

export const shortcuts: UserShortcuts<Theme> = [
  ...containerShortcuts,
]
