import type { BlocklistRule } from '@unocss/core'
import { escapeRegExp } from '@unocss/core'

const rawLengthUnit = String.raw`(?:%|px|r?em|ex|ch|vh|vw|vmin|vmax|svh|svw|lvh|lvw|dvh|dvw|cm|mm|in|pt|pc)`
const rawLengthValue = String.raw`(?:\d+\.?\d*|\d*\.\d+)${rawLengthUnit}`
const rawCssFunctionValue = String.raw`(?:var|calc|min|max|clamp)\(.+\)`
const rawArbitraryValue = String.raw`(?:${rawLengthValue}|${rawCssFunctionValue})`
const rawHexColor = String.raw`#(?:[\da-fA-F]{3,4}|[\da-fA-F]{6}|[\da-fA-F]{8})`

export type BlocklistLocale = 'zh-CN' | 'en'

export interface CreateBlocklistOptions {
  locale?: BlocklistLocale
}

function legacyMessage(selector: string, replacement: string, locale: BlocklistLocale = 'zh-CN') {
  if (locale === 'en')
    return `Legacy class "${selector}" is disabled. Use "${replacement}" instead.`
  return `旧写法 "${selector}" 已禁用，请改为 "${replacement}"`
}

type MigrationReplacement = (selector: string, match: RegExpMatchArray) => string

interface MigrationDescriptor {
  matcher: RegExp
  replacement: MigrationReplacement
}

const gapAxisMap: Record<string, string> = {
  row: 'y',
  col: 'x',
}

const insetLegacyDirectionMap: Record<string, string> = {
  t: 'top',
  r: 'right',
  b: 'bottom',
  l: 'left',
  s: 'start',
  e: 'end',
}

function migrationRule(
  matcher: RegExp,
  replacement: MigrationReplacement,
  locale: BlocklistLocale,
): BlocklistRule {
  return [
    matcher,
    {
      message: (selector) => {
        const match = selector.match(matcher)
        return legacyMessage(selector, match ? replacement(selector, match) : selector, locale)
      },
    },
  ]
}

function prefixedMigrationRule(
  matcher: RegExp,
  replacement: MigrationReplacement,
  prefix: string,
  locale: BlocklistLocale,
): BlocklistRule {
  const prefixedMatcher = new RegExp(`^${escapeRegExp(prefix)}${matcher.source.replace(/^\^/, '')}`, matcher.flags)

  return [
    prefixedMatcher,
    {
      message: (selector) => {
        const unprefixedSelector = selector.startsWith(prefix)
          ? selector.slice(prefix.length)
          : selector
        const match = unprefixedSelector.match(matcher)
        const suggested = match
          ? replacement(unprefixedSelector, match)
          : unprefixedSelector
        return legacyMessage(selector, `${prefix}${suggested}`, locale)
      },
    },
  ]
}

function prefixedRawRule(
  matcher: RegExp,
  prefix: string,
): BlocklistRule {
  return new RegExp(`^${escapeRegExp(prefix)}${matcher.source.replace(/^\^/, '')}`, matcher.flags)
}

const migrationDescriptors: MigrationDescriptor[] = [
  { matcher: new RegExp(`^color-(${rawHexColor})$`), replacement: (_, match) => `[color:${match[1]}]` },
  { matcher: new RegExp(`^c-(${rawHexColor})$`), replacement: (_, match) => `text-[${match[1]}]` },
  { matcher: new RegExp(`^(text|bg|fill|stroke|accent|caret)-(${rawHexColor})$`), replacement: (_, match) => `${match[1]}-[${match[2]}]` },
  { matcher: /^gap(\d+(?:\.\d+)?)$/, replacement: (_, match) => `gap-${match[1]}` },
  { matcher: /^gap([xy])(\d+(?:\.\d+)?)$/, replacement: (_, match) => `gap-${match[1]}-${match[2]}` },
  { matcher: /^gap([xy])-(.+)$/, replacement: (_, match) => `gap-${match[1]}-${match[2]}` },
  { matcher: /^gap-(row|col)-(.+)$/, replacement: (_, match) => `gap-${gapAxisMap[match[1]]}-${match[2]}` },
  { matcher: new RegExp(`^gap-(${rawLengthValue}|${rawCssFunctionValue})$`), replacement: (_, match) => `gap-[${match[1]}]` },
  { matcher: /^inset([xy])-(.+)$/, replacement: (_, match) => `inset-${match[1]}-${match[2]}` },
  { matcher: /^inset([xy])(\d+(?:\.\d+)?)$/, replacement: (_, match) => `inset-${match[1]}-${match[2]}` },
  { matcher: /^inset-([trblse])-(.+)$/, replacement: (_, match) => `${insetLegacyDirectionMap[match[1]]}-${match[2]}` },
  { matcher: /^(top|right|bottom|left|start|end)(\d+(?:\.\d+)?)$/, replacement: (_, match) => `${match[1]}-${match[2]}` },
  { matcher: /^scroll([mp])-(.+)$/, replacement: (_, match) => `scroll-${match[1]}-${match[2]}` },
  { matcher: /^scroll-([mp])(\d+(?:\.\d+)?)$/, replacement: (_, match) => `scroll-${match[1]}-${match[2]}` },
  { matcher: /^scroll([mp])([xytrblse])-?(.+)$/, replacement: (_, match) => `scroll-${match[1]}${match[2]}-${match[3]}` },
  { matcher: /^scroll-([mp])a-(.+)$/, replacement: (_, match) => `scroll-${match[1]}-${match[2]}` },
  { matcher: /^scroll-([mp])-([se])-(.+)$/, replacement: (_, match) => `scroll-${match[1]}${match[2]}-${match[3]}` },
  { matcher: new RegExp(`^scroll-([mp])-(${rawLengthValue}|${rawCssFunctionValue})$`), replacement: (_, match) => `scroll-${match[1]}-[${match[2]}]` },
  { matcher: /^borderspacing-(.+)$/, replacement: (_, match) => `border-spacing-${match[1]}` },
  { matcher: /^border-spacing([xy])-?(.+)$/, replacement: (_, match) => `border-spacing-${match[1]}-${match[2]}` },
  { matcher: new RegExp(`^border-spacing-(${rawLengthValue}|${rawCssFunctionValue})$`), replacement: (_, match) => `border-spacing-[${match[1]}]` },
  { matcher: /^space([xy])-(.+)$/, replacement: (_, match) => `space-${match[1]}-${match[2]}` },
  { matcher: /^space([xy])(\d+(?:\.\d+)?)$/, replacement: (_, match) => `space-${match[1]}-${match[2]}` },
  { matcher: new RegExp(`^space-([xy])-(${rawLengthValue}|${rawCssFunctionValue})$`), replacement: (_, match) => `space-${match[1]}-[${match[2]}]` },
  {
    matcher: /^(-?)([mp])([trblxyse]?)(\d+(?:\.\d+)?)$/,
    replacement: (_, match) => formatCompactSpacingReplacement(match[1], match[2], match[3], match[4]),
  },
  {
    matcher: /^(-?)([mp])-([trblxyse])-([\da-z.]+)$/,
    replacement: (_, match) => formatCompactSpacingReplacement(match[1], match[2], match[3], match[4]),
  },
  {
    matcher: new RegExp(`^(-?)([mp])([trblxyse]?)-(${rawLengthValue}|${rawCssFunctionValue})$`),
    replacement: (_, match) => formatArbitrarySpacingReplacement(match[1], match[2], match[3], match[4]),
  },
  { matcher: /^text-size-(.+)$/, replacement: (_, match) => `text-${match[1]}` },
  { matcher: /^font-size-(.+)$/, replacement: (_, match) => `text-${match[1]}` },
  { matcher: new RegExp(`^text-(${rawLengthValue})$`), replacement: (_, match) => `text-[${match[1]}]` },
  { matcher: /^text-color-(.+)$/, replacement: (_, match) => `text-${match[1]}` },
  { matcher: /^lh-(.+)$/, replacement: (_, match) => `leading-${match[1]}` },
  { matcher: /^line-height-(.+)$/, replacement: (_, match) => `leading-${match[1]}` },
  { matcher: /^font-leading-(.+)$/, replacement: (_, match) => `leading-${match[1]}` },
  { matcher: new RegExp(`^leading-(${rawLengthValue})$`), replacement: (_, match) => `leading-[${match[1]}]` },
  { matcher: /^font-tracking-(.+)$/, replacement: (_, match) => `tracking-${match[1]}` },
  { matcher: new RegExp(`^tracking-(${rawLengthValue})$`), replacement: (_, match) => `tracking-[${match[1]}]` },
  { matcher: /^stroke-(?:width|size)-(.+)$/, replacement: (_, match) => `stroke-${match[1]}` },
  { matcher: /^b-(.+)$/, replacement: selector => selector.replace(/^b-/, 'border-') },
  { matcher: /^rd-(.+)$/, replacement: selector => selector.replace(/^rd-/, 'rounded-') },
  { matcher: /^fw-(.+)$/, replacement: selector => selector.replace(/^fw-/, 'font-') },
  { matcher: /^pos-(relative|absolute|fixed|sticky|static)$/, replacement: (_, match) => match[1] },
  { matcher: /^op(\d+)$/, replacement: (_, match) => `opacity-${match[1]}` },
  { matcher: /^bg-op-?(\d+)$/, replacement: (_, match) => `bg-opacity-${match[1]}` },
  { matcher: /^border-op(\d+)$/, replacement: (_, match) => `border-opacity-${match[1]}` },
  { matcher: /^ring-op(\d+)$/, replacement: (_, match) => `ring-opacity-${match[1]}` },
  { matcher: /^ring-(?:width|size)-(.+)$/, replacement: (_, match) => `ring-${match[1]}` },
  { matcher: /^border((?:-[a-z]{1,2})?)-color-(.+)$/, replacement: (_, match) => `border${match[1]}-${match[2]}` },
  { matcher: /^outline-color-(.+)$/, replacement: (_, match) => `outline-${match[1]}` },
  { matcher: /^outline-width-(.+)$/, replacement: (_, match) => `outline-${match[1]}` },
  { matcher: /^outline-style-(.+)$/, replacement: (_, match) => `outline-${match[1]}` },
  { matcher: /^(?:property|transition-property)-(none|all|colors|opacity|shadow|transform)$/, replacement: (_, match) => `transition-${match[1]}` },
  { matcher: /^transition-delay-(.+)$/, replacement: (_, match) => `delay-${match[1]}` },
  { matcher: /^transition-ease-(.+)$/, replacement: (_, match) => `ease-${match[1]}` },
]

const rawBlocklist: RegExp[] = [
  /^(?:w|h)\d\S*$/,
  /^(?:min|max)[wh]\S*$/,
  /^size-[wh]-\S+$/,
  /^-?(?:m|p)[trblxy]?\d\S*$/,
  /^-?(?:m|p)-[trblxy]-\S+$/,
  /^gap\d\S*$/,
  /^gap[xy]\d\S*$/,
  /^gap[xy]-\S+$/,
  /^divide[xy]\S*$/,
  /^scroll[mp]\S*$/,
  /^keyframes-\S+$/,
  /^animate-name-\S+$/,
  /^animate-(?:duration|delay|ease)-\S+$/,
  /^animate-(?:fill(?:-mode)?|mode)-\S+$/,
  /^animate-direction-\S+$/,
  /^animate-(?:iteration-count|iteration|count)-\S+$/,
  /^animate-(?:play-state|play|state)-\S+$/,
  /^bg-gradient-(?:repeating-)?(?:linear|radial|conic)$/,
  /^bg-gradient-(?:from|via)-.+$/,
  /^bg-gradient-to-(?![rltb]{1,2}$).+$/,
  /^bg-gradient-shape-.+$/,
  /^bg-gradient-stops-.+$/,
  /^shape-.+$/,
  /^font(?!-|\[)\S+$/,
  /^of-.+$/,
  /^z\d\S*$/,
  /^flex-inline$/,
  /^flex-basis-.+$/,
  /^flex-grow-(?!0$).+$/,
  /^flex-shrink-(?!0$).+$/,
  /^auto-flow-.+$/,
  /^(?:cols|rows)-.+$/,
  /^filter-(?:blur|brightness|contrast|drop-shadow|grayscale|hue-rotate|invert|saturate|sepia)(?:-.+)?$/,
  /^drop-shadow-color(?:-.+)?$/,
  /^transform-rotate-.+$/,
  /^transform-origin-.+$/,
  /^perspective(?:-origin)?-.+$/,
  /^preserve-(?:3d|flat)$/,
  new RegExp(`^(?:size|(?:min|max)-[wh]|[wh])-${rawArbitraryValue}$`),
  new RegExp(`^-?(?:m|p)(?:[trblxy]|[se]|[bi][se]|block|inline)?-${rawArbitraryValue}$`),
  new RegExp(`^(?:flex-|grid-)?gap(?:-[xy]|-(?:col|row))?-${rawArbitraryValue}$`),
  new RegExp(`^-?(?:inset(?:-[xy]|-(?:block|inline)|-[rltbse]|-[bi][se])?|(?:top|right|bottom|left|start|end))-${rawArbitraryValue}$`),
  new RegExp(`^-?translate-(?:[xyz]-)?${rawArbitraryValue}$`),
  new RegExp(`^scroll-[mp](?:[trblxy]|[se]|[bi][se])?-${rawArbitraryValue}$`),
]

export function createBlocklist(prefix?: string | string[], options: CreateBlocklistOptions = {}): BlocklistRule[] {
  const prefixes = (Array.isArray(prefix) ? prefix : [prefix]).filter((item): item is string => Boolean(item))
  const locale = options.locale ?? 'zh-CN'

  return [
    ...migrationDescriptors.map(({ matcher, replacement }) => migrationRule(matcher, replacement, locale)),
    ...prefixes.flatMap(prefix => migrationDescriptors.map(({ matcher, replacement }) => prefixedMigrationRule(matcher, replacement, prefix, locale))),
    ...rawBlocklist,
    ...prefixes.flatMap(prefix => rawBlocklist.map(matcher => prefixedRawRule(matcher, prefix))),
  ]
}

export const blocklist: BlocklistRule[] = createBlocklist()

function formatCompactSpacingReplacement(sign: string, utility: string, direction: string, value: string) {
  const prefix = `${utility}${direction}`
  return `${sign}${prefix}-${value}`
}

function formatArbitrarySpacingReplacement(sign: string, utility: string, direction: string, value: string) {
  const prefix = `${utility}${direction}`
  return `${sign}${prefix}-[${value}]`
}
