---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Chamber-OS #149: PageHeader `actionsFullWidthBelow` with an IconButton among the actions keeps them on one row below the breakpoint — text buttons shrink and wrap their labels inside (never an ellipsis; 22px corners once they grow past one line), the icon keeps its size at the end. A header mixing text and icon buttons that used to wrap onto two rows on a narrow phone is now one row; actions without an icon button wrap as before. IconButton `variant="outline"`.
