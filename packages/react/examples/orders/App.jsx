/* Pilot: an orders admin page built only from @aura/react — neutral data any business has.
 * Desktop: SideNav + filters row + table.  Phone: nav in a Drawer, filters in a Drawer, table as cards. */
import * as React from 'react';
import {
  AppShell, SideNav, Container, Stack, Grid, Stat, Button, IconButton, DropdownMenu, Avatar, Breadcrumb,
  Combobox, DateRangePicker, DatePicker, TimePicker, FileUpload, Select, TextField, Textarea, RadioGroup, Switch,
  DataTable, StatusPill, Drawer, Dialog, Alert, Toaster, toast, formatDate, useBreakpoint, ColorSchemeToggle,
} from '@aura/react';
import { STAFF, CATEGORIES, PRIORITIES, STATUSES, TONE, statusLabel, priorityLabel, makeOrders } from './data.js';

const baht = (n) => '฿' + n.toLocaleString('th-TH');
const ownerName = (v) => (STAFF.find((m) => m.value === v) || {}).label || '—';
const TODAY = '2026-09-18';

function Filters({ value, onChange, idPrefix }) {
  const set = (k) => (v) => onChange({ ...value, [k]: v });
  return (
    <>
      <TextField id={idPrefix + '-q'} label="ค้นหา" icon="search" placeholder="ชื่อลูกค้า หรือ ORD-…" value={value.q} onChange={(e) => set('q')(e.target.value)} />
      <Combobox id={idPrefix + '-owner'} label="ผู้ดูแล" placeholder="ทุกคน" options={STAFF} value={value.owner} onChange={set('owner')} />
      <DateRangePicker id={idPrefix + '-range'} label="ช่วงวันที่" value={value.range} onChange={set('range')} />
      <Select id={idPrefix + '-status'} label="สถานะ" value={value.status} onChange={(e) => set('status')(e.target.value)}
        options={[{ value: '', label: 'ทุกสถานะ' }, ...STATUSES.map((s) => ({ value: statusLabel(s), label: statusLabel(s) }))]} />
    </>
  );
}

const EMPTY_FILTERS = { q: '', owner: null, range: { start: null, end: null }, status: '' };

function NewOrderDialog({ open, onClose, onCreate }) {
  const EMPTY = { customer: '', owner: null, date: null, time: null, category: CATEGORIES[0], priority: 'normal', notes: '', notify: true, files: [] };
  const [f, setF] = React.useState(EMPTY);
  const [tried, setTried] = React.useState(false);
  const errors = {
    customer: !f.customer.trim() && 'ใส่ชื่อลูกค้า',
    owner: !f.owner && 'เลือกผู้ดูแล — พิมพ์ชื่อเพื่อค้นหา',
    date: !f.date ? 'เลือกวันที่ หรือพิมพ์ วว/ดด/ปปปป' : f.date < TODAY && 'เลือกวันนี้หรือหลังจากนี้',
    time: !f.time && 'เลือกเวลาส่ง',
    files: f.files.some((p) => p.error) && 'ลบไฟล์ที่มีปัญหาก่อนบันทึก',
  };
  const ok = !errors.customer && !errors.owner && !errors.date && !errors.time && !errors.files;
  const set = (k) => (v) => setF({ ...f, [k]: v });
  function submit(e) {
    e.preventDefault();
    setTried(true);
    if (!ok) { const first = document.querySelector('.aura-dialog [aria-invalid="true"]'); if (first) first.focus(); return; }
    onCreate(f);
    setTried(false);
    setF(EMPTY);
  }
  return (
    <Dialog open={open} onClose={onClose} title="สร้างคำสั่งซื้อ" description="ลูกค้าจะได้รับอีเมลยืนยันเมื่อบันทึก" size="md"
      footer={<>
        <Button variant="secondary" onClick={onClose}>ยกเลิก</Button>
        <Button type="submit" form="new-order">บันทึกคำสั่งซื้อ</Button>
      </>}>
      <form id="new-order" onSubmit={submit} noValidate>
        <Stack gap={5}>
          <TextField label="ลูกค้า" required value={f.customer} onChange={(e) => set('customer')(e.target.value)} error={tried && errors.customer} data-autofocus="" />
          <Combobox label="ผู้ดูแล" required options={STAFF} value={f.owner} onChange={set('owner')} error={tried && errors.owner} />
          <Grid columns={{ base: 1, sm: 2 }} gap={4}>
            <DatePicker label="วันที่ส่ง" required min={TODAY} value={f.date} onChange={set('date')} error={tried && errors.date} />
            <TimePicker label="เวลาส่ง" required min="08:00" max="18:00" step={30} suggest="09:00" value={f.time} onChange={set('time')} error={tried && errors.time} />
          </Grid>
          <Select label="ประเภท" options={CATEGORIES} value={f.category} onChange={(e) => set('category')(e.target.value)} />
          <RadioGroup label="ความเร่งด่วน" orientation="horizontal" options={PRIORITIES} value={f.priority} onChange={set('priority')} />
          <Textarea label="หมายเหตุ" optional rows={3} value={f.notes} onChange={(e) => set('notes')(e.target.value)} />
          <FileUpload label="ไฟล์แนบ" optional accept="image/*,.pdf" multiple maxFiles={3} maxSize={5 * 1024 * 1024}
            value={f.files} onChange={set('files')} error={tried && errors.files} />
          <Switch label="ส่งอีเมลยืนยันให้ลูกค้า" checked={f.notify} onChange={set('notify')} />
        </Stack>
      </form>
    </Dialog>
  );
}

function Detail({ row, onClose, onCancel }) {
  const rows = row ? [
    ['สถานะ', <StatusPill tone={TONE[row.status]}>{row.status}</StatusPill>],
    ['ลูกค้า', row.customer], ['สาขา', row.branch],
    ['วันที่', formatDate(row.date, { format: 'long' }) + ' · ' + row.time],
    ['ประเภท', row.category + ' · ' + priorityLabel(row.priority)], ['ผู้ดูแล', ownerName(row.owner)], ['ยอด', baht(row.amount)],
  ] : [];
  return (
    <Drawer open={!!row} onClose={onClose} title={row ? row.id : ''} description={row ? row.customer : ''}
      footer={<>
        <Button variant="secondary" icon="ban" onClick={() => onCancel(row)} disabled={row && row.status === 'ยกเลิก'}>ยกเลิกคำสั่งซื้อ</Button>
        <Button icon="pencil" onClick={() => toast({ title: 'ยังไม่มีหน้าแก้ไขในตัวอย่างนี้', tone: 'info' })}>แก้ไข</Button>
      </>}>
      <dl className="pilot-dl">
        {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl>
    </Drawer>
  );
}

export function App() {
  const bp = useBreakpoint();
  const phone = bp === 'base';
  const [nav, setNav] = React.useState('orders');
  const [rows, setRows] = React.useState(() => makeOrders());
  const [filters, setFilters] = React.useState(EMPTY_FILTERS);
  const [draft, setDraft] = React.useState(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [detail, setDetail] = React.useState(null);
  const [creating, setCreating] = React.useState(false);
  const [confirm, setConfirm] = React.useState(null);
  const [selected, setSelected] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  const shown = rows.filter((r) => {
    const q = filters.q.trim().toLocaleLowerCase('th');
    if (q && !(r.customer.toLocaleLowerCase('th').includes(q) || r.id.toLowerCase().includes(q))) return false;
    if (filters.owner && r.owner !== filters.owner) return false;
    if (filters.status && r.status !== filters.status) return false;
    if (filters.range.start && r.date < filters.range.start) return false;
    if (filters.range.end && r.date > filters.range.end) return false;
    return true;
  });
  const activeFilters = ['q', 'owner', 'status'].filter((k) => filters[k]).length + (filters.range.start ? 1 : 0);
  const today = rows.filter((r) => r.date === TODAY);

  function create(f) {
    const id = 'ORD-' + (1040 + rows.length);
    setRows([{ id, customer: f.customer, branch: 'ออนไลน์', date: f.date, time: f.time, category: f.category, priority: f.priority, owner: f.owner, status: 'รอยืนยัน', amount: 1500 }, ...rows]);
    setCreating(false);
    toast({ title: 'บันทึก ' + id + ' แล้ว', description: formatDate(f.date) + ' ' + f.time + ' · ' + ownerName(f.owner) + (f.files.length ? ' · ไฟล์ ' + f.files.length : ''), tone: 'success' });
  }
  function cancel(row) {
    const before = rows;
    setRows(rows.map((r) => (r.id === row.id ? { ...r, status: 'ยกเลิก' } : r)));
    setConfirm(null); setDetail(null);
    toast({ title: 'ยกเลิก ' + row.id + ' แล้ว', tone: 'warning', action: { label: 'เลิกทำ', onClick: () => setRows(before) } });
  }
  const rowActions = (r) => [
    { label: 'ดูรายละเอียด', icon: 'eye', onSelect: () => setDetail(r) },
    { label: 'คัดลอกรหัส', icon: 'copy', onSelect: () => { navigator.clipboard && navigator.clipboard.writeText(r.id).catch(() => {}); toast({ title: 'คัดลอก ' + r.id }); } },
    { separator: true },
    { label: 'ยกเลิกคำสั่งซื้อ', icon: 'ban', disabled: r.status === 'ยกเลิก', onSelect: () => setConfirm(r) },
  ];
  const columns = [
    { key: 'id', label: 'รหัส', width: 104, mono: true, sortable: true, pinned: true },
    { key: 'customer', label: 'ลูกค้า', width: 180, sortable: true },
    { key: 'date', label: 'วันที่', width: 150, sortable: true, render: (r) => formatDate(r.date) + ' ' + r.time },
    { key: 'owner', label: 'ผู้ดูแล', width: 140, hideBelow: 860, render: (r) => ownerName(r.owner), sortValue: (r) => ownerName(r.owner) },
    { key: 'status', label: 'สถานะ', width: 120, pill: true, tones: TONE, sortable: true },
    { key: 'amount', label: 'ยอด', width: 96, hideBelow: 800, sortable: true, render: (r) => baht(r.amount) },
    { key: 'actions', label: '', actions: true, width: 56, resizable: false, render: (r) => (
      <DropdownMenu label={'จัดการ ' + r.id} items={rowActions(r)} trigger={<IconButton icon="ellipsis" label={'จัดการ ' + r.id} />} />
    ) },
  ];

  return (
    <AppShell
      navLabel="เมนูหลัก" menuLabel="เปิดเมนู"
      nav={<SideNav value={nav} onChange={setNav} label="เมนูหลัก"
        header={<strong className="pilot-brand">AURA</strong>}
        items={[
          { id: 'home', label: 'ภาพรวม', icon: 'layout-dashboard' },
          { id: 'orders', label: 'คำสั่งซื้อ', icon: 'file-text', count: rows.filter((r) => r.status === 'รอยืนยัน').length },
          { id: 'customers', label: 'ลูกค้า', icon: 'user' },
          { id: 'team', label: 'ทีม', icon: 'users' },
          { id: 'settings', label: 'ตั้งค่า', icon: 'settings' }]} />}
      header={<div className="pilot-bar">
        {phone ? <strong>คำสั่งซื้อ</strong> : <Breadcrumb items={[{ label: 'ภาพรวม', href: '#' }, { label: 'คำสั่งซื้อ' }]} />}
        <Stack direction="row" gap={2} align="center">
        <ColorSchemeToggle />
        <DropdownMenu label="บัญชี" items={[{ label: 'โปรไฟล์', icon: 'user', onSelect: () => {} }, { label: 'ออกจากระบบ', icon: 'log-out', onSelect: () => {} }]}
          trigger={<button type="button" className="pilot-account" aria-label="บัญชี Tao"><Avatar name="Tao P" size="sm" /></button>} />
        </Stack>
      </div>}>
      <Container>
        <Stack gap={6}>
          <Stack direction={{ base: 'column', sm: 'row' }} justify="space-between" align={phone ? 'stretch' : 'flex-end'} gap={3}>
            <div>
              <h1 className="pilot-h1">คำสั่งซื้อ</h1>
              <p className="pilot-sub">{formatDate(TODAY, { format: 'long' })} · {shown.length} รายการ</p>
            </div>
            <Stack direction="row" gap={3}>
              <DropdownMenu label="ส่งออก" items={[{ label: 'CSV', icon: 'download', onSelect: () => toast({ title: 'กำลังเตรียมไฟล์ CSV', tone: 'info' }) }]}
                trigger={<Button variant="secondary" iconRight="chevron-down">ส่งออก</Button>} />
              <Button icon="plus" onClick={() => setCreating(true)}>สร้างคำสั่งซื้อ</Button>
            </Stack>
          </Stack>

          <Grid columns={{ base: 2, lg: 4 }} gap={4}>
            <Stat label="ส่งวันนี้" icon="calendar" loading={loading} value={today.length} unit="รายการ" caption={formatDate(TODAY)} />
            <Stat label="รอยืนยัน" icon="clock" loading={loading} value={rows.filter((r) => r.status === 'รอยืนยัน').length}
              change={{ value: '+3', direction: 'up', tone: 'negative', label: 'จากเมื่อวาน' }} />
            <Stat label="ผู้ดูแลที่ว่าง" icon="users" loading={loading} value={STAFF.filter((m) => !m.disabled).length} unit="คน" caption="1 คนลาพัก" />
            <Stat label="ยอดเดือนนี้" loading={loading} value={baht(rows.filter((r) => r.date.startsWith('2026-09') && r.status !== 'ยกเลิก').reduce((a, r) => a + r.amount, 0))}
              change={{ value: '+12%', direction: 'up', label: 'จาก ส.ค.' }} />
          </Grid>

          {rows.some((r) => r.date === TODAY && r.status === 'ยกเลิก') ? (
            <Alert tone="warning" title="มีคำสั่งซื้อที่ต้องส่งวันนี้ถูกยกเลิก">ตรวจสอบสต็อกและแจ้งผู้ดูแลที่เกี่ยวข้อง</Alert>
          ) : null}

          {phone ? (
            <Stack direction="row" gap={3}>
              <Button variant="secondary" icon="filter" onClick={() => { setDraft(filters); setFiltersOpen(true); }}>
                ตัวกรอง{activeFilters ? ' (' + activeFilters + ')' : ''}
              </Button>
              {activeFilters ? <Button variant="secondary" onClick={() => setFilters(EMPTY_FILTERS)}>ล้าง</Button> : null}
            </Stack>
          ) : (
            <div className="pilot-filters"><Filters value={filters} onChange={setFilters} idPrefix="f" /></div>
          )}

          <DataTable label="คำสั่งซื้อ" columns={columns} rows={shown} rowKey="id" loading={loading}
            selectable selected={selected} onSelectionChange={setSelected}
            pageSize={10} resizable stackBelow={640} defaultSort={{ key: 'date', dir: 'asc' }}
            onRowActivate={setDetail}
            empty={{ icon: 'search', title: 'ไม่พบคำสั่งซื้อ', description: 'ลองล้างตัวกรองหรือเปลี่ยนช่วงวันที่',
              action: <Button variant="secondary" onClick={() => setFilters(EMPTY_FILTERS)}>ล้างตัวกรอง</Button> }} />
        </Stack>
      </Container>

      <Drawer open={filtersOpen} onClose={() => setFiltersOpen(false)} title="ตัวกรอง" size="sm"
        footer={<>
          <Button variant="secondary" onClick={() => setDraft(EMPTY_FILTERS)}>ล้าง</Button>
          <Button onClick={() => { setFilters(draft); setFiltersOpen(false); }}>ดูผลลัพธ์</Button>
        </>}>
        <Stack gap={5}><Filters value={draft} onChange={setDraft} idPrefix="fd" /></Stack>
      </Drawer>

      <Detail row={detail} onClose={() => setDetail(null)} onCancel={(r) => setConfirm(r)} />
      <NewOrderDialog open={creating} onClose={() => setCreating(false)} onCreate={create} />
      <Dialog open={!!confirm} onClose={() => setConfirm(null)} role="alertdialog" size="sm"
        title={confirm ? 'ยกเลิก ' + confirm.id + '?' : ''}
        description="ลูกค้าและผู้ดูแลจะได้รับแจ้ง คุณเลิกทำได้จากข้อความแจ้งเตือน"
        footer={<>
          <Button variant="secondary" onClick={() => setConfirm(null)}>ไม่ยกเลิก</Button>
          <Button onClick={() => cancel(confirm)} data-autofocus="">ยกเลิกคำสั่งซื้อ</Button>
        </>} />
      <Toaster />
    </AppShell>
  );
}
