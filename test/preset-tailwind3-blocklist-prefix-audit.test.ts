import type { BlocklistRule } from '@unocss/core'
import { createGenerator } from '@unocss/core'
import { createBlocklist } from '../src/blocklist'
import presetTailwind3 from '../src/index'
import { describe, expect, it } from 'vitest'

type PresetOptions = Parameters<typeof presetTailwind3>[0]

type MigrationFixture = {
  label: string
  matcher: RegExp
  input: string
  prefixed: string
  replacement: string
}

type RawFixture = {
  label: string
  matcher: RegExp
  input: string
  prefixed: string
}

type AllowFixture = {
  label: string
  input: string
  prefixed: string
}

function zhMessage(selector: string, replacement: string) {
  return `旧写法 "${selector}" 已禁用，请改为 "${replacement}"`
}

function enMessage(selector: string, replacement: string) {
  return `Legacy class "${selector}" is disabled. Use "${replacement}" instead.`
}

function ruleKey(matcher: RegExp) {
  return `${matcher.source}::${matcher.flags}`
}

function fixtureKey(rule: BlocklistRule) {
  const matcher = Array.isArray(rule) ? rule[0] : rule
  if (typeof matcher === 'string')
    return `${matcher}::string`
  if (matcher instanceof RegExp)
    return ruleKey(matcher)
  return `fn:${matcher.toString()}`
}

async function createUno(options: PresetOptions = {}) {
  return createGenerator({
    presets: [presetTailwind3(options)],
  })
}

async function readBlockedState(
  input: string,
  options: PresetOptions = {},
) {
  const uno = await createUno(options)
  const blocked = uno.getBlocked(input)
  const { css, matched } = await uno.generate(new Set([input]), { preflights: false })

  return {
    blocked,
    css,
    matched: Array.from(matched),
  }
}

async function expectBlocked(
  input: string,
  options: PresetOptions = {},
) {
  const { blocked, css, matched } = await readBlockedState(input, options)

  expect(blocked, `${input} should be blocked`).toBeTruthy()
  expect(matched, `${input} should not be matched`).toEqual([])
  expect(css, `${input} should not generate CSS`).toBe('')

  return blocked!
}

async function expectBlockedMessage(
  input: string,
  expected: string,
  options: PresetOptions = {},
) {
  const blocked = await expectBlocked(input, options)
  const [, meta] = blocked
  const actual = typeof meta?.message === 'function'
    ? meta.message(input)
    : meta?.message

  expect(actual).toBe(expected)
}

async function expectNotBlocked(
  input: string,
  options: PresetOptions = {},
) {
  const uno = await createUno(options)
  expect(uno.getBlocked(input), `${input} should not be blocked`).toBeFalsy()
}

const migrationFixtures: MigrationFixture[] = [
  {
    label: 'color hex alias',
    matcher: new RegExp('^color-(#(?:[\\da-fA-F]{3,4}|[\\da-fA-F]{6}|[\\da-fA-F]{8}))$'),
    input: 'color-#fff',
    prefixed: 'tw-color-#fff',
    replacement: '[color:#fff]',
  },
  {
    label: 'text shorthand hex alias',
    matcher: new RegExp('^c-(#(?:[\\da-fA-F]{3,4}|[\\da-fA-F]{6}|[\\da-fA-F]{8}))$'),
    input: 'c-#fff',
    prefixed: 'tw-c-#fff',
    replacement: 'text-[#fff]',
  },
  {
    label: 'text hex alias',
    matcher: new RegExp('^(text|bg|fill|stroke|accent|caret)-(#(?:[\\da-fA-F]{3,4}|[\\da-fA-F]{6}|[\\da-fA-F]{8}))$'),
    input: 'text-#fff',
    prefixed: 'tw-text-#fff',
    replacement: 'text-[#fff]',
  },
  {
    label: 'compact padding shorthand alias',
    matcher: /^(-?)([mp])([trblxyse]?)(\d+(?:\.\d+)?)$/,
    input: 'p4',
    prefixed: 'tw-p4',
    replacement: 'p-4',
  },
  {
    label: 'legacy padding directional alias',
    matcher: /^(-?)([mp])-([trblxyse])-([\da-z.]+)$/,
    input: 'p-x-4',
    prefixed: 'tw-p-x-4',
    replacement: 'px-4',
  },
  {
    label: 'raw padding arbitrary alias',
    matcher: new RegExp('^(-?)([mp])([trblxyse]?)-((?:\\d+\\.?\\d*|\\d*\\.\\d+)(?:%|px|r?em|ex|ch|vh|vw|vmin|vmax|svh|svw|lvh|lvw|dvh|dvw|cm|mm|in|pt|pc)|(?:var|calc|min|max|clamp)\\(.+\\))$'),
    input: 'mx-var(--gap)',
    prefixed: 'tw-mx-var(--gap)',
    replacement: 'mx-[var(--gap)]',
  },
  {
    label: 'compact size axis shorthand alias',
    matcher: /^([wh])(\d+(?:\.\d+)?)$/,
    input: 'w4',
    prefixed: 'tw-w4',
    replacement: 'w-4',
  },
  {
    label: 'compact min max size shorthand alias',
    matcher: /^(min|max)([wh])(.+)$/,
    input: 'minw0',
    prefixed: 'tw-minw0',
    replacement: 'min-w-0',
  },
  {
    label: 'raw size arbitrary alias',
    matcher: new RegExp('^(size|(?:min|max)-[wh]|[wh])-((?:(?:\\d+\\.?\\d*|\\d*\\.\\d+)(?:%|px|r?em|ex|ch|vh|vw|vmin|vmax|svh|svw|lvh|lvw|dvh|dvw|cm|mm|in|pt|pc)|(?:var|calc|min|max|clamp)\\(.+\\)))$'),
    input: 'w-100px',
    prefixed: 'tw-w-100px',
    replacement: 'w-[100px]',
  },
  {
    label: 'aspect square ratio alias',
    matcher: /^aspect-1\/1$/,
    input: 'aspect-1/1',
    prefixed: 'tw-aspect-1/1',
    replacement: 'aspect-square',
  },
  {
    label: 'aspect video ratio alias',
    matcher: /^aspect-16\/9$/,
    input: 'aspect-16/9',
    prefixed: 'tw-aspect-16/9',
    replacement: 'aspect-video',
  },
  {
    label: 'raw aspect ratio alias',
    matcher: /^aspect-(\d+\/\d+)$/,
    input: 'aspect-4/3',
    prefixed: 'tw-aspect-4/3',
    replacement: 'aspect-[4/3]',
  },
  {
    label: 'legacy aspect-ratio prefix alias',
    matcher: /^aspect-ratio-(auto|square|video)$/,
    input: 'aspect-ratio-square',
    prefixed: 'tw-aspect-ratio-square',
    replacement: 'aspect-square',
  },
  {
    label: 'legacy aspect-ratio arbitrary alias',
    matcher: /^aspect-ratio-(\[.+\])$/,
    input: 'aspect-ratio-[4/3]',
    prefixed: 'tw-aspect-ratio-[4/3]',
    replacement: 'aspect-[4/3]',
  },
  {
    label: 'legacy size aspect alias',
    matcher: /^size-aspect-(auto|square|video)$/,
    input: 'size-aspect-square',
    prefixed: 'tw-size-aspect-square',
    replacement: 'aspect-square',
  },
  {
    label: 'legacy display alias',
    matcher: /^display-(block|inline|inline-block|none|contents|flow-root|list-item)$/,
    input: 'display-block',
    prefixed: 'tw-display-block',
    replacement: 'block',
  },
  {
    label: 'legacy overflow alias',
    matcher: /^of(?:-([xy]))?-(auto|hidden|clip|visible|scroll)$/,
    input: 'of-hidden',
    prefixed: 'tw-of-hidden',
    replacement: 'overflow-hidden',
  },
  {
    label: 'legacy compact columns alias',
    matcher: /^columns([1-9]|1[0-2])$/,
    input: 'columns3',
    prefixed: 'tw-columns3',
    replacement: 'columns-3',
  },
  {
    label: 'legacy compact z-index alias',
    matcher: /^z(0|10|20|30|40|50)$/,
    input: 'z10',
    prefixed: 'tw-z10',
    replacement: 'z-10',
  },
  {
    label: 'legacy compact order alias',
    matcher: /^order([1-9]|1[0-2])$/,
    input: 'order2',
    prefixed: 'tw-order2',
    replacement: 'order-2',
  },
  {
    label: 'compact gap shorthand alias',
    matcher: /^gap(\d+(?:\.\d+)?)$/,
    input: 'gap4',
    prefixed: 'tw-gap4',
    replacement: 'gap-4',
  },
  {
    label: 'compact gap axis shorthand alias',
    matcher: /^gap([xy])(\d+(?:\.\d+)?)$/,
    input: 'gapx2',
    prefixed: 'tw-gapx2',
    replacement: 'gap-x-2',
  },
  {
    label: 'legacy gap axis shorthand alias',
    matcher: /^gap([xy])-(.+)$/,
    input: 'gapx-2',
    prefixed: 'tw-gapx-2',
    replacement: 'gap-x-2',
  },
  {
    label: 'legacy gap row col alias',
    matcher: /^gap-(row|col)-(.+)$/,
    input: 'gap-row-4',
    prefixed: 'tw-gap-row-4',
    replacement: 'gap-y-4',
  },
  {
    label: 'raw gap arbitrary alias',
    matcher: new RegExp('^gap-((?:\\d+\\.?\\d*|\\d*\\.\\d+)(?:%|px|r?em|ex|ch|vh|vw|vmin|vmax|svh|svw|lvh|lvw|dvh|dvw|cm|mm|in|pt|pc)|(?:var|calc|min|max|clamp)\\(.+\\))$'),
    input: 'gap-3px',
    prefixed: 'tw-gap-3px',
    replacement: 'gap-[3px]',
  },
  {
    label: 'legacy inset axis alias',
    matcher: /^inset([xy])-(.+)$/,
    input: 'insetx-4',
    prefixed: 'tw-insetx-4',
    replacement: 'inset-x-4',
  },
  {
    label: 'compact inset axis alias',
    matcher: /^inset([xy])(\d+(?:\.\d+)?)$/,
    input: 'insety2',
    prefixed: 'tw-insety2',
    replacement: 'inset-y-2',
  },
  {
    label: 'legacy inset directional alias',
    matcher: /^inset-([trblse])-(.+)$/,
    input: 'inset-r-4',
    prefixed: 'tw-inset-r-4',
    replacement: 'right-4',
  },
  {
    label: 'compact edge shorthand alias',
    matcher: /^(top|right|bottom|left|start|end)(\d+(?:\.\d+)?)$/,
    input: 'top1',
    prefixed: 'tw-top1',
    replacement: 'top-1',
  },
  {
    label: 'compact scroll shorthand alias',
    matcher: /^scroll([mp])-(.+)$/,
    input: 'scrollm-4',
    prefixed: 'tw-scrollm-4',
    replacement: 'scroll-m-4',
  },
  {
    label: 'legacy scroll compact shorthand alias',
    matcher: /^scroll-([mp])(\d+(?:\.\d+)?)$/,
    input: 'scroll-m4',
    prefixed: 'tw-scroll-m4',
    replacement: 'scroll-m-4',
  },
  {
    label: 'compact scroll axis alias',
    matcher: /^scroll([mp])([xytrblse])-?(.+)$/,
    input: 'scrollmx-2',
    prefixed: 'tw-scrollmx-2',
    replacement: 'scroll-mx-2',
  },
  {
    label: 'legacy scroll all axis alias',
    matcher: /^scroll-([mp])a-(.+)$/,
    input: 'scroll-ma-4',
    prefixed: 'tw-scroll-ma-4',
    replacement: 'scroll-m-4',
  },
  {
    label: 'legacy scroll logical side alias',
    matcher: /^scroll-([mp])-([se])-(.+)$/,
    input: 'scroll-p-e-4',
    prefixed: 'tw-scroll-p-e-4',
    replacement: 'scroll-pe-4',
  },
  {
    label: 'raw scroll arbitrary alias',
    matcher: new RegExp('^scroll-([mp])-((?:\\d+\\.?\\d*|\\d*\\.\\d+)(?:%|px|r?em|ex|ch|vh|vw|vmin|vmax|svh|svw|lvh|lvw|dvh|dvw|cm|mm|in|pt|pc)|(?:var|calc|min|max|clamp)\\(.+\\))$'),
    input: 'scroll-m-2rem',
    prefixed: 'tw-scroll-m-2rem',
    replacement: 'scroll-m-[2rem]',
  },
  {
    label: 'compact border-spacing alias',
    matcher: /^borderspacing-(.+)$/,
    input: 'borderspacing-2',
    prefixed: 'tw-borderspacing-2',
    replacement: 'border-spacing-2',
  },
  {
    label: 'compact border-spacing axis alias',
    matcher: /^border-spacing([xy])-?(.+)$/,
    input: 'border-spacingx-2',
    prefixed: 'tw-border-spacingx-2',
    replacement: 'border-spacing-x-2',
  },
  {
    label: 'raw border-spacing arbitrary alias',
    matcher: new RegExp('^border-spacing-((?:\\d+\\.?\\d*|\\d*\\.\\d+)(?:%|px|r?em|ex|ch|vh|vw|vmin|vmax|svh|svw|lvh|lvw|dvh|dvw|cm|mm|in|pt|pc)|(?:var|calc|min|max|clamp)\\(.+\\))$'),
    input: 'border-spacing-3px',
    prefixed: 'tw-border-spacing-3px',
    replacement: 'border-spacing-[3px]',
  },
  {
    label: 'compact space axis alias',
    matcher: /^space([xy])-(.+)$/,
    input: 'spacex-4',
    prefixed: 'tw-spacex-4',
    replacement: 'space-x-4',
  },
  {
    label: 'compact space numeric alias',
    matcher: /^space([xy])(\d+(?:\.\d+)?)$/,
    input: 'spacey2',
    prefixed: 'tw-spacey2',
    replacement: 'space-y-2',
  },
  {
    label: 'raw space arbitrary alias',
    matcher: new RegExp('^space-([xy])-((?:\\d+\\.?\\d*|\\d*\\.\\d+)(?:%|px|r?em|ex|ch|vh|vw|vmin|vmax|svh|svw|lvh|lvw|dvh|dvw|cm|mm|in|pt|pc)|(?:var|calc|min|max|clamp)\\(.+\\))$'),
    input: 'space-x-5px',
    prefixed: 'tw-space-x-5px',
    replacement: 'space-x-[5px]',
  },
  {
    label: 'raw space cssvar alias',
    matcher: new RegExp('^space-([xy])-((?:\\d+\\.?\\d*|\\d*\\.\\d+)(?:%|px|r?em|ex|ch|vh|vw|vmin|vmax|svh|svw|lvh|lvw|dvh|dvw|cm|mm|in|pt|pc)|(?:var|calc|min|max|clamp)\\(.+\\))$'),
    input: 'space-y-var(--gap)',
    prefixed: 'tw-space-y-var(--gap)',
    replacement: 'space-y-[var(--gap)]',
  },
  {
    label: 'bg hex alias',
    matcher: new RegExp('^(text|bg|fill|stroke|accent|caret)-(#(?:[\\da-fA-F]{3,4}|[\\da-fA-F]{6}|[\\da-fA-F]{8}))$'),
    input: 'bg-#fff',
    prefixed: 'tw-bg-#fff',
    replacement: 'bg-[#fff]',
  },
  {
    label: 'text size alias',
    matcher: /^text-size-(.+)$/,
    input: 'text-size-sm',
    prefixed: 'tw-text-size-sm',
    replacement: 'text-sm',
  },
  {
    label: 'font size alias',
    matcher: /^font-size-(.+)$/,
    input: 'font-size-sm',
    prefixed: 'tw-font-size-sm',
    replacement: 'text-sm',
  },
  {
    label: 'text bare length alias',
    matcher: new RegExp('^text-((?:\\d+\\.?\\d*|\\d*\\.\\d+)(?:%|px|r?em|ex|ch|vh|vw|vmin|vmax|svh|svw|lvh|lvw|dvh|dvw|cm|mm|in|pt|pc))$'),
    input: 'text-10px',
    prefixed: 'tw-text-10px',
    replacement: 'text-[10px]',
  },
  {
    label: 'text color legacy prefix',
    matcher: /^text-color-(.+)$/,
    input: 'text-color-red-500',
    prefixed: 'tw-text-color-red-500',
    replacement: 'text-red-500',
  },
  {
    label: 'leading shorthand alias',
    matcher: /^lh-(.+)$/,
    input: 'lh-6',
    prefixed: 'tw-lh-6',
    replacement: 'leading-6',
  },
  {
    label: 'line-height alias',
    matcher: /^line-height-(.+)$/,
    input: 'line-height-6',
    prefixed: 'tw-line-height-6',
    replacement: 'leading-6',
  },
  {
    label: 'font-leading alias',
    matcher: /^font-leading-(.+)$/,
    input: 'font-leading-6',
    prefixed: 'tw-font-leading-6',
    replacement: 'leading-6',
  },
  {
    label: 'leading bare length alias',
    matcher: new RegExp('^leading-((?:\\d+\\.?\\d*|\\d*\\.\\d+)(?:%|px|r?em|ex|ch|vh|vw|vmin|vmax|svh|svw|lvh|lvw|dvh|dvw|cm|mm|in|pt|pc))$'),
    input: 'leading-20px',
    prefixed: 'tw-leading-20px',
    replacement: 'leading-[20px]',
  },
  {
    label: 'tracking alias',
    matcher: /^font-tracking-(.+)$/,
    input: 'font-tracking-wide',
    prefixed: 'tw-font-tracking-wide',
    replacement: 'tracking-wide',
  },
  {
    label: 'tracking bare length alias',
    matcher: new RegExp('^tracking-((?:\\d+\\.?\\d*|\\d*\\.\\d+)(?:%|px|r?em|ex|ch|vh|vw|vmin|vmax|svh|svw|lvh|lvw|dvh|dvw|cm|mm|in|pt|pc))$'),
    input: 'tracking-0.2em',
    prefixed: 'tw-tracking-0.2em',
    replacement: 'tracking-[0.2em]',
  },
  {
    label: 'text-align alias',
    matcher: /^text-align-(left|center|right|justify|start|end)$/,
    input: 'text-align-left',
    prefixed: 'tw-text-align-left',
    replacement: 'text-left',
  },
  {
    label: 'vertical-align legacy prefix',
    matcher: /^vertical-(baseline|top|middle|bottom|text-top|text-bottom|sub|super)$/,
    input: 'vertical-baseline',
    prefixed: 'tw-vertical-baseline',
    replacement: 'align-baseline',
  },
  {
    label: 'vertical-align compact prefix',
    matcher: /^v-(baseline|top|middle|bottom|text-top|text-bottom|sub|super)$/,
    input: 'v-baseline',
    prefixed: 'tw-v-baseline',
    replacement: 'align-baseline',
  },
  {
    label: 'vertical-align alias keyword',
    matcher: /^align-base$/,
    input: 'align-base',
    prefixed: 'tw-align-base',
    replacement: 'align-baseline',
  },
  {
    label: 'vertical-align middle alias',
    matcher: /^align-mid$/,
    input: 'align-mid',
    prefixed: 'tw-align-mid',
    replacement: 'align-middle',
  },
  {
    label: 'vertical-align bottom alias',
    matcher: /^align-btm$/,
    input: 'align-btm',
    prefixed: 'tw-align-btm',
    replacement: 'align-bottom',
  },
  {
    label: 'vertical-align directional alias',
    matcher: /^align-start$/,
    input: 'align-start',
    prefixed: 'tw-align-start',
    replacement: 'align-top',
  },
  {
    label: 'vertical-align end alias',
    matcher: /^align-end$/,
    input: 'align-end',
    prefixed: 'tw-align-end',
    replacement: 'align-bottom',
  },
  {
    label: 'vertical-align bare length alias',
    matcher: new RegExp('^align-((?:\\d+\\.?\\d*|\\d*\\.\\d+)(?:%|px|r?em|ex|ch|vh|vw|vmin|vmax|svh|svw|lvh|lvw|dvh|dvw|cm|mm|in|pt|pc))$'),
    input: 'align-10px',
    prefixed: 'tw-align-10px',
    replacement: 'align-[10px]',
  },
  {
    label: 'stroke width alias',
    matcher: /^stroke-(?:width|size)-(.+)$/,
    input: 'stroke-width-2',
    prefixed: 'tw-stroke-width-2',
    replacement: 'stroke-2',
  },
  {
    label: 'stroke size alias',
    matcher: /^stroke-(?:width|size)-(.+)$/,
    input: 'stroke-size-2',
    prefixed: 'tw-stroke-size-2',
    replacement: 'stroke-2',
  },
  {
    label: 'stroke hex alias',
    matcher: new RegExp('^(text|bg|fill|stroke|accent|caret)-(#(?:[\\da-fA-F]{3,4}|[\\da-fA-F]{6}|[\\da-fA-F]{8}))$'),
    input: 'stroke-#fff',
    prefixed: 'tw-stroke-#fff',
    replacement: 'stroke-[#fff]',
  },
  {
    label: 'border shorthand width alias',
    matcher: /^b-(.+)$/,
    input: 'b-2',
    prefixed: 'tw-b-2',
    replacement: 'border-2',
  },
  {
    label: 'border shorthand color alias',
    matcher: /^b-(.+)$/,
    input: 'b-red-500',
    prefixed: 'tw-b-red-500',
    replacement: 'border-red-500',
  },
  {
    label: 'rounded shorthand alias',
    matcher: /^rd-(.+)$/,
    input: 'rd-md',
    prefixed: 'tw-rd-md',
    replacement: 'rounded-md',
  },
  {
    label: 'font weight shorthand alias',
    matcher: /^fw-(.+)$/,
    input: 'fw-bold',
    prefixed: 'tw-fw-bold',
    replacement: 'font-bold',
  },
  {
    label: 'font numeric weight alias',
    matcher: /^font-(\d+)$/,
    input: 'font-650',
    prefixed: 'tw-font-650',
    replacement: 'font-[650]',
  },
  {
    label: 'position alias',
    matcher: /^pos-(relative|absolute|fixed|sticky|static)$/,
    input: 'pos-absolute',
    prefixed: 'tw-pos-absolute',
    replacement: 'absolute',
  },
  {
    label: 'opacity shorthand alias',
    matcher: /^op(\d+)$/,
    input: 'op50',
    prefixed: 'tw-op50',
    replacement: 'opacity-50',
  },
  {
    label: 'background opacity alias',
    matcher: /^bg-op-?(\d+)$/,
    input: 'bg-op50',
    prefixed: 'tw-bg-op50',
    replacement: 'bg-opacity-50',
  },
  {
    label: 'background opacity alias with dash',
    matcher: /^bg-op-?(\d+)$/,
    input: 'bg-op-50',
    prefixed: 'tw-bg-op-50',
    replacement: 'bg-opacity-50',
  },
  {
    label: 'border opacity alias',
    matcher: /^border-op(\d+)$/,
    input: 'border-op50',
    prefixed: 'tw-border-op50',
    replacement: 'border-opacity-50',
  },
  {
    label: 'ring opacity alias',
    matcher: /^ring-op(\d+)$/,
    input: 'ring-op50',
    prefixed: 'tw-ring-op50',
    replacement: 'ring-opacity-50',
  },
  {
    label: 'ring width alias',
    matcher: /^ring-(?:width|size)-(.+)$/,
    input: 'ring-width-2',
    prefixed: 'tw-ring-width-2',
    replacement: 'ring-2',
  },
  {
    label: 'ring size alias',
    matcher: /^ring-(?:width|size)-(.+)$/,
    input: 'ring-size-2',
    prefixed: 'tw-ring-size-2',
    replacement: 'ring-2',
  },
  {
    label: 'divide compact axis alias',
    matcher: /^divide([xy])$/,
    input: 'dividex',
    prefixed: 'tw-dividex',
    replacement: 'divide-x',
  },
  {
    label: 'divide compact axis width alias',
    matcher: /^divide([xy])(\d+(?:\.\d+)?)$/,
    input: 'dividey2',
    prefixed: 'tw-dividey2',
    replacement: 'divide-y-2',
  },
  {
    label: 'divide opacity alias',
    matcher: /^divide-op(\d+)$/,
    input: 'divide-op50',
    prefixed: 'tw-divide-op50',
    replacement: 'divide-opacity-50',
  },
  {
    label: 'shadow compact theme alias',
    matcher: /^shadowmd$/,
    input: 'shadowmd',
    prefixed: 'tw-shadowmd',
    replacement: 'shadow-md',
  },
  {
    label: 'shadow inset alias',
    matcher: /^shadow-inset$/,
    input: 'shadow-inset',
    prefixed: 'tw-shadow-inset',
    replacement: 'shadow-inner',
  },
  {
    label: 'decoration none alias',
    matcher: /^decoration-none$/,
    input: 'decoration-none',
    prefixed: 'tw-decoration-none',
    replacement: 'no-underline',
  },
  {
    label: 'decoration underline alias',
    matcher: /^decoration-underline$/,
    input: 'decoration-underline',
    prefixed: 'tw-decoration-underline',
    replacement: 'underline',
  },
  {
    label: 'decoration overline alias',
    matcher: /^decoration-overline$/,
    input: 'decoration-overline',
    prefixed: 'tw-decoration-overline',
    replacement: 'overline',
  },
  {
    label: 'decoration line-through alias',
    matcher: /^decoration-line-through$/,
    input: 'decoration-line-through',
    prefixed: 'tw-decoration-line-through',
    replacement: 'line-through',
  },
  {
    label: 'text-indent numeric alias',
    matcher: /^(text-indent)-(px|\d+(?:\.\d+)?)$/,
    input: 'text-indent-4',
    prefixed: 'tw-text-indent-4',
    replacement: 'indent-4',
  },
  {
    label: 'text-indent arbitrary alias',
    matcher: /^(text-indent)-(\[.+\])$/,
    input: 'text-indent-[10px]',
    prefixed: 'tw-text-indent-[10px]',
    replacement: 'indent-[10px]',
  },
  {
    label: 'text-indent bare length alias',
    matcher: new RegExp('^indent-((?:\\d+\\.?\\d*|\\d*\\.\\d+)(?:%|px|r?em|ex|ch|vh|vw|vmin|vmax|svh|svw|lvh|lvw|dvh|dvw|cm|mm|in|pt|pc)|(?:var|calc|min|max|clamp)\\(.+\\))$'),
    input: 'indent-10px',
    prefixed: 'tw-indent-10px',
    replacement: 'indent-[10px]',
  },
  {
    label: 'text-truncate alias',
    matcher: /^text-truncate$/,
    input: 'text-truncate',
    prefixed: 'tw-text-truncate',
    replacement: 'truncate',
  },
  {
    label: 'text-transform uppercase alias',
    matcher: /^case-upper$/,
    input: 'case-upper',
    prefixed: 'tw-case-upper',
    replacement: 'uppercase',
  },
  {
    label: 'text-transform lowercase alias',
    matcher: /^case-lower$/,
    input: 'case-lower',
    prefixed: 'tw-case-lower',
    replacement: 'lowercase',
  },
  {
    label: 'text-transform capitalize alias',
    matcher: /^case-capital$/,
    input: 'case-capital',
    prefixed: 'tw-case-capital',
    replacement: 'capitalize',
  },
  {
    label: 'text-transform normal-case alias',
    matcher: /^case-normal$/,
    input: 'case-normal',
    prefixed: 'tw-case-normal',
    replacement: 'normal-case',
  },
  {
    label: 'tab-size default alias',
    matcher: /^tab$/,
    input: 'tab',
    prefixed: 'tw-tab',
    replacement: '[tab-size:4]',
  },
  {
    label: 'tab-size numeric alias',
    matcher: /^tab-(\d+(?:\.\d+)?)$/,
    input: 'tab-8',
    prefixed: 'tw-tab-8',
    replacement: '[tab-size:8]',
  },
  {
    label: 'tab-size arbitrary alias',
    matcher: /^tab-(\[.+\])$/,
    input: 'tab-[var(--n)]',
    prefixed: 'tw-tab-[var(--n)]',
    replacement: '[tab-size:var(--n)]',
  },
  {
    label: 'text-shadow none alias',
    matcher: /^text-shadow-none$/,
    input: 'text-shadow-none',
    prefixed: 'tw-text-shadow-none',
    replacement: '[text-shadow:0_0_#0000]',
  },
  {
    label: 'text-shadow arbitrary alias',
    matcher: /^text-shadow-\[(.+_.+)\]$/,
    input: 'text-shadow-[0_0_#000]',
    prefixed: 'tw-text-shadow-[0_0_#000]',
    replacement: '[text-shadow:0_0_#000]',
  },
  {
    label: 'text-shadow arbitrary var alias',
    matcher: /^text-shadow-\[(.+_.+)\]$/,
    input: 'text-shadow-[0_0_10px_var(--x)]',
    prefixed: 'tw-text-shadow-[0_0_10px_var(--x)]',
    replacement: '[text-shadow:0_0_10px_var(--x)]',
  },
  {
    label: 'line-clamp zero alias',
    matcher: /^line-clamp-0$/,
    input: 'line-clamp-0',
    prefixed: 'tw-line-clamp-0',
    replacement: 'line-clamp-[0]',
  },
  {
    label: 'line-clamp global keyword alias',
    matcher: /^line-clamp-(inherit|initial|unset|revert|revert-layer)$/,
    input: 'line-clamp-inherit',
    prefixed: 'tw-line-clamp-inherit',
    replacement: 'line-clamp-[inherit]',
  },
  {
    label: 'line-clamp revert-layer alias',
    matcher: /^line-clamp-(inherit|initial|unset|revert|revert-layer)$/,
    input: 'line-clamp-revert-layer',
    prefixed: 'tw-line-clamp-revert-layer',
    replacement: 'line-clamp-[revert-layer]',
  },
  {
    label: 'font-variant-numeric normal alias',
    matcher: /^nums-normal$/,
    input: 'nums-normal',
    prefixed: 'tw-nums-normal',
    replacement: 'normal-nums',
  },
  {
    label: 'font-variant-numeric numeric alias',
    matcher: /^numeric-(ordinal|slashed-zero|lining|oldstyle|proportional|tabular)$/,
    input: 'numeric-ordinal',
    prefixed: 'tw-numeric-ordinal',
    replacement: 'ordinal',
  },
  {
    label: 'font-variant-numeric fractions alias',
    matcher: /^fractions-(diagonal|stacked)$/,
    input: 'fractions-diagonal',
    prefixed: 'tw-fractions-diagonal',
    replacement: 'diagonal-fractions',
  },
  {
    label: 'text-stroke default alias',
    matcher: /^text-stroke$/,
    input: 'text-stroke',
    prefixed: 'tw-text-stroke',
    replacement: '[-webkit-text-stroke-width:1.5rem]',
  },
  {
    label: 'text-stroke numeric width alias',
    matcher: /^text-stroke-(\d+(?:\.\d+)?)$/,
    input: 'text-stroke-2',
    prefixed: 'tw-text-stroke-2',
    replacement: '[-webkit-text-stroke-width:2px]',
  },
  {
    label: 'text-stroke keyword width alias',
    matcher: /^text-stroke-(none|sm|md|lg)$/,
    input: 'text-stroke-lg',
    prefixed: 'tw-text-stroke-lg',
    replacement: '[-webkit-text-stroke-width:thick]',
  },
  {
    label: 'text-stroke hex arbitrary color alias',
    matcher: new RegExp('^text-stroke-\\[(#(?:[\\da-fA-F]{3,4}|[\\da-fA-F]{6}|[\\da-fA-F]{8}))\\]$'),
    input: 'text-stroke-[#fff]',
    prefixed: 'tw-text-stroke-[#fff]',
    replacement: '[-webkit-text-stroke-color:#fff]',
  },
  {
    label: 'text-stroke arbitrary length alias',
    matcher: new RegExp('^text-stroke-\\[(?:length:)?((?:\\d+\\.?\\d*|\\d*\\.\\d+)(?:%|px|r?em|ex|ch|vh|vw|vmin|vmax|svh|svw|lvh|lvw|dvh|dvw|cm|mm|in|pt|pc)|(?:var|calc|min|max|clamp)\\(.+\\))\\]$'),
    input: 'text-stroke-[length:var(--stroke)]',
    prefixed: 'tw-text-stroke-[length:var(--stroke)]',
    replacement: '[-webkit-text-stroke-width:var(--stroke)]',
  },
  {
    label: 'decoration offset alias',
    matcher: /^decoration-offset-(.+)$/,
    input: 'decoration-offset-4',
    prefixed: 'tw-decoration-offset-4',
    replacement: 'underline-offset-4',
  },
  {
    label: 'underline style alias',
    matcher: /^underline-(auto|solid|double|dotted|dashed|wavy)$/,
    input: 'underline-dashed',
    prefixed: 'tw-underline-dashed',
    replacement: 'decoration-dashed',
  },
  {
    label: 'underline thickness alias',
    matcher: /^underline-(\d+(?:\.\d+)?)$/,
    input: 'underline-2',
    prefixed: 'tw-underline-2',
    replacement: 'decoration-2',
  },
  {
    label: 'underline arbitrary thickness alias',
    matcher: /^underline-(\[.+\])$/,
    input: 'underline-[3px]',
    prefixed: 'tw-underline-[3px]',
    replacement: 'decoration-[3px]',
  },
  {
    label: 'border color legacy prefix',
    matcher: /^border((?:-[a-z]{1,2})?)-color-(.+)$/,
    input: 'border-color-red-500',
    prefixed: 'tw-border-color-red-500',
    replacement: 'border-red-500',
  },
  {
    label: 'border side color legacy prefix',
    matcher: /^border((?:-[a-z]{1,2})?)-color-(.+)$/,
    input: 'border-s-color-red-500',
    prefixed: 'tw-border-s-color-red-500',
    replacement: 'border-s-red-500',
  },
  {
    label: 'outline color legacy prefix',
    matcher: /^outline-color-(.+)$/,
    input: 'outline-color-red-500',
    prefixed: 'tw-outline-color-red-500',
    replacement: 'outline-red-500',
  },
  {
    label: 'outline width legacy prefix',
    matcher: /^outline-width-(.+)$/,
    input: 'outline-width-2',
    prefixed: 'tw-outline-width-2',
    replacement: 'outline-2',
  },
  {
    label: 'outline style legacy prefix',
    matcher: /^outline-style-(.+)$/,
    input: 'outline-style-dashed',
    prefixed: 'tw-outline-style-dashed',
    replacement: 'outline-dashed',
  },
  {
    label: 'transition property alias',
    matcher: /^(?:property|transition-property)-(none|all|colors|opacity|shadow|transform)$/,
    input: 'property-opacity',
    prefixed: 'tw-property-opacity',
    replacement: 'transition-opacity',
  },
  {
    label: 'transition property long alias',
    matcher: /^(?:property|transition-property)-(none|all|colors|opacity|shadow|transform)$/,
    input: 'transition-property-shadow',
    prefixed: 'tw-transition-property-shadow',
    replacement: 'transition-shadow',
  },
  {
    label: 'transition delay legacy prefix',
    matcher: /^transition-delay-(.+)$/,
    input: 'transition-delay-75',
    prefixed: 'tw-transition-delay-75',
    replacement: 'delay-75',
  },
  {
    label: 'transition delay arbitrary legacy prefix',
    matcher: /^transition-delay-(.+)$/,
    input: 'transition-delay-[120ms]',
    prefixed: 'tw-transition-delay-[120ms]',
    replacement: 'delay-[120ms]',
  },
  {
    label: 'transition ease legacy prefix',
    matcher: /^transition-ease-(.+)$/,
    input: 'transition-ease-linear',
    prefixed: 'tw-transition-ease-linear',
    replacement: 'ease-linear',
  },
  {
    label: 'transition ease alternative legacy prefix',
    matcher: /^transition-ease-(.+)$/,
    input: 'transition-ease-in-out',
    prefixed: 'tw-transition-ease-in-out',
    replacement: 'ease-in-out',
  },
]

const rawFixtures: RawFixture[] = [
  { label: 'compact width shorthand', matcher: /^(?:w|h)\d\S*$/, input: 'w4', prefixed: 'tw-w4' },
  { label: 'compact height shorthand', matcher: /^(?:w|h)\d\S*$/, input: 'h10', prefixed: 'tw-h10' },
  { label: 'compact min width shorthand', matcher: /^(?:min|max)[wh]\S*$/, input: 'minw0', prefixed: 'tw-minw0' },
  { label: 'compact max height shorthand', matcher: /^(?:min|max)[wh]\S*$/, input: 'maxhfull', prefixed: 'tw-maxhfull' },
  { label: 'legacy size axis shorthand', matcher: /^size-[wh]-\S+$/, input: 'size-w-4', prefixed: 'tw-size-w-4' },
  { label: 'compact padding shorthand', matcher: /^-?(?:m|p)[trblxy]?\d\S*$/, input: 'p4', prefixed: 'tw-p4' },
  { label: 'compact negative margin shorthand', matcher: /^-?(?:m|p)[trblxy]?\d\S*$/, input: '-mx4', prefixed: 'tw--mx4' },
  { label: 'legacy spacing directional shorthand', matcher: /^-?(?:m|p)-[trblxy]-\S+$/, input: 'p-x-4', prefixed: 'tw-p-x-4' },
  { label: 'legacy negative spacing directional shorthand', matcher: /^-?(?:m|p)-[trblxy]-\S+$/, input: '-m-y-2', prefixed: 'tw--m-y-2' },
  { label: 'compact gap shorthand', matcher: /^gap\d\S*$/, input: 'gap4', prefixed: 'tw-gap4' },
  { label: 'compact gap axis shorthand', matcher: /^gap[xy]\d\S*$/, input: 'gapx2', prefixed: 'tw-gapx2' },
  { label: 'legacy gap axis shorthand', matcher: /^gap[xy]-\S+$/, input: 'gapx-2', prefixed: 'tw-gapx-2' },
  { label: 'compact divide shorthand', matcher: /^divide[xy]\S*$/, input: 'dividex', prefixed: 'tw-dividex' },
  { label: 'compact scroll spacing shorthand', matcher: /^scroll[mp]\S*$/, input: 'scrollm4', prefixed: 'tw-scrollm4' },
  { label: 'legacy keyframes alias', matcher: /^keyframes-\S+$/, input: 'keyframes-spin', prefixed: 'tw-keyframes-spin' },
  { label: 'legacy animate name alias', matcher: /^animate-name-\S+$/, input: 'animate-name-wiggle', prefixed: 'tw-animate-name-wiggle' },
  { label: 'legacy animate duration alias', matcher: /^animate-(?:duration|delay|ease)-\S+$/, input: 'animate-duration-500', prefixed: 'tw-animate-duration-500' },
  { label: 'legacy animate delay alias', matcher: /^animate-(?:duration|delay|ease)-\S+$/, input: 'animate-delay-75', prefixed: 'tw-animate-delay-75' },
  { label: 'legacy animate ease alias', matcher: /^animate-(?:duration|delay|ease)-\S+$/, input: 'animate-ease-linear', prefixed: 'tw-animate-ease-linear' },
  { label: 'legacy animate fill alias', matcher: /^animate-(?:fill(?:-mode)?|mode)-\S+$/, input: 'animate-fill-forwards', prefixed: 'tw-animate-fill-forwards' },
  { label: 'legacy animate mode alias', matcher: /^animate-(?:fill(?:-mode)?|mode)-\S+$/, input: 'animate-mode-both', prefixed: 'tw-animate-mode-both' },
  { label: 'legacy animate direction alias', matcher: /^animate-direction-\S+$/, input: 'animate-direction-reverse', prefixed: 'tw-animate-direction-reverse' },
  { label: 'legacy animate iteration alias', matcher: /^animate-(?:iteration-count|iteration|count)-\S+$/, input: 'animate-iteration-count-infinite', prefixed: 'tw-animate-iteration-count-infinite' },
  { label: 'legacy animate count alias', matcher: /^animate-(?:iteration-count|iteration|count)-\S+$/, input: 'animate-count-infinite', prefixed: 'tw-animate-count-infinite' },
  { label: 'legacy animate play alias', matcher: /^animate-(?:play-state|play|state)-\S+$/, input: 'animate-play-paused', prefixed: 'tw-animate-play-paused' },
  { label: 'legacy animate state alias', matcher: /^animate-(?:play-state|play|state)-\S+$/, input: 'animate-state-paused', prefixed: 'tw-animate-state-paused' },
  { label: 'legacy gradient shape', matcher: /^bg-gradient-(?:repeating-)?(?:linear|radial|conic)$/, input: 'bg-gradient-linear', prefixed: 'tw-bg-gradient-linear' },
  { label: 'legacy repeating gradient shape', matcher: /^bg-gradient-(?:repeating-)?(?:linear|radial|conic)$/, input: 'bg-gradient-repeating-radial', prefixed: 'tw-bg-gradient-repeating-radial' },
  { label: 'legacy gradient from alias', matcher: /^bg-gradient-(?:from|via)-.+$/, input: 'bg-gradient-from-red-500', prefixed: 'tw-bg-gradient-from-red-500' },
  { label: 'legacy gradient via alias', matcher: /^bg-gradient-(?:from|via)-.+$/, input: 'bg-gradient-via-cyan-500', prefixed: 'tw-bg-gradient-via-cyan-500' },
  { label: 'legacy invalid gradient direction alias', matcher: /^bg-gradient-to-(?![rltb]{1,2}$).+$/, input: 'bg-gradient-to-emerald-500', prefixed: 'tw-bg-gradient-to-emerald-500' },
  { label: 'legacy gradient shape modifier', matcher: /^bg-gradient-shape-.+$/, input: 'bg-gradient-shape-r', prefixed: 'tw-bg-gradient-shape-r' },
  { label: 'legacy gradient stops modifier', matcher: /^bg-gradient-stops-.+$/, input: 'bg-gradient-stops-3', prefixed: 'tw-bg-gradient-stops-3' },
  { label: 'legacy shape alias', matcher: /^shape-.+$/, input: 'shape-r', prefixed: 'tw-shape-r' },
  { label: 'compact font shorthand', matcher: /^font(?!-|\[)\S+$/, input: 'fontbold', prefixed: 'tw-fontbold' },
  { label: 'legacy overflow alias', matcher: /^of-.+$/, input: 'of-hidden', prefixed: 'tw-of-hidden' },
  { label: 'legacy text-shadow family', matcher: /^text-shadow(?:-color)?(?:-.+)?$/, input: 'text-shadow-color-red-500', prefixed: 'tw-text-shadow-color-red-500' },
  { label: 'legacy text-stroke family', matcher: /^text-stroke(?:-.+)?$/, input: 'text-stroke-red-500', prefixed: 'tw-text-stroke-red-500' },
  { label: 'compact z-index shorthand', matcher: /^z\d\S*$/, input: 'z10', prefixed: 'tw-z10' },
  { label: 'legacy inline flex alias', matcher: /^flex-inline$/, input: 'flex-inline', prefixed: 'tw-flex-inline' },
  { label: 'legacy basis alias', matcher: /^flex-basis-.+$/, input: 'flex-basis-10px', prefixed: 'tw-flex-basis-10px' },
  { label: 'legacy flex grow alias', matcher: /^flex-grow-(?!0$).+$/, input: 'flex-grow-2', prefixed: 'tw-flex-grow-2' },
  { label: 'legacy flex shrink alias', matcher: /^flex-shrink-(?!0$).+$/, input: 'flex-shrink-2', prefixed: 'tw-flex-shrink-2' },
  { label: 'legacy grid flow alias', matcher: /^auto-flow-.+$/, input: 'auto-flow-row', prefixed: 'tw-auto-flow-row' },
  { label: 'legacy grid rows alias', matcher: /^(?:cols|rows)-.+$/, input: 'rows-2', prefixed: 'tw-rows-2' },
  { label: 'legacy grid cols alias', matcher: /^(?:cols|rows)-.+$/, input: 'cols-2', prefixed: 'tw-cols-2' },
  { label: 'legacy filter alias', matcher: /^filter-(?:blur|brightness|contrast|drop-shadow|grayscale|hue-rotate|invert|saturate|sepia)(?:-.+)?$/, input: 'filter-blur-sm', prefixed: 'tw-filter-blur-sm' },
  { label: 'legacy filter alias variant', matcher: /^filter-(?:blur|brightness|contrast|drop-shadow|grayscale|hue-rotate|invert|saturate|sepia)(?:-.+)?$/, input: 'filter-drop-shadow', prefixed: 'tw-filter-drop-shadow' },
  { label: 'legacy drop shadow color alias', matcher: /^drop-shadow-color(?:-.+)?$/, input: 'drop-shadow-color-red-500', prefixed: 'tw-drop-shadow-color-red-500' },
  { label: 'legacy transform rotate alias', matcher: /^transform-rotate-.+$/, input: 'transform-rotate-45', prefixed: 'tw-transform-rotate-45' },
  { label: 'legacy transform origin alias', matcher: /^transform-origin-.+$/, input: 'transform-origin-top-right', prefixed: 'tw-transform-origin-top-right' },
  { label: 'legacy perspective alias', matcher: /^perspective(?:-origin)?-.+$/, input: 'perspective-1000px', prefixed: 'tw-perspective-1000px' },
  { label: 'legacy perspective origin alias', matcher: /^perspective(?:-origin)?-.+$/, input: 'perspective-origin-center', prefixed: 'tw-perspective-origin-center' },
  { label: 'legacy preserve alias', matcher: /^preserve-(?:3d|flat)$/, input: 'preserve-3d', prefixed: 'tw-preserve-3d' },
  { label: 'raw arbitrary size value', matcher: new RegExp('^(?:size|(?:min|max)-[wh]|[wh])-(?:(?:\\d+\\.?\\d*|\\d*\\.\\d+)(?:%|px|r?em|ex|ch|vh|vw|vmin|vmax|svh|svw|lvh|lvw|dvh|dvw|cm|mm|in|pt|pc)|(?:var|calc|min|max|clamp)\\(.+\\))$'), input: 'w-100px', prefixed: 'tw-w-100px' },
  { label: 'raw arbitrary spacing value', matcher: new RegExp('^-?(?:m|p)(?:[trblxy]|[se]|[bi][se]|block|inline)?-(?:(?:\\d+\\.?\\d*|\\d*\\.\\d+)(?:%|px|r?em|ex|ch|vh|vw|vmin|vmax|svh|svw|lvh|lvw|dvh|dvw|cm|mm|in|pt|pc)|(?:var|calc|min|max|clamp)\\(.+\\))$'), input: 'p-2rem', prefixed: 'tw-p-2rem' },
  { label: 'raw arbitrary gap value', matcher: new RegExp('^(?:flex-|grid-)?gap(?:-[xy]|-(?:col|row))?-(?:(?:\\d+\\.?\\d*|\\d*\\.\\d+)(?:%|px|r?em|ex|ch|vh|vw|vmin|vmax|svh|svw|lvh|lvw|dvh|dvw|cm|mm|in|pt|pc)|(?:var|calc|min|max|clamp)\\(.+\\))$'), input: 'gap-3px', prefixed: 'tw-gap-3px' },
  { label: 'raw arbitrary inset value', matcher: new RegExp('^-?(?:inset(?:-[xy]|-(?:block|inline)|-[rltbse]|-[bi][se])?|(?:top|right|bottom|left|start|end))-(?:(?:\\d+\\.?\\d*|\\d*\\.\\d+)(?:%|px|r?em|ex|ch|vh|vw|vmin|vmax|svh|svw|lvh|lvw|dvh|dvw|cm|mm|in|pt|pc)|(?:var|calc|min|max|clamp)\\(.+\\))$'), input: 'inset-5px', prefixed: 'tw-inset-5px' },
  { label: 'raw arbitrary translate value', matcher: new RegExp('^-?translate-(?:[xyz]-)?(?:(?:\\d+\\.?\\d*|\\d*\\.\\d+)(?:%|px|r?em|ex|ch|vh|vw|vmin|vmax|svh|svw|lvh|lvw|dvh|dvw|cm|mm|in|pt|pc)|(?:var|calc|min|max|clamp)\\(.+\\))$'), input: 'translate-x-12px', prefixed: 'tw-translate-x-12px' },
  { label: 'raw arbitrary scroll spacing value', matcher: new RegExp('^scroll-[mp](?:[trblxy]|[se]|[bi][se])?-(?:(?:\\d+\\.?\\d*|\\d*\\.\\d+)(?:%|px|r?em|ex|ch|vh|vw|vmin|vmax|svh|svw|lvh|lvw|dvh|dvw|cm|mm|in|pt|pc)|(?:var|calc|min|max|clamp)\\(.+\\))$'), input: 'scroll-m-2rem', prefixed: 'tw-scroll-m-2rem' },
]

const allowFixtures: AllowFixture[] = [
  { label: 'border canonical', input: 'border-2', prefixed: 'tw-border-2' },
  { label: 'rounded canonical', input: 'rounded-md', prefixed: 'tw-rounded-md' },
  { label: 'position canonical', input: 'absolute', prefixed: 'tw-absolute' },
  { label: 'opacity canonical', input: 'opacity-50', prefixed: 'tw-opacity-50' },
  { label: 'text canonical', input: 'text-sm', prefixed: 'tw-text-sm' },
  { label: 'leading canonical', input: 'leading-6', prefixed: 'tw-leading-6' },
  { label: 'tracking canonical', input: 'tracking-wide', prefixed: 'tw-tracking-wide' },
  { label: 'stroke canonical', input: 'stroke-2', prefixed: 'tw-stroke-2' },
  { label: 'bg opacity canonical', input: 'bg-opacity-50', prefixed: 'tw-bg-opacity-50' },
  { label: 'decoration canonical', input: 'decoration-dashed', prefixed: 'tw-decoration-dashed' },
  { label: 'underline canonical', input: 'underline', prefixed: 'tw-underline' },
  { label: 'underline offset canonical', input: 'underline-offset-4', prefixed: 'tw-underline-offset-4' },
  { label: 'text-indent canonical', input: 'indent-4', prefixed: 'tw-indent-4' },
  { label: 'text-wrap canonical', input: 'text-wrap', prefixed: 'tw-text-wrap' },
  { label: 'uppercase canonical', input: 'uppercase', prefixed: 'tw-uppercase' },
  { label: 'tab-size arbitrary canonical', input: '[tab-size:4]', prefixed: 'tw-[tab-size:4]' },
  { label: 'line-clamp arbitrary canonical', input: 'line-clamp-[inherit]', prefixed: 'tw-line-clamp-[inherit]' },
  { label: 'font-variant-numeric canonical', input: 'tabular-nums', prefixed: 'tw-tabular-nums' },
  { label: 'text-shadow arbitrary canonical', input: '[text-shadow:0_0_#000]', prefixed: 'tw-[text-shadow:0_0_#000]' },
  { label: 'text-stroke arbitrary width canonical', input: '[-webkit-text-stroke-width:2px]', prefixed: 'tw-[-webkit-text-stroke-width:2px]' },
  { label: 'delay canonical', input: 'delay-75', prefixed: 'tw-delay-75' },
  { label: 'ease canonical', input: 'ease-linear', prefixed: 'tw-ease-linear' },
  { label: 'width canonical', input: 'w-4', prefixed: 'tw-w-4' },
  { label: 'padding canonical', input: 'p-4', prefixed: 'tw-p-4' },
  { label: 'divide canonical', input: 'divide-x', prefixed: 'tw-divide-x' },
  { label: 'animation canonical', input: 'animate-spin', prefixed: 'tw-animate-spin' },
  { label: 'gradient canonical', input: 'bg-gradient-to-r', prefixed: 'tw-bg-gradient-to-r' },
]

describe('preset-tailwind3 blocklist prefix audit', () => {
  it('covers every base migration and raw blocklist rule with fixtures', () => {
    const baseRules = createBlocklist()
    const baseMigrationKeys = new Set(baseRules.filter(Array.isArray).map(fixtureKey))
    const baseRawKeys = new Set(baseRules.filter(rule => !Array.isArray(rule)).map(fixtureKey))

    const migrationFixtureKeys = new Set(migrationFixtures.map(({ matcher }) => ruleKey(matcher)))
    const rawFixtureKeys = new Set(rawFixtures.map(({ matcher }) => ruleKey(matcher)))

    expect(migrationFixtureKeys).toEqual(baseMigrationKeys)
    expect(rawFixtureKeys).toEqual(baseRawKeys)
  })

  it('blocks every migration fixture in zh-CN with and without prefix', async () => {
    for (const fixture of migrationFixtures) {
      await expectBlockedMessage(fixture.input, zhMessage(fixture.input, fixture.replacement))
      await expectBlockedMessage(
        fixture.prefixed,
        zhMessage(fixture.prefixed, `tw-${fixture.replacement}`),
        { prefix: 'tw-' },
      )
    }
  })

  it('supports english messages for representative prefixed and unprefixed migration fixtures', async () => {
    const samples = [
      migrationFixtures.find(({ input }) => input === 'b-2')!,
      migrationFixtures.find(({ input }) => input === 'color-#fff')!,
      migrationFixtures.find(({ input }) => input === 'transition-delay-[120ms]')!,
    ]

    for (const fixture of samples) {
      await expectBlockedMessage(
        fixture.input,
        enMessage(fixture.input, fixture.replacement),
        { locale: 'en' },
      )
      await expectBlockedMessage(
        fixture.prefixed,
        enMessage(fixture.prefixed, `tw-${fixture.replacement}`),
        { prefix: 'tw-', locale: 'en' },
      )
    }
  })

  it('blocks every raw blocklist fixture with and without prefix', async () => {
    for (const fixture of rawFixtures) {
      await expectBlocked(fixture.input)
      await expectBlocked(fixture.prefixed, { prefix: 'tw-' })
    }
  })

  it('does not block canonical allow-list samples with and without prefix', async () => {
    for (const fixture of allowFixtures) {
      await expectNotBlocked(fixture.input)
      await expectNotBlocked(fixture.prefixed, { prefix: 'tw-' })
    }
  })
})
