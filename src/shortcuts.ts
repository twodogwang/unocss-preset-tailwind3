import type { Shortcut, UserShortcuts } from '@unocss/core'
import type { Theme } from './theme'

const containerShortcuts: Shortcut<Theme>[] = [
  [/^container$/, () => '__container'],
]

export const shortcuts: UserShortcuts<Theme> = [
  ...containerShortcuts,
]
