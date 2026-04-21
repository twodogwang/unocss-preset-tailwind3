import { createGenerator } from '@unocss/core'
import presetTailwind3 from '../src/index'
import { describe, expect, it } from 'vitest'

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
  it('suggests canonical replacements for legacy color shortcuts', async () => {
    await expectBlockedMessage('color-#fff', '旧写法 "color-#fff" 已禁用，请改为 "[color:#fff]"')
    await expectBlockedMessage('c-#fff', '旧写法 "c-#fff" 已禁用，请改为 "text-[#fff]"')
    await expectBlockedMessage('text-#fff', '旧写法 "text-#fff" 已禁用，请改为 "text-[#fff]"')
    await expectBlockedMessage('bg-#fff', '旧写法 "bg-#fff" 已禁用，请改为 "bg-[#fff]"')
    await expectBlockedMessage('fill-#fff', '旧写法 "fill-#fff" 已禁用，请改为 "fill-[#fff]"')
    await expectBlockedMessage('stroke-#fff', '旧写法 "stroke-#fff" 已禁用，请改为 "stroke-[#fff]"')
    await expectBlockedMessage('accent-#fff', '旧写法 "accent-#fff" 已禁用，请改为 "accent-[#fff]"')
    await expectBlockedMessage('caret-#fff', '旧写法 "caret-#fff" 已禁用，请改为 "caret-[#fff]"')
  })

  it('suggests canonical replacements for legacy alias utilities', async () => {
    await expectBlockedMessage('b-2', '旧写法 "b-2" 已禁用，请改为 "border-2"')
    await expectBlockedMessage('b-red-500', '旧写法 "b-red-500" 已禁用，请改为 "border-red-500"')
    await expectBlockedMessage('rd-md', '旧写法 "rd-md" 已禁用，请改为 "rounded-md"')
    await expectBlockedMessage('fw-bold', '旧写法 "fw-bold" 已禁用，请改为 "font-bold"')
    await expectBlockedMessage('pos-absolute', '旧写法 "pos-absolute" 已禁用，请改为 "absolute"')
    await expectBlockedMessage('op50', '旧写法 "op50" 已禁用，请改为 "opacity-50"')
  })

  it('suggests canonical replacements for legacy property prefixes', async () => {
    await expectBlockedMessage('bg-op50', '旧写法 "bg-op50" 已禁用，请改为 "bg-opacity-50"')
    await expectBlockedMessage('bg-op-50', '旧写法 "bg-op-50" 已禁用，请改为 "bg-opacity-50"')
    await expectBlockedMessage('border-op50', '旧写法 "border-op50" 已禁用，请改为 "border-opacity-50"')
    await expectBlockedMessage('ring-op50', '旧写法 "ring-op50" 已禁用，请改为 "ring-opacity-50"')
    await expectBlockedMessage('ring-width-2', '旧写法 "ring-width-2" 已禁用，请改为 "ring-2"')
    await expectBlockedMessage('ring-size-2', '旧写法 "ring-size-2" 已禁用，请改为 "ring-2"')
    await expectBlockedMessage('border-color-red-500', '旧写法 "border-color-red-500" 已禁用，请改为 "border-red-500"')
    await expectBlockedMessage('border-s-color-red-500', '旧写法 "border-s-color-red-500" 已禁用，请改为 "border-s-red-500"')
    await expectBlockedMessage('outline-color-red-500', '旧写法 "outline-color-red-500" 已禁用，请改为 "outline-red-500"')
    await expectBlockedMessage('outline-width-2', '旧写法 "outline-width-2" 已禁用，请改为 "outline-2"')
    await expectBlockedMessage('outline-style-dashed', '旧写法 "outline-style-dashed" 已禁用，请改为 "outline-dashed"')
    await expectBlockedMessage('property-opacity', '旧写法 "property-opacity" 已禁用，请改为 "transition-opacity"')
    await expectBlockedMessage('transition-property-opacity', '旧写法 "transition-property-opacity" 已禁用，请改为 "transition-opacity"')
    await expectBlockedMessage('transition-delay-75', '旧写法 "transition-delay-75" 已禁用，请改为 "delay-75"')
    await expectBlockedMessage('transition-ease-linear', '旧写法 "transition-ease-linear" 已禁用，请改为 "ease-linear"')
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
