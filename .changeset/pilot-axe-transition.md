---
'@jirawatpyk/aura-react': patch
---

Test fix only, nothing changes in the packages: the pilots' colour-scheme check ran axe while the colour transitions were still running, so it could read a half-changed colour and fail (seen once as `.aura-nav__count`). It now waits for the transitions, like the brand-theme check does.
