import type { Rule } from '@unocss/core'
import { globalKeywords } from '../utils'

const overflowValues = [
  'auto',
  'hidden',
  'clip',
  'visible',
  'scroll',
  'overlay',
  ...globalKeywords,
]

export const overflows: Rule[] = [
  [/^overflow-(.+)$/, ([, v]) => overflowValues.includes(v) ? { overflow: v } : undefined, { autocomplete: [`overflow-(${overflowValues.join('|')})`, `overflow-(x|y)-(${overflowValues.join('|')})`] }],
  [/^overflow-([xy])-(.+)$/, ([, d, v]) => overflowValues.includes(v) ? { [`overflow-${d}`]: v } : undefined],
]
