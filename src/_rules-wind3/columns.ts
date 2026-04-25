import type { Rule } from '@unocss/core'
import type { Theme } from '../theme'
import { h } from '../utils'

export const columns: Rule<Theme>[] = [
  [/^columns-(.+)$/, ([, v], { theme }) => {
    if (theme.columns && v in theme.columns) {
      return { columns: theme.columns[v] }
    }

    return { columns: h.bracket.numberWithUnit.number.cssvar(v) }
  }, { autocomplete: ['columns-<num>', 'columns-$columns'] }],
  ['columns-auto', { columns: 'auto' }],

  // break before
  ['break-before-auto', { 'break-before': 'auto' }],
  ['break-before-avoid', { 'break-before': 'avoid' }],
  ['break-before-all', { 'break-before': 'all' }],
  ['break-before-avoid-page', { 'break-before': 'avoid-page' }],
  ['break-before-page', { 'break-before': 'page' }],
  ['break-before-left', { 'break-before': 'left' }],
  ['break-before-right', { 'break-before': 'right' }],
  ['break-before-column', { 'break-before': 'column' }],

  // break inside
  ['break-inside-auto', { 'break-inside': 'auto' }],
  ['break-inside-avoid', { 'break-inside': 'avoid' }],
  ['break-inside-avoid-page', { 'break-inside': 'avoid-page' }],
  ['break-inside-avoid-column', { 'break-inside': 'avoid-column' }],

  // break after
  ['break-after-auto', { 'break-after': 'auto' }],
  ['break-after-avoid', { 'break-after': 'avoid' }],
  ['break-after-all', { 'break-after': 'all' }],
  ['break-after-avoid-page', { 'break-after': 'avoid-page' }],
  ['break-after-page', { 'break-after': 'page' }],
  ['break-after-left', { 'break-after': 'left' }],
  ['break-after-right', { 'break-after': 'right' }],
  ['break-after-column', { 'break-after': 'column' }],
]
