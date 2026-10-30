import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.78 visual audit set 2' };
export default meta;

const TABS = ['Overview', 'Invoices', 'Payments', 'Members', 'Events', 'Settings'].map((t) => ({
  id: t.toLowerCase(),
  label: t,
  content: <p>{t}</p>,
}));

/* Item 24: a tab list wider than its box fades the end with more tabs (both ends once scrolled; mirrored in RTL). */
export const TabsOverflow: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 24, maxWidth: 300 }}>
      <div data-testid="ltr">
        <Aura.Tabs label="Member" tabs={TABS} />
      </div>
      <div data-testid="rtl" dir="rtl">
        <Aura.Tabs label="Member (RTL)" tabs={TABS} />
      </div>
      <div data-testid="fits">
        <Aura.Tabs label="Short" tabs={TABS.slice(0, 2)} />
      </div>
    </div>
  ),
};

/* Item 9 with long Swedish labels: labels too long to share the row take a row each; nothing leaves the screen. */
export const EdgeLongLabels: StoryObj = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div lang="sv" style={{ padding: 16 }}>
      <p>Medlemsregister</p>
      <Aura.ActionBar edgeBelow="sm" status="3 medlemmar valda">
        <Aura.Button variant="secondary">Skicka påminnelse till alla medlemmar</Aura.Button>
        <Aura.Button>Spara ändringar</Aura.Button>
      </Aura.ActionBar>
    </div>
  ),
};

/* Item 22: a document number longer than a line still breaks (no sideways scroll); item 11: a header whose actions are
 * the bottom strip keeps pill buttons there. */
export const LongNumberAndStrip: StoryObj = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ padding: 16 }}>
      <Aura.PageHeader
        title="Faktura SC-2026-900001-ABCDEFGH"
        actionsBarBelow="sm"
        actionsFullWidthBelow="sm"
        actionsStatus="Att betala 12 400 kr"
        actions={
          <>
            <Aura.Button variant="secondary">Faktura PDF</Aura.Button>
            <Aura.Button>Betala nu</Aura.Button>
          </>
        }
      />
    </div>
  ),
};
