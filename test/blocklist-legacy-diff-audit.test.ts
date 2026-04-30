import { describe, expect, it } from 'vitest'

import { createBlocklist } from '../src/blocklist'
import { getBlocklistMigrationReplacement } from '../src/blocklist-migration'
import { tailwindUtilitySpecs } from './tailwind-utility-spec'

interface LegacyDiffAuditSpec {
  specId: string
  blockedOnly?: string[]
  ignored?: string[]
}

const legacyDiffAuditSpecs: LegacyDiffAuditSpec[] = [
  {
    specId: 'animation',
    blockedOnly: [
      'keyframes-spin',
      'animate-name-wiggle',
      'animate-duration-500',
      'animate-delay-75',
      'animate-ease-linear',
      'animate-fill-forwards',
      'animate-direction-reverse',
      'animate-count-infinite',
      'animate-play-paused',
    ],
    ignored: [
      'animate-inherit',
      'animate-initial',
      'animate-revert',
    ],
  },
  {
    specId: 'appearance',
    ignored: [
      'appearance-inherit',
      'appearance-initial',
      'appearance-revert',
      'appearance-button',
      'appearance-textfield',
    ],
  },
  {
    specId: 'will-change',
    ignored: [
      'will-change-inherit',
      'will-change-initial',
      'will-change-revert',
      'will-change-opacity',
      'will-change-scroll-position',
    ],
  },
  {
    specId: 'overscroll',
    ignored: [
      'overscroll-inherit',
      'overscroll-initial',
      'overscroll-revert',
      'overscroll-x-inherit',
      'overscroll-y-initial',
    ],
  },
  {
    specId: 'scroll-behavior',
    ignored: [
      'scroll-inherit',
      'scroll-initial',
      'scroll-revert',
    ],
  },
  {
    specId: 'touch-action',
    ignored: [
      'touch-inherit',
      'touch-initial',
      'touch-revert',
    ],
  },
  {
    specId: 'list-style',
    ignored: [
      'list-circle',
      'list-square',
      'list-decimal-inside',
      'list-greek',
      'list-roman',
      'list-inherit',
      'list-image-url(/img/marker.svg)',
    ],
  },
  {
    specId: 'image-rendering',
    ignored: [
      'image-render-auto',
      'image-render-edge',
      'image-render-pixel',
    ],
  },
  {
    specId: 'cursor-pointer-events-resize-user-select',
    ignored: [
      'cursor-inherit',
      'cursor-initial',
      'pointer-events-inherit',
      'pointer-events-initial',
      'resize-inherit',
      'resize-initial',
      'select-inherit',
      'select-initial',
    ],
  },
  {
    specId: 'white-space-breaks-hyphens-content-visibility-contents-field-sizing-color-scheme',
    ignored: [
      'ws-nowrap',
      'whitespace-inherit',
      'break-anywhere',
      'content-empty',
      'content-visibility-auto',
      'content-visibility-hidden',
      'field-sizing-fixed',
      'field-sizing-content',
      'color-scheme-dark',
      'color-scheme-light',
    ],
  },
  {
    specId: 'display',
    ignored: [
      'display-[none]',
      'display-[inherit]',
      'display-[var(--display)]',
    ],
  },
  {
    specId: 'overflow',
    ignored: [
      'overflow-overlay',
      'overflow-inherit',
      'overflow-initial',
      'overflow-unset',
      'overflow-revert',
      'overflow-revert-layer',
      'overflow-x-overlay',
      'overflow-x-inherit',
      'overflow-y-overlay',
      'overflow-y-revert',
    ],
  },
  {
    specId: 'position-float-z-order-box-sizing',
    ignored: [
      'order-999',
      'order-inherit',
      'z-inherit',
      'z-initial',
      'float-inherit',
      'clear-inherit',
      'box-inherit',
      'box-initial',
    ],
  },
  {
    specId: 'container',
    ignored: [
      'container-normal',
      'container-size',
      'container-inline-size',
      '@container',
      '@container/sidebar',
      '@container-normal',
      '@container-size',
      '@container-inline-size',
    ],
  },
  {
    specId: 'columns',
    ignored: [
      'columns-layout',
      'break-before-inherit',
      'break-before-initial',
      'break-inside-revert',
      'break-inside-unset',
      'break-after-initial',
      'break-after-revert-layer',
    ],
  },
  {
    specId: 'flex',
    ignored: [
      'flexrow',
    ],
  },
  {
    specId: 'table-display-caption-collapse',
    ignored: [
      'table-inline',
      'table-empty-cells-visible',
      'table-empty-cells-hidden',
      'border-collapse-inherit',
      'caption-initial',
    ],
  },
  {
    specId: 'grid',
    ignored: [
      'grid-flowcol',
      'colspan-2',
      'rowstart-2',
      'grid-cols-minmax-200px',
      'grid-areas-layout',
      'grid-area-sidebar',
    ],
  },
  {
    specId: 'justify-align-place-flex-grid-prefixes',
    ignored: [
      'justify-left',
      'justify-right',
      'justify-center-safe',
      'justify-inherit',
      'justify-items-baseline',
      'justify-items-end-safe',
      'justify-self-baseline',
      'justify-self-end-safe',
      'content-center-safe',
      'content-initial',
      'items-baseline-last',
      'items-end-safe',
      'items-revert',
      'self-center-safe',
      'self-inherit',
      'place-content-center-safe',
      'place-content-normal',
      'place-items-center-safe',
      'place-items-normal',
      'place-self-end-safe',
      'place-self-baseline',
    ],
  },
  {
    specId: 'transform',
    blockedOnly: [
      'perspective-500',
      'preserve-3d',
    ],
    ignored: [
      'origin-tl',
      'origin-top-center',
      'translate-4',
      'translate-[12px]',
      'translate-z-4',
      'translate-x-1/5',
      'rotate13',
      'rotate-x-45',
      'rotate-z-45',
      'rotate-13',
      'skew-6',
      'skewy-6',
      'skew-y-7',
      'scale-z-75',
      'scale111',
      'scale-111',
      'transform-inherit',
    ],
  },
  {
    specId: 'filters-backdrop-filters',
    blockedOnly: [
      'drop-shadow-color-red-500',
    ],
    ignored: [
      'blur-3px',
      'brightness-76',
      'contrast-120',
      'grayscale-50',
      'hue-rotate-13',
      'invert-50',
      'saturate-175',
      'sepia-50',
      'backdrop-blur-3px',
      'backdrop-brightness-76',
      'backdrop-grayscale-50',
      'backdrop-hue-rotate-13',
      'backdrop-invert-50',
      'backdrop-opacity-13',
      'backdrop-saturate-175',
      'backdrop-sepia-50',
      'filter-inherit',
      'backdrop-filter-revert',
    ],
  },
  {
    specId: 'aspect-ratio',
    ignored: [
      'aspect-square/2',
      'aspect-none',
    ],
  },
  {
    specId: 'size',
    blockedOnly: [
      'size-w-4',
      'size-h-8',
    ],
    ignored: [
      'w-xs',
      'h-sm',
      'min-w-screen',
      'min-w-none',
      'min-h-none',
      'min-h-xs',
      'max-w-screen',
      'max-h-xs',
      'w-screen-md',
      'min-w-screen-md',
      'h-screen-sm',
      'min-h-screen-sm',
      'size-screen',
      'size-svh',
      'size-dvh',
      'size-min-4',
      'size-max-4',
    ],
  },
  {
    specId: 'background-color',
    ignored: [
      'bg-red500',
      'bgred500',
    ],
  },
  {
    specId: 'accent',
    ignored: [
      'accent-red500',
      'accent-opacity-50',
      'accent-op50',
    ],
  },
  {
    specId: 'caret',
    ignored: [
      'caret-red500',
      'caret-opacity-50',
      'caret-op50',
    ],
  },
  {
    specId: 'background-style',
    blockedOnly: [
      'bg-gradient-linear',
      'bg-gradient-from-red-500',
      'bg-gradient-via-cyan-500',
      'bg-gradient-to-emerald-500',
      'bg-gradient-shape-r',
      'bg-gradient-stops-3',
      'shape-r',
    ],
    ignored: [
      'bg-clip-inherit',
      'bg-clip-initial',
      'bg-origin-inherit',
      'bg-origin-initial',
      'bg-repeat-inherit',
      'bg-repeat-initial',
    ],
  },
  {
    specId: 'border-width',
    ignored: [
      'borderx',
    ],
  },
  {
    specId: 'border-radius',
    ignored: [
      'rounded-10px',
      'roundedt-lg',
      'rounded-lt-lg',
      'rounded-rt-lg',
      'border-rounded-md',
    ],
  },
  {
    specId: 'decoration',
    ignored: [
      'decoration-op50',
      'decoration-opacity-50',
    ],
  },
  { specId: 'text-decoration' },
  {
    specId: 'text-indent',
    ignored: [
      'indent',
      'indent-1/2',
      '-indent-1/2',
      'indent-full',
      'indentx-4',
    ],
  },
  { specId: 'text-wrap-overflow-transform' },
  { specId: 'line-clamp' },
  {
    specId: 'text-shadow',
    blockedOnly: [
      'text-shadow',
      'text-shadow-sm',
      'text-shadow-md',
      'text-shadow-lg',
      'text-shadow-xl',
      'text-shadow-red-500',
      'text-shadow-[#fff]',
      'text-shadow-color-red-500',
      'text-shadow-color-[#fff]',
      'text-shadow-color-opacity-50',
      'text-shadow-color-op50',
    ],
  },
  {
    specId: 'text-stroke',
    blockedOnly: [
      'text-stroke-red-500',
      'text-stroke-opacity-50',
      'text-stroke-op50',
    ],
  },
  {
    specId: 'tab-size',
    ignored: [
      '-tab-4',
      'tab-size-4',
      'tab-1/2',
    ],
  },
  {
    specId: 'divide',
    ignored: [
      'divide-block',
      'divide-inline',
      'divide-block-reverse',
    ],
  },
  {
    specId: 'fill',
    ignored: [
      'fill-red500',
      'fill-opacity-50',
      'fill-op50',
    ],
  },
  {
    specId: 'font-variant-numeric',
    ignored: [
      'font-variant-numeric-normal',
      'font-variant-numeric-ordinal',
      'tabular',
      'oldstyle',
    ],
  },
  {
    specId: 'font',
    blockedOnly: [
      'fontbold',
    ],
  },
  {
    specId: 'text-align',
    ignored: [
      'text-align-inherit',
    ],
  },
  {
    specId: 'vertical-align',
    ignored: [
      'align-inherit',
      'align-(--my-alignment)',
    ],
  },
  {
    specId: 'outline',
    ignored: [
      'outline-3px',
      'outline-offset-3px',
      'outline-offset-none',
      'outline-hidden',
      'outline-initial',
      'outline-op50',
      'outline-opacity-50',
    ],
  },
  {
    specId: 'ring',
    ignored: [
      'ring-offset',
      'ring-offset-op50',
      'ring-offset-opacity-50',
    ],
  },
  {
    specId: 'shadow',
    ignored: [
      'shadow-op50',
      'shadow-opacity-50',
    ],
  },
  {
    specId: 'border-spacing-space',
    ignored: [
      'space-inline-4',
      'space-block-4',
      'space-inline-reverse',
      'space-block-reverse',
    ],
  },
  {
    specId: 'gap-inset-scroll',
    ignored: [
      'gap-x2',
      'inset-inline-4',
      'inset-bs-4',
      'scroll-mx2',
      'scroll-m-auto',
      'scroll-p-auto',
    ],
  },
  { specId: 'padding-margin' },
  {
    specId: 'stroke',
    ignored: [
      'stroke-red500',
      'stroke-opacity-50',
      'stroke-op50',
    ],
  },
  {
    specId: 'transition',
    ignored: [
      'transition-200',
      'transition-all-200',
      'transition-discrete',
      'transition-normal',
    ],
  },
  {
    specId: 'text',
    ignored: [
      'text-red500',
    ],
  },
  { specId: 'leading' },
  {
    specId: 'tracking',
    ignored: [
      'letter-spacing-wide',
    ],
  },
] as const

const blocklistRules = createBlocklist()

function isBlockedByBlocklist(token: string) {
  return blocklistRules.some((rule) => {
    const [matcher] = Array.isArray(rule) ? rule : [rule]
    if (typeof matcher === 'string')
      return matcher === token
    if (matcher instanceof RegExp)
      return matcher.test(token)
    if (typeof matcher === 'function')
      return Boolean(matcher(token))
    return false
  })
}

function getSpec(id: string) {
  return tailwindUtilitySpecs.find(spec => spec.id === id)
}

function sortTokens(tokens: readonly string[]) {
  return [...tokens].sort()
}

function classifyTokens(tokens: readonly string[]) {
  const migratable: string[] = []
  const blockedOnly: string[] = []
  const ignored: string[] = []

  for (const token of tokens) {
    const replacement = getBlocklistMigrationReplacement(token)
    if (replacement) {
      migratable.push(token)
      continue
    }

    if (isBlockedByBlocklist(token))
      blockedOnly.push(token)
    else
      ignored.push(token)
  }

  return {
    migratable,
    blockedOnly,
    ignored,
  }
}

describe('blocklist legacy diff audit', () => {
  it('audits every utility family in the shared utility spec', () => {
    const specIds = tailwindUtilitySpecs.map(spec => spec.id)
    expect(sortTokens(legacyDiffAuditSpecs.map(spec => spec.specId))).toEqual(sortTokens(specIds))
  })

  it('classifies audited wind3-to-tailwind3 diff tokens', () => {
    for (const auditSpec of legacyDiffAuditSpecs) {
      const spec = getSpec(auditSpec.specId)
      expect(spec, `${auditSpec.specId} spec should exist`).toBeTruthy()

      const invalid = spec?.invalid ?? []
      const classified = classifyTokens(invalid)
      const expectedBlockedOnly = auditSpec.blockedOnly ?? []
      const expectedIgnored = auditSpec.ignored ?? []
      const expectedMigratable = invalid.filter(token => !expectedBlockedOnly.includes(token) && !expectedIgnored.includes(token))

      expect(sortTokens(classified.blockedOnly)).toEqual(sortTokens(expectedBlockedOnly))
      expect(sortTokens(classified.ignored)).toEqual(sortTokens(expectedIgnored))
      expect(sortTokens(classified.migratable)).toEqual(sortTokens(expectedMigratable))
    }
  })
})
