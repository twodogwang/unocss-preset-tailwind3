import type { Rule } from '@unocss/core'
import type { Theme } from '../theme'
import { h } from '../utils'

function resolveTransitionProperty(prop: string, theme: Theme): string | undefined {
  if (h.cssvar(prop) != null) {
    return h.cssvar(prop)
  }

  if ((prop.startsWith('[') && prop.endsWith(']'))) {
    return h.bracket(prop)
  }

  return theme.transitionProperty?.[prop] ?? h.properties(prop)
}

function resolveTransitionTiming(value: string | undefined, theme: Theme): string | undefined {
  if (!value)
    return theme.easing?.DEFAULT

  if (value.startsWith('[') && value.endsWith(']'))
    return h.bracket.cssvar(value)

  return theme.easing?.[value]
}

export const transitions: Rule<Theme>[] = [
  // transition
  [
    /^transition(?:-(.+))?$/,
    ([, prop], { theme }) => {
      if (!prop) {
        return {
          'transition-property': theme.transitionProperty?.DEFAULT,
          'transition-timing-function': theme.easing?.DEFAULT,
          'transition-duration': theme.duration?.DEFAULT ?? h.time('150'),
        }
      }

      const p = resolveTransitionProperty(prop, theme)
      if (p) {
        return {
          'transition-property': p,
          'transition-timing-function': theme.easing?.DEFAULT,
          'transition-duration': theme.duration?.DEFAULT ?? h.time('150'),
        }
      }
    },
    {
      autocomplete: 'transition-$transitionProperty',
    },
  ],

  // timings
  [
    /^duration-(.+)$/,
    ([, d], { theme }) => ({ 'transition-duration': theme.duration?.[d || 'DEFAULT'] ?? h.bracket.cssvar.time(d) }),
    { autocomplete: 'duration-$duration' },
  ],

  [
    /^delay-(.+)$/,
    ([, d], { theme }) => ({ 'transition-delay': theme.duration?.[d || 'DEFAULT'] ?? h.bracket.cssvar.time(d) }),
    { autocomplete: 'delay-$duration' },
  ],

  [
    /^ease(?:-(.+))?$/,
    ([, d], { theme }) => {
      const value = resolveTransitionTiming(d, theme)
      if (value)
        return { 'transition-timing-function': value }
    },
    { autocomplete: 'ease-(linear|in|out|in-out|DEFAULT)' },
  ],

  // none
  ['transition-none', { transition: 'none' }],
]
