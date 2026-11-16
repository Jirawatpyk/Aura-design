import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';
import { useFilterBarSheet } from '@aura/react';

const meta: Meta = { title: 'AURA/New in 5.91 Chamber-OS 211' };
export default meta;

const STATUS = ['Active', 'Lapsed', 'Pending'];

/* An app's own Clear among the controls: it goes when there is nothing left to clear. `hand` uses the hook to move
 * focus to Done first; the other relies on the sheet catching the lost focus itself. */
function OwnClear(props: { onClear: () => void; hand?: boolean }) {
  const sheet = useFilterBarSheet();
  return (
    <Aura.Button
      variant="ghost"
      data-testid={props.hand ? 'clear-hand' : 'clear-auto'}
      data-in-sheet={String(sheet.inSheet)}
      onClick={() => {
        if (props.hand) sheet.focusDone();
        props.onClear();
      }}
    >
      Clear
    </Aura.Button>
  );
}

export const SheetFocus: StoryObj = {
  render: function Render() {
    const [status, setStatus] = React.useState('Lapsed');
    const [tier, setTier] = React.useState('Gold');
    return (
      <div style={{ padding: 16 }}>
        <Aura.FilterBar collapseBelow="sm" search="" onSearchChange={() => {}} searchLabel="Search members">
          <Aura.FilterSelect label="Status" allLabel="All" options={STATUS} value={status} onChange={setStatus} />
          {status !== 'All' ? <OwnClear hand onClear={() => setStatus('All')} /> : null}
          <Aura.FilterSelect label="Tier" allLabel="All" options={['Gold', 'Silver']} value={tier} onChange={setTier} />
          {tier !== 'All' ? <OwnClear onClear={() => setTier('All')} /> : null}
        </Aura.FilterBar>
      </div>
    );
  },
};
