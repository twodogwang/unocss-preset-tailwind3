# Tailwind 3 Source Rewrite Index

当前分支：`codex/tailwind3-source-rewrite`

这份文档是当前源头重写任务的唯一实时入口。

## 任务摘要

- 目标：把各个 utility 收敛到 Tailwind CSS 3 正式语法
- 已完成：`border`、`outline`、`text`、`leading`、`tracking`、`stroke`
- 进行中：`spacing`
- 待处理：`behavior`

## Utility Manifest

如果某个 utility 当前确实没有对应文档，则该列明确写 `-`，不伪造链接。

| utility | status | spec | plan | log | statusDoc |
| --- | --- | --- | --- | --- | --- |
| border | completed | - | docs/superpowers/plans/2026-04-21-tailwind3-border-source-rewrite.md | - | - |
| outline | completed | docs/superpowers/specs/2026-04-22-outline-source-rewrite-design.md | docs/superpowers/plans/2026-04-22-outline-source-rewrite.md | docs/2026-04-22-outline-source-rewrite-log.md | docs/2026-04-22-outline-source-rewrite-status.md |
| text | completed | docs/superpowers/specs/2026-04-22-text-source-rewrite-design.md | docs/superpowers/plans/2026-04-22-text-source-rewrite.md | docs/2026-04-22-text-source-rewrite-log.md | docs/2026-04-22-text-source-rewrite-status.md |
| leading | completed | docs/superpowers/specs/2026-04-22-leading-source-rewrite-design.md | docs/superpowers/plans/2026-04-22-leading-source-rewrite.md | docs/2026-04-22-leading-source-rewrite-log.md | docs/2026-04-22-leading-source-rewrite-status.md |
| tracking | completed | docs/superpowers/specs/2026-04-22-tracking-source-rewrite-design.md | docs/superpowers/plans/2026-04-22-tracking-source-rewrite.md | docs/2026-04-22-tracking-source-rewrite-log.md | docs/2026-04-22-tracking-source-rewrite-status.md |
| stroke | completed | docs/superpowers/specs/2026-04-22-stroke-source-rewrite-design.md | docs/superpowers/plans/2026-04-22-stroke-source-rewrite.md | docs/2026-04-22-stroke-source-rewrite-log.md | docs/2026-04-22-stroke-source-rewrite-status.md |
| spacing | in_progress | docs/superpowers/specs/2026-04-22-spacing-padding-margin-source-rewrite-design.md | docs/superpowers/plans/2026-04-22-spacing-padding-margin-source-rewrite.md | docs/2026-04-22-spacing-padding-margin-source-rewrite-log.md | docs/2026-04-22-spacing-padding-margin-source-rewrite-status.md |
| behavior | pending | - | - | - | - |

## 相关文档

- 原始总需求文档：[internal-docs/tailwind3-source-rewrite/2026-04-21-tailwind3-source-rewrite-plan.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/internal-docs/tailwind3-source-rewrite/2026-04-21-tailwind3-source-rewrite-plan.md)
- 整体状态文档：[docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
- 背景基线文档：[docs/2026-04-21-tailwind-grammar-debt-baseline.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-baseline.md)
