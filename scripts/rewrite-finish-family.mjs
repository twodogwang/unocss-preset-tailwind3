import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'
import {
  ALLOWED_DIRTY_FILES,
  assertFamilyReadyForHandoff,
  buildArtifactPaths,
  buildHandoffContent,
  buildLatestState,
  buildPromptContent,
  findNextPendingFamily,
  formatDateTag,
  getGitOutput,
  getUnexpectedDirtyEntries,
  HANDOFF_DIR,
  INVENTORY_PATH,
  LATEST_STATE_PATH,
  launchCodexSession,
  parseDirtyEntries,
} from './rewrite-session.mjs'

const root = resolve(import.meta.dirname, '..')

function parseArgs(argv) {
  const args = argv.filter(arg => arg !== '--')
  const flags = new Set(args.filter(arg => arg.startsWith('--')))
  const values = args.filter(arg => !arg.startsWith('--'))

  return {
    completedFamily: values[0],
    allowDirty: flags.has('--allow-dirty'),
    noLaunch: flags.has('--no-launch'),
  }
}

async function main() {
  const { completedFamily, allowDirty, noLaunch } = parseArgs(process.argv.slice(2))
  if (!completedFamily)
    throw new Error('用法：pnpm rewrite:finish-family <family> [--no-launch] [--allow-dirty]')

  const inventoryDoc = await readFile(resolve(root, INVENTORY_PATH), 'utf8')
  assertFamilyReadyForHandoff(inventoryDoc, completedFamily)

  const gitStatus = getGitOutput(root, ['status', '--short'])
  const unexpectedDirtyEntries = getUnexpectedDirtyEntries(gitStatus, ALLOWED_DIRTY_FILES)
  if (unexpectedDirtyEntries.length > 0 && !allowDirty) {
    throw new Error(`存在未提交的额外改动，已阻止自动切换上下文：\n${unexpectedDirtyEntries.join('\n')}\n如需强制继续，请追加 --allow-dirty`)
  }

  const branch = getGitOutput(root, ['branch', '--show-current'])
  const completedHead = getGitOutput(root, ['rev-parse', '--short', 'HEAD'])
  const nextFamily = findNextPendingFamily(inventoryDoc)
  const handoffDate = formatDateTag()
  const artifacts = buildArtifactPaths(handoffDate, completedFamily, nextFamily ?? 'complete')
  const dirtyEntries = parseDirtyEntries(gitStatus)

  await mkdir(resolve(root, HANDOFF_DIR), { recursive: true })

  const handoffContent = buildHandoffContent({
    cwd: root,
    handoffDate,
    branch,
    completedHead,
    completedFamily,
    nextFamily,
    dirtyEntries,
  })
  const promptContent = buildPromptContent({
    cwd: root,
    handoffPath: artifacts.handoffPath,
    nextFamily,
  })
  const latestState = buildLatestState({
    generatedAt: new Date().toISOString(),
    repoRoot: root,
    branch,
    completedHead,
    completedFamily,
    nextFamily,
    handoffPath: artifacts.handoffPath,
    promptPath: artifacts.promptPath,
  })

  await writeFile(resolve(root, artifacts.handoffPath), `${handoffContent}\n`)
  await writeFile(resolve(root, artifacts.promptPath), `${promptContent}\n`)
  await writeFile(resolve(root, LATEST_STATE_PATH), `${JSON.stringify(latestState, null, 2)}\n`)

  if (!nextFamily) {
    process.stdout.write(`handoff 已生成，但 inventory 中已无待处理规则族：\n- ${artifacts.handoffPath}\n`)
    return
  }

  if (noLaunch) {
    process.stdout.write(`handoff 已生成，未自动启动新会话：\n- ${artifacts.handoffPath}\n- ${artifacts.promptPath}\n`)
    return
  }

  await launchCodexSession({
    cwd: root,
    prompt: promptContent,
  })
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
