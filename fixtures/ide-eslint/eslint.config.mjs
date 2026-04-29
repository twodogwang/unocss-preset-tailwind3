import unocss from '@unocss/eslint-config/flat'
import blocklistAutofixPlugin from '@twodogwang/unocss-preset-tailwind3/eslint'

export default [
  {
    ...unocss,
    files: ['**/*.jsx'],
    plugins: {
      ...(unocss.plugins ?? {}),
      tailwind3: blocklistAutofixPlugin,
    },
    languageOptions: {
      ...unocss.languageOptions,
      parserOptions: {
        ...unocss.languageOptions?.parserOptions,
        ecmaFeatures: {
          ...unocss.languageOptions?.parserOptions?.ecmaFeatures,
          jsx: true,
        },
      },
    },
    rules: {
      ...unocss.rules,
      'unocss/blocklist': 'off',
      'tailwind3/blocklist-autofix': 'warn',
    },
  },
]
