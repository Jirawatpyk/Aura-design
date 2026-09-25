---
'@jirawatpyk/aura-react': major
'@jirawatpyk/aura-tokens': major
---

AURA 5.0 — Chamber-OS Addendum 3, item 51.

**Breaking:** `formatDate()` from the package root now defaults to English and the Gregorian calendar (`formatDate('2026-09-24')` → `24 Sept 2026`). It is the same function as `@jirawatpyk/aura-react/server`'s, so both give the same string, and it matches `useFormatDate()` without a provider. Before 5.0 the root one defaulted to Thai with Buddhist-era years (`24 ก.ย. 2569`). The 4.20 development warning is gone.

Migrating: add `{ locale: 'th' }` to every call that should stay Thai, or use `useFormatDate()` in components (it follows `<AuraProvider locale="th">`). `git grep -n "formatDate(" | grep -v locale` lists the calls; 4.20 also warned about them. Components, pickers, tokens and CSS are unchanged; `@jirawatpyk/aura-tokens` moves to 5.0 with it because the two packages share a version. The CDN path is `@5`, and the Next starter depends on `^5.0.0`.
