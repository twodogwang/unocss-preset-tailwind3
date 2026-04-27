import type { BlocklistRule } from '@unocss/core'
import { escapeRegExp } from '@unocss/core'

import {
  blocklistMigrationDescriptors,
  getBlocklistMigrationReplacement,
  rawArbitraryValue,
} from './blocklist-migration'

export type BlocklistLocale = 'zh-CN' | 'en'

export interface CreateBlocklistOptions {
  locale?: BlocklistLocale
}

function legacyMessage(selector: string, replacement: string, locale: BlocklistLocale = 'zh-CN') {
  if (locale === 'en')
    return `Legacy class "${selector}" is disabled. Use "${replacement}" instead.`
  return `旧写法 "${selector}" 已禁用，请改为 "${replacement}"`
}

function migrationRule(
  matcher: RegExp,
  locale: BlocklistLocale,
): BlocklistRule {
  return [
    matcher,
    {
      message: selector => legacyMessage(
        selector,
        getBlocklistMigrationReplacement(selector) ?? selector,
        locale,
      ),
    },
  ]
}

function prefixedMigrationRule(
  matcher: RegExp,
  prefix: string,
  locale: BlocklistLocale,
): BlocklistRule {
  const prefixedMatcher = new RegExp(`^${escapeRegExp(prefix)}${matcher.source.replace(/^\^/, '')}`, matcher.flags)

  return [
    prefixedMatcher,
    {
      message: selector => legacyMessage(
        selector,
        getBlocklistMigrationReplacement(selector, prefix) ?? selector,
        locale,
      ),
    },
  ]
}

function prefixedRawRule(
  matcher: RegExp,
  prefix: string,
): BlocklistRule {
  return new RegExp(`^${escapeRegExp(prefix)}${matcher.source.replace(/^\^/, '')}`, matcher.flags)
}

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
  /^text-shadow(?:-color)?(?:-.+)?$/,
  /^text-stroke(?:-.+)?$/,
  /^z\d\S*$/,
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
    ...blocklistMigrationDescriptors.map(({ matcher }) => migrationRule(matcher, locale)),
    ...prefixes.flatMap(prefix => blocklistMigrationDescriptors.map(({ matcher }) => prefixedMigrationRule(matcher, prefix, locale))),
    ...rawBlocklist,
    ...prefixes.flatMap(prefix => rawBlocklist.map(matcher => prefixedRawRule(matcher, prefix))),
  ]
}

export const blocklist: BlocklistRule[] = createBlocklist()
