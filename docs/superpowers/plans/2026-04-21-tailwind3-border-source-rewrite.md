# Tailwind 3 Border Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 以 `border` / `rounded` 规则族为第一批模板，把当前宽匹配实现重写为仅接受 Tailwind 3 正式语法的实现，同时保留 `blocklist` 作为迁移提示层。

**Architecture:** 运行时入口继续由 `src/_rules/border.ts` 持有，但合法语法和非法样例改由测试与规格清单驱动。实现顺序遵循 @superpowers:test-driven-development：先把真实 Tailwind 3 差异写成失败测试，再把宽解析器拆成显式的 width / color / opacity / radius / style 分支。Tailwind 3 本体仍是唯一行为对照源，`preset-wind3` 不参与实现决策。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, PostCSS, pnpm

---

## Scope

这个需求文档覆盖多个独立规则族，但本计划只负责第一阶段的可交付模板：

- `border-width`
- `border-radius`
- 与这两组直接相关的 blocklist 迁移提示对照
- 规格清单的最小升级，使后续规则族可以按同一模板继续推进

后续 `text`、`leading`、`tracking`、`stroke`、`spacing`、`outline`、`behavior` 应各自拆成独立计划，不要把所有规则族塞进同一轮实现。

## Current Repo Reality

先说明当前仓库真实情况，避免执行人被旧文档误导：

- 需求文档提到的 `test/tailwind-rule-family-inventory.ts` 当前不存在。
- 需求文档提到的 `test/tailwind-grammar-debt.ts` 当前不存在。
- 现在实际承担“规则族规格清单”职责的是 `test/tailwind-utility-spec.ts`。
- 当前 `src/_rules/border.ts` 仍包含宽匹配入口：
  - `border` 宽度通过 `h.bracket.cssvar.global.px(...)` 接受裸单位值，实际会错误接受 `border-10px`、`border-x-10px`
  - `rounded` 方向通过宽 `cornerMap` + `/^rounded-([trbl]{2})/` 接受非 Tailwind 3 角标，实际会错误接受 `rounded-lt-lg`、`rounded-rt-lg`

本地基线核查结果：

- 当前预设会匹配：`border-10px`、`border-x-10px`、`rounded-lt-lg`、`rounded-rt-lg`
- 本地 Tailwind 3 不匹配这些写法

这 4 个样例必须成为本计划第一批 red case。

## File Structure

### Existing files to modify

- `src/_rules/border.ts`
  - 当前 `border` / `rounded` 的全部 matcher 和 resolver 都在这里
  - 重点区域：
    - `borders` 规则表：约第 `9-31` 行
    - `handlerBorderSize`：约第 `82-85` 行
    - `handlerRounded`：约第 `105-108` 行
- `test/preset-tailwind3.test.ts`
  - 当前运行时“应匹配 / 不应匹配”边界测试
  - `border / divide` 相关区域：约第 `387-462` 行
- `test/preset-tailwind3-tailwind-diff.test.ts`
  - 当前与 Tailwind 3 的对照测试
  - `border / ring / decoration` 相关区域：约第 `174-225` 行
- `test/tailwind-utility-spec.ts`
  - 当前充当规则族规格清单
  - `border-width` / `border-radius` 当前已存在，但样例还不完整
- `test/preset-tailwind3-utility-spec.test.ts`
  - 当前只校验“规格存在”，需要升级成“规格模板完整”
- `test/preset-tailwind3-blocklist-messages.test.ts`
  - 当前已覆盖 `b-*`、`rd-*`、`border-op50`、`border-*-color-*` 的迁移提示
  - 本轮不让它承担合法性定义，只负责迁移提示不回归

### New files to create

- `test/fixtures/tailwind-border-rewrite.ts`
  - 汇总 `border-width` / `border-radius` 的 canonical、invalid、migration fixture
  - 让运行时测试、parity 测试、规格清单共用同一份边界样例

### Responsibility boundaries

- `src/_rules/border.ts` 只负责匹配与生成 CSS
- `test/fixtures/tailwind-border-rewrite.ts` 只负责定义第一批边界样例
- `test/tailwind-utility-spec.ts` 只负责“规则族规范登记”
- `test/preset-tailwind3-blocklist-messages.test.ts` 只负责迁移提示，不负责合法语法判定

## Testing Strategy

实现过程必须遵循 @superpowers:test-driven-development 和 @superpowers:verification-before-completion。

本计划只跑与当前任务直接相关的测试层：

1. 规格层：
   - `test/preset-tailwind3-utility-spec.test.ts`
2. 运行时层：
   - `test/preset-tailwind3.test.ts`
3. Tailwind 对照层：
   - `test/preset-tailwind3-tailwind-diff.test.ts`
4. 迁移提示层：
   - `test/preset-tailwind3-blocklist-messages.test.ts`

最终验证顺序：

1. 跑针对性测试文件
2. 跑 `pnpm test`
3. 跑 `pnpm run typecheck`
4. 只有全部通过，才能宣称模板完成

### Task 1: Lock Border Width Strictness

**Files:**
- Create: `test/fixtures/tailwind-border-rewrite.ts`
- Modify: `test/tailwind-utility-spec.ts:13-37`
- Modify: `test/preset-tailwind3-utility-spec.test.ts:1-16`
- Modify: `test/preset-tailwind3.test.ts:387-462`
- Modify: `test/preset-tailwind3-tailwind-diff.test.ts:174-225`
- Modify: `src/_rules/border.ts:9-18`

- [ ] **Step 1: Write the failing test**

在 `test/fixtures/tailwind-border-rewrite.ts` 先定义第一批边界样例，并让规格层、运行时层、parity 层都引用它。

```ts
export const borderWidthFixtures = {
  canonical: [
    'border',
    'border-2',
    'border-x',
    'border-x-2',
    'border-s-2',
    'border-[10px]',
    'border-x-[10px]',
  ],
  invalid: [
    'b-2',
    'border-10px',
    'border-x-10px',
    'border-color-red-500',
    'borderx',
  ],
} as const
```

在 `test/preset-tailwind3.test.ts` 和 `test/preset-tailwind3-tailwind-diff.test.ts` 新增这两个必须先失败的断言：

```ts
await expectNonTargets(['border-10px', 'border-x-10px'])
await expectTailwindParity(['border-10px', 'border-x-10px'])
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "rejects non-tailwind border aliases and shortcuts"`
Expected: FAIL，提示 `border-10px` 或 `border-x-10px` 被当前预设错误匹配

Run: `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "rejects non-tailwind border / ring / decoration aliases and extensions"`
Expected: FAIL，提示 Uno 匹配集合包含 `border-10px` 或 `border-x-10px`，但 Tailwind 3 不包含

- [ ] **Step 3: Write minimal implementation**

把 `border` 宽度解析改成“theme key 或 bracket arbitrary value”，不要再允许裸单位值直通。

```ts
function resolveBorderWidthValue(value: string | undefined, theme: Theme) {
  if (!value)
    return theme.lineWidth?.DEFAULT ?? '1px'

  if (value in (theme.lineWidth ?? {}))
    return theme.lineWidth?.[value]

  if (value.startsWith('[') && value.endsWith(']'))
    return h.bracket.cssvar.global.px(value)
}

function handlerBorderSize([, direction = '', value]: string[], { theme }: RuleContext<Theme>): CSSEntries | undefined {
  const resolved = resolveBorderWidthValue(value, theme)
  if (direction in directionMap && resolved != null)
    return directionMap[direction].map(item => [`border${item}-width`, resolved])
}
```

同时保留：

- `border`
- `border-2`
- `border-x`
- `border-s-2`
- `border-[10px]`
- `border-x-[10px]`

但必须拒绝：

- `border-10px`
- `border-x-10px`

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "border / divide"`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "border / ring / decoration"`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add test/fixtures/tailwind-border-rewrite.ts test/tailwind-utility-spec.ts test/preset-tailwind3-utility-spec.test.ts test/preset-tailwind3.test.ts test/preset-tailwind3-tailwind-diff.test.ts src/_rules/border.ts
git commit -m "test: lock border width strict tailwind syntax"
```

### Task 2: Lock Rounded Direction Strictness

**Files:**
- Modify: `test/fixtures/tailwind-border-rewrite.ts`
- Modify: `test/tailwind-utility-spec.ts:38-60`
- Modify: `test/preset-tailwind3.test.ts:387-462`
- Modify: `test/preset-tailwind3-tailwind-diff.test.ts:174-225`
- Modify: `src/_rules/border.ts:23-27`
- Modify: `src/_rules/border.ts:105-108`

- [ ] **Step 1: Write the failing test**

在 fixture 中补齐 `rounded` 的合法 / 非法方向样例。这里的关键是用真实 Tailwind 3 方向名，不再依赖 `cornerMap` 的宽别名。

```ts
export const roundedFixtures = {
  canonical: [
    'rounded',
    'rounded-md',
    'rounded-t-lg',
    'rounded-s-xl',
    'rounded-se-2xl',
    'rounded-ss-lg',
    'rounded-es-lg',
    'rounded-[10px]',
  ],
  invalid: [
    'rd-md',
    'rounded-10px',
    'roundedt-lg',
    'rounded-lt-lg',
    'rounded-rt-lg',
    'border-rounded-md',
  ],
} as const
```

在运行时和 parity 测试里新增：

```ts
await expectNonTargets(['rounded-lt-lg', 'rounded-rt-lg'])
await expectTailwindParity(['rounded-lt-lg', 'rounded-rt-lg', 'rounded-es-lg', 'rounded-ss-lg'])
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "rejects non-tailwind border aliases and shortcuts"`
Expected: FAIL，提示 `rounded-lt-lg` 或 `rounded-rt-lg` 被当前预设错误匹配

Run: `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "matches Tailwind 3 support for border / ring / decoration utilities"`
Expected: FAIL，若测试里加入 `rounded-es-lg` / `rounded-ss-lg` 与 `rounded-lt-lg` / `rounded-rt-lg` 混合输入，会看到合法和非法方向没有被严格区分

- [ ] **Step 3: Write minimal implementation**

把 `rounded` matcher 改成显式的 Tailwind 3 token，而不是 `/^rounded-([trbl]{2})/` 这种宽正则。

```ts
const roundedEdgeRE = /^rounded-([trblse])(?:-(.+))?$/
const roundedCornerRE = /^rounded-(tl|tr|br|bl|ss|se|ee|es)(?:-(.+))?$/

function resolveRoundedValue(value: string | undefined, theme: Theme) {
  if (!value)
    return theme.borderRadius?.DEFAULT ?? '0.25rem'

  if (value in (theme.borderRadius ?? {}))
    return theme.borderRadius?.[value]

  if (value.startsWith('[') && value.endsWith(']'))
    return h.bracket.cssvar.global.fraction.rem(value)
}
```

`cornerMap` 可以继续复用，但只有在 matcher 已经把 token 收紧到 Tailwind 3 正式集合之后才能调用。

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "border / divide"`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "border / ring / decoration"`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add test/fixtures/tailwind-border-rewrite.ts test/tailwind-utility-spec.ts test/preset-tailwind3.test.ts test/preset-tailwind3-tailwind-diff.test.ts src/_rules/border.ts
git commit -m "feat: rewrite rounded matcher to tailwind tokens"
```

### Task 3: Promote Border Fixtures Into The Rewrite Template

**Files:**
- Modify: `test/fixtures/tailwind-border-rewrite.ts`
- Modify: `test/tailwind-utility-spec.ts:1-60`
- Modify: `test/preset-tailwind3-utility-spec.test.ts:1-16`
- Modify: `test/preset-tailwind3.test.ts:387-462`
- Modify: `test/preset-tailwind3-tailwind-diff.test.ts:174-225`
- Modify: `test/preset-tailwind3-blocklist-messages.test.ts:41-58`

- [ ] **Step 1: Write the failing test**

把规格层从“只要有内容就算过”升级成“模板字段完整，且与 fixture 同步”。先在 `test/preset-tailwind3-utility-spec.test.ts` 写具体断言：

```ts
it('keeps border rewrite specs in sync with shared fixtures', () => {
  const ids = new Set(tailwindUtilitySpecs.map(spec => spec.id))

  expect(ids.has('border-width')).toBe(true)
  expect(ids.has('border-radius')).toBe(true)

  const width = tailwindUtilitySpecs.find(spec => spec.id === 'border-width')!
  const radius = tailwindUtilitySpecs.find(spec => spec.id === 'border-radius')!

  expect(width.invalid).toContain('border-10px')
  expect(radius.invalid).toContain('rounded-lt-lg')
  expect(width.supportsPrefix).toBe(true)
  expect(radius.supportsVariants).toBe(true)
})
```

并让 blocklist migration message 测试只引用“需要迁移提示的旧别名”，例如：

```ts
export const borderMigrationFixtures = [
  ['b-2', '旧写法 "b-2" 已禁用，请改为 "border-2"'],
  ['rd-md', '旧写法 "rd-md" 已禁用，请改为 "rounded-md"'],
  ['border-op50', '旧写法 "border-op50" 已禁用，请改为 "border-opacity-50"'],
] as const
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
Expected: FAIL，提示规格断言缺失，或者新 fixture 尚未接入规格清单

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
Expected: FAIL，直到测试改为从共享 migration fixture 读取样例

- [ ] **Step 3: Write minimal implementation**

把共享 fixture 接入三层测试与规格清单，形成后续规则族可以直接复制的模板：

```ts
export interface TailwindUtilitySpec {
  id: string
  sourceFiles: string[]
  category: 'border' | 'typography' | 'layout' | 'behavior' | 'color' | 'transform'
  canonical: string[]
  invalid: string[]
  supportsPrefix: boolean
  supportsNegative?: boolean
  supportsVariants?: boolean
  notes?: string[]
}

export const tailwindUtilitySpecs: TailwindUtilitySpec[] = [
  {
    id: 'border-width',
    sourceFiles: ['src/_rules/border.ts'],
    category: 'border',
    canonical: [...borderWidthFixtures.canonical],
    invalid: [...borderWidthFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['第一批 Tailwind 3 源头重写模板：只允许 theme key 与 bracket arbitrary width。'],
  },
  {
    id: 'border-radius',
    sourceFiles: ['src/_rules/border.ts'],
    category: 'border',
    canonical: [...roundedFixtures.canonical],
    invalid: [...roundedFixtures.invalid],
    supportsPrefix: true,
    supportsVariants: true,
    notes: ['第一批 Tailwind 3 源头重写模板：只允许官方 edge / corner token。'],
  },
]
```

注意：

- 不要把 `blocklist` fixture 和合法性 fixture 混在一起
- `blocklist` 只保留历史迁移写法
- `test/tailwind-utility-spec.ts` 只登记规范，不写消息文本

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts test/preset-tailwind3.test.ts test/preset-tailwind3-tailwind-diff.test.ts test/preset-tailwind3-blocklist-messages.test.ts`
Expected: PASS

Run: `pnpm test`
Expected: PASS

Run: `pnpm run typecheck`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add test/fixtures/tailwind-border-rewrite.ts test/tailwind-utility-spec.ts test/preset-tailwind3-utility-spec.test.ts test/preset-tailwind3.test.ts test/preset-tailwind3-tailwind-diff.test.ts test/preset-tailwind3-blocklist-messages.test.ts src/_rules/border.ts
git commit -m "refactor: establish border source rewrite template"
```

## Verification Checklist

实现者在结束前必须逐项确认：

- [ ] `border-10px` 与 `border-x-10px` 不再被当前预设匹配
- [ ] `rounded-lt-lg` 与 `rounded-rt-lg` 不再被当前预设匹配
- [ ] `border-[10px]`、`border-x-[10px]` 仍然可用
- [ ] `rounded-es-lg`、`rounded-ss-lg` 仍然可用
- [ ] `b-*` / `rd-*` / `border-op*` / `border-*-color-*` 仍然给出迁移提示
- [ ] `test/tailwind-utility-spec.ts` 成为当前仓库里对等替代 “规则族规范清单” 的入口
- [ ] 没有任何实现继续把 `preset-wind3` 当成 border/rounded 的合法性来源

## Execution Notes

- 这是一份“模板计划”，目标不是一次性把整个仓库的 rule family 都重写完。
- 每完成一个任务就提交，避免把行为修复、规格迁移、fixture 整理混成一个大提交。
- 如果执行中发现 `border-color`、`border-opacity`、`border-style` 还存在新的 Tailwind 差异，先记录到 `test/fixtures/tailwind-border-rewrite.ts` 的 `invalid` / `canonical` 样例，再决定是否拆出下一份计划，不要在这份计划里无限扩 scope。
