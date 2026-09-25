---
'@jirawatpyk/aura-react': patch
'@jirawatpyk/aura-tokens': patch
---

5.1.1 — fixes from a full code review. No API is removed; two behaviours change on purpose (marked ⚠).

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
