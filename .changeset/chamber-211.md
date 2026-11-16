---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Chamber-OS 211: when the focused control inside an open modal (Dialog, Drawer, Command, FilterBar's Filters sheet) unmounts, focus moves to its `[data-aura-focus-fallback]` (the sheet's Done) or its panel instead of `<body>`; `useFilterBarSheet()` returns `{ inSheet, focusDone }`.
