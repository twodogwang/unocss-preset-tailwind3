# Table Display Caption Collapse Source Rewrite Design

状态日期：2026-04-25  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `table display / caption / collapse` 纳入 Tailwind 3 source rewrite 模板：shared fixture、runtime/parity、utility spec、独立过程文档，以及总表同步。

本轮目标是明确：

- `table` family 只接受 Tailwind 3 官方的 table display、table-layout、caption-side 与 border-collapse utility
- 移除 `table-empty-cells-*` 这类不属于 Tailwind 3 默认包的扩展入口
- 保持 `border-spacing` 继续留在已完成的 spacing/table 子族，不在本轮重复治理

## 范围

包含：

- `inline-table`
- `table`
- `table-caption`
- `table-cell`
- `table-column`
- `table-column-group`
- `table-footer-group`
- `table-header-group`
- `table-row`
- `table-row-group`
- `table-auto`
- `table-fixed`
- `caption-top`
- `caption-bottom`
- `border-collapse`
- `border-separate`

不包含：

- `border-spacing`
- `table-empty-cells-*`
- 其他非 Tailwind 表格扩展

## 当前现状

当前实现位于 [src/_rules-wind3/table.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules-wind3/table.ts)。

已确认的偏差：

- 旧实现额外暴露了 `table-empty-cells-visible` 与 `table-empty-cells-hidden`

通过本地 Tailwind 3.4 主源 `node_modules/tailwindcss/lib/corePlugins.js` 与运行时实测确认：

- 默认包支持的是 table display、table-layout、caption-side 与 border-collapse
- 默认包不支持 `table-empty-cells-*`

## 设计原则

### 1. 只保留 Tailwind 3 默认包里的 table 语义

本轮从 `src/_rules-wind3/table.ts` 中剥离仓库扩展，只留下官方 family。

### 2. 不把已完成的 border-spacing 回滚进来

`border-spacing` 已在 earlier family 完成治理，本轮只关注 table display/caption/collapse 本身。

### 3. 不强行补 blocklist

当前没有足够高置信度且单义的旧 table 别名，因此本轮不新增 blocklist migration 子集。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-table-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-table-rewrite.ts)

### 2. runtime / parity

更新：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

### 3. utility spec

登记 family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-25-table-display-caption-collapse-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-25-table-display-caption-collapse-source-rewrite-log.md)
- [docs/2026-04-25-table-display-caption-collapse-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-25-table-display-caption-collapse-source-rewrite-status.md)
