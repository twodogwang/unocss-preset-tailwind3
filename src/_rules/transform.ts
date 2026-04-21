import type { CSSValues, Rule, RuleContext } from '@unocss/core'
import type { Theme } from '../theme'
import { h, makeGlobalStaticRules, positionMap, resolveTailwindSpacing, transformXYZ } from '../utils'

const transformValues = [
  'translate',
  'rotate',
  'scale',
]

const transformCpu = [
  'translateX(var(--un-translate-x))',
  'translateY(var(--un-translate-y))',
  // 'translateZ(var(--un-translate-z))',
  'rotate(var(--un-rotate))',
  // 'rotateX(var(--un-rotate-x))',
  // 'rotateY(var(--un-rotate-y))',
  'rotateZ(var(--un-rotate-z))',
  'skewX(var(--un-skew-x))',
  'skewY(var(--un-skew-y))',
  'scaleX(var(--un-scale-x))',
  'scaleY(var(--un-scale-y))',
  // 'scaleZ(var(--un-scale-z))',
].join(' ')

const transform = [
  'translateX(var(--un-translate-x))',
  'translateY(var(--un-translate-y))',
  'translateZ(var(--un-translate-z))',
  'rotate(var(--un-rotate))',
  'rotateX(var(--un-rotate-x))',
  'rotateY(var(--un-rotate-y))',
  'rotateZ(var(--un-rotate-z))',
  'skewX(var(--un-skew-x))',
  'skewY(var(--un-skew-y))',
  'scaleX(var(--un-scale-x))',
  'scaleY(var(--un-scale-y))',
  'scaleZ(var(--un-scale-z))',
].join(' ')

const transformGpu = [
  'translate3d(var(--un-translate-x), var(--un-translate-y), var(--un-translate-z))',
  'rotate(var(--un-rotate))',
  'rotateX(var(--un-rotate-x))',
  'rotateY(var(--un-rotate-y))',
  'rotateZ(var(--un-rotate-z))',
  'skewX(var(--un-skew-x))',
  'skewY(var(--un-skew-y))',
  'scaleX(var(--un-scale-x))',
  'scaleY(var(--un-scale-y))',
  'scaleZ(var(--un-scale-z))',
].join(' ')

export const transformBase = {
  // transform
  '--un-rotate': 0,
  '--un-rotate-x': 0,
  '--un-rotate-y': 0,
  '--un-rotate-z': 0,
  '--un-scale-x': 1,
  '--un-scale-y': 1,
  '--un-scale-z': 1,
  '--un-skew-x': 0,
  '--un-skew-y': 0,
  '--un-translate-x': 0,
  '--un-translate-y': 0,
  '--un-translate-z': 0,
}
const preflightKeys = Object.keys(transformBase)

export const transforms: Rule[] = [
  // origins
  [
    /^origin-(.+)$/,
    ([, s]) => ({ 'transform-origin': positionMap[s] ?? h.bracket.cssvar(s) }),
    { autocomplete: `origin-(${Object.keys(positionMap).join('|')})` },
  ],

  // modifiers
  [/^translate-([xy])-(.+)$/, handleTranslate, { custom: { preflightKeys } }],
  [/^rotate-()(.+)$/, handleRotate, { custom: { preflightKeys } }],
  [/^rotate-([xyz])-(.+)$/, handleRotate, { custom: { preflightKeys } }],
  [/^skew-()(.+)$/, handleSkew, { custom: { preflightKeys } }],
  [/^skew-([xy])-(.+)$/, handleSkew, { custom: { preflightKeys }, autocomplete: ['skew-(x|y)-<percent>'] }],
  [/^scale-()(.+)$/, handleScale, { custom: { preflightKeys } }],
  [/^scale-([xyz])-(.+)$/, handleScale, { custom: { preflightKeys }, autocomplete: [`(${transformValues.join('|')})-<percent>`, `(${transformValues.join('|')})-(x|y|z)-<percent>`] }],

  // base
  ['transform', { transform }, { custom: { preflightKeys } }],
  ['transform-cpu', { transform: transformCpu }, {
    custom: { preflightKeys: ['--un-translate-x', '--un-translate-y', '--un-rotate', '--un-rotate-z', '--un-skew-x', '--un-skew-y', '--un-scale-x', '--un-scale-y'] },
  }],
  ['transform-gpu', { transform: transformGpu }, { custom: { preflightKeys } }],
  ['transform-none', { transform: 'none' }],
  ...makeGlobalStaticRules('transform'),
]

function handleTranslate([, d, b]: string[], { theme }: RuleContext<Theme>): CSSValues | undefined {
  const v = resolveTailwindSpacing(theme, b, { allowFraction: true })
  if (v != null) {
    return [
      ...transformXYZ(d, v, 'translate'),
      ['transform', transform],
    ]
  }
}

function handleScale([, d, b]: string[]): CSSValues | undefined {
  const v = h.bracket.cssvar.fraction.percent(b)
  if (v != null) {
    return [
      ...transformXYZ(d, v, 'scale'),
      ['transform', transform],
    ]
  }
}

function handleRotate([, d = '', b]: string[]): CSSValues | undefined {
  const v = h.bracket.cssvar.degree(b)
  if (v != null) {
    if (d) {
      return {
        '--un-rotate': 0,
        [`--un-rotate-${d}`]: v,
        'transform': transform,
      }
    }
    else {
      return {
        '--un-rotate-x': 0,
        '--un-rotate-y': 0,
        '--un-rotate-z': 0,
        '--un-rotate': v,
        'transform': transform,
      }
    }
  }
}

function handleSkew([, d, b]: string[]): CSSValues | undefined {
  const v = h.bracket.cssvar.degree(b)
  if (v != null) {
    return [
      ...transformXYZ(d, v, 'skew'),
      ['transform', transform],
    ]
  }
}
