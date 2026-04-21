import { createGenerator, escapeSelector } from '@unocss/core'
import presetTailwind3 from '../src/index'
import { describe, expect, it } from 'vitest'

async function createPrefixedUno() {
  const preset = presetTailwind3({ prefix: 'tw-' })

  return createGenerator({
    presets: [{
      ...preset,
      name: `${preset.name}:prefix-tw`,
    }],
  })
}

async function expectTargets(input: string[]) {
  const uno = await createPrefixedUno()
  const { css, matched } = await uno.generate(new Set(input), { preflights: false })

  expect(matched).toEqual(new Set(input))
  for (const item of input)
    expect(css).toContain(escapeSelector(item))

  return css
}

async function expectNonTargets(input: string[]) {
  const uno = await createPrefixedUno()
  const { css, matched } = await uno.generate(new Set(input), { preflights: false })

  expect(Array.from(matched)).toEqual([])
  expect(css).toBe('')
}

async function createUno() {
  return createGenerator({
    presets: [presetTailwind3()],
  })
}

describe('preset-tailwind3 prefix', () => {
  it('keeps Tailwind 3 syntax strict when prefix is enabled', async () => {
    await expectTargets([
      'tw-p-4',
      'tw-opacity-50',
      'tw-w-[10px]',
      'tw-gap-[3px]',
      'tw-inset-[5px]',
      'tw-translate-x-[12px]',
      'tw-divide-x',
      'tw-divide-y-2',
      'tw-divide-opacity-50',
      'sm:tw-w-4',
      'hover:tw-bg-red-500',
      'group-hover:tw-text-red-500',
      'peer-focus:tw-block',
      '[&>*]:tw-p-4',
      'supports-[display:grid]:tw-grid',
    ])

    await expectNonTargets([
      'p-4',
      'tw-p4',
      'tw-op50',
      'tw-w-100px',
      'tw-h-2rem',
      'tw-gap-3px',
      'tw-inset-5px',
      'tw-translate-x-12px',
      'tw-dividex',
      'tw-dividey2',
      'tw-divide-op50',
      'tw-sm:tw-w-4',
      'tw-hover:tw-bg-red-500',
      'tw-group-hover:tw-text-red-500',
      'tw-[&>*]:tw-p-4',
      'tw-supports-[display:grid]:tw-grid',
      'lt-md:tw-w-4',
      'selector-[&>*]:tw-p-4',
    ])
  })

  it('matches Tailwind 3 prefixed negative utility syntax', async () => {
    const css = await expectTargets([
      '-tw-mt-4',
      'tw--mt-4',
      'sm:-tw-mt-4',
      'sm:tw--mt-4',
      'tw--translate-y-1',
      'hover:tw--translate-y-1',
      'tw--rotate-45',
    ])

    expect(css).toContain('margin-top:-1rem')
    expect(css).toContain('--un-translate-y:-0.25rem')
    expect(css).toContain('--un-rotate:-45deg')
  })

  it('does not leak prefix metadata across preset instances', async () => {
    const prefixed = await createPrefixedUno()
    const plain = await createUno()

    const prefixedResult = await prefixed.generate(new Set(['tw-p-4']), { preflights: false })
    const plainResult = await plain.generate(new Set(['p-4']), { preflights: false })

    expect(prefixedResult.matched).toEqual(new Set(['tw-p-4']))
    expect(plainResult.matched).toEqual(new Set(['p-4']))
  })

  it('rejects prefixed legacy aliases and extensions', async () => {
    await expectTargets([
      'tw-font-bold',
      'tw-absolute',
      'tw-overflow-hidden',
      'tw-z-10',
      'tw-inline-flex',
      'tw-basis-[10px]',
      'tw-grid-flow-row',
      'tw-grid-rows-2',
      'tw-grid-cols-2',
      'tw-blur-sm',
      'tw-drop-shadow',
      'tw-origin-top-right',
      'tw-animate-spin',
      'tw-bg-gradient-to-r',
      'tw-from-red-500',
    ])

    await expectNonTargets([
      'tw-fontbold',
      'tw-fw-bold',
      'tw-pos-absolute',
      'tw-of-hidden',
      'tw-z10',
      'tw-flex-inline',
      'tw-flex-basis-10px',
      'tw-auto-flow-row',
      'tw-rows-2',
      'tw-cols-2',
      'tw-filter-blur-sm',
      'tw-filter-drop-shadow',
      'tw-drop-shadow-color-red-500',
      'tw-transform-rotate-45',
      'tw-transform-origin-top-right',
      'tw-perspective-origin-center',
      'tw-preserve-3d',
      'tw-keyframes-spin',
      'tw-animate-name-wiggle',
      'tw-animate-duration-500',
      'tw-animate-delay-75',
      'tw-animate-ease-linear',
      'tw-animate-fill-forwards',
      'tw-animate-direction-reverse',
      'tw-animate-count-infinite',
      'tw-animate-play-paused',
      'tw-bg-gradient-linear',
      'tw-bg-gradient-from-red-500',
      'tw-bg-gradient-via-cyan-500',
      'tw-bg-gradient-to-emerald-500',
      'tw-bg-gradient-shape-r',
      'tw-shape-r',
    ])
  })
})
