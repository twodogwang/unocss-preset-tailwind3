import { describe, expect, it } from 'vitest'

import defaultPlugin, {
  createEslintPluginTailwind3,
  tailwind3BlocklistAutofixRule,
} from '../src/eslint'

interface LiteralNode {
  type: 'Literal'
  value: string
  range: [number, number]
}

interface JsxAttributeNode {
  name: { name: string }
  value: LiteralNode
}

function runRuleOnClassLiteral(plugin: typeof defaultPlugin, className: string, attributeName = 'className') {
  const reports: Array<{
    message: string
    replacement: string | null
  }> = []

  const literalNode: LiteralNode = {
    type: 'Literal',
    value: className,
    range: [0, className.length + 2],
  }

  const visitors = plugin.rules['blocklist-autofix'].create({
    sourceCode: {},
    report(report) {
      reports.push({
        message: report.message,
        replacement: report.fix
          ? report.fix({
              replaceTextRange: (_range: [number, number], text: string) => text,
            })
          : null,
      })
    },
  })

  visitors.JSXAttribute?.({
    name: { name: attributeName },
    value: literalNode,
  } as JsxAttributeNode)

  return reports
}

describe('eslint blocklist autofix plugin', () => {
  it('exports the default plugin and named rule', () => {
    expect(defaultPlugin.rules['blocklist-autofix']).toBe(tailwind3BlocklistAutofixRule)
  })

  it('autofixes high-confidence legacy classes with the default plugin', () => {
    expect(runRuleOnClassLiteral(defaultPlugin, 'c-#fff shape-circle bg-op50')).toEqual([
      {
        message: '"c-#fff" is in blocklist: 旧写法 "c-#fff" 已禁用，请改为 "text-[#fff]"',
        replacement: 'text-[#fff]',
      },
      {
        message: '"shape-circle" is in blocklist',
        replacement: null,
      },
      {
        message: '"bg-op50" is in blocklist: 旧写法 "bg-op50" 已禁用，请改为 "bg-opacity-50"',
        replacement: 'bg-opacity-50',
      },
    ])
  })

  it('supports prefixed projects through the plugin factory', () => {
    const plugin = createEslintPluginTailwind3({
      prefix: 'tw-',
      locale: 'en',
    })

    expect(runRuleOnClassLiteral(plugin, 'tw-bg-op50 tw-shape-circle')).toEqual([
      {
        message: '"tw-bg-op50" is in blocklist: Legacy class "tw-bg-op50" is disabled. Use "tw-bg-opacity-50" instead.',
        replacement: 'tw-bg-opacity-50',
      },
      {
        message: '"tw-shape-circle" is in blocklist',
        replacement: null,
      },
    ])
  })
})
