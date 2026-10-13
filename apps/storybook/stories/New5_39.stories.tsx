import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.39 Chamber-OS 143' };
export default meta;

const STATUS = [
  { id: 'all', label: 'All', count: 48, href: '#all' },
  { id: 'overdue', label: 'Overdue', count: 3, href: '#overdue' },
  { id: 'progress', label: 'In progress', count: 12, href: '#progress' },
  { id: 'done', label: 'Complete', count: 33, href: '#done' },
];
const PANELS = [
  { id: 'a', label: 'Details', icon: 'file-text' as const, content: <Aura.TextField label="Reference" /> },
  { id: 'b', label: 'History', count: 4, content: 'History' },
];

/* #143: the erasure evidence log in compact density — link tabs with counts beside a touchHeight search and button.
 * With touchHeight the tabs are 44px below 640px (or on a coarse pointer) like the search beside them. */
export const TabsTouch: StoryObj = {
  render: () => (
    <Aura.AuraProvider density="compact">
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 32, padding: 16 }}>
        <div data-testid="links" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 12 }}>
          <Aura.Tabs label="Status" tabs={STATUS} value="overdue" touchHeight fullWidth="below-sm" />
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 8, alignItems: 'end' }}>
            <Aura.TextField label="Search" touchHeight />
            <Aura.Button touchHeight>Search</Aura.Button>
          </div>
        </div>
        <div data-testid="buttons">
          <Aura.Tabs label="Record" tabs={PANELS} touchHeight />
        </div>
        <div data-testid="segmented">
          <Aura.Tabs label="View" tabs={PANELS} variant="segmented" touchHeight />
        </div>
        <div data-testid="always">
          <Aura.Tabs label="Always" tabs={STATUS} value="all" touchHeight="always" />
        </div>
        <div data-testid="plain">
          <Aura.Tabs label="Plain" tabs={STATUS} value="all" />
        </div>
      </div>
    </Aura.AuraProvider>
  ),
};

/* Also checked: FilterBar touchHeight reaches FilterDateRange; FilterDateRange takes touchHeight alone too. */
export const DateRangeTouch: StoryObj = {
  render: () => (
    <Aura.AuraProvider density="compact">
      <div style={{ display: 'grid', gap: 24, padding: 16 }}>
        <div data-testid="bar">
          <Aura.FilterBar touchHeight search="" onSearchChange={() => {}} searchLabel="Search the audit log">
            <Aura.FilterDateRange label="When" today="2026-10-13" />
          </Aura.FilterBar>
        </div>
        <div data-testid="alone" style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <Aura.FilterDateRange label="When" today="2026-10-13" touchHeight="always" />
          <Aura.FilterDateRange label="Plain" today="2026-10-13" />
        </div>
      </div>
    </Aura.AuraProvider>
  ),
};
