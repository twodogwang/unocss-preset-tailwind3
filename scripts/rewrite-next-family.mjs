import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'
import { launchCodexSession, LATEST_STATE_PATH } from './rewrite-session.mjs'

const root = resolve(import.meta.dirname, '..')

async function main() {
  const noLaunch = process.argv.slice(2).includes('--no-launch')
  const latestState = JSON.parse(await readFile(resolve(root, LATEST_STATE_PATH), 'utf8'))

  if (!latestState.promptPath)
    throw new Error('latest.json 中缺少 promptPath，无法恢复下一会话。')

  const repoRoot = latestState.repoRoot ?? root
  const prompt = await readFile(resolve(root, latestState.promptPath), 'utf8')

  if (noLaunch) {
    process.stdout.write(prompt)
    return
  }

  await launchCodexSession({
    cwd: repoRoot,
    prompt,
  })
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
