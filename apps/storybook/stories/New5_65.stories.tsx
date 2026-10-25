import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { IconCheck, IconExternalLink, IconPencil, IconPlus, IconX } from '@aura/react/icons';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.65 Chamber-OS 180' };
export default meta;

/* #180: the E-Blast editor toolbar — ghost IconButton toggles; Bold is on where the caret sits. `pressed` sets
 * aria-pressed; an aria-pressed passed by hand draws the same. Outline toggles too. */
export const Toggles: StoryObj = {
  render: function Render() {
    const [bold, setBold] = React.useState(true);
    return (
      <div style={{ display: 'grid', gap: 16 }}>
        <div role="toolbar" aria-label="Formatting" data-testid="toolbar" style={{ display: 'flex', gap: 4 }}>
          <Aura.IconButton
            data-testid="bold"
            icon={<IconPencil />}
            label="Bold"
            pressed={bold}
            onClick={() => setBold(!bold)}
          />
          <Aura.IconButton data-testid="italic" icon={<IconX />} label="Italic" pressed={false} />
          <Aura.IconButton data-testid="aria" icon={<IconExternalLink />} label="Link" aria-pressed="true" />
          <Aura.IconButton data-testid="plain" icon={<IconPlus />} label="Insert" />
        </div>
        <div data-testid="pw" style={{ maxWidth: 280 }}>
          <Aura.PasswordField label="Password" defaultValue="secret" />
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <Aura.IconButton data-testid="outline-on" variant="outline" icon={<IconCheck />} label="Quote" pressed />
          <Aura.IconButton
            data-testid="outline-off"
            variant="outline"
            icon={<IconCheck />}
            label="Code"
            pressed={false}
          />
        </div>
      </div>
    );
  },
};
