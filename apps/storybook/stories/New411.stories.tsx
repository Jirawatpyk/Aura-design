import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 4.11' };
export default meta;

/* Chamber-OS addendum 18–21: touch targets and phone text size. Open on a phone (or with touch emulation). */
export const TouchAndPhones: StoryObj = {
  render: () => {
    const [on, setOn] = React.useState(false);
    return (
      <div style={{ maxWidth: 360, display: 'grid', gap: 24 }}>
        <Aura.TextField label="Member name" defaultValue="Acme AB" />
        <Aura.Stack direction="row" gap={2} align="center">
          <Aura.IconButton icon="copy" label="Copy" />
          <Aura.IconButton icon="eye" label="Show password" />
          <Aura.IconButton icon="x" label="Close" />
        </Aura.Stack>
        <Aura.RadioGroup label="Language" options={['English', 'ไทย', 'Svenska']} defaultValue="English" />
        <Aura.Checkbox>Show in the member directory</Aura.Checkbox>
        <Aura.Switch label="Email me about renewals" checked={on} onChange={setOn} />
        <Aura.Button fullWidth variant="secondary" icon="eye">Förhandsgranska som mottagarna ser det</Aura.Button>
        <Aura.Button fullWidth>Save</Aura.Button>
      </div>
    );
  },
};

/* 22–23: every status pill has a dark pair; progress tracks show their edge at 3:1. */
export const PillsAndTracks: StoryObj = {
  render: () => (
    <Aura.Stack gap={6}>
      <Aura.DataTable
        label="Invoices"
        rows={[
          { id: 'INV-1', member: 'Acme AB', status: 'Lapsed' },
          { id: 'INV-2', member: 'Nordic Rail', status: 'Awaiting review' },
          { id: 'INV-3', member: 'Siam Foods', status: 'Sent' },
          { id: 'INV-4', member: 'Volvo Thai', status: 'Overdue' },
        ]}
        columns={[
          { key: 'id', label: 'INVOICE', width: 120, mono: true },
          { key: 'member', label: 'MEMBER' },
          { key: 'status', label: 'STATUS', width: 160, pill: true, tones: { Lapsed: 'neutral', 'Awaiting review': 'progress', Sent: 'ready', Overdue: 'blocked' } },
        ]}
      />
      <div style={{ maxWidth: 360, display: 'grid', gap: 16 }}>
        <Aura.Progress label="Storage" value={12} max={100} showValue />
        <Aura.Progress label="Seats" value={3} max={10} valueLabel="3 of 10" showValue tone="success" />
      </div>
    </Aura.Stack>
  ),
};

/* 24: no provider → English, Gregorian; th → พ.ศ. display, the value stays a Gregorian ISO date. */
export const DateDefaults: StoryObj = {
  render: () => {
    const [v, setV] = React.useState<string | null>('2026-09-18');
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
        <Aura.DatePicker label="Registration date" />
        <Aura.AuraProvider locale="th">
          <Aura.DatePicker label="วันที่สมัคร" value={v} onChange={setV} hint={'value: ' + String(v)} />
        </Aura.AuraProvider>
        <Aura.AuraProvider locale="sv">
          <Aura.DatePicker label="Registreringsdatum" />
        </Aura.AuraProvider>
      </div>
    );
  },
};
