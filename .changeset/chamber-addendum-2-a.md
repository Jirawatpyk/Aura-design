---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Chamber-OS Addendum 2, Group A (items 25–29).

- **Optional props take `undefined`** (item 25): every optional prop is typed `prop?: T | undefined`, so apps on `exactOptionalPropertyTypes` can pass `hint={t.hint}` or `icon={x ?? undefined}`. A type test checks every exported component under `strict` + `exactOptionalPropertyTypes` + `noUncheckedIndexedAccess`.
- **Layout is right before hydration** (item 26): AppShell switches sidebar and drawer in CSS (1024px media query), and a DataTable with `stackBelow` renders cards and grid until it has measured itself, with container queries showing the right one. A phone gets the mobile layout from the server's HTML; the new `test:layout` requires CLS 0 at 390 and 1280px.
- **Self-hosted fonts** (item 27): `@jirawatpyk/aura-tokens/aura-fonts.local.css` loads Fraunces, Inter, JetBrains Mono and Noto Sans Thai from woff2 files in the package (OFL-1.1), for a `font-src 'self'` CSP. The README shows the `next/font` setup. The Next.js starter now uses the self-hosted fonts.
- **Button `variant="ghost"` and `size="sm"`** (item 28): ghost has no fill or edge until hover; `sm` is 32px (`--aura-button-height-sm`) with a 44px hit area on touch screens, and keeps a compact table row at 40px.
- **React 19** (item 29): CI already runs every suite on React 18.3 and 19; the package README now says so.
