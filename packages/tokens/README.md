# AURA Design System — `@jirawatpyk/aura-tokens` (imported as `@aura/tokens`)

Enterprise Standard, Human Creative. Tokens, Tailwind preset, Figma variables a contrast check and token lint. The components live in [`@jirawatpyk/aura-react`](https://www.npmjs.com/package/@jirawatpyk/aura-react); `components/` here is a synced copy of their `window.Aura` bundle for `<script>`-tag use.

## What's inside

| File                                         | What                                                                                                                                                                                                                                                                            |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tokens.json`                                | **Source of truth.** 3-tier: primitive → semantic (light/dark) → component, plus spacing, radius, shadow (per theme), size, motion, opacity, z-index, typography.                                                                                                               |
| `aura.css`                                   | Every token as a CSS variable. Light on `:root` / `[data-theme="light"]`, dark on `.dark` / `[data-theme="dark"]`. **Generated.**                                                                                                                                               |
| `aura-fonts.css`                             | The Google Fonts `@import` (Fraunces, Inter, JetBrains Mono, Noto Sans Thai). Kept separate so a network that blocks Google can't break `aura.css`. **Generated.**                                                                                                              |
| `aura-fonts.local.css` + `fonts/`            | The same four families self-hosted: `@font-face` rules over woff2 files in the package (4.16), for a `font-src 'self'` CSP. `npm run check:fonts` loads them under that CSP. **Generated.**                                                                                     |
| `tailwind.config.ts` + `tailwind.tokens.cjs` | Tailwind v3 theme wired to the variables (`bg-bg-surface`, `text-fg-danger`, `rounded-aura-xl`, `shadow-aura-overlay` …). The `.cjs` is **generated**.                                                                                                                          |
| `aura-tailwind.css`                          | The same class names for Tailwind v4 (`@theme inline`, CSS-first). **Generated**; exported as `@jirawatpyk/aura-tokens/tailwind.css`.                                                                                                                                           |
| `figma-variables.csv`                        | 204 variables: all colours in both modes (aliases kept), spacing, radius and sizes. **Generated.**                                                                                                                                                                              |
| `components/`                                | `aura.bundle.js` (sets `window.Aura`), `aura.components.css`, `index.d.ts`.                                                                                                                                                                                                     |
| `eslint-plugin-aura.js`                      | `aura/no-hardcoded-color`: hex, colour functions (rgb, hsl, oklch, color-mix…), named colours in style values and Tailwind palette / `bg-[#…]` classes. ESLint 9: `import aura from '@jirawatpyk/aura-tokens/eslint-plugin'; export default [aura.configs.recommended];` (5.2). |
| `scripts/build-tokens.js`                    | Rebuilds the generated files from `tokens.json`.                                                                                                                                                                                                                                |
| `scripts/a11y-check.js`                      | Checks 210 pairs in both themes: text on its grounds (WCAG AA), control edges and state marks at 3:1, neighbouring chart and status fills a lightness step apart.                                                                                                               |
| `scripts/lint-tokens.js`                     | Fails on hard-coded colours (a file that must hold them says `aura-lint: allow-colours` with a reason).                                                                                                                                                                         |

## ใช้งาน (5 นาที)

```bash
# public on npmjs; internal projects can use GitHub Packages instead (see the repository README)
npm install @aura/tokens@npm:@jirawatpyk/aura-tokens @aura/react@npm:@jirawatpyk/aura-react
# or plain: npm install @jirawatpyk/aura-tokens @jirawatpyk/aura-react
```

```tsx
// app/layout.tsx
import '@aura/tokens/aura-fonts.local.css'; // fonts, self-hosted from the package: works under a font-src 'self' CSP
import '@aura/tokens/aura.css'; // tokens
import '@aura/react/styles.css'; // component styles (with @aura/react)
```

Next.js can load the same families with `next/font` instead, and a site with no CSP can use Google Fonts (`aura-fonts.css` or `<link>` tags). Both are under Fonts below.

### Fonts

Pick one of three ways to load Fraunces, Inter, JetBrains Mono and Noto Sans Thai:

| Option             | Use when                                                                    | How                                                                                                                                                                         |
| ------------------ | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Self-hosted (4.16) | Your CSP allows only `font-src 'self'`, or you want no third-party requests | `import '@jirawatpyk/aura-tokens/aura-fonts.local.css'` — woff2 files ship in the package (`fonts/`, OFL-1.1), split by unicode range so a page downloads only what it uses |
| `next/font`        | Next.js apps that want preloading and zero layout shift                     | Load the families with `next/font` and point the AURA font variables at them (below)                                                                                        |
| Google Fonts       | No CSP, or one that allows `fonts.googleapis.com` and `fonts.gstatic.com`   | `aura-fonts.css`, or the `<link>` tags below (faster; a blocked host fails quietly)                                                                                         |

```html
<!-- Google Fonts from <head> (only without a strict CSP) -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&family=Noto+Sans+Thai:wght@400;500;600&display=swap"
/>
```

```tsx
// app/layout.tsx — next/font (downloads at build time and self-hosts, so font-src 'self' is enough)
import { Fraunces, Inter, JetBrains_Mono, Noto_Sans_Thai } from 'next/font/google';
const display = Fraunces({ subsets: ['latin', 'latin-ext'], axes: ['opsz'], variable: '--next-display' });
const sans = Inter({ subsets: ['latin', 'latin-ext'], variable: '--next-sans' });
const mono = JetBrains_Mono({ subsets: ['latin', 'latin-ext'], weight: '400', variable: '--next-mono' });
const thai = Noto_Sans_Thai({ subsets: ['thai'], variable: '--next-thai' });
// <html className={[display, sans, mono, thai].map((f) => f.variable).join(' ')}>
```

```css
/* app/globals.css, after aura.css — AURA's stacks now use the next/font families */
:root {
  --font-display: var(--next-display), var(--next-thai), serif;
  --font-sans: var(--next-sans), var(--next-thai), sans-serif;
  --font-mono: var(--next-mono), monospace;
  --font-thai: var(--next-thai), sans-serif;
}
```

Dark theme: put `class="dark"` (or `data-theme="dark"`) on `<html>`.

### Tailwind v4

```css
/* app/globals.css */
@import 'tailwindcss';
@import '@jirawatpyk/aura-tokens/tailwind.css'; /* imports aura.css too */
```

Classes: `bg-bg-surface`, `text-fg-primary`, `border-border-strong`, `text-fg-danger`, `bg-alert-warning-bg`, `fill-chart-1`, `p-aura-6`, `gap-aura-4`, `rounded-aura-xl`, `shadow-aura-overlay`, `ease-aura-ease`, `duration-aura-fast`, `z-aura-dialog`, `font-display` / `font-sans` / `font-mono`. They point at the `--aura-*` variables, so `.dark` or `data-theme="dark"` switches them with no `dark:` prefix; the file also makes `dark:` follow those two switches. `npm run check:tailwind4` compiles it with Tailwind v4 in CI.

Next to an existing Tailwind theme (shadcn) use `@jirawatpyk/aura-tokens/tailwind.prefixed.css` instead (4.17). Every name carries `aura-` (`bg-aura-bg-surface`, `border-aura-border-strong`, `bg-aura-chart-1`, `font-aura-sans`), with no `@custom-variant` and no `@import`. Import `aura.css` yourself in an early layer so your theme keeps its `--font-*`. The React package README has the full setup, with `@jirawatpyk/aura-react/styles.layer.css`.

### Tailwind v3

```ts
// tailwind.config.ts — copy this file, or spread the maps from '@jirawatpyk/aura-tokens/tailwind'
```

```tsx
// ❌ ห้าม
<div className="bg-[#18181b] text-white">
// ✅ ต้อง
<div className="bg-bg-surface-strong text-fg-inverted rounded-aura-xl p-aura-6">
```

### Components

The bundle is a classic script that reads `window.React` / `window.ReactDOM` and sets `window.Aura`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
(window as any).React = React;
(window as any).ReactDOM = ReactDOM;
import '@aura/tokens/components.js';
const { Button, TextField, DataTable, Dialog, toast, Toaster } = (window as any).Aura;
```

Types for every component are in `components/index.d.ts`.

## Changing a token

1. Edit `tokens.json` (never `aura.css`, `tailwind.tokens.cjs`, `aura-tailwind.css` or the CSV).
2. `npm run build:tokens` (regenerates the generated files).
3. `npm run a11y` (every text/ground pair in both themes must pass AA).
4. Open a PR; see `GOVERNANCE.md`.

## Build & publish

```bash
npm run build      # build:tokens + contrast check + dist/
npm publish        # to your private registry
```
