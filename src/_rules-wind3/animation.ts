import type { Rule, RuleContext } from '@unocss/core'
import { escapeRegExp } from '@unocss/core'
import type { Theme } from '../theme'
import { h } from '../utils'

const animationDirections = new Set(['normal', 'reverse', 'alternate', 'alternate-reverse'])
const animationPlayStates = new Set(['running', 'paused'])
const animationFillModes = new Set(['none', 'forwards', 'backwards', 'both'])
const animationIterationCounts = new Set(['infinite'])
const animationTimings = new Set(['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'step-start', 'step-end'])
const animationTimingFns = ['cubic-bezier', 'steps']
const animationCommaRE = /\,(?![^(]*\))/g
const animationSpaceRE = /\ +(?![^(]*\))/g
const animationTimeRE = /^-?[\d.]+m?s$/
const animationDigitRE = /^\d+$/

interface ParsedAnimationValue {
  name?: string
  value: string
}

function parseAnimationValue(input: string): ParsedAnimationValue[] {
  return input.split(animationCommaRE).map((item) => {
    const value = item.trim()
    const parts = value.split(animationSpaceRE)
    const seen = new Set<string>()
    const parsed: ParsedAnimationValue = { value }

    for (const part of parts) {
      if (!seen.has('direction') && animationDirections.has(part)) {
        seen.add('direction')
      }
      else if (!seen.has('playState') && animationPlayStates.has(part)) {
        seen.add('playState')
      }
      else if (!seen.has('fillMode') && animationFillModes.has(part)) {
        seen.add('fillMode')
      }
      else if (!seen.has('iterationCount') && (animationIterationCounts.has(part) || animationDigitRE.test(part))) {
        seen.add('iterationCount')
      }
      else if (!seen.has('timingFunction') && (animationTimings.has(part) || animationTimingFns.some(fn => part.startsWith(`${fn}(`)))) {
        seen.add('timingFunction')
      }
      else if (!seen.has('duration') && animationTimeRE.test(part)) {
        seen.add('duration')
      }
      else if (!seen.has('delay') && animationTimeRE.test(part)) {
        seen.add('delay')
      }
      else if (!seen.has('name')) {
        parsed.name = part
        seen.add('name')
      }
    }

    return parsed
  })
}

function resolveAnimationPrefix(context: Readonly<RuleContext<Theme>>) {
  const configuredPrefixes = context.generator.config.presets
    .flatMap(preset => Array.isArray(preset.prefix) ? preset.prefix : [preset.prefix])
    .filter((prefix): prefix is string => Boolean(prefix))

  if (configuredPrefixes.length === 0)
    return ''

  const rawSegment = context.rawSelector.split(':').at(-1) ?? context.rawSelector
  const currentSegment = context.currentSelector.split(':').at(-1) ?? context.currentSelector

  return configuredPrefixes.find(prefix => rawSegment === `${prefix}${currentSegment}`) ?? configuredPrefixes[0]
}

export const animations: Rule<Theme>[] = [
  [/^animate-(.+)$/, ([, name], context) => {
    const animationValue = context.theme.animation?.[name]
    if (animationValue != null) {
      const parsedAnimations = parseAnimationValue(animationValue)
      const prefix = resolveAnimationPrefix(context)
      const keyframes = context.theme.keyframes ?? {}

      return [
        ...parsedAnimations.flatMap((item) => {
          if (item.name == null || keyframes[item.name] == null)
            return []
          return [`@keyframes ${prefix}${item.name}${keyframes[item.name]}`]
        }),
        {
          animation: parsedAnimations.map((item) => {
            if (item.name == null || keyframes[item.name] == null)
              return item.value
            return item.value.replace(new RegExp(`\\b${escapeRegExp(item.name)}\\b`, 'g'), `${prefix}${item.name}`)
          }).join(', '),
        },
      ]
    }

    const value = h.bracket.cssvar(name)
    if (value != null)
      return { animation: value }
  }, { autocomplete: 'animate-$animation' }],
  ['animate-none', { animation: 'none' }],
]
