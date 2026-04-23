import type { UserConfig } from '@unocss/core'
import { createAutocomplete } from '@unocss/autocomplete'
import { createGenerator, escapeSelector } from '@unocss/core'
import presetTailwind3 from '../src/index'
import { describe, expect, it } from 'vitest'
import { backgroundColorFixtures } from './fixtures/tailwind-background-color-rewrite'
import { accentFixtures } from './fixtures/tailwind-accent-rewrite'
import { caretFixtures } from './fixtures/tailwind-caret-rewrite'
import { backgroundStyleFixtures } from './fixtures/tailwind-background-style-rewrite'
import { borderWidthFixtures, roundedFixtures } from './fixtures/tailwind-border-rewrite'
import { decorationFixtures } from './fixtures/tailwind-decoration-rewrite'
import { textDecorationFixtures } from './fixtures/tailwind-text-decoration-rewrite'
import { divideFixtures } from './fixtures/tailwind-divide-rewrite'
import { fillFixtures } from './fixtures/tailwind-fill-rewrite'
import { fontFixtures } from './fixtures/tailwind-font-rewrite'
import { leadingFixtures, leadingTextShorthandRegressionFixtures } from './fixtures/tailwind-leading-rewrite'
import { outlineFixtures } from './fixtures/tailwind-outline-rewrite'
import { ringFixtures } from './fixtures/tailwind-ring-rewrite'
import { shadowFixtures } from './fixtures/tailwind-shadow-rewrite'
import { borderSpacingSpaceFixtures } from './fixtures/tailwind-spacing-border-spacing-space-rewrite'
import { gapInsetScrollFixtures } from './fixtures/tailwind-spacing-gap-inset-scroll-rewrite'
import { paddingMarginFixtures } from './fixtures/tailwind-spacing-padding-margin-rewrite'
import { strokeFixtures } from './fixtures/tailwind-stroke-rewrite'
import { textAlignFixtures } from './fixtures/tailwind-text-align-rewrite'
import { verticalAlignFixtures } from './fixtures/tailwind-vertical-align-rewrite'
import { trackingFixtures } from './fixtures/tailwind-tracking-rewrite'
import { transitionFixtures } from './fixtures/tailwind-transition-rewrite'
import { textFixtures } from './fixtures/tailwind-text-rewrite'

async function createUno(config: UserConfig = {}) {
  return createGenerator({
    presets: [presetTailwind3()],
    ...config,
  })
}

async function expectTargets(input: readonly string[], config: UserConfig = {}) {
  const uno = await createUno(config)
  const { css, matched } = await uno.generate(new Set(input), { preflights: false })

  expect(matched).toEqual(new Set(input))
  for (const item of input)
    expect(css).toContain(escapeSelector(item))

  return css
}

async function expectNonTargets(input: readonly string[], config: UserConfig = {}) {
  const uno = await createUno(config)
  const { css, matched } = await uno.generate(new Set(input), { preflights: false })

  expect(Array.from(matched)).toEqual([])
  expect(css).toBe('')
}

describe('preset-tailwind3', () => {
  describe('autocomplete', () => {
    it('provides valid autocomplete metadata for reused utility rules', async () => {
      const uno = await createUno()
      const ac = createAutocomplete(uno, { throwErrors: false })

      expect(ac.errorCache.size).toBe(0)
      expect(await ac.suggest('overflow-')).toContain('overflow-hidden')
      expect(await ac.suggest('static')).toContain('static')
    })
  })

  describe('size / width / height / min-* / max-*', () => {
    it('matches official Tailwind 3 dimension utilities', async () => {
      await expectTargets([
        'w-4',
        'w-px',
        'w-auto',
        'w-full',
        'w-screen',
        'h-8',
        'h-px',
        'h-auto',
        'h-full',
        'h-screen',
        'min-w-0',
        'min-w-full',
        'min-h-screen',
        'max-w-screen-md',
        'max-w-full',
        'max-h-screen',
        'size-4',
        'size-full',
      ])
    })

    it('matches arbitrary dimension values', async () => {
      const css = await expectTargets([
        'w-[123px]',
        'h-[calc(100%-1rem)]',
        'min-w-[20ch]',
        'max-h-[400px]',
        'size-[32rem]',
      ])

      expect(css).toContain('123px')
      expect(css).toContain('20ch')
      expect(css).toContain('400px')
      expect(css).toContain('32rem')
      expect(css).toContain('calc(100% - 1rem)')
    })

    it('matches theme-driven dimension utilities', async () => {
      const css = await expectTargets([
        'w-128',
        'h-128',
        'size-128',
      ], {
        theme: {
          spacing: {
            128: '32rem',
          },
        },
      })

      expect(css).toContain('32rem')
    })

    it('rejects non-tailwind dimension syntax', async () => {
      await expectNonTargets([
        'w4',
        'w-100px',
        'h8',
        'h-2rem',
        'minw-0',
        'min-w-20ch',
        'maxw-screen-md',
        'max-h-400px',
        'size-w-4',
        'size-h-8',
        'size-32rem',
        'min-w0',
        'max-h400px',
        'block-4',
        'inline-4',
        'min-block-4',
        'size-max-w-full',
      ])
    })
  })

  describe('padding / margin', () => {
    it('matches official Tailwind 3 padding utilities', async () => {
      await expectTargets(paddingMarginFixtures.canonical.filter(item => item.startsWith('p')))
    })

    it('matches official Tailwind 3 margin utilities', async () => {
      await expectTargets(paddingMarginFixtures.canonical.filter(item => item.startsWith('m') || item.startsWith('-m')))
    })

    it('matches arbitrary and theme-driven spacing utilities', async () => {
      const css = await expectTargets([
        'p-[5px]',
        'm-[2rem]',
        'mx-[var(--gap)]',
        'p-128',
        'mx-gutter',
      ], {
        theme: {
          spacing: {
            128: '32rem',
            gutter: '3.25rem',
          },
        },
      })

      expect(css).toContain('5px')
      expect(css).toContain('2rem')
      expect(css).toContain('var(--gap)')
      expect(css).toContain('32rem')
      expect(css).toContain('3.25rem')
    })

    it('rejects non-tailwind spacing syntax', async () => {
      await expectNonTargets([
        ...paddingMarginFixtures.invalid,
        'p-1/2',
        'p-auto',
        'px-2rem',
        'py8',
        'm-1/2',
        '-mt-1rem',
        'm-x-4',
        'p-block-4',
        'm-inline-4',
        'p-bs-4',
        'm-ie-4',
      ])
    })

    it('emits the expected padding and margin CSS for semantic cases', async () => {
      const css = await expectTargets(paddingMarginFixtures.semantic)

      expect(css).toContain('.p-4{padding:1rem;}')
      expect(css).toContain('.ps-4{padding-inline-start:1rem;}')
      expect(css).toContain('.m-auto{margin:auto;}')
      expect(css).toContain('.-mx-2{margin-left:-0.5rem;margin-right:-0.5rem;}')
      expect(css).toContain('.mx-\\[var\\(--gap\\)\\]{margin-left:var(--gap);margin-right:var(--gap);}')
    })
  })

  describe('gap / inset / scroll', () => {
    it('matches official Tailwind 3 gap utilities', async () => {
      await expectTargets(gapInsetScrollFixtures.canonical.filter(item => item.startsWith('gap')))
    })

    it('matches official Tailwind 3 inset utilities', async () => {
      await expectTargets(gapInsetScrollFixtures.canonical.filter(item =>
        item.startsWith('inset')
        || item.startsWith('-inset')
        || item.startsWith('start')
        || item.startsWith('end')
        || item.startsWith('top')
      ))
    })

    it('matches official Tailwind 3 scroll margin and scroll padding utilities', async () => {
      await expectTargets(gapInsetScrollFixtures.canonical.filter(item => item.startsWith('scroll')))
    })

    it('matches arbitrary and theme-driven gap / inset / scroll utilities', async () => {
      const css = await expectTargets([
        'gap-[3px]',
        'inset-[5px]',
        'inset-x-[2rem]',
        'scroll-m-[2rem]',
        'scroll-px-[var(--gap)]',
        'gap-128',
        'inset-gutter',
        'scroll-mx-gutter',
      ], {
        theme: {
          spacing: {
            128: '32rem',
            gutter: '3.25rem',
          },
        },
      })

      expect(css).toContain('3px')
      expect(css).toContain('5px')
      expect(css).toContain('2rem')
      expect(css).toContain('var(--gap)')
      expect(css).toContain('32rem')
      expect(css).toContain('3.25rem')
    })

    it('rejects non-tailwind gap / inset / scroll syntax', async () => {
      await expectNonTargets([
        ...gapInsetScrollFixtures.invalid,
        'gapy8',
        'inset-5px',
        'top-5px',
        '-bottom3',
        'scroll-m-1/2',
        'scroll-p-1/2',
      ])
    })

    it('emits the expected gap, inset, and scroll CSS for semantic cases', async () => {
      const css = await expectTargets(gapInsetScrollFixtures.semantic)

      expect(css).toContain('.gap-4{gap:1rem;}')
      expect(css).toContain('.gap-x-2{column-gap:0.5rem;}')
      expect(css).toContain('.inset-\\[5px\\]{inset:5px;}')
      expect(css).toContain('.start-4{inset-inline-start:1rem;}')
      expect(css).toContain('.scroll-mx-2{scroll-margin-left:0.5rem;scroll-margin-right:0.5rem;}')
      expect(css).toContain('.scroll-px-\\[var\\(--gap\\)\\]{scroll-padding-left:var(--gap);scroll-padding-right:var(--gap);}')
    })
  })

  describe('border-spacing / space', () => {
    it('matches official Tailwind 3 border-spacing utilities', async () => {
      await expectTargets(borderSpacingSpaceFixtures.canonical.filter(item => item.startsWith('border-spacing')))
    })

    it('matches official Tailwind 3 space utilities', async () => {
      await expectTargets(borderSpacingSpaceFixtures.canonical.filter(item => item.startsWith('space-')))
    })

    it('rejects non-tailwind border-spacing and space aliases', async () => {
      await expectNonTargets(borderSpacingSpaceFixtures.invalid)
    })

    it('emits the expected border-spacing and space CSS for semantic cases', async () => {
      const css = await expectTargets(borderSpacingSpaceFixtures.semantic)

      expect(css).toContain('.border-spacing-2{--un-border-spacing-x:0.5rem;--un-border-spacing-y:0.5rem;border-spacing:var(--un-border-spacing-x) var(--un-border-spacing-y);}')
      expect(css).toContain('.border-spacing-x-4{--un-border-spacing-x:1rem;border-spacing:var(--un-border-spacing-x) var(--un-border-spacing-y);}')
      expect(css).toContain('.space-x-4 > :not([hidden]) ~ :not([hidden]){--un-space-x-reverse:0;margin-right:calc(1rem * var(--un-space-x-reverse));margin-left:calc(1rem * calc(1 - var(--un-space-x-reverse)));}')
      expect(css).toContain('.space-y-2 > :not([hidden]) ~ :not([hidden]){--un-space-y-reverse:0;margin-top:calc(0.5rem * calc(1 - var(--un-space-y-reverse)));margin-bottom:calc(0.5rem * var(--un-space-y-reverse));}')
      expect(css).toContain('.space-x-reverse > :not([hidden]) ~ :not([hidden]){--un-space-x-reverse:1;}')
    })
  })

  describe('translate', () => {
    it('matches official Tailwind 3 translate utilities', async () => {
      await expectTargets([
        'translate-x-4',
        'translate-y-8',
        'translate-x-full',
        '-translate-y-1',
      ])
    })

    it('matches arbitrary and theme-driven translate utilities', async () => {
      const css = await expectTargets([
        'translate-x-[12px]',
        'translate-x-gutter',
      ], {
        theme: {
          spacing: {
            gutter: '3.25rem',
          },
        },
      })

      expect(css).toContain('12px')
      expect(css).toContain('3.25rem')
    })

    it('rejects non-tailwind translate syntax', async () => {
      await expectNonTargets([
        'translatex-4',
        'translate-4',
        'translate-[12px]',
        'translate-x-12px',
        'translate-z-4',
        'translatey8',
        '-translatey-1',
      ])
    })
  })

  describe('animation', () => {
    it('matches official Tailwind 3 animation utilities', async () => {
      await expectTargets([
        'animate-none',
        'animate-spin',
        'animate-ping',
        'animate-pulse',
        'animate-bounce',
      ])
    })

    it('matches arbitrary and theme-driven animation utilities', async () => {
      const css = await expectTargets([
        'animate-[wiggle_1s_ease-in-out_infinite]',
        'animate-wiggle',
      ], {
        theme: {
          animation: {
            keyframes: {
              wiggle: '{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}',
            },
            durations: {
              wiggle: '1s',
            },
            timingFns: {
              wiggle: 'ease-in-out',
            },
            counts: {
              wiggle: 'infinite',
            },
          },
        },
      })

      expect(css).toContain('@keyframes wiggle')
      expect(css).toContain('wiggle 1s ease-in-out infinite')
    })

    it('rejects non-tailwind animation extensions', async () => {
      await expectNonTargets([
        'keyframes-spin',
        'animate-name-wiggle',
        'animate-duration-500',
        'animate-delay-75',
        'animate-ease-linear',
        'animate-fill-forwards',
        'animate-direction-reverse',
        'animate-count-infinite',
        'animate-play-paused',
      ])
    })
  })

  describe('border', () => {
    it('expands border width values and directions correctly', async () => {
      const css = await expectTargets([
        'border',
        'border-2',
        'border-x',
        'border-s-2',
      ])

      expect(css).toContain('.border{border-width:1px;}')
      expect(css).toContain('.border-2{border-width:2px;}')
      expect(css).toContain('.border-x{border-left-width:1px;border-right-width:1px;}')
      expect(css).toContain('.border-s-2{border-inline-start-width:2px;}')
    })

    it('matches strict border width fixtures', async () => {
      await expectTargets(borderWidthFixtures.canonical)
    })

    it('matches official Tailwind 3 border and rounded utilities', async () => {
      await expectTargets([
        'border',
        'border-2',
        'border-none',
        'border-s-2',
        'border-x',
        'border-y-4',
        'border-t-2',
        'border-dashed',
        'border-[#fff]',
        'border-opacity-50',
        'border-red-500/50',
        'rounded',
        'rounded-md',
        'rounded-s-lg',
        'rounded-e-lg',
        'rounded-ss-lg',
        'rounded-t-lg',
        'rounded-br-xl',
      ])
    })

    it('keeps border-none as a border style utility', async () => {
      const css = await expectTargets(['border-none'])

      expect(css).toContain('.border-none{border-style:none;}')
    })

    it('maps logical rounded corners correctly', async () => {
      const css = await expectTargets([
        'rounded-s-lg',
        'rounded-e-lg',
      ])

      expect(css).toContain('.rounded-s-lg{border-start-start-radius:0.5rem;border-end-start-radius:0.5rem;}')
      expect(css).toContain('.rounded-e-lg{border-start-end-radius:0.5rem;border-end-end-radius:0.5rem;}')
    })

    it('matches strict Tailwind 3 rounded direction tokens', async () => {
      await expectTargets(roundedFixtures.canonical)
    })

    it('matches arbitrary and theme-driven border utilities', async () => {
      const css = await expectTargets([
        'border-[3px]',
        'rounded-[10px]',
        'border-brand',
        'rounded-brand',
      ], {
        theme: {
          colors: {
            brand: '#123456',
          },
          borderRadius: {
            brand: '1.25rem',
          },
        },
      })

      expect(css).toContain('3px')
      expect(css).toContain('10px')
      expect(css).toContain('18 52 86')
      expect(css).toContain('1.25rem')
    })

    it('rejects non-tailwind border aliases and shortcuts', async () => {
      await expectNonTargets([
        ...borderWidthFixtures.invalid,
        ...roundedFixtures.invalid,
        'b-2',
        'b-red-500',
        'border-color-red-500',
        'border-s-color-red-500',
        'border-op50',
        'border-inline-2',
        'border-block-2',
        'border-is-2',
        'border-s-none',
        'border-x-none',
        'border-t-none',
        'border-x-dashed',
        'border-t-dashed',
        'border-style-dashed',
        'border-rounded-md',
        'borderx',
      ])
    })
  })

  describe('divide', () => {
    it('matches official Tailwind 3 divide utilities', async () => {
      await expectTargets(divideFixtures.canonical)
    })

    it('keeps divide semantic output stable', async () => {
      const css = await expectTargets(divideFixtures.semantic)

      expect(css).toContain('--un-divide-x-reverse:0')
      expect(css).toContain('border-left-width:calc(1px * calc(1 - var(--un-divide-x-reverse)))')
      expect(css).toContain('border-bottom-width:calc(2px * var(--un-divide-y-reverse))')
      expect(css).toContain('--un-divide-opacity:0.5')
      expect(css).toContain('border-color:rgb(239 68 68 / var(--un-divide-opacity))')
    })

    it('matches arbitrary and theme-driven divide utilities', async () => {
      const css = await expectTargets([
        'divide-x-[3px]',
        'divide-x-gutter',
      ], {
        theme: {
          lineWidth: {
            gutter: '3px',
          },
        },
      })

      expect(css).toContain('3px')
    })

    it('rejects non-tailwind divide aliases and logical extensions', async () => {
      await expectNonTargets(divideFixtures.invalid)
    })
  })

  describe('ring / decoration', () => {
    it('matches official Tailwind 3 ring and decoration utilities', async () => {
      await expectTargets([
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

    it('rejects non-tailwind ring and decoration aliases', async () => {
      await expectNonTargets([
        'ring-offset',
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

    it('matches Tailwind 3 ring utilities through the shared fixtures', async () => {
      await expectTargets(ringFixtures.canonical)
    })

    it('rejects non-tailwind ring aliases through the shared fixtures', async () => {
      await expectNonTargets(ringFixtures.invalid)
    })

    it('emits the expected ring CSS for semantic cases', async () => {
      const css = await expectTargets(ringFixtures.semantic)

      expect(css).toContain('.ring,')
      expect(css).toContain('--un-ring-width:3px')
      expect(css).toContain('--un-ring-width:2px')
      expect(css).toContain('--un-ring-color')
      expect(css).toContain('--un-ring-opacity')
      expect(css).toContain('--un-ring-offset-width:2px')
      expect(css).toContain('--un-ring-offset-color')
      expect(css).toContain('--un-ring-inset:inset')
      expect(css).toContain('box-shadow')
    })

    it('matches Tailwind 3 decoration and underline-offset utilities through the shared fixtures', async () => {
      await expectTargets(decorationFixtures.canonical)
    })

    it('rejects non-tailwind decoration aliases through the shared fixtures', async () => {
      await expectNonTargets(decorationFixtures.invalid)
    })

    it('emits the expected decoration CSS for semantic cases', async () => {
      const css = await expectTargets(decorationFixtures.semantic, {
        theme: {
          colors: {
            brand: '#1da1f2',
          },
        },
      })

      expect(css).toContain('text-decoration-thickness:2px')
      expect(css).toContain('text-decoration-thickness:3px')
      expect(css).toContain('text-decoration-thickness:auto')
      expect(css).toContain('text-decoration-thickness:from-font')
      expect(css).toContain('text-decoration-style:dashed')
      expect(css).toContain('text-decoration-style:wavy')
      expect(css).toContain('-webkit-text-decoration-color')
      expect(css).toContain('text-decoration-color')
      expect(css).toContain('text-underline-offset:4px')
      expect(css).toContain('text-underline-offset:3px')
      expect(css).toContain('29 161 242')
    })

    it('matches Tailwind 3 text-decoration utilities through the shared fixtures', async () => {
      await expectTargets(textDecorationFixtures.canonical)
    })

    it('rejects non-tailwind text-decoration aliases through the shared fixtures', async () => {
      await expectNonTargets(textDecorationFixtures.invalid)
    })

    it('emits the expected text-decoration CSS for semantic cases', async () => {
      const css = await expectTargets(textDecorationFixtures.semantic)

      expect(css).toContain('text-decoration-line:underline')
      expect(css).toContain('text-decoration-line:overline')
      expect(css).toContain('text-decoration-line:line-through')
      expect(css).toContain('text-decoration:none')
    })
  })

  describe('background', () => {
    it('matches Tailwind 3 background color and bg-opacity utilities through the shared fixtures', async () => {
      await expectTargets(backgroundColorFixtures.canonical)
    })

    it('rejects non-tailwind background color aliases through the shared fixtures', async () => {
      await expectNonTargets(backgroundColorFixtures.invalid)
    })

    it('emits the expected background color CSS for semantic cases', async () => {
      const css = await expectTargets(backgroundColorFixtures.semantic, {
        theme: {
          colors: {
            brand: '#1da1f2',
          },
        },
      })

      expect(css).toContain('background-color')
      expect(css).toContain('--un-bg-opacity')
      expect(css).toContain('29 161 242')
    })

    it('matches official Tailwind 3 background utilities', async () => {
      await expectTargets([
        'bg-red-500',
        'bg-red-500/50',
        'bg-[#fff]',
        'bg-opacity-50',
        'bg-cover',
        'bg-center',
        'bg-no-repeat',
        'bg-fixed',
        'bg-clip-text',
        'bg-origin-border',
        'bg-gradient-to-r',
        'from-blue-500',
        'from-10%',
        'via-cyan-500',
        'via-30%',
        'to-emerald-500',
        'to-90%',
      ])
    })

    it('matches arbitrary and theme-driven background utilities', async () => {
      const css = await expectTargets([
        'bg-[url(https://example.com/a.png)]',
        'bg-[length:200px_100px]',
        'bg-[position:center_top]',
        'bg-brand',
        'from-brand',
      ], {
        theme: {
          colors: {
            brand: '#1da1f2',
          },
        },
      })

      expect(css).toContain('https://example.com/a.png')
      expect(css).toContain('200px 100px')
      expect(css).toContain('center top')
      expect(css).toContain('29 161 242')
    })

    it('rejects non-tailwind background extensions', async () => {
      await expectNonTargets([
        'bg-#fff',
        'bg-red500',
        'bg-op50',
        'bg-op-50',
        'bgred500',
        'bg-gradient-linear',
        'bg-gradient-from-red-500',
        'bg-gradient-via-cyan-500',
        'bg-gradient-to-emerald-500',
        'bg-gradient-shape-r',
        'bg-clip-inherit',
        'bg-clip-initial',
        'bg-origin-inherit',
        'bg-origin-initial',
        'bg-repeat-inherit',
        'bg-repeat-initial',
        'shape-r',
      ])
    })

    it('matches Tailwind 3 background style and gradient utilities through the shared fixtures', async () => {
      await expectTargets(backgroundStyleFixtures.canonical)
    })

    it('rejects non-tailwind background style aliases through the shared fixtures', async () => {
      await expectNonTargets(backgroundStyleFixtures.invalid)
    })

    it('emits the expected background style CSS for semantic cases', async () => {
      const css = await expectTargets(backgroundStyleFixtures.semantic)

      expect(css).toContain('background-image:none')
      expect(css).toContain('background-size:cover')
      expect(css).toContain('background-attachment:fixed')
      expect(css).toContain('background-clip:text')
      expect(css).toContain('background-origin:border-box')
      expect(css).toContain('background-repeat:repeat-x')
      expect(css).toContain('background-position:center')
      expect(css).toContain('linear-gradient')
      expect(css).toContain('--un-gradient-from-position:10%')
      expect(css).toContain('--un-gradient-via-position:30%')
      expect(css).toContain('--un-gradient-to-position:90%')
    })
  })

  describe('outline', () => {
    it('matches outline width and offset utilities', async () => {
      await expectTargets(outlineFixtures.canonical)
    })

    it('rejects non-tailwind outline width and offset aliases', async () => {
      await expectNonTargets(outlineFixtures.invalid)
    })

    it('emits the expected outline width and offset CSS for semantic cases', async () => {
      const css = await expectTargets([
        ...outlineFixtures.semantic,
        'outline',
        'outline-none',
        'outline-dashed',
        'outline-dotted',
        'outline-double',
        'outline-inherit',
      ])

      expect(css).toContain('.outline-2{outline-width:2px;}')
      expect(css).toContain('.outline-offset-2{outline-offset:2px;}')
      expect(css).toContain('.outline-none{outline:2px solid transparent;outline-offset:2px;}')
      expect(css).toContain('.outline-dashed{outline-style:dashed;}')
      expect(css).toContain('.outline-dotted{outline-style:dotted;}')
      expect(css).toContain('.outline-double{outline-style:double;}')
      expect(css).toContain('.outline-inherit{outline-color:inherit;}')
      expect(css).toContain('.outline{outline-style:solid;}')
    })
  })

  describe('transition', () => {
    it('matches official Tailwind 3 transition utilities', async () => {
      await expectTargets(transitionFixtures.canonical)
    })

    it('rejects non-tailwind transition aliases and extensions', async () => {
      await expectNonTargets(transitionFixtures.invalid)
    })

    it('emits the expected transition CSS for semantic cases', async () => {
      const css = await expectTargets(transitionFixtures.semantic)

      expect(css).toContain('.transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms;}')
      expect(css).toContain('.transition-all{transition-property:all;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms;}')
      expect(css).toContain('.transition-\\[height\\,opacity\\]{transition-property:height,opacity;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms;}')
      expect(css).toContain('.duration-200{transition-duration:200ms;}')
      expect(css).toContain('.delay-75{transition-delay:75ms;}')
      expect(css).toContain('.ease-linear{transition-timing-function:linear;}')
    })
  })

  describe('text', () => {
    it('matches official Tailwind 3 text utilities', async () => {
      await expectTargets(textFixtures.canonical)
    })

    it('rejects non-tailwind text aliases and legacy size shortcuts', async () => {
      await expectNonTargets(textFixtures.invalid)
    })

    it('emits the expected text size, color, and opacity CSS for semantic cases', async () => {
      const css = await expectTargets(textFixtures.semantic)

      expect(css).toContain('.text-sm{font-size:0.875rem;line-height:1.25rem;}')
      expect(css).toContain('.text-lg\\/7{font-size:1.125rem;line-height:1.75rem;}')
      expect(css).toContain('.text-\\[14px\\]{font-size:14px;}')
      expect(css).toContain('.text-\\[14px\\]\\/\\[20px\\]{font-size:14px;line-height:20px;}')
      expect(css).toContain('.text-white{--un-text-opacity:1;color:rgb(255 255 255 / var(--un-text-opacity));}')
      expect(css).toContain('.text-red-500\\/50{color:rgb(239 68 68 / 0.5);}')
      expect(css).toContain('.text-opacity-50{--un-text-opacity:0.5;}')
    })

    it('matches theme-driven color utilities', async () => {
      const css = await expectTargets([
        'text-brand',
        'bg-brand',
        'fill-brand',
        'stroke-brand',
        'accent-brand',
        'caret-brand',
      ], {
        theme: {
          colors: {
            brand: '#ff8800',
          },
        },
      })

      expect(css).toContain('255 136 0')
    })
  })

  describe('svg / accent / caret colors', () => {
    it('matches official Tailwind 3 fill utilities', async () => {
      await expectTargets(fillFixtures.canonical)
    })

    it('keeps fill semantic output stable', async () => {
      const css = await expectTargets(fillFixtures.semantic)

      expect(css).toContain('.fill-red-500{--un-fill-opacity:1;fill:rgb(239 68 68 / var(--un-fill-opacity));}')
      expect(css).toContain('.fill-\\[\\#fff\\]{--un-fill-opacity:1;fill:rgb(255 255 255 / var(--un-fill-opacity));}')
      expect(css).toContain('.fill-none{fill:none;}')
    })

    it('matches theme-driven fill utilities', async () => {
      const css = await expectTargets(['fill-brand'], {
        theme: {
          colors: {
            brand: '#ff8800',
          },
        },
      })

      expect(css).toContain('255 136 0')
    })

    it('rejects non-tailwind fill aliases and opacity shortcuts', async () => {
      await expectNonTargets(fillFixtures.invalid)
    })

    it('matches official Tailwind 3 color utilities', async () => {
      await expectTargets([
        '[color:#fff]',
      ])
    })

    it('rejects non-tailwind color aliases and bare color shortcuts', async () => {
      await expectNonTargets([
        'color-#fff',
        'c-#fff',
        'text-#fff',
        'text-red500',
        'text-color-red-500',
      ])
    })

    it('matches official Tailwind 3 accent utilities', async () => {
      await expectTargets(accentFixtures.canonical)
    })

    it('keeps accent semantic output stable', async () => {
      const css = await expectTargets(accentFixtures.semantic)

      expect(css).toContain('.accent-red-500{--un-accent-opacity:1;accent-color:rgb(239 68 68 / var(--un-accent-opacity));}')
      expect(css).toContain('.accent-\\[\\#fff\\]{--un-accent-opacity:1;accent-color:rgb(255 255 255 / var(--un-accent-opacity));}')
    })

    it('matches theme-driven accent utilities', async () => {
      const css = await expectTargets(['accent-brand'], {
        theme: {
          colors: {
            brand: '#ff8800',
          },
        },
      })

      expect(css).toContain('255 136 0')
    })

    it('rejects non-tailwind accent aliases and opacity shortcuts', async () => {
      await expectNonTargets(accentFixtures.invalid)
    })

    it('matches official Tailwind 3 caret utilities', async () => {
      await expectTargets(caretFixtures.canonical)
    })

    it('keeps caret semantic output stable', async () => {
      const css = await expectTargets(caretFixtures.semantic)

      expect(css).toContain('.caret-blue-500{--un-caret-opacity:1;caret-color:rgb(59 130 246 / var(--un-caret-opacity));}')
      expect(css).toContain('.caret-\\[\\#fff\\]{--un-caret-opacity:1;caret-color:rgb(255 255 255 / var(--un-caret-opacity));}')
    })

    it('matches theme-driven caret utilities', async () => {
      const css = await expectTargets(['caret-brand'], {
        theme: {
          colors: {
            brand: '#ff8800',
          },
        },
      })

      expect(css).toContain('255 136 0')
    })

    it('rejects non-tailwind caret aliases and opacity shortcuts', async () => {
      await expectNonTargets(caretFixtures.invalid)
    })
  })

  describe('stroke', () => {
    it('matches official Tailwind 3 stroke utilities', async () => {
      await expectTargets(strokeFixtures.canonical)
    })

    it('rejects non-tailwind stroke aliases and bare color shortcuts', async () => {
      await expectNonTargets(strokeFixtures.invalid)
    })

    it('emits the expected stroke CSS for semantic cases', async () => {
      const css = await expectTargets(strokeFixtures.semantic)

      expect(css).toContain('.stroke-2{stroke-width:2;}')
      expect(css).toContain('.stroke-red-500{--un-stroke-opacity:1;stroke:rgb(239 68 68 / var(--un-stroke-opacity));}')
      expect(css).toContain('.stroke-\\[\\#fff\\]{--un-stroke-opacity:1;stroke:rgb(255 255 255 / var(--un-stroke-opacity));}')
      expect(css).toContain('.stroke-\\[3px\\]{stroke-width:3px;}')
      expect(css).toContain('.stroke-none{stroke:none;}')
    })
  })

  describe('leading', () => {
    it('matches official Tailwind 3 leading utilities', async () => {
      await expectTargets(leadingFixtures.canonical)
    })

    it('rejects non-tailwind leading aliases and bare length shortcuts', async () => {
      await expectNonTargets(leadingFixtures.invalid)
    })

    it('preserves text shorthand regression cases while leading is rewritten', async () => {
      await expectTargets(leadingTextShorthandRegressionFixtures)
    })

    it('emits the expected leading CSS and preserves text shorthand semantics', async () => {
      const css = await expectTargets(leadingFixtures.semantic)
      const textCss = await expectTargets(leadingTextShorthandRegressionFixtures)

      expect(css).toContain('.leading-none{line-height:1;}')
      expect(css).toContain('.leading-6{line-height:1.5rem;}')
      expect(css).toContain('.leading-\\[20px\\]{line-height:20px;}')
      expect(css).toContain('.leading-\\[calc\\(100\\%-1px\\)\\]{line-height:calc(100% - 1px);}')
      expect(textCss).toContain('.text-lg\\/7{font-size:1.125rem;line-height:1.75rem;}')
      expect(textCss).toContain('.text-\\[14px\\]\\/\\[20px\\]{font-size:14px;line-height:20px;}')
    })
  })

  describe('tracking', () => {
    it('matches official Tailwind 3 tracking utilities', async () => {
      await expectTargets(trackingFixtures.canonical)
    })

    it('rejects non-tailwind tracking aliases and bare length shortcuts', async () => {
      await expectNonTargets(trackingFixtures.invalid)
    })

    it('emits the expected tracking CSS for semantic cases', async () => {
      const css = await expectTargets(trackingFixtures.semantic)

      expect(css).toContain('.tracking-tight{letter-spacing:-0.025em;}')
      expect(css).toContain('.tracking-wide{letter-spacing:0.025em;}')
      expect(css).toContain('.tracking-\\[0\\.2em\\]{letter-spacing:0.2em;}')
      expect(css).toContain('.tracking-\\[calc\\(1em-1px\\)\\]{letter-spacing:calc(1em - 1px);}')
    })
  })

  describe('text-align', () => {
    it('matches official Tailwind 3 text-align utilities', async () => {
      await expectTargets(textAlignFixtures.canonical)
    })

    it('keeps text-align semantic output stable', async () => {
      const css = await expectTargets(textAlignFixtures.semantic)

      expect(css).toContain('.text-left{text-align:left;}')
      expect(css).toContain('.text-center{text-align:center;}')
      expect(css).toContain('.text-right{text-align:right;}')
      expect(css).toContain('.text-justify{text-align:justify;}')
      expect(css).toContain('.text-start{text-align:start;}')
      expect(css).toContain('.text-end{text-align:end;}')
    })

    it('rejects legacy text-align aliases and global keyword shortcuts', async () => {
      await expectNonTargets(textAlignFixtures.invalid)
    })
  })

  describe('vertical-align', () => {
    it('matches official Tailwind 3 vertical-align utilities', async () => {
      await expectTargets(verticalAlignFixtures.canonical)
    })

    it('keeps vertical-align semantic output stable', async () => {
      const css = await expectTargets(verticalAlignFixtures.semantic)

      expect(css).toContain('.align-baseline{vertical-align:baseline;}')
      expect(css).toContain('.align-top{vertical-align:top;}')
      expect(css).toContain('.align-middle{vertical-align:middle;}')
      expect(css).toContain('.align-bottom{vertical-align:bottom;}')
      expect(css).toContain('.align-text-top{vertical-align:text-top;}')
      expect(css).toContain('.align-text-bottom{vertical-align:text-bottom;}')
      expect(css).toContain('.align-sub{vertical-align:sub;}')
      expect(css).toContain('.align-super{vertical-align:super;}')
      expect(css).toContain('.align-\\[4px\\]{vertical-align:4px;}')
    })

    it('rejects legacy vertical-align aliases, global keywords, and bare length shortcuts', async () => {
      await expectNonTargets(verticalAlignFixtures.invalid)
    })
  })

  describe('font', () => {
    it('matches official Tailwind 3 font utilities', async () => {
      await expectTargets(fontFixtures.canonical)
    })

    it('keeps font semantic output stable', async () => {
      const css = await expectTargets(fontFixtures.semantic)

      expect(css).toContain('font-family:ui-sans-serif,system-ui')
      expect(css).toContain('.font-bold{font-weight:700;}')
      expect(css).toContain('.font-\\[650\\]{font-weight:650;}')
    })

    it('matches theme-driven font utilities', async () => {
      const css = await expectTargets(['font-brand'], {
        theme: {
          fontFamily: {
            brand: '"Fira Sans", sans-serif',
          },
        },
      })

      expect(css).toContain('font-family:"Fira Sans", sans-serif')
    })

    it('rejects non-tailwind font aliases and bare numeric shortcuts', async () => {
      await expectNonTargets(fontFixtures.invalid)
    })
  })

  describe('typography / columns / tables / behaviors', () => {
    it('matches official Tailwind 3 typography and behavior utilities', async () => {
      await expectTargets([
        'hyphens-auto',
        'hyphens-manual',
        'hyphens-none',
        'tabular-nums',
        'line-clamp-3',
        'columns-3',
        'break-after-column',
        'table-auto',
        'border-collapse',
        'border-spacing-2',
        'caption-bottom',
        'list-disc',
        'list-inside',
        'scroll-smooth',
        'overscroll-y-none',
        'touch-pan-x',
      ])
    })

    it('matches arbitrary and theme-driven typography-related utilities', async () => {
      const css = await expectTargets([
        'columns-sm',
        'border-spacing-[3px]',
      ], {
        theme: {
          containers: {
            sm: '24rem',
          },
          colors: {
            brand: '#ff8800',
          },
        },
      })

      expect(css).toContain('24rem')
      expect(css).toContain('3px')
    })

    it('rejects non-tailwind typography and behavior aliases', async () => {
      await expectNonTargets([
        'fontbold',
        'textsize-sm',
        'lineclamp-3',
        'columns3',
        'borderspacing-2',
        'accentop50',
        'caretop50',
        'touchpan-x',
        'scrollsmooth',
      ])
    })
  })

  describe('layout / flex / grid / position', () => {
    it('matches official Tailwind 3 layout utilities', async () => {
      await expectTargets([
        'block',
        'inline-block',
        'hidden',
        'relative',
        'absolute',
        'z-10',
        'order-2',
        'flex',
        'inline-flex',
        'flex-row',
        'flex-wrap',
        'grow',
        'shrink-0',
        'flex-shrink-0',
        'basis-1/2',
        'grid',
        'inline-grid',
        'grid-cols-3',
        'grid-rows-2',
        'col-span-2',
        'row-span-3',
        'col-start-2',
        'row-end-4',
        'grid-flow-row-dense',
        'overflow-x-auto',
      ])
    })

    it('matches arbitrary and theme-driven layout utilities', async () => {
      const css = await expectTargets([
        'basis-[23rem]',
        'grid-cols-[200px_minmax(900px,_1fr)_100px]',
        'order-[13]',
        'z-[99]',
      ])

      expect(css).toContain('23rem')
      expect(css).toContain('200px minmax(900px, 1fr) 100px')
      expect(css).toContain('13')
      expect(css).toContain('99')
    })

    it('rejects non-tailwind layout aliases and shortcuts', async () => {
      await expectNonTargets([
        'of-hidden',
        'pos-absolute',
        'z10',
        'order2',
        'flex-inline',
        'flexrow',
        'flex-grow-1',
        'auto-flow-col',
        'grid-flowcol',
        'cols-3',
        'rows-2',
        'colspan-2',
        'rowstart-2',
      ])
    })
  })

  describe('container', () => {
    it('matches official Tailwind 3 container utilities', async () => {
      const css = await expectTargets([
        'container',
        'sm:container',
        'md:container',
        'lg:container',
        'max-md:container',
      ])

      expect(css).toContain('width:100%')
      expect(css).toContain('max-width:640px')
      expect(css).toContain('max-width:768px')
    })
  })

  describe('shadow', () => {
    it('matches official Tailwind 3 shadow utilities', async () => {
      const css = await expectTargets(shadowFixtures.canonical)

      expect(css).toContain('box-shadow')
      expect(css).toContain('--un-shadow')
      expect(css).toContain('--un-shadow-color')
      expect(css).toContain('rgba(0, 0, 0, 0.35)')
    })

    it('keeps shadow semantic output stable', async () => {
      const css = await expectTargets(shadowFixtures.semantic)

      expect(css).toContain('box-shadow:var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow)')
      expect(css).toContain('--un-shadow-color')
      expect(css).toContain('rgb(0 0 0 / 0)')
    })

    it('rejects non-tailwind shadow aliases and opacity shortcuts', async () => {
      await expectNonTargets(shadowFixtures.invalid)
    })
  })

  describe('effects / filters / transform', () => {
    it('matches official Tailwind 3 effects and transform utilities', async () => {
      await expectTargets([
        'opacity-50',
        'blur-sm',
        'brightness-75',
        'contrast-50',
        'grayscale',
        'invert',
        'sepia',
        'drop-shadow',
        'drop-shadow-md',
        'backdrop-blur-sm',
        'rotate-45',
        '-rotate-45',
        'scale-110',
        'scale-x-75',
        'skew-y-6',
        'origin-top-right',
        'transform-gpu',
        'transform-none',
      ])
    })

    it('matches arbitrary and theme-driven effects utilities', async () => {
      const css = await expectTargets([
        'drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]',
        'rotate-[13deg]',
        'scale-[1.12]',
        'blur-[3px]',
      ])

      expect(css).toContain('drop-shadow(0 0 2px rgba(0,0,0,0.5))')
      expect(css).toContain('13deg')
      expect(css).toContain('1.12')
      expect(css).toContain('3px')
    })

    it('rejects non-tailwind effects aliases and extensions', async () => {
      await expectNonTargets([
        'op50',
        'filter-blur-sm',
        'filter-drop-shadow',
        'drop-shadow-color-red-500',
        'rotate45',
        'rotatex-45',
        'scalex-75',
        'skewy-6',
        'transform-rotate-45',
        'transform-origin-top-right',
        'perspective-500',
        'preserve-3d',
      ])
    })
  })

  describe('variants', () => {
    it('matches official Tailwind 3 variants', async () => {
      await expectTargets([
        'hover:bg-red-500',
        'focus:ring-2',
        'disabled:opacity-50',
        'dark:text-white',
        'group-hover:text-red-500',
        'peer-focus:block',
        'sm:w-4',
        'max-md:hidden',
        'motion-reduce:animate-none',
        'contrast-more:text-black',
        'portrait:hidden',
        '*:p-4',
        '[&>*]:p-4',
        'supports-[display:grid]:grid',
      ])
    })

    it('rejects non-tailwind variant syntax', async () => {
      await expectNonTargets([
        'lt-md:w-4',
        'at-md:w-4',
        '~md:w-4',
        'hover-focus:bg-red-500',
        'selector-[&>*]:p-4',
        'scope-[.foo]:p-4',
        'layer-components:p-4',
        'uno-layer-foo:p-4',
      ])
    })
  })
})
