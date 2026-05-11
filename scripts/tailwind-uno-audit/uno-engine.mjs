import { createGenerator } from '@unocss/core'

import presetTailwind3, { getBlocklistMigrationReplacement } from '../../src/index.ts'

export async function createUnoAuditEngine(options = {}) {
  const presetOptions = options.presetOptions ?? {}
  const preset = presetTailwind3(presetOptions)
  const uno = await createGenerator({
    presets: [preset],
    ...(options.unoConfig ?? {}),
  })
  const matchCache = new Map()

  async function matches(token) {
    if (matchCache.has(token))
      return matchCache.get(token)

    const { matched } = await uno.generate(new Set([token]), { preflights: false })
    const result = matched.has(token)
    matchCache.set(token, result)
    return result
  }

  function isBlocked(token) {
    return Boolean(uno.getBlocked(token))
  }

  function getMigration(token) {
    return getBlocklistMigrationReplacement(token, presetOptions.prefix)
  }

  return {
    matches,
    isBlocked,
    getMigration,
  }
}
