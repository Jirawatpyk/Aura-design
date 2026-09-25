---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Chamber-OS Addendum 3, Group C (items 36–40).

- **No `!important` in `@layer aura`** (item 36): the Combobox check colour and the phone sheet's width now win by specificity, so a utility can override both. The build fails if the component CSS gains an `!important`, and the Tailwind v4 check overrides both with a utility.
- **CHANGELOGs agree** (item 37): the 4.10 `linkComponent` correction is in the root and tokens CHANGELOGs too.
- **Tokens README leads with self-hosted fonts** (item 38): the quick-start imports `aura-fonts.local.css`; `next/font` and Google Fonts are labelled alternatives.
- **Command passes axe when open** (item 39): with no results there is no empty listbox. The loading row and empty state sit beside it, and the live region says "No matches". The Storybook suite now scans the open palette with 0, 1 and many results in both themes.
- **Starter link test** (item 40): also clicks a SideNav item and a DataTable row (the row link and another cell); both navigate through `next/link`.
