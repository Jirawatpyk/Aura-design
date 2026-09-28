import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { IconRotateCcw, IconEllipsis, IconCircleAlert } from '@aura/react/icons';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.13' };
export default meta;

type Member = {
  id: string;
  company: string;
  flag: string;
  plan: string;
  contact: string;
  engagement: string;
};
const members: Member[] = [
  { id: 'M-101', company: 'Acme AB', flag: 'SE', plan: 'Gold', contact: 'Anna Berg', engagement: 'High' },
  { id: 'M-102', company: 'Nordic Timber Oy', flag: 'FI', plan: 'Silver', contact: 'Mika Laine', engagement: 'Low' },
  { id: 'M-103', company: 'Siam Logistics', flag: 'TH', plan: 'Gold', contact: 'Somchai P.', engagement: 'Medium' },
];

/* 80 (Chamber-OS addendum 13): the grid and its phone cards from one column list. The cards leave out the flag and
 * the ⋯ menu, show no checkboxes, and order their fields Member No., Plan, Primary contact, Engagement. */
export const DataTableCardOptions: StoryObj = {
  render: () => {
    const [sel, setSel] = React.useState<Array<string | number>>(['M-102']);
    const columns: Aura.DataTableColumn<Member>[] = [
      { key: 'company', label: 'COMPANY', width: 200 },
      { key: 'flag', label: 'COUNTRY', width: 96, card: 'hide' },
      { key: 'engagement', label: 'ENGAGEMENT', width: 120, cardOrder: 4 },
      { key: 'contact', label: 'PRIMARY CONTACT', width: 160, cardOrder: 3 },
      { key: 'plan', label: 'PLAN', width: 96, cardOrder: 2 },
      { key: 'id', label: 'MEMBER NO.', mono: true, cardOrder: 1 },
      {
        key: 'more',
        label: '',
        width: 56,
        actions: true,
        card: 'hide',
        render: (r) => <Aura.IconButton icon={<IconEllipsis />} label={'More for ' + r.company} />,
      },
    ];
    const table = (t: string, label: string) => (
      <div data-testid={t} style={t === 'cards' ? { width: 380 } : undefined}>
        <Aura.DataTable<Member>
          label={label}
          rows={members}
          rowKey="id"
          selectable
          selected={sel}
          onSelectionChange={setSel}
          hideSelectionInCards
          stackBelow={640}
          columns={columns}
        />
      </div>
    );
    return (
      <Aura.Stack gap={6}>
        {table('grid', 'Members')}
        {table('cards', 'Members (cards)')}
        <div data-testid="cards-loading" style={{ width: 380 }}>
          <Aura.DataTable<Member>
            label="Members (loading)"
            rows={[]}
            loading
            skeletonRows={2}
            selectable
            hideSelectionInCards
            stackBelow={640}
            columns={columns}
          />
        </div>
        <p className="aura-text-body" data-testid="selected">
          Selected: {sel.join(', ') || 'none'}
        </p>
      </Aura.Stack>
    );
  },
};

/* 81: a static table flush inside a Card, rows centred on their line; and the same table stacked on a phone. */
export const TableAlignFlush: StoryObj = {
  render: () => {
    const body = (
      <>
        <Aura.THead>
          <Aura.Tr>
            <Aura.Th>File</Aura.Th>
            <Aura.Th numeric>Rows</Aura.Th>
            <Aura.Th>
              <span className="aura-sr-only">Download</span>
            </Aura.Th>
          </Aura.Tr>
        </Aura.THead>
        <Aura.TBody>
          <Aura.Tr>
            <Aura.Td>
              members-2026-09.csv
              <br />
              <span style={{ color: 'var(--aura-fg-secondary)' }}>Exported 28 Sep, 14:02</span>
            </Aura.Td>
            <Aura.Td numeric>1,204</Aura.Td>
            <Aura.Td align="end">
              <Aura.Button size="sm" variant="secondary">
                Download
              </Aura.Button>
            </Aura.Td>
          </Aura.Tr>
          <Aura.Tr>
            <Aura.Td>directory-2026-08.csv</Aura.Td>
            <Aura.Td numeric>987</Aura.Td>
            <Aura.Td align="end">
              <Aura.Button size="sm" variant="secondary">
                Download
              </Aura.Button>
            </Aura.Td>
          </Aura.Tr>
        </Aura.TBody>
      </>
    );
    return (
      <Aura.Stack gap={6}>
        <div data-testid="flush" style={{ maxWidth: 640 }}>
          <Aura.Card title="Recent exports" headingLevel={2}>
            <Aura.Table caption="Recent exports" captionHidden align="middle" bordered={false}>
              {body}
            </Aura.Table>
          </Aura.Card>
        </div>
        <div data-testid="framed" style={{ maxWidth: 640 }}>
          <Aura.Table caption="Recent exports (default)" captionHidden>
            {body}
          </Aura.Table>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div data-testid="stacked-plain" style={{ width: 340 }}>
            <Aura.Table caption="Stacked" captionHidden stackBelow="sm">
              {body}
            </Aura.Table>
          </div>
          <div data-testid="stacked-props" style={{ width: 340 }}>
            <Aura.Table caption="Stacked (middle)" captionHidden stackBelow="sm" align="middle">
              {body}
            </Aura.Table>
          </div>
          <div data-testid="stacked-flush" style={{ width: 340 }}>
            <Aura.Table caption="Stacked, frameless" stackBelow="sm" align="middle" bordered={false}>
              {body}
            </Aura.Table>
          </div>
        </div>
      </Aura.Stack>
    );
  },
};

/* 82: the members list couldn't load — a danger EmptyState, framed; beside it the neutral default. */
export const EmptyStateDanger: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
      <Aura.EmptyState
        tone="danger"
        bordered
        data-testid="danger"
        icon={<IconCircleAlert />}
        title="Members couldn't load"
        description="The member service didn't answer. Your filters are kept."
        action={
          <Aura.Button variant="secondary" icon={<IconRotateCcw />}>
            Try again
          </Aura.Button>
        }
      />
      <Aura.EmptyState tone="danger" data-testid="danger-plain" icon={<IconCircleAlert />} title="Couldn't load" />
      <Aura.EmptyState bordered data-testid="neutral" title="No members yet" description="Invite the first one." />
    </div>
  ),
};

/* 84: the change-request queue as cards on a phone: company and member no. as the title, Review at the end of that
 * line, the rest two to a line under them. The desktop table is unchanged. */
export const TableCardSlots: StoryObj = {
  render: () => {
    const rows = [
      { co: 'Acme AB', no: 'M-101', type: 'Contact change', at: '28 Sep 2026', by: 'Anna Berg' },
      {
        co: 'Scandinavian-Thai Precision Engineering and Industrial Supplies Co., Ltd.',
        no: 'M-188',
        type: 'Plan upgrade',
        at: '27 Sep 2026',
        by: 'Lars Holm',
      },
    ];
    const table = (
      <Aura.Table caption="Change requests" captionHidden stackBelow="sm" align="middle">
        <Aura.THead>
          <Aura.Tr>
            <Aura.Th>Member</Aura.Th>
            <Aura.Th>Request</Aura.Th>
            <Aura.Th>Submitted</Aura.Th>
            <Aura.Th>By</Aura.Th>
            <Aura.Th>
              <span className="aura-sr-only">Action</span>
            </Aura.Th>
          </Aura.Tr>
        </Aura.THead>
        <Aura.TBody>
          {rows.map((r) => (
            <Aura.Tr key={r.no}>
              <Aura.Td card="title">
                {r.co} <span className="aura-table__mono">{r.no}</span>
              </Aura.Td>
              <Aura.Td>{r.type}</Aura.Td>
              <Aura.Td>{r.at}</Aura.Td>
              <Aura.Td>{r.by}</Aura.Td>
              <Aura.Td card="action" align="end">
                <Aura.Button size="sm" variant="secondary">
                  Review
                </Aura.Button>
              </Aura.Td>
            </Aura.Tr>
          ))}
        </Aura.TBody>
      </Aura.Table>
    );
    return (
      <Aura.Stack gap={6}>
        <div data-testid="queue-wide">{table}</div>
        <div data-testid="queue-phone" style={{ width: 360 }}>
          {table}
        </div>
        {/* Edge rows: a row header as the title; an action with no title; a title with nothing else. */}
        <div data-testid="queue-edges" style={{ width: 360 }}>
          <Aura.Table caption="Edge rows" captionHidden stackBelow="sm">
            <Aura.THead>
              <Aura.Tr>
                <Aura.Th>Member</Aura.Th>
                <Aura.Th>Request</Aura.Th>
                <Aura.Th>Submitted</Aura.Th>
                <Aura.Th>
                  <span className="aura-sr-only">Action</span>
                </Aura.Th>
              </Aura.Tr>
            </Aura.THead>
            <Aura.TBody>
              <Aura.Tr data-testid="edge-th">
                <Aura.Th scope="row" card="title">
                  Acme AB
                </Aura.Th>
                <Aura.Td>Contact change</Aura.Td>
                <Aura.Td>28 Sep 2026</Aura.Td>
                <Aura.Td card="action">
                  <Aura.Button size="sm" variant="secondary">
                    Review
                  </Aura.Button>
                </Aura.Td>
              </Aura.Tr>
              <Aura.Tr data-testid="edge-action">
                <Aura.Td>Nordic Timber Oy</Aura.Td>
                <Aura.Td>Plan upgrade</Aura.Td>
                <Aura.Td>27 Sep 2026</Aura.Td>
                <Aura.Td card="action">
                  <Aura.Button size="sm" variant="secondary">
                    Review
                  </Aura.Button>
                </Aura.Td>
              </Aura.Tr>
              <Aura.Tr data-testid="edge-title">
                <Aura.Td card="title" colSpan={4}>
                  Siam Logistics — no open requests
                </Aura.Td>
              </Aura.Tr>
            </Aura.TBody>
          </Aura.Table>
        </div>
      </Aura.Stack>
    );
  },
};
