import type { CSSObject, CSSObjectInput, Rule } from '@unocss/core'
import type { Theme } from '../theme'
import { isString, symbols } from '@unocss/core'
import { resolveBreakpoints } from '../breakpoints'

function resolveContainerScreens(context: {
  theme: Theme
  generator?: {
    userConfig?: {
      theme?: Theme
    }
  }
}) {
  const containerScreens = context.generator?.userConfig?.theme?.container?.screens ?? context.theme.container?.screens
  if (!containerScreens)
    return resolveBreakpoints(context) ?? []

  const uniqueEntries = new Map<string, { point: string, size: string }>()
  for (const [point, size] of Object.entries(containerScreens)
    .sort((a, b) => Number.parseInt(a[1]) - Number.parseInt(b[1]))) {
    if (!uniqueEntries.has(size))
      uniqueEntries.set(size, { point, size })
  }

  return [...uniqueEntries.values()]
}

function resolveContainerPadding(
  theme: Theme,
  point?: string,
) {
  const themePadding = theme.container?.padding
  if (isString(themePadding))
    return point == null ? themePadding : undefined
  if (!themePadding)
    return undefined
  return point == null ? themePadding.DEFAULT : themePadding[point]
}

export const container: Rule<Theme>[] = [
  [
    /^container$/,
    (m, context) => {
      const { theme } = context
      const baseCss: CSSObject = {
        width: '100%',
      }

      if (theme.container?.center) {
        baseCss['margin-left'] = 'auto'
        baseCss['margin-right'] = 'auto'
      }

      const basePadding = resolveContainerPadding(theme)
      if (basePadding) {
        baseCss['padding-left'] = basePadding
        baseCss['padding-right'] = basePadding
      }

      const css: CSSObjectInput[] = [baseCss]

      for (const { point, size } of resolveContainerScreens(context)) {
        const responsiveCss: CSSObjectInput = {
          [symbols.parent]: `@media (min-width: ${size})`,
          'max-width': size,
        }

        const responsivePadding = resolveContainerPadding(theme, point)
        if (responsivePadding) {
          responsiveCss['padding-left'] = responsivePadding
          responsiveCss['padding-right'] = responsivePadding
        }

        css.push(responsiveCss)
      }

      return css
    },
    { autocomplete: 'container' },
  ],
]
