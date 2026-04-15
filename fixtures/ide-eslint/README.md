# IDE ESLint Fixture

这个夹具用于验证 `@unocss/blocklist` 是否能在 IDE 中正确显示由 preset 提供的迁移提示。

## 目标

- 验证 `blocklist` 命中后，ESLint 能显示自定义 `message`
- 验证常见旧写法如 `c-#fff`、`bg-op50`、`b-2` 能在编辑器里被提示替换

## 使用

1. 安装依赖

```bash
pnpm install --dir fixtures/ide-eslint
```

2. 运行命令行 lint，先确认不是 IDE 配置问题

```bash
pnpm --dir fixtures/ide-eslint lint
```

3. 在 VS Code 或 JetBrains 打开 `fixtures/ide-eslint`

4. 确保 IDE 已启用 ESLint

5. 打开 `src/demo.jsx`

6. 查看 `Problems` 面板，应该看到类似下面的提示

```text
"c-#fff" is in blocklist: 旧写法 "c-#fff" 已禁用，请改为 "text-[#fff]"
```

## 说明

- 这里故意使用 `src/demo.js` 和变量名 `cls`，因为 UnoCSS ESLint 默认会扫描名字匹配 `^cls` 的变量。
- 这里故意使用 JSX 的 `className` 属性，因为 `blocklist` 规则检查的是模板属性，不检查普通字符串变量。
- 如果命令行 `lint` 能报出来，但 IDE 没提示，问题通常在 IDE 的 ESLint 扩展或工作目录配置。
- 如果命令行 `lint` 都没有报出来，优先检查 `uno.config.mjs` 是否真的加载到了当前 preset。
