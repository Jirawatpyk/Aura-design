---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Chamber-OS addendum (items 18–24):

- **Phones**: under 640px every text control (TextField, Textarea, Select, Combobox, DatePicker, TimePicker, NumberField) uses at least 16px text, so iOS Safari no longer zooms on focus. New token `--aura-input-font-size` (14px).
- **Touch targets** (`pointer: coarse`): IconButton keeps its 32px look with a 44px hit area; Radio, Checkbox and Switch rows are at least 44px, and tapping anywhere on a Switch row toggles it. New token `--aura-touch-target` (44px).
- **`Button fullWidth`**: fills its row and wraps a long label (at least 44px tall) instead of overflowing.
- **Dark status pills**: progress and ready get quiet dark fills (violet / lime tinted, 7.6:1 and 9.9:1), like neutral in 4.10; `createTheme` builds the dark progress pair from the brand.
- **Progress tracks**: `--aura-progress-track` and a 1px `--aura-progress-track-edge` at ≥3:1 on surface and canvas in both themes (Progress and FileUpload bars). Contrast check: 198 pairs.
- **Dates without a provider are English and Gregorian.** DatePicker, DateRangePicker and Calendar used to fall back to Thai with Buddhist-era years; now the fallback is `en` with Gregorian years, and only `locale="th"` shows พ.ศ. (`en` no longer defaults to Buddhist). Values stay Gregorian ISO dates. **Thai apps without `<AuraProvider locale="th">` will see English dates — wrap the app, or pass `locale="th"`.** `formatDate()` has no provider to read and stays Thai unless given a locale.
