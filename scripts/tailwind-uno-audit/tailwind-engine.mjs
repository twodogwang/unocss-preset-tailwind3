import { escapeSelector } from '@unocss/core'
import postcss from 'postcss'
import tailwindcss from 'tailwindcss'

const sentinel = 'hidden'

export async function createTailwindMatcher(options = {}) {
  const cache = new Map()
  const tailwindConfig = options.tailwindConfig ?? {}
  const tailwindEntry = options.tailwindEntry ?? '@tailwind utilities;'

  async function matches(token) {
    const cacheKey = JSON.stringify([token, tailwindConfig, tailwindEntry])
    if (cache.has(cacheKey))
      return cache.get(cacheKey)

    const raw = `<div class="${sentinel} ${token}"></div>`
    const result = await postcss([
      tailwindcss({
        ...tailwindConfig,
        content: [{ raw, extension: 'html' }],
        corePlugins: {
          preflight: false,
        },
      }),
    ]).process(tailwindEntry, { from: undefined })

    let matched = false
    result.root.walkRules((rule) => {
      if (rule.selector !== `.${escapeSelector(sentinel)}`)
        matched = true
    })

    cache.set(cacheKey, matched)
    return matched
  }

  return { matches }
}
