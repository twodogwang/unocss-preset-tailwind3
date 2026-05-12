import { generateFullAuditCandidates } from './candidates.mjs'
import { createTailwindMatcher } from './tailwind-engine.mjs'
import { createUnoAuditEngine, createWind3AuditEngine } from './uno-engine.mjs'
import { inferMigrationReplacement } from './migration-inference.mjs'

export async function classifyAuditCandidate(input) {
  const {
    candidate,
    tailwindMatches,
    wind3Matches,
    currentMatches,
    isBlocked,
    getMigration,
  } = input

  const tailwindMatched = await tailwindMatches(candidate.token)
  const wind3Matched = await wind3Matches(candidate.token)
  const currentMatched = await currentMatches(candidate.token)
  const blocklisted = isBlocked(candidate.token)
  const currentMigration = getMigration(candidate.token) ?? null
  const inferredMigration = inferMigrationReplacement(candidate) ?? null
  const replacementToVerify = currentMigration ?? inferredMigration
  const inferredMigrationTailwindMatched = inferredMigration
    ? await tailwindMatches(inferredMigration)
    : false
  const currentMigrationTailwindMatched = currentMigration
    ? await tailwindMatches(currentMigration)
    : false

  let classification
  if (tailwindMatched && currentMatched) {
    classification = 'compatible'
  }
  else if (tailwindMatched) {
    classification = 'broken-tailwind'
  }
  else if (wind3Matched && currentMatched) {
    classification = 'leaked-wind3-extension'
  }
  else if (currentMigration && currentMigrationTailwindMatched) {
    classification = 'covered-migration'
  }
  else if (currentMigration && !currentMigrationTailwindMatched) {
    classification = 'invalid-migration'
  }
  else if (inferredMigration && inferredMigrationTailwindMatched) {
    classification = 'missing-migration'
  }
  else if (wind3Matched && !currentMatched) {
    classification = 'removed-wind3-extension'
  }
  else if (currentMatched) {
    classification = 'current-only'
  }
  else if (blocklisted) {
    classification = 'blocked-only'
  }
  else {
    classification = 'ignored'
  }

  return {
    candidate,
    token: candidate.token,
    tailwindMatched,
    wind3Matched,
    currentMatched,
    unoMatched: currentMatched,
    blocklisted,
    currentMigration,
    inferredMigration,
    inferredMigrationTailwindMatched,
    currentMigrationTailwindMatched,
    replacementToVerify,
    classification,
  }
}

export async function runAudit(options = {}) {
  const tailwind = await createTailwindMatcher(options.tailwind ?? {})
  const current = await createUnoAuditEngine(options.current ?? options.uno ?? {})
  const wind3 = await createWind3AuditEngine(options.wind3 ?? {})
  const candidates = options.candidates ?? await generateFullAuditCandidates({
    includeWind3Autocomplete: options.includeWind3Autocomplete,
    wind3Autocomplete: options.wind3Autocomplete,
  })
  const tokens = candidates.map(candidate => candidate.token)
  const [
    tailwindMatchMap,
    wind3MatchMap,
    currentMatchMap,
  ] = await Promise.all([
    tailwind.matchesMany(tokens),
    wind3.matchesMany(tokens),
    current.matchesMany(tokens),
  ])
  const results = []

  for (const candidate of candidates) {
    results.push(await classifyAuditCandidate({
      candidate,
      tailwindMatches: token => tailwindMatchMap.has(token) ? tailwindMatchMap.get(token) : tailwind.matches(token),
      wind3Matches: token => wind3MatchMap.get(token) ?? false,
      currentMatches: token => currentMatchMap.get(token) ?? false,
      isBlocked: token => current.isBlocked(token),
      getMigration: token => current.getMigration(token),
    }))
  }

  return results
}
