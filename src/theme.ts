import type { Theme } from './_theme'
import { theme as baseTheme } from './_theme'

export type { Theme, ThemeAnimation } from './_theme'

export const theme: Theme = {
  ...baseTheme,
  animation: {
    keyframes: {
      spin: '{to{transform:rotate(360deg)}}',
      ping: '{75%,100%{transform:scale(2);opacity:0}}',
      pulse: '{50%{opacity:.5}}',
      bounce: '{0%,100%{transform:translateY(-25%);animation-timing-function:cubic-bezier(0.8,0,1,1)}50%{transform:none;animation-timing-function:cubic-bezier(0,0,0.2,1)}}',
    },
    durations: {
      spin: '1s',
      ping: '1s',
      pulse: '2s',
      bounce: '1s',
    },
    timingFns: {
      spin: 'linear',
      ping: 'cubic-bezier(0, 0, 0.2, 1)',
      pulse: 'cubic-bezier(0.4, 0, 0.6, 1)',
      bounce: 'linear',
    },
    counts: {
      spin: 'infinite',
      ping: 'infinite',
      pulse: 'infinite',
      bounce: 'infinite',
    },
  },
}
