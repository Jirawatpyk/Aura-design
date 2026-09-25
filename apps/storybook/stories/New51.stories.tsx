import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.1' };
export default meta;

/* From DxT Monitor: a warning tone, a Checkbox whose label shows, six more icons. */
export const MonitorKit: StoryObj = {
  render: () => {
    const [agree, setAgree] = React.useState(false);
    return (
      <Aura.Stack gap={6}>
        <Aura.Stack direction="row" gap={3} align="center" wrap>
          <Aura.StatusPill>Ready</Aura.StatusPill>
          <Aura.StatusPill>Problem</Aura.StatusPill>
          <Aura.StatusPill tone="warning">Disk 91%</Aura.StatusPill>
          <Aura.StatusPill>Failed</Aura.StatusPill>
        </Aura.Stack>
        <Aura.Stack gap={3}>
          <Aura.Checkbox checked={agree} onChange={setAgree}>
            Alert me by phone
          </Aura.Checkbox>
          <Aura.Checkbox label="Bare box, named only" hideLabel />
        </Aura.Stack>
        <Aura.Stack direction="row" gap={4} align="center" data-testid="icons">
          {(['server', 'globe', 'activity', 'shield-alert', 'phone', 'wrench'] as const).map((n) => (
            <Aura.Icon key={n} name={n} size="md" label={n} />
          ))}
        </Aura.Stack>
      </Aura.Stack>
    );
  },
};

/* Dialog and Drawer focus the first field on open, not the close button. */
export const OverlayFocus: StoryObj = {
  render: () => {
    const [d, setD] = React.useState(false);
    const [r, setR] = React.useState(false);
    const [t, setT] = React.useState(false);
    return (
      <Aura.Stack direction="row" gap={3}>
        <Aura.Button onClick={() => setD(true)}>Edit server</Aura.Button>
        <Aura.Button variant="secondary" onClick={() => setR(true)}>
          Filters
        </Aura.Button>
        <Aura.Dialog
          open={d}
          onClose={() => setD(false)}
          title="Edit server"
          footer={<Aura.Button onClick={() => setD(false)}>Save</Aura.Button>}
        >
          <Aura.TextField label="Hostname" defaultValue="srv-01" />
        </Aura.Dialog>
        <Aura.Button variant="secondary" onClick={() => setT(true)}>
          Server tabs
        </Aura.Button>
        <Aura.Dialog open={t} onClose={() => setT(false)} title="srv-01">
          <Aura.Tabs
            label="Server"
            defaultValue="logs"
            tabs={[
              { id: 'overview', label: 'Overview', content: 'Up 42 days.' },
              { id: 'logs', label: 'Logs', content: 'No errors today.' },
            ]}
          />
        </Aura.Dialog>
        <Aura.Drawer open={r} onClose={() => setR(false)} title="Filters">
          <Aura.TextField label="Search hosts" />
        </Aura.Drawer>
      </Aura.Stack>
    );
  },
};

/* SideNav without a header keeps its first item off the top edge; bordered={false} drops its own divider. */
export const NavNoHeader: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', height: 240, gap: 24 }}>
      <div data-testid="plain" style={{ display: 'flex' }}>
        <Aura.SideNav
          value="srv"
          items={[
            { id: 'srv', label: 'Servers', icon: 'server' },
            { id: 'up', label: 'Uptime', icon: 'activity' },
          ]}
        />
      </div>
      <div data-testid="borderless" style={{ display: 'flex', borderRight: '1px solid var(--aura-border-default)' }}>
        <Aura.SideNav
          label="Second"
          bordered={false}
          value="dns"
          items={[
            { id: 'dns', label: 'DNS', icon: 'globe' },
            { id: 'sec', label: 'Security', icon: 'shield-alert' },
          ]}
        />
      </div>
    </div>
  ),
};
