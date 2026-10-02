# @jirawatpyk/aura-react

AURA Design System components as a real React package — ES modules, TypeScript types, server-rendering safe, Thai-first.

**See every component live: [Storybook](https://jirawatpyk.github.io/Aura-design/)**

## Try it without a build (CDN)

One HTML file, no install — the packages are on npmjs, so jsDelivr serves them:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@jirawatpyk/aura-tokens@5/aura.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@jirawatpyk/aura-react@5/dist/styles.css" />
<script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@jirawatpyk/aura-react@5/dist/aura.bundle.js"></script>

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

React 18.3 and 19 are both tested: the dev dependencies pin 18, and CI switches the whole workspace to 19 (`node scripts/use-react.mts 19 && npm install`) and runs every suite again — contrast, token lint, SSR, types, build, hydration with 0 warnings, layout before hydration, the three pilot pages and Storybook (axe + behaviour).

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

## Components (61)

Actions: Button (`ghost`, `size="sm"`), IconButton, Menu, DropdownMenu (link, danger and radio items), ActionBar, Tag · Forms: TextField, PasswordField, Textarea, NumberField, Select, FilterSelect, RadioGroup, Checkbox, Switch, SegmentedControl, Combobox (one value, or `multiple`), FileUpload (+ `formatBytes`) · Dates & times: DatePicker, DateRangePicker, Calendar, TimePicker (+ `useFormatDate`, `formatDate`, `parseDate`, `parseTime`) · Feedback: Alert, FormErrorSummary, Toaster/`toast()` (+ `.success/.error/.warning/.info/.loading`), Tooltip, StatusPill, Badge, Progress, Skeleton, EmptyState · Overlays: Dialog, Drawer, Popover · Data: DataTable, Table (+ THead, TBody, TFoot, Tr, Th, Td — static tables), FilterBar, FilterDateRange, Stat · Navigation: Command (⌘K palette), BottomNav · Layout: AppShell, Container, Stack, Grid, Separator, Accordion, Pagination, Card, Tabs, Stepper, SideNav, Breadcrumb, Avatar, Surface, Icon · Theme: ColorSchemeToggle, ColorSchemeScript, `useColorScheme`, ThemeStyle/`createTheme` · Hooks: `useBreakpoint`, `useResponsive`, `breakpoints`, `useAuraLocale`, `useDensity`.

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

`linkComponent` is used by Button `href`, Breadcrumb, Tabs and Menu items with `href`, BottomNav, Pagination `getHref` (page numbers and, since 4.17, the previous / next arrows), Stat `href`, SideNav and DataTable row/pager links. Each of them also takes its own `linkComponent`, which wins over the provider's. Pass `getHref` from a client component (it's a function too). The Next.js starter does all of this, and CI clicks every AURA link in it to check none triggers a full page load. Only `th` shows Buddhist-era years; `en` and `sv` are Gregorian (`sv` weeks start Monday). **Without a provider, components are English with Gregorian dates** — wrap Thai apps in `<AuraProvider locale="th">`. For dates in your own components use `useFormatDate()` — it follows the provider (`const fmt = useFormatDate(); fmt(iso, { format: 'long' })`). Plain `formatDate()` has no provider to read: since 5.0 it is English and Gregorian unless you pass `locale`, the same function from the package root and from `@jirawatpyk/aura-react/server`. Values are always Gregorian ISO dates.

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

## 5.26 — Chamber-OS addenda 28–32

One release: everything below shipped together in 5.26.0.

### Table `stickyHeader` (addendum 32)

- **Table `stickyHeader`** (item 129): the header row stays in view while the rows scroll — its band, the rule under it (drawn as an inset shadow, which moves with it) and above the body. Default off. **What it sticks to:** without `maxHeight` it pins to the page's scroll, under an AppShell's top bar (`--aura-shell-bar-height`: 56px with a `header`; 0 without a bar, and 0 from 1024px in a menu-only shell); set `--aura-table-sticky-top` for another offset — `0px` inside your own scroll container within an AppShell (Dialog and Drawer need nothing), or use `maxHeight` there. To pin to the page the box can't be a scroll container, so it clips sideways instead; a table wider than its box (JavaScript marks it) scrolls sideways as before and then its header can't pin to the page — give such a table `maxHeight`. With **`maxHeight`** (px or any length, e.g. `60vh`) the box scrolls both ways, its header pins to the box's top, and the box becomes a focusable region for the keyboard, named by the `caption` or `aria-label` (development builds warn without one). Under `bleed` the pinned band spans the card's inner width. One header row pins; a header with several rows isn't supported. Stacked rows (`stackBelow`) have no visible header, so it does nothing there (`maxHeight` still caps and scrolls them).
- **DataTable's header** is sticky inside DataTable's own scroll box, which scrolls vertically only with `height`; without `height` it does not pin to the page. Unchanged here.

### `FilterDateRange` (addendum 31)

- **`FilterDateRange`** (item 128): a compact date-range filter for `FilterBar`. Its face matches `FilterSelect`'s — the name, the value, a chevron ("Submitted Any time", "Submitted 1 – 30 Sept 2026") — at the same height, wrapping with the others on a phone. One click opens the range calendar in a popover, as DateRangePicker's opens (also on phones). Optional `presets` (`{ label, range }[]`: Last 7 days, This month…) sit beside the calendar (above it on phones) with an "Any time" choice that clears it. `onChange` runs once a range is complete, a preset is picked or the range is cleared — never on a lone start day — so it can write `?from=&to=` directly. The face is one button named with both parts ("Submitted: Any time"), with `aria-haspopup="dialog"` and `aria-expanded`; the popover is a dialog named by the filter, Escape closes it without a change and focus returns to the face. Dates as DateRangePicker: the provider's `locale` and `calendar` (Thai shows Buddhist-era years, on the face too), `min` / `max`, `timeZone`, `today`, `weekStartsOn`, `isDateDisabled`. The face shares what both ends share ("25 Sept – 3 Oct 2026"). A preset reaching past `min` / `max` is disabled; picking the range already chosen just closes. `data-*`, `aria-*` and `style` reach the face. There is no typed input and no form field (no `name`): write the range in `onChange`, or use DateRangePicker where a form field is wanted.
- Budget raised on purpose: styles.css 28 → 30 kB.

### `bleed` (addendum 30)

- **`bleed` on DataTable and Table** (item 127): edge to edge inside a Card — a list card with its filters in the card's padding and the table across its full inner width (Polaris IndexTable, GitHub issues). As a direct child of the Card's content the table loses its side borders and radius and is pulled out by the card's padding; its header band and top rule stay, and cell text stays level with the card's content (DataTable's 24px gutter, Table's 24px outer cells). When it is the card's last content (no Card `footer`, nothing after it) the bottom rule goes too and the card's radius closes it; a pager or footer after it keeps the rule. Below the Card's `flushBelow` width, and outside a Card, it does nothing; stacked rows inside a framed Card keep its padding. Wrap nothing between the Card and the table, or it won't bleed. The reach is the Card's padding token: change a Card's padding with `--aura-card-padding` (with a unit, `0px`), not a padding utility, or the table overshoots or falls short; `flushBelow` with `max-sm:p-0` is fine. On phones (<640px) a Card without `flushBelow` has 16px padding while DataTable's gutter stays 24px, so its text sits 8px in from the card's content there; Table's outer cells stay 24px too.
- **DataTable `bordered={false}`**: drops the frame (border and radius) and keeps the header band and the 24px gutter, for a table in a section that doesn't bleed. Table's `bordered={false}` is unchanged.
- Budgets raised on purpose: the whole library and the `window.Aura` bundle 62 → 64 kB.

### Descriptions are read after the name

- **Accordion, Combobox and Command** follow 5.26's RadioGroup: an item's `description` was part of its accessible name ("Fees Two unpaid invoices", "Acme AB Stockholm · Corporate"). Now the name is the title or label alone and the description is read after it (`aria-describedby`). An Accordion panel is named by its title. A Command item keeps its shortcut in its name ("New invoice N I"), as before. The heading around an Accordion header is named by the title too. An Accordion title is now always one inline line (a `Badge` in a rich title stays beside the text instead of taking its own stretched row). Otherwise the layout is unchanged, and items without a description are named as before. Tests that matched the joined text need the label alone plus `toHaveAccessibleDescription`.

### Container (addendum 29)

- **Overriding a Container's width and margin is supported** (item 126): with `styles.layer.css`, utilities that set `max-width` or `margin` on a `Container` (`max-w-[672px]`, `mx-0`, `ms-0`) win over `.aura-container`, and that is now a guarantee rather than a side effect. AURA keeps every `.aura-container` rule in `@layer aura`, never uses `!important` on it and never adds an unlayered rule for it; `npm run check:tailwind4` fails if a 672px column, centred or at the start edge, stops working at a 1400px page. With the unlayered `styles.css` the component wins instead (as for every component), so use `size` / `align` or the layered stylesheet. The side padding (16 / 24 / 32px at <640 / ≥640 / ≥1024) and its removal directly inside a padded `AppShell` are unchanged.
- **`align="start"`**: the column sits at the start edge (left; right in right-to-left) instead of being centred — a form board beside the page's start. Default `center`.
- **Attributes reach the element**: `id`, `lang`, `dir`, `aria-*` and `data-*` (e.g. `data-slot="layout-container" data-variant="form"`), so an app's layout checks can read a Container. Other props are still not passed.
- Budget raised on purpose: styles.css 27 → 28 kB.

### Choice descriptions (addendum 28)

- **A choice's description is no longer part of its name** (item 125): a RadioGroup option with `description` was named "Membership Annual membership fee for a member." because both lines sat inside its `<label>`. The radio is now named by its label alone (`aria-labelledby`) and the description is read after it (`aria-describedby`), also on a disabled option ("Bill first", "Needs a tax ID"). A labelled Checkbox with `description` had the same fault (its description was read twice, in the name and as the description) and gets the same fix. The layout is unchanged, and a click on the description still selects. A regex or substring on the label part still matches; one that matched the hint text must move to `toHaveAccessibleDescription`, and an exact `name: 'Membership'` now works. Also fixed: a Checkbox's own `aria-label` was dropped (a `hideLabel` box named only by `aria-label="Select row"` had no name); it is now kept. On a box with visible text your `aria-label` now replaces that text as the name, so start it with the visible words (WCAG 2.5.3). Options without a description render as before.

## 5.25 — Chamber-OS addendum 27

- **Toggle `Tag` takes `touchHeight`** (item 124): a selectable Tag (`selected` / `onClick`) with `touchHeight` is at least 44px tall below 640px and wherever the primary pointer is coarse, the same rule as Button's (5.24) — filter chips tapped with a finger. The pill grows rather than keeping 32px with a larger invisible hit area, so it lines up with 44px buttons on the same row and a tap lands where it looks. With a mouse from 640px up it stays 32px. A plain or removable Tag ignores the prop, and the remove button is unchanged; the prop is never written to the DOM. In a flex row with the default `align-items: stretch`, other items stretch to the chips' 44px; put them in their own row or set `align-items: center` if they should keep their size.

## 5.24 — Chamber-OS addendum 26

- **`touchHeight` follows the pointer, not only the width** (item 123): Button, IconButton and the ActionBar Clear are 44px wherever the primary pointer is coarse — a tablet in portrait (768px) or landscape (1024–1366px) — as well as below 640px. With a mouse (`pointer: fine`) from 640px up nothing changes. Visible on tablets for every control that already passes `touchHeight`. A touch laptop reports its trackpad as the primary pointer (`pointer: fine`), so it keeps the compact size, as AURA's other touch rules do.

## 5.23 — Chamber-OS addenda 23–25

- **DataTable `card: 'wide'`** (item 120): in a stacked card the column is a field on a line of its own at the card's full inner width, after the half-width fields (and before a `footer`), its label above and its text wrapping — a reason with its evidence line. The grid is unchanged (an ordinary column at its `width`).
- **Underline Tabs show their whole 2px indicator** (item 121): the list scrolls sideways, and a scroll container clips at its padding box, so the indicator pulled 1px over the list's border showed only 1px. The track is now an inset shadow inside the list and the indicator paints over its bottom row; the tabs' size is unchanged. In forced colours the track is a border again, with the indicator just above it (the list is 1px taller there).
- **ActionBar `touchHeight`** (item 122): the bar's own Clear button takes Button's `touchHeight` — 44px below 640px — to match action buttons that use it.

## 5.22 — Chamber-OS addendum 22

- **DataTable `card: 'footer'`** (item 118): in a stacked card the column becomes the card's last row, full width, after every other cell — row actions such as "Send reminder" and a menu. A Button placed directly in the cell grows to fill the row; an IconButton or menu keeps its size. The grid is unchanged (an ordinary column at its `width`).
- **Stacked titles wrap** (item 119): a card's title (`card: 'title'` or the automatic one) wraps onto more lines instead of being cut, on a 20px line, and the row box, the pill and top-right actions line up with its first line. Visible in every stacked DataTable: long titles wrap; one-line cards without a pill or actions are 4px taller (the 20px line), with a pill about 1px; the grid is unchanged.
- `card: 'footer'` moves the cell only visually: arrow keys and screen readers keep the grid's column order. A footer holding only an IconButton or a menu sits at the end edge.

## 5.21 — Chamber-OS addendum 21

- **Table `rowHeight="density"`** (item 117): every body row is at least the density's row height (48px; 40px compact; 48px on touch screens, as DataTable — unlike the 5.20 cell padding, which stays compact on touch), and its cells' vertical padding shrinks to fit a small Button (7.5px at 48px, 3.5px compact, at most 8px), as in DataTable's `rowHeight="auto"` — so a row with a `sm` Button, an IconButton, a pill or one line of text are all the same height. Content is centred on the row unless you pass `align="top"` (footer cells centre too, as with `align="middle"`). Rows whose text wraps still grow, with the smaller padding. Header and footer row heights, stacked rows and cards (`stackBelow`), and tables without the prop are unchanged.
- The CSS budget is 27 kB (was 26; 5.19–5.21 added read-only fields, the ActionBar start slot and even rows).

## 5.20 — Chamber-OS addendum 20, items 115–116

- **Table follows the page's density** (item 115): without a `density` prop a Table takes the nearest AuraProvider's density, as its docs said — inside `AuraProvider density="compact"` the wrap carries `data-density="compact"` and cells get 8px vertical padding (were 12px). A `density` prop still wins. The padding comes from the nearest `data-density` (a provider, `<html>`, any element, or the table's own), so `comfortable` inside a compact page switches back as it does for fields. As before with an explicit `compact`, cells stay compact on touch screens. A visible change for Tables inside a compact provider or page.
- **ActionBar `start`** (item 116): buttons at the bar's start edge — Cancel in a wizard — outside the `status` live region. When the bar is 640px or wider (its own width — a bar in a narrow card or dialog counts as narrow) they sit flush with the start edge, the status (if any) next, `children` at the end; narrower, the status takes its own row and the start buttons sit before the actions. In the tab order they come before `children`. Hidden with the actions when a bulk bar is idle; an empty `start` renders nothing.
- **ActionBar in right-to-left pages**: the actions now sit at the end (left) edge — they used a physical `margin-left`, so a wrapped actions row landed next to the status. The bar is now `width: 100%` and a size container: give it no horizontal margins, and in a shrink-to-fit parent (inline-block, a grid `auto` track, a `max-content` popover) give the parent a width — otherwise the bar falls back to 20rem.

## 5.19 — Chamber-OS addendum 20

- **Switch `readOnly`, `icon` and `aria-describedby`** (item 113): `readOnly` keeps a locked switch in the Tab order with `aria-readonly="true"`, so its name, state and notes are heard; click, Space, its label and its row change nothing. It keeps its colours (a locked "on" reads as on) and loses the pointer. `icon` puts an icon at the end of the row, the field icon's size, in fg-secondary (`icon={<IconLock />}`), hidden from screen readers. `aria-describedby` is merged with the description's id, as on TextField and Select. `disabled` wins over `readOnly`.
- **Select `readOnly`** (item 114): the field stays in the Tab order with `aria-readonly="true"` and shows the chosen option on the read-only ground of a read-only TextField, with no chevron; no click or key opens the list. Unlike `disabled`, the value is still posted with the form, and your code can still set it (`reset()`, `setValue()`). Before JavaScript runs, the options from `options` other than the value are disabled so the native control keeps it (`<option>` children aren't; with no `value` or `defaultValue` nothing is); once hydrated they are enabled again, since a disabled selected option is left out of the form's data. A `multiple` / `size` list box ignores the mouse and the keys that pick (arrows, Home/End, Page keys, letters, Space, Ctrl+A); a change that gets through anyway (a touch tap, a phone's picker, `selectOption` in a test) is put back, and your `onChange` isn't called — though a native `change` or `input` listener on the form still sees the event, with the value already restored.
- Read-only is `aria-readonly` alone; pair it with a note that says why (`aria-describedby`), which screen readers read after the state.

## 5.18 — Chamber-OS addendum 19

- **Stepper step errors** (item 112): a step can take `status: 'error'` — say, Save found errors on it. It keeps its place in the order and its state (a completed step is still a button with `onStepClick`, the current one keeps `aria-current="step"`), shows the danger tone with an alert icon instead of the check or number (outlined when it is the current step), and its accessible name ends ", has errors" instead of ", completed". On a phone the line reads "Step 2 of 4 — has errors" when the current step has errors; the markers, error ones included, stay visible. Steps without `status` look the same as before.
- **Stepper step names without the stray space**: a clickable step with a text label now has `aria-label` "Basics, completed" / "Fees, has errors" — from its content Chrome read "Basics , completed" (it puts a space before an absolutely positioned visually hidden span). Its `description` moves from the name to `aria-describedby`. The markup inside is unchanged; a label that is an element keeps the name from its content.
- New string `stepError` in every locale ("has errors", "มีข้อผิดพลาด", "har fel"); a pack you wrote yourself should add it (the built-in one for the locale is used otherwise, and the 6.0 notice for Thai and Swedish shows until it does).

## 5.17 — Chamber-OS addendum 18

- **Stat attributes, status line and a link on the label** (item 110): `id`, `data-*`, `aria-*`, `style`, `lang` and `dir` go on the `.aura-stat` root, from the root package and `/server` — a `data-testid`, or `aria-hidden` on a loading placeholder. `status` is a line under the value ("Active · renews 1 Jan" with its tone icon), hidden while loading. With `href`, `linkArea="label"` puts the link on the label (inside the heading when there is one) and stretches its hit area over the tile: a click anywhere follows it, the tile shows the focus ring and hover edge, and other controls in the tile (links, buttons, fields, anything focusable) stay clickable above it. `aria-label`, `aria-labelledby`, `aria-describedby` and `aria-current` then go on the link, and an `onClick` too. Text in such a tile can't be selected by dragging (the click belongs to the link). The default (`tile`) is unchanged. Only the documented attributes reach the root; anything else passed is dropped, as before.
- **Progress `valueText`** (item 111): what screen readers hear (`aria-valuetext`), apart from the shown `valueLabel` — show "2 of 6 used", read "2 used, 1 reserved, 3 remaining of 6".
- The CSS budget is 26 kB (was 25).

## 5.16.1 — Select ground (Chamber-OS 109)

- **A custom Select keeps the input ground.** The read-only rule for text fields matched the Select's trigger button too (`:read-only` matches anything not editable), so every custom Select showed the disabled ground and looked disabled. It now applies to a read-only `input` only; a read-only TextField still takes the disabled ground, and a read-only Textarea now does too.

## 5.16 — Chamber-OS addenda 15–16, the larger items

- **SideNav action rows** (item 95): an item with `selectable: false` is an action row — Sign out, Help — with the rows' look, 44px on touch screens and the arrow keys, that runs `onSelect` and never becomes the current item (no `aria-current`, no `onChange`). In the rail it is its icon, the label its name. Any item can take `onSelect`. `collapseToggle="row"` shows `collapsible`'s toggle as a labelled row ("Collapse sidebar" / "Expand sidebar") instead of an icon button. In AppShell's phone drawer an action row closes the drawer; `onAction(id)` on SideNav reports action rows.
- **SideNav `chevron="right"` and a one-row header** (item 96): `chevron="right"` points a closed group's chevron right (left in right-to-left pages) and down when open; the default stays down / up. The header's end padding is now 8px (was 16px) for every SideNav, so a brand, its dot and a badge share one row at 240px — a visible change to headers that were close to the edge.
- **DataTable `rangeSelect` and how a selection changed** (item 98): `onSelectionChange(keys, change)` now gets a second argument, `{ key, shiftKey, source: 'click' | 'keyboard' | 'all' | 'sync', range? }` — existing one-argument handlers are unaffected (a wrapper that calls a `DataTableProps['onSelectionChange']` itself now needs to pass the second argument). With `rangeSelect`, Shift-clicking a row's box (or Shift+Space on a row) sets every selectable row on this page, from the last row changed to this one in the order shown, to this row's new state; `range` lists them.
- **Dialog `trigger`, `finalFocus`, `onCloseComplete` and attributes on the panel** (item 101): `trigger={<Button>Add contact</Button>}` renders the button with `aria-haspopup="dialog"` and `aria-expanded`; without `open`, the Dialog then opens and closes itself (`onOpen` / `onClose` still report it). `finalFocus` (a ref or a function) sends focus there when it closes — by a button, Escape or the scrim — instead of back to the opener, falling back to the opener if it returns nothing. `onCloseComplete` runs once after the panel has left the page (also when an open Dialog is unmounted). Inside a self-managed Dialog, `useDialogClose()` gives Cancel and Save a way to close it. `id`, `data-*`, `aria-*`, `style`, `lang` and `dir` reach the `.aura-dialog` panel, as on Drawer; Drawer takes `finalFocus` and `onCloseComplete` too. `open` and `onClose` are optional now.
- The whole-library and IIFE budgets are 62 kB (were 60).
- **Combobox `allowCustomValue` and `groups`** (item 105): with `allowCustomValue` a typed value that isn't in the list is kept — on Enter when no option is highlighted, on Tab, or on leaving the field; text matching an option's label picks that option, empty text clears the value. `groups={[{ label, options }]}` lists options under headings (after any `options`, which is optional now), each a named group for screen readers; filtering hides a heading with no matches. With `allowCustomValue` typing highlights nothing (unless the text is an option's label), so Enter and Tab keep what was typed; an option reached with the arrow keys is picked by Enter or Tab. `clearable={false}` keeps the value when the text is emptied.

## 5.15 — Chamber-OS addenda 14–16, layout

- **Table `stackStyle="cards"`** (item 85): below `stackBelow` each row is its own framed card (DataTable's card radius, border, padding and 8px gap), with no frame around them; above it the table is unchanged. The table then sits in one more `div` (`.aura-tbl-cards`), which carries the width query. Table roles, labels and the `card` slots behave as before.
- **Card `header`** (item 87): free head content in place of `title` and `description` — skeleton bars while the card loads, a status pill above a title you mark up yourself. No heading is added and `title` / `titleId` are ignored; `actions` still sit top-right. Card `header` works from `/server` too.
- **Progress `secondaryValue`** (item 89): a reserved amount drawn after `value` in the same tone, striped (so it reads without colour), clamped to the end of the track. Screen readers hear "2 of 6 used, 1 reserved" (Thai and Swedish included) unless you pass `valueLabel`.
- **Tabs `fullWidth` for underline tabs** (item 90): `fullWidth` now works on the default look too, tabs sharing the row equally; `fullWidth="below-sm" | "below-md" | "below-lg"` does it only below that width (either look). Tabs never shrink below their label; too many scroll as before. Underline tabs that already passed `fullWidth` (ignored until now) now fill their row.
- **FilterBar `controlsLayout="fill"` and `stackBelow="lg"`** (item 92): `fill` gives the filters equal columns across their row (at least 120px each, wrapping when they can't fit) with the count and actions at the end; `stackBelow="lg"` puts the search on its own row up to 1024px (default `md`, 768px).
- **Card `flushBelow`** (item 93): `'sm' | 'md' | 'lg'` — below that width the card drops its border, surface and shadow (padding kept), for a list whose rows become cards of their own.
- **Breadcrumb `collapseBelow` and item attributes** (item 94): `collapseBelow="sm" | "md"` shows the first item, "…" and the last below that width, in CSS (the server's HTML is already right); "…" is a button ("Show the full path") that shows the rest and moves focus to the first item it revealed; a new trail (the next page, with the Breadcrumb kept mounted) starts collapsed again. "…" is a 24px target, 44px on touch screens. Each item takes `itemProps` (its `<li>`) and `linkProps` (its link, button or text) — `data-slot`, `data-testid`.
- **Checkbox `hitArea`** (item 99): `'target'` (24×24, WCAG 2.5.8) or `{ x, y }` px on each side — `{ x: 12, y: 8 }` is 40×32 — for a box without visible text; the box looks the same. A labelled checkbox's whole label is already its target.
- **`touchHeight` on Button and IconButton** (item 100): 44px tall (IconButton 44×44) below 640px, the size asked for above; the label stays centred. A Drawer's close button takes it through `closeProps={{ touchHeight: true }}`. `buttonClass({ touchHeight: true })` from `/server` gives the same class. Off by default.
- New strings `progressReserved` and `breadcrumbMore` in every locale; a pack you wrote yourself should add them (the built-in ones for the locale are used otherwise). The CSS budget is 25 kB (was 24).

## 5.14 — Chamber-OS addenda 15–16, the small items

- **EmptyState `headingLevel={false}`** (item 86): the title is a `<p>`, so an empty state inside a card or list adds nothing to the page's heading outline. EmptyState has no live-region role unless you pass `role`.
- **Stat from `/server`, with `headingLevel`** (item 88): `import { Stat } from '@jirawatpyk/aura-react/server'` renders the same HTML as the root Stat (no `onClick` there; `href` renders `linkComponent`, else `<a>`), `loading` included. `headingLevel={2}` makes the label a heading — on a link tile too; with `onClick` it stays a span (a heading can't sit in a button) and a dev notice says so.
- **Drawer body scroll padding** (item 91): a field scrolled into view in a Drawer (focus, a phone's keyboard) keeps 16px clear of the head and the foot, so its focus ring is never cut (WCAG 2.4.11).
- **AppShell `contentPadding={false}`** (item 97): `<main>` has no padding, for pages whose containers own the padding and column.
- **Button keeps a passed `aria-disabled`** (item 102): `<Button aria-disabled>` stays focusable and in the Tab order, is announced as unavailable, looks unavailable (disabled opacity, not-allowed cursor) and ignores clicks and Enter — a gated confirm. Hovering it changes nothing. `loading` still sets it. In tests, click such a button with `{ force: true }`. This is for buttons: a Button with `href` takes `disabled` (it drops the link and sets `aria-disabled` itself), and IconButton is unchanged.
- **Avatar from `/server`** (item 103): initials and colour, same HTML as the root Avatar. Falling back to initials when an image fails needs the client.
- **`--aura-shell-bar-height`** (item 104): the top bar's height on `.aura-shell`, for sticky offsets under it — `top: var(--aura-shell-bar-height)`. AppShell measures the bar, so a header that wraps to two lines on a phone gives its real height; the stylesheet's 56px covers the server's HTML until then. It is set inline on the shell, so read it rather than override it. It is 0 when there is no bar (no `header`, no `nav`), and from 1024px when the bar only held the menu button. The bar is now `box-sizing: border-box`, so it is 56px everywhere (it was 57px where no border-box reset applied).
- **`--aura-fg-warning`** (item 106): warning text on the page — amber-800 in light (7.1:1 on surface, 6.8:1 on canvas), amber-300 in dark (12.3:1, 13.9:1), checked in CI. `--aura-status-*-fg` are only for text on their pill's own fill; the warning one is near-black in dark mode.
- **DataTable cards start-align every field** (item 108): a column with `align: 'end'` is right-aligned in the grid and starts under its label in the stacked cards, with tabular figures in both. A visible change to cards with amount columns.
- **Tabs `current="location"`** (item 107): link tabs to sections of the same page mark the current one `aria-current="location"` (default `page`).

## 5.13 — Chamber-OS addendum 13 (board parity)

- **DataTable card options** (item 80): per column, `card: 'hide'` leaves it out of the stacked card (the grid keeps it), `card: 'title' | 'pill' | 'field'` places it (a declared title or pill replaces the automatic one; the automatic title is the first column without a `card` — normally the first column — skipping `actions` columns), and `cardOrder` orders the fields (lowest first; others sort by column index) without touching the grid's order. `hideSelectionInCards` drops the row boxes and the select-all line from the cards only; the selection is kept, and Space doesn't change it while cards show. Screen readers and arrow keys follow the grid's order and skip what the card leaves out (the tab stop too); each remaining field keeps its label; loading skeletons leave out the same columns. With `getRowHref`, the link is the first column's text, so hiding that column in cards leaves the card clickable but without a link to Tab to. All in CSS, so the server HTML is already right.
  ```tsx
  <DataTable stackBelow={640} hideSelectionInCards columns={[{ key: 'company', label: 'COMPANY' }, { key: 'flag', label: 'COUNTRY', card: 'hide' }, { key: 'id', label: 'MEMBER NO.', cardOrder: 1 }, …]} />
  ```
- **Table `align="middle"` and `bordered={false}`** (item 81): `middle` centres body and footer cells on their row (default `top`); `bordered={false}` drops the frame and the outer cells' side padding, so a table inside a Card lines up with its heading. Stacked rows keep their layout. `Table`'s type no longer accepts the obsolete HTML `align` attribute (`left | center | right`).
- **EmptyState `tone="danger"`** (item 82): the danger tint, a danger-coloured icon and, with `bordered`, a solid danger frame — for "couldn't load". It stays quiet (no role); pass `role="alert"` to interrupt. EmptyState now passes `id`, `data-*`, `aria-*`, `role` and `style` to its root.
- **FilterBar search filling the row** (item 83): that is 5.12's `searchGrow`; nothing new was needed.
- **Td `card="title" | "action"`** (item 84; also on a row header, `Th scope="row"`): in a stacked Table row the title takes the first line without a label, the action sits at the end of that line at its natural size, and the other cells fall two to a line below. A long title wraps before the action. The desktop table is unchanged.
  ```tsx
  <Tr><Td card="title">{company} <span className="aura-table__mono">{no}</span></Td><Td>{type}</Td><Td>{date}</Td>
    <Td card="action"><Button size="sm" variant="secondary">Review</Button></Td></Tr>
  ```

## 5.12 — Chamber-OS addendum 12 (compact filters)

- **FilterSelect** (item 79): a filter for `FilterBar` drawn as one small button — "Status All ▾" — as wide as its words, so several filters and a toggle `Tag` share a row, three and a Tag even at 375px. It is Select underneath: it opens the same AURA list (on phones too, as Select does since 5.3), with the same keys (arrows, typing, Enter, Escape), `name` in a form and a real `<select>` before hydration (with JavaScript off a choice still posts with the form, but the face keeps the server's value). `onChange` gets the value, so with react-hook-form use a `Controller` (`render={({ field }) => <FilterSelect label="Plan" {...field} options={plans} />}`), not `register`. `label` is the filter's name and its accessible name; screen readers hear the chosen option as the value. The first option is the "all" choice: `allLabel` is the shorter word its face shows ("All" for "All statuses"). A long value ("Diamond Partnership") shows in full and the button moves to the next row instead of cutting it. Right to left, the list opens from the face's right edge.
  ```tsx
  <FilterBar search={q} onSearchChange={setQ} searchGrow>
    <FilterSelect label="Status" allLabel="All" options={statuses} value={status} onChange={setStatus} />
    <FilterSelect label="Plan" allLabel="All" options={plans} value={plan} onChange={setPlan} />
    <Tag selected={unpaid} onClick={() => setUnpaid(!unpaid)}>Unpaid</Tag>
  </FilterBar>
  ```
- **FilterBar `searchGrow`**: the search takes all the room the controls leave in its row instead of stopping at 360px (no CSS override needed). Filters in a bar with FilterSelects sit 8px apart instead of 12px.
- **Select**: a list wider than its field stays on screen, and in a right-to-left page the list is right-to-left too.

## 5.11 — Chamber-OS addendum 11 (member directory)

- **DataTable `rowSelectLabel`** (item 75): names each row's checkbox after the row instead of its key — `rowSelectLabel={(r) => 'Select ' + r.company}` — in the grid and in cards. Without it (or when it returns an empty string) the name stays "Select {key}".
- **Checkbox `aria-describedby`** (item 76): a passed id is kept and the description's own id added after it (`aria-describedby="hint"` + `description` → `"hint {id}-desc"`); with neither there is no attribute. Before, a passed `aria-describedby` was always dropped, with or without a description.
- **Selection boxes take 24×24** (item 77): the header and row checkboxes in DataTable still draw 16px, but their invisible input reaches 24×24 (WCAG 2.5.8) in the grid and in cards, so a click just outside the box counts.
- **DataTable `rowHeight="auto"`** (item 78): rows grow to fit what wraps — two badges, a long name — with every cell vertically centred. A row whose content fits keeps the density's height (a pill, one line of text, a small Button or IconButton); padding appears only around content taller than that. Badges and pills side by side keep apart when they wrap. Rows must all be in the DOM, so it's ignored with `height` (virtualized rows are one fixed height; a dev notice says so) — paginate instead. Cards are unchanged. Default: one fixed line per row, long text ends in an ellipsis.
  ```tsx
  <DataTable rows={members} rowHeight="auto" columns={[…, { key: 'tags', label: 'TAGS', width: 150, render: (r) => r.tags.map((t) => <Badge key={t}>{t}</Badge>) }]} />
  ```

## 5.10.1 — fixes from a new project

- **Switch**: a disabled switch that is on ("always on", enforced by policy) no longer fades into the same grey as an off one. Disabled rows, on or off, now look alike and stay readable: the label turns `aura-fg-secondary`, the description (often the reason it's locked) keeps its colour, the row shows a not-allowed cursor, and only the switch fades — off to the disabled opacity, on to 0.75, at least 3:1 apart in both themes. In forced colours a locked switch is `GrayText`. Use it instead of a Badge for settings people can see but not change.
- **Tag**: the remove button is named from the words inside any children — `<Tag onRemove={…}><strong>Acme</strong> AB</Tag>` is "Remove Acme AB" (was "Remove "). With no text at all (an icon only), a dev notice asks for `removeLabel`.
- **SideNav** (docs): an item's `badge` takes any element, so a fault or warning is a toned Badge — `badge: <Badge tone="danger">Fault</Badge>`; `count` stays a neutral number.

## 5.10 — Chamber-OS addendum 10 (adopting 5.9)

- **Tabs `variant="segmented"`** (item 72): the tab list as a pill track with the selected tab raised — SegmentedControl's look — keeping every Tabs behaviour (tab / tabpanel roles, `keepMounted`, `activation`, `tabProps`). `fullWidth` stretches the track and shares it equally. Tabs are 44px on touch screens, the list doesn't scroll so the focus ring is never clipped, and in forced colours the selected tab gets a `Highlight` outline. Default (`underline`) output is unchanged.
  ```tsx
  <Tabs label="Payment method" variant="segmented" fullWidth keepMounted activation="manual" … />
  ```
- **Disabled menu items stay reachable** (item 73): a disabled `MenuItem` is `aria-disabled` rather than a disabled button, so the arrow keys reach it and screen readers announce it as dimmed (WAI-ARIA APG); choosing it does nothing and keeps the menu open. `disabledReason` shows in place of the hint and is read with the item ("Again in 5 min"). A menu with nothing to focus takes focus itself, so Escape and Tab still close it and focus returns to the trigger. Enabled items are unchanged; tests that expected the arrows to skip a disabled item now land on it.
- **SegmentedControl boundary** (item 74): measured again — the selected pill's inset edge (`aura-border-control`, zinc-500) is 4.6:1 against the light track (zinc-50) and 5.8:1 in dark; CI now measures the rendered edge in both themes (≥3:1). A value near 2.5:1 is zinc-400, dark mode's `aura-border-control`: check that the light page isn't picking up the dark tokens (a `.dark` / `data-theme="dark"` ancestor, or a theme override).

## 5.9 — Chamber-OS addendum 9 (pay sheet)

- **Drawer** (item 70): other attributes (`id`, `data-*`, `aria-*`) go on the `.aura-drawer` panel; `closeLabel` names the close button and its tooltip after what it closes ("Close payment drawer" — pass it in the page's language); `closeProps` puts attributes on that button (`{ 'data-testid': 'pay-sheet-close' }`; its `onClick` runs first and can `preventDefault()` to keep the drawer open). Without them the output is as before; focus trap, Escape, scrim and focus return are unchanged.
- **Tabs** (item 71): `keepMounted` keeps every panel in the DOM with the inactive ones `hidden`, so a switch doesn't tear down what's inside (a Stripe `<Elements>` iframe, a half-typed form). `activation="manual"`: Arrow keys, Home and End move focus and the tab stop without selecting; Enter, Space or a click selects — for tabs whose selection does work (starting a PaymentIntent). When focus leaves the list the tab stop goes back to the selected tab. Each tab takes `tabProps` (`data-testid`, an `aria-label` that starts with the visible label — a dev notice says when it doesn't, WCAG 2.5.3). Defaults are unchanged.
  ```tsx
  <Tabs label="Payment method" keepMounted activation="manual" value={method} onChange={setMethod}
    tabs={[{ id: 'card', label: 'Card', tabProps: { 'aria-label': 'Card — switch payment method', 'data-testid': 'method-card' }, content: <Elements … /> }]} />
  ```

## 5.9 — Preparing for 6.0

6.0 makes the changes below. 5.9 changes nothing that works today: it adds the new way alongside the old one, and a development-only `console.warn` (once per page load, never in production builds) where your code relies on something 6.0 removes. Clear the notices on 5.9 and 6.0 is a version bump. If your tests fail on any console warning, they will see these until you migrate (or filter lines starting `[AURA]`).

| In 6.0 | Why | Do this on 5.9 |
|---|---|---|
| **Icon names as strings need `registerIcons`.** The name map (~3.4 kB gzip) leaves the default bundle. | Every component paid for all 70 icons. | Import icons as components: `icon={<IconUsers />}` from `@jirawatpyk/aura-react/icons` — `npx aura-icons-codemod src` rewrites literal names for you (`--dry` to preview; details below). Or keep names: `registerIcons(allIcons)` once at startup. |
| **Only English is built in.** Thai and Swedish move to packs. | Single-language apps stop shipping two other languages. | `import { th } from '@jirawatpyk/aura-react/locales/th'` and `<AuraProvider locale="th" strings={th}>` (same for `sv`). |
| **Checkbox shows `label`** beside the box (today it is only the accessible name). | A hidden label fails WCAG 2.5.3 for voice users. Announced since 5.1. | Visible text as `children`, or `hideLabel` for a bare box (a table row). |
| **DropdownMenu has one structure**: `role="menu"` is always on `.aura-menu__list` inside `.aura-menu` (today it moves to `.aura-menu` when there is no `header`). | Same DOM for CSS and tests either way. | Select menus by `[role="menu"]` or `.aura-menu__list`, not `.aura-menu[role="menu"]`. No notice (it can't see your CSS). |
| **`engines.node`** is declared (`>=20`) for the `aura-theme` and `aura-icons-codemod` scripts. | Nothing was declared; older Node is out of support. | Run them on Node 20 or later. The components don't care. |

**Icons, in detail.** Each icon is its own component — `IconUsers`, `IconPlus`, `IconTrash2` … (the name in PascalCase) — rendering exactly the `<svg>` the name gives, with the same `size`, `label`, `strokeWidth` and `className`. They work wherever AURA takes an icon (`icon`, `iconRight`, item `icon`s, `<Icon name={<IconUsers />} />`) and on their own (`<IconUsers size="md" />`). A bundler keeps only the ones you import (~0.7 kB for the first, less for each next). The entry has no `'use client'`, so Server Components render them too. `defineIcon(name, paths)` makes one of your own that behaves the same. AURA's own components now use the components internally, so the notice only ever points at your code. `registerIcons([IconUsers, IconPlus])` registers just those names (others still get the notice). The root package and `/server` keep separate registries: if Server Components render names with `/server`'s `Icon`, call `registerIcons` in a server module too.

**The codemod** reads your code with the TypeScript parser (your project's `typescript`; types, strings and comments are left alone). In `.tsx`/`.jsx` files that import AURA it converts `<Icon name="…">`, `icon`/`iconRight` with a literal name on AURA components, and `icon: '…'` in object literals that have a `label` or `title` (nav, menu, tab and option items), then adds the import. It lists what it leaves: names chosen at run time, items in `.ts` files (no JSX there), objects it can't tell are AURA's, and names that clash with another import (e.g. Tabler's `IconPlus`). Review the diff before committing.

**Size in 5.9.** Until 6.0 the name map stays in the bundle next to the components AURA uses internally, so a typical import grows by about 0.5 kB gzip in 5.9 (Button 4.1 → 4.7 kB); 6.0 removes the map (about −3.4 kB for every app that moves off names).

## 5.8 — Chamber-OS addendum 8 (member portal)

- **Server Components** (item 68): `@jirawatpyk/aura-react/server` now has the stateless display components — `Card`, `Badge`, `StatusPill`, `Alert` (no `onDismiss`), `EmptyState`, `Icon` — and `buttonClass(opts)` for a link that looks like a Button. They render from the same functions as the root components (same HTML for the same props) but carry no `'use client'`, hooks or context, so a Server Component can render them without becoming a client reference or pulling the barrel into its route's bundle. Measured in the Next starter: a server page using all of them adds no AURA client reference.
  ```tsx
  import { Card, StatusPill, Alert, buttonClass } from '@jirawatpyk/aura-react/server';
  <Card id="renewal-prefs" title="Renewal"><StatusPill>Approved</StatusPill></Card>
  <Link href="/renew" className={buttonClass({ variant: 'secondary' })}>Renew</Link>
  ```
  In a Server Component import them — `buttonClass` too — from `/server`: the root package is `'use client'`, so anything imported from it there is a client reference. The server entry now imports React (install `react` alongside it, as for any component). Under React 18's stable build the `react-server` condition isn't available outside Next.js; Next ships its own React for Server Components.
- **Alert** (item 66): `role` (`alert` · `status` · `note` · `none`; default by tone as before), `icon` (a name or your element, replacing the tone's icon; still `aria-hidden`), and any other attribute (`id`, `data-*`, `aria-*`) on the root. A standing notice in a warning or danger tone that shouldn't interrupt is `role="status"`.
- **Card and StatusPill** (item 69): `id`, `data-*`, `aria-*` and other attributes go on the root. A titled card is still labelled by its `titleId`; without a title, your `aria-labelledby` is kept.
- **Table `stackBelow`** (item 67): `'sm'` (640px) or `'md'` (768px) of the table's own box. Below it each body row becomes a card and each cell shows its column label — a `Td`'s `label`, else the text of the matching `Th` in `THead` (colspans counted). A body `Th scope="row"` is the card's title. Cells inside a fragment count; a header or cells rendered by your own wrapper component can't be read, so pass `label` on each `Td` then (a dev warning says when no header was found). A plain table inside a stacked cell stays a plain table. Pure CSS (a container query) with labels rendered on the server, so nothing shifts on hydration; the column headers stay for screen readers and the table keeps explicit `table` / `row` / `cell` roles, which Safari drops from `display: block` tables.

## 5.7.3 — FormErrorSummary focus follows submits

- **FormErrorSummary** (item 65): with `focusKey`, the summary takes focus only after a submit — never while someone types. Fed react-hook-form's live `errors`, the list empties and refills as fields are fixed and broken again (RHF re-validates on change after a submit); that used to pull focus out of the field being typed in (WCAG 3.2.2). Now a new `focusKey` arms one focus, taken as soon as the list has errors: at once for client errors, or when a server error arrives through `setError` after a valid submit; typing in the meantime cancels it. A click or key press elsewhere also cancels it, so a later live error (a field validated on blur, a picker set with `setValue`) never takes focus. With live RHF errors always pass `focusKey={formState.submitCount}` — a primitive, not an object made each render — and `useForm({ shouldFocusError: false })`, or RHF moves focus to the first field instead. Without `focusKey` nothing changes: it focuses whenever errors first appear.

## 5.7.2 — SideNav labels hyphenate

- **SideNav** (item 64): a long compound word hyphenates at a syllable (`hyphens: auto`) instead of breaking wherever the line runs out — "Marknadsförings-" / "målgrupp" rather than "Marknadsföringsmålgrup" / "p". The browser's dictionary for the page's `lang` decides — Safari and Firefox ship them; Chrome downloads them on demand, so they can be missing (headless and managed machines especially). Breaking anywhere stays the last resort. Only words of 12+ letters hyphenate, with at least 5 on each side (`hyphenate-limit-chars`, Chrome 109+ and Firefox 137+), so ordinary English labels still wrap between words; a long English word in a two-line label can now hyphenate too. Where no dictionary is available, put a soft hyphen in the label — `'Marknadsförings\u00ADmålgrupp'` — which breaks there everywhere, shows a hyphen only when it breaks, and adds no hyphen to the accessible name (it is an invisible format character screen readers skip). Set `<html lang>` per locale.

## 5.7.1 — SideNav labels wrap

- **SideNav** (item 63): a long label wraps to a second line instead of ending in an ellipsis, so Thai and Swedish names read in full in the 240px nav and the phone drawer. One-line rows stay 36px (44px on touch); a two-line row grows to 44px with its icon centred. Past two lines the label clamps; the accessible name is always complete. The collapsed rail is unchanged.

## 5.7 — Chamber-OS addendum 5 (shell details)

- **DropdownMenu `header`**: content above the items, e.g. name, email and role in an account menu. It sits outside `role="menu"` (arrow keys, Home/End skip it; clicking it keeps focus on the item) and is the menu's accessible description (`aria-describedby`). Screen readers differ in whether they speak a menu's description on open; keep the essentials (who is signed in) in the trigger's name too if they must be heard. With a header, the menu's `ref` and `.aura-menu` are the outer box and `role="menu"` is `.aura-menu__list` inside it.
- **Breadcrumb**: an item with neither `href` nor `onClick` is plain text (`.aura-crumbs__text`), not a button that does nothing.
- **AppShell** `<main>` has `tabIndex={-1}`, so a skip link or `document.getElementById(mainId)?.focus({ preventScroll: true })` moves focus there when the row you acted on leaves the list. No ring is drawn on the landmark.
- **Dialog / Drawer `dismissOnScrim`**: `false` keeps it open on a scrim click; Escape and the close button still close it, and focus stays inside. **`role="alertdialog"` now defaults to `false`**, so a stray click outside a confirmation doesn't throw away a typed reason; pass `dismissOnScrim` to get the old behaviour.
- **BottomNav item `ariaLabel`**: the full name when the visible label is shortened (`label="Konto"`, `ariaLabel="Mitt konto"`); the count or badge words still follow. Include the visible text in it (WCAG 2.5.3).
- **SideNav** rows are 44px on touch screens (AppShell's phone drawer); 36px with a mouse.

## 5.6 — Chamber-OS addendum 4 (selectable rows, richer toasts)

- **DataTable** `isRowSelectable={(r) => r.status === 'Awaiting review'}`: a row it rejects shows no checkbox (the cell stays, so columns line up), and select-all, Space, the "N selected" count and `onSelectionChange` skip it. A rejected key passed in through `selected` is never shown as selected and is dropped from your state with one `onSelectionChange` call. `rowSelectDisabledLabel={(r) => …}` names the empty cell for screen readers. Server HTML has no checkbox for those rows.
- **Toasts**: `description` takes JSX (lines with their own links, read once in the live region); `actions` (up to two; two, or one under a description, go on their own row below the text); an action with `href` is a link through `linkComponent` (Cmd/Ctrl-click opens a tab and keeps the toast); `dismiss: false` keeps the toast open after its action. Escape closes the toast under focus.
- **Toaster** `position="top-center"` (or `bottom-center`, `top-right`, `bottom-right`) and `offset={64}` (or `--aura-toaster-offset`) to clear a top bar, plus the safe-area inset; below 640px toasts still span the width.
- **Alt+T** (`hotkey`, matched on the physical key so macOS Option+T works; `false` turns it off) focuses the newest toast's action, else its close button, and pauses its timer while focus stays inside (moving the mouse away doesn't restart it); the region's name and `aria-keyshortcuts` say the shortcut. It matches the key position, so it works on Thai and other layouts; in a text field on macOS, where Option+T types "†", it is left to the field.
- **Focus comes back**: when a toast holding focus closes (its action ran, Escape, the close button), focus returns to where it was before — the element Alt+T was pressed on, else the one focused when the toast appeared — instead of falling to `<body>`.
- **Touch**: toast actions get a 44px hit area on coarse pointers, as IconButton does (links in the text get a little padding; a 44px box would overlap the next line). Bottom toasters add the bottom safe-area inset too.

## 5.5 — DataTable is generic over its rows

- The type of `rows` is the table's row type, and every `render`, `sortValue`, `getRowHref` and `onRowActivate` gets it — no annotations, and a typo inside a callback (`r.amuont`) or a callback written for another type is a compile error (column `key`s stay plain strings):

```tsx
const columns: DataTableColumn<Order>[] = [
  { key: 'amount', label: 'AMOUNT', align: 'end', render: (r) => baht(r.amount) },
];
<DataTable
  label="Orders"
  rows={orders}
  columns={columns}
  onRowActivate={setDetail}
  getRowHref={(r) => '/orders/' + r.id}
/>;
```

- `DataTableColumn<Row>` types a column list declared on its own; `<DataTable<Order> …>` names the type explicitly. `rows={[]}` (nothing loaded yet) keeps the untyped default, and so do `any[]`, `Record<string, any>[]` and anything reading `typeof DataTable` (`ComponentProps`, `memo`, wrappers).
- Two type-level changes: rows that are a union of arrays (`cond ? orders : invoices`) need the type named, `<DataTable<Order | Invoice> …>`; rows typed `Record<string, unknown>[]` give `render` an `unknown` value, so convert it (`String(r.n)`).
- Types only; nothing changes at run time. `typeof DataTable` is now a generic function type rather than `ForwardRefExoticComponent` (it still takes `ref`).

## 5.4 — types, and TypeScript across the repo

- **DataTable** takes rows of your own interface (`rows={orders}` with `interface Order {…}`; readonly arrays too), and `render`, `sortValue`, `getRowHref` and `onRowActivate` can be written with it: `render: (r: Order) => baht(r.amount)` — no cast from `Record<string, any>`.
- **FormErrorSummary** `errors` accepts a nested object written by hand (`{ address: { street: { message } } }`, arrays for field arrays), not only react-hook-form's `formState.errors`. New type `FormErrorTree`.
- **Select** `label` is optional when `aria-label` or `aria-labelledby` names the field (a toolbar, a table cell); development builds warn when it has no name at all. Every other field still requires `label`.
- The example pages (`examples/*`) are TypeScript and type-checked in CI, as are the stories and the repo's scripts; the pilot checks run on Playwright Test instead of Python.

## 5.3 — Select opens AURA's own list

- **Select** no longer hands its list to the operating system (a white list in dark mode on Windows, a different look on every OS). The field is a button that opens an AURA list like Combobox: tokens in light and dark, a check on the chosen item, `optgroup` headings, disabled options skipped, type to jump (Thai too), Home/End/PageUp/PageDown, Escape closes the list before a dialog. The same list is used on phones (as in shadcn), not the native picker.
- **Nothing to change in your code.** A real `<select>` is still underneath: `name` and `required` in a form post, `ref`, `onChange`, react-hook-form `register` / `reset` / `setValue` / `setFocus`, a form's reset button. `options` is now optional, so `<option>` / `<optgroup>` children work on their own. `multiple` or `size > 1` keep the native list box. Before hydration (and with JavaScript off) the field is that `<select>` itself, so it works from the first paint.
- **Where props go**: `style`, `title`, `data-*`, `aria-label`, `aria-labelledby`, `autoFocus`, `onFocus`, `onKeyDown` and `onClick` go to the button people use; `name`, `form`, `value`, `defaultValue`, `disabled`, `onChange`, `onInput`, `onBlur` stay with the `<select>`. `id` names the button (the label points at it); the `<select>` is `` `${id}-select` ``, and `form.elements.namedItem(name)` still returns it. Read the value in `onChange` / `onBlur` (their `e.target` is the `<select>`); in `onFocus` / `onKeyDown` / `onClick` `e.target` is the button.
- **Tests**: the label now names the button (`getByRole('combobox', { name: 'Team' })`, then `getByRole('option', { name: 'Mobile' })`). `page.locator('select[name="team"]').selectOption('Mobile')` still works and updates the field; `getByLabel('Team').selectOption()` no longer does, because the label points at the button.

## 5.2 — the review's smaller items

- **DataTable**: the totals row is part of the grid (arrow keys and Ctrl+End reach it); server paging without `totalRows` shows "1–25 of many · Page 1" while pages come back full; a page that no longer exists (a filter left one page) is reported back through `onPageChange` / `onStateChange`; a pinned column that `hideBelow` hides no longer pushes the next pinned column before hydration.
- **Dates and times**: `parseDate` reads eight digits from a phone keypad (`18092569`, `20260918`), an era anywhere (`18 ก.ย. พ.ศ. 2569`; `ค.ศ.` keeps a year ≥ 2400 Gregorian), years 0–99 as written, and refuses 31 February instead of rolling it into March (so does `formatDate`). `parseTime` refuses `13pm` and `0am`. TimePicker says "That time isn't available" for a time `isTimeDisabled` refuses inside the range. The calendar popover is placed by its real size (touch cells, the range hint).
- **Popover** taller than the room above and below scrolls inside the viewport. **FileUpload** items with a `url` (files already stored) link to it and show image thumbnails.
- **Contrast**: the Avatar online dot has a `fg-positive` edge and the selected SegmentedControl option a `border-control` edge, so both marks reach 3:1 (210 pairs checked).
- **Tokens package**: `@jirawatpyk/aura-tokens/tailwind` has types (`import aura from …/tailwind` in a strict `tailwind.config.ts`); `require('@jirawatpyk/aura-tokens')` works. Tailwind v4 `dark:` follows `data-theme="system"` with no script and stays off inside a light island (`Surface`).
- **ESLint 9**: `import aura from '@jirawatpyk/aura-tokens/eslint-plugin'; export default [aura.configs.recommended];` The rule also catches `oklch()` / `color-mix()`, named colours in style values and Tailwind palette classes (`bg-red-500`, `text-white`), and no longer flags `#add-user` anchors. `lint-tokens.js` matches it and scans `.mjs`, `.cjs`, `.vue`, `.svelte`, `.astro`, `.html`.
- **`aura-theme` CLI** takes `--brand=#…`, says what's wrong in one line (exit 2) instead of a stack trace, and accepts a hex without `#`.

## 5.1 — from DxT Monitor

- **StatusPill `tone="warning"`**: solid amber (amber-600 light, amber-500 dark, ink label) with `triangle-alert`, for states that need attention but still work — lighter than Blocked and darker than Ready, so it doesn't rely on hue. The words Warning, Problem, Degraded and At risk pick it by themselves. New tokens `--aura-status-warning-bg` / `-fg` (6.3:1 light, 9.3:1 dark). DataTable pill columns sort it between Ready and Blocked.
- **Checkbox `label`** is still only the accessible name in 5.x (visible text goes in children). In development a `label` without children warns once: **6.0 will show `label` beside the box**, like Switch and TextField. Mark bare boxes (table rows) with `hideLabel` now and they stay bare; DataTable's own boxes already do.
- **Dialog and Drawer focus the first field on open** (then the first footer button), not the close button; controls out of the Tab order (`tabindex="-1"`, e.g. unselected tabs) and hidden ones are skipped.
- **SideNav** without a `header` keeps its first item off the top edge; `bordered={false}` drops its own right edge when your layout draws the divider.
- **Icons**: `server`, `globe`, `activity`, `shield-alert`, `phone`, `wrench` (70 in all).

## Upgrading to 5.0

One breaking change: **`formatDate()` from the package root defaults to English and the Gregorian calendar** (`'2026-09-24'` → `24 Sept 2026`), like `@jirawatpyk/aura-react/server` and `useFormatDate()` without a provider — it is now the same function. Before 5.0 it defaulted to Thai with Buddhist-era years (`24 ก.ย. 2569`), and 4.20 warned in development for every call without a `locale`.

- Thai output: pass the locale, `formatDate(iso, { locale: 'th' })`, or in components use `useFormatDate()`, which follows `<AuraProvider locale="th">`.
- Find the calls to change: search for `formatDate(` without `locale` (`git grep -n "formatDate(" | grep -v locale`), or run 4.20 first and read the warning.
- Components, pickers and `/server` are unchanged. The CDN path is `@5`.

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

Every component forwards `ref` to its real element — fields to the `<input>`/`<select>`/`<textarea>`, buttons to the `<button>`, layouts to their root. react-hook-form: `register` for TextField/Textarea/Select (Select's ref is its hidden `<select>`; `.focus()` on it moves to the visible button), `Controller` (pass `field.ref`) for Combobox, DatePicker, TimePicker, FileUpload, Checkbox. See `examples/settings`.

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
npm run typecheck    # tsc --strict over src/, types-test/ against the published API, and the example pages
npm run size         # gzip size of what projects import, against size-budgets.json
npm run test:pilots  # builds the pilots + 4 brand themes, then 44 behaviour/axe checks at 1440/820/390px (Playwright, axe-core)
```

From the repository root, `npm run typecheck` also checks the Storybook stories (strict) and every build, test and release script. The scripts are TypeScript that Node runs as is (type stripping), so working on the repo needs **Node 22.18 or later**; the published packages still run on Node 18+ (their CLI and checkers stay JavaScript, type-checked through `// @ts-check`).

## Source

`src/` is TypeScript (strict) and JSX, formatted with Prettier (`npm run format`), **one file per component** (`Badge.tsx`, `Tooltip.tsx`, …) so a project that imports one component gets only that component's code. Public prop types live in `src/types.ts` with their docs; each component imports its props from there and `forwardRef`s with them, so the published `dist/index.d.ts` is generated from the code and can't drift from it. The build compiles JSX to `React.createElement` (classic runtime), so the `window.Aura` script needs only `window.React`.

## Pilots

`examples/settings/` (form-heavy, English, react-hook-form) and `examples/landing/` (Creative, re-branded live) join `examples/orders/`, a real admin page (orders for any business) built only from these components — AppShell, filters, DataTable with row actions, detail Drawer, New Order Dialog, confirmations, toasts. Build them with `npm run examples`, then open `examples/<name>/dist/index.html`. It is the reference for responsive behaviour at 390px, 820px and 1440px.
