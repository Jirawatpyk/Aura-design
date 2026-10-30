import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.79 visual audit set 3', parameters: { layout: 'fullscreen' } };
export default meta;

const NAV = [
  { id: 'home', label: 'Dashboard', icon: 'layout-dashboard' as const, href: '#home' },
  { id: 'inv', label: 'Invoices', icon: 'file-text' as const, href: '#inv' },
];

/* Item 10: in an AppShell on a desktop the edge strip starts after the sidebar (the rail when collapsed; the right edge
 * in RTL) and lines its contents up with the content's padding. */
function Shell(p: { collapsed?: boolean; dir?: 'rtl' }) {
  return (
    <div dir={p.dir}>
      <Aura.AppShell
        nav={<Aura.SideNav value="inv" collapsed={p.collapsed} items={NAV} />}
        header={<strong>Chamber OS</strong>}
      >
        <h1 data-testid="heading" style={{ margin: 0 }}>
          Invoices
        </h1>
        <div style={{ height: 1200 }} />
        <Aura.ActionBar look="edge" status="3 invoices selected">
          <Aura.Button variant="secondary">Export</Aura.Button>
          <Aura.Button>Send reminders</Aura.Button>
        </Aura.ActionBar>
      </Aura.AppShell>
    </div>
  );
}
/* As the launch page: the preview's padding undone, so the shell starts at the screen's edge as in an app. */
const edge = [
  (S: React.ComponentType) => (
    <div style={{ margin: -24 }}>
      <S />
    </div>
  ),
];
export const ShellEdge: StoryObj = { decorators: edge, render: () => <Shell /> };
export const ShellEdgeCollapsed: StoryObj = { decorators: edge, render: () => <Shell collapsed /> };
export const ShellEdgeRtl: StoryObj = { decorators: edge, render: () => <Shell dir="rtl" /> };

/* Items 6, 15–19 and Thai: one disabled look, a list box, wide chips, a locked switch's lock, outline badges, a file
 * type hint, a date range, the Thai weekday row. */
export const SetThree: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 24, padding: 24, maxWidth: 640 }}>
      <div data-testid="disabled" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {(['primary', 'secondary', 'danger', 'creative', 'ghost'] as const).map((v) => (
          <Aura.Button key={v} variant={v} disabled data-variant={v}>
            {v}
          </Aura.Button>
        ))}
        <Aura.Button aria-disabled data-variant="gated">
          Gated
        </Aura.Button>
      </div>
      <div data-testid="listbox">
        <Aura.Select label="Regions" multiple defaultValue={['north']}>
          <option value="north">North</option>
          <option value="central">Central</option>
          <option value="south">South</option>
          <option value="east">East</option>
        </Aura.Select>
      </div>
      <div data-testid="chips" style={{ maxWidth: 260 }}>
        <Aura.Combobox
          label="Members"
          multiple
          defaultValue={['v', 'k']}
          options={[
            { value: 'v', label: 'Volvo Thailand Co., Ltd.' },
            { value: 'k', label: 'กรุงเทพประกันภัย' },
            { value: 'a', label: 'Acme AB' },
          ]}
        />
      </div>
      <div data-testid="locked" style={{ maxWidth: 360 }}>
        <Aura.Switch label="M2M benefits access" defaultChecked readOnly icon="lock" />
      </div>
      <div data-testid="badges" style={{ display: 'flex', gap: 8 }}>
        <Aura.Badge tone="accent" variant="outline">
          Beta
        </Aura.Badge>
        <Aura.Button size="sm" variant="secondary">
          Secondary
        </Aura.Button>
      </div>
      <div data-testid="upload">
        <Aura.FileUpload label="Logo" accept="image/png,image/jpeg,image/svg+xml,.pdf" />
      </div>
      <div data-testid="range">
        <Aura.Calendar range start="2026-09-07" end="2026-09-18" focus="2026-09-07" />
      </div>
      <div data-testid="th">
        <Aura.AuraProvider locale="th">
          <Aura.Calendar start="2026-09-18" focus="2026-09-18" />
        </Aura.AuraProvider>
      </div>
      <div data-testid="menu">
        <Aura.DropdownMenu
          label="Actions"
          items={[
            { label: 'View details', onSelect: () => {} },
            { label: 'Copy ID', onSelect: () => {} },
          ]}
          trigger={<Aura.Button variant="secondary">Actions</Aura.Button>}
        />
      </div>
    </div>
  ),
};

/* 5.78 carry-over: full width below md, the bar pinned below sm — between 640 and 767px every button is radius-md. */
export const MixedRadius: StoryObj = {
  render: () => (
    <div style={{ padding: 16 }}>
      <Aura.PageHeader
        title="Invoice SC-2026-900001"
        actionsBarBelow="sm"
        actionsFullWidthBelow="md"
        actions={<Aura.Button variant="secondary">Invoice PDF</Aura.Button>}
        actionsBar={<Aura.Button>Pay now</Aura.Button>}
      />
    </div>
  ),
};
