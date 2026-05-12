import { createGenerator } from '@unocss/core'
import { createAutocomplete } from '@unocss/autocomplete'
import { presetWind3 } from '@unocss/preset-wind3'

import { tailwindUtilitySpecs } from '../../test/tailwind-utility-spec.ts'

const bareHexUtilities = [
  'text',
  'bg',
  'border',
  'border-x',
  'border-y',
  'border-t',
  'border-r',
  'border-b',
  'border-l',
  'border-s',
  'border-e',
  'ring',
  'ring-offset',
  'outline',
  'decoration',
  'divide',
  'from',
  'via',
  'to',
  'fill',
  'stroke',
  'accent',
  'caret',
]

const bareLengthUtilities = [
  'border',
  'border-x',
  'border-y',
  'border-t',
  'border-r',
  'border-b',
  'border-l',
  'border-s',
  'border-e',
  'rounded',
  'rounded-t',
  'rounded-r',
  'rounded-b',
  'rounded-l',
  'rounded-s',
  'rounded-e',
  'outline',
  'outline-offset',
  'gap',
  'gap-x',
  'gap-y',
  'space-x',
  'space-y',
  'border-spacing',
  'border-spacing-x',
  'border-spacing-y',
  'text',
  'leading',
  'tracking',
  'align',
]

const opacityShortcutUtilities = [
  'bg',
  'border',
  'ring',
  'divide',
]

const prefixAliases = [
  ['text-color-red-500', 'text-red-500'],
  ['border-color-red-500', 'border-red-500'],
  ['border-s-color-red-500', 'border-s-red-500'],
  ['outline-color-red-500', 'outline-red-500'],
  ['outline-width-2', 'outline-2'],
  ['outline-style-dashed', 'outline-dashed'],
  ['ring-width-2', 'ring-2'],
  ['ring-size-2', 'ring-2'],
  ['stroke-width-2', 'stroke-2'],
  ['stroke-size-2', 'stroke-2'],
  ['transition-delay-75', 'delay-75'],
  ['transition-ease-linear', 'ease-linear'],
]

function candidate(id, family, utility, token, expectedReplacement, source) {
  return {
    id,
    family,
    utility,
    token,
    expectedReplacement,
    source,
  }
}

function utilityFromToken(token) {
  return token.split('-')[0]
}

function unique(candidates) {
  const seen = new Set()
  return candidates.filter((item) => {
    if (seen.has(item.token))
      return false
    seen.add(item.token)
    return true
  })
}

export function generateAuditCandidates() {
  const candidates = []

  for (const utility of bareHexUtilities) {
    for (const color of ['#fff', '#eee']) {
      candidates.push(candidate(
        `bare-hex:${utility}:${color}`,
        'color',
        utility,
        `${utility}-${color}`,
        `${utility}-[${color}]`,
        'pattern:bare-hex-color',
      ))
    }
  }

  for (const utility of bareLengthUtilities) {
    for (const value of ['3px', '10px']) {
      candidates.push(candidate(
        `bare-length:${utility}:${value}`,
        'length',
        utility,
        `${utility}-${value}`,
        `${utility}-[${value}]`,
        'pattern:bare-length',
      ))
    }
  }

  for (const utility of opacityShortcutUtilities) {
    for (const value of ['50']) {
      candidates.push(candidate(
        `opacity-shortcut:${utility}:op${value}`,
        'opacity',
        utility,
        `${utility}-op${value}`,
        `${utility}-opacity-${value}`,
        'pattern:opacity-shortcut',
      ))
      candidates.push(candidate(
        `opacity-shortcut:${utility}:op-${value}`,
        'opacity',
        utility,
        `${utility}-op-${value}`,
        `${utility}-opacity-${value}`,
        'pattern:opacity-shortcut',
      ))
    }
  }

  for (const [token, replacement] of prefixAliases) {
    const utility = token.split('-')[0]
    candidates.push(candidate(
      `prefix-alias:${token}`,
      'prefix-alias',
      utility,
      token,
      replacement,
      'pattern:prefix-alias',
    ))
  }

  for (const spec of tailwindUtilitySpecs) {
    for (const token of spec.canonical) {
      candidates.push(candidate(
        `spec:canonical:${spec.id}:${token}`,
        spec.id,
        spec.id,
        token,
        undefined,
        'spec:canonical',
      ))
    }

    for (const token of spec.invalid) {
      candidates.push(candidate(
        `spec:invalid:${spec.id}:${token}`,
        spec.id,
        spec.id,
        token,
        undefined,
        'spec:invalid',
      ))
    }
  }

  return unique(candidates)
}

export async function generateWind3AutocompleteCandidates(options = {}) {
  const uno = await createGenerator({
    presets: [presetWind3(options.presetOptions ?? {})],
    ...(options.unoConfig ?? {}),
  })
  const autocomplete = createAutocomplete(uno, { throwErrors: false })
  const tokens = [...await autocomplete.enumerate()]
    .filter(token => !token.endsWith(':'))
    .filter(token => !token.includes(':'))
    .filter(token => !token.endsWith('-'))
    .filter(token => !token.includes('$'))
    .filter(token => !token.includes('<'))

  return unique(tokens.map(token => candidate(
    `wind3:autocomplete:${token}`,
    utilityFromToken(token),
    utilityFromToken(token),
    token,
    undefined,
    'wind3:autocomplete',
  )))
}

export async function generateFullAuditCandidates(options = {}) {
  if (options.includeWind3Autocomplete === false)
    return generateAuditCandidates()

  return unique([
    ...generateAuditCandidates(),
    ...await generateWind3AutocompleteCandidates(options.wind3Autocomplete ?? {}),
  ])
}
