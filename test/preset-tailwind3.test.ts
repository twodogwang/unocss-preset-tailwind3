import type { UserConfig } from '@unocss/core'
import { createAutocomplete } from '@unocss/autocomplete'
import { createGenerator, escapeSelector } from '@unocss/core'
import presetTailwind3 from '../src/index'
import { describe, expect, it } from 'vitest'
import { borderWidthFixtures, roundedFixtures } from './fixtures/tailwind-border-rewrite'
import { leadingFixtures, leadingTextShorthandRegressionFixtures } from './fixtures/tailwind-leading-rewrite'
import { outlineFixtures } from './fixtures/tailwind-outline-rewrite'
import { strokeFixtures } from './fixtures/tailwind-stroke-rewrite'
import { trackingFixtures } from './fixtures/tailwind-tracking-rewrite'
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
      await expectTargets([
        'p-4',
        'px-2',
        'py-8',
        'pt-1',
        'pr-px',
        'pb-3',
        'pl-5',
        'ps-4',
        'pe-6',
      ])
    })

    it('matches official Tailwind 3 margin utilities', async () => {
      await expectTargets([
        'm-4',
        'mx-auto',
        'my-6',
        'mt-1',
        'mr-2',
        'mb-3',
        'ml-5',
        'ms-4',
        'me-6',
        '-m-4',
        '-mx-2',
        '-mt-1',
      ])
    })

    it('matches arbitrary and theme-driven spacing utilities', async () => {
      const css = await expectTargets([
        'p-[5px]',
        'px-[2rem]',
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
        'p4',
        'p-1/2',
        'p-auto',
        'p-5px',
        'px2',
        'px-2rem',
        'py8',
        'pt1',
        'm4',
        'm-1/2',
        'm-2rem',
        'mx2',
        'mx-var(--gap)',
        '-mt1',
        '-mt-1rem',
        'm-x-4',
        'p-block-4',
        'm-inline-4',
        'p-bs-4',
        'm-ie-4',
        'p-s-4',
        'm-e-4',
      ])
    })
  })

  describe('gap / inset / translate / scroll-*', () => {
    it('matches official Tailwind 3 gap utilities', async () => {
      await expectTargets([
        'gap-4',
        'gap-px',
        'gap-x-2',
        'gap-y-8',
      ])
    })

    it('matches official Tailwind 3 inset utilities', async () => {
      await expectTargets([
        'inset-0',
        'inset-x-4',
        'inset-y-2',
        'top-1',
        'right-2',
        'bottom-3',
        'left-auto',
        'start-4',
        'end-6',
        '-inset-4',
        '-top-1',
      ])
    })

    it('matches official Tailwind 3 translate utilities', async () => {
      await expectTargets([
        'translate-x-4',
        'translate-y-8',
        'translate-x-full',
        '-translate-y-1',
      ])
    })

    it('matches official Tailwind 3 scroll margin and scroll padding utilities', async () => {
      await expectTargets([
        'scroll-m-4',
        'scroll-mx-2',
        'scroll-my-8',
        'scroll-mt-1',
        'scroll-ms-4',
        'scroll-me-6',
        'scroll-p-4',
        'scroll-px-2',
        'scroll-py-8',
        'scroll-pt-1',
        'scroll-ps-4',
        'scroll-pe-6',
      ])
    })

    it('matches arbitrary and theme-driven gap / inset / translate / scroll utilities', async () => {
      const css = await expectTargets([
        'gap-[3px]',
        'inset-[5px]',
        'inset-x-[2rem]',
        'translate-x-[12px]',
        'scroll-m-[2rem]',
        'scroll-px-[var(--gap)]',
        'gap-128',
        'inset-gutter',
        'translate-x-gutter',
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
      expect(css).toContain('12px')
      expect(css).toContain('var(--gap)')
      expect(css).toContain('32rem')
      expect(css).toContain('3.25rem')
    })

    it('rejects non-tailwind gap / inset / translate / scroll syntax', async () => {
      await expectNonTargets([
        'gap4',
        'gap-3px',
        'gapx-2',
        'gapy8',
        'gap-x2',
        'gap-row-4',
        'gap-col-4',
        'insetx-4',
        'inset-5px',
        'insety2',
        'inset-inline-4',
        'inset-bs-4',
        'inset-r-4',
        'top1',
        'top-5px',
        'right2',
        '-bottom3',
        'translatex-4',
        'translate-4',
        'translate-[12px]',
        'translate-x-12px',
        'translate-z-4',
        'translatey8',
        '-translatey-1',
        'scrollm-4',
        'scroll-m4',
        'scroll-m-1/2',
        'scroll-m-auto',
        'scroll-m-2rem',
        'scrollmx-2',
        'scroll-mx2',
        'scroll-ma-4',
        'scrollpy8',
        'scroll-p4',
        'scroll-p-1/2',
        'scroll-p-auto',
        'scroll-px2',
        'scroll-p-e-4',
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

  describe('border / divide', () => {
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
        'divide-x',
        'divide-y-2',
        'divide-dashed',
        'divide-red-500',
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
        'divide-x-[3px]',
        'border-brand',
        'rounded-brand',
        'divide-x-gutter',
      ], {
        theme: {
          colors: {
            brand: '#123456',
          },
          borderRadius: {
            brand: '1.25rem',
          },
          lineWidth: {
            gutter: '3px',
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
        'dividex',
        'dividey2',
      ])
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
  })

  describe('background', () => {
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
  })

  describe('outline / transition', () => {
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

    it('matches official Tailwind 3 transition utilities', async () => {
      await expectTargets([
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

    it('rejects non-tailwind transition aliases and extensions', async () => {
      await expectNonTargets([
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
    it('matches official Tailwind 3 color utilities', async () => {
      await expectTargets([
        '[color:#fff]',
        'fill-red-500',
        'fill-[#fff]',
        'accent-red-500',
        'accent-[#fff]',
        'caret-blue-500',
        'caret-[#fff]',
      ])
    })

    it('rejects non-tailwind color aliases and bare color shortcuts', async () => {
      await expectNonTargets([
        'color-#fff',
        'c-#fff',
        'text-#fff',
        'text-red500',
        'text-color-red-500',
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
  })

  describe('stroke', () => {
    it('matches official Tailwind 3 stroke utilities', async () => {
      await expectTargets(strokeFixtures.canonical)
    })

    it('rejects non-tailwind stroke aliases and bare color shortcuts', async () => {
      await expectNonTargets(strokeFixtures.invalid)
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

  describe('typography / columns / tables / behaviors', () => {
    it('matches official Tailwind 3 typography and behavior utilities', async () => {
      await expectTargets([
        'font-bold',
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
        'font-[650]',
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

      expect(css).toContain('font-weight:650')
      expect(css).toContain('24rem')
      expect(css).toContain('3px')
    })

    it('rejects non-tailwind typography and behavior aliases', async () => {
      await expectNonTargets([
        'fontbold',
        'fw-bold',
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

  describe('effects / filters / transform', () => {
    it('matches official Tailwind 3 effects and transform utilities', async () => {
      await expectTargets([
        'shadow-md',
        'shadow-inner',
        'shadow-none',
        'shadow-red-500',
        'shadow-[#000]',
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
        'shadow-[0_0_10px_rgba(0,0,0,0.35)]',
        'drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]',
        'rotate-[13deg]',
        'scale-[1.12]',
        'blur-[3px]',
      ])

      expect(css).toContain('rgba(0, 0, 0, 0.35)')
      expect(css).toContain('drop-shadow(0 0 2px rgba(0,0,0,0.5))')
      expect(css).toContain('13deg')
      expect(css).toContain('1.12')
      expect(css).toContain('3px')
    })

    it('rejects non-tailwind effects aliases and extensions', async () => {
      await expectNonTargets([
        'shadowmd',
        'shadow-op50',
        'shadow-opacity-50',
        'shadow-inset',
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
