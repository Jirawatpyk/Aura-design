# AURA Design System 4.4 — `@jirawatpyk/aura-tokens` (imported as `@aura/tokens`)

Enterprise Standard, Human Creative. Tokens, Tailwind preset, Figma variables a contrast check and token lint. The components live in `../react` (`@aura/react`); `components/` here is a synced copy of their `window.Aura` bundle for `<script>`-tag use.

## What's inside

| File | What |
|---|---|
| `tokens.json` | **Source of truth.** 3-tier: primitive → semantic (light/dark) → component, plus spacing, radius, shadow (per theme), size, motion, opacity, z-index, typography. |
| `aura.css` | Every token as a CSS variable. Light on `:root` / `[data-theme="light"]`, dark on `.dark` / `[data-theme="dark"]`. **Generated.** |
| `aura-fonts.css` | The Google Fonts `@import` (Fraunces, Inter, JetBrains Mono, Noto Sans Thai). Kept separate so a network that blocks Google can't break `aura.css`. **Generated.** |
| `tailwind.config.ts` + `tailwind.tokens.cjs` | Tailwind theme wired to the variables (`bg-bg-surface`, `text-fg-danger`, `rounded-aura-xl`, `shadow-aura-overlay` …). The `.cjs` is **generated**. |
| `figma-variables.csv` | 204 variables: all colours in both modes (aliases kept), spacing, radius and sizes. **Generated.** |
| `components/` | `aura.bundle.js` (sets `window.Aura`), `aura.components.css`, `index.d.ts`. |
| `eslint-plugin-aura.js` | `aura/no-hardcoded-color`: hex, rgb()/hsl() and Tailwind `bg-[#…]` classes. |
| `scripts/build-tokens.js` | Rebuilds the generated files from `tokens.json`. |
| `scripts/a11y-check.js` | Checks 94 text/ground pairs in both themes (WCAG AA). |
| `scripts/lint-tokens.js` | Fails on hard-coded colours (a file that must hold them says `aura-lint: allow-colours` with a reason). |

## ใช้งาน (5 นาที)

```bash
# public on npmjs; internal projects can use GitHub Packages instead (see the repository README)
npm install @aura/tokens@npm:@jirawatpyk/aura-tokens @aura/react@npm:@jirawatpyk/aura-react
```

```tsx
// app/layout.tsx
import '@aura/tokens/aura-fonts.css'       // Google Fonts (or use the <link> tags below instead)
import '@aura/tokens/aura.css'             // tokens
import '@aura/react/styles.css'            // component styles (with @aura/react)
```

```html
<!-- Preferred: load the fonts from <head> instead of aura-fonts.css — faster, and a blocked host fails quietly -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&family=Noto+Sans+Thai:wght@400;500;600&display=swap">
```

Dark theme: put `class="dark"` (or `data-theme="dark"`) on `<html>`.

### Tailwind

```ts
// tailwind.config.ts — copy this file, or spread the maps from '@aura/tokens/tailwind'
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
import React from 'react'
import ReactDOM from 'react-dom'
;(window as any).React = React; (window as any).ReactDOM = ReactDOM
import '@aura/tokens/components.js'
const { Button, TextField, DataTable, Dialog, toast, Toaster } = (window as any).Aura
```

Types for every component are in `components/index.d.ts`.

## Changing a token

1. Edit `tokens.json` (never `aura.css`, `tailwind.tokens.cjs` or the CSV).
2. `npm run build:tokens` (regenerates the generated files).
3. `npm run a11y` (every text/ground pair in both themes must pass AA).
4. Open a PR; see `GOVERNANCE.md`.

## Build & publish

```bash
npm run build      # build:tokens + contrast check + dist/
npm publish        # to your private registry
```
