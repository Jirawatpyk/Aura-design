import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.32 DxT Monitor', parameters: { layout: 'fullscreen' } };
export default meta;

const ITEMS = [
  { id: 'overview', label: 'Overview', icon: 'layout-dashboard' as const },
  { id: 'sites', label: 'Sites', icon: 'globe' as const },
  { id: 'alerts', label: 'Alerts', icon: 'bell' as const, count: 3 },
];
const Brand = () => (
  <div data-testid="brand" style={{ display: 'flex', alignItems: 'center', gap: 8, height: 32 }}>
    <span style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--aura-fg-primary)' }} />
    <strong>DxT Monitor</strong>
  </div>
);

/* DxT Monitor requests 1 and 3: the signed-in frame — a SideNav with the board's header divider, and a PageHeader
 * whose only margin is AppShell's content padding. */
export const MonitorShell: StoryObj = {
  render: () => (
    <Aura.AppShell
      nav={<Aura.SideNav header={<Brand />} headerDivider items={ITEMS} defaultValue="overview" />}
      header={<span>Monitor</span>}
    >
      <Aura.PageHeader
        data-testid="page-header"
        eyebrow="Monitor / Overview"
        title="Overview"
        titleId="overview-title"
        meta="12 sites · updated 2 min ago"
        actions={
          <>
            <Aura.Button variant="secondary">Export</Aura.Button>
            <Aura.Button>Add site</Aura.Button>
          </>
        }
      />
      <p data-testid="after">Content</p>
    </Aura.AppShell>
  ),
};

/* Side by side: the divider, the default header, the collapsed rail; PageHeader variants; skeleton pills. */
export const Parts: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 32, padding: 24 }}>
      <div style={{ display: 'flex', gap: 24, height: 320 }}>
        <div data-testid="divided">
          <Aura.SideNav header={<Brand />} headerDivider items={ITEMS} defaultValue="overview" label="Divided" />
        </div>
        <div data-testid="plain">
          <Aura.SideNav header={<Brand />} items={ITEMS} defaultValue="overview" label="Plain" />
        </div>
        <div data-testid="rail">
          <Aura.SideNav
            header={<Brand />}
            headerDivider
            items={ITEMS}
            defaultValue="overview"
            label="Rail"
            collapsible
            collapsed
          />
        </div>
        <div data-testid="no-header">
          <Aura.SideNav headerDivider items={ITEMS} defaultValue="overview" label="No header" />
        </div>
      </div>
      <div data-testid="h2">
        <Aura.PageHeader headingLevel={2} title="Sites" />
      </div>
      <div data-testid="long" style={{ width: 360 }}>
        <Aura.PageHeader
          eyebrow="Monitor / Sites / https://status.example-very-long-customer-domain-name.co.th/healthcheck"
          title="A site with a very long name for the overview page"
          meta="Checked https://status.example-very-long-customer-domain-name.co.th/healthcheck?region=ap-southeast-1"
          actions={<Aura.Button variant="secondary">Edit</Aura.Button>}
        />
      </div>
      <div data-testid="inline">
        <p>
          Status: <Aura.Skeleton variant="badge" /> after
        </p>
        <p>
          Status: <Aura.Badge>Corporate</Aura.Badge> after
        </p>
        <p>
          Status: <Aura.Skeleton variant="pill" /> after
        </p>
        <p>
          Status: <Aura.StatusPill tone="ready">Online</Aura.StatusPill> after
        </p>
      </div>
      <div lang="th" data-testid="thai-header">
        <Aura.PageHeader eyebrow="ภาพรวม" title="ภาพรวมระบบ" meta="อัปเดตเมื่อ 2 นาทีที่แล้ว" />
      </div>
      <div data-testid="pills" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, max-content)', gap: 12 }}>
        <Aura.Skeleton variant="pill" />
        <Aura.StatusPill tone="ready">Online</Aura.StatusPill>
        <Aura.Skeleton variant="badge" />
        <Aura.Badge>Corporate</Aura.Badge>
        <Aura.Skeleton variant="pill" width={96} />
        <span />
      </div>
      <div
        lang="th"
        data-testid="pills-th"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(2, max-content)', gap: 12 }}
      >
        <Aura.Skeleton variant="pill" />
        <Aura.StatusPill tone="ready">ออนไลน์</Aura.StatusPill>
        <Aura.Skeleton variant="badge" />
        <Aura.Badge>นิติบุคคล</Aura.Badge>
      </div>
    </div>
  ),
};
