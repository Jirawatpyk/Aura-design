import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 4.14' };
export default meta;

const ROWS = Array.from({ length: 400 }, (_, i) => ({
  id: 'INV-' + (1001 + i),
  member: ['Acme AB', 'Nordic Rail', 'Siam Foods', 'Volvo Thai'][i % 4],
  status: ['Paid', 'Draft', 'Overdue'][i % 3],
  amount: (((i * 7919) % 90000) + 1200).toLocaleString('en-US') + ' THB',
}));
const COLS: Aura.DataTableColumn[] = [
  { key: 'id', label: 'INVOICE', width: 120, mono: true, sortable: true },
  { key: 'member', label: 'MEMBER', sortable: true },
  { key: 'status', label: 'STATUS', width: 120, pill: true, tones: { Paid: 'ready', Overdue: 'blocked' } },
  { key: 'amount', label: 'AMOUNT', width: 150, align: 'end' },
];

/* 9: AuraProvider density="compact" — 36px fields and buttons, 40px rows; a Dialog opened from it is compact too.
 * On touch screens everything goes back to 44px. */
export const Compact: StoryObj = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <Aura.AuraProvider density="compact">
        <Aura.Stack gap={4}>
          <Aura.Stack direction="row" gap={3} align="flex-end" wrap>
            <div style={{ width: 240 }}>
              <Aura.TextField label="Member" placeholder="Search" />
            </div>
            <div style={{ width: 180 }}>
              <Aura.Select label="Tier" options={['All', 'Corporate', 'SME']} />
            </div>
            <Aura.Button icon="plus" onClick={() => setOpen(true)}>
              New invoice
            </Aura.Button>
            <Aura.Button variant="secondary">Export</Aura.Button>
          </Aura.Stack>
          <Aura.DataTable label="Invoices (compact)" rows={ROWS} columns={COLS} height={360} selectable />
          <Aura.Dialog
            open={open}
            onClose={() => setOpen(false)}
            title="New invoice"
            footer={
              <>
                <Aura.Button variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Aura.Button>
                <Aura.Button>Create</Aura.Button>
              </>
            }
          >
            <Aura.TextField label="Amount" suffix="THB" />
          </Aura.Dialog>
        </Aura.Stack>
      </Aura.AuraProvider>
    );
  },
};

/* One table compact on an otherwise comfortable page. */
export const CompactTableOnly: StoryObj = {
  render: () => (
    <Aura.Stack gap={4}>
      <Aura.Button>Comfortable button</Aura.Button>
      <Aura.DataTable label="Compact table" density="compact" rows={ROWS.slice(0, 5)} columns={COLS} />
    </Aura.Stack>
  ),
};
