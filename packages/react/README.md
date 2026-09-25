# @jirawatpyk/aura-react

AURA Design System components as a real React package — ES modules, TypeScript types, server-rendering safe, Thai-first.

**See every component live: [Storybook](https://jirawatpyk.github.io/Aura-design/)**

## Try it without a build (CDN)

One HTML file, no install — the packages are on npmjs, so jsDelivr serves them:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@jirawatpyk/aura-tokens@4/aura.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@jirawatpyk/aura-react@4/dist/styles.css" />
<script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@jirawatpyk/aura-react@4/dist/aura.bundle.js"></script>

<div id="root"></div>
<script>
  const h = React.createElement;
  ReactDOM.createRoot(document.getElementById('root')).render(
    h(
      Aura.AuraProvider,
      { locale: 'th' },
      h(
        Aura.Stack,
        { gap: 4 },
        h(Aura.Button, { icon: 'plus' }, 'New order'),
        h(Aura.DatePicker, { label: 'Delivery date' }),
      ),
    ),
  );
</script>
```

## Install

```bash
npm i @jirawatpyk/aura-react @jirawatpyk/aura-tokens   # React 18 or 19; import from "@jirawatpyk/aura-react"
# or under the short names the docs use (imports stay `@aura/...`):
npm i @aura/react@npm:@jirawatpyk/aura-react @aura/tokens@npm:@jirawatpyk/aura-tokens
```

React 18.3 and 19 are both tested: the dev dependencies pin 18, and CI switches the whole workspace to 19 (`node scripts/use-react.mjs 19 && npm install`) and runs every suite again — contrast, token lint, SSR, types, build, hydration with 0 warnings, layout before hydration, the three pilot pages and Storybook (axe + behaviour).

Public on npmjs; internal projects can use GitHub Packages instead ([repository README](https://github.com/Jirawatpyk/Aura-design#use-it-in-a-project)).

```tsx
// app root (once)
import '@aura/tokens/aura.css'; // tokens (light + dark)
import '@aura/react/styles.css'; // component styles
// fonts: '@jirawatpyk/aura-tokens/aura-fonts.local.css' (self-hosted, CSP font-src 'self'), next/font, or Google Fonts — see the tokens README

import { AuraProvider, AppShell, SideNav, DataTable, DatePicker } from '@aura/react';

export default function Root() {
  return (
    <AuraProvider locale="th">
      {' '}
      {/* Thai built-in labels; dates are พ.ศ. by default */}
      <App />
    </AuraProvider>
  );
}
```

## What's inside

| Output                | For                                                                                                                                                                                                        |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dist/esm/*.js`       | Bundlers (Vite, Next.js, webpack). One file per module with `'use client'`, so Next.js App Router can import it from Server Components. `sideEffects` is limited to CSS, so unused components are dropped. |
| `dist/cjs/index.cjs`  | `require()` / Jest.                                                                                                                                                                                        |
| `dist/aura.bundle.js` | A classic `<script>` that sets `window.Aura` (needs `window.React` / `window.ReactDOM`). The design-system artifact uses this file.                                                                        |
| `dist/styles.css`     | Component CSS (no font import).                                                                                                                                                                            |
| `dist/index.d.ts`     | Types for every component and helper, generated from the TypeScript sources (one file).                                                                                                                    |

## Components (59)

Actions: Button (`ghost`, `size="sm"`), IconButton, Menu, DropdownMenu (link, danger and radio items), ActionBar, Tag · Forms: TextField, PasswordField, Textarea, NumberField, Select, RadioGroup, Checkbox, Switch, SegmentedControl, Combobox (one value, or `multiple`), FileUpload (+ `formatBytes`) · Dates & times: DatePicker, DateRangePicker, Calendar, TimePicker (+ `useFormatDate`, `formatDate`, `parseDate`, `parseTime`) · Feedback: Alert, FormErrorSummary, Toaster/`toast()` (+ `.success/.error/.warning/.info/.loading`), Tooltip, StatusPill, Badge, Progress, Skeleton, EmptyState · Overlays: Dialog, Drawer, Popover · Data: DataTable, Table (+ THead, TBody, TFoot, Tr, Th, Td — static tables), FilterBar, Stat · Navigation: Command (⌘K palette), BottomNav · Layout: AppShell, Container, Stack, Grid, Separator, Accordion, Pagination, Card, Tabs, Stepper, SideNav, Breadcrumb, Avatar, Surface, Icon · Theme: ColorSchemeToggle, ColorSchemeScript, `useColorScheme`, ThemeStyle/`createTheme` · Hooks: `useBreakpoint`, `useResponsive`, `breakpoints`, `useAuraLocale`, `useDensity`.

## Router links, Swedish, motion

Next.js App Router: `next/link` is a function, and a Server Component (your layout) can't pass functions to a client component. Put the provider in a small `'use client'` file:

```tsx
// app/providers.tsx
'use client';
import Link from 'next/link';
import { AuraProvider } from '@jirawatpyk/aura-react';
export function Providers({ children, locale }: { children: React.ReactNode; locale: 'th' | 'en' | 'sv' }) {
  return (
    <AuraProvider locale={locale} linkComponent={Link}>
      {children}
    </AuraProvider>
  );
  {
    /* th | en | sv */
  }
}
// app/layout.tsx (a Server Component): <body><Providers locale="th">{children}</Providers></body>
```

`linkComponent` is used by Button `href`, Breadcrumb, Tabs and Menu items with `href`, BottomNav, Pagination `getHref` (page numbers and, since 4.17, the previous / next arrows), Stat `href`, SideNav and DataTable row/pager links. Each of them also takes its own `linkComponent`, which wins over the provider's. Pass `getHref` from a client component (it's a function too). The Next.js starter does all of this, and CI clicks every AURA link in it to check none triggers a full page load. Only `th` shows Buddhist-era years; `en` and `sv` are Gregorian (`sv` weeks start Monday). **Without a provider, components are English with Gregorian dates** — wrap Thai apps in `<AuraProvider locale="th">`. For dates in your own components use `useFormatDate()` — it follows the provider (`const fmt = useFormatDate(); fmt(iso, { format: 'long' })`). Plain `formatDate()` from the package root has no provider to read and stays Thai unless you pass `locale` (until 5.0); the one in `@jirawatpyk/aura-react/server` defaults to English and Gregorian. Values are always Gregorian ISO dates.

## Compact density

```tsx
<AuraProvider density="compact">…</AuraProvider>   {/* whole app or one section */}
<DataTable density="compact" … />                   {/* just one table */}
```

Compact makes fields and buttons 36px (from 44px), table rows 40px (from 48px) and tightens button padding. Dialogs, drawers, popovers and the ⌘K palette opened inside the provider follow it. On touch screens (`pointer: coarse`) compact keeps 44px targets and 48px rows. Read it with `useDensity()`. Without CSS-in-JS you can set `data-density="compact"` on any element — the CSS variables `--aura-input-height`, `--aura-button-height`, `--aura-table-row-height` and `--aura-button-padding-x` do the rest; virtual DataTables read the row height from CSS.

Motion: skeleton pulses and indeterminate bars honour `prefers-reduced-motion: reduce` — skeletons stop (a static bar), spinners and progress bars slow to a third.

## Collapsible sidebar

```tsx
const [collapsed, setCollapsed] = useState(initialFromCookie); // keep the choice across reloads
<AppShell nav={<SideNav collapsible collapsed={collapsed} onCollapsedChange={setCollapsed} items={items} />}>
  …
</AppShell>;
```

`collapsed` turns SideNav into a 64px icon-only rail (`--aura-sidenav-rail-width`). Labels become tooltips and stay the accessible names; counts and badges show as a dot; items without an icon show their first letter; clicking a group widens the rail and opens it. `collapsible` adds the collapse / expand button at the bottom. Uncontrolled: `defaultCollapsed`. Pass a short header while collapsed (a logo mark instead of the name). In AppShell's phone drawer the nav is always full width with no toggle.

## Toasts, forms, filters, rich text, ⌘K

```tsx
const id = toast.loading('Saving');          // spinner, stays
toast.success('Saved', { id });              // same id: replaced in place, never stacked
toast.error('Could not save');               // danger = role="alert"; the rest role="status"

<FormErrorSummary errors={formState.errors} focusKey={formState.submitCount} onSelect={setFocus} />
<PasswordField label="Password" {...register('password')} />
<FilterBar search={q} onSearchChange={setQ} filters={chips} onClearAll={clear} resultCount={total}>…</FilterBar>
<div className="aura-prose" dangerouslySetInnerHTML={{ __html: sanitised }} />   {/* p, h1–h4, lists, blockquote, hr, a, strong, em, u */}
<Command open={open} onOpenChange={setOpen} items={commands} />                    {/* ⌘K / Ctrl+K toggles it */}
```

Server search in the palette (4.17): control the query and hand over what the server found. The active item is kept by id while results change, and `loading` announces "Searching…" and then the count.

```tsx
<Command
  open={open}
  onOpenChange={setOpen}
  query={q}
  onQueryChange={setQ} // fetch results for q (debounced)
  items={results}
  filter={false}
  loading={isFetching}
  empty={
    <Button size="sm" icon="plus">
      Create member
    </Button>
  }
/>
```

DataTable with sort and page in the URL (4.17): `onStateChange={({ sort, page }) => router.push(…)}` reports a sort click once, as `{ sort, page: 1 }`, instead of `onSortChange` and then `onPageChange(1)`. That's one history entry and one server render.

## Phone bars, totals, link tabs, time zones (4.19)

```tsx
<AppShell nav={<SideNav … />} bottomNav={<BottomNav value={tab} items={[{ id: 'home', label: 'Home', icon: 'house', href: '/' }, …]} />}>
  <form>
    …fields…
    <ActionBar status={dirty ? 'Unsaved changes' : 'Total 107,000.00 THB · due Oct 22, 2026'}>   {/* last child of the form */}
      <Button>Save</Button>
    </ActionBar>
  </form>
</AppShell>

<ActionBar selected={ids.length} onClearSelection={clear}><Button size="sm">Send reminder</Button></ActionBar>
<DataTable … footer={{ id: 'Total', vat: '9,779.00', total: '149,479.00' }} stickyFooter height={480} />
<Tabs label="Renewals" value="review" tabs={[{ id: 'pipeline', label: 'Pipeline', href: '/renewals' }, …]} />
<DropdownMenu items={[{ label: 'Open', href: '/m/1' }, { label: 'Grid', type: 'radio', group: 'View', checked }, { label: 'Void', tone: 'danger' }]} … />
<DatePicker label="Payment date" max="today" />   {/* with <AuraProvider timeZone="Asia/Bangkok"> */}
```

- **ActionBar** is `position: sticky`, so it stays in the flow and never covers the last field; it sticks while its parent (the form or card) is on screen. `viewport` (default) floats above the home indicator and above a BottomNav; `container` sits flush at the bottom of a card. The status line is a live region. With `selected`, it reads "N selected", adds Clear, and hides at 0 (focus goes back to where it came from).
- **BottomNav**: up to five icon + label tabs, 44px+ targets at 320px, `aria-current="page"`, counts and dots. Hidden from `lg` up in CSS (`hideFrom`), with a spacer in the flow, so the server's HTML is right and nothing shifts on hydration. For the notch and home indicator add `viewport-fit=cover` to your viewport meta.
- **DataTable `footer`**: a totals row with the body's widths and alignment (a Totals card when stacked); `stickyFooter` keeps it in view in a `height` table. Truncated cells show their full text on hover and keyboard focus.
- **Tabs with `href`** on every item render a `nav` of links (no panels), the current one `aria-current="page"`.
- **Menu items**: `href` (through `linkComponent`), `tone: 'danger'`, and `type: 'radio'` with `group` / `checked` (menuitemradio in a labelled group).
- **Time zone**: `timeZone` on AuraProvider, DatePicker, DateRangePicker and Calendar decides "today" (the marker, `min`/`max="today"`, the first month shown); or pass `today` as an ISO date. `todayIn('Asia/Bangkok')` is exported from the root and `/server`.
- **Toasts** queue past three instead of dropping: six in a row all show, in order, three at a time.

## Static tables, separators, tooltips, phone tables before hydration (4.20)

```tsx
<Table caption="Invoice INV-2026-0141 — line items">
  <THead><Tr><Th>DESCRIPTION</Th><Th numeric>AMOUNT (THB)</Th></Tr></THead>
  <TBody><Tr><Td><div lang="th">ค่าบำรุงสมาชิกรายปี</div><div>Annual membership fee</div></Td><Td numeric>85,000.00</Td></Tr></TBody>
  <TFoot><Tr><Th scope="row">Total</Th><Td numeric>107,000.00</Td></Tr></TFoot>
</Table>
<Separator />                              {/* decorative; decorative={false} → role="separator" */}
<Tooltip content="Download PDF" side="left">…</Tooltip>
```

- **Table** is plain `<table>` markup with DataTable's look: mono header band, hairlines, wrapping text, `numeric` cells right-aligned in tabular figures, a `TFoot` for totals. No sorting, paging or virtual rows — use DataTable for data. If it has to scroll sideways on a phone, its box becomes a focusable region named by the caption.
- **Tooltip** `side` also takes `left` and `right`; every side flips when clipped and stays inside the window.
- **DataTable on phones before hydration**: `stackBelow` cards and `hideBelow` columns are decided in CSS from the first paint, at any width (up to three distinct `hideBelow` widths per table), and each row is in the HTML once — the cards are the grid's own rows, laid out by a container query. The table sits in a few wrapper `div`s for this; `className` and `ref` go on the outermost. The `.aura-table__card*` classes are gone.
- **`formatDate()` from the package root** warns once in development when called without a `locale`: in 5.0 it becomes English and Gregorian like `/server`. Pass `{ locale: 'th' }` or use `useFormatDate()`.

## Phones and touch

Under 640px every text control uses 16px text (iOS Safari doesn't zoom). On touch screens (`pointer: coarse`) IconButton and `<Button size="sm">` keep their 32px look with a 44px hit area, and Radio, Checkbox and Switch rows are at least 44px with the whole row as the target. Since 4.17 so are menu items, page numbers, segments and calendar days (44px); Combobox and DatePicker toggles and the Tag remove button get 44px hit areas. A Dialog sheet on a phone is capped at `92dvh`, so the browser toolbar never hides its footer. `<Button fullWidth>` fills its row and wraps long Thai or Swedish labels.

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

Layout is right before hydration (4.16). AppShell's sidebar-or-drawer switch is CSS (a 1024px media query), so a phone gets the menu button from the server's HTML. A DataTable with `stackBelow` renders cards and grid together until it has measured itself, and a container query shows the right one. It supports `stackBelow` 360, 400, 480, 520, 560, 600, 640, 720, 768, 800, 900, 960 and 1024; other widths stack once JavaScript runs. `npm run test:layout` loads both at 390 and 1280px with JavaScript off, then hydrated, and requires CLS 0. Columns with `hideBelow` still settle after hydration.

## Next to another Tailwind theme (shadcn), page by page

`styles.css` is unlayered, so it beats utilities. For a migration next to an existing theme, use the layered stylesheet and the prefixed Tailwind theme (4.17):

```css
@layer aura-tokens, theme, base, aura, components, utilities;
@import 'tailwindcss';
@import '@jirawatpyk/aura-tokens/aura.css' layer(aura-tokens); /* your theme wins for --font-sans / --font-mono */
@import '@jirawatpyk/aura-tokens/tailwind.prefixed.css'; /* bg-aura-bg-surface, font-aura-sans … no @custom-variant */
@import '@jirawatpyk/aura-react/styles.layer.css'; /* components in @layer aura: a utility className wins */
```

Nothing an existing page uses is redefined: `npm run check:tailwind4` compiles a shadcn-style page alone and next to this setup, with AURA imported first and last. It checks that the computed styles are identical, and that `rounded-none` overrides `.aura-btn` with no `!important`. While both run, AURA components use your `--font-sans` / `--font-mono`; set them to AURA's stacks in your token bridge when a page moves over.

## Server Components

Everything in the package root is a client module (`'use client'`), so a Server Component can render AURA components but can't call AURA functions. The pure helpers have their own entry with no `'use client'` and no React (4.17):

```tsx
// app/invoices/[id]/page.tsx — a Server Component
import { formatDate, createTheme, statusTone, STRINGS } from '@jirawatpyk/aura-react/server';
formatDate('2026-09-24'); // "24 Sept 2026" — English and Gregorian by default
formatDate('2026-09-24', { locale: 'th' }); // "24 ก.ย. 2569"
```

It exports `formatDate`, `parseDate`, `toISO`, `fromISO`, `parseTime`, `formatBytes`, `statusTone`, `STRINGS`, `createTheme`, `contrast`, `brandScale`, `colorSchemeScript` and `breakpoints`. `npm run test:ssr` loads it under Node's `react-server` condition, and the Next.js starter formats a date with it in a Server Component.

## TypeScript

Every optional prop takes `undefined` (4.16), so apps on `exactOptionalPropertyTypes` can write `hint={t.hint}` or `icon={x ?? undefined}`. `types-test/exact-optional.tsx` checks every exported component against the published declarations under `strict`, `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess`.

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
