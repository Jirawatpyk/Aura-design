import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.67 Chamber-OS 183' };
export default meta;

const CATS = [
  { value: 'corporate', label: 'Corporate' },
  { value: 'partnership', label: 'Partnership', description: 'Partners and sponsors' },
];

/* A saved value no longer offered ('archived') is kept when another box is ticked. */
function KeepUnknown() {
  const [v, setV] = React.useState<string[]>(['archived', 'corporate']);
  return (
    <div data-testid="keep">
      <Aura.CheckboxGroup label="Saved categories" options={CATS} value={v} onChange={setV} />
      <output data-testid="keep-value">{JSON.stringify(v)}</output>
    </div>
  );
}

/* #183: the E-Blast audience picker's "which membership categories" — a CheckboxGroup beside a RadioGroup, one legend,
 * one hint, one error; values in option order. */
export const Categories: StoryObj = {
  render: function Render() {
    const [cats, setCats] = React.useState<string[]>([]);
    const [tried, setTried] = React.useState(false);
    return (
      <div style={{ display: 'grid', gap: 24, maxWidth: 420 }}>
        <Aura.RadioGroup
          label="Recipients"
          options={['All members', 'Specific membership tier']}
          defaultValue="Specific membership tier"
          required
        />
        <div data-testid="group">
          <Aura.CheckboxGroup
            label="Membership categories"
            hint="Pick at least one."
            required
            options={CATS}
            value={cats}
            onChange={setCats}
            error={tried && !cats.length ? 'Pick at least one membership category.' : undefined}
          />
        </div>
        <output data-testid="value">{JSON.stringify(cats)}</output>
        <Aura.Button data-testid="send" onClick={() => setTried(true)}>
          Send
        </Aura.Button>
        <KeepUnknown />
        <div data-testid="disabled">
          <Aura.CheckboxGroup label="Locked" options={CATS} defaultValue={['corporate']} disabled />
        </div>
        <div data-testid="touch">
          <Aura.CheckboxGroup label="Touch rows" options={CATS} touchHeight="always" orientation="horizontal" />
        </div>
      </div>
    );
  },
};
