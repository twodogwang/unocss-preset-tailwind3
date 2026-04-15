import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '..')
const packageJsonPath = join(root, 'package.json')
const readmePath = join(root, 'README.md')
const releaseWorkflowPath = join(root, '.github', 'workflows', 'release.yml')
const changelogPath = join(root, 'CHANGELOG.md')
const changesetConfigPath = join(root, '.changeset', 'config.json')
const releaseNotesScriptPath = join(root, 'scripts', 'release-notes.mjs')

describe('release automation', () => {
  it('adds changesets baseline files and root scripts', () => {
    expect(existsSync(changesetConfigPath)).toBe(true)
    expect(existsSync(changelogPath)).toBe(true)

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      scripts?: Record<string, string>
      devDependencies?: Record<string, string>
    }

    expect(packageJson.devDependencies?.['@changesets/cli']).toBeTruthy()
    expect(packageJson.scripts?.changeset).toBe('changeset')
    expect(packageJson.scripts?.['version:release']).toBe('changeset version')
    expect(packageJson.scripts?.['release:notes']).toBe('node scripts/release-notes.mjs')
  })

  it('extracts release notes for a tagged version', async () => {
    expect(existsSync(releaseNotesScriptPath)).toBe(true)

    const mod = await import(pathToFileURL(releaseNotesScriptPath).href) as {
      extractReleaseNotes: (input: string, version: string) => string
      normalizeTagVersion: (tag: string) => string
    }

    expect(mod.normalizeTagVersion('v0.1.1')).toBe('0.1.1')
    expect(mod.normalizeTagVersion('0.1.1')).toBe('0.1.1')

    const sample = [
      '# Changelog',
      '',
      '## 0.1.1',
      '',
      '- Add tag-driven release workflow.',
      '',
      '## 0.1.0',
      '',
      '- Initial release.',
      '',
    ].join('\n')

    expect(mod.extractReleaseNotes(sample, '0.1.1')).toContain('Add tag-driven release workflow.')
    expect(() => mod.extractReleaseNotes(sample, '9.9.9')).toThrow(/9\.9\.9/)
  })

  it('accepts the standard npm double-dash argument forwarding shape', () => {
    const output = execFileSync('node', [releaseNotesScriptPath, '--', 'v0.1.1'], {
      cwd: root,
      encoding: 'utf8',
    })

    expect(output).toContain('legacy utility aliases')
  })

  it('keeps tag-driven release and publishes GitHub release notes from the changelog', () => {
    const workflow = readFileSync(releaseWorkflowPath, 'utf8')

    expect(workflow).toContain("tags:")
    expect(workflow).toContain("- 'v*'")
    expect(workflow).toContain('contents: write')
    expect(workflow).toContain('pnpm run ci')
    expect(workflow).toContain('pnpm run release:notes')
    expect(workflow).toContain('npm publish --access public --provenance')
    expect(workflow).toContain('gh release create')
  })

  it('documents the changeset-driven tag release flow', () => {
    const readme = readFileSync(readmePath, 'utf8')

    expect(readme).toContain('pnpm changeset')
    expect(readme).toContain('pnpm version:release')
    expect(readme).toContain('git tag v')
  })
})
