import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.24' };
export default meta;

/* 123 (Chamber-OS addendum 26): touchHeight on a tablet — the escalation queue's row actions and bulk bar. */
export const TouchTablet: StoryObj = {
  render: () => {
    const [n, setN] = React.useState(2);
    return (
      <Aura.Card>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Aura.Button size="sm" touchHeight>
            Done
          </Aura.Button>
          <Aura.IconButton icon="ellipsis" label="More for T-12" touchHeight />
          <Aura.Button size="sm" variant="secondary">
            Compact
          </Aura.Button>
          <Aura.IconButton icon="ellipsis" label="More, compact" />
        </div>
        <Aura.ActionBar
          position="container"
          label="Bulk actions"
          selected={n}
          onClearSelection={() => setN(0)}
          touchHeight
        >
          <Aura.Button size="sm" touchHeight>
            Escalate
          </Aura.Button>
        </Aura.ActionBar>
      </Aura.Card>
    );
  },
};
