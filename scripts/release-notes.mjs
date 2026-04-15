import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'

const root = resolve(import.meta.dirname, '..')

export function normalizeTagVersion(tag) {
  if (!tag)
    throw new Error('Release tag is required')

  return tag.startsWith('v') ? tag.slice(1) : tag
}

export function extractReleaseNotes(input, version) {
  const lines = input.split(/\r?\n/)
  const heading = new RegExp(`^##\\s+${version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\s|$)`)
  const start = lines.findIndex(line => heading.test(line))

  if (start === -1)
    throw new Error(`Could not find changelog entry for version ${version}`)

  const end = lines.findIndex((line, index) => index > start && /^##\s+/.test(line))
  const body = lines.slice(start + 1, end === -1 ? undefined : end).join('\n').trim()

  if (!body)
    throw new Error(`Changelog entry for version ${version} is empty`)

  return body
}

async function main() {
  const args = process.argv.slice(2).filter(arg => arg !== '--')
  const [tag, outputFile] = args
  const version = normalizeTagVersion(tag ?? process.env.RELEASE_TAG ?? '')
  const changelogFile = resolve(root, process.env.CHANGELOG_FILE ?? 'CHANGELOG.md')
  const changelog = await readFile(changelogFile, 'utf8')
  const notes = extractReleaseNotes(changelog, version)

  if (outputFile) {
    await writeFile(resolve(root, outputFile), `${notes}\n`)
    return
  }

  process.stdout.write(`${notes}\n`)
}

if (import.meta.url === `file://${process.argv[1]}`)
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
