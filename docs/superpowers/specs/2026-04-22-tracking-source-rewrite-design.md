# Tracking Source Rewrite Design

## Goal

把 `tracking` 规则族收敛到 Tailwind CSS 3 正式语法，只保留 `tracking-*` 作为合法运行时入口；历史别名和非正式裸长度写法转为反向测试与迁移治理对象。

## Scope

本次设计只覆盖 `tracking` 主规则族，不扩展到 `text`、`leading`、`word-spacing`、`text-shadow`、`text-stroke`。

包含：

- `tracking-<theme-key>`
- `tracking-[...]`
- `tracking` 相关 utility spec
- `tracking` 相关 blocklist migration message
- `tracking` 的过程日志与任务进度

不包含：

- `text-*` 的重写
- `leading-*`
- `font-tracking-*`
- `letter-spacing-*`
- `word-spacing-*`

## Current Repo Reality

当前 `tracking` 运行时入口位于 [src/_rules/typography.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/typography.ts)：

```ts
/^(?:font-)?tracking-(.+)$/
```

这意味着当前 preset 会把 `font-tracking-*` 这类历史别名一并接纳，而且会把裸长度值当作合法入口。

我已实测当前 repo 与 Tailwind 3 的差异：

- 当前 repo 和 Tailwind 3 都支持：
  - `tracking-wide`
  - `tracking-[0.2em]`
  - `tracking-[calc(1em-1px)]`
- 当前 repo 错误接纳、Tailwind 3 不支持：
  - `font-tracking-wide`
  - `tracking-0.2em`
- 当前 repo 和 Tailwind 3 都不支持：
  - `letter-spacing-wide`

其中 `tracking-0.2em` 当前会生成 `letter-spacing:0.2em;`，但 Tailwind 3 只接受 `tracking-[0.2em]` 这种 arbitrary value 正式写法。

## Design Decision

本轮沿用 `leading` / `text` 的源头重写模板：

1. runtime 只保留 `tracking-*`
2. 共享 fixture 明确拆出 `canonical / invalid / semantic`
3. runtime / Tailwind parity / utility spec / blocklist migration 四层同时锁边界
4. 每个任务都更新 `tracking` 自己的 log/status，并同步整体总表

## Runtime Semantics

合法写法：

- `tracking-tighter`
- `tracking-tight`
- `tracking-normal`
- `tracking-wide`
- `tracking-wider`
- `tracking-widest`
- `tracking-[0.2em]`
- `tracking-[calc(1em-1px)]`

非法写法：

- `font-tracking-wide`
- `tracking-0.2em`
- `letter-spacing-wide`

语义断言至少锁住：

- `tracking-tight -> letter-spacing:-0.025em`
- `tracking-wide -> letter-spacing:0.025em`
- `tracking-[0.2em] -> letter-spacing:0.2em`
- `tracking-[calc(1em-1px)] -> letter-spacing:calc(1em - 1px)`

## Shared Fixture Shape

`test/fixtures/tailwind-tracking-rewrite.ts` 至少包含：

```ts
export const trackingFixtures = {
  canonical: [
    'tracking-tighter',
    'tracking-tight',
    'tracking-normal',
    'tracking-wide',
    'tracking-wider',
    'tracking-widest',
    'tracking-[0.2em]',
    'tracking-[calc(1em-1px)]',
  ],
  invalid: [
    'font-tracking-wide',
    'tracking-0.2em',
    'letter-spacing-wide',
  ],
  semantic: [
    'tracking-tight',
    'tracking-wide',
    'tracking-[0.2em]',
    'tracking-[calc(1em-1px)]',
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

- `font-tracking-wide -> tracking-wide`
- `tracking-0.2em -> tracking-[0.2em]`

`letter-spacing-wide` 当前不纳入迁移提示，因为它不是当前 repo 的特定历史别名映射，只作为反向样例保留。

## Documentation And Tracking

需要新增并持续更新：

- `docs/2026-04-22-tracking-source-rewrite-log.md`
- `docs/2026-04-22-tracking-source-rewrite-status.md`

同时更新：

- `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- `docs/2026-04-21-tailwind-grammar-debt-task-status.md`

## Risks

主要风险有两个：

1. `tracking` 规则当前和 `leading`、`word-spacing` 同处 [src/_rules/typography.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/typography.ts)，实现时不能顺手改动其他规则族。
2. `text` 语义里仍可能通过 font-size theme 的第三项产生 `letter-spacing`，本轮不能因为收紧 `tracking` 主入口而误伤 `text` 规则族。

## Success Criteria

完成后必须满足：

- `tracking-*` 是唯一合法的 letter-spacing 主入口
- `font-tracking-*` 和裸长度 `tracking-0.2em` 不再被 runtime 接纳
- `tracking-[0.2em]`、`tracking-[calc(1em-1px)]` 持续成立
- `tracking` 已登记到 utility spec
- `font-tracking-wide`、`tracking-0.2em` 已有迁移提示
- `tracking` 的 log/status 和整体总表保持同步
