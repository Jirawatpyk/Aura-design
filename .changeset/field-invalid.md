---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

TextField and Textarea take `invalid`: the danger edge and `aria-invalid="true"` without AURA's error message, leaving the hint and `aria-describedby` as they are, for pages that explain the problem themselves. A field whose control the page marks `aria-invalid="true"` gets the same edge (Chamber-OS 156).
