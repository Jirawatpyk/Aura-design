/* One representative element per component — shared by the SSR test and the hydration test. */
import type * as ReactNS from 'react';
/** The built package (ESM or CJS), loosely: fixtures pass deliberately odd props to test the edges. */
export type AuraModule = Record<string, any>;
/** 5.9's dev notices announcing 6.0 (icon names as strings, a Thai or Swedish provider without its pack). The
 * fixtures still use the 5.x forms on purpose; prep60-test.ts checks the notices themselves, so the browser tests
 * that fail on any console warning let exactly these through. */
export const SIX_NOTICES = /^\[AURA\] (Icon names as strings \(|AuraProvider locale="(th|sv)": from 6\.0 only English)/;
export function fixtures(A: AuraModule, React: typeof ReactNS): Record<string, ReactNS.ReactElement> {
  const h = React.createElement;
  const rows = [
    { id: 'ORD-1042', name: 'คุณสมชาย ใจดี', status: 'Ready', owner: 'Tao' },
    { id: 'ORD-1043', name: 'Anna Lee', status: 'Blocked', owner: 'Mai' },
  ];
  const noop = () => {};
  return {
    Icon: h(A.Icon, { name: 'calendar' }),
    ColorSchemeScript: h(A.ColorSchemeScript, null),
    ColorSchemeToggle: h(A.ColorSchemeToggle, null),
    Button: h(A.Button, { icon: 'plus' }, 'New order'),
    ComboboxMultiple: h(A.Combobox, {
      multiple: true,
      label: 'Tags',
      options: ['VIP', 'Urgent', 'Weekend'],
      defaultValue: ['VIP', 'Weekend'],
      name: 'tags',
    }),
    NumberField: h(A.NumberField, { label: 'ราคา', prefix: '฿', defaultValue: 12500, min: 0 }),
    Stepper: h(A.Stepper, {
      label: 'Booking',
      current: 'b',
      steps: [
        { id: 'a', label: 'Service' },
        { id: 'b', label: 'Time' },
        { id: 'c', label: 'Confirm' },
      ],
      onStepClick: noop,
    }),
    SegmentedControl: h(A.SegmentedControl, { label: 'View', options: ['Table', 'Cards'], defaultValue: 'Cards' }),
    ButtonLink: h(A.Button, { href: '/orders', variant: 'secondary', iconRight: 'arrow-right' }, 'View orders'),
    IconButton: h(A.IconButton, { icon: 'ellipsis', label: 'More' }),
    Menu: h(A.Menu, { anchor: null, label: 'Actions', items: [{ label: 'Edit' }], onClose: noop }),
    DropdownMenu: h(A.DropdownMenu, {
      label: 'Row actions',
      trigger: h(A.IconButton, { icon: 'ellipsis', label: 'Actions' }),
      items: [{ label: 'Edit', icon: 'pencil' }],
    }),
    Checkbox: h(A.Checkbox, { defaultChecked: true, description: 'We email a receipt' }, 'Send receipt'),
    StatusPill: h(A.StatusPill, null, 'Ready'),
    TextField: h(A.TextField, { label: 'ชื่อลูกค้า', hint: 'ชื่อ–นามสกุล' }),
    Textarea: h(A.Textarea, { label: 'Notes' }),
    Select: h(A.Select, { label: 'Category', options: ['Product', 'Service'] }),
    FilterDateRange: h(A.FilterDateRange, {
      label: 'Submitted',
      defaultValue: { start: '2026-09-01', end: '2026-09-30' },
      presets: [{ label: 'Last 7 days', range: { start: '2026-09-24', end: '2026-09-30' } }],
    }),
    FilterSelect: h(A.FilterSelect, {
      label: 'Status',
      allLabel: 'All',
      options: [
        { value: 'all', label: 'All statuses' },
        { value: 'active', label: 'Active' },
      ],
      defaultValue: 'all',
    }),
    RadioGroup: h(A.RadioGroup, { label: 'Frequency', options: ['Once', 'Weekly'], defaultValue: 'Once' }),
    Switch: h(A.Switch, { label: 'Notify' }),
    Combobox: h(A.Combobox, {
      label: 'ผู้ดูแล',
      options: [{ value: 'a', label: 'กมล', keywords: ['kamon'] }, 'Mai'],
      defaultValue: 'a',
      clearable: true,
    }),
    DatePicker: h(A.DatePicker, { label: 'วันที่', defaultValue: '2026-09-18', clearable: true }),
    DateRangePicker: h(A.DateRangePicker, {
      label: 'ช่วงวันที่',
      defaultValue: { start: '2026-09-01', end: '2026-09-30' },
    }),
    Calendar: h(A.Calendar, { start: '2026-09-18', focus: '2026-09-18' }),
    Alert: h(A.Alert, { tone: 'warning', title: 'Heads up' }, 'Two orders overlap.'),
    Toaster: h(A.Toaster, null),
    Tooltip: h(A.Tooltip, { content: 'Copy' }, h(A.IconButton, { icon: 'copy', label: 'Copy' })),
    Dialog: h(A.Dialog, { open: true, onClose: noop, title: 'Cancel order?' }, 'Body'),
    Drawer: h(A.Drawer, { open: true, onClose: noop, title: 'ORD-1042' }, 'Detail'),
    DataTable: h(A.DataTable, { rows, selectable: true, stackBelow: 640, pageSize: 10 }),
    Card: h(A.Card, { title: 'Revenue' }, '฿ 42,000'),
    Tabs: h(A.Tabs, {
      label: 'Filter',
      tabs: [
        { id: 'a', label: 'All', content: 'x' },
        { id: 'b', label: 'Today' },
      ],
    }),
    SideNav: h(A.SideNav, { items: [{ id: 'd', label: 'Dashboard', icon: 'layout-dashboard' }], value: 'd' }),
    Breadcrumb: h(A.Breadcrumb, { items: [{ label: 'Orders', href: '#' }, { label: 'ORD-1042' }] }),
    Avatar: h(A.Avatar, { name: 'Tao P' }),
    Stack: h(A.Stack, { direction: { base: 'column', md: 'row' }, gap: { base: 2, md: 4 } }, 'a', 'b'),
    Grid: h(A.Grid, { columns: { base: 1, md: 2, lg: 4 } }, 'a', 'b'),
    Container: h(A.Container, { size: 'narrow' }, 'c'),
    AppShell: h(
      A.AppShell,
      { nav: h(A.SideNav, { items: [{ id: 'd', label: 'Dashboard' }], value: 'd' }), header: 'Orders' },
      'content',
    ),
    Surface: h(A.Surface, { texture: 'mesh' }, 'hero'),
    AuraProvider: h(
      A.AuraProvider,
      { locale: 'th' },
      h(A.DataTable, { rows, pageSize: 1 }),
      h(A.DatePicker, { label: 'x', defaultValue: '2026-09-18' }),
    ),
    Stat: h(A.Stat, {
      label: 'Orders',
      value: '42',
      unit: 'งาน',
      change: { value: '+12%', direction: 'up', label: 'vs last month' },
      icon: 'calendar',
    }),
    TimePicker: h(A.TimePicker, { label: 'เวลา', defaultValue: '09:30', min: '08:00', max: '18:00' }),
    FileUpload: h(A.FileUpload, {
      label: 'รูปหน้างาน',
      accept: 'image/*',
      multiple: true,
      maxSize: 5 * 1024 * 1024,
      defaultValue: [
        { id: 'a', name: 'kitchen.jpg', size: 204800, type: 'image/jpeg', status: 'done' },
        { id: 'b', name: 'big.png', size: 9e6, type: 'image/png', status: 'error', error: 'Too big' },
      ],
    }),
    Badge: h(A.Badge, { tone: 'success', icon: 'check' }, 'Paid'),
    Tag: h(A.Tag, { onRemove: noop }, 'สาขาสยาม'),
    Progress: h(A.Progress, { label: 'Uploading', value: 40, showValue: true }),
    Skeleton: h(A.Skeleton, { lines: 3 }),
    EmptyState: h(A.EmptyState, { icon: 'search', title: 'No results', description: 'Try another filter' }),
    Pagination: h(A.Pagination, { pageCount: 10, defaultPage: 5 }),
    Accordion: h(A.Accordion, {
      items: [
        { id: 'a', title: 'Billing', content: 'x' },
        { id: 'b', title: 'Team', content: 'y' },
      ],
      defaultValue: 'a',
    }),
    Popover: h(A.Popover, { trigger: h(A.Button, null, 'Filters'), title: 'Filters', defaultOpen: true }, 'content'),
    ThemeStyle: h(A.ThemeStyle, { brand: '#0ea5e9', selector: '.tenant' }),
    Field: h(A.Field, { label: 'Custom', id: 'f1' }, h('input', { id: 'f1' })),
    /* 4.10 */
    DangerButton: h(A.Button, { variant: 'danger', icon: 'trash-2' }, 'Delete'),
    CustomIcon: h(A.IconButton, {
      tone: 'danger',
      label: 'Delete',
      icon: h('svg', { viewBox: '0 0 24 24' }, h('path', { d: 'M4 4h16' })),
    }),
    SwedishProvider: h(
      A.AuraProvider,
      { locale: 'sv', linkComponent: 'a' },
      h(A.DatePicker, { label: 'Datum', defaultValue: '2026-09-18' }),
      h(A.Breadcrumb, { items: [{ label: 'Hem', href: '/' }, { label: 'Order' }] }),
    ),
    StackTable: h(A.DataTable, {
      label: 'Stack',
      stackBelow: 640,
      rows: [{ id: 'A-1', status: 'Paid' }],
      columns: [
        { key: 'id', label: 'ID', width: 96 },
        { key: 'status', label: 'STATUS', pill: true },
      ],
    }),
    RailSideNav: h(A.SideNav, {
      collapsed: true,
      collapsible: true,
      value: 'inv',
      items: [
        { id: 'd', label: 'Dashboard', icon: 'layout-dashboard', count: 4 },
        { id: 'r', label: 'Reports' },
        {
          id: 'bill',
          label: 'Billing',
          icon: 'file-text',
          children: [{ id: 'inv', label: 'Invoices', href: '/invoices' }],
        },
      ],
    }),
    NestedSideNav: h(A.SideNav, {
      value: 'inv',
      items: [
        { id: 'd', label: 'Dashboard', href: '/', badge: 3 },
        {
          id: 'bill',
          label: 'Billing',
          icon: 'file-text',
          children: [
            { id: 'inv', label: 'Invoices', href: '/invoices' },
            { id: 'pay', label: 'Payments', href: '/payments' },
          ],
        },
      ],
    }),
    FormatDateHook: h(
      A.AuraProvider,
      { locale: 'sv' },
      h(function Due() {
        const fmt = A.useFormatDate();
        return h('span', null, fmt('2026-09-18', { format: 'long' }));
      }),
    ),
    PasswordField: h(A.PasswordField, { label: 'รหัสผ่าน', defaultValue: 'secret', hint: 'อย่างน้อย 8 ตัว' }),
    FormErrorSummary: h(A.FormErrorSummary, {
      errors: { email: { message: 'Enter an email address' }, password: { message: 'Use at least 8 characters' } },
    }),
    FilterBar: h(A.FilterBar, {
      search: 'acme',
      onSearchChange: noop,
      filters: [{ id: 's', label: 'Status: Paid', onRemove: noop }],
      onClearAll: noop,
      resultCount: 312,
      actions: h(A.Button, { variant: 'secondary' }, 'Export'),
    }),
    StatHeading: h(A.Stat, { label: 'Membership', headingLevel: 2, value: 'Active', caption: 'Gold' }),
    EmptyStateQuiet: h(A.EmptyState, { title: 'No benefits', headingLevel: false }),
    ButtonGated: h(A.Button, { 'aria-disabled': true }, 'Erase'),
    /* 5.23 (Chamber-OS 120–122) */
    DataTableCardWide: h(A.DataTable, {
      label: 'Tier upgrades',
      rows: [{ id: 'M-301', member: 'Nordic Timber Oy', reason: 'Turnover above threshold' }],
      rowKey: 'id',
      stackBelow: 640,
      columns: [
        { key: 'member', label: 'MEMBER' },
        { key: 'reason', label: 'REASON', width: 320, card: 'wide' },
      ],
    }),
    ActionBarTouchClear: h(
      A.ActionBar,
      { selected: 2, onClearSelection: noop, touchHeight: true },
      h(A.Button, { size: 'sm', touchHeight: true }, 'Mark paid'),
    ),
    /* 5.22 (Chamber-OS 118, 119) */
    DataTableCardFooter: h(A.DataTable, {
      label: 'Renewals',
      rows: [{ id: 'M-201', member: 'Kiruna Mining Services (Thailand)' }],
      rowKey: 'id',
      stackBelow: 640,
      columns: [
        { key: 'member', label: 'MEMBER', card: 'title' },
        {
          key: 'a',
          label: '',
          actions: true,
          width: 200,
          card: 'footer',
          render: () => h(A.Button, { size: 'sm' }, 'Send reminder'),
        },
      ],
    }),
    /* 5.21 (Chamber-OS 117) */
    TableRowHeight: h(
      A.Table,
      { caption: 'Recent exports', rowHeight: 'density', align: 'middle' },
      h(A.TBody, null, h(A.Tr, null, h(A.Td, null, 'members-2026-09.csv'))),
    ),
    /* 5.20 (Chamber-OS 115, 116) */
    TableInCompact: h(
      A.AuraProvider,
      { density: 'compact' },
      h(A.Table, { caption: 'Plans' }, h(A.TBody, null, h(A.Tr, null, h(A.Td, null, 'Corporate 2026')))),
    ),
    ActionBarStart: h(
      A.ActionBar,
      { position: 'container', start: h(A.Button, { variant: 'ghost' }, 'Cancel') },
      h(A.Button, { variant: 'primary' }, 'Next'),
    ),
    /* 5.19 (Chamber-OS 113, 114) */
    SwitchReadOnly: h(A.Switch, {
      label: 'M2M benefits access',
      checked: true,
      readOnly: true,
      icon: 'lock',
      description: 'Locked: historical plan',
    }),
    SelectReadOnly: h(A.Select, {
      label: 'Member type',
      value: 'company',
      options: ['person', 'company'],
      readOnly: true,
      onChange: noop,
    }),
    /* 5.18 (Chamber-OS 112) */
    StepperError: h(A.Stepper, {
      label: 'New plan',
      current: 'review',
      steps: [
        { id: 'basics', label: 'Basics', description: 'Name and period' },
        { id: 'fees', label: 'Fees', status: 'error', description: 'Two fields need a value' },
        { id: 'extras', label: h('em', null, 'Extras') },
        { id: 'review', label: 'Review', status: 'error' },
      ],
      onStepClick: noop,
    }),
    /* 5.17 (Chamber-OS 110, 111) */
    StatLabelLink: h(A.Stat, {
      label: 'Membership',
      value: 'Gold',
      href: '/m',
      headingLevel: 2,
      linkArea: 'label',
      status: 'Active',
      'data-testid': 's',
    }),
    ProgressValueText: h(A.Progress, {
      label: 'E',
      value: 2,
      max: 6,
      secondaryValue: 1,
      valueText: '2 used, 1 reserved',
    }),
    /* 5.16 (Chamber-OS 95, 96, 98, 101, 105) */
    SideNavActions: h(A.SideNav, {
      value: 'a',
      chevron: 'right',
      collapsible: true,
      collapseToggle: 'row',
      items: [
        { id: 'a', label: 'Members' },
        { id: 'g', label: 'Admin', children: [{ id: 'r', label: 'Roles' }] },
        { id: 'out', label: 'Sign out', selectable: false, onSelect: noop },
      ],
    }),
    DialogTrigger: h(
      A.Dialog,
      { trigger: h(A.Button, null, 'Add contact'), title: 'Add contact', 'data-testid': 'd' },
      'x',
    ),
    ComboboxCustom: h(A.Combobox, {
      label: 'Province',
      options: ['Bangkok'],
      allowCustomValue: true,
      defaultValue: 'Västra Götaland',
    }),
    ComboboxGroups: h(A.Combobox, {
      label: 'Country',
      groups: [{ label: 'Most used', options: ['Thailand', 'Sweden'] }],
    }),
    DataTableRange: h(A.DataTable, { rows, selectable: true, rangeSelect: true, onSelectionChange: noop }),
    /* 5.15 (Chamber-OS 85–100) */
    CardHeader: h(A.Card, { header: h(A.StatusPill, { tone: 'warning' }, 'Pending'), flushBelow: 'lg' }, 'Body'),
    ProgressReserved: h(A.Progress, { label: 'E-Blasts', value: 2, secondaryValue: 1, max: 6 }),
    TabsFill: h(A.Tabs, {
      label: 'Sections',
      fullWidth: 'below-lg',
      tabs: [
        { id: 'a', label: 'Benefits', content: 'A' },
        { id: 'b', label: 'Usage', content: 'B' },
      ],
    }),
    BreadcrumbCollapse: h(A.Breadcrumb, {
      collapseBelow: 'sm',
      items: [{ label: 'Admin', href: '/a' }, { label: 'Members', href: '/m' }, { label: 'Acme AB' }],
    }),
    CheckboxHit: h(A.Checkbox, { label: 'Approve', hideLabel: true, hitArea: { x: 12, y: 8 } }),
    ButtonTouch: h(A.Button, { size: 'sm', touchHeight: true }, 'Pay'),
    IconButtonTouch: h(A.IconButton, { icon: 'x', label: 'Close', touchHeight: true }),
    EmptyStateDanger: h(A.EmptyState, {
      tone: 'danger',
      bordered: true,
      title: 'Members couldn’t load',
      'data-testid': 'err',
    }),
    TableSlots: h(
      A.Table,
      { caption: 'Queue', stackBelow: 'sm', align: 'middle', bordered: false },
      h(A.THead, null, h(A.Tr, null, h(A.Th, null, 'Member'), h(A.Th, null, 'Type'), h(A.Th, null, 'Action'))),
      h(
        A.TBody,
        null,
        h(
          A.Tr,
          null,
          h(A.Td, { card: 'title' }, 'Acme AB'),
          h(A.Td, null, 'Plan upgrade'),
          h(A.Td, { card: 'action' }, h(A.Button, { size: 'sm' }, 'Review')),
        ),
      ),
    ),
    TableCards: h(
      A.Table,
      { caption: 'Queue', stackBelow: 'sm', stackStyle: 'cards' },
      h(A.THead, null, h(A.Tr, null, h(A.Th, null, 'Member'), h(A.Th, null, 'Type'))),
      h(A.TBody, null, h(A.Tr, null, h(A.Td, { card: 'title' }, 'Acme AB'), h(A.Td, null, 'Plan upgrade'))),
    ),
    FilterBarFill: h(
      A.FilterBar,
      { search: '', onSearchChange: noop, controlsLayout: 'fill', stackBelow: 'lg' },
      h(A.FilterSelect, { label: 'Status', options: [{ value: 'all', label: 'All' }], value: 'all', onChange: noop }),
    ),
    FilterBarGrow: h(
      A.FilterBar,
      { search: '', onSearchChange: noop, searchGrow: true },
      h(A.FilterSelect, {
        label: 'Plan',
        allLabel: 'All',
        options: ['All plans', 'Gold'],
        value: 'Gold',
        onChange: noop,
      }),
      h(A.Tag, { selected: false, onClick: noop }, 'Unpaid'),
    ),
    Command: h(A.Command, {
      open: true,
      onOpenChange: noop,
      items: [
        { id: 'a', label: 'Invoices', group: 'Pages', icon: 'file-text' },
        { id: 'b', label: 'New member', group: 'Actions', shortcut: 'N' },
      ],
    }),
    ServerTable: h(A.DataTable, {
      manual: true,
      rows,
      totalRows: 312,
      pageSize: 2,
      page: 3,
      sort: { key: 'id', dir: 'desc' },
      loading: true,
      getRowHref: (r: { id: string }) => '/orders/' + r.id,
      getPageHref: (p: number) => '?page=' + p,
      columns: [
        { key: 'id', label: 'ID', width: 96, sortable: true },
        { key: 'owner', label: 'AMOUNT', align: 'end' },
      ],
    }),
    /* 4.20 */
    Separator: h('div', null, 'A', h(A.Separator, { spacing: 2 }), 'B', h(A.Separator, { decorative: false })),
    Table: h(
      A.Table,
      { caption: 'Line items' },
      h(A.THead, null, h(A.Tr, null, h(A.Th, null, 'Item'), h(A.Th, { numeric: true }, 'Amount'))),
      h(
        A.TBody,
        null,
        h(
          A.Tr,
          null,
          h(A.Td, null, 'ค่าบำรุงสมาชิก', h('br'), 'Membership fee'),
          h(A.Td, { numeric: true }, '100,000.00'),
        ),
      ),
      h(A.TFoot, null, h(A.Tr, null, h(A.Th, { scope: 'row' }, 'Total'), h(A.Td, { numeric: true }, '107,000.00'))),
    ),
    Tr: h(
      A.Table,
      { caption: 'Tr', captionHidden: true },
      h(A.TBody, null, h(A.Tr, null, h(A.Td, { mono: true }, 'INV-1'))),
    ),
    Th: h(A.Table, { caption: 'Th' }, h(A.THead, null, h(A.Tr, null, h(A.Th, { align: 'center' }, 'Qty')))),
    Td: h(
      A.Table,
      { caption: 'Td', density: 'compact' },
      h(A.TBody, null, h(A.Tr, null, h(A.Td, { align: 'end' }, '1'))),
    ),
    TableHide: h(A.DataTable, {
      label: 'Hide',
      rows,
      stackBelow: 700,
      columns: [
        { key: 'id', label: 'ID', width: 96 },
        { key: 'name', label: 'NAME', width: 200, hideBelow: 900 },
        { key: 'owner', label: 'OWNER', hideBelow: 'md' },
      ],
    }),
    /* 4.19 */
    ActionBar: h(A.ActionBar, { status: 'Total 107,000.00 THB' }, h(A.Button, null, 'Save')),
    ActionBarBulk: h(
      A.ActionBar,
      { selected: 2, onClearSelection: noop },
      h(A.Button, { variant: 'secondary' }, 'Export'),
    ),
    BottomNav: h(A.BottomNav, {
      value: 'home',
      items: [
        { id: 'home', label: 'Home', icon: 'house', href: '/' },
        { id: 'inbox', label: 'Inbox', icon: 'bell', href: '/inbox', count: 3 },
        { id: 'me', label: 'Me', icon: 'user', badge: true, badgeLabel: 'new' },
      ],
    }),
    AppShellBottomNav: h(
      A.AppShell,
      {
        bottomNav: h(A.BottomNav, {
          value: 'a',
          items: [
            { id: 'a', label: 'A', icon: 'house', href: '/a' },
            { id: 'b', label: 'B', icon: 'user', href: '/b' },
          ],
        }),
      },
      'Body',
    ),
    TabsLinks: h(A.Tabs, {
      label: 'Renewals',
      value: 'p',
      tabs: [
        { id: 'p', label: 'Pipeline', href: '/renewals' },
        { id: 'r', label: 'Pending review', href: '/renewals/review' },
      ],
    }),
    TableTotals: h(A.DataTable, {
      label: 'Invoices',
      rows,
      stackBelow: 640,
      stickyFooter: true,
      footer: { id: 'Total', owner: '2' },
      columns: [
        { key: 'id', label: 'ID', width: 96 },
        { key: 'owner', label: 'AMOUNT', align: 'end' },
      ],
    }),
    DropdownMenuKinds: h(A.DropdownMenu, {
      label: 'More',
      trigger: h(A.IconButton, { icon: 'ellipsis', label: 'More' }),
      items: [
        { label: 'Open', href: '/x' },
        { label: 'Grid', type: 'radio', group: 'View', checked: true },
        { label: 'List', type: 'radio', group: 'View' },
        { label: 'Delete', tone: 'danger' },
      ],
    }),
  };
}
