# ESLint Blocklist Autofix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 给当前仓库的 ESLint blocklist 诊断补上自动修复能力，让高置信度 migration token 在编辑器和命令行里都能直接被修正为 Tailwind 3 写法。

**Architecture:** 不改 `@unocss/eslint-plugin` 上游实现，而是在仓库内抽出可复用的 blocklist migration replacement helper，再由 `fixtures/ide-eslint` 的本地 ESLint rule 使用这个 helper 和 Uno generator 复现当前 blocklist 诊断。自动修复只覆盖已经有唯一 replacement 的 migration 子集；`rawBlocklist` 继续只报错、不自动修复。

**Tech Stack:** TypeScript, UnoCSS core generator, ESLint 9 flat config, Node.js ESM, Vitest

---

## Scope

包含：

- 复用 `src/blocklist.ts` 当前 migration replacement 逻辑
- 为单个 token 和整段 class string 提供可复用 autofix helper
- 为 `fixtures/ide-eslint` 增加本地 ESLint rule
- 为 JSX `className`、模板 `class` 字面量增加 token 级 fix
- 为 IDE fixture 增加自动化验证脚本
- 把 fixture 验证接进仓库现有 `test:fixtures`

不包含：

- 修改 `@unocss/eslint-plugin` 或 `@unocss/core` 上游包
- 为 `rawBlocklist` 生成猜测型 replacement
- 为表达式拼接、模板字符串插值、普通字符串变量做 fix
- 为 valueless attributify attribute 增加 fix

## File Structure

### Existing files to modify

- `src/blocklist.ts`
- `src/index.ts`
- `package.json`
- `fixtures/ide-eslint/eslint.config.mjs`
- `fixtures/ide-eslint/package.json`
- `fixtures/ide-eslint/README.md`

### New files to create

- `src/blocklist-migration.ts`
- `test/blocklist-autofix-helper.test.ts`
- `fixtures/ide-eslint/eslint-plugin-blocklist-autofix.mjs`
- `fixtures/ide-eslint/scripts/verify-blocklist-autofix.mjs`

## Design Notes

- `src/blocklist.ts` 现在同时承担三件事：保存 migration descriptor、生成 blocklist rule、生成本地化 message。为了让 ESLint autofix 和 blocklist 规则共用同一份 replacement 逻辑，本轮先把 descriptor 和 replacement helper 拆到 `src/blocklist-migration.ts`。
- 新 helper 只暴露“这个 token 是否有唯一 replacement”这件事，不接触 `rawBlocklist`。这样能保持 `blocklist` 仍然只对高置信度 migration 做迁移提示，避免 autofix 过度推断。
- fixture 本地 ESLint rule 不再依赖 `unocss/blocklist` 的 fixer 能力，而是自己拿到被 block 的 token、原始 message 和 replacement，并按 token 的精确字符范围给出 fix。

## Tasks

### Task 1: 抽出共享 migration helper

**Files:**
- Create: `src/blocklist-migration.ts`
- Modify: `src/blocklist.ts`
- Modify: `src/index.ts`
- Test: `test/blocklist-autofix-helper.test.ts`

- [ ] **Step 1: 写 helper 失败用例**

在 `test/blocklist-autofix-helper.test.ts` 新增三组断言：

```ts
import { describe, expect, it } from 'vitest'
import {
  blocklistMigrationFixtures,
  overflowBlocklistMigrationFixtures,
} from './fixtures/blocklist-migration'
import {
  getBlocklistMigrationReplacement,
  rewriteBlocklistMigrationClassString,
} from '../src/index'

describe('blocklist autofix helpers', () => {
  it('returns canonical replacements for every migration fixture', () => {
    for (const fixture of blocklistMigrationFixtures)
      expect(getBlocklistMigrationReplacement(fixture.input)).toBe(fixture.replacement)
  })

  it('supports prefixed migration replacements', () => {
    for (const fixture of overflowBlocklistMigrationFixtures)
      expect(getBlocklistMigrationReplacement(`tw-${fixture.input}`, 'tw-')).toBe(`tw-${fixture.replacement}`)
  })

  it('rewrites only migratable tokens inside a class string', () => {
    expect(
      rewriteBlocklistMigrationClassString('c-#fff text-[#000] bg-op50 shape-circle'),
    ).toEqual({
      output: 'text-[#fff] text-[#000] bg-opacity-50 shape-circle',
      fixes: [
        { from: 'c-#fff', to: 'text-[#fff]' },
        { from: 'bg-op50', to: 'bg-opacity-50' },
      ],
    })
  })
})
```

- [ ] **Step 2: 运行测试确认 helper 尚不存在**

Run: `pnpm exec vitest --run test/blocklist-autofix-helper.test.ts`

Expected: FAIL，报 `getBlocklistMigrationReplacement` / `rewriteBlocklistMigrationClassString` 未导出，或 `src/blocklist-migration.ts` 不存在。

- [ ] **Step 3: 把 descriptor 和 replacement 逻辑抽到新文件**

在 `src/blocklist-migration.ts` 放置当前 migration descriptor 和纯函数 helper：

```ts
export interface BlocklistMigrationFix {
  from: string
  to: string
}

export interface RewriteBlocklistMigrationResult {
  output: string
  fixes: BlocklistMigrationFix[]
}

export function getBlocklistMigrationReplacement(
  selector: string,
  prefix?: string | string[],
): string | undefined

export function rewriteBlocklistMigrationClassString(
  input: string,
  prefix?: string | string[],
): RewriteBlocklistMigrationResult
```

实现要求：

- `migrationDescriptors` 原样迁移到这个文件
- `getBlocklistMigrationReplacement()` 对 unprefixed 和 prefixed token 都返回最终 replacement
- `rewriteBlocklistMigrationClassString()` 用 `/\S+/g` 逐 token 扫描并保留原始空白布局
- 没有 replacement 的 token 原样保留，不写入 `fixes`

- [ ] **Step 4: 让 `src/blocklist.ts` 改为复用新 descriptor**

把 `src/blocklist.ts` 的 migration 规则生成改成从 `src/blocklist-migration.ts` 导入：

```ts
import {
  blocklistMigrationDescriptors,
  getBlocklistMigrationReplacement,
} from './blocklist-migration'
```

保留现有 `legacyMessage()`、`createBlocklist()`、`rawBlocklist`、`locale` 逻辑不变，不要顺手改 message 文案。

- [ ] **Step 5: 从包入口导出 helper**

在 `src/index.ts` 增加命名导出：

```ts
export {
  getBlocklistMigrationReplacement,
  rewriteBlocklistMigrationClassString,
} from './blocklist-migration'
```

不要新增 subpath export，本轮只走包根命名导出。

- [ ] **Step 6: 重新运行 helper 与 blocklist 现有测试**

Run: `pnpm exec vitest --run test/blocklist-autofix-helper.test.ts test/preset-tailwind3-blocklist-messages.test.ts test/preset-tailwind3-blocklist-prefix-audit.test.ts`

Expected: PASS，且 blocklist message / prefix audit 行为没有回归。

- [ ] **Step 7: 提交 helper 抽取**

```bash
git add src/blocklist-migration.ts src/blocklist.ts src/index.ts test/blocklist-autofix-helper.test.ts
git commit -m "feat: extract blocklist migration autofix helpers"
```

### Task 2: 在 IDE fixture 里落地 autofix 规则

**Files:**
- Create: `fixtures/ide-eslint/eslint-plugin-blocklist-autofix.mjs`
- Create: `fixtures/ide-eslint/scripts/verify-blocklist-autofix.mjs`
- Modify: `fixtures/ide-eslint/eslint.config.mjs`
- Modify: `fixtures/ide-eslint/package.json`
- Modify: `package.json`

- [ ] **Step 1: 先写 fixture 级 autofix 验证脚本**

在 `fixtures/ide-eslint/scripts/verify-blocklist-autofix.mjs` 新增基于 `ESLint` Node API 的检查：

```js
import { ESLint } from 'eslint'

const source = 'export function Demo() { return <div className="c-#fff bg-op50 b-2 rd-md fw-bold pos-absolute text-[#000]" /> }'

const eslint = new ESLint({
  cwd: new URL('..', import.meta.url),
  fix: true,
})

const [result] = await eslint.lintText(source, {
  filePath: 'src/demo.jsx',
})

if (!result.output?.includes('text-[#fff]'))
  throw new Error('expected autofix to rewrite c-#fff')
```

完整断言要求：

- `c-#fff -> text-[#fff]`
- `bg-op50 -> bg-opacity-50`
- `b-2 -> border-2`
- `rd-md -> rounded-md`
- `fw-bold -> font-bold`
- `pos-absolute -> absolute`
- `text-[#000]` 保持不变
- lint 结果里不再保留这些 migration warning

- [ ] **Step 2: 运行脚本确认现在还没有 autofix**

先给 fixture package 增加脚本：

```json
{
  "scripts": {
    "verify:autofix": "node scripts/verify-blocklist-autofix.mjs"
  }
}
```

然后运行：

Run: `pnpm --dir fixtures/ide-eslint run verify:autofix`

Expected: FAIL，原因可以是本地 rule 还不存在、config 没注册、或者输出未被修正。

- [ ] **Step 3: 新建本地 ESLint plugin rule**

在 `fixtures/ide-eslint/eslint-plugin-blocklist-autofix.mjs` 实现 `blocklist-autofix` rule：

```js
import { createGenerator } from '@unocss/core'
import presetTailwind3, {
  getBlocklistMigrationReplacement,
} from '@twodogwang/unocss-preset-tailwind3'

let unoPromise

function getUno() {
  unoPromise ||= createGenerator({
    presets: [presetTailwind3()],
  })
  return unoPromise
}
```

rule 行为要求：

- 只检查字面量 `className="..."`、`class="..."`
- 用 `/\S+/g` 拆 token，并记录每个 token 在 literal 中的字符范围
- 对每个 token 调 `uno.getBlocked(token)` 获取现有 blocklist 诊断
- 对有 replacement 的 token，使用：

```js
fix(fixer) {
  return fixer.replaceTextRange([start, end], replacement)
}
```

- `message` 直接复用 `meta.message` 生成后的文案，避免和当前提示分叉
- 对没有 replacement 的 blocked token，仍然 report，但不提供 `fix`

- [ ] **Step 4: 用本地 rule 替换 fixture 里的 `unocss/blocklist`**

把 `fixtures/ide-eslint/eslint.config.mjs` 改成显式注册本地 plugin，并关闭重复的 upstream blocklist rule：

```js
import blocklistAutofixPlugin from './eslint-plugin-blocklist-autofix.mjs'

export default [
  {
    plugins: {
      tailwind3: blocklistAutofixPlugin,
    },
    rules: {
      'unocss/blocklist': 'off',
      'tailwind3/blocklist-autofix': 'warn',
    },
  },
]
```

保留当前 `@unocss/eslint-config/flat`、JSX parserOptions 和其它 Uno rule，不要顺手改 `order` 之类配置。

- [ ] **Step 5: 把 fixture 验证接进根脚本**

修改：

- `fixtures/ide-eslint/package.json`
- `package.json`

目标结果：

```json
{
  "scripts": {
    "lint": "eslint src/demo.jsx",
    "verify:autofix": "node scripts/verify-blocklist-autofix.mjs"
  }
}
```

```json
{
  "scripts": {
    "test:fixtures": "pnpm --filter ide-eslint-fixture lint && pnpm --filter ide-eslint-fixture verify:autofix"
  }
}
```

- [ ] **Step 6: 先构建包，再跑 fixture 验证**

Run: `pnpm build`

Expected: PASS，`dist/index.mjs` 和 `dist/index.d.mts` 包含新导出的 helper。

- [ ] **Step 7: 运行 fixture lint 与 autofix 验证**

Run: `pnpm --dir fixtures/ide-eslint run lint`

Expected: PASS 或按当前规则输出 warning，但 warning 只来自未修复运行，不出现配置加载错误。

Run: `pnpm --dir fixtures/ide-eslint run verify:autofix`

Expected: PASS，脚本确认 `className` 输出已改成 canonical Tailwind 3 写法。

- [ ] **Step 8: 提交 fixture autofix 实现**

```bash
git add package.json fixtures/ide-eslint/eslint.config.mjs fixtures/ide-eslint/package.json fixtures/ide-eslint/eslint-plugin-blocklist-autofix.mjs fixtures/ide-eslint/scripts/verify-blocklist-autofix.mjs
git commit -m "feat: add eslint blocklist autofix fixture"
```

### Task 3: 补充 fixture 文档并收口验证口径

**Files:**
- Modify: `fixtures/ide-eslint/README.md`
- Modify: `package.json`

- [ ] **Step 1: 先写 README 失败断言**

在 `fixtures/ide-eslint/README.md` 需要补三类信息：

- 当前 fixture 不再直接依赖 `unocss/blocklist` 提供 fix
- `verify:autofix` 的运行方式
- `--fix` 后 demo 中代表性 token 的 expected output

先把这些要点列出来，再检查 README 现状，确认它目前只描述 message 展示，没有 autofix 使用说明。

- [ ] **Step 2: 更新 README**

加入一段最小但明确的说明：

````md
## Autofix

运行：

```bash
pnpm --dir fixtures/ide-eslint run verify:autofix
```

期望修正：

- `c-#fff` -> `text-[#fff]`
- `bg-op50` -> `bg-opacity-50`
- `b-2` -> `border-2`
````

同时保留现有 “为什么 IDE 能显示 blocklist message” 的说明，不要把 README 扩成仓库维护文档。

- [ ] **Step 3: 做最终定向验证**

Run: `pnpm exec vitest --run test/blocklist-autofix-helper.test.ts test/preset-tailwind3-blocklist-messages.test.ts test/preset-tailwind3-blocklist-prefix-audit.test.ts`

Expected: PASS

Run: `pnpm build`

Expected: PASS

Run: `pnpm run test:fixtures`

Expected: PASS

- [ ] **Step 4: 提交文档与最终脚本收口**

```bash
git add fixtures/ide-eslint/README.md package.json
git commit -m "docs: document eslint blocklist autofix flow"
```

## Verification

- `pnpm exec vitest --run test/blocklist-autofix-helper.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-blocklist-prefix-audit.test.ts`
- `pnpm build`
- `pnpm --dir fixtures/ide-eslint run lint`
- `pnpm --dir fixtures/ide-eslint run verify:autofix`
- `pnpm run test:fixtures`

## Risks

- fixture 本地 rule 依赖包根导出的 helper，所以 `fixtures/ide-eslint` 的验证顺序必须在 `pnpm build` 之后，否则会读到旧的 `dist`
- token 级 fix 只对普通字面量字符串安全；如果后续要覆盖模板字符串或表达式拼接，需要单独设计 AST 级 rewrite 策略
- 不能把 `rawBlocklist` 强行纳入 autofix，否则会把“没有唯一迁移目标”的阻断规则误导成建议修复
