import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.57 Chamber-OS 170' };
export default meta;

/* #170: a titled Alert with a role is named by its title (aria-labelledby). A passed aria-label wins; no title, or
 * role="none", leaves it unnamed. The erased banner takes focus, as Chamber-OS does after an erase. */
export const NamedAlerts: StoryObj = {
  render: function Render() {
    const banner = React.useRef<HTMLDivElement>(null);
    return (
      <div style={{ display: 'grid', gap: 12, maxWidth: 560 }}>
        <Aura.Alert ref={banner} tabIndex={-1} tone="danger" role="note" title="Personal data erased on 22 Oct 2026">
          Contact details and notes were removed.
        </Aura.Alert>
        <Aura.Button size="sm" variant="secondary" data-testid="focus" onClick={() => banner.current?.focus()}>
          Focus the banner
        </Aura.Button>
        <Aura.Alert tone="warning" title="Renewal overdue">
          Invoice INV-2041 is 14 days late.
        </Aura.Alert>
        <Aura.Alert tone="success" title="Saved">
          The member record is up to date.
        </Aura.Alert>
        <Aura.Alert tone="info" role="note" title="Shown to staff" aria-label="Staff note">
          Only staff see this.
        </Aura.Alert>
        <Aura.Alert tone="info" role="note" data-testid="untitled">
          No title here.
        </Aura.Alert>
        <Aura.Alert tone="info" role="none" title="Decoration" data-testid="none">
          Not a named notice.
        </Aura.Alert>
      </div>
    );
  },
};
