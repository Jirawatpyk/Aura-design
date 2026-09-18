import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/Overlays' };
export default meta;

export const DrawerStory: StoryObj = {
  name: 'Drawer',
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [size, setSize] = React.useState<'sm' | 'md' | 'lg'>('md');
    return (
      <div style={{ display: 'flex', gap: 12 }}>
        {(['sm', 'md', 'lg'] as const).map((s) => <Aura.Button key={s} variant="secondary" onClick={() => { setSize(s); setOpen(true); }}>Open {s}</Aura.Button>)}
        <Aura.Drawer open={open} onClose={() => setOpen(false)} size={size} title="BK-1042" description="Deep clean · 3 ชม."
          footer={<><Aura.Button variant="secondary" onClick={() => setOpen(false)}>Close</Aura.Button><Aura.Button icon="pencil">Edit</Aura.Button></>}>
          <Aura.Stack gap={5}>
            <Aura.TextField label="Customer" defaultValue="คุณสมชาย ใจดี" />
            <Aura.DatePicker label="วันที่" defaultValue="2026-09-18" />
            <Aura.Combobox label="แม่บ้าน" options={['สมศรี ใจดี', 'มาลี ทองคำ']} />
          </Aura.Stack>
        </Aura.Drawer>
      </div>
    );
  },
};

export const DropdownMenuStory: StoryObj = {
  name: 'DropdownMenu',
  render: () => {
    const [last, setLast] = React.useState('—');
    const items = ['View details', 'Edit booking', 'Copy ID'].map((label) => ({ label, onSelect: () => setLast(label) }));
    return (
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <Aura.DropdownMenu label="Actions for BK-1042" items={[...items, { separator: true }, { label: 'Cancel booking', icon: 'ban', onSelect: () => setLast('Cancel booking') }]}
          trigger={<Aura.IconButton icon="ellipsis" label="Actions for BK-1042" />} />
        <Aura.DropdownMenu label="Export" items={[{ label: 'CSV', icon: 'download', onSelect: () => setLast('CSV') }]}
          trigger={<Aura.Button variant="secondary" iconRight="chevron-down">Export</Aura.Button>} />
        <span data-testid="last">Last: {last}</span>
      </div>
    );
  },
};
