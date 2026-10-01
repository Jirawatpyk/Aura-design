import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.23' };
export default meta;

type Upgrade = { id: string; member: string; from: string; to: string; reason: string };
const UPGRADES: Upgrade[] = [
  {
    id: 'M-301',
    member: 'Nordic Timber Oy',
    from: 'SME',
    to: 'Corporate',
    reason: 'Turnover above threshold',
  },
  { id: 'M-302', member: 'Acme AB', from: 'Start-up', to: 'SME', reason: 'Staff above 10' },
];

/* 120 (Chamber-OS addendum 23): the tier upgrade queue — the reason and its evidence across the card. */
function Upgrades(props: { auto?: boolean }) {
  return (
    <Aura.DataTable<Upgrade>
      label={props.auto ? 'Tier upgrades (auto rows)' : 'Tier upgrades'}
      rows={UPGRADES}
      rowKey="id"
      rowHeight={props.auto ? 'auto' : undefined}
      stackBelow={640}
      columns={[
        { key: 'member', label: 'MEMBER', card: 'title' },
        { key: 'from', label: 'FROM', width: 110 },
        { key: 'to', label: 'TO', width: 110 },
        {
          key: 'reason',
          label: 'REASON',
          width: 320,
          card: 'wide',
          render: (r) => (
            <>
              <div>{r.reason}</div>
              <div className="aura-text-caption">
                Declared turnover ฿142,000,000 · threshold met 14 Sep 2026 after the annual return was filed
              </div>
            </>
          ),
        },
      ]}
    />
  );
}
export const WideField: StoryObj = {
  render: () => (
    <Aura.Stack gap={6}>
      <div data-testid="default">
        <Upgrades />
      </div>
      <div data-testid="auto">
        <Upgrades auto />
      </div>
    </Aura.Stack>
  ),
};

/* 121 (Chamber-OS addendum 24): the renewals section tabs — the active underline at its full 2px. */
export const TabsUnderline: StoryObj = {
  render: () => {
    const [v, setV] = React.useState('pipeline');
    return (
      <div style={{ maxWidth: 520 }}>
        <Aura.Tabs
          label="Renewals"
          value={v}
          onChange={setV}
          tabs={[
            { id: 'pipeline', label: 'Pipeline', content: <p>Renewals due.</p> },
            { id: 'upgrades', label: 'Tier upgrades', content: <p>Upgrades to review.</p> },
            { id: 'history', label: 'History', content: <p>Past renewals.</p> },
          ]}
        />
      </div>
    );
  },
};

/* 122 (Chamber-OS addendum 25): a bulk bar whose buttons and Clear are all 44px on a phone. */
export const BulkTouch: StoryObj = {
  render: () => {
    const [n, setN] = React.useState(3);
    return (
      <Aura.Card>
        <p>{n} members selected</p>
        <Aura.ActionBar
          position="container"
          label="Bulk actions"
          selected={n}
          onClearSelection={() => setN(0)}
          touchHeight
        >
          <Aura.Button size="sm" variant="secondary" touchHeight>
            Send reminder
          </Aura.Button>
          <Aura.Button size="sm" touchHeight>
            Mark paid
          </Aura.Button>
        </Aura.ActionBar>
        <Aura.Button size="sm" variant="ghost" onClick={() => setN(3)}>
          Select three
        </Aura.Button>
      </Aura.Card>
    );
  },
};
