import type { PresetOptions } from '@unocss/core'
import { definePreset } from '@unocss/core'
import { extractorArbitraryVariants } from '@unocss/extractor-arbitrary-variants'

import { blocklist } from './blocklist'
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
  preflight?: boolean | 'on-demand'
  arbitraryVariants?: boolean
  important?: boolean | string
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
    rules,
    shortcuts,
    separators: [':'],
    variants: variants(resolvedOptions),
    blocklist,
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
