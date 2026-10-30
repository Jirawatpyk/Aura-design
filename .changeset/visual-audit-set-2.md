---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Visual audit set 2 (phones): ActionBar's edge strip lays out as PageHeader's bar (status row above, actions sharing the row below) and both strips are 16px from either side; PageHeader full-width buttons are radius-md boxes on a phone; a document number in a PageHeader title never breaks at its hyphens (`.aura-nowrap`); DataTable cards with columnControls keep their title wide; a host in a StatusTile title breaks after its dots; an overflowing tab list fades the end with more tabs; Combobox and TimePicker keep room for the clear button only while it shows; a DataTable or Table that scrolls sideways on a phone without stackBelow warns in development.
