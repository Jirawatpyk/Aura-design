# Changelog

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
