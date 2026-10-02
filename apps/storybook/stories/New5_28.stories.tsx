import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.26 descriptions' };
export default meta;

/* After 125 (5.26): Accordion, Combobox and Command read a description after the name, not inside it. */
export const DescriptionsNotNames: StoryObj = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ display: 'grid', gap: 24, maxWidth: 420 }}>
        <Aura.Accordion
          items={[
            { id: 'fees', title: 'Fees', description: 'Two unpaid invoices', content: 'Fee details' },
            { id: 'plain', title: 'Contacts', content: 'Contact list' },
          ]}
        />
        <Aura.Combobox
          label="Member"
          options={[
            { value: 'acme', label: 'Acme AB', description: 'Stockholm · Corporate' },
            { value: 'nord', label: 'Nordic Timber Oy', description: 'Helsinki · SME' },
          ]}
        />
        <Aura.Button onClick={() => setOpen(true)}>Open commands</Aura.Button>
        <Aura.Command
          open={open}
          onOpenChange={setOpen}
          items={[
            { id: 'inv', label: 'New invoice', description: 'Bill a member', shortcut: 'N I' },
            { id: 'mem', label: 'Members', description: 'Member list', shortcut: 'G M' },
            { id: 'plain', label: 'Settings' },
          ]}
        />
      </div>
    );
  },
};
