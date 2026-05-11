import { generateAuditCandidates } from './candidates.mjs'
import { createTailwindMatcher } from './tailwind-engine.mjs'
import { createUnoAuditEngine } from './uno-engine.mjs'
import { inferMigrationReplacement } from './migration-inference.mjs'

export async function classifyAuditCandidate(input) {
  const {
    candidate,
    tailwindMatches,
    unoMatches,
    isBlocked,
    getMigration,
  } = input

  const tailwindMatched = await tailwindMatches(candidate.token)
  const unoMatched = await unoMatches(candidate.token)
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
  if (tailwindMatched && unoMatched) {
    classification = 'both-match'
  }
  else if (tailwindMatched) {
    classification = 'tailwind-only'
  }
  else if (unoMatched) {
    classification = 'uno-only'
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
    unoMatched,
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
  const uno = await createUnoAuditEngine(options.uno ?? {})
  const candidates = options.candidates ?? generateAuditCandidates()
  const results = []

  for (const candidate of candidates) {
    results.push(await classifyAuditCandidate({
      candidate,
      tailwindMatches: token => tailwind.matches(token),
      unoMatches: token => uno.matches(token),
      isBlocked: token => uno.isBlocked(token),
      getMigration: token => uno.getMigration(token),
    }))
  }

  return results
}
