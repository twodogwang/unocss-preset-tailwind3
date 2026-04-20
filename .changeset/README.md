# Changesets

这个目录用于维护版本发布说明，并驱动自动化发版。

常用流程：

1. 开发完成后运行 `pnpm changeset`
2. 选择版本级别并填写面向用户的变更摘要
3. 将生成的 `.changeset/*.md` 与代码改动一起提交到 PR
4. 合并到 `main` 后，Release workflow 会创建或更新版本 PR，并执行 `pnpm version:release` 来更新 `package.json` 与 `CHANGELOG.md`
5. 合并版本 PR 后，Release workflow 会自动发布 npm 包、创建对应 tag，并生成 GitHub Release

如果只想在本地预览版本变更，仍然可以手动运行 `pnpm version:release`。
