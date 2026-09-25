---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

5.2 — the smaller items from the full review.

- DataTable: the totals row is reachable by arrow keys and Ctrl+End; server paging without `totalRows` says "1–25 of many · Page 1" (new strings `rangeOpen`, `pageOpen` in th, en, sv); a clamped page is reported through `onPageChange` / `onStateChange`; pinned columns hidden by `hideBelow` no longer shift the next pinned column before hydration.
- `parseDate`: eight digits (`18092569`, `20260918`), an era anywhere, `ค.ศ.` / AD for Gregorian years ≥ 2400, years 0–99 as written; `fromISO` / `formatDate` refuse impossible dates. `parseTime`: am/pm hours are 1–12. TimePicker: "That time isn't available" for a disabled time inside the range (new string `timeUnavailable`). The calendar popover is placed by its measured size.
- Popover scrolls inside the viewport when taller than the room; FileUpload items with `url` link and show thumbnails.
- Avatar online dot and the selected SegmentedControl option get 3:1 edges; the contrast check covers them.
- Tokens: types for `./tailwind` and `./eslint-plugin`, a `.` export, `./package.json`; Tailwind v4 `dark:` follows `data-theme="system"` and skips light islands.
- ESLint plugin: works as an ESLint 9 flat config; catches modern colour functions, named colours and Tailwind palette classes; ignores anchors. `lint-tokens.js` matches and scans more file types. CI runs both (`check:eslint`).
- `aura-theme` CLI: `--key=value`, one-line errors with exit code 2.
