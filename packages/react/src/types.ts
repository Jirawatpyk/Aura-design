/* Public prop and value types of @aura/react. Components import their props from here; the published
 * declarations are generated from the sources by tsc. */
import type * as React from 'react';

/** Button look. */
export type ButtonVariant = 'primary' | 'secondary' | 'creative' | 'danger' | 'danger-secondary';

/** AURA pill button. Enterprise (`primary`, `secondary`) for product UI; `creative` for marketing moments only. */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant. Default `primary`. `danger` (filled) and `danger-secondary` (outline) are for irreversible or destructive actions only — typically the confirm button of a `Dialog role="alertdialog"`. */
  variant?: ButtonVariant;
  /** Label text — short, Title Case English or Thai. */
  children: React.ReactNode;
  /** Leading icon name (see `IconName`). Hidden while loading. */
  icon?: IconInput;
  /** Trailing icon name, e.g. `arrow-right` for forward actions. */
  iconRight?: IconInput;
  /** Shows a spinner in place of the leading icon, sets aria-busy and swallows clicks. Keeps the label and width. */
  loading?: boolean;
  /** Fills its container and lets a long label wrap onto more lines (at least 44px tall) — phones, Thai and Swedish labels. */
  fullWidth?: boolean;
}

/** A link that looks like a Button: give `Button` an `href` and it renders an `<a>` (navigation, not actions). */
export interface ButtonLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  /** Where the link goes. With `href`, Button renders an `<a>` and its ref is the `<a>`. */
  href: string;
  /** Visual variant. Default `primary`. `danger` (filled) and `danger-secondary` (outline) are for irreversible or destructive actions only — typically the confirm button of a `Dialog role="alertdialog"`. */
  variant?: ButtonVariant;
  /** Label text — say where it goes ("View Orders"), not "Click here". */
  children: React.ReactNode;
  icon?: IconInput;
  /** Trailing icon, e.g. `arrow-right`, or `external-link` with `target="_blank"`. */
  iconRight?: IconInput;
  /** Looks unavailable and can't be followed: no href, `aria-disabled`, out of the Tab order. */
  disabled?: boolean;
  /** Fills its container and lets a long label wrap (at least 44px tall). */
  fullWidth?: boolean;
  /** A router's link to render instead of `<a>`, e.g. `Link` from `next/link` (client-side navigation). It gets `href`, `className`, the children and the ref. */
  linkComponent?: React.ElementType;
}

export interface DataTableColumn {
  /** Key into each row object. */
  key: string;
  /** Header label (source style: UPPERCASE). */
  label: string;
  /** Fixed width in px; the last column usually takes the rest. */
  width?: number;
  /** Render the cell in the mono face (IDs). */
  mono?: boolean;
  /** Render the value as a StatusPill (tone picked from the word). */
  pill?: boolean;
  /** Override the tone for specific values, e.g. `{ 'QA': 'progress' }`. */
  tones?: Record<string, StatusTone>;
  /** Header becomes a button cycling asc → desc → unsorted. */
  sortable?: boolean;
  /** Value to sort by, when not the cell value (dates, amounts). */
  sortValue?: (row: Record<string, any>) => string | number | null;
  /** Custom cell content. */
  render?: (row: Record<string, any>) => React.ReactNode;
  /** Set false to keep a sized column fixed when the table is `resizable`. */
  resizable?: boolean;
  /** Resize limits in px. Defaults 64 / 480. For the flexible column, minWidth defaults to 160. */
  minWidth?: number;
  maxWidth?: number;
  /** Start pinned to the left (needs a width). */
  pinned?: boolean;
  /** Start hidden (show it from the columns button). */
  hidden?: boolean;
  /** Hide this column when the table is narrower than this (px, or a breakpoint name). For tablets: keep ID, name, date and status; drop the rest below `lg`. Not applied to stacked cards. */
  hideBelow?: number | 'sm' | 'md' | 'lg' | 'xl';
  /** Row actions (a DropdownMenu or IconButton). In stacked cards it sits top-right instead of in the field list. Give it an empty label. */
  actions?: boolean;
  /** `end` right-aligns header and cells (amounts, counts) and uses tabular figures. Default `start`. */
  align?: 'start' | 'end';
}
export interface DataTableSort {
  key: string;
  dir: 'asc' | 'desc';
}
export interface DataTableEmpty {
  /** Default `inbox`; use `search` for "no matches". */
  icon?: IconInput;
  /** Default "Nothing here yet". */
  title?: string;
  description?: string;
  /** One action, usually a secondary Button. */
  action?: React.ReactNode;
}
/** Enterprise data table: 48px rows, hairline dividers, mono header band. */
export interface DataTableProps {
  /** Defaults to ID · NAME · STATUS · OWNER (96 / 160 / 112 / auto px). */
  columns?: DataTableColumn[];
  rows: Array<Record<string, React.ReactNode>>;
  /** Column key giving each row a unique React key. Default: the first column's key. */
  rowKey?: string;
  /** Accessible name for the table. */
  label?: string;
  /** Controlled sort; pair with onSortChange. */
  sort?: DataTableSort | null;
  /** Initial sort when uncontrolled. */
  defaultSort?: DataTableSort | null;
  onSortChange?: (sort: DataTableSort | null) => void;
  /** Adds a checkbox column. */
  selectable?: boolean;
  /** Controlled selection (row keys); pair with onSelectionChange. */
  selected?: Array<string | number>;
  /** Initial selection when uncontrolled. */
  defaultSelected?: Array<string | number>;
  onSelectionChange?: (keys: Array<string | number>) => void;
  /** Shown when rows is empty. */
  empty?: DataTableEmpty;
  /** Rows per page; omit for no pagination. */
  pageSize?: number;
  /** Controlled page (1-based); pair with onPageChange. */
  page?: number;
  /** Initial page when uncontrolled. Default 1. */
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  /** Adds drag/keyboard resize handles to every column that has a width. */
  resizable?: boolean;
  onColumnResize?: (key: string, width: number) => void;
  /** Shows skeleton rows and disables sorting, select-all and paging. With `manual` and rows already shown, the rows stay (dimmed, with a progress bar) while the next page loads. */
  loading?: boolean;
  /** Server mode: `rows` is already the current page, sorted by the server. The table doesn't sort or slice; it reports
   * sort and page through onSortChange / onPageChange (or getPageHref links). Pair with `totalRows` and `pageSize`. */
  manual?: boolean;
  /** manual: rows across all pages (drives the page count, "1–25 of 312" and aria-rowcount). */
  totalRows?: number;
  /** Makes each row a link: the first column's content renders as the provider's linkComponent (or `<a>`), and a click
   * or Enter anywhere on the row follows it. Ctrl/⌘-click opens a new tab as usual. */
  getRowHref?: (row: Record<string, any>) => string;
  /** Pager arrows become links to these URLs (search-param paging). Without onPageChange the link navigates. */
  getPageHref?: (page: number) => string;
  /** Router link for getRowHref / getPageHref. Default: AuraProvider's linkComponent, else `<a>`. */
  linkComponent?: React.ElementType;
  /** Skeleton row count when there is no pageSize. Default 5. */
  skeletonRows?: number;
  /** Called on row click or Enter. */
  onRowActivate?: (row: Record<string, any>) => void;
  /** Fixed height in px: sticky header, and only the rows in view are rendered. */
  height?: number;
  /** Column menu on every header, drag-to-reorder, and the show/hide columns button. */
  columnControls?: boolean;
  /** Set false to keep column controls but turn off reordering. */
  reorderable?: boolean;
  /** Controlled column order (keys); pair with onColumnOrderChange. */
  columnOrder?: string[];
  onColumnOrderChange?: (keys: string[]) => void;
  /** Controlled hidden columns (keys); pair with onHiddenColumnsChange. */
  hiddenColumns?: string[];
  onHiddenColumnsChange?: (keys: string[]) => void;
  /** Controlled pinned columns (keys); pair with onPinnedColumnsChange. */
  pinnedColumns?: string[];
  onPinnedColumnsChange?: (keys: string[]) => void;
  /** `compact` = 40px rows (48px on touch screens). Default: the surrounding density. */
  density?: 'comfortable' | 'compact';
  /** Container width in px below which rows render as stacked cards (phones). Try 640. Measured with ResizeObserver, so it follows the container, not the window. */
  stackBelow?: number;
  className?: string;
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
  | 'panel-left-open';

/** Lucide stroke icon drawn inline in currentColor. */
export interface IconProps {
  /** A name from the set, or an icon element of your own (sized and styled the same way). */
  name: IconInput;
  /** `sm` 16 (default) · `md` 20 · `lg` 24, or a px number. */
  size?: 'sm' | 'md' | 'lg' | number;
  /** Accessible name. Omit for decorative icons next to a text label (then aria-hidden). */
  label?: string;
  /** Default 2 (Lucide's). */
  strokeWidth?: number;
  className?: string;
}

/** Creative surface with the AURA mesh and/or grain texture. Light in every theme; content in aura-on-texture. */
export interface SurfaceProps extends React.HTMLAttributes<HTMLElement> {
  /** Default `mesh`. */
  texture?: 'mesh' | 'grain' | 'mesh-grain';
  /** Element to render. Default `div`. */
  as?: keyof React.JSX.IntrinsicElements;
  children?: React.ReactNode;
}
/** Sets the language of built-in labels (pagination, close buttons, empty states…) and the default date display for everything inside. */
export interface AuraProviderProps {
  /** Built-in labels and date display. `sv` = Swedish labels, `sv-SE` dates, Monday weeks and the Gregorian calendar. Without a provider everything is English: labels, `en-GB` dates, Gregorian years. */
  locale?: 'th' | 'en' | 'sv';
  /** Default calendar for DatePicker / DateRangePicker / Calendar / formatDate callers that read it. Unset: `buddhist` (พ.ศ.) for `th`, `gregory` for `en` and `sv`. */
  calendar?: 'buddhist' | 'gregory';
  /** Override individual strings. */
  strings?: Partial<Record<string, string | ((...args: any[]) => string)>>;
  /** `compact`: 36px fields and buttons, 40px table rows — dense admin screens. Touch screens keep 44px. Default: comfortable (or an ancestor's `data-density`). */
  density?: 'comfortable' | 'compact';
  /** Your router's link (e.g. `Link` from `next/link`), used by every AURA component that renders a link: Button with `href`, SideNav, Breadcrumb, Stat, Pagination, DataTable row links. It gets `href`, `className`, `aria-current`, the children and the ref. A component's own `linkComponent` wins. */
  linkComponent?: React.ElementType;
  children?: React.ReactNode;
}

export type StatusTone = 'neutral' | 'progress' | 'ready' | 'blocked';
/** Status pill: tone fill + icon + the status word. Tone comes from the word unless given. */
export interface StatusPillProps {
  /** The status word shown, e.g. "In Progress". */
  children: React.ReactNode;
  /** Force a tone. Default: matched from the word (Ready/Done → ready, In Progress/In Review → progress, Blocked/Failed → blocked, anything else → neutral). */
  tone?: StatusTone;
  className?: string;
}

/** 16px checkbox with 4px corners; ink when checked, a dash when indeterminate. */
export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'type' | 'checked' | 'defaultChecked'
> {
  /** Controlled state; pair with onChange. Or use defaultChecked. */
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  /** Accessible name for a bare box (tables). Not needed when children give a visible label. */
  label?: string;
  /** Visible label beside the box (form use). */
  children?: React.ReactNode;
  /** Second line under the visible label (needs an id to be linked). */
  description?: React.ReactNode;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  tabIndex?: number;
  className?: string;
}

/** 32px round button holding one icon. */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconInput;
  /** `danger` colours the icon and hover for a destructive action (Delete, Revoke). */
  tone?: 'neutral' | 'danger';
  /** Accessible name and tooltip (required). */
  label: string;
  /** Icon size. Default `sm` (16). */
  size?: 'sm' | 'md';
}

export interface MenuItem {
  label?: string;
  icon?: IconInput;
  /** Present = a checkable item (menuitemcheckbox). */
  checked?: boolean;
  disabled?: boolean;
  /** Keep the menu open after choosing (checkbox lists). */
  keepOpen?: boolean;
  /** Short right-aligned hint, e.g. a shortcut. */
  hint?: string;
  /** A divider instead of an item. */
  separator?: boolean;
  onSelect?: () => void;
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
  autoFocus?: boolean;
}

/* ---------- Forms ---------- */
interface FieldProps {
  /** Visible label; also the accessible name. */
  label: string;
  /** Helper line under the field (caption, fg-secondary). */
  hint?: React.ReactNode;
  /** Replaces the hint, turns the edge fg-danger and sets aria-invalid. Write it as the fix. */
  error?: React.ReactNode;
  /** Adds a red asterisk and the native required attribute. */
  required?: boolean;
  /** Adds "(optional)" after the label. */
  optional?: boolean;
}
export interface TextFieldProps extends FieldProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'required'> {
  /** Leading icon inside the field. */
  icon?: IconInput;
  /** Trailing unit, e.g. "THB". */
  suffix?: React.ReactNode;
}
/** A password input with a show/hide button. All TextField props; `ref` reaches the input (react-hook-form `register`). */
export interface PasswordFieldProps extends Omit<TextFieldProps, 'type' | 'suffix'> {
  /** Set false to hide the show/hide button. Default true. */
  toggle?: boolean;
}
/** One entry of a FormErrorSummary: the field's `id` (or `name`) and what to fix. */
export interface FormErrorItem {
  field: string;
  message: React.ReactNode;
}
/** The list of problems at the top of a form after a failed submit; each links to its field (GOV.UK pattern). */
export interface FormErrorSummaryProps {
  /** A list, or react-hook-form's `formState.errors` as is (`{ name: { message } }`). Empty → renders nothing. */
  errors: FormErrorItem[] | Record<string, { message?: React.ReactNode } | undefined>;
  /** Default "Fix N fields to continue" in the provider's language. */
  title?: React.ReactNode;
  /** Called with the field when a link is followed, e.g. react-hook-form's `setFocus`. Default: focus the element whose id (or name) is the field. */
  onSelect?: (field: string) => void;
  /** Change it on every submit (e.g. `formState.submitCount`) to move focus to the summary again. It also takes focus when errors first appear. */
  focusKey?: unknown;
  className?: string;
  id?: string;
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
  search?: string;
  /** Called after typing pauses (`searchDelay`), and at once on Enter or clear — ready to write to the URL. */
  onSearchChange?: (value: string) => void;
  /** ms to wait after the last keystroke. Default 300. */
  searchDelay?: number;
  searchLabel?: string;
  searchPlaceholder?: string;
  /** Filter controls beside the search: Select, SegmentedControl, a Popover of options… */
  children?: React.ReactNode;
  /** Applied filters as chips, each with its own remove button. */
  filters?: ActiveFilter[];
  /** Adds "Clear all" while any filter or search is set. */
  onClearAll?: () => void;
  /** A number ("312 results", announced politely) or your own node. */
  resultCount?: number | React.ReactNode;
  /** Trailing slot: export, a New button… */
  actions?: React.ReactNode;
  /** Accessible name of the region. Default "Filters". */
  label?: string;
  className?: string;
}
/** One command in the palette. */
export interface CommandItem {
  id: string;
  /** Text shown and searched. */
  label: string;
  /** Items with the same group are listed together under its heading, in first-seen order. */
  group?: string;
  icon?: IconInput;
  description?: string;
  /** Extra words that find it ("invoice" → Billing). */
  keywords?: string[];
  /** A shortcut shown at the right, e.g. "G I". Display only. */
  shortcut?: string;
  disabled?: boolean;
  /** Runs when chosen (Enter or click); the palette then closes. */
  onSelect?: () => void;
}
/** A command palette: a modal search over commands and pages, grouped, fully keyboard-driven. */
export interface CommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandItem[];
  /** Also called with the chosen item (after its own onSelect). */
  onSelect?: (item: CommandItem) => void;
  /** Accessible name. Default "Command menu". */
  label?: string;
  placeholder?: string;
  /** Default "No matches". */
  emptyText?: string;
  /** ⌘K / Ctrl+K toggles the palette from anywhere on the page. Default true. */
  hotkey?: boolean;
  /** Replace the Thai-aware default filter. */
  filter?: (item: CommandItem, query: string) => boolean;
  className?: string;
}
export interface TextareaProps
  extends FieldProps, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'required'> {}
export type SelectOption = string | { value: string; label: string; disabled?: boolean };
export interface SelectProps extends FieldProps, Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'required'> {
  options: SelectOption[];
  /** A disabled first option shown in fg-tertiary until something is chosen. */
  placeholder?: string;
  icon?: IconInput;
}
export type ChoiceOption = string | { value: string; label: string; description?: string; disabled?: boolean };
export interface RadioGroupProps extends FieldProps {
  options: ChoiceOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  /** Default `vertical`. */
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
  id?: string;
  className?: string;
}
export interface SwitchProps {
  label?: string;
  description?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** Required when there is no visible label. */
  'aria-label'?: string;
  id?: string;
  className?: string;
}

/* ---------- Feedback & overlays ---------- */
export type FeedbackTone = 'info' | 'success' | 'warning' | 'danger';
export interface AlertProps {
  tone?: FeedbackTone;
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** Usually a secondary Button. */
  action?: React.ReactNode;
  /** Adds a close button. */
  onDismiss?: () => void;
  className?: string;
}
export interface ToastOptions {
  title: string;
  description?: string;
  tone?: FeedbackTone;
  action?: { label: string; onClick?: () => void };
  /** ms before it closes itself. Default 5000; Infinity keeps it until dismissed. */
  duration?: number;
  /** Reuse an id to replace a toast in place (same position, timer restarts) — never a second toast. */
  id?: string;
}
/** Options for the shorthands (`toast.success(title, opts)` …): everything but the title and tone. */
export type ToastShorthandOptions = Omit<ToastOptions, 'title' | 'tone'>;
export interface TooltipProps {
  content: React.ReactNode;
  /** One focusable element. */
  children: React.ReactElement;
  side?: 'top' | 'bottom';
  /** Hover delay in ms. Default 400. */
  delay?: number;
  /** Force open (demos, tests). */
  open?: boolean;
}
export interface FieldPropsPublic {
  label: string;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  optional?: boolean;
}
export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  /** Buttons, right-aligned: secondary Cancel, then the primary action. */
  footer?: React.ReactNode;
  /** `sm` 400 · `md` 560 (default) · `lg` 720. */
  size?: 'sm' | 'md' | 'lg';
  /** Default true. False hides the close button and ignores Escape and scrim clicks. */
  dismissible?: boolean;
  /** Use `alertdialog` for destructive confirmations. */
  role?: 'dialog' | 'alertdialog';
  /** Default true. Turn off only for static demos. */
  autoFocus?: boolean;
  className?: string;
}

/* ---------- Layout & navigation ---------- */
export interface CardProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Top-right, usually an IconButton. */
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  /** Default `enterprise`. `creative` is for marketing and onboarding only. */
  variant?: 'enterprise' | 'creative';
  /** Heading level of the title. Default 3 — use 2 when cards sit directly under the page h1. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Hover edge for clickable cards. */
  interactive?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  /** id for the title element; the card is then labelled by it (aria-labelledby). */
  titleId?: string;
}
export interface TabItem {
  id: string;
  label: string;
  icon?: IconInput;
  count?: number;
  disabled?: boolean;
  content?: React.ReactNode;
}
export interface TabsProps {
  tabs: TabItem[];
  /** Accessible name for the tab list. */
  label: string;
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  className?: string;
}
export interface NavItem {
  id: string;
  label: string;
  icon?: IconInput;
  count?: number;
  /** Anything beside the label, e.g. a status dot or a `Badge`. */
  badge?: React.ReactNode;
  href?: string;
  /** Makes this item a collapsible group of links. The group header is a button, never a link. */
  children?: NavItem[];
  /** Start open. A group also opens by itself when one of its items is the current one. */
  defaultOpen?: boolean;
}
export interface SideNavProps {
  sections?: Array<{ title?: string; items: NavItem[] }>;
  items?: NavItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  /** Default "Main". */
  label?: string;
  /** Router link for items with `href`; defaults to the AuraProvider's `linkComponent`, then `<a>`. */
  linkComponent?: React.ElementType;
  /** Icon-only rail (`aura-sidenav-rail-width`, 64px). Labels show as tooltips and stay the accessible names; a group
   * expands the rail when clicked. Controlled; pair with `onCollapsedChange`. */
  collapsed?: boolean;
  /** Starting state when `collapsed` isn't controlled. Default false. */
  defaultCollapsed?: boolean;
  /** Called by the toggle button, and by a group clicked in the rail (with `false`). Save it to keep the choice. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Adds a collapse / expand button at the bottom. AppShell hides it in its phone drawer. */
  collapsible?: boolean;
  className?: string;
}
export interface BreadcrumbProps {
  /** Root first; the last item is the current page. */
  items: Array<{ label: string; href?: string; onClick?: () => void }>;
  label?: string;
  className?: string;
}
export interface AvatarProps {
  /** Accessible name; also gives the initials and a stable colour. */
  name: string;
  src?: string;
  /** `sm` 24 · `md` 32 (default) · `lg` 40. */
  size?: 'sm' | 'md' | 'lg';
  status?: 'online';
  className?: string;
}

/* ---------- 4.2: menus, pickers, drawers, layout ---------- */

export interface DropdownMenuProps {
  /** One element — usually a Button or IconButton. It gets aria-haspopup, aria-expanded and the click handler. */
  trigger: React.ReactElement;
  items: MenuItem[];
  /** Accessible name for the menu. */
  label?: string;
}

export interface ComboboxOption {
  value: string;
  label: string;
  /** Second line in the list; also searched. */
  description?: string;
  /** Extra search terms (English name, phone, code…). */
  keywords?: string[];
  disabled?: boolean;
  /** Leading icon in the list. */
  icon?: IconInput;
}
/** Combobox with `multiple`: pick any number; the picks show as removable chips in the field. */
export interface ComboboxMultipleProps extends Omit<
  ComboboxProps,
  'value' | 'defaultValue' | 'onChange' | 'clearable'
> {
  multiple: true;
  /** Selected option values, in the order they were picked (controlled). */
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  /** Clear-all button while anything is selected. Default true. */
  clearable?: boolean;
  /** Most picks allowed; further options are disabled. */
  max?: number;
}
export interface ComboboxProps extends FieldProps {
  options: Array<ComboboxOption | string>;
  /** Selected option value (controlled). */
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
  id?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  /** Leading icon. Default `search`. */
  icon?: IconInput;
  /** Clear button while a value is selected (Escape clears too). Default true. */
  clearable?: boolean;
  /** Server-side search: called with the typed text; the component stops filtering and shows `options` as given. */
  onSearch?: (query: string) => void;
  loading?: boolean;
  loadingText?: string;
  emptyText?: string;
  /** Max options rendered. Default 200 — narrow with typing beyond that. */
  limit?: number;
  /** Replace the Thai-aware default filter (label, description, keywords). */
  filter?: (option: ComboboxOption, query: string) => boolean;
  className?: string;
}

/** Number input: thousands separators, +/− buttons, arrow keys, min/max/step, prefix/suffix (฿, %). */
export interface NumberFieldProps extends FieldProps {
  /** The number (controlled). `null` = empty. */
  value?: number | null;
  defaultValue?: number | null;
  /** Called with the parsed number (or null when emptied) as the person types, and with the clamped value on blur. */
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  /** Arrow keys and buttons move by this. Default 1. PageUp/PageDown move 10×. */
  step?: number;
  /** Decimal places shown and kept. Default: 0 when step is whole, else step's decimals. */
  decimals?: number;
  /** Text before the number, e.g. `฿`. */
  prefix?: React.ReactNode;
  /** Text after the number, e.g. `%` or `ชิ้น`. */
  suffix?: React.ReactNode;
  /** +/− buttons beside the number. Default true. */
  stepper?: boolean;
  id?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

/** One step of a Stepper. */
export interface StepItem {
  id: string;
  label: React.ReactNode;
  /** Short line under the label, e.g. what the step asks for. */
  description?: React.ReactNode;
}
/** Progress through a multi-step flow (wizard, checkout, booking). */
export interface StepperProps {
  steps: StepItem[];
  /** id of the step the person is on. Steps before it are completed. */
  current: string;
  /** Accessible name of the list. Default: none (give one when the page has several). */
  label?: string;
  /** Makes completed steps buttons that go back to them. Upcoming steps never are. */
  onStepClick?: (id: string) => void;
  /** Default `horizontal`. Below `sm` a horizontal stepper shows only the current step ("Step 2 of 4"). */
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export interface SegmentedOption {
  value: string;
  label: string;
  icon?: IconInput;
  /** Show only the icon; `label` becomes its accessible name and tooltip. */
  iconOnly?: boolean;
  disabled?: boolean;
}
/** A row of 2–5 mutually exclusive choices that apply at once (view, period, unit). A radio group underneath. */
export interface SegmentedControlProps {
  /** Accessible name of the group, e.g. "View". Required. */
  label: string;
  options: Array<SegmentedOption | string>;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** `md` (default, 36px) or `sm` (28px) for toolbars. */
  size?: 'sm' | 'md';
  /** Stretch across the container, segments equal width. */
  fullWidth?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
}

/** ISO date string, `YYYY-MM-DD` (Gregorian — the era is display only). */
export type ISODate = string;
export interface DateDisplayOptions {
  /** Components: the AuraProvider's locale, else `en`. `formatDate()` (no provider to read): `th` unless given. */
  locale?: 'th' | 'en' | 'sv';
  /** `buddhist` (พ.ศ.; default for th) or `gregory` (ค.ศ.; default for en and sv). */
  calendar?: 'buddhist' | 'gregory';
}
export interface CalendarProps extends DateDisplayOptions {
  start?: ISODate | null;
  end?: ISODate | null;
  focus?: ISODate | null;
  range?: boolean;
  min?: ISODate;
  max?: ISODate;
  isDateDisabled?: (iso: ISODate) => boolean;
  /** 0 = Sunday (Thai default), 1 = Monday. */
  weekStartsOn?: 0 | 1;
  onSelect?: (iso: ISODate | null) => void;
  /** Adds a Clear link to the footer. */
  onClear?: () => void;
  /** false hides the Today / Clear footer. */
  footer?: boolean;
  /** Default true: focuses the selected (or today's) day on mount. */
  autoFocus?: boolean;
}
interface DateFieldProps extends FieldProps, DateDisplayOptions {
  id?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  /** Clear button while there is a value. Default true. */
  clearable?: boolean;
  min?: ISODate;
  max?: ISODate;
  isDateDisabled?: (iso: ISODate) => boolean;
  weekStartsOn?: 0 | 1;
  className?: string;
}
export interface DatePickerProps extends DateFieldProps {
  value?: ISODate | null;
  defaultValue?: ISODate | null;
  onChange?: (value: ISODate | null) => void;
}
export interface DateRange {
  start: ISODate | null;
  end: ISODate | null;
}
export interface DateRangePickerProps extends DateFieldProps {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (value: DateRange) => void;
}

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  /** Default `right`. */
  side?: 'right' | 'left';
  /** sm 360 · md 480 (default) · lg 640 · nav = SideNav width. Full width below 640px. */
  size?: 'sm' | 'md' | 'lg' | 'nav';
  title?: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  /** Buttons, right-aligned; stacked on phones. */
  footer?: React.ReactNode;
  /** Scrim click and Escape close it. Default true. */
  dismissible?: boolean;
  /** Default true: focus moves to the element with `data-autofocus`, else the first control in the body. False only for static demos. */
  autoFocus?: boolean;
  /** Needed when there is no title. */
  'aria-label'?: string;
  className?: string;
}

export type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl';
export type Responsive<T> = T | Partial<Record<Breakpoint, T>>;
/** Spacing step (aura-space-N) or any CSS length. */
export type Space = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | string;
export interface StackProps {
  direction?: Responsive<'row' | 'column'>;
  gap?: Responsive<Space>;
  /** Cross-axis alignment; responsive like direction ({ base: 'stretch', sm: 'flex-end' }). */
  align?: Responsive<React.CSSProperties['alignItems']>;
  justify?: React.CSSProperties['justifyContent'];
  wrap?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export interface GridProps {
  columns?: Responsive<number>;
  /** Fit as many columns as there is room for, each at least this wide (px). Overrides columns. */
  minItemWidth?: number;
  gap?: Responsive<Space>;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export interface AppShellProps {
  /** Usually a SideNav. Fixed from 1024px up; in a Drawer behind a menu button below. */
  nav?: React.ReactElement;
  /** Top bar content (title, search, account menu). */
  header?: React.ReactNode;
  children?: React.ReactNode;
  navLabel?: string;
  menuLabel?: string;
  /** id of `<main>`, for a skip link. Default `main`. */
  mainId?: string;
  className?: string;
}

/* ---------- 4.3: Stat, TimePicker, FileUpload ---------- */

export interface StatChange {
  /** Shown as written, e.g. "+12%" or "−3". */
  value: React.ReactNode;
  direction?: 'up' | 'down' | 'flat';
  /** Default: up = positive, down = negative. Set it when a rise is bad (cancellations, wait time). */
  tone?: 'positive' | 'negative' | 'neutral';
  /** e.g. "vs last month". */
  label?: React.ReactNode;
}
export interface StatProps {
  label: React.ReactNode;
  value?: React.ReactNode;
  /** Small unit after the value ("งาน", "คน", "%"). */
  unit?: React.ReactNode;
  change?: StatChange;
  caption?: React.ReactNode;
  icon?: IconInput;
  /** Skeleton in place of the value. */
  loading?: boolean;
  /** Makes the whole card a link or a button (drill-down). */
  href?: string;
  onClick?: () => void;
  className?: string;
}

export interface TimePickerProps extends FieldProps {
  /** "HH:mm", 24-hour. */
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
  /** Minutes between listed slots. Default 30. */
  step?: number;
  /** Earliest and latest allowed times, "HH:mm". Typed times outside them are refused with a message. */
  min?: string;
  max?: string;
  isTimeDisabled?: (time: string) => boolean;
  /** Slot to scroll to when empty (e.g. "09:00"). Default: min. */
  suggest?: string;
  /** Clear button while there is a value. Default true. */
  clearable?: boolean;
  id?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
}

export interface UploadItem {
  id: string;
  /** The browser File (absent for files already on the server). */
  file?: File;
  name: string;
  size?: number;
  type?: string;
  /** ready = picked, not sent yet. Set uploading/done yourself while sending. */
  status: 'ready' | 'uploading' | 'done' | 'error';
  /** 0–100 while uploading. */
  progress?: number;
  error?: string;
  /** For files already stored (edit forms). */
  url?: string;
}
export interface FileUploadProps extends FieldProps {
  value?: UploadItem[];
  defaultValue?: UploadItem[];
  onChange?: (items: UploadItem[]) => void;
  onRemove?: (item: UploadItem) => void;
  /** Same syntax as `<input accept>`: "image/*,.pdf". Checked on drop too. */
  accept?: string;
  multiple?: boolean;
  /** Bytes per file. */
  maxSize?: number;
  /** With multiple. */
  maxFiles?: number;
  id?: string;
  name?: string;
  disabled?: boolean;
  className?: string;
}

/* ---------- 4.4: general-purpose components, theming ---------- */
export type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  /** soft (default) · solid · outline */
  variant?: 'soft' | 'solid' | 'outline';
  icon?: IconInput;
}
export interface TagProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
  children: React.ReactNode;
  icon?: IconInput;
  /** Adds a remove button (applied filters, chosen people). */
  onRemove?: () => void;
  removeLabel?: string;
  /** Makes it a toggle chip (filter chips): renders a button with aria-pressed. */
  selected?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}
export interface ProgressProps {
  /** Omit for indeterminate. */
  value?: number;
  max?: number;
  label?: React.ReactNode;
  'aria-label'?: string;
  showValue?: boolean;
  /** Replaces the % text, e.g. "3 of 5 files". Also read out as aria-valuetext. */
  valueLabel?: React.ReactNode;
  hint?: React.ReactNode;
  tone?: Tone;
  size?: 'sm' | 'md';
  id?: string;
  className?: string;
}
export interface SkeletonProps {
  variant?: 'text' | 'rect' | 'circle';
  /** text only: number of lines (the last is shorter). */
  lines?: number;
  width?: number | string;
  height?: number | string;
  /** circle diameter. */
  size?: number;
  className?: string;
}
export interface EmptyStateProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: IconInput;
  /** One or two buttons. */
  action?: React.ReactNode;
  size?: 'sm' | 'md';
  bordered?: boolean;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}
export interface PaginationProps {
  pageCount: number;
  /** 1-based, controlled; pair with onChange. Or defaultPage. */
  page?: number;
  defaultPage?: number;
  onChange?: (page: number) => void;
  /** Pages shown each side of the current one. Default 1. */
  siblingCount?: number;
  /** Render real links (SEO, open in new tab); onChange still runs for client routing. */
  getHref?: (page: number) => string;
  label?: string;
  className?: string;
}
export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  content: React.ReactNode;
  icon?: IconInput;
  disabled?: boolean;
}
export interface AccordionProps {
  items: AccordionItem[];
  /** single (default): one open at a time. multiple: any number. */
  type?: 'single' | 'multiple';
  value?: string | null | string[];
  defaultValue?: string | null | string[];
  onChange?: (value: any) => void;
  /** single only: false keeps one section always open. Default true. */
  collapsible?: boolean;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  id?: string;
  className?: string;
}
export interface PopoverProps {
  /** One element; it gets aria-haspopup, aria-expanded and the click toggle. */
  trigger: React.ReactElement;
  children: React.ReactNode | ((api: { close: () => void }) => React.ReactNode);
  title?: React.ReactNode;
  /** Accessible name when there is no title. */
  label?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: 'bottom-start' | 'bottom-end' | 'bottom-center' | 'top-start' | 'top-end' | 'top-center';
  width?: number | string;
  /** Default true: focus moves to [data-autofocus] or the first control inside. */
  autoFocus?: boolean;
  id?: string;
  className?: string;
}

export interface ThemeOptions {
  /** The project's brand colour, #rgb or #rrggbb. Replaces AURA violet (links, focus ring, selection, info, progress, creative shadow in dark, mesh). */
  brand: string;
  /** Optional signal colour; replaces AURA lime in the accent dot and mesh only (success/ready stay green). */
  signal?: string;
  /** ink (default): primary buttons stay zinc ink. brand: primary buttons use the brand colour. */
  primary?: 'ink' | 'brand';
  name?: string;
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
