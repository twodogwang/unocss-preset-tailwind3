# Tailwind 3 Source Rewrite Document Governance Design

状态日期：2026-04-22  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把当前分散、部分未跟踪、部分已过期的“Tailwind 3 源头重写”任务文档收拢成一套可持续维护的文档治理结构，并确保后续每推进一个 utility 时：

- 整体任务文档进入 git
- 整体任务状态有单一入口
- utility 级文档与整体任务状态同步更新

本次设计只覆盖文档治理，不涉及新的 utility 运行时语义改动。

## 当前问题

### 1. `docs/` 被整体忽略

当前 `.gitignore` 中直接忽略了整个 `docs/` 目录，导致：

- 多数整体任务文档默认不会进入 git
- 只有显式 `git add -f` 的少数文件被跟踪
- 后续容易继续出现“写了文档，但没有进入版本历史”的情况

### 2. `internal-docs/` 还未跟踪

当前总需求文档：

- `internal-docs/tailwind3-source-rewrite/2026-04-21-tailwind3-source-rewrite-plan.md`

仍然处于未跟踪状态，因此整体任务定义没有进入仓库历史。

### 3. 缺少单一的整体任务入口

目前存在多份“看起来像总表”的文档，但没有一份被明确规定为唯一的实时状态入口：

- `internal-docs/tailwind3-source-rewrite/2026-04-21-tailwind3-source-rewrite-plan.md`
- `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
- `docs/2026-04-21-tailwind-grammar-debt-baseline.md`

结果是：

- utility 级文档在更新
- 整体任务级文档没有同步
- 阅读者无法快速判断全局完成度

### 4. 现有整体文档存在失真

当前整体文档中仍引用一些仓库内不存在的文件或过时状态，例如历史上提到的规则清单文件。这些文档如果继续保留，就必须被修正成与当前仓库 reality 一致。

## 设计原则

### 1. 单一入口优先

后续整体任务的实时状态只认一份总表文档。其他文档可以保留，但其职责必须明确：

- 需求文档：描述原始目标与原则
- 基线文档：描述历史背景与治理框架
- 状态文档：描述整体推进状态
- 总表文档：作为当前唯一实时入口

### 2. utility 级与整体级同时更新

后续每完成一个 utility，至少需要同步更新两类文档：

- 该 utility 自己的 `log` / `status`
- 整体任务总表

不能再只更新 utility 级文档而不更新整体级文档。

### 3. 文档必须正常进入 git

文档不应继续依赖“临时 `git add -f` 才能进仓库”的流程作为常态。至少本任务涉及的整体文档必须成为正常可跟踪文件。

### 4. 不做大规模目录重构

本次不重构整个 `docs/` / `internal-docs/` 目录树，只在现有结构上做最小可维护调整：

- 补全 git 跟踪
- 建立总入口
- 修正文档职责

## 目标结构

### 1. 总入口文档

新增：

- `docs/2026-04-22-tailwind3-source-rewrite-index.md`

它作为当前唯一实时入口，至少包含：

- 任务目标摘要
- 当前分支
- 治理原则摘要
- utility 清单
- 每个 utility 的状态
- 每个 utility 对应的 spec / plan / log / status 链接
- 下一步推荐顺序

### 2. 历史与背景文档

保留并修正：

- `internal-docs/tailwind3-source-rewrite/2026-04-21-tailwind3-source-rewrite-plan.md`
- `docs/2026-04-21-tailwind-grammar-debt-baseline.md`
- `docs/2026-04-21-tailwind-grammar-debt-task-status.md`

职责调整为：

- `internal-docs/...plan.md`：保留为原始总需求文档，并补充“当前实时状态请看总入口”的说明
- `...baseline.md`：说明治理背景和框架，不承载实时进度
- `...task-status.md`：说明整体治理阶段状态，并与总入口一致

### 3. utility 级文档

已存在并保留：

- `docs/superpowers/specs/2026-04-22-outline-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-22-outline-source-rewrite.md`
- `docs/2026-04-22-outline-source-rewrite-log.md`
- `docs/2026-04-22-outline-source-rewrite-status.md`

后续新增 utility 时沿用相同模式。

## 初始状态回填

总入口文档初始至少回填当前已知状态：

- `border`: completed
- `outline`: completed
- `text`: pending
- `leading`: pending
- `tracking`: pending
- `stroke`: pending
- `spacing`: pending
- `behavior`: pending

如果全局状态文档中还记录了更早阶段的字体债务治理成果，可在“已完成背景工作”章节单独说明，但不把它们混成当前源头重写的 utility 完成态。

## Git 跟踪策略

### 1. `.gitignore`

需要调整 `.gitignore`，不再简单忽略整个 `docs/`。目标是让当前任务相关文档能够正常被 git 跟踪。

### 2. `internal-docs`

当前 `internal-docs/tailwind3-source-rewrite/2026-04-21-tailwind3-source-rewrite-plan.md` 需要纳入 git，以确保总需求文档本身进入版本历史。

## 验收标准

本次文档治理完成后，应满足：

- 整体任务总入口已存在并进入 git
- 现有整体任务文档已进入 git
- 现有整体任务文档不再引用当前仓库中不存在的关键文件作为现状
- `outline` 已完成状态能在整体总表中看到
- `border` 已完成状态能在整体总表中看到
- 后续 utility 的默认推进顺序在总表中清晰可见
- `git status` 不再因为 `docs/` 被整体忽略而掩盖整体任务文档的修改

## 非目标

本次不做：

- 下一个 utility 的运行时实现
- 旧文档的全面迁移和重命名
- 所有历史文档的统一格式化
- 全仓所有任务文档的一次性重写
