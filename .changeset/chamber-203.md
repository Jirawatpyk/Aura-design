---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Chamber-OS 203–205: every full-width button has one shape — a lozenge on one line, a rounded box (22px corners) when its label wraps — in PageHeader's full-width actions, `fullWidth` Buttons (Alert, Card, a stacked card's footer), phone sheet and drawer footers; DataTable takes `stackStyle: 'list'`, the stacked rows as one list divided by rules with no card per row, to sit in a framed Card; while the cards show, the grid's column headers leave the accessibility tree and each field reads its label, and an empty column `label` no longer falls back to the key.
