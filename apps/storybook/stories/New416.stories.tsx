import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 4.16' };
export default meta;

/* Ghost (no fill or edge until hover) and size="sm" (32px) — toolbars, table rows, card footers. */
export const GhostAndSmall: StoryObj = {
  render: () => (
    <Aura.Stack gap={5}>
      <Aura.Stack direction="row" gap={2} align="center" wrap>
        <Aura.Button>Save</Aura.Button>
        <Aura.Button variant="secondary">Preview</Aura.Button>
        <Aura.Button variant="ghost">Cancel</Aura.Button>
        <Aura.Button variant="ghost" icon="download">
          Export
        </Aura.Button>
      </Aura.Stack>
      <Aura.Stack direction="row" gap={2} align="center" wrap>
        <Aura.Button size="sm" icon="plus">
          Add row
        </Aura.Button>
        <Aura.Button size="sm" variant="secondary">
          Filter
        </Aura.Button>
        <Aura.Button size="sm" variant="ghost" icon="pencil">
          Edit
        </Aura.Button>
        <Aura.Button size="sm" variant="danger-secondary" icon="trash-2">
          Remove
        </Aura.Button>
        <Aura.Button size="sm" variant="ghost" href="#invoices" iconRight="arrow-right">
          All invoices
        </Aura.Button>
        <Aura.Button size="sm" loading>
          Saving
        </Aura.Button>
      </Aura.Stack>
    </Aura.Stack>
  ),
};

const ROWS = Array.from({ length: 5 }, (_, i) => ({
  id: 'INV-' + (1001 + i),
  member: ['Acme AB', 'Nordic Rail', 'Siam Foods', 'Volvo Thai', 'Ericsson TH'][i],
  status: ['Paid', 'Draft', 'Overdue', 'Paid', 'Draft'][i],
}));
/* Small ghost buttons inside a compact table keep the 40px row. */
export const SmallButtonsInCompactTable: StoryObj = {
  render: () => (
    <Aura.DataTable
      label="Invoices"
      density="compact"
      rows={ROWS}
      columns={[
        { key: 'id', label: 'INVOICE', width: 120, mono: true },
        { key: 'member', label: 'MEMBER', width: 180 },
        { key: 'status', label: 'STATUS', width: 112, pill: true, tones: { Paid: 'ready', Overdue: 'blocked' } },
        {
          key: 'act',
          label: '',
          actions: true,
          render: (r: { id: string }) => (
            <Aura.Button size="sm" variant="ghost" icon="eye" aria-label={'Open ' + r.id}>
              Open
            </Aura.Button>
          ),
        },
      ]}
    />
  ),
};
