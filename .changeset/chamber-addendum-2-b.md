---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Chamber-OS Addendum 2, Group B (items 30–35).

- **Touch** (item 30): on touch screens, menu items, page numbers, segments and calendar days are 44px, and Combobox / DatePicker toggles and the Tag remove button get 44px hit areas. A Dialog sheet on a phone is capped at `92dvh`, so the browser toolbar can't hide its footer.
- **`linkComponent` everywhere** (item 31): Breadcrumb, Pagination and Stat take their own `linkComponent`, and Pagination's previous / next arrows are router links when `getHref` is set. The README shows the Next.js `'use client'` providers file. The Next.js starter routes every AURA link through `next/link`, and CI clicks each one to check there's no full page load. CHANGELOG entry for 4.10 corrected.
- **`@jirawatpyk/aura-react/server`** (item 32): the pure helpers with no `'use client'` and no React, for Server Components. They are `formatDate` (English and Gregorian by default), `parseDate`, `toISO`, `fromISO`, `parseTime`, `formatBytes`, `statusTone`, `STRINGS`, `createTheme`, `contrast`, `brandScale`, `colorSchemeScript` and `breakpoints`. The package root's `formatDate()` keeps its Thai default until 5.0.
- **Command server search** (item 33): `query` / `onQueryChange` (controlled), `filter={false}`, `loading` (a "Searching…" row, `aria-busy`, the result count announced) and an `empty` slot. The active item is kept by id while results change.
- **DataTable `onStateChange`** (item 34): `{ sort, page }` in one callback; a sort click reports `{ sort, page: 1 }` once. New tests for `stackBelow` and `hideBelow` in server mode.
- **CSS next to another Tailwind theme** (item 35): `@jirawatpyk/aura-react/styles.layer.css` (components in `@layer aura`, so utilities win) and `@jirawatpyk/aura-tokens/tailwind.prefixed.css` (every name `aura-` prefixed, no `@custom-variant`). CI checks that a shadcn-style page computes the same styles with AURA added first or last.
