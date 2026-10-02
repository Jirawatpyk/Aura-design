import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.30' };
export default meta;

type Row = { id: string; name: string };
const ROWS: Row[] = [
  { id: 'M-101', name: 'Acme AB' },
  { id: 'M-102', name: 'Nordic Timber Oy' },
];

/* 5.30 visual polish (audit Oct 2026): off-white primary in dark, quieter Blocked, visible neutral fills, a header band
 * that isn't a hole in dark, grey disabled fills, caption spacing, buttons in Inter anywhere, Thai sizes. */
export const VisualPolish: StoryObj = {
  render: () => (
    <Aura.Stack gap={6} style={{ maxWidth: 760 }}>
      <Aura.Stack direction="row" gap={2} align="center">
        <Aura.Button>Save</Aura.Button>
        <Aura.Button disabled>Disabled primary</Aura.Button>
        <Aura.Button variant="danger" disabled>
          Disabled danger
        </Aura.Button>
        <Aura.Button variant="creative" disabled>
          Disabled creative
        </Aura.Button>
        <Aura.Button variant="secondary" disabled>
          Disabled secondary
        </Aura.Button>
        <Aura.Button aria-disabled>Gated primary</Aura.Button>
      </Aura.Stack>
      <div data-testid="pills" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Aura.StatusPill tone="neutral">Lapsed</Aura.StatusPill>
        <Aura.StatusPill tone="ready">Paid</Aura.StatusPill>
        <Aura.StatusPill tone="warning">At risk</Aura.StatusPill>
        <Aura.StatusPill tone="blocked">Overdue</Aura.StatusPill>
        <Aura.Badge>12 members</Aura.Badge>
      </div>
      <div data-testid="serif-root" style={{ fontFamily: 'serif' }}>
        <Aura.Button variant="secondary">All hosts</Aura.Button>
      </div>
      <Aura.Table caption="Changes requested">
        <Aura.THead>
          <Aura.Tr>
            <Aura.Th>FIELD</Aura.Th>
            <Aura.Th>VALUE</Aura.Th>
          </Aura.Tr>
        </Aura.THead>
        <Aura.TBody>
          <Aura.Tr>
            <Aura.Td>Tier</Aura.Td>
            <Aura.Td>Corporate</Aura.Td>
          </Aura.Tr>
        </Aura.TBody>
      </Aura.Table>
      <Aura.DataTable<Row>
        label="Members"
        rows={ROWS}
        rowKey="id"
        columns={[
          { key: 'id', label: 'ID', width: 120 },
          { key: 'name', label: 'MEMBER' },
        ]}
      />
      <div lang="th" data-testid="thai">
        <Aura.StatusPill tone="ready">ชำระแล้ว</Aura.StatusPill> <Aura.Badge>สมาชิก 12 ราย</Aura.Badge>{' '}
        <span lang="en" data-testid="en-in-th">
          <Aura.StatusPill tone="ready">Paid</Aura.StatusPill>
        </span>
      </div>
    </Aura.Stack>
  ),
};
