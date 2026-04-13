import type { Preflight } from '@unocss/core'
import type { PresetTailwind3Options } from './index'
import type { Theme } from './theme'
import { entriesToCss, toArray } from '@unocss/core'

export function preflights(options: PresetTailwind3Options): Preflight<Theme>[] | undefined {
  if (!options.preflight)
    return

  return [
    {
      layer: 'preflights',
      getCSS({ theme, generator }) {
        if (!theme.preflightBase)
          return

        let entries = Object.entries(theme.preflightBase)
        if (options.preflight === 'on-demand') {
          const keys = new Set(Array.from(generator.activatedRules).map(r => r[2]?.custom?.preflightKeys).filter(Boolean).flat())
          entries = entries.filter(([key]) => keys.has(key))
        }

        if (!entries.length)
          return

        let css = entriesToCss(entries)
        if (options.variablePrefix !== 'un-')
          css = css.replace(/--un-/g, `--${options.variablePrefix}`)

        const roots = toArray(theme.preflightRoot ?? ['*,::before,::after', '::backdrop'])
        return roots.map(root => `${root}{${css}}`).join('')
      },
    },
  ]
}
