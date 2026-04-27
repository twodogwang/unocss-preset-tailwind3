export const rawLengthUnit = String.raw`(?:%|px|r?em|ex|ch|vh|vw|vmin|vmax|svh|svw|lvh|lvw|dvh|dvw|cm|mm|in|pt|pc)`
export const rawLengthValue = String.raw`(?:\d+\.?\d*|\d*\.\d+)${rawLengthUnit}`
export const rawCssFunctionValue = String.raw`(?:var|calc|min|max|clamp)\(.+\)`
export const rawArbitraryValue = String.raw`(?:${rawLengthValue}|${rawCssFunctionValue})`
export const rawHexColor = String.raw`#(?:[\da-fA-F]{3,4}|[\da-fA-F]{6}|[\da-fA-F]{8})`

export type BlocklistMigrationReplacement = (selector: string, match: RegExpMatchArray) => string

export interface BlocklistMigrationDescriptor {
  matcher: RegExp
  replacement: BlocklistMigrationReplacement
}

export interface BlocklistMigrationFix {
  from: string
  to: string
}

export interface RewriteBlocklistMigrationResult {
  output: string
  fixes: BlocklistMigrationFix[]
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

const textStrokeKeywordWidthMap: Record<string, string> = {
  none: '0',
  sm: 'thin',
  md: 'medium',
  lg: 'thick',
}

const fontVariantNumericAliasMap: Record<string, string> = {
  ordinal: 'ordinal',
  'slashed-zero': 'slashed-zero',
  lining: 'lining-nums',
  oldstyle: 'oldstyle-nums',
  proportional: 'proportional-nums',
  tabular: 'tabular-nums',
}

const fontVariantFractionAliasMap: Record<string, string> = {
  diagonal: 'diagonal-fractions',
  stacked: 'stacked-fractions',
}

const prefixedAlignmentBody = String.raw`(?:justify(?:-items|-self)?|content|items|self|place-content|place-items|place-self)-(?:auto|normal|start|end|center|stretch|baseline|between|around|evenly)`

export const blocklistMigrationDescriptors: BlocklistMigrationDescriptor[] = [
  { matcher: new RegExp(`^c-(${rawHexColor})$`), replacement: (_, match) => `text-[${match[1]}]` },
  { matcher: new RegExp(`^(text|bg|fill|stroke|accent|caret)-(${rawHexColor})$`), replacement: (_, match) => `${match[1]}-[${match[2]}]` },
  { matcher: /^(text-indent)-(px|\d+(?:\.\d+)?)$/, replacement: (_, match) => `indent-${match[2]}` },
  { matcher: /^(text-indent)-(\[.+\])$/, replacement: (_, match) => `indent-${match[2]}` },
  { matcher: new RegExp(`^indent-(${rawLengthValue}|${rawCssFunctionValue})$`), replacement: (_, match) => `indent-[${match[1]}]` },
  { matcher: /^([wh])(\d+(?:\.\d+)?)$/, replacement: (_, match) => `${match[1]}-${match[2]}` },
  { matcher: /^(min|max)([wh])(.+)$/, replacement: (_, match) => `${match[1]}-${match[2]}-${match[3]}` },
  { matcher: new RegExp(`^(size|(?:min|max)-[wh]|[wh])-(${rawArbitraryValue})$`), replacement: (_, match) => `${match[1]}-[${match[2]}]` },
  { matcher: /^aspect-1\/1$/, replacement: () => 'aspect-square' },
  { matcher: /^aspect-16\/9$/, replacement: () => 'aspect-video' },
  { matcher: /^aspect-(\d+\/\d+)$/, replacement: (_, match) => `aspect-[${match[1]}]` },
  { matcher: /^aspect-ratio-(auto|square|video)$/, replacement: (_, match) => `aspect-${match[1]}` },
  { matcher: /^aspect-ratio-(\[.+\])$/, replacement: (_, match) => `aspect-${match[1]}` },
  { matcher: /^size-aspect-(auto|square|video)$/, replacement: (_, match) => `aspect-${match[1]}` },
  { matcher: /^display-(block|inline|inline-block|none|contents|flow-root|list-item)$/, replacement: (_, match) => match[1] === 'none' ? 'hidden' : match[1] },
  {
    matcher: /^of(?:-([xy]))?-(auto|hidden|clip|visible|scroll)$/,
    replacement: (_, match) => match[1] ? `overflow-${match[1]}-${match[2]}` : `overflow-${match[2]}`,
  },
  { matcher: /^columns([1-9]|1[0-2])$/, replacement: (_, match) => `columns-${match[1]}` },
  { matcher: /^flex-inline$/, replacement: () => 'inline-flex' },
  { matcher: new RegExp(`^flex-basis-(${rawLengthValue}|${rawCssFunctionValue})$`), replacement: (_, match) => `basis-[${match[1]}]` },
  { matcher: /^flex-grow-(?!0$)(.+)$/, replacement: (_, match) => `grow-${match[1]}` },
  { matcher: /^flex-shrink-(?!0$)(.+)$/, replacement: (_, match) => `shrink-${match[1]}` },
  { matcher: /^auto-flow-(.+)$/, replacement: (_, match) => `grid-flow-${match[1]}` },
  { matcher: /^rows-(.+)$/, replacement: (_, match) => `grid-rows-${match[1]}` },
  { matcher: /^cols-(.+)$/, replacement: (_, match) => `grid-cols-${match[1]}` },
  { matcher: new RegExp(`^(flex|grid)-(${prefixedAlignmentBody})$`), replacement: (_, match) => match[2] },
  { matcher: /^transform-rotate-(.+)$/, replacement: (_, match) => `rotate-${match[1]}` },
  { matcher: /^transform-origin-(.+)$/, replacement: (_, match) => `origin-${match[1]}` },
  { matcher: new RegExp(`^(-?translate-[xy]-)(${rawArbitraryValue})$`), replacement: (_, match) => `${match[1]}[${match[2]}]` },
  { matcher: /^filter-(blur|brightness|contrast|drop-shadow|grayscale|hue-rotate|invert|saturate|sepia)(?:-(.+))?$/, replacement: (_, match) => match[2] ? `${match[1]}-${match[2]}` : match[1] },
  { matcher: /^backdrop-op-(.+)$/, replacement: (_, match) => `backdrop-opacity-${match[1]}` },
  { matcher: /^z(0|10|20|30|40|50)$/, replacement: (_, match) => `z-${match[1]}` },
  { matcher: /^order([1-9]|1[0-2])$/, replacement: (_, match) => `order-${match[1]}` },
  { matcher: /^text-truncate$/, replacement: () => 'truncate' },
  { matcher: /^case-upper$/, replacement: () => 'uppercase' },
  { matcher: /^case-lower$/, replacement: () => 'lowercase' },
  { matcher: /^case-capital$/, replacement: () => 'capitalize' },
  { matcher: /^case-normal$/, replacement: () => 'normal-case' },
  { matcher: /^tab$/, replacement: () => '[tab-size:4]' },
  { matcher: /^tab-(\d+(?:\.\d+)?)$/, replacement: (_, match) => `[tab-size:${match[1]}]` },
  { matcher: /^tab-(\[.+\])$/, replacement: (_, match) => `[tab-size:${match[1].slice(1, -1)}]` },
  { matcher: /^line-clamp-0$/, replacement: () => 'line-clamp-[0]' },
  { matcher: /^line-clamp-(inherit|initial|unset|revert|revert-layer)$/, replacement: (_, match) => `line-clamp-[${match[1]}]` },
  { matcher: /^nums-normal$/, replacement: () => 'normal-nums' },
  {
    matcher: /^numeric-(ordinal|slashed-zero|lining|oldstyle|proportional|tabular)$/,
    replacement: (_, match) => fontVariantNumericAliasMap[match[1]],
  },
  {
    matcher: /^fractions-(diagonal|stacked)$/,
    replacement: (_, match) => fontVariantFractionAliasMap[match[1]],
  },
  { matcher: /^text-shadow-none$/, replacement: () => '[text-shadow:0_0_#0000]' },
  { matcher: /^text-shadow-\[(.+_.+)\]$/, replacement: (_, match) => `[text-shadow:${match[1]}]` },
  { matcher: /^text-stroke$/, replacement: () => '[-webkit-text-stroke-width:1.5rem]' },
  { matcher: /^text-stroke-(\d+(?:\.\d+)?)$/, replacement: (_, match) => `[-webkit-text-stroke-width:${match[1]}px]` },
  { matcher: /^text-stroke-(none|sm|md|lg)$/, replacement: (_, match) => `[-webkit-text-stroke-width:${textStrokeKeywordWidthMap[match[1]]}]` },
  { matcher: new RegExp(`^text-stroke-\\[(${rawHexColor})\\]$`), replacement: (_, match) => `[-webkit-text-stroke-color:${match[1]}]` },
  { matcher: new RegExp(`^text-stroke-\\[(?:length:)?(${rawLengthValue}|${rawCssFunctionValue})\\]$`), replacement: (_, match) => `[-webkit-text-stroke-width:${match[1]}]` },
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
  { matcher: /^text-align-(left|center|right|justify|start|end)$/, replacement: (_, match) => `text-${match[1]}` },
  { matcher: /^vertical-(baseline|top|middle|bottom|text-top|text-bottom|sub|super)$/, replacement: (_, match) => `align-${match[1]}` },
  { matcher: /^v-(baseline|top|middle|bottom|text-top|text-bottom|sub|super)$/, replacement: (_, match) => `align-${match[1]}` },
  { matcher: /^align-base$/, replacement: () => 'align-baseline' },
  { matcher: /^align-mid$/, replacement: () => 'align-middle' },
  { matcher: /^align-btm$/, replacement: () => 'align-bottom' },
  { matcher: /^align-start$/, replacement: () => 'align-top' },
  { matcher: /^align-end$/, replacement: () => 'align-bottom' },
  { matcher: new RegExp(`^align-(${rawLengthValue})$`), replacement: (_, match) => `align-[${match[1]}]` },
  { matcher: /^stroke-(?:width|size)-(.+)$/, replacement: (_, match) => `stroke-${match[1]}` },
  { matcher: /^font-(\d+)$/, replacement: (_, match) => `font-[${match[1]}]` },
  { matcher: /^b-(.+)$/, replacement: selector => selector.replace(/^b-/, 'border-') },
  { matcher: /^rd-(.+)$/, replacement: selector => selector.replace(/^rd-/, 'rounded-') },
  { matcher: /^fw-(.+)$/, replacement: selector => selector.replace(/^fw-/, 'font-') },
  { matcher: /^divide([xy])$/, replacement: (_, match) => `divide-${match[1]}` },
  { matcher: /^divide([xy])(\d+(?:\.\d+)?)$/, replacement: (_, match) => `divide-${match[1]}-${match[2]}` },
  { matcher: /^divide-op(\d+)$/, replacement: (_, match) => `divide-opacity-${match[1]}` },
  { matcher: /^pos-(relative|absolute|fixed|sticky|static)$/, replacement: (_, match) => match[1] },
  { matcher: /^op(\d+)$/, replacement: (_, match) => `opacity-${match[1]}` },
  { matcher: /^bg-op-?(\d+)$/, replacement: (_, match) => `bg-opacity-${match[1]}` },
  { matcher: /^border-op(\d+)$/, replacement: (_, match) => `border-opacity-${match[1]}` },
  { matcher: /^ring-op(\d+)$/, replacement: (_, match) => `ring-opacity-${match[1]}` },
  { matcher: /^ring-(?:width|size)-(.+)$/, replacement: (_, match) => `ring-${match[1]}` },
  { matcher: /^shadowmd$/, replacement: () => 'shadow-md' },
  { matcher: /^shadow-inset$/, replacement: () => 'shadow-inner' },
  { matcher: /^decoration-none$/, replacement: () => 'no-underline' },
  { matcher: /^decoration-underline$/, replacement: () => 'underline' },
  { matcher: /^decoration-overline$/, replacement: () => 'overline' },
  { matcher: /^decoration-line-through$/, replacement: () => 'line-through' },
  { matcher: /^decoration-offset-(.+)$/, replacement: (_, match) => `underline-offset-${match[1]}` },
  { matcher: /^underline-(auto|solid|double|dotted|dashed|wavy)$/, replacement: (_, match) => `decoration-${match[1]}` },
  { matcher: /^underline-(\d+(?:\.\d+)?)$/, replacement: (_, match) => `decoration-${match[1]}` },
  { matcher: /^underline-(\[.+\])$/, replacement: (_, match) => `decoration-${match[1]}` },
  { matcher: /^border((?:-[a-z]{1,2})?)-color-(.+)$/, replacement: (_, match) => `border${match[1]}-${match[2]}` },
  { matcher: /^outline-color-(.+)$/, replacement: (_, match) => `outline-${match[1]}` },
  { matcher: /^outline-width-(.+)$/, replacement: (_, match) => `outline-${match[1]}` },
  { matcher: /^outline-style-(.+)$/, replacement: (_, match) => `outline-${match[1]}` },
  { matcher: /^(?:property|transition-property)-(none|all|colors|opacity|shadow|transform)$/, replacement: (_, match) => `transition-${match[1]}` },
  { matcher: /^transition-delay-(.+)$/, replacement: (_, match) => `delay-${match[1]}` },
  { matcher: /^transition-ease-(.+)$/, replacement: (_, match) => `ease-${match[1]}` },
]

export function getBlocklistMigrationReplacement(
  selector: string,
  prefix?: string | string[],
): string | undefined {
  const directReplacement = getUnprefixedBlocklistMigrationReplacement(selector)
  if (directReplacement)
    return directReplacement

  for (const currentPrefix of normalizePrefixes(prefix)) {
    if (!selector.startsWith(currentPrefix))
      continue
    const unprefixedSelector = selector.slice(currentPrefix.length)
    const replacement = getUnprefixedBlocklistMigrationReplacement(unprefixedSelector)
    if (replacement)
      return `${currentPrefix}${replacement}`
  }
}

export function rewriteBlocklistMigrationClassString(
  input: string,
  prefix?: string | string[],
): RewriteBlocklistMigrationResult {
  const fixes: BlocklistMigrationFix[] = []
  const output = input.replace(/\S+/g, (token) => {
    const replacement = getBlocklistMigrationReplacement(token, prefix)
    if (!replacement)
      return token
    fixes.push({ from: token, to: replacement })
    return replacement
  })

  return {
    output,
    fixes,
  }
}

function getUnprefixedBlocklistMigrationReplacement(selector: string) {
  for (const descriptor of blocklistMigrationDescriptors) {
    const match = selector.match(descriptor.matcher)
    if (match)
      return descriptor.replacement(selector, match)
  }
}

function normalizePrefixes(prefix?: string | string[]) {
  return (Array.isArray(prefix) ? prefix : [prefix]).filter((item): item is string => Boolean(item))
}

function formatCompactSpacingReplacement(sign: string, utility: string, direction: string, value: string) {
  const prefix = `${utility}${direction}`
  return `${sign}${prefix}-${value}`
}

function formatArbitrarySpacingReplacement(sign: string, utility: string, direction: string, value: string) {
  const prefix = `${utility}${direction}`
  return `${sign}${prefix}-[${value}]`
}
