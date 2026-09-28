---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Chamber-OS addendum 13.

- **DataTable** (80): per-column `card` (`'hide' | 'field' | 'title' | 'pill'`) and `cardOrder` shape the stacked cards without changing the grid; `hideSelectionInCards` drops the boxes from cards only (selection kept).
- **Table** (81): `align="middle"` and `bordered={false}` (no frame, flush outer cells). Type change: the obsolete HTML `align` attribute is no longer accepted on `Table`.
- **EmptyState** (82): `tone="danger"`; `id`, `data-*`, `aria-*`, `role`, `style` now reach the root.
- **Td** (84): `card="title" | "action"` for the stacked row: title and action share the first line, fields two to a line under them.
- Size budgets raised on purpose: the whole library and the IIFE bundle 58 → 60 kB, DataTable 19 → 20 kB.
