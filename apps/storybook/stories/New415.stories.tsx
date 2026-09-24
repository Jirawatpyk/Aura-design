import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 4.15', parameters: { layout: 'fullscreen' } };
export default meta;

const ITEMS: Aura.NavItem[] = [
  { id: 'home', label: 'Dashboard', icon: 'layout-dashboard' },
  { id: 'orders', label: 'Orders', icon: 'inbox', count: 12 },
  {
    id: 'billing',
    label: 'Billing',
    icon: 'file-text',
    children: [
      { id: 'invoices', label: 'Invoices' },
      { id: 'payments', label: 'Payments' },
    ],
  },
  { id: 'members', label: 'Members', icon: 'users' },
  { id: 'reports', label: 'Reports' },
];

/* The staff sidebar: a rail you can toggle. The app keeps the choice (here in state; in an app, a cookie). */
export const CollapsibleNav: StoryObj = {
  render: () => {
    const [collapsed, setCollapsed] = React.useState(true);
    const [page, setPage] = React.useState('invoices');
    return (
      <Aura.AppShell
        header={<strong className="aura-text-label">Chamber OS</strong>}
        nav={
          <Aura.SideNav
            collapsible
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            value={page}
            onChange={setPage}
            header={<strong className="aura-text-label">{collapsed ? 'C' : 'Chamber OS'}</strong>}
            sections={[
              { title: 'Work', items: ITEMS },
              { title: 'Admin', items: [{ id: 'settings', label: 'Settings', icon: 'settings' }] },
            ]}
          />
        }
      >
        <div style={{ padding: 24 }}>
          <p className="aura-text-body" data-testid="state">
            Page: {page} · collapsed: {String(collapsed)}
          </p>
        </div>
      </Aura.AppShell>
    );
  },
};
