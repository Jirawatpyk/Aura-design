import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.37 DxT Monitor 17-18' };
export default meta;

const ACTIONS = (
  <>
    <Aura.Button variant="secondary" touchHeight>
      Mute
    </Aura.Button>
    <Aura.Button variant="secondary" touchHeight>
      Maintenance
    </Aura.Button>
    <Aura.Button touchHeight>Edit monitors</Aura.Button>
  </>
);

/* Request 17: PageHeader actionsFullWidthBelow — below the breakpoint the actions take the row under the text and
 * their children share it (DxT MSite at 390: two half-width buttons, then one full-width, 12px apart). */
export const HeaderActions: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 40, padding: 16 }}>
      <Aura.PageHeader
        data-testid="md"
        eyebrow="Monitor / Sites"
        title="api.example.co.th"
        meta="Down for 12m · checked 30s ago"
        actions={ACTIONS}
        actionsFullWidthBelow="md"
      />
      {/* One child of your own — a grid that puts the third button on its own row — spans the row too. */}
      <Aura.PageHeader
        data-testid="grid"
        title="Checkout"
        actionsFullWidthBelow="md"
        actions={
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Aura.Button variant="secondary">Mute</Aura.Button>
            <Aura.Button variant="secondary">Pause</Aura.Button>
            <Aura.Button style={{ gridColumn: '1 / -1' }}>Edit monitors</Aura.Button>
          </div>
        }
      />
      <Aura.PageHeader
        data-testid="one"
        title="Sites"
        actionsFullWidthBelow="sm"
        actions={<Aura.Button>Add site</Aura.Button>}
      />
      <Aura.PageHeader data-testid="lg" title="Billing" actionsFullWidthBelow="lg" actions={ACTIONS} />
      {/* A menu trigger and a tipped button fill their share; an overflow icon button keeps its size. */}
      <Aura.PageHeader
        data-testid="wrapped"
        title="Search API"
        actionsFullWidthBelow="md"
        actions={
          <>
            <Aura.Tooltip content="Silence alerts for this site">
              <Aura.Button variant="secondary">Mute</Aura.Button>
            </Aura.Tooltip>
            <Aura.DropdownMenu
              label="Edit"
              items={[{ label: 'Monitors', onSelect: () => {} }]}
              trigger={<Aura.Button>Edit</Aura.Button>}
            />
            <Aura.DropdownMenu
              label="More"
              items={[{ label: 'Delete site', onSelect: () => {} }]}
              trigger={<Aura.IconButton icon="ellipsis" label="More" />}
            />
            <Aura.IconButton icon="external-link" label="Open site" />
          </>
        }
      />
      {/* Without the prop: the actions hug their content, as before. */}
      <Aura.PageHeader data-testid="default" title="Status page" actions={ACTIONS} />
    </div>
  ),
};

const TYPES = ['Maintenance', 'Mute'];
const DURATIONS = ['30m', '1h', '4h', 'Custom'];
const START = ['Now', 'Later'];

/* Request 18: SegmentedControl touchHeight — 44px options below 640px or on a coarse pointer (true), or always. */
export const SegmentedTouch: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, padding: 16, maxWidth: 420 }}>
      <div data-testid="type">
        <Aura.SegmentedControl label="Type" options={TYPES} fullWidth touchHeight />
      </div>
      <div data-testid="duration">
        <Aura.SegmentedControl label="Duration" options={DURATIONS} fullWidth touchHeight />
      </div>
      <div data-testid="start">
        <Aura.SegmentedControl label="Start" options={START} size="sm" touchHeight />
      </div>
      <div data-testid="icons">
        <Aura.SegmentedControl
          label="View"
          touchHeight
          options={[
            { value: 'table', label: 'Table view', icon: 'columns-3', iconOnly: true },
            { value: 'cards', label: 'Card view', icon: 'layout-dashboard', iconOnly: true },
          ]}
        />
      </div>
      <div data-testid="always">
        <Aura.SegmentedControl label="Always" options={START} touchHeight="always" />
      </div>
      <div data-testid="plain">
        <Aura.SegmentedControl label="Plain" options={START} />
      </div>
    </div>
  ),
};
