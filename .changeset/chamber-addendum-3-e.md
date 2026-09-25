---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Chamber-OS Addendum 3, Group E (items 48–50), and the lead-up to item 51.

- **Separator and a static Table** (item 48): `Separator` (horizontal or vertical; decorative, or `role="separator"`). `Table` with `THead`, `TBody`, `TFoot`, `Tr`, `Th` and `Td` (`align`, `numeric`, `mono`) is plain `<table>` markup in DataTable's grid look, with wrapping text and a totals foot. When it has to scroll sideways, its box becomes a focusable region named by the caption.
- **Tooltip `left` / `right`** (item 49): every side flips when clipped (top and bottom now both ways) and the tooltip stays inside the viewport.
- **DataTable before hydration, one markup** (item 50): `stackBelow` cards are now the grid's own rows, laid out by a container query, so each row is in the HTML once. `hideBelow` columns (up to three distinct widths per table) are hidden in CSS from the first paint. Both work at any width, not only the 13 preset widths of 4.16. The grid is still a `grid` in card mode (column headers stay for screen readers, and field labels are generated content that isn't read twice). A table with `stackBelow` or `hideBelow` now sits in wrapper `div`s; `className` and `ref` go on the outermost. **The `.aura-table__card*` classes are gone** — if your tests or styles used them, select rows with `[role="row"]` instead.
- **Root `formatDate()`** (item 51, before 5.0): a call without `locale` warns once in development. In 5.0 it will default to English and Gregorian like `/server` and `useFormatDate()`. Pass `{ locale: 'th' }` to keep Thai.

Tests: the layout test renders a `stackBelow={700}` table with a `hideBelow={900}` column at 390, 699, 700, 899, 900 and 1100px, with JavaScript off and hydrated, and checks that each row is in the HTML once (4.19 fails it). The Storybook suite adds the invoice line-items table with axe in both themes, tooltips on the last column and the collapsed rail, and the card layout with axe.
