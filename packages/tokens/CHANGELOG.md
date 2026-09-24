# @jirawatpyk/aura-tokens

Earlier releases (1.0 – 4.5.1), with more detail: [CHANGELOG.md](../../CHANGELOG.md) at the repository root.

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
