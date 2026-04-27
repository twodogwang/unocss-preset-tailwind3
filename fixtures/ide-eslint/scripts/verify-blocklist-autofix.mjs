import { fileURLToPath } from 'node:url'
import { ESLint } from 'eslint'

const fixtureDir = fileURLToPath(new URL('..', import.meta.url))
const source = 'export function Demo() { return <div className="c-#fff bg-op50 b-2 rd-md fw-bold pos-absolute text-[#000]" /> }'
const expectedOutput = 'export function Demo() { return <div className="absolute border-2 rounded-md bg-opacity-50 text-[#000] text-[#fff] font-bold" /> }'

const eslint = new ESLint({
  cwd: fixtureDir,
  fix: true,
})

const [result] = await eslint.lintText(source, {
  filePath: fileURLToPath(new URL('../src/demo.jsx', import.meta.url)),
})

if (result.output !== expectedOutput)
  throw new Error(`unexpected autofix output: ${result.output ?? '<no output>'}`)

if (result.messages.length > 0)
  throw new Error(`expected no remaining diagnostics, got: ${JSON.stringify(result.messages)}`)
