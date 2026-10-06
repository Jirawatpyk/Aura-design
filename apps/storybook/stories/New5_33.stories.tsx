import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.33 DxT Monitor', parameters: { layout: 'fullscreen' } };
export default meta;

const ITEMS = [
  { id: 'overview', label: 'Overview', icon: 'layout-dashboard' as const },
  { id: 'sites', label: 'Sites', icon: 'globe' as const },
  { id: 'alerts', label: 'Alerts', icon: 'bell' as const, count: 3 },
];
const Brand = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 32 }}>
    <span style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--aura-fg-primary)' }} />
    <strong>DxT Monitor</strong>
  </div>
);

/* DxT Monitor requests 5–8: the signed-in frame with a phone-only top bar (6), hover that shows on the nav (5), a
 * breadcrumb in PageHeader (7) and a drawer header as tall as the bar (8). */
export const MonitorFrame: StoryObj = {
  render: () => (
    <Aura.AppShell
      headerHideFrom="lg"
      header={
        <div data-testid="phone-bar" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <strong>DxT Monitor</strong>
          <Aura.Avatar name="Tao P" size="sm" />
        </div>
      }
      nav={
        <Aura.SideNav
          header={<Brand />}
          headerDivider
          items={ITEMS}
          defaultValue="overview"
          footer={
            <div data-testid="nav-footer" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8 }}>
              <Aura.Avatar name="Tao P" size="sm" />
              <span style={{ flex: 1 }}>Tao P</span>
              <Aura.IconButton icon="log-out" label="Sign out" touchHeight />
            </div>
          }
        />
      }
    >
      <Aura.PageHeader
        data-testid="page-header"
        breadcrumb={<Aura.Breadcrumb items={[{ label: 'Sites', href: '#sites' }, { label: 'status.example.co.th' }]} />}
        title="status.example.co.th"
        meta="Checked every minute · up 99.98%"
        actions={
          <>
            <Aura.IconButton icon="rotate-ccw" label="Check now" />
            <Aura.Button variant="ghost">History</Aura.Button>
            <Aura.Button variant="secondary">Edit</Aura.Button>
          </>
        }
      />
      <Aura.Card data-testid="card" style={{ marginTop: 24 }}>
        <Aura.IconButton icon="pencil" label="Edit check" />
      </Aura.Card>
    </Aura.AppShell>
  ),
};
