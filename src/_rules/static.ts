import type { Rule } from '@unocss/core'
import type { Theme } from '../theme'
import { h, makeGlobalStaticRules } from '../utils'

const containValues = ['none', 'strict', 'content', 'size', 'inline-size', 'layout', 'style', 'paint']

export const varEmpty = ' '

// display table included on table.ts
export const displays: Rule[] = [
  ['inline', { display: 'inline' }],
  ['block', { display: 'block' }],
  ['inline-block', { display: 'inline-block' }],
  ['contents', { display: 'contents' }],
  ['flow-root', { display: 'flow-root' }],
  ['list-item', { display: 'list-item' }],
  ['hidden', { display: 'none' }],
]

export const appearances: Rule[] = [
  ['visible', { visibility: 'visible' }],
  ['invisible', { visibility: 'hidden' }],
  ['backface-visible', { 'backface-visibility': 'visible' }],
  ['backface-hidden', { 'backface-visibility': 'hidden' }],
  ...makeGlobalStaticRules('backface', 'backface-visibility'),
]

export const cursors: Rule<Theme>[] = [
  [/^cursor-(.+)$/, ([, value], { theme }) => {
    const resolved = theme.cursor?.[value] ?? (value.startsWith('[') ? h.bracket(value) : undefined)
    if (resolved != null)
      return { cursor: resolved }
  }, { autocomplete: 'cursor-$cursor' }],
]

export const contains: Rule[] = [
  [/^contain-(.*)$/, ([, d]) => {
    if (h.bracket(d) != null) {
      return {
        contain: h.bracket(d)!.split(' ').map(e => h.cssvar.fraction(e) ?? e).join(' '),
      }
    }

    return containValues.includes(d) ? { contain: d } : undefined
  }],
]

export const pointerEvents: Rule[] = [
  ['pointer-events-auto', { 'pointer-events': 'auto' }],
  ['pointer-events-none', { 'pointer-events': 'none' }],
]

export const resizes: Rule[] = [
  ['resize-x', { resize: 'horizontal' }],
  ['resize-y', { resize: 'vertical' }],
  ['resize', { resize: 'both' }],
  ['resize-none', { resize: 'none' }],
]

export const userSelects: Rule[] = [
  ['select-auto', { 'user-select': 'auto' }],
  ['select-all', { 'user-select': 'all' }],
  ['select-text', { 'user-select': 'text' }],
  ['select-none', { 'user-select': 'none' }],
]

export const whitespaces: Rule<Theme>[] = [
  [
    /^whitespace-(normal|nowrap|pre|pre-line|pre-wrap|break-spaces)$/,
    ([, v]) => ({ 'white-space': v }),
    { autocomplete: 'whitespace-(normal|nowrap|pre|pre-line|pre-wrap|break-spaces)' },
  ],
]

export const contentVisibility: Rule[] = []

export const contents: Rule<Theme>[] = [
  [/^content-(.+)$/, ([, value], { theme }) => {
    const resolved = theme.content?.[value] ?? (value.startsWith('[') ? h.bracket(value) : undefined)
    if (resolved != null) {
      return {
        '--tw-content': resolved,
        content: 'var(--tw-content)',
      }
    }
  }, { autocomplete: 'content-$content' }],
]

export const breaks: Rule[] = [
  ['break-normal', { 'overflow-wrap': 'normal', 'word-break': 'normal' }],
  ['break-words', { 'overflow-wrap': 'break-word' }],
  ['break-all', { 'word-break': 'break-all' }],
  ['break-keep', { 'word-break': 'keep-all' }],
]

export const textWraps: Rule[] = [
  ['text-wrap', { 'text-wrap': 'wrap' }],
  ['text-nowrap', { 'text-wrap': 'nowrap' }],
  ['text-balance', { 'text-wrap': 'balance' }],
  ['text-pretty', { 'text-wrap': 'pretty' }],
]

export const hyphens: Rule[] = [
  ['hyphens-auto', { hyphens: 'auto' }],
  ['hyphens-manual', { hyphens: 'manual' }],
  ['hyphens-none', { hyphens: 'none' }],
]

export const textOverflows: Rule[] = [
  ['truncate', { 'overflow': 'hidden', 'text-overflow': 'ellipsis', 'white-space': 'nowrap' }],
  ['text-ellipsis', { 'text-overflow': 'ellipsis' }],
  ['text-clip', { 'text-overflow': 'clip' }],
]

export const textTransforms: Rule[] = [
  ['uppercase', { 'text-transform': 'uppercase' }],
  ['lowercase', { 'text-transform': 'lowercase' }],
  ['capitalize', { 'text-transform': 'capitalize' }],
  ['normal-case', { 'text-transform': 'none' }],
]

export const fontStyles: Rule[] = [
  ['italic', { 'font-style': 'italic' }],
  ['not-italic', { 'font-style': 'normal' }],
  ['font-italic', { 'font-style': 'italic' }],
  ['font-not-italic', { 'font-style': 'normal' }],
  ['oblique', { 'font-style': 'oblique' }],
  ['not-oblique', { 'font-style': 'normal' }],
  ['font-oblique', { 'font-style': 'oblique' }],
  ['font-not-oblique', { 'font-style': 'normal' }],
]

export const fontSmoothings: Rule[] = [
  ['antialiased', {
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
  }],
  ['subpixel-antialiased', {
    '-webkit-font-smoothing': 'auto',
    '-moz-osx-font-smoothing': 'auto',
  }],
]

export const fieldSizing: Rule[] = []
