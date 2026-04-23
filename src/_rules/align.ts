import type { Rule } from '@unocss/core'
import { h } from '../_utils/handlers'

const verticalAlignValues = ['baseline', 'top', 'middle', 'bottom', 'text-top', 'text-bottom', 'sub', 'super'] as const

export const verticalAligns: Rule[] = [
  ...verticalAlignValues.map(v => [`align-${v}`, { 'vertical-align': v }] as Rule),
  [/^align-(.+)$/, ([, v]) => {
    if (!v.startsWith('[') || !v.endsWith(']'))
      return

    const value = h.bracket.cssvar.global(v)
    if (value != null)
      return { 'vertical-align': value }
  }],
]

const textAlignValues = ['center', 'left', 'right', 'justify', 'start', 'end']

export const textAligns: Rule[] = [
  ...textAlignValues
    .map(v => [`text-${v}`, { 'text-align': v }] as Rule),
]
