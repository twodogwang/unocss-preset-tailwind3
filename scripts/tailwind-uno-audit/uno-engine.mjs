import { createGenerator } from '@unocss/core'
import { presetWind3 } from '@unocss/preset-wind3'

import presetTailwind3, { getBlocklistMigrationReplacement } from '../../src/index.ts'

async function createPresetAuditEngine(preset, options = {}) {
  const uno = await createGenerator({
    presets: [preset],
    ...(options.unoConfig ?? {}),
  })
  const matchCache = new Map()

  async function matchesMany(tokens) {
    const uniqueTokens = [...new Set(tokens)]
    const resultMap = new Map()
    const uncached = []

    for (const token of uniqueTokens) {
      if (matchCache.has(token)) {
        resultMap.set(token, matchCache.get(token))
      }
      else {
        uncached.push(token)
      }
    }

    if (!uncached.length)
      return resultMap

    const { matched } = await uno.generate(new Set(uncached), { preflights: false })
    for (const token of uncached) {
      const result = matched.has(token)
      matchCache.set(token, result)
      resultMap.set(token, result)
    }

    return resultMap
  }

  async function matches(token) {
    return (await matchesMany([token])).get(token) ?? false
  }

  function isBlocked(token) {
    return Boolean(uno.getBlocked(token))
  }

  return {
    matches,
    matchesMany,
    isBlocked,
  }
}

export async function createUnoAuditEngine(options = {}) {
  const presetOptions = options.presetOptions ?? {}
  const engine = await createPresetAuditEngine(presetTailwind3(presetOptions), options)

  function getMigration(token) {
    return getBlocklistMigrationReplacement(token, presetOptions.prefix)
  }

  return {
    ...engine,
    getMigration,
  }
}

export async function createWind3AuditEngine(options = {}) {
  const engine = await createPresetAuditEngine(presetWind3(options.presetOptions ?? {}), options)

  return {
    ...engine,
    getMigration: () => undefined,
  }
}
