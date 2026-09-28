import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.10' };
export default meta;

/* 72 (Chamber-OS addendum 10): payment-method tabs in the segmented look, full width, with every Tabs behaviour. */
export const SegmentedTabs: StoryObj = {
  render: () => {
    const [method, setMethod] = React.useState('card');
    return (
      <div style={{ maxWidth: 420 }}>
        <Aura.Tabs
          label="Payment method"
          variant="segmented"
          fullWidth
          keepMounted
          activation="manual"
          value={method}
          onChange={setMethod}
          tabs={[
            {
              id: 'card',
              label: 'Card',
              tabProps: { 'data-testid': 'seg-card' },
              content: <Aura.TextField label="Card number" data-testid="seg-card-input" />,
            },
            {
              id: 'promptpay',
              label: 'PromptPay',
              tabProps: { 'data-testid': 'seg-promptpay' },
              content: <p className="aura-text-body">Scan the QR code with your banking app.</p>,
            },
          ]}
        />
      </div>
    );
  },
};

/* 72: six tabs on a phone — the track scrolls, the page doesn't, labels stay whole. */
export const ManySegmentedTabs: StoryObj = {
  render: () => (
    <Aura.Stack gap={4}>
      {[false, true].map((full) => (
        <Aura.Tabs
          key={String(full)}
          label={full ? 'Sections (full width)' : 'Sections'}
          variant="segmented"
          fullWidth={full}
          tabs={['Overview', 'Invoices', 'Payments', 'Credit notes', 'Members', 'Settings'].map((l) => ({
            id: l,
            label: l,
            content: l,
          }))}
        />
      ))}
    </Aura.Stack>
  ),
};

/* 73: a disabled item stays reachable and says why; a menu whose only item is disabled still takes focus. */
export const DisabledMenuItems: StoryObj = {
  render: () => {
    const [log, setLog] = React.useState<string[]>([]);
    const add = (s: string) => () => setLog((l) => [...l, s]);
    return (
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <Aura.DropdownMenu
          label="Invoice actions"
          trigger={<Aura.Button variant="secondary">Invoice actions</Aura.Button>}
          items={[
            { label: 'Download PDF', icon: 'download', onSelect: add('download') },
            {
              label: 'Email me a copy',
              icon: 'mail',
              disabled: true,
              disabledReason: 'Again in 5 min',
              onSelect: add('email'),
            },
            { label: 'View payments', onSelect: add('payments') },
          ]}
        />
        <Aura.DropdownMenu
          label="Resend"
          trigger={<Aura.Button variant="secondary">Resend</Aura.Button>}
          items={[{ label: 'Email me a copy', disabled: true, onSelect: add('only') }]}
        />
        <p className="aura-text-body" data-testid="menu-log">
          {log.join(',') || 'none'}
        </p>
      </div>
    );
  },
};

/* 5.10.1: a switch that is locked on still reads as on; a Tag with rich children names its remove button; a nav
 * item flags a fault with a toned Badge. */
export const LockedSwitchRichTagNavBadge: StoryObj = {
  render: () => (
    <Aura.Stack gap={5} style={{ maxWidth: 520 }}>
      <Aura.Stack gap={3}>
        <Aura.Switch
          label="Two-factor sign-in"
          description="Required for admins"
          checked
          disabled
          data-testid="sw-on"
        />
        <Aura.Switch label="Sign-in alerts" checked={false} disabled />
        <Aura.Switch label="Weekly digest" defaultChecked />
      </Aura.Stack>
      <Aura.Stack direction="row" gap={2}>
        <Aura.Tag onRemove={() => {}}>
          <strong>Acme</strong> AB
        </Aura.Tag>
        <Aura.Tag onRemove={() => {}} removeLabel="Remove filter: status">
          <span>Status: Paid</span>
        </Aura.Tag>
      </Aura.Stack>
      <div style={{ display: 'flex', height: 200 }}>
        <Aura.SideNav
          defaultValue="devices"
          items={[
            { id: 'devices', label: 'Devices', icon: 'server', count: 12 },
            {
              id: 'faults',
              label: 'Faults',
              icon: 'triangle-alert',
              badge: <Aura.Badge tone="danger">Fault</Aura.Badge>,
            },
            { id: 'updates', label: 'Updates', icon: 'download', badge: <Aura.Badge tone="warning">3</Aura.Badge> },
          ]}
        />
      </div>
    </Aura.Stack>
  ),
};
