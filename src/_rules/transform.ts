import type { CSSValues, Rule, RuleContext } from '@unocss/core'
import type { Theme } from '../theme'
import { h, transformXYZ } from '../utils'

const transformCpu = [
  'translateX(var(--un-translate-x))',
  'translateY(var(--un-translate-y))',
  'rotate(var(--un-rotate))',
  'skewX(var(--un-skew-x))',
  'skewY(var(--un-skew-y))',
  'scaleX(var(--un-scale-x))',
  'scaleY(var(--un-scale-y))',
].join(' ')

const transform = transformCpu

const transformGpu = [
  'translate3d(var(--un-translate-x), var(--un-translate-y), 0)',
  'rotate(var(--un-rotate))',
  'skewX(var(--un-skew-x))',
  'skewY(var(--un-skew-y))',
  'scaleX(var(--un-scale-x))',
  'scaleY(var(--un-scale-y))',
].join(' ')

export const transformBase = {
  '--un-rotate': 0,
  '--un-scale-x': 1,
  '--un-scale-y': 1,
  '--un-skew-x': 0,
  '--un-skew-y': 0,
  '--un-translate-x': 0,
  '--un-translate-y': 0,
}
const preflightKeys = Object.keys(transformBase)

export const transforms: Rule<Theme>[] = [
  [
    /^origin-(.+)$/,
    ([, s], { theme }) => {
      const value = theme.transformOrigin?.[s] ?? (s.startsWith('[') ? h.bracket.cssvar(s) : undefined)
      if (value != null)
        return { 'transform-origin': value }
    },
    { autocomplete: 'origin-(center|top|top-right|right|bottom-right|bottom|bottom-left|left|top-left)' },
  ],

  [/^translate-([xy])-(.+)$/, handleTranslate, { custom: { preflightKeys } }],
  [/^rotate-(.+)$/, handleRotate, { custom: { preflightKeys } }],
  [/^skew-([xy])-(.+)$/, handleSkew, { custom: { preflightKeys }, autocomplete: ['skew-(x|y)-$skew'] }],
  [/^scale-([xy])-(.+)$/, handleScaleAxis, { custom: { preflightKeys }, autocomplete: ['scale-(x|y)-$scale'] }],
  [/^scale-(.+)$/, handleScale, { custom: { preflightKeys }, autocomplete: ['scale-$scale'] }],

  ['transform', { transform }, { custom: { preflightKeys } }],
  ['transform-cpu', { transform: transformCpu }, { custom: { preflightKeys } }],
  ['transform-gpu', { transform: transformGpu }, { custom: { preflightKeys } }],
  ['transform-none', { transform: 'none' }],
]

function handleTranslate([, d, b]: string[], { theme }: RuleContext<Theme>): CSSValues | undefined {
  const v = theme.translate?.[b] ?? theme.spacing?.[b] ?? (b.startsWith('[') ? h.bracket.cssvar.global.auto.fraction.rem(b) : undefined)
  if (v != null) {
    return [
      ...transformXYZ(d, v, 'translate'),
      ['transform', transform],
    ]
  }
}

function handleScale([, b]: string[], { theme }: RuleContext<Theme>): CSSValues | undefined {
  const v = theme.scale?.[b] ?? (b.startsWith('[') ? h.bracket.cssvar.number(b) : undefined)
  if (v != null) {
    return [
      ...transformXYZ('', v, 'scale'),
      ['transform', transform],
    ]
  }
}

function handleScaleAxis([, d, b]: string[], { theme }: RuleContext<Theme>): CSSValues | undefined {
  const v = theme.scale?.[b] ?? (b.startsWith('[') ? h.bracket.cssvar.number(b) : undefined)
  if (v != null) {
    return [
      ...transformXYZ(d, v, 'scale'),
      ['transform', transform],
    ]
  }
}

function handleRotate([, b]: string[], { theme }: RuleContext<Theme>): CSSValues | undefined {
  const v = theme.rotate?.[b] ?? (b.startsWith('[') ? h.bracket.cssvar.degree(b) : undefined)
  if (v != null) {
    return {
      '--un-rotate': v,
      'transform': transform,
    }
  }
}

function handleSkew([, d, b]: string[], { theme }: RuleContext<Theme>): CSSValues | undefined {
  const v = theme.skew?.[b] ?? (b.startsWith('[') ? h.bracket.cssvar.degree(b) : undefined)
  if (v != null) {
    return [
      ...transformXYZ(d, v, 'skew'),
      ['transform', transform],
    ]
  }
}
