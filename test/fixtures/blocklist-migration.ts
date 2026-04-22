export const outlineBlocklistMigrationFixtures = [
  { input: 'outline-color-red-500', replacement: 'outline-red-500' },
  { input: 'outline-width-2', replacement: 'outline-2' },
  { input: 'outline-style-dashed', replacement: 'outline-dashed' },
] as const

export const textBlocklistMigrationFixtures = [
  { input: 'text-#fff', replacement: 'text-[#fff]' },
  { input: 'text-size-sm', replacement: 'text-sm' },
  { input: 'font-size-sm', replacement: 'text-sm' },
  { input: 'text-10px', replacement: 'text-[10px]' },
  { input: 'text-2rem', replacement: 'text-[2rem]' },
  { input: 'text-color-red-500', replacement: 'text-red-500' },
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

export const blocklistMigrationFixtures = [
  { input: 'color-#fff', replacement: '[color:#fff]' },
  { input: 'c-#fff', replacement: 'text-[#fff]' },
  ...textBlocklistMigrationFixtures,
  ...leadingBlocklistMigrationFixtures,
  ...trackingBlocklistMigrationFixtures,
  { input: 'bg-#fff', replacement: 'bg-[#fff]' },
  { input: 'fill-#fff', replacement: 'fill-[#fff]' },
  { input: 'stroke-#fff', replacement: 'stroke-[#fff]' },
  { input: 'accent-#fff', replacement: 'accent-[#fff]' },
  { input: 'caret-#fff', replacement: 'caret-[#fff]' },
  { input: 'b-2', replacement: 'border-2' },
  { input: 'b-red-500', replacement: 'border-red-500' },
  { input: 'rd-md', replacement: 'rounded-md' },
  { input: 'fw-bold', replacement: 'font-bold' },
  { input: 'pos-absolute', replacement: 'absolute' },
  { input: 'op50', replacement: 'opacity-50' },
  { input: 'bg-op50', replacement: 'bg-opacity-50' },
  { input: 'bg-op-50', replacement: 'bg-opacity-50' },
  { input: 'border-op50', replacement: 'border-opacity-50' },
  { input: 'ring-op50', replacement: 'ring-opacity-50' },
  { input: 'ring-width-2', replacement: 'ring-2' },
  { input: 'ring-size-2', replacement: 'ring-2' },
  { input: 'border-color-red-500', replacement: 'border-red-500' },
  { input: 'border-s-color-red-500', replacement: 'border-s-red-500' },
  ...outlineBlocklistMigrationFixtures,
  { input: 'property-opacity', replacement: 'transition-opacity' },
  { input: 'transition-property-opacity', replacement: 'transition-opacity' },
  { input: 'transition-delay-75', replacement: 'delay-75' },
  { input: 'transition-ease-linear', replacement: 'ease-linear' },
] as const
