import { describe, expect, it } from 'vitest'
import { borderWidthFixtures } from './fixtures/tailwind-border-rewrite'
import { tailwindUtilitySpecs } from './tailwind-utility-spec'

describe('tailwind utility spec', () => {
  it('tracks unique utility ids', () => {
    const ids = tailwindUtilitySpecs.map(spec => spec.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('starts with border rewrite templates', () => {
    expect(tailwindUtilitySpecs).toHaveLength(1)
    const borderWidthSpec = tailwindUtilitySpecs.find(spec => spec.id === 'border-width')

    expect(borderWidthSpec).toBeTruthy()
    expect(borderWidthSpec?.canonical).toEqual([...borderWidthFixtures.canonical])
    expect(borderWidthSpec?.invalid).toEqual([...borderWidthFixtures.invalid])

    for (const spec of tailwindUtilitySpecs) {
      expect(spec.canonical.length).toBeGreaterThan(0)
      expect(spec.invalid.length).toBeGreaterThan(0)
      expect(spec.sourceFiles.length).toBeGreaterThan(0)
    }
  })
})
