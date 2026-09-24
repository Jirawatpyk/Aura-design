# @jirawatpyk/aura-react

AURA Design System components as a real React package — ES modules, TypeScript types, server-rendering safe, Thai-first.

**See every component live: [Storybook](https://jirawatpyk.github.io/Aura-design/)**

## Try it without a build (CDN)

One HTML file, no install — the packages are on npmjs, so jsDelivr serves them:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@jirawatpyk/aura-tokens@4/aura.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@jirawatpyk/aura-react@4/dist/styles.css">
<script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@jirawatpyk/aura-react@4/dist/aura.bundle.js"></script>

<div id="root"></div>
<script>
  const h = React.createElement;
  ReactDOM.createRoot(document.getElementById('root')).render(
    h(Aura.AuraProvider, { locale: 'th' },
      h(Aura.Stack, { gap: 4 },
        h(Aura.Button, { icon: 'plus' }, 'New order'),
        h(Aura.DatePicker, { label: 'Delivery date' }))));
</script>
```

## Install

```bash
npm i @jirawatpyk/aura-react @jirawatpyk/aura-tokens   # React 18 or 19; import from "@jirawatpyk/aura-react"
# or under the short names the docs use (imports stay `@aura/...`):
npm i @aura/react@npm:@jirawatpyk/aura-react @aura/tokens@npm:@jirawatpyk/aura-tokens
```

Public on npmjs; internal projects can use GitHub Packages instead ([repository README](https://github.com/Jirawatpyk/Aura-design#use-it-in-a-project)).

```tsx
// app root (once)
import '@aura/tokens/aura.css';          // tokens (light + dark)
import '@aura/react/styles.css';         // component styles
// fonts: Google Fonts <link> tags in <head>, or '@aura/tokens/aura-fonts.css'

import { AuraProvider, AppShell, SideNav, DataTable, DatePicker } from '@aura/react';

export default function Root() {
  return (
    <AuraProvider locale="th">           {/* Thai built-in labels; dates are พ.ศ. by default */}
      <App />
    </AuraProvider>
  );
}
```

## What's inside

| Output | For |
|---|---|
| `dist/esm/*.js` | Bundlers (Vite, Next.js, webpack). One file per module with `'use client'`, so Next.js App Router can import it from Server Components. `sideEffects` is limited to CSS, so unused components are dropped. |
| `dist/cjs/index.cjs` | `require()` / Jest. |
| `dist/aura.bundle.js` | A classic `<script>` that sets `window.Aura` (needs `window.React` / `window.ReactDOM`). The design-system artifact uses this file. |
| `dist/styles.css` | Component CSS (no font import). |
| `dist/index.d.ts` | Types for every component and helper, generated from the TypeScript sources (one file). |

## Components (49)

Actions: Button, IconButton, Menu, DropdownMenu, Tag · Forms: TextField, Textarea, NumberField, Select, RadioGroup, Checkbox, Switch, SegmentedControl, Combobox (one value, or `multiple`), FileUpload (+ `formatBytes`) · Dates & times: DatePicker, DateRangePicker, Calendar, TimePicker (+ `useFormatDate`, `formatDate`, `parseDate`, `parseTime`) · Feedback: Alert, Toaster/`toast()`, Tooltip, StatusPill, Badge, Progress, Skeleton, EmptyState · Overlays: Dialog, Drawer, Popover · Data: DataTable, Stat · Layout: AppShell, Container, Stack, Grid, Accordion, Pagination, Card, Tabs, Stepper, SideNav, Breadcrumb, Avatar, Surface, Icon · Theme: ColorSchemeToggle, ColorSchemeScript, `useColorScheme`, ThemeStyle/`createTheme` · Hooks: `useBreakpoint`, `useResponsive`, `breakpoints`, `useAuraLocale`.

## Router links, Swedish, motion

```tsx
import Link from 'next/link';
<AuraProvider locale="sv" linkComponent={Link}>   {/* th | en | sv */}
```

`linkComponent` is used by Button `href`, Breadcrumb, Pagination `getHref`, Stat `href`, SideNav and DataTable row/pager links. Only `th` shows Buddhist-era years; `en` and `sv` are Gregorian (`sv` weeks start Monday). **Without a provider, components are English with Gregorian dates** — wrap Thai apps in `<AuraProvider locale="th">`. For dates in your own components use `useFormatDate()` — it follows the provider (`const fmt = useFormatDate(); fmt(iso, { format: 'long' })`). Plain `formatDate()` has no provider to read and stays Thai unless you pass `locale`. Values are always Gregorian ISO dates.

Motion: skeleton pulses and indeterminate bars honour `prefers-reduced-motion: reduce` — skeletons stop (a static bar), spinners and progress bars slow to a third.

## Phones and touch

Under 640px every text control uses 16px text (iOS Safari doesn't zoom). On touch screens (`pointer: coarse`) IconButton keeps its 32px look with a 44px hit area, and Radio, Checkbox and Switch rows are at least 44px with the whole row as the target. `<Button fullWidth>` fills its row and wraps long Thai or Swedish labels.

## Light and dark

The tokens carry both schemes; `<html data-theme="light|dark|system">` picks one (`system` follows the OS in pure CSS).

```tsx
<html lang="th" data-theme="system" suppressHydrationWarning>
  <head><ColorSchemeScript /></head>   {/* applies the saved choice before first paint — no flash; nonce={nonce} for a CSP */}
  ...
<ColorSchemeToggle />                   {/* Light / Dark / System menu; saved in localStorage */}
const { scheme, resolved, setScheme } = useColorScheme();
```

Tailwind's `dark:` variant keeps working: the `.dark` class on `<html>` is kept in step.

## Links that look like buttons

`<Button href="/orders">View Orders</Button>` renders an `<a>` with the button's look — use it for navigation, keep actions as buttons. With Next.js: `<Button href="/orders" linkComponent={Link}>` (client-side navigation). `disabled` works on links too.

## Refs and forms

Every component forwards `ref` to its real element — fields to the `<input>`/`<select>`/`<textarea>`, buttons to the `<button>`, layouts to their root. react-hook-form: `register` for TextField/Textarea/Select, `Controller` (pass `field.ref`) for Combobox, DatePicker, TimePicker, FileUpload, Checkbox. See `examples/settings`.

## Brand themes

`npx aura-theme --brand "#0ea5e9" [--primary brand] --out src/aura-theme.css`, or `createTheme({ brand })` / `<ThemeStyle brand selector>` at runtime. Every brand-carrying token is re-mapped and checked against WCAG AA in both themes.

## Thai dates

Values are ISO strings (`2026-09-18`); with `locale="th"` display is Thai with Buddhist-era years (`18 ก.ย. 2569`). People can type `18/09/2569`, `18/09/2026`, `2026-09-18` or `18 ก.ย. 2569`. Store ISO, never พ.ศ. In components, `useFormatDate()(iso, { format: 'long' })` → `18 กันยายน 2569` under `locale="th"`, `18 September 2026` under `en`. `parseDate(text)` reads any of these forms in every locale.

## Server rendering

Portals (Dialog, Drawer, menus, pickers, toasts) wait until after hydration; `useBreakpoint()` returns `lg` on the server and corrects on the client through `useSyncExternalStore`, so there are no hydration mismatches. `npm run test:ssr` renders every component with `react-dom/server` (ESM and CJS builds).

## Scripts

```bash
npm run build        # dist/ (ESM, CJS, IIFE, CSS, types)
npm run test:ssr     # server-render every component
npm run typecheck    # tsc --strict over src/, then types-test/usage.tsx against the public API
npm run size         # gzip size of what projects import, against size-budgets.json
npm run test:pilots  # builds the pilots + 4 brand themes, then 37 behaviour/axe checks at 1440/820/390px (Playwright for Python, axe-core)
```

## Source

`src/` is TypeScript (strict) and JSX, formatted with Prettier (`npm run format`), **one file per component** (`Badge.tsx`, `Tooltip.tsx`, …) so a project that imports one component gets only that component's code. Public prop types live in `src/types.ts` with their docs; each component imports its props from there and `forwardRef`s with them, so the published `dist/index.d.ts` is generated from the code and can't drift from it. The build compiles JSX to `React.createElement` (classic runtime), so the `window.Aura` script needs only `window.React`.

## Pilots

`examples/settings/` (form-heavy, English, react-hook-form) and `examples/landing/` (Creative, re-branded live) join `examples/orders/`, a real admin page (orders for any business) built only from these components — AppShell, filters, DataTable with row actions, detail Drawer, New Order Dialog, confirmations, toasts. Build them with `npm run examples`, then open `examples/<name>/dist/index.html`. It is the reference for responsive behaviour at 390px, 820px and 1440px.
