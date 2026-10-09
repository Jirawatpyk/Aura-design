import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.35 DxT Monitor 13-14', parameters: { layout: 'fullscreen' } };
export default meta;

const ITEMS = [
  { id: 'overview', label: 'Overview', icon: 'layout-dashboard' as const },
  { id: 'sites', label: 'Sites', icon: 'globe' as const },
];
const TABS = [
  { id: 'overview', label: 'Overview', icon: 'layout-dashboard' as const, href: '#overview' },
  { id: 'sites', label: 'Sites', icon: 'globe' as const, href: '#sites' },
  { id: 'alerts', label: 'Alerts', icon: 'bell' as const, href: '#alerts' },
];
const ROWS = Array.from({ length: 60 }, (_, i) => ({ id: 'S-' + (100 + i), name: 'Site ' + (i + 1) }));

/* Request 13: the phone top bar slides away while scrolling down (headerHideOnScroll), and a pinned table header
 * follows it. Request 14: the BottomNav slides away too (hideOnScroll); a page with its own bottom bar hides it. */
export const ScrollAway: StoryObj = {
  render: () => {
    const [incident, setIncident] = React.useState(false);
    const [picked, setPicked] = React.useState(0);
    return (
      <Aura.AppShell
        headerHideFrom="lg"
        headerHideOnScroll
        nav={<Aura.SideNav items={ITEMS} defaultValue="overview" />}
        header={
          <div data-testid="phone-bar" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <strong>DxT Monitor</strong>
            <Aura.IconButton icon="bell" label="Notifications" />
          </div>
        }
        bottomNav={<Aura.BottomNav items={TABS} defaultValue="overview" hideOnScroll />}
      >
        <Aura.PageHeader
          title="Sites"
          actions={<Aura.Button onClick={() => setIncident(!incident)}>Toggle incident bar</Aura.Button>}
        />
        <Aura.Table caption="Sites" captionHidden stickyHeader>
          <Aura.THead>
            <Aura.Tr>
              <Aura.Th>ID</Aura.Th>
              <Aura.Th>NAME</Aura.Th>
            </Aura.Tr>
          </Aura.THead>
          <Aura.TBody>
            {ROWS.map((r) => (
              <Aura.Tr key={r.id}>
                <Aura.Td>{r.id}</Aura.Td>
                <Aura.Td>{r.name}</Aura.Td>
              </Aura.Tr>
            ))}
          </Aura.TBody>
        </Aura.Table>
        <Aura.Button variant="secondary" onClick={() => setPicked(picked ? 0 : 1)}>
          Select one
        </Aura.Button>
        {/* A bulk bar that hides the tabs only while it shows (idle at 0 selected). */}
        <Aura.ActionBar label="Bulk actions" selected={picked} onClearSelection={() => setPicked(0)} hidesBottomNav>
          <Aura.Button>Pause</Aura.Button>
        </Aura.ActionBar>
        {incident ? (
          <Aura.ActionBar hidesBottomNav status="Incident open">
            <Aura.Button variant="secondary">Visit site</Aura.Button>
            <Aura.Button>Acknowledge</Aura.Button>
          </Aura.ActionBar>
        ) : null}
      </Aura.AppShell>
    );
  },
};
