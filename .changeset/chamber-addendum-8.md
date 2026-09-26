---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Chamber-OS addendum 8: `@jirawatpyk/aura-react/server` exports hook-free `Card`, `Badge`, `StatusPill`, `Alert` (no `onDismiss`), `EmptyState`, `Icon` and `buttonClass()` for Server Components, with the same HTML as the root components (the server entry now imports React); Alert takes `role`, `icon` and pass-through attributes; Card and StatusPill pass attributes to their root; Table `stackBelow="sm" | "md"` stacks rows into labelled cards in CSS.
