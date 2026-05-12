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

  it('does not return migration replacements that are not Tailwind 3 utilities', () => {
    const invalidReplacementInputs = [
      'b-amber',
      'b-b-amber',
      'scroll-ma-b',
      'filter-drop-shadow-color-amber',
      'transform-origin-b',
      'gap-col-lg',
      'decoration-offset-3',
      'outline-width-3',
      'underline-3',
      'ring-size-none',
      'transition-delay-none',
      'transition-ease-DEFAULT',
      'flex-justify-self-baseline',
      'grid-justify-self-baseline',
      'transform-rotate-10',
      'transform-rotate-x-0',
      'filter-saturate',
      'filter-sepia-50',
      'filter-saturate-90',
      'filter-contrast-90',
    ]

    for (const input of invalidReplacementInputs)
      expect(getBlocklistMigrationReplacement(input), input).toBeUndefined()
  })

  it('keeps high-confidence replacements for legacy border and font-weight utilities', () => {
    expect(getBlocklistMigrationReplacement('border-#fff')).toBe('border-[#fff]')
    expect(getBlocklistMigrationReplacement('border-x-10px')).toBe('border-x-[10px]')
    expect(getBlocklistMigrationReplacement('border-op-50')).toBe('border-opacity-50')
    expect(getBlocklistMigrationReplacement('ring-op-50')).toBe('ring-opacity-50')
    expect(getBlocklistMigrationReplacement('divide-op-50')).toBe('divide-opacity-50')
    expect(getBlocklistMigrationReplacement('rounded-10px')).toBe('rounded-[10px]')
    expect(getBlocklistMigrationReplacement('rounded-se-3px')).toBe('rounded-se-[3px]')
    expect(getBlocklistMigrationReplacement('ring-#fff')).toBe('ring-[#fff]')
    expect(getBlocklistMigrationReplacement('ring-offset-#fff')).toBe('ring-offset-[#fff]')
    expect(getBlocklistMigrationReplacement('outline-#fff')).toBe('outline-[#fff]')
    expect(getBlocklistMigrationReplacement('decoration-#fff')).toBe('decoration-[#fff]')
    expect(getBlocklistMigrationReplacement('divide-#fff')).toBe('divide-[#fff]')
    expect(getBlocklistMigrationReplacement('from-#fff')).toBe('from-[#fff]')
    expect(getBlocklistMigrationReplacement('outline-10px')).toBe('outline-[10px]')
    expect(getBlocklistMigrationReplacement('outline-offset-10px')).toBe('outline-offset-[10px]')
    expect(getBlocklistMigrationReplacement('gap-x-10px')).toBe('gap-x-[10px]')
    expect(getBlocklistMigrationReplacement('border-spacing-y-10px')).toBe('border-spacing-y-[10px]')
    expect(getBlocklistMigrationReplacement('filter-brightness-90')).toBe('brightness-90')
    expect(getBlocklistMigrationReplacement('fw-100')).toBe('font-[100]')
    expect(getBlocklistMigrationReplacement('b-#fff')).toBe('border-[#fff]')
    expect(getBlocklistMigrationReplacement('b-b-red-500')).toBe('border-b-red-500')
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
