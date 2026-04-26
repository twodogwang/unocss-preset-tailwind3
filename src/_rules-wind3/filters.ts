import type { CSSValues, Rule, RuleContext } from '@unocss/core'
import type { Theme } from '../theme'
import { varEmpty } from '../_rules'
import { h } from '../utils'

export const filterBase = {
  '--un-blur': varEmpty,
  '--un-brightness': varEmpty,
  '--un-contrast': varEmpty,
  '--un-drop-shadow': varEmpty,
  '--un-grayscale': varEmpty,
  '--un-hue-rotate': varEmpty,
  '--un-invert': varEmpty,
  '--un-saturate': varEmpty,
  '--un-sepia': varEmpty,
}
const filterBaseKeys = Object.keys(filterBase)
const filterMetaCustom = {
  preflightKeys: filterBaseKeys,
}
const filterProperty = 'var(--un-blur) var(--un-brightness) var(--un-contrast) var(--un-grayscale) var(--un-hue-rotate) var(--un-invert) var(--un-saturate) var(--un-sepia) var(--un-drop-shadow)'

export const backdropFilterBase = {
  '--un-backdrop-blur': varEmpty,
  '--un-backdrop-brightness': varEmpty,
  '--un-backdrop-contrast': varEmpty,
  '--un-backdrop-grayscale': varEmpty,
  '--un-backdrop-hue-rotate': varEmpty,
  '--un-backdrop-invert': varEmpty,
  '--un-backdrop-opacity': varEmpty,
  '--un-backdrop-saturate': varEmpty,
  '--un-backdrop-sepia': varEmpty,
}
const backdropFilterBaseKeys = Object.keys(backdropFilterBase)
const backdropMetaCustom = {
  preflightKeys: backdropFilterBaseKeys,
}
const backdropFilterProperty = 'var(--un-backdrop-blur) var(--un-backdrop-brightness) var(--un-backdrop-contrast) var(--un-backdrop-grayscale) var(--un-backdrop-hue-rotate) var(--un-backdrop-invert) var(--un-backdrop-opacity) var(--un-backdrop-saturate) var(--un-backdrop-sepia)'

const composeMetaCustom = {
  preflightKeys: [...filterBaseKeys, ...backdropFilterBaseKeys],
}

function themeOrBracket(
  values: Record<string, string> | undefined,
  input: string | undefined,
  resolver: (str: string) => string | undefined,
  options: { defaultKey?: string } = {},
) {
  const key = input ?? options.defaultKey
  if (key != null) {
    const themed = values?.[key]
    if (themed != null)
      return themed
  }

  if (input?.startsWith('['))
    return resolver(input)
}

function toFilter(varName: string, resolver: (str: string | undefined, theme: Theme) => string | undefined) {
  return ([, b, s]: string[], { theme }: RuleContext<Theme>): CSSValues | undefined => {
    const value = resolver(s, theme) ?? (s === 'none' ? '0' : '')
    if (value !== '') {
      if (b) {
        return {
          [`--un-${b}${varName}`]: `${varName}(${value})`,
          '-webkit-backdrop-filter': backdropFilterProperty,
          'backdrop-filter': backdropFilterProperty,
        }
      }
      else {
        return {
          [`--un-${varName}`]: `${varName}(${value})`,
          filter: filterProperty,
        }
      }
    }
  }
}

function dropShadowResolver([, s]: string[], { theme }: RuleContext<Theme>) {
  let v = theme.dropShadow?.[s || 'DEFAULT']
  if (v != null) {
    return {
      '--un-drop-shadow': Array.isArray(v)
        ? v.map(item => `drop-shadow(${item})`).join(' ')
        : `drop-shadow(${v})`,
      'filter': filterProperty,
    }
  }

  v = h.bracket.cssvar(s)
  if (v != null) {
    return {
      '--un-drop-shadow': `drop-shadow(${v})`,
      'filter': filterProperty,
    }
  }
}

export const filters: Rule<Theme>[] = [
  // filters
  [/^(?:(backdrop-))?blur(?:-(.+))?$/, toFilter('blur', (s, theme) => themeOrBracket(theme.blur, s, input => h.bracket.cssvar.px(input), { defaultKey: 'DEFAULT' })), { custom: composeMetaCustom, autocomplete: ['backdrop-blur-$blur', 'blur-$blur'] }],
  [/^(?:(backdrop-))?brightness-(.+)$/, toFilter('brightness', (s, theme) => themeOrBracket(theme.brightness, s, input => h.bracket.cssvar(input))), { custom: composeMetaCustom, autocomplete: ['backdrop-brightness-$brightness', 'brightness-$brightness'] }],
  [/^(?:(backdrop-))?contrast-(.+)$/, toFilter('contrast', (s, theme) => themeOrBracket(theme.contrast, s, input => h.bracket.cssvar(input))), { custom: composeMetaCustom, autocomplete: ['backdrop-contrast-$contrast', 'contrast-$contrast'] }],
  [/^drop-shadow(?:-(.+))?$/, dropShadowResolver, {
    custom: filterMetaCustom,
    autocomplete: [
      'drop-shadow',
      'drop-shadow-$dropShadow',
    ],
  }],
  [/^(?:(backdrop-))?grayscale(?:-(.+))?$/, toFilter('grayscale', (s, theme) => themeOrBracket(theme.grayscale, s, input => h.bracket.cssvar(input), { defaultKey: 'DEFAULT' })), { custom: composeMetaCustom, autocomplete: ['backdrop-grayscale', 'backdrop-grayscale-$grayscale', 'grayscale-$grayscale'] }],
  [/^(?:(backdrop-))?hue-rotate-(.+)$/, toFilter('hue-rotate', (s, theme) => themeOrBracket(theme.hueRotate, s, input => h.bracket.cssvar.degree(input))), { custom: composeMetaCustom }],
  [/^(?:(backdrop-))?invert(?:-(.+))?$/, toFilter('invert', (s, theme) => themeOrBracket(theme.invert, s, input => h.bracket.cssvar(input), { defaultKey: 'DEFAULT' })), { custom: composeMetaCustom, autocomplete: ['backdrop-invert', 'backdrop-invert-$invert', 'invert-$invert'] }],
  // opacity only on backdrop-filter
  [/^(backdrop-)opacity-(.+)$/, toFilter('opacity', (s, theme) => themeOrBracket(theme.opacity, s, input => h.bracket.cssvar(input))), { custom: composeMetaCustom, autocomplete: ['backdrop-opacity-$opacity'] }],
  [/^(?:(backdrop-))?saturate-(.+)$/, toFilter('saturate', (s, theme) => themeOrBracket(theme.saturate, s, input => h.bracket.cssvar(input))), { custom: composeMetaCustom, autocomplete: ['backdrop-saturate-$saturate', 'saturate-$saturate'] }],
  [/^(?:(backdrop-))?sepia(?:-(.+))?$/, toFilter('sepia', (s, theme) => themeOrBracket(theme.sepia, s, input => h.bracket.cssvar(input), { defaultKey: 'DEFAULT' })), { custom: composeMetaCustom, autocomplete: ['backdrop-sepia', 'backdrop-sepia-$sepia', 'sepia-$sepia'] }],

  // base
  ['filter', { filter: filterProperty }, { custom: filterMetaCustom }],
  ['backdrop-filter', {
    '-webkit-backdrop-filter': backdropFilterProperty,
    'backdrop-filter': backdropFilterProperty,
  }, { custom: backdropMetaCustom }],

  // nones
  ['filter-none', { filter: 'none' }],
  ['backdrop-filter-none', {
    '-webkit-backdrop-filter': 'none',
    'backdrop-filter': 'none',
  }],
]
