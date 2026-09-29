---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Chamber-OS addenda 14–16, layout (85, 87, 89, 90, 92–94, 99, 100). All opt-in; default output unchanged.

- **Table** (85): `stackStyle="cards"` — stacked rows as separate framed cards.
- **Card** (87, 93): `header` slot for free head content; `flushBelow` drops the frame below a width.
- **Progress** (89): `secondaryValue`, a striped reserved segment, read as "2 of 6 used, 1 reserved".
- **Tabs** (90): `fullWidth` for underline tabs, and `'below-sm' | 'below-md' | 'below-lg'`. Underline tabs that already passed `fullWidth` (ignored until now) now fill their row.
- **FilterBar** (92): `controlsLayout="fill"` and `stackBelow="lg"`.
- **Breadcrumb** (94): `collapseBelow` (first, "…", last) and per-item `itemProps` / `linkProps`.
- **Checkbox** (99): `hitArea` — `'target'` or `{ x, y }`.
- **Button, IconButton** (100): `touchHeight` — 44px below 640px.
- New strings `progressReserved`, `breadcrumbMore` (en, th, sv). CSS budget 24 → 25 kB.
