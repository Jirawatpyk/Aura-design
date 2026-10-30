import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.76 Chamber-OS 194', parameters: { layout: 'fullscreen' } };
export default meta;

const FIELDS = [
  'Member',
  'Invoice no.',
  'Issue date',
  'Due date',
  'Amount',
  'VAT',
  'Discount',
  'Reference',
  'Contact email',
  'Note',
];

/* #194: a long form in a Dialog with a footer. On a screen 30rem tall or less the dialog scrolls as one box, the
 * footer at the end; above that the footer stays fixed under a scrolling body. */
export const ShortScreen: StoryObj = {
  render: () => (
    <Aura.Dialog
      open
      onClose={() => {}}
      title="Issue invoice"
      description="The invoice goes to the member's billing contact by email and appears in their portal. คุณสามารถแก้ไขใบแจ้งหนี้ได้จนกว่าสมาชิกจะชำระเงิน หลังจากนั้นต้องออกใบลดหนี้แทน"
      footer={
        <>
          <Aura.Button data-testid="cancel" variant="secondary">
            Cancel
          </Aura.Button>
          <Aura.Button data-testid="issue">Issue invoice</Aura.Button>
        </>
      }
    >
      <div style={{ display: 'grid', gap: 12 }}>
        {FIELDS.map((f) => (
          <Aura.TextField key={f} label={f} data-field={f} />
        ))}
        <pre data-testid="wide" style={{ margin: 0 }}>
          https://portal.example.com/invoices/2026/INV-2026-000184?token=0f9c3b2a7e6d5c4b3a291807f6e5d4c3b2a1908f7e6d5c4b
        </pre>
      </div>
    </Aura.Dialog>
  ),
};
