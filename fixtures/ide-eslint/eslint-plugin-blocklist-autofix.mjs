import presetTailwind3 from '@twodogwang/unocss-preset-tailwind3'

const CLASS_FIELDS = ['class', 'classname']
const blocklistRules = presetTailwind3().blocklist ?? []

function getBlocklistMigrationReplacement(token, message) {
  if (typeof message !== 'string')
    return null

  const quotedParts = Array.from(message.matchAll(/"([^"]+)"/g), match => match[1])
  const replacement = quotedParts.at(-1)
  return replacement && replacement !== token ? replacement : null
}

function getBlockedToken(token) {
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
      replacement: getBlocklistMigrationReplacement(token, message),
    }
  }
}

function matchesRule(token, matcher) {
  if (typeof matcher === 'string')
    return token === matcher
  if (matcher instanceof RegExp)
    return matcher.test(token)
  if (typeof matcher === 'function')
    return Boolean(matcher(token))
  return false
}

function reportLiteral(context, node) {
  if (typeof node.value !== 'string' || !node.value.trim())
    return

  const literalStart = node.range[0] + 1
  for (const match of node.value.matchAll(/\S+/g)) {
    const token = match[0]
    const blocked = getBlockedToken(token)
    if (!blocked)
      continue

    const start = literalStart + match.index
    const end = start + token.length

    context.report({
      node,
      message: blocked.message
        ? `"${token}" is in blocklist: ${blocked.message}`
        : `"${token}" is in blocklist`,
      fix: blocked.replacement
        ? fixer => fixer.replaceTextRange([start, end], blocked.replacement)
        : null,
    })
  }
}

const blocklistAutofixRule = {
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description: 'Autofix migratable UnoCSS blocklist tokens for preset-tailwind3',
    },
    schema: [],
  },
  create(context) {
    const scriptVisitor = {
      JSXAttribute(node) {
        if (
          typeof node.name.name === 'string'
          && CLASS_FIELDS.includes(node.name.name.toLowerCase())
          && node.value?.type === 'Literal'
        )
          reportLiteral(context, node.value)
      },
    }

    const templateBodyVisitor = {
      VAttribute(node) {
        if (node.key.name === 'class' && node.value?.type === 'VLiteral')
          reportLiteral(context, node.value)
      },
    }

    const parserServices = context.sourceCode.parserServices || context.parserServices
    if (parserServices?.defineTemplateBodyVisitor)
      return parserServices.defineTemplateBodyVisitor(templateBodyVisitor, scriptVisitor)
    return scriptVisitor
  },
}

export default {
  rules: {
    'blocklist-autofix': blocklistAutofixRule,
  },
}
