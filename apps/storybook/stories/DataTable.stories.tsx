import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const statuses = ['Ready', 'In Progress', 'Blocked', 'To Do', 'Done', 'In Review'];
const owners = ['Jirawat', 'Design', 'Dev', 'QA', 'Data', 'PM'];
const rows = Array.from({ length: 2000 }, (_, i) => ({
  id: 'AURA-' + String(i + 1).padStart(4, '0'),
  name: ['Token pipeline', 'Figma sync', 'A11y check', 'Style Dictionary'][i % 4] + (i > 3 ? ` #${Math.floor(i / 4) + 1}` : ''),
  status: statuses[(i * 7) % statuses.length],
  owner: owners[(i * 5) % owners.length],
  team: ['Dashboard', 'Marketing', 'Mobile', 'Platform'][(i * 3) % 4],
  updated: new Date(Date.UTC(2026, 8, 18) - i * 25200e3).toISOString().slice(0, 10),
}));
const columns = [
  { key: 'id', label: 'ID', width: 112, mono: true, sortable: true, pinned: true },
  { key: 'name', label: 'NAME', width: 208, sortable: true, pinned: true },
  { key: 'status', label: 'STATUS', width: 136, pill: true, sortable: true },
  { key: 'owner', label: 'OWNER', width: 128, sortable: true },
  { key: 'team', label: 'TEAM', width: 128, sortable: true },
  { key: 'updated', label: 'UPDATED', sortable: true, mono: true },
];

const meta: Meta = { title: 'AURA/Data/DataTable' };
export default meta;

export const Enterprise: StoryObj = { render: () => <Aura.DataTable label="Workstreams" columns={columns.slice(0, 4)} rows={rows.slice(0, 4)} /> };
export const VirtualGrid: StoryObj = {
  render: () => <Aura.DataTable label="2,000 workstreams" columns={columns} rows={rows} height={440} selectable resizable columnControls />,
};
export const Paged: StoryObj = { render: () => <Aura.DataTable label="Paged" columns={columns.slice(0, 4)} rows={rows.slice(0, 42)} pageSize={10} selectable /> };
export const Loading: StoryObj = { render: () => <Aura.DataTable label="Loading" columns={columns.slice(0, 4)} rows={[]} loading skeletonRows={4} /> };
export const Empty: StoryObj = {
  render: () => (
    <Aura.DataTable label="Incidents" columns={columns.slice(0, 4)} rows={[]}
      empty={{ title: 'No open incidents', description: 'Anything that blocks a release will show up here.', action: <Aura.Button variant="secondary" icon="plus">Log Incident</Aura.Button> }} />
  ),
};
