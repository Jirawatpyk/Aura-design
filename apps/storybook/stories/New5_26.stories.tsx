import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.26' };
export default meta;

/* 125 (Chamber-OS addendum 28): an option's hint is its description, not part of its name. */
export const ChoiceDescriptions: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 24, maxWidth: 420 }}>
      <Aura.RadioGroup
        label="What is this invoice for?"
        defaultValue="membership"
        options={[
          { value: 'membership', label: 'Membership', description: 'Annual membership fee for a member.' },
          { value: 'event', label: 'Event fee', description: 'A ticket or sponsorship for one event.' },
        ]}
      />
      <Aura.RadioGroup
        label="Payment"
        orientation="horizontal"
        options={[
          { value: 'paid_now', label: 'Paid now' },
          { value: 'bill_first', label: 'Bill first', description: 'Needs a tax ID', disabled: true },
        ]}
      />
      <Aura.RadioGroup
        label="ใบแจ้งหนี้นี้สำหรับ"
        options={[{ value: 'm', label: 'ค่าสมาชิก', description: 'ค่าสมาชิกรายปีของสมาชิก' }]}
      />
      <Aura.Checkbox description="Sent with the next invoice run.">Email the member</Aura.Checkbox>
    </div>
  ),
};
