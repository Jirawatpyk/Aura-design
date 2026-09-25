---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Select opens AURA's own list instead of the operating system's: tokens in light and dark, optgroup headings, disabled options skipped, typeahead, Escape closes the list before a dialog. A real `<select>` stays underneath, so `name`/`required` form posts, refs, `onChange` and react-hook-form `register`/`reset`/`setValue`/`setFocus` work unchanged. `options` is optional (use `<option>`/`<optgroup>` children). `multiple` or `size > 1` keep the native list box. Tests: pick with `getByRole('combobox', { name })` then `getByRole('option', { name })`, or `locator('select[name=…]').selectOption()`.
