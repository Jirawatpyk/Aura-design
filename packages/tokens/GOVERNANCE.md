# GOVERNANCE.md — AURA Design System

## Versioning

Semver `MAJOR.MINOR.PATCH`:

- **MAJOR** — a breaking token rename.
- **MINOR** — a new component or token.
- **PATCH** — a colour fix or docs.

## Breaking changes

1. Deprecate for one minor version before removing.
2. Ship a migration guide.
3. Announce in `#aura-changelog`.

## Contribution flow

1. Open a Proposal in Figma (a branch).
2. Pass the a11y checklist: contrast, focus, keyboard.
3. Open a PR on the `@aura/tokens` repo.
4. It must pass token-lint (no hardcoded colour), the contrast check (WCAG AA) and visual regression (Chromatic).
5. Two Design System Leads review.
6. Merge → auto-publish to npm and Figma.

## Token naming

`--aura-[tier]-[category]-[name]-[scale]-[state]` — e.g. `--aura-bg-surface-hover`, `--aura-fg-primary`, `--aura-button-bg-primary-hover`.

## Never

- Raw hex in code — semantic tokens only.
- A new colour without a Proposal.
- Creative tokens (brutal shadow, grain) in a Data Table.

## Adoption

- Track semantic-token use vs hardcoded values; target above 90%.
- Track Figma detaches.

## Decisions (4.1)

Made by the design-system owner in one pass, instead of separate Proposals. Each change is marked ADDED in its token note.

- **Status palette adopted.** Four tones (neutral, progress, ready, blocked). `aura-red-700` is the only warm hue for state, chosen dark so Ready (lime-200) and Blocked differ by lightness (5.5:1), not only by hue.
- **5.1: a fifth tone, warning** (from DxT Monitor: a monitored host with a problem that still works). Solid amber — amber-600 light, amber-500 dark, ink label — so it differs from Ready and Blocked by lightness as well as hue (light 2.7:1 and 2.0:1). Amber stays the warning hue only: the warning alert and this pill.
- **Alert palette adopted.** Info (violet), success (lime), warning (amber), danger (red), each with its own fill, edge and text for light and dark. Amber is limited to warning.
- **Lucide adopted** as the only icon set, 52 icons. New icons come from Lucide unchanged.
- **Focus ring adopted**: 2px violet, 2px offset, on every interactive element.
- **`aura-fg-tertiary` raised** to zinc-500 (light) and a new zinc-450 (dark) so it passes AA. A PATCH-level colour fix; nothing is renamed.
- **Creative shadow themed**: ink in light, violet-400 in dark.
- **Dark primary button** follows the Storybook story (white fill); dark hover is zinc-200.
- **Overlay elevation added**: `aura-shadow-overlay`, `aura-bg-scrim` and the `aura-z-*` scale, for dialogs, toasts and tooltips only.
- **Form tokens added**: `aura-bg-input`, `aura-bg-input-disabled`, `aura-fg-danger`, `aura-border-danger`, `aura-border-control`, `aura-input-height`.
- **Textures adopted** as Creative-only: mesh and 4% grain.
- **Table tokens adopted**: `aura-bg-selected` (opaque in dark), `aura-bg-skeleton`, `aura-table-select-width`, `aura-control-sm`; the header uses `aura-fg-secondary` instead of 60% opacity.
- **Fonts** stay on Google Fonts (no self-hosted files) until a team needs offline use. (4.16: Chamber-OS needed it — its CSP allows only `font-src 'self'` — so the four families now also ship as woff2 files with `aura-fonts.local.css`; Google stays the default for `aura-fonts.css`.)

## Decisions (4.2)

- **React package**: components are now a real ES-module package, `@aura/react` (ESM per file with `'use client'`, CJS, TypeScript types, SSR-safe). The `window.Aura` bundle is generated from the same source, so the artifact, Storybook and apps run identical code.
- **Breakpoints adopted**: `aura-bp-sm/md/lg/xl` = 640 / 768 / 1024 / 1280, mobile-first, matching Tailwind's defaults so utility classes and components agree.
- **Layout tokens added**: `aura-container-max` (1280), `aura-container-narrow` (720), `aura-drawer-sm/md/lg` (360/480/640), `aura-cal-cell` (36), `aura-popover-max-height` (320).
- **`aura-z-dialog` lowered to 900** (was 1100) so menus and pickers opened inside dialogs and drawers show on top. A value change, not a rename.
- **Buddhist era by default**: dates display in Thai with พ.ศ. years; data stays ISO. Typed years ≥ 2400 are read as พ.ศ.
- **Week starts Sunday** in calendars (Thai convention); `weekStartsOn={1}` per team.
- **Thai UI strings** through `AuraProvider locale="th"`; English stays the default so 4.1 screens don't change.
- **Pilot rule**: a component isn't "done" until it has been used on the pilot page at 390px and 1440px and passes its axe and keyboard checks.

## Decisions (4.3)

- **`aura-fg-positive` added** (lime-800 light, lime-300 dark; ≥7:1). Only for good-news numbers, always with a trending icon and a sign.
- **Change tone is separate from direction** in Stat: more cancellations is up and negative.
- **Times are 24-hour `HH:mm`** in data and on screen. Typed 12-hour input is accepted and converted.
- **Uploads stay in the app**: FileUpload validates and shows progress; sending, retries and storage belong to the product.
- **Seven Lucide icons added** (59 total): clock, trending-up, trending-down, image, paperclip, cloud-upload, file.
- **Tablet rule**: every DataTable on a page used at 820px sets `hideBelow` on secondary columns rather than scrolling sideways.
- **Grid focus**: controls inside DataTable cells leave the Tab order (APG grid); Enter enters a cell, Escape leaves it.

## Decisions (4.4)

- **AURA is for every project.** Project-specific needs (recurring bookings, a scheduling calendar) are built in the project, not in the system. A component joins AURA when at least two projects need it.
- **Brand is a theme layer.** `createTheme` / `aura-theme` / `ThemeStyle` re-map brand-carrying tokens; meaning colours never follow the brand. A theme that fails a contrast check fails the build.
- **Every component forwards its ref** to its real DOM element.
- **Three pilots are the acceptance test**: admin (Orders, Thai), form-heavy (Settings, English, react-hook-form), Creative (Launch, re-branded). A change ships when all three pass axe in both themes at 390/820/1440px.
- **Textures are always light**: Surface forces light-theme tokens inside.
- **Distribution**: one GitHub repository (Jirawatpyk/Aura-design) publishing `@jirawatpyk/aura-tokens` and `@jirawatpyk/aura-react` to GitHub Packages; projects install a version, never copy files.

