import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 4.10' };
export default meta;

/* A stand-in for next/link: it gets href, className, children and the ref, and "navigates" without reloading. */
function useFakeRouter() {
  const [path, setPath] = React.useState('/');
  const Link = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(function FakeLink(p, ref) {
        return (
          <a
            {...p}
            ref={ref}
            data-router-link=""
            onClick={(e) => {
              if (p.onClick) p.onClick(e);
              if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.shiftKey) return;
              e.preventDefault();
              setPath(String(p.href));
            }}
          />
        );
      }),
    [],
  );
  return { path, Link };
}

export const DangerActions: StoryObj = {
  render: () => (
    <Aura.Stack direction="row" gap={3} align="center" wrap>
      <Aura.Button variant="danger" icon="trash-2">Delete invoice</Aura.Button>
      <Aura.Button variant="danger-secondary">Cancel membership</Aura.Button>
      <Aura.Button variant="danger" disabled>Delete (disabled)</Aura.Button>
      <Aura.IconButton icon="trash-2" tone="danger" label="Delete row" />
    </Aura.Stack>
  ),
};

/* Any icon element works where AURA takes an icon name; AURA sizes it and hides it from screen readers. */
const Building = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
  </svg>
);
export const CustomIcons: StoryObj = {
  render: () => (
    <Aura.Stack direction="row" gap={3} align="center" wrap>
      <Aura.Button variant="secondary" icon={<Building />}>Members</Aura.Button>
      <Aura.IconButton icon={<Building />} label="Company" />
      <Aura.Badge icon={<Building />}>Corporate</Aura.Badge>
      <Aura.Icon name={<Building />} size={24} label="Company" />
    </Aura.Stack>
  ),
};

export const Swedish: StoryObj = {
  render: () => (
    <Aura.AuraProvider locale="sv">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, alignItems: 'start' }}>
        <Aura.DatePicker label="Förfallodatum" defaultValue="2026-09-18" clearable />
        <Aura.Calendar start="2026-09-18" focus="2026-09-18" />
        <Aura.Pagination pageCount={12} defaultPage={4} />
      </div>
    </Aura.AuraProvider>
  ),
};

export const RouterLinks: StoryObj = {
  render: () => {
    const { path, Link } = useFakeRouter();
    return (
      <Aura.AuraProvider linkComponent={Link}>
        <Aura.Stack gap={4}>
          <Aura.Breadcrumb items={[{ label: 'Members', href: '/members' }, { label: 'Acme AB' }]} />
          <Aura.Stack direction="row" gap={3} wrap>
            <Aura.Button href="/invoices/new" icon="plus">New invoice</Aura.Button>
            <Aura.Pagination pageCount={5} getHref={(p) => '/members?page=' + p} />
          </Aura.Stack>
          <div style={{ maxWidth: 280 }}>
            <Aura.Stat label="Open invoices" value={38} href="/invoices?status=open" />
          </div>
          <p className="aura-text-body" data-testid="route">Route: {path}</p>
        </Aura.Stack>
      </Aura.AuraProvider>
    );
  },
};

export const NestedNav: StoryObj = {
  render: () => {
    const { path, Link } = useFakeRouter();
    const [active, setActive] = React.useState('invoices');
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24, minHeight: 360 }}>
        <Aura.SideNav
          linkComponent={Link}
          value={active}
          onChange={setActive}
          items={[
            { id: 'home', label: 'Dashboard', icon: 'layout-dashboard', href: '/' },
            {
              id: 'billing',
              label: 'Billing',
              icon: 'file-text',
              badge: <Aura.Badge tone="warning">4</Aura.Badge>,
              children: [
                { id: 'invoices', label: 'Invoices', href: '/invoices', badge: 12 },
                { id: 'payments', label: 'Payments', href: '/payments' },
              ],
            },
            {
              id: 'members',
              label: 'Members',
              icon: 'users',
              children: [
                { id: 'companies', label: 'Companies', href: '/companies' },
                { id: 'people', label: 'People', href: '/people' },
              ],
            },
            { id: 'settings', label: 'Settings', icon: 'settings', href: '/settings' },
          ]}
        />
        <p className="aura-text-body" data-testid="route">Route: {path}</p>
      </div>
    );
  },
};

/* A fake server: 57 invoices, sorted and paged "remotely" with a short delay. */
const ALL = Array.from({ length: 57 }, (_, i) => ({
  id: 'INV-' + String(1001 + i),
  member: ['Acme AB', 'Nordic Rail', 'Siam Foods', 'Volvo Thai', 'Ericsson TH'][i % 5],
  status: ['Paid', 'Draft', 'Overdue', 'Paid', 'Void'][i % 7 % 5],
  amount: ((i * 7919) % 90000) + 1200,
}));
const baht = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2 }) + ' THB';
export const ServerTable: StoryObj = {
  render: () => {
    const { path, Link } = useFakeRouter();
    const [page, setPage] = React.useState(1);
    const [sort, setSort] = React.useState<Aura.DataTableSort | null>(null);
    const [rows, setRows] = React.useState(() => ALL.slice(0, 10));
    const [loading, setLoading] = React.useState(false);
    const first = React.useRef(true);
    React.useEffect(() => {
      if (first.current) {
        first.current = false;
        return;
      }
      setLoading(true);
      const id = setTimeout(() => {
        const s = sort ? [...ALL].sort((a: any, b: any) => (a[sort.key] > b[sort.key] ? 1 : -1) * (sort.dir === 'asc' ? 1 : -1)) : ALL;
        setRows(s.slice((page - 1) * 10, page * 10));
        setLoading(false);
      }, 400);
      return () => clearTimeout(id);
    }, [page, sort]);
    return (
      <Aura.Stack gap={3}>
        <Aura.DataTable
          label="Invoices"
          manual
          rows={rows.map((r) => ({ ...r, amount: baht(r.amount) }))}
          totalRows={ALL.length}
          pageSize={10}
          page={page}
          onPageChange={setPage}
          sort={sort}
          onSortChange={(s) => {
            setSort(s);
            setPage(1);
          }}
          loading={loading}
          linkComponent={Link}
          getRowHref={(r) => '/invoices/' + r.id}
          columns={[
            { key: 'id', label: 'INVOICE', width: 120, mono: true, sortable: true },
            { key: 'member', label: 'MEMBER', sortable: true },
            { key: 'status', label: 'STATUS', width: 112, pill: true, tones: { Paid: 'ready', Overdue: 'blocked' } },
            { key: 'amount', label: 'AMOUNT', width: 160, align: 'end', sortable: true },
          ]}
        />
        <p className="aura-text-body" data-testid="route">Route: {path}</p>
      </Aura.Stack>
    );
  },
};

/* Chart tokens in order. Series take chart-1…8; neighbours alternate dark/mid so they separate without hue. */
export const ChartPalette: StoryObj = {
  render: () => {
    const bars = [62, 48, 75, 40, 58, 33, 70, 45];
    return (
      <Aura.Stack gap={6}>
        <svg viewBox="0 0 400 180" width="100%" style={{ maxWidth: 560 }} role="img" aria-label="Categorical palette, chart-1 to chart-8">
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1="32" x2="392" y1={20 + i * 40} y2={20 + i * 40} stroke="var(--aura-chart-grid)" />
          ))}
          <line x1="32" x2="392" y1="160" y2="160" stroke="var(--aura-chart-axis)" />
          {bars.map((v, i) => (
            <g key={i}>
              <rect x={44 + i * 44} y={160 - v * 2} width="32" height={v * 2} rx="3" fill={`var(--aura-chart-${i + 1})`} />
              <text x={60 + i * 44} y="176" textAnchor="middle" fontSize="10" fill="var(--aura-chart-axis)">{i + 1}</text>
            </g>
          ))}
        </svg>
        <div style={{ display: 'flex', gap: 4, maxWidth: 560 }} role="img" aria-label="Sequential palette, chart-seq-1 to chart-seq-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} style={{ flex: 1, height: 32, borderRadius: 4, background: `var(--aura-chart-seq-${i})` }} />
          ))}
        </div>
      </Aura.Stack>
    );
  },
};

export const Fixes: StoryObj = {
  name: 'Stat text, neutral pill, skeleton',
  render: () => (
    <Aura.Stack gap={6}>
      <Aura.Grid columns={{ base: 1, sm: 2 }} gap={4}>
        <Aura.Stat label="Attention" value="1 benefit under-used" />
        <Aura.Stat label="Outstanding" value="38,520.00 THB" />
      </Aura.Grid>
      <Aura.Stack direction="row" gap={2} wrap>
        <Aura.StatusPill tone="neutral">Lapsed</Aura.StatusPill>
        <Aura.StatusPill tone="progress">In review</Aura.StatusPill>
        <Aura.StatusPill tone="ready">Paid</Aura.StatusPill>
        <Aura.StatusPill tone="blocked">Overdue</Aura.StatusPill>
      </Aura.Stack>
      <div style={{ maxWidth: 360 }}>
        <Aura.Skeleton lines={3} />
      </div>
    </Aura.Stack>
  ),
};
