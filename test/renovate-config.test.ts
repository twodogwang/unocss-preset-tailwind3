import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '..')
const renovateConfigPath = join(root, 'renovate.json')

type RenovateConfig = {
  extends?: string[]
  timezone?: string
  prConcurrentLimit?: number
  branchConcurrentLimit?: number
  schedule?: string[]
  packageRules?: Array<{
    groupName?: string
    matchManagers?: string[]
    matchPackageNames?: string[]
  }>
}

function readRenovateConfig(): RenovateConfig {
  return JSON.parse(readFileSync(renovateConfigPath, 'utf8')) as RenovateConfig
}

describe('renovate configuration', () => {
  it('adds a root renovate config with a low-noise baseline', () => {
    expect(existsSync(renovateConfigPath)).toBe(true)

    const config = readRenovateConfig()

    expect(config.extends).toContain('config:recommended')
    expect(config.timezone).toBe('Asia/Shanghai')
    expect(config.prConcurrentLimit).toBe(2)
    expect(config.branchConcurrentLimit).toBe(2)
    expect(config.schedule).toContain('before 6am on monday')
  })

  it('groups upstream dependencies around the project maintenance hotspots', () => {
    const config = readRenovateConfig()

    expect(config.packageRules).toEqual(expect.arrayContaining([
      expect.objectContaining({
        groupName: 'UnoCSS packages',
        matchPackageNames: ['/^@unocss\\//'],
      }),
      expect.objectContaining({
        groupName: 'GitHub Actions',
        matchManagers: ['github-actions'],
      }),
      expect.objectContaining({
        groupName: 'TypeScript toolchain',
        matchPackageNames: expect.arrayContaining(['typescript', 'vitest', 'tsdown']),
      }),
    ]))
  })
})
