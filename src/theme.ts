import type { Theme } from './_theme'
import { theme as baseTheme } from './_theme'

export type { Theme, ThemeAnimation } from './_theme'

export const theme: Theme = {
  ...baseTheme,
  animation: {
    none: 'none',
    spin: 'spin 1s linear infinite',
    ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    bounce: 'bounce 1s infinite',
  },
  keyframes: {
    spin: '{to{transform:rotate(360deg)}}',
    ping: '{75%,100%{transform:scale(2);opacity:0}}',
    pulse: '{50%{opacity:.5}}',
    bounce: '{0%,100%{transform:translateY(-25%);animation-timing-function:cubic-bezier(0.8,0,1,1)}50%{transform:none;animation-timing-function:cubic-bezier(0,0,0.2,1)}}',
  },
}
