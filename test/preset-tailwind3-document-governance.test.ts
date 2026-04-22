import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const repoRoot = path.resolve(__dirname, '..')

function readRepoFile(relativePath: string) {
  return readFileSync(path.join(repoRoot, relativePath), 'utf8')
}

function runGit(args: string[]) {
  return execFileSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim()
}

function isIgnored(relativePath: string) {
  try {
    runGit(['check-ignore', relativePath])
    return true
  }
  catch {
    return false
  }
}

function isTracked(relativePath: string) {
  try {
    runGit(['ls-files', '--error-unmatch', relativePath])
    return true
  }
  catch {
    return false
  }
}

function parseUtilityManifestTable(markdown: string) {
  const rows = markdown
    .split('\n')
    .filter(line => line.startsWith('|'))
    .map(line => line.split('|').map(cell => cell.trim()).slice(1, -1))
    .filter(cells => cells.length === 6)
    .filter(cells => cells[0] && cells[0] !== 'utility' && cells[0] !== '---')

  return rows.map(([utility, status, spec, plan, log, statusDoc]) => ({
    utility,
    status,
    spec,
    plan,
    log,
    statusDoc,
  }))
}

function parseCompletedUtilities(markdown: string) {
  const match = markdown.match(/## 当前源头重写状态[\s\S]*?### 已完成 utility[\s\S]*?(?:\n## |\n### |$)/)
  if (!match)
    return []

  return match[0]
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('- `') && line.endsWith('`'))
    .map(line => line.slice(3, -1))
}

describe('source rewrite document governance', () => {
  it('keeps key task docs outside ignore rules', () => {
    expect(isIgnored('docs/2026-04-21-tailwind-grammar-debt-task-status.md')).toBe(false)
    expect(isIgnored('docs/2026-04-22-outline-source-rewrite-status.md')).toBe(false)
    expect(isIgnored('docs/superpowers/plans/2026-04-21-tailwind3-border-source-rewrite.md')).toBe(false)
    expect(isIgnored('docs/superpowers/specs/2026-04-22-outline-source-rewrite-design.md')).toBe(false)
    expect(isIgnored('docs/superpowers/plans/2026-04-22-outline-source-rewrite.md')).toBe(false)
    expect(isIgnored('internal-docs/tailwind3-source-rewrite/2026-04-21-tailwind3-source-rewrite-plan.md')).toBe(false)
  })

  it('keeps core source rewrite docs tracked in git', () => {
    expect(isTracked('internal-docs/tailwind3-source-rewrite/2026-04-21-tailwind3-source-rewrite-plan.md')).toBe(true)
    expect(isTracked('docs/superpowers/plans/2026-04-21-tailwind3-border-source-rewrite.md')).toBe(true)
    expect(isTracked('docs/superpowers/specs/2026-04-22-outline-source-rewrite-design.md')).toBe(true)
    expect(isTracked('docs/superpowers/plans/2026-04-22-outline-source-rewrite.md')).toBe(true)
    expect(isTracked('docs/2026-04-22-outline-source-rewrite-log.md')).toBe(true)
    expect(isTracked('docs/2026-04-22-outline-source-rewrite-status.md')).toBe(true)
    expect(isTracked('docs/superpowers/specs/2026-04-22-text-source-rewrite-design.md')).toBe(true)
    expect(isTracked('docs/superpowers/plans/2026-04-22-text-source-rewrite.md')).toBe(true)
    expect(isTracked('docs/2026-04-22-text-source-rewrite-log.md')).toBe(true)
    expect(isTracked('docs/2026-04-22-text-source-rewrite-status.md')).toBe(true)
    expect(isTracked('docs/superpowers/specs/2026-04-22-leading-source-rewrite-design.md')).toBe(true)
    expect(isTracked('docs/superpowers/plans/2026-04-22-leading-source-rewrite.md')).toBe(true)
    expect(isTracked('docs/2026-04-22-leading-source-rewrite-log.md')).toBe(true)
    expect(isTracked('docs/2026-04-22-leading-source-rewrite-status.md')).toBe(true)
    expect(isTracked('docs/superpowers/specs/2026-04-22-tracking-source-rewrite-design.md')).toBe(true)
    expect(isTracked('docs/superpowers/plans/2026-04-22-tracking-source-rewrite.md')).toBe(true)
    expect(isTracked('docs/2026-04-22-tracking-source-rewrite-log.md')).toBe(true)
    expect(isTracked('docs/2026-04-22-tracking-source-rewrite-status.md')).toBe(true)
    expect(isTracked('docs/superpowers/specs/2026-04-22-stroke-source-rewrite-design.md')).toBe(true)
    expect(isTracked('docs/superpowers/plans/2026-04-22-stroke-source-rewrite.md')).toBe(true)
    expect(isTracked('docs/2026-04-22-stroke-source-rewrite-log.md')).toBe(true)
    expect(isTracked('docs/2026-04-22-stroke-source-rewrite-status.md')).toBe(true)
    expect(isTracked('docs/superpowers/specs/2026-04-22-spacing-padding-margin-source-rewrite-design.md')).toBe(true)
    expect(isTracked('docs/superpowers/plans/2026-04-22-spacing-padding-margin-source-rewrite.md')).toBe(true)
    expect(isTracked('docs/2026-04-22-spacing-padding-margin-source-rewrite-log.md')).toBe(true)
    expect(isTracked('docs/2026-04-22-spacing-padding-margin-source-rewrite-status.md')).toBe(true)
    expect(isTracked('docs/superpowers/specs/2026-04-22-spacing-gap-inset-scroll-source-rewrite-design.md')).toBe(true)
    expect(isTracked('docs/superpowers/plans/2026-04-22-spacing-gap-inset-scroll-source-rewrite.md')).toBe(true)
    expect(isTracked('docs/2026-04-22-spacing-gap-inset-scroll-source-rewrite-log.md')).toBe(true)
    expect(isTracked('docs/2026-04-22-spacing-gap-inset-scroll-source-rewrite-status.md')).toBe(true)
  })

  it('marks the original source rewrite plan as a requirements doc and points to the live entry', () => {
    const overallPlan = readRepoFile('internal-docs/tailwind3-source-rewrite/2026-04-21-tailwind3-source-rewrite-plan.md')

    expect(overallPlan).toContain('当前实时状态入口')
  })

  it('keeps the source rewrite index as the structured live manifest', () => {
    const indexDoc = readRepoFile('docs/2026-04-22-tailwind3-source-rewrite-index.md')

    expect(indexDoc).toContain('唯一实时入口')
    expect(parseUtilityManifestTable(indexDoc)).toEqual([
      {
        utility: 'border',
        status: 'completed',
        spec: '-',
        plan: 'docs/superpowers/plans/2026-04-21-tailwind3-border-source-rewrite.md',
        log: '-',
        statusDoc: '-',
      },
      {
        utility: 'outline',
        status: 'completed',
        spec: 'docs/superpowers/specs/2026-04-22-outline-source-rewrite-design.md',
        plan: 'docs/superpowers/plans/2026-04-22-outline-source-rewrite.md',
        log: 'docs/2026-04-22-outline-source-rewrite-log.md',
        statusDoc: 'docs/2026-04-22-outline-source-rewrite-status.md',
      },
      {
        utility: 'text',
        status: 'completed',
        spec: 'docs/superpowers/specs/2026-04-22-text-source-rewrite-design.md',
        plan: 'docs/superpowers/plans/2026-04-22-text-source-rewrite.md',
        log: 'docs/2026-04-22-text-source-rewrite-log.md',
        statusDoc: 'docs/2026-04-22-text-source-rewrite-status.md',
      },
      {
        utility: 'leading',
        status: 'completed',
        spec: 'docs/superpowers/specs/2026-04-22-leading-source-rewrite-design.md',
        plan: 'docs/superpowers/plans/2026-04-22-leading-source-rewrite.md',
        log: 'docs/2026-04-22-leading-source-rewrite-log.md',
        statusDoc: 'docs/2026-04-22-leading-source-rewrite-status.md',
      },
      {
        utility: 'tracking',
        status: 'completed',
        spec: 'docs/superpowers/specs/2026-04-22-tracking-source-rewrite-design.md',
        plan: 'docs/superpowers/plans/2026-04-22-tracking-source-rewrite.md',
        log: 'docs/2026-04-22-tracking-source-rewrite-log.md',
        statusDoc: 'docs/2026-04-22-tracking-source-rewrite-status.md',
      },
      {
        utility: 'stroke',
        status: 'completed',
        spec: 'docs/superpowers/specs/2026-04-22-stroke-source-rewrite-design.md',
        plan: 'docs/superpowers/plans/2026-04-22-stroke-source-rewrite.md',
        log: 'docs/2026-04-22-stroke-source-rewrite-log.md',
        statusDoc: 'docs/2026-04-22-stroke-source-rewrite-status.md',
      },
      {
        utility: 'spacing',
        status: 'in_progress',
        spec: 'docs/superpowers/specs/2026-04-22-spacing-gap-inset-scroll-source-rewrite-design.md',
        plan: 'docs/superpowers/plans/2026-04-22-spacing-gap-inset-scroll-source-rewrite.md',
        log: 'docs/2026-04-22-spacing-gap-inset-scroll-source-rewrite-log.md',
        statusDoc: 'docs/2026-04-22-spacing-gap-inset-scroll-source-rewrite-status.md',
      },
      {
        utility: 'behavior',
        status: 'pending',
        spec: '-',
        plan: '-',
        log: '-',
        statusDoc: '-',
      },
    ])
  })

  it('keeps the overall status doc aligned with the live rewrite entry', () => {
    const taskStatusDoc = readRepoFile('docs/2026-04-21-tailwind-grammar-debt-task-status.md')

    expect(taskStatusDoc).toContain('实时状态入口')
    expect(parseCompletedUtilities(taskStatusDoc)).toEqual(['border', 'outline', 'text', 'leading', 'tracking', 'stroke'])
    expect(taskStatusDoc).not.toContain('test/tailwind-rule-family-inventory.ts')
  })

  it('keeps the baseline doc as background context instead of the live source of truth', () => {
    const baselineDoc = readRepoFile('docs/2026-04-21-tailwind-grammar-debt-baseline.md')

    expect(baselineDoc).toContain('背景文档')
    expect(baselineDoc).toContain('实时状态入口')
    expect(baselineDoc).not.toContain('test/tailwind-grammar-debt.ts')
  })

  it('tracks the remaining source rewrite governance docs and keeps cross-doc links stable', () => {
    const taskStatusDoc = readRepoFile('docs/2026-04-21-tailwind-grammar-debt-task-status.md')
    const baselineDoc = readRepoFile('docs/2026-04-21-tailwind-grammar-debt-baseline.md')

    expect(isTracked('docs/2026-04-21-blocklist-prefix-audit-plan.md')).toBe(true)
    expect(isTracked('docs/2026-04-21-prefix-tailwind3-strictness-status.md')).toBe(true)
    expect(isTracked('docs/2026-04-21-tailwind-grammar-debt-task-status.md')).toBe(true)
    expect(isTracked('docs/2026-04-21-tailwind-grammar-debt-baseline.md')).toBe(true)

    expect(taskStatusDoc).toContain('docs/2026-04-22-tailwind3-source-rewrite-index.md')
    expect(baselineDoc).toContain('docs/2026-04-22-tailwind3-source-rewrite-index.md')
  })
})
