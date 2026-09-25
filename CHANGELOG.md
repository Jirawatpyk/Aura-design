# Changelog

## 4.18.0 — 2026-09-25

### Minor changes

- 04cb779: Chamber-OS Addendum 3, Group C (items 36–40).
  
  - **No `!important` in `@layer aura`** (item 36): the Combobox check colour and the phone sheet's width now win by specificity, so a utility can override both. The build fails if the component CSS gains an `!important`, and the Tailwind v4 check overrides both with a utility.
  - **CHANGELOGs agree** (item 37): the 4.10 `linkComponent` correction is in the root and tokens CHANGELOGs too.
  - **Tokens README leads with self-hosted fonts** (item 38): the quick-start imports `aura-fonts.local.css`; `next/font` and Google Fonts are labelled alternatives.
  - **Command passes axe when open** (item 39): with no results there is no empty listbox. The loading row and empty state sit beside it, and the live region says "No matches". The Storybook suite now scans the open palette with 0, 1 and many results in both themes.
  - **Starter link test** (item 40): also clicks a SideNav item and a DataTable row (the row link and another cell); both navigate through `next/link`.

## 4.17.0 — 2026-09-24

### Minor changes

- ecd33dd: Chamber-OS Addendum 2, Group B (items 30–35).
  
  - **Touch** (item 30): on touch screens, menu items, page numbers, segments and calendar days are 44px, and Combobox / DatePicker toggles and the Tag remove button get 44px hit areas. A Dialog sheet on a phone is capped at `92dvh`, so the browser toolbar can't hide its footer.
  - **`linkComponent` everywhere** (item 31): Breadcrumb, Pagination and Stat take their own `linkComponent`, and Pagination's previous / next arrows are router links when `getHref` is set. The README shows the Next.js `'use client'` providers file. The Next.js starter routes every AURA link through `next/link`, and CI clicks each one to check there's no full page load. CHANGELOG entry for 4.10 corrected.
  - **`@jirawatpyk/aura-react/server`** (item 32): the pure helpers with no `'use client'` and no React, for Server Components. They are `formatDate` (English and Gregorian by default), `parseDate`, `toISO`, `fromISO`, `parseTime`, `formatBytes`, `statusTone`, `STRINGS`, `createTheme`, `contrast`, `brandScale`, `colorSchemeScript` and `breakpoints`. The package root's `formatDate()` keeps its Thai default until 5.0.
  - **Command server search** (item 33): `query` / `onQueryChange` (controlled), `filter={false}`, `loading` (a "Searching…" row, `aria-busy`, the result count announced) and an `empty` slot. The active item is kept by id while results change.
  - **DataTable `onStateChange`** (item 34): `{ sort, page }` in one callback; a sort click reports `{ sort, page: 1 }` once. New tests for `stackBelow` and `hideBelow` in server mode.
  - **CSS next to another Tailwind theme** (item 35): `@jirawatpyk/aura-react/styles.layer.css` (components in `@layer aura`, so utilities win) and `@jirawatpyk/aura-tokens/tailwind.prefixed.css` (every name `aura-` prefixed, no `@custom-variant`). CI checks that a shadcn-style page computes the same styles with AURA added first or last.

## 4.16.0 — 2026-09-24

### Minor changes

- da0ab58: Chamber-OS Addendum 2, Group A (items 25–29).
  
  - **Optional props take `undefined`** (item 25): every optional prop is typed `prop?: T | undefined`, so apps on `exactOptionalPropertyTypes` can pass `hint={t.hint}` or `icon={x ?? undefined}`. A type test checks every exported component under `strict` + `exactOptionalPropertyTypes` + `noUncheckedIndexedAccess`.
  - **Layout is right before hydration** (item 26): AppShell switches sidebar and drawer in CSS (1024px media query), and a DataTable with `stackBelow` renders cards and grid until it has measured itself, with container queries showing the right one. A phone gets the mobile layout from the server's HTML; the new `test:layout` requires CLS 0 at 390 and 1280px.
  - **Self-hosted fonts** (item 27): `@jirawatpyk/aura-tokens/aura-fonts.local.css` loads Fraunces, Inter, JetBrains Mono and Noto Sans Thai from woff2 files in the package (OFL-1.1), for a `font-src 'self'` CSP. The README shows the `next/font` setup. The Next.js starter now uses the self-hosted fonts.
  - **Button `variant="ghost"` and `size="sm"`** (item 28): ghost has no fill or edge until hover; `sm` is 32px (`--aura-button-height-sm`) with a 44px hit area on touch screens, and keeps a compact table row at 40px.
  - **React 19** (item 29): CI already runs every suite on React 18.3 and 19; the package README now says so.

## 4.15.0 — 2026-09-24

### Minor changes

- 418163a: SideNav collapsed rail. `collapsed` / `defaultCollapsed` / `onCollapsedChange` make SideNav a 64px icon-only rail (new `--aura-sidenav-rail-width` token): labels show as tooltips and stay the accessible names, counts and badges become a dot, items without an icon show their first letter, and a group clicked in the rail widens it and opens. `collapsible` adds a collapse / expand button (labels in th / en / sv). AppShell's phone drawer always shows the full nav. New icons `panel-left-close` and `panel-left-open`.

## 4.14.0 — 2026-09-24

### Minor changes

- 5ab90de: Compact density. `<AuraProvider density="compact">` (or `data-density="compact"` on any element) makes fields and buttons 36px, table rows 40px and button padding tighter; dialogs, drawers, popovers and Command follow the provider. Touch screens keep 44px targets. `DataTable` takes `density` on its own, and virtual tables read the row height from the new `--aura-table-row-height` token. New `useDensity()` hook. Fix: table rows now measure exactly 48px (they were 49px with the border), matching the virtual row height.

## 4.13.0 — 2026-09-24

### Minor changes

- f58907d: Chamber-OS group B (items 8, 10–13):
  
  - **Toasts**: `toast.success | error | warning | info(title, opts?)` and `toast.loading(title, opts?)`, which spins and stays until the same `id` is shown again with a result. A repeated `id` now replaces the toast in place (same position, timer restarts) instead of moving it. Danger stays `role="alert"`, the rest `role="status"`.
  - **PasswordField**: a TextField with a show/hide button (`aria-pressed`, one name); `ref` reaches the input for react-hook-form.
  - **FormErrorSummary**: the GOV.UK pattern — a danger panel listing each error as a link to its field. Takes react-hook-form's `formState.errors` as is, takes focus when errors appear and on each submit (`focusKey`), and `onSelect` can be `setFocus`.
  - **FilterBar**: search (debounced, sent at once on Enter), your filter controls, applied-filter chips, Clear all, a result count and actions; wraps below `md`. Built to keep its state in the URL with a server-mode DataTable.
  - **`aura-prose`**: a class that styles sanitised rich text (p, h1–h4, lists, blockquote, hr, a, strong, em, u) with AURA type, spacing and link colours in both themes.
  - **Command**: a ⌘K / Ctrl+K command palette with no new dependency — WAI-ARIA combobox over a grouped listbox, Thai-aware filtering with keywords, disabled items skipped, shortcuts shown, opens above a Dialog.
  
  New strings (th, en, sv): show password, error summary title, filters, search, clear all, result count, command menu.

## 4.12.0 — 2026-09-24

### Minor changes

- 0ee554c: `useFormatDate()`: `formatDate` bound to the nearest `AuraProvider` — its locale and calendar (English and Gregorian without one); options you pass still win. Use it for dates in tables and summaries so they switch with the page language instead of staying Thai: `const fmt = useFormatDate(); fmt(iso, { format: 'long' })`. Plain `formatDate()` is unchanged. The Next.js starter's orders table uses the hook.

## 4.11.0 — 2026-09-24

### Minor changes

- 03d5b5e: Chamber-OS addendum (items 18–24):
  
  - **Phones**: under 640px every text control (TextField, Textarea, Select, Combobox, DatePicker, TimePicker, NumberField) uses at least 16px text, so iOS Safari no longer zooms on focus. New token `--aura-input-font-size` (14px).
  - **Touch targets** (`pointer: coarse`): IconButton keeps its 32px look with a 44px hit area; Radio, Checkbox and Switch rows are at least 44px, and tapping anywhere on a Switch row toggles it. New token `--aura-touch-target` (44px).
  - **`Button fullWidth`**: fills its row and wraps a long label (at least 44px tall) instead of overflowing.
  - **Dark status pills**: progress and ready get quiet dark fills (violet / lime tinted, 7.6:1 and 9.9:1), like neutral in 4.10; `createTheme` builds the dark progress pair from the brand.
  - **Progress tracks**: `--aura-progress-track` and a 1px `--aura-progress-track-edge` at ≥3:1 on surface and canvas in both themes (Progress and FileUpload bars). Contrast check: 198 pairs.
  - **Dates without a provider are English and Gregorian.** DatePicker, DateRangePicker and Calendar used to fall back to Thai with Buddhist-era years; now the fallback is `en` with Gregorian years, and only `locale="th"` shows พ.ศ. (`en` no longer defaults to Buddhist). Values stay Gregorian ISO dates. **Thai apps without `<AuraProvider locale="th">` will see English dates — wrap the app, or pass `locale="th"`.** `formatDate()` has no provider to read and stays Thai unless given a locale.

## 4.10.0 — 2026-09-24

### Minor changes

- 32cd15a: Chamber-OS group A (4.10):
  
  - **Swedish**: `AuraProvider locale="sv"` — every built-in label in Swedish, `sv-SE` dates, Gregorian calendar and Monday first. `th` and `en` keep their defaults.
  - **Router links**: `AuraProvider linkComponent={Link}` (e.g. `next/link`) is used by Button `href`, Breadcrumb, Pagination `getHref`, Stat `href`, SideNav, and DataTable row and pager links. Button, SideNav and DataTable also take their own `linkComponent` (correction: Breadcrumb, Pagination and Stat read only the provider's until 4.17, and Pagination's previous / next stayed buttons).
  - **Your own icons**: every `icon` prop (and `Icon name`) accepts an element such as `<Building />` from lucide-react; AURA sizes it and hides it from screen readers.
  - **DataTable server mode**: `manual`, `totalRows`, controlled `page`/`sort` without client sorting or slicing, `loading` keeps the current rows (dimmed, under a progress bar) while the next page loads, `getRowHref` (the whole row follows the link, Ctrl/⌘-click opens a tab), `getPageHref` (pager arrows as links), and column `align: 'end'` for amounts.
  - **SideNav groups**: items with `children` become collapsible groups that open around the active page and stay open, with arrow-key navigation; `badge` takes a number or any node.
  - **Tailwind v4**: `@jirawatpyk/aura-tokens/tailwind.css` (`aura-tailwind.css`, generated) gives the v3 preset's class names through `@theme inline`; `dark:` follows `.dark` / `data-theme="dark"`. CI compiles it with Tailwind v4.
  - **Chart tokens**: `--aura-chart-1…8` (categorical), `--aura-chart-seq-1…5`, `--aura-chart-grid`, `--aura-chart-axis` in both themes. Every mark is ≥3:1 on the surface, neighbours alternate lightness; `createTheme` moves chart-1 and the ramp to the brand. The contrast check covers them (186 pairs).
  - **Destructive actions**: Button `variant="danger"` and `"danger-secondary"`, IconButton `tone="danger"`.
  - `ColorSchemeScript nonce` for nonce-based CSPs.
  
  Fixes: Stat values that are words ("1 benefit under-used") no longer use tabular figures (wide hyphens); the dark-theme neutral StatusPill is a quiet zinc-800 fill instead of the brightest pill in the row; skeleton bars are zinc-200 / zinc-700 with a 0.6 pulse floor so they are visible on both surfaces, and the docs now say what the CSS does (no pulse under reduced motion).

## 4.9.0 — 2026-09-24

### Minor changes

- 19929e9: Four additions for everyday admin and booking screens:
  
  - **`Combobox multiple`** — pick any number; picks show as removable chips, the list stays open between picks, Backspace removes the last, `max` caps the count, `name` posts one hidden input per value. `value`/`onChange` are `string[]` (typed separately from the single mode, which is unchanged).
  - **`NumberField`** — an ARIA spinbutton with thousands separators, `prefix`/`suffix` (`฿`, `%`, `ชิ้น`), `min`/`max`/`step`/`decimals`, ↑/↓ and PageUp/PageDown, +/− buttons that stop at the bounds; clamps and formats when you leave it. Works with react-hook-form `Controller`.
  - **`Stepper`** — progress through a multi-step flow; the current step has `aria-current="step"`, completed steps can link back (`onStepClick`), horizontal or vertical; on phones a horizontal stepper shows markers plus "Step 2 of 4".
  - **`SegmentedControl`** — 2–5 exclusive choices that apply at once (view, period); a radio group with one Tab stop and arrow keys, icons or icon-only, `sm`, `fullWidth`.
  
  All four are on the pilots (Orders: category multi-filter, delivery-scope control, amount field; Settings: setup stepper, working hours via Controller), pass axe in both themes and have behaviour tests. New labels in EN/TH: increase/decrease, step x of y, completed. Size budgets raised on purpose for the new code (whole library 33.8 → 36.0 kB gzip; single imports unchanged).

## 4.8.0 — 2026-09-22

### Minor changes

- 6313901: Smaller imports: the source is now one file per component. Five grouped files (`extra`, `forms`, `feedback`, `layout`, `layout2`) held 8, 6, 5, 5 and 7 components each, so importing one of them pulled in its file-mates. Measured, gzipped: Skeleton 8.3 → 0.5 kB, Card 6.3 → 0.5 kB, Stack 6.9 → 0.5 kB, Avatar 6.3 → 0.6 kB, Tooltip 6.0 → 0.9 kB, Badge 8.3 → 3.2 kB, TextField 6.1 → 5.4 kB, DatePicker 10.5 → 9.7 kB; the whole library is unchanged at ~34 kB. `Card only` and `Skeleton only` joined the size gate so this can't regress. Code moved, nothing else: all 49 fixtures server-render to byte-identical HTML and the published types are identical (only their order changed).

## 4.7.2 — 2026-09-22

### Patch changes

- c7a74e1: Test fix only, nothing changes in the packages: the pilots' colour-scheme check ran axe while the colour transitions were still running, so it could read a half-changed colour and fail (seen once as `.aura-nav__count`). It now waits for the transitions, like the brand-theme check does.

## 4.7.1 — 2026-09-22

### Patch changes

- 03debe7: Secondary button edge is visible now: new token `aura-button-secondary-border` (zinc-450 light, zinc-500 dark; ≥3:1 on surface and canvas in both themes, added to the contrast check) replaces the ~1.3:1 `aura-border-default` hairline on `variant="secondary"` buttons and Button links. Same look, a firmer outline — the known gap from 4.1 is closed.

## 4.7.0 — 2026-09-22

### Minor changes

- 8e5b0fe: `Button` with `href` renders a link that looks the same (`<a>`; the ref is the `<a>`), for navigation. Anchor props (`target`, `rel`, `download`…) are typed; `disabled` removes the href, sets `aria-disabled` and takes it out of the Tab order; `linkComponent` renders your router's link instead, e.g. `<Button href="/orders" linkComponent={Link}>` with `next/link`. Without `href` nothing changes — `React.ComponentProps<typeof Button>` still gives the button props. New type `ButtonLinkProps`.

## 4.6.1 — 2026-09-22

### Patch changes

- e7786be: Motion only from tokens: Button's transition used a hard-coded `cubic-bezier` and `transition: all`; it now animates only colour, border, shadow, transform and opacity with `--aura-duration-fast` / `--aura-ease`. The indeterminate Progress uses `--aura-duration-pulse` (same 1.4s). Token lint now also fails on raw durations and easings in CSS transitions and animations. The three pilots have a colour-scheme toggle, and their tests check Dark, reload (no flash) and System in axe.

## 4.6.0 — 2026-09-22

### Added
- **Light / dark / system colour scheme.** `<ColorSchemeToggle />` (icon button + menu: Light, Dark, System — sun or moon for what is on screen), `<ColorSchemeScript />` for `<head>` (applies the saved choice before first paint, so no flash of the wrong scheme; also `colorSchemeScript()` as a string) and `useColorScheme()` → `{ scheme, resolved, setScheme }`. The choice is saved in `localStorage` (`aura-color-scheme`), every toggle on the page stays in sync, and System follows the operating system live.
- Tokens: `data-theme="system"` follows `prefers-color-scheme` in pure CSS (works without JavaScript); `color-scheme: light | dark` is set too, so scrollbars and native form controls match. `createTheme()` CSS covers `system` as well, so brand themes switch with it.
- Icons `sun`, `moon`, `monitor`; labels `colorScheme`, `schemeLight`, `schemeDark`, `schemeSystem` in English and Thai (โหมดสี, สว่าง, มืด, ตามระบบ).
- Next.js starter: colour scheme script in `<head>`, `suppressHydrationWarning` on `<html>`, toggle next to the page title.
- **Bundle size gate** in CI: `npm run size -w packages/react` bundles what a project imports (all, `Button` only, `DataTable` only, `DatePicker` only, `createTheme` only, the CSS, the `window.Aura` script), gzips it and fails over budget (`packages/react/size-budgets.json`, today + 10%). The table is in each CI run's summary. `--update` resets the budgets on purpose. Tree shaking works: `Button` alone is 3.3 kB of the 33 kB.
- **Changesets**: each change adds `npx changeset`; the Release workflow turns them into a *Version Packages* pull request, and merging it publishes to npmjs and GitHub Packages, tags the version and creates the GitHub release. Both packages keep one version. Hand-pushed `v*` tags still work.
- **Chromatic visual regression** (`.github/workflows/chromatic.yml`): every story in light and dark, TurboSnap (only changed stories), baselines accepted automatically on `main`. Off until the `CHROMATIC_ENABLED` variable and `CHROMATIC_PROJECT_TOKEN` secret are set.

## 4.5.1 — 2026-09-22

### Changed
- **Components are written in JSX** (was `React.createElement` calls) with `const`/`let` instead of `var`, formatted with Prettier (checked in CI). Converted by a codemod; checked by rendering all 46 fixtures on the server with 4.5.0 and 4.5.1 — the HTML is identical — and by the public types, which are unchanged both ways. Output is still classic `React.createElement`, so nothing changes for projects or for the `window.Aura` script.
- JSX made the compiler check DOM props too; four places now say what they meant (`aria-current` literal types, SVG `focusable`, dynamic heading/element tags).

### Added
- **React 19 in CI**: checks, pilots and Storybook run on React 18 and 19 (`scripts/use-react.mjs` switches the workspace). All pass on 19.3 with no code change beyond one type (`cx` accepts the wider React 19 `ReactNode`).
- **Hydration test** (`npm run test:hydrate -w packages/react`): server-renders every fixture, hydrates it in Chromium with React's development build and fails on any console error or warning. 46/46 on React 18 and 19.
- **Next.js starter** (`templates/next-starter`, `npx degit Jirawatpyk/Aura-design/templates/next-starter my-app`): App Router + TypeScript, AURA styles and fonts, `AuraProvider`, `Toaster`, a Server Component page with stats and a table that turns into cards on phones. CI builds it with `next build` against the packed packages and checks the server-rendered HTML.
- **Props reference in Storybook** (Props → Actions, Forms, Pickers, Feedback, Overlays, Data, Layout, Theming and locale): a table per component (46) — generated with react-docgen-typescript from the TypeScript sources and their JSDoc, so it always matches the published types. Inherited DOM attributes are left out.
- `.gitattributes`: LF everywhere (Windows checkouts included), so line endings no longer make files look modified or block `git pull`.

### Fixed
- Three prop descriptions wrote HTML tags as plain text (`<main>`, `<input accept>`, `<Toaster />`), which disappeared in rendered docs; they are code now.

## 4.5.0 — 2026-09-22

### Changed
- **Source is TypeScript** (`strict`): every file in `packages/react/src` is `.ts`/`.tsx`. Public prop types moved from the hand-written `index.d.ts` into `src/types.ts`; components `forwardRef` with them, and `dist/index.d.ts` is now **generated** from the sources (tsc + dts-bundle-generator), so the published types can't drift from the code.
- Compatibility: a type test checks that every prop and argument the 4.4 declarations accepted is still accepted, and the compiled JavaScript was diffed against 4.4 — the only differences are equivalent rewrites (e.g. `!!x` where a boolean was implied). All suites unchanged: SSR/hydration 46×2, pilots 23 + 14, Storybook axe × 2 themes + 37 behaviour tests.
- The `aura-theme` CLI runs from `dist/esm/theme.js` (no TypeScript at runtime).

### Fixed
- DataTable: **F2** now moves into a control inside the focused cell (row-action button, link), like Enter; the check was unreachable before. Behaviour test added.

### Added (types that were accepted by the code but missing from the declarations)
- `AlertProps.className`, `RadioGroupProps.id/className`, `SwitchProps.id/className`, `CardProps.titleId`, `ComboboxOption.icon`.
- `Field` props now describe what it takes (`label` optional, `labelAs`, `labelId`, `disabled`, `className`), exported as `FieldComponentProps`; new named types `ContainerProps`, `ToasterProps`, `ThemeStyleProps`, `AuraStrings`, `AuraLocaleValue`, `FormatDateOptions`.
- `STRINGS` / `useAuraLocale().strings` are typed per label instead of `Record<string, any>`.

### Added
- **Public Storybook** at https://jirawatpyk.github.io/Aura-design/: CI deploys it to GitHub Pages from `main`, only after every Storybook test passed.
- **Welcome page** in Storybook: what AURA is, install, CDN, brand theme, links to the three pilots. Storybook is branded "AURA Design System".
- The axe run now covers MDX docs pages too (it found Storybook's own link blue and code colours below AA on the Welcome page; fixed there).

## 4.4.2 — 2026-09-18

### Changed
- npm pages: plain install line, a no-build CDN snippet (jsDelivr) in the React README, links that work outside the repository.
- Releases: npmjs publishing now uses trusted publishing only (OIDC, no stored token); a prerelease version (`4.5.0-rc.1`) goes to the `next` dist-tag instead of `latest`.

## 4.4.1 — 2026-09-18

### Changed
- **Published to npmjs too** (public): `npm i @jirawatpyk/aura-react` works with no `.npmrc` or token. GitHub Packages keeps getting every release for internal use. The release workflow publishes to both, skips a version a registry already has, and uses npm trusted publishing (OIDC, with provenance) or an `NPM_TOKEN` secret.
- **Licence: MIT** (was UNLICENSED). Lucide icon paths stay under ISC; both notices are in `LICENSE`.
- Example data is now neutral: the admin pilot is an **orders** page (`examples/orders`, ORD- ids, customers, owners, branches, categories) instead of cleaning-service bookings; Storybook stories, fixtures and docs use the same data. No component or token changed.

## 4.4.0 — 2026-09-18

### Added
- **Every component forwards `ref`** to its real element (35 components); react-hook-form `register`, `Controller`, `setFocus` and focus-on-error verified.
- **Theming**: `createTheme`, `ThemeStyle` and the `aura-theme` CLI — one brand colour → an OKLCH scale mapped onto AURA's brand tokens, auto-adjusted to WCAG AA (21 checks), light and dark.
- **Components (+8)**: Badge, Tag, Progress, Skeleton, EmptyState, Pagination, Accordion, Popover.
- **Checkbox** visible label (`children`) and `description`; uncontrolled `defaultChecked`.
- **Stack** responsive `align`.
- **Pilots 2 and 3**: a form-heavy settings page (English, react-hook-form) and a Creative launch page re-branded live; `tests/pilots_test.py` (14 checks).
- **Repository**: npm workspaces (`packages/tokens`, `packages/react`, `apps/storybook`), CI (checks, pilots, Storybook), release to GitHub Packages as `@jirawatpyk/aura-tokens` and `@jirawatpyk/aura-react`.

### Fixed
- Nested Stacks inherited their parent's responsive direction/gap (custom properties inherit); every breakpoint is now set explicitly.
- Content on a Surface used dark-theme colours in dark mode (text and buttons nearly vanished on the light mesh); Surface now sets `data-theme="light"`.
- Labelled checkboxes: the hidden input covered the label text.

## 4.3.0 — 2026-09-18

### Added
- **Stat** — one number per card with a change (direction and tone set separately), caption, icon, loading and drill-down link.
- **TimePicker** — 24-hour `HH:mm`, slots every `step` minutes, `min`/`max`/`isTimeDisabled`; typed `9`, `930`, `9.30`, `09.30 น.`, `9:30 pm`; out-of-range times refused with a message. `parseTime()`.
- **FileUpload** — drop zone + real file input; checks type, size and count; image thumbnails; per-file progress and errors; the app does the upload. `formatBytes()`.
- **DataTable `hideBelow`** per column (px or breakpoint) so tables fit tablets without sideways scrolling.
- **Token** `fg-positive` (lime-800 / lime-300). **Icons** +7 (59): clock, trending-up, trending-down, image, paperclip, cloud-upload, file.
- Thai strings for the new components in `AuraProvider`.
- Pilot: Stat row, start time and job-site photos in New Booking; tablet (820px) checks. 22 checks in `tests/pilot_test.py`.
- Storybook: "New in 4.3" stories; 4 new behaviour tests.

### Changed
- DataTable: buttons and links inside cells leave the Tab order — the grid is one tab stop (Enter goes in, Escape comes out, Tab leaves).
- Contrast check covers `fg-positive` (94 pairs).

## 4.2.0 — 2026-09-18

### Added
- **`@aura/react`** (`aura-react/`): the components as a real ES-module package — ESM per file with `'use client'`, CJS, TypeScript types, SSR-safe (0 hydration warnings), plus the `window.Aura` bundle built from the same source.
- **Components (+10, 32 total)**: Combobox, DatePicker, DateRangePicker, Calendar (Thai months, พ.ศ. by default, ISO values), Drawer, DropdownMenu, AppShell, Container, Stack, Grid.
- **Responsive**: breakpoints (640 / 768 / 1024 / 1280), `useBreakpoint`, `useResponsive`, responsive `Stack`/`Grid` props; AppShell nav → Drawer below 1024px; Dialog → bottom sheet below 640px; DataTable `stackBelow` turns rows into cards.
- **AuraProvider** (`locale="th"`): Thai built-in labels (pagination, close, empty states, "(optional)"…).
- **DataTable**: `stackBelow`, `actions: true` columns; Enter on a cell with a button focuses it, Escape returns.
- **Card** `headingLevel`.
- **Tokens**: `bp-sm/md/lg/xl`, `container-max`, `container-narrow`, `drawer-sm/md/lg`, `cal-cell`, `popover-max-height`; Tailwind `screens`.
- **Pilot**: `aura-react/examples/bookings/` — a bookings admin page built only from AURA, with 17 behaviour/axe checks at 1440px and 390px (`tests/pilot_test.py`).
- **Storybook**: stories import `@aura/react` source; new Pickers, Overlays and Responsive stories (incl. the pilot); Locale toolbar; 11 new behaviour tests.

### Changed
- `z-dialog` 1100 → 900, below `z-menu`, so menus and pickers opened inside dialogs/drawers show on top.
- Dialog body scrolls with header and footer fixed.
- Shell content padding 16px on phones; a Container inside AppShell no longer adds its own padding.
- Skeleton bars are vertically centred in table rows.

### Fixed (found by the pilot and tests)
- Pickers inside dialogs rendered underneath them.
- DatePicker input carried `aria-haspopup`/`aria-expanded` (not allowed on a textbox) — moved to the calendar button.
- Toaster region had an `aria-label` without a role.
- Empty header on actions columns (screen readers heard nothing).
- Menus opened after hydration took an extra render before focusing their first item.

## 4.1.0 — 2026-09-18

### Added
- **Components (22)**: Button (icons, loading), IconButton, Menu, Checkbox, TextField, Textarea, Select, RadioGroup, Switch, Alert, Toaster/`toast()`, Tooltip, Dialog, StatusPill, DataTable, Card, Tabs, SideNav, Breadcrumb, Avatar, Icon, Surface.
- **DataTable**: sorting, row selection, pagination, column resize, virtual scrolling (thousands of rows), pinned/reorderable/hideable columns, ARIA grid cell-by-cell keyboard navigation, loading skeleton, empty state.
- **Tokens**: focus ring; status palette (neutral, progress, ready, blocked); alert palette (info, success, warning, danger) for both themes; form tokens (`bg-input`, `fg-danger`, `border-control`, `border-danger`, `input-height`); overlay tokens (`shadow-overlay`, `bg-scrim`, `z-*`); `bg-selected`, `bg-skeleton`; textures (mesh, grain); sizes for avatars, dialogs, switch, side nav; `h3`, `label`, `caption` type styles; new primitives zinc-450, lime-800, red 50–400, amber 50–800.
- **Icons**: Lucide, 52 icons.
- **Tests**: `components.spec.ts` (16 behaviour tests) and axe over every story in both themes.
- **Tooling**: `scripts/build-tokens.js` generates `aura.css`, `tailwind.tokens.cjs` and `figma-variables.csv` from `tokens.json`; Storybook config and stories; CI workflows; axe over every story in both themes.

### Changed
- `fg-tertiary`: zinc-400 → zinc-500 (light) and zinc-600 → zinc-450 (dark), so it passes AA (was 2.56:1 / 2.29:1).
- Creative shadows are violet-400 in dark (ink disappeared on dark grounds).
- Dark primary button: white fill with a zinc-200 hover (the 4.0 hover hid the label).
- Status pill label is ink on lime (was inherited, invisible in dark).
- Table header uses `fg-secondary` instead of 60% opacity.
- `aura.css` now declares every token (spacing, radius, shadow, motion, z-index…) and both `.dark` and `[data-theme="dark"]`. Fonts moved to `aura-fonts.css`: an `@import` inside `aura.css` stopped Storybook loading whenever Google Fonts was unreachable.
- `eslint-plugin-aura` also catches 8-digit hex, rgb()/hsl() and Tailwind arbitrary colours.

### Fixed
- DataTable: the column-picker button and the loading status sat inside the grid's rows, which axe flags (`aria-required-children`); both moved outside the grid.
- `a11y-check.js` read `../aura-phase1/tokens.json`, which doesn't exist, and only checked three hard-coded pairs.
- README listed `.storybook/` and `.github/workflows/` that weren't in the package; they are now.

### Kept for compatibility
- Tailwind `bg-bg-hover` and `bg-bg-strong` still work (aliases of `bg-surface-hover` / `bg-surface-strong`).
