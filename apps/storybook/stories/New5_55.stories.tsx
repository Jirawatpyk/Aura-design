import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.55 Chamber-OS 167', parameters: { layout: 'fullscreen' } };
export default meta;

/* #167: small (`size="sm"`) Buttons in a bulk bar, with no touchHeight. On a touch screen at any width they are 44px,
 * as touchHeight would make them; with a mouse from 640px, 32px. */
export const BulkBar: StoryObj = {
  render: function Render() {
    const [sel, setSel] = React.useState(3);
    return (
      <Aura.AuraProvider density="compact">
        <div data-testid="bar" style={{ padding: 16 }}>
          <Aura.ActionBar
            position="container"
            label="Bulk actions"
            selected={sel}
            onClearSelection={() => setSel(0)}
            start={
              <Aura.Button size="sm" variant="ghost">
                Select all 120
              </Aura.Button>
            }
          >
            <Aura.Button size="sm" variant="secondary">
              Export
            </Aura.Button>
            <Aura.Button size="sm">Send reminder</Aura.Button>
          </Aura.ActionBar>
        </div>
      </Aura.AuraProvider>
    );
  },
};

const foot = (
  <>
    <Aura.Button size="sm" variant="secondary">
      Cancel
    </Aura.Button>
    <Aura.Button size="sm">Approve</Aura.Button>
  </>
);

export const DialogFooter: StoryObj = {
  render: () => (
    <Aura.AuraProvider density="compact">
      <Aura.Dialog open onClose={() => {}} title="Approve the e-blast?" footer={foot}>
        <p>It goes to 1,204 members on 24 Oct.</p>
      </Aura.Dialog>
    </Aura.AuraProvider>
  ),
};

export const DrawerFooter: StoryObj = {
  render: () => (
    <Aura.AuraProvider density="compact">
      <Aura.Drawer open onClose={() => {}} title="Renewal" footer={foot}>
        <p>Plan Gold, renews 1 Nov.</p>
      </Aura.Drawer>
    </Aura.AuraProvider>
  ),
};
