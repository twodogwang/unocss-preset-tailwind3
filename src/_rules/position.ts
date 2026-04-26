import type { CSSEntries, Rule, RuleContext, StaticRule } from '@unocss/core'
import type { Theme } from '../theme'
import { h, insetMap, resolveTailwindSpacing } from '../utils'

export const positions: Rule[] = [
  [/^(relative|absolute|fixed|sticky|static)$/, ([, v]) => ({ position: v }), {
    autocomplete: ['<position>'],
  }],
]

export const justifies: StaticRule[] = [
  // contents
  ['justify-normal', { 'justify-content': 'normal' }],
  ['justify-start', { 'justify-content': 'flex-start' }],
  ['justify-end', { 'justify-content': 'flex-end' }],
  ['justify-center', { 'justify-content': 'center' }],
  ['justify-between', { 'justify-content': 'space-between' }],
  ['justify-around', { 'justify-content': 'space-around' }],
  ['justify-evenly', { 'justify-content': 'space-evenly' }],
  ['justify-stretch', { 'justify-content': 'stretch' }],

  // items
  ['justify-items-start', { 'justify-items': 'start' }],
  ['justify-items-end', { 'justify-items': 'end' }],
  ['justify-items-center', { 'justify-items': 'center' }],
  ['justify-items-stretch', { 'justify-items': 'stretch' }],

  // selfs
  ['justify-self-auto', { 'justify-self': 'auto' }],
  ['justify-self-start', { 'justify-self': 'start' }],
  ['justify-self-end', { 'justify-self': 'end' }],
  ['justify-self-center', { 'justify-self': 'center' }],
  ['justify-self-stretch', { 'justify-self': 'stretch' }],
]

export const orders: Rule[] = [
  [/^order-(.+)$/, ([, v], { theme }: RuleContext<Theme>) => {
    if (theme.order?.[v] != null)
      return { order: theme.order[v] }

    if (v.startsWith('[') && v.endsWith(']'))
      return { order: h.bracket.cssvar.number(v) }
  }],
  ['order-first', { order: '-9999' }],
  ['order-last', { order: '9999' }],
  ['order-none', { order: '0' }],
]

export const alignments: StaticRule[] = [
  // contents
  ['content-normal', { 'align-content': 'normal' }],
  ['content-center', { 'align-content': 'center' }],
  ['content-start', { 'align-content': 'flex-start' }],
  ['content-end', { 'align-content': 'flex-end' }],
  ['content-between', { 'align-content': 'space-between' }],
  ['content-around', { 'align-content': 'space-around' }],
  ['content-evenly', { 'align-content': 'space-evenly' }],
  ['content-baseline', { 'align-content': 'baseline' }],
  ['content-stretch', { 'align-content': 'stretch' }],

  // items
  ['items-start', { 'align-items': 'flex-start' }],
  ['items-end', { 'align-items': 'flex-end' }],
  ['items-center', { 'align-items': 'center' }],
  ['items-baseline', { 'align-items': 'baseline' }],
  ['items-stretch', { 'align-items': 'stretch' }],

  // selfs
  ['self-auto', { 'align-self': 'auto' }],
  ['self-start', { 'align-self': 'flex-start' }],
  ['self-end', { 'align-self': 'flex-end' }],
  ['self-center', { 'align-self': 'center' }],
  ['self-stretch', { 'align-self': 'stretch' }],
  ['self-baseline', { 'align-self': 'baseline' }],
]

export const placements: StaticRule[] = [
  // contents
  ['place-content-center', { 'place-content': 'center' }],
  ['place-content-start', { 'place-content': 'start' }],
  ['place-content-end', { 'place-content': 'end' }],
  ['place-content-between', { 'place-content': 'space-between' }],
  ['place-content-around', { 'place-content': 'space-around' }],
  ['place-content-evenly', { 'place-content': 'space-evenly' }],
  ['place-content-baseline', { 'place-content': 'baseline' }],
  ['place-content-stretch', { 'place-content': 'stretch' }],

  // items
  ['place-items-start', { 'place-items': 'start' }],
  ['place-items-end', { 'place-items': 'end' }],
  ['place-items-center', { 'place-items': 'center' }],
  ['place-items-baseline', { 'place-items': 'baseline' }],
  ['place-items-stretch', { 'place-items': 'stretch' }],

  // selfs
  ['place-self-auto', { 'place-self': 'auto' }],
  ['place-self-start', { 'place-self': 'start' }],
  ['place-self-end', { 'place-self': 'end' }],
  ['place-self-center', { 'place-self': 'center' }],
  ['place-self-stretch', { 'place-self': 'stretch' }],
]

export const flexGridJustifiesAlignments: StaticRule[] = []

function handleInsetValue(v: string, { theme }: RuleContext<Theme>): string | number | undefined {
  return resolveTailwindSpacing(theme, v, { allowAuto: true, allowFraction: true })
}

function handleInsetValues([, d, v]: string[], ctx: RuleContext): CSSEntries | undefined {
  const r = handleInsetValue(v, ctx)
  if (r != null && d in insetMap)
    return insetMap[d].map(i => [i.slice(1), r])
}

export const insets: Rule[] = [
  [
    /^inset-(.+)$/,
    ([, v], ctx) => ({ inset: handleInsetValue(v, ctx) }),
    {
      autocomplete: [
        'inset-<directions>-$spacing',
        'inset-(block|inline)-$spacing',
        'inset-(bs|be|is|ie)-$spacing',
        '(top|left|right|bottom)-$spacing',
      ],
    },
  ],
  [/^(start|end)-(.+)$/, handleInsetValues],
  [/^inset-([xy])-(.+)$/, handleInsetValues],
  [/^(top|left|right|bottom)-(.+)$/, ([, d, v], ctx) => ({ [d]: handleInsetValue(v, ctx) })],
]

export const floats: Rule[] = [
  // floats
  ['float-left', { float: 'left' }],
  ['float-right', { float: 'right' }],
  ['float-start', { float: 'inline-start' }],
  ['float-end', { float: 'inline-end' }],
  ['float-none', { float: 'none' }],

  // clears
  ['clear-left', { clear: 'left' }],
  ['clear-right', { clear: 'right' }],
  ['clear-both', { clear: 'both' }],
  ['clear-start', { clear: 'inline-start' }],
  ['clear-end', { clear: 'inline-end' }],
  ['clear-none', { clear: 'none' }],
]

export const zIndexes: Rule[] = [
  [/^z-(.+)$/, ([, v], { theme }: RuleContext<Theme>) => {
    if (theme.zIndex?.[v] != null)
      return { 'z-index': theme.zIndex[v] }

    if (v.startsWith('[') && v.endsWith(']'))
      return { 'z-index': h.bracket.cssvar.number(v) }
  }, { autocomplete: 'z-<num>' }],
]

export const boxSizing: Rule[] = [
  ['box-border', { 'box-sizing': 'border-box' }],
  ['box-content', { 'box-sizing': 'content-box' }],
]
