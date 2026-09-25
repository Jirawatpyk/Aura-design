import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 4.20' };
export default meta;

/* 48: a plain static table — invoice line items, Thai over English in one cell, right-aligned money, a totals foot. */
const lines = [
  {
    th: 'ค่าบำรุงสมาชิกรายปี (ระดับ Gold)',
    en: 'Annual membership fee (Gold tier)',
    qty: 1,
    unit: '85,000.00',
    amount: '85,000.00',
  },
  {
    th: 'ค่าลงทะเบียนงานสัมมนา Nordic Business Day',
    en: 'Nordic Business Day registration',
    qty: 3,
    unit: '5,000.00',
    amount: '15,000.00',
  },
];
export const InvoiceLineItems: StoryObj = {
  render: () => (
    <Aura.Stack gap={5} style={{ maxWidth: 760 }}>
      <Aura.Table caption="Invoice INV-2026-0141 — line items">
        <Aura.THead>
          <Aura.Tr>
            <Aura.Th>#</Aura.Th>
            <Aura.Th>DESCRIPTION</Aura.Th>
            <Aura.Th numeric>QTY</Aura.Th>
            <Aura.Th numeric>UNIT PRICE</Aura.Th>
            <Aura.Th numeric>AMOUNT (THB)</Aura.Th>
          </Aura.Tr>
        </Aura.THead>
        <Aura.TBody>
          {lines.map((l, i) => (
            <Aura.Tr key={i}>
              <Aura.Td mono>{i + 1}</Aura.Td>
              <Aura.Td>
                <div lang="th">{l.th}</div>
                <div className="aura-text-caption" style={{ color: 'var(--aura-fg-secondary)' }}>
                  {l.en}
                </div>
              </Aura.Td>
              <Aura.Td numeric>{l.qty}</Aura.Td>
              <Aura.Td numeric>{l.unit}</Aura.Td>
              <Aura.Td numeric>{l.amount}</Aura.Td>
            </Aura.Tr>
          ))}
        </Aura.TBody>
        <Aura.TFoot>
          <Aura.Tr>
            <Aura.Th scope="row" colSpan={4}>
              Subtotal
            </Aura.Th>
            <Aura.Td numeric>100,000.00</Aura.Td>
          </Aura.Tr>
          <Aura.Tr>
            <Aura.Th scope="row" colSpan={4}>
              VAT 7%
            </Aura.Th>
            <Aura.Td numeric>7,000.00</Aura.Td>
          </Aura.Tr>
          <Aura.Tr>
            <Aura.Th scope="row" colSpan={4}>
              Total
            </Aura.Th>
            <Aura.Td numeric>107,000.00</Aura.Td>
          </Aura.Tr>
        </Aura.TFoot>
      </Aura.Table>
      <Aura.Separator />
      <Aura.Stack direction="row" gap={3} align="center">
        <Aura.Button variant="ghost" size="sm">
          Download PDF
        </Aura.Button>
        <Aura.Separator orientation="vertical" />
        <Aura.Button variant="ghost" size="sm">
          Send by email
        </Aura.Button>
      </Aura.Stack>
      <Aura.Separator decorative={false} spacing={4} />
      <p className="aura-text-body">Payment terms: 30 days.</p>
    </Aura.Stack>
  ),
};

/* 49: side="left" / "right", with the flip when clipped. */
const invoices = ['INV-2026-0141', 'INV-2026-0142', 'INV-2026-0143'].map((id, i) => ({
  id,
  member: ['Acme AB', 'Nordic Rail', 'Siam Foods'][i],
  total: ['107,000.00', '13,375.00', '8,560.00'][i],
}));
export const TooltipSides: StoryObj = {
  render: () => (
    <Aura.Stack gap={6}>
      <Aura.DataTable
        label="Invoices"
        rows={invoices}
        columns={[
          { key: 'id', label: 'INVOICE', width: 160, mono: true },
          { key: 'member', label: 'MEMBER' },
          { key: 'total', label: 'TOTAL', width: 140, align: 'end' },
          {
            key: 'act',
            label: '',
            width: 64,
            actions: true,
            render: (r) => (
              <Aura.Tooltip content={'Download ' + r.id + ' as PDF'} side="right">
                <Aura.IconButton icon="download" label={'Download ' + r.id} />
              </Aura.Tooltip>
            ),
          },
        ]}
      />
      <Aura.Stack direction="row" gap={3} justify="space-between">
        <Aura.Tooltip content="Opens on the left" side="left">
          <Aura.Button variant="secondary">side="left" at the left edge</Aura.Button>
        </Aura.Tooltip>
        <Aura.Tooltip content="Opens on the right" side="right">
          <Aura.Button variant="secondary">side="right" at the right edge</Aura.Button>
        </Aura.Tooltip>
      </Aura.Stack>
      <div style={{ height: 260, display: 'flex' }}>
        <Aura.SideNav
          collapsed
          label="Rail"
          value="inv"
          items={[
            { id: 'home', label: 'Dashboard', icon: 'layout-dashboard' },
            { id: 'inv', label: 'Invoices', icon: 'file-text' },
            { id: 'mem', label: 'Members and their long names', icon: 'users' },
          ]}
        />
      </div>
    </Aura.Stack>
  ),
};

/* 50: one markup. Resize the canvas: cards below 700px, the grid without MEMBER from 700, with it from 900. */
const register = Array.from({ length: 6 }, (_, i) => ({
  id: 'INV-' + (2001 + i),
  member: ['Acme AB', 'Nordic Rail', 'Siam Foods'][i % 3],
  status: ['Paid', 'Draft', 'Overdue'][i % 3],
  amount: (1200 + i * 350).toLocaleString('en-US') + ' THB',
}));
export const OneMarkupTable: StoryObj = {
  render: () => (
    <Aura.DataTable
      label="Register"
      stackBelow={700}
      selectable
      rows={register}
      columns={[
        { key: 'id', label: 'INVOICE', width: 140, mono: true },
        { key: 'member', label: 'MEMBER', width: 260, hideBelow: 900 },
        { key: 'status', label: 'STATUS', width: 120, pill: true, tones: { Paid: 'ready', Overdue: 'blocked' } },
        { key: 'amount', label: 'AMOUNT', align: 'end' },
      ]}
    />
  ),
};
