# Tailwind Uno Auto Diff Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an automatic audit tool that generates utility candidates, compares Tailwind 3, this Uno preset, blocklist, and migration behavior, then reports support gaps and missing high-confidence migration hints.

**Architecture:** Add a reusable audit core under `scripts/tailwind-uno-audit/` and keep the CLI wrapper in `scripts/audit-tailwind-uno-diff.mjs`. The first version focuses on pattern-generated candidates for colors, lengths, opacity shortcuts, and prefix-style aliases; it reports findings but does not modify runtime rules or blocklist migrations.

**Tech Stack:** Node ESM scripts, TypeScript via `tsx`, Tailwind CSS 3.4.17 through PostCSS, `@unocss/core`, existing `presetTailwind3`, Vitest.

---

## Scope

This plan implements discovery infrastructure, not migration fixes. It should expose examples like `border-#fff`, `border-10px`, and `border-op-50` as report findings, but it must not add those migrations to `src/blocklist-migration.ts` yet.

Out of scope for this first version:

- Full Tailwind core-plugin internal enumeration.
- Parsing Tailwind source code.
- Auto-editing fixtures, blocklist rules, or README.
- Treating every `neither` token as a required migration.

## File Structure

- Create `scripts/tailwind-uno-audit/tailwind-engine.mjs`
  - Owns Tailwind matching through PostCSS and Tailwind CSS.
  - Exports `createTailwindMatcher`.

- Create `scripts/tailwind-uno-audit/uno-engine.mjs`
  - Owns Uno matching and blocklist checks through `@unocss/core` and `presetTailwind3`.
  - Exports `createUnoAuditEngine`.

- Create `scripts/tailwind-uno-audit/candidates.mjs`
  - Owns deterministic candidate generation.
  - Exports `generateAuditCandidates`.

- Create `scripts/tailwind-uno-audit/migration-inference.mjs`
  - Owns high-confidence inferred replacements.
  - Exports `inferMigrationReplacement`.

- Create `scripts/tailwind-uno-audit/classifier.mjs`
  - Owns matrix classification and report shaping.
  - Exports `classifyAuditCandidate` and `runAudit`.

- Create `scripts/audit-tailwind-uno-diff.mjs`
  - CLI wrapper.
  - Writes JSON and Markdown reports.

- Create `test/tailwind-uno-audit.test.ts`
  - Unit tests for candidate generation, inference, and classification using small fake engines where possible.

- Modify `package.json`
  - Add `audit:tailwind-uno`.

- Optional create `.gitignore` entry for `reports/`
  - Only if reports are generated under `reports/` and should not be tracked.

## Candidate Model

Use plain objects so report entries stay stable and readable:

```js
{
  id: 'bare-hex:border:#fff',
  family: 'color',
  utility: 'border',
  token: 'border-#fff',
  expectedReplacement: 'border-[#fff]',
  source: 'pattern:bare-hex-color',
}
```

## Finding Model

Each candidate produces one result:

```js
{
  candidate,
  tailwindMatched: false,
  unoMatched: false,
  blocklisted: false,
  currentMigration: null,
  inferredMigration: 'border-[#fff]',
  inferredMigrationTailwindMatched: true,
  classification: 'missing-migration',
}
```

Classifications:

- `both-match`: Tailwind and Uno both support the token.
- `tailwind-only`: Tailwind supports the token, Uno does not.
- `uno-only`: Uno supports the token, Tailwind does not.
- `covered-migration`: Tailwind rejects the token, current migration exists, replacement is Tailwind-supported.
- `missing-migration`: Tailwind rejects the token, Uno rejects the token, inferred replacement exists and is Tailwind-supported, but current migration is missing.
- `blocked-only`: Tailwind rejects the token, Uno rejects it through blocklist, and no high-confidence replacement is inferred.
- `ignored`: Tailwind rejects the token, Uno rejects it, no blocklist hit, and no high-confidence replacement is inferred.
- `invalid-migration`: current migration exists but replacement does not match Tailwind.

## Task 1: Extract Tailwind And Uno Audit Engines

**Files:**
- Create: `scripts/tailwind-uno-audit/tailwind-engine.mjs`
- Create: `scripts/tailwind-uno-audit/uno-engine.mjs`
- Test: `test/tailwind-uno-audit.test.ts`

- [ ] **Step 1: Write failing tests for engine contracts**

Add this initial test file:

```ts
import { describe, expect, it } from 'vitest'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')

describe('tailwind uno audit engines', () => {
  it('detects Tailwind matches through the Tailwind engine', async () => {
    const { createTailwindMatcher } = await import(pathToFileURL(resolve(root, 'scripts/tailwind-uno-audit/tailwind-engine.mjs')).href) as {
      createTailwindMatcher: () => Promise<{ matches: (token: string) => Promise<boolean> }>
    }

    const matcher = await createTailwindMatcher()

    await expect(matcher.matches('border-[#fff]')).resolves.toBe(true)
    await expect(matcher.matches('border-#fff')).resolves.toBe(false)
  })

  it('detects Uno matches and blocklist state through the Uno engine', async () => {
    const { createUnoAuditEngine } = await import(pathToFileURL(resolve(root, 'scripts/tailwind-uno-audit/uno-engine.mjs')).href) as {
      createUnoAuditEngine: () => Promise<{
        matches: (token: string) => Promise<boolean>
        isBlocked: (token: string) => boolean
        getMigration: (token: string) => string | undefined
      }>
    }

    const engine = await createUnoAuditEngine()

    await expect(engine.matches('border-[#fff]')).resolves.toBe(true)
    await expect(engine.matches('border-#fff')).resolves.toBe(false)
    expect(engine.isBlocked('text-#fff')).toBe(true)
    expect(engine.getMigration('text-#fff')).toBe('text-[#fff]')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/tailwind-uno-audit.test.ts -t "audit engines"`

Expected: FAIL because `scripts/tailwind-uno-audit/tailwind-engine.mjs` does not exist.

- [ ] **Step 3: Implement `tailwind-engine.mjs`**

Create:

```js
import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import { escapeSelector } from '@unocss/core'

const sentinel = 'hidden'

export async function createTailwindMatcher(options = {}) {
  const cache = new Map()
  const tailwindConfig = options.tailwindConfig ?? {}
  const tailwindEntry = options.tailwindEntry ?? '@tailwind utilities;'

  async function matches(token) {
    const cacheKey = JSON.stringify([token, tailwindConfig, tailwindEntry])
    if (cache.has(cacheKey))
      return cache.get(cacheKey)

    const raw = `<div class="${sentinel} ${token}"></div>`
    const result = await postcss([
      tailwindcss({
        ...tailwindConfig,
        content: [{ raw, extension: 'html' }],
        corePlugins: {
          preflight: false,
        },
      }),
    ]).process(tailwindEntry, { from: undefined })

    let matched = false
    result.root.walkRules((rule) => {
      if (rule.selector !== `.${escapeSelector(sentinel)}`)
        matched = true
    })

    cache.set(cacheKey, matched)
    return matched
  }

  return { matches }
}
```

- [ ] **Step 4: Implement `uno-engine.mjs`**

Create:

```js
import { createGenerator } from '@unocss/core'
import presetTailwind3, { getBlocklistMigrationReplacement } from '../../src/index.ts'

export async function createUnoAuditEngine(options = {}) {
  const preset = presetTailwind3(options.presetOptions ?? {})
  const uno = await createGenerator({
    presets: [preset],
    ...(options.unoConfig ?? {}),
  })
  const matchCache = new Map()

  async function matches(token) {
    if (matchCache.has(token))
      return matchCache.get(token)

    const { matched } = await uno.generate(new Set([token]), { preflights: false })
    const result = matched.has(token)
    matchCache.set(token, result)
    return result
  }

  function isBlocked(token) {
    return Boolean(uno.getBlocked(token))
  }

  function getMigration(token) {
    return getBlocklistMigrationReplacement(token, options.presetOptions?.prefix)
  }

  return {
    matches,
    isBlocked,
    getMigration,
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm exec vitest --run test/tailwind-uno-audit.test.ts -t "audit engines"`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add scripts/tailwind-uno-audit/tailwind-engine.mjs scripts/tailwind-uno-audit/uno-engine.mjs test/tailwind-uno-audit.test.ts
git commit -m "test: add tailwind uno audit engines"
```

## Task 2: Add Pattern Candidate Generation

**Files:**
- Create: `scripts/tailwind-uno-audit/candidates.mjs`
- Modify: `test/tailwind-uno-audit.test.ts`

- [ ] **Step 1: Write failing tests for deterministic candidates**

Append:

```ts
describe('tailwind uno audit candidates', () => {
  it('generates high-confidence pattern candidates', async () => {
    const { generateAuditCandidates } = await import(pathToFileURL(resolve(root, 'scripts/tailwind-uno-audit/candidates.mjs')).href) as {
      generateAuditCandidates: () => Array<{ token: string, expectedReplacement?: string, family: string, source: string }>
    }

    const candidates = generateAuditCandidates()
    const byToken = new Map(candidates.map(candidate => [candidate.token, candidate]))

    expect(byToken.get('border-#fff')?.expectedReplacement).toBe('border-[#fff]')
    expect(byToken.get('ring-offset-#fff')?.expectedReplacement).toBe('ring-offset-[#fff]')
    expect(byToken.get('border-10px')?.expectedReplacement).toBe('border-[10px]')
    expect(byToken.get('outline-offset-3px')?.expectedReplacement).toBe('outline-offset-[3px]')
    expect(byToken.get('border-op-50')?.expectedReplacement).toBe('border-opacity-50')
    expect(byToken.get('divide-op-50')?.expectedReplacement).toBe('divide-opacity-50')
  })

  it('does not emit duplicate token candidates', async () => {
    const { generateAuditCandidates } = await import(pathToFileURL(resolve(root, 'scripts/tailwind-uno-audit/candidates.mjs')).href) as {
      generateAuditCandidates: () => Array<{ token: string }>
    }

    const tokens = generateAuditCandidates().map(candidate => candidate.token)

    expect(new Set(tokens).size).toBe(tokens.length)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/tailwind-uno-audit.test.ts -t "audit candidates"`

Expected: FAIL because `candidates.mjs` does not exist.

- [ ] **Step 3: Implement `candidates.mjs`**

Create:

```js
const bareHexUtilities = [
  'text',
  'bg',
  'border',
  'border-x',
  'border-y',
  'border-t',
  'border-r',
  'border-b',
  'border-l',
  'border-s',
  'border-e',
  'ring',
  'ring-offset',
  'outline',
  'decoration',
  'divide',
  'from',
  'via',
  'to',
  'fill',
  'stroke',
  'accent',
  'caret',
]

const bareLengthUtilities = [
  'border',
  'border-x',
  'border-y',
  'border-t',
  'border-r',
  'border-b',
  'border-l',
  'border-s',
  'border-e',
  'rounded',
  'rounded-t',
  'rounded-r',
  'rounded-b',
  'rounded-l',
  'rounded-s',
  'rounded-e',
  'outline',
  'outline-offset',
  'gap',
  'gap-x',
  'gap-y',
  'space-x',
  'space-y',
  'border-spacing',
  'border-spacing-x',
  'border-spacing-y',
  'text',
  'leading',
  'tracking',
  'align',
]

const opacityShortcutUtilities = [
  'bg',
  'border',
  'ring',
  'divide',
]

const prefixAliases = [
  ['text-color-red-500', 'text-red-500'],
  ['border-color-red-500', 'border-red-500'],
  ['border-s-color-red-500', 'border-s-red-500'],
  ['outline-color-red-500', 'outline-red-500'],
  ['outline-width-2', 'outline-2'],
  ['outline-style-dashed', 'outline-dashed'],
  ['ring-width-2', 'ring-2'],
  ['ring-size-2', 'ring-2'],
  ['stroke-width-2', 'stroke-2'],
  ['stroke-size-2', 'stroke-2'],
  ['transition-delay-75', 'delay-75'],
  ['transition-ease-linear', 'ease-linear'],
]

function candidate(id, family, utility, token, expectedReplacement, source) {
  return {
    id,
    family,
    utility,
    token,
    expectedReplacement,
    source,
  }
}

function unique(candidates) {
  const seen = new Set()
  return candidates.filter((item) => {
    if (seen.has(item.token))
      return false
    seen.add(item.token)
    return true
  })
}

export function generateAuditCandidates() {
  const candidates = []

  for (const utility of bareHexUtilities) {
    for (const color of ['#fff', '#eee']) {
      candidates.push(candidate(
        `bare-hex:${utility}:${color}`,
        'color',
        utility,
        `${utility}-${color}`,
        `${utility}-[${color}]`,
        'pattern:bare-hex-color',
      ))
    }
  }

  for (const utility of bareLengthUtilities) {
    for (const value of ['3px', '10px']) {
      candidates.push(candidate(
        `bare-length:${utility}:${value}`,
        'length',
        utility,
        `${utility}-${value}`,
        `${utility}-[${value}]`,
        'pattern:bare-length',
      ))
    }
  }

  for (const utility of opacityShortcutUtilities) {
    for (const value of ['50']) {
      candidates.push(candidate(
        `opacity-shortcut:${utility}:op${value}`,
        'opacity',
        utility,
        `${utility}-op${value}`,
        `${utility}-opacity-${value}`,
        'pattern:opacity-shortcut',
      ))
      candidates.push(candidate(
        `opacity-shortcut:${utility}:op-${value}`,
        'opacity',
        utility,
        `${utility}-op-${value}`,
        `${utility}-opacity-${value}`,
        'pattern:opacity-shortcut',
      ))
    }
  }

  for (const [token, replacement] of prefixAliases) {
    const utility = token.split('-')[0]
    candidates.push(candidate(
      `prefix-alias:${token}`,
      'prefix-alias',
      utility,
      token,
      replacement,
      'pattern:prefix-alias',
    ))
  }

  return unique(candidates)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest --run test/tailwind-uno-audit.test.ts -t "audit candidates"`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/tailwind-uno-audit/candidates.mjs test/tailwind-uno-audit.test.ts
git commit -m "feat: generate tailwind uno audit candidates"
```

## Task 3: Add Migration Inference And Classifier

**Files:**
- Create: `scripts/tailwind-uno-audit/migration-inference.mjs`
- Create: `scripts/tailwind-uno-audit/classifier.mjs`
- Modify: `test/tailwind-uno-audit.test.ts`

- [ ] **Step 1: Write failing tests for inference and classification**

Append:

```ts
describe('tailwind uno audit classification', () => {
  it('infers only high-confidence replacements', async () => {
    const { inferMigrationReplacement } = await import(pathToFileURL(resolve(root, 'scripts/tailwind-uno-audit/migration-inference.mjs')).href) as {
      inferMigrationReplacement: (candidate: { token: string, expectedReplacement?: string }) => string | undefined
    }

    expect(inferMigrationReplacement({ token: 'border-#fff', expectedReplacement: 'border-[#fff]' })).toBe('border-[#fff]')
    expect(inferMigrationReplacement({ token: 'flex-grow-1' })).toBeUndefined()
  })

  it('classifies missing migration when inferred replacement is Tailwind-supported', async () => {
    const { classifyAuditCandidate } = await import(pathToFileURL(resolve(root, 'scripts/tailwind-uno-audit/classifier.mjs')).href) as {
      classifyAuditCandidate: (input: any) => Promise<any>
    }

    const result = await classifyAuditCandidate({
      candidate: {
        token: 'border-#fff',
        expectedReplacement: 'border-[#fff]',
      },
      tailwindMatches: async (token: string) => token === 'border-[#fff]',
      unoMatches: async () => false,
      isBlocked: () => false,
      getMigration: () => undefined,
    })

    expect(result.classification).toBe('missing-migration')
    expect(result.inferredMigration).toBe('border-[#fff]')
  })

  it('classifies existing valid migrations as covered', async () => {
    const { classifyAuditCandidate } = await import(pathToFileURL(resolve(root, 'scripts/tailwind-uno-audit/classifier.mjs')).href) as {
      classifyAuditCandidate: (input: any) => Promise<any>
    }

    const result = await classifyAuditCandidate({
      candidate: {
        token: 'text-#fff',
        expectedReplacement: 'text-[#fff]',
      },
      tailwindMatches: async (token: string) => token === 'text-[#fff]',
      unoMatches: async () => false,
      isBlocked: () => true,
      getMigration: () => 'text-[#fff]',
    })

    expect(result.classification).toBe('covered-migration')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/tailwind-uno-audit.test.ts -t "audit classification"`

Expected: FAIL because `migration-inference.mjs` and `classifier.mjs` do not exist.

- [ ] **Step 3: Implement `migration-inference.mjs`**

Create:

```js
export function inferMigrationReplacement(candidate) {
  return candidate.expectedReplacement
}
```

- [ ] **Step 4: Implement `classifier.mjs`**

Create:

```js
import { generateAuditCandidates } from './candidates.mjs'
import { inferMigrationReplacement } from './migration-inference.mjs'
import { createTailwindMatcher } from './tailwind-engine.mjs'
import { createUnoAuditEngine } from './uno-engine.mjs'

export async function classifyAuditCandidate(input) {
  const {
    candidate,
    tailwindMatches,
    unoMatches,
    isBlocked,
    getMigration,
  } = input

  const tailwindMatched = await tailwindMatches(candidate.token)
  const unoMatched = await unoMatches(candidate.token)
  const blocklisted = isBlocked(candidate.token)
  const currentMigration = getMigration(candidate.token) ?? null
  const inferredMigration = inferMigrationReplacement(candidate) ?? null
  const replacementToVerify = currentMigration ?? inferredMigration
  const inferredMigrationTailwindMatched = inferredMigration
    ? await tailwindMatches(inferredMigration)
    : false
  const currentMigrationTailwindMatched = currentMigration
    ? await tailwindMatches(currentMigration)
    : false

  let classification
  if (tailwindMatched && unoMatched) {
    classification = 'both-match'
  }
  else if (tailwindMatched) {
    classification = 'tailwind-only'
  }
  else if (unoMatched) {
    classification = 'uno-only'
  }
  else if (currentMigration && currentMigrationTailwindMatched) {
    classification = 'covered-migration'
  }
  else if (currentMigration && !currentMigrationTailwindMatched) {
    classification = 'invalid-migration'
  }
  else if (inferredMigration && inferredMigrationTailwindMatched) {
    classification = 'missing-migration'
  }
  else if (blocklisted) {
    classification = 'blocked-only'
  }
  else {
    classification = 'ignored'
  }

  return {
    candidate,
    token: candidate.token,
    tailwindMatched,
    unoMatched,
    blocklisted,
    currentMigration,
    inferredMigration,
    inferredMigrationTailwindMatched,
    currentMigrationTailwindMatched,
    replacementToVerify,
    classification,
  }
}

export async function runAudit(options = {}) {
  const tailwind = await createTailwindMatcher(options.tailwind ?? {})
  const uno = await createUnoAuditEngine(options.uno ?? {})
  const candidates = options.candidates ?? generateAuditCandidates()
  const results = []

  for (const candidate of candidates) {
    results.push(await classifyAuditCandidate({
      candidate,
      tailwindMatches: token => tailwind.matches(token),
      unoMatches: token => uno.matches(token),
      isBlocked: token => uno.isBlocked(token),
      getMigration: token => uno.getMigration(token),
    }))
  }

  return results
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm exec vitest --run test/tailwind-uno-audit.test.ts -t "audit classification"`

Expected: PASS.

- [ ] **Step 6: Run full audit unit test**

Run: `pnpm exec vitest --run test/tailwind-uno-audit.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add scripts/tailwind-uno-audit/migration-inference.mjs scripts/tailwind-uno-audit/classifier.mjs test/tailwind-uno-audit.test.ts
git commit -m "feat: classify tailwind uno audit findings"
```

## Task 4: Add CLI And Report Writers

**Files:**
- Create: `scripts/audit-tailwind-uno-diff.mjs`
- Modify: `package.json`
- Modify: `.gitignore` if report output is ignored
- Modify: `test/tailwind-uno-audit.test.ts`

- [ ] **Step 1: Write failing tests for report formatting helpers**

Append:

```ts
describe('tailwind uno audit report formatting', () => {
  it('formats markdown with action-focused sections', async () => {
    const { formatMarkdownReport } = await import(pathToFileURL(resolve(root, 'scripts/audit-tailwind-uno-diff.mjs')).href) as {
      formatMarkdownReport: (results: Array<any>) => string
    }

    const markdown = formatMarkdownReport([
      {
        token: 'border-#fff',
        classification: 'missing-migration',
        inferredMigration: 'border-[#fff]',
        candidate: { family: 'color', source: 'pattern:bare-hex-color' },
      },
      {
        token: 'text-#fff',
        classification: 'covered-migration',
        currentMigration: 'text-[#fff]',
        candidate: { family: 'color', source: 'pattern:bare-hex-color' },
      },
    ])

    expect(markdown).toContain('# Tailwind Uno Diff Audit')
    expect(markdown).toContain('## Missing Migration')
    expect(markdown).toContain('border-#fff -> border-[#fff]')
    expect(markdown).not.toContain('text-#fff -> text-[#fff]')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/tailwind-uno-audit.test.ts -t "report formatting"`

Expected: FAIL because `scripts/audit-tailwind-uno-diff.mjs` does not exist.

- [ ] **Step 3: Implement CLI report formatter and main**

Create:

```js
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'
import { runAudit } from './tailwind-uno-audit/classifier.mjs'

const importantClassifications = [
  'missing-migration',
  'tailwind-only',
  'uno-only',
  'invalid-migration',
]

function titleFor(classification) {
  return classification
    .split('-')
    .map(part => part[0].toUpperCase() + part.slice(1))
    .join(' ')
}

function renderResultLine(result) {
  const replacement = result.currentMigration ?? result.inferredMigration
  const suffix = replacement ? ` -> ${replacement}` : ''
  return `- \`${result.token}${suffix}\` (${result.candidate.family}, ${result.candidate.source})`
}

export function formatMarkdownReport(results) {
  const lines = [
    '# Tailwind Uno Diff Audit',
    '',
    'This report is generated by `pnpm run audit:tailwind-uno`.',
    '',
    '## Summary',
    '',
  ]

  const counts = new Map()
  for (const result of results)
    counts.set(result.classification, (counts.get(result.classification) ?? 0) + 1)

  for (const [classification, count] of [...counts.entries()].sort())
    lines.push(`- ${classification}: ${count}`)

  for (const classification of importantClassifications) {
    const items = results.filter(result => result.classification === classification)
    if (!items.length)
      continue

    lines.push('', `## ${titleFor(classification)}`, '')
    for (const item of items)
      lines.push(renderResultLine(item))
  }

  lines.push('')
  return lines.join('\n')
}

function getArgValue(name, fallback) {
  const prefix = `${name}=`
  const value = process.argv.slice(2).find(arg => arg.startsWith(prefix))
  return value ? value.slice(prefix.length) : fallback
}

async function main() {
  const outDir = resolve(process.cwd(), getArgValue('--out-dir', 'reports'))
  const jsonPath = resolve(outDir, 'tailwind-uno-diff.json')
  const markdownPath = resolve(outDir, 'tailwind-uno-diff.md')

  const results = await runAudit()
  await mkdir(outDir, { recursive: true })
  await writeFile(jsonPath, `${JSON.stringify(results, null, 2)}\n`)
  await writeFile(markdownPath, formatMarkdownReport(results))

  const actionable = results.filter(result => importantClassifications.includes(result.classification))
  process.stdout.write(`Tailwind Uno diff audit wrote ${results.length} results to ${outDir}\n`)
  process.stdout.write(`Actionable findings: ${actionable.length}\n`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
}
```

- [ ] **Step 4: Add package script**

Modify `package.json`:

```json
"audit:tailwind-uno": "pnpm exec tsx scripts/audit-tailwind-uno-diff.mjs"
```

- [ ] **Step 5: Decide report tracking**

If generated reports should stay local, add this line to `.gitignore`:

```gitignore
reports/
```

If the team wants committed snapshots, skip this step and document that reports are checked in intentionally.

- [ ] **Step 6: Run report formatting test**

Run: `pnpm exec vitest --run test/tailwind-uno-audit.test.ts -t "report formatting"`

Expected: PASS.

- [ ] **Step 7: Run CLI once**

Run: `pnpm run audit:tailwind-uno`

Expected:

```txt
Tailwind Uno diff audit wrote <number> results to <repo>/reports
Actionable findings: <number>
```

Also confirm files exist:

```bash
ls reports/tailwind-uno-diff.json reports/tailwind-uno-diff.md
```

- [ ] **Step 8: Commit**

```bash
git add scripts/audit-tailwind-uno-diff.mjs package.json test/tailwind-uno-audit.test.ts .gitignore
git commit -m "feat: add tailwind uno diff audit report"
```

If `.gitignore` was not changed, omit it from `git add`.

## Task 5: Add Guardrails Around Known Discovery Examples

**Files:**
- Modify: `test/tailwind-uno-audit.test.ts`
- Modify: `docs/2026-04-21-tailwind-grammar-debt-task-status.md` or create a short status note only if docs need to mention the new command.

- [ ] **Step 1: Add integration test for known current gaps**

Append:

```ts
describe('tailwind uno audit known findings', { timeout: 30000 }, () => {
  it('surfaces current high-confidence missing migrations', async () => {
    const { runAudit } = await import(pathToFileURL(resolve(root, 'scripts/tailwind-uno-audit/classifier.mjs')).href) as {
      runAudit: () => Promise<Array<{ token: string, classification: string, inferredMigration?: string }>>
    }

    const results = await runAudit()
    const byToken = new Map(results.map(result => [result.token, result]))

    expect(byToken.get('border-#fff')).toMatchObject({
      classification: 'missing-migration',
      inferredMigration: 'border-[#fff]',
    })
    expect(byToken.get('border-op-50')).toMatchObject({
      classification: 'missing-migration',
      inferredMigration: 'border-opacity-50',
    })
  })
})
```

- [ ] **Step 2: Run test to verify it passes**

Run: `pnpm exec vitest --run test/tailwind-uno-audit.test.ts -t "known findings"`

Expected: PASS.

- [ ] **Step 3: Add a minimal docs note if needed**

If the project wants internal discoverability, append one short bullet to the internal status doc, not README:

```md
- `pnpm run audit:tailwind-uno` 生成 Tailwind / Uno / blocklist / migration 的候选差异报告，用于发现尚未进入 fixture 的旧写法治理缺口。
```

Use an internal doc such as `docs/2026-04-21-tailwind-grammar-debt-task-status.md`; do not add this to `README.md`.

- [ ] **Step 4: Run focused audit tests**

Run: `pnpm exec vitest --run test/tailwind-uno-audit.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add test/tailwind-uno-audit.test.ts docs/2026-04-21-tailwind-grammar-debt-task-status.md
git commit -m "test: lock tailwind uno audit findings"
```

If docs were not changed, omit the docs file from `git add`.

## Task 6: Final Verification

**Files:**
- No source edits expected.

- [ ] **Step 1: Run the new audit unit suite**

Run: `pnpm exec vitest --run test/tailwind-uno-audit.test.ts`

Expected: PASS.

- [ ] **Step 2: Run existing parity and blocklist suites touched by this plan**

Run:

```bash
pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts test/preset-tailwind3-blocklist-messages.test.ts test/blocklist-autofix-helper.test.ts
```

Expected: PASS.

- [ ] **Step 3: Run the CLI**

Run: `pnpm run audit:tailwind-uno`

Expected: command exits 0 and writes `reports/tailwind-uno-diff.json` plus `reports/tailwind-uno-diff.md`.

- [ ] **Step 4: Inspect report summary**

Run: `sed -n '1,120p' reports/tailwind-uno-diff.md`

Expected: report contains `Missing Migration` entries for current gaps such as `border-#fff -> border-[#fff]`.

- [ ] **Step 5: Check git status**

Run: `git status -sb`

Expected: only intentional tracked changes remain. Generated `reports/` should be ignored or intentionally staged according to Task 4 Step 5.

- [ ] **Step 6: Commit any final docs or test cleanup**

Only if Task 6 found cleanup changes:

```bash
git add <intentional-files>
git commit -m "chore: finalize tailwind uno audit tooling"
```

## Follow-up Work After This Plan

After this tool lands, use its report to create a separate implementation plan for actual blocklist migration fixes. That later plan should update `src/blocklist-migration.ts`, `test/fixtures/blocklist-migration.ts`, `test/blocklist-legacy-diff-audit.test.ts`, and any affected rule-family fixtures based on report findings.
