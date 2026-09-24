---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Chamber-OS group B (items 8, 10–13):

- **Toasts**: `toast.success | error | warning | info(title, opts?)` and `toast.loading(title, opts?)`, which spins and stays until the same `id` is shown again with a result. A repeated `id` now replaces the toast in place (same position, timer restarts) instead of moving it. Danger stays `role="alert"`, the rest `role="status"`.
- **PasswordField**: a TextField with a show/hide button (`aria-pressed`, one name); `ref` reaches the input for react-hook-form.
- **FormErrorSummary**: the GOV.UK pattern — a danger panel listing each error as a link to its field. Takes react-hook-form's `formState.errors` as is, takes focus when errors appear and on each submit (`focusKey`), and `onSelect` can be `setFocus`.
- **FilterBar**: search (debounced, sent at once on Enter), your filter controls, applied-filter chips, Clear all, a result count and actions; wraps below `md`. Built to keep its state in the URL with a server-mode DataTable.
- **`aura-prose`**: a class that styles sanitised rich text (p, h1–h4, lists, blockquote, hr, a, strong, em, u) with AURA type, spacing and link colours in both themes.
- **Command**: a ⌘K / Ctrl+K command palette with no new dependency — WAI-ARIA combobox over a grouped listbox, Thai-aware filtering with keywords, disabled items skipped, shortcuts shown, opens above a Dialog.

New strings (th, en, sv): show password, error summary title, filters, search, clear all, result count, command menu.
