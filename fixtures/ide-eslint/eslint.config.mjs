import unocss from '@unocss/eslint-config/flat'

export default [
  {
    ...unocss,
    files: ['**/*.jsx'],
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
      'unocss/blocklist': 'warn',
    },
  },
]
