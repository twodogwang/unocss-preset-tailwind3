import type { Rule } from '@unocss/core'
import { h } from '../utils'

export const lineClamps: Rule[] = [
  [/^line-clamp-([1-9]\d*)$/, ([, v]) => ({
    'overflow': 'hidden',
    'display': '-webkit-box',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': v,
  }), { autocomplete: ['line-clamp', 'line-clamp-<num>'] }],
  [/^line-clamp-(\[.+\])$/, ([, v]) => {
    const value = h.bracket.cssvar.global(v)
    if (value == null)
      return
    return {
      'overflow': 'hidden',
      'display': '-webkit-box',
      '-webkit-box-orient': 'vertical',
      '-webkit-line-clamp': value,
    }
  }],
  ['line-clamp-none', {
    'overflow': 'visible',
    'display': 'block',
    '-webkit-box-orient': 'horizontal',
    '-webkit-line-clamp': 'none',
  }],
]
