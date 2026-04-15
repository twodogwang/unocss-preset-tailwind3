import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'

const root = resolve(import.meta.dirname, '..')

function getChangelogSections(input) {
  const lines = input.split(/\r?\n/)
  const sections = []

  for (let index = 0; index < lines.length; index++) {
    const match = lines[index].match(/^##\s+(.+?)(?:\s|$)/)
    if (!match)
      continue

    const version = match[1]
    const end = lines.findIndex((line, lineIndex) => lineIndex > index && /^##\s+/.test(line))
    const body = lines.slice(index + 1, end === -1 ? undefined : end).join('\n').trim()

    sections.push({
      version,
      body,
    })
  }

  return sections
}

export function normalizeTagVersion(tag) {
  if (!tag)
    throw new Error('Release tag is required')

  return tag.startsWith('v') ? tag.slice(1) : tag
}

export function extractReleaseNotes(input, version, lastPublishedVersion) {
  const sections = getChangelogSections(input)
  const currentIndex = sections.findIndex(section => section.version === version)

  if (currentIndex === -1)
    throw new Error(`Could not find changelog entry for version ${version}`)

  const currentSection = sections[currentIndex]
  if (!currentSection.body)
    throw new Error(`Changelog entry for version ${version} is empty`)

  if (!lastPublishedVersion)
    return currentSection.body

  const boundaryIndex = sections.findIndex((section, index) => index > currentIndex && section.version === lastPublishedVersion)
  const includedSections = sections.slice(currentIndex, boundaryIndex === -1 ? undefined : boundaryIndex)

  if (!includedSections.length)
    throw new Error(`Could not collect changelog entries up to version ${version}`)

  if (includedSections.length === 1)
    return includedSections[0].body

  return includedSections
    .map(({ version: sectionVersion, body }) => {
      if (!body)
        throw new Error(`Changelog entry for version ${sectionVersion} is empty`)

      return `## ${sectionVersion}\n\n${body}`
    })
    .join('\n\n')
}

async function main() {
  const args = process.argv.slice(2).filter(arg => arg !== '--')
  const [tag, outputFile] = args
  const version = normalizeTagVersion(tag ?? process.env.RELEASE_TAG ?? '')
  const resolvedLastPublishedVersion = process.env.LAST_PUBLISHED_VERSION
    ? normalizeTagVersion(process.env.LAST_PUBLISHED_VERSION)
    : undefined
  const changelogFile = resolve(root, process.env.CHANGELOG_FILE ?? 'CHANGELOG.md')
  const changelog = await readFile(changelogFile, 'utf8')
  const notes = extractReleaseNotes(changelog, version, resolvedLastPublishedVersion)

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
