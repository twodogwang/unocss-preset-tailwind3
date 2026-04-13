import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const presetRoot = resolve(import.meta.dirname, '..')
const presetSrcRoot = join(presetRoot, 'src')
const packageJsonPath = join(presetRoot, 'package.json')
const forbiddenImports = [
  '@unocss/preset-mini',
  '@unocss/preset-wind3',
]

function listFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const file = join(dir, entry)
    const stat = statSync(file)
    return stat.isDirectory() ? listFiles(file) : [file]
  })
}

describe('preset-tailwind3 isolation', () => {
  it('does not declare preset-mini or preset-wind3 as runtime dependencies', () => {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      dependencies?: Record<string, string>
    }
    const dependencyNames = Object.keys(packageJson.dependencies || {})

    expect(dependencyNames).not.toContain('@unocss/preset-mini')
    expect(dependencyNames).not.toContain('@unocss/preset-wind3')
  })

  it('does not import preset-mini or preset-wind3 anywhere under src', () => {
    const matches = listFiles(presetSrcRoot)
      .filter(file => file.endsWith('.ts'))
      .flatMap((file) => {
        const content = readFileSync(file, 'utf8')
        return forbiddenImports
          .filter(forbidden => content.includes(forbidden))
          .map(forbidden => `${file}:${forbidden}`)
      })

    expect(matches).toEqual([])
  })
})
