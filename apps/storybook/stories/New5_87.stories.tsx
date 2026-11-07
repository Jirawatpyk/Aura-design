import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';
import type { DataTableColumn } from '@jirawatpyk/aura-react';

const meta: Meta = { title: 'AURA/New in 5.87 Chamber-OS 203-205' };
export default meta;

/* #203: one shape for every full-width button — a lozenge on one line, a rounded box (22px corners) when the label
 * wraps — in a PageHeader's actions, in an Alert, in a Card and in a stacked DataTable card's footer. */
export const FullWidthShapes: StoryObj = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => (
    <div style={{ display: 'grid', gap: 24, maxWidth: 390, padding: 16 }}>
      <Aura.PageHeader
        data-testid="header"
        title="Member"
        actionsFullWidthBelow="sm"
        actions={<Aura.Button data-testid="header-btn">Edit member</Aura.Button>}
      />
      <Aura.PageHeader
        data-testid="header-wrap"
        title="Member"
        actionsFullWidthBelow="sm"
        actions={
          <>
            <Aura.Button data-testid="header-wrap-btn">Send the renewal reminder to every contact</Aura.Button>
            <Aura.IconButton icon="ellipsis" label="More actions" variant="outline" />
          </>
        }
      />
      <Aura.Alert tone="warning" title="Invoice overdue">
        <div style={{ marginTop: 12 }}>
          <Aura.Button data-testid="alert-btn" variant="secondary" fullWidth>
            Send reminder
          </Aura.Button>
        </div>
      </Aura.Alert>
      <Aura.Card title="Renewal">
        <Aura.Button data-testid="card-btn" fullWidth>
          Renew
        </Aura.Button>
        <div style={{ height: 12 }} />
        <Aura.Button data-testid="card-wrap-btn" variant="secondary" fullWidth>
          Renew the membership for another year at the current rate
        </Aura.Button>
      </Aura.Card>
      <Aura.Button data-testid="below-sm-btn" fullWidth="below-sm">
        Save
      </Aura.Button>
      <div data-testid="card-footer">
        <Aura.DataTable
          label="Overdue"
          rows={[{ id: 'INV-1002', amount: '8,900.00 THB' }]}
          rowKey="id"
          stackBelow={640}
          rowHeight="auto"
          columns={[
            { key: 'id', label: 'Invoice' },
            { key: 'amount', label: 'Amount', width: 160 },
            {
              key: 'remind',
              label: 'Remind',
              width: 160,
              card: 'footer',
              render: () => <Aura.Button variant="secondary">Send reminder</Aura.Button>,
            },
          ]}
        />
      </div>
    </div>
  ),
};

/* #203 in a phone sheet: the Dialog's footer buttons take the row and wrap a long label, with the same shape. */
export const DialogFooter: StoryObj = {
  render: () => (
    <Aura.Dialog
      open
      onClose={() => {}}
      title="Cancel membership"
      footer={
        <>
          <Aura.Button data-testid="dlg-keep" variant="secondary">
            Keep
          </Aura.Button>
          <Aura.Button data-testid="dlg-long" variant="danger">
            Cancel the membership and every open invoice
          </Aura.Button>
        </>
      }
    >
      The member keeps access until the end of the period.
    </Aura.Dialog>
  ),
};

const ROWS = [
  { id: 'INV-1001', status: 'Paid', amount: '12,400.00 THB', due: '2026-10-01' },
  { id: 'INV-1002', status: 'Overdue', amount: '8,900.00 THB', due: '2026-10-15' },
  { id: 'INV-1003', status: 'Draft', amount: '4,200.00 THB', due: '2026-11-01' },
];
const COLS: DataTableColumn[] = [
  { key: 'id', label: 'Invoice', card: 'title' },
  { key: 'status', label: 'Status', width: 120, pill: true, card: 'pill' },
  { key: 'amount', label: 'Amount', width: 160, align: 'end' },
  { key: 'due', label: 'Due', width: 120 },
  /* 5.88 (#207): a row action — in the list style it stays inside the row. */
  {
    key: 'act',
    label: 'Actions',
    actions: true,
    width: 64,
    render: (r) => <Aura.IconButton icon="ellipsis" label={'More for ' + r.id} />,
  },
];

/* #204: stackStyle="list" — below stackBelow the rows are one list divided by rules inside the framed Card, with no
 * card per row. Next to it the default (cards) for comparison. */
export const StackedList: StoryObj = {
  render: () => (
    <div style={{ maxWidth: 720, display: 'flow-root' }}>
      <Aura.Card title="Invoices" data-testid="list-card" style={{ marginBottom: 24 }}>
        <Aura.DataTable
          label="Invoices"
          columns={COLS}
          rows={ROWS}
          rowKey="id"
          stackBelow={640}
          stackStyle="list"
          rowHeight="auto"
          bleed
        />
      </Aura.Card>
      <Aura.Card title="Invoices (cards)" data-testid="cards-card" style={{ marginBottom: 24 }}>
        <Aura.DataTable
          label="Invoices (cards)"
          columns={COLS}
          rows={ROWS}
          rowKey="id"
          stackBelow={640}
          rowHeight="auto"
          bleed
        />
      </Aura.Card>
      <Aura.Card title="Paged" data-testid="paged-card">
        <Aura.DataTable
          label="Paged invoices"
          columns={COLS}
          rows={ROWS}
          rowKey="id"
          stackBelow={640}
          stackStyle="list"
          pageSize={2}
          rowHeight="auto"
          bleed
        />
      </Aura.Card>
    </div>
  ),
};

/* #205: while the cards show, the grid's column headers leave the accessibility tree (each field reads its own label);
 * a column with an empty label has a header with no name — never its key. */
const IMPORTS = [
  { id: 'imp-1', file: 'members-2026-10.csv', outcome: 'Imported', summary: '412 rows, 3 skipped' },
  { id: 'imp-2', file: 'members-2026-11.csv', outcome: 'Failed', summary: 'Missing column: email' },
];
const IMPORT_COLS: DataTableColumn[] = [
  { key: 'file', label: 'File', card: 'title' },
  { key: 'outcome', label: 'Outcome', width: 120, pill: true, card: 'pill' },
  { key: 'when', label: 'Imported', width: 140, render: () => '2026-11-01' },
  { key: 'cardSummary', label: '', width: 200, card: 'wide', render: (r) => r.summary },
];
export const StackedHeaders: StoryObj = {
  render: () => (
    <div data-testid="imports" style={{ maxWidth: 720 }}>
      <Aura.DataTable
        label="CSV imports"
        columns={IMPORT_COLS}
        rows={IMPORTS}
        rowKey="id"
        stackBelow={640}
        rowHeight="auto"
      />
      <div style={{ height: 24 }} />
      <Aura.DataTable
        label="Selectable imports"
        columns={IMPORT_COLS}
        rows={IMPORTS}
        rowKey="id"
        stackBelow={640}
        rowHeight="auto"
        selectable
      />
    </div>
  ),
};
