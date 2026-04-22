# Leading Source Rewrite Design

## Goal

把 `leading` 规则族收敛到 Tailwind CSS 3 正式语法，只保留 `leading-*` 作为合法运行时入口；历史别名和非正式裸长度写法转为反向测试与迁移治理对象。

## Scope

本次设计只覆盖 `leading` 主规则族，不扩展到 `text`、`tracking`、`word-spacing`、`text-shadow`、`text-stroke`。

包含：

- `leading-<theme-key>`
- `leading-<numeric-scale>`
- `leading-[...]`
- `leading` 相关 utility spec
- `leading` 相关 blocklist migration message
- `leading` 的过程日志与任务进度

不包含：

- `text-<size>/<line-height>` shorthand 的重写
- `tracking-*`
- `lh-*`
- `line-height-*`
- `font-leading-*`

## Current Repo Reality

当前 `leading` 运行时入口位于 [src/_rules/typography.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/typography.ts)：

```ts
/^(?:font-)?(?:leading|lh|line-height)-(.+)$/
```

这意味着当前 preset 会把多个历史别名和非正式写法一起放行。

我已实测当前 repo 与 Tailwind 3 的差异：

- 当前 repo 和 Tailwind 3 都支持：
  - `leading-6`
  - `leading-[20px]`
  - `leading-[calc(100%-1px)]`
- 当前 repo 错误接纳、Tailwind 3 不支持：
  - `lh-6`
  - `line-height-6`
  - `font-leading-6`
  - `leading-20px`

其中 `leading-20px` 当前会生成 `line-height:20px;`，但 Tailwind 3 只接受 `leading-[20px]` 这种 arbitrary value 正式写法。

## Design Decision

本轮采用和 `outline`、`text` 相同的“源头重写模板”：

1. runtime 只保留 `leading-*`
2. 共享 fixture 明确拆出 `canonical / invalid / semantic`
3. runtime / Tailwind parity / utility spec / blocklist migration 四层同时锁边界
4. 每个任务都更新 `leading` 自己的 log/status，并同步整体总表

## Runtime Semantics

合法写法：

- `leading-none`
- `leading-tight`
- `leading-6`
- `leading-[20px]`
- `leading-[calc(100%-1px)]`

非法写法：

- `lh-6`
- `line-height-6`
- `font-leading-6`
- `leading-20px`

语义断言至少锁住：

- `leading-none -> line-height:1`
- `leading-6 -> line-height:1.5rem`
- `leading-[20px] -> line-height:20px`
- `leading-[calc(100%-1px)] -> line-height:calc(100% - 1px)`

## Shared Fixture Shape

`test/fixtures/tailwind-leading-rewrite.ts` 至少包含：

```ts
export const leadingFixtures = {
  canonical: [
    'leading-none',
    'leading-tight',
    'leading-6',
    'leading-[20px]',
    'leading-[calc(100%-1px)]',
  ],
  invalid: [
    'lh-6',
    'line-height-6',
    'font-leading-6',
    'leading-20px',
  ],
  semantic: [
    'leading-none',
    'leading-6',
    'leading-[20px]',
    'leading-[calc(100%-1px)]',
  ],
} as const
```

## Testing Strategy

必须同时覆盖四层：

1. runtime
   - `test/preset-tailwind3.test.ts`
2. Tailwind parity
   - `test/preset-tailwind3-tailwind-diff.test.ts`
3. utility spec
   - `test/tailwind-utility-spec.ts`
   - `test/preset-tailwind3-utility-spec.test.ts`
4. blocklist migration
   - `src/blocklist.ts`
   - `test/fixtures/blocklist-migration.ts`
   - `test/preset-tailwind3-blocklist-messages.test.ts`
   - `test/preset-tailwind3-blocklist-prefix-audit.test.ts`

## Blocklist Migration Scope

高置信度迁移提示应覆盖：

- `lh-6 -> leading-6`
- `line-height-6 -> leading-6`
- `font-leading-6 -> leading-6`
- `leading-20px -> leading-[20px]`

本轮只处理这些明确一一映射的迁移，不扩展到模糊语义建议。

## Documentation And Tracking

需要新增并持续更新：

- `docs/2026-04-22-leading-source-rewrite-log.md`
- `docs/2026-04-22-leading-source-rewrite-status.md`

同时更新：

- `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- `docs/2026-04-21-tailwind-grammar-debt-task-status.md`

## Risks

主要风险有两个：

1. `leading` 规则当前和 `tracking`、`word-spacing` 同处 [src/_rules/typography.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/typography.ts)，实现时不能顺手改动其他规则族。
2. `text-<size>/<line-height>` shorthand 内部仍会用到 `lineHeight` theme；本轮不能因为收紧 `leading` 主入口而误伤 `text-lg/7`、`text-[14px]/[20px]`。

## Success Criteria

完成后必须满足：

- `leading-*` 是唯一合法的 `line-height` 主入口
- `lh-*`、`line-height-*`、`font-leading-*` 不再被 runtime 接纳
- `leading-20px` 不再被 runtime 接纳，迁移提示改为 `leading-[20px]`
- `leading` 已登记到 utility spec
- `leading` 的 log/status 和整体总表保持同步
