import type { UserConfig } from '@unocss/core'
import { createGenerator, escapeSelector } from '@unocss/core'
import postcss from 'postcss'
import presetTailwind3 from '../src/index'
import tailwindcss from 'tailwindcss'
import { describe, expect, it } from 'vitest'
import { backgroundColorFixtures } from './fixtures/tailwind-background-color-rewrite'
import { accentFixtures } from './fixtures/tailwind-accent-rewrite'
import { animationFixtures } from './fixtures/tailwind-animation-rewrite'
import { appearanceFixtures } from './fixtures/tailwind-appearance-rewrite'
import { aspectRatioFixtures } from './fixtures/tailwind-aspect-ratio-rewrite'
import { caretFixtures } from './fixtures/tailwind-caret-rewrite'
import { backgroundStyleFixtures } from './fixtures/tailwind-background-style-rewrite'
import { borderWidthFixtures, roundedFixtures } from './fixtures/tailwind-border-rewrite'
import { containerFixtures } from './fixtures/tailwind-container-rewrite'
import { columnsFixtures } from './fixtures/tailwind-columns-rewrite'
import { decorationFixtures } from './fixtures/tailwind-decoration-rewrite'
import { displayFixtures } from './fixtures/tailwind-display-rewrite'
import { textDecorationFixtures } from './fixtures/tailwind-text-decoration-rewrite'
import { divideFixtures } from './fixtures/tailwind-divide-rewrite'
import { filtersFixtures } from './fixtures/tailwind-filters-rewrite'
import { flexFixtures } from './fixtures/tailwind-flex-rewrite'
import { fillFixtures } from './fixtures/tailwind-fill-rewrite'
import { fontFixtures } from './fixtures/tailwind-font-rewrite'
import { fontVariantNumericFixtures } from './fixtures/tailwind-font-variant-numeric-rewrite'
import { gridFixtures } from './fixtures/tailwind-grid-rewrite'
import { imageRenderingFixtures } from './fixtures/tailwind-image-rendering-rewrite'
import { justifyAlignPlaceFixtures } from './fixtures/tailwind-justify-align-place-rewrite'
import { leadingFixtures, leadingTextShorthandRegressionFixtures } from './fixtures/tailwind-leading-rewrite'
import { lineClampFixtures } from './fixtures/tailwind-line-clamp-rewrite'
import { listStyleFixtures } from './fixtures/tailwind-list-style-rewrite'
import { outlineFixtures } from './fixtures/tailwind-outline-rewrite'
import { overflowFixtures } from './fixtures/tailwind-overflow-rewrite'
import { overscrollFixtures } from './fixtures/tailwind-overscroll-rewrite'
import { positionFloatZOrderBoxSizingFixtures } from './fixtures/tailwind-position-float-z-order-box-sizing-rewrite'
import { ringFixtures } from './fixtures/tailwind-ring-rewrite'
import { shadowFixtures } from './fixtures/tailwind-shadow-rewrite'
import { sizeFixtures } from './fixtures/tailwind-size-rewrite'
import { scrollBehaviorFixtures } from './fixtures/tailwind-scroll-behavior-rewrite'
import { borderSpacingSpaceFixtures } from './fixtures/tailwind-spacing-border-spacing-space-rewrite'
import { gapInsetScrollFixtures } from './fixtures/tailwind-spacing-gap-inset-scroll-rewrite'
import { paddingMarginFixtures } from './fixtures/tailwind-spacing-padding-margin-rewrite'
import { strokeFixtures } from './fixtures/tailwind-stroke-rewrite'
import { textAlignFixtures } from './fixtures/tailwind-text-align-rewrite'
import { textIndentFixtures } from './fixtures/tailwind-text-indent-rewrite'
import { textShadowFixtures } from './fixtures/tailwind-text-shadow-rewrite'
import { textStrokeFixtures } from './fixtures/tailwind-text-stroke-rewrite'
import { transformFixtures } from './fixtures/tailwind-transform-rewrite'
import { tabSizeFixtures } from './fixtures/tailwind-tab-size-rewrite'
import { touchActionFixtures } from './fixtures/tailwind-touch-action-rewrite'
import { textWrapOverflowTransformFixtures } from './fixtures/tailwind-text-wrap-overflow-transform-rewrite'
import { verticalAlignFixtures } from './fixtures/tailwind-vertical-align-rewrite'
import { trackingFixtures } from './fixtures/tailwind-tracking-rewrite'
import { transitionFixtures } from './fixtures/tailwind-transition-rewrite'
import { textFixtures } from './fixtures/tailwind-text-rewrite'
import { tableFixtures } from './fixtures/tailwind-table-rewrite'
import { willChangeFixtures } from './fixtures/tailwind-will-change-rewrite'

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

describe('preset-tailwind3 tailwind parity', { timeout: 30000 }, () => {
  it('matches Tailwind 3 support for strict size / spacing / gap / inset / translate / scroll utilities', async () => {
    await expectTailwindParity([
      ...sizeFixtures.canonical,
      'w-[100px]',
      'max-h-[400px]',
      'translate-x-[12px]',
    ])
  })

  it('rejects loose mini or windicss-style syntax that Tailwind 3 does not support', async () => {
    await expectTailwindParity([
      ...sizeFixtures.invalid,
      'flex-gap-4',
      'grid-gap-4',
      'translate-4',
      'translate-[12px]',
      'transform-translate-x-4',
      'translate-z-4',
    ])
  })

  it('matches Tailwind 3 support for gap / inset / scroll utilities', async () => {
    await expectTailwindParity(gapInsetScrollFixtures.canonical)
  })

  it('matches Tailwind 3 support for aspect-ratio utilities', async () => {
    await expectTailwindParity(aspectRatioFixtures.canonical)
  })

  it('rejects non-tailwind aspect-ratio aliases and raw ratio shorthands', async () => {
    await expectTailwindParity(aspectRatioFixtures.invalid)
  })

  it('matches Tailwind 3 for theme-driven aspect-ratio extensions', async () => {
    await expectTailwindParity([
      'aspect-card',
      'aspect-golden',
    ], {
      tailwindConfig: {
        theme: {
          extend: {
            aspectRatio: {
              card: '4 / 3',
              golden: '1.618 / 1',
            },
          },
        },
      },
      unoConfig: {
        theme: {
          aspectRatio: {
            card: '4 / 3',
            golden: '1.618 / 1',
          },
        },
      },
    })
  })

  it('matches Tailwind 3 support for display utilities', async () => {
    await expectTailwindParity(displayFixtures.canonical.filter(item => item !== 'hidden'))
  })

  it('rejects non-tailwind display aliases and arbitrary values', async () => {
    await expectTailwindParity(displayFixtures.invalid)
  })

  it('matches Tailwind 3 support for overflow utilities', async () => {
    await expectTailwindParity(overflowFixtures.canonical)
  })

  it('rejects non-tailwind overflow aliases and legacy keywords', async () => {
    await expectTailwindParity(overflowFixtures.invalid)
  })

  it('matches Tailwind 3 support for position / float / z / order / box-sizing utilities', async () => {
    await expectTailwindParity(positionFloatZOrderBoxSizingFixtures.canonical)
  })

  it('matches Tailwind 3 support for flex utilities', async () => {
    await expectTailwindParity(flexFixtures.canonical)
  })

  it('matches Tailwind 3 support for grid utilities', async () => {
    await expectTailwindParity(gridFixtures.canonical)
  })

  it('matches Tailwind 3 support for justify / align / place utilities', async () => {
    await expectTailwindParity(justifyAlignPlaceFixtures.canonical)
  })

  it('matches Tailwind 3 support for transform utilities', async () => {
    await expectTailwindParity(transformFixtures.canonical)
  })

  it('matches Tailwind 3 support for filters / backdrop-filters utilities', async () => {
    await expectTailwindParity(filtersFixtures.canonical)
  })

  it('matches Tailwind 3 for theme-driven flex grow / shrink / basis extensions', async () => {
    await expectTailwindParity([
      'grow-2',
      'shrink-2',
      'basis-sidebar',
    ], {
      tailwindConfig: {
        theme: {
          extend: {
            flexGrow: {
              2: '2',
            },
            flexShrink: {
              2: '2',
            },
            flexBasis: {
              sidebar: '18rem',
            },
          },
        },
      },
      unoConfig: {
        theme: {
          flexGrow: {
            2: '2',
          },
          flexShrink: {
            2: '2',
          },
          flexBasis: {
            sidebar: '18rem',
          },
        } as any,
      },
    })
  })

  it('matches Tailwind 3 for theme-driven grid extensions', async () => {
    await expectTailwindParity([
      'grid-cols-dashboard',
      'grid-rows-layout',
      'auto-cols-sidebar',
      'auto-rows-card',
      'col-sidebar',
      'row-stack',
      'col-start-sidebar',
      'col-end-sidebar',
      'row-start-sidebar',
      'row-end-sidebar',
    ], {
      tailwindConfig: {
        theme: {
          extend: {
            gridTemplateColumns: {
              dashboard: '240px minmax(0, 1fr)',
            },
            gridTemplateRows: {
              layout: 'auto minmax(0, 1fr)',
            },
            gridAutoColumns: {
              sidebar: '18rem',
            },
            gridAutoRows: {
              card: '12rem',
            },
            gridColumn: {
              sidebar: '2 / span 2',
            },
            gridRow: {
              stack: 'span 2 / span 2',
            },
            gridColumnStart: {
              sidebar: '14',
            },
            gridColumnEnd: {
              sidebar: '16',
            },
            gridRowStart: {
              sidebar: '8',
            },
            gridRowEnd: {
              sidebar: '10',
            },
          },
        },
      },
      unoConfig: {
        theme: {
          gridTemplateColumns: {
            dashboard: '240px minmax(0, 1fr)',
          },
          gridTemplateRows: {
            layout: 'auto minmax(0, 1fr)',
          },
          gridAutoColumns: {
            sidebar: '18rem',
          },
          gridAutoRows: {
            card: '12rem',
          },
          gridColumn: {
            sidebar: '2 / span 2',
          },
          gridRow: {
            stack: 'span 2 / span 2',
          },
          gridColumnStart: {
            sidebar: '14',
          },
          gridColumnEnd: {
            sidebar: '16',
          },
          gridRowStart: {
            sidebar: '8',
          },
          gridRowEnd: {
            sidebar: '10',
          },
        } as any,
      },
    })
  })

  it('matches Tailwind 3 for theme-driven order and z-index extensions', async () => {
    await expectTailwindParity([
      'order-sidebar',
      'z-toast',
    ], {
      tailwindConfig: {
        theme: {
          extend: {
            order: {
              sidebar: '13',
            },
            zIndex: {
              toast: '999',
            },
          },
        },
      },
      unoConfig: {
        theme: {
          order: {
            sidebar: '13',
          },
          zIndex: {
            toast: '999',
          },
        },
      },
    })
  })

  it('rejects non-tailwind position-related aliases and global keywords', async () => {
    await expectTailwindParity(positionFloatZOrderBoxSizingFixtures.invalid)
  })

  it('rejects non-tailwind flex aliases and raw shorthand syntax', async () => {
    await expectTailwindParity(flexFixtures.invalid)
  })

  it('rejects non-tailwind grid aliases and extra grid extensions', async () => {
    await expectTailwindParity(gridFixtures.invalid)
  })

  it('rejects non-tailwind justify / align / place aliases and extra extensions', async () => {
    await expectTailwindParity(justifyAlignPlaceFixtures.invalid)
  })

  it('rejects non-tailwind transform aliases and extra extensions', async () => {
    await expectTailwindParity(transformFixtures.invalid)
  })

  it('rejects non-tailwind filters / backdrop-filters aliases and extra extensions', async () => {
    await expectTailwindParity(filtersFixtures.invalid)
  })

  it('rejects non-tailwind gap / inset / scroll aliases and raw shorthand syntax', async () => {
    await expectTailwindParity([
      ...gapInsetScrollFixtures.invalid,
      'gapy8',
      'inset-5px',
      'top-5px',
      '-bottom3',
      'scroll-m-1/2',
      'scroll-p-1/2',
    ])
  })

  it('matches Tailwind 3 support for border-spacing and space utilities', async () => {
    await expectTailwindParity(borderSpacingSpaceFixtures.canonical)
  })

  it('rejects non-tailwind border-spacing and space aliases', async () => {
    await expectTailwindParity(borderSpacingSpaceFixtures.invalid)
  })

  it('matches Tailwind 3 support for padding / margin utilities', async () => {
    await expectTailwindParity([
      ...paddingMarginFixtures.canonical,
      'ms-4',
      'me-6',
      'px-[2rem]',
    ])
  })

  it('rejects non-tailwind padding / margin aliases and raw shorthand syntax', async () => {
    await expectTailwindParity([
      ...paddingMarginFixtures.invalid,
      'p-1/2',
      'm-1/2',
      'p-auto',
      'p-block-4',
      'm-inline-4',
      'p-bs-4',
      'm-ie-4',
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
      ...textDecorationFixtures.canonical,
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

  it('matches Tailwind 3 support for divide utilities', async () => {
    await expectTailwindParity(divideFixtures.canonical)
  })

  it('rejects non-tailwind divide aliases and logical extensions', async () => {
    await expectTailwindParity(divideFixtures.invalid)
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

  it('rejects non-tailwind text-decoration aliases and extensions', async () => {
    await expectTailwindParity(textDecorationFixtures.invalid)
  })

  it('matches Tailwind 3 support for shadow utilities', async () => {
    await expectTailwindParity(shadowFixtures.canonical)
  })

  it('rejects non-tailwind shadow aliases and opacity shortcuts', async () => {
    await expectTailwindParity(shadowFixtures.invalid)
  })

  it('matches Tailwind 3 support for outline utilities', async () => {
    await expectTailwindParity(outlineFixtures.canonical)
  })

  it('rejects non-tailwind outline aliases', async () => {
    await expectTailwindParity(outlineFixtures.invalid)
  })

  it('matches Tailwind 3 support for transition utilities', async () => {
    await expectTailwindParity(transitionFixtures.canonical)
  })

  it('rejects non-tailwind transition aliases', async () => {
    await expectTailwindParity(transitionFixtures.invalid)
  })

  it('matches Tailwind 3 support for ring utilities', async () => {
    await expectTailwindParity(ringFixtures.canonical)
  })

  it('rejects non-tailwind ring aliases', async () => {
    await expectTailwindParity(ringFixtures.invalid)
  })

  it('matches Tailwind 3 support for decoration and underline-offset utilities', async () => {
    await expectTailwindParity(decorationFixtures.canonical, {
      tailwindConfig: {
        theme: {
          extend: {
            colors: {
              brand: '#1da1f2',
            },
          },
        },
      },
      unoConfig: {
        theme: {
          colors: {
            brand: '#1da1f2',
          },
        },
      },
    })
  })

  it('rejects non-tailwind decoration aliases', async () => {
    await expectTailwindParity(decorationFixtures.invalid)
  })

  it('matches Tailwind 3 support for text-decoration utilities', async () => {
    await expectTailwindParity(textDecorationFixtures.canonical)
  })

  it('matches Tailwind 3 support for text-indent utilities', async () => {
    await expectTailwindParity(textIndentFixtures.canonical, {
      tailwindConfig: {
        theme: {
          extend: {
            textIndent: {
              gutter: '3rem',
            },
          },
        },
      },
      unoConfig: {
        theme: {
          textIndent: {
            gutter: '3rem',
          },
        },
      },
    })
  })

  it('rejects non-tailwind text-indent aliases and raw values', async () => {
    await expectTailwindParity(textIndentFixtures.invalid)
  })

  it('matches Tailwind 3 support for text-wrap / text-overflow / text-transform utilities', async () => {
    await expectTailwindParity(textWrapOverflowTransformFixtures.canonical)
  })

  it('rejects non-tailwind text-wrap / text-overflow / text-transform aliases', async () => {
    await expectTailwindParity(textWrapOverflowTransformFixtures.invalid)
  })

  it('rejects non-tailwind text-stroke aliases and extensions', async () => {
    await expectTailwindParity(textStrokeFixtures.invalid)
  })

  it('rejects non-tailwind text-shadow aliases and extensions', async () => {
    await expectTailwindParity(textShadowFixtures.invalid)
  })

  it('matches Tailwind 3 support for line-clamp utilities', async () => {
    await expectTailwindParity(lineClampFixtures.canonical)
  })

  it('rejects non-tailwind line-clamp aliases and loose keywords', async () => {
    await expectTailwindParity(lineClampFixtures.invalid)
  })

  it('matches Tailwind 3 support for font-variant-numeric utilities', async () => {
    await expectTailwindParity(fontVariantNumericFixtures.canonical)
  })

  it('rejects non-tailwind font-variant-numeric aliases', async () => {
    await expectTailwindParity(fontVariantNumericFixtures.invalid)
  })

  it('rejects non-tailwind tab-size aliases and extensions', async () => {
    await expectTailwindParity(tabSizeFixtures.invalid)
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

  it('matches Tailwind 3 support for background color and bg-opacity utilities', async () => {
    await expectTailwindParity(backgroundColorFixtures.canonical)
  })

  it('rejects non-tailwind background color aliases', async () => {
    await expectTailwindParity(backgroundColorFixtures.invalid)
  })

  it('matches Tailwind 3 for theme-driven background color extensions', async () => {
    await expectTailwindParity([
      'bg-brand',
    ], {
      tailwindConfig: {
        theme: {
          extend: {
            colors: {
              brand: '#1da1f2',
            },
          },
        },
      },
      unoConfig: {
        theme: {
          colors: {
            brand: '#1da1f2',
          },
        },
      },
    })
  })

  it('matches Tailwind 3 support for background / svg color utilities', async () => {
    await expectTailwindParity([
      '[color:#fff]',
      'bg-red-500',
      'bg-[#fff]',
      'bg-opacity-50',
      '[background-color:#fff]',
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
    ])
  })

  it('matches Tailwind 3 support for accent utilities', async () => {
    await expectTailwindParity(accentFixtures.canonical)
  })

  it('rejects non-tailwind accent aliases and opacity shortcuts', async () => {
    await expectTailwindParity(accentFixtures.invalid)
  })

  it('matches Tailwind 3 support for caret utilities', async () => {
    await expectTailwindParity(caretFixtures.canonical)
  })

  it('rejects non-tailwind caret aliases and opacity shortcuts', async () => {
    await expectTailwindParity(caretFixtures.invalid)
  })

  it('matches Tailwind 3 support for fill utilities', async () => {
    await expectTailwindParity(fillFixtures.canonical)
  })

  it('rejects non-tailwind fill aliases and opacity shortcuts', async () => {
    await expectTailwindParity(fillFixtures.invalid)
  })

  it('matches Tailwind 3 support for font utilities', async () => {
    await expectTailwindParity(fontFixtures.canonical)
  })

  it('rejects non-tailwind font aliases and bare numeric shortcuts', async () => {
    await expectTailwindParity(fontFixtures.invalid)
  })

  it('matches Tailwind 3 support for text-align utilities', async () => {
    await expectTailwindParity(textAlignFixtures.canonical)
  })

  it('rejects legacy text-align aliases and global keyword shortcuts', async () => {
    await expectTailwindParity(textAlignFixtures.invalid)
  })

  it('matches Tailwind 3 support for vertical-align utilities', async () => {
    await expectTailwindParity(verticalAlignFixtures.canonical)
  })

  it('rejects legacy vertical-align aliases, global keywords, and bare length shortcuts', async () => {
    await expectTailwindParity(verticalAlignFixtures.invalid)
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

  it('matches Tailwind 3 support for animation utilities through the shared fixtures', async () => {
    await expectTailwindParity(animationFixtures.canonical)
  })

  it('rejects non-tailwind animation aliases and global keyword shortcuts through the shared fixtures', async () => {
    await expectTailwindParity(animationFixtures.invalid)
  })

  it('matches Tailwind 3 support for theme-driven animation extensions and prefixed keyframes', async () => {
    await expectTailwindParity([
      'animate-wiggle',
      'tw-animate-wiggle',
    ], {
      tailwindConfig: {
        prefix: 'tw-',
        theme: {
          extend: {
            animation: {
              wiggle: 'wiggle 1s ease-in-out infinite',
            },
            keyframes: {
              wiggle: {
                '0%,100%': { transform: 'rotate(-3deg)' },
                '50%': { transform: 'rotate(3deg)' },
              },
            },
          },
        },
      },
      unoConfig: {
        presets: [presetTailwind3({ prefix: 'tw-' })],
        theme: {
          animation: {
            wiggle: 'wiggle 1s ease-in-out infinite',
          },
          keyframes: {
            wiggle: '{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}',
          },
        },
      },
    })
  })

  it('matches Tailwind 3 support for appearance utilities through the shared fixtures', async () => {
    await expectTailwindParity(appearanceFixtures.canonical)
  })

  it('rejects non-tailwind appearance aliases and global keyword shortcuts through the shared fixtures', async () => {
    await expectTailwindParity(appearanceFixtures.invalid)
  })

  it('matches Tailwind 3 support for will-change utilities through the shared fixtures', async () => {
    await expectTailwindParity(willChangeFixtures.canonical)
  })

  it('matches Tailwind 3 support for theme-driven will-change keys', async () => {
    await expectTailwindParity([
      'will-change-layout',
    ], {
      tailwindConfig: {
        theme: {
          extend: {
            willChange: {
              layout: 'contents, transform',
            },
          },
        },
      },
      unoConfig: {
        theme: {
          willChange: {
            layout: 'contents, transform',
          },
        },
      },
    })
  })

  it('rejects non-tailwind will-change aliases and global keyword shortcuts through the shared fixtures', async () => {
    await expectTailwindParity(willChangeFixtures.invalid)
  })

  it('matches Tailwind 3 support for overscroll utilities through the shared fixtures', async () => {
    await expectTailwindParity(overscrollFixtures.canonical)
  })

  it('rejects non-tailwind overscroll global keyword shortcuts through the shared fixtures', async () => {
    await expectTailwindParity(overscrollFixtures.invalid)
  })

  it('matches Tailwind 3 support for scroll-behavior utilities through the shared fixtures', async () => {
    await expectTailwindParity(scrollBehaviorFixtures.canonical)
  })

  it('rejects non-tailwind scroll-behavior global keyword shortcuts through the shared fixtures', async () => {
    await expectTailwindParity(scrollBehaviorFixtures.invalid)
  })

  it('matches Tailwind 3 support for touch-action utilities through the shared fixtures', async () => {
    await expectTailwindParity(touchActionFixtures.canonical)
  })

  it('rejects non-tailwind touch-action global keyword shortcuts through the shared fixtures', async () => {
    await expectTailwindParity(touchActionFixtures.invalid)
  })

  it('matches Tailwind 3 support for list-style utilities through the shared fixtures', async () => {
    await expectTailwindParity(listStyleFixtures.canonical)
  })

  it('matches Tailwind 3 support for theme-driven list-style keys', async () => {
    await expectTailwindParity([
      'list-roman',
      'list-image-check',
    ], {
      tailwindConfig: {
        theme: {
          extend: {
            listStyleType: {
              roman: 'upper-roman',
            },
            listStyleImage: {
              check: 'url("/img/check.svg")',
            },
          },
        },
      },
      unoConfig: {
        theme: {
          listStyleType: {
            roman: 'upper-roman',
          },
          listStyleImage: {
            check: 'url("/img/check.svg")',
          },
        },
      },
    })
  })

  it('rejects non-tailwind list-style aliases and global keyword shortcuts through the shared fixtures', async () => {
    await expectTailwindParity(listStyleFixtures.invalid)
  })

  it('rejects non-tailwind image-rendering extension utilities through the shared fixtures', async () => {
    await expectTailwindParity(imageRenderingFixtures.invalid)
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

  it('matches Tailwind 3 support for background style and gradient utilities through the shared fixtures', async () => {
    await expectTailwindParity(backgroundStyleFixtures.canonical)
  })

  it('rejects non-tailwind background style aliases through the shared fixtures', async () => {
    await expectTailwindParity(backgroundStyleFixtures.invalid)
  })

  it('matches Tailwind 3 support for typography, layout, variant, and container edge cases', async () => {
    await expectTailwindParity([
      'hyphens-auto',
      'hyphens-manual',
      'hyphens-none',
      '*:p-4',
    ])
  })

  it('matches Tailwind 3 support for columns and break utilities', async () => {
    await expectTailwindParity(columnsFixtures.canonical)
  })

  it('matches Tailwind 3 support for theme-driven columns keys', async () => {
    await expectTailwindParity([
      'columns-layout',
    ], {
      tailwindConfig: {
        theme: {
          extend: {
            columns: {
              layout: '22rem',
            },
          },
        },
      },
      unoConfig: {
        theme: {
          columns: {
            layout: '22rem',
          },
        } as any,
      },
    })
  })

  it('rejects non-tailwind columns aliases and break global keywords', async () => {
    await expectTailwindParity(columnsFixtures.invalid)
  })

  it('matches Tailwind 3 support for table display, layout, caption, and collapse utilities', async () => {
    await expectTailwindParity(tableFixtures.canonical)
  })

  it('rejects non-tailwind table aliases and extra table extensions', async () => {
    await expectTailwindParity(tableFixtures.invalid)
  })

  it('rejects non-tailwind pseudo chaining syntax', async () => {
    await expectTailwindParity([
      'hover-focus:bg-red-500',
    ])
  })

  it('matches Tailwind 3 support for container with max breakpoint variants', async () => {
    await expectTailwindParity(containerFixtures.canonical, {
      tailwindEntry: '@tailwind components; @tailwind utilities;',
    })
  })

  it('rejects non-tailwind container suffixes and query classes', async () => {
    await expectTailwindParity(containerFixtures.invalid, {
      tailwindEntry: '@tailwind components; @tailwind utilities;',
    })
  })
})
