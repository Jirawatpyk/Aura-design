---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Compact density. `<AuraProvider density="compact">` (or `data-density="compact"` on any element) makes fields and buttons 36px, table rows 40px and button padding tighter; dialogs, drawers, popovers and Command follow the provider. Touch screens keep 44px targets. `DataTable` takes `density` on its own, and virtual tables read the row height from the new `--aura-table-row-height` token. New `useDensity()` hook. Fix: table rows now measure exactly 48px (they were 49px with the border), matching the virtual row height.
