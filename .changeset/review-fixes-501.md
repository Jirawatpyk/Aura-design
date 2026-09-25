---
'@jirawatpyk/aura-react': patch
'@jirawatpyk/aura-tokens': patch
---

Fixes from a review of 4.19–5.0.

- **DataTable** keeps measuring itself when a column adds or removes a `hideBelow` width, or `stackBelow` comes or goes. Before, it could stay virtual in the card layout (showing only a screenful of cards) or be treated as cards on a desktop.
- **DataTable, `height` + `stackBelow` before hydration:** the virtual spacers no longer show as a blank gap in the card layout.
- **DataTable cards and the keyboard:** ArrowUp and Ctrl+Home stay on the cards instead of moving the grid's only tab stop to a hidden header cell. Columns with `hideBelow` keep their column header for screen readers in the card layout.
- **Toasts** sit above a BottomNav on tablets too, not only on phones.
- **Pickers:** an unknown `timeZone` falls back to the device's date instead of throwing, and a malformed `today` is ignored.
- **Link Tabs:** only the tab whose id matches `value` is the current page, so a sub-route marks none. A new-tab click (modifier key or middle button) no longer switches the active tab.
- **Tooltip** is clamped vertically too, so it always stays inside the viewport.
