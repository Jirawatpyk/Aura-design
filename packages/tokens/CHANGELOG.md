# @jirawatpyk/aura-tokens

Earlier releases (1.0 – 4.5.1), with more detail: [CHANGELOG.md](../../CHANGELOG.md) at the repository root.

## 4.17.0

### Minor Changes

- ecd33dd: Chamber-OS Addendum 2, Group B (items 30–35).
  
  - **Touch** (item 30): on touch screens, menu items, page numbers, segments and calendar days are 44px, and Combobox / DatePicker toggles and the Tag remove button get 44px hit areas. A Dialog sheet on a phone is capped at `92dvh`, so the browser toolbar can't hide its footer.
  - **`linkComponent` everywhere** (item 31): Breadcrumb, Pagination and Stat take their own `linkComponent`, and Pagination's previous / next arrows are router links when `getHref` is set. The README shows the Next.js `'use client'` providers file. The Next.js starter routes every AURA link through `next/link`, and CI clicks each one to check there's no full page load. CHANGELOG entry for 4.10 corrected.
  - **`@jirawatpyk/aura-react/server`** (item 32): the pure helpers with no `'use client'` and no React, for Server Components. They are `formatDate` (English and Gregorian by default), `parseDate`, `toISO`, `fromISO`, `parseTime`, `formatBytes`, `statusTone`, `STRINGS`, `createTheme`, `contrast`, `brandScale`, `colorSchemeScript` and `breakpoints`. The package root's `formatDate()` keeps its Thai default until 5.0.
  - **Command server search** (item 33): `query` / `onQueryChange` (controlled), `filter={false}`, `loading` (a "Searching…" row, `aria-busy`, the result count announced) and an `empty` slot. The active item is kept by id while results change.
  - **DataTable `onStateChange`** (item 34): `{ sort, page }` in one callback; a sort click reports `{ sort, page: 1 }` once. New tests for `stackBelow` and `hideBelow` in server mode.
  - **CSS next to another Tailwind theme** (item 35): `@jirawatpyk/aura-react/styles.layer.css` (components in `@layer aura`, so utilities win) and `@jirawatpyk/aura-tokens/tailwind.prefixed.css` (every name `aura-` prefixed, no `@custom-variant`). CI checks that a shadcn-style page computes the same styles with AURA added first or last.

## 4.16.0

### Minor Changes

- da0ab58: Chamber-OS Addendum 2, Group A (items 25–29).
  
  - **Optional props take `undefined`** (item 25): every optional prop is typed `prop?: T | undefined`, so apps on `exactOptionalPropertyTypes` can pass `hint={t.hint}` or `icon={x ?? undefined}`. A type test checks every exported component under `strict` + `exactOptionalPropertyTypes` + `noUncheckedIndexedAccess`.
  - **Layout is right before hydration** (item 26): AppShell switches sidebar and drawer in CSS (1024px media query), and a DataTable with `stackBelow` renders cards and grid until it has measured itself, with container queries showing the right one. A phone gets the mobile layout from the server's HTML; the new `test:layout` requires CLS 0 at 390 and 1280px.
  - **Self-hosted fonts** (item 27): `@jirawatpyk/aura-tokens/aura-fonts.local.css` loads Fraunces, Inter, JetBrains Mono and Noto Sans Thai from woff2 files in the package (OFL-1.1), for a `font-src 'self'` CSP. The README shows the `next/font` setup. The Next.js starter now uses the self-hosted fonts.
  - **Button `variant="ghost"` and `size="sm"`** (item 28): ghost has no fill or edge until hover; `sm` is 32px (`--aura-button-height-sm`) with a 44px hit area on touch screens, and keeps a compact table row at 40px.
  - **React 19** (item 29): CI already runs every suite on React 18.3 and 19; the package README now says so.

## 4.15.0

### Minor Changes

- 418163a: SideNav collapsed rail. `collapsed` / `defaultCollapsed` / `onCollapsedChange` make SideNav a 64px icon-only rail (new `--aura-sidenav-rail-width` token): labels show as tooltips and stay the accessible names, counts and badges become a dot, items without an icon show their first letter, and a group clicked in the rail widens it and opens. `collapsible` adds a collapse / expand button (labels in th / en / sv). AppShell's phone drawer always shows the full nav. New icons `panel-left-close` and `panel-left-open`.

## 4.14.0

### Minor Changes

- 5ab90de: Compact density. `<AuraProvider density="compact">` (or `data-density="compact"` on any element) makes fields and buttons 36px, table rows 40px and button padding tighter; dialogs, drawers, popovers and Command follow the provider. Touch screens keep 44px targets. `DataTable` takes `density` on its own, and virtual tables read the row height from the new `--aura-table-row-height` token. New `useDensity()` hook. Fix: table rows now measure exactly 48px (they were 49px with the border), matching the virtual row height.

## 4.13.0

### Minor Changes

- f58907d: Chamber-OS group B (items 8, 10–13):
  
  - **Toasts**: `toast.success | error | warning | info(title, opts?)` and `toast.loading(title, opts?)`, which spins and stays until the same `id` is shown again with a result. A repeated `id` now replaces the toast in place (same position, timer restarts) instead of moving it. Danger stays `role="alert"`, the rest `role="status"`.
  - **PasswordField**: a TextField with a show/hide button (`aria-pressed`, one name); `ref` reaches the input for react-hook-form.
  - **FormErrorSummary**: the GOV.UK pattern — a danger panel listing each error as a link to its field. Takes react-hook-form's `formState.errors` as is, takes focus when errors appear and on each submit (`focusKey`), and `onSelect` can be `setFocus`.
  - **FilterBar**: search (debounced, sent at once on Enter), your filter controls, applied-filter chips, Clear all, a result count and actions; wraps below `md`. Built to keep its state in the URL with a server-mode DataTable.
  - **`aura-prose`**: a class that styles sanitised rich text (p, h1–h4, lists, blockquote, hr, a, strong, em, u) with AURA type, spacing and link colours in both themes.
  - **Command**: a ⌘K / Ctrl+K command palette with no new dependency — WAI-ARIA combobox over a grouped listbox, Thai-aware filtering with keywords, disabled items skipped, shortcuts shown, opens above a Dialog.
  
  New strings (th, en, sv): show password, error summary title, filters, search, clear all, result count, command menu.

## 4.12.0

### Minor Changes

- 0ee554c: `useFormatDate()`: `formatDate` bound to the nearest `AuraProvider` — its locale and calendar (English and Gregorian without one); options you pass still win. Use it for dates in tables and summaries so they switch with the page language instead of staying Thai: `const fmt = useFormatDate(); fmt(iso, { format: 'long' })`. Plain `formatDate()` is unchanged. The Next.js starter's orders table uses the hook.

## 4.11.0

### Minor Changes

- 03d5b5e: Chamber-OS addendum (items 18–24):
  
  - **Phones**: under 640px every text control (TextField, Textarea, Select, Combobox, DatePicker, TimePicker, NumberField) uses at least 16px text, so iOS Safari no longer zooms on focus. New token `--aura-input-font-size` (14px).
  - **Touch targets** (`pointer: coarse`): IconButton keeps its 32px look with a 44px hit area; Radio, Checkbox and Switch rows are at least 44px, and tapping anywhere on a Switch row toggles it. New token `--aura-touch-target` (44px).
  - **`Button fullWidth`**: fills its row and wraps a long label (at least 44px tall) instead of overflowing.
  - **Dark status pills**: progress and ready get quiet dark fills (violet / lime tinted, 7.6:1 and 9.9:1), like neutral in 4.10; `createTheme` builds the dark progress pair from the brand.
  - **Progress tracks**: `--aura-progress-track` and a 1px `--aura-progress-track-edge` at ≥3:1 on surface and canvas in both themes (Progress and FileUpload bars). Contrast check: 198 pairs.
  - **Dates without a provider are English and Gregorian.** DatePicker, DateRangePicker and Calendar used to fall back to Thai with Buddhist-era years; now the fallback is `en` with Gregorian years, and only `locale="th"` shows พ.ศ. (`en` no longer defaults to Buddhist). Values stay Gregorian ISO dates. **Thai apps without `<AuraProvider locale="th">` will see English dates — wrap the app, or pass `locale="th"`.** `formatDate()` has no provider to read and stays Thai unless given a locale.

## 4.10.0

### Minor Changes

- 32cd15a: Chamber-OS group A (4.10):
  
  - **Swedish**: `AuraProvider locale="sv"` — every built-in label in Swedish, `sv-SE` dates, Gregorian calendar and Monday first. `th` and `en` keep their defaults.
  - **Router links**: `AuraProvider linkComponent={Link}` (e.g. `next/link`) is used by Button `href`, Breadcrumb, Pagination `getHref`, Stat `href`, SideNav, and DataTable row and pager links. Each also takes its own `linkComponent`.
  - **Your own icons**: every `icon` prop (and `Icon name`) accepts an element such as `<Building />` from lucide-react; AURA sizes it and hides it from screen readers.
  - **DataTable server mode**: `manual`, `totalRows`, controlled `page`/`sort` without client sorting or slicing, `loading` keeps the current rows (dimmed, under a progress bar) while the next page loads, `getRowHref` (the whole row follows the link, Ctrl/⌘-click opens a tab), `getPageHref` (pager arrows as links), and column `align: 'end'` for amounts.
  - **SideNav groups**: items with `children` become collapsible groups that open around the active page and stay open, with arrow-key navigation; `badge` takes a number or any node.
  - **Tailwind v4**: `@jirawatpyk/aura-tokens/tailwind.css` (`aura-tailwind.css`, generated) gives the v3 preset's class names through `@theme inline`; `dark:` follows `.dark` / `data-theme="dark"`. CI compiles it with Tailwind v4.
  - **Chart tokens**: `--aura-chart-1…8` (categorical), `--aura-chart-seq-1…5`, `--aura-chart-grid`, `--aura-chart-axis` in both themes. Every mark is ≥3:1 on the surface, neighbours alternate lightness; `createTheme` moves chart-1 and the ramp to the brand. The contrast check covers them (186 pairs).
  - **Destructive actions**: Button `variant="danger"` and `"danger-secondary"`, IconButton `tone="danger"`.
  - `ColorSchemeScript nonce` for nonce-based CSPs.
  
  Fixes: Stat values that are words ("1 benefit under-used") no longer use tabular figures (wide hyphens); the dark-theme neutral StatusPill is a quiet zinc-800 fill instead of the brightest pill in the row; skeleton bars are zinc-200 / zinc-700 with a 0.6 pulse floor so they are visible on both surfaces, and the docs now say what the CSS does (no pulse under reduced motion).

## 4.9.0

### Minor Changes

- 19929e9: Four additions for everyday admin and booking screens:
  
  - **`Combobox multiple`** — pick any number; picks show as removable chips, the list stays open between picks, Backspace removes the last, `max` caps the count, `name` posts one hidden input per value. `value`/`onChange` are `string[]` (typed separately from the single mode, which is unchanged).
  - **`NumberField`** — an ARIA spinbutton with thousands separators, `prefix`/`suffix` (`฿`, `%`, `ชิ้น`), `min`/`max`/`step`/`decimals`, ↑/↓ and PageUp/PageDown, +/− buttons that stop at the bounds; clamps and formats when you leave it. Works with react-hook-form `Controller`.
  - **`Stepper`** — progress through a multi-step flow; the current step has `aria-current="step"`, completed steps can link back (`onStepClick`), horizontal or vertical; on phones a horizontal stepper shows markers plus "Step 2 of 4".
  - **`SegmentedControl`** — 2–5 exclusive choices that apply at once (view, period); a radio group with one Tab stop and arrow keys, icons or icon-only, `sm`, `fullWidth`.
  
  All four are on the pilots (Orders: category multi-filter, delivery-scope control, amount field; Settings: setup stepper, working hours via Controller), pass axe in both themes and have behaviour tests. New labels in EN/TH: increase/decrease, step x of y, completed. Size budgets raised on purpose for the new code (whole library 33.8 → 36.0 kB gzip; single imports unchanged).

## 4.8.0

No changes in this release.

## 4.7.2

No changes in this release.

## 4.7.1

### Patch Changes

- 03debe7: Secondary button edge is visible now: new token `aura-button-secondary-border` (zinc-450 light, zinc-500 dark; ≥3:1 on surface and canvas in both themes, added to the contrast check) replaces the ~1.3:1 `aura-border-default` hairline on `variant="secondary"` buttons and Button links. Same look, a firmer outline — the known gap from 4.1 is closed.

## 4.7.0

### Minor Changes

- 8e5b0fe: `Button` with `href` renders a link that looks the same (`<a>`; the ref is the `<a>`), for navigation. Anchor props (`target`, `rel`, `download`…) are typed; `disabled` removes the href, sets `aria-disabled` and takes it out of the Tab order; `linkComponent` renders your router's link instead, e.g. `<Button href="/orders" linkComponent={Link}>` with `next/link`. Without `href` nothing changes — `React.ComponentProps<typeof Button>` still gives the button props. New type `ButtonLinkProps`.

## 4.6.1

### Patch Changes

- e7786be: Motion only from tokens: Button's transition used a hard-coded `cubic-bezier` and `transition: all`; it now animates only colour, border, shadow, transform and opacity with `--aura-duration-fast` / `--aura-ease`. The indeterminate Progress uses `--aura-duration-pulse` (same 1.4s). Token lint now also fails on raw durations and easings in CSS transitions and animations. The three pilots have a colour-scheme toggle, and their tests check Dark, reload (no flash) and System in axe.

## 4.6.0

### Minor Changes

- Light / dark / system colour scheme: `ColorSchemeToggle`, `ColorSchemeScript`, `useColorScheme`, `data-theme="system"` in the tokens and in `createTheme` CSS, and the `sun` / `moon` / `monitor` icons.
