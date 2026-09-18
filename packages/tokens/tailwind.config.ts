import type { Config } from 'tailwindcss'
// Token maps are GENERATED from tokens.json — run `npm run build:tokens` after editing tokens.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const aura = require('./tailwind.tokens.cjs')

const config: Config = {
  darkMode: 'class', // `.dark` on <html>; [data-theme="dark"] works too because aura.css declares both
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // bg-bg-surface · text-fg-primary · border-border-strong · text-fg-danger · bg-alert-warning-bg …
      colors: aura.colors,
      // p-aura-6 · gap-aura-4 · rounded-aura-xl · shadow-aura-overlay · ease-aura-ease · duration-aura-fast · z-aura-dialog
      spacing: aura.spacing,
      borderRadius: aura.borderRadius,
      boxShadow: aura.boxShadow,
      transitionTimingFunction: aura.transitionTimingFunction,
      transitionDuration: aura.transitionDuration,
      zIndex: aura.zIndex,
      fontFamily: aura.fontFamily, // font-display · font-sans · font-mono · font-thai
    },
  },
  plugins: [],
}
export default config
