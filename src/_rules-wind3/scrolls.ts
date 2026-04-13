import type { Rule } from '@unocss/core'
import { directionThemeSize } from '../utils'

export const scrollSnapTypeBase = {
  '--un-scroll-snap-strictness': 'proximity',
}
const custom = { preflightKeys: Object.keys(scrollSnapTypeBase) }

export const scrolls: Rule[] = [
  // snap type
  [/^snap-(x|y)$/, ([, d]) => ({
    'scroll-snap-type': `${d} var(--un-scroll-snap-strictness)`,
  }), { custom, autocomplete: 'snap-(x|y|both)' }],
  [/^snap-both$/, () => ({
    'scroll-snap-type': 'both var(--un-scroll-snap-strictness)',
  }), { custom }],
  ['snap-mandatory', { '--un-scroll-snap-strictness': 'mandatory' }],
  ['snap-proximity', { '--un-scroll-snap-strictness': 'proximity' }],
  ['snap-none', { 'scroll-snap-type': 'none' }],

  // snap align
  ['snap-start', { 'scroll-snap-align': 'start' }],
  ['snap-end', { 'scroll-snap-align': 'end' }],
  ['snap-center', { 'scroll-snap-align': 'center' }],
  ['snap-align-none', { 'scroll-snap-align': 'none' }],

  // snap stop
  ['snap-normal', { 'scroll-snap-stop': 'normal' }],
  ['snap-always', { 'scroll-snap-stop': 'always' }],

  // scroll margin

  [/^scroll-m-()(.+)$/, directionThemeSize('scroll-margin'), {
    autocomplete: [
      'scroll-(m|p)',
      'scroll-(m|p)-$spacing',
      'scroll-(m|p)-(x|y|r|l|t|b|s|e)',
      'scroll-(m|p)-(x|y|r|l|t|b|s|e)-$spacing',
    ],
  }],
  [/^scroll-m([xy])-(.+)$/, directionThemeSize('scroll-margin')],
  [/^scroll-m([rltbse])-(.+)$/, directionThemeSize('scroll-margin')],

  // scroll padding

  [/^scroll-p-()(.+)$/, directionThemeSize('scroll-padding')],
  [/^scroll-p([xy])-(.+)$/, directionThemeSize('scroll-padding')],
  [/^scroll-p([rltbse])-(.+)$/, directionThemeSize('scroll-padding')],
]
