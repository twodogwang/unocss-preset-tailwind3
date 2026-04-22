import { createGenerator } from '@unocss/core'
import presetTailwind3 from '../src/index'
import { describe, expect, it } from 'vitest'
import {
  blocklistMigrationFixtures,
  outlineBlocklistMigrationFixtures,
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
