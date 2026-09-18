import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 4.3' };
export default meta;

export const Stats: StoryObj = {
  render: () => (
    <Aura.Grid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
      <Aura.Stat label="Orders today" icon="calendar" value={18} unit="orders" caption="3 not assigned yet" />
      <Aura.Stat label="Revenue" value="฿31,900" change={{ value: '+12%', direction: 'up', label: 'vs Aug' }} href="#" />
      <Aura.Stat label="Cancellations" icon="ban" value={4} change={{ value: '+2', direction: 'up', tone: 'negative', label: 'vs last week' }} />
      <Aura.Stat label="Response time" icon="clock" loading />
    </Aura.Grid>
  ),
};

export const TimePickerStory: StoryObj = {
  name: 'TimePicker',
  render: () => {
    const [t, setT] = React.useState<string | null>(null);
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 280px))', gap: 24 }}>
        <Aura.TimePicker label="Start time" value={t} onChange={setT} min="08:00" max="18:00" suggest="09:00"
          isTimeDisabled={(x) => x === '12:00' || x === '12:30'} hint={'Value: ' + String(t)} />
        <Aura.TimePicker label="Pick-up" step={15} optional />
      </div>
    );
  },
};

export const FileUploadStory: StoryObj = {
  name: 'FileUpload',
  render: () => {
    const [items, setItems] = React.useState<any[]>([
      { id: 'a', name: 'kitchen-before.jpg', size: 482000, type: 'image/jpeg', status: 'done' },
      { id: 'b', name: 'living-room.jpg', size: 1830000, type: 'image/jpeg', status: 'uploading', progress: 64 },
    ]);
    return (
      <div style={{ maxWidth: 520 }}>
        <Aura.FileUpload label="Job-site photos" optional accept="image/*" multiple maxFiles={3} maxSize={5 * 1024 * 1024} value={items} onChange={setItems} />
        <p data-testid="count">Files: {items.length}</p>
      </div>
    );
  },
};

const rows = Array.from({ length: 6 }, (_, i) => ({ id: 'ORD-' + (1040 + i), name: ['คุณสมชาย ใจดี', 'Anna Lee', 'คุณวิภา รักดี'][i % 3], date: '18 ก.ย. 2569', status: ['Ready', 'In Progress', 'Blocked'][i % 3], owner: 'กมล', amount: '฿1,050' }));
export const TabletTable: StoryObj = {
  name: 'DataTable (hideBelow)',
  render: () => (
    <Aura.DataTable label="Orders" rows={rows} selectable stackBelow={640}
      columns={[{ key: 'id', label: 'ID', width: 104, mono: true }, { key: 'name', label: 'NAME', width: 180 }, { key: 'date', label: 'DATE', width: 150 },
        { key: 'owner', label: 'OWNER', width: 140, hideBelow: 860 }, { key: 'status', label: 'STATUS', width: 120, pill: true }, { key: 'amount', label: 'AMOUNT', width: 96, hideBelow: 800 },
        { key: 'actions', label: '', actions: true, width: 56, render: (r: any) => <Aura.DropdownMenu label={'Actions for ' + r.id} items={[{ label: 'View', icon: 'eye', onSelect: () => {} }]} trigger={<Aura.IconButton icon="ellipsis" label={'Actions for ' + r.id} />} /> }]} />
  ),
};
