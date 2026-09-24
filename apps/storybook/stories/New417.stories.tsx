import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 4.17' };
export default meta;

/* Every control that was under 44px on touch screens before 4.17, in one place (Chamber-OS item 30). */
export const TouchTargets: StoryObj = {
  render: () => {
    const [seg, setSeg] = React.useState('month');
    const [open, setOpen] = React.useState(false);
    const [tags, setTags] = React.useState(['Gold', 'Nordic']);
    return (
      <Aura.Stack gap={5}>
        <Aura.Stack direction="row" gap={3} align="center" wrap>
          <Aura.DropdownMenu
            trigger={<Aura.Button variant="secondary">Actions</Aura.Button>}
            items={[
              { label: 'Edit', icon: 'pencil' },
              { label: 'Duplicate', icon: 'copy' },
              { separator: true },
              { label: 'Delete', icon: 'trash-2' },
            ]}
          />
          <Aura.SegmentedControl
            label="Period"
            value={seg}
            onChange={setSeg}
            options={[
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
              { value: 'year', label: 'Year' },
            ]}
          />
          {tags.map((t) => (
            <Aura.Tag key={t} onRemove={() => setTags(tags.filter((x) => x !== t))}>
              {t}
            </Aura.Tag>
          ))}
        </Aura.Stack>
        <Aura.Pagination pageCount={8} defaultPage={3} />
        <Aura.Grid columns={{ base: 1, md: 2 }} gap={4}>
          <Aura.Combobox
            label="Member"
            defaultValue="acme"
            clearable
            options={[
              { value: 'acme', label: 'Acme AB' },
              { value: 'nordic', label: 'Nordic Rail' },
            ]}
          />
          <Aura.DatePicker label="Due date" defaultValue="2026-09-24" clearable />
        </Aura.Grid>
        <Aura.Calendar start="2026-09-24" focus="2026-09-24" />
        <div>
          <Aura.Button onClick={() => setOpen(true)}>New member</Aura.Button>
        </div>
        <Aura.Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="New member"
          footer={
            <>
              <Aura.Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Aura.Button>
              <Aura.Button>Create member</Aura.Button>
            </>
          }
        >
          <Aura.Stack gap={4}>
            {['Company', 'Contact', 'Email', 'Phone', 'Address', 'City', 'Postcode', 'Tax ID', 'Website', 'Notes'].map(
              (f) => (
                <Aura.TextField key={f} label={f} />
              ),
            )}
          </Aura.Stack>
        </Aura.Dialog>
      </Aura.Stack>
    );
  },
};

/* Each link-rendering component takes its own linkComponent (no provider here); the pager's arrows are links too. */
const FakeLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { onNav?: (h: string) => void }
>(function FakeLink({ onNav, ...p }, ref) {
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
});
export const OwnLinkComponent: StoryObj = {
  render: () => {
    const [route, setRoute] = React.useState('/');
    React.useEffect(() => {
      const on = () => setRoute((window as unknown as { __route: string }).__route);
      document.addEventListener('fake-nav', on);
      return () => document.removeEventListener('fake-nav', on);
    }, []);
    return (
      <Aura.Stack gap={4}>
        <Aura.Breadcrumb
          linkComponent={FakeLink}
          items={[{ label: 'Members', href: '/members' }, { label: 'Acme AB' }]}
        />
        <Aura.Pagination linkComponent={FakeLink} pageCount={5} page={2} getHref={(p) => '/members?page=' + p} />
        <div style={{ maxWidth: 280 }}>
          <Aura.Stat linkComponent={FakeLink} label="Open invoices" value={38} href="/invoices?status=open" />
        </div>
        <p className="aura-text-body" data-testid="route">
          Route: {route}
        </p>
      </Aura.Stack>
    );
  },
};

/* Server search per keystroke (Chamber-OS item 33): controlled query, filter={false}, loading, empty slot. */
const MEMBERS = [
  'Acme AB',
  'Acme Logistics',
  'Acme Nordic',
  'Nordic Rail',
  'Siam Foods',
  'Volvo Thai',
  'Ericsson TH',
  'Thai Union',
];
function searchMembers(q: string): Promise<string[]> {
  const s = q.trim().toLowerCase();
  return new Promise((r) => setTimeout(() => r(MEMBERS.filter((m) => m.toLowerCase().includes(s))), 300));
}
export const AsyncCommand: StoryObj = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const [items, setItems] = React.useState<Aura.CommandItem[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [chosen, setChosen] = React.useState('');
    React.useEffect(() => {
      if (!query.trim()) {
        setItems([]);
        setLoading(false);
        return;
      }
      let live = true;
      setLoading(true);
      const t = setTimeout(() => {
        searchMembers(query).then((names) => {
          if (!live) return;
          setItems(names.map((n) => ({ id: n, label: n, group: 'Members', icon: 'users' as const })));
          setLoading(false);
        });
      }, 200);
      return () => {
        live = false;
        clearTimeout(t);
      };
    }, [query]);
    return (
      <Aura.Stack gap={3}>
        <div>
          <Aura.Button variant="secondary" icon="search" onClick={() => setOpen(true)}>
            Find a member
          </Aura.Button>
        </div>
        <p className="aura-text-body" data-testid="chosen">
          Chosen: {chosen}
        </p>
        <Aura.Command
          open={open}
          onOpenChange={setOpen}
          hotkey={false}
          items={items}
          filter={false}
          query={query}
          onQueryChange={setQuery}
          loading={loading}
          placeholder="Search members"
          onSelect={(it) => setChosen(it.label)}
          empty={
            query ? (
              <Aura.Stack gap={3} align="center">
                <span>No member matches “{query}”.</span>
                <Aura.Button size="sm" variant="secondary" icon="plus">
                  Create member
                </Aura.Button>
              </Aura.Stack>
            ) : (
              'Type a name to search members.'
            )
          }
        />
      </Aura.Stack>
    );
  },
};

/* Server mode with sort and page in one callback (Chamber-OS item 34), plus stackBelow and hideBelow. */
const INVOICES = Array.from({ length: 57 }, (_, i) => ({
  id: 'INV-' + String(1001 + i),
  member: ['Acme AB', 'Nordic Rail', 'Siam Foods', 'Volvo Thai', 'Ericsson TH'][i % 5],
  status: ['Paid', 'Draft', 'Overdue'][i % 3],
  amount: ((i * 7919) % 90000) + 1200,
}));
export const ServerStateTable: StoryObj = {
  render: () => {
    const [state, setState] = React.useState<Aura.DataTableState>({ sort: null, page: 3 });
    const [calls, setCalls] = React.useState<string[]>([]);
    const sorted = state.sort
      ? [...INVOICES].sort(
          (a, b) =>
            ((a as any)[state.sort!.key] > (b as any)[state.sort!.key] ? 1 : -1) * (state.sort!.dir === 'asc' ? 1 : -1),
        )
      : INVOICES;
    const rows = sorted
      .slice((state.page - 1) * 10, state.page * 10)
      .map((r) => ({ ...r, amount: r.amount.toLocaleString('en-US') + ' THB' }));
    return (
      <Aura.Stack gap={3}>
        <Aura.DataTable
          label="Invoices"
          manual
          rows={rows}
          totalRows={INVOICES.length}
          pageSize={10}
          page={state.page}
          sort={state.sort}
          onStateChange={(s) => {
            setCalls((c) => [...c, JSON.stringify(s)]);
            setState(s);
          }}
          onSortChange={() => setCalls((c) => [...c, 'onSortChange'])}
          onPageChange={() => setCalls((c) => [...c, 'onPageChange'])}
          stackBelow={640}
          columns={[
            { key: 'id', label: 'INVOICE', width: 120, mono: true, sortable: true },
            { key: 'member', label: 'MEMBER', width: 180, sortable: true, hideBelow: 'md' },
            { key: 'status', label: 'STATUS', width: 112, pill: true, tones: { Paid: 'ready', Overdue: 'blocked' } },
            { key: 'amount', label: 'AMOUNT', align: 'end', sortable: true },
          ]}
        />
        <pre data-testid="calls">{calls.join('\n')}</pre>
      </Aura.Stack>
    );
  },
};
