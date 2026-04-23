# Rewrite Session Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为规则族 rewrite 流程增加自动 handoff 与下一会话启动脚本，让当前 family 完成后可以自动切换到新的 Codex 上下文继续下一个 family。

**Architecture:** 用一个纯 helper 模块承载 inventory 解析、handoff/prompt 生成和路径生成，再用两个很薄的 CLI 文件负责文件写入与调用 `codex`。整个流程不接管测试、提交和文档更新，只负责“交接并启动下一会话”。实现顺序遵循 @superpowers:test-driven-development：先写脚本测试，再写 helper，最后接 CLI 和 package 命令。

**Tech Stack:** Node.js ESM, child_process, fs/promises, Vitest, pnpm

---

## Scope

包含：

- `scripts/rewrite-session.mjs`
- `scripts/rewrite-finish-family.mjs`
- `scripts/rewrite-next-family.mjs`
- `package.json` scripts
- handoff / prompt / latest state 文件格式
- 脚本测试

不包含：

- 自动验收当前 family
- 自动提交
- 自动改写 inventory

## File Structure

### Existing files to modify

- `package.json`
- `docs/2026-04-22-tailwind3-full-rule-family-inventory.md`
  - 只作为 helper 解析输入，不修改内容

### New files to create

- `scripts/rewrite-session.mjs`
- `scripts/rewrite-finish-family.mjs`
- `scripts/rewrite-next-family.mjs`
- `test/rewrite-session-automation.test.ts`
- `docs/superpowers/specs/2026-04-23-rewrite-session-automation-design.md`
- `docs/superpowers/plans/2026-04-23-rewrite-session-automation.md`

## Testing Strategy

验证层：

1. 脚本测试
   - `pnpm exec vitest --run test/rewrite-session-automation.test.ts`
2. 文档治理回归
   - `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
3. 全量回归
   - `pnpm test`
4. 类型/静态检查
   - `pnpm run typecheck`
