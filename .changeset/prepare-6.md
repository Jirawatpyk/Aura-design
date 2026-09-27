---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Preparing for 6.0 (5.9). Nothing that works today changes; the new way ships alongside the old, with development-only notices where code relies on what 6.0 removes.

- **Icons as components:** `@jirawatpyk/aura-react/icons` exports one component per icon (`IconUsers`, `IconPlus` …), `allIcons` and `defineIcon`. Pass them anywhere AURA takes an icon; a bundler keeps only the ones imported, and the entry has no `'use client'`. `registerIcons(allIcons)` (root and `/server`) keeps icon names as strings working in 6.0. `npx aura-icons-codemod src` rewrites literal names (it parses with TypeScript). AURA's own components use the components internally (same HTML). A string icon name prints a one-time dev notice.
- **Locale packs:** `@jirawatpyk/aura-react/locales/th` and `/sv` export the Thai and Swedish strings for AuraProvider `strings`; in 6.0 only English is built in. `locale="th"` or `"sv"` without a pack prints a one-time dev notice.
- README "Preparing for 6.0" lists every 6.0 change (also Checkbox `label` shown, one DropdownMenu structure, `engines.node >=20` for the scripts) and what to do on 5.9.
- `ICONS` is deprecated (removed in 6.0).
- The new notices are `console.warn` in development only; test setups that fail on any warning will see them until the app migrates.
