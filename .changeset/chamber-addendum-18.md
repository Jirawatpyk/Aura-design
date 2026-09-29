---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Chamber-OS addendum 18 (110, 111). All opt-in; default output unchanged.

- **Stat** (110): `id`, `data-*`, `aria-*`, `style`, `lang` and `dir` reach the `.aura-stat` root (root and `/server`); `status` renders a line under the value (hidden while loading); `linkArea="label"` with `href` puts the link on the label — inside its heading — and stretches its hit area over the tile, which shows the focus ring. Other controls in the tile stay clickable; `aria-label` / `aria-labelledby` / `aria-describedby` / `aria-current` and `onClick` go on the link.
- **Progress** (111): `valueText` sets `aria-valuetext` apart from the shown `valueLabel`.
- CSS budget 25 → 26 kB.
