---
'@jirawatpyk/aura-react': patch
'@jirawatpyk/aura-tokens': patch
---

FormErrorSummary: with `focusKey`, it takes focus only after a submit (including a server error set after a valid submit), never when live react-hook-form errors come back while someone types — WCAG 3.2.2 (Chamber-OS item 65). Without `focusKey` the behaviour is unchanged.
