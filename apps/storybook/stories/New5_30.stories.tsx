import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.30' };
export default meta;

const PRESETS = [
  { label: 'Last 7 days', range: { start: '2026-09-12', end: '2026-09-18' } },
  { label: 'Last 30 days', range: { start: '2026-08-20', end: '2026-09-18' } },
  { label: 'This month', range: { start: '2026-09-01', end: '2026-09-30' } },
  { label: 'Last year', range: { start: '2025-01-01', end: '2025-12-31' } },
];

/* 128 (Chamber-OS addendum 31): the change-request queue's filters — status, then a "Submitted" date range. */
export const FilterDates: StoryObj = {
  render: () => {
    const [q, setQ] = React.useState('');
    const [log, setLog] = React.useState<string[]>([]);
    const [range, setRange] = React.useState<{ start: string | null; end: string | null }>({ start: null, end: null });
    return (
      <div style={{ display: 'grid', gap: 16 }}>
        <Aura.FilterBar label="Request filters" search={q} onSearchChange={setQ} searchLabel="Search requests">
          <Aura.FilterSelect
            label="Status"
            allLabel="All"
            options={[
              { value: 'all', label: 'All statuses' },
              { value: 'open', label: 'Open' },
            ]}
            defaultValue="all"
          />
          <Aura.FilterDateRange
            label="Submitted"
            presets={PRESETS}
            min="2026-01-01"
            today="2026-09-18"
            value={range}
            onChange={(r) => {
              setRange(r);
              setLog((l) => l.concat((r.start || '-') + '/' + (r.end || '-')));
            }}
          />
        </Aura.FilterBar>
        <ol data-testid="log">
          {log.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ol>
        <Aura.AuraProvider locale="th">
          <Aura.FilterDateRange
            label="วันที่ส่ง"
            today="2026-09-18"
            defaultValue={{ start: '2026-09-25', end: '2026-10-03' }}
          />
        </Aura.AuraProvider>
      </div>
    );
  },
};
