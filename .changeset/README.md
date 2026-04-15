# Changesets

这个目录用于维护版本发布说明。

常用流程：

1. 开发完成后运行 `pnpm changeset`
2. 选择版本级别并填写面向用户的变更摘要
3. 合并改动后，在准备发版时运行 `pnpm version:release`
4. 审核 `package.json` 与 `CHANGELOG.md`
5. 提交版本变更并推送对应 tag
