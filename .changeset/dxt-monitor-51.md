---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Fixes and additions from DxT Monitor.

- **Dialog / Drawer focus (bug):** opening one focused the header's close button even when the body had a field, because the focusable selector was only scoped for its first part. Now focus goes to the first field in the body, then the first footer button, then the dialog itself. Controls out of the Tab order (`tabindex="-1"`, such as unselected tabs or segments) and hidden ones are skipped.
- **SideNav (bug):** without a `header`, the first item sat on the top edge; it now has `aura-space-3` above it. New `bordered={false}` drops the nav's own right edge.
- **StatusPill `tone="warning"`:** solid amber with `triangle-alert` (tokens `status-warning-bg` / `status-warning-fg`: amber-600 / ink light, amber-500 / ink dark; 6.3:1 and 9.3:1). It differs from Ready and Blocked by lightness too, which the contrast check now enforces. "Warning", "Problem", "Degraded" and "At risk" map to it. `StatusTone` gains `'warning'`, and DataTable sorts it between Ready and Blocked. New primitives `amber-500`, `amber-600`.
- **Checkbox `label` (notice, no change yet):** `label` without children is still only the accessible name. It now warns once in development, because **6.0 will show `label` beside the box** like Switch and TextField. New `hideLabel` marks a bare box (it stays bare in 6.0 and silences the notice); DataTable uses it. With `hideLabel`, a `description` is kept as screen-reader text, so its `aria-describedby` resolves.
- **Icons:** `server`, `globe`, `activity`, `shield-alert`, `phone` and `wrench` from Lucide 1.47.
