# Stroke Source Rewrite Design

## Goal

把 `stroke` 主规则族收敛到 Tailwind CSS 3 正式语法，只保留 `stroke-*` 作为颜色和宽度的合法运行时入口；历史别名和非正式裸色值写法转为反向测试与迁移治理对象。

## Scope

本次设计只覆盖 `stroke` 主规则族，不扩展到其他 SVG 行为规则。

包含：

- `stroke-<line-width-key>`
- `stroke-[...]`
- `stroke-<color>`
- `stroke-none`
- `stroke` 相关 utility spec
- `stroke` 相关 blocklist migration message
- `stroke` 的过程日志与任务进度

不包含：

- `stroke-dash-*`
- `stroke-offset-*`
- `stroke-cap-*`
- `stroke-join-*`
- `fill-*`
- `accent-*`
- `caret-*`

## Current Repo Reality

当前 `stroke` 运行时入口位于 [src/_rules/svg.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/svg.ts)，主要问题有两个：

1. 宽度 matcher 仍接受旧别名：

```ts
/^stroke-(?:width-|size-)?(.+)$/
```

这会继续接纳 `stroke-width-2` 和 `stroke-size-2`。

2. 颜色与宽度共享 `stroke-(.+)` 分发，导致主规则族边界不够清晰。

当前 repo 与 Tailwind 3 的已知差异：

- 当前 repo 和 Tailwind 3 都支持：
  - `stroke-0`
  - `stroke-1`
  - `stroke-2`
  - `stroke-red-500`
  - `stroke-[#fff]`
  - `stroke-none`
- 当前 repo 错误接纳、Tailwind 3 不支持：
  - `stroke-width-2`
  - `stroke-size-2`
- 当前 repo 和 Tailwind 3 都不支持：
  - `stroke-#fff`
  - `stroke-red500`
  - `stroke-opacity-50`
  - `stroke-op50`

## Design Decision

本轮沿用 `tracking` / `leading` / `text` 的源头重写模板：

1. runtime 只保留 `stroke-*` 作为主入口
2. 共享 fixture 明确拆出 `canonical / invalid / semantic`
3. runtime / Tailwind parity / utility spec / blocklist migration 四层同时锁边界
4. 每个任务都更新 `stroke` 自己的 log/status，并同步整体总表

## Runtime Semantics

合法写法：

- `stroke-0`
- `stroke-1`
- `stroke-2`
- `stroke-red-500`
- `stroke-[#fff]`
- `stroke-[3px]`
- `stroke-[length:var(--stroke)]`
- `stroke-none`

非法写法：

- `stroke-width-2`
- `stroke-size-2`
- `stroke-#fff`
- `stroke-red500`
- `stroke-opacity-50`
- `stroke-op50`

语义断言至少锁住：

- `stroke-2 -> stroke-width:2`
- `stroke-[3px] -> stroke-width:3px`
- `stroke-red-500 -> stroke:rgb(239 68 68 / var(--un-stroke-opacity))`
- `stroke-[#fff] -> stroke:rgb(255 255 255 / var(--un-stroke-opacity))`
- `stroke-none -> stroke:none`

## Shared Fixture Shape

`test/fixtures/tailwind-stroke-rewrite.ts` 至少包含：

```ts
export const strokeFixtures = {
  canonical: [
    'stroke-0',
    'stroke-1',
    'stroke-2',
    'stroke-red-500',
    'stroke-[#fff]',
    'stroke-[3px]',
    'stroke-[length:var(--stroke)]',
    'stroke-none',
  ],
  invalid: [
    'stroke-width-2',
    'stroke-size-2',
    'stroke-#fff',
    'stroke-red500',
    'stroke-opacity-50',
    'stroke-op50',
  ],
  semantic: [
    'stroke-2',
    'stroke-red-500',
    'stroke-[#fff]',
    'stroke-[3px]',
    'stroke-none',
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

- `stroke-width-2 -> stroke-2`
- `stroke-size-2 -> stroke-2`
- `stroke-#fff -> stroke-[#fff]`

`stroke-red500`、`stroke-opacity-50`、`stroke-op50` 当前不纳入迁移提示，只作为反向样例保留。

## Documentation And Tracking

需要新增并持续更新：

- `docs/2026-04-22-stroke-source-rewrite-log.md`
- `docs/2026-04-22-stroke-source-rewrite-status.md`

同时更新：

- `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- `docs/2026-04-21-tailwind-grammar-debt-task-status.md`

## Risks

主要风险有两个：

1. `stroke` 运行时当前和 `fill`、dash、offset、cap、join 同处 [src/_rules/svg.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/svg.ts)，实现时不能顺手改动非主规则族。
2. 颜色和宽度共享 `stroke-(.+)` 时，重写需要避免把 `stroke-none`、主题颜色、arbitrary color 和 arbitrary width 之间的分发关系打乱。

## Success Criteria

完成后必须满足：

- `stroke-*` 是唯一合法的 `stroke` 主入口
- `stroke-width-*` 和 `stroke-size-*` 不再被 runtime 接纳
- `stroke-[3px]`、`stroke-[#fff]`、`stroke-none` 持续成立
- `stroke` 已登记到 utility spec
- `stroke-width-2`、`stroke-size-2`、`stroke-#fff` 已有迁移提示
- `stroke` 的 log/status 和整体总表保持同步
