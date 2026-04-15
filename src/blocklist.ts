import type { BlocklistRule } from '@unocss/core'

const rawLengthUnit = String.raw`(?:%|px|r?em|ex|ch|vh|vw|vmin|vmax|svh|svw|lvh|lvw|dvh|dvw|cm|mm|in|pt|pc)`
const rawLengthValue = String.raw`(?:\d+\.?\d*|\d*\.\d+)${rawLengthUnit}`
const rawCssFunctionValue = String.raw`(?:var|calc|min|max|clamp)\(.+\)`
const rawArbitraryValue = String.raw`(?:${rawLengthValue}|${rawCssFunctionValue})`
const rawHexColor = String.raw`#(?:[\da-fA-F]{3,4}|[\da-fA-F]{6}|[\da-fA-F]{8})`

function legacyMessage(selector: string, replacement: string) {
  return `旧写法 "${selector}" 已禁用，请改为 "${replacement}"`
}

function migrationRule(
  matcher: RegExp,
  replacement: (selector: string, match: RegExpMatchArray) => string,
): BlocklistRule {
  return [
    matcher,
    {
      message: (selector) => {
        const match = selector.match(matcher)
        return legacyMessage(selector, match ? replacement(selector, match) : selector)
      },
    },
  ]
}

export const blocklist: BlocklistRule[] = [
  migrationRule(new RegExp(`^color-(${rawHexColor})$`), (_, match) => `[color:${match[1]}]`),
  migrationRule(new RegExp(`^c-(${rawHexColor})$`), (_, match) => `text-[${match[1]}]`),
  migrationRule(new RegExp(`^(text|bg|fill|stroke|accent|caret)-(${rawHexColor})$`), (_, match) => `${match[1]}-[${match[2]}]`),
  migrationRule(/^b-(.+)$/, selector => selector.replace(/^b-/, 'border-')),
  migrationRule(/^rd-(.+)$/, selector => selector.replace(/^rd-/, 'rounded-')),
  migrationRule(/^fw-(.+)$/, selector => selector.replace(/^fw-/, 'font-')),
  migrationRule(/^pos-(.+)$/, (_, match) => match[1]),
  migrationRule(/^op(\d+)$/, (_, match) => `opacity-${match[1]}`),
  migrationRule(/^bg-op-?(\d+)$/, (_, match) => `bg-opacity-${match[1]}`),
  migrationRule(/^border-op(\d+)$/, (_, match) => `border-opacity-${match[1]}`),
  migrationRule(/^ring-op(\d+)$/, (_, match) => `ring-opacity-${match[1]}`),
  migrationRule(/^ring-(?:width|size)-(.+)$/, (_, match) => `ring-${match[1]}`),
  migrationRule(/^border((?:-[a-z]{1,2})?)-color-(.+)$/, (_, match) => `border${match[1]}-${match[2]}`),
  migrationRule(/^outline-color-(.+)$/, (_, match) => `outline-${match[1]}`),
  migrationRule(/^outline-width-(.+)$/, (_, match) => `outline-${match[1]}`),
  migrationRule(/^outline-style-(.+)$/, (_, match) => `outline-${match[1]}`),
  migrationRule(/^(?:property|transition-property)-(.+)$/, (_, match) => `transition-${match[1]}`),
  migrationRule(/^transition-delay-(.+)$/, (_, match) => `delay-${match[1]}`),
  migrationRule(/^transition-ease-(.+)$/, (_, match) => `ease-${match[1]}`),
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
