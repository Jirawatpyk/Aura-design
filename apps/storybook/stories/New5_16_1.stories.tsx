import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.16.1' };
export default meta;

/* 109 (Chamber-OS addendum 17): an erase dialog with an unfilled Select beside a text field and a read-only field.
 * The Select's field is white like the text field's; only the read-only field takes the disabled ground. */
export const SelectGround: StoryObj = {
  render: () => {
    const [reason, setReason] = React.useState('');
    return (
      <Aura.Dialog open onClose={() => {}} title="Erase member" data-testid="erase">
        <Aura.Stack gap={4}>
          <Aura.Select
            label="Reason"
            placeholder="Choose a reason"
            options={['Duplicate', 'Requested by member', 'Left the chamber']}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <Aura.TextField label="Note" placeholder="Optional note" />
          <Aura.TextField label="Member no." value="M-101" readOnly />
          <Aura.Textarea label="Erase log" value="Requested 28 Sep 2026" readOnly />
        </Aura.Stack>
      </Aura.Dialog>
    );
  },
};
