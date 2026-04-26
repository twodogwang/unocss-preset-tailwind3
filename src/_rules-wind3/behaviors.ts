import type { Rule } from '@unocss/core'
import { colorResolver, h } from '../utils'

export const listStyle: Rule[] = [
  ['list-outside', { 'list-style-position': 'outside' }],
  ['list-inside', { 'list-style-position': 'inside' }],
  [/^list-(.+)$/, ([, value], { theme }) => {
    if (value === 'inside' || value === 'outside' || value.startsWith('image-'))
      return

    const resolved = theme.listStyleType?.[value] ?? (value.startsWith('[') ? h.bracket(value) : undefined)
    if (resolved != null)
      return { 'list-style-type': resolved }
  }, { autocomplete: 'list-$listStyleType' }],
  // image
  [/^list-image-(.+)$/, ([, value], { theme }) => {
    const resolved = theme.listStyleImage?.[value] ?? (value.startsWith('[') ? h.bracket(value) : undefined)
    if (resolved != null)
      return { 'list-style-image': resolved }
  }, { autocomplete: 'list-image-$listStyleImage' }],
]

export const accents: Rule[] = [
  [/^accent-(.+)$/, colorResolver('accent-color', 'accent', 'accentColor'), { autocomplete: 'accent-$colors' }],
]

export const carets: Rule[] = [
  [/^caret-(.+)$/, colorResolver('caret-color', 'caret', 'textColor'), { autocomplete: 'caret-$colors' }],
]

export const imageRenderings: Rule[] = []

export const overscrolls: Rule[] = [
  ['overscroll-auto', { 'overscroll-behavior': 'auto' }],
  ['overscroll-contain', { 'overscroll-behavior': 'contain' }],
  ['overscroll-none', { 'overscroll-behavior': 'none' }],
  ['overscroll-x-auto', { 'overscroll-behavior-x': 'auto' }],
  ['overscroll-x-contain', { 'overscroll-behavior-x': 'contain' }],
  ['overscroll-x-none', { 'overscroll-behavior-x': 'none' }],
  ['overscroll-y-auto', { 'overscroll-behavior-y': 'auto' }],
  ['overscroll-y-contain', { 'overscroll-behavior-y': 'contain' }],
  ['overscroll-y-none', { 'overscroll-behavior-y': 'none' }],
]

export const scrollBehaviors: Rule[] = [
  ['scroll-auto', { 'scroll-behavior': 'auto' }],
  ['scroll-smooth', { 'scroll-behavior': 'smooth' }],
]
