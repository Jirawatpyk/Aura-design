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

/* 5.77 (#194 follow-up): a confirmation whose first focus is the footer's Cancel opens at the top on a short screen,
 * so the title and the summary of what is being confirmed are what the person sees first. */
export const ConfirmOpensAtTop: StoryObj = {
  render: () => (
    <Aura.Dialog
      open
      onClose={() => {}}
      role="alertdialog"
      title="Refund ฿ 12,500 to Nordic Foods AB?"
      description="The refund goes back to the card used for invoice INV-2026-000184. It can't be undone once the bank has it. การคืนเงินจะกลับไปที่บัตรเดิม และยกเลิกไม่ได้เมื่อธนาคารรับเรื่องแล้ว"
      footer={
        <>
          <Aura.Button data-testid="cancel" data-autofocus variant="secondary">
            Cancel
          </Aura.Button>
          <Aura.Button data-testid="refund">Refund ฿ 12,500</Aura.Button>
        </>
      }
    >
      <dl
        data-testid="summary"
        style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px', margin: 0 }}
      >
        <dt>Member</dt>
        <dd style={{ margin: 0 }}>Nordic Foods AB</dd>
        <dt>Invoice</dt>
        <dd style={{ margin: 0 }}>INV-2026-000184</dd>
        <dt>Paid</dt>
        <dd style={{ margin: 0 }}>12 Oct 2026, Visa •• 4242</dd>
        <dt>Refund</dt>
        <dd style={{ margin: 0 }}>฿ 12,500 (full)</dd>
      </dl>
    </Aura.Dialog>
  ),
};

/* 5.77: a long confirmation with no body, focus falling on the footer's first button (no data-autofocus). On a short
 * screen it opens at the top; above 30rem, where the panel can't scroll, Cancel stays where the browser shows it. */
export const LongConfirmNoBody: StoryObj = {
  render: () => (
    <Aura.Dialog
      open
      onClose={() => {}}
      role="alertdialog"
      title="Cancel the membership of Nordic Foods AB?"
      description={
        'The membership ends today. Open invoices stay open and are still due; paid invoices are not refunded. ' +
        'The member loses access to the portal, member rates and the directory listing at once. Their contacts ' +
        'stop receiving newsletters and event invitations. You can renew the membership later, but the joining ' +
        'date restarts. สมาชิกภาพจะสิ้นสุดวันนี้ ใบแจ้งหนี้ที่ค้างอยู่ยังต้องชำระ และจะไม่มีการคืนเงินใบที่ชำระแล้ว ' +
        'สมาชิกจะเข้าพอร์ทัลไม่ได้ทันที และผู้ติดต่อจะไม่ได้รับจดหมายข่าวอีก ต่ออายุภายหลังได้ แต่วันที่เข้าร่วมจะเริ่มใหม่ ' +
        'Medlemskapet upphör i dag. Obetalda fakturor förfaller fortfarande och betalda återbetalas inte.'
      }
      footer={
        <>
          <Aura.Button data-testid="cancel" variant="secondary">
            Keep membership
          </Aura.Button>
          <Aura.Button data-testid="end">End membership</Aura.Button>
        </>
      }
    />
  ),
};
