export const textDecorationBlocklistMigrationFixtures = [
  { input: 'decoration-none', replacement: 'no-underline' },
  { input: 'decoration-underline', replacement: 'underline' },
  { input: 'decoration-overline', replacement: 'overline' },
  { input: 'decoration-line-through', replacement: 'line-through' },
] as const

export const outlineBlocklistMigrationFixtures = [
  { input: 'outline-color-red-500', replacement: 'outline-red-500' },
  { input: 'outline-width-2', replacement: 'outline-2' },
  { input: 'outline-style-dashed', replacement: 'outline-dashed' },
] as const

export const backgroundColorBlocklistMigrationFixtures = [
  { input: 'bg-#fff', replacement: 'bg-[#fff]' },
  { input: 'bg-op50', replacement: 'bg-opacity-50' },
  { input: 'bg-op-50', replacement: 'bg-opacity-50' },
] as const

export const ringBlocklistMigrationFixtures = [
  { input: 'ring-op50', replacement: 'ring-opacity-50' },
  { input: 'ring-width-2', replacement: 'ring-2' },
  { input: 'ring-size-2', replacement: 'ring-2' },
] as const

export const shadowBlocklistMigrationFixtures = [
  { input: 'shadowmd', replacement: 'shadow-md' },
  { input: 'shadow-inset', replacement: 'shadow-inner' },
] as const

export const divideBlocklistMigrationFixtures = [
  { input: 'dividex', replacement: 'divide-x' },
  { input: 'dividey2', replacement: 'divide-y-2' },
  { input: 'divide-op50', replacement: 'divide-opacity-50' },
] as const

export const decorationBlocklistMigrationFixtures = [
  { input: 'decoration-offset-4', replacement: 'underline-offset-4' },
  { input: 'underline-2', replacement: 'decoration-2' },
  { input: 'underline-[3px]', replacement: 'decoration-[3px]' },
  { input: 'underline-auto', replacement: 'decoration-auto' },
  { input: 'underline-dashed', replacement: 'decoration-dashed' },
  { input: 'underline-wavy', replacement: 'decoration-wavy' },
] as const

export const textBlocklistMigrationFixtures = [
  { input: 'text-#fff', replacement: 'text-[#fff]' },
  { input: 'text-size-sm', replacement: 'text-sm' },
  { input: 'font-size-sm', replacement: 'text-sm' },
  { input: 'text-10px', replacement: 'text-[10px]' },
  { input: 'text-2rem', replacement: 'text-[2rem]' },
  { input: 'text-color-red-500', replacement: 'text-red-500' },
] as const

export const textIndentBlocklistMigrationFixtures = [
  { input: 'text-indent-4', replacement: 'indent-4' },
  { input: 'text-indent-[10px]', replacement: 'indent-[10px]' },
  { input: 'indent-10px', replacement: 'indent-[10px]' },
] as const

export const textWrapOverflowTransformBlocklistMigrationFixtures = [
  { input: 'text-truncate', replacement: 'truncate' },
  { input: 'case-upper', replacement: 'uppercase' },
  { input: 'case-lower', replacement: 'lowercase' },
  { input: 'case-capital', replacement: 'capitalize' },
  { input: 'case-normal', replacement: 'normal-case' },
] as const

export const tabSizeBlocklistMigrationFixtures = [
  { input: 'tab', replacement: '[tab-size:4]' },
  { input: 'tab-4', replacement: '[tab-size:4]' },
  { input: 'tab-8', replacement: '[tab-size:8]' },
  { input: 'tab-[8]', replacement: '[tab-size:8]' },
  { input: 'tab-[var(--n)]', replacement: '[tab-size:var(--n)]' },
] as const

export const textStrokeBlocklistMigrationFixtures = [
  { input: 'text-stroke', replacement: '[-webkit-text-stroke-width:1.5rem]' },
  { input: 'text-stroke-2', replacement: '[-webkit-text-stroke-width:2px]' },
  { input: 'text-stroke-none', replacement: '[-webkit-text-stroke-width:0]' },
  { input: 'text-stroke-lg', replacement: '[-webkit-text-stroke-width:thick]' },
  { input: 'text-stroke-[#fff]', replacement: '[-webkit-text-stroke-color:#fff]' },
  { input: 'text-stroke-[length:var(--stroke)]', replacement: '[-webkit-text-stroke-width:var(--stroke)]' },
] as const

export const leadingBlocklistMigrationFixtures = [
  { input: 'lh-6', replacement: 'leading-6' },
  { input: 'line-height-6', replacement: 'leading-6' },
  { input: 'font-leading-6', replacement: 'leading-6' },
  { input: 'leading-20px', replacement: 'leading-[20px]' },
] as const

export const trackingBlocklistMigrationFixtures = [
  { input: 'font-tracking-wide', replacement: 'tracking-wide' },
  { input: 'tracking-0.2em', replacement: 'tracking-[0.2em]' },
] as const

export const strokeBlocklistMigrationFixtures = [
  { input: 'stroke-width-2', replacement: 'stroke-2' },
  { input: 'stroke-size-2', replacement: 'stroke-2' },
  { input: 'stroke-#fff', replacement: 'stroke-[#fff]' },
] as const

export const fillBlocklistMigrationFixtures = [
  { input: 'fill-#fff', replacement: 'fill-[#fff]' },
] as const

export const accentBlocklistMigrationFixtures = [
  { input: 'accent-#fff', replacement: 'accent-[#fff]' },
] as const

export const caretBlocklistMigrationFixtures = [
  { input: 'caret-#fff', replacement: 'caret-[#fff]' },
] as const

export const fontBlocklistMigrationFixtures = [
  { input: 'fw-bold', replacement: 'font-bold' },
  { input: 'font-650', replacement: 'font-[650]' },
] as const

export const textAlignBlocklistMigrationFixtures = [
  { input: 'text-align-left', replacement: 'text-left' },
  { input: 'text-align-center', replacement: 'text-center' },
  { input: 'text-align-right', replacement: 'text-right' },
  { input: 'text-align-justify', replacement: 'text-justify' },
  { input: 'text-align-start', replacement: 'text-start' },
  { input: 'text-align-end', replacement: 'text-end' },
] as const

export const verticalAlignBlocklistMigrationFixtures = [
  { input: 'vertical-baseline', replacement: 'align-baseline' },
  { input: 'v-baseline', replacement: 'align-baseline' },
  { input: 'align-base', replacement: 'align-baseline' },
  { input: 'align-mid', replacement: 'align-middle' },
  { input: 'align-btm', replacement: 'align-bottom' },
  { input: 'align-start', replacement: 'align-top' },
  { input: 'align-end', replacement: 'align-bottom' },
  { input: 'align-10px', replacement: 'align-[10px]' },
] as const

export const paddingMarginBlocklistMigrationFixtures = [
  { input: 'p4', replacement: 'p-4' },
  { input: 'px2', replacement: 'px-2' },
  { input: 'pt1', replacement: 'pt-1' },
  { input: 'm4', replacement: 'm-4' },
  { input: 'mx2', replacement: 'mx-2' },
  { input: '-mt1', replacement: '-mt-1' },
  { input: 'p-x-4', replacement: 'px-4' },
  { input: '-m-y-2', replacement: '-my-2' },
  { input: 'p-s-4', replacement: 'ps-4' },
  { input: 'm-e-4', replacement: 'me-4' },
  { input: 'p-5px', replacement: 'p-[5px]' },
  { input: 'm-2rem', replacement: 'm-[2rem]' },
  { input: 'mx-var(--gap)', replacement: 'mx-[var(--gap)]' },
] as const

export const gapInsetScrollBlocklistMigrationFixtures = [
  { input: 'gap4', replacement: 'gap-4' },
  { input: 'gapx2', replacement: 'gap-x-2' },
  { input: 'gapx-2', replacement: 'gap-x-2' },
  { input: 'gap-row-4', replacement: 'gap-y-4' },
  { input: 'gap-col-4', replacement: 'gap-x-4' },
  { input: 'gap-3px', replacement: 'gap-[3px]' },
  { input: 'insetx-4', replacement: 'inset-x-4' },
  { input: 'insety2', replacement: 'inset-y-2' },
  { input: 'inset-r-4', replacement: 'right-4' },
  { input: 'inset-s-4', replacement: 'start-4' },
  { input: 'top1', replacement: 'top-1' },
  { input: 'right2', replacement: 'right-2' },
  { input: 'scrollm-4', replacement: 'scroll-m-4' },
  { input: 'scroll-m4', replacement: 'scroll-m-4' },
  { input: 'scrollmx-2', replacement: 'scroll-mx-2' },
  { input: 'scrollpy8', replacement: 'scroll-py-8' },
  { input: 'scroll-p4', replacement: 'scroll-p-4' },
  { input: 'scroll-ma-4', replacement: 'scroll-m-4' },
  { input: 'scroll-pa-4', replacement: 'scroll-p-4' },
  { input: 'scroll-m-s-4', replacement: 'scroll-ms-4' },
  { input: 'scroll-p-e-4', replacement: 'scroll-pe-4' },
  { input: 'scroll-m-2rem', replacement: 'scroll-m-[2rem]' },
] as const

export const borderSpacingSpaceBlocklistMigrationFixtures = [
  { input: 'borderspacing-2', replacement: 'border-spacing-2' },
  { input: 'border-spacing-3px', replacement: 'border-spacing-[3px]' },
  { input: 'border-spacingx-2', replacement: 'border-spacing-x-2' },
  { input: 'border-spacingy4', replacement: 'border-spacing-y-4' },
  { input: 'spacex-4', replacement: 'space-x-4' },
  { input: 'spacey2', replacement: 'space-y-2' },
  { input: 'space-x-5px', replacement: 'space-x-[5px]' },
  { input: 'space-y-var(--gap)', replacement: 'space-y-[var(--gap)]' },
] as const

export const transitionBlocklistMigrationFixtures = [
  { input: 'property-opacity', replacement: 'transition-opacity' },
  { input: 'transition-property-opacity', replacement: 'transition-opacity' },
  { input: 'transition-delay-75', replacement: 'delay-75' },
  { input: 'transition-ease-linear', replacement: 'ease-linear' },
] as const

export const blocklistMigrationFixtures = [
  { input: 'color-#fff', replacement: '[color:#fff]' },
  { input: 'c-#fff', replacement: 'text-[#fff]' },
  ...textBlocklistMigrationFixtures,
  ...textIndentBlocklistMigrationFixtures,
  ...textWrapOverflowTransformBlocklistMigrationFixtures,
  ...tabSizeBlocklistMigrationFixtures,
  ...textStrokeBlocklistMigrationFixtures,
  ...textDecorationBlocklistMigrationFixtures,
  ...leadingBlocklistMigrationFixtures,
  ...trackingBlocklistMigrationFixtures,
  ...strokeBlocklistMigrationFixtures,
  ...fillBlocklistMigrationFixtures,
  ...accentBlocklistMigrationFixtures,
  ...fontBlocklistMigrationFixtures,
  ...textAlignBlocklistMigrationFixtures,
  ...verticalAlignBlocklistMigrationFixtures,
  ...paddingMarginBlocklistMigrationFixtures,
  ...gapInsetScrollBlocklistMigrationFixtures,
  ...borderSpacingSpaceBlocklistMigrationFixtures,
  ...backgroundColorBlocklistMigrationFixtures,
  ...caretBlocklistMigrationFixtures,
  { input: 'b-2', replacement: 'border-2' },
  { input: 'b-red-500', replacement: 'border-red-500' },
  { input: 'rd-md', replacement: 'rounded-md' },
  { input: 'pos-absolute', replacement: 'absolute' },
  { input: 'op50', replacement: 'opacity-50' },
  { input: 'border-op50', replacement: 'border-opacity-50' },
  ...divideBlocklistMigrationFixtures,
  ...ringBlocklistMigrationFixtures,
  ...shadowBlocklistMigrationFixtures,
  ...decorationBlocklistMigrationFixtures,
  { input: 'border-color-red-500', replacement: 'border-red-500' },
  { input: 'border-s-color-red-500', replacement: 'border-s-red-500' },
  ...outlineBlocklistMigrationFixtures,
  ...transitionBlocklistMigrationFixtures,
] as const
