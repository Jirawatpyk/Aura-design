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

## Components (65)

Actions: Button (`ghost`, `size="sm"`), IconButton, Menu, DropdownMenu (link, danger and radio items), ActionBar, Tag · Forms: TextField, PasswordField, Textarea, NumberField, Select, FilterSelect, RadioGroup, Checkbox, Switch, SegmentedControl, Combobox (one value, or `multiple`), FileUpload (+ `formatBytes`) · Dates & times: DatePicker, DateRangePicker, Calendar, TimePicker (+ `useFormatDate`, `formatDate`, `parseDate`, `parseTime`) · Feedback: Alert, FormErrorSummary, Toaster/`toast()` (+ `.success/.error/.warning/.info/.loading`), Tooltip, StatusPill, Badge, Progress, Skeleton, EmptyState · Overlays: Dialog, Drawer, Popover · Data: DataTable, Table (+ THead, TBody, TFoot, Tr, Th, Td — static tables), FilterBar, FilterDateRange, Stat, StatusTile + TileGrid, Sparkline · Navigation: Command (⌘K palette), BottomNav · Layout: AppShell, PageHeader, Container, Stack, Grid, Separator, Accordion, Pagination, Card, Tabs, Stepper, SideNav, Breadcrumb, Avatar, Surface, Icon · Theme: ColorSchemeToggle, ColorSchemeScript, `useColorScheme`, ThemeStyle/`createTheme` · Hooks: `useBreakpoint`, `useResponsive`, `breakpoints`, `useAuraLocale`, `useDensity`.

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

## 5.67 — Chamber-OS addendum 84 (#183)

- **`CheckboxGroup` — RadioGroup's many-choice twin:** one `fieldset` named by its `legend`, with RadioGroup's props — `label`, `hint`, `error`, `required` (the same `*` marker), `disabled` (every box), `orientation`, `touchHeight` (44px rows), `options` (`{ value, label, description?, disabled? }` or strings), `name` — and a set of values: `value: string[]` / `defaultValue` / `onChange(values)`, always in option order whatever order they were ticked in. The group is described by the hint, or by the error line, which also marks every box `aria-invalid` and edges the empty ones. `required` shows the `*` and adds a hidden "(required)" to the group's name (localised), since a group can't take `aria-required` and a native `required` on each box would demand all of them; "at least one" is yours to check (pass `error`, which each box then also points at). Values not among the options (archived, still loading) are kept, after the others. `focus()` on the ref lands on the first ticked enabled box. Replaces a hand-made fieldset of Checkboxes.

## 5.66 — Chamber-OS addenda 82–83 (#181, #182)

- **A checkable menu item keeps its icon** (#181): an item with `icon` and `checked` (a `menuitemcheckbox`) now shows its icon at the start and its state as a check mark at the end — after the `hint`, in the checked colour, its 16px slot kept when unchecked so the hints of such items line up — instead of replacing the icon with a check box. An item with no icon keeps the leading check box (avoid mixing the two in one menu); `checkPlacement: 'start'` on an item keeps the 5.65 look. Radio items still draw their circle in place of an icon. `role` and `aria-checked` are unchanged; in forced colours the mark takes the text colour.
- **Combobox takes `invalid` and `aria-describedby`** (#182), as TextField has since 5.50: `invalid` gives the danger border and `aria-invalid="true"` without AURA's message line, and `aria-describedby` adds your ids (a `role="alert"` message beside the picker) after the input's own (the hint or the error, the chip summary), each id once. `error` still wins.

## 5.65 — Chamber-OS addendum 81 (#180)

- **A pressed IconButton looks on:** an IconButton with `aria-pressed="true"` — or the new `pressed` prop, which sets `aria-pressed` for you — draws the selected fill (`aura-bg-selected`, as a selected Tag or nav item) with an accent icon (`aura-fg-accent`, at least 3:1 on it in light and dark); `tone` is ignored while pressed. Hover still shows on a pressed one (an accent hairline inside), an `outline` toggle takes an accent border, a pressed menu trigger stays on while its menu is open, and the focus ring is unchanged. In forced colours a pressed toggle is Highlight with a CanvasText focus ring. `pressed={false}`, no prop and `aria-pressed="mixed"` draw as before. Inside a field the reveal eye of PasswordField (which uses `aria-pressed`) stays quiet. On a selected DataTable row, which has the same fill, only the accent icon shows it. For an editor toolbar's Bold / Italic / lists; drop `aria-pressed:bg-… aria-pressed:text-…` stand-ins.

## 5.64 — Chamber-OS addendum 80 (#179)

- **Progress `legend` — a key for the reserved part:** `legend={{ value: 'Used', secondary: 'Reserved (in review or scheduled)' }}` draws a key under the bar (above the `hint`): a swatch in the bar's tone for each part (`value` is optional), the second striped like the reserved segment, so it follows `tone="danger"`. It shows only while the reserved segment is drawn and wraps on a phone. It is `aria-hidden`, so while it shows the bar reads both counts ("2 of 6 used, 1 reserved") even when you pass a `valueLabel` — pass `valueText` to word it yourself. In forced colours the bar and the swatches use Highlight in every tone (before 5.64 a toned bar kept its colour). Drop a hand-drawn key that copies the stripe.

## 5.63 — Chamber-OS addendum 79 (#178)

- **A lazy chip still makes `meta` the chip row:** a Server Component's Badge or StatusPill passed through a `'use client'` wrapper can arrive as a lazy node on Next's dev server. PageHeader now looks through a resolved lazy node (a chip makes the row, text keeps the line, as when it arrives resolved), and an unresolved one is neutral — the other children decide — so the layout no longer depends on the build mode. Anything else unresolved (a promise, an iterator) keeps a line.
- **`metaLayout`:** `"row"` lays `meta` out as the wrapping chip row whatever it holds, `"line"` as a text line; `"auto"` (default) keeps 5.62's guess (elements only → row). Pass `metaLayout="row"` where chips come from a Server Component, so nothing is guessed (an all-lazy meta that hasn't resolved would otherwise be a line). Also from `/server`. Drop the `flex flex-wrap items-center gap-2` stand-in.

## 5.62 — Chamber-OS addendum 78 (#177)

- **PageHeader `meta` lays chips out as a row:** a `meta` made only of elements (Badges, a StatusPill — through Fragments and arrays) is now a wrapping row, 8px apart and vertically centred, as `eyebrow` — so chips no longer touch when the JSX has no space between them, and they wrap on a phone. Any text in it — a string `meta` ("128 members · updated 3 min ago"), or a sentence with a `<strong>`, `<time>`, a link or `{count}` — keeps it a text line, as before. Also from `/server`. Drop a `flex flex-wrap items-center gap-2` stand-in wrapper.

## 5.61 — Chamber-OS addendum 77 (#176)

- **A visually hidden child of full-width header actions stays hidden:** below the `actionsFullWidthBelow` width every direct child of PageHeader's actions took a share of the row with `min-width: max-content` — including a visually hidden description beside a button (`aria-describedby` → a `.sr-only` / `.aura-sr-only` span), which grew to its text's width and scrolled the page sideways. The share rule — here and in the `actionsBarBelow` bar — now skips a visually hidden child: `.sr-only`, `.aura-sr-only`, `.visually-hidden`, `.screen-reader-text`, `[hidden]`, or one with an inline `position: absolute` (Radix and React Aria `VisuallyHidden`); the buttons share the row as before. Drop a `.sr-only { min-width: 0 }` stand-in. Another out-of-flow child styled by a class of your own (an absolutely positioned badge) needs `min-width: 0`, or put it inside the button.

## 5.60 — Chamber-OS addenda 74–76 (#173, #174, #175)

- **`linkClass` lays a link out at every width:** a link with `touchHeight` — and any `<button>` or `<summary>` with the class — is now `inline-flex` with a mouse too, not only under the touch query: vertically centred, a 4px gap before an icon, `min-width: 0` and `max-width: 100%`, so `<a className={linkClass({ touchHeight: true })}><span className="truncate">…</span><Icon/></a>` truncates inside its parent with a visible gap, and a `<summary>` is as wide as its content (its marker is hidden; add your own chevron). Under the touch query it is still at least 44×44. A plain `<a>` without `touchHeight` stays inline, so it still wraps in a sentence; a `touchHeight` link whose label wraps now wraps inside its own box (its second line starts under the link, not at the line's start), as it already did on touch. The layout is one class strong, so it beats an element reset (`summary { display: list-item }`) and your own `hidden` / `block` class wins when it comes later (or in a later layer, e.g. with `styles.layer.css` under Tailwind v4). A link with an icon as a direct child is centred on the line (within 2px; an icon inside a wrapper span isn't detected). The `<button>` reset is one class strong too, so a margin, padding or font class of yours on the button wins when it comes later. In a DataTable grid cell a touch link stays inline (no icon gap) so the cell keeps its ellipsis; in DataTable cards it is laid out under the touch query.
- **Label at the start:** the 44px box keeps its label at the start (`justify-content: flex-start`, was centred), so a link stretched by a flex column or a grid cell no longer centres its text away from the column. A short label in its own 44px box sits at the box's start.
- **A type class on the link applies:** `font: inherit` and the other resets now apply to the `<button>` form only, so `<a className={linkClass() + ' aura-text-label'}>` keeps the label scale (13px/500). On a `<button>`, a type class of yours wins when it comes after AURA's styles (or in a later layer); otherwise put it on a child.
- Drop the hand-written `inline-flex items-center`, `min-w-0`, `self-start` / `justify-start` and `flex w-fit` added for 5.59.
- **Table cells wrap words whole** (#174): a static Table's cells use `overflow-wrap: break-word` instead of `anywhere`, which made every cell's min-content one character wide, so an auto-layout table squeezed a text column until "Diamond Partnership" broke inside a word. Words now wrap whole. **Change:** in a table a long unbroken string (an email, a URL) widens its column instead of breaking — the table then scrolls sideways in its box (in stacked cards it still breaks to fit). A `stickyHeader` table that starts scrolling sideways this way also stops pinning its header to the page (see #175). Give such a cell `wrap="anywhere"` (new on `Td` and `Th`) for the old behaviour, or `wrap="none"` to keep a cell on one line (a document number; stacked cards still wrap). Drop `[overflow-wrap:normal]` stand-ins.
- **A wide sticky header sits above the first row** (#175): with `stickyHeader`, a Table wider than its box (it scrolls sideways there) pinned its header to that box with the page's offset (`--aura-shell-bar-height`), so the header covered the first row. Such a table can't pin to the page anyway; its header now sits in flow above the first row.

## 5.59 — Chamber-OS addendum 73 (#172)

- **`linkClass()` — a text link with the touch rule:** the class list for a link that reads as text, not a button, from the root and `/server` (as `buttonClass`): `<Link href={url} className={linkClass({ touchHeight: true })}>INV-2041</Link>`. `tone`: `accent` (default, the link colour) or `inherit`; `underline`: `always` (default) or `hover`; `className` is appended. With `touchHeight` the link is at least 44×44 below 640px or on a coarse pointer (`'always'`: at every width) — `inline-flex`, the label centred — with no fill, border or padding, so it looks the same; with a mouse from 640px its size and line height don't change. It works on a `<button>` too (an action that opens a modal rather than navigating): the button's chrome is reset — no fill, border or padding, the surrounding font and line height, a pointer — so a button and an `<a>` with the class look the same at rest, on hover (the underline thickens, or appears with `underline: 'hover'`) and on keyboard focus (Button's focus ring). The button form is for an action on its own line: a `<button>` never wraps mid-sentence the way an `<a>` does. In a DataTable's grid cells (any `rowHeight`) the row is the tap target and the cell truncates with an ellipsis, so there the link stays inline whatever `touchHeight` says (and a utility class can't override it); in its stacked cards (`stackBelow`) the 44px target applies again. Use it on a link that stands on its own line (a row title, a "View all"); in the middle of a sentence a 44px box would open up the line, so leave `touchHeight` off there. Drop hand-written `inline-flex items-center max-sm:min-h-11 pointer-coarse:min-h-11`.

## 5.58 — Chamber-OS addendum 72 (#171)

- **A short touchHeight tab is a 44×44 target:** with `touchHeight`, below 640px or on a coarse pointer (or always, with `'always'`) each tab is now at least 44px wide as well as 44px tall, its label centred, so a one-word tab such as "Tax" is 44×44. Tabs with longer labels keep their width and the gap between tabs is unchanged; a short tab's underline spans its 44px. With a mouse from 640px nothing changes. Inside its breakpoint a `fullWidth` row sizes its own tabs (equal shares, 12px either side of the label), so it is unchanged there; a one-letter tab in a full-width row that overflows and scrolls can stay under 44px wide.

## 5.57 — Chamber-OS addenda 70–71 (#169, #170)

- **A Dialog or Drawer always opens with focus inside:** a control inside a closed `<details>` is no longer picked as the first control (Chromium reports it as focusable, but `focus()` on it did nothing, so focus stayed on the trigger and Escape didn't close the modal). The `<details>`'s own `<summary>` now counts as a control, so a body whose only control is a closed `<details>` opens on its summary. And focus is checked after each try: if a control doesn't take focus (or pass it on to a field inside it), the next one is tried, then the panel itself — focus is always in the modal, so Escape and the Tab trap work whatever the content. Command works the same way, and so does a Popover's first focus — which now also skips `tabindex="-1"` controls, so a Popover holding a SegmentedControl or Tabs opens on the selected item, as Tab would reach it. A summary is a control whether its `<details>` is open or closed, so a body that starts with an open `<details>` ("Advanced" above a form) now opens on its summary, the first Tab stop, rather than the first field.
- **The Tab trap skips closed `<details>` too:** Tab and Shift+Tab wrap between the controls you can see, the summary included, and never to a control in a closed `<details>`; opened, its controls are Tab stops again. Popover's and DatePicker's trap do the same and now count a summary as a stop, so Tab from it no longer leaves the popover. A workaround such as `closeProps={{ 'data-autofocus': true }}` can go.
- **A titled Alert is named by its title** (#170): an Alert with a `title` and a role (`alert`, `status`, `note` — the default is `alert` or `status` by tone) gets `aria-labelledby` pointing at the title, so a screen reader can say which notice it is when the banner takes focus or is read in browse mode. A passed `aria-label` or `aria-labelledby` wins; no title, or `role="none"`, stays unnamed. The title's id (set only when it names the Alert) is `titleId` if you pass one, else `id` + `-title`, else generated. The `/server` Alert can't generate ids: it uses `titleId` or `id` + `-title`, or for a plain-text title `aria-label`; give a rich title an `id` there. Drop a stand-in `aria-label={title}`.

## 5.56 — Chamber-OS addendum 69 (#168)

- **AppShell's menu button is a 44px touch target:** the "Open navigation" button AppShell draws below 1024px is now 44×44 below 640px or on a touch screen (`(pointer: coarse)`), whatever the density — the same box as an IconButton with `touchHeight` — so it matches the 44px search and account buttons beside it. From 640px with a mouse it keeps its 32px size; from 1024px it is hidden, as before. The bar keeps its 56px height; on a phone the `header` content is 12px narrower, so a long title truncates a little sooner. No new prop.

## 5.55 — Chamber-OS addendum 68 (#167)

- **Bar and footer buttons follow `touchHeight`'s query:** the 44px minimum for Buttons in an ActionBar (`children`, `start`) and in a Dialog or Drawer footer, and the 44px IconButton in a bar (not one in a footer), now apply below 640px **or on a touch screen** (`(pointer: coarse)`) at any width — the query `touchHeight` and the compact density use — so a `size="sm"` bulk-bar button on a tablet is 44px too. With a mouse from 640px nothing changes (36/32px in compact). Wrapping a footer's long label stays phone-only. Drop the `touchHeight` you kept on `size="sm"` bar and footer buttons for tablets.

## 5.54 — Chamber-OS addendum 67 (#166)

- **ActionBar's buttons are 44px on a phone:** below 640px (the viewport's) every Button in an ActionBar — its `children` and `start` — is at least 44px tall, and an IconButton there 44px square, whatever the density or pointer, as a sheet's footer is since 5.53, so a compact page's save bar needs no `touchHeight` on each button. PageHeader's `actionsBarBelow` bar (ActionBar's edge strip) does the same while it is a bar. From 640px with a mouse they keep the density's height (5.55: on a touch screen they are 44px at any width); buttons that already pass `touchHeight` look the same. Drop any `touchHeight` you added to bar buttons only for this.

## 5.53 — Chamber-OS addendum 66 (#165)

- **A phone sheet's footer buttons wrap and are 44px:** below 640px a Dialog's footer stacks its buttons full width, and now they behave as `fullWidth` there (a Button directly in `footer`, or the only Button in a wrapper such as a Tooltip or a menu trigger); a Drawer's footer buttons stay in their row but wrap and are 44px too — a long label (Swedish, Thai) wraps instead of running out, and each is at least 44px tall whatever the density or pointer, with no `touchHeight` needed. From 640px with a mouse the footer is unchanged: right-aligned, the density's height, one line (5.55: on a touch screen its buttons are 44px, still in a row). Drop any `touchHeight` you added to footer buttons only for this.
- **`fullWidth="below-sm"` / `"below-md"`** on Button, a link Button and `buttonClass` (so in Server Components too): full width and wrapping, at least 44px tall, only below 640px / 768px (the viewport's); its natural width above — for action rows that stack on phones and sit inline on a desktop. `fullWidth` (`true`) is unchanged. Inside a PageHeader's `actionsFullWidthBelow` row with an IconButton, that row's own sizing wins.

```jsx
<Button fullWidth="below-sm">Skicka för godkännande igen</Button>
<Link href="/renew" className={buttonClass({ variant: 'secondary', fullWidth: 'below-sm' })}>Renew</Link>
```

## 5.52 — Chamber-OS addendum 65 (#164)

- **`Table loading`** (with `loadingRows`, default 5): the head as given, then placeholder rows in its columns — and below `stackBelow`, the same cards (title and action slots kept). Each column follows its head cell: `skeleton={{ lines: 1 | 2, kind: 'text' | 'pill' | 'action', touch }}` (two lines for a value over its caption, a status pill, or a block as tall as a small Button — 44px on a phone card with `touch`), its width from `skeletonWidth`, else the cell's `width` or `style.width`, else an even share of what is left. The THead must be a direct child (call your head as a function, not your own component) — a dev notice says so — and its first row must be the column row (with grouped headers, columns come from that first row). A head cell whose content isn't plain text (an icon, a sort button) needs `label` for the cards' field labels. TBody and TFoot aren't rendered while loading, so a totals row appears with the data.
- **`TableSkeleton`** — the same thing for Server Components (a route's `loading.tsx`), from the root and `/server`: `columns` (`{ label, width, align, numeric, card, skeleton }`), `rows`, and Table's `density`, `stackBelow`, `stackStyle`, `bordered`, `bleed`, `bleedEnd`, `rowHeight`, `align`. Build both from one column list and they can't drift.
- Both are `aria-hidden` and `inert`, with nothing focusable: announce the load in the page's own status line. A loading table has no content to size from, so its columns are fixed to those widths; give the loaded table the same shares (adding up to 100%) and every column's left edge matches.

```jsx
<Table stackBelow="sm" loading={isPending} loadingRows={8}>
  {head()}   {/* <THead><Tr><Th style={{ width: '26%' }} card="title" skeleton={{ lines: 2 }}>Member</Th>… */}
  <TBody>…</TBody>
</Table>
// app/members/loading.tsx (a Server Component)
import { TableSkeleton } from '@jirawatpyk/aura-react/server';
export default () => <TableSkeleton stackBelow="sm" rows={8} columns={MEMBER_COLUMNS} />;
```

## 5.51 — Chamber-OS addenda 58–64 (#157–163)

- **DataTable column `sortDirection`** (#157): `'ascending' | 'descending'` — for a list the page orders (from the URL, a line under the table), puts `aria-sort` on that column's header with no sort button, icon or click, in the server's HTML too. Give it to one column (two warn in development); move it when the order changes. Once the table has its own sort (a sortable header was used, or `sort` is set) that wins and `sortDirection` is ignored, so one header at most claims the order.
- **DataTable `selectAllRef`** (#157): a ref to the select-all checkbox, e.g. to return focus there after a bulk bar's Clear.
- **The row minimum counts each flexible column's `minWidth`** (#159), the value its cells already used, instead of 160px for every one — eight columns with minimums of 80–132px now fit a 959px box without a sideways scroll. Columns without `minWidth` still count 160.
- **`StatusPill wrap`** (#158): in a box narrower than the words they wrap inside the pill (the icon beside the first line, the pill's own line height, Thai's too), and its corners are `aura-radius-lg` (16px) instead of full (addendum 61): on one line that still gives fully round ends, so it looks exactly as before; wrapped it is a rounded rectangle rather than a tall lozenge instead of running out of it — for a narrow DataTable column or a stacked card. In a wide box, or without `wrap`, a pill is one line as before.
- **Toggle Tags among FilterBar's controls show their whole label** (#160): from 640px a selectable Tag inside FilterBar isn't cut at 24ch, only when wider than the bar, and in the Filters sheet it never is; below 640px in the bar itself, and for a Tag outside FilterBar, the cap and its tip stay. Applied-filter chips were already uncapped (5.28).
- **The wheel over a DataTable scrolls the page again** (#163): `.aura-table__scroll` contains only the sideways axis (`overscroll-behavior-x: contain`), so a vertical wheel over a grid that scrolls sideways scrolls the page, a sideways swipe stays in the grid (no back navigation), and a fixed-`height` grid scrolls inside first, then the page at its end. Remove any `overscroll-behavior-y` override you added for it.
- **DataTable column `grow`** (#162): a flexible column's share of the spare width (its cells' flex-grow; default 1), e.g. `{ key: 'actions', minWidth: 128, grow: 3 }` puts Approve and Reject side by side once the table is wide. At the row minimum nothing changes, the row minimum ignores it, and fixed-`width` columns and stacked cards ignore it. `grow: 0` keeps a column at its minimum; leave at least one flexible column above 0 or the rows won't fill a wide table.
- **DataTable `keyboard="tab"`** (#161): every checkbox, sort and column button, row link and row action is an ordinary Tab stop in reading order (Shift+Tab walks back), each with its focus ring, in the grid and in stacked cards — for lists whose rows carry actions people expect to Tab to. The cells stop being Tab stops; the arrows still move between them once focus is in one (click a cell, or Escape from a control), and the grid's row and column semantics stay. Without it (`'grid'`, the default) the table is one Tab stop as before. Keyboard resizing and reordering of columns (Alt/Ctrl+Shift with the arrows on a header cell) need focus on that header cell, so they stay with the grid keyboard.
- **5.50 follow-up:** a disabled box whose control has `aria-invalid="true"` keeps its disabled edge inside an enabled custom `Field` too.

```jsx
<DataTable columns={[{ key: 'timeInStage', label: 'Time in stage', minWidth: 132, sortDirection: 'descending' }, …]} selectAllRef={selectAll} … />
<StatusPill tone="progress" wrap>Awaiting marketing review</StatusPill>
```

## 5.50 — Chamber-OS addendum 57 (#156)

- **`invalid` on TextField and Textarea** (and PasswordField, which is a TextField; `Field` for a custom control): marks the value invalid without AURA's message — the danger edge (`--aura-border-danger`, light and dark, also on hover and focus) and `aria-invalid="true"` on the control, no error line, and `aria-describedby` as it would be without it (the addon, the hint, then your own ids). For a page that explains the problem itself — a live contrast readout, a reason line a disabled Save points at. Point `aria-describedby` at that explanation, or a screen reader hears "invalid" with no reason. `error` still wins: its message replaces the hint and its id the hint's. A disabled field keeps its disabled edge.
- **Your own `aria-invalid="true"` is enough too**: a field whose input or textarea carries it gets the same edge, so a custom control inside `Field` (with `invalid` on the Field for the class) or a form library that sets it needs nothing else.

```jsx
<TextField label="Primary colour" hint="A hex value." value={colour} onChange={…} invalid={!meetsAa} aria-describedby="contrast-readout" />
```

## 5.49 — Chamber-OS addendum 56 (#155)

- **The short-screen threshold follows the browser's text size**: the height at which bottom bars stop pinning (5.48, #154) is `30rem`, not `480px`. In a media query `rem` is the browser's default font size (Chrome, Edge, Firefox; not iOS Dynamic Type or Safari's text size), not the page's `html` font size: 480px at the default 16px (nothing changes), 720px at 24px (an iPhone SE counts as short, an 844px phone keeps the bar), 960px at 32px (an 844px phone counts as short — it holds what a 422px screen holds at 16px). There the `actionsBarBelow` actions stay in the header, an ActionBar sits at the end of its container and AppShell's top bar scrolls away, as at 400% zoom. Changing the text size on an open page re-checks it (the bar-height tokens follow). The width breakpoints stay in px.

## 5.48 — Chamber-OS addendum 55 (#153–154)

- **The `actionsBarBelow` bar is now ActionBar's edge strip** (#153): the full width of the screen, on its bottom edge (or on a BottomNav's top edge), a top border only — no radius, no shadow — with ActionBar's inner padding (8px block, 16px start, 12px end) and the home-indicator inset inside it, as the save and bulk bars of an app built on `ActionBar position="container"` look. The page's end padding and `scroll-padding-bottom` follow the new height. The layout inside is unchanged.
- **Bottom bars on a short screen** (#154): on a screen 30rem tall or less — 480px at the browser's default 16px text, and since 5.49 (#155) it follows the default font size set in Chrome, Edge or Firefox (960px at 32px, 720px at 24px), so large-text users get the same room (iOS Dynamic Type and Safari's text-size controls don't change it); 400% zoom on a desktop (320×256 CSS px), a phone held sideways — `actionsBarBelow` no longer fixes the actions to the bottom: they stay in the header's own row (laid out by `actionsFullWidthBelow` if set), with no status line, page-end space or scroll padding; and an `ActionBar` (either `position`) stops sticking and sits at the end of its container, in the flow. AppShell's top bar scrolls away with the page there too, so a field reached backwards (Shift+Tab) isn't left under it, and `--aura-shell-bar-height` is 0 meanwhile, so nothing sticky (a DataTable `stickyHeader`) leaves a gap for it. A focused control is never under a bar there (WCAG 2.4.11, 1.4.10); taller than 30rem everything is as before. The width breakpoints stay in px. An ActionBar with `hidesBottomNav` still hides the BottomNav on a short screen while it sits at the end of its container. Wherever a BottomNav shows (any height), the page's `scroll-padding-bottom` now reserves its height, so a field tabbed into view stops above it.
- **`actionsBarLook="floating"`** keeps 5.45's card (inset 16px, lifted 12px, bordered all round, rounded, with the overlay shadow) — the look of `ActionBar position="viewport"`. Only the bar's look changed; nothing else about `actionsBarBelow`.

## 5.47 — Chamber-OS addendum 54 (#152)

- **PageHeader `size="compact"`**: 26px below 640px and 32px from 640px, on a 1.2 line — the staff and list boards' title, so a company name such as "Siam Nordic Trading Co., Ltd." takes two lines on a 390px phone instead of three. The **default stays 28px / 36px** (1.15), so DxT Monitor and other apps don't change; pass `size="compact"` (Chamber-OS: in its header wrapper) where the boards draw 26 / 32.
- **`hero` steps to 36px from 1024px** (30px below), on a 1.2 line, as `hero-lg` does — the portal Main and Edit boards. `hero-lg` is unchanged (26px, then 36px).
- **`--aura-page-header-hero-space`**: the room above a `hero` or `hero-lg` title, default 16px, on top of the page's own padding (which belongs to the app). For the boards' 24px on a phone and 40px from 1024px inside AppShell's 24px / 32px content padding, set it to `0` below 1024px and `8px` from 1024px — or whatever your page padding needs.
- Under `lang="th"` titles keep their 1.4 line at every size. Checked at 390 and 1280px in English, Thai and Swedish and at a 32px default font size: nothing scrolls sideways.

## 5.46 — Chamber-OS addendum 53 (#151)

What Chamber-OS's own page header did that PageHeader didn't, so it can be rebuilt on PageHeader with its props kept:

- **`subtitle`**: a sentence under the title at body size (14px/1.7, the secondary colour) — "Members, plans and renewals for SweCham" — before `meta`, in a `div` (a loading skeleton's blocks are valid inside).
- **`titleAddon`**: a chip or badge on the title's line (a role, an invoice's status, "Archived"). Title and addon share a wrapping row, 12px apart (8px between lines); on a narrow screen the addon wraps under the title. It sits beside the heading, not in it, so the heading's name stays the title. Where `titleHideBelow` hides the title, the addon goes with it.
- **A chip eyebrow**: `eyebrow` that is not text (a StatusPill, a member number, badges) renders as a wrapping row in a `div`, 8px apart, 4px above the title as before. Text stays the mono `p`.
- **`size`**: `default` (28px, 36px from 640px), `hero` (30px on a 36px line) and `hero-lg` (26px, 36px from 1024px), the hero sizes with 16px more room above. Per page, `--aura-page-header-title-size` and `--aura-page-header-title-line-height` override any of them (staff pages at 26/32: set both). Under `lang="th"` the title keeps its 1.4 line, whatever the size or variable. The hero's 16px adds to the padding around it (AppShell's content, a Card), by design.
- **`focusTitleOnMount`**: the heading takes focus when the header mounts (`tabIndex={-1}`, `preventScroll`, no visible ring) — a page reached by a redirect, so a screen reader starts at its heading (WCAG 2.4.3). The main entry's PageHeader does it once, when it mounts; from `/server` the heading is focusable but not focused. Use it on pages reached by client-side navigation or a redirect, not on every page: on a first load it moves focus past a skip link, and a header that stays mounted while its title changes doesn't refocus — key it by the page (`key={pathname}`) if it must.
- **`actionsAlign`**: `end` (default) lines the actions up with the bottom of the text, as before; `start` with its top — the title, when there is no breadcrumb or eyebrow.
- Confirmed, no change: the text column's `flex: 1 1 320px` keeps a long title at least 320px wide; wide actions drop under it (checked at 700px). On a phone `actionsFullWidthBelow="sm"` shares the row between actions.
- Checked at 390 and 1280px in English, Thai and Swedish, and at a 32px default font size: nothing scrolls sideways.

## 5.45 — Chamber-OS addendum 52 (#150)

- **PageHeader `actionsBarBelow`** (#150): `'sm' | 'md'` — below 640px or 768px the header's `actions` become a bar fixed to the bottom of the screen (from 5.48 ActionBar's edge strip, `actionsBarLook="floating"` for this card; above a BottomNav, clear of the home indicator), and `actionsStatus` is its status line ("Total 10,700.00 THB incl. VAT · due 22 Oct 2026", a polite live region shown only in the bar).
  ```tsx
  <PageHeader title="Invoice SC-2026-900001" actionsFullWidthBelow="sm" actionsBarBelow="sm"
    actionsStatus="Total 10,700.00 THB incl. VAT · due 22 Oct 2026"
    actions={<>
      <Button variant="secondary" touchHeight>Issue credit note…</Button>
      <Button variant="secondary" touchHeight>Issue refund…</Button>
      <DropdownMenu trigger={<IconButton icon="ellipsis" label="More actions" variant="outline" touchHeight />} items={…} />
    </>} />
  ```
  - **Rendered once**: it is the same element moved by CSS, not a copy or a portal — a dialog trigger, its state and its test id exist once at every width, and in the tab order the actions stay after the title.
  - **The page scrolls clear of it**: AppShell's content (or the body outside AppShell) gains the bar's height at its end, and `scroll-padding-bottom` keeps a focused field above it. The main entry's PageHeader measures the bar (`--aura-page-actions-height` on `<html>`); the `/server` one renders the same markup and the CSS assumes 7rem until a client PageHeader takes over.
  - **Layout**: the status line takes the first row. With an IconButton among the actions they share the next row as #149 — text buttons wrap their labels inside, the icon keeps 44px at the end, vertically centred. With only icon buttons (a read-only role's ⋯) the status and the icons share one row (62px against 93px stacked). Text actions alone wrap as ActionBar's do, the main one last.
  - From the breakpoint up nothing changes. One per page: the bar is fixed, so two would overlap (a development notice says so). Not beside an ActionBar either: use one bottom bar. With no `actions` (a role that may do nothing) there is no bar and no space reserved.
  - The bar is `position: fixed`, so no ancestor of the header may have a `transform`, `filter`, `backdrop-filter`, `will-change: transform`, paint/layout containment or `content-visibility: auto` (some page-transition and frosted-glass wrappers add one); it would be placed against that ancestor, off screen. The main entry's PageHeader warns in development.
  - Reading and Tab order stay the header's: the actions come after the title and before the page content, as they do from the breakpoint up. Below `lg` AppShell's sidebar is a drawer, so the bar spans the screen with 16px margins.
- **The ⋯ is centred** (addendum 52): beside two-line buttons the IconButton in `actionsFullWidthBelow` (#149) now sits at the row's vertical centre, not its top.

## 5.44 — Chamber-OS addendum 51 (#149)

- **PageHeader `actionsFullWidthBelow` with an icon button keeps one row** (#149): when the actions include an IconButton (a ⋯ DropdownMenu trigger, bare or wrapped), below the breakpoint they are one bar. The row no longer wraps; the text buttons share what the icon leaves and wrap their labels inside the button (two or three lines, centred, `overflow-wrap: anywhere` with hyphenation, never an ellipsis), growing taller rather than wider, at least 44px with `touchHeight`; a pill that grows past one line gets 22px corners instead of becoming an oval. Hyphens appear only where the browser has a dictionary for the page's `lang` (Safari, Android); elsewhere a long word breaks where it must, so keep phone labels short. The icon keeps its size at the end of the row. Measured on an invoice page at 393 and 320px in English, Thai and Swedish: nothing clipped, no sideways scroll. Actions without an icon button wrap onto rows as in 5.37 (DxT Monitor's two-plus-one); a header that mixes text and icon buttons (e.g. Mute, Edit, ⋯, Open site) is now one row at 320px where it was two. Needs `:has()`; older browsers keep the 5.37 layout.
- **IconButton `variant="outline"`**: a secondary Button's 1px border, so a lone ⋯ reads as a button beside outlined actions. Default `ghost` (no border).

## 5.43 — Chamber-OS addendum 50 (#148)

- **FilterBar `collapseBelow` with no search** (#148): below the breakpoint the Filters button fills the row it would otherwise sit at the end of, its label centred (an activity timeline with filters and no search). With a search it stays beside it, as in 5.42. From the breakpoint up nothing changes. Remove a stand-in such as `[&_.aura-filterbar__more]:flex-1`.

## 5.42 — Chamber-OS addendum 49 (#146–147)

- **Fields no longer widen a phone at a large default font** (#147, a 5.40 regression): an `<input>`'s 20-character size grew with the browser's font size, so at a 32px default FilterBar's search measured ~450px and a 390px page scrolled sideways; so did a TextField, Combobox, DatePicker or NumberField in a grid cell or flex row without `min-width: 0`. The text box now never asks for more than the room it gets (`.aura-input` has `min-width: 0` and its control a percentage width, so its smallest size is zero) while its natural width is unchanged. At the 16px default a page lays out as in 5.41 unless a field was already wider than its room: we compared every Storybook story at 390 and 1280px pixel for pixel, and the only differences are fields that used to stick out of their grid cell or row, which now fit (a touch-height Combobox in a 390px FilterBar, a time-zone field in a two-column grid). A row of nowrap Buttons or a SegmentedControl can still be wider than a phone at 32px; give such rows `wrap` (Stack) or `fullWidth`.

- **FilterBar `collapseBelow`** (#146): `'sm' | 'md'` — below 640px or 768px the filters passed as `children` fold into one **Filters** button at the end of the search's row ("Filters (2)", read "Filters, 2 applied"; `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`), as tall as the search, so it follows `touchHeight`. The search, the applied chips, Clear all, `resultCount` and `actions` stay in the bar; the count and actions wrap under the search row. The number is the count of `filters` (chips); `filterCount` overrides it.
  ```tsx
  <FilterBar collapseBelow="sm" touchHeight search={q} onSearchChange={setQ}
    filters={chips} onClearAll={clear} resultCount={total}>
    <FilterSelect label="Status" … />
    <FilterDateRange label="Submitted" … />
  </FilterBar>
  ```
  The button opens a **Filters** sheet (AURA's Dialog, a bottom sheet on phones) with the same children one per row at full width, 44px, labels showing: a FilterSelect is a labelled Select there (its "all" choice in full words) and a FilterDateRange shows its name above a full-width face. A toggle Tag, a Button or a SegmentedControl keeps its own width. Every change applies at once, as in the bar — there is no Apply step. The footer has Clear all (while chips exist) and **Done**; Done, Escape and the scrim close it and focus returns to the button (in Safari too). Widening past the breakpoint with the sheet open closes it.
  The children render in one place at a time — the bar (hidden below the breakpoint) or, while it is open, the sheet — so a controlled filter is never doubled; they mount again when they move, so keep their state with the page (`value` + `onChange`, the URL), not in `defaultValue`. A bar with no children (search only) shows no button; without the prop nothing changes. Server HTML is the bar with the button closed. New strings `filtersApplied(n)` and `done` (th: ตัวกรอง, ใช้อยู่ 2 รายการ · เสร็จสิ้น; sv: Filter, 2 aktiva · Klar), and a `sliders-horizontal` icon (71 in all).

## 5.41 — DxT Monitor requests 19–22

- **No menu button on a page with a back arrow** (request 19): put `data-aura-hide-menubutton` on any element of the page (as with `data-aura-hide-bottomnav`) and AppShell's phone bar drops its menu button, giving the title its room (a shell with no `header` then has no bar on phones). The drawer stays reachable from pages without the mark. A browser without `:has()` keeps the button.
- **PageHeader `titleHideBelow`** (request 20): `'sm' | 'md' | 'lg'` — below that width the title is visually hidden but stays the page's heading for screen readers, and the breadcrumb and eyebrow are hidden; the meta line then starts the header, or the actions when there is no meta (with neither, the header takes no room). For phone layouts that show the title in the top bar. Stateless, `/server` too.
- **Menu links that open a new tab say so** (request 21): a Menu or DropdownMenu item with `href` and `target="_blank"` is named "Visit site (opens in a new tab)" — the words are visually hidden, after the label, in the locale's language (`opensInNewTab` in the strings: เปิดในแท็บใหม่, öppnas i en ny flik). A custom `strings` pack without the key falls back to the built-in words. Other links you give a `target` (Breadcrumb, Tabs, DataTable rows) don't add it yet; give their label the words yourself.
- **Menu triggers look open while their menu shows** (request 22): an IconButton, secondary or ghost Button with `aria-haspopup` and `aria-expanded="true"` (DropdownMenu, Popover and Dialog triggers) keeps its hover fill. A disclosure button of your own (`aria-expanded` without `aria-haspopup`) keeps its plain look.

## 5.40 — Chamber-OS addendum 48

- **Type follows the browser's default font size** (#145, WCAG 1.4.4). Every font size and px line height in `styles.css`, the `.aura-text-*` classes and `--aura-input-font-size` is now `max(<px>, <rem>)` — for example `max(13px, .8125rem)`. At the default 16px root nothing changes. When someone raises the browser's default font size (Settings → Font size, not page zoom), AURA's text grows with the app's own: at 32px a card's description, a Switch's description and a table cell are twice the size. Spacing, borders and control heights stay in px; boxes that hold text grow where they already could (fields, cards, rows with `rowHeight="auto"`), and one-line controls keep their height with larger text inside.
- An app that sets a smaller root (`html { font-size: 62.5% }`) keeps AURA's px sizes as a floor, so nothing gets smaller than before. An app with a fixed larger root (`html { font-size: 18px }`) will see AURA's text grow with it.
- Boxes with text that had a fixed height now have a minimum instead, so they grow with the text: Badge, the small SegmentedControl option, the calendar's month title (it wraps under the arrows rather than overlapping the weekdays), the DataTable footer (which also wraps the count and the pager) and BottomNav's count. Avatar initials stay in px, sized to their circle; the name is the accessible name.
- A smaller browser default never makes AURA's text smaller than its px size.
- A row `Stack` without `wrap` holding buttons or tags can run past a phone's edge at a large default size; give it `wrap`.

## 5.39 — Chamber-OS addendum 46

- **Tabs `touchHeight`** (#143): 44px tabs — buttons or links, underline or segmented — with `true` below 640px or on a coarse pointer (Button's rule), or `'always'` at every width. The count badge and icon stay centred on the label (above the 2px underline). The height is set on the tabs themselves, so fields in the panels keep their own size. Without it nothing changes.
- **Link tabs are as tall as button tabs.** A link tab (`href`) was 2px taller than a button tab — its 2px underline sat outside the height (38px instead of 36px in compact density, 46px instead of 44px on touch screens). Tests that measure link tabs will see 2px less.
- **FilterDateRange `touchHeight`**: a 44px face on its own, as FilterSelect's. A FilterBar with `touchHeight` already reaches it (checked for Chamber-OS's audit log filter row).

## 5.38 — Chamber-OS addenda 43–45

- **FilterBar and FilterSelect `touchHeight`** (#140): `true` makes the search (and its clear button) and every field-height control in the bar (FilterSelect, Select, Combobox, DatePicker and TimePicker with their buttons, SegmentedControl's options) 44px below 640px or on a coarse pointer — the same rule as Button's and TextField's `touchHeight` — and `'always'` at every width; `touchHeight` on one FilterSelect does the same for it alone. Without it nothing changes: the density's input height with a mouse, 44px on a coarse pointer. Buttons in `actions` take their own `touchHeight`. A SegmentedControl's track is 50px there (44px options plus its edge and padding), as with its own `touchHeight`. Opt-in rather than a new default, like every other `touchHeight`, so a narrow desktop window doesn't change size unasked.
- **`touchHeight` on Combobox, DatePicker, DateRangePicker, TimePicker and NumberField** (#141): the same values and rule as TextField's. The box is 44px and the buttons inside it (clear, chevron, calendar, steppers) take their touch-screen size — 44px wide, side by side, 40px tall — so none is a 32px target in a 44px box. A multiple Combobox now reserves room for both 44px buttons on touch screens too (chips used to run up to 24px under the clear button).
- **DataTable `rowProps`** (#142): `rowProps={(row) => ({ 'data-user-id': row.id, id: 'user-' + row.id })}` sets `data-*` attributes and an `id` on each row's element, in the grid and as a stacked card — for end-to-end hooks. Anything else it returns is ignored (a development warning names it) — `aria-*`, `role`, `className`, handlers, and `data-rc` (the table's own cell address) — so a row keeps its role, name, classes, selection and keyboard behaviour.

## 5.37 — DxT Monitor requests 17–18

- **PageHeader `actionsFullWidthBelow`** (request 17): `'sm'`, `'md'` or `'lg'` — below 640px, 768px or 1024px the actions take the whole row under the text, 12px apart, and the buttons share each line in equal widths (unless a label needs more), so they reach the page's edge: three buttons on a phone fill two rows (two halves, then one across) when their labels don't fit on one, and a single button spans the row. A button inside a DropdownMenu, Tooltip or Popover fills its share too; an IconButton (bare, or as a menu's trigger) keeps its square size — so a line with only IconButtons on it doesn't reach the edge (one that wraps alone sits at the start); put them on the first line. Labels don't wrap: a label wider than the row overflows, as before — keep phone labels short, or give that one Button `fullWidth`. For a fixed arrangement, pass your own grid as the one child — it spans the row too. Wider than the breakpoint, the actions hug their content at the end, 8px apart, as before. A class on the root, so it works from `/server` too. Apps that stretched the actions with their own selector (e.g. `max-md:[&>:last-child]:w-full`) can drop it.
- **SegmentedControl `touchHeight`** (request 18): 44px options — `size="sm"` too, icon-only options 44px square — with `true` below 640px or on a coarse pointer (the same rule as Button's and TextField's `touchHeight`), or `'always'` at every width. A phone-sized viewport with a mouse (or an emulated phone in end-to-end tests) now gets the touch size too. Without it nothing changes: options are as tall as a field beside them with a mouse, and 44px on a coarse pointer. DxT asked for "below md"; it follows AURA's other `touchHeight` props (below 640px) so a form's fields, buttons and choices change size together — at 390px it is the same.

## 5.36 — DxT Monitor requests 15–16

- **Focus rings in table cells** (request 15): a DataTable cell clips its text (ellipsis) but no longer the focus ring of a link or button in it. The clip has a 4px margin (`overflow: clip` + `overflow-clip-margin`), so content wider than its cell (a pill, a button) now shows up to 4px past its edge. In the first data column a focused link or button sits just above the row's sticky start gutter or pinned checkbox column (which painted over the ring's start side) — not while the table is scrolled sideways, and never above the sticky header, totals or pinned columns — and a plain `<a>` or `<button>` of yours in a cell gets AURA's ring instead of the browser's (zero specificity, so your own focus style wins). Safari has no `overflow-clip-margin`: there rings in cells are drawn just inside the control, whole. Apps that set `overflow: clip` on `.aura-table__td` themselves can drop it.
- **Right-aligned DataTable columns** (request 16): already there — `align: 'end'` on a column right-aligns its header (label and sort arrow) and every cell, with tabular figures, in default and `rowHeight="auto"` rows, totals and skeleton rows. Stacked cards keep each value under its label, start-aligned, by design. Now covered by tests and documented here.

## 5.35 — DxT Monitor requests 11–14

- **Breadcrumb touch targets** (request 11): on a touch screen (`pointer: coarse`) every crumb link or button (and "…") gets a hit area 44px tall and as wide as its text plus 24px; the text doesn't move. It reaches 12px into the gutter on each side, so short neighbours never share a spot, and only 4px below the text, so it stops short of a PageHeader title right underneath — the rest of the height is above, so keep about 20px clear above a breadcrumb (AppShell's content padding already is). When the crumbs wrap, the rows sit 24px apart on touch screens so one row never covers the next. The current page (not a link) gets none; a link component must render its `<a>` directly in the crumb's `li`. Apps that added their own `.aura-crumbs a::after` rule should drop it.
- **StatusTile `status="unknown"`** (request 12): for a thing with no data yet (a site before its first check) — a dashed circle (circle-dot-dashed) in `aura-fg-tertiary` on the plain surface and border, status word "No data" (th: ยังไม่มีข้อมูล, sv: Ingen data), value in the text colour. An unrecognised `status` now shows as unknown rather than OK, with a dev warning.
- **AppShell `headerHideOnScroll`** (request 13): below 1024px the top bar slides up out of view while the page scrolls down (after it has moved past the bar's height and kept going 8px) and comes back after 8px up, near the top, and whenever focus enters it. `--aura-shell-bar-height` is 0 while it is away, so a sticky table header pinned under the bar moves up with it. No slide with reduced motion. The page must scroll the window (AppShell's does).
- **BottomNav `hideOnScroll`** (request 14): the same for the tab bar, sliding down. Its spacer stays (nothing shifts) and `--aura-bottomnav-offset` drops while it is away, so viewport ActionBars and toasts follow it down. **ActionBar `hidesBottomNav`**: while that bar is on the page the BottomNav and its spacer are gone and the bar sits on the bottom edge — for a page whose own actions (Acknowledge, Visit site) replace the tabs. Any element can do the same with `data-aura-hide-bottomnav`.

## 5.34 — StatusTile, TileGrid, Sparkline (DxT Monitor Overview S06)

- **StatusTile**: one monitored thing. `status` (`down` / `problem` / `maintenance` / `ok`) sets an icon *and* a tint and border — red, amber, violet or the plain surface — so colour is never the only sign (circle-alert, triangle-alert, wrench, circle-check). `title` wraps to two lines at most, then ends with "…" (never one cut line, so similar names stay apart); a cut title shows its full text in AURA's tip on hover. `value` sits top right in tabular figures, 600, in its own tone (`valueTone`; default the status's: a Down duration is red). `meta` is a short second line; `markers` (`[{ icon, label, tone? }]`) are small icons at its end, each named and showing its label as a tip on hover. A tip needs a mouse, so on a phone a marker is a hint only: say what it means on the detail page (or in `meta`) too. `href` makes the whole tile one link with a focus ring; its accessible name is everything the tile says, in reading order — "api.example.co.th, Down, 12m, since 09:41, SSL expires in 5 days" — taken from the content (screen-reader-only status word and commas) rather than an `aria-label`, so it always matches what is shown (WCAG 2.5.3). `statusLabel` overrides the status word (th: ล่ม / มีปัญหา / ปิดปรับปรุง / ปกติ). In a TileGrid cell narrower than 226px (two columns on a phone) the value moves under the title in every tile alike; a tile elsewhere (a flex row, a card) keeps the value top right. The hidden status word and commas are text, so `innerText` and a copy include them; a labelled Sparkline in `meta` joins the link's name. Light and dark use the Alert tokens.
- **TileGrid**: a `ul` of equal columns 8px apart, each child (and each child of a Fragment) one `li`; tiles in a row are as tall as the tallest. `columns` is responsive like Grid; default `{ base: 2, md: 3 }`. Pass `aria-label` to name the list.
- **Sparkline**: `data` oldest first; `null` (or anything not a finite number) is no point and breaks the line, and a point with no neighbour is a dot. `failed` (booleans by index) with `failures="band"` (a light red band behind the point) or `"ticks"` (a red tick at the foot); default `none`. `tone` (neutral, accent, danger, warning, positive), `size` `sm` 80×24 (default) or `md` 120×32, `min` / `max` to put several on one scale (values beyond them are drawn at the edge). `label` makes it `role="img"` with that name — summarise what the line shows, e.g. "Response time, last 24 h: 180–420 ms, 2 failed checks"; without one it is decoration, hidden from screen readers.
- All three are stateless and also exported from `/server` (the tile's status word is English there unless `statusLabel`; marker tips need the client entry on the page).

## 5.33 — DxT Monitor requests 5–8

- **Hover shows on the canvas** (request 5): in light, `aura-bg-surface-hover` is zinc-50 — the canvas itself — so SideNav's rows, an IconButton or ghost Button in its header or footer (Sign out), and the same on the page's canvas (PageHeader actions, Pagination, a selectable Tag) showed no hover. A new token, `aura-bg-canvas-hover` (zinc-100 light, zinc-800 dark), is the hover inside AppShell and SideNav; cards, tables, inputs, the top bar, dialogs, drawers and popovers inside them keep `aura-bg-surface-hover`. Hover fills now read `--aura-hover`, falling back to the surface hover: outside AppShell, set `--aura-hover: var(--aura-bg-canvas-hover)` on your own canvas-coloured area.
- **AppShell `headerHideFrom="lg"`** (request 6): the top bar, `header` and all, shows only below 1024px — where the menu button is — as a header-less bar does: from lg up it is hidden and `--aura-shell-bar-height` is 0. For apps whose phone pages draw a top bar (brand, avatar) and whose desktop pages don't. Default: the bar shows at every width.
- **PageHeader `breadcrumb`** (request 7): a `<Breadcrumb>` above the title, 4px from it like the eyebrow, in its own `div` — a `nav` can't sit in the eyebrow's `p` (invalid HTML, a hydration error) — with Breadcrumb's own 13px sans. With an eyebrow too, the breadcrumb comes first.
- **Phone drawer header = bar height** (request 8): in AppShell's phone drawer, a SideNav with `headerDivider` takes the top bar's height (56px, or more when the bar's header wraps), content centred, so its line meets the bar's line beside it; the close button is centred on it. The fixed desktop sidebar keeps 72px.
- **Also:** the nav drawer's close button is a 44px target on phones and touch screens (the header leaves it 60px); the divided header's layout no longer needs `:has()` (older Safari and Firefox centre the close button too); a DatePicker's or read-only Select's toggle shows its hover on the grey read-only ground.

## 5.32 — Icon tips, PageHeader, SideNav header divider, pill skeletons (DxT Monitor requests 1–4)

### DxT Monitor requests 1, 3, 4

- **SideNav `headerDivider`** (request 1): a full-width 1px `aura-border-default` line under `header`, with the board's metrics — the header at least 72px tall, its content 20px from the top and start, the line at its foot, 16px before the first item. The collapsed rail keeps its 8px sides. Without `header` it does nothing. Default `false`; the plain header is unchanged.
- **PageHeader** (request 3): `<PageHeader eyebrow="Monitor / Sites" title="Sites" meta="12 sites · updated 2 min ago" actions={…} />` — eyebrow in mono 12/1.7, the title an `h1` (`headingLevel` 2 or 3 when the page already has one) in the display face at 36/1.15, weight 600, -0.01em (28px below 640px; a 1.4 line under `lang="th"`), meta 13/1.5, 4px between them, actions at the end on the text's last line, at least 24px away, wrapping under the text on a phone. `titleId` names the heading for `aria-labelledby`. It has **no outer padding**: inside AppShell, the content padding is the page margin (16/24px on phones, 24px from 640px, 32px from 1024px) — don't add your own. Stateless, so `/server` exports it too.
- **Skeleton `variant="pill"` and `variant="badge"`** (request 4): a StatusPill's size (20px tall, 22px under `lang="th"`, 72px wide) and a Badge's (20px in every language, 56px wide), fully rounded, so a loading list's grey pills don't move the row when the real ones arrive. `width` sets the width.

### Icon tips (request 2)

- **IconButton, Pagination's arrows, an icon-only SegmentedControl option and a cut Tag** show their name in AURA's own tip instead of the browser's `title`: themed (light and dark), Thai-sized under `lang="th"`, shown on hover after 400ms (at once while another tip is up) **and on keyboard focus** (the native title never showed for keyboard or touch users), hoverable (WCAG 1.4.13: it stays while the pointer is over it, yet lets clicks and hovers through, so it never covers the ⋯ in the row above), hidden by Escape (inside a Dialog or Drawer, Escape closes that, and the tip with it), a press, blur or leaving. A tip opened by keyboard focus stays until focus moves, whatever the mouse does. It flips below at the top of the screen, stays on screen, and goes when its element leaves the page.
- One tip and one set of document listeners serve the whole page — no state per button — so a DataTable with a ⋯ in every row costs nothing. The elements carry `data-aura-tip`; the tip is `aria-hidden` and never joins `aria-describedby`, because it repeats the accessible name (a screen reader hears it once).
- No tip when the button is already wrapped in `<Tooltip>` (that one speaks), when it is a menu trigger with its menu open, or when you pass your own `title` to IconButton (kept as a native title).
- **Tests that looked up the `title`** (`getByTitle`, `toHaveAttribute('title', …)`) on these elements should use the accessible name (`getByRole('button', { name })`) or `data-aura-tip`.

## 5.31 — Chamber-OS addenda 41–42

- **`labelAddon` on TextField, Textarea and PasswordField** (item 138): a node between the label and the box, in the field's 6px gap — e.g. the phrase to type on a typed confirmation, as a chip with a copy button, so it is read before the box and can be copied. The hint and error stay below the box. The addon's box is `.aura-field__addon` with the id `{id}-addon`, and that id comes first in the input's `aria-describedby` (then the error or hint, then your own `aria-describedby` ids), so a screen reader reads it after the label; keep any button names in it short ("Copy"). `labelAddonDescribes={false}` keeps it out — for an addon that isn't a description (a "Forgot password?" link), or to name only part of it (give that part an id and pass it in `aria-describedby`); ids are never repeated. A focusable control in it comes before the input in tab order; clicking the label still focuses the input. `Field` takes `labelAddon` too, for a custom control (add `{id}-addon` to that control's `aria-describedby` yourself). The other fields (Select, Combobox, NumberField, the pickers, FileUpload) don't take it yet. Unset, nothing changes.
- **"Chosen" follows the brand** (item 139): `createTheme`, `<ThemeStyle>` and `npx aura-theme --brand` now emit `--aura-control-checked-bg` / `-fg` for light and dark, so a themed product's checked box, radio dot, switch, active tab underline, current page, selected day and year, completed step and checked menu item match its links and focus instead of staying violet. Light is the theme's accent itself; dark is the brand's 300 step, lightened to at least 3:1 on the dark surface and canvas (as AURA's own violet-300). The mark on it is white or ink, whichever reads better; both are in the theme's contrast checks (fill 3:1 on surface and canvas, mark 4.5:1 on the fill). In aura.css the light `--aura-control-checked-bg` is now `var(--aura-accent-violet)` (the same violet-700 by default), so a hand-written `:root` override of the accent carries it too; a scoped override needs the generator, or both tokens. Unthemed, nothing changes. Remove any hand-written `--aura-control-checked-*` stand-in after regenerating the theme.

## 5.30 — Visual polish (audit, Oct 2026) and Chamber-OS addenda 38–40

One release: everything below ships together in 5.30.0.

### Menus stay open on scroll; StatusPill weight (addenda 39–40)

- **An open menu follows its trigger** (item 136): DropdownMenu and every menu built on it (DataTable's row ⋯ and column menus) now move with the trigger on scroll and resize — a slight finger drag during a tap, the phone's address bar or keyboard no longer close it, as Popover already behaved. It closes once the trigger is wholly out of view (the page's, or a box around it that clips it — a fixed bar inside a scrolling wrapper isn't clipped by it, and `overflow-x: clip` only clips sideways), without taking focus back so the page doesn't jump; inside a Dialog or Drawer focus goes back to the trigger without scrolling, so it stays in the dialog. Escape, a pointerdown outside and choosing an item close it as before, with focus back on the trigger. No new prop.
- **StatusPill is 500 (medium)** (item 137) wherever it sits — before, it took its parent's weight (regular beside a heading, bold inside bold text). Badge stays 600, so the two stay distinct.

### 44px fields and choice rows (addendum 38)

- **`touchHeight` on TextField, Textarea, Select, RadioGroup and Checkbox** (item 135): `touchHeight="always"` gives a 44px input box and 44px choice rows at every width — also with a mouse and inside `density="compact"` — for a form whose spec asks for 44px targets everywhere (Chamber-OS's issue dialog: zero-rate radios, certificate number, typed phrase). `touchHeight` (`true`) does it only below 640px or on a coarse pointer, as Button's `touchHeight`; touch screens already had 44px fields and rows. A one-line option's label is centred in its row (a Checkbox row is 45px: its label sits on a 21px line); a row with a description grows. On a Checkbox it applies to a labelled box; a bare box uses `hitArea`. Textarea accepts it too, but is always at least 96px tall, so nothing changes there. In a horizontal RadioGroup each option keeps its own height (one-line options stay centred beside a taller one with a description).
- **How:** the field's root gets `is-touch-always` / `is-touch`, which sets its own `--aura-input-height` to `--aura-touch-target` (44px) — any control inside that reads the input height follows, whatever density is around it. Label, hint and error ids are unchanged; Button's `touchHeight` is unchanged.

### Visual polish, part 2

- **"Chosen" is violet everywhere** (audit item 4): a checked Checkbox or Radio, a Switch that is on, the active Tab's underline, the current Pagination page, the selected Calendar day and year, a completed Stepper step and a checked menu item use the new `--aura-control-checked-bg` / `-fg` (violet-700 with a white mark in light, violet-300 with a zinc-900 mark in dark). Buttons stay ink / off-white. A disabled Switch that is on keeps its whole violet track (faded, it fell under 3:1 from a disabled one that is off) and fades its thumb instead.
- **Tables say when they scroll** (item 9): a Table wider than its box shows a soft shadow at the edge with more to scroll (CSS only, `--aura-scroll-shadow`; body rows show it, the header band and totals rows cover it; set `--aura-tbl-bg` if you give the box another ground); a DataTable with columns past its end edge shows the same shadow over the grid's end edge, inside its scrollbars (`has-more-x`), until scrolled to the end. Stacking stays opt-in (`stackBelow`) — no layout changes by default.
- **Table columns are never squeezed to one letter** (item 8): from 640px a cell is at least 10ch wide; a longer word (an email, a URL) still breaks to fit rather than widening the table; numbers already stay on one line. Phones are unchanged (a table still fits its box): give a table that is too wide for a phone `stackBelow`.
- **Totals** (item 20): a 2px rule in the hairline colour over the totals (DataTable and Table), not the strong border that glared in dark; with several totals rows the last is 14px bold; a pinned DataTable totals row casts a soft shadow over the rows under it.
- **SegmentedControl** (items 11–12) is as tall as a field with a mouse (`--aura-input-height`: 44px, 36px in compact; `size="sm"` unchanged; icon-only options stay square; on touch screens each option is 44px, as before), and the selected option is 600 weight on its own thumb colour (`--aura-segmented-thumb-bg`), which is lighter than the track in dark instead of darker.
- **FilterSelect** (item 11): from 640px the face has a field's inset and 14px text, like the search box beside it; phones keep the tight face so three filters and a chip share a row.
- **Smaller fixes**: the show-password button is fg-secondary like a field's other icons (item 14); a removable Tag's × is 14px (item 17); a plain link (no class) inside a Card, Stat, Alert, EmptyState, field, tab panel, AppShell main, table or Dialog takes the accent colour, at zero specificity so your own link rules win (item 18).
- **Not changed, on purpose**: a ghost button that starts an ActionBar keeps its box at the bar's edge (Chamber-OS 116 relies on it); the Progress track keeps its 3:1 edge (WCAG 1.4.11); DatePicker's calendar button and TimePicker's clock stay where they are (one is a button, one a label icon).
- Size budgets: `styles.css` 32 kB, DataTable 21 kB, `aura.bundle.js` and the whole package 66 kB.

### Visual polish

A visual audit of every Storybook story in light, dark and at 390px. This release takes the system-wide fixes; colour hues and layout defaults are unchanged.

- **Dark mode:** the primary button, checked box, selected day, completed step, `bg-surface-strong` and `bg-inverted` (tooltips, counts) are off-white `zinc-200` instead of pure white, which was the brightest thing on a dark page. Primary hover is `zinc-100`.
- **Status fills:** Blocked is `red-800` in light (quieter in a long table, and further from the lime Ready fill); Warning is `amber-600` in dark too (amber-500 glowed). Ready, Warning and Blocked still differ by lightness, not only hue.
- **Neutral fills show on the light canvas:** `--aura-status-neutral-bg` is `zinc-200` (was `zinc-100` on a `zinc-50` page), so the neutral StatusPill, tab counts, Avatar and SideNav initials are one step darker in light. The neutral Badge and the EmptyState icon disc use it too.
- **DataTable header band** has its own token, `--aura-table-head-bg`: the canvas in light, `#111114` in dark — between the page and the card, so it no longer reads as a hole. Table's header and totals rows (also the totals card) and DataTable's totals row use it.
- **Disabled filled buttons** (primary, danger, creative) use new tokens `--aura-button-disabled-bg` / `-fg`: a grey fill with muted text at full opacity, not a faded copy (faded red read as pink, faded ink as a separate grey button); the creative shadow goes. Secondary, ghost and danger-secondary keep the fade. In forced colours every disabled button shows GrayText and the fade.
- **Buttons are always the AURA sans** (`font-family: var(--font-sans)`), also outside a root that sets the font. An app that sets its own font on `body` should set `--font-sans` too, or its buttons stay Inter.
- **Table caption** has 12px below it, so it no longer touches the header.
- **DataTable skeleton action bars** take the button's own shape (`--aura-button-radius`).
- **Thai:** where the language is Thai (`lang="th"` on the page or a part), StatusPill, Badge and tab counts are 12px (the loading pill matches), BottomNav labels 12px, Stepper descriptions 13px with a 1.6 line, SideNav labels on a 22px line, field labels, hints and errors on a 1.6 line, Radio and Checkbox descriptions 13px on a 1.6 line, and a stacked card's field labels 12px. A `lang="en"` part inside keeps the Latin sizes. These follow the `lang` attribute, not `AuraProvider locale`: set `<html lang="th">` (Next.js: the root layout's `<html lang>`), so portals (Dialog, Menu, Popover) get it too.

## 5.29 — Chamber-OS addendum 37

- **DataTable loading rows match the rows they stand in for** (item 134), so the layout doesn't jump when the rows arrive:
  - **Height:** with `rowHeight="auto"` skeleton rows get the same `--auto` class and minimum height as real rows. A column's new **`skeletonLines`** (default 1, at most 10; a `pill` column keeps one pill) draws that many bars, one per text line — `skeletonLines: 2` for a reason and its evidence. On an `align: 'end'` column they line up at the end. Each bar sits on a 20px body line in the grid (a caption line is 16–18px, so a row can come out a few px taller than the real one) and on the 15px value line in a card.
  - **Stacked cards:** skeleton cards keep each field's label (`data-label`) above its bar, as a real card does.
  - **Row actions:** an `actions` cell draws one square and a `card: 'footer'` cell a bar across the cell (in a card, the full row, as a Button there fills it), at the small button's height (32px), in the grid as well as in cards. When the column's buttons use `touchHeight`, give the column the new **`skeletonTouch`**: its bars are then 44px below 640px and on a coarse pointer, as those buttons are. A footer that holds only an IconButton still gets the full-width bar; the heights match.
  - **Unchanged:** skeleton rows stay `aria-hidden`, the pulse stops under reduced motion, `skeletonRows`, `bleed` / `bleedEnd`. Without `rowHeight="auto"` the grid's skeleton rows keep the fixed row height.

## 5.28 — Chamber-OS addenda 35–36

- **Applied-filter chips show their whole text** (item 132): in `FilterBar`'s chips row a chip takes its text's own width ("Submitted: 28 Aug – 3 Sept 2026", "Member: Midsommar Hospitality Co., Ltd."); only a chip wider than the row is cut, with an ellipsis, and a long chip never widens the FilterBar or its parents (the chips row takes its width from the bar; a bar holding only chips needs a width from its parent, as a block has). A Tag outside FilterBar keeps its 24ch cap. **Whenever a Tag's text is cut** — the 24ch cap or the row — the full text shows on hover (`title`) and, on a removable Tag, in a Tooltip on the remove button's hover and focus; the remove button's name already carries the full text for screen readers. On touch screens a cut chip can't be hovered — keep labels short enough for a phone row where you can.
- **"Clear all" has a touch height** (item 133): FilterBar's own "Clear all" is at least 44px tall below 640px and wherever the primary pointer is coarse, as Button's `touchHeight`; with a mouse from 640px up it stays the compact link. Its look (accent, underline) and place are unchanged.

## 5.27 — Chamber-OS addenda 33–34

- **`bleed` reaches through your own wrappers** (item 130): a bleeding DataTable or Table now spans the Card from anywhere in its content — inside a `flex flex-col gap-4` column, a container-query `div`, a `role="tabpanel"` — as long as those wrappers add no padding or frame and don't clip or scroll (`overflow` other than `visible`): a padded wrapper leaves the table short of the card's edge by that padding, and a clipping or scrolling one cuts it off or adds scrollbars. A nested Card resets the reach to its own padding. The last-content rule is unchanged: only a table that is the Card content's direct, last child drops its bottom rule automatically; inside wrappers pass **`bleedEnd`** when nothing follows the table in the card (and the Card has no `footer`), and the card's radius closes it. Without `bleedEnd`, a pager or link after the table keeps the rule; don't pass `bleedEnd` then, or what follows is pulled up over the table. Still nothing below `flushBelow` or outside a Card.
- **`Container` from `/server`** (item 131): it is stateless, so `@jirawatpyk/aura-react/server` exports it next to Card and EmptyState, and a Server Component can render the page column without becoming a client reference. Same HTML as the root export.
- **The override guarantee covers padding** (item 131): with `styles.layer.css`, utilities that set a Container's `padding` (e.g. your own gutter, `px-[var(--page-padding-x)]`) win as well as `max-width` and `margin`, also directly inside a padded AppShell where AURA zeroes the side padding. `check:tailwind4` tests it at 700px, between AURA's 640 and 1024px steps.

## 5.26 — Chamber-OS addenda 28–32

One release: everything below shipped together in 5.26.0.

### Table `stickyHeader` (addendum 32)

- **Table `stickyHeader`** (item 129): the header row stays in view while the rows scroll — its band, the rule under it (drawn as an inset shadow, which moves with it) and above the body. Default off. **What it sticks to:** without `maxHeight` it pins to the page's scroll, under an AppShell's top bar (`--aura-shell-bar-height`: 56px with a `header`; 0 without a bar, and 0 from 1024px in a menu-only shell); set `--aura-table-sticky-top` for another offset — `0px` inside your own scroll container within an AppShell (Dialog and Drawer need nothing), or use `maxHeight` there. To pin to the page the box can't be a scroll container, so it clips sideways instead; a table wider than its box (JavaScript marks it) scrolls sideways as before and then its header can't pin to the page — give such a table `maxHeight`. With **`maxHeight`** (px or any length, e.g. `60vh`) the box scrolls both ways, its header pins to the box's top, and the box becomes a focusable region for the keyboard, named by the `caption` or `aria-label` (development builds warn without one). Under `bleed` the pinned band spans the card's inner width. One header row pins; a header with several rows isn't supported. Stacked rows (`stackBelow`) have no visible header, so it does nothing there (`maxHeight` still caps and scrolls them).
- **DataTable's header** is sticky inside DataTable's own scroll box, which scrolls vertically only with `height`; without `height` it does not pin to the page. Unchanged here.

### `FilterDateRange` (addendum 31)

- **`FilterDateRange`** (item 128): a compact date-range filter for `FilterBar`. Its face matches `FilterSelect`'s — the name, the value, a chevron ("Submitted Any time", "Submitted 1 – 30 Sept 2026") — at the same height, wrapping with the others on a phone. One click opens the range calendar in a popover, as DateRangePicker's opens (also on phones). Optional `presets` (`{ label, range }[]`: Last 7 days, This month…) sit beside the calendar (above it on phones) with an "Any time" choice that clears it. `onChange` runs once a range is complete, a preset is picked or the range is cleared — never on a lone start day — so it can write `?from=&to=` directly. The face is one button named with both parts ("Submitted: Any time"), with `aria-haspopup="dialog"` and `aria-expanded`; the popover is a dialog named by the filter, Escape closes it without a change and focus returns to the face. Dates as DateRangePicker: the provider's `locale` and `calendar` (Thai shows Buddhist-era years, on the face too), `min` / `max`, `timeZone`, `today`, `weekStartsOn`, `isDateDisabled`. The face shares what both ends share ("25 Sept – 3 Oct 2026"). A preset reaching past `min` / `max` is disabled; picking the range already chosen just closes. `data-*`, `aria-*` and `style` reach the face. There is no typed input and no form field (no `name`): write the range in `onChange`, or use DateRangePicker where a form field is wanted.
- Budget raised on purpose: styles.css 28 → 30 kB.

### `bleed` (addendum 30)

- **`bleed` on DataTable and Table** (item 127): edge to edge inside a Card — a list card with its filters in the card's padding and the table across its full inner width (Polaris IndexTable, GitHub issues). As a direct child of the Card's content the table loses its side borders and radius and is pulled out by the card's padding; its header band and top rule stay, and cell text stays level with the card's content (DataTable's 24px gutter, Table's 24px outer cells). When it is the card's last content (no Card `footer`, nothing after it) the bottom rule goes too and the card's radius closes it; a pager or footer after it keeps the rule. Below the Card's `flushBelow` width, and outside a Card, it does nothing; stacked rows inside a framed Card keep its padding. In 5.26 it needed to be the Card content's direct child; since 5.27 it also reaches through unpadded wrappers. The reach is the Card's padding token: change a Card's padding with `--aura-card-padding` (with a unit, `0px`), not a padding utility, or the table overshoots or falls short; `flushBelow` with `max-sm:p-0` is fine. On phones (<640px) a Card without `flushBelow` has 16px padding while DataTable's gutter stays 24px, so its text sits 8px in from the card's content there; Table's outer cells stay 24px too.
- **DataTable `bordered={false}`**: drops the frame (border and radius) and keeps the header band and the 24px gutter, for a table in a section that doesn't bleed. Table's `bordered={false}` is unchanged.
- Budgets raised on purpose: the whole library and the `window.Aura` bundle 62 → 64 kB.

### Descriptions are read after the name

- **Accordion, Combobox and Command** follow 5.26's RadioGroup: an item's `description` was part of its accessible name ("Fees Two unpaid invoices", "Acme AB Stockholm · Corporate"). Now the name is the title or label alone and the description is read after it (`aria-describedby`). An Accordion panel is named by its title. A Command item keeps its shortcut in its name ("New invoice N I"), as before. The heading around an Accordion header is named by the title too. An Accordion title is now always one inline line (a `Badge` in a rich title stays beside the text instead of taking its own stretched row). Otherwise the layout is unchanged, and items without a description are named as before. Tests that matched the joined text need the label alone plus `toHaveAccessibleDescription`.

### Container (addendum 29)

- **Overriding a Container's width and margin is supported** (item 126; padding too since 5.27): with `styles.layer.css`, utilities that set `max-width` or `margin` on a `Container` (`max-w-[672px]`, `mx-0`, `ms-0`) win over `.aura-container`, and that is now a guarantee rather than a side effect. AURA keeps every `.aura-container` rule in `@layer aura`, never uses `!important` on it and never adds an unlayered rule for it; `npm run check:tailwind4` fails if a 672px column, centred or at the start edge, stops working at a 1400px page. With the unlayered `styles.css` the component wins instead (as for every component), so use `size` / `align` or the layered stylesheet. The side padding (16 / 24 / 32px at <640 / ≥640 / ≥1024) and its removal directly inside a padded `AppShell` are unchanged.
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
| **Icon names as strings need `registerIcons`.** The name map (~3.4 kB gzip) leaves the default bundle. | Every component paid for all 71 icons. | Import icons as components: `icon={<IconUsers />}` from `@jirawatpyk/aura-react/icons` — `npx aura-icons-codemod src` rewrites literal names for you (`--dry` to preview; details below). Or keep names: `registerIcons(allIcons)` once at startup. |
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
- **Icons**: `server`, `globe`, `activity`, `shield-alert`, `phone`, `wrench` (70 in all; 5.42 adds `sliders-horizontal`).

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
