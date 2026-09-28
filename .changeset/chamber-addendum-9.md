---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Chamber-OS addendum 9 (pay sheet).

- **Drawer** (70): `id`, `data-*` and `aria-*` go on the `.aura-drawer` panel; `closeLabel` gives the close button an accessible name and tooltip that say what it closes; `closeProps` passes attributes to that button. Output without them is unchanged.
- **Tabs** (71): `keepMounted` keeps inactive panels in the DOM (`hidden`) so their state survives a switch; `activation="manual"` makes Arrow / Home / End move focus only, with Enter / Space / click selecting; per-tab `tabProps` (`data-testid`, `aria-label` — a dev notice when it doesn't start with the visible label). Defaults unchanged.
