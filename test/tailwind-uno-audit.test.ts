import { describe, expect, it } from 'vitest'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')

describe('tailwind uno audit engines', () => {
  it('detects Tailwind matches through the Tailwind engine', async () => {
    const { createTailwindMatcher } = await import(pathToFileURL(resolve(root, 'scripts/tailwind-uno-audit/tailwind-engine.mjs')).href) as {
      createTailwindMatcher: () => Promise<{ matches: (token: string) => Promise<boolean> }>
    }

    const matcher = await createTailwindMatcher()

    await expect(matcher.matches('border-[#fff]')).resolves.toBe(true)
    await expect(matcher.matches('border-#fff')).resolves.toBe(false)
  })

  it('detects Uno matches and blocklist state through the Uno engine', async () => {
    const { createUnoAuditEngine } = await import(pathToFileURL(resolve(root, 'scripts/tailwind-uno-audit/uno-engine.mjs')).href) as {
      createUnoAuditEngine: () => Promise<{
        matches: (token: string) => Promise<boolean>
        isBlocked: (token: string) => boolean
        getMigration: (token: string) => string | undefined
      }>
    }

    const engine = await createUnoAuditEngine()

    await expect(engine.matches('border-[#fff]')).resolves.toBe(true)
    await expect(engine.matches('border-#fff')).resolves.toBe(false)
    expect(engine.isBlocked('text-#fff')).toBe(true)
    expect(engine.getMigration('text-#fff')).toBe('text-[#fff]')
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

  it('does not emit duplicate token candidates', async () => {
    const { generateAuditCandidates } = await import(pathToFileURL(resolve(root, 'scripts/tailwind-uno-audit/candidates.mjs')).href) as {
      generateAuditCandidates: () => Array<{ token: string }>
    }

    const tokens = generateAuditCandidates().map(candidate => candidate.token)

    expect(new Set(tokens).size).toBe(tokens.length)
  })
})
