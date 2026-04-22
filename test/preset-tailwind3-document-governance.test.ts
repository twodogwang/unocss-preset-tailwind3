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
  })

  it('marks the original source rewrite plan as a requirements doc and points to the live entry', () => {
    const overallPlan = readRepoFile('internal-docs/tailwind3-source-rewrite/2026-04-21-tailwind3-source-rewrite-plan.md')

    expect(overallPlan).toContain('当前实时状态入口')
  })
})
