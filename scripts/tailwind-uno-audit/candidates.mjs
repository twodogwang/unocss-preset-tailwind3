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

  return unique(candidates)
}
