import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { IconPlus, IconTrash2, IconUsers, IconHouse, IconFileText, IconSettings } from '@aura/react/icons';
import { th } from '@aura/react/locales/th';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.9' };
export default meta;

/* Icons as components (ready for 6.0): the same <svg> as the name, and only the icons imported are bundled. */
export const IconComponents: StoryObj = {
  render: () => (
    <Aura.Stack gap={4}>
      <Aura.Stack direction="row" gap={3} align="center" wrap>
        <Aura.Button icon={<IconPlus />}>New invoice</Aura.Button>
        <Aura.Button variant="secondary" icon="plus" data-testid="by-name">
          New invoice
        </Aura.Button>
        <Aura.IconButton icon={<IconTrash2 />} tone="danger" label="Delete row" />
        <Aura.Badge icon={<IconUsers />}>12 members</Aura.Badge>
        <IconUsers size="lg" label="Members" />
      </Aura.Stack>
      <div style={{ display: 'flex', height: 220 }}>
        <Aura.SideNav
          defaultValue="home"
          items={[
            { id: 'home', label: 'Home', icon: <IconHouse /> },
            { id: 'inv', label: 'Invoices', icon: <IconFileText />, count: 4 },
            { id: 'set', label: 'Settings', icon: <IconSettings /> },
          ]}
        />
      </div>
    </Aura.Stack>
  ),
};

/* A locale pack: the Thai strings passed to AuraProvider, as 6.0 will need. */
export const LocalePack: StoryObj = {
  render: () => (
    <Aura.AuraProvider locale="th" strings={th}>
      <Aura.Stack gap={4} style={{ maxWidth: 520 }}>
        <Aura.Pagination pageCount={8} defaultPage={3} />
        <Aura.Alert tone="info" onDismiss={() => {}} title="ต่ออายุสมาชิก">
          ใบแจ้งหนี้ฉบับใหม่พร้อมแล้ว
        </Aura.Alert>
      </Aura.Stack>
    </Aura.AuraProvider>
  ),
};

/* 70 (Chamber-OS addendum 9): test ids and attributes on the drawer panel, and a close button that says what it closes. */
export const DrawerAttributes: StoryObj = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div>
        <Aura.Button onClick={() => setOpen(true)}>Pay invoice</Aura.Button>
        <Aura.Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="Pay INV-1042"
          data-testid="pay-sheet-content"
          id="pay-sheet"
          closeLabel="Close payment drawer"
          closeProps={{ 'data-testid': 'pay-sheet-close' }}
        >
          <Aura.TextField label="Name on card" />
        </Aura.Drawer>
      </div>
    );
  },
};

/* 71: a payment-method tablist — panels stay mounted (a card iframe keeps its state), arrows move focus without
 * selecting (selecting starts a payment), and each tab carries its own test id and full name. */
export const PaymentTabs: StoryObj = {
  render: () => {
    const [method, setMethod] = React.useState('card');
    const [changes, setChanges] = React.useState(0);
    return (
      <Aura.Stack gap={3} style={{ maxWidth: 480 }}>
        <Aura.Tabs
          label="Payment method"
          value={method}
          onChange={(id) => {
            setMethod(id);
            setChanges((n) => n + 1);
          }}
          keepMounted
          activation="manual"
          tabs={[
            {
              id: 'card',
              label: 'Card',
              tabProps: { 'aria-label': 'Card — switch payment method', 'data-testid': 'method-card' },
              content: <Aura.TextField label="Card number" data-testid="card-input" />,
            },
            {
              id: 'promptpay',
              label: 'PromptPay',
              tabProps: { 'aria-label': 'PromptPay — switch payment method', 'data-testid': 'method-promptpay' },
              content: <p className="aura-text-body">Scan the QR code with your banking app.</p>,
            },
            {
              id: 'transfer',
              label: 'Bank transfer',
              content: <p className="aura-text-body">Account 123-4-56789-0</p>,
            },
          ]}
        />
        <p className="aura-text-body" data-testid="changes">
          Changes {changes}
        </p>
      </Aura.Stack>
    );
  },
};
