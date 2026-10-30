import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.75 visual audit set 1' };
export default meta;

const WORDS = ['To Do', 'In Progress', 'Ready', 'Warning', 'Blocked', 'Active', 'Down', 'Resolved'];

/* Item 1: every pill soft, as Alert and Badge; variant="solid" for the one status that must catch the eye.
 * Item 2: Active, Up, Online, Resolved → ready; Down, Offline, Outage → blocked. */
export const StatusPills: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <div data-testid="soft" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {WORDS.map((w) => (
          <Aura.StatusPill key={w}>{w}</Aura.StatusPill>
        ))}
      </div>
      <div data-testid="solid" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {WORDS.slice(0, 5).map((w) => (
          <Aura.StatusPill key={w} variant="solid">
            {w}
          </Aura.StatusPill>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Aura.Badge data-testid="badge-solid" tone="danger" variant="solid">
          3 overdue
        </Aura.Badge>
      </div>
    </div>
  ),
};

/* Items 4 and 12: the DataTable-style header band, and a sortable label on the line of a plain one. */
export const SortableHeader: StoryObj = {
  render: function Render() {
    const [dir, setDir] = React.useState<'ascending' | 'descending'>('ascending');
    return (
      <Aura.Table aria-label="Members">
        <Aura.THead>
          <Aura.Tr>
            <Aura.Th
              data-testid="sorted"
              sort={dir}
              onSort={() => setDir(dir === 'ascending' ? 'descending' : 'ascending')}
            >
              Member
            </Aura.Th>
            <Aura.Th data-testid="plain">Status</Aura.Th>
            <Aura.Th data-testid="amount" numeric sort="none" onSort={() => {}}>
              Amount
            </Aura.Th>
          </Aura.Tr>
        </Aura.THead>
        <Aura.TBody>
          {[
            ['Nordic Foods AB', 'Blocked', '฿ 12,500'],
            ['Acme AB', 'Ready', '฿ 4,200'],
            ['Siam Tea Co.', 'Warning', '฿ 9,900'],
          ].map(([m, s, a]) => (
            <Aura.Tr key={m}>
              <Aura.Td>{m}</Aura.Td>
              <Aura.Td>
                <Aura.StatusPill>{s}</Aura.StatusPill>
              </Aura.Td>
              <Aura.Td numeric>{a}</Aura.Td>
            </Aura.Tr>
          ))}
        </Aura.TBody>
      </Aura.Table>
    );
  },
};

/* Item 3: under the pointer the active option is shaded only; after a key it has the ring. */
export const ListOptions: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 24, maxWidth: 360, paddingBottom: 220 }}>
      <Aura.Combobox
        data-testid="combo"
        label="Member"
        options={[
          { value: 'acme', label: 'Acme AB' },
          { value: 'nord', label: 'Nordic Timber Oy' },
          { value: 'siam', label: 'Siam Tea Co.' },
        ]}
      />
      <Aura.Select data-testid="select" label="Plan" defaultValue="pro">
        <option value="basic">Basic</option>
        <option value="pro">Pro</option>
        <option value="team">Team</option>
      </Aura.Select>
    </div>
  ),
};

/* Item 5: a plain link (no class) in a PageHeader or body text takes the accent and is underlined. */
export const PlainLinks: StoryObj = {
  render: () => (
    <div>
      <Aura.PageHeader
        title="Renewal complete"
        subtitle={
          <>
            Receipt sent — <a href="#receipt">view it</a>
          </>
        }
      />
      <p className="aura-text-body">
        <a data-testid="body-link" href="#home">
          Back to the portal
        </a>
      </p>
    </div>
  ),
};

/* Items 7, 8, 13 and the Tag ×: the active SideNav item, Progress "Nearly full", toggles as tall as the search, and
 * a 16px × on a removable Tag. */
export const SetOneMisc: StoryObj = {
  render: function Render() {
    const [stage, setStage] = React.useState(0);
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        <Aura.SideNav
          value="invoices"
          items={[
            { id: 'home', label: 'Dashboard', icon: 'layout-dashboard', href: '#home' },
            { id: 'invoices', label: 'Invoices', icon: 'file-text', href: '#invoices' },
            { id: 'members', label: 'Members', icon: 'users', href: '#members' },
          ]}
        />
        <div style={{ display: 'grid', gap: 24, alignContent: 'start', minWidth: 0, flex: '1 1 260px' }}>
          <div data-testid="filters">
            <Aura.FilterBar search="" onSearchChange={() => {}} searchLabel="Search e-blasts">
              {['Awaiting review', 'Approved'].map((s, i) => (
                <Aura.Tag key={s} selected={stage === i} onClick={() => setStage(i)}>
                  {s}
                </Aura.Tag>
              ))}
              <Aura.Tag data-testid="touch-tag" touchHeight selected={stage === 2} onClick={() => setStage(2)}>
                Sent
              </Aura.Tag>
            </Aura.FilterBar>
          </div>
          <div data-testid="progress">
            <Aura.Progress label="Nearly full" value={5} max={6} tone="warning" />
          </div>
          <div>
            <Aura.Tag data-testid="tag" onRemove={() => {}}>
              Stockholm
            </Aura.Tag>
          </div>
        </div>
      </div>
    );
  },
};
