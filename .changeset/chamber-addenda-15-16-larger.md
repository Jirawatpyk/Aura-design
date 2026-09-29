---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Chamber-OS addenda 15–16, the larger items (95, 96, 98, 101, 105).

- **SideNav** (95, 96): action rows (`selectable: false` + `onSelect`, `onAction`; they close AppShell's phone drawer), `collapseToggle="row"`, `chevron="right"`. The header's end padding is 8px (was 16px) for every SideNav, so a brand, dot and badge fit one row at 240px — a visible change.
- **DataTable** (98): `onSelectionChange(keys, { key, shiftKey, source, range? })` and `rangeSelect` (Shift-click / Shift+Space ranges). A wrapper calling a `DataTableProps['onSelectionChange']` itself must now pass the second argument.
- **Dialog** (101): `trigger` (self-managed when `open` is left out; `useDialogClose()` for its footer), `finalFocus`, `onCloseComplete`, and `id` / `data-*` / `aria-*` on the panel; `open` and `onClose` optional. Drawer takes `finalFocus` and `onCloseComplete`.
- **Combobox** (105): `allowCustomValue` and `groups`; `options` optional.
- Budgets: the whole library and the IIFE bundle 60 → 62 kB.
