import type { PresetOptions } from '@unocss/core'
import { definePreset } from '@unocss/core'
import { extractorArbitraryVariants } from '@unocss/extractor-arbitrary-variants'

import type { BlocklistLocale } from './blocklist'
import { createBlocklist } from './blocklist'
export { createBlocklist } from './blocklist'
export {
  getBlocklistMigrationReplacement,
  rewriteBlocklistMigrationClassString,
} from './blocklist-migration'
import { colors } from './colors'
import { postprocessors } from './postprocessors'
import { preflights } from './preflights'
import { rules } from './rules'
import { shorthands } from './shorthands'
import { shortcuts } from './shortcuts'
import { theme } from './theme'
import { variants } from './variants'

export { colors, preflights }
export type { Theme } from './theme'

export { rules, shortcuts, shorthands, theme, variants }

export interface DarkModeSelectors {
  light?: string | string[]
  dark?: string | string[]
}

export interface PresetTailwind3Options extends PresetOptions {
  dark?: 'class' | 'media' | DarkModeSelectors
  attributifyPseudo?: boolean
  variablePrefix?: string
  prefix?: string | string[]
  locale?: BlocklistLocale
  blocklistLocale?: BlocklistLocale
  preflight?: boolean | 'on-demand'
  arbitraryVariants?: boolean
  important?: boolean | string
}

function cloneMetaTuple<T extends readonly unknown[]>(entry: T): T {
  const cloned = [...entry] as unknown[]
  if (entry[2] && typeof entry[2] === 'object')
    cloned[2] = { ...entry[2] }
  return cloned as unknown as T
}

function cloneRules() {
  return rules.map(rule => cloneMetaTuple(rule)) as typeof rules
}

function cloneShortcuts() {
  if (Array.isArray(shortcuts))
    return shortcuts.map((shortcut) => {
      if (Array.isArray(shortcut))
        return cloneMetaTuple(shortcut as readonly unknown[])
      return { ...shortcut }
    }) as typeof shortcuts
  return { ...shortcuts }
}

export const presetTailwind3 = definePreset((options: PresetTailwind3Options = {}) => {
  const resolvedOptions: PresetTailwind3Options = {
    ...options,
    dark: options.dark ?? 'class',
    attributifyPseudo: options.attributifyPseudo ?? false,
    preflight: options.preflight ?? false,
    variablePrefix: options.variablePrefix ?? 'un-',
    important: options.important ?? false,
  }

  return {
    name: '@twodogwang/unocss-preset-tailwind3',
    theme,
    rules: cloneRules(),
    shortcuts: cloneShortcuts(),
    separators: [':'],
    variants: variants(resolvedOptions),
    blocklist: createBlocklist(resolvedOptions.prefix, {
      locale: resolvedOptions.locale ?? resolvedOptions.blocklistLocale,
    }),
    options: resolvedOptions,
    prefix: resolvedOptions.prefix,
    postprocess: postprocessors(resolvedOptions),
    preflights: resolvedOptions.preflight ? preflights(resolvedOptions) : undefined,
    extractorDefault: resolvedOptions.arbitraryVariants === false
      ? undefined
      : extractorArbitraryVariants(),
    autocomplete: {
      shorthands,
    },
  }
})

export default presetTailwind3
