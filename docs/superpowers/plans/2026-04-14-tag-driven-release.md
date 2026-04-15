# Tag-Driven Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为当前 tag 驱动发布链路补齐 `changesets` 版本管理、`CHANGELOG.md` 和 GitHub Release 同步能力，同时保持 npm 发布流程不变。

**Architecture:** 保持根包单包发布模型不变，引入 `changesets` 作为版本与 changelog 的权威来源，并通过一个轻量脚本从 `CHANGELOG.md` 中提取当前版本的 release notes，供 GitHub Actions 在 tag 发布时创建 GitHub Release。根 `ci` 继续作为发布前校验门槛。

**Tech Stack:** pnpm workspace, Changesets, GitHub Actions, Node.js script (`.mjs`)

---

### Task 1: Add Changesets Baseline

**Files:**
- Create: `/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/.changeset/config.json`
- Create: `/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/.changeset/README.md`
- Create: `/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/CHANGELOG.md`
- Modify: `/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/package.json`

- [ ] **Step 1: Write the failing test**

Create a Vitest file that asserts:

- `.changeset/config.json` exists and is valid JSON
- root `package.json` exposes `changeset` and versioning scripts
- `CHANGELOG.md` exists with an initial title

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test test/release-automation.test.ts`
Expected: FAIL because files/scripts do not exist yet

- [ ] **Step 3: Write minimal implementation**

Add:

- `@changesets/cli` as a dev dependency
- basic `.changeset/config.json`
- `.changeset/README.md` with usage notes
- `CHANGELOG.md` initialized for the current package
- root scripts such as `changeset` and `version:release`

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test test/release-automation.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add .changeset CHANGELOG.md package.json pnpm-lock.yaml test/release-automation.test.ts
git commit -m "chore: add changesets release baseline"
```

### Task 2: Add Release Notes Extraction Script

**Files:**
- Create: `/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/scripts/release-notes.mjs`
- Modify: `/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/release-automation.test.ts`

- [ ] **Step 1: Write the failing test**

Add tests covering:

- tag `v0.1.1` maps to version `0.1.1`
- script extracts the matching changelog section
- script exits non-zero when version section is missing

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test test/release-automation.test.ts`
Expected: FAIL because script does not exist yet

- [ ] **Step 3: Write minimal implementation**

Implement `scripts/release-notes.mjs` to:

- read `CHANGELOG.md`
- accept tag via CLI argument or env
- extract matching section
- print or write notes content
- fail on missing section or empty notes

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test test/release-automation.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add scripts/release-notes.mjs test/release-automation.test.ts
git commit -m "chore: add release notes extraction script"
```

### Task 3: Wire Release Workflow

**Files:**
- Modify: `/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/.github/workflows/release.yml`
- Modify: `/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/package.json`

- [ ] **Step 1: Write the failing test**

Extend release automation tests to assert that:

- workflow still triggers on `v*`
- workflow runs `pnpm run ci`
- workflow verifies tag/package version consistency
- workflow publishes npm package
- workflow creates GitHub Release using extracted notes

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test test/release-automation.test.ts`
Expected: FAIL because workflow does not yet create GitHub Release or validate version parity

- [ ] **Step 3: Write minimal implementation**

Update release workflow to:

- install dependencies
- run `pnpm run ci`
- compare tag version with `package.json` version
- run `pnpm run release:notes`
- create GitHub Release with the extracted notes
- publish npm package with provenance

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test test/release-automation.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/release.yml package.json test/release-automation.test.ts
git commit -m "ci: publish releases with changelog notes"
```

### Task 4: Document Developer Workflow

**Files:**
- Modify: `/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/README.md`

- [ ] **Step 1: Write the failing test**

Add assertions that `README.md` documents:

- adding a changeset
- version preparation
- tag-driven release flow

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test test/release-automation.test.ts`
Expected: FAIL because README lacks release workflow documentation

- [ ] **Step 3: Write minimal implementation**

Document:

- daily development with `.changeset/*.md`
- `pnpm changeset`
- `pnpm version:release`
- `git tag vX.Y.Z && git push origin main --tags`

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test test/release-automation.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add README.md test/release-automation.test.ts
git commit -m "docs: add tag-driven release guide"
```

### Task 5: Run End-to-End Verification

**Files:**
- Modify: `/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/pnpm-lock.yaml`
- Verify: `/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/.github/workflows/release.yml`
- Verify: `/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/CHANGELOG.md`

- [ ] **Step 1: Run focused release tests**

Run: `pnpm test test/release-automation.test.ts`
Expected: PASS

- [ ] **Step 2: Run full repository CI**

Run: `pnpm run ci`
Expected: PASS, including fixture lint warnings as expected output

- [ ] **Step 3: Run version prep dry-run**

Run: `pnpm version:release -- --snapshot`
Expected: command completes or clearly documents any unsupported dry-run behavior

- [ ] **Step 4: Review changed files**

Run: `git diff -- .github/workflows/release.yml package.json README.md CHANGELOG.md .changeset`
Expected: only release automation related changes

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/release.yml package.json README.md CHANGELOG.md .changeset scripts test pnpm-lock.yaml
git commit -m "chore: automate tag-driven release changelog"
```
