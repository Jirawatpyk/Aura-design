---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Chamber-OS Addendum 3, Group D (items 41–47).

- **DataTable totals** (item 41): `footer={{ key: content }}` adds a totals row with the body's widths and alignment (a Totals card when stacked); `stickyFooter` keeps it in view in a `height` table. Truncated cells show their full text in a tooltip on hover and keyboard focus.
- **Menu items** (item 42): `href` (rendered through `linkComponent`, role `menuitem`), `tone: 'danger'`, and `type: 'radio'` with `group` / `checked` (`menuitemradio` in a labelled group). DropdownMenu takes `linkComponent`.
- **ActionBar** (item 43): a sticky bar with a status line (always-present live region) and actions. `position="viewport"` floats above the home indicator and any BottomNav; `container` sits at the bottom of a card. Being sticky, it never covers the last field. Bulk variant: `selected` + `onClearSelection` ("2 selected · Clear"), hidden at 0.
- **BottomNav** (item 44): phone tab bar — icon + short label, count or dot, `aria-current="page"`, links through `linkComponent`, safe-area padding. Hidden from `lg` up in CSS with an in-flow spacer, so there is no shift before hydration. AppShell takes it as `bottomNav`. New tokens `bottomnav-height` (56px) and `z-bar` (800).
- **Today in a time zone** (item 45): `timeZone` on AuraProvider, DatePicker, DateRangePicker and Calendar, or `today` as an ISO date; `min` / `max` accept `'today'`. `todayIn(timeZone)` from the root and `/server`.
- **Tabs as links** (item 46): when every tab has `href`, Tabs render a `nav` of links (no tab panels) with `aria-current="page"`, through `linkComponent`; same look and scrolling.
- **Toast queue** (item 47): three on screen, the rest queued in order; nothing is dropped.

Tests: the layout test adds a five-tab BottomNav and an ActionBar at 320, 390 and 1280px (JavaScript off and hydrated); the Storybook suite covers every item, including axe on the open menu and a browser in UTC−08:00; the Next starter clicks link Tabs.
