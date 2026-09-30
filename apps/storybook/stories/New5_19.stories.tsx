import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { IconLock } from '@aura/react/icons';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.19' };
export default meta;

const TYPES = [
  { value: 'person', label: 'Person' },
  { value: 'company', label: 'Company' },
];

/* 113, 114 (Chamber-OS addendum 20): a prior-year plan's edit form — locked switches and selects stay in the Tab
 * order with their lock note, next to fields that can still change. */
export const LockedPlan: StoryObj = {
  render: () => {
    const [log, setLog] = React.useState<string[]>([]);
    const [data, setData] = React.useState('');
    const [open, setOpen] = React.useState(true);
    const [type, setType] = React.useState('company');
    const note = (s: string) => setLog((l) => l.concat([s]));
    return (
      <div style={{ maxWidth: 420 }}>
        <form
          data-testid="form"
          onSubmit={(e) => {
            e.preventDefault();
            setData(JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))));
          }}
        >
          <Aura.Stack gap={4}>
            <p id="plan-locked-note">Locked: historical plan</p>
            <Aura.TextField label="Annual fee" defaultValue="฿12,000" readOnly icon={<IconLock />} />
            <Aura.Switch
              label="M2M benefits access"
              checked
              readOnly
              icon={<IconLock />}
              aria-describedby="plan-locked-note"
              onChange={() => note('m2m changed')}
            />
            <Aura.Switch
              label="Event discounts"
              description="Members pay the member price."
              readOnly
              icon={<IconLock />}
              aria-describedby="plan-locked-note"
              onChange={() => note('events changed')}
            />
            <Aura.Switch label="Newsletter" checked={open} onChange={setOpen} />
            <Aura.Select
              label="Member type"
              name="memberType"
              defaultValue="company"
              options={TYPES}
              readOnly
              icon={<IconLock />}
              aria-describedby="plan-locked-note"
              onChange={() => note('type changed')}
            />
            <Aura.Select
              label="Billing type"
              name="billingType"
              value={type}
              options={TYPES}
              onChange={(e) => setType(e.target.value)}
            />
            <Aura.Select
              label="Old region"
              name="oldRegion"
              defaultValue="north"
              options={['north', 'south']}
              disabled
            />
            <Aura.Select
              label="Regions"
              name="regions"
              multiple
              defaultValue={['north']}
              options={['north', 'south', 'east']}
              readOnly
              aria-describedby="plan-locked-note"
              onChange={() => note('regions changed')}
            />
            <Aura.Button type="submit" variant="secondary">
              Show form data
            </Aura.Button>
          </Aura.Stack>
        </form>
        <p data-testid="log">{log.join(', ') || 'No change'}</p>
        <pre data-testid="data">{data}</pre>
      </div>
    );
  },
};
