import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.29' };
export default meta;

type Member = { id: string; name: string; tier: string; status: string };
const MEMBERS: Member[] = [
  { id: 'M-101', name: 'Acme AB', tier: 'Corporate', status: 'Active' },
  { id: 'M-102', name: 'Nordic Timber Oy', tier: 'SME', status: 'Lapsed' },
];
const columns = [
  { key: 'name', label: 'MEMBER' },
  { key: 'tier', label: 'TIER', width: 160 },
  { key: 'status', label: 'STATUS', width: 140 },
];
const Members = (p: { bleed?: boolean; bordered?: boolean }) => (
  <Aura.DataTable<Member>
    label="Members"
    rows={MEMBERS}
    rowKey="id"
    stackBelow={640}
    bleed={p.bleed}
    bordered={p.bordered}
    columns={columns}
  />
);
const Filters = () => (
  <div className="aura-text-caption" data-testid="filters">
    Status All · Tier All
  </div>
);

/* 127 (Chamber-OS addendum 30): a list card — filters with the card's padding, the table edge to edge. */
export const TableBleed: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <Aura.Card flushBelow="sm" data-testid="last">
        <Filters />
        <Members bleed />
      </Aura.Card>
      <Aura.Card data-testid="footer" footer={<Aura.Button size="sm">Export</Aura.Button>}>
        <Filters />
        <Members bleed />
      </Aura.Card>
      <Aura.Card data-testid="static">
        <Filters />
        <Aura.Table caption="Plans" captionHidden bleed stackBelow="md">
          <Aura.THead>
            <Aura.Tr>
              <Aura.Th>PLAN</Aura.Th>
              <Aura.Th>FEE</Aura.Th>
            </Aura.Tr>
          </Aura.THead>
          <Aura.TBody>
            <Aura.Tr>
              <Aura.Td>Corporate</Aura.Td>
              <Aura.Td>฿24,000</Aura.Td>
            </Aura.Tr>
          </Aura.TBody>
        </Aura.Table>
      </Aura.Card>
      <Aura.Card data-testid="wrapped">
        <Filters />
        <div>
          <Aura.Table caption="Wrapped plans" captionHidden bleed stackBelow="md">
            <Aura.TBody>
              <Aura.Tr>
                <Aura.Td>Corporate</Aura.Td>
              </Aura.Tr>
            </Aura.TBody>
          </Aura.Table>
        </div>
      </Aura.Card>
      <div data-testid="outside">
        <Members bleed />
      </div>
      <div data-testid="borderless">
        <Members bordered={false} />
      </div>
    </div>
  ),
};
