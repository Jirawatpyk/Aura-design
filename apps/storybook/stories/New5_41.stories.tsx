import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.41 DxT Monitor 19-22', parameters: { layout: 'fullscreen' } };
export default meta;

const ITEMS = [
  { id: 'overview', label: 'Overview', icon: 'layout-dashboard' as const, href: '#overview' },
  { id: 'sites', label: 'Sites', icon: 'globe' as const, href: '#sites', active: true },
  { id: 'incidents', label: 'Incidents', icon: 'triangle-alert' as const, href: '#incidents' },
];
const MORE = [
  { label: 'Edit monitors', onSelect: () => {} },
  { label: 'Visit site', href: 'https://status.example.co.th', target: '_blank' },
  { label: 'Export report', href: '#export' },
];

/* MSite: back arrow · title · ⋯ · avatar in the phone bar, no menu button (#19); the page header keeps its title for
 * screen readers but shows only the meta line and actions below lg (#20); "Visit site" says it opens a new tab (#21);
 * the ⋯ looks open while its menu shows (#22). */
function SitePage(props: { hideMenu: boolean }) {
  return (
    <Aura.AppShell
      headerHideFrom="lg"
      header={
        <div data-testid="bar" style={{ display: 'flex', alignItems: 'center', gap: 4, width: '100%', minWidth: 0 }}>
          <Aura.IconButton icon="arrow-left" label="Back to Sites" size="md" />
          <strong style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            status.example.co.th
          </strong>
          <Aura.DropdownMenu
            label="Site actions"
            items={MORE}
            trigger={<Aura.IconButton icon="ellipsis" label="Site actions" size="md" />}
          />
          <Aura.Avatar name="Tao P" size="sm" />
        </div>
      }
      nav={<Aura.SideNav items={ITEMS} />}
    >
      {props.hideMenu ? <div data-aura-hide-menubutton="" hidden /> : null}
      <Aura.PageHeader
        data-testid="header"
        titleHideBelow="lg"
        breadcrumb={<Aura.Breadcrumb items={[{ label: 'Sites', href: '#sites' }, { label: 'status.example.co.th' }]} />}
        title="status.example.co.th"
        meta="Down for 12m · checked 30s ago"
        actions={
          <>
            <Aura.Button variant="secondary">Mute</Aura.Button>
            <Aura.DropdownMenu
              label="More"
              items={MORE}
              trigger={<Aura.Button variant="secondary">More</Aura.Button>}
            />
          </>
        }
      />
      <div data-testid="no-meta" style={{ marginTop: 32 }}>
        <Aura.PageHeader titleHideBelow="lg" title="Incidents" actions={<Aura.Button>New incident</Aura.Button>} />
      </div>
      <p style={{ marginTop: 24 }}>Page content.</p>
    </Aura.AppShell>
  );
}

export const BackArrowPage: StoryObj = { render: () => <SitePage hideMenu /> };
export const TabPage: StoryObj = { render: () => <SitePage hideMenu={false} /> };
/* No header: the bar held only the menu button, so a marked page has no bar at all on phones. */
export const NoHeaderMarked: StoryObj = {
  render: () => (
    <Aura.AppShell nav={<Aura.SideNav items={ITEMS} />}>
      <div data-aura-hide-menubutton="" hidden />
      <Aura.IconButton icon="arrow-left" label="Back to Sites" />
      <p>Page content.</p>
    </Aura.AppShell>
  ),
};
