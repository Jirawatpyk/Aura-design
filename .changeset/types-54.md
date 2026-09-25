---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Types (minor: some declarations are wider or narrower): DataTable `rows` accepts rows of your own interface and readonly arrays (it is now `ReadonlyArray`, so code that mutated `props.rows` must copy it first), and its row callbacks (`render`, `sortValue`, `getRowHref`, `onRowActivate`) can be typed with that interface; FormErrorSummary `errors` accepts hand-written nested objects (new `FormErrorTree` type); Select `label` is optional with `aria-label` / `aria-labelledby` (development builds warn when a Select has no name), so wrappers reading `props.label` see `string | undefined`. Repo: examples, stories and build/test scripts are TypeScript and type-checked in CI; pilot checks moved from Python to Playwright Test. Working on the repo needs Node 22.18+; the packages still run on Node 18+.
