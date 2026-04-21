import { describe, expect, it } from 'vitest'
import { borderWidthFixtures, roundedFixtures } from './fixtures/tailwind-border-rewrite'
import { tailwindUtilitySpecs } from './tailwind-utility-spec'

describe('tailwind utility spec', () => {
  it('tracks unique utility ids', () => {
    const ids = tailwindUtilitySpecs.map(spec => spec.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('keeps the border rewrite template in sync with the shared fixtures', () => {
    const borderWidthSpec = tailwindUtilitySpecs.find(spec => spec.id === 'border-width')
    const borderRadiusSpec = tailwindUtilitySpecs.find(spec => spec.id === 'border-radius')

    expect(borderWidthSpec).toBeTruthy()
    expect(borderRadiusSpec).toBeTruthy()

    expect(borderWidthSpec?.canonical).toEqual([...borderWidthFixtures.canonical])
    expect(borderWidthSpec?.invalid).toEqual([...borderWidthFixtures.invalid])
    expect(borderRadiusSpec?.canonical).toEqual([...roundedFixtures.canonical])
    expect(borderRadiusSpec?.invalid).toEqual([...roundedFixtures.invalid])

    for (const spec of [borderWidthSpec, borderRadiusSpec]) {
      expect(spec).toBeTruthy()
      expect(spec?.supportsPrefix).toBe(true)
      expect(spec?.supportsVariants).toBe(true)
      expect(spec?.canonical.length).toBeGreaterThan(0)
      expect(spec?.invalid.length).toBeGreaterThan(0)
      expect(spec?.sourceFiles.length).toBeGreaterThan(0)
    }
  })
})
