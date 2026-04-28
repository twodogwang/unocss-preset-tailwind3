import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'

const root = resolve(import.meta.dirname, '..')
const guardedFiles = new Set([
  'CHANGELOG.md',
  '.changeset/pre.json',
])

function isAllowedReleaseBranch(headRef) {
  return /^changeset-release\//.test(headRef) || /^release\//.test(headRef)
}

export function evaluateReleaseArtifactGuard(input) {
  const {
    baseRef,
    headRef,
    changedFiles,
    basePackageVersion,
    headPackageVersion,
  } = input

  if (baseRef !== 'main' && baseRef !== 'beta')
    return { ok: true }

  const touchedGuardedFiles = changedFiles.filter(file => guardedFiles.has(file))
  const packageVersionChanged = changedFiles.includes('package.json') && basePackageVersion !== headPackageVersion

  if (!touchedGuardedFiles.length && !packageVersionChanged)
    return { ok: true }

  if (isAllowedReleaseBranch(headRef))
    return { ok: true }

  const changedTargets = [
    ...touchedGuardedFiles,
    ...(packageVersionChanged ? ['package.json#version'] : []),
  ]

  return {
    ok: false,
    reason: [
      `Release-managed files changed in PR to ${baseRef}: ${changedTargets.join(', ')}`,
      `Use a release-managed branch name instead: changeset-release/* or release/* (current head: ${headRef}).`,
    ].join(' '),
  }
}

function getChangedFiles(baseRef) {
  const output = execFileSync('git', ['diff', '--name-only', `origin/${baseRef}...HEAD`], {
    cwd: root,
    encoding: 'utf8',
  })

  return output
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
}

function getPackageVersionFromGit(ref) {
  const output = execFileSync('git', ['show', `${ref}:package.json`], {
    cwd: root,
    encoding: 'utf8',
  })

  return JSON.parse(output).version
}

function getHeadPackageVersion() {
  return JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')).version
}

function main() {
  const baseRef = process.env.GITHUB_BASE_REF
  const headRef = process.env.GITHUB_HEAD_REF

  if (!baseRef || !headRef)
    throw new Error('GITHUB_BASE_REF and GITHUB_HEAD_REF are required')

  const result = evaluateReleaseArtifactGuard({
    baseRef,
    headRef,
    changedFiles: getChangedFiles(baseRef),
    basePackageVersion: getPackageVersionFromGit(`origin/${baseRef}`),
    headPackageVersion: getHeadPackageVersion(),
  })

  if (!result.ok)
    throw new Error(result.reason)

  process.stdout.write(`Release guard passed for ${headRef} -> ${baseRef}\n`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    main()
  }
  catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  }
}
