# AURA + TanStack Start starter

TanStack Start (React, TypeScript, Vite) with the AURA Design System wired in: tokens and component styles, self-hosted fonts, Thai labels (`AuraProvider locale="th" strings={th}` with the Thai pack), toasts, the colour scheme before first paint, and two routes that use every kind of AURA link.

```bash
npx degit Jirawatpyk/Aura-design/templates/tanstack-start-starter my-app
cd my-app
npm install
npm run dev          # http://localhost:3000
```

- **Links**: `src/components/aura-link.tsx` is the adapter. AURA hands its `linkComponent` a plain `href`; the adapter renders an `<a>` and gives same-origin clicks to `router.navigate({ href })`, preloading on hover and focus. Don't pass TanStack's `<Link>` as `linkComponent`: it adds `aria-current="page"` to every link its matcher calls active (on `/members?page=3` the page 1 link and the "All" tab too), over AURA's own.
- **Where the provider goes**: `src/routes/__root.tsx` — the root route's `component` wraps `<Outlet />` in `AuraProvider`, inside the router, so the adapter can reach it. The `shellComponent` is the document: AURA's CSS as `?url` links and `ColorSchemeScript` in `<head>`.
- **Search params**: each route's `validateSearch` turns the query into typed values (`page`, `view`, `order`, `sort`), and AURA's hrefs are written as plain URLs (`'/members?page=' + p`).
- **Components**: every one is live in the [AURA Storybook](https://jirawatpyk.github.io/Aura-design/), with a props table for each.
- **Your brand colour**: `npm run theme` writes `src/aura-theme.css` (edit the colour in `package.json`); add it to the root route's `links` after the AURA stylesheets. Every pair is checked for WCAG AA.
- **English labels**: `<AuraProvider locale="en">` in `src/routes/__root.tsx`.
- **Icons**: import the ones you use from `@jirawatpyk/aura-react/icons` — `icon={<IconUsers />}` — so only those are bundled.
- **TanStack versions**: `@tanstack/react-start` and `@tanstack/react-router` are pinned to a pair that installs one router (react-start depends on an exact react-router). Update them together.
- `src/routeTree.gen.ts` is written by the Vite plugin on `npm run dev` and `npm run build`; run one of them before `npm run typecheck`.

Tested in AURA's CI: on every push this template is built with `vite build` against the packed AURA packages, served with `vite preview`, and `e2e/links.mjs` clicks every AURA link in it — none may load a full page, `aria-current` must be AURA's, and Ctrl/⌘-click must open a tab.
