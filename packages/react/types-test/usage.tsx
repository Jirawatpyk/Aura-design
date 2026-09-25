/* Compile-only check that the public types describe real usage. `npm run typecheck`. */
import * as React from 'react';
import {
  NumberField,
  Stepper,
  SegmentedControl,
  AppShell,
  SideNav,
  Stack,
  Grid,
  Container,
  Combobox,
  DatePicker,
  DateRangePicker,
  Drawer,
  DropdownMenu,
  IconButton,
  Button,
  DataTable,
  Stat,
  Badge,
  Tag,
  Progress,
  Skeleton,
  EmptyState,
  Pagination,
  Accordion,
  Popover,
  Checkbox,
  createTheme,
  ThemeStyle,
  TimePicker,
  FileUpload,
  formatBytes,
  parseTime,
  type UploadItem,
  formatDate,
  parseDate,
  useBreakpoint,
  useResponsive,
  breakpoints,
  toast,
  type DateRange,
} from '../src/index';

export function Page() {
  const [owner, setOwner] = React.useState<string | null>(null);
  const [date, setDate] = React.useState<string | null>('2026-09-18');
  const [range, setRange] = React.useState<DateRange>({ start: null, end: null });
  const [open, setOpen] = React.useState(false);
  const bp = useBreakpoint();
  const [time, setTime] = React.useState<string | null>(parseTime('9.30'));
  const [files, setFiles] = React.useState<UploadItem[]>([]);
  const cols = useResponsive<number>({ base: 1, md: 2, lg: 4 });
  const label: string =
    formatDate(date, { format: 'long' }) + (parseDate('18/09/2569') ?? '') + breakpoints.lg + bp + cols;
  return (
    <AppShell nav={<SideNav items={[{ id: 'b', label: 'Orders', icon: 'calendar' }]} value="b" />} header={label}>
      <Container>
        <Stack direction={{ base: 'column', md: 'row' }} gap={{ base: 2, md: 4 }} align="flex-end">
          <Combobox
            label="ผู้ดูแล"
            options={[{ value: 'a', label: 'กมล', keywords: ['kamon'] }, 'Mai']}
            value={owner}
            onChange={setOwner}
            clearable
          />
          <DatePicker label="วันที่" value={date} onChange={setDate} min="2026-01-01" />
          <DateRangePicker label="ช่วงวันที่" value={range} onChange={setRange} calendar="gregory" locale="en" />
          <DropdownMenu
            label="Actions"
            trigger={<IconButton icon="ellipsis" label="Actions" />}
            items={[{ label: 'Export', icon: 'download' }]}
          />
          <Button
            onClick={() => {
              setOpen(true);
              toast({ title: 'Saved', tone: 'success' });
            }}
          >
            Open
          </Button>
        </Stack>
        <Grid columns={{ base: 1, lg: 3 }} gap={6}>
          <div />
        </Grid>
        <DataTable
          rows={[{ id: '1' }]}
          stackBelow={640}
          columns={[
            { key: 'id', label: 'ID', hideBelow: 'lg' },
            { key: 'x', label: '', actions: true, hideBelow: 900 },
          ]}
        />
        <Stat
          label="วันนี้"
          value={3}
          unit="งาน"
          change={{ value: '+1', direction: 'up', tone: 'positive', label: 'vs เมื่อวาน' }}
          icon="calendar"
          href="#"
        />
        <TimePicker
          label="เวลา"
          value={time}
          onChange={setTime}
          step={15}
          min="08:00"
          max="18:00"
          isTimeDisabled={(t) => t === '12:00'}
        />
        <FileUpload
          label="รูป"
          accept="image/*"
          multiple
          maxFiles={3}
          maxSize={5 * 1024 * 1024}
          value={files}
          onChange={setFiles}
          hint={formatBytes(1024)}
        />
      </Container>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="ORD-1042"
        size="lg"
        footer={<Button variant="secondary">Close</Button>}
      >
        x
      </Drawer>
    </AppShell>
  );
}

/* Refs reach the real element (react-hook-form register, focus management). */
export function Refs() {
  const input = React.useRef<HTMLInputElement>(null);
  const btn = React.useRef<HTMLButtonElement>(null);
  const table = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    input.current?.focus();
    btn.current?.blur();
    table.current?.scrollIntoView();
  }, []);
  return (
    <>
      <TimePicker ref={input} label="t" />
      <Button ref={btn}>Go</Button>
      <DataTable ref={table} rows={[]} />
    </>
  );
}

/* Button with href is a link: anchor props and an <a> ref; without href, button props and a <button> ref. */
function FakeRouterLink(p: { href: string; className?: string; children?: React.ReactNode }) {
  return <a {...p} />;
}
export function ButtonLinks() {
  const a = React.useRef<HTMLAnchorElement>(null);
  const b = React.useRef<HTMLButtonElement>(null);
  type P = React.ComponentProps<typeof Button>;
  const p: P = { children: 'x', type: 'submit', loading: true }; // ComponentProps still gives the button props
  return (
    <>
      <Button href="/orders" ref={a} target="_blank" rel="noreferrer" iconRight="external-link">
        Docs
      </Button>
      <Button href="/orders" linkComponent={FakeRouterLink} variant="secondary">
        Orders
      </Button>
      <Button href="/x" disabled>
        Unavailable
      </Button>
      <Button ref={b} type="submit" loading>
        Save
      </Button>
      <Button {...p} />
      {/* @ts-expect-error a button has no href target */}
      <Button target="_blank">Nope</Button>
      {/* @ts-expect-error links don't take loading */}
      <Button href="/x" loading>
        Nope
      </Button>
      {/* @ts-expect-error an anchor ref on a button */}
      <Button ref={a}>Nope</Button>
    </>
  );
}

/* Combobox multiple: string[] in and out; single stays string | null. NumberField: number | null. */
export function NewIn49() {
  const [tags, setTags] = React.useState<string[]>([]);
  const [one, setOne] = React.useState<string | null>(null);
  const [n, setN] = React.useState<number | null>(null);
  const input = React.useRef<HTMLInputElement>(null);
  return (
    <>
      <Combobox multiple label="Tags" options={['a', 'b']} value={tags} onChange={setTags} max={2} ref={input} />
      <Combobox label="One" options={['a']} value={one} onChange={setOne} />
      {/* @ts-expect-error multiple wants string[] */}
      <Combobox multiple label="Bad" options={['a']} value="a" />
      {/* @ts-expect-error single onChange gets string | null, not string[] */}
      <Combobox label="Bad" options={['a']} onChange={(v: string[]) => v} />
      <NumberField
        label="Qty"
        value={n}
        onChange={setN}
        min={0}
        max={10}
        step={1}
        prefix="฿"
        suffix="ชิ้น"
        ref={input}
      />
      <Stepper steps={[{ id: 'a', label: 'A' }]} current="a" onStepClick={(id: string) => id} orientation="vertical" />
      <SegmentedControl
        label="View"
        options={['Table', { value: 'c', label: 'Cards', icon: 'columns-3', iconOnly: true }]}
        onChange={(v: string) => v}
        size="sm"
        fullWidth
      />
    </>
  );
}

export function General() {
  const [page, setPage] = React.useState(1);
  const theme = createTheme({ brand: '#0ea5e9', primary: 'brand' });
  const ok: boolean = theme.ok && theme.checks.every((c) => c.ratio > 0);
  return (
    <>
      <ThemeStyle brand="#0ea5e9" selector=".tenant" />
      <style>{theme.css('.x')}</style>
      <Badge tone="success" icon="check">
        {String(ok)}
      </Badge>
      <Tag onRemove={() => {}}>Sukhumvit</Tag>
      <Tag selected onClick={() => {}}>
        Open now
      </Tag>
      <Progress value={3} max={5} valueLabel="3 of 5" label="Upload" showValue />
      <Skeleton lines={3} />
      <Skeleton variant="circle" size={40} />
      <EmptyState title="Nothing yet" action={<Button>Add</Button>} />
      <Pagination pageCount={12} page={page} onChange={setPage} getHref={(p) => '?page=' + p} />
      <Accordion type="multiple" defaultValue={['a']} items={[{ id: 'a', title: 'A', content: 'a' }]} />
      <Popover trigger={<Button>Filters</Button>} title="Filters">
        {({ close }) => <Button onClick={close}>Apply</Button>}
      </Popover>
      <Checkbox defaultChecked id="c1" description="Weekly">
        Email me
      </Checkbox>
    </>
  );
}

/* 4.10 */
import { AuraProvider, Breadcrumb, Icon, ColorSchemeScript, useFormatDate, type DataTableSort } from '../src/index';
const RouterLink = React.forwardRef<
  HTMLAnchorElement,
  { href: string; className?: string; children?: React.ReactNode }
>(function RouterLink(p, ref) {
  return <a ref={ref} {...p} />;
});
export function V410() {
  const [sort, setSort] = React.useState<DataTableSort | null>(null);
  const svg = <svg viewBox="0 0 24 24" />;
  const fmt = useFormatDate();
  const s: string = fmt('2026-09-18', { format: 'long' }) + fmt(null) + fmt('2026-09-18', { locale: 'sv' });
  void s;
  return (
    <AuraProvider locale="sv" linkComponent={RouterLink}>
      <ColorSchemeScript nonce="abc123" />
      <Button variant="danger" icon={svg}>
        Delete
      </Button>
      <Button fullWidth>Förhandsgranska som mottagarna ser det</Button>
      <Button fullWidth href="/preview">
        Preview
      </Button>
      <Button variant="danger-secondary" href="/x" iconRight={svg}>
        Cancel
      </Button>
      <IconButton icon={svg} tone="danger" label="Delete" />
      <Icon name={svg} label="Company" />
      <Breadcrumb items={[{ label: 'Hem', href: '/' }, { label: 'Order' }]} />
      <SideNav
        linkComponent={RouterLink}
        value="inv"
        items={[
          {
            id: 'b',
            label: 'Billing',
            icon: svg,
            badge: <Badge>4</Badge>,
            defaultOpen: true,
            children: [{ id: 'inv', label: 'Invoices', href: '/inv', badge: 12 }],
          },
        ]}
      />
      <DataTable
        manual
        rows={[]}
        totalRows={312}
        pageSize={25}
        page={2}
        onPageChange={() => {}}
        sort={sort}
        onSortChange={setSort}
        loading
        getRowHref={(r) => '/m/' + r.id}
        getPageHref={(p) => '?page=' + p}
        linkComponent={RouterLink}
        columns={[{ key: 'amount', label: 'AMOUNT', align: 'end' }]}
      />
      {/* @ts-expect-error unknown locale */}
      <AuraProvider locale="de" />
      {/* @ts-expect-error unknown variant */}
      <Button variant="warning">x</Button>
      {/* @ts-expect-error align is start | end */}
      <DataTable rows={[]} columns={[{ key: 'a', label: 'A', align: 'center' }]} />
    </AuraProvider>
  );
}

/* 4.13 */
import { PasswordField, FormErrorSummary, FilterBar, Command, toast as t413, type CommandItem } from '../src/index';
export function V413() {
  const ref = React.useRef<HTMLInputElement>(null);
  const items: CommandItem[] = [{ id: 'a', label: 'Invoices', group: 'Pages', onSelect: () => {} }];
  const id: string = t413.loading('Saving', { id: 'x' });
  t413.success('Saved', { id, description: 'ok' });
  t413.error('Nope');
  t413.warning('Hm');
  t413.info('Fyi');
  // @ts-expect-error shorthands take a title string, not options
  t413.success({ title: 'x' });
  return (
    <>
      <PasswordField ref={ref} label="Password" autoComplete="new-password" />
      {/* @ts-expect-error type is fixed */}
      <PasswordField label="x" type="text" />
      <FormErrorSummary
        errors={{ email: { message: 'Enter email' }, name: undefined }}
        focusKey={1}
        onSelect={(f) => void f}
      />
      <FormErrorSummary errors={[{ field: 'email', message: 'Enter email' }]} />
      <FilterBar
        search=""
        onSearchChange={() => {}}
        filters={[{ id: 'a', label: 'A', onRemove: () => {} }]}
        onClearAll={() => {}}
        resultCount={3}
      />
      <Command open onOpenChange={() => {}} items={items} onSelect={(it) => void it.id} hotkey={false} />
    </>
  );
}

/* 4.14 */
import { useDensity, type AuraProviderProps, type DataTableProps } from '../src/index';
export function V414() {
  const d: 'comfortable' | 'compact' | undefined = useDensity();
  const p: AuraProviderProps['density'] = 'compact';
  const t: DataTableProps['density'] = 'comfortable';
  // @ts-expect-error only comfortable | compact
  const bad: AuraProviderProps['density'] = 'dense';
  void d;
  void p;
  void t;
  void bad;
  return (
    <AuraProvider density="compact">
      <DataTable label="x" density="compact" rows={[{ id: 'a' }]} columns={[{ key: 'id', label: 'ID' }]} />
    </AuraProvider>
  );
}

/* 4.15 */
export function V415() {
  const [c, setC] = React.useState(false);
  return (
    <>
      <SideNav
        collapsible
        collapsed={c}
        onCollapsedChange={setC}
        items={[{ id: 'a', label: 'A', icon: 'panel-left-open' }]}
      />
      <SideNav defaultCollapsed items={[]} />
      {/* @ts-expect-error collapsed is a boolean */}
      <SideNav collapsed="yes" items={[]} />
    </>
  );
}

/* 5.4: react-hook-form's formState.errors as is, nested objects and field arrays included; a Select named by
 * aria-labelledby (no visible label). */
import { useForm } from 'react-hook-form';
import { FormErrorSummary as RhfSummary, Select as RhfSelect, DataTable as RowsTable } from '../src/index';
export function RhfErrors53() {
  const f = useForm<{ province: string; address: { street: string }; items: { name: string }[] }>();
  return (
    <>
      <RhfSummary
        errors={f.formState.errors}
        focusKey={f.formState.submitCount}
        onSelect={(n) => f.setFocus(n as 'province')}
      />
      <RhfSummary errors={[{ field: 'province', message: 'Choose a province' }]} />
      <RhfSummary
        errors={{ address: { street: { message: 'Enter a street' } }, items: [{ name: { message: 'Name item 1' } }] }}
      />
      <span id="ext">Province</span>
      <RhfSelect aria-labelledby="ext" {...f.register('province')} options={['BKK']} />
      <RhfSelect label="Province" options={['BKK']} />
    </>
  );
}

/* 5.4: rows of your own interface, and row callbacks written with it; a string leaf is not an error tree. */
interface Invoice54 {
  id: string;
  amount: number;
}
export function TypedRows54({ rows, open }: { rows: readonly Invoice54[]; open: (r: Invoice54) => void }) {
  return (
    <>
      <RowsTable
        label="Invoices"
        rows={rows}
        onRowActivate={open}
        getRowHref={(r: Invoice54) => '/invoices/' + r.id}
        columns={[
          {
            key: 'amount',
            label: 'AMOUNT',
            render: (r: Invoice54) => r.amount.toFixed(2),
            sortValue: (r: Invoice54) => r.amount,
          },
        ]}
      />
      {/* @ts-expect-error a message must sit in an object: { email: { message } } */}
      <RhfSummary errors={{ email: 'Enter an email' }} />
    </>
  );
}
