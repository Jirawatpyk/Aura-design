---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Chamber-OS addendum 11.

- **DataTable** (75): `rowSelectLabel={(r) => 'Select ' + r.company}` names each row checkbox (and its cell) after the row, in the grid and in cards. Default unchanged.
- **Checkbox** (76): a passed `aria-describedby` is kept, with the description's id after it; before, it was always dropped.
- **DataTable** (77): header and row selection inputs take 24×24 around the 16px box they draw (WCAG 2.5.8), grid and cards.
- **DataTable** (78): `rowHeight="auto"` lets rows grow to fit wrapped content with cells vertically centred (rows that fit keep the density height); ignored with `height` (virtualized), with a dev notice. Cards and the default are unchanged.
