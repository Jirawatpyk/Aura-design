---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Chamber-OS addendum 10.

- **Tabs** (72): `variant="segmented"` draws the tab list as a SegmentedControl-style pill track, with `fullWidth`; all Tabs behaviour kept, 44px on touch, focus ring never clipped, selected tab marked in forced colours. Default output unchanged.
- **Menu / DropdownMenu** (73): disabled items are `aria-disabled` and stay in the arrow-key order (choosing one does nothing and keeps the menu open); new `disabledReason` shown with the item and read as its description; a menu with nothing focusable focuses itself so Escape / Tab close it. Behaviour change: arrow keys no longer skip disabled items.
- **SegmentedControl** (74): the selected pill's edge re-measured at 4.6:1 in light; CI now checks the rendered edge in both themes.
