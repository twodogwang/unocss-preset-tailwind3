import type { Rule } from '@unocss/core'
import type { Theme } from '../theme'
import { h } from '../utils'

function rowCol(s: string) {
  return s.replace('col', 'column')
}

function gridAutoTheme(theme: Theme, axis: string) {
  return axis[0] === 'r'
    ? theme.gridAutoRows ?? theme.gridAutoRow
    : theme.gridAutoColumns ?? theme.gridAutoColumn
}

function gridLineTheme(theme: Theme, axis: string) {
  return axis[0] === 'r'
    ? theme.gridRow
    : theme.gridColumn
}

function gridLineStartTheme(theme: Theme, axis: string) {
  return axis[0] === 'r'
    ? theme.gridRowStart
    : theme.gridColumnStart
}

function gridLineEndTheme(theme: Theme, axis: string) {
  return axis[0] === 'r'
    ? theme.gridRowEnd
    : theme.gridColumnEnd
}

function gridTemplateTheme(theme: Theme, axis: string) {
  return axis[0] === 'r'
    ? theme.gridTemplateRows ?? theme.gridTemplateRow
    : theme.gridTemplateColumns ?? theme.gridTemplateColumn
}

export const grids: Rule<Theme>[] = [
  // displays
  ['grid', { display: 'grid' }],
  ['inline-grid', { display: 'inline-grid' }],

  // spans
  [/^(row|col)-span-(.+)$/, ([, c, s]) => {
    if (s === 'full')
      return { [`grid-${rowCol(c)}`]: '1/-1' }

    const value = h.bracket.number(s)
    if (value != null)
      return { [`grid-${rowCol(c)}`]: `span ${value}/span ${value}` }
  }, { autocomplete: '(row|col)-span-<num>' }],

  // starts & ends
  [/^(row|col)-start-(.+)$/, ([, c, v], { theme }) => {
    const value = gridLineStartTheme(theme, c)?.[v] ?? h.bracket.cssvar(v)
    if (value != null)
      return { [`grid-${rowCol(c)}-start`]: value }
  }],
  [/^(row|col)-end-(.+)$/, ([, c, v], { theme }) => {
    const value = gridLineEndTheme(theme, c)?.[v] ?? h.bracket.cssvar(v)
    if (value != null)
      return { [`grid-${rowCol(c)}-end`]: value }
  }, { autocomplete: '(row|col)-(start|end)-<num>' }],

  // line placement
  [/^(row|col)-(.+)$/, ([, c, v], { theme }) => {
    const value = gridLineTheme(theme, c)?.[v] ?? h.bracket.cssvar.auto(v)
    if (value != null)
      return { [`grid-${rowCol(c)}`]: value }
  }],

  // auto rows/cols
  [/^auto-(rows|cols)-(.+)$/, ([, c, v], { theme }) => {
    const value = gridAutoTheme(theme, c)?.[v] ?? h.bracket.cssvar.auto.rem(v)
    if (value != null)
      return { [`grid-auto-${rowCol(c)}`]: value }
  }, { autocomplete: 'auto-(rows|cols)-<num>' }],

  // grid flow
  [/^grid-flow-(.+)$/, ([, v]) => {
    const value = h.bracket.cssvar(v)
    if (value != null)
      return { 'grid-auto-flow': value }
  }],
  [/^grid-flow-(row|col|dense|row-dense|col-dense)$/, ([, v]) => ({ 'grid-auto-flow': rowCol(v).replace('-', ' ') }), { autocomplete: ['grid-flow-(row|col|dense|row-dense|col-dense)'] }],

  // templates
  [/^grid-(rows|cols)-(.+)$/, ([, c, v], { theme }) => {
    const value = gridTemplateTheme(theme, c)?.[v] ?? h.bracket.cssvar(v)
    if (value != null)
      return { [`grid-template-${rowCol(c)}`]: value }
  }],
]
