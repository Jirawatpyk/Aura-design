import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/Pickers' };
export default meta;

const maids = [
  { value: 'm1', label: 'สมศรี ใจดี', description: 'สุขุมวิท · 4.9★', keywords: ['somsri'] },
  { value: 'm2', label: 'มาลี ทองคำ', description: 'สาทร · 4.8★', keywords: ['malee'] },
  { value: 'm3', label: 'Anna Santos', description: 'สีลม · 4.7★' },
  { value: 'm4', label: 'บุญมี ศรีสุข', description: 'นนทบุรี · 4.9★', keywords: ['boonmee'] },
  { value: 'm5', label: 'จันทร์เพ็ญ แก้วใส', description: 'On leave', disabled: true },
];

export const ComboboxStory: StoryObj = {
  name: 'Combobox',
  render: () => {
    const [v, setV] = React.useState<string | null>(null);
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 320px))', gap: 24 }}>
        <Aura.Combobox label="แม่บ้าน" placeholder="พิมพ์ชื่อ หรือ somsri" options={maids} value={v} onChange={setV} hint={'Value: ' + String(v)} />
        <Aura.Combobox label="Area" options={['Sukhumvit', 'Sathorn', 'Silom']} required error="Choose an area to see available maids." />
      </div>
    );
  },
};

export const ComboboxServer: StoryObj = {
  name: 'Combobox (server search)',
  render: () => {
    const [opts, setOpts] = React.useState(maids);
    const [loading, setLoading] = React.useState(false);
    const t = React.useRef<any>(null);
    return (
      <div style={{ maxWidth: 320 }}>
        <Aura.Combobox label="Customer" options={opts} loading={loading}
          onSearch={(q) => { setLoading(true); clearTimeout(t.current); t.current = setTimeout(() => { setOpts(maids.filter((m) => Aura.comboboxFilter(m, q))); setLoading(false); }, 400); }} />
      </div>
    );
  },
};

export const DatePickerStory: StoryObj = {
  name: 'DatePicker',
  render: () => {
    const [a, setA] = React.useState<string | null>('2026-09-18');
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 320px))', gap: 24 }}>
        <Aura.DatePicker label="วันที่นัด" value={a} onChange={setA} min="2026-09-01" hint={'ISO: ' + String(a)} />
        <Aura.DatePicker label="Due date" locale="en" calendar="gregory" weekStartsOn={1} optional />
        <Aura.DatePicker label="วันเกิด" required error="ใส่วันเกิดเป็น วว/ดด/ปปปป เช่น 05/12/2530" />
        <Aura.DatePicker label="Locked" defaultValue="2026-09-18" disabled />
      </div>
    );
  },
};

export const DateRangePickerStory: StoryObj = {
  name: 'DateRangePicker',
  render: () => {
    const [r, setR] = React.useState({ start: '2026-09-07', end: '2026-09-18' } as { start: string | null; end: string | null });
    return <div style={{ maxWidth: 340 }}><Aura.DateRangePicker label="ช่วงวันที่" value={r} onChange={setR} /></div>;
  },
};

export const CalendarStory: StoryObj = {
  name: 'Calendar',
  render: () => {
    const [a, setA] = React.useState<string | null>('2026-09-18');
    const weekend = (iso: string) => [0, 6].includes(new Date(iso + 'T00:00').getDay());
    return (
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <Aura.Calendar autoFocus={false} start={a} focus={a} onSelect={setA} />
        <Aura.Calendar autoFocus={false} locale="en" calendar="gregory" weekStartsOn={1} start="2026-09-21" focus="2026-09-21" isDateDisabled={weekend} />
      </div>
    );
  },
};
