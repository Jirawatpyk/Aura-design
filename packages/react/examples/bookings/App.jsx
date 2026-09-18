/* Pilot: a real bookings admin page built only from @aura/react.
 * Desktop: SideNav + filters row + table.  Phone: nav in a Drawer, filters in a Drawer, table as cards. */
import * as React from 'react';
import {
  AppShell, SideNav, Container, Stack, Grid, Stat, Button, IconButton, DropdownMenu, Avatar, Breadcrumb,
  Combobox, DateRangePicker, DatePicker, TimePicker, FileUpload, Select, TextField, Textarea, RadioGroup, Switch,
  DataTable, StatusPill, Drawer, Dialog, Alert, Toaster, toast, formatDate, useBreakpoint,
} from '@aura/react';
import { MAIDS, SERVICES, STATUSES, TONE, statusLabel, makeBookings } from './data.js';

const baht = (n) => '฿' + n.toLocaleString('th-TH');
const maidName = (v) => (MAIDS.find((m) => m.value === v) || {}).label || '—';
const TODAY = '2026-09-18';

function Filters({ value, onChange, idPrefix }) {
  const set = (k) => (v) => onChange({ ...value, [k]: v });
  return (
    <>
      <TextField id={idPrefix + '-q'} label="ค้นหา" icon="search" placeholder="ชื่อลูกค้า หรือ BK-…" value={value.q} onChange={(e) => set('q')(e.target.value)} />
      <Combobox id={idPrefix + '-maid'} label="แม่บ้าน" placeholder="ทุกคน" options={MAIDS} value={value.maid} onChange={set('maid')} />
      <DateRangePicker id={idPrefix + '-range'} label="ช่วงวันที่" value={value.range} onChange={set('range')} />
      <Select id={idPrefix + '-status'} label="สถานะ" value={value.status} onChange={(e) => set('status')(e.target.value)}
        options={[{ value: '', label: 'ทุกสถานะ' }, ...STATUSES.map((s) => ({ value: statusLabel(s), label: statusLabel(s) }))]} />
    </>
  );
}

const EMPTY_FILTERS = { q: '', maid: null, range: { start: null, end: null }, status: '' };

function NewBookingDialog({ open, onClose, onCreate }) {
  const EMPTY = { customer: '', maid: null, date: null, time: null, service: SERVICES[0], hours: '3', notes: '', notify: true, photos: [] };
  const [f, setF] = React.useState(EMPTY);
  const [tried, setTried] = React.useState(false);
  const errors = {
    customer: !f.customer.trim() && 'ใส่ชื่อลูกค้า',
    maid: !f.maid && 'เลือกแม่บ้าน — พิมพ์ชื่อเพื่อค้นหา',
    date: !f.date ? 'เลือกวันที่ หรือพิมพ์ วว/ดด/ปปปป' : f.date < TODAY && 'เลือกวันนี้หรือหลังจากนี้',
    time: !f.time && 'เลือกเวลาเริ่มงาน',
    photos: f.photos.some((p) => p.error) && 'ลบไฟล์ที่มีปัญหาก่อนบันทึก',
  };
  const ok = !errors.customer && !errors.maid && !errors.date && !errors.time && !errors.photos;
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
    <Dialog open={open} onClose={onClose} title="สร้างการจอง" description="ลูกค้าจะได้รับ SMS ยืนยันเมื่อบันทึก" size="md"
      footer={<>
        <Button variant="secondary" onClick={onClose}>ยกเลิก</Button>
        <Button type="submit" form="new-booking">บันทึกการจอง</Button>
      </>}>
      <form id="new-booking" onSubmit={submit} noValidate>
        <Stack gap={5}>
          <TextField label="ลูกค้า" required value={f.customer} onChange={(e) => set('customer')(e.target.value)} error={tried && errors.customer} data-autofocus="" />
          <Combobox label="แม่บ้าน" required options={MAIDS} value={f.maid} onChange={set('maid')} error={tried && errors.maid} />
          <Grid columns={{ base: 1, sm: 2 }} gap={4}>
            <DatePicker label="วันที่" required min={TODAY} value={f.date} onChange={set('date')} error={tried && errors.date} />
            <TimePicker label="เวลาเริ่ม" required min="08:00" max="18:00" step={30} suggest="09:00" value={f.time} onChange={set('time')} error={tried && errors.time} />
          </Grid>
          <Select label="บริการ" options={SERVICES} value={f.service} onChange={(e) => set('service')(e.target.value)} />
          <RadioGroup label="ระยะเวลา" orientation="horizontal" options={[{ value: '2', label: '2 ชม.' }, { value: '3', label: '3 ชม.' }, { value: '4', label: '4 ชม.' }]} value={f.hours} onChange={set('hours')} />
          <Textarea label="หมายเหตุ" optional rows={3} value={f.notes} onChange={(e) => set('notes')(e.target.value)} />
          <FileUpload label="รูปหน้างาน" optional accept="image/*" multiple maxFiles={3} maxSize={5 * 1024 * 1024}
            value={f.photos} onChange={set('photos')} error={tried && errors.photos} />
          <Switch label="ส่ง SMS ยืนยันให้ลูกค้า" checked={f.notify} onChange={set('notify')} />
        </Stack>
      </form>
    </Dialog>
  );
}

function Detail({ row, onClose, onCancel }) {
  const rows = row ? [
    ['สถานะ', <StatusPill tone={TONE[row.status]}>{row.status}</StatusPill>],
    ['ลูกค้า', row.customer], ['พื้นที่', row.area],
    ['วันที่', formatDate(row.date, { format: 'long' }) + ' · ' + row.time],
    ['บริการ', row.service + ' · ' + row.hours + ' ชม.'], ['แม่บ้าน', maidName(row.maid)], ['ยอด', baht(row.amount)],
  ] : [];
  return (
    <Drawer open={!!row} onClose={onClose} title={row ? row.id : ''} description={row ? row.customer : ''}
      footer={<>
        <Button variant="secondary" icon="ban" onClick={() => onCancel(row)} disabled={row && row.status === 'ยกเลิก'}>ยกเลิกการจอง</Button>
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
  const [nav, setNav] = React.useState('bookings');
  const [rows, setRows] = React.useState(() => makeBookings());
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
    if (filters.maid && r.maid !== filters.maid) return false;
    if (filters.status && r.status !== filters.status) return false;
    if (filters.range.start && r.date < filters.range.start) return false;
    if (filters.range.end && r.date > filters.range.end) return false;
    return true;
  });
  const activeFilters = ['q', 'maid', 'status'].filter((k) => filters[k]).length + (filters.range.start ? 1 : 0);
  const today = rows.filter((r) => r.date === TODAY);

  function create(f) {
    const id = 'BK-' + (1040 + rows.length);
    setRows([{ id, customer: f.customer, area: '—', date: f.date, time: f.time, service: f.service, hours: +f.hours, maid: f.maid, status: 'รอยืนยัน', amount: +f.hours * 350 }, ...rows]);
    setCreating(false);
    toast({ title: 'บันทึก ' + id + ' แล้ว', description: formatDate(f.date) + ' ' + f.time + ' · ' + maidName(f.maid) + (f.photos.length ? ' · รูป ' + f.photos.length : ''), tone: 'success' });
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
    { label: 'ยกเลิกการจอง', icon: 'ban', disabled: r.status === 'ยกเลิก', onSelect: () => setConfirm(r) },
  ];
  const columns = [
    { key: 'id', label: 'รหัส', width: 104, mono: true, sortable: true, pinned: true },
    { key: 'customer', label: 'ลูกค้า', width: 180, sortable: true },
    { key: 'date', label: 'วันที่', width: 150, sortable: true, render: (r) => formatDate(r.date) + ' ' + r.time },
    { key: 'maid', label: 'แม่บ้าน', width: 140, hideBelow: 860, render: (r) => maidName(r.maid), sortValue: (r) => maidName(r.maid) },
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
          { id: 'bookings', label: 'การจอง', icon: 'calendar', count: rows.filter((r) => r.status === 'รอยืนยัน').length },
          { id: 'maids', label: 'แม่บ้าน', icon: 'users' },
          { id: 'customers', label: 'ลูกค้า', icon: 'user' },
          { id: 'settings', label: 'ตั้งค่า', icon: 'settings' }]} />}
      header={<div className="pilot-bar">
        {phone ? <strong>การจอง</strong> : <Breadcrumb items={[{ label: 'ภาพรวม', href: '#' }, { label: 'การจอง' }]} />}
        <DropdownMenu label="บัญชี" items={[{ label: 'โปรไฟล์', icon: 'user', onSelect: () => {} }, { label: 'ออกจากระบบ', icon: 'log-out', onSelect: () => {} }]}
          trigger={<button type="button" className="pilot-account" aria-label="บัญชี Tao"><Avatar name="Tao P" size="sm" /></button>} />
      </div>}>
      <Container>
        <Stack gap={6}>
          <Stack direction={{ base: 'column', sm: 'row' }} justify="space-between" align={phone ? 'stretch' : 'flex-end'} gap={3}>
            <div>
              <h1 className="pilot-h1">การจอง</h1>
              <p className="pilot-sub">{formatDate(TODAY, { format: 'long' })} · {shown.length} รายการ</p>
            </div>
            <Stack direction="row" gap={3}>
              <DropdownMenu label="ส่งออก" items={[{ label: 'CSV', icon: 'download', onSelect: () => toast({ title: 'กำลังเตรียมไฟล์ CSV', tone: 'info' }) }]}
                trigger={<Button variant="secondary" iconRight="chevron-down">ส่งออก</Button>} />
              <Button icon="plus" onClick={() => setCreating(true)}>สร้างการจอง</Button>
            </Stack>
          </Stack>

          <Grid columns={{ base: 2, lg: 4 }} gap={4}>
            <Stat label="งานวันนี้" icon="calendar" loading={loading} value={today.length} unit="งาน" caption={formatDate(TODAY)} />
            <Stat label="รอยืนยัน" icon="clock" loading={loading} value={rows.filter((r) => r.status === 'รอยืนยัน').length}
              change={{ value: '+3', direction: 'up', tone: 'negative', label: 'จากเมื่อวาน' }} />
            <Stat label="แม่บ้านพร้อม" icon="users" loading={loading} value={MAIDS.filter((m) => !m.disabled).length} unit="คน" caption="1 คนลาพัก" />
            <Stat label="ยอดเดือนนี้" loading={loading} value={baht(rows.filter((r) => r.date.startsWith('2026-09') && r.status !== 'ยกเลิก').reduce((a, r) => a + r.amount, 0))}
              change={{ value: '+12%', direction: 'up', label: 'จาก ส.ค.' }} />
          </Grid>

          {rows.some((r) => r.date === TODAY && r.status === 'ยกเลิก') ? (
            <Alert tone="warning" title="มีงานวันนี้ถูกยกเลิก">ตรวจสอบและแจ้งแม่บ้านที่ได้รับผลกระทบ</Alert>
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

          <DataTable label="การจอง" columns={columns} rows={shown} rowKey="id" loading={loading}
            selectable selected={selected} onSelectionChange={setSelected}
            pageSize={10} resizable stackBelow={640} defaultSort={{ key: 'date', dir: 'asc' }}
            onRowActivate={setDetail}
            empty={{ icon: 'search', title: 'ไม่พบการจอง', description: 'ลองล้างตัวกรองหรือเปลี่ยนช่วงวันที่',
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
      <NewBookingDialog open={creating} onClose={() => setCreating(false)} onCreate={create} />
      <Dialog open={!!confirm} onClose={() => setConfirm(null)} role="alertdialog" size="sm"
        title={confirm ? 'ยกเลิก ' + confirm.id + '?' : ''}
        description="ลูกค้าและแม่บ้านจะได้รับแจ้ง คุณเลิกทำได้จากข้อความแจ้งเตือน"
        footer={<>
          <Button variant="secondary" onClick={() => setConfirm(null)}>ไม่ยกเลิก</Button>
          <Button onClick={() => cancel(confirm)} data-autofocus="">ยกเลิกการจอง</Button>
        </>} />
      <Toaster />
    </AppShell>
  );
}
