import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.42 Chamber-OS 146' };
export default meta;

const STATUS = ['All statuses', 'Active', 'Lapsed', 'Pending'];
const TIER = ['All tiers', 'Corporate', 'SME', 'Individual'];
type Range = { start: string | null; end: string | null };

/* #146: the Members bar. Below 640px the filters fold into a "Filters (n)" button beside the search; the chips,
 * Clear all and the count stay on the page. In the sheet every control is labelled and 44px, and changes apply at
 * once. From 640px up it is today's bar. */
export const CollapsedFilters: StoryObj = {
  render: function Render() {
    const [q, setQ] = React.useState('');
    const [status, setStatus] = React.useState('Active');
    const [tier, setTier] = React.useState('All tiers');
    const [when, setWhen] = React.useState<Range>({ start: null, end: null });
    const [mine, setMine] = React.useState(false);
    const [plan, setPlan] = React.useState('Any plan');
    const chips = [
      status !== 'All statuses' && { id: 's', label: 'Status: ' + status, onRemove: () => setStatus('All statuses') },
      tier !== 'All tiers' && { id: 't', label: 'Tier: ' + tier, onRemove: () => setTier('All tiers') },
      when.start && { id: 'w', label: 'Submitted: set', onRemove: () => setWhen({ start: null, end: null }) },
      mine && { id: 'm', label: 'Assigned to me', onRemove: () => setMine(false) },
    ].filter(Boolean) as { id: string; label: string; onRemove: () => void }[];
    return (
      <Aura.AuraProvider density="compact">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 32, padding: 16 }}>
          <div data-testid="members">
            <Aura.FilterBar
              collapseBelow="sm"
              touchHeight
              search={q}
              onSearchChange={setQ}
              searchLabel="Search members"
              filters={chips}
              onClearAll={() => {
                setQ('');
                setStatus('All statuses');
                setTier('All tiers');
                setWhen({ start: null, end: null });
                setMine(false);
              }}
              resultCount={chips.length ? 42 : 312}
            >
              <Aura.FilterSelect label="Status" allLabel="All" options={STATUS} value={status} onChange={setStatus} />
              <Aura.FilterSelect label="Tier" allLabel="All" options={TIER} value={tier} onChange={setTier} />
              <Aura.FilterDateRange label="Submitted" today="2026-10-14" value={when} onChange={setWhen} />
              <Aura.Tag selected={mine} onClick={() => setMine(!mine)}>
                Assigned to me
              </Aura.Tag>
            </Aura.FilterBar>
          </div>
          {/* md, with an override count and an action; the next bar has no children, so no button. */}
          <div data-testid="md">
            <Aura.FilterBar
              collapseBelow="md"
              search=""
              onSearchChange={() => {}}
              filterCount={3}
              actions={<Aura.Button>Export</Aura.Button>}
            >
              <Aura.Select
                label="Plan"
                options={['Any plan', 'Gold', 'Silver']}
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
              />
            </Aura.FilterBar>
          </div>
          <div data-testid="search-only">
            <Aura.FilterBar
              collapseBelow="sm"
              search=""
              onSearchChange={() => {}}
              searchLabel="Search the erasure log"
            />
          </div>
          <div data-testid="plain">
            <Aura.FilterBar search="" onSearchChange={() => {}}>
              <Aura.FilterSelect label="Status" allLabel="All" options={STATUS} />
            </Aura.FilterBar>
          </div>
        </div>
      </Aura.AuraProvider>
    );
  },
};
