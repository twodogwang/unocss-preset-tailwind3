import { execFileSync, spawn } from 'node:child_process'

export const INVENTORY_PATH = 'docs/2026-04-22-tailwind3-full-rule-family-inventory.md'
export const INDEX_PATH = 'docs/2026-04-22-tailwind3-source-rewrite-index.md'
export const TASK_STATUS_PATH = 'docs/2026-04-21-tailwind-grammar-debt-task-status.md'
export const HANDOFF_DIR = 'docs/handoffs'
export const LATEST_STATE_PATH = `${HANDOFF_DIR}/latest.json`

export const REQUIRED_READ_FILES = [
  INDEX_PATH,
  INVENTORY_PATH,
  TASK_STATUS_PATH,
]

export const VERIFICATION_COMMANDS = [
  'pnpm exec vitest --run test/preset-tailwind3.test.ts',
  'pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts',
  'pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts',
  'pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts',
  'pnpm exec vitest --run test/preset-tailwind3-blocklist-prefix-audit.test.ts',
  'pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts',
  'pnpm run typecheck',
  'pnpm test',
]

export const ALLOWED_DIRTY_FILES = [
  '.vscode/settings.json',
  'fixtures/ide-eslint/src/demo.jsx',
]

function escapeRegExp(input) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function stripCodeTicks(input) {
  return input.replace(/^`+|`+$/g, '').trim()
}

function getSectionBody(markdown, heading) {
  const pattern = new RegExp(`${escapeRegExp(heading)}\\n([\\s\\S]*?)(?=\\n##\\s|$)`)
  const match = markdown.match(pattern)
  return match?.[1] ?? ''
}

function parseMarkdownTableRows(section) {
  return section
    .split('\n')
    .filter(line => line.startsWith('|'))
    .map(line => line.split('|').map(cell => cell.trim()).slice(1, -1))
    .filter(cells => cells.length > 0)
    .filter(cells => cells[0] && cells[0] !== 'family' && cells[0] !== '---')
}

export function parseCompletedFamilies(markdown) {
  const rows = parseMarkdownTableRows(getSectionBody(markdown, '## Completed Templates'))
  return rows.map(row => stripCodeTicks(row[0]))
}

export function parsePendingFamilies(markdown) {
  const rows = parseMarkdownTableRows(getSectionBody(markdown, '## Pending Tailwind-Facing Families'))
  return rows.map(row => stripCodeTicks(row[0]))
}

export function findNextPendingFamily(markdown) {
  return parsePendingFamilies(markdown)[0]
}

export function assertFamilyReadyForHandoff(markdown, completedFamily) {
  const completedFamilies = parseCompletedFamilies(markdown)
  const pendingFamilies = parsePendingFamilies(markdown)

  if (!completedFamilies.includes(completedFamily)) {
    throw new Error(`规则族 "${completedFamily}" 还没有在 inventory 中标记为 completed_template。请先完成文档同步。`)
  }

  if (pendingFamilies.includes(completedFamily)) {
    throw new Error(`规则族 "${completedFamily}" 仍出现在 pending 列表里。请先更新 inventory，再切换上下文。`)
  }
}

export function slugifyFamily(family) {
  return family
    .toLowerCase()
    .replace(/[`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatDateTag(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function buildArtifactPaths(dateTag, completedFamily, nextFamily = 'complete') {
  const completedSlug = slugifyFamily(completedFamily)
  const nextSlug = slugifyFamily(nextFamily || 'complete')
  const base = `${HANDOFF_DIR}/${dateTag}-${completedSlug}-to-${nextSlug}`

  return {
    handoffPath: `${base}-handoff.md`,
    promptPath: `${base}-prompt.txt`,
    latestStatePath: LATEST_STATE_PATH,
  }
}

export function parseDirtyEntries(statusOutput) {
  return statusOutput
    .split('\n')
    .map(line => line.trimEnd())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(.{2})\s+(.+)$/)
      if (!match)
        return line.trim()

      const [, rawStatus, path] = match
      const status = rawStatus.trim() || rawStatus
      return `${status} ${path}`
    })
}

export function getUnexpectedDirtyEntries(statusOutput, allowedDirtyFiles = ALLOWED_DIRTY_FILES) {
  return parseDirtyEntries(statusOutput).filter((entry) => {
    const path = entry.replace(/^(?:\?\?|[A-Z]+)\s+/, '')
    return !allowedDirtyFiles.includes(path)
  })
}

export function buildHandoffContent({
  cwd,
  handoffDate,
  branch,
  completedHead,
  completedFamily,
  nextFamily,
  dirtyEntries,
}) {
  const readFiles = REQUIRED_READ_FILES
    .map(file => `- \`${file}\``)
    .join('\n')
  const verification = VERIFICATION_COMMANDS
    .map(command => `- \`${command}\``)
    .join('\n')
  const dirtySection = dirtyEntries.length
    ? dirtyEntries.map(entry => `- \`${entry}\``).join('\n')
    : '- `none`'

  return [
    '# Rewrite Session Handoff',
    '',
    `状态日期：${handoffDate}`,
    `仓库：\`${cwd}\``,
    `当前分支：\`${branch}\``,
    `当前分支头：\`${completedHead}\``,
    '',
    '## 当前交接',
    '',
    `- 刚完成的规则族：\`${completedFamily}\``,
    `- 下一规则族：\`${nextFamily ?? 'none'}\``,
    '',
    '## 必读文档',
    '',
    readFiles,
    '',
    '## 固定验证命令',
    '',
    verification,
    '',
    '## 当前约束',
    '',
    '- 使用中文回答。',
    '- 不要使用 sub agent。',
    '- 继续沿用现有模板：fixture -> runtime/parity -> utility spec -> blocklist -> docs -> verification -> 2 commits。',
    '',
    '## 允许保留的本地改动',
    '',
    '- `.vscode/settings.json`',
    '- `fixtures/ide-eslint/src/demo.jsx`',
    '',
    '## 当前工作区状态',
    '',
    dirtySection,
    '',
  ].join('\n')
}

export function buildPromptContent({ cwd, handoffPath, nextFamily }) {
  return [
    '读取以下文件恢复上下文：',
    `- ${INDEX_PATH}`,
    `- ${INVENTORY_PATH}`,
    `- ${TASK_STATUS_PATH}`,
    `- ${handoffPath}`,
    '',
    `当前仓库：\`${cwd}\``,
    '保持当前分支不变。',
    '使用中文回答。',
    '不要使用 sub agent。',
    `继续下一个规则族：\`${nextFamily ?? 'none'}\`。`,
    '遵循现有模板：fixture -> runtime/parity -> utility spec -> blocklist -> docs -> verification -> 2 commits。',
    '不要动用户本地改动：',
    '- `.vscode/settings.json`',
    '- `fixtures/ide-eslint/src/demo.jsx`',
  ].join('\n')
}

export function buildLatestState({
  branch,
  completedFamily,
  completedHead,
  generatedAt,
  handoffPath,
  nextFamily,
  promptPath,
  repoRoot,
}) {
  return {
    generatedAt,
    repoRoot,
    branch,
    completedHead,
    completedFamily,
    nextFamily: nextFamily ?? null,
    handoffPath,
    promptPath,
  }
}

export function getGitOutput(cwd, args) {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim()
}

export async function launchCodexSession({
  codexBin = process.env.CODEX_BIN || 'codex',
  cwd,
  prompt,
}) {
  await new Promise((resolve, reject) => {
    const child = spawn(codexBin, ['-C', cwd, prompt], {
      cwd,
      stdio: 'inherit',
    })

    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0)
        resolve(undefined)
      else
        reject(new Error(`Codex CLI exited with code ${code ?? 'unknown'}`))
    })
  })
}
