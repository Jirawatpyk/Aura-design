import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/Fixed in 5.1.1' };
export default meta;

const provinces = [
  { value: '10', label: 'กรุงเทพมหานคร' },
  { value: '50', label: 'เชียงใหม่' },
  { value: '83', label: 'ภูเก็ต' },
];

/* Overlays: the Tab trap skips unreachable controls; two dialogs closed out of order unlock the page; a Combobox
 * inside a Popover takes mouse picks. */
export const Overlays: StoryObj = {
  render: () => {
    const [trap, setTrap] = React.useState(false);
    const [a, setA] = React.useState(false);
    const [b, setB] = React.useState(false);
    const [prov, setProv] = React.useState<string | null>(null);
    const [forced, setForced] = React.useState(false);
    return (
      <Aura.Stack gap={4} align="start">
        <Aura.Stack direction="row" gap={3}>
          <Aura.Button onClick={() => setTrap(true)}>Trap</Aura.Button>
          <Aura.Button variant="secondary" onClick={() => setA(true)}>
            Delete host
          </Aura.Button>
          <Aura.Popover
            title="Filter"
            trigger={
              <Aura.Button variant="secondary" icon="filter">
                Filter
              </Aura.Button>
            }
          >
            <div style={{ width: 260 }}>
              <Aura.Combobox label="Province" options={provinces} value={prov} onChange={setProv} />
            </div>
          </Aura.Popover>
          <Aura.Popover
            title="Pinned"
            open={forced || undefined}
            trigger={<Aura.Button variant="secondary">Pinned</Aura.Button>}
          >
            Pinned filters
          </Aura.Popover>
        </Aura.Stack>
        <Aura.Checkbox checked={forced} onChange={setForced}>
          Force pinned open
        </Aura.Checkbox>
        <p className="aura-text-body" data-testid="prov">
          Province: {prov || '—'}
        </p>
        <Aura.Dialog open={trap} onClose={() => setTrap(false)} title="Trap" dismissible={false}>
          <Aura.Stack gap={3}>
            <Aura.TextField label="First" />
            <Aura.Popover title="Options" trigger={<Aura.Button variant="secondary">Options</Aura.Button>}>
              <Aura.Stack direction="row" gap={2}>
                <Aura.Button size="sm">One</Aura.Button>
                <Aura.Button size="sm">Two</Aura.Button>
                <Aura.Button size="sm">Three</Aura.Button>
              </Aura.Stack>
            </Aura.Popover>
            <Aura.DatePicker label="Due" today="2026-09-25" />
            <Aura.Button variant="secondary">Last reachable</Aura.Button>
            <button type="button" tabIndex={-1}>
              Skipped
            </button>
            <button type="button" style={{ display: 'none' }}>
              Hidden
            </button>
          </Aura.Stack>
        </Aura.Dialog>
        <Aura.Dialog
          open={a}
          onClose={() => setA(false)}
          title="Delete host"
          footer={<Aura.Button onClick={() => setB(true)}>Delete…</Aura.Button>}
        >
          srv-01 will be removed.
        </Aura.Dialog>
        <Aura.Dialog
          open={b}
          onClose={() => setB(false)}
          title="Are you sure?"
          footer={
            <Aura.Button
              onClick={() => {
                setB(false);
                setA(false);
              }}
            >
              Confirm
            </Aura.Button>
          }
        >
          This can't be undone.
        </Aura.Dialog>
      </Aura.Stack>
    );
  },
};

/* Dates: typed dates obey min/max; a calendar that opens on a disabled day still has a tab stop; arrows cross
 * disabled weekends. */
export const Dates: StoryObj = {
  render: () => {
    const [d, setD] = React.useState<string | null>('2026-09-25');
    const [w, setW] = React.useState<string | null>(null);
    return (
      <Aura.Stack gap={4} style={{ maxWidth: 320 }}>
        <Aura.DatePicker
          label="Maintenance day"
          today="2026-09-25"
          min="2026-09-10"
          max="2026-09-30"
          value={d}
          onChange={setD}
        />
        <p className="aura-text-body" data-testid="day">
          Day: {d || '—'}
        </p>
        <Aura.DatePicker
          label="Weekday visit"
          today="2026-09-26"
          value={w}
          onChange={setW}
          isDateDisabled={(iso) => {
            const g = new Date(iso + 'T00:00:00').getDay();
            return g === 0 || g === 6;
          }}
        />
        <p className="aura-text-body" data-testid="weekday">
          Visit: {w || '—'}
        </p>
        <div data-testid="bare-cal">
          <Aura.Calendar today="2026-09-25" autoFocus={false} />
        </div>
      </Aura.Stack>
    );
  },
};

/* Forms: a native form receives Combobox values and FileUpload files; "1,5" is one and a half; reset to
 * undefined clears a Checkbox; nested errors are listed. */
export const NativeForm: StoryObj = {
  render: () => {
    const [sent, setSent] = React.useState('');
    const [agree, setAgree] = React.useState<boolean | undefined>(undefined);
    const [n, setN] = React.useState<number | null>(null);
    return (
      <form
        style={{ maxWidth: 360 }}
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const file = fd.get('doc') as File | null;
          setSent('province=' + fd.get('province') + '; doc=' + (file ? file.name + ':' + file.size : 'none'));
        }}
      >
        <Aura.Stack gap={4}>
          <Aura.Combobox label="Province" name="province" options={provinces} defaultValue="50" />
          <Aura.FileUpload label="Document" name="doc" />
          <Aura.NumberField label="Load average" step={0.5} value={n} onChange={setN} />
          <p className="aura-text-body" data-testid="num">
            Number: {n == null ? '—' : String(n)}
          </p>
          <Aura.Checkbox checked={agree} onChange={setAgree}>
            Notify on-call
          </Aura.Checkbox>
          <Aura.Button variant="secondary" onClick={() => setAgree(undefined)}>
            Reset
          </Aura.Button>
          <Aura.FormErrorSummary
            errors={{
              province: { message: 'Choose a province' },
              address: { street: { message: 'Enter a street' } },
              items: [{ name: { message: 'Name item 1' } }],
            }}
          />
          <Aura.Button type="submit">Send</Aura.Button>
          <p className="aura-text-body" data-testid="sent">
            {sent}
          </p>
        </Aura.Stack>
      </form>
    );
  },
};

/* A toast sent from a page's mount effect, with <Toaster/> after the page (the starter's order). */
function Welcome() {
  React.useEffect(() => {
    Aura.toast.success('Welcome back', { id: 'welcome' });
  }, []);
  return <p className="aura-text-body">Signed in.</p>;
}
export const ToastOnMount: StoryObj = {
  render: () => (
    <>
      <Welcome />
      <Aura.Toaster />
    </>
  ),
};

/* A stackBelow table centred in a flex column keeps its width. */
const hosts = [
  { id: 'srv-01', host: 'srv-01.dxt.local', status: 'Ready' },
  { id: 'srv-02', host: 'srv-02.dxt.local', status: 'Degraded' },
];
export const CentredTable: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} data-testid="centred">
      <Aura.DataTable
        label="Hosts"
        rows={hosts}
        stackBelow={400}
        columns={[
          { key: 'id', label: 'ID', width: 120, mono: true },
          { key: 'host', label: 'HOST' },
          { key: 'status', label: 'STATUS', pill: true, width: 140 },
        ]}
      />
    </div>
  ),
};

/* Server paging without totalRows: page 3 comes back empty — the pager stays, so there's a way back. */
export const ServerPastEnd: StoryObj = {
  render: () => {
    const all = Array.from({ length: 10 }, (_, i) => ({ id: 'H-' + (i + 1), host: 'host-' + (i + 1) }));
    const [page, setPage] = React.useState(1);
    const rows = all.slice((page - 1) * 5, page * 5);
    return (
      <Aura.DataTable
        label="Hosts, server paged"
        manual
        pageSize={5}
        page={page}
        onPageChange={setPage}
        rows={rows}
        columns={[
          { key: 'id', label: 'ID', width: 120 },
          { key: 'host', label: 'HOST' },
        ]}
      />
    );
  },
};

/* Tabs whose first tab is disabled start on the next one; a nested provider keeps Thai. */
export const TabsAndLocale: StoryObj = {
  render: () => (
    <Aura.AuraProvider locale="th">
      <Aura.Stack gap={4}>
        <Aura.Tabs
          label="Host"
          tabs={[
            { id: 'metrics', label: 'Metrics', disabled: true, content: 'Metrics' },
            { id: 'logs', label: 'Logs', content: 'Log panel' },
          ]}
        />
        <Aura.AuraProvider density="compact">
          <Aura.DatePicker label="วันที่" defaultValue="2026-09-18" />
        </Aura.AuraProvider>
      </Aura.Stack>
    </Aura.AuraProvider>
  ),
};

/* A tooltip you can move the pointer onto; a menu link opened with Space. */
export const HoverAndMenu: StoryObj = {
  render: () => (
    <Aura.Stack direction="row" gap={6} align="center" style={{ padding: 48 }}>
      <Aura.Tooltip content="Restarts the agent on every host in the pool" delay={0}>
        <Aura.Button variant="secondary">Restart</Aura.Button>
      </Aura.Tooltip>
      <Aura.DropdownMenu
        label="Host actions"
        trigger={<Aura.Button variant="secondary">Host actions</Aura.Button>}
        items={[
          { label: 'Open dashboard', href: '#dashboard' },
          { label: 'Silence alerts' },
          { label: 'Remove host', tone: 'danger' },
        ]}
      />
    </Aura.Stack>
  ),
};
