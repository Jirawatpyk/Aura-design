import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';
import { App as OrdersPage } from '../../../packages/react/examples/orders/App.jsx';
import '../../../packages/react/examples/orders/pilot.css';

const meta: Meta = { title: 'AURA/Responsive' };
export default meta;

const tile = (t: string) => <div key={t} style={{ padding: '12px 16px', borderRadius: 8, background: 'var(--aura-bg-surface)', border: '1px solid var(--aura-border-default)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{t}</div>;

export const StackGrid: StoryObj = {
  name: 'Stack, Grid, Container',
  render: () => {
    const bp = Aura.useBreakpoint();
    return (
      <Aura.Container>
        <Aura.Stack gap={6}>
          <p data-testid="bp">Breakpoint: {bp}</p>
          <Aura.Stack direction={{ base: 'column', md: 'row' }} gap={{ base: 2, md: 4 }}>{['column below md', 'row from md', 'gap 2 → 4'].map(tile)}</Aura.Stack>
          <Aura.Grid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>{['1 col', '2 cols from sm', '4 cols from lg', '…'].map(tile)}</Aura.Grid>
          <Aura.Grid minItemWidth={160} gap={3}>{['auto-fit', 'min 160px', 'each', 'fills', 'the row'].map(tile)}</Aura.Grid>
        </Aura.Stack>
      </Aura.Container>
    );
  },
};

const rows = Array.from({ length: 8 }, (_, i) => ({ id: 'ORD-' + (1040 + i), name: ['คุณสมชาย ใจดี', 'Anna Lee', 'คุณวิภา รักดี', 'Mark Chen'][i % 4], status: ['Ready', 'In Progress', 'Blocked', 'Backlog'][i % 4], owner: ['กมล', 'ธนพร', 'ปิยะ', '—'][i % 4] }));
export const StackedTable: StoryObj = {
  name: 'DataTable (stackBelow)',
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => (
    <Aura.DataTable label="Orders" rows={rows} selectable pageSize={5} stackBelow={640}
      columns={[{ key: 'id', label: 'ID', width: 96, mono: true, sortable: true }, { key: 'name', label: 'NAME', width: 180 }, { key: 'status', label: 'STATUS', width: 120, pill: true }, { key: 'owner', label: 'OWNER' },
        { key: 'actions', label: '', actions: true, width: 56, render: (r: any) => <Aura.DropdownMenu label={'Actions for ' + r.id} items={[{ label: 'View', icon: 'eye', onSelect: () => {} }]} trigger={<Aura.IconButton icon="ellipsis" label={'Actions for ' + r.id} />} /> }]} />
  ),
};

export const Shell: StoryObj = {
  name: 'AppShell',
  parameters: { layout: 'fullscreen' },
  decorators: [(S) => <div style={{ margin: -24 }}><S /></div>],
  render: () => {
    const [nav, setNav] = React.useState('orders');
    return (
      <Aura.AppShell header={<strong>Orders</strong>}
        nav={<Aura.SideNav value={nav} onChange={setNav} items={[{ id: 'home', label: 'Dashboard', icon: 'layout-dashboard' }, { id: 'orders', label: 'Orders', icon: 'calendar', count: 6 }, { id: 'team', label: 'Team', icon: 'users' }]} />}>
        <p>Resize the canvas: the navigation is fixed from 1024px and moves into a drawer below it.</p>
      </Aura.AppShell>
    );
  },
};

export const Pilot: StoryObj = {
  name: 'Pilot: orders page',
  parameters: { layout: 'fullscreen' },
  decorators: [(S) => <div style={{ margin: -24 }}><Aura.AuraProvider locale="th"><S /></Aura.AuraProvider></div>],
  render: () => <OrdersPage />,
};
