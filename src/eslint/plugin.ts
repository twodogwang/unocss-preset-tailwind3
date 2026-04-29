import type { CreateEslintPluginTailwind3Options } from './rules/blocklist-autofix'
import {
  createTailwind3BlocklistAutofixRule,
  tailwind3BlocklistAutofixRule,
} from './rules/blocklist-autofix'

export function createEslintPluginTailwind3(
  options: CreateEslintPluginTailwind3Options = {},
) {
  return {
    rules: {
      'blocklist-autofix': createTailwind3BlocklistAutofixRule(options),
    },
  }
}

const eslintPluginTailwind3 = {
  rules: {
    'blocklist-autofix': tailwind3BlocklistAutofixRule,
  },
}

export default eslintPluginTailwind3
