import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import escapeClassNameModule from 'tailwindcss/lib/util/escapeClassName.js'

const sentinel = 'hidden'
const escapeClassName = escapeClassNameModule.default ?? escapeClassNameModule

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function selectorMatchesToken(selector, token) {
  const classSelector = `.${escapeClassName(token)}`
  const classSelectorPattern = new RegExp(`^${escapeRegExp(classSelector)}(?:$|[:\\s>+~.#\\[])`)
  return selector
    .split(',')
    .map(part => part.trim())
    .some(part => classSelectorPattern.test(part))
}

export async function createTailwindMatcher(options = {}) {
  const cache = new Map()
  const tailwindConfig = options.tailwindConfig ?? {}
  const tailwindEntry = options.tailwindEntry ?? '@tailwind components; @tailwind utilities;'

  async function matchesMany(tokens) {
    const uniqueTokens = [...new Set(tokens)]
    const resultMap = new Map()
    const uncached = []

    for (const token of uniqueTokens) {
      if (cache.has(token)) {
        resultMap.set(token, cache.get(token))
      }
      else {
        uncached.push(token)
      }
    }

    if (!uncached.length)
      return resultMap

    const raw = `<div class="${sentinel} ${uncached.join(' ')}"></div>`
    const result = await postcss([
      tailwindcss({
        ...tailwindConfig,
        content: [{ raw, extension: 'html' }],
        corePlugins: {
          preflight: false,
        },
      }),
    ]).process(tailwindEntry, { from: undefined })

    for (const token of uncached)
      resultMap.set(token, false)

    result.root.walkRules((rule) => {
      for (const token of uncached) {
        if (selectorMatchesToken(rule.selector, token))
          resultMap.set(token, true)
      }
    })

    for (const [token, matched] of resultMap)
      cache.set(token, matched)

    return resultMap
  }

  async function matches(token) {
    return (await matchesMany([token])).get(token) ?? false
  }

  return { matches, matchesMany }
}
