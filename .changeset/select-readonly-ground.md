---
'@jirawatpyk/aura-react': patch
'@jirawatpyk/aura-tokens': patch
---

Select: a custom Select is no longer painted with the disabled ground (Chamber-OS 109). The read-only rule for text fields used `:read-only`, which also matches the Select's trigger `<button>`, so every custom Select showed `--aura-bg-input-disabled` (#fafafa in light) and looked disabled; Chamber-OS's axe scan flagged its placeholder. The rule now applies to a read-only `input` only, and a read-only Textarea gets the same ground as a read-only TextField (before, it had none).
