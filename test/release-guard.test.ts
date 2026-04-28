import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '..')
const workflowPath = join(root, '.github', 'workflows', 'release-guard.yml')
const scriptPath = join(root, 'scripts', 'check-release-pr.mjs')

describe('release PR guard', () => {
  it('adds a pull request workflow for main and beta', () => {
    expect(existsSync(workflowPath)).toBe(true)

    const workflow = readFileSync(workflowPath, 'utf8')

    expect(workflow).toContain('pull_request:')
    expect(workflow).toContain('- main')
    expect(workflow).toContain('- beta')
    expect(workflow).toContain('Validate release-managed files')
    expect(workflow).toContain('node scripts/check-release-pr.mjs')
  })

  it('blocks release-managed file changes from ordinary feature branches', async () => {
    const mod = await import(pathToFileURL(scriptPath).href) as {
      evaluateReleaseArtifactGuard: (input: {
        baseRef: string
        headRef: string
        changedFiles: string[]
        basePackageVersion: string
        headPackageVersion: string
      }) => { ok: boolean; reason?: string }
    }

    expect(
      mod.evaluateReleaseArtifactGuard({
        baseRef: 'beta',
        headRef: 'feature/add-rule',
        changedFiles: ['CHANGELOG.md'],
        basePackageVersion: '1.0.0-beta.1',
        headPackageVersion: '1.0.0-beta.1',
      }),
    ).toEqual({
      ok: false,
      reason: expect.stringContaining('release-managed'),
    })
  })

  it('allows release sync branches to update prerelease state on beta', async () => {
    const mod = await import(pathToFileURL(scriptPath).href) as {
      evaluateReleaseArtifactGuard: (input: {
        baseRef: string
        headRef: string
        changedFiles: string[]
        basePackageVersion: string
        headPackageVersion: string
      }) => { ok: boolean; reason?: string }
    }

    expect(
      mod.evaluateReleaseArtifactGuard({
        baseRef: 'beta',
        headRef: 'release/sync-beta-state',
        changedFiles: ['package.json', 'CHANGELOG.md', '.changeset/pre.json'],
        basePackageVersion: '1.0.0-beta.0',
        headPackageVersion: '1.0.0-beta.1',
      }),
    ).toEqual({ ok: true })
  })

  it('allows ordinary package.json edits when the version does not change', async () => {
    const mod = await import(pathToFileURL(scriptPath).href) as {
      evaluateReleaseArtifactGuard: (input: {
        baseRef: string
        headRef: string
        changedFiles: string[]
        basePackageVersion: string
        headPackageVersion: string
      }) => { ok: boolean; reason?: string }
    }

    expect(
      mod.evaluateReleaseArtifactGuard({
        baseRef: 'beta',
        headRef: 'feature/update-scripts',
        changedFiles: ['package.json'],
        basePackageVersion: '1.0.0-beta.1',
        headPackageVersion: '1.0.0-beta.1',
      }),
    ).toEqual({ ok: true })
  })

  it('allows changesets release PRs to update main release artifacts', async () => {
    const mod = await import(pathToFileURL(scriptPath).href) as {
      evaluateReleaseArtifactGuard: (input: {
        baseRef: string
        headRef: string
        changedFiles: string[]
        basePackageVersion: string
        headPackageVersion: string
      }) => { ok: boolean; reason?: string }
    }

    expect(
      mod.evaluateReleaseArtifactGuard({
        baseRef: 'main',
        headRef: 'changeset-release/main',
        changedFiles: ['package.json', 'CHANGELOG.md'],
        basePackageVersion: '1.0.0',
        headPackageVersion: '1.0.1',
      }),
    ).toEqual({ ok: true })
  })
})
