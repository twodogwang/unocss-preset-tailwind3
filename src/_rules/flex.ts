import type { Rule } from '@unocss/core'
import type { Theme } from '../theme'
import { h } from '../utils'

export const flex: Rule<Theme>[] = [
  // display
  ['flex', { display: 'flex' }],
  ['inline-flex', { display: 'inline-flex' }],
  ['flex-inline', { display: 'inline-flex' }],

  // flex
  [/^flex-(\[.+\])$/, ([, d]) => {
    const value = h.bracket(d)
    if (value == null)
      return
    return { flex: value.split(' ').map(e => h.cssvar.fraction(e) ?? e).join(' ') }
  }],
  ['flex-1', { flex: '1 1 0%' }],
  ['flex-auto', { flex: '1 1 auto' }],
  ['flex-initial', { flex: '0 1 auto' }],
  ['flex-none', { flex: 'none' }],

  // shrink/grow/basis
  [/^(?:flex-)?shrink(?:-(0))?$/, ([, d]) => ({ 'flex-shrink': d === '0' ? 0 : 1 }), { autocomplete: ['flex-shrink', 'flex-shrink-0', 'shrink', 'shrink-0'] }],
  [/^(?:flex-)?grow(?:-(0))?$/, ([, d]) => ({ 'flex-grow': d === '0' ? 0 : 1 }), { autocomplete: ['flex-grow', 'flex-grow-0', 'grow', 'grow-0'] }],
  [/^(?:flex-)?basis-(.+)$/, ([, d], { theme }) => ({ 'flex-basis': theme.spacing?.[d] ?? h.bracket.cssvar.auto.fraction.rem(d) }), { autocomplete: ['flex-basis-$spacing', 'basis-$spacing'] }],

  // directions
  ['flex-row', { 'flex-direction': 'row' }],
  ['flex-row-reverse', { 'flex-direction': 'row-reverse' }],
  ['flex-col', { 'flex-direction': 'column' }],
  ['flex-col-reverse', { 'flex-direction': 'column-reverse' }],

  // wraps
  ['flex-wrap', { 'flex-wrap': 'wrap' }],
  ['flex-wrap-reverse', { 'flex-wrap': 'wrap-reverse' }],
  ['flex-nowrap', { 'flex-wrap': 'nowrap' }],
]
