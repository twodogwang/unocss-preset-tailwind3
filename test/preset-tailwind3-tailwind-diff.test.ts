import type { UserConfig } from '@unocss/core'
import { createGenerator, escapeSelector } from '@unocss/core'
import postcss from 'postcss'
import presetTailwind3 from '../src/index'
import tailwindcss from 'tailwindcss'
import { describe, expect, it } from 'vitest'
import { borderWidthFixtures, roundedFixtures } from './fixtures/tailwind-border-rewrite'
import { leadingFixtures, leadingTextShorthandRegressionFixtures } from './fixtures/tailwind-leading-rewrite'
import { outlineFixtures } from './fixtures/tailwind-outline-rewrite'
import { strokeFixtures } from './fixtures/tailwind-stroke-rewrite'
import { trackingFixtures } from './fixtures/tailwind-tracking-rewrite'
import { textFixtures } from './fixtures/tailwind-text-rewrite'

const tailwindSentinel = 'hidden'
const tailwindMatchCache = new Map<string, boolean>()

async function getTailwindMatchedSingle(
  input: string,
  tailwindConfig: Record<string, any> = {},
  tailwindEntry = '@tailwind utilities;',
) {
  const cacheKey = JSON.stringify([input, tailwindConfig, tailwindEntry])
  const cached = tailwindMatchCache.get(cacheKey)
  if (cached != null)
    return cached

  const raw = `<div class="${tailwindSentinel} ${input}"></div>`
  const result = await postcss([
    tailwindcss({
      ...tailwindConfig,
      content: [{ raw, extension: 'html' }],
      corePlugins: {
        preflight: false,
      },
    }),
  ]).process(tailwindEntry, { from: undefined })

  let matched = false
  result.root.walkRules((rule) => {
    if (rule.selector !== `.${escapeSelector(tailwindSentinel)}`)
      matched = true
  })

  tailwindMatchCache.set(cacheKey, matched)
  return matched
}

async function getTailwindMatched(
  input: readonly string[],
  tailwindConfig: Record<string, any> = {},
  tailwindEntry = '@tailwind utilities;',
) {
  const matched = await Promise.all(input.map(async item => await getTailwindMatchedSingle(item, tailwindConfig, tailwindEntry) ? item : undefined))
  return new Set(matched.filter(Boolean) as string[])
}

async function getUnoMatched(input: readonly string[], unoConfig: UserConfig = {}) {
  const uno = await createGenerator({
    presets: [presetTailwind3()],
    ...unoConfig,
  })
  const { matched } = await uno.generate(new Set(input), { preflights: false })
  return matched
}

async function expectTailwindParity(
  input: readonly string[],
  options: {
    tailwindConfig?: Record<string, any>
    tailwindEntry?: string
    unoConfig?: UserConfig
  } = {},
) {
  const tailwindMatched = await getTailwindMatched(input, options.tailwindConfig, options.tailwindEntry)
  const unoMatched = await getUnoMatched(input, options.unoConfig)

  expect([...unoMatched].sort()).toEqual([...tailwindMatched].sort())
}

describe('preset-tailwind3 tailwind parity', () => {
  it('matches Tailwind 3 support for strict size / spacing / gap / inset / translate / scroll utilities', async () => {
    await expectTailwindParity([
      'w-4',
      'w-[100px]',
      'min-w-0',
      'max-h-[400px]',
      'p-4',
      'ps-4',
      'pe-6',
      'ms-4',
      'me-6',
      'px-[2rem]',
      'gap-x-2',
      'start-4',
      'end-6',
      'translate-x-[12px]',
      'scroll-ms-4',
      'scroll-me-6',
      'scroll-ps-4',
      'scroll-pe-6',
      'scroll-px-[var(--gap)]',
    ])
  })

  it('rejects loose mini or windicss-style syntax that Tailwind 3 does not support', async () => {
    await expectTailwindParity([
      'min-w0',
      'max-h400px',
      'size-w-4',
      'size-h-8',
      'size-max-w-full',
      'p-1/2',
      'm-1/2',
      'p-auto',
      'p-block-4',
      'm-inline-4',
      'p-bs-4',
      'm-ie-4',
      'p-s-4',
      'm-e-4',
      'block-4',
      'inline-4',
      'min-block-4',
      'gap-x2',
      'gap-row-4',
      'gap-col-4',
      'flex-gap-4',
      'grid-gap-4',
      'inset-inline-4',
      'inset-bs-4',
      'inset-r-4',
      'inset-s-4',
      'translate-4',
      'translate-[12px]',
      'transform-translate-x-4',
      'translate-z-4',
      'scroll-m4',
      'scroll-p4',
      'scroll-mx2',
      'scroll-px2',
      'scroll-m-1/2',
      'scroll-p-1/2',
      'scroll-m-auto',
      'scroll-p-auto',
      'scroll-ma-4',
      'scroll-pa-4',
      'scroll-m-s-4',
      'scroll-p-e-4',
    ])
  })

  it('matches Tailwind 3 for theme-driven spacing extensions', async () => {
    await expectTailwindParity([
      'w-128',
      'gap-gutter',
      'translate-x-gutter',
      'scroll-mx-gutter',
    ], {
      tailwindConfig: {
        theme: {
          extend: {
            spacing: {
              128: '32rem',
              gutter: '3.25rem',
            },
          },
        },
      },
      unoConfig: {
        theme: {
          spacing: {
            128: '32rem',
            gutter: '3.25rem',
          },
        },
      },
    })
  })

  it('matches Tailwind 3 prefix behavior for high-risk strictness cases', async () => {
    await expectTailwindParity([
      'tw-w-[10px]',
      'tw-w-100px',
      'tw-gap-[3px]',
      'tw-gap-3px',
      'tw-inset-[5px]',
      'tw-inset-5px',
      'tw-translate-x-[12px]',
      'tw-translate-x-12px',
      'tw-font-bold',
      'tw-fontbold',
      'tw-fw-bold',
      'tw-overflow-hidden',
      'tw-of-hidden',
      'tw-z-10',
      'tw-z10',
      'tw-inline-flex',
      'tw-flex-inline',
      'tw-basis-[10px]',
      'tw-flex-basis-10px',
      'tw-grid-flow-row',
      'tw-auto-flow-row',
      'tw-grid-rows-2',
      'tw-rows-2',
      'tw-grid-cols-2',
      'tw-cols-2',
      'tw-blur-sm',
      'tw-filter-blur-sm',
      'tw-drop-shadow',
      'tw-filter-drop-shadow',
      'tw-origin-top-right',
      'tw-transform-origin-top-right',
      'tw-animate-spin',
      'tw-keyframes-spin',
      'tw-animate-duration-500',
      'tw-bg-gradient-to-r',
      'tw-bg-gradient-linear',
      'tw-from-red-500',
      'tw-bg-gradient-from-red-500',
      'tw-opacity-50',
      'tw-op50',
      'tw-divide-x',
      'tw-dividex',
      'tw-divide-y-2',
      'tw-dividey2',
      'tw-divide-opacity-50',
      'tw-divide-op50',
    ], {
      tailwindConfig: {
        prefix: 'tw-',
      },
      unoConfig: {
        presets: [presetTailwind3({ prefix: 'tw-' })],
      },
    })
  })

  it('matches Tailwind 3 support for border / ring / decoration utilities', async () => {
    await expectTailwindParity([
      'border',
      'border-2',
      'border-none',
      'border-s-2',
      'border-[#fff]',
      'border-opacity-50',
      'border-red-500/50',
      ...roundedFixtures.canonical,
      'rounded-lt-lg',
      'rounded-rt-lg',
      'ring',
      'ring-2',
      'ring-[3px]',
      'ring-[#fff]',
      'ring-blue-500/50',
      'ring-opacity-50',
      'ring-offset-2',
      'ring-offset-[3px]',
      'ring-offset-red-500',
      'ring-inset',
      'decoration-2',
      'decoration-[3px]',
      'decoration-auto',
      'decoration-from-font',
      'decoration-red-500',
      'decoration-[#fff]',
      'decoration-dashed',
      'decoration-wavy',
      'underline-offset-4',
    ])
  })

  it('matches strict border width fixtures', async () => {
    await expectTailwindParity(borderWidthFixtures.canonical)
  })

  it('rejects non-tailwind border / ring / decoration aliases and extensions', async () => {
    await expectTailwindParity([
      'ring-offset',
      ...borderWidthFixtures.invalid,
      ...roundedFixtures.invalid,
      'border-color-red-500',
      'border-s-color-red-500',
      'border-op50',
      'border-s-none',
      'border-x-none',
      'border-t-none',
      'border-inline-2',
      'border-block-2',
      'border-is-2',
      'border-x-dashed',
      'border-t-dashed',
      'border-style-dashed',
      'border-rounded-md',
      'ring-op50',
      'ring-width-2',
      'ring-size-2',
      'ring-offset-op50',
      'ring-offset-opacity-50',
      'decoration-none',
      'decoration-underline',
      'decoration-offset-4',
      'decoration-op50',
      'decoration-opacity-50',
      'underline-2',
      'underline-[3px]',
      'underline-auto',
      'underline-dashed',
      'underline-wavy',
    ])
  })

  it('matches Tailwind 3 support for shadow utilities', async () => {
    await expectTailwindParity([
      'shadow',
      'shadow-md',
      'shadow-inner',
      'shadow-none',
      'shadow-red-500',
      'shadow-[#000]',
    ])
  })

  it('rejects non-tailwind shadow aliases and opacity shortcuts', async () => {
    await expectTailwindParity([
      'shadow-op50',
      'shadow-opacity-50',
      'shadow-inset',
    ])
  })

  it('matches Tailwind 3 support for outline and transition utilities', async () => {
    await expectTailwindParity([
      ...outlineFixtures.canonical,
      'transition',
      'transition-all',
      'transition-colors',
      'transition-opacity',
      'transition-shadow',
      'transition-transform',
      'transition-none',
      'transition-[height]',
      'transition-[height,opacity]',
      'duration-200',
      'delay-75',
      'ease-linear',
      'ease-in',
      'ease-out',
      'ease-in-out',
      'ease-[cubic-bezier(0.4,0,0.2,1)]',
    ])
  })

  it('rejects non-tailwind outline and transition aliases', async () => {
    await expectTailwindParity([
      ...outlineFixtures.invalid,
      'property-opacity',
      'transition-property-opacity',
      'transition-200',
      'transition-all-200',
      'transition-delay-75',
      'transition-ease-linear',
      'transition-discrete',
      'transition-normal',
    ])
  })

  it('matches Tailwind 3 support for text utilities', async () => {
    await expectTailwindParity(textFixtures.canonical)
  })

  it('rejects non-tailwind text aliases and legacy size shortcuts', async () => {
    await expectTailwindParity(textFixtures.invalid)
  })

  it('matches Tailwind 3 support for leading utilities', async () => {
    await expectTailwindParity(leadingFixtures.canonical)
  })

  it('rejects non-tailwind leading aliases and bare length shortcuts', async () => {
    await expectTailwindParity(leadingFixtures.invalid)
  })

  it('preserves Tailwind parity for text shorthand while leading is rewritten', async () => {
    await expectTailwindParity(leadingTextShorthandRegressionFixtures)
  })

  it('matches Tailwind 3 support for tracking utilities', async () => {
    await expectTailwindParity(trackingFixtures.canonical)
  })

  it('rejects non-tailwind tracking aliases and bare length shortcuts', async () => {
    await expectTailwindParity(trackingFixtures.invalid)
  })

  it('matches Tailwind 3 support for background / svg / accent / caret color utilities', async () => {
    await expectTailwindParity([
      '[color:#fff]',
      'bg-red-500',
      'bg-[#fff]',
      'bg-opacity-50',
      '[background-color:#fff]',
      'fill-red-500',
      'fill-[#fff]',
      'accent-[#fff]',
      'caret-[#fff]',
    ])
  })

  it('rejects non-tailwind color aliases and bare color shortcuts', async () => {
    await expectTailwindParity([
      'color-#fff',
      'c-#fff',
      'bg-#fff',
      'bg-red500',
      'bg-op50',
      'bg-op-50',
      'fill-#fff',
      'fill-red500',
      'fill-opacity-50',
      'fill-op50',
      'accent-#fff',
      'accent-red500',
      'accent-opacity-50',
      'accent-op50',
      'caret-#fff',
      'caret-red500',
      'caret-opacity-50',
      'caret-op50',
    ])
  })

  it('matches official Tailwind 3 stroke utilities', async () => {
    await expectTailwindParity(strokeFixtures.canonical)
  })

  it('rejects non-tailwind stroke aliases and bare color shortcuts', async () => {
    await expectTailwindParity(strokeFixtures.invalid)
  })

  it('matches Tailwind 3 support for background positioning and gradient stop position utilities', async () => {
    await expectTailwindParity([
      'bg-clip-border',
      'bg-clip-content',
      'bg-clip-padding',
      'bg-clip-text',
      'bg-origin-border',
      'bg-origin-content',
      'bg-origin-padding',
      'bg-repeat',
      'bg-repeat-round',
      'bg-repeat-space',
      'bg-repeat-x',
      'bg-repeat-y',
      'bg-gradient-to-r',
      'from-blue-500',
      'from-10%',
      'via-cyan-500',
      'via-30%',
      'to-emerald-500',
      'to-90%',
    ])
  })

  it('rejects non-tailwind background global keyword shortcuts', async () => {
    await expectTailwindParity([
      'bg-clip-inherit',
      'bg-clip-initial',
      'bg-origin-inherit',
      'bg-origin-initial',
      'bg-repeat-inherit',
      'bg-repeat-initial',
    ])
  })

  it('matches Tailwind 3 support for typography, layout, variant, and container edge cases', async () => {
    await expectTailwindParity([
      'hyphens-auto',
      'hyphens-manual',
      'hyphens-none',
      'flex-shrink-0',
      '*:p-4',
    ])
  })

  it('rejects non-tailwind pseudo chaining syntax', async () => {
    await expectTailwindParity([
      'hover-focus:bg-red-500',
    ])
  })

  it('matches Tailwind 3 support for container with max breakpoint variants', async () => {
    await expectTailwindParity([
      'container',
      'sm:container',
      'md:container',
      'lg:container',
      'max-md:container',
    ], {
      tailwindEntry: '@tailwind components; @tailwind utilities;',
    })
  })
})
