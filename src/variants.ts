import type { Variant, VariantObject } from '@unocss/core'
import type { PresetTailwind3Options } from './index'
import type { Theme } from './theme'
import { escapeRegExp } from '@unocss/core'
import { calcMaxWidthBySize, variantGetBracket, variantParentMatcher } from '@unocss/rule-utils'
import { resolveBreakpoints } from './breakpoints'
import {
  variantAria,
  variantTaggedAriaAttributes,
} from './_variants/aria'
import { variantUniversalChildren } from './_variants/children'
import { variantColorsMediaOrClass } from './_variants/dark'
import {
  variantDataAttribute,
  variantTaggedDataAttributes,
} from './_variants/data'
import { variantLanguageDirections } from './_variants/directions'
import { variantImportant } from './_variants/important'
import { variantPrint } from './_variants/media'
import { variantVariables } from './_variants/misc'
import { variantNegative } from './_variants/negative'
import {
  variantPseudoClassesAndElements,
  variantPseudoClassFunctions,
  variantTaggedPseudoClasses,
} from './_variants/pseudo'
import { variantSupports } from './_variants/supports'
import { h } from './utils'

const taggedPseudoNames = new Set(['pseudo:group', 'pseudo:peer'])
const taggedDataNames = new Set(['group-data', 'peer-data'])
const taggedAriaNames = new Set(['group-aria', 'peer-aria'])
const colorVariantNames = new Set(['dark'])

const variantContrasts = [
  variantParentMatcher('contrast-more', '@media (prefers-contrast: more)'),
  variantParentMatcher('contrast-less', '@media (prefers-contrast: less)'),
]

const variantMotions = [
  variantParentMatcher('motion-reduce', '@media (prefers-reduced-motion: reduce)'),
  variantParentMatcher('motion-safe', '@media (prefers-reduced-motion: no-preference)'),
]

const variantOrientations = [
  variantParentMatcher('landscape', '@media (orientation: landscape)'),
  variantParentMatcher('portrait', '@media (orientation: portrait)'),
]

function filterNamedVariants(variants: Variant<Theme>[], allowedNames: Set<string>): Variant<Theme>[] {
  return variants.filter((variant): variant is VariantObject<Theme> => {
    return typeof variant === 'object' && variant.name != null && allowedNames.has(variant.name)
  })
}

export function variantBreakpoints(): VariantObject<Theme> {
  const regexCache: Record<string, RegExp> = {}

  return {
    name: 'breakpoints',
    match(matcher, context) {
      for (const direction of ['min', 'max'] as const) {
        const arbitraryVariant = variantGetBracket(`${direction}-`, matcher, context.generator.config.separators)
        if (!arbitraryVariant)
          continue

        const [match, rest] = arbitraryVariant
        const size = h.bracket(match)
        if (!size)
          return

        const order = direction === 'max' ? 2999 : 3001
        return {
          matcher: rest,
          handle: (input, next) => next({
            ...input,
            parent: `${input.parent ? `${input.parent} $$ ` : ''}@media (${direction}-width: ${size})`,
            parentOrder: order,
          }),
        }
      }

      const separatorRE = context.generator.config.separators.map(separator => escapeRegExp(separator)).join('|')
      const variantEntries: Array<[string, string, number]> = (resolveBreakpoints(context) ?? [])
        .map(({ point, size }, idx) => [point, size, idx])

      for (const [point, size, idx] of variantEntries) {
        if (!regexCache[point])
          regexCache[point] = new RegExp(`^((?:max-)?${escapeRegExp(point)}(?:${separatorRE}))`)

        const match = matcher.match(regexCache[point])
        if (!match)
          continue

        const [fullMatch] = match
        const rest = matcher.slice(fullMatch.length)

        const isMax = fullMatch.startsWith('max-')
        const order = isMax ? 3000 - (idx + 1) : 3000 + (idx + 1)
        const parent = isMax
          ? `@media (max-width: ${calcMaxWidthBySize(size)})`
          : `@media (min-width: ${size})`

        return {
          matcher: rest,
          handle: (input, next) => next({
            ...input,
            parent: `${input.parent ? `${input.parent} $$ ` : ''}${parent}`,
            parentOrder: order,
          }),
        }
      }
    },
    multiPass: true,
  }
}

export function variants(options: PresetTailwind3Options): Variant<Theme>[] {
  return [
    variantAria,
    variantDataAttribute,
    variantNegative,
    variantImportant(),
    variantSupports,
    variantPrint,
    variantBreakpoints(),
    variantUniversalChildren,
    ...variantPseudoClassesAndElements(),
    variantPseudoClassFunctions(),
    ...filterNamedVariants(variantTaggedPseudoClasses(options), taggedPseudoNames),
    ...filterNamedVariants(variantColorsMediaOrClass(options), colorVariantNames),
    ...variantLanguageDirections,
    variantVariables,
    ...filterNamedVariants(variantTaggedDataAttributes(options), taggedDataNames),
    ...filterNamedVariants(variantTaggedAriaAttributes(options), taggedAriaNames),
    ...variantContrasts,
    ...variantOrientations,
    ...variantMotions,
  ]
}
