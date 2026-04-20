import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '..')
const packageJsonPath = join(root, 'package.json')
const readmePath = join(root, 'README.md')
const agentsPath = join(root, 'AGENTS.md')
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
    expect(packageJson.scripts?.['release:publish']).toBe('changeset publish')
    expect(packageJson.scripts?.['release:notes']).toBe('node scripts/release-notes.mjs')
  })

  it('extracts release notes for a tagged version', async () => {
    expect(existsSync(releaseNotesScriptPath)).toBe(true)

    const mod = await import(pathToFileURL(releaseNotesScriptPath).href) as {
      extractReleaseNotes: (input: string, version: string, lastPublishedVersion?: string) => string
      normalizeTagVersion: (tag: string) => string
    }

    expect(mod.normalizeTagVersion('v0.1.1')).toBe('0.1.1')
    expect(mod.normalizeTagVersion('0.1.1')).toBe('0.1.1')

    const sample = [
      '# Changelog',
      '',
      '## 0.1.3',
      '',
      '- Keep verbose publish diagnostics.',
      '',
      '## 0.1.2',
      '',
      '- Refresh the npm CLI before publishing.',
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
    expect(mod.extractReleaseNotes(sample, '0.1.3', '0.1.0')).toContain('Keep verbose publish diagnostics.')
    expect(mod.extractReleaseNotes(sample, '0.1.3', '0.1.0')).toContain('Refresh the npm CLI before publishing.')
    expect(mod.extractReleaseNotes(sample, '0.1.3', '0.1.0')).toContain('Add tag-driven release workflow.')
    expect(mod.extractReleaseNotes(sample, '0.1.3', '0.1.0')).not.toContain('Initial release.')
    expect(() => mod.extractReleaseNotes(sample, '9.9.9')).toThrow(/9\.9\.9/)
  })

  it('accepts the standard npm double-dash argument forwarding shape', () => {
    const output = execFileSync('node', [releaseNotesScriptPath, '--', 'v0.1.1'], {
      cwd: root,
      encoding: 'utf8',
    })

    expect(output).toContain('legacy utility aliases')
  })

  it('aggregates unreleased changelog sections after the last published version', () => {
    const output = execFileSync('node', [releaseNotesScriptPath, '--', 'v0.1.3'], {
      cwd: root,
      encoding: 'utf8',
      env: {
        ...process.env,
        LAST_PUBLISHED_VERSION: '0.1.0',
      },
    })

    expect(output).toContain('## 0.1.3')
    expect(output).toContain('## 0.1.2')
    expect(output).toContain('## 0.1.1')
    expect(output).not.toContain('## 0.1.0')
  })

  it('uses changesets release PRs and publishes merged versions from the changelog', () => {
    const workflow = readFileSync(releaseWorkflowPath, 'utf8')

    expect(workflow).toContain('branches:')
    expect(workflow).toContain('- main')
    expect(workflow).toContain('contents: write')
    expect(workflow).toContain('pull-requests: write')
    expect(workflow).toContain('node-version: 24')
    expect(workflow).toContain('changesets/action@v1')
    expect(workflow).toContain("version: pnpm version:release")
    expect(workflow).toContain("steps.changesets.outputs.hasChangesets == 'false'")
    expect(workflow).toContain('pnpm run ci')
    expect(workflow).toContain('pnpm run release:publish')
    expect(workflow).toContain('npm view "$PACKAGE_NAME" version')
    expect(workflow).toContain('PACKAGE_VERSION="$(node -p "require(\'./package.json\').version")"')
    expect(workflow).toContain('LAST_PUBLISHED_VERSION')
    expect(workflow).toContain('pnpm run release:notes')
    expect(workflow).toContain('NPM_CONFIG_PROVENANCE: true')
    expect(workflow).toContain('git tag')
    expect(workflow).toContain('gh release create')
    expect(workflow).not.toContain("tags:")
    expect(workflow).not.toContain('Verify tag matches package version')
  })

  it('documents package purpose, usage, and key features', () => {
    const readme = readFileSync(readmePath, 'utf8')

    expect(readme).toContain('A strict UnoCSS preset')
    expect(readme).toContain('## Basic usage')
    expect(readme).toContain("presetTailwind3()")
    expect(readme).toContain('## What it includes')
    expect(readme).toContain('migration hints')
    expect(readme).not.toContain('## Repository maintenance')
    expect(readme).not.toContain('Renovate baseline')
    expect(readme).not.toContain('Changesets drives releases')
  })

  it('keeps repository documentation boundaries in AGENTS.md instead of the public README', () => {
    expect(existsSync(agentsPath)).toBe(true)

    const agents = readFileSync(agentsPath, 'utf8')

    expect(agents).toContain('README.md')
    expect(agents).toContain('only contain end-user package documentation')
    expect(agents).toContain('must not include repository maintenance details')
    expect(agents).toContain('.changeset/README.md')
  })

  it('requires feature work to happen on branches instead of direct commits to main', () => {
    const agents = readFileSync(agentsPath, 'utf8')

    expect(agents).toContain('Do not commit directly to `main`.')
    expect(agents).toContain('Do not perform feature work on `main`.')
    expect(agents).toContain('Changes must reach `main` through pull requests only.')
    expect(agents).toContain('restore local `main` before continuing')
  })
})
