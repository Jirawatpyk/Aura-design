# AURA + Next.js starter

Next.js (App Router, TypeScript) with the AURA Design System wired in: tokens and component styles, fonts, Thai labels (`AuraProvider locale="th"`), toasts, and an example page (stats + a sortable table that turns into cards on phones).

```bash
npx degit Jirawatpyk/Aura-design/templates/next-starter my-app
cd my-app
npm install
npm run dev          # http://localhost:3000
```

- **Components**: every one is live in the [AURA Storybook](https://jirawatpyk.github.io/Aura-design/), with a props table for each.
- **Server Components**: AURA ships `'use client'` in every module, so you can render AURA components straight from a Server Component (see `app/page.tsx`). Anything that passes functions (DataTable `render`, `onClick`) goes in a client component (`app/orders-table.tsx`).
- **Your brand colour**: `npm run theme` writes `app/aura-theme.css` (edit the colour in `package.json`), then add `import './aura-theme.css'` in `app/layout.tsx` after the AURA imports. Every pair is checked for WCAG AA.
- **English labels**: `<AuraProvider locale="en">` in `app/layout.tsx`.

Tested in AURA's CI: this template is built with `next build` against the packed AURA packages on every push.
