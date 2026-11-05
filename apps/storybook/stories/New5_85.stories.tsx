import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';
import type { DataTableColumn } from '@jirawatpyk/aura-react';

const meta: Meta = { title: 'AURA/New in 5.85 Chamber-OS 198' };
export default meta;

const ROWS = [
  { id: 'INV-1001', member: 'Nordic Foods AB', status: 'Paid', amount: '12,400.00 THB', due: '2026-10-01' },
  { id: 'INV-1002', member: 'Siam Tea Co.', status: 'Overdue', amount: '8,900.00 THB', due: '2026-10-15' },
  { id: 'INV-1003', member: 'Acme AB', status: 'Draft', amount: '4,200.00 THB', due: '2026-11-01' },
];

/* #198: the grid shows the status pill under the invoice number; the phone card wants the number as its title and
 * the pill beside it — two card-only columns (grid: false), and the grid's combined column left out of the card. */
const COLS: DataTableColumn[] = [
  {
    key: 'id',
    label: 'Invoice',
    width: 160,
    card: 'hide',
    render: (r) => (
      <span style={{ display: 'grid', gap: 2, lineHeight: 1.3 }}>
        <span className="aura-mono">{r.id}</span>
        <span>
          <Aura.StatusPill>{r.status}</Aura.StatusPill>
        </span>
      </span>
    ),
  },
  { key: 'member', label: 'Member' },
  { key: 'amount', label: 'Amount', width: 160, align: 'end' },
  { key: 'due', label: 'Due', width: 120 },
  { key: 'cardTitle', label: 'Invoice', grid: false, card: 'title', render: (r) => r.id },
  { key: 'cardStatus', label: 'Status', grid: false, card: 'pill', pill: true, render: (r) => r.status },
];

export const CardOnlyColumns: StoryObj = {
  render: () => (
    <div>
      <div data-testid="invoices" style={{ marginBottom: 24 }}>
        <Aura.DataTable
          label="Member invoices"
          columns={COLS}
          rows={ROWS}
          rowKey="id"
          stackBelow={640}
          rowHeight="auto"
          columnControls
        />
      </div>
      <div data-testid="no-stack">
        <Aura.DataTable label="Without cards" columns={COLS} rows={ROWS} rowKey="id" />
      </div>
    </div>
  ),
};
