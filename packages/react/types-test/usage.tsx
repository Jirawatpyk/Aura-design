/* Compile-only check that the public types describe real usage. `npm run typecheck`. */
import * as React from 'react';
import { AppShell, SideNav, Stack, Grid, Container, Combobox, DatePicker, DateRangePicker, Drawer, DropdownMenu, IconButton, Button,
  DataTable, Stat, Badge, Tag, Progress, Skeleton, EmptyState, Pagination, Accordion, Popover, Checkbox, createTheme, ThemeStyle, TimePicker, FileUpload, formatBytes, parseTime, type UploadItem, formatDate, parseDate, useBreakpoint, useResponsive, breakpoints, toast, type DateRange } from '../src/index';

export function Page() {
  const [owner, setOwner] = React.useState<string | null>(null);
  const [date, setDate] = React.useState<string | null>('2026-09-18');
  const [range, setRange] = React.useState<DateRange>({ start: null, end: null });
  const [open, setOpen] = React.useState(false);
  const bp = useBreakpoint();
  const [time, setTime] = React.useState<string | null>(parseTime('9.30'));
  const [files, setFiles] = React.useState<UploadItem[]>([]);
  const cols = useResponsive<number>({ base: 1, md: 2, lg: 4 });
  const label: string = formatDate(date, { format: 'long' }) + (parseDate('18/09/2569') ?? '') + breakpoints.lg + bp + cols;
  return (
    <AppShell nav={<SideNav items={[{ id: 'b', label: 'Orders', icon: 'calendar' }]} value="b" />} header={label}>
      <Container>
        <Stack direction={{ base: 'column', md: 'row' }} gap={{ base: 2, md: 4 }} align="flex-end">
          <Combobox label="ผู้ดูแล" options={[{ value: 'a', label: 'กมล', keywords: ['kamon'] }, 'Mai']} value={owner} onChange={setOwner} clearable />
          <DatePicker label="วันที่" value={date} onChange={setDate} min="2026-01-01" />
          <DateRangePicker label="ช่วงวันที่" value={range} onChange={setRange} calendar="gregory" locale="en" />
          <DropdownMenu label="Actions" trigger={<IconButton icon="ellipsis" label="Actions" />} items={[{ label: "Export", icon: "download" }]} />
          <Button onClick={() => { setOpen(true); toast({ title: 'Saved', tone: 'success' }); }}>Open</Button>
        </Stack>
        <Grid columns={{ base: 1, lg: 3 }} gap={6}><div /></Grid>
        <DataTable rows={[{ id: '1' }]} stackBelow={640} columns={[{ key: 'id', label: 'ID', hideBelow: 'lg' }, { key: 'x', label: '', actions: true, hideBelow: 900 }]} />
        <Stat label="วันนี้" value={3} unit="งาน" change={{ value: '+1', direction: 'up', tone: 'positive', label: 'vs เมื่อวาน' }} icon="calendar" href="#" />
        <TimePicker label="เวลา" value={time} onChange={setTime} step={15} min="08:00" max="18:00" isTimeDisabled={(t) => t === '12:00'} />
        <FileUpload label="รูป" accept="image/*" multiple maxFiles={3} maxSize={5 * 1024 * 1024} value={files} onChange={setFiles} hint={formatBytes(1024)} />
      </Container>
      <Drawer open={open} onClose={() => setOpen(false)} title="ORD-1042" size="lg" footer={<Button variant="secondary">Close</Button>}>x</Drawer>
    </AppShell>
  );
}

/* Refs reach the real element (react-hook-form register, focus management). */
export function Refs() {
  const input = React.useRef<HTMLInputElement>(null);
  const btn = React.useRef<HTMLButtonElement>(null);
  const table = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => { input.current?.focus(); btn.current?.blur(); table.current?.scrollIntoView(); }, []);
  return (<>
    <TimePicker ref={input} label="t" />
    <Button ref={btn}>Go</Button>
    <DataTable ref={table} rows={[]} />
  </>);
}

/* Button with href is a link: anchor props and an <a> ref; without href, button props and a <button> ref. */
function FakeRouterLink(p: { href: string; className?: string; children?: React.ReactNode }) { return <a {...p} />; }
export function ButtonLinks() {
  const a = React.useRef<HTMLAnchorElement>(null);
  const b = React.useRef<HTMLButtonElement>(null);
  type P = React.ComponentProps<typeof Button>;
  const p: P = { children: 'x', type: 'submit', loading: true };   // ComponentProps still gives the button props
  return (<>
    <Button href="/orders" ref={a} target="_blank" rel="noreferrer" iconRight="external-link">Docs</Button>
    <Button href="/orders" linkComponent={FakeRouterLink} variant="secondary">Orders</Button>
    <Button href="/x" disabled>Unavailable</Button>
    <Button ref={b} type="submit" loading>Save</Button>
    <Button {...p} />
    {/* @ts-expect-error a button has no href target */}
    <Button target="_blank">Nope</Button>
    {/* @ts-expect-error links don't take loading */}
    <Button href="/x" loading>Nope</Button>
    {/* @ts-expect-error an anchor ref on a button */}
    <Button ref={a}>Nope</Button>
  </>);
}

export function General() {
  const [page, setPage] = React.useState(1);
  const theme = createTheme({ brand: '#0ea5e9', primary: 'brand' });
  const ok: boolean = theme.ok && theme.checks.every((c) => c.ratio > 0);
  return (<>
    <ThemeStyle brand="#0ea5e9" selector=".tenant" />
    <style>{theme.css('.x')}</style>
    <Badge tone="success" icon="check">{String(ok)}</Badge>
    <Tag onRemove={() => {}}>Sukhumvit</Tag>
    <Tag selected onClick={() => {}}>Open now</Tag>
    <Progress value={3} max={5} valueLabel="3 of 5" label="Upload" showValue />
    <Skeleton lines={3} /><Skeleton variant="circle" size={40} />
    <EmptyState title="Nothing yet" action={<Button>Add</Button>} />
    <Pagination pageCount={12} page={page} onChange={setPage} getHref={(p) => '?page=' + p} />
    <Accordion type="multiple" defaultValue={['a']} items={[{ id: 'a', title: 'A', content: 'a' }]} />
    <Popover trigger={<Button>Filters</Button>} title="Filters">{({ close }) => <Button onClick={close}>Apply</Button>}</Popover>
    <Checkbox defaultChecked id="c1" description="Weekly">Email me</Checkbox>
  </>);
}
