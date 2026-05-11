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
