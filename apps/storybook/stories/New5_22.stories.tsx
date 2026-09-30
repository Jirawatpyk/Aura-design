import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { IconEllipsis, IconMail } from '@aura/react/icons';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.22' };
export default meta;

type Renewal = { id: string; member: string; due: string; plan: string; fee: string };
const RENEWALS: Renewal[] = [
  {
    id: 'M-201',
    member: 'Kiruna Mining Services (Thailand)',
    due: 'Renews in 30d',
    plan: 'Corporate',
    fee: '฿48,000.00',
  },
  { id: 'M-202', member: 'Acme AB', due: 'Renews in 12d', plan: 'SME', fee: '฿24,000.00' },
];

function Pipeline(props: { footer?: boolean }) {
  const [sel, setSel] = React.useState<Array<string | number>>([]);
  const [log, setLog] = React.useState('');
  return (
    <>
      <Aura.DataTable<Renewal>
        label="Renewals"
        rows={RENEWALS}
        rowKey="id"
        rowHeight="auto"
        selectable
        selected={sel}
        onSelectionChange={setSel}
        rowSelectLabel={(r) => 'Select ' + r.member}
        stackBelow={640}
        columns={[
          { key: 'member', label: 'MEMBER', card: 'title' },
          {
            key: 'due',
            label: 'RENEWAL',
            width: 150,
            card: 'pill',
            render: (r) => <Aura.StatusPill tone="warning">{r.due}</Aura.StatusPill>,
          },
          { key: 'plan', label: 'PLAN', width: 120 },
          { key: 'fee', label: 'FEE', width: 130, align: 'end' },
          {
            key: 'actions',
            label: '',
            actions: true,
            width: 220,
            card: props.footer ? 'footer' : undefined,
            render: (r) => (
              <>
                <Aura.Button
                  size="sm"
                  variant="secondary"
                  icon={<IconMail />}
                  onClick={() => setLog('Reminder: ' + r.member)}
                >
                  Send reminder
                </Aura.Button>
                <Aura.IconButton icon={<IconEllipsis />} label={'More for ' + r.member} size="sm" />
              </>
            ),
          },
        ]}
      />
      <p data-testid={props.footer ? 'log' : 'log-default'}>{log || 'No reminder sent'}</p>
    </>
  );
}

/* 118, 119 (Chamber-OS addendum 22): the renewal pipeline — the actions as the card's last row, full titles. */
export const RenewalCards: StoryObj = {
  render: () => (
    <Aura.Stack gap={6}>
      <div data-testid="footer">
        <Pipeline footer />
      </div>
      <div data-testid="default">
        <Pipeline />
      </div>
    </Aura.Stack>
  ),
};
