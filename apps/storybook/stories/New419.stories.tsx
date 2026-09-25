import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 4.19' };
export default meta;

/* A router link stand-in: records the route instead of loading a page (as next/link would). */
const FakeLink = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  function FakeLink(p, ref) {
    return (
      <a
        {...p}
        ref={ref}
        data-router-link=""
        onClick={(e) => {
          if (p.onClick) p.onClick(e);
          if (e.defaultPrevented) return;
          e.preventDefault();
          (window as unknown as { __route: string }).__route = String(p.href);
          document.dispatchEvent(new Event('fake-nav'));
        }}
      />
    );
  },
);
function useRoute(start: string) {
  const [route, setRoute] = React.useState(start);
  React.useEffect(() => {
    const on = () => setRoute((window as unknown as { __route: string }).__route);
    document.addEventListener('fake-nav', on);
    return () => document.removeEventListener('fake-nav', on);
  }, []);
  return route;
}

/* 41: a totals row under the grid (and as a last card when stacked), optionally sticky; truncated cells show their
 * full text on hover and focus. */
const invoices = [
  {
    id: 'INV-2026-0141',
    member: 'Scandinavian-Thai Chamber of Commerce Foundation for Trade and Culture',
    net: '100,000.00',
    vat: '7,000.00',
    total: '107,000.00',
  },
  { id: 'INV-2026-0142', member: 'Nordic Rail', net: '12,500.00', vat: '875.00', total: '13,375.00' },
  { id: 'INV-2026-0143', member: 'Siam Foods', net: '8,000.00', vat: '560.00', total: '8,560.00' },
  { id: 'INV-2026-0144', member: 'Acme AB', net: '4,200.00', vat: '294.00', total: '4,494.00' },
  { id: 'INV-2026-0145', member: 'Bangkok Timber', net: '15,000.00', vat: '1,050.00', total: '16,050.00' },
];
const invoiceColumns = [
  { key: 'id', label: 'INVOICE', width: 150, mono: true },
  { key: 'member', label: 'MEMBER', width: 220 },
  { key: 'net', label: 'NET', width: 120, align: 'end' as const },
  { key: 'vat', label: 'VAT', width: 110, align: 'end' as const },
  { key: 'total', label: 'TOTAL (THB)', align: 'end' as const },
];
const invoiceTotals = { id: 'Total', net: '139,700.00', vat: '9,779.00', total: '149,479.00' };
export const TableTotals: StoryObj = {
  render: () => (
    <Aura.Stack gap={6}>
      <div data-testid="grid-totals">
        <Aura.DataTable label="Output VAT register" rows={invoices} columns={invoiceColumns} footer={invoiceTotals} />
      </div>
      <div data-testid="sticky-totals">
        <Aura.DataTable
          label="Output VAT register, scrolling"
          rows={invoices.concat(invoices.map((r) => ({ ...r, id: r.id + '-B' })))}
          columns={invoiceColumns}
          footer={invoiceTotals}
          stickyFooter
          height={260}
        />
      </div>
      <div data-testid="stacked-totals" style={{ maxWidth: 380 }}>
        <Aura.DataTable
          label="Output VAT register, phone"
          rows={invoices.slice(0, 2)}
          columns={invoiceColumns}
          footer={invoiceTotals}
          stackBelow={640}
        />
      </div>
    </Aura.Stack>
  ),
};

/* 42: link items (through linkComponent), a danger item, and a radio group. */
export const MenuKinds: StoryObj = {
  render: () => {
    const route = useRoute('/');
    const [view, setView] = React.useState('grid');
    return (
      <Aura.Stack gap={4} align="start">
        <Aura.DropdownMenu
          label="Invoice actions"
          linkComponent={FakeLink}
          trigger={<Aura.Button variant="secondary">Invoice actions</Aura.Button>}
          items={[
            { label: 'Open member', icon: 'external-link', href: '/members/acme' },
            { label: 'Download PDF', icon: 'download' },
            { separator: true },
            { label: 'Grid', type: 'radio', group: 'View', checked: view === 'grid', onSelect: () => setView('grid') },
            { label: 'List', type: 'radio', group: 'View', checked: view === 'list', onSelect: () => setView('list') },
            { separator: true },
            { label: 'Void invoice', icon: 'trash-2', tone: 'danger' },
          ]}
        />
        <p className="aura-text-body" data-testid="route">
          Route: {route} · View: {view}
        </p>
      </Aura.Stack>
    );
  },
};

/* 43: a form's sticky bar with a status line; a bulk bar with "N selected · Clear". */
export const ActionBars: StoryObj = {
  render: () => {
    const [dirty, setDirty] = React.useState(false);
    const [selected, setSelected] = React.useState(0);
    return (
      <Aura.Stack gap={6}>
        <div style={{ maxWidth: 520 }}>
          <Aura.Card title="Record payment" headingLevel={2}>
            <Aura.Stack gap={4}>
              <Aura.TextField label="Reference" onChange={() => setDirty(true)} />
              <Aura.TextField label="Payer" onChange={() => setDirty(true)} />
              <Aura.TextField label="Note" id="last-field" onChange={() => setDirty(true)} />
            </Aura.Stack>
            <Aura.ActionBar
              position="container"
              status={dirty ? 'Unsaved changes' : 'Total 107,000.00 THB · due Oct 22, 2026'}
            >
              <Aura.Button variant="secondary">Cancel</Aura.Button>
              <Aura.Button>Save</Aura.Button>
            </Aura.ActionBar>
          </Aura.Card>
        </div>
        <div style={{ maxWidth: 640 }}>
          <Aura.Stack direction="row" gap={2}>
            <Aura.Button variant="secondary" size="sm" onClick={() => setSelected(selected + 1)}>
              Select one more
            </Aura.Button>
          </Aura.Stack>
          <Aura.ActionBar label="Bulk actions" selected={selected} onClearSelection={() => setSelected(0)}>
            <Aura.Button variant="secondary" size="sm">
              Export
            </Aura.Button>
            <Aura.Button size="sm">Send reminder</Aura.Button>
          </Aura.ActionBar>
        </div>
      </Aura.Stack>
    );
  },
};

/* 44: phone tab bar. Resize below 1024px to see it (it is hidden from lg up, in CSS). */
export const BottomTabs: StoryObj = {
  render: () => {
    const route = useRoute('/');
    return (
      <Aura.AppShell
        header={<strong>Member portal</strong>}
        bottomNav={
          <Aura.BottomNav
            linkComponent={FakeLink}
            defaultValue="home"
            items={[
              { id: 'home', label: 'Home', icon: 'house', href: '/' },
              { id: 'invoices', label: 'Invoices', icon: 'file-text', href: '/invoices', count: 2 },
              { id: 'events', label: 'Events', icon: 'calendar', href: '/events' },
              { id: 'inbox', label: 'Inbox', icon: 'inbox', href: '/inbox', badge: true, badgeLabel: 'new' },
              { id: 'me', label: 'Account', icon: 'user', href: '/account' },
            ]}
          />
        }
      >
        <p className="aura-text-body" data-testid="route">
          Route: {route}
        </p>
        {/* The ActionBar is the form's last child: it sticks while any of the form is on screen. */}
        <form onSubmit={(e) => e.preventDefault()}>
          <Aura.Stack gap={4}>
            {['Company', 'Contact person', 'Email', 'Phone', 'Address', 'Tax ID', 'Branch', 'Website', 'Industry'].map(
              (l) => (
                <Aura.TextField key={l} label={l} />
              ),
            )}
            <Aura.TextField label="Message" id="last-field" />
          </Aura.Stack>
          <Aura.ActionBar status="Draft saved">
            <Aura.Button type="submit">Send</Aura.Button>
          </Aura.ActionBar>
        </form>
      </Aura.AppShell>
    );
  },
};

/* 45: "today" from a time zone, not the browser clock. */
export const DateInTimeZone: StoryObj = {
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <Aura.DatePicker label="Payment date" timeZone="Asia/Bangkok" max="today" />
    </div>
  ),
};

/* 46: section tabs that are routes. */
export const LinkTabs: StoryObj = {
  render: () => {
    const route = useRoute('/renewals');
    const tabs = [
      { id: 'pipeline', label: 'Pipeline', href: '/renewals' },
      { id: 'review', label: 'Pending review', href: '/renewals/review', count: 4 },
      { id: 'tasks', label: 'Tasks', href: '/renewals/tasks' },
      { id: 'tiers', label: 'Tier upgrades', href: '/renewals/tiers' },
    ];
    const current = tabs.filter((t) => t.href === route)[0] || tabs[0];
    return (
      <Aura.Stack gap={4}>
        <div style={{ maxWidth: 320 }}>
          <Aura.Tabs label="Renewals" linkComponent={FakeLink} value={current.id} tabs={tabs} />
        </div>
        <p className="aura-text-body" data-testid="route">
          Route: {route}
        </p>
      </Aura.Stack>
    );
  },
};

/* 47: six results in a row — three on screen, the rest queued, none dropped. */
export const ToastQueue: StoryObj = {
  render: () => (
    <>
      <Aura.Toaster />
      <Aura.Button
        variant="secondary"
        onClick={() => {
          for (let i = 1; i <= 6; i++) {
            const opts = { id: 'r' + i, duration: 60000 };
            if (i === 5) Aura.toast.error('Result ' + i + ': Nordic Rail bounced', opts);
            else Aura.toast.success('Result ' + i + ': reminder sent', opts);
          }
        }}
      >
        Send 6 reminders
      </Aura.Button>
    </>
  ),
};
