import * as React$1 from 'react';

/** AURA pill button. Enterprise (`primary`, `secondary`) for product UI; `creative` for marketing moments only. */
export interface ButtonProps extends React$1.ButtonHTMLAttributes<HTMLButtonElement> {
	/** Visual variant. Default `primary`. */
	variant?: "primary" | "secondary" | "creative";
	/** Label text — short, Title Case English or Thai. */
	children: React$1.ReactNode;
	/** Leading icon name (see `IconName`). Hidden while loading. */
	icon?: IconName;
	/** Trailing icon name, e.g. `arrow-right` for forward actions. */
	iconRight?: IconName;
	/** Shows a spinner in place of the leading icon, sets aria-busy and swallows clicks. Keeps the label and width. */
	loading?: boolean;
}
/** A link that looks like a Button: give `Button` an `href` and it renders an `<a>` (navigation, not actions). */
export interface ButtonLinkProps extends Omit<React$1.AnchorHTMLAttributes<HTMLAnchorElement>, "children"> {
	/** Where the link goes. With `href`, Button renders an `<a>` and its ref is the `<a>`. */
	href: string;
	/** Visual variant. Default `primary`. */
	variant?: "primary" | "secondary" | "creative";
	/** Label text — say where it goes ("View Orders"), not "Click here". */
	children: React$1.ReactNode;
	icon?: IconName;
	/** Trailing icon, e.g. `arrow-right`, or `external-link` with `target="_blank"`. */
	iconRight?: IconName;
	/** Looks unavailable and can't be followed: no href, `aria-disabled`, out of the Tab order. */
	disabled?: boolean;
	/** A router's link to render instead of `<a>`, e.g. `Link` from `next/link` (client-side navigation). It gets `href`, `className`, the children and the ref. */
	linkComponent?: React$1.ElementType;
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
	render?: (row: Record<string, any>) => React$1.ReactNode;
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
	hideBelow?: number | "sm" | "md" | "lg" | "xl";
	/** Row actions (a DropdownMenu or IconButton). In stacked cards it sits top-right instead of in the field list. Give it an empty label. */
	actions?: boolean;
}
export interface DataTableSort {
	key: string;
	dir: "asc" | "desc";
}
export interface DataTableEmpty {
	/** Default `inbox`; use `search` for "no matches". */
	icon?: IconName;
	/** Default "Nothing here yet". */
	title?: string;
	description?: string;
	/** One action, usually a secondary Button. */
	action?: React$1.ReactNode;
}
/** Enterprise data table: 48px rows, hairline dividers, mono header band. */
export interface DataTableProps {
	/** Defaults to ID · NAME · STATUS · OWNER (96 / 160 / 112 / auto px). */
	columns?: DataTableColumn[];
	rows: Array<Record<string, React$1.ReactNode>>;
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
export type IconName = "check" | "x" | "plus" | "minus" | "search" | "chevron-down" | "chevron-up" | "chevron-left" | "chevron-right" | "arrow-right" | "arrow-up-right" | "arrow-up-down" | "loader-circle" | "circle-alert" | "circle-check" | "info" | "triangle-alert" | "settings" | "user" | "users" | "filter" | "ellipsis" | "external-link" | "copy" | "trash-2" | "pencil" | "download" | "upload" | "calendar" | "bell" | "menu" | "eye" | "log-out" | "circle" | "circle-dot-dashed" | "ban" | "arrow-up" | "arrow-down" | "inbox" | "pin" | "pin-off" | "eye-off" | "columns-3" | "arrow-left" | "rotate-ccw" | "house" | "layout-dashboard" | "folder" | "chart-column" | "file-text" | "mail" | "lock" | "clock" | "trending-up" | "trending-down" | "image" | "paperclip" | "cloud-upload" | "file" | "sun" | "moon" | "monitor";
/** Lucide stroke icon drawn inline in currentColor. */
export interface IconProps {
	name: IconName;
	/** `sm` 16 (default) · `md` 20 · `lg` 24, or a px number. */
	size?: "sm" | "md" | "lg" | number;
	/** Accessible name. Omit for decorative icons next to a text label (then aria-hidden). */
	label?: string;
	/** Default 2 (Lucide's). */
	strokeWidth?: number;
	className?: string;
}
/** Creative surface with the AURA mesh and/or grain texture. Light in every theme; content in aura-on-texture. */
export interface SurfaceProps extends React$1.HTMLAttributes<HTMLElement> {
	/** Default `mesh`. */
	texture?: "mesh" | "grain" | "mesh-grain";
	/** Element to render. Default `div`. */
	as?: keyof React$1.JSX.IntrinsicElements;
	children?: React$1.ReactNode;
}
/** Sets the language of built-in labels (pagination, close buttons, empty states…) and the default date display for everything inside. */
export interface AuraProviderProps {
	/** Default `en` strings when there is no provider (dates still default to Thai / พ.ศ.). */
	locale?: "th" | "en";
	/** Default calendar for DatePicker / DateRangePicker / Calendar / formatDate callers that read it. */
	calendar?: "buddhist" | "gregory";
	/** Override individual strings. */
	strings?: Partial<Record<string, string | ((...args: any[]) => string)>>;
	children?: React$1.ReactNode;
}
export type StatusTone = "neutral" | "progress" | "ready" | "blocked";
/** Status pill: tone fill + icon + the status word. Tone comes from the word unless given. */
export interface StatusPillProps {
	/** The status word shown, e.g. "In Progress". */
	children: React$1.ReactNode;
	/** Force a tone. Default: matched from the word (Ready/Done → ready, In Progress/In Review → progress, Blocked/Failed → blocked, anything else → neutral). */
	tone?: StatusTone;
	className?: string;
}
/** 16px checkbox with 4px corners; ink when checked, a dash when indeterminate. */
export interface CheckboxProps extends Omit<React$1.InputHTMLAttributes<HTMLInputElement>, "onChange" | "type" | "checked" | "defaultChecked"> {
	/** Controlled state; pair with onChange. Or use defaultChecked. */
	checked?: boolean;
	defaultChecked?: boolean;
	indeterminate?: boolean;
	/** Accessible name for a bare box (tables). Not needed when children give a visible label. */
	label?: string;
	/** Visible label beside the box (form use). */
	children?: React$1.ReactNode;
	/** Second line under the visible label (needs an id to be linked). */
	description?: React$1.ReactNode;
	onChange?: (checked: boolean) => void;
	disabled?: boolean;
	tabIndex?: number;
	className?: string;
}
/** 32px round button holding one icon. */
export interface IconButtonProps extends React$1.ButtonHTMLAttributes<HTMLButtonElement> {
	icon: IconName;
	/** Accessible name and tooltip (required). */
	label: string;
	/** Icon size. Default `sm` (16). */
	size?: "sm" | "md";
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
export interface FieldProps {
	/** Visible label; also the accessible name. */
	label: string;
	/** Helper line under the field (caption, fg-secondary). */
	hint?: React$1.ReactNode;
	/** Replaces the hint, turns the edge fg-danger and sets aria-invalid. Write it as the fix. */
	error?: React$1.ReactNode;
	/** Adds a red asterisk and the native required attribute. */
	required?: boolean;
	/** Adds "(optional)" after the label. */
	optional?: boolean;
}
export interface TextFieldProps extends FieldProps, Omit<React$1.InputHTMLAttributes<HTMLInputElement>, "required"> {
	/** Leading icon inside the field. */
	icon?: IconName;
	/** Trailing unit, e.g. "THB". */
	suffix?: React$1.ReactNode;
}
export interface TextareaProps extends FieldProps, Omit<React$1.TextareaHTMLAttributes<HTMLTextAreaElement>, "required"> {
}
export type SelectOption = string | {
	value: string;
	label: string;
	disabled?: boolean;
};
export interface SelectProps extends FieldProps, Omit<React$1.SelectHTMLAttributes<HTMLSelectElement>, "required"> {
	options: SelectOption[];
	/** A disabled first option shown in fg-tertiary until something is chosen. */
	placeholder?: string;
	icon?: IconName;
}
export type ChoiceOption = string | {
	value: string;
	label: string;
	description?: string;
	disabled?: boolean;
};
export interface RadioGroupProps extends FieldProps {
	options: ChoiceOption[];
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	name?: string;
	/** Default `vertical`. */
	orientation?: "vertical" | "horizontal";
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
	"aria-label"?: string;
	id?: string;
	className?: string;
}
export type FeedbackTone = "info" | "success" | "warning" | "danger";
export interface AlertProps {
	tone?: FeedbackTone;
	title?: React$1.ReactNode;
	children?: React$1.ReactNode;
	/** Usually a secondary Button. */
	action?: React$1.ReactNode;
	/** Adds a close button. */
	onDismiss?: () => void;
	className?: string;
}
export interface ToastOptions {
	title: string;
	description?: string;
	tone?: FeedbackTone;
	action?: {
		label: string;
		onClick?: () => void;
	};
	/** ms before it closes itself. Default 5000; Infinity keeps it until dismissed. */
	duration?: number;
	/** Reuse an id to replace a toast in place. */
	id?: string;
}
export interface TooltipProps {
	content: React$1.ReactNode;
	/** One focusable element. */
	children: React$1.ReactElement;
	side?: "top" | "bottom";
	/** Hover delay in ms. Default 400. */
	delay?: number;
	/** Force open (demos, tests). */
	open?: boolean;
}
export interface FieldPropsPublic {
	label: string;
	hint?: React$1.ReactNode;
	error?: React$1.ReactNode;
	required?: boolean;
	optional?: boolean;
}
export interface DialogProps {
	open: boolean;
	onClose: () => void;
	title: React$1.ReactNode;
	description?: React$1.ReactNode;
	children?: React$1.ReactNode;
	/** Buttons, right-aligned: secondary Cancel, then the primary action. */
	footer?: React$1.ReactNode;
	/** `sm` 400 · `md` 560 (default) · `lg` 720. */
	size?: "sm" | "md" | "lg";
	/** Default true. False hides the close button and ignores Escape and scrim clicks. */
	dismissible?: boolean;
	/** Use `alertdialog` for destructive confirmations. */
	role?: "dialog" | "alertdialog";
	/** Default true. Turn off only for static demos. */
	autoFocus?: boolean;
	className?: string;
}
export interface CardProps {
	title?: React$1.ReactNode;
	description?: React$1.ReactNode;
	/** Top-right, usually an IconButton. */
	actions?: React$1.ReactNode;
	footer?: React$1.ReactNode;
	children?: React$1.ReactNode;
	/** Default `enterprise`. `creative` is for marketing and onboarding only. */
	variant?: "enterprise" | "creative";
	/** Heading level of the title. Default 3 — use 2 when cards sit directly under the page h1. */
	headingLevel?: 2 | 3 | 4 | 5 | 6;
	/** Hover edge for clickable cards. */
	interactive?: boolean;
	as?: keyof React$1.JSX.IntrinsicElements;
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
	content?: React$1.ReactNode;
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
	sections?: Array<{
		title?: string;
		items: NavItem[];
	}>;
	items?: NavItem[];
	value?: string;
	defaultValue?: string;
	onChange?: (id: string) => void;
	header?: React$1.ReactNode;
	footer?: React$1.ReactNode;
	/** Default "Main". */
	label?: string;
	className?: string;
}
export interface BreadcrumbProps {
	/** Root first; the last item is the current page. */
	items: Array<{
		label: string;
		href?: string;
		onClick?: () => void;
	}>;
	label?: string;
	className?: string;
}
export interface AvatarProps {
	/** Accessible name; also gives the initials and a stable colour. */
	name: string;
	src?: string;
	/** `sm` 24 · `md` 32 (default) · `lg` 40. */
	size?: "sm" | "md" | "lg";
	status?: "online";
	className?: string;
}
export interface DropdownMenuProps {
	/** One element — usually a Button or IconButton. It gets aria-haspopup, aria-expanded and the click handler. */
	trigger: React$1.ReactElement;
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
/** Combobox with `multiple`: pick any number; the picks show as removable chips in the field. */
export interface ComboboxMultipleProps extends Omit<ComboboxProps, "value" | "defaultValue" | "onChange" | "clearable"> {
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
	prefix?: React$1.ReactNode;
	/** Text after the number, e.g. `%` or `ชิ้น`. */
	suffix?: React$1.ReactNode;
	/** +/− buttons beside the number. Default true. */
	stepper?: boolean;
	id?: string;
	name?: string;
	placeholder?: string;
	disabled?: boolean;
	readOnly?: boolean;
	className?: string;
	onBlur?: React$1.FocusEventHandler<HTMLInputElement>;
}
/** One step of a Stepper. */
export interface StepItem {
	id: string;
	label: React$1.ReactNode;
	/** Short line under the label, e.g. what the step asks for. */
	description?: React$1.ReactNode;
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
	orientation?: "horizontal" | "vertical";
	className?: string;
}
export interface SegmentedOption {
	value: string;
	label: string;
	icon?: IconName;
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
	size?: "sm" | "md";
	/** Stretch across the container, segments equal width. */
	fullWidth?: boolean;
	disabled?: boolean;
	id?: string;
	className?: string;
}
/** ISO date string, `YYYY-MM-DD` (Gregorian — the era is display only). */
export type ISODate = string;
export interface DateDisplayOptions {
	/** `th` (default) or `en`. */
	locale?: "th" | "en";
	/** `buddhist` (default, พ.ศ.) or `gregory` (ค.ศ.). */
	calendar?: "buddhist" | "gregory";
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
export interface DateFieldProps extends FieldProps, DateDisplayOptions {
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
	side?: "right" | "left";
	/** sm 360 · md 480 (default) · lg 640 · nav = SideNav width. Full width below 640px. */
	size?: "sm" | "md" | "lg" | "nav";
	title?: string;
	description?: React$1.ReactNode;
	children?: React$1.ReactNode;
	/** Buttons, right-aligned; stacked on phones. */
	footer?: React$1.ReactNode;
	/** Scrim click and Escape close it. Default true. */
	dismissible?: boolean;
	/** Default true: focus moves to the element with `data-autofocus`, else the first control in the body. False only for static demos. */
	autoFocus?: boolean;
	/** Needed when there is no title. */
	"aria-label"?: string;
	className?: string;
}
export type Breakpoint = "base" | "sm" | "md" | "lg" | "xl";
export type Responsive<T> = T | Partial<Record<Breakpoint, T>>;
/** Spacing step (aura-space-N) or any CSS length. */
export type Space = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | string;
export interface StackProps {
	direction?: Responsive<"row" | "column">;
	gap?: Responsive<Space>;
	/** Cross-axis alignment; responsive like direction ({ base: 'stretch', sm: 'flex-end' }). */
	align?: Responsive<React$1.CSSProperties["alignItems"]>;
	justify?: React$1.CSSProperties["justifyContent"];
	wrap?: boolean;
	as?: keyof React$1.JSX.IntrinsicElements;
	className?: string;
	style?: React$1.CSSProperties;
	children?: React$1.ReactNode;
}
export interface GridProps {
	columns?: Responsive<number>;
	/** Fit as many columns as there is room for, each at least this wide (px). Overrides columns. */
	minItemWidth?: number;
	gap?: Responsive<Space>;
	as?: keyof React$1.JSX.IntrinsicElements;
	className?: string;
	style?: React$1.CSSProperties;
	children?: React$1.ReactNode;
}
export interface AppShellProps {
	/** Usually a SideNav. Fixed from 1024px up; in a Drawer behind a menu button below. */
	nav?: React$1.ReactElement;
	/** Top bar content (title, search, account menu). */
	header?: React$1.ReactNode;
	children?: React$1.ReactNode;
	navLabel?: string;
	menuLabel?: string;
	/** id of `<main>`, for a skip link. Default `main`. */
	mainId?: string;
	className?: string;
}
export interface StatChange {
	/** Shown as written, e.g. "+12%" or "−3". */
	value: React$1.ReactNode;
	direction?: "up" | "down" | "flat";
	/** Default: up = positive, down = negative. Set it when a rise is bad (cancellations, wait time). */
	tone?: "positive" | "negative" | "neutral";
	/** e.g. "vs last month". */
	label?: React$1.ReactNode;
}
export interface StatProps {
	label: React$1.ReactNode;
	value?: React$1.ReactNode;
	/** Small unit after the value ("งาน", "คน", "%"). */
	unit?: React$1.ReactNode;
	change?: StatChange;
	caption?: React$1.ReactNode;
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
	status: "ready" | "uploading" | "done" | "error";
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
export type Tone = "neutral" | "accent" | "success" | "warning" | "danger";
export interface BadgeProps extends React$1.HTMLAttributes<HTMLSpanElement> {
	tone?: Tone;
	/** soft (default) · solid · outline */
	variant?: "soft" | "solid" | "outline";
	icon?: IconName;
}
export interface TagProps extends Omit<React$1.HTMLAttributes<HTMLElement>, "onClick"> {
	children: React$1.ReactNode;
	icon?: IconName;
	/** Adds a remove button (applied filters, chosen people). */
	onRemove?: () => void;
	removeLabel?: string;
	/** Makes it a toggle chip (filter chips): renders a button with aria-pressed. */
	selected?: boolean;
	onClick?: (e: React$1.MouseEvent<HTMLButtonElement>) => void;
	disabled?: boolean;
}
export interface ProgressProps {
	/** Omit for indeterminate. */
	value?: number;
	max?: number;
	label?: React$1.ReactNode;
	"aria-label"?: string;
	showValue?: boolean;
	/** Replaces the % text, e.g. "3 of 5 files". Also read out as aria-valuetext. */
	valueLabel?: React$1.ReactNode;
	hint?: React$1.ReactNode;
	tone?: Tone;
	size?: "sm" | "md";
	id?: string;
	className?: string;
}
export interface SkeletonProps {
	variant?: "text" | "rect" | "circle";
	/** text only: number of lines (the last is shorter). */
	lines?: number;
	width?: number | string;
	height?: number | string;
	/** circle diameter. */
	size?: number;
	className?: string;
}
export interface EmptyStateProps {
	title: React$1.ReactNode;
	description?: React$1.ReactNode;
	icon?: IconName;
	/** One or two buttons. */
	action?: React$1.ReactNode;
	size?: "sm" | "md";
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
	title: React$1.ReactNode;
	description?: React$1.ReactNode;
	content: React$1.ReactNode;
	icon?: IconName;
	disabled?: boolean;
}
export interface AccordionProps {
	items: AccordionItem[];
	/** single (default): one open at a time. multiple: any number. */
	type?: "single" | "multiple";
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
	trigger: React$1.ReactElement;
	children: React$1.ReactNode | ((api: {
		close: () => void;
	}) => React$1.ReactNode);
	title?: React$1.ReactNode;
	/** Accessible name when there is no title. */
	label?: string;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	placement?: "bottom-start" | "bottom-end" | "bottom-center" | "top-start" | "top-end" | "top-center";
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
	primary?: "ink" | "brand";
	name?: string;
}
export interface ThemeCheck {
	theme: "light" | "dark";
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
/** One SVG child: element name and its attributes. */
export type IconShape = [
	string,
	Record<string, string>
];
export declare const ICONS: Record<IconName, IconShape[]>;
export declare const Icon: React$1.ForwardRefExoticComponent<IconProps & React$1.RefAttributes<SVGSVGElement>>;
/** Every icon name the bundle carries. */
export declare const iconNames: IconName[];
/** Button with an `href` is a link; without, a button. Two call signatures so each gets the right props and ref. */
export interface ButtonComponent {
	(props: ButtonLinkProps & React$1.RefAttributes<HTMLAnchorElement>): React$1.ReactElement | null;
	(props: ButtonProps & React$1.RefAttributes<HTMLButtonElement>): React$1.ReactElement | null;
	displayName?: string;
}
/** AURA pill button. Enterprise (`primary`, `secondary`) for product UI; `creative` for marketing moments only.
 * With `href` it renders a link that looks the same (`<a>`, or your router's link via `linkComponent`). */
export declare const Button: ButtonComponent;
export declare const IconButton: React$1.ForwardRefExoticComponent<IconButtonProps & React$1.RefAttributes<HTMLButtonElement>>;
/** Popover list anchored to an element, rendered in a portal. */
export declare const Menu: React$1.ForwardRefExoticComponent<MenuProps & React$1.RefAttributes<HTMLDivElement>>;
/** A trigger that opens a Menu. ArrowDown / ArrowUp on the trigger also opens it. */
export declare const DropdownMenu: React$1.ForwardRefExoticComponent<DropdownMenuProps & React$1.RefAttributes<HTMLSpanElement>>;
export declare const Checkbox: React$1.ForwardRefExoticComponent<CheckboxProps & React$1.RefAttributes<HTMLInputElement>>;
/** The tone the pill would pick for a status word. */
declare function toneFor(status: unknown): StatusTone;
export declare const StatusPill: React$1.ForwardRefExoticComponent<StatusPillProps & React$1.RefAttributes<HTMLSpanElement>>;
/** Field: label, required/optional marks, the control, then the hint or error line. Wrap a custom control in it. */
export interface FieldComponentProps extends Omit<FieldPropsPublic, "label"> {
	/** Visible label. Omit only when the control is labelled another way. */
	label?: React$1.ReactNode;
	/** The control's id: the label points at it, and the hint/error ids derive from it. */
	id?: string;
	children?: React$1.ReactNode;
	/** Render the label as another element (e.g. `span` for a group of controls) with this id. */
	labelAs?: string;
	labelId?: string;
	disabled?: boolean;
	className?: string;
}
export declare const Field: React$1.ForwardRefExoticComponent<FieldComponentProps & React$1.RefAttributes<HTMLDivElement>>;
export declare const TextField: React$1.ForwardRefExoticComponent<TextFieldProps & React$1.RefAttributes<HTMLInputElement>>;
export declare const Textarea: React$1.ForwardRefExoticComponent<TextareaProps & React$1.RefAttributes<HTMLTextAreaElement>>;
export declare const Select: React$1.ForwardRefExoticComponent<SelectProps & React$1.RefAttributes<HTMLSelectElement>>;
export declare const RadioGroup: React$1.ForwardRefExoticComponent<RadioGroupProps & React$1.RefAttributes<HTMLFieldSetElement>>;
export declare const Switch: React$1.ForwardRefExoticComponent<SwitchProps & React$1.RefAttributes<HTMLButtonElement>>;
/** One value, or with `multiple` any number (chips). Two call signatures so value/onChange are typed for each. */
export interface ComboboxComponent {
	(props: ComboboxMultipleProps & React$1.RefAttributes<HTMLInputElement>): React$1.ReactElement | null;
	(props: ComboboxProps & React$1.RefAttributes<HTMLInputElement>): React$1.ReactElement | null;
	displayName?: string;
}
/** The Thai-aware default filter: label, description and keywords contain the query. */
declare function defaultFilter(option: ComboboxOption, query: string): boolean;
/** Text field that filters a list as you type (ARIA 1.2 combobox). One value, or any number with `multiple`. */
export declare const Combobox: ComboboxComponent;
/** Options for formatDate: locale/calendar plus a preset or any Intl.DateTimeFormat options. */
export type FormatDateOptions = DateDisplayOptions & {
	format?: "short" | "long" | "numeric" | Intl.DateTimeFormatOptions;
};
/** Format an ISO date for display, e.g. "18 ก.ย. 2569" (th, Buddhist) or "18 Sept 2026" (en, Gregorian). */
export declare function formatDate(iso: ISODate | null | undefined, opts?: FormatDateOptions): string;
/** Parse typed text: dd/mm/yyyy (Buddhist years ≥ 2400 are converted), d-m-yyyy, d.m.yyyy, yyyy-mm-dd or '18 ก.ย. 2569' / '18 Sep 2026'. */
export declare function parseDate(text: string | null | undefined): ISODate | null;
export declare const Calendar: React$1.ForwardRefExoticComponent<CalendarProps & React$1.RefAttributes<HTMLDivElement>>;
/** Typed date field + calendar popover. Shows Buddhist-era dates (18 ก.ย. 2569); accepts dd/mm/yyyy in พ.ศ. or ค.ศ. and yyyy-mm-dd. */
export declare const DatePicker: React$1.ForwardRefExoticComponent<DatePickerProps & React$1.RefAttributes<HTMLInputElement>>;
export declare const DateRangePicker: React$1.ForwardRefExoticComponent<DateRangePickerProps & React$1.RefAttributes<HTMLInputElement>>;
export declare const Alert: React$1.ForwardRefExoticComponent<AlertProps & React$1.RefAttributes<HTMLDivElement>>;
/** Show a toast; returns its id. Needs `<Toaster />` mounted once. */
export declare function toast(opts: ToastOptions | string): string;
export declare namespace toast {
	var dismiss: (id: string) => void;
}
export interface ToasterProps {
	/** Default `bottom`. */
	position?: "bottom" | "top";
}
export declare function Toaster(props: ToasterProps): React$1.ReactElement | null;
export declare const Tooltip: React$1.ForwardRefExoticComponent<TooltipProps & React$1.RefAttributes<HTMLSpanElement>>;
export declare const Dialog: React$1.ForwardRefExoticComponent<DialogProps & React$1.RefAttributes<HTMLDivElement>>;
/** Side panel over the page: record detail, filters, mobile navigation. Modal (focus trap, scroll lock, focus restore). */
export declare const Drawer: React$1.ForwardRefExoticComponent<DrawerProps & React$1.RefAttributes<HTMLDivElement>>;
/** Enterprise data table: 48px rows, hairline dividers, mono header band. */
export declare const DataTable: React$1.ForwardRefExoticComponent<DataTableProps & React$1.RefAttributes<HTMLDivElement>>;
export declare const Card: React$1.ForwardRefExoticComponent<CardProps & React$1.RefAttributes<HTMLElement>>;
export declare const Tabs: React$1.ForwardRefExoticComponent<TabsProps & React$1.RefAttributes<HTMLDivElement>>;
export declare const SideNav: React$1.ForwardRefExoticComponent<SideNavProps & React$1.RefAttributes<HTMLElement>>;
export declare const Breadcrumb: React$1.ForwardRefExoticComponent<BreadcrumbProps & React$1.RefAttributes<HTMLElement>>;
export declare const Avatar: React$1.ForwardRefExoticComponent<AvatarProps & React$1.RefAttributes<HTMLSpanElement>>;
/** Stack — one direction, even gaps. direction and gap may be responsive: { base: 'column', md: 'row' }. */
export declare const Stack: React$1.ForwardRefExoticComponent<StackProps & React$1.RefAttributes<HTMLElement>>;
/** Grid — equal columns. columns may be responsive ({ base: 1, md: 2, lg: 3 }), or use minItemWidth to fit as many as fit. */
export declare const Grid: React$1.ForwardRefExoticComponent<GridProps & React$1.RefAttributes<HTMLElement>>;
/** Centred page column. */
export interface ContainerProps {
	/** `narrow` caps it at aura-container-narrow (720px). Default `default` (1280px). */
	size?: "default" | "narrow";
	as?: keyof React$1.JSX.IntrinsicElements;
	className?: string;
	style?: React$1.CSSProperties;
	children?: React$1.ReactNode;
}
/** Container — centres content up to aura-container-max (1280px) with responsive side padding. */
export declare const Container: React$1.ForwardRefExoticComponent<ContainerProps & React$1.RefAttributes<HTMLElement>>;
/** AppShell — side navigation + top bar + content. The nav is fixed from lg (1024px) up and a Drawer below it. */
export declare const AppShell: React$1.ForwardRefExoticComponent<AppShellProps & React$1.RefAttributes<HTMLDivElement>>;
/** Min-width breakpoints in px, mirroring the aura-bp-* tokens. */
export declare const breakpoints: {
	sm: 640;
	md: 768;
	lg: 1024;
	xl: 1280;
};
/** The widest breakpoint the window currently meets: 'base' | 'sm' | 'md' | 'lg' | 'xl'. 'lg' during server render. */
export declare function useBreakpoint(): Breakpoint;
/** Pick a value for the current breakpoint from { base, sm, md, lg, xl } (falls back to the next smaller one). */
export declare function useResponsive<T>(value: Responsive<T>): T | undefined;
export declare const Surface: React$1.ForwardRefExoticComponent<SurfaceProps & React$1.RefAttributes<HTMLElement>>;
/** Every built-in label. Function entries build the text from their arguments. */
export interface AuraStrings {
	close: string;
	dismiss: string;
	dismissToast: string;
	notifications: string;
	mainNav: string;
	breadcrumb: string;
	navigation: string;
	openNav: string;
	searching: string;
	noMatches: string;
	clear: (what?: string) => string;
	keepTyping: (total: number) => string;
	sortAsc: string;
	sortDesc: string;
	pin: string;
	unpin: string;
	moveLeft: string;
	moveRight: string;
	hideColumn: string;
	resetColumns: string;
	selectRows: string;
	selectAllRows: string;
	deselectAllRows: string;
	selectAll: string;
	selectRow: (k: React$1.ReactNode) => string;
	selectedCount: (c: number) => string;
	pinned: string;
	columnOptions: (label?: string) => string;
	column: (label?: string) => string;
	columns: string;
	showHideColumns: string;
	empty: string;
	loading: string;
	loadingRows: string;
	range: (a: number | string, b: number | string, total: number) => string;
	page: (p: number, total: number) => string;
	prevPage: string;
	nextPage: string;
	rowCount: (c: number) => string;
	actions: string;
	optional: string;
	timePlaceholder: string;
	timeInvalid: string;
	timeOutOfRange: (a: number | string, b: number | string) => string;
	dropFiles: string;
	browse: string;
	browseOne: string;
	remove: (n: number | string) => string;
	fileTooBig: (max?: number | string) => string;
	fileWrongType: string;
	tooManyFiles: (n: number | string) => string;
	colorScheme: string;
	increase: string;
	decrease: string;
	stepDone: string;
	stepOf: (i: number, total: number) => string;
	schemeLight: string;
	schemeDark: string;
	schemeSystem: string;
	uploading: string;
	images: string;
	pagination: string;
	pageN: (p: number) => string;
	accepts: (list?: string, max?: number | string) => string;
}
export declare const STRINGS: {
	en: AuraStrings;
	th: AuraStrings;
};
/** What useAuraLocale returns. `locale` and `calendar` are null outside an AuraProvider. */
export interface AuraLocaleValue {
	locale: "th" | "en" | null;
	calendar: "buddhist" | "gregory" | null;
	strings: AuraStrings;
}
/** Sets the language of built-in labels (and the default date locale) for everything inside. */
export declare function AuraProvider(props: AuraProviderProps): React$1.ReactElement;
/** { locale, calendar, strings } from the nearest AuraProvider (English strings when there is none). */
export declare function useAuraLocale(): AuraLocaleValue;
export declare const Stat: React$1.ForwardRefExoticComponent<StatProps & React$1.RefAttributes<HTMLElement>>;
/** Parse typed time: 9 · 09 · 930 · 0930 · 9:30 · 9.30 · 09.30 น. · 9:30 pm → "HH:mm" (24-hour) or null. */
export declare function parseTime(text: string | null | undefined): string | null;
export declare const TimePicker: React$1.ForwardRefExoticComponent<TimePickerProps & React$1.RefAttributes<HTMLInputElement>>;
/** 1536 → "1.5 KB". */
export declare function formatBytes(n: number | null | undefined): string;
export declare const FileUpload: React$1.ForwardRefExoticComponent<FileUploadProps & React$1.RefAttributes<HTMLInputElement>>;
/** WCAG contrast ratio of two #hex colours. */
export declare function contrast(a: string, b: string): number;
/** A 50–900 scale around one colour: same hue, AURA's lightness steps, chroma kept in gamut. */
declare function scale(hex: string): Theme["brand"];
/**
 * createTheme({ brand, signal?, primary?: 'ink' | 'brand', name? })
 * → { name, brand: {50…900}, signal: {50…900}|null, light: {token: #hex}, dark: {…}, checks: [{pair, ratio, target, pass}], ok, css(selector?) }
 */
export declare function createTheme(opts: ThemeOptions): Theme;
export interface ThemeStyleProps extends ThemeOptions {
	/** Scope the theme to this selector instead of the whole page (multi-tenant). */
	selector?: string;
}
export declare function ThemeStyle(props: ThemeStyleProps): React$1.ReactElement;
/** `system` follows the operating system and changes with it. */
export type ColorScheme = "light" | "dark" | "system";
export interface ColorSchemeOptions {
	/** localStorage key for the choice. Default `aura-color-scheme`. */
	storageKey?: string;
	/** Used when nothing is saved. Default `system`. */
	defaultScheme?: ColorScheme;
}
/** The script ColorSchemeScript renders, as a string — for frameworks that want it in a raw <head> template. */
export declare function colorSchemeScript(options?: ColorSchemeOptions): string;
/** Put in <head>: applies the saved colour scheme before the page paints. Server-rendering safe. */
export declare function ColorSchemeScript(props: ColorSchemeOptions): React$1.ReactElement;
/** Current colour scheme and a setter. `resolved` is what is on screen (system resolved to light or dark). */
export interface ColorSchemeState {
	scheme: ColorScheme;
	resolved: "light" | "dark";
	setScheme: (scheme: ColorScheme) => void;
}
/** Read and change the colour scheme. Every component using it stays in sync, and `system` follows OS changes. */
export declare function useColorScheme(options?: ColorSchemeOptions): ColorSchemeState;
export interface ColorSchemeToggleProps extends ColorSchemeOptions {
	/** Accessible name of the button. Default: the built-in "Colour scheme" label. */
	label?: string;
}
/** Icon button with a menu: Light, Dark, System. Shows a sun or a moon for what is on screen. */
export declare function ColorSchemeToggle(props: ColorSchemeToggleProps): React$1.ReactElement;
export declare const Badge: React$1.ForwardRefExoticComponent<BadgeProps & React$1.RefAttributes<HTMLSpanElement>>;
export declare const Tag: React$1.ForwardRefExoticComponent<TagProps & React$1.RefAttributes<HTMLElement>>;
export declare const Progress: React$1.ForwardRefExoticComponent<ProgressProps & React$1.RefAttributes<HTMLDivElement>>;
export declare const Skeleton: React$1.ForwardRefExoticComponent<SkeletonProps & React$1.RefAttributes<HTMLSpanElement>>;
export declare const EmptyState: React$1.ForwardRefExoticComponent<EmptyStateProps & React$1.RefAttributes<HTMLDivElement>>;
export declare const Pagination: React$1.ForwardRefExoticComponent<PaginationProps & React$1.RefAttributes<HTMLElement>>;
export declare const Accordion: React$1.ForwardRefExoticComponent<AccordionProps & React$1.RefAttributes<HTMLDivElement>>;
export declare const Popover: React$1.ForwardRefExoticComponent<PopoverProps & React$1.RefAttributes<HTMLDivElement>>;
/** Number input with thousands separators, +/− buttons and arrow keys (ARIA spinbutton). */
export declare const NumberField: React$1.ForwardRefExoticComponent<NumberFieldProps & React$1.RefAttributes<HTMLInputElement>>;
/** Progress through a multi-step flow. Completed steps can link back; the current one has aria-current="step". */
export declare const Stepper: React$1.ForwardRefExoticComponent<StepperProps & React$1.RefAttributes<HTMLElement>>;
/** A row of mutually exclusive choices that apply at once. A radio group: one Tab stop, arrow keys move and select. */
export declare const SegmentedControl: React$1.ForwardRefExoticComponent<SegmentedControlProps & React$1.RefAttributes<HTMLDivElement>>;

export {
	defaultFilter as comboboxFilter,
	scale as brandScale,
	toneFor as statusTone,
};

export {};
