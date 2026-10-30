import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.73 Chamber-OS 192 follow-up', parameters: { layout: 'fullscreen' } };
export default meta;

/* Tab panels hidden with visibility: hidden (they keep their box): only the shown panel's edge bar sets the page's
 * clearance. Tier B's bar mounts last, so before 5.73 its hidden strip won. */
export const VisibilityTabs: StoryObj = {
  render: function Render() {
    const [tab, setTab] = React.useState<'a' | 'b'>('a');
    const panel = (k: 'a' | 'b'): React.CSSProperties => ({ visibility: tab === k ? 'visible' : 'hidden' });
    return (
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Aura.Button data-testid="show-a" variant="secondary" onClick={() => setTab('a')}>
            Tier A
          </Aura.Button>
          <Aura.Button data-testid="show-b" variant="secondary" onClick={() => setTab('b')}>
            Tier B
          </Aura.Button>
        </div>
        <section style={panel('a')}>
          <Aura.ActionBar
            edgeBelow="sm"
            label="Save tier A"
            status="Tier A: 3 reminders changed · the first goes out 14 days before renewal, the last on the day"
          >
            <Aura.Button>Save tier A</Aura.Button>
          </Aura.ActionBar>
        </section>
        <section style={panel('b')}>
          <Aura.ActionBar edgeBelow="sm" label="Save tier B">
            <Aura.Button>Save tier B</Aura.Button>
          </Aura.ActionBar>
        </section>
      </div>
    );
  },
};

/* A single bar under a visibility gate (an anti-flicker wrapper) that lifts with no event: the bar keeps its room. */
export const VisibilityGate: StoryObj = {
  render: function Render() {
    const [open, setOpen] = React.useState(false);
    React.useEffect(() => {
      const t = setTimeout(() => setOpen(true), 400);
      return () => clearTimeout(t);
    }, []);
    return (
      <div data-testid="gate" style={{ padding: 16, visibility: open ? 'visible' : 'hidden' }}>
        <p className="aura-text-body">Renewal schedule</p>
        <Aura.ActionBar edgeBelow="sm" label="Save" status="3 reminders changed">
          <Aura.Button>Save</Aura.Button>
        </Aura.ActionBar>
      </div>
    );
  },
};

/* One PageHeader with actionsBarBelow per tab panel (display: none): the shown one's bar sets the clearance. */
export const PageHeaderTabs: StoryObj = {
  render: function Render() {
    const [tab, setTab] = React.useState<'a' | 'b' | 'none'>('a');
    const header = (k: 'a' | 'b', status: string) => (
      <section data-testid={'panel-' + k} style={{ display: tab === k ? 'block' : 'none' }}>
        <Aura.PageHeader
          data-testid={'header-' + k}
          title={'Invoice ' + k.toUpperCase()}
          actionsBarBelow="sm"
          actionsStatus={status}
          actions={<Aura.Button touchHeight>{'Pay ' + k.toUpperCase()}</Aura.Button>}
        />
      </section>
    );
    return (
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Aura.Button data-testid="show-a" variant="secondary" onClick={() => setTab('a')}>
            A
          </Aura.Button>
          <Aura.Button data-testid="show-b" variant="secondary" onClick={() => setTab('b')}>
            B
          </Aura.Button>
          <Aura.Button data-testid="show-none" variant="secondary" onClick={() => setTab('none')}>
            Neither
          </Aura.Button>
        </div>
        {header('a', 'Amount due ฿10,700.00 · due 22 Oct 2026 · a long line that wraps onto a second line on a phone')}
        {header('b', 'Paid')}
      </div>
    );
  },
};
