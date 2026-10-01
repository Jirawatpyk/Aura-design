import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.25' };
export default meta;

/* 124 (Chamber-OS addendum 27): the escalation queue's filter chips — Status and Assignment, tapped with a finger. */
export const FilterChipsTouch: StoryObj = {
  render: () => {
    const [status, setStatus] = React.useState('Open');
    const [who, setWho] = React.useState('All');
    const row = (label: string, opts: string[], value: string, set: (v: string) => void) => (
      <div role="group" aria-label={label} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {opts.map((o) => (
          <Aura.Tag key={o} selected={value === o} onClick={() => set(o)} touchHeight>
            {o}
          </Aura.Tag>
        ))}
      </div>
    );
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        {row('Status', ['Open', 'Done', 'Skipped'], status, setStatus)}
        {row('Assignment', ['All', 'Mine', 'Unassigned'], who, setWho)}
        <div style={{ display: 'flex', gap: 8 }}>
          <Aura.Tag selected={false} onClick={() => {}}>
            Compact chip
          </Aura.Tag>
          <Aura.Tag touchHeight onRemove={() => {}}>
            Acme AB
          </Aura.Tag>
        </div>
      </div>
    );
  },
};
