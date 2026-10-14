import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.40 Chamber-OS 145' };
export default meta;

/* #145: AURA's type follows the browser's default font size (Settings → Font size). At the default 16px nothing
 * changes; at 32px the text below doubles and the page still fits a 390px screen. */
export const DefaultFontSize: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 24, padding: 16, maxWidth: 640 }}>
      <div data-testid="card">
        <Aura.Card title="Membership" description="Renews on 1 January 2027. Invoices go to the billing contact.">
          <p className="aura-text-body" style={{ margin: 0 }}>
            Corporate plan · 12 seats
          </p>
        </Aura.Card>
      </div>
      <div data-testid="switch">
        <Aura.Switch label="Email reminders" description="Seven days before an invoice is due." defaultChecked />
      </div>
      <div data-testid="table">
        <Aura.Table caption="Invoices">
          <Aura.THead>
            <Aura.Tr>
              <Aura.Th>Invoice</Aura.Th>
              <Aura.Th align="end">Amount</Aura.Th>
            </Aura.Tr>
          </Aura.THead>
          <Aura.TBody>
            <Aura.Tr>
              <Aura.Td>INV-2026-0142</Aura.Td>
              <Aura.Td align="end">12,400 SEK</Aura.Td>
            </Aura.Tr>
            <Aura.Tr>
              <Aura.Td>INV-2026-0143</Aura.Td>
              <Aura.Td align="end">3,100 SEK</Aura.Td>
            </Aura.Tr>
          </Aura.TBody>
        </Aura.Table>
      </div>
      <div data-testid="controls" style={{ display: 'grid', gap: 12 }}>
        <Aura.TextField label="Company" defaultValue="Nordic Timber Oy" hint="As registered" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <Aura.Button>Save</Aura.Button>
          <Aura.StatusPill tone="ready">Paid</Aura.StatusPill>
          <Aura.Badge>3</Aura.Badge>
          <Aura.Tag>Corporate</Aura.Tag>
        </div>
        <Aura.Tabs
          label="Sections"
          tabs={[
            { id: 'a', label: 'Overview', count: 2, content: 'Overview' },
            { id: 'b', label: 'Invoices', content: 'Invoices' },
          ]}
        />
      </div>
    </div>
  ),
};
