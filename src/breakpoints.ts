import type { Theme } from './theme'

const reLetters = /[a-z]+/gi
const resolvedBreakpoints = new WeakMap<object, { point: string, size: string }[]>()

type BreakpointContext = Readonly<{
  theme: Theme
  generator?: {
    userConfig?: {
      theme?: Theme
    }
  }
}>

export function resolveBreakpoints(
  { theme, generator }: BreakpointContext,
  key: 'breakpoints' | 'verticalBreakpoints' = 'breakpoints',
) {
  const breakpoints = generator?.userConfig?.theme?.[key] || theme[key]
  if (!breakpoints)
    return undefined

  if (resolvedBreakpoints.has(theme))
    return resolvedBreakpoints.get(theme)

  const resolved = Object.entries(breakpoints)
    .sort((a, b) => Number.parseInt(a[1].replace(reLetters, '')) - Number.parseInt(b[1].replace(reLetters, '')))
    .map(([point, size]) => ({ point, size }))

  resolvedBreakpoints.set(theme, resolved)
  return resolved
}
