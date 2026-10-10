import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.36 DxT Monitor 15-16' };
export default meta;

const ROWS = [
  { id: 'INC-1042', site: 'api.example.co.th', status: 'Down', duration: '1h 12m' },
  { id: 'INC-1041', site: 'checkout.example.co.th', status: 'Problem', duration: '8m' },
  { id: 'INC-1040', site: 'billing.example.co.th', status: 'Resolved', duration: '2d 4h' },
];
const COLS = [
  { key: 'id', label: 'INCIDENT', width: 120, mono: true },
  {
    key: 'site',
    label: 'SITE',
    render: (r: (typeof ROWS)[number]) => <a href={'#site-' + r.site}>{r.site}</a>,
  },
  { key: 'status', label: 'STATUS', width: 120, pill: true },
  { key: 'duration', label: 'DURATION', width: 120, align: 'end' as const, sortable: true },
];

/* Request 15: a focused link or button in a table cell keeps its whole focus ring (the cell clips its text, not the
 * ring). Request 16: DataTable columns already take align: 'end' — header and cells together. */
export const Cells: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 24, padding: 24, maxWidth: 820 }}>
      <div data-testid="incidents">
        <Aura.DataTable label="Incidents" rows={ROWS} columns={COLS} getRowHref={(r) => '#' + r.id} />
      </div>
      <div data-testid="auto">
        <Aura.DataTable
          label="Incidents (auto rows)"
          rows={ROWS}
          columns={COLS}
          rowHeight="auto"
          getRowHref={(r) => '#' + r.id}
        />
      </div>
      <div data-testid="compact">
        <Aura.AuraProvider density="compact">
          <Aura.DataTable label="Incidents (compact)" rows={ROWS} columns={COLS} getRowHref={(r) => '#' + r.id} />
        </Aura.AuraProvider>
      </div>
      <div data-testid="select">
        <Aura.DataTable
          label="Incidents (selectable)"
          rows={ROWS}
          columns={COLS}
          selectable
          getRowHref={(r) => '#' + r.id}
        />
      </div>
      {/* Narrow: scrolls sideways under a pinned first column. */}
      <div data-testid="pinned" style={{ maxWidth: 420 }}>
        <Aura.DataTable
          label="Incidents (pinned)"
          rows={ROWS}
          columns={[
            { key: 'id', label: 'INCIDENT', width: 120, mono: true, pinned: true },
            { key: 'status', label: 'STATUS', width: 200, pill: true },
            {
              key: 'site',
              label: 'SITE',
              width: 260,
              render: (r: (typeof ROWS)[number]) => <a href={'#p-' + r.site}>{r.site}</a>,
            },
            { key: 'duration', label: 'DURATION', width: 160, align: 'end' as const },
          ]}
        />
      </div>
      <div data-testid="long" style={{ maxWidth: 420 }}>
        <Aura.DataTable
          label="Long names"
          rows={[
            {
              id: 'INC-1',
              site: 'a-very-long-customer-domain-name-that-does-not-fit.example.co.th',
              status: 'Down',
              duration: '3m',
            },
          ]}
          columns={COLS}
        />
      </div>
    </div>
  ),
};
