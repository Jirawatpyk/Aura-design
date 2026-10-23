import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.58 Chamber-OS 171' };
export default meta;

/* #171: in-page section tabs with touchHeight. Below 640px or on a coarse pointer each tab is at least 44px wide as
 * well as tall, so "Tax" is a 44×44 target; longer tabs keep their width and the gap. The second row (no
 * touchHeight) is the same tabs for comparison. */
const SECTIONS = [
  { id: 'overview', label: 'Overview', href: '#overview' },
  { id: 'contacts', label: 'Contacts', href: '#contacts' },
  { id: 'tax', label: 'Tax', href: '#tax' },
  { id: 'invoices', label: 'Invoices', href: '#invoices' },
];

export const ShortTab: StoryObj = {
  render: () => (
    <Aura.AuraProvider density="compact">
      <div style={{ display: 'grid', gap: 24 }}>
        <div data-testid="touch">
          <Aura.Tabs label="Sections" tabs={SECTIONS} value="overview" current="location" touchHeight />
        </div>
        <div data-testid="seg">
          <Aura.Tabs
            label="Size"
            variant="segmented"
            tabs={[
              { id: 's', label: 'S', content: <p>Small</p> },
              { id: 'm', label: 'M', content: <p>Medium</p> },
            ]}
            touchHeight
          />
        </div>
        <div data-testid="fill-md">
          <Aura.Tabs
            label="Size (full width below md)"
            tabs={[
              { id: 'a', label: 'A', content: <p>Members starting with A</p> },
              { id: 'all', label: 'All members', content: <p>All members</p> },
            ]}
            fullWidth="below-md"
            touchHeight
          />
        </div>
        <div data-testid="plain">
          <Aura.Tabs label="Sections (plain)" tabs={SECTIONS} value="overview" current="location" />
        </div>
      </div>
    </Aura.AuraProvider>
  ),
};
