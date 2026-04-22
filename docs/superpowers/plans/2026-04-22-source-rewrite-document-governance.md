# Source Rewrite Document Governance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 Tailwind 3 源头重写任务的整体文档纳入 git，并建立一份持续实时更新的总入口文档。

**Architecture:** 继续保留现有 `docs/` 与 `internal-docs/` 目录结构，但补上一个唯一的整体任务总入口，并修正 `.gitignore` 让任务文档可以正常进入 git。现有整体文档不做大规模迁移，只修正职责、状态和引用，使其与当前仓库 reality 一致。实施顺序遵循 @superpowers:test-driven-development：先写会暴露跟踪/状态断层的文档与断言，再做最小文档结构和 git 跟踪策略调整。

**Tech Stack:** Markdown, git, Vitest, pnpm

---

## Scope

包含：

- `.gitignore` 的文档跟踪策略调整
- `internal-docs/tailwind3-source-rewrite/2026-04-21-tailwind3-source-rewrite-plan.md` 纳入 git 并补充职责说明
- 新增整体任务总入口文档
- 更新现有整体任务状态/基线文档，使其与当前任务 reality 一致
- 增加一组轻量文档完整性测试，约束整体任务入口和关键链接

不包含：

- 新 utility 的运行时改动
- 旧文档的大规模目录迁移
- 全仓所有历史文档的统一改名

## File Structure

### Existing files to modify

- `.gitignore`
  - 调整 `docs/` 的跟踪策略
- `internal-docs/tailwind3-source-rewrite/2026-04-21-tailwind3-source-rewrite-plan.md`
  - 保留为原始总需求文档，并补充“实时入口”说明
- `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
  - 修正整体状态，去掉与当前 reality 冲突的表述
- `docs/2026-04-21-tailwind-grammar-debt-baseline.md`
  - 修正背景文档里的过时引用和上下文

### New files to create

- `docs/2026-04-22-tailwind3-source-rewrite-index.md`
  - 当前唯一实时入口，记录 utility 列表、状态和对应文档链接
- `test/preset-tailwind3-document-governance.test.ts`
  - 轻量文档治理测试，保护总入口和关键引用

### Responsibility boundaries

- `internal-docs/...plan.md` 只负责原始总需求与原则
- `docs/...baseline.md` 只负责历史背景与治理框架
- `docs/...task-status.md` 只负责整体阶段状态
- `docs/...rewrite-index.md` 是唯一实时入口
- `test/preset-tailwind3-document-governance.test.ts` 只负责验证文档入口和关键状态不漂移

## Testing Strategy

本次主要是文档治理，但仍需要一个最小自动化门槛，避免后续再次失真。

验证层：

1. 文档治理测试：
   - `test/preset-tailwind3-document-governance.test.ts`
2. 全量回归：
   - `pnpm test`
3. 类型/静态检查：
   - `pnpm run typecheck`

## Task 1: Establish Trackable Document Boundaries

**Files:**
- Modify: `.gitignore`
- Modify: `internal-docs/tailwind3-source-rewrite/2026-04-21-tailwind3-source-rewrite-plan.md`
- Modify: `docs/superpowers/plans/2026-04-21-tailwind3-border-source-rewrite.md`
- Modify: `docs/superpowers/specs/2026-04-22-outline-source-rewrite-design.md`
- Modify: `docs/superpowers/plans/2026-04-22-outline-source-rewrite.md`
- Modify: `docs/2026-04-22-outline-source-rewrite-log.md`
- Modify: `docs/2026-04-22-outline-source-rewrite-status.md`
- Create: `test/preset-tailwind3-document-governance.test.ts`

- [ ] **Step 1: Write the failing test**

先在 `test/preset-tailwind3-document-governance.test.ts` 写最小失败断言，至少覆盖：

```ts
expect(isIgnored('docs/2026-04-21-tailwind-grammar-debt-task-status.md')).toBe(false)
expect(isIgnored('docs/2026-04-22-outline-source-rewrite-status.md')).toBe(false)
expect(isIgnored('docs/superpowers/plans/2026-04-21-tailwind3-border-source-rewrite.md')).toBe(false)
expect(isIgnored('docs/superpowers/specs/2026-04-22-outline-source-rewrite-design.md')).toBe(false)
expect(isIgnored('docs/superpowers/plans/2026-04-22-outline-source-rewrite.md')).toBe(false)
expect(isIgnored('internal-docs/tailwind3-source-rewrite/2026-04-21-tailwind3-source-rewrite-plan.md')).toBe(false)
expect(isTracked('internal-docs/tailwind3-source-rewrite/2026-04-21-tailwind3-source-rewrite-plan.md')).toBe(true)
expect(isTracked('docs/superpowers/plans/2026-04-21-tailwind3-border-source-rewrite.md')).toBe(true)
expect(isTracked('docs/superpowers/specs/2026-04-22-outline-source-rewrite-design.md')).toBe(true)
expect(isTracked('docs/superpowers/plans/2026-04-22-outline-source-rewrite.md')).toBe(true)
expect(isTracked('docs/2026-04-22-outline-source-rewrite-log.md')).toBe(true)
expect(isTracked('docs/2026-04-22-outline-source-rewrite-status.md')).toBe(true)
expect(overallPlan).toContain('当前实时状态入口')
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
Expected: FAIL，说明关键文档仍可能被忽略，或总需求文档还没有进入 git 跟踪与实时入口说明

- [ ] **Step 3: Write minimal implementation**

实现最小改动：

- 明确移除 `.gitignore` 中对整个 `docs` 目录的忽略规则，不使用额外白名单绕行；保留其余现有忽略规则不变
- 在 `internal-docs/...plan.md` 顶部补一段说明，明确它是原始需求文档，当前实时入口以后看总表文档
- 把 `internal-docs/...plan.md` 纳入正常 git 跟踪
- 把现有的 `border` 计划文档纳入正常 git 跟踪，以便总入口引用的是有效仓库内来源
- 明确确认并保留现有 `outline` 设计 / 计划 / log / status 文档的 git 跟踪状态

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add .gitignore internal-docs/tailwind3-source-rewrite/2026-04-21-tailwind3-source-rewrite-plan.md docs/superpowers/plans/2026-04-21-tailwind3-border-source-rewrite.md docs/superpowers/specs/2026-04-22-outline-source-rewrite-design.md docs/superpowers/plans/2026-04-22-outline-source-rewrite.md docs/2026-04-22-outline-source-rewrite-log.md docs/2026-04-22-outline-source-rewrite-status.md test/preset-tailwind3-document-governance.test.ts
git commit -m "docs: establish source rewrite document tracking"
```

## Task 2: Add The Single Source Of Truth Index

**Files:**
- Create: `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- Modify: `test/preset-tailwind3-document-governance.test.ts`

- [ ] **Step 1: Write the failing test**

扩展文档治理测试，至少覆盖：

```ts
expect(parseUtilityManifestTable(indexDoc)).toEqual([
  {
    utility: 'border',
    status: 'completed',
    spec: '-',
    plan: 'docs/superpowers/plans/2026-04-21-tailwind3-border-source-rewrite.md',
    log: '-',
    statusDoc: '-',
  },
  {
    utility: 'outline',
    status: 'completed',
    spec: 'docs/superpowers/specs/2026-04-22-outline-source-rewrite-design.md',
    plan: 'docs/superpowers/plans/2026-04-22-outline-source-rewrite.md',
    log: 'docs/2026-04-22-outline-source-rewrite-log.md',
    statusDoc: 'docs/2026-04-22-outline-source-rewrite-status.md',
  },
  {
    utility: 'text',
    status: 'pending',
    spec: '-',
    plan: '-',
    log: '-',
    statusDoc: '-',
  },
  {
    utility: 'leading',
    status: 'pending',
    spec: '-',
    plan: '-',
    log: '-',
    statusDoc: '-',
  },
  {
    utility: 'tracking',
    status: 'pending',
    spec: '-',
    plan: '-',
    log: '-',
    statusDoc: '-',
  },
  {
    utility: 'stroke',
    status: 'pending',
    spec: '-',
    plan: '-',
    log: '-',
    statusDoc: '-',
  },
  {
    utility: 'spacing',
    status: 'pending',
    spec: '-',
    plan: '-',
    log: '-',
    statusDoc: '-',
  },
  {
    utility: 'behavior',
    status: 'pending',
    spec: '-',
    plan: '-',
    log: '-',
    statusDoc: '-',
  },
])
expect(countUtilityManifestRows(indexDoc)).toBe(8)
expect(indexDoc).toContain('唯一实时入口')
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
Expected: FAIL，说明总入口文档尚不存在，也还没有完整 8 个 utility 状态表

- [ ] **Step 3: Write minimal implementation**

实现内容：

- 新建总入口文档，至少列出：
  - 总目标摘要
  - utility 列表：`border`、`outline`、`text`、`leading`、`tracking`、`stroke`、`spacing`、`behavior`
  - 当前状态：`border` / `outline` 为 `completed`，其余为 `pending`
  - 每个 utility 的 `spec / plan / log / status` 列
  - 文档列规则：若某个 utility 当前确实没有对应文档，则该列明确写 `-`，不能伪造链接

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add docs/2026-04-22-tailwind3-source-rewrite-index.md test/preset-tailwind3-document-governance.test.ts
git commit -m "docs: add source rewrite status index"
```

## Task 3: Synchronize The Overall Status Document

**Files:**
- Modify: `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- Modify: `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
- Modify: `test/preset-tailwind3-document-governance.test.ts`

- [ ] **Step 1: Write the failing test**

扩展文档治理测试，至少覆盖：

```ts
expect(taskStatusDoc).toContain('实时状态入口')
expect(taskStatusDoc).toContain('border')
expect(taskStatusDoc).toContain('outline')
expect(taskStatusDoc).not.toContain('test/tailwind-rule-family-inventory.ts')
expect(parseCompletedUtilities(taskStatusDoc)).toEqual(['border', 'outline'])
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
Expected: FAIL，说明整体状态文档还没同步到当前 rewrite reality，或者仍带有过期引用

- [ ] **Step 3: Write minimal implementation**

实现内容：

- 更新 `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
  - 修正分支、已完成内容、下一步
  - 标明实时状态入口指向新的总表文档
  - 去掉对当前仓库不存在文件的“当前事实”式引用
- 如有必要，同步微调 `docs/2026-04-22-tailwind3-source-rewrite-index.md` 的表述，使其与整体状态文档一致

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add docs/2026-04-21-tailwind-grammar-debt-task-status.md docs/2026-04-22-tailwind3-source-rewrite-index.md test/preset-tailwind3-document-governance.test.ts
git commit -m "docs: sync source rewrite overall status"
```

## Task 4: Synchronize The Baseline Document

**Files:**
- Modify: `docs/2026-04-21-tailwind-grammar-debt-baseline.md`
- Modify: `test/preset-tailwind3-document-governance.test.ts`

- [ ] **Step 1: Write the failing test**

把文档治理测试扩展到至少断言：

```ts
expect(baselineDoc).toContain('背景文档')
expect(baselineDoc).toContain('实时状态入口')
expect(baselineDoc).not.toContain('test/tailwind-grammar-debt.ts')
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
Expected: FAIL，说明 baseline 文档还没有被收敛到背景职责，或仍带有过期引用

- [ ] **Step 3: Write minimal implementation**

实现内容：

- 更新 `docs/2026-04-21-tailwind-grammar-debt-baseline.md`
  - 明确它是背景文档，不是唯一实时入口
  - 补充总入口链接
  - 去掉与当前仓库 reality 冲突的关键引用

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add docs/2026-04-21-tailwind-grammar-debt-baseline.md test/preset-tailwind3-document-governance.test.ts
git commit -m "docs: sync source rewrite baseline"
```

## Task 5: Lock The Governance Gate End-To-End

**Files:**
- Modify: `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- Modify: `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
- Modify: `docs/2026-04-21-tailwind-grammar-debt-baseline.md`
- Modify: `test/preset-tailwind3-document-governance.test.ts`

- [ ] **Step 1: Write the failing test**

把文档治理测试收紧到至少断言跨文档一致性：

```ts
expect(parseUtilityManifestTable(indexDoc)).toEqual(EXPECTED_UTILITY_MANIFEST)
expect(taskStatusDoc).toContain('docs/2026-04-22-tailwind3-source-rewrite-index.md')
expect(baselineDoc).toContain('docs/2026-04-22-tailwind3-source-rewrite-index.md')
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
Expected: FAIL，说明总入口的 utility 表、链接或跨文档职责引用还没被完全锁定

- [ ] **Step 3: Write minimal implementation**

实现内容：

- 只做最后所需的最小文档/测试修正，确保：
  - 总入口 utility 表成员与顺序固定
  - 关键链接固定
  - `task-status` / `baseline` 都指向同一实时入口

- [ ] **Step 4: Run focused verification**

Run: `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
Expected: PASS

- [ ] **Step 5: Run final verification**

Run: `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
Expected: PASS

Run: `pnpm test`
Expected: PASS

Run: `pnpm run typecheck`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add test/preset-tailwind3-document-governance.test.ts docs/2026-04-22-tailwind3-source-rewrite-index.md docs/2026-04-21-tailwind-grammar-debt-task-status.md docs/2026-04-21-tailwind-grammar-debt-baseline.md
git commit -m "test: lock source rewrite document governance"
```

## Verification Checklist

- [ ] `docs/` 不再因为 `.gitignore` 被整体屏蔽
- [ ] 总需求文档已进入 git
- [ ] 总入口文档已存在并进入 git
- [ ] 总入口文档能看到 `border` / `outline` 已完成
- [ ] 总入口文档能看到完整 8 个 utility 状态表
- [ ] 总入口文档的 8 行 utility manifest 及其 `spec / plan / log / status` 列被结构化断言锁定
- [ ] 若某个 utility 当前没有对应文档，其列值明确为 `-`，而不是伪造或悬空链接
- [ ] 现有整体文档不会再冒充实时唯一入口
- [ ] 文档治理测试能在后续改动时阻止关键入口漂移
