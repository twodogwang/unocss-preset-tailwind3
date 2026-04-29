import type { BlocklistRule } from '@unocss/core'

import type { BlocklistLocale } from '../../blocklist'
import { createBlocklist } from '../../blocklist'
import { getBlocklistMigrationReplacement } from '../../blocklist-migration'

const CLASS_FIELDS = ['class', 'classname']

export interface CreateEslintPluginTailwind3Options {
  enableFix?: boolean
  prefix?: string | string[]
  locale?: BlocklistLocale
  blocklistLocale?: BlocklistLocale
}

interface ReportDescriptor {
  node: {
    range: [number, number]
    value: string
  }
  message: string
  fix?: (fixer: {
    replaceTextRange: (range: [number, number], text: string) => unknown
  }) => unknown
}

function matchesRule(token: string, matcher: unknown) {
  if (typeof matcher === 'string')
    return token === matcher
  if (matcher instanceof RegExp)
    return matcher.test(token)
  if (typeof matcher === 'function')
    return Boolean(matcher(token))
  return false
}

function getBlockedToken(
  token: string,
  blocklistRules: BlocklistRule[],
  prefix?: string | string[],
) {
  for (const rule of blocklistRules) {
    const [matcher, meta] = Array.isArray(rule) ? rule : [rule, undefined]
    if (!matchesRule(token, matcher))
      continue

    const message = typeof meta?.message === 'function'
      ? meta.message(token)
      : meta?.message

    return {
      token,
      message,
      replacement: getBlocklistMigrationReplacement(token, prefix),
    }
  }
}

function reportLiteral(
  context: {
    report: (descriptor: ReportDescriptor) => void
  },
  node: {
    range: [number, number]
    value: string
  },
  blocklistRules: BlocklistRule[],
  enableFix: boolean,
  prefix?: string | string[],
) {
  if (typeof node.value !== 'string' || !node.value.trim())
    return

  const literalStart = node.range[0] + 1
  for (const match of node.value.matchAll(/\S+/g)) {
    const token = match[0]
    const blocked = getBlockedToken(token, blocklistRules, prefix)
    if (!blocked)
      continue

    const start = literalStart + match.index
    const end = start + token.length
    const replacement = blocked.replacement

    context.report({
      node,
      message: blocked.message
        ? `"${token}" is in blocklist: ${blocked.message}`
        : `"${token}" is in blocklist`,
      fix: enableFix && replacement
        ? fixer => fixer.replaceTextRange([start, end], replacement)
        : undefined,
    })
  }
}

export function createTailwind3BlocklistAutofixRule(
  options: CreateEslintPluginTailwind3Options = {},
) {
  const enableFix = options.enableFix ?? true
  const prefix = options.prefix
  const locale = options.locale ?? options.blocklistLocale
  const blocklistRules = createBlocklist(prefix, { locale })

  return {
    meta: {
      type: 'problem',
      fixable: 'code',
      docs: {
        description: 'Autofix migratable UnoCSS blocklist tokens for preset-tailwind3',
      },
      schema: [],
    },
    create(context: {
      report: (descriptor: ReportDescriptor) => void
      sourceCode?: {
        parserServices?: {
          defineTemplateBodyVisitor?: (
            templateVisitor: Record<string, (node: unknown) => void>,
            scriptVisitor: Record<string, (node: unknown) => void>,
          ) => Record<string, (node: unknown) => void>
        }
      }
      parserServices?: {
        defineTemplateBodyVisitor?: (
          templateVisitor: Record<string, (node: unknown) => void>,
          scriptVisitor: Record<string, (node: unknown) => void>,
        ) => Record<string, (node: unknown) => void>
      }
    }) {
      const scriptVisitor = {
        JSXAttribute(node: {
          name: { name?: string }
          value?: {
            type: string
            range: [number, number]
            value: string
          }
        }) {
          if (
            typeof node.name.name === 'string'
            && CLASS_FIELDS.includes(node.name.name.toLowerCase())
            && node.value?.type === 'Literal'
          )
            reportLiteral(context, node.value, blocklistRules, enableFix, prefix)
        },
      }

      const templateBodyVisitor = {
        VAttribute(node: {
          key: { name?: string }
          value?: {
            type: string
            range: [number, number]
            value: string
          }
        }) {
          if (node.key.name === 'class' && node.value?.type === 'VLiteral')
            reportLiteral(context, node.value, blocklistRules, enableFix, prefix)
        },
      }

      const parserServices = context.sourceCode?.parserServices ?? context.parserServices
      if (parserServices?.defineTemplateBodyVisitor)
        return parserServices.defineTemplateBodyVisitor(
          templateBodyVisitor as Record<string, (node: unknown) => void>,
          scriptVisitor as Record<string, (node: unknown) => void>,
        )
      return scriptVisitor
    },
  }
}

export const tailwind3BlocklistAutofixRule = createTailwind3BlocklistAutofixRule()
