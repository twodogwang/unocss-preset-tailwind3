import type { Rule } from '@unocss/core'
import { directionThemeSize } from '../utils'

export const paddings: Rule[] = [
  [/^p-()(.+)$/, directionThemeSize('padding'), { autocomplete: ['(m|p)-<num>'] }],
  [/^p([xy])-(.+)$/, directionThemeSize('padding')],
  [/^p([rltbse])-(.+)$/, directionThemeSize('padding'), { autocomplete: '(m|p)<directions>-<num>' }],
]

export const margins: Rule[] = [
  [/^-?m-()(.+)$/, directionThemeSize('margin', { allowAuto: true })],
  [/^-?m([xy])-(.+)$/, directionThemeSize('margin', { allowAuto: true })],
  [/^-?m([rltbse])-(.+)$/, directionThemeSize('margin', { allowAuto: true })],
]
