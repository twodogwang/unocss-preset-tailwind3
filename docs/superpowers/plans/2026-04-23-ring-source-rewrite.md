# Ring Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `ring` 主规则族纳入完整 rewrite 模板，并补齐 shared fixture、runtime/parity、utility spec、blocklist migration 子集和过程文档。

**Architecture:** 运行时暂时继续留在 `src/_rules/ring.ts`，不顺手扩到 `decoration`。主工作是把 `ring` 从现有 `border / ring / decoration` 混合测试中拆出来，形成 ring 专用 fixture、专用测试、专用 blocklist migration 子集和完整文档链路；只有新测试暴露真实偏差时才修改 runtime。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, PostCSS, pnpm

---

## Scope

包含：

- `ring`
- `ring-2`
- `ring-[3px]`
- `ring-[#fff]`
- `ring-blue-500/50`
- `ring-opacity-*`
- `ring-offset-2`
- `ring-offset-[3px]`
- `ring-offset-red-500`
- `ring-inset`
- `ring` utility spec
- `ring` blocklist migration 子集
- log / status / index / inventory / overall status

不包含：

- `ring-offset`
- `ring-offset-op50`
- `ring-offset-opacity-50`
- `decoration-*`
- `underline-offset-*`

## File Structure

### Existing files to modify

- `test/preset-tailwind3.test.ts`
- `test/preset-tailwind3-tailwind-diff.test.ts`
- `test/tailwind-utility-spec.ts`
- `test/preset-tailwind3-utility-spec.test.ts`
- `test/fixtures/blocklist-migration.ts`
- `test/preset-tailwind3-blocklist-messages.test.ts`
- `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- `docs/2026-04-22-tailwind3-full-rule-family-inventory.md`
- `docs/2026-04-21-tailwind-grammar-debt-task-status.md`

### New files to create

- `test/fixtures/tailwind-ring-rewrite.ts`
- `docs/superpowers/specs/2026-04-23-ring-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-23-ring-source-rewrite.md`
- `docs/2026-04-23-ring-source-rewrite-log.md`
- `docs/2026-04-23-ring-source-rewrite-status.md`

## Testing Strategy

验证层分为 5 层：

1. runtime
   - `test/preset-tailwind3.test.ts`
2. Tailwind parity
   - `test/preset-tailwind3-tailwind-diff.test.ts`
3. utility spec
   - `test/tailwind-utility-spec.ts`
   - `test/preset-tailwind3-utility-spec.test.ts`
4. blocklist migration
   - `test/fixtures/blocklist-migration.ts`
   - `test/preset-tailwind3-blocklist-messages.test.ts`
5. process docs
   - `docs/2026-04-23-ring-source-rewrite-log.md`
   - `docs/2026-04-23-ring-source-rewrite-status.md`

## Task 1: Initialize Ring Fixtures And Dedicated Tests

**Files:**
- Create: `test/fixtures/tailwind-ring-rewrite.ts`
- Modify: `test/preset-tailwind3.test.ts`
- Modify: `test/preset-tailwind3-tailwind-diff.test.ts`

- [ ] **Step 1: Add shared fixture**

建立 `ringFixtures`，包含：

```ts
canonical: [
  'ring',
  'ring-2',
  'ring-[3px]',
  'ring-[#fff]',
  'ring-blue-500/50',
  'ring-opacity-50',
  'ring-offset-2',
  'ring-offset-[3px]',
  'ring-offset-red-500',
  'ring-inset',
]
invalid: [
  'ring-offset',
  'ring-op50',
  'ring-width-2',
  'ring-size-2',
  'ring-offset-op50',
  'ring-offset-opacity-50',
]
```

- [ ] **Step 2: Add runtime tests**

在 `test/preset-tailwind3.test.ts` 新增 ring 专用断言：

- 正向：`ringFixtures.canonical`
- 反向：`ringFixtures.invalid`
- 语义：`ringFixtures.semantic`

- [ ] **Step 3: Add parity tests**

在 `test/preset-tailwind3-tailwind-diff.test.ts` 新增：

- `ringFixtures.canonical`
- `ringFixtures.invalid`

## Task 2: Register Utility Spec And Blocklist Subset

**Files:**
- Modify: `test/tailwind-utility-spec.ts`
- Modify: `test/preset-tailwind3-utility-spec.test.ts`
- Modify: `test/fixtures/blocklist-migration.ts`
- Modify: `test/preset-tailwind3-blocklist-messages.test.ts`

- [ ] **Step 1: Register utility spec**

新增 `ring`：

```ts
{
  id: 'ring',
  sourceFiles: ['src/_rules/ring.ts'],
  category: 'behavior',
  canonical: [...ringFixtures.canonical],
  invalid: [...ringFixtures.invalid],
  supportsPrefix: true,
  supportsVariants: true,
}
```

- [ ] **Step 2: Add blocklist migration subset**

新增：

```ts
export const ringBlocklistMigrationFixtures = [
  { input: 'ring-op50', replacement: 'ring-opacity-50' },
  { input: 'ring-width-2', replacement: 'ring-2' },
  { input: 'ring-size-2', replacement: 'ring-2' },
] as const
```

- [ ] **Step 3: Lock blocklist message test**

在 `test/preset-tailwind3-blocklist-messages.test.ts` 增加 dedicated subset assertion。

## Task 3: Sync Docs And Task Tracking

**Files:**
- Create: `docs/2026-04-23-ring-source-rewrite-log.md`
- Create: `docs/2026-04-23-ring-source-rewrite-status.md`
- Modify: `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- Modify: `docs/2026-04-22-tailwind3-full-rule-family-inventory.md`
- Modify: `docs/2026-04-21-tailwind-grammar-debt-task-status.md`

- [ ] **Step 1: Add log and status docs**

status 至少记录：

- `design approved`
- `implementation plan approved`
- `Task 1: ring fixtures and dedicated tests`
- `Task 2: utility spec and blocklist migration subset`
- `Task 3: docs and overall tracking sync`

- [ ] **Step 2: Sync index/inventory/status**

要求：

- `ring` 在 full inventory 进入 `completed_template`
- source rewrite index 的第二阶段里程碑补上专用文档链接
- overall status 的第二阶段里程碑补上当前 family，并把下一步推进到 `decoration / shadow / divide`

## Verification

- [ ] `pnpm exec vitest --run test/preset-tailwind3.test.ts`
- [ ] `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts`
- [ ] `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
- [ ] `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
- [ ] `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
- [ ] `pnpm run typecheck`
