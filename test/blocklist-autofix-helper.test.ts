import { describe, expect, it } from 'vitest'
import {
  blocklistMigrationFixtures,
  overflowBlocklistMigrationFixtures,
} from './fixtures/blocklist-migration'
import {
  getBlocklistMigrationReplacement,
  rewriteBlocklistMigrationClassString,
} from '../src/index'

describe('blocklist autofix helpers', () => {
  it('returns canonical replacements for every migration fixture', () => {
    for (const fixture of blocklistMigrationFixtures)
      expect(getBlocklistMigrationReplacement(fixture.input)).toBe(fixture.replacement)
  })

  it('supports prefixed migration replacements', () => {
    for (const fixture of overflowBlocklistMigrationFixtures)
      expect(getBlocklistMigrationReplacement(`tw-${fixture.input}`, 'tw-')).toBe(`tw-${fixture.replacement}`)
  })

  it('rewrites only migratable tokens inside a class string', () => {
    expect(
      rewriteBlocklistMigrationClassString('c-#fff text-[#000] bg-op50 shape-circle'),
    ).toEqual({
      output: 'text-[#fff] text-[#000] bg-opacity-50 shape-circle',
      fixes: [
        { from: 'c-#fff', to: 'text-[#fff]' },
        { from: 'bg-op50', to: 'bg-opacity-50' },
      ],
    })
  })
})
