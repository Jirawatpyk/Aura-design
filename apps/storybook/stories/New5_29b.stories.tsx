import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.29' };
export default meta;

type Upgrade = { id: string; member: string; from: string; to: string; reason: string };
const UPGRADES: Upgrade[] = [
  { id: 'M-301', member: 'Nordic Timber Oy', from: 'SME', to: 'Corporate', reason: 'Turnover above threshold' },
  { id: 'M-302', member: 'Acme AB', from: 'Start-up', to: 'SME', reason: 'Staff above 10' },
];

/* 134 (Chamber-OS addendum 37): the tier upgrade queue loading — skeleton rows as tall as the real ones, with the
 * card labels, two bars for the two-line reason and a touch-height bar where Accept goes (skeletonTouch, as the
 * buttons have touchHeight). `plain` is the same table with compact buttons and no skeletonTouch. */
function Upgrades(props: { loading?: boolean; label: string; plain?: boolean }) {
  const touch = !props.plain;
  return (
    <Aura.DataTable<Upgrade>
      label={props.label}
      rows={props.loading ? [] : UPGRADES}
      loading={props.loading}
      skeletonRows={2}
      rowKey="id"
      rowHeight="auto"
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
          skeletonLines: 2,
          render: (r) => (
            <>
              <div>{r.reason}</div>
              <div className="aura-text-caption">Turnover ฿142M · met 14 Sep</div>
            </>
          ),
        },
        {
          key: 'accept',
          label: '',
          width: 120,
          card: 'footer',
          skeletonTouch: touch,
          render: (r) => (
            <Aura.Button size="sm" touchHeight={touch}>
              Accept {r.id}
            </Aura.Button>
          ),
        },
        {
          key: 'more',
          label: '',
          width: 56,
          actions: true,
          skeletonTouch: touch,
          render: (r) => <Aura.IconButton icon="ellipsis" label={'More for ' + r.id} touchHeight={touch} />,
        },
      ]}
    />
  );
}

export const LoadingRows: StoryObj = {
  render: () => {
    const [loading, setLoading] = React.useState(true);
    return (
      <Aura.Stack gap={6}>
        <Aura.Button size="sm" variant="secondary" onClick={() => setLoading(!loading)}>
          Toggle loading
        </Aura.Button>
        <div data-testid="toggle">
          <Upgrades label="Tier upgrades" loading={loading} />
        </div>
        <div data-testid="skeleton">
          <Upgrades label="Tier upgrades (loading)" loading />
        </div>
        <div data-testid="real">
          <Upgrades label="Tier upgrades (loaded)" />
        </div>
        <div data-testid="plain-skeleton">
          <Upgrades label="Compact actions (loading)" loading plain />
        </div>
        <div data-testid="plain-real">
          <Upgrades label="Compact actions (loaded)" plain />
        </div>
        <div data-testid="amounts">
          <Aura.DataTable<{ id: string }>
            label="Amounts (loading)"
            rows={[]}
            loading
            skeletonRows={1}
            rowKey="id"
            rowHeight="auto"
            columns={[
              { key: 'id', label: 'INVOICE' },
              { key: 'amt', label: 'AMOUNT', width: 160, align: 'end', skeletonLines: 2 },
              { key: 'st', label: 'STATUS', width: 120, pill: true, skeletonLines: 2 },
            ]}
          />
        </div>
      </Aura.Stack>
    );
  },
};
