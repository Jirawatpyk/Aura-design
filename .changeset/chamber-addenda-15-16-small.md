---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Chamber-OS addenda 15–16, the small items (86, 88, 91, 97, 102–104, 106–108).

- **EmptyState** (86): `headingLevel={false}` renders the title as a paragraph.
- **Stat** (88): exported from `/server` (same HTML, no `onClick`); `headingLevel` makes the label a heading.
- **Drawer** (91): the body keeps focused fields 16px clear of its edges (`scroll-padding`).
- **AppShell** (97): `contentPadding={false}`; (104) `--aura-shell-bar-height` token, the bar's measured height (56px until measured). A Container in `contentPadding={false}` content keeps its own gutters. The bar is now `box-sizing: border-box` — 56px everywhere (57px before where no border-box reset applied).
- **Button** (102): a passed `aria-disabled` is kept: focusable, announced, clicks ignored.
- **Avatar** (103): exported from `/server`.
- **Tokens** (106): `--aura-fg-warning` for warning text on the page (≥6.8:1 light, ≥10.3:1 dark); the `--aura-status-*-fg` notes say they're only for text on the pill fill.
- **Tabs** (107): `current="location"` for in-page link tabs.
- **DataTable** (108): in stacked cards every field aligns to the start, `align: 'end'` columns included (the grid is unchanged). A visible change to cards with amount columns.
- CSS size budget raised on purpose: 23 → 24 kB.
