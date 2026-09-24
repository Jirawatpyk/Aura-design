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
export const NumberFields: StoryObj = {
  render: () => {
    const [qty, setQty] = React.useState<number | null>(2);
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 24, maxWidth: 720 }}>
        <Aura.NumberField label="จำนวน" value={qty} onChange={setQty} min={1} max={20} suffix="ชิ้น" hint={'Value: ' + String(qty)} />
        <Aura.NumberField label="ราคาต่อหน่วย" prefix="฿" defaultValue={12500} step={0.01} min={0} />
        <Aura.NumberField label="Discount" suffix="%" defaultValue={10} min={0} max={100} step={5} optional />
        <Aura.NumberField label="Seats" defaultValue={60} max={50} error="Your plan allows up to 50 seats." />
        <Aura.NumberField label="Stock on hand" defaultValue={1250} readOnly hint="Counted by the warehouse." />
        <Aura.NumberField label="Lead time (days)" stepper={false} defaultValue={3} min={0} />
      </div>
    );
  },
};
export const SegmentedControls: StoryObj = {
  render: () => {
    const [view, setView] = React.useState('table');
    return (
      <div style={{ display: 'grid', gap: 24, maxWidth: 480 }}>
        <Aura.SegmentedControl label="ช่วงเวลา" options={[{ value: 'd', label: 'วัน' }, { value: 'w', label: 'สัปดาห์' }, { value: 'm', label: 'เดือน' }]} defaultValue="w" />
        <div data-testid="view-status">View: {view}</div>
        <Aura.SegmentedControl label="View" value={view} onChange={setView} options={[{ value: 'table', label: 'Table', icon: 'columns-3' }, { value: 'cards', label: 'Cards', icon: 'layout-dashboard' }, { value: 'archived', label: 'Archived', disabled: true }]} />
        <Aura.SegmentedControl label="Density" size="sm" options={['Compact', 'Comfortable']} />
        <Aura.SegmentedControl label="Plan" fullWidth options={['Monthly', 'Yearly']} defaultValue="Yearly" />
        <Aura.SegmentedControl label="Align" options={[{ value: 'l', label: 'Align left', icon: 'arrow-left', iconOnly: true }, { value: 'r', label: 'Align right', icon: 'arrow-right', iconOnly: true }]} />
      </div>
    );
  },
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
