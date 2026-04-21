# Outline Source Rewrite Design

状态日期：2026-04-22
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `outline` 规则族从当前“单 handler 宽分发”的实现，收敛成以 Tailwind CSS 3 为唯一正确性标准的源头重写模板，并且把本轮实施过程中的日志与任务进度记录纳入版本控制。

本轮完成后，`outline` 需要满足：

- Tailwind 3 支持的 `outline` 写法，当前预设必须支持
- Tailwind 3 不支持的 `outline` 写法，当前预设必须拒绝
- `blocklist` 里的 `outline-color-*` / `outline-width-*` / `outline-style-*` 仍保留迁移提示职责
- 过程日志与任务进度在实施中持续更新，并以小步提交方式进入 git 历史

## 范围

本次设计只覆盖 `outline` 规则族，不扩展到 `transition`、`behavior` 其他子项或新的 blocklist 审计任务。

包含：

- `outline`
- `outline-none`
- `outline-<width>`
- `outline-<color>`
- `outline-<style>`
- `outline-offset-<value>`
- `outline` 相关的 blocklist migration message 测试
- 过程日志与任务进度文件

不包含：

- `transition` 重写
- `outline` 以外的 `appearance` / `will-change`
- 全仓统一日志框架
- 对 `utility spec` 做超出本轮所需的架构升级

## 当前现状

当前实现位于 [src/_rules/behaviors.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/behaviors.ts)：

- `outline-(.+)` 由 `handleOutlineValue` 同时处理 style / width / color
- `outline-offset-(.+)` 直接用 `theme.lineWidth` 或 `px` 兜底
- 当前测试已经覆盖一组正向与反向样例，但还没有形成共享 fixture、规格层和过程日志模板

从现有测试可见，当前仓库已经明确拒绝这些旧写法：

- `outline-color-red-500`
- `outline-width-2`
- `outline-style-dashed`
- `outline-op50`
- `outline-opacity-50`

这些行为必须在重写后继续保持。

## 设计方案

### 方案选择

采用“`outline` 源头重写模板”方案，而不是继续在现有 handler 上做局部修补。

原因：

- 已有 `border` / `rounded` 的重写模板，可复用测试结构和推进方式
- `outline` 同样存在“一个 matcher 宽分发多个语义”的结构问题，继续打补丁会保留旧债
- 用户要求实施过程必须保留日志、进度和 git 提交，这更适合按模板推进而不是一次性修补

### 规则结构

运行时仍放在 [src/_rules/behaviors.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/behaviors.ts)，但实现会从“单一宽分发”收敛为显式分支：

- `outline` / `outline-none`：静态 rule
- `outline-offset-*`：独立处理 offset 值
- `outline-*`：在 handler 内按 Tailwind 3 合法集合严格判定
  - style：`dashed` / `dotted` / `double`
  - width：合法刻度、theme key、bracket arbitrary
  - color：按 `borderColor` 语义解析

保留一份最小实现，不做额外抽象拆文件，除非测试驱动出明显重复。

## 测试设计

本轮沿用 border 模板的四层结构：

1. runtime：
   - [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
2. Tailwind parity：
   - [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)
3. 规格层：
   - [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
   - [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)
4. blocklist migration：
   - [test/fixtures/blocklist-migration.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/blocklist-migration.ts)
   - [test/preset-tailwind3-blocklist-messages.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-messages.test.ts)

此外新增一份 outline 专用共享 fixture，放在：

- [test/fixtures/tailwind-outline-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-outline-rewrite.ts)

这份 fixture 至少包含：

- canonical
- invalid
- 可选的 semantic cases（如需直接断言 CSS 语义）

## 日志与任务进度

本轮实施必须额外维护两份文档，并纳入 git：

- 过程日志：
  - [docs/2026-04-22-outline-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-outline-source-rewrite-log.md)
- 任务进度：
  - [docs/2026-04-22-outline-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-outline-source-rewrite-status.md)

约束：

- 每完成一个可验证子步骤，就更新这两份文件
- 每个子步骤完成后单独提交一次 git
- 日志记录“做了什么、发现了什么、验证结果是什么”
- 进度文件记录当前阶段、完成项、待办项、阻塞项

## 提交节奏

建议至少拆成 4 次提交：

1. 初始化日志/进度文件，并加入 outline 的 failing tests
2. 收紧 `outline-width` / `outline-offset`
3. 收紧 `outline-style` / `outline-color`，同步规格层与 fixture
4. 收口 blocklist migration 和最终验证

如果实施中发现真实回归，可追加修复提交，不做 amend。

## 验证标准

在宣布完成前，至少要 fresh run：

- `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "outline / transition"`
- `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "outline and transition"`
- `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
- `pnpm test`
- `pnpm run typecheck`

## 风险与边界

- `outline` 当前与 `transition` 共处同一测试段，实施时需要避免顺手扩大到 transition 重写
- `outline-none` 是特殊语义，必须保持 Tailwind 3 行为，不应被宽度或颜色逻辑误吸收
- 如果后续发现 `outline` 还有更多语义级差异，优先先补入 outline 共享 fixture，再决定是否追加任务，而不是直接扩 scope 到别的规则族
