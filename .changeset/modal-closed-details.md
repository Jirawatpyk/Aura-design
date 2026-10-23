---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Dialog, Drawer and Command always open with focus inside: a control in a closed `<details>` is skipped (its `<summary>` counts), focus is checked after each try with the panel as the last resort, and the Tab trap never wraps to a hidden control (Chamber-OS 169).
