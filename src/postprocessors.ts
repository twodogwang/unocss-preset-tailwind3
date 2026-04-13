import type { Postprocessor } from '@unocss/core'
import type { PresetTailwind3Options } from './index'

function variablePrefix(prefix: PresetTailwind3Options['variablePrefix']): Postprocessor[] {
  if (!prefix || prefix === 'un-')
    return []

  return [
    (util) => {
      util.entries.forEach((entry) => {
        entry[0] = entry[0].replace(/^--un-/, `--${prefix}`)
        if (typeof entry[1] === 'string')
          entry[1] = entry[1].replace(/var\(--un-/g, `var(--${prefix}`)
      })
    },
  ]
}

function important(option: PresetTailwind3Options['important']): Postprocessor[] {
  if (option == null || option === false)
    return []

  const wrapWithIs = (selector: string) => {
    if (selector.startsWith(':is(') && selector.endsWith(')'))
      return selector

    if (selector.includes('::'))
      return selector.replace(/(.*?)((?:\s\*)?::.*)/, ':is($1)$2')

    return `:is(${selector})`
  }

  return [
    option === true
      ? (util) => {
          util.entries.forEach((entry) => {
            if (entry[1] != null && !String(entry[1]).endsWith('!important'))
              entry[1] += ' !important'
          })
        }
      : (util) => {
          if (!util.selector.startsWith(option))
            util.selector = `${option} ${wrapWithIs(util.selector)}`
        },
  ]
}

export function postprocessors(options: PresetTailwind3Options): Postprocessor[] {
  return [
    ...variablePrefix(options.variablePrefix),
    ...important(options.important),
  ]
}
