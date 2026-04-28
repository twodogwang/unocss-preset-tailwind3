import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()

function expectNodeLoad(relativePath: string) {
  const result = spawnSync('node', [relativePath], {
    cwd: root,
    encoding: 'utf8',
  })

  expect(result.status, `${relativePath}\n${result.stderr}`).toBe(0)
}

function readFixtureFile(relativePath: string) {
  return readFileSync(join(root, 'fixtures/ide-eslint', relativePath), 'utf8')
}

describe('ide eslint fixture configs', () => {
  it('loads uno.config.mjs with plain node', () => {
    expectNodeLoad('fixtures/ide-eslint/uno.config.mjs')
  })

  it('loads eslint.config.mjs with plain node', () => {
    expectNodeLoad('fixtures/ide-eslint/eslint.config.mjs')
  })

  it('resolves the preset through package exports instead of direct source imports', () => {
    expect(readFixtureFile('uno.config.mjs')).toContain(`from '@twodogwang/unocss-preset-tailwind3'`)
    expect(readFixtureFile('uno.config.mjs')).not.toContain('../../src/index.ts')
    expect(readFixtureFile('eslint-plugin-blocklist-autofix.mjs')).toContain(`from '@twodogwang/unocss-preset-tailwind3'`)
    expect(readFixtureFile('eslint-plugin-blocklist-autofix.mjs')).not.toContain('../../src/index.ts')
  })

  it('keeps fixture lint scripts on plain node without tsx runtime hooks', () => {
    const packageJson = JSON.parse(readFixtureFile('package.json')) as {
      scripts?: Record<string, string>
    }

    expect(packageJson.scripts?.lint).toBe('node ./node_modules/eslint/bin/eslint.js src/demo.jsx')
    expect(packageJson.scripts?.['verify:autofix']).toBe('node scripts/verify-blocklist-autofix.mjs')
  })
})
