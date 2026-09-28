---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Chamber-OS addendum 12.

- **FilterSelect** (79): a compact filter for FilterBar — "Status All ▾", as wide as its words; `label` names it, `allLabel` shortens the first ("all") option on the face, `onChange(value)`. Select underneath: AURA's list on every device, Select's keyboard, forms and server HTML; long values wrap the button to the next row instead of truncating; right-to-left aware.
- **FilterBar** `searchGrow`: the search fills the row beside the controls.
- **Select**: a list wider than its field stays on screen; the list follows a right-to-left page; with `<option>` children the closed field shows the chosen option in server HTML too. Size budgets raised on purpose: CSS 22 → 23 kB, Select 12 → 13 kB.
