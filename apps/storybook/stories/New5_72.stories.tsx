import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.72 Chamber-OS 192', parameters: { layout: 'fullscreen' } };
export default meta;

/* #192: a renewal schedule editor with a save bar per tier tab — only the visible tab's strip sets the page's
 * clearance. The tall bar (two lines of status) is tier A's; tier B's is short. */
export const BarPerTab: StoryObj = {
  render: function Render() {
    const [tab, setTab] = React.useState<'a' | 'b' | 'none'>('a');
    return (
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Aura.Button data-testid="show-a" variant="secondary" onClick={() => setTab('a')}>
            Tier A
          </Aura.Button>
          <Aura.Button data-testid="show-b" variant="secondary" onClick={() => setTab('b')}>
            Tier B
          </Aura.Button>
          <Aura.Button data-testid="show-none" variant="secondary" onClick={() => setTab('none')}>
            Neither
          </Aura.Button>
        </div>
        <section data-testid="panel-a" style={{ display: tab === 'a' ? 'block' : 'none' }}>
          <p className="aura-text-body">Tier A schedule</p>
          <Aura.ActionBar
            edgeBelow="sm"
            label="Save tier A"
            status="Tier A: 3 reminders changed · the first goes out 14 days before renewal, the last on the day"
          >
            <Aura.Button variant="ghost">Discard</Aura.Button>
            <Aura.Button>Save tier A</Aura.Button>
          </Aura.ActionBar>
        </section>
        <section data-testid="panel-b" style={{ display: tab === 'b' ? 'block' : 'none' }}>
          <p className="aura-text-body">Tier B schedule</p>
          <Aura.ActionBar edgeBelow="sm" label="Save tier B">
            <Aura.Button>Save tier B</Aura.Button>
          </Aura.ActionBar>
        </section>
      </div>
    );
  },
};
