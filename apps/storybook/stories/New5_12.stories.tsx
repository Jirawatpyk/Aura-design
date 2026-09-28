import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.12' };
export default meta;

const STATUS = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'lapsed', label: 'Lapsed' },
  { value: 'pending', label: 'Pending approval' },
];
const PLAN = [
  { value: 'all', label: 'All plans' },
  { value: 'diamond', label: 'Diamond Partnership' },
  { value: 'gold', label: 'Gold' },
  { value: 'silver', label: 'Silver' },
];
const TYPE = [
  { value: 'all', label: 'All types' },
  { value: 'company', label: 'Company' },
  { value: 'person', label: 'Individual' },
];

function MembersBar({ dir }: { dir?: 'rtl' }) {
  const [status, setStatus] = React.useState('all');
  const [plan, setPlan] = React.useState('all');
  const [type, setType] = React.useState('all');
  const [unpaid, setUnpaid] = React.useState(false);
  const [q, setQ] = React.useState('');
  return (
    /* Storybook pads 24px; a phone page's gutter is 16px. */
    <div dir={dir} style={{ margin: -8 }}>
      <Aura.FilterBar label="Member filters" search={q} onSearchChange={setQ} searchLabel="Search members" searchGrow>
        <Aura.FilterSelect label="Status" allLabel="All" options={STATUS} value={status} onChange={setStatus} />
        <Aura.FilterSelect label="Plan" allLabel="All" options={PLAN} value={plan} onChange={setPlan} />
        <Aura.FilterSelect label="Type" allLabel="All" options={TYPE} value={type} onChange={setType} />
        <Aura.Tag selected={unpaid} onClick={() => setUnpaid(!unpaid)}>
          Unpaid
        </Aura.Tag>
      </Aura.FilterBar>
      <p className="aura-text-body" data-testid="filter-state" style={{ marginTop: 16 }}>
        {[status, plan, type, unpaid ? 'unpaid' : 'any', q || '—'].join(' · ')}
      </p>
    </div>
  );
}

/* 79 (Chamber-OS addendum 12): the members filters as compact triggers — "Status All ▾" — beside a search that
 * fills the row (searchGrow). Pick "Diamond Partnership" under Plan to see a long value wrap to the next row. */
export const FilterSelects: StoryObj = { render: () => <MembersBar /> };

/* The same bar right to left: the chevron and the list follow the reading direction. */
export const FilterSelectsRtl: StoryObj = { render: () => <MembersBar dir="rtl" /> };

/* Select, 5.12: a list wider than its field stays on screen (a narrow field at the right edge) and a right-to-left
 * field gets a right-to-left list aligned to its right edge. */
export const SelectListPlacement: StoryObj = {
  render: () => {
    const long = ['Diamond Partnership (annual, invoiced)', 'Gold', 'Silver'];
    return (
      <Aura.Stack gap={6}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: 140 }}>
            <Aura.Select label="Plan" options={long} data-testid="narrow-ltr" />
          </div>
        </div>
        <div dir="rtl" style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <div style={{ width: 140 }}>
            <Aura.Select label="Plan (RTL)" options={long} data-testid="narrow-rtl" />
          </div>
        </div>
      </Aura.Stack>
    );
  },
};
