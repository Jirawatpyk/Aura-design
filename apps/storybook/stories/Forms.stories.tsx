import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/Forms' };
export default meta;

export const TextFields: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 24, maxWidth: 720 }}>
      <Aura.TextField label="Email address" type="email" icon="mail" placeholder="name@company.co.th" hint="We only use this for sign-in." required />
      <Aura.TextField label="Budget" suffix="THB" defaultValue="120,000" optional />
      <Aura.TextField label="Project key" defaultValue="aura 01" error="Use capital letters and a hyphen, e.g. AURA-01." />
      <Aura.TextField label="Workspace" icon="lock" defaultValue="dxt-solutions" disabled hint="Set by your administrator." />
    </div>
  ),
};
export const SelectAndTextarea: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 24, maxWidth: 480 }}>
      <Aura.Select label="Team" placeholder="Choose a team" options={['Dashboard', 'Marketing', 'Mobile', 'Platform']} />
      <Aura.Textarea label="Release notes" placeholder="What changed, and who needs to know?" hint="Markdown is fine." />
    </div>
  ),
};
export const Choices: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 32, maxWidth: 520 }}>
      <Aura.RadioGroup label="Register" defaultValue="enterprise" options={[
        { value: 'enterprise', label: 'Enterprise', description: 'Product UI, tables, forms.' },
        { value: 'creative', label: 'Creative', description: 'Campaigns and onboarding moments.' }]} />
      <Aura.Switch label="Email me when a token changes" description="Never more than daily." defaultChecked />
      <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
        <Aura.Checkbox checked label="Accept the terms" onChange={() => {}} /> Accept the terms
      </label>
    </div>
  ),
};
