/* Public prop and value types of @aura/react. Components import their props from here; the published
 * declarations are generated from the sources by tsc. */
import type * as React from 'react';

/** AURA pill button. Enterprise (`primary`, `secondary`) for product UI; `creative` for marketing moments only. */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant. Default `primary`. */
  variant?: 'primary' | 'secondary' | 'creative';
  /** Label text — short, Title Case English or Thai. */
  children: React.ReactNode;
  /** Leading icon name (see `IconName`). Hidden while loading. */
  icon?: IconName;
  /** Trailing icon name, e.g. `arrow-right` for forward actions. */
  iconRight?: IconName;
  /** Shows a spinner in place of the leading icon, sets aria-busy and swallows clicks. Keeps the label and width. */
  loading?: boolean;
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
}
export interface DataTableSort {
  key: string;
  dir: 'asc' | 'desc';
}
export interface DataTableEmpty {
  /** Default `inbox`; use `search` for "no matches". */
  icon?: IconName;
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
  /** Shows skeleton rows and disables sorting, select-all and paging. */
  loading?: boolean;
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
  /** Container width in px below which rows render as stacked cards (phones). Try 640. Measured with ResizeObserver, so it follows the container, not the window. */
  stackBelow?: number;
  className?: string;
}

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
  | 'monitor';

/** Lucide stroke icon drawn inline in currentColor. */
export interface IconProps {
  name: IconName;
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
  /** Default `en` strings when there is no provider (dates still default to Thai / พ.ศ.). */
  locale?: 'th' | 'en';
  /** Default calendar for DatePicker / DateRangePicker / Calendar / formatDate callers that read it. */
  calendar?: 'buddhist' | 'gregory';
  /** Override individual strings. */
  strings?: Partial<Record<string, string | ((...args: any[]) => string)>>;
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
  icon: IconName;
  /** Accessible name and tooltip (required). */
  label: string;
  /** Icon size. Default `sm` (16). */
  size?: 'sm' | 'md';
}

export interface MenuItem {
  label?: string;
  icon?: IconName;
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
  icon?: IconName;
  /** Trailing unit, e.g. "THB". */
  suffix?: React.ReactNode;
}
export interface TextareaProps
  extends FieldProps, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'required'> {}
export type SelectOption = string | { value: string; label: string; disabled?: boolean };
export interface SelectProps extends FieldProps, Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'required'> {
  options: SelectOption[];
  /** A disabled first option shown in fg-tertiary until something is chosen. */
  placeholder?: string;
  icon?: IconName;
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
  /** Reuse an id to replace a toast in place. */
  id?: string;
}
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
  icon?: IconName;
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
  icon?: IconName;
  count?: number;
  href?: string;
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
  icon?: IconName;
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
  icon?: IconName;
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

/** ISO date string, `YYYY-MM-DD` (Gregorian — the era is display only). */
export type ISODate = string;
export interface DateDisplayOptions {
  /** `th` (default) or `en`. */
  locale?: 'th' | 'en';
  /** `buddhist` (default, พ.ศ.) or `gregory` (ค.ศ.). */
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
  icon?: IconName;
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
  icon?: IconName;
}
export interface TagProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
  children: React.ReactNode;
  icon?: IconName;
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
  icon?: IconName;
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
  icon?: IconName;
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
