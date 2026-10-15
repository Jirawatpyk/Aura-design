import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.43 Chamber-OS 148' };
export default meta;

const KIND = ['All activity', 'Payments', 'Membership', 'Events'];
const WHO = ['Anyone', 'Staff', 'Member'];

/* #148: the activity timeline's bar has filters but no search. Below 640px its Filters button takes the whole row
 * (label centred); a bar with a search keeps the button beside it. */
export const NoSearch: StoryObj = {
  render: function Render() {
    const [kind, setKind] = React.useState('Payments');
    const [who, setWho] = React.useState('Anyone');
    const chips =
      kind !== 'All activity' ? [{ id: 'k', label: 'Type: ' + kind, onRemove: () => setKind('All activity') }] : [];
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 32, padding: 16 }}>
        <div data-testid="timeline">
          <Aura.FilterBar collapseBelow="sm" touchHeight filters={chips} onClearAll={() => setKind('All activity')}>
            <Aura.FilterSelect label="Type" allLabel="All" options={KIND} value={kind} onChange={setKind} />
            <Aura.FilterSelect label="By" allLabel="Anyone" options={WHO} value={who} onChange={setWho} />
          </Aura.FilterBar>
        </div>
        <div data-testid="with-search">
          <Aura.FilterBar collapseBelow="sm" touchHeight search="" onSearchChange={() => {}} filters={chips}>
            <Aura.FilterSelect label="Type" allLabel="All" options={KIND} value={kind} onChange={setKind} />
          </Aura.FilterBar>
        </div>
      </div>
    );
  },
};
