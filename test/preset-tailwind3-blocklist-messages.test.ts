import { createGenerator } from '@unocss/core'
import presetTailwind3 from '../src/index'
import { describe, expect, it } from 'vitest'
import { backgroundStyleFixtures } from './fixtures/tailwind-background-style-rewrite'
import {
  backgroundColorBlocklistMigrationFixtures,
  blocklistMigrationFixtures,
  borderSpacingSpaceBlocklistMigrationFixtures,
  decorationBlocklistMigrationFixtures,
  divideBlocklistMigrationFixtures,
  gapInsetScrollBlocklistMigrationFixtures,
  leadingBlocklistMigrationFixtures,
  outlineBlocklistMigrationFixtures,
  paddingMarginBlocklistMigrationFixtures,
  ringBlocklistMigrationFixtures,
  shadowBlocklistMigrationFixtures,
  strokeBlocklistMigrationFixtures,
  trackingBlocklistMigrationFixtures,
  transitionBlocklistMigrationFixtures,
  textBlocklistMigrationFixtures,
} from './fixtures/blocklist-migration'

async function createUno(options: Parameters<typeof presetTailwind3>[0] = {}) {
  return createGenerator({
    presets: [presetTailwind3(options)],
  })
}

async function expectBlockedMessage(
  input: string,
  expected: string,
  options: Parameters<typeof presetTailwind3>[0] = {},
) {
  const uno = await createUno(options)
  const blocked = uno.getBlocked(input)

  expect(blocked, `${input} should be blocked by blocklist`).toBeTruthy()

  const [, meta] = blocked!
  const message = typeof meta?.message === 'function'
    ? meta.message(input)
    : meta?.message

  expect(message).toBe(expected)

  const { css, matched } = await uno.generate(new Set([input]), { preflights: false })
  expect(Array.from(matched)).toEqual([])
  expect(css).toBe('')
}

async function expectBlocked(
  input: string,
  options: Parameters<typeof presetTailwind3>[0] = {},
) {
  const uno = await createUno(options)
  const blocked = uno.getBlocked(input)

  expect(blocked, `${input} should be blocked by blocklist`).toBeTruthy()

  const { css, matched } = await uno.generate(new Set([input]), { preflights: false })
  expect(Array.from(matched)).toEqual([])
  expect(css).toBe('')
}

async function expectNotBlocked(
  input: string,
  options: Parameters<typeof presetTailwind3>[0] = {},
) {
  const uno = await createUno(options)
  const blocked = uno.getBlocked(input)

  expect(blocked, `${input} should not be blocked by blocklist`).toBeFalsy()

  const { css, matched } = await uno.generate(new Set([input]), { preflights: false })
  expect(Array.from(matched)).toEqual([])
  expect(css).toBe('')
}

describe('preset-tailwind3 blocklist migration messages', () => {
  it('suggests canonical replacements for legacy alias utilities', async () => {
    for (const fixture of blocklistMigrationFixtures) {
      await expectBlockedMessage(fixture.input, `旧写法 "${fixture.input}" 已禁用，请改为 "${fixture.replacement}"`)
    }
  })

  it('locks outline migration hints through the shared fixture subset', async () => {
    expect(outlineBlocklistMigrationFixtures).toHaveLength(3)
    expect(outlineBlocklistMigrationFixtures.map(fixture => fixture.input)).toEqual([
      'outline-color-red-500',
      'outline-width-2',
      'outline-style-dashed',
    ])

    for (const fixture of outlineBlocklistMigrationFixtures) {
      await expectBlockedMessage(fixture.input, `旧写法 "${fixture.input}" 已禁用，请改为 "${fixture.replacement}"`)
    }
  })

  it('locks text migration hints through the shared fixture subset', async () => {
    expect(textBlocklistMigrationFixtures).toHaveLength(6)
    expect(textBlocklistMigrationFixtures.map(fixture => fixture.input)).toEqual([
      'text-#fff',
      'text-size-sm',
      'font-size-sm',
      'text-10px',
      'text-2rem',
      'text-color-red-500',
    ])

    for (const fixture of textBlocklistMigrationFixtures) {
      await expectBlockedMessage(fixture.input, `旧写法 "${fixture.input}" 已禁用，请改为 "${fixture.replacement}"`)
    }
  })

  it('locks background color migration hints through the shared fixture subset', async () => {
    expect(backgroundColorBlocklistMigrationFixtures).toHaveLength(3)
    expect(backgroundColorBlocklistMigrationFixtures.map(fixture => fixture.input)).toEqual([
      'bg-#fff',
      'bg-op50',
      'bg-op-50',
    ])

    for (const fixture of backgroundColorBlocklistMigrationFixtures) {
      await expectBlockedMessage(fixture.input, `旧写法 "${fixture.input}" 已禁用，请改为 "${fixture.replacement}"`)
    }
  })

  it('locks background style strictness cases through the shared fixture subset', async () => {
    expect(backgroundStyleFixtures.blocklisted).toEqual([
      'bg-gradient-linear',
      'bg-gradient-from-red-500',
      'bg-gradient-via-cyan-500',
      'bg-gradient-to-emerald-500',
      'bg-gradient-shape-r',
      'bg-gradient-stops-3',
      'shape-r',
    ])

    for (const input of backgroundStyleFixtures.blocklisted)
      await expectBlocked(input)
  })

  it('locks ring migration hints through the shared fixture subset', async () => {
    expect(ringBlocklistMigrationFixtures).toHaveLength(3)
    expect(ringBlocklistMigrationFixtures.map(fixture => fixture.input)).toEqual([
      'ring-op50',
      'ring-width-2',
      'ring-size-2',
    ])

    for (const fixture of ringBlocklistMigrationFixtures) {
      await expectBlockedMessage(fixture.input, `旧写法 "${fixture.input}" 已禁用，请改为 "${fixture.replacement}"`)
    }
  })

  it('locks shadow migration hints through the shared fixture subset', async () => {
    expect(shadowBlocklistMigrationFixtures).toHaveLength(2)
    expect(shadowBlocklistMigrationFixtures.map(fixture => fixture.input)).toEqual([
      'shadowmd',
      'shadow-inset',
    ])

    for (const fixture of shadowBlocklistMigrationFixtures) {
      await expectBlockedMessage(fixture.input, `旧写法 "${fixture.input}" 已禁用，请改为 "${fixture.replacement}"`)
    }
  })

  it('locks divide migration hints through the shared fixture subset', async () => {
    expect(divideBlocklistMigrationFixtures).toHaveLength(3)
    expect(divideBlocklistMigrationFixtures.map(fixture => fixture.input)).toEqual([
      'dividex',
      'dividey2',
      'divide-op50',
    ])

    for (const fixture of divideBlocklistMigrationFixtures) {
      await expectBlockedMessage(fixture.input, `旧写法 "${fixture.input}" 已禁用，请改为 "${fixture.replacement}"`)
    }
  })

  it('locks decoration migration hints through the shared fixture subset', async () => {
    expect(decorationBlocklistMigrationFixtures).toHaveLength(8)
    expect(decorationBlocklistMigrationFixtures.map(fixture => fixture.input)).toEqual([
      'decoration-none',
      'decoration-underline',
      'decoration-offset-4',
      'underline-2',
      'underline-[3px]',
      'underline-auto',
      'underline-dashed',
      'underline-wavy',
    ])

    for (const fixture of decorationBlocklistMigrationFixtures) {
      await expectBlockedMessage(fixture.input, `旧写法 "${fixture.input}" 已禁用，请改为 "${fixture.replacement}"`)
    }
  })

  it('locks leading migration hints through the shared fixture subset', async () => {
    expect(leadingBlocklistMigrationFixtures).toHaveLength(4)
    expect(leadingBlocklistMigrationFixtures.map(fixture => fixture.input)).toEqual([
      'lh-6',
      'line-height-6',
      'font-leading-6',
      'leading-20px',
    ])

    for (const fixture of leadingBlocklistMigrationFixtures) {
      await expectBlockedMessage(fixture.input, `旧写法 "${fixture.input}" 已禁用，请改为 "${fixture.replacement}"`)
    }
  })

  it('locks tracking migration hints through the shared fixture subset', async () => {
    expect(trackingBlocklistMigrationFixtures).toHaveLength(2)
    expect(trackingBlocklistMigrationFixtures.map(fixture => fixture.input)).toEqual([
      'font-tracking-wide',
      'tracking-0.2em',
    ])

    for (const fixture of trackingBlocklistMigrationFixtures) {
      await expectBlockedMessage(fixture.input, `旧写法 "${fixture.input}" 已禁用，请改为 "${fixture.replacement}"`)
    }
  })

  it('locks stroke migration hints through the shared fixture subset', async () => {
    expect(strokeBlocklistMigrationFixtures).toHaveLength(3)
    expect(strokeBlocklistMigrationFixtures.map(fixture => fixture.input)).toEqual([
      'stroke-width-2',
      'stroke-size-2',
      'stroke-#fff',
    ])

    for (const fixture of strokeBlocklistMigrationFixtures) {
      await expectBlockedMessage(fixture.input, `旧写法 "${fixture.input}" 已禁用，请改为 "${fixture.replacement}"`)
    }
  })

  it('locks padding margin migration hints through the shared fixture subset', async () => {
    expect(paddingMarginBlocklistMigrationFixtures).toHaveLength(13)
    expect(paddingMarginBlocklistMigrationFixtures.map(fixture => fixture.input)).toEqual([
      'p4',
      'px2',
      'pt1',
      'm4',
      'mx2',
      '-mt1',
      'p-x-4',
      '-m-y-2',
      'p-s-4',
      'm-e-4',
      'p-5px',
      'm-2rem',
      'mx-var(--gap)',
    ])

    for (const fixture of paddingMarginBlocklistMigrationFixtures) {
      await expectBlockedMessage(fixture.input, `旧写法 "${fixture.input}" 已禁用，请改为 "${fixture.replacement}"`)
    }
  })

  it('locks gap inset scroll migration hints through the shared fixture subset', async () => {
    expect(gapInsetScrollBlocklistMigrationFixtures).toHaveLength(22)
    expect(gapInsetScrollBlocklistMigrationFixtures.map(fixture => fixture.input)).toEqual([
      'gap4',
      'gapx2',
      'gapx-2',
      'gap-row-4',
      'gap-col-4',
      'gap-3px',
      'insetx-4',
      'insety2',
      'inset-r-4',
      'inset-s-4',
      'top1',
      'right2',
      'scrollm-4',
      'scroll-m4',
      'scrollmx-2',
      'scrollpy8',
      'scroll-p4',
      'scroll-ma-4',
      'scroll-pa-4',
      'scroll-m-s-4',
      'scroll-p-e-4',
      'scroll-m-2rem',
    ])

    for (const fixture of gapInsetScrollBlocklistMigrationFixtures) {
      await expectBlockedMessage(fixture.input, `旧写法 "${fixture.input}" 已禁用，请改为 "${fixture.replacement}"`)
    }
  })

  it('locks border spacing space migration hints through the shared fixture subset', async () => {
    expect(borderSpacingSpaceBlocklistMigrationFixtures).toHaveLength(8)
    expect(borderSpacingSpaceBlocklistMigrationFixtures.map(fixture => fixture.input)).toEqual([
      'borderspacing-2',
      'border-spacing-3px',
      'border-spacingx-2',
      'border-spacingy4',
      'spacex-4',
      'spacey2',
      'space-x-5px',
      'space-y-var(--gap)',
    ])

    for (const fixture of borderSpacingSpaceBlocklistMigrationFixtures) {
      await expectBlockedMessage(fixture.input, `旧写法 "${fixture.input}" 已禁用，请改为 "${fixture.replacement}"`)
    }
  })

  it('locks transition migration hints through the shared fixture subset', async () => {
    expect(transitionBlocklistMigrationFixtures).toHaveLength(4)
    expect(transitionBlocklistMigrationFixtures.map(fixture => fixture.input)).toEqual([
      'property-opacity',
      'transition-property-opacity',
      'transition-delay-75',
      'transition-ease-linear',
    ])

    for (const fixture of transitionBlocklistMigrationFixtures) {
      await expectBlockedMessage(fixture.input, `旧写法 "${fixture.input}" 已禁用，请改为 "${fixture.replacement}"`)
    }
  })

  it('keeps only high-confidence migration hints', async () => {
    await expectBlockedMessage('pos-absolute', '旧写法 "pos-absolute" 已禁用，请改为 "absolute"')
    await expectBlockedMessage('property-opacity', '旧写法 "property-opacity" 已禁用，请改为 "transition-opacity"')

    await expectNotBlocked('pos-inherit')
    await expectNotBlocked('property-height')
    await expectNotBlocked('transition-property-height')
  })

  it('supports english blocklist messages', async () => {
    await expectBlockedMessage('b-2', 'Legacy class "b-2" is disabled. Use "border-2" instead.', { locale: 'en' })
    await expectBlockedMessage('tw-b-2', 'Legacy class "tw-b-2" is disabled. Use "tw-border-2" instead.', { prefix: 'tw-', locale: 'en' })
  })

  it('prefers locale over blocklistLocale for compatibility', async () => {
    await expectBlockedMessage('b-2', 'Legacy class "b-2" is disabled. Use "border-2" instead.', {
      locale: 'en',
      blocklistLocale: 'zh-CN',
    })
  })

  it('keeps migration hints when prefix is enabled', async () => {
    await expectBlockedMessage('tw-b-2', '旧写法 "tw-b-2" 已禁用，请改为 "tw-border-2"', { prefix: 'tw-' })
    await expectBlockedMessage('tw-rd-md', '旧写法 "tw-rd-md" 已禁用，请改为 "tw-rounded-md"', { prefix: 'tw-' })
    await expectBlockedMessage('tw-bg-op50', '旧写法 "tw-bg-op50" 已禁用，请改为 "tw-bg-opacity-50"', { prefix: 'tw-' })
    await expectBlockedMessage('tw-transition-ease-linear', '旧写法 "tw-transition-ease-linear" 已禁用，请改为 "tw-ease-linear"', { prefix: 'tw-' })
    await expectBlockedMessage('tw-color-#fff', '旧写法 "tw-color-#fff" 已禁用，请改为 "tw-[color:#fff]"', { prefix: 'tw-' })
  })

  it('blocks prefixed strictness-only legacy syntax families', async () => {
    await expectBlocked('tw-w4', { prefix: 'tw-' })
    await expectBlocked('tw-minw0', { prefix: 'tw-' })
    await expectBlocked('tw-size-w-4', { prefix: 'tw-' })
    await expectBlocked('tw-p4', { prefix: 'tw-' })
    await expectBlocked('tw-gapx2', { prefix: 'tw-' })
    await expectBlocked('tw-dividex', { prefix: 'tw-' })
    await expectBlocked('tw-scrollm4', { prefix: 'tw-' })
    await expectBlocked('tw-keyframes-spin', { prefix: 'tw-' })
    await expectBlocked('tw-animate-duration-500', { prefix: 'tw-' })
    await expectBlocked('tw-bg-gradient-linear', { prefix: 'tw-' })
    await expectBlocked('tw-shape-r', { prefix: 'tw-' })
    await expectBlocked('tw-fontbold', { prefix: 'tw-' })
    await expectBlocked('tw-of-hidden', { prefix: 'tw-' })
    await expectBlocked('tw-z10', { prefix: 'tw-' })
    await expectBlocked('tw-flex-inline', { prefix: 'tw-' })
    await expectBlocked('tw-auto-flow-row', { prefix: 'tw-' })
    await expectBlocked('tw-filter-blur-sm', { prefix: 'tw-' })
    await expectBlocked('tw-transform-rotate-45', { prefix: 'tw-' })
    await expectBlocked('tw-perspective-origin-center', { prefix: 'tw-' })
    await expectBlocked('tw-preserve-3d', { prefix: 'tw-' })
    await expectBlocked('tw-w-100px', { prefix: 'tw-' })
    await expectBlocked('tw-gap-3px', { prefix: 'tw-' })
    await expectBlocked('tw-inset-5px', { prefix: 'tw-' })
    await expectBlocked('tw-translate-x-12px', { prefix: 'tw-' })
    await expectBlocked('tw-scroll-m-2rem', { prefix: 'tw-' })
  })
})
