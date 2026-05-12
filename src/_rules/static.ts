import type { Rule } from '@unocss/core'
import type { Theme } from '../theme'
import { h } from '../utils'

const containValues = ['none', 'strict', 'content', 'size', 'inline-size', 'layout', 'style', 'paint']
const blendModes = ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity']
const objectPositionMap: Record<string, string> = {
  bottom: 'bottom',
  center: 'center',
  left: 'left',
  'left-bottom': 'left bottom',
  'left-top': 'left top',
  right: 'right',
  'right-bottom': 'right bottom',
  'right-top': 'right top',
  top: 'top',
}

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

export const accessibility: Rule[] = [
  ['sr-only', {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    'white-space': 'nowrap',
    'border-width': '0',
  }],
  ['not-sr-only', {
    position: 'static',
    width: 'auto',
    height: 'auto',
    padding: '0',
    margin: '0',
    overflow: 'visible',
    clip: 'auto',
    'white-space': 'normal',
  }],
]

export const isolations: Rule[] = [
  ['isolate', { isolation: 'isolate' }],
  ['isolation-auto', { isolation: 'auto' }],
]

export const objectFits: Rule[] = [
  ['object-contain', { 'object-fit': 'contain' }],
  ['object-cover', { 'object-fit': 'cover' }],
  ['object-fill', { 'object-fit': 'fill' }],
  ['object-none', { 'object-fit': 'none' }],
  ['object-scale-down', { 'object-fit': 'scale-down' }],
]

export const objectPositions: Rule[] = [
  [/^object-(.+)$/, ([, value]) => {
    if (value in objectPositionMap)
      return { 'object-position': objectPositionMap[value] }

    const resolved = h.bracket(value)
    if (resolved != null)
      return { 'object-position': resolved }
  }],
]

export const backgroundBlendModes: Rule[] = blendModes.map(mode => [`bg-blend-${mode}`, { 'background-blend-mode': mode }])

export const mixBlendModes: Rule[] = [
  ...blendModes,
  'plus-lighter',
].map(mode => [`mix-blend-${mode}`, { 'mix-blend-mode': mode }])

export const appearances: Rule[] = [
  ['visible', { visibility: 'visible' }],
  ['invisible', { visibility: 'hidden' }],
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
