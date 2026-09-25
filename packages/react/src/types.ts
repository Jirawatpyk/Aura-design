/* Public prop and value types of @aura/react. Components import their props from here; the published
 * declarations are generated from the sources by tsc. */
import type * as React from 'react';

/** Button look. */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'creative' | 'danger' | 'danger-secondary';
/** `md` 44px (default) · `sm` 32px for toolbars, table rows and card footers (still a 44px hit area on touch screens). */
export type ButtonSize = 'sm' | 'md';

/** AURA pill button. Enterprise (`primary`, `secondary`) for product UI; `creative` for marketing moments only. */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant. Default `primary`. `ghost` has no fill or edge until hover (toolbars, rows, secondary actions beside a primary). `danger` (filled) and `danger-secondary` (outline) are for irreversible or destructive actions only — typically the confirm button of a `Dialog role="alertdialog"`. */
  variant?: ButtonVariant | undefined;
  /** Label text — short, Title Case English or Thai. */
  children: React.ReactNode;
  /** Leading icon name (see `IconName`). Hidden while loading. */
  icon?: IconInput | undefined;
  /** Trailing icon name, e.g. `arrow-right` for forward actions. */
  iconRight?: IconInput | undefined;
  /** Shows a spinner in place of the leading icon, sets aria-busy and swallows clicks. Keeps the label and width. */
  loading?: boolean | undefined;
  /** Fills its container and lets a long label wrap onto more lines (at least 44px tall) — phones, Thai and Swedish labels. */
  fullWidth?: boolean | undefined;
  /** `sm` is 32px with tighter padding, for toolbars, table rows and card footers. Default `md` (44px). */
  size?: ButtonSize | undefined;
}

/** A link that looks like a Button: give `Button` an `href` and it renders an `<a>` (navigation, not actions). */
export interface ButtonLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  /** Where the link goes. With `href`, Button renders an `<a>` and its ref is the `<a>`. */
  href: string;
  /** Visual variant. Default `primary`. `ghost` has no fill or edge until hover (toolbars, rows, secondary actions beside a primary). `danger` (filled) and `danger-secondary` (outline) are for irreversible or destructive actions only — typically the confirm button of a `Dialog role="alertdialog"`. */
  variant?: ButtonVariant | undefined;
  /** Label text — say where it goes ("View Orders"), not "Click here". */
  children: React.ReactNode;
  icon?: IconInput | undefined;
  /** Trailing icon, e.g. `arrow-right`, or `external-link` with `target="_blank"`. */
  iconRight?: IconInput | undefined;
  /** Looks unavailable and can't be followed: no href, `aria-disabled`, out of the Tab order. */
  disabled?: boolean | undefined;
  /** Fills its container and lets a long label wrap (at least 44px tall). */
  fullWidth?: boolean | undefined;
  /** `sm` is 32px with tighter padding. Default `md` (44px). */
  size?: ButtonSize | undefined;
  /** A router's link to render instead of `<a>`, e.g. `Link` from `next/link` (client-side navigation). It gets `href`, `className`, the children and the ref. */
  linkComponent?: React.ElementType | undefined;
}

/** What DataTable's onStateChange reports: the sort and the 1-based page, together. */
export interface DataTableState {
  sort: DataTableSort | null;
  page: number;
}
export interface DataTableColumn {
  /** Key into each row object. */
  key: string;
  /** Header label (source style: UPPERCASE). */
  label: string;
  /** Fixed width in px; the last column usually takes the rest. */
  width?: number | undefined;
  /** Render the cell in the mono face (IDs). */
  mono?: boolean | undefined;
  /** Render the value as a StatusPill (tone picked from the word). */
  pill?: boolean | undefined;
  /** Override the tone for specific values, e.g. `{ 'QA': 'progress' }`. */
  tones?: Record<string, StatusTone> | undefined;
  /** Header becomes a button cycling asc → desc → unsorted. */
  sortable?: boolean | undefined;
  /** Value to sort by, when not the cell value (dates, amounts). */
  sortValue?: ((row: Record<string, any>) => string | number | null) | undefined;
  /** Custom cell content. */
  render?: ((row: Record<string, any>) => React.ReactNode) | undefined;
  /** Set false to keep a sized column fixed when the table is `resizable`. */
  resizable?: boolean | undefined;
  /** Resize limits in px. Defaults 64 / 480. For the flexible column, minWidth defaults to 160. */
  minWidth?: number | undefined;
  maxWidth?: number | undefined;
  /** Start pinned to the left (needs a width). */
  pinned?: boolean | undefined;
  /** Start hidden (show it from the columns button). */
  hidden?: boolean | undefined;
  /** Hide this column when the table is narrower than this (px, or a breakpoint name). For tablets: keep ID, name, date and status; drop the rest below `lg`. Not applied to stacked cards. Decided in CSS from the first paint (4.20) for up to three distinct widths per table; more than that apply once JavaScript runs. */
  hideBelow?: number | 'sm' | 'md' | 'lg' | 'xl' | undefined;
  /** Row actions (a DropdownMenu or IconButton). In stacked cards it sits top-right instead of in the field list. Give it an empty label. */
  actions?: boolean | undefined;
  /** `end` right-aligns header and cells (amounts, counts) and uses tabular figures. Default `start`. */
  align?: 'start' | 'end' | undefined;
}
export interface DataTableSort {
  key: string;
  dir: 'asc' | 'desc';
}
export interface DataTableEmpty {
  /** Default `inbox`; use `search` for "no matches". */
  icon?: IconInput | undefined;
  /** Default "Nothing here yet". */
  title?: string | undefined;
  description?: string | undefined;
  /** One action, usually a secondary Button. */
  action?: React.ReactNode | undefined;
}
/** Enterprise data table: 48px rows, hairline dividers, mono header band. */
export interface DataTableProps {
  /** Defaults to ID · NAME · STATUS · OWNER (96 / 160 / 112 / auto px). */
  columns?: DataTableColumn[] | undefined;
  rows: Array<Record<string, React.ReactNode>>;
  /** Column key giving each row a unique React key. Default: the first column's key. */
  rowKey?: string | undefined;
  /** Accessible name for the table. */
  label?: string | undefined;
  /** Controlled sort; pair with onSortChange. */
  sort?: DataTableSort | null | undefined;
  /** Initial sort when uncontrolled. */
  defaultSort?: DataTableSort | null | undefined;
  onSortChange?: ((sort: DataTableSort | null) => void) | undefined;
  /** Adds a checkbox column. */
  selectable?: boolean | undefined;
  /** Controlled selection (row keys); pair with onSelectionChange. */
  selected?: Array<string | number> | undefined;
  /** Initial selection when uncontrolled. */
  defaultSelected?: Array<string | number> | undefined;
  onSelectionChange?: ((keys: Array<string | number>) => void) | undefined;
  /** Shown when rows is empty. */
  empty?: DataTableEmpty | undefined;
  /** A totals row under the body (4.19): content per column key, e.g. `{ id: 'Total', vat: '7,000.00', total: '107,000.00' }`.
   * Cells share the body's widths and alignment, so right-aligned money lines up. Stacked cards get a Totals card. */
  footer?: Record<string, React.ReactNode> | undefined;
  /** Keep the totals row visible while a `height` table scrolls. (4.19) */
  stickyFooter?: boolean | undefined;
  /** Rows per page; omit for no pagination. */
  pageSize?: number | undefined;
  /** Controlled page (1-based); pair with onPageChange. */
  page?: number | undefined;
  /** Initial page when uncontrolled. Default 1. */
  defaultPage?: number | undefined;
  onPageChange?: ((page: number) => void) | undefined;
  /** Sort and page in one callback (4.17): a sort click reports `{ sort, page: 1 }` once, a page change
   * `{ sort, page }`. When set, onSortChange and onPageChange are not called for them, so an app that keeps both in
   * the URL does one navigation per click. Pair with `sort` + `page` for controlled state. */
  onStateChange?: ((state: DataTableState) => void) | undefined;
  /** Adds drag/keyboard resize handles to every column that has a width. */
  resizable?: boolean | undefined;
  onColumnResize?: ((key: string, width: number) => void) | undefined;
  /** Shows skeleton rows and disables sorting, select-all and paging. With `manual` and rows already shown, the rows stay (dimmed, with a progress bar) while the next page loads. */
  loading?: boolean | undefined;
  /** Server mode: `rows` is already the current page, sorted by the server. The table doesn't sort or slice; it reports
   * sort and page through onSortChange / onPageChange (or getPageHref links). Pair with `totalRows` and `pageSize`. */
  manual?: boolean | undefined;
  /** manual: rows across all pages (drives the page count, "1–25 of 312" and aria-rowcount). */
  totalRows?: number | undefined;
  /** Makes each row a link: the first column's content renders as the provider's linkComponent (or `<a>`), and a click
   * or Enter anywhere on the row follows it. Ctrl/⌘-click opens a new tab as usual. */
  getRowHref?: ((row: Record<string, any>) => string) | undefined;
  /** Pager arrows become links to these URLs (search-param paging). Without onPageChange the link navigates. */
  getPageHref?: ((page: number) => string) | undefined;
  /** Router link for getRowHref / getPageHref. Default: AuraProvider's linkComponent, else `<a>`. */
  linkComponent?: React.ElementType | undefined;
  /** Skeleton row count when there is no pageSize. Default 5. */
  skeletonRows?: number | undefined;
  /** Called on row click or Enter. */
  onRowActivate?: ((row: Record<string, any>) => void) | undefined;
  /** Fixed height in px: sticky header, and only the rows in view are rendered. */
  height?: number | undefined;
  /** Column menu on every header, drag-to-reorder, and the show/hide columns button. */
  columnControls?: boolean | undefined;
  /** Set false to keep column controls but turn off reordering. */
  reorderable?: boolean | undefined;
  /** Controlled column order (keys); pair with onColumnOrderChange. */
  columnOrder?: string[] | undefined;
  onColumnOrderChange?: ((keys: string[]) => void) | undefined;
  /** Controlled hidden columns (keys); pair with onHiddenColumnsChange. */
  hiddenColumns?: string[] | undefined;
  onHiddenColumnsChange?: ((keys: string[]) => void) | undefined;
  /** Controlled pinned columns (keys); pair with onPinnedColumnsChange. */
  pinnedColumns?: string[] | undefined;
  onPinnedColumnsChange?: ((keys: string[]) => void) | undefined;
  /** `compact` = 40px rows (48px on touch screens). Default: the surrounding density. */
  density?: 'comfortable' | 'compact' | undefined;
  /** Table width in px below which rows render as stacked cards (phones). Try 640. It follows the table's own width, not the window. Since 4.20 the cards are the same markup as the grid, laid out by a container query, so any width is right before hydration and each row is in the HTML once. With `height` (virtual rows) the server can only send the first screenful; the rest of the cards arrive on hydration. */
  stackBelow?: number | undefined;
  className?: string | undefined;
}

/** An AURA icon name, or any icon element (e.g. `<Building />` from lucide-react). AURA sizes it and hides it from screen readers. */
export type IconInput = IconName | React.ReactElement;
export type IconName =
  | 'check'
  | 'x'
  | 'plus'
  | 'minus'
  | 'search'
  | 'chevron-down'
  | 'chevron-up'
  | 'chevron-left'
  | 'chevron-right'
  | 'arrow-right'
  | 'arrow-up-right'
  | 'arrow-up-down'
  | 'loader-circle'
  | 'circle-alert'
  | 'circle-check'
  | 'info'
  | 'triangle-alert'
  | 'settings'
  | 'user'
  | 'users'
  | 'filter'
  | 'ellipsis'
  | 'external-link'
  | 'copy'
  | 'trash-2'
  | 'pencil'
  | 'download'
  | 'upload'
  | 'calendar'
  | 'bell'
  | 'menu'
  | 'eye'
  | 'log-out'
  | 'circle'
  | 'circle-dot-dashed'
  | 'ban'
  | 'arrow-up'
  | 'arrow-down'
  | 'inbox'
  | 'pin'
  | 'pin-off'
  | 'eye-off'
  | 'columns-3'
  | 'arrow-left'
  | 'rotate-ccw'
  | 'house'
  | 'layout-dashboard'
  | 'folder'
  | 'chart-column'
  | 'file-text'
  | 'mail'
  | 'lock'
  | 'clock'
  | 'trending-up'
  | 'trending-down'
  | 'image'
  | 'paperclip'
  | 'cloud-upload'
  | 'file'
  | 'sun'
  | 'moon'
  | 'monitor'
  | 'panel-left-close'
  | 'panel-left-open'
  | 'server'
  | 'globe'
  | 'activity'
  | 'shield-alert'
  | 'phone'
  | 'wrench';

/** Lucide stroke icon drawn inline in currentColor. */
export interface IconProps {
  /** A name from the set, or an icon element of your own (sized and styled the same way). */
  name: IconInput;
  /** `sm` 16 (default) · `md` 20 · `lg` 24, or a px number. */
  size?: 'sm' | 'md' | 'lg' | number | undefined;
  /** Accessible name. Omit for decorative icons next to a text label (then aria-hidden). */
  label?: string | undefined;
  /** Default 2 (Lucide's). */
  strokeWidth?: number | undefined;
  className?: string | undefined;
}

/** Creative surface with the AURA mesh and/or grain texture. Light in every theme; content in aura-on-texture. */
export interface SurfaceProps extends React.HTMLAttributes<HTMLElement> {
  /** Default `mesh`. */
  texture?: 'mesh' | 'grain' | 'mesh-grain' | undefined;
  /** Element to render. Default `div`. */
  as?: keyof React.JSX.IntrinsicElements | undefined;
  children?: React.ReactNode | undefined;
}
/** Sets the language of built-in labels (pagination, close buttons, empty states…) and the default date display for everything inside. */
export interface AuraProviderProps {
  /** Built-in labels and date display. `sv` = Swedish labels, `sv-SE` dates, Monday weeks and the Gregorian calendar. Without a provider everything is English: labels, `en-GB` dates, Gregorian years. */
  locale?: 'th' | 'en' | 'sv' | undefined;
  /** Default calendar for DatePicker / DateRangePicker / Calendar / formatDate callers that read it. Unset: `buddhist` (พ.ศ.) for `th`, `gregory` for `en` and `sv`. */
  calendar?: 'buddhist' | 'gregory' | undefined;
  /** Override individual strings. */
  strings?: Partial<Record<string, string | ((...args: any[]) => string)>> | undefined;
  /** IANA time zone for "today" in DatePicker, DateRangePicker and Calendar, e.g. `Asia/Bangkok` (4.19). Default: the browser's. */
  timeZone?: string | undefined;
  /** `compact`: 36px fields and buttons, 40px table rows — dense admin screens. Touch screens keep 44px. Default: comfortable (or an ancestor's `data-density`). */
  density?: 'comfortable' | 'compact' | undefined;
  /** Your router's link (e.g. `Link` from `next/link`), used by every AURA component that renders a link: Button with `href`, SideNav, Breadcrumb, Stat, Pagination, DataTable row links. It gets `href`, `className`, `aria-current`, the children and the ref. A component's own `linkComponent` wins. */
  linkComponent?: React.ElementType | undefined;
  children?: React.ReactNode | undefined;
}

/** `warning` (5.1): needs attention but still works — Warning, Problem, Degraded, At risk. */
export type StatusTone = 'neutral' | 'progress' | 'ready' | 'warning' | 'blocked';
/** Status pill: tone fill + icon + the status word. Tone comes from the word unless given. */
export interface StatusPillProps {
  /** The status word shown, e.g. "In Progress". */
  children: React.ReactNode;
  /** Force a tone. Default: matched from the word (Ready/Done → ready, In Progress/In Review → progress, Warning/Problem/Degraded/At risk → warning (5.1), Blocked/Failed → blocked, anything else → neutral). */
  tone?: StatusTone | undefined;
  className?: string | undefined;
}

/** 16px checkbox with 4px corners; ink when checked, a dash when indeterminate. */
export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'type' | 'checked' | 'defaultChecked'
> {
  /** Controlled state; pair with onChange. Or use defaultChecked. */
  checked?: boolean | undefined;
  defaultChecked?: boolean | undefined;
  indeterminate?: boolean | undefined;
  /** Accessible name. In 5.x it is shown only when given as children; **6.0 shows `label` beside the box** like
   * Switch and TextField. Without children and without `hideLabel` it warns once in development. */
  label?: string | undefined;
  /** A bare box named by `label`, e.g. in a table row: keeps it hidden in 6.0 and silences the 5.1 notice. */
  hideLabel?: boolean | undefined;
  /** The visible label beside the box. */
  children?: React.ReactNode | undefined;
  /** Second line under the visible label (needs an id to be linked). */
  description?: React.ReactNode | undefined;
  onChange?: ((checked: boolean) => void) | undefined;
  disabled?: boolean | undefined;
  tabIndex?: number | undefined;
  className?: string | undefined;
}

/** 32px round button holding one icon. */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconInput;
  /** `danger` colours the icon and hover for a destructive action (Delete, Revoke). */
  tone?: 'neutral' | 'danger' | undefined;
  /** Accessible name and tooltip (required). */
  label: string;
  /** Icon size. Default `sm` (16). */
  size?: 'sm' | 'md' | undefined;
}

export interface MenuItem {
  label?: string | undefined;
  icon?: IconInput | undefined;
  /** Present = a checkable item (menuitemcheckbox). */
  checked?: boolean | undefined;
  disabled?: boolean | undefined;
  /** Keep the menu open after choosing (checkbox lists). */
  keepOpen?: boolean | undefined;
  /** Short right-aligned hint, e.g. a shortcut. */
  hint?: string | undefined;
  /** A divider instead of an item. */
  separator?: boolean | undefined;
  onSelect?: (() => void) | undefined;
  /** A link item (4.19): rendered through your router's link (`linkComponent`), e.g. a download or "Open in new tab". */
  href?: string | undefined;
  /** Link target, e.g. `_blank`, with `href`. */
  target?: string | undefined;
  /** `danger` for destructive items (Void, Delete): danger colour, put them last after a separator. (4.19) */
  tone?: 'danger' | undefined;
  /** `radio` makes a single-choice item (menuitemradio); `checked` marks the chosen one. (4.19) */
  type?: 'radio' | undefined;
  /** Radio items with the same `group` form one labelled group (the name is read out). (4.19) */
  group?: string | undefined;
}
/** Popover list anchored to an element, rendered in a portal. */
export interface MenuProps {
  /** The element it opens from (usually the button that was clicked). */
  anchor: HTMLElement;
  items: MenuItem[];
  /** Accessible name. */
  label: string;
  /** Called on choose, Escape, Tab or outside click. `restoreFocus` is true for keyboard closes. */
  onClose: (restoreFocus: boolean) => void;
  /** Focus the first item on open. Default true; turn off only for static demos. */
  autoFocus?: boolean | undefined;
  /** Router link for items with `href`; defaults to AuraProvider's `linkComponent`, then `<a>`. (4.19) */
  linkComponent?: React.ElementType | undefined;
}

/* ---------- Forms ---------- */
interface FieldProps {
  /** Visible label; also the accessible name. */
  label: string;
  /** Helper line under the field (caption, fg-secondary). */
  hint?: React.ReactNode | undefined;
  /** Replaces the hint, turns the edge fg-danger and sets aria-invalid. Write it as the fix. */
  error?: React.ReactNode | undefined;
  /** Adds a red asterisk and the native required attribute. */
  required?: boolean | undefined;
  /** Adds "(optional)" after the label. */
  optional?: boolean | undefined;
}
export interface TextFieldProps extends FieldProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'required'> {
  /** Leading icon inside the field. */
  icon?: IconInput | undefined;
  /** Trailing unit, e.g. "THB". */
  suffix?: React.ReactNode | undefined;
}
/** A password input with a show/hide button. All TextField props; `ref` reaches the input (react-hook-form `register`). */
export interface PasswordFieldProps extends Omit<TextFieldProps, 'type' | 'suffix'> {
  /** Set false to hide the show/hide button. Default true. */
  toggle?: boolean | undefined;
}
/** One entry of a FormErrorSummary: the field's `id` (or `name`) and what to fix. */
export interface FormErrorItem {
  field: string;
  message: React.ReactNode;
}
/** The list of problems at the top of a form after a failed submit; each links to its field (GOV.UK pattern). */
export interface FormErrorSummaryProps {
  /** A list, or react-hook-form's `formState.errors` as is (`{ name: { message } }`). Empty → renders nothing. */
  errors: FormErrorItem[] | Record<string, { message?: React.ReactNode | undefined } | undefined>;
  /** Default "Fix N fields to continue" in the provider's language. */
  title?: React.ReactNode | undefined;
  /** Called with the field when a link is followed, e.g. react-hook-form's `setFocus`. Default: focus the element whose id (or name) is the field. */
  onSelect?: ((field: string) => void) | undefined;
  /** Change it on every submit (e.g. `formState.submitCount`) to move focus to the summary again. It also takes focus when errors first appear. */
  focusKey?: unknown;
  className?: string | undefined;
  id?: string | undefined;
}
/** An applied filter, shown as a removable chip. */
export interface ActiveFilter {
  id: string;
  label: React.ReactNode;
  onRemove: () => void;
}
/** The row above a table: search, filter controls, applied-filter chips, result count and actions. Wraps below md. */
export interface FilterBarProps {
  /** Search text (controlled). Omit `onSearchChange` to hide the search field. */
  search?: string | undefined;
  /** Called after typing pauses (`searchDelay`), and at once on Enter or clear — ready to write to the URL. */
  onSearchChange?: ((value: string) => void) | undefined;
  /** ms to wait after the last keystroke. Default 300. */
  searchDelay?: number | undefined;
  searchLabel?: string | undefined;
  searchPlaceholder?: string | undefined;
  /** Filter controls beside the search: Select, SegmentedControl, a Popover of options… */
  children?: React.ReactNode | undefined;
  /** Applied filters as chips, each with its own remove button. */
  filters?: ActiveFilter[] | undefined;
  /** Adds "Clear all" while any filter or search is set. */
  onClearAll?: (() => void) | undefined;
  /** A number ("312 results", announced politely) or your own node. */
  resultCount?: number | React.ReactNode | undefined;
  /** Trailing slot: export, a New button… */
  actions?: React.ReactNode | undefined;
  /** Accessible name of the region. Default "Filters". */
  label?: string | undefined;
  className?: string | undefined;
}
/** One command in the palette. */
export interface CommandItem {
  id: string;
  /** Text shown and searched. */
  label: string;
  /** Items with the same group are listed together under its heading, in first-seen order. */
  group?: string | undefined;
  icon?: IconInput | undefined;
  description?: string | undefined;
  /** Extra words that find it ("invoice" → Billing). */
  keywords?: string[] | undefined;
  /** A shortcut shown at the right, e.g. "G I". Display only. */
  shortcut?: string | undefined;
  disabled?: boolean | undefined;
  /** Runs when chosen (Enter or click); the palette then closes. */
  onSelect?: (() => void) | undefined;
}
/** A command palette: a modal search over commands and pages, grouped, fully keyboard-driven. */
export interface CommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandItem[];
  /** Also called with the chosen item (after its own onSelect). */
  onSelect?: ((item: CommandItem) => void) | undefined;
  /** Accessible name. Default "Command menu". */
  label?: string | undefined;
  placeholder?: string | undefined;
  /** Default "No matches". */
  emptyText?: string | undefined;
  /** Shown when nothing matches, instead of `emptyText`: any content, e.g. a hint and a "Create member" button. (4.17) */
  empty?: React.ReactNode | undefined;
  /** ⌘K / Ctrl+K toggles the palette from anywhere on the page. Default true. */
  hotkey?: boolean | undefined;
  /** Replace the Thai-aware default filter, or `false` to show `items` as given — for results your server already
   * searched (4.17). */
  filter?: ((item: CommandItem, query: string) => boolean) | false | undefined;
  /** The search text, controlled (4.17). Pair with `onQueryChange`; fetch results for it and pass them as `items`. */
  query?: string | undefined;
  /** Called on every keystroke, and with "" when the palette closes. (4.17) */
  onQueryChange?: ((query: string) => void) | undefined;
  /** Results are on their way: a "Searching…" row, `aria-busy`, and the result count announced when they arrive. The
   * current items stay listed meanwhile. (4.17) */
  loading?: boolean | undefined;
  className?: string | undefined;
}
export interface TextareaProps
  extends FieldProps, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'required'> {}
export type SelectOption = string | { value: string; label: string; disabled?: boolean | undefined };
/** 5.3: opens AURA's own list (light and dark alike) over a real `<select>`, which keeps `name`, `required`, the ref,
 * `onChange`, react-hook-form `register` and form posts. `multiple` or `size > 1` keeps the native list box. */
export interface SelectProps extends FieldProps, Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'required'> {
  /** The choices; or pass `<option>` / `<optgroup>` children instead (5.3: optional). */
  options?: SelectOption[] | undefined;
  /** Shown in fg-tertiary on the closed field until something is chosen; not listed as a choice. */
  placeholder?: string | undefined;
  icon?: IconInput | undefined;
}
export type ChoiceOption =
  string | { value: string; label: string; description?: string | undefined; disabled?: boolean | undefined };
export interface RadioGroupProps extends FieldProps {
  options: ChoiceOption[];
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  name?: string | undefined;
  /** Default `vertical`. */
  orientation?: 'vertical' | 'horizontal' | undefined;
  disabled?: boolean | undefined;
  id?: string | undefined;
  className?: string | undefined;
}
export interface SwitchProps {
  label?: string | undefined;
  description?: string | undefined;
  checked?: boolean | undefined;
  defaultChecked?: boolean | undefined;
  onChange?: ((checked: boolean) => void) | undefined;
  disabled?: boolean | undefined;
  /** Required when there is no visible label. */
  'aria-label'?: string | undefined;
  id?: string | undefined;
  className?: string | undefined;
}

/* ---------- Feedback & overlays ---------- */
export type FeedbackTone = 'info' | 'success' | 'warning' | 'danger';
export interface AlertProps {
  tone?: FeedbackTone | undefined;
  title?: React.ReactNode | undefined;
  children?: React.ReactNode | undefined;
  /** Usually a secondary Button. */
  action?: React.ReactNode | undefined;
  /** Adds a close button. */
  onDismiss?: (() => void) | undefined;
  className?: string | undefined;
}
export interface ToastOptions {
  title: string;
  description?: string | undefined;
  tone?: FeedbackTone | undefined;
  action?: { label: string; onClick?: (() => void) | undefined } | undefined;
  /** ms before it closes itself. Default 5000; Infinity keeps it until dismissed. */
  duration?: number | undefined;
  /** Reuse an id to replace a toast in place (same position, timer restarts) — never a second toast. */
  id?: string | undefined;
}
/** Options for the shorthands (`toast.success(title, opts)` …): everything but the title and tone. */
export type ToastShorthandOptions = Omit<ToastOptions, 'title' | 'tone'>;
export interface TooltipProps {
  content: React.ReactNode;
  /** One focusable element. */
  children: React.ReactElement;
  /** Preferred side. Default `top`. `left` / `right` (4.20) for icon buttons at the right edge of a table or in a
   * collapsed rail. Flips to the opposite side when clipped, and always stays inside the viewport. */
  side?: 'top' | 'bottom' | 'left' | 'right' | undefined;
  /** Hover delay in ms. Default 400. */
  delay?: number | undefined;
  /** Force open (demos, tests). */
  open?: boolean | undefined;
}
export interface FieldPropsPublic {
  label: string;
  hint?: React.ReactNode | undefined;
  error?: React.ReactNode | undefined;
  required?: boolean | undefined;
  optional?: boolean | undefined;
}
export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode | undefined;
  children?: React.ReactNode | undefined;
  /** Buttons, right-aligned: secondary Cancel, then the primary action. */
  footer?: React.ReactNode | undefined;
  /** `sm` 400 · `md` 560 (default) · `lg` 720. */
  size?: 'sm' | 'md' | 'lg' | undefined;
  /** Default true. False hides the close button and ignores Escape and scrim clicks. */
  dismissible?: boolean | undefined;
  /** Use `alertdialog` for destructive confirmations. */
  role?: 'dialog' | 'alertdialog' | undefined;
  /** Default true. Turn off only for static demos. */
  autoFocus?: boolean | undefined;
  className?: string | undefined;
}

/* ---------- Layout & navigation ---------- */
export interface CardProps {
  title?: React.ReactNode | undefined;
  description?: React.ReactNode | undefined;
  /** Top-right, usually an IconButton. */
  actions?: React.ReactNode | undefined;
  footer?: React.ReactNode | undefined;
  children?: React.ReactNode | undefined;
  /** Default `enterprise`. `creative` is for marketing and onboarding only. */
  variant?: 'enterprise' | 'creative' | undefined;
  /** Heading level of the title. Default 3 — use 2 when cards sit directly under the page h1. */
  headingLevel?: 2 | 3 | 4 | 5 | 6 | undefined;
  /** Hover edge for clickable cards. */
  interactive?: boolean | undefined;
  as?: keyof React.JSX.IntrinsicElements | undefined;
  className?: string | undefined;
  /** id for the title element; the card is then labelled by it (aria-labelledby). */
  titleId?: string | undefined;
}
export interface TabItem {
  id: string;
  label: string;
  icon?: IconInput | undefined;
  count?: number | undefined;
  disabled?: boolean | undefined;
  content?: React.ReactNode | undefined;
  /** A route (4.19). When every tab has one, Tabs renders a `nav` of links (section tabs that are pages), with
   * `aria-current="page"` on the current one and no panels. */
  href?: string | undefined;
}
export interface TabsProps {
  tabs: TabItem[];
  /** Accessible name for the tab list (or the nav, for link tabs). */
  label: string;
  /** The current tab's id. For link tabs, the current route's tab. */
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((id: string) => void) | undefined;
  /** Router link for tabs with `href`; defaults to AuraProvider's `linkComponent`, then `<a>`. (4.19) */
  linkComponent?: React.ElementType | undefined;
  className?: string | undefined;
}
export interface NavItem {
  id: string;
  label: string;
  icon?: IconInput | undefined;
  count?: number | undefined;
  /** Anything beside the label, e.g. a status dot or a `Badge`. */
  badge?: React.ReactNode | undefined;
  href?: string | undefined;
  /** Makes this item a collapsible group of links. The group header is a button, never a link. */
  children?: NavItem[] | undefined;
  /** Start open. A group also opens by itself when one of its items is the current one. */
  defaultOpen?: boolean | undefined;
}
export interface SideNavProps {
  sections?: Array<{ title?: string | undefined; items: NavItem[] }> | undefined;
  items?: NavItem[] | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((id: string) => void) | undefined;
  header?: React.ReactNode | undefined;
  footer?: React.ReactNode | undefined;
  /** Default "Main". */
  label?: string | undefined;
  /** Router link for items with `href`; defaults to the AuraProvider's `linkComponent`, then `<a>`. */
  linkComponent?: React.ElementType | undefined;
  /** Icon-only rail (`aura-sidenav-rail-width`, 64px). Labels show as tooltips and stay the accessible names; a group
   * expands the rail when clicked. Controlled; pair with `onCollapsedChange`. */
  collapsed?: boolean | undefined;
  /** Starting state when `collapsed` isn't controlled. Default false. */
  defaultCollapsed?: boolean | undefined;
  /** Called by the toggle button, and by a group clicked in the rail (with `false`). Save it to keep the choice. */
  onCollapsedChange?: ((collapsed: boolean) => void) | undefined;
  /** Adds a collapse / expand button at the bottom. AppShell hides it in its phone drawer. */
  collapsible?: boolean | undefined;
  /** The 1px right edge that divides the nav from the page. Default true; `false` when your layout draws its own
   * divider. (5.1) */
  bordered?: boolean | undefined;
  className?: string | undefined;
}
export interface BreadcrumbProps {
  /** Root first; the last item is the current page. */
  items: Array<{ label: string; href?: string | undefined; onClick?: (() => void) | undefined }>;
  label?: string | undefined;
  /** Your router's link (e.g. `Link` from `next/link`) for this component; defaults to AuraProvider's `linkComponent`, then `<a>`. */
  linkComponent?: React.ElementType | undefined;
  className?: string | undefined;
}
export interface AvatarProps {
  /** Accessible name; also gives the initials and a stable colour. */
  name: string;
  src?: string | undefined;
  /** `sm` 24 · `md` 32 (default) · `lg` 40. */
  size?: 'sm' | 'md' | 'lg' | undefined;
  status?: 'online' | undefined;
  className?: string | undefined;
}

/* ---------- 4.2: menus, pickers, drawers, layout ---------- */

export interface DropdownMenuProps {
  /** One element — usually a Button or IconButton. It gets aria-haspopup, aria-expanded and the click handler. */
  trigger: React.ReactElement;
  items: MenuItem[];
  /** Accessible name for the menu. */
  label?: string | undefined;
  /** Router link for items with `href`. (4.19) */
  linkComponent?: React.ElementType | undefined;
}

export interface ComboboxOption {
  value: string;
  label: string;
  /** Second line in the list; also searched. */
  description?: string | undefined;
  /** Extra search terms (English name, phone, code…). */
  keywords?: string[] | undefined;
  disabled?: boolean | undefined;
  /** Leading icon in the list. */
  icon?: IconInput | undefined;
}
/** Combobox with `multiple`: pick any number; the picks show as removable chips in the field. */
export interface ComboboxMultipleProps extends Omit<
  ComboboxProps,
  'value' | 'defaultValue' | 'onChange' | 'clearable'
> {
  multiple: true;
  /** Selected option values, in the order they were picked (controlled). */
  value?: string[] | undefined;
  defaultValue?: string[] | undefined;
  onChange?: ((value: string[]) => void) | undefined;
  /** Clear-all button while anything is selected. Default true. */
  clearable?: boolean | undefined;
  /** Most picks allowed; further options are disabled. */
  max?: number | undefined;
}
export interface ComboboxProps extends FieldProps {
  options: Array<ComboboxOption | string>;
  /** Selected option value (controlled). */
  value?: string | null | undefined;
  defaultValue?: string | null | undefined;
  onChange?: ((value: string | null) => void) | undefined;
  id?: string | undefined;
  name?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  readOnly?: boolean | undefined;
  /** Leading icon. Default `search`. */
  icon?: IconInput | undefined;
  /** Clear button while a value is selected (Escape clears too). Default true. */
  clearable?: boolean | undefined;
  /** Server-side search: called with the typed text; the component stops filtering and shows `options` as given. */
  onSearch?: ((query: string) => void) | undefined;
  loading?: boolean | undefined;
  loadingText?: string | undefined;
  emptyText?: string | undefined;
  /** Max options rendered. Default 200 — narrow with typing beyond that. */
  limit?: number | undefined;
  /** Replace the Thai-aware default filter (label, description, keywords). */
  filter?: ((option: ComboboxOption, query: string) => boolean) | undefined;
  className?: string | undefined;
}

/** Number input: thousands separators, +/− buttons, arrow keys, min/max/step, prefix/suffix (฿, %). */
export interface NumberFieldProps extends FieldProps {
  /** The number (controlled). `null` = empty. */
  value?: number | null | undefined;
  defaultValue?: number | null | undefined;
  /** Called with the parsed number (or null when emptied) as the person types, and with the clamped value on blur. */
  onChange?: ((value: number | null) => void) | undefined;
  min?: number | undefined;
  max?: number | undefined;
  /** Arrow keys and buttons move by this. Default 1. PageUp/PageDown move 10×. */
  step?: number | undefined;
  /** Decimal places shown and kept. Default: 0 when step is whole, else step's decimals. */
  decimals?: number | undefined;
  /** Text before the number, e.g. `฿`. */
  prefix?: React.ReactNode | undefined;
  /** Text after the number, e.g. `%` or `ชิ้น`. */
  suffix?: React.ReactNode | undefined;
  /** +/− buttons beside the number. Default true. */
  stepper?: boolean | undefined;
  id?: string | undefined;
  name?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  readOnly?: boolean | undefined;
  className?: string | undefined;
  onBlur?: React.FocusEventHandler<HTMLInputElement> | undefined;
}

/** One step of a Stepper. */
export interface StepItem {
  id: string;
  label: React.ReactNode;
  /** Short line under the label, e.g. what the step asks for. */
  description?: React.ReactNode | undefined;
}
/** Progress through a multi-step flow (wizard, checkout, booking). */
export interface StepperProps {
  steps: StepItem[];
  /** id of the step the person is on. Steps before it are completed. */
  current: string;
  /** Accessible name of the list. Default: none (give one when the page has several). */
  label?: string | undefined;
  /** Makes completed steps buttons that go back to them. Upcoming steps never are. */
  onStepClick?: ((id: string) => void) | undefined;
  /** Default `horizontal`. Below `sm` a horizontal stepper shows only the current step ("Step 2 of 4"). */
  orientation?: 'horizontal' | 'vertical' | undefined;
  className?: string | undefined;
}

export interface SegmentedOption {
  value: string;
  label: string;
  icon?: IconInput | undefined;
  /** Show only the icon; `label` becomes its accessible name and tooltip. */
  iconOnly?: boolean | undefined;
  disabled?: boolean | undefined;
}
/** A row of 2–5 mutually exclusive choices that apply at once (view, period, unit). A radio group underneath. */
export interface SegmentedControlProps {
  /** Accessible name of the group, e.g. "View". Required. */
  label: string;
  options: Array<SegmentedOption | string>;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  /** `md` (default, 36px) or `sm` (28px) for toolbars. */
  size?: 'sm' | 'md' | undefined;
  /** Stretch across the container, segments equal width. */
  fullWidth?: boolean | undefined;
  disabled?: boolean | undefined;
  id?: string | undefined;
  className?: string | undefined;
}

/** ISO date string, `YYYY-MM-DD` (Gregorian — the era is display only). */
export type ISODate = string;
export interface DateDisplayOptions {
  /** Components: the AuraProvider's locale, else `en`. `formatDate()` (no provider to read): `en` unless given (5.0; `th` before). */
  locale?: 'th' | 'en' | 'sv' | undefined;
  /** `buddhist` (พ.ศ.; default for th) or `gregory` (ค.ศ.; default for en and sv). */
  calendar?: 'buddhist' | 'gregory' | undefined;
}
export interface CalendarProps extends DateDisplayOptions {
  start?: ISODate | null | undefined;
  end?: ISODate | null | undefined;
  focus?: ISODate | null | undefined;
  range?: boolean | undefined;
  /** Earliest / latest day; `'today'` means today in `timeZone` (4.19). */
  min?: ISODate | 'today' | undefined;
  max?: ISODate | 'today' | undefined;
  isDateDisabled?: ((iso: ISODate) => boolean) | undefined;
  /** 0 = Sunday (Thai default), 1 = Monday. */
  weekStartsOn?: 0 | 1 | undefined;
  /** IANA time zone that decides which day is "today" (the marker, `min`/`max="today"`, the Today button), e.g.
   * `Asia/Bangkok`. Default: the provider's `timeZone`, else the browser's. (4.19) */
  timeZone?: string | undefined;
  /** Today, given outright (ISO). Wins over `timeZone`; handy in tests and server-rendered pages. (4.19) */
  today?: ISODate | undefined;
  onSelect?: ((iso: ISODate | null) => void) | undefined;
  /** Adds a Clear link to the footer. */
  onClear?: (() => void) | undefined;
  /** false hides the Today / Clear footer. */
  footer?: boolean | undefined;
  /** Default true: focuses the selected (or today's) day on mount. */
  autoFocus?: boolean | undefined;
}
interface DateFieldProps extends FieldProps, DateDisplayOptions {
  id?: string | undefined;
  name?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  /** Clear button while there is a value. Default true. */
  clearable?: boolean | undefined;
  /** Earliest / latest day; `'today'` means today in `timeZone` (4.19). */
  min?: ISODate | 'today' | undefined;
  max?: ISODate | 'today' | undefined;
  isDateDisabled?: ((iso: ISODate) => boolean) | undefined;
  weekStartsOn?: 0 | 1 | undefined;
  /** IANA time zone that decides which day is "today" (the marker, `min`/`max="today"`, the Today button), e.g.
   * `Asia/Bangkok`. Default: the provider's `timeZone`, else the browser's. (4.19) */
  timeZone?: string | undefined;
  /** Today, given outright (ISO). Wins over `timeZone`; handy in tests and server-rendered pages. (4.19) */
  today?: ISODate | undefined;
  className?: string | undefined;
}
export interface DatePickerProps extends DateFieldProps {
  value?: ISODate | null | undefined;
  defaultValue?: ISODate | null | undefined;
  onChange?: ((value: ISODate | null) => void) | undefined;
}
export interface DateRange {
  start: ISODate | null;
  end: ISODate | null;
}
export interface DateRangePickerProps extends DateFieldProps {
  value?: DateRange | undefined;
  defaultValue?: DateRange | undefined;
  onChange?: ((value: DateRange) => void) | undefined;
}

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  /** Default `right`. */
  side?: 'right' | 'left' | undefined;
  /** sm 360 · md 480 (default) · lg 640 · nav = SideNav width. Full width below 640px. */
  size?: 'sm' | 'md' | 'lg' | 'nav' | undefined;
  title?: string | undefined;
  description?: React.ReactNode | undefined;
  children?: React.ReactNode | undefined;
  /** Buttons, right-aligned; stacked on phones. */
  footer?: React.ReactNode | undefined;
  /** Scrim click and Escape close it. Default true. */
  dismissible?: boolean | undefined;
  /** Default true: focus moves to the element with `data-autofocus`, else the first control in the body. False only for static demos. */
  autoFocus?: boolean | undefined;
  /** Needed when there is no title. */
  'aria-label'?: string | undefined;
  className?: string | undefined;
}

export type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl';
export type Responsive<T> = T | Partial<Record<Breakpoint, T>>;
/** Spacing step (aura-space-N) or any CSS length. */
export type Space = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | string;
export interface StackProps {
  direction?: Responsive<'row' | 'column'> | undefined;
  gap?: Responsive<Space> | undefined;
  /** Cross-axis alignment; responsive like direction ({ base: 'stretch', sm: 'flex-end' }). */
  align?: Responsive<React.CSSProperties['alignItems']> | undefined;
  justify?: React.CSSProperties['justifyContent'] | undefined;
  wrap?: boolean | undefined;
  as?: keyof React.JSX.IntrinsicElements | undefined;
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
  children?: React.ReactNode | undefined;
}
export interface GridProps {
  columns?: Responsive<number> | undefined;
  /** Fit as many columns as there is room for, each at least this wide (px). Overrides columns. */
  minItemWidth?: number | undefined;
  gap?: Responsive<Space> | undefined;
  as?: keyof React.JSX.IntrinsicElements | undefined;
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
  children?: React.ReactNode | undefined;
}
export interface AppShellProps {
  /** Usually a SideNav. Fixed from 1024px up; in a Drawer behind a menu button below. */
  nav?: React.ReactElement | undefined;
  /** Top bar content (title, search, account menu). */
  header?: React.ReactNode | undefined;
  children?: React.ReactNode | undefined;
  navLabel?: string | undefined;
  menuLabel?: string | undefined;
  /** id of `<main>`, for a skip link. Default `main`. */
  mainId?: string | undefined;
  /** A BottomNav for phones (4.19). Shown below its `hideFrom` breakpoint; the content keeps room for it, and a
   * viewport ActionBar sits on top of it. With a `bottomNav` and no `nav`, there is no menu button. */
  bottomNav?: React.ReactElement | undefined;
  className?: string | undefined;
}

/* ---------- 4.20: Separator, Table ---------- */

export interface SeparatorProps {
  /** Default `horizontal` (full width). `vertical` fills the height of a flex row, e.g. between toolbar groups. */
  orientation?: 'horizontal' | 'vertical' | undefined;
  /** Default true: hidden from screen readers. `false` renders `role="separator"`, announced as a boundary. */
  decorative?: boolean | undefined;
  /** Space on both sides, as an `aura-space-*` step (e.g. 4 = 16px). Default 0. */
  spacing?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | undefined;
  className?: string | undefined;
}
export interface TableProps extends Omit<React.TableHTMLAttributes<HTMLTableElement>, 'className'> {
  /** The table's name (a `<caption>`). Give every table one; `captionHidden` keeps it for screen readers only. */
  caption?: React.ReactNode | undefined;
  captionHidden?: boolean | undefined;
  /** `compact` tightens the cell padding. Default follows the page. */
  density?: 'comfortable' | 'compact' | undefined;
  className?: string | undefined;
  children?: React.ReactNode | undefined;
}
export interface TableSectionProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string | undefined;
}
export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  className?: string | undefined;
}
export interface TableCellProps extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'align' | 'scope'> {
  /** Text alignment. `numeric` implies `end`. */
  align?: 'start' | 'center' | 'end' | undefined;
  /** Money and counts: right-aligned, tabular figures. */
  numeric?: boolean | undefined;
  /** IDs and codes in the mono face. */
  mono?: boolean | undefined;
  /** Th only. Default `col`. */
  scope?: 'col' | 'row' | 'colgroup' | 'rowgroup' | undefined;
  className?: string | undefined;
}

/* ---------- 4.19: ActionBar, BottomNav ---------- */

export interface ActionBarProps {
  /** Buttons, right-aligned (the primary one last). */
  children?: React.ReactNode | undefined;
  /** A short line such as "Total 107,000.00 THB · due Oct 22, 2026" or "Unsaved changes". It sits in a polite live
   * region that is always in the page, so a change is announced. */
  status?: React.ReactNode | undefined;
  /** `viewport` (default): sticks to the bottom of the screen, padded for the home indicator, above a BottomNav.
   * `container`: sticks to the bottom of the scrolling card or panel it's in. Both stay in the flow at the end of their
   * parent, so they never cover the last field. Make it the last child of the form or card it belongs to: like any
   * `position: sticky` element it sticks only while that parent is on screen. */
  position?: 'viewport' | 'container' | undefined;
  /** Bulk actions: the number of selected rows. Shows "N selected" in the status; at 0 the bar hides (its live region
   * stays, so the next selection is announced) and its actions leave the tab order. */
  selected?: number | undefined;
  /** Adds a "Clear" button next to the count. */
  onClearSelection?: (() => void) | undefined;
  /** Name of the region. Default "Actions". */
  label?: string | undefined;
  className?: string | undefined;
}

export interface BottomNavItem {
  id: string;
  /** Short: five items share 320px. */
  label: string;
  icon: IconInput;
  href?: string | undefined;
  /** A number on the icon (99+ above 99); 0 hides it. Part of the item's accessible name. */
  count?: number | undefined;
  /** A dot on the icon, e.g. "new". Give it words with `badgeLabel`. */
  badge?: boolean | undefined;
  /** Read after the label when `badge` is set, e.g. "new". */
  badgeLabel?: string | undefined;
}
export interface BottomNavProps {
  /** 2–5 items. */
  items: BottomNavItem[];
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((id: string) => void) | undefined;
  /** Default "Main". */
  label?: string | undefined;
  /** Router link for items with `href`; defaults to the AuraProvider's `linkComponent`, then `<a>`. */
  linkComponent?: React.ElementType | undefined;
  /** Hidden from this breakpoint up, in CSS (so the server's HTML is right). Default `lg` (1024px); `false` never hides. */
  hideFrom?: 'md' | 'lg' | 'xl' | false | undefined;
  className?: string | undefined;
}

/* ---------- 4.3: Stat, TimePicker, FileUpload ---------- */

export interface StatChange {
  /** Shown as written, e.g. "+12%" or "−3". */
  value: React.ReactNode;
  direction?: 'up' | 'down' | 'flat' | undefined;
  /** Default: up = positive, down = negative. Set it when a rise is bad (cancellations, wait time). */
  tone?: 'positive' | 'negative' | 'neutral' | undefined;
  /** e.g. "vs last month". */
  label?: React.ReactNode | undefined;
}
export interface StatProps {
  /** Your router's link (e.g. `Link` from `next/link`) for this component; defaults to AuraProvider's `linkComponent`, then `<a>`. */
  linkComponent?: React.ElementType | undefined;
  label: React.ReactNode;
  value?: React.ReactNode | undefined;
  /** Small unit after the value ("งาน", "คน", "%"). */
  unit?: React.ReactNode | undefined;
  change?: StatChange | undefined;
  caption?: React.ReactNode | undefined;
  icon?: IconInput | undefined;
  /** Skeleton in place of the value. */
  loading?: boolean | undefined;
  /** Makes the whole card a link or a button (drill-down). */
  href?: string | undefined;
  onClick?: (() => void) | undefined;
  className?: string | undefined;
}

export interface TimePickerProps extends FieldProps {
  /** "HH:mm", 24-hour. */
  value?: string | null | undefined;
  defaultValue?: string | null | undefined;
  onChange?: ((value: string | null) => void) | undefined;
  /** Minutes between listed slots. Default 30. */
  step?: number | undefined;
  /** Earliest and latest allowed times, "HH:mm". Typed times outside them are refused with a message. */
  min?: string | undefined;
  max?: string | undefined;
  isTimeDisabled?: ((time: string) => boolean) | undefined;
  /** Slot to scroll to when empty (e.g. "09:00"). Default: min. */
  suggest?: string | undefined;
  /** Clear button while there is a value. Default true. */
  clearable?: boolean | undefined;
  id?: string | undefined;
  name?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  readOnly?: boolean | undefined;
  className?: string | undefined;
}

export interface UploadItem {
  id: string;
  /** The browser File (absent for files already on the server). */
  file?: File | undefined;
  name: string;
  size?: number | undefined;
  type?: string | undefined;
  /** ready = picked, not sent yet. Set uploading/done yourself while sending. */
  status: 'ready' | 'uploading' | 'done' | 'error';
  /** 0–100 while uploading. */
  progress?: number | undefined;
  error?: string | undefined;
  /** For files already stored (edit forms). */
  url?: string | undefined;
}
export interface FileUploadProps extends FieldProps {
  value?: UploadItem[] | undefined;
  defaultValue?: UploadItem[] | undefined;
  onChange?: ((items: UploadItem[]) => void) | undefined;
  onRemove?: ((item: UploadItem) => void) | undefined;
  /** Same syntax as `<input accept>`: "image/*,.pdf". Checked on drop too. */
  accept?: string | undefined;
  multiple?: boolean | undefined;
  /** Bytes per file. */
  maxSize?: number | undefined;
  /** With multiple. */
  maxFiles?: number | undefined;
  id?: string | undefined;
  name?: string | undefined;
  disabled?: boolean | undefined;
  className?: string | undefined;
}

/* ---------- 4.4: general-purpose components, theming ---------- */
export type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone | undefined;
  /** soft (default) · solid · outline */
  variant?: 'soft' | 'solid' | 'outline' | undefined;
  icon?: IconInput | undefined;
}
export interface TagProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
  children: React.ReactNode;
  icon?: IconInput | undefined;
  /** Adds a remove button (applied filters, chosen people). */
  onRemove?: (() => void) | undefined;
  removeLabel?: string | undefined;
  /** Makes it a toggle chip (filter chips): renders a button with aria-pressed. */
  selected?: boolean | undefined;
  onClick?: ((e: React.MouseEvent<HTMLButtonElement>) => void) | undefined;
  disabled?: boolean | undefined;
}
export interface ProgressProps {
  /** Omit for indeterminate. */
  value?: number | undefined;
  max?: number | undefined;
  label?: React.ReactNode | undefined;
  'aria-label'?: string | undefined;
  showValue?: boolean | undefined;
  /** Replaces the % text, e.g. "3 of 5 files". Also read out as aria-valuetext. */
  valueLabel?: React.ReactNode | undefined;
  hint?: React.ReactNode | undefined;
  tone?: Tone | undefined;
  size?: 'sm' | 'md' | undefined;
  id?: string | undefined;
  className?: string | undefined;
}
export interface SkeletonProps {
  variant?: 'text' | 'rect' | 'circle' | undefined;
  /** text only: number of lines (the last is shorter). */
  lines?: number | undefined;
  width?: number | string | undefined;
  height?: number | string | undefined;
  /** circle diameter. */
  size?: number | undefined;
  className?: string | undefined;
}
export interface EmptyStateProps {
  title: React.ReactNode;
  description?: React.ReactNode | undefined;
  icon?: IconInput | undefined;
  /** One or two buttons. */
  action?: React.ReactNode | undefined;
  size?: 'sm' | 'md' | undefined;
  bordered?: boolean | undefined;
  headingLevel?: 2 | 3 | 4 | 5 | 6 | undefined;
  className?: string | undefined;
}
export interface PaginationProps {
  pageCount: number;
  /** 1-based, controlled; pair with onChange. Or defaultPage. */
  page?: number | undefined;
  defaultPage?: number | undefined;
  onChange?: ((page: number) => void) | undefined;
  /** Pages shown each side of the current one. Default 1. */
  siblingCount?: number | undefined;
  /** Render real links — page numbers and the previous / next arrows (4.17) — through your router's link. With
   * `onChange` too, onChange runs instead of following the link. */
  getHref?: ((page: number) => string) | undefined;
  label?: string | undefined;
  /** Your router's link (e.g. `Link` from `next/link`) for this component; defaults to AuraProvider's `linkComponent`, then `<a>`. */
  linkComponent?: React.ElementType | undefined;
  className?: string | undefined;
}
export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode | undefined;
  content: React.ReactNode;
  icon?: IconInput | undefined;
  disabled?: boolean | undefined;
}
export interface AccordionProps {
  items: AccordionItem[];
  /** single (default): one open at a time. multiple: any number. */
  type?: 'single' | 'multiple' | undefined;
  value?: string | null | string[] | undefined;
  defaultValue?: string | null | string[] | undefined;
  onChange?: ((value: any) => void) | undefined;
  /** single only: false keeps one section always open. Default true. */
  collapsible?: boolean | undefined;
  headingLevel?: 2 | 3 | 4 | 5 | 6 | undefined;
  id?: string | undefined;
  className?: string | undefined;
}
export interface PopoverProps {
  /** One element; it gets aria-haspopup, aria-expanded and the click toggle. */
  trigger: React.ReactElement;
  children: React.ReactNode | ((api: { close: () => void }) => React.ReactNode);
  title?: React.ReactNode | undefined;
  /** Accessible name when there is no title. */
  label?: string | undefined;
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  placement?: 'bottom-start' | 'bottom-end' | 'bottom-center' | 'top-start' | 'top-end' | 'top-center' | undefined;
  width?: number | string | undefined;
  /** Default true: focus moves to [data-autofocus] or the first control inside. */
  autoFocus?: boolean | undefined;
  id?: string | undefined;
  className?: string | undefined;
}

export interface ThemeOptions {
  /** The project's brand colour, #rgb or #rrggbb. Replaces AURA violet (links, focus ring, selection, info, progress, creative shadow in dark, mesh). */
  brand: string;
  /** Optional signal colour; replaces AURA lime in the accent dot and mesh only (success/ready stay green). */
  signal?: string | undefined;
  /** ink (default): primary buttons stay zinc ink. brand: primary buttons use the brand colour. */
  primary?: 'ink' | 'brand' | undefined;
  name?: string | undefined;
}
export interface ThemeCheck {
  theme: 'light' | 'dark';
  pair: string;
  ratio: number;
  target: number;
  pass: boolean;
}
export interface Theme {
  name: string | null;
  brand: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900, string>;
  signal: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900, string> | null;
  light: Record<string, string>;
  dark: Record<string, string>;
  checks: ThemeCheck[];
  ok: boolean;
  /** CSS overriding the tokens. No selector: the whole page. A selector (".tenant-acme") scopes it. Load after aura.css. */
  css(selector?: string): string;
}
