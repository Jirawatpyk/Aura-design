import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.54 Chamber-OS 166', parameters: { layout: 'fullscreen' } };
export default meta;

/* #166: a compact page's save bars. Below 640px every Button in an ActionBar — actions and `start` — is at least 44px
 * with no touchHeight; from 640px they keep the density's height. The bulk bar already passing touchHeight is the same. */
/* …and the PageHeader actionsBarBelow bar (ActionBar's edge strip) the same, IconButton included. */
export const HeaderBar: StoryObj<{ withMenu: boolean }> = {
  args: { withMenu: true },
  render: (a) => (
    <Aura.AuraProvider density="compact">
      <div style={{ padding: 16, minHeight: 900 }}>
        <Aura.PageHeader
          data-testid="header"
          title="Invoice SC-2026-900001"
          actionsBarBelow="sm"
          actionsStatus="Total 10,700.00 THB"
          actions={
            a.withMenu ? (
              <>
                <Aura.Button variant="secondary">Issue credit note…</Aura.Button>
                <Aura.Button size="sm">Record payment</Aura.Button>
                <Aura.IconButton icon="ellipsis" label="More actions" />
              </>
            ) : (
              <>
                <Aura.Button variant="secondary">Issue credit note…</Aura.Button>
                <Aura.Button size="sm">Record payment</Aura.Button>
              </>
            )
          }
        />
      </div>
    </Aura.AuraProvider>
  ),
};

export const BarButtons: StoryObj = {
  render: function Render() {
    const [sel, setSel] = React.useState(2);
    return (
      <Aura.AuraProvider density="compact">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 24, padding: 16 }}>
          <div data-testid="wizard">
            <Aura.ActionBar
              position="container"
              status="Step 2 of 3"
              start={<Aura.Button variant="ghost">Cancel</Aura.Button>}
            >
              <Aura.Button variant="secondary">Back</Aura.Button>
              <Aura.Button variant="secondary" size="sm">
                Save draft
              </Aura.Button>
              <Aura.Button>Next</Aura.Button>
              <Aura.IconButton icon="ellipsis" label="More actions" />
            </Aura.ActionBar>
          </div>
          {/* a field in a bar keeps its own size: its suffix IconButton isn't a bar button */}
          <div data-testid="field-bar">
            <Aura.ActionBar position="container" status="Filter">
              <Aura.PasswordField label="PIN" defaultValue="1234" />
              <Aura.Button>Apply</Aura.Button>
            </Aura.ActionBar>
          </div>
          <div data-testid="bulk">
            <Aura.ActionBar
              position="container"
              label="Bulk actions"
              selected={sel}
              onClearSelection={() => setSel(0)}
              touchHeight
            >
              <Aura.Button size="sm" variant="secondary" touchHeight>
                Export
              </Aura.Button>
              <Aura.Button size="sm" touchHeight>
                Send reminder
              </Aura.Button>
            </Aura.ActionBar>
          </div>
        </div>
      </Aura.AuraProvider>
    );
  },
};
