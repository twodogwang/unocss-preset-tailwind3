import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '..')
const packageJsonPath = join(root, 'package.json')
const inventoryDocPath = join(root, 'docs', '2026-04-22-tailwind3-full-rule-family-inventory.md')
const finishScriptPath = join(root, 'scripts', 'rewrite-finish-family.mjs')
const nextScriptPath = join(root, 'scripts', 'rewrite-next-family.mjs')
const helperScriptPath = join(root, 'scripts', 'rewrite-session.mjs')

describe('rewrite session automation', () => {
  it('adds rewrite workflow scripts to package.json', () => {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      scripts?: Record<string, string>
    }

    expect(packageJson.scripts?.['rewrite:finish-family']).toBe('node scripts/rewrite-finish-family.mjs --')
    expect(packageJson.scripts?.['rewrite:next-family']).toBe('node scripts/rewrite-next-family.mjs')
  })

  it('ships the rewrite session automation scripts', () => {
    expect(existsSync(finishScriptPath)).toBe(true)
    expect(existsSync(nextScriptPath)).toBe(true)
    expect(existsSync(helperScriptPath)).toBe(true)
  })

  it('parses completed and pending families from the inventory doc', async () => {
    const mod = await import(pathToFileURL(helperScriptPath).href) as {
      findNextPendingFamily: (input: string) => string | undefined
      parseCompletedFamilies: (input: string) => string[]
      parsePendingFamilies: (input: string) => string[]
      slugifyFamily: (family: string) => string
    }

    const inventoryDoc = readFileSync(inventoryDocPath, 'utf8')

    expect(mod.parseCompletedFamilies(inventoryDoc)).toContain('accent')
    expect(mod.parseCompletedFamilies(inventoryDoc)).toContain('caret')
    expect(mod.parseCompletedFamilies(inventoryDoc)).toContain('font')
    expect(mod.parseCompletedFamilies(inventoryDoc)).toContain('text-align')
    expect(mod.parseCompletedFamilies(inventoryDoc)).toContain('vertical-align')
    expect(mod.parseCompletedFamilies(inventoryDoc)).toContain('text-decoration')
    expect(mod.parseCompletedFamilies(inventoryDoc)).toContain('text-indent')
    expect(mod.parseCompletedFamilies(inventoryDoc)).toContain('text-wrap / text-overflow / text-transform')
    expect(mod.parseCompletedFamilies(inventoryDoc)).toContain('tab-size')
    expect(mod.parseCompletedFamilies(inventoryDoc)).toContain('fill')
    expect(mod.parsePendingFamilies(inventoryDoc)).toContain('text-stroke')
    expect(mod.findNextPendingFamily(inventoryDoc)).toBe('text-stroke')
    expect(mod.slugifyFamily('background-color / bg-opacity')).toBe('background-color-bg-opacity')
    expect(mod.slugifyFamily('text-wrap / text-overflow / text-transform')).toBe('text-wrap-text-overflow-text-transform')
  })

  it('builds handoff and prompt content with repo constraints and next-family context', async () => {
    const mod = await import(pathToFileURL(helperScriptPath).href) as {
      buildArtifactPaths: (date: string, completedFamily: string, nextFamily: string) => {
        handoffPath: string
        latestStatePath: string
        promptPath: string
      }
      buildHandoffContent: (input: {
        branch: string
        completedFamily: string
        completedHead: string
        cwd: string
        dirtyEntries: string[]
        handoffDate: string
        nextFamily?: string
      }) => string
      buildPromptContent: (input: {
        cwd: string
        handoffPath: string
        nextFamily?: string
      }) => string
    }

    const paths = mod.buildArtifactPaths('2026-04-23', 'accent', 'caret')
    expect(paths.handoffPath).toContain('docs/handoffs/2026-04-23-accent-to-caret-handoff.md')
    expect(paths.promptPath).toContain('docs/handoffs/2026-04-23-accent-to-caret-prompt.txt')
    expect(paths.latestStatePath).toContain('docs/handoffs/latest.json')

    const handoff = mod.buildHandoffContent({
      cwd: root,
      handoffDate: '2026-04-23',
      branch: 'codex/tailwind3-source-rewrite',
      completedHead: 'abc1234',
      completedFamily: 'accent',
      nextFamily: 'caret',
      dirtyEntries: [
        'M .vscode/settings.json',
        'M fixtures/ide-eslint/src/demo.jsx',
      ],
    })

    expect(handoff).toContain('# Rewrite Session Handoff')
    expect(handoff).toContain('当前分支：`codex/tailwind3-source-rewrite`')
    expect(handoff).toContain('刚完成的规则族：`accent`')
    expect(handoff).toContain('下一规则族：`caret`')
    expect(handoff).toContain('docs/2026-04-22-tailwind3-source-rewrite-index.md')
    expect(handoff).toContain('pnpm exec vitest --run test/preset-tailwind3.test.ts')
    expect(handoff).toContain('.vscode/settings.json')
    expect(handoff).toContain('fixtures/ide-eslint/src/demo.jsx')

    const prompt = mod.buildPromptContent({
      cwd: root,
      handoffPath: paths.handoffPath,
      nextFamily: 'caret',
    })

    expect(prompt).toContain('读取以下文件恢复上下文')
    expect(prompt).toContain('使用中文回答')
    expect(prompt).toContain('不要使用 sub agent')
    expect(prompt).toContain('继续下一个规则族：`caret`')
    expect(prompt).toContain(paths.handoffPath)
  })

  it('filters out allowed local dirty files and preserves unexpected worktree changes', async () => {
    const mod = await import(pathToFileURL(helperScriptPath).href) as {
      getUnexpectedDirtyEntries: (statusOutput: string, allowedDirtyFiles?: string[]) => string[]
    }

    const statusOutput = [
      ' M .vscode/settings.json',
      ' M fixtures/ide-eslint/src/demo.jsx',
      ' M src/index.ts',
      '?? docs/handoffs/latest.json',
    ].join('\n')

    expect(mod.getUnexpectedDirtyEntries(statusOutput, [
      '.vscode/settings.json',
      'fixtures/ide-eslint/src/demo.jsx',
    ])).toEqual([
      'M src/index.ts',
      '?? docs/handoffs/latest.json',
    ])
  })
})
