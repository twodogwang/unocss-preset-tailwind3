# IDE ESLint Fixture

这个夹具用于验证 preset 提供的 blocklist 迁移提示能否在 IDE 中显示，以及本地 ESLint rule 能否为高置信度旧写法提供 autofix。

## 目标

- 验证 `blocklist` 命中后，ESLint 能显示自定义 `message`
- 验证常见旧写法如 `c-#fff`、`bg-op50`、`b-2` 能在编辑器里被提示替换
- 验证 autofix 后输出会收敛到 canonical Tailwind 3 class

## 使用

1. 安装依赖

```bash
pnpm install --dir fixtures/ide-eslint
```

2. 运行命令行 lint，先确认不是 IDE 配置问题

```bash
pnpm --dir fixtures/ide-eslint lint
```

3. 运行 autofix 验证，确认 fix 后输出和残留诊断都符合预期

```bash
pnpm --dir fixtures/ide-eslint run verify:autofix
```

4. 在 VS Code 或 JetBrains 打开 `fixtures/ide-eslint`

5. 确保 IDE 已启用 ESLint

6. 打开 `src/demo.jsx`

7. 查看 `Problems` 面板，应该看到类似下面的提示

```text
"c-#fff" is in blocklist: 旧写法 "c-#fff" 已禁用，请改为 "text-[#fff]"
```

## Autofix

`verify:autofix` 会把示例中的旧写法修正为最终输出：

```text
absolute border-2 rounded-md bg-opacity-50 text-[#000] text-[#fff] font-bold
```

代表性修正包括：

- `c-#fff` -> `text-[#fff]`
- `bg-op50` -> `bg-opacity-50`
- `b-2` -> `border-2`
- `rd-md` -> `rounded-md`
- `fw-bold` -> `font-bold`
- `pos-absolute` -> `absolute`

## 说明

- 这里故意使用 JSX 的 `className` 属性，因为本地 autofix rule 当前只覆盖 class 字面量，不处理普通字符串变量。
- `lint` 和 `verify:autofix` 都通过 `tsx` loader 直接读取仓库里的 `src/*.ts`，不依赖预先 build 出来的 `dist`。
- 如果命令行 `lint` 能报出来，但 IDE 没提示，问题通常在 IDE 的 ESLint 扩展或工作目录配置。
- 如果命令行 `lint` 都没有报出来，优先检查 `uno.config.mjs` 是否真的加载到了当前 preset。
