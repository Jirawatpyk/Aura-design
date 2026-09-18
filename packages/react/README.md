# @jirawatpyk/aura-react 4.4.1 (imported as `@aura/react`)

AURA Design System components as a real React package — ES modules, TypeScript types, server-rendering safe, Thai-first.

```bash
# public on npmjs; internal projects can use GitHub Packages instead (see the repository README)
npm i @aura/react@npm:@jirawatpyk/aura-react @aura/tokens@npm:@jirawatpyk/aura-tokens   # react >= 18 is a peer dependency
```

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
| `dist/index.d.ts` | Types for every component and helper. |

## Components (43)

Actions: Button, IconButton, Menu, DropdownMenu, Tag · Forms: TextField, Textarea, Select, RadioGroup, Checkbox, Switch, Combobox, FileUpload (+ `formatBytes`) · Dates & times: DatePicker, DateRangePicker, Calendar, TimePicker (+ `formatDate`, `parseDate`, `parseTime`) · Feedback: Alert, Toaster/`toast()`, Tooltip, StatusPill, Badge, Progress, Skeleton, EmptyState · Overlays: Dialog, Drawer, Popover · Data: DataTable, Stat · Layout: AppShell, Container, Stack, Grid, Accordion, Pagination, Card, Tabs, SideNav, Breadcrumb, Avatar, Surface, Icon · Hooks: `useBreakpoint`, `useResponsive`, `breakpoints`, `useAuraLocale`.

## Refs and forms

Every component forwards `ref` to its real element — fields to the `<input>`/`<select>`/`<textarea>`, buttons to the `<button>`, layouts to their root. react-hook-form: `register` for TextField/Textarea/Select, `Controller` (pass `field.ref`) for Combobox, DatePicker, TimePicker, FileUpload, Checkbox. See `examples/settings`.

## Brand themes

`npx aura-theme --brand "#0ea5e9" [--primary brand] --out src/aura-theme.css`, or `createTheme({ brand })` / `<ThemeStyle brand selector>` at runtime. Every brand-carrying token is re-mapped and checked against WCAG AA in both themes.

## Thai dates

Values are ISO strings (`2026-09-18`); display is Thai with Buddhist-era years (`18 ก.ย. 2569`). People can type `18/09/2569`, `18/09/2026`, `2026-09-18` or `18 ก.ย. 2569`. Store ISO, never พ.ศ. `formatDate(iso, { format: 'long' })` → `18 กันยายน 2569`.

## Server rendering

Portals (Dialog, Drawer, menus, pickers, toasts) wait until after hydration; `useBreakpoint()` returns `lg` on the server and corrects on the client through `useSyncExternalStore`, so there are no hydration mismatches. `npm run test:ssr` renders every component with `react-dom/server` (ESM and CJS builds).

## Scripts

```bash
npm run build        # dist/ (ESM, CJS, IIFE, CSS, types)
npm run test:ssr     # server-render every component
npm run typecheck    # compile types-test/usage.tsx against index.d.ts
npm run test:pilots   # builds the pilots + 4 brand themes, then 37 behaviour/axe checks at 1440/820/390px (Playwright for Python, axe-core)
```

## Pilots

`examples/settings/` (form-heavy, English, react-hook-form) and `examples/landing/` (Creative, re-branded live) join `examples/orders/`, a real admin page (orders for any business) built only from these components — AppShell, filters, DataTable with row actions, detail Drawer, New Order Dialog, confirmations, toasts. Build them with `npm run examples`, then open `examples/<name>/dist/index.html`. It is the reference for responsive behaviour at 390px, 820px and 1440px.
