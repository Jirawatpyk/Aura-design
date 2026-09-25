# AURA Design System

Enterprise Standard, Human Creative — one design system for every project: tokens, 51 React components, per-project brand themes, Storybook and tests.

| Package | What it is |
|---|---|
| [`packages/tokens`](packages/tokens) · `@jirawatpyk/aura-tokens` | `tokens.json` (single source), generated `aura.css` (light + dark), Tailwind preset, Figma variables, contrast check, token lint, ESLint rule |
| [`packages/react`](packages/react) · `@jirawatpyk/aura-react` | The components as ES modules (+ CJS, types, `'use client'`, SSR-safe, every component forwards `ref`), `createTheme` / `aura-theme` CLI, three pilot pages |
| [`apps/storybook`](apps/storybook) | Storybook 8 with every component and the pilots; axe and behaviour tests |

**Storybook (live components, pilots, install guide): [https://jirawatpyk.github.io/Aura-design/](https://jirawatpyk.github.io/Aura-design/)** — rebuilt from `main` after every Storybook test passes.

Living documentation: the AURA design-system artifact on claude.ai (tokens, component cards, guidelines, theme builder).

## Use it in a project

**New Next.js app?** Start from the template — App Router, TypeScript, AURA wired in:

```bash
npx degit Jirawatpyk/Aura-design/templates/next-starter my-app
```

Works with **React 18 and 19**: CI runs every suite (SSR, hydration, pilots, Storybook) on both.

Published to two registries with the same names and versions:

| Registry | For | Setup |
|---|---|---|
| **npmjs** (public) | anyone — try it in a minute | none |
| **GitHub Packages** | internal projects that want everything behind GitHub | `.npmrc` + a token with **read:packages** (below) |

```bash
npm i @aura/react@npm:@jirawatpyk/aura-react @aura/tokens@npm:@jirawatpyk/aura-tokens   # react >= 18 is a peer
```

```jsonc
// package.json — install under the short names so imports stay `@aura/...`
"dependencies": {
  "@aura/tokens": "npm:@jirawatpyk/aura-tokens@^4.5.0",
  "@aura/react": "npm:@jirawatpyk/aura-react@^4.5.0"
}
```

No build at all: see the CDN snippet in [`packages/react`](packages/react#try-it-without-a-build-cdn).

Internal projects on GitHub Packages add this `.npmrc` (same `package.json`):

```ini
@jirawatpyk:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```tsx
import '@aura/tokens/aura.css';          // tokens
import '@aura/react/styles.css';         // components
import './aura-theme.css';               // optional: the project's brand (see below)
import { AuraProvider, AppShell, Button } from '@aura/react';

<AuraProvider locale="th">…</AuraProvider>   // Thai built-in labels; dates are พ.ศ. by default
```

Fonts: `import '@jirawatpyk/aura-tokens/aura-fonts.local.css'` (self-hosted, works under a `font-src 'self'` CSP); `next/font` or Google Fonts are alternatives — see `packages/tokens/README.md`.

### A brand per project

```bash
npx aura-theme --brand "#0ea5e9" --primary brand --out src/aura-theme.css
```

It builds a colour scale from the brand, maps it onto AURA's brand tokens (links, focus ring, selection, info, progress…), fixes anything below WCAG AA and prints every check. Success, warning and danger colours never change. At runtime (multi-tenant): `<ThemeStyle brand={tenant.colour} selector=".tenant" />`.

### Light and dark

`<html data-theme="system" suppressHydrationWarning>` + `<ColorSchemeScript />` in `<head>` + `<ColorSchemeToggle />` anywhere: Light / Dark / System, remembered, no flash on load. `system` follows the OS in CSS alone.

### Forms

Every component forwards `ref` to its real element, so react-hook-form works as documented: `register` for TextField / Textarea / Select, `Controller` for Combobox, DatePicker, TimePicker, FileUpload and Checkbox.

## Develop

```bash
npm ci
npm test                 # contrast (94 pairs), token lint, server rendering, tsc --strict over the TypeScript sources
npm run build            # tokens + React (ESM, CJS, window.Aura bundle, types)
npm run storybook        # http://localhost:6006
npm run test:storybook   # axe on every story in both themes + behaviour tests
npm run size -w packages/react   # gzip size of what projects import; CI fails over packages/react/size-budgets.json
npm run test:pilots      # the three pilot pages at 390/820/1440px, 4 brand themes (needs Python + playwright)
```

Visual regression: [Chromatic](https://www.chromatic.com) snapshots every story in light and dark on pull requests (`.github/workflows/chromatic.yml`; set the `CHROMATIC_PROJECT_TOKEN` secret and the `CHROMATIC_ENABLED=true` variable to turn it on).

Change tokens only in `packages/tokens/tokens.json`, then `npm run build -w packages/tokens` and commit the generated files (CI fails otherwise).

## Release

Versions come from [Changesets](https://github.com/changesets/changesets):

1. With each change: `npx changeset` → pick patch / minor / major, write one line for the changelog; commit the file it makes in `.changeset/`.
2. On `main`, the Release workflow gathers the changesets into a **Version Packages** pull request (versions bumped in both packages together, CHANGELOGs written). Edit the notes there if you like.
3. Merge it. The workflow tests, publishes both packages to GitHub Packages **and** npmjs, tags `vX.Y.Z` and creates the GitHub release.

A version a registry already has is skipped, so a failed run can be re-run. Pushing a `v*` tag by hand still publishes that version.
Needs once: repo Settings → Actions → General → *Allow GitHub Actions to create and approve pull requests*.

npmjs uses trusted publishing: each package's Settings on npmjs.com trusts `Jirawatpyk/Aura-design` → `release.yml`, so no token is stored anywhere. A version with a hyphen (`4.7.0-rc.1`, `npx changeset pre enter rc`) is published under the `next` dist-tag.

## Rules that keep it one system

- A component joins AURA when at least two projects need it; project-specific screens stay in the project.
- Brand is a theme layer, never a fork. Meaning colours don't follow the brand.
- A change ships when the three pilots (admin, form-heavy, Creative) pass axe in both themes at 390, 820 and 1440px.

See [`packages/tokens/GOVERNANCE.md`](packages/tokens/GOVERNANCE.md) for versioning, contribution flow and the decisions log.
