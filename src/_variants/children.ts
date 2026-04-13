import type { VariantObject } from '@unocss/core'

export const variantUniversalChildren: VariantObject = {
  name: 'children:universal',
  match(matcher) {
    if (!matcher.startsWith('*:'))
      return

    return {
      matcher: matcher.slice(2),
      selector: s => `${s} > *`,
    }
  },
  multiPass: true,
}
