# AURA Design System

Enterprise Standard, Human Creative — one design system for every project: tokens, 43 React components, per-project brand themes, Storybook and tests.

| Package | What it is |
|---|---|
| [`packages/tokens`](packages/tokens) · `@jirawatpyk/aura-tokens` | `tokens.json` (single source), generated `aura.css` (light + dark), Tailwind preset, Figma variables, contrast check, token lint, ESLint rule |
| [`packages/react`](packages/react) · `@jirawatpyk/aura-react` | The components as ES modules (+ CJS, types, `'use client'`, SSR-safe, every component forwards `ref`), `createTheme` / `aura-theme` CLI, three pilot pages |
| [`apps/storybook`](apps/storybook) | Storybook 8 with every component and the pilots; axe and behaviour tests |

Living documentation: the AURA design-system artifact on claude.ai (tokens, component cards, guidelines, theme builder).

## Use it in a project

GitHub Packages needs a token even to install. Create a personal access token with **read:packages**, then in the project:

```ini
# .npmrc
@jirawatpyk:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```jsonc
// package.json — install under the short names so imports stay `@aura/...`
"dependencies": {
  "@aura/tokens": "npm:@jirawatpyk/aura-tokens@^4.4.0",
  "@aura/react": "npm:@jirawatpyk/aura-react@^4.4.0"
}
```

```tsx
import '@aura/tokens/aura.css';          // tokens
import '@aura/react/styles.css';         // components
import './aura-theme.css';               // optional: the project's brand (see below)
import { AuraProvider, AppShell, Button } from '@aura/react';

<AuraProvider locale="th">…</AuraProvider>   // Thai built-in labels; dates are พ.ศ. by default
```

Fonts: add the Google Fonts `<link>` tags from `packages/tokens/aura-fonts.css` to your `<head>` (or import that file).

### A brand per project

```bash
npx aura-theme --brand "#0ea5e9" --primary brand --out src/aura-theme.css
```

It builds a colour scale from the brand, maps it onto AURA's brand tokens (links, focus ring, selection, info, progress…), fixes anything below WCAG AA and prints every check. Success, warning and danger colours never change. At runtime (multi-tenant): `<ThemeStyle brand={tenant.colour} selector=".tenant" />`.

### Forms

Every component forwards `ref` to its real element, so react-hook-form works as documented: `register` for TextField / Textarea / Select, `Controller` for Combobox, DatePicker, TimePicker, FileUpload and Checkbox.

## Develop

```bash
npm ci
npm test                 # contrast (94 pairs), token lint, server rendering, tsc --strict
npm run build            # tokens + React (ESM, CJS, window.Aura bundle, types)
npm run storybook        # http://localhost:6006
npm run test:storybook   # axe on every story in both themes + behaviour tests
npm run test:pilots      # the three pilot pages at 390/820/1440px, 4 brand themes (needs Python + playwright)
```

Change tokens only in `packages/tokens/tokens.json`, then `npm run build -w packages/tokens` and commit the generated files (CI fails otherwise).

## Release

1. Bump `version` in `packages/tokens/package.json` and `packages/react/package.json` (same number), update `CHANGELOG.md`.
2. `git tag v4.4.1 && git push --tags` — the Release workflow tests and publishes both packages to GitHub Packages.

## Rules that keep it one system

- A component joins AURA when at least two projects need it; project-specific screens stay in the project.
- Brand is a theme layer, never a fork. Meaning colours don't follow the brand.
- A change ships when the three pilots (admin, form-heavy, Creative) pass axe in both themes at 390, 820 and 1440px.

See [`packages/tokens/GOVERNANCE.md`](packages/tokens/GOVERNANCE.md) for versioning, contribution flow and the decisions log.
