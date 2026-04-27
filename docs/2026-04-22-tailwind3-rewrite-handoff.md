# Tailwind 3 Rewrite Handoff

状态日期：2026-04-22  
仓库：`/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3`  
当前分支：`codex/tailwind3-source-rewrite`  
当前分支头：`70d4b0a docs: add full tailwind rewrite inventory`

## 当前目标

这个仓库的长期目标不是只完成第一阶段 utility 主线，而是：

- 把整个 preset 里所有 Tailwind-facing 规则族
- 从原先继承自 UnoCSS `preset-wind3` 的宽匹配实现
- 逐步重写为以 Tailwind CSS 3 正式语法为唯一标准的源头定义

当前已经完成的是第一阶段主线，不是全规则族完成。

## 阶段结论

### 第一阶段主线

已经完成并进入 rewrite 模板的规则族：

- `border-width`
- `border-radius`
- `text`
- `leading`
- `tracking`
- `stroke`
- `outline`
- `transition`
- `spacing-padding-margin`
- `spacing-gap-inset-scroll`
- `spacing-border-spacing-space`

这些规则族都已经具备：

- shared fixture
- runtime 正反向测试
- Tailwind parity 测试
- utility spec
- blocklist migration 子集
- spec / plan / log / status 文档

### 全规则族视角

第一阶段完成不等于整个仓库所有 Tailwind-facing 规则族都已完成重写。

当前已经补了一份全量规则族总表，并据此定义了第二阶段波次计划。

## 当前总入口

优先查看以下文档：

- 第一阶段主线实时入口：
  [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- 全量规则族总表：
  [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- 第二阶段计划：
  [docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md)
- 整体状态文档：
  [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
- 原始需求文档：
  [internal-docs/tailwind3-source-rewrite/2026-04-21-tailwind3-source-rewrite-plan.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/internal-docs/tailwind3-source-rewrite/2026-04-21-tailwind3-source-rewrite-plan.md)

## 全量规则族总表的生成依据

这份总表不是自动生成的，而是按下面规则手工整理出来的：

1. 以 `src/rules.ts` 和 `src/_rules/*.ts` / `src/_rules-wind3/*.ts` 的真实入口为基础。
2. 按 Tailwind-facing family 拆分，而不是按源码文件拆分。
3. `completed_template` 的判断标准不是“已有测试”或“当前能用”，而是该 family 是否已经进入完整 rewrite 模板。
4. 非标准 Tailwind 3 family 或仓库自定义扩展，先放入 `special_review`。
5. 波次排序依据是复用关系、共享写集和已知语法债务密度。

## 第二阶段剩余任务

当前第二阶段按波次拆分如下。

### wave_1

- `background-color / bg-opacity`
- `background-style / gradient / clip / origin / repeat / position`
- `ring`
- `decoration / underline-offset`
- `shadow`
- `divide`

### wave_2

- `fill`
- `accent`
- `caret`
- `font`
- `text-align`
- `vertical-align`
- `text-decoration`
- `text-indent`
- `text-wrap / text-overflow / text-transform`
- `tab-size`
- `text-stroke`
- `text-shadow`
- `line-clamp`
- `font-variant-numeric`

### wave_3

- `size / width / height / min / max`
- `aspect-ratio`
- `display`
- `overflow`
- `position / inset leftovers / float / z / order / box-sizing`
- `container`
- `columns`
- `table display / caption / collapse`

### wave_4

- `flex`
- `grid`
- `justify / align / place / flexGridJustifiesAlignments`
- `transform`
- `filters / backdrop-filters`
- `animation`

### wave_5

- `appearance`
- `will-change`
- `overscroll`
- `scroll-behavior`
- `touch-action`
- `list-style`
- `image-rendering`
- `cursor / pointer-events / resize / user-select`
- `white-space / breaks / hyphens / content-visibility / contents / field-sizing / color-scheme`

### special_review

当前没有剩余的 special review 项。

## 建议的下一步

下一步应从 `wave_1` 开始，优先推荐：

1. `background-color / bg-opacity`
2. `background-style / gradient`
3. `ring`
4. `decoration / shadow / divide`

## 已建立的执行模板

后续每个规则族都应沿用已经验证过的模板：

1. 先写 spec 文档。
2. 再写 plan 文档。
3. 初始化该规则族的 log / status 文档。
4. 建 shared fixture。
5. 建 runtime 正反向测试。
6. 建 Tailwind parity 测试。
7. 更新 utility spec。
8. 补 blocklist migration 子集。
9. 同步更新整体总表和整体状态文档。
10. 每个子步骤单独提交。

## 当前执行约束

这是这条分支后续必须继续遵守的约束：

- 所有任务文档必须提交到 git，不允许只留本地文件。
- 文档要实时更新，不能只更新单个 utility 的局部文档而忽略总表。
- 每个子步骤完成后要单独提交。
- 不直接在 `main` 上开发。
- 当前工作默认在 `codex/tailwind3-source-rewrite` 上继续。
- 用户明确要求中文输出。

## 文档治理现状

此前已经修正过文档治理问题，目前：

- `docs/` 不再被整体忽略。
- 第一阶段总入口已明确标注“不是全规则族完成”。
- 全量规则族总表和第二阶段计划都已进入 git。
- 文档治理测试已覆盖这些关键入口。

## 当前验证基线

最近一轮文档治理提交已经验证通过：

- `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
- `pnpm test`
- `pnpm run typecheck`

## 给新对话的最短上下文

如果只保留最关键的信息，可以直接复制下面这段：

> 当前仓库 `/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3` 正在进行 Tailwind 3 source rewrite。当前分支是 `codex/tailwind3-source-rewrite`，分支头是 `70d4b0a`。第一阶段主线已完成，已模板化的 family 有 `border-width`、`border-radius`、`text`、`leading`、`tracking`、`stroke`、`outline`、`transition`、`spacing-padding-margin`、`spacing-gap-inset-scroll`、`spacing-border-spacing-space`。这不等于全规则族完成。全量规则族总表在 `docs/2026-04-22-tailwind3-full-rule-family-inventory.md`，第二阶段计划在 `docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md`。下一步应从 `wave_1` 开始，优先做 `background-color / bg-opacity`。后续每个规则族都必须沿用既有模板：spec、plan、log、status、shared fixture、runtime/parity、utility spec、blocklist migration，并且所有文档必须实时更新并提交到 git，每个子步骤单独提交。
