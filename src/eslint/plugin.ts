import type {
  CreateEslintPluginTailwind3Options,
  Tailwind3BlocklistAutofixRule,
} from './rules/blocklist-autofix'
import {
  createTailwind3BlocklistAutofixRule,
  tailwind3BlocklistAutofixRule,
} from './rules/blocklist-autofix'

export interface Tailwind3EslintPlugin {
  rules: {
    'blocklist-autofix': Tailwind3BlocklistAutofixRule
  }
}

export function createEslintPluginTailwind3(
  options: CreateEslintPluginTailwind3Options = {},
): Tailwind3EslintPlugin {
  return {
    rules: {
      'blocklist-autofix': createTailwind3BlocklistAutofixRule(options),
    },
  }
}

const eslintPluginTailwind3: Tailwind3EslintPlugin = {
  rules: {
    'blocklist-autofix': tailwind3BlocklistAutofixRule,
  },
}

export default eslintPluginTailwind3
