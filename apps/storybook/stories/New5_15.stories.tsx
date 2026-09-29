import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { IconEllipsis, IconX } from '@aura/react/icons';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.15' };
export default meta;

/* 85 (Chamber-OS addendum 14): the change-request queue as separate cards on a phone; the framed table on a desktop. */
export const TableCards: StoryObj = {
  render: () => {
    const rows = [
      { co: 'Acme AB', no: 'M-101', type: 'Contact change', at: '28 Sep 2026' },
      { co: 'Nordic Timber Oy', no: 'M-102', type: 'Plan upgrade', at: '27 Sep 2026' },
    ];
    const table = (
      <Aura.Table caption="Change requests" captionHidden stackBelow="sm" stackStyle="cards" align="middle">
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
          {rows.map((r) => (
            <Aura.Tr key={r.no}>
              <Aura.Td card="title">
                {r.co} <span className="aura-table__mono">{r.no}</span>
              </Aura.Td>
              <Aura.Td>{r.type}</Aura.Td>
              <Aura.Td>{r.at}</Aura.Td>
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
        <div data-testid="cards-wide">{table}</div>
        <div data-testid="cards-phone" style={{ width: 360 }}>
          {table}
        </div>
        {/* Compact, frameless, with a visible caption: the caption lines up with the cards. */}
        <div data-testid="cards-compact" style={{ width: 360 }}>
          <Aura.Table caption="Recent exports" stackBelow="sm" stackStyle="cards" density="compact" bordered={false}>
            <Aura.THead>
              <Aura.Tr>
                <Aura.Th>File</Aura.Th>
                <Aura.Th numeric>Rows</Aura.Th>
              </Aura.Tr>
            </Aura.THead>
            <Aura.TBody>
              <Aura.Tr>
                <Aura.Td>members-2026-09.csv</Aura.Td>
                <Aura.Td numeric>1,204</Aura.Td>
              </Aura.Tr>
            </Aura.TBody>
          </Aura.Table>
        </div>
      </Aura.Stack>
    );
  },
};

/* 87, 93: a Card whose head is a status pill over a title the app marks up, one loading with bars, and a list
 * card that drops its frame below 1024px so its rows can be cards. */
export const CardOptions: StoryObj = {
  render: () => (
    <Aura.Stack gap={4}>
      <Aura.Card
        data-testid="card-header"
        header={
          <>
            <Aura.StatusPill tone="warning">Pending review</Aura.StatusPill>
            <h2 className="aura-card__title">Contact change · Acme AB</h2>
          </>
        }
        actions={<Aura.IconButton icon={<IconEllipsis />} label="More for this request" />}
      >
        Submitted 28 Sep 2026 by Anna Berg.
      </Aura.Card>
      <Aura.Card
        data-testid="card-loading"
        aria-busy
        header={
          <>
            <Aura.Skeleton width={160} />
            <Aura.Skeleton width={240} />
          </>
        }
      >
        <Aura.Skeleton lines={2} />
      </Aura.Card>
      <Aura.Card data-testid="card-flush" flushBelow="lg" interactive title="Invoices" headingLevel={2}>
        <p>INV-2026-0141 · ฿107,000.00</p>
      </Aura.Card>
    </Aura.Stack>
  ),
};

/* 89: the E-Blast quota — two sent, one queued, of six. */
export const ProgressReserved: StoryObj = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Aura.Stack gap={5}>
        <Aura.Progress
          label="E-Blasts this year"
          value={2}
          secondaryValue={1}
          max={6}
          showValue
          valueLabel="2 sent · 1 queued · 6 included"
          hint="Queued sends count once they go out."
        />
        <Aura.Progress label="Seats" value={3} secondaryValue={2} max={10} tone="success" />
        <Aura.Progress label="Nearly full" value={5} secondaryValue={4} max={6} tone="warning" />
      </Aura.Stack>
    </div>
  ),
};

/* 90: underline tabs sharing the width on phones and tablets, at their own width on a desktop. */
export const TabsFill: StoryObj = {
  render: () => {
    const [v, setV] = React.useState('benefits');
    return (
      <Aura.Tabs
        label="Member sections"
        fullWidth="below-lg"
        value={v}
        onChange={setV}
        tabs={[
          { id: 'benefits', label: 'Benefits', content: <p>Four benefits in use.</p> },
          { id: 'usage', label: 'Usage', content: <p>Usage this year.</p> },
        ]}
      />
    );
  },
};

const STATUS = [
  { value: 'all', label: 'All statuses' },
  { value: 'open', label: 'Open' },
  { value: 'paid', label: 'Paid' },
];
const YEAR = [
  { value: 'all', label: 'All years' },
  { value: '2026', label: '2026' },
  { value: '2025', label: '2025' },
];
const TYPE = [
  { value: 'all', label: 'All types' },
  { value: 'membership', label: 'Membership' },
  { value: 'event', label: 'Event' },
];

/* 92: invoice filters — three filters sharing a row under the search up to 1024px, one row with it above. */
export const FilterBarFill: StoryObj = {
  render: () => {
    const [q, setQ] = React.useState('');
    const [s, setS] = React.useState('all');
    const [y, setY] = React.useState('all');
    const [t, setT] = React.useState('all');
    return (
      <div style={{ margin: -8 }}>
        <Aura.FilterBar
          label="Invoice filters"
          search={q}
          onSearchChange={setQ}
          searchLabel="Search invoices"
          controlsLayout="fill"
          stackBelow="lg"
          actions={
            <Aura.Button size="sm" variant="ghost" icon={<IconX />}>
              Clear
            </Aura.Button>
          }
        >
          <Aura.FilterSelect label="Status" allLabel="All" options={STATUS} value={s} onChange={setS} />
          <Aura.FilterSelect label="Year" allLabel="All" options={YEAR} value={y} onChange={setY} />
          <Aura.FilterSelect label="Type" allLabel="All" options={TYPE} value={t} onChange={setT} />
        </Aura.FilterBar>
      </div>
    );
  },
};

/* 94: the staff shell's trail — first, "…" and last on a phone; every item carries the app's data-slot. */
export const BreadcrumbCollapse: StoryObj = {
  render: () => {
    const [next, setNext] = React.useState(false);
    return (
      <Aura.Stack gap={4}>
        <Aura.Breadcrumb collapseBelow="sm" items={next ? NEXT_TRAIL : TRAIL} />
        <Aura.Button size="sm" variant="secondary" onClick={() => setNext(!next)}>
          {next ? 'Previous page' : 'Next page'}
        </Aura.Button>
      </Aura.Stack>
    );
  },
};
const TRAIL = [
  { label: 'Admin', href: '#admin', itemProps: { 'data-slot': 'breadcrumb-item' } },
  { label: 'Members', href: '#members', itemProps: { 'data-slot': 'breadcrumb-item' } },
  { label: 'Acme AB', href: '#acme', itemProps: { 'data-slot': 'breadcrumb-item' } },
  { label: 'Change requests', href: '#requests', itemProps: { 'data-slot': 'breadcrumb-item' } },
  {
    label: 'Contact change',
    itemProps: { 'data-slot': 'breadcrumb-item' },
    linkProps: { 'data-slot': 'breadcrumb-page' },
  },
];
const NEXT_TRAIL = [
  { label: 'Admin', href: '#admin' },
  { label: 'Members', href: '#members' },
  { label: 'Nordic Timber Oy', href: '#nordic' },
  { label: 'Invoices' },
];

/* 99: review rows keep the 16px box with a 40 × 32 area around it. */
export const CheckboxHitArea: StoryObj = {
  render: () => {
    const [on, setOn] = React.useState(false);
    return (
      <div style={{ padding: 32 }}>
        <Aura.Checkbox label="Approve M-101" hideLabel hitArea={{ x: 12, y: 8 }} checked={on} onChange={setOn} />
        <p data-testid="state">{on ? 'Approved' : 'Not approved'}</p>
      </div>
    );
  },
};

/* 100: the pay sheet's compact actions, 32px on a desktop and 44px on a phone. */
export const TouchHeight: StoryObj = {
  render: () => (
    <Aura.Stack direction="row" gap={3}>
      <Aura.Button size="sm" touchHeight variant="secondary">
        Pay ฿12,400.00
      </Aura.Button>
      <Aura.Button size="sm" variant="secondary">
        Not touch
      </Aura.Button>
      <Aura.IconButton icon={<IconEllipsis />} label="More actions" touchHeight />
      <Aura.Button href="#invoice" size="sm" touchHeight variant="ghost">
        View invoice
      </Aura.Button>
    </Aura.Stack>
  ),
};
