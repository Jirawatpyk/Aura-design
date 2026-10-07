# @jirawatpyk/aura-tokens

Earlier releases (1.0 – 4.5.1), with more detail: [CHANGELOG.md](../../CHANGELOG.md) at the repository root.

## 5.33.0

### Minor Changes

- 39e4fbc: DxT Monitor requests 5–8: new token `aura-bg-canvas-hover` (zinc-100 / zinc-800) so SideNav rows and the buttons in its header and footer show a hover on the canvas; AppShell `headerHideFrom="lg"` (a top bar on phones only); PageHeader `breadcrumb` slot; in the phone drawer a divided SideNav header is 56px, level with the top bar.

## 5.32.0

### Minor Changes

- 7106825: DxT Monitor requests 1, 3, 4: SideNav `headerDivider` (the board's 72px header with a full-width line), a stateless `PageHeader` (eyebrow, title, meta, actions; no outer padding — AppShell's content padding is the page margin; also from `/server`), and Skeleton `variant="pill"` / `"badge"` sized like StatusPill and Badge.
- 24944e3: Icon tips: IconButton, Pagination arrows, icon-only SegmentedControl options and cut Tags show their name in AURA's own shared tooltip (hover and keyboard focus, themed, hoverable) instead of a native `title`; the elements carry `data-aura-tip`. A `title` passed to IconButton is kept.

## 5.31.0

### Minor Changes

- a51542c: Chamber-OS addendum 42: checked controls follow the brand. createTheme / ThemeStyle / aura-theme emit contrast-checked `--aura-control-checked-bg/-fg` for light and dark; in aura.css the light value aliases `--aura-accent-violet` (unchanged by default).

## 5.30.0

### Minor Changes

- df98706: Chamber-OS addenda 39–40: an open menu moves with its trigger on scroll and resize and closes only once the trigger is out of view (no focus return then); StatusPill text is a fixed 500 weight.
- 24637a1: Chamber-OS addendum 38: `touchHeight` on TextField, Textarea, Select, RadioGroup and Checkbox — `'always'` gives 44px input boxes and choice rows at every width (also with a mouse in compact density); `true` only below 640px or on a coarse pointer.
- 1464963: Visual polish from the Oct 2026 audit: off-white primary and inverted fills in dark mode, a quieter Blocked fill, visible neutral fills on the light canvas, a `--aura-table-head-bg` header band, grey disabled filled buttons, buttons always in Inter, Table caption spacing, pill-shaped skeleton action bars, and larger Thai labels under `lang="th"`.
- 94985e4: Visual polish, part 2: checked and selected controls use the new violet `--aura-control-checked-bg`; Tables show a scroll shadow and DataTables fade an edge with more columns; table cells wrap whole words; quieter totals rules and a bold last total; SegmentedControl as tall as a field with a raised selected thumb; FilterSelect field inset from 640px; quieter show-password icon, larger chip ×, accent plain links. Thai: field labels, hints, choice descriptions and stacked card labels get Thai sizes and line room under `lang="th"`.

## 5.29.0

### Minor Changes

- 08942f8: Chamber-OS addendum 37: DataTable loading rows stand in for the real ones — they follow `rowHeight="auto"`, draw a column's `skeletonLines` bars, keep their field labels in stacked cards, and draw a button-sized bar for `card: 'footer'` and `actions` cells (44px under the touchHeight rule).

## 5.28.0

### Minor Changes

- 854df51: Chamber-OS addenda 35–36: FilterBar chips take their text's width (cut only when wider than the row), a cut Tag shows its full text on hover and on its remove button's focus, and FilterBar's "Clear all" is 44px tall on phones and coarse pointers.

## 5.27.0

### Minor Changes

- a1d39ca: Chamber-OS addenda 33–34: `bleed` reaches through unpadded wrappers inside a Card, with `bleedEnd` for a table that ends the card from inside them; `Container` is exported from `/server`; the layered override guarantee covers a Container's padding.

## 5.26.0

### Minor Changes

- 6e7ddb0: Chamber-OS addendum 28: a RadioGroup option's `description` (and a labelled Checkbox's) is read as its accessible description, not as part of its name — the name is the visible label alone. Layout and click behaviour are unchanged.
- 68f1e30: Chamber-OS addendum 29: Container takes `align="start"` and passes `id`, `lang`, `dir`, `aria-*` and `data-*` to its element; overriding its `max-width` / `margin` with utilities under `styles.layer.css` is now documented as supported and checked by `check:tailwind4`.
- bbdbbc3: Chamber-OS addendum 30: DataTable and Table take `bleed` — edge to edge inside a Card (no side borders or radius, pulled out by the card's padding; as the card's last content the card's radius closes it; nothing below `flushBelow` or outside a Card). DataTable takes `bordered={false}`.
- 79c2051: Chamber-OS addendum 31: `FilterDateRange` — a compact date-range filter for FilterBar with a FilterSelect-style face ("Submitted Any time"), one click to the range calendar, optional presets and an "Any time" choice; `onChange` only on a complete range, a preset or clearing.
- b184d28: Chamber-OS addendum 32: Table takes `stickyHeader` (pins the header row to the page under AppShell's bar, or to its own box with the new `maxHeight`). Default off.
- e768a2d: Accordion, Combobox and Command read an item's `description` as its accessible description, not as part of its name (as RadioGroup since 5.26). An Accordion panel is named by its title; a Command item keeps its shortcut in its name.

## 5.25.0

### Minor Changes

- fccf751: Chamber-OS addendum 27: a toggle `Tag` (`selected` / `onClick`) takes `touchHeight` — at least 44px below 640px or on a coarse pointer, 32px with a mouse from 640px up. Plain and removable Tags are unchanged.

## 5.24.0

### Minor Changes

- c73afd3: Chamber-OS addendum 26: `touchHeight` (Button, IconButton, ActionBar Clear, a Drawer's `closeProps`) is 44px wherever the primary pointer is coarse — tablets at any width — as well as below 640px. A mouse from 640px up keeps the compact size.

## 5.23.0

### Minor Changes

- fe6748e: Chamber-OS addenda 23–25: DataTable columns take `card: 'wide'` (a full-width wrapping field in stacked cards); underline Tabs show their whole 2px active indicator (it was clipped to 1px by the list's sideways scroll); ActionBar takes `touchHeight` for its own Clear button.

## 5.22.0

### Minor Changes

- c3d7a93: Chamber-OS addendum 22: DataTable columns take `card: 'footer'` — the stacked card's last row, full width, a Button in it growing. Stacked card titles wrap instead of being cut, on a 20px line, with the row box, pill and top-right actions on the first line (one-line cards without a pill or actions are 4px taller).

## 5.21.0

### Minor Changes

- 6c3723f: Chamber-OS addendum 21: Table `rowHeight="density"` — every body row at least the density's row height, with cell padding clamped to fit a small Button, so rows with a button, a pill or one line of text are one height. Stacked rows are unchanged.

## 5.20.0

### Minor Changes

- 5081961: Chamber-OS addendum 20, items 115–116: a Table without `density` follows the nearest AuraProvider's and the nearest `data-density` (compact inside a compact frame, comfortable again inside comfortable); ActionBar takes `start` — buttons at the start edge, outside the status live region, laid out by the bar's own width. ActionBar's actions sit at the end edge in right-to-left pages.

## 5.19.0

### Minor Changes

- b61681a: Chamber-OS addendum 20: Switch takes `readOnly`, `icon` and `aria-describedby` (merged with its description); Select takes `readOnly`. Both stay in the Tab order with `aria-readonly`, ignore clicks and keys, and a read-only Select's value is still submitted and can still be set by code.

## 5.18.0

### Minor Changes

- b84cfc3: Chamber-OS addendum 19: Stepper steps take `status: 'error'` — the danger tone, an alert icon and "has errors" in the step's accessible name and the phone line; the step keeps its place, state and `onStepClick`. A clickable step with a text label is named "Basics, completed" by `aria-label` (Chrome read "Basics , completed"), with its description as `aria-describedby` (no longer part of the name).

## 5.17.0

### Minor Changes

- ded1151: Chamber-OS addendum 18 (110, 111). All opt-in; default output unchanged.
  
  - **Stat** (110): `id`, `data-*`, `aria-*`, `style`, `lang` and `dir` reach the `.aura-stat` root (root and `/server`); `status` renders a line under the value (hidden while loading); `linkArea="label"` with `href` puts the link on the label — inside its heading — and stretches its hit area over the tile, which shows the focus ring. Other controls in the tile stay clickable; `aria-label` / `aria-labelledby` / `aria-describedby` / `aria-current` and `onClick` go on the link.
  - **Progress** (111): `valueText` sets `aria-valuetext` apart from the shown `valueLabel`.
  - CSS budget 25 → 26 kB.

## 5.16.1

### Patch Changes

- a9e0bbf: Select: a custom Select is no longer painted with the disabled ground (Chamber-OS 109). The read-only rule for text fields used `:read-only`, which also matches the Select's trigger `<button>`, so every custom Select showed `--aura-bg-input-disabled` (#fafafa in light) and looked disabled; Chamber-OS's axe scan flagged its placeholder. The rule now applies to a read-only `input` only, and a read-only Textarea gets the same ground as a read-only TextField (before, it had none).

## 5.16.0

### Minor Changes

- 8f294f2: Chamber-OS addenda 15–16, the larger items (95, 96, 98, 101, 105).
  
  - **SideNav** (95, 96): action rows (`selectable: false` + `onSelect`, `onAction`; they close AppShell's phone drawer), `collapseToggle="row"`, `chevron="right"`. The header's end padding is 8px (was 16px) for every SideNav, so a brand, dot and badge fit one row at 240px — a visible change.
  - **DataTable** (98): `onSelectionChange(keys, { key, shiftKey, source, range? })` and `rangeSelect` (Shift-click / Shift+Space ranges). A wrapper calling a `DataTableProps['onSelectionChange']` itself must now pass the second argument.
  - **Dialog** (101): `trigger` (self-managed when `open` is left out; `useDialogClose()` for its footer), `finalFocus`, `onCloseComplete`, and `id` / `data-*` / `aria-*` on the panel; `open` and `onClose` optional. Drawer takes `finalFocus` and `onCloseComplete`.
  - **Combobox** (105): `allowCustomValue` and `groups`; `options` optional.
  - Budgets: the whole library and the IIFE bundle 60 → 62 kB.

## 5.15.0

### Minor Changes

- 9093bcd: Chamber-OS addenda 14–16, layout (85, 87, 89, 90, 92–94, 99, 100). All opt-in; default output unchanged.
  
  - **Table** (85): `stackStyle="cards"` — stacked rows as separate framed cards.
  - **Card** (87, 93): `header` slot for free head content; `flushBelow` drops the frame below a width.
  - **Progress** (89): `secondaryValue`, a striped reserved segment, read as "2 of 6 used, 1 reserved".
  - **Tabs** (90): `fullWidth` for underline tabs, and `'below-sm' | 'below-md' | 'below-lg'`. Underline tabs that already passed `fullWidth` (ignored until now) now fill their row.
  - **FilterBar** (92): `controlsLayout="fill"` and `stackBelow="lg"`.
  - **Breadcrumb** (94): `collapseBelow` (first, "…", last) and per-item `itemProps` / `linkProps`.
  - **Checkbox** (99): `hitArea` — `'target'` or `{ x, y }`.
  - **Button, IconButton** (100): `touchHeight` — 44px below 640px.
  - New strings `progressReserved`, `breadcrumbMore` (en, th, sv). CSS budget 24 → 25 kB.

## 5.14.0

### Minor Changes

- 5ec885f: Chamber-OS addenda 15–16, the small items (86, 88, 91, 97, 102–104, 106–108).
  
  - **EmptyState** (86): `headingLevel={false}` renders the title as a paragraph.
  - **Stat** (88): exported from `/server` (same HTML, no `onClick`); `headingLevel` makes the label a heading.
  - **Drawer** (91): the body keeps focused fields 16px clear of its edges (`scroll-padding`).
  - **AppShell** (97): `contentPadding={false}`; (104) `--aura-shell-bar-height` token, the bar's measured height (56px until measured). A Container in `contentPadding={false}` content keeps its own gutters. The bar is now `box-sizing: border-box` — 56px everywhere (57px before where no border-box reset applied).
  - **Button** (102): a passed `aria-disabled` is kept: focusable, announced, clicks ignored.
  - **Avatar** (103): exported from `/server`.
  - **Tokens** (106): `--aura-fg-warning` for warning text on the page (≥6.8:1 light, ≥10.3:1 dark); the `--aura-status-*-fg` notes say they're only for text on the pill fill.
  - **Tabs** (107): `current="location"` for in-page link tabs.
  - **DataTable** (108): in stacked cards every field aligns to the start, `align: 'end'` columns included (the grid is unchanged). A visible change to cards with amount columns.
  - CSS size budget raised on purpose: 23 → 24 kB.

## 5.13.0

### Minor Changes

- aa75cbd: Chamber-OS addendum 13.
  
  - **DataTable** (80): per-column `card` (`'hide' | 'field' | 'title' | 'pill'`) and `cardOrder` shape the stacked cards without changing the grid; `hideSelectionInCards` drops the boxes from cards only (selection kept).
  - **Table** (81): `align="middle"` and `bordered={false}` (no frame, flush outer cells). Type change: the obsolete HTML `align` attribute is no longer accepted on `Table`.
  - **EmptyState** (82): `tone="danger"`; `id`, `data-*`, `aria-*`, `role`, `style` now reach the root.
  - **Td** (84): `card="title" | "action"` for the stacked row: title and action share the first line, fields two to a line under them.
  - Size budgets raised on purpose: the whole library and the IIFE bundle 58 → 60 kB, DataTable 19 → 20 kB.

## 5.12.0

### Minor Changes

- 8689610: Chamber-OS addendum 12.
  
  - **FilterSelect** (79): a compact filter for FilterBar — "Status All ▾", as wide as its words; `label` names it, `allLabel` shortens the first ("all") option on the face, `onChange(value)`. Select underneath: AURA's list on every device, Select's keyboard, forms and server HTML; long values wrap the button to the next row instead of truncating; right-to-left aware.
  - **FilterBar** `searchGrow`: the search fills the row beside the controls.
  - **Select**: a list wider than its field stays on screen; the list follows a right-to-left page; with `<option>` children the closed field shows the chosen option in server HTML too. Size budgets raised on purpose: CSS 22 → 23 kB, Select 12 → 13 kB.

## 5.11.0

### Minor Changes

- 375ad77: Chamber-OS addendum 11.
  
  - **DataTable** (75): `rowSelectLabel={(r) => 'Select ' + r.company}` names each row checkbox (and its cell) after the row, in the grid and in cards. Default unchanged.
  - **Checkbox** (76): a passed `aria-describedby` is kept, with the description's id after it; before, it was always dropped.
  - **DataTable** (77): header and row selection inputs take 24×24 around the 16px box they draw (WCAG 2.5.8), grid and cards.
  - **DataTable** (78): `rowHeight="auto"` lets rows grow to fit wrapped content with cells vertically centred (rows that fit keep the density height); ignored with `height` (virtualized), with a dev notice. Cards and the default are unchanged.

## 5.10.1

### Patch Changes

- 27be1d0: - **Switch**: a disabled switch that is on keeps reading as on. Disabled rows (on or off) are no longer faded as a whole: the label turns secondary, the description stays readable, and only the switch fades — off to the disabled opacity, on to 0.75, ≥3:1 apart in both themes; `GrayText` in forced colours.
  - **Tag**: the remove button's name comes from the text of any children (`<strong>Acme</strong> AB` → "Remove Acme AB"), skipping `aria-hidden` text; a dev notice asks for `removeLabel` when there is no text.
  - Docs: SideNav faults and warnings use a toned `badge` (`<Badge tone="danger">`).

## 5.10.0

### Minor Changes

- 8b16332: Chamber-OS addendum 10.
  
  - **Tabs** (72): `variant="segmented"` draws the tab list as a SegmentedControl-style pill track, with `fullWidth`; all Tabs behaviour kept, 44px on touch, focus ring never clipped, selected tab marked in forced colours. Default output unchanged.
  - **Menu / DropdownMenu** (73): disabled items are `aria-disabled` and stay in the arrow-key order (choosing one does nothing and keeps the menu open); new `disabledReason` shown with the item and read as its description; a menu with nothing focusable focuses itself so Escape / Tab close it. Behaviour change: arrow keys no longer skip disabled items.
  - **SegmentedControl** (74): the selected pill's edge re-measured at 4.6:1 in light; CI now checks the rendered edge in both themes.

## 5.9.0

### Minor Changes

- 43a1941: Chamber-OS addendum 9 (pay sheet).
  
  - **Drawer** (70): `id`, `data-*` and `aria-*` go on the `.aura-drawer` panel; `closeLabel` gives the close button an accessible name and tooltip that say what it closes; `closeProps` passes attributes to that button. Output without them is unchanged.
  - **Tabs** (71): `keepMounted` keeps inactive panels in the DOM (`hidden`) so their state survives a switch; `activation="manual"` makes Arrow / Home / End move focus only, with Enter / Space / click selecting; per-tab `tabProps` (`data-testid`, `aria-label` — a dev notice when it doesn't start with the visible label). Defaults unchanged.
- 561f792: Preparing for 6.0 (5.9). Nothing that works today changes; the new way ships alongside the old, with development-only notices where code relies on what 6.0 removes.
  
  - **Icons as components:** `@jirawatpyk/aura-react/icons` exports one component per icon (`IconUsers`, `IconPlus` …), `allIcons` and `defineIcon`. Pass them anywhere AURA takes an icon; a bundler keeps only the ones imported, and the entry has no `'use client'`. `registerIcons(allIcons)` (root and `/server`) keeps icon names as strings working in 6.0. `npx aura-icons-codemod src` rewrites literal names (it parses with TypeScript). AURA's own components use the components internally (same HTML). A string icon name prints a one-time dev notice.
  - **Locale packs:** `@jirawatpyk/aura-react/locales/th` and `/sv` export the Thai and Swedish strings for AuraProvider `strings`; in 6.0 only English is built in. `locale="th"` or `"sv"` without a pack prints a one-time dev notice.
  - README "Preparing for 6.0" lists every 6.0 change (also Checkbox `label` shown, one DropdownMenu structure, `engines.node >=20` for the scripts) and what to do on 5.9.
  - `ICONS` is deprecated (removed in 6.0).
  - The new notices are `console.warn` in development only; test setups that fail on any warning will see them until the app migrates.

## 5.8.0

### Minor Changes

- 3b94880: Chamber-OS addendum 8: `@jirawatpyk/aura-react/server` exports hook-free `Card`, `Badge`, `StatusPill`, `Alert` (no `onDismiss`), `EmptyState`, `Icon` and `buttonClass()` for Server Components, with the same HTML as the root components (the server entry now imports React); Alert takes `role`, `icon` and pass-through attributes; Card and StatusPill pass attributes to their root; Table `stackBelow="sm" | "md"` stacks rows into labelled cards in CSS.

## 5.7.3

### Patch Changes

- 5ecf32b: FormErrorSummary: with `focusKey`, it takes focus only after a submit (including a server error set after a valid submit), never when live react-hook-form errors come back while someone types — WCAG 3.2.2 (Chamber-OS item 65). Without `focusKey` the behaviour is unchanged.

## 5.7.2

### Patch Changes

- c9e2d34: SideNav: long compound words in labels hyphenate at a syllable (`hyphens: auto`, using the browser's dictionary for the page's `lang`) instead of breaking mid-word with no hyphen (Chamber-OS item 64). A soft hyphen in a label breaks there in every browser.

## 5.7.1

### Patch Changes

- 2b96404: SideNav: long labels wrap to a second line instead of an ellipsis (Chamber-OS item 63). One-line rows keep 36px (44px on touch), a two-line row grows to 44px, labels clamp past two lines, and the collapsed rail is unchanged.

## 5.7.0

### Minor Changes

- d980bd4: Chamber-OS addendum 5: DropdownMenu `header` (outside the items, the menu's description); a Breadcrumb item with no `href` or `onClick` renders as text; AppShell `<main>` takes focus (`tabIndex={-1}`, no ring); Dialog and Drawer `dismissOnScrim` — `role="alertdialog"` now ignores scrim clicks by default (Escape and the close button still close it); BottomNav item `ariaLabel`; SideNav rows 44px on touch screens.

## 5.6.0

### Minor Changes

- aa10ec9: Chamber-OS addendum 4: DataTable `isRowSelectable` / `rowSelectDisabledLabel` (rejected rows get no checkbox and never count as selected); toasts take a JSX `description`, up to two `actions`, link actions (`href` via `linkComponent`) and `dismiss: false`; Escape closes the focused toast; Toaster `position` adds `top-center` / `bottom-center` / `top-right` / `bottom-right`, `offset` (or `--aura-toaster-offset`) plus the safe-area inset, and an Alt+T `hotkey` to the newest toast; focus returns to where it was when a focused toast closes; toast actions get 44px touch targets; two actions (or one under a description) sit on their own row.

## 5.5.0

### Minor Changes

- bb15c99: DataTable is generic over its rows: the type of `rows` types every `render`, `sortValue`, `getRowHref` and `onRowActivate`, so typos inside callbacks and callbacks written for another row type are compile errors. `DataTableColumn<Row>` types a column list declared on its own; `<DataTable<Order> …>` names the type; `rows={[]}`, untyped rows and `ComponentProps<typeof DataTable>` / `memo` / wrappers keep the untyped default. Type-level changes: a union of arrays (`cond ? orders : invoices`) needs `<DataTable<Order | Invoice>>`; `Record<string, unknown>[]` rows give `render` `unknown` values; `typeof DataTable` is a generic function type instead of `ForwardRefExoticComponent` (it still takes `ref`). Nothing changes at run time.

## 5.4.0

### Minor Changes

- ac2aa7d: Types (minor: some declarations are wider or narrower): DataTable `rows` accepts rows of your own interface and readonly arrays (it is now `ReadonlyArray`, so code that mutated `props.rows` must copy it first), and its row callbacks (`render`, `sortValue`, `getRowHref`, `onRowActivate`) can be typed with that interface; FormErrorSummary `errors` accepts hand-written nested objects (new `FormErrorTree` type); Select `label` is optional with `aria-label` / `aria-labelledby` (development builds warn when a Select has no name), so wrappers reading `props.label` see `string | undefined`. Repo: examples, stories and build/test scripts are TypeScript and type-checked in CI; pilot checks moved from Python to Playwright Test. Working on the repo needs Node 22.18+; the packages still run on Node 18+.

## 5.3.0

### Minor Changes

- 44b0a79: Select opens AURA's own list instead of the operating system's: tokens in light and dark, optgroup headings, disabled options skipped, typeahead, Escape closes the list before a dialog. A real `<select>` stays underneath, so `name`/`required` form posts, refs, `onChange` and react-hook-form `register`/`reset`/`setValue`/`setFocus` work unchanged. `options` is optional (use `<option>`/`<optgroup>` children). `multiple` or `size > 1` keep the native list box. Tests: pick with `getByRole('combobox', { name })` then `getByRole('option', { name })`, or `locator('select[name=…]').selectOption()`.

## 5.2.0

### Minor Changes

- 93f4f6e: 5.2 — the smaller items from the full review.
  
  - DataTable: the totals row is reachable by arrow keys and Ctrl+End; server paging without `totalRows` says "1–25 of many · Page 1" (new strings `rangeOpen`, `pageOpen` in th, en, sv); a clamped page is reported through `onPageChange` / `onStateChange`; pinned columns hidden by `hideBelow` no longer shift the next pinned column before hydration.
  - `parseDate`: eight digits (`18092569`, `20260918`), an era anywhere, `ค.ศ.` / AD for Gregorian years ≥ 2400, years 0–99 as written; `fromISO` / `formatDate` refuse impossible dates. `parseTime`: am/pm hours are 1–12. TimePicker: "That time isn't available" for a disabled time inside the range (new string `timeUnavailable`). The calendar popover is placed by its measured size.
  - Popover scrolls inside the viewport when taller than the room; FileUpload items with `url` link and show thumbnails.
  - Avatar online dot and the selected SegmentedControl option get 3:1 edges; the contrast check covers them.
  - Tokens: types for `./tailwind` and `./eslint-plugin`, a `.` export, `./package.json`; Tailwind v4 `dark:` follows `data-theme="system"` and skips light islands.
  - ESLint plugin: works as an ESLint 9 flat config; catches modern colour functions, named colours and Tailwind palette classes; ignores anchors. `lint-tokens.js` matches and scans more file types. CI runs both (`check:eslint`).
  - `aura-theme` CLI: `--key=value`, one-line errors with exit code 2.

## 5.1.1

### Patch Changes

- 6589150: 5.1.1 — fixes from a full code review. No API is removed; two behaviours change on purpose (marked ⚠).
  
  Security and overlays
  - ThemeStyle / createTheme: a tenant `name` or `selector` can no longer close the `<style>` element or its comment (XSS when server-rendered). An invalid selector is refused; a bad colour no longer throws during render — ThemeStyle renders nothing and logs a dev notice.
  - Dialog / Drawer: Tab wraps between the first and last *reachable* controls (it left the dialog when the last control was `tabindex="-1"` or hidden — e.g. the AppShell mobile nav).
  - Page scroll lock is shared: two dialogs closed in either order no longer leave the page unscrollable.
  - Popover: picking from a Combobox, DropdownMenu or DatePicker inside it works with the mouse (their portaled lists counted as outside clicks). `onOpenChange` is never a stale callback.
  - Toaster: toasts sent from a page's mount effect show even when `<Toaster/>` comes after the page.
  
  Dates and numbers
  - ⚠ DatePicker / DateRangePicker refuse a typed date outside `min`/`max` or disabled by `isDateDisabled`, and show "That date can't be chosen…" (th, en, sv) instead of passing it to `onChange`.
  - Calendar: days that can't be chosen are `aria-disabled` and stay focusable, so the grid always has a tab stop and arrow keys cross disabled weekends; it opens on the nearest day that can be chosen. `onSelect` is optional as typed. Without `today`, the date is re-read in the browser after hydration (server time zone mismatch).
  - A nested AuraProvider (e.g. one that only sets density) inherits locale, calendar, strings and linkComponent.
  - NumberField reads a lone decimal comma (`1,5`, `0,25`) as a decimal point instead of dropping it; `12,500` is still twelve thousand five hundred.
  
  DataTable and Table
  - A `stackBelow` / `hideBelow` table inside a content-sized parent (a centred flex column) no longer collapses to 0px.
  - Server paging without `totalRows`: an empty page past the end keeps its page number and the pager; `aria-rowcount` is -1 while the total is unknown.
  - Focus is no longer pulled back into the grid when a page arrives after the person moved elsewhere; with a sticky totals row, the focused row is scrolled clear of it.
  - Client sorting follows changes to the sort column's `sortValue` / `pill` / `tones`; with `getPageHref` link paging, sorting from page 3 goes back to page 1.
  - `columns={[]}` renders instead of crashing; `selected` keys match rows as strings (`'1'` and `1`).
  - Table: a scrolling table without a caption is named by its `aria-label` (it was an unnamed region).
  
  Menus, combobox, tooltip
  - Combobox: with `name`, the form receives the option value (single mode sent the label); `readOnly` can't be cleared by Escape, Backspace or ×; while `loading`, Enter doesn't pick a hidden old match; the listbox exists only with options (axe); the list follows a growing multi field; Enter that confirms an IME composition isn't a pick (also Command).
  - Menu: Space activates link items; keyboard activation returns focus to the trigger; a long menu scrolls within the viewport. DropdownMenu: ArrowUp on the trigger opens on the last item.
  - Tooltip: the pointer can move onto it (WCAG 1.4.13); it follows its anchor on scroll; `open` no longer breaks server rendering.
  
  Forms, navigation, shell
  - FileUpload: with `name`, the real input carries the accepted files, so native forms and server actions receive them and `required` works.
  - Controlled components stay controlled once a value was passed: `reset()` to `undefined` shows the default instead of the last state (Checkbox, Switch, RadioGroup, and the rest).
  - FormErrorSummary lists nested react-hook-form errors (`address.street`, `items.0.name`).
  - RadioGroup: `ref.focus()` (react-hook-form `setFocus`) moves to the checked or first radio; `required` reaches the inputs.
  - Switch describes itself without a visible label; TextField / Textarea keep your own `aria-describedby` and `aria-invalid`; Checkbox links its description without an `id`; Avatar retries when `src` changes.
  - AppShell keeps one current page for the sidebar and drawer copies of an uncontrolled SideNav.
  - Tabs start on the first enabled tab; route tabs with `value={undefined}` mark none. Ctrl/⌘-click on Pagination, SideNav and BottomNav links opens a new tab without changing this page.
  - Colour scheme: a choice made in another tab applies here; with `system`, ColorSchemeScript keeps `.dark` following the OS; a storage key can't close the inline script.
  
  CSS, tokens, packaging
  - Forced colours (Windows High Contrast): Switch, Progress, upload bars, SegmentedControl and Tabs show their state.
  - aura.css re-declares token references in dark scopes, so a nested dark section gets the dark progress track.
  - CommonJS TypeScript users get `index.d.cts` types; `aura.bundle.js` is marked as having side effects so bundlers keep it.
  - Release publishes only after CI has passed on the same commit, and checks that generated files are committed.

## 5.1.0

### Minor Changes

- 66a067c: Fixes and additions from DxT Monitor.
  
  - **Dialog / Drawer focus (bug):** opening one focused the header's close button even when the body had a field, because the focusable selector was only scoped for its first part. Now focus goes to the first field in the body, then the first footer button, then the dialog itself. Controls out of the Tab order (`tabindex="-1"`, such as unselected tabs or segments) and hidden ones are skipped.
  - **SideNav (bug):** without a `header`, the first item sat on the top edge; it now has `aura-space-3` above it. New `bordered={false}` drops the nav's own right edge.
  - **StatusPill `tone="warning"`:** solid amber with `triangle-alert` (tokens `status-warning-bg` / `status-warning-fg`: amber-600 / ink light, amber-500 / ink dark; 6.3:1 and 9.3:1). It differs from Ready and Blocked by lightness too, which the contrast check now enforces. "Warning", "Problem", "Degraded" and "At risk" map to it. `StatusTone` gains `'warning'`, and DataTable sorts it between Ready and Blocked. New primitives `amber-500`, `amber-600`.
  - **Checkbox `label` (notice, no change yet):** `label` without children is still only the accessible name. It now warns once in development, because **6.0 will show `label` beside the box** like Switch and TextField. New `hideLabel` marks a bare box (it stays bare in 6.0 and silences the notice); DataTable uses it. With `hideLabel`, a `description` is kept as screen-reader text, so its `aria-describedby` resolves.
  - **Icons:** `server`, `globe`, `activity`, `shield-alert`, `phone` and `wrench` from Lucide 1.47.

## 5.0.1

### Patch Changes

- 387a86a: Fixes from a review of 4.19–5.0.
  
  - **DataTable** keeps measuring itself when a column adds or removes a `hideBelow` width, or `stackBelow` comes or goes. Before, it could stay virtual in the card layout (showing only a screenful of cards) or be treated as cards on a desktop.
  - **DataTable, `height` + `stackBelow` before hydration:** the virtual spacers no longer show as a blank gap in the card layout.
  - **DataTable cards and the keyboard:** ArrowUp and Ctrl+Home stay on the cards instead of moving the grid's only tab stop to a hidden header cell. Columns with `hideBelow` keep their column header for screen readers in the card layout.
  - **Toasts** sit above a BottomNav on tablets too, not only on phones.
  - **Pickers:** an unknown `timeZone` falls back to the device's date instead of throwing, and a malformed `today` is ignored.
  - **Link Tabs:** only the tab whose id matches `value` is the current page, so a sub-route marks none. A new-tab click (modifier key or middle button) no longer switches the active tab.
  - **Tooltip** is clamped vertically too, so it always stays inside the viewport.

## 5.0.0

### Major Changes

- b3f0129: AURA 5.0 — Chamber-OS Addendum 3, item 51.
  
  **Breaking:** `formatDate()` from the package root now defaults to English and the Gregorian calendar (`formatDate('2026-09-24')` → `24 Sept 2026`). It is the same function as `@jirawatpyk/aura-react/server`'s, so both give the same string, and it matches `useFormatDate()` without a provider. Before 5.0 the root one defaulted to Thai with Buddhist-era years (`24 ก.ย. 2569`). The 4.20 development warning is gone.
  
  Migrating: add `{ locale: 'th' }` to every call that should stay Thai, or use `useFormatDate()` in components (it follows `<AuraProvider locale="th">`). `git grep -n "formatDate(" | grep -v locale` lists the calls; 4.20 also warned about them. Components, pickers, tokens and CSS are unchanged; `@jirawatpyk/aura-tokens` moves to 5.0 with it because the two packages share a version. The CDN path is `@5`, and the Next starter depends on `^5.0.0`.

## 4.20.0

### Minor Changes

- a41f3c7: Chamber-OS Addendum 3, Group E (items 48–50), and the lead-up to item 51.
  
  - **Separator and a static Table** (item 48): `Separator` (horizontal or vertical; decorative, or `role="separator"`). `Table` with `THead`, `TBody`, `TFoot`, `Tr`, `Th` and `Td` (`align`, `numeric`, `mono`) is plain `<table>` markup in DataTable's grid look, with wrapping text and a totals foot. When it has to scroll sideways, its box becomes a focusable region named by the caption.
  - **Tooltip `left` / `right`** (item 49): every side flips when clipped (top and bottom now both ways) and the tooltip stays inside the viewport.
  - **DataTable before hydration, one markup** (item 50): `stackBelow` cards are now the grid's own rows, laid out by a container query, so each row is in the HTML once. `hideBelow` columns (up to three distinct widths per table) are hidden in CSS from the first paint. Both work at any width, not only the 13 preset widths of 4.16. The grid is still a `grid` in card mode (column headers stay for screen readers, and field labels are generated content that isn't read twice). A table with `stackBelow` or `hideBelow` now sits in wrapper `div`s; `className` and `ref` go on the outermost. **The `.aura-table__card*` classes are gone** — if your tests or styles used them, select rows with `[role="row"]` instead.
  - **Root `formatDate()`** (item 51, before 5.0): a call without `locale` warns once in development. In 5.0 it will default to English and Gregorian like `/server` and `useFormatDate()`. Pass `{ locale: 'th' }` to keep Thai.
  
  Tests: the layout test renders a `stackBelow={700}` table with a `hideBelow={900}` column at 390, 699, 700, 899, 900 and 1100px, with JavaScript off and hydrated, and checks that each row is in the HTML once (4.19 fails it). The Storybook suite adds the invoice line-items table with axe in both themes, tooltips on the last column and the collapsed rail, and the card layout with axe.

## 4.19.0

### Minor Changes

- 7a931da: Chamber-OS Addendum 3, Group D (items 41–47).
  
  - **DataTable totals** (item 41): `footer={{ key: content }}` adds a totals row with the body's widths and alignment (a Totals card when stacked); `stickyFooter` keeps it in view in a `height` table. Truncated cells show their full text in a tooltip on hover and keyboard focus.
  - **Menu items** (item 42): `href` (rendered through `linkComponent`, role `menuitem`), `tone: 'danger'`, and `type: 'radio'` with `group` / `checked` (`menuitemradio` in a labelled group). DropdownMenu takes `linkComponent`.
  - **ActionBar** (item 43): a sticky bar with a status line (always-present live region) and actions. `position="viewport"` floats above the home indicator and any BottomNav; `container` sits at the bottom of a card. Being sticky, it never covers the last field. Bulk variant: `selected` + `onClearSelection` ("2 selected · Clear"), hidden at 0.
  - **BottomNav** (item 44): phone tab bar — icon + short label, count or dot, `aria-current="page"`, links through `linkComponent`, safe-area padding. Hidden from `lg` up in CSS with an in-flow spacer, so there is no shift before hydration. AppShell takes it as `bottomNav`. New tokens `bottomnav-height` (56px) and `z-bar` (800).
  - **Today in a time zone** (item 45): `timeZone` on AuraProvider, DatePicker, DateRangePicker and Calendar, or `today` as an ISO date; `min` / `max` accept `'today'`. `todayIn(timeZone)` from the root and `/server`.
  - **Tabs as links** (item 46): when every tab has `href`, Tabs render a `nav` of links (no tab panels) with `aria-current="page"`, through `linkComponent`; same look and scrolling.
  - **Toast queue** (item 47): three on screen, the rest queued in order; nothing is dropped.
  
  Tests: the layout test adds a five-tab BottomNav and an ActionBar at 320, 390 and 1280px (JavaScript off and hydrated); the Storybook suite covers every item, including axe on the open menu and a browser in UTC−08:00; the Next starter clicks link Tabs.

## 4.18.0

### Minor Changes

- 04cb779: Chamber-OS Addendum 3, Group C (items 36–40).
  
  - **No `!important` in `@layer aura`** (item 36): the Combobox check colour and the phone sheet's width now win by specificity, so a utility can override both. The build fails if the component CSS gains an `!important`, and the Tailwind v4 check overrides both with a utility.
  - **CHANGELOGs agree** (item 37): the 4.10 `linkComponent` correction is in the root and tokens CHANGELOGs too.
  - **Tokens README leads with self-hosted fonts** (item 38): the quick-start imports `aura-fonts.local.css`; `next/font` and Google Fonts are labelled alternatives.
  - **Command passes axe when open** (item 39): with no results there is no empty listbox. The loading row and empty state sit beside it, and the live region says "No matches". The Storybook suite now scans the open palette with 0, 1 and many results in both themes.
  - **Starter link test** (item 40): also clicks a SideNav item and a DataTable row (the row link and another cell); both navigate through `next/link`.

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
  - **Router links**: `AuraProvider linkComponent={Link}` (e.g. `next/link`) is used by Button `href`, Breadcrumb, Pagination `getHref`, Stat `href`, SideNav, and DataTable row and pager links. Button, SideNav and DataTable also take their own `linkComponent` (correction: Breadcrumb, Pagination and Stat read only the provider's until 4.17, and Pagination's previous / next stayed buttons).
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
