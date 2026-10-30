import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.68 Chamber-OS 184' };
export default meta;

const CATS = [
  { value: 'corporate', label: 'Corporate' },
  { value: 'partnership', label: 'Partnership' },
];

/* #184: the E-Blast compose form while it submits — the group legends dim like a Field's label. */
export const Disabled: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 24, maxWidth: 420 }}>
      <Aura.TextField label="Subject" defaultValue="October newsletter" disabled />
      <Aura.RadioGroup
        label="Recipients"
        options={['All members', 'Specific membership tier']}
        defaultValue="All members"
        required
        disabled
      />
      <Aura.CheckboxGroup label="Membership categories" options={CATS} defaultValue={['corporate']} required disabled />
      <Aura.CheckboxGroup label="Enabled categories" options={CATS} />
    </div>
  ),
};

function Categories(props: { live?: boolean; testId: string }) {
  const [cats, setCats] = React.useState<string[]>(['corporate']);
  return (
    <div data-testid={props.testId}>
      <Aura.CheckboxGroup
        label={props.live ? 'Membership categories' : 'Categories (not live)'}
        hint="Pick at least one."
        required
        options={CATS}
        value={cats}
        onChange={setCats}
        errorLive={props.live}
        error={cats.length ? undefined : 'Choose at least one membership category.'}
      />
    </div>
  );
}

function Plan() {
  const [v, setV] = React.useState('Monthly');
  return (
    <div data-testid="radio-live">
      <Aura.RadioGroup
        label="Billing"
        options={['Monthly', 'Yearly', 'Lifetime']}
        value={v}
        onChange={setV}
        errorLive
        error={v === 'Lifetime' ? 'Lifetime billing is not offered for this tier.' : undefined}
      />
    </div>
  );
}

function Code() {
  const [v, setV] = React.useState('');
  const bad = /[^a-z0-9]/i.test(v);
  /* a custom control under Field points at the error line itself while there is one */
  return (
    <div data-testid="field-live">
      <Aura.Field
        id="code-live"
        label="Promo code"
        hint="Letters and digits."
        errorLive
        error={bad ? 'Use letters and digits only.' : undefined}
      >
        <div className="aura-input">
          <input
            id="code-live"
            className="aura-input__control"
            aria-describedby={bad ? 'code-live-error' : 'code-live-hint'}
            aria-invalid={bad || undefined}
            value={v}
            onChange={(e) => setV(e.target.value)}
          />
        </div>
      </Aura.Field>
    </div>
  );
}

/* #184: an error shown as the user changes the group — unticking the last box — is announced with `errorLive`. */
export const ErrorLive: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 24, maxWidth: 420 }}>
      <Categories live testId="live" />
      <Categories testId="plain" />
      <Plan />
      <Code />
    </div>
  ),
};
