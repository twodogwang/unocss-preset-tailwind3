import type { Rule } from '@unocss/core'
import type { Theme } from '../theme'
import { h, resolveTailwindSpacing } from '../utils'

export const flex: Rule<Theme>[] = [
  // display
  ['flex', { display: 'flex' }],
  ['inline-flex', { display: 'inline-flex' }],

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
  [/^(?:flex-)?shrink-(.+)$/, ([, d], { theme }) => {
    const value = theme.flexShrink?.[d] ?? (d.startsWith('[') ? h.bracket.cssvar.number(d) : undefined)
    if (value != null)
      return { 'flex-shrink': value }
  }, { autocomplete: ['flex-shrink-$flexShrink', 'shrink-$flexShrink'] }],
  [/^(?:flex-)?grow(?:-(0))?$/, ([, d]) => ({ 'flex-grow': d === '0' ? 0 : 1 }), { autocomplete: ['flex-grow', 'flex-grow-0', 'grow', 'grow-0'] }],
  [/^(?:flex-)?grow-(.+)$/, ([, d], { theme }) => {
    const value = theme.flexGrow?.[d] ?? (d.startsWith('[') ? h.bracket.cssvar.number(d) : undefined)
    if (value != null)
      return { 'flex-grow': value }
  }, { autocomplete: ['flex-grow-$flexGrow', 'grow-$flexGrow'] }],
  [/^basis-(.+)$/, ([, d], { theme }) => {
    const value = theme.flexBasis?.[d] ?? resolveTailwindSpacing(theme, d, { allowAuto: true, allowFraction: true })
    if (value != null)
      return { 'flex-basis': value }
  }, { autocomplete: ['basis-$spacing'] }],

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
