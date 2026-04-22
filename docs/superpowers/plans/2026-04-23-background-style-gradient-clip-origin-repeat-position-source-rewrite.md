# Background Style Gradient Clip Origin Repeat Position Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `background-style / gradient / clip / origin / repeat / position` 作为第二阶段第二个 family 纳入完整 rewrite 模板，并补齐 shared fixture、runtime/parity、utility spec、blocklist strictness subset 和过程文档。

**Architecture:** 运行时暂时继续留在 `src/_rules-wind3/background.ts`，不回头混入 `background-color / bg-opacity`。主工作是把 size / attachment / clip / origin / repeat / position / gradient 从现有混合测试里拆出来，形成 background-style 专用 fixture、专用测试、专用 utility spec 和 strictness-only blocklist 子集；只有新测试暴露真实偏差时才修改 runtime。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, PostCSS, pnpm

---

## Scope

包含：

- `bg-none`
- `bg-auto`
- `bg-cover`
- `bg-contain`
- `bg-fixed`
- `bg-local`
- `bg-scroll`
- `bg-clip-*`
- `bg-origin-*`
- `bg-repeat*`
- `bg-center`
- `bg-left-top`
- `bg-gradient-to-r`
- `from-* / via-* / to-*`
- `from-10% / via-30% / to-90%`
- `background-style` utility spec
- `bg-gradient-*` / `shape-*` strictness-only blocklist subset
- log / status / index / inventory / overall status

不包含：

- `bg-red-500`
- `bg-opacity-*`
- `bg-brand`
- `bg-[url(...)]`
- `bg-[length:...]`
- `bg-[position:...]`
- `box-decoration-*`

## File Structure

### Existing files to modify

- `test/preset-tailwind3.test.ts`
- `test/preset-tailwind3-tailwind-diff.test.ts`
- `test/tailwind-utility-spec.ts`
- `test/preset-tailwind3-utility-spec.test.ts`
- `test/preset-tailwind3-blocklist-messages.test.ts`
- `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- `docs/2026-04-22-tailwind3-full-rule-family-inventory.md`
- `docs/2026-04-21-tailwind-grammar-debt-task-status.md`

### New files to create

- `test/fixtures/tailwind-background-style-rewrite.ts`
- `docs/superpowers/specs/2026-04-23-background-style-gradient-clip-origin-repeat-position-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-23-background-style-gradient-clip-origin-repeat-position-source-rewrite.md`
- `docs/2026-04-23-background-style-gradient-clip-origin-repeat-position-source-rewrite-log.md`
- `docs/2026-04-23-background-style-gradient-clip-origin-repeat-position-source-rewrite-status.md`

## Testing Strategy

验证层分为 5 层：

1. runtime
   - `test/preset-tailwind3.test.ts`
2. Tailwind parity
   - `test/preset-tailwind3-tailwind-diff.test.ts`
3. utility spec
   - `test/tailwind-utility-spec.ts`
   - `test/preset-tailwind3-utility-spec.test.ts`
4. blocklist strictness subset
   - `test/preset-tailwind3-blocklist-messages.test.ts`
5. process docs
   - `docs/2026-04-23-background-style-gradient-clip-origin-repeat-position-source-rewrite-log.md`
   - `docs/2026-04-23-background-style-gradient-clip-origin-repeat-position-source-rewrite-status.md`

## Task 1: Initialize Background Style Fixtures And Dedicated Tests

**Files:**
- Create: `test/fixtures/tailwind-background-style-rewrite.ts`
- Modify: `test/preset-tailwind3.test.ts`
- Modify: `test/preset-tailwind3-tailwind-diff.test.ts`

- [ ] **Step 1: Add shared fixture**

建立 `backgroundStyleFixtures`，包含：

```ts
canonical: [
  'bg-none',
  'bg-auto',
  'bg-cover',
  'bg-contain',
  'bg-fixed',
  'bg-local',
  'bg-scroll',
  'bg-clip-border',
  'bg-clip-content',
  'bg-clip-padding',
  'bg-clip-text',
  'bg-origin-border',
  'bg-origin-content',
  'bg-origin-padding',
  'bg-repeat',
  'bg-repeat-round',
  'bg-repeat-space',
  'bg-repeat-x',
  'bg-repeat-y',
  'bg-center',
  'bg-left-top',
  'bg-gradient-to-r',
  'from-blue-500',
  'from-10%',
  'via-cyan-500',
  'via-30%',
  'to-emerald-500',
  'to-90%',
]
invalid: [
  'bg-gradient-linear',
  'bg-gradient-from-red-500',
  'bg-gradient-via-cyan-500',
  'bg-gradient-to-emerald-500',
  'bg-gradient-shape-r',
  'bg-gradient-stops-3',
  'bg-clip-inherit',
  'bg-clip-initial',
  'bg-origin-inherit',
  'bg-origin-initial',
  'bg-repeat-inherit',
  'bg-repeat-initial',
  'shape-r',
]
```

- [ ] **Step 2: Write failing runtime tests**

在 `test/preset-tailwind3.test.ts` 增加 dedicated tests：

- 正向：`backgroundStyleFixtures.canonical`
- 反向：`backgroundStyleFixtures.invalid`
- 语义：`backgroundStyleFixtures.semantic`

- [ ] **Step 3: Verify red**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts`
Expected: 先因缺少 fixture import / utility spec / blocklist subset 而失败，确认测试确实接入了新 family。

- [ ] **Step 4: Add parity tests**

在 `test/preset-tailwind3-tailwind-diff.test.ts` 增加：

- `backgroundStyleFixtures.canonical`
- `backgroundStyleFixtures.invalid`

## Task 2: Register Utility Spec And Strictness Subset

**Files:**
- Modify: `test/tailwind-utility-spec.ts`
- Modify: `test/preset-tailwind3-utility-spec.test.ts`
- Modify: `test/preset-tailwind3-blocklist-messages.test.ts`

- [ ] **Step 1: Register utility spec**

新增 `background-style`：

```ts
{
  id: 'background-style',
  sourceFiles: ['src/_rules-wind3/background.ts'],
  category: 'layout',
  canonical: [...backgroundStyleFixtures.canonical],
  invalid: [...backgroundStyleFixtures.invalid],
  supportsPrefix: true,
  supportsVariants: true,
}
```

- [ ] **Step 2: Add strictness subset assertion**

在 `test/preset-tailwind3-blocklist-messages.test.ts` 增加：

- `backgroundStyleFixtures.blocklisted`
- 全部用 `expectBlocked(...)`

## Task 3: Sync Docs And Task Tracking

**Files:**
- Create: `docs/2026-04-23-background-style-gradient-clip-origin-repeat-position-source-rewrite-log.md`
- Create: `docs/2026-04-23-background-style-gradient-clip-origin-repeat-position-source-rewrite-status.md`
- Modify: `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- Modify: `docs/2026-04-22-tailwind3-full-rule-family-inventory.md`
- Modify: `docs/2026-04-21-tailwind-grammar-debt-task-status.md`

- [ ] **Step 1: Add log and status docs**

status 至少记录：

- `design approved`
- `implementation plan approved`
- `Task 1: background style fixtures and dedicated tests`
- `Task 2: utility spec and blocklist strictness subset`
- `Task 3: docs and overall tracking sync`

- [ ] **Step 2: Sync index/inventory/status**

要求：

- `background-style / gradient / clip / origin / repeat / position` 在 full inventory 进入 `completed_template`
- source rewrite index 的第二阶段里程碑补上专用文档链接
- overall status 的第二阶段里程碑补上当前 family，并把下一步推进到 `ring`

## Verification

- [ ] `pnpm exec vitest --run test/preset-tailwind3.test.ts`
- [ ] `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts`
- [ ] `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
- [ ] `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
- [ ] `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
- [ ] `pnpm run typecheck`
