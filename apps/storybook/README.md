# AURA v4.1 — Storybook, Visual Regression, A11y, Telemetry

## โครงสร้าง

| ไฟล์ | ทำอะไร |
|---|---|
| `.storybook/main.ts`, `preview.ts` | Storybook 8 (react-vite). Loads `aura.css`, the component CSS and the bundle; adds a light/dark **Theme** toolbar. |
| `stories/*.stories.tsx` | Button, DataTable (2,000-row virtual grid, paged, loading, empty), Forms, Feedback (alerts, pills, toasts, tooltips, dialog), Layout (cards, tabs, app shell). |
| `scripts/a11y-check.js` | Contrast check straight from `tokens.json`: 88 text/ground pairs in both themes. Fails the build under 4.5:1 (text) or 3:1 (control edges, focus ring). |
| `scripts/a11y.spec.ts` + `playwright.a11y.config.ts` | axe-core (WCAG 2.1 AA) over **every** story, in light and dark, against a static Storybook build. |
| `scripts/components.spec.ts` + `playwright.components.config.ts` | 16 behaviour tests: dialog focus trap, toast, tooltip, tabs, switch/radio keys, form errors, DataTable virtual scroll, sort, selection, cell keys, column menu, paging, loading/empty. |
| `scripts/lint-tokens.js [dir]` | Fails on hard-coded colours: hex, rgb()/hsl(), Tailwind `bg-[#…]`. |
| `scripts/telemetry.mts` | Adoption: token uses vs hard-coded colours in `stories/` (or a folder given as an argument). |
| `.github/workflows/a11y.yml` | On every PR: regenerate tokens (and fail if the generated files weren't committed), contrast check, token lint, axe over Storybook. |
| `.github/workflows/chromatic.yml` | Visual regression of every story on Chromatic (needs `CHROMATIC_PROJECT_TOKEN`). |

## วิธีรัน

```bash
npm ci
npm run storybook        # http://localhost:6006
npm run a11y             # contrast from tokens.json
npm run lint:tokens      # no hard-coded colours in stories/components
npm run build-storybook && npm run a11y:ci   # axe over every story, light + dark
npm run test:components                      # behaviour tests
npm test                                     # everything above, in order
npm run chromatic        # visual regression
```

## ผลทดสอบล่าสุด (2026-09-18)

| Check | Result |
|---|---|
| `npm run a11y` | 88/88 contrast pairs pass (light + dark) |
| `npm run lint:tokens` | 0 hard-coded colours in stories and components |
| `npm run build-storybook` | builds (Storybook 8.6, Vite 5) |
| `npm run a11y:ci` | 0 axe violations across 21 stories × 2 themes |
| `npm run test:components` | 16/16 pass |

If Playwright asks for browsers on first run: `npx playwright install chromium`.
