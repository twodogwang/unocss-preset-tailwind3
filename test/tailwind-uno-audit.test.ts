import { describe, expect, it } from 'vitest'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')

describe('tailwind uno audit engines', () => {
  it('detects Tailwind matches through the Tailwind engine', async () => {
    const { createTailwindMatcher } = await import(pathToFileURL(resolve(root, 'scripts/tailwind-uno-audit/tailwind-engine.mjs')).href) as {
      createTailwindMatcher: () => Promise<{
        matches: (token: string) => Promise<boolean>
        matchesMany: (tokens: string[]) => Promise<Map<string, boolean>>
      }>
    }

    const matcher = await createTailwindMatcher()

    await expect(matcher.matches('border-[#fff]')).resolves.toBe(true)
    await expect(matcher.matches('border-#fff')).resolves.toBe(false)
    await expect(matcher.matches('container')).resolves.toBe(true)
    await expect(matcher.matches('divide-x')).resolves.toBe(true)
    await expect(matcher.matches('space-x-4')).resolves.toBe(true)

    const many = await matcher.matchesMany(['border-[#fff]', 'border-#fff', 'divide-x'])
    expect(many.get('border-[#fff]')).toBe(true)
    expect(many.get('border-#fff')).toBe(false)
    expect(many.get('divide-x')).toBe(true)
  })

  it('detects Uno matches and blocklist state through the Uno engine', async () => {
    const { createUnoAuditEngine } = await import(pathToFileURL(resolve(root, 'scripts/tailwind-uno-audit/uno-engine.mjs')).href) as {
      createUnoAuditEngine: () => Promise<{
        matches: (token: string) => Promise<boolean>
        matchesMany: (tokens: string[]) => Promise<Map<string, boolean>>
        isBlocked: (token: string) => boolean
        getMigration: (token: string) => string | undefined
      }>
    }

    const engine = await createUnoAuditEngine()

    await expect(engine.matches('border-[#fff]')).resolves.toBe(true)
    await expect(engine.matches('border-#fff')).resolves.toBe(false)
    const many = await engine.matchesMany(['border-[#fff]', 'border-#fff'])
    expect(many.get('border-[#fff]')).toBe(true)
    expect(many.get('border-#fff')).toBe(false)
    expect(engine.isBlocked('text-#fff')).toBe(true)
    expect(engine.getMigration('text-#fff')).toBe('text-[#fff]')
  })

  it('detects official presetWind3 matches through the Wind3 engine', async () => {
    const { createWind3AuditEngine } = await import(pathToFileURL(resolve(root, 'scripts/tailwind-uno-audit/uno-engine.mjs')).href) as {
      createWind3AuditEngine: () => Promise<{
        matches: (token: string) => Promise<boolean>
      }>
    }

    const engine = await createWind3AuditEngine()

    await expect(engine.matches('border-[#fff]')).resolves.toBe(true)
    await expect(engine.matches('border-#fff')).resolves.toBe(true)
    await expect(engine.matches('flex-inline')).resolves.toBe(true)
  })
})

describe('tailwind uno audit candidates', () => {
  it('generates high-confidence pattern candidates', async () => {
    const { generateAuditCandidates } = await import(pathToFileURL(resolve(root, 'scripts/tailwind-uno-audit/candidates.mjs')).href) as {
      generateAuditCandidates: () => Array<{ token: string, expectedReplacement?: string, family: string, source: string }>
    }

    const candidates = generateAuditCandidates()
    const byToken = new Map(candidates.map(candidate => [candidate.token, candidate]))

    expect(byToken.get('border-#fff')?.expectedReplacement).toBe('border-[#fff]')
    expect(byToken.get('ring-offset-#fff')?.expectedReplacement).toBe('ring-offset-[#fff]')
    expect(byToken.get('border-10px')?.expectedReplacement).toBe('border-[10px]')
    expect(byToken.get('outline-offset-3px')?.expectedReplacement).toBe('outline-offset-[3px]')
    expect(byToken.get('border-op-50')?.expectedReplacement).toBe('border-opacity-50')
    expect(byToken.get('divide-op-50')?.expectedReplacement).toBe('divide-opacity-50')
  })

  it('generates candidates from existing utility specs', async () => {
    const { generateAuditCandidates } = await import(pathToFileURL(resolve(root, 'scripts/tailwind-uno-audit/candidates.mjs')).href) as {
      generateAuditCandidates: () => Array<{ token: string, family: string, source: string }>
    }

    const candidates = generateAuditCandidates()
    const byToken = new Map(candidates.map(candidate => [candidate.token, candidate]))

    expect(byToken.get('flex')?.source).toBe('spec:canonical')
    expect(byToken.get('flex-inline')?.source).toBe('spec:invalid')
    expect(byToken.get('flex-inline')?.family).toBe('flex')
  })

  it('generates candidates from official Wind3 autocomplete', async () => {
    const { generateWind3AutocompleteCandidates } = await import(pathToFileURL(resolve(root, 'scripts/tailwind-uno-audit/candidates.mjs')).href) as {
      generateWind3AutocompleteCandidates: () => Promise<Array<{ token: string, source: string }>>
    }

    const candidates = await generateWind3AutocompleteCandidates()
    const byToken = new Map(candidates.map(candidate => [candidate.token, candidate]))

    expect(byToken.get('flex-inline')?.source).toBe('wind3:autocomplete')
    expect(candidates.every(candidate => !candidate.token.endsWith(':'))).toBe(true)
  })

  it('does not emit duplicate token candidates', async () => {
    const { generateAuditCandidates } = await import(pathToFileURL(resolve(root, 'scripts/tailwind-uno-audit/candidates.mjs')).href) as {
      generateAuditCandidates: () => Array<{ token: string }>
    }

    const tokens = generateAuditCandidates().map(candidate => candidate.token)

    expect(new Set(tokens).size).toBe(tokens.length)
  })
})

describe('tailwind uno audit classification', () => {
  it('infers only high-confidence replacements', async () => {
    const { inferMigrationReplacement } = await import(pathToFileURL(resolve(root, 'scripts/tailwind-uno-audit/migration-inference.mjs')).href) as {
      inferMigrationReplacement: (candidate: { token: string, expectedReplacement?: string }) => string | undefined
    }

    expect(inferMigrationReplacement({ token: 'border-#fff', expectedReplacement: 'border-[#fff]' })).toBe('border-[#fff]')
    expect(inferMigrationReplacement({ token: 'flex-grow-1' })).toBeUndefined()
  })

  it('classifies missing migration when inferred replacement is Tailwind-supported', async () => {
    const { classifyAuditCandidate } = await import(pathToFileURL(resolve(root, 'scripts/tailwind-uno-audit/classifier.mjs')).href) as {
      classifyAuditCandidate: (input: any) => Promise<any>
    }

    const result = await classifyAuditCandidate({
      candidate: {
        token: 'border-#fff',
        expectedReplacement: 'border-[#fff]',
      },
      tailwindMatches: async (token: string) => token === 'border-[#fff]',
      wind3Matches: async () => true,
      currentMatches: async () => false,
      isBlocked: () => false,
      getMigration: () => undefined,
    })

    expect(result.classification).toBe('missing-migration')
    expect(result.inferredMigration).toBe('border-[#fff]')
    expect(result.wind3Matched).toBe(true)
    expect(result.currentMatched).toBe(false)
  })

  it('classifies existing valid migrations as covered', async () => {
    const { classifyAuditCandidate } = await import(pathToFileURL(resolve(root, 'scripts/tailwind-uno-audit/classifier.mjs')).href) as {
      classifyAuditCandidate: (input: any) => Promise<any>
    }

    const result = await classifyAuditCandidate({
      candidate: {
        token: 'text-#fff',
        expectedReplacement: 'text-[#fff]',
      },
      tailwindMatches: async (token: string) => token === 'text-[#fff]',
      wind3Matches: async () => true,
      currentMatches: async () => false,
      isBlocked: () => true,
      getMigration: () => 'text-[#fff]',
    })

    expect(result.classification).toBe('covered-migration')
  })

  it('classifies Tailwind compatibility and Wind3 extension leaks', async () => {
    const { classifyAuditCandidate } = await import(pathToFileURL(resolve(root, 'scripts/tailwind-uno-audit/classifier.mjs')).href) as {
      classifyAuditCandidate: (input: any) => Promise<any>
    }

    await expect(classifyAuditCandidate({
      candidate: { token: 'border-[#fff]' },
      tailwindMatches: async () => true,
      wind3Matches: async () => true,
      currentMatches: async () => true,
      isBlocked: () => false,
      getMigration: () => undefined,
    })).resolves.toMatchObject({
      classification: 'compatible',
      tailwindMatched: true,
      wind3Matched: true,
      currentMatched: true,
    })

    await expect(classifyAuditCandidate({
      candidate: { token: 'flex-inline' },
      tailwindMatches: async () => false,
      wind3Matches: async () => true,
      currentMatches: async () => true,
      isBlocked: () => false,
      getMigration: () => undefined,
    })).resolves.toMatchObject({
      classification: 'leaked-wind3-extension',
      tailwindMatched: false,
      wind3Matched: true,
      currentMatched: true,
    })

    await expect(classifyAuditCandidate({
      candidate: { token: 'flex-inline' },
      tailwindMatches: async () => false,
      wind3Matches: async () => true,
      currentMatches: async () => false,
      isBlocked: () => true,
      getMigration: () => undefined,
    })).resolves.toMatchObject({
      classification: 'removed-wind3-extension',
    })
  })

  it('classifies Tailwind tokens missing from the current preset as broken', async () => {
    const { classifyAuditCandidate } = await import(pathToFileURL(resolve(root, 'scripts/tailwind-uno-audit/classifier.mjs')).href) as {
      classifyAuditCandidate: (input: any) => Promise<any>
    }

    const result = await classifyAuditCandidate({
      candidate: { token: 'border-[#fff]' },
      tailwindMatches: async () => true,
      wind3Matches: async () => true,
      currentMatches: async () => false,
      isBlocked: () => false,
      getMigration: () => undefined,
    })

    expect(result.classification).toBe('broken-tailwind')
  })
})

describe('tailwind uno audit report formatting', () => {
  it('formats markdown with action-focused sections', async () => {
    const { formatMarkdownReport } = await import(pathToFileURL(resolve(root, 'scripts/audit-tailwind-uno-diff.mjs')).href) as {
      formatMarkdownReport: (results: Array<any>) => string
    }

    const markdown = formatMarkdownReport([
      {
        token: 'border-#fff',
        classification: 'missing-migration',
        inferredMigration: 'border-[#fff]',
        candidate: { family: 'color', source: 'pattern:bare-hex-color' },
      },
      {
        token: 'text-#fff',
        classification: 'covered-migration',
        currentMigration: 'text-[#fff]',
        candidate: { family: 'color', source: 'pattern:bare-hex-color' },
      },
      {
        token: 'flex-inline',
        classification: 'leaked-wind3-extension',
        candidate: { family: 'layout', source: 'fixture:wind3-only' },
      },
    ])

    expect(markdown).toContain('# Tailwind Uno Diff Audit')
    expect(markdown).toContain('## Missing Migration')
    expect(markdown).toContain('## Leaked Wind3 Extension')
    expect(markdown).toContain('border-#fff -> border-[#fff]')
    expect(markdown).toContain('flex-inline')
    expect(markdown).not.toContain('text-#fff -> text-[#fff]')
  })
})

describe('tailwind uno audit known findings', { timeout: 60000 }, () => {
  it('surfaces covered migrations and removed Wind3 extensions from the full audit', async () => {
    const { runAudit } = await import(pathToFileURL(resolve(root, 'scripts/tailwind-uno-audit/classifier.mjs')).href) as {
      runAudit: () => Promise<Array<{ token: string, classification: string, currentMigration?: string, inferredMigration?: string }>>
    }

    const results = await runAudit()
    const byToken = new Map(results.map(result => [result.token, result]))

    expect(byToken.get('border-#fff')).toMatchObject({
      classification: 'covered-migration',
      currentMigration: 'border-[#fff]',
      inferredMigration: 'border-[#fff]',
    })
    expect(byToken.get('border-op-50')).toMatchObject({
      classification: 'covered-migration',
      currentMigration: 'border-opacity-50',
      inferredMigration: 'border-opacity-50',
    })
    expect(byToken.get('flex')).toMatchObject({
      classification: 'compatible',
    })
    expect(byToken.get('flex-grow-2')).toMatchObject({
      classification: 'removed-wind3-extension',
    })
  })
})
