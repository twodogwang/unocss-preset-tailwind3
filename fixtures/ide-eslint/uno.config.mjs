import { defineConfig } from 'unocss'
import presetTailwind3 from '../../src/index.ts'

export default defineConfig({
  presets: [
    presetTailwind3(),
  ],
})
