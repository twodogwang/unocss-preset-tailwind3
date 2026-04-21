import { describe, expect, it } from 'vitest'
import { borderWidthFixtures, roundedFixtures } from './fixtures/tailwind-border-rewrite'
import { outlineFixtures } from './fixtures/tailwind-outline-rewrite'
import { tailwindUtilitySpecs } from './tailwind-utility-spec'

function getSpec(id: string) {
  return tailwindUtilitySpecs.find(spec => spec.id === id)
}

describe('tailwind utility spec', () => {
  it('tracks unique utility ids', () => {
    const ids = tailwindUtilitySpecs.map(spec => spec.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('keeps the border rewrite template in sync with the shared fixtures', () => {
    const borderWidthSpec = getSpec('border-width')
    const borderRadiusSpec = getSpec('border-radius')
    const outlineSpec = getSpec('outline')

    expect(borderWidthSpec).toBeTruthy()
    expect(borderRadiusSpec).toBeTruthy()
    expect(outlineSpec).toBeTruthy()

    expect(borderWidthSpec?.invalid).toContain('border-10px')
    expect(borderRadiusSpec?.invalid).toContain('rounded-lt-lg')
    expect(borderWidthSpec?.supportsPrefix).toBe(true)
    expect(borderWidthSpec?.supportsVariants).toBe(true)
    expect(borderRadiusSpec?.supportsPrefix).toBe(true)
    expect(borderRadiusSpec?.supportsVariants).toBe(true)

    expect(borderWidthSpec?.canonical).toEqual([...borderWidthFixtures.canonical])
    expect(borderWidthSpec?.invalid).toEqual([...borderWidthFixtures.invalid])
    expect(borderRadiusSpec?.canonical).toEqual([...roundedFixtures.canonical])
    expect(borderRadiusSpec?.invalid).toEqual([...roundedFixtures.invalid])
    expect(outlineSpec?.canonical).toEqual([...outlineFixtures.canonical])
    expect(outlineSpec?.invalid).toEqual([...outlineFixtures.invalid])
    expect(outlineSpec?.sourceFiles).toEqual(['src/_rules/behaviors.ts'])
    expect(outlineSpec?.category).toBe('behavior')
    expect(outlineSpec?.supportsPrefix).toBe(true)
    expect(outlineSpec?.supportsVariants).toBe(true)

    for (const spec of [borderWidthSpec, borderRadiusSpec, outlineSpec].filter(Boolean)) {
      expect(spec?.canonical.length).toBeGreaterThan(0)
      expect(spec?.invalid.length).toBeGreaterThan(0)
      expect(spec?.sourceFiles.length).toBeGreaterThan(0)
    }
  })
})
