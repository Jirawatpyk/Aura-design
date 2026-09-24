# @jirawatpyk/aura-react

Earlier releases (1.0 – 4.5.1), with more detail: [CHANGELOG.md](../../CHANGELOG.md) at the repository root.

## 4.9.0

### Minor Changes

- 19929e9: Four additions for everyday admin and booking screens:
  
  - **`Combobox multiple`** — pick any number; picks show as removable chips, the list stays open between picks, Backspace removes the last, `max` caps the count, `name` posts one hidden input per value. `value`/`onChange` are `string[]` (typed separately from the single mode, which is unchanged).
  - **`NumberField`** — an ARIA spinbutton with thousands separators, `prefix`/`suffix` (`฿`, `%`, `ชิ้น`), `min`/`max`/`step`/`decimals`, ↑/↓ and PageUp/PageDown, +/− buttons that stop at the bounds; clamps and formats when you leave it. Works with react-hook-form `Controller`.
  - **`Stepper`** — progress through a multi-step flow; the current step has `aria-current="step"`, completed steps can link back (`onStepClick`), horizontal or vertical; on phones a horizontal stepper shows markers plus "Step 2 of 4".
  - **`SegmentedControl`** — 2–5 exclusive choices that apply at once (view, period); a radio group with one Tab stop and arrow keys, icons or icon-only, `sm`, `fullWidth`.
  
  All four are on the pilots (Orders: category multi-filter, delivery-scope control, amount field; Settings: setup stepper, working hours via Controller), pass axe in both themes and have behaviour tests. New labels in EN/TH: increase/decrease, step x of y, completed. Size budgets raised on purpose for the new code (whole library 33.8 → 36.0 kB gzip; single imports unchanged).

## 4.8.0

### Minor Changes

- 6313901: Smaller imports: the source is now one file per component. Five grouped files (`extra`, `forms`, `feedback`, `layout`, `layout2`) held 8, 6, 5, 5 and 7 components each, so importing one of them pulled in its file-mates. Measured, gzipped: Skeleton 8.3 → 0.5 kB, Card 6.3 → 0.5 kB, Stack 6.9 → 0.5 kB, Avatar 6.3 → 0.6 kB, Tooltip 6.0 → 0.9 kB, Badge 8.3 → 3.2 kB, TextField 6.1 → 5.4 kB, DatePicker 10.5 → 9.7 kB; the whole library is unchanged at ~34 kB. `Card only` and `Skeleton only` joined the size gate so this can't regress. Code moved, nothing else: all 49 fixtures server-render to byte-identical HTML and the published types are identical (only their order changed).

## 4.7.2

### Patch Changes

- c7a74e1: Test fix only, nothing changes in the packages: the pilots' colour-scheme check ran axe while the colour transitions were still running, so it could read a half-changed colour and fail (seen once as `.aura-nav__count`). It now waits for the transitions, like the brand-theme check does.

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
