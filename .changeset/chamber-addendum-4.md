---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Chamber-OS addendum 4: DataTable `isRowSelectable` / `rowSelectDisabledLabel` (rejected rows get no checkbox and never count as selected); toasts take a JSX `description`, up to two `actions`, link actions (`href` via `linkComponent`) and `dismiss: false`; Escape closes the focused toast; Toaster `position` adds `top-center` / `bottom-center` / `top-right` / `bottom-right`, `offset` (or `--aura-toaster-offset`) plus the safe-area inset, and an Alt+T `hotkey` to the newest toast; focus returns to where it was when a focused toast closes; toast actions get 44px touch targets; two actions (or one under a description) sit on their own row.
