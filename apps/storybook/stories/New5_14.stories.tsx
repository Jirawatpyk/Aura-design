import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { IconUsers } from '@aura/react/icons';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.14' };
export default meta;

/* 86, 88, 102, 106, 107 (Chamber-OS addenda 15–16): a gated confirm that stays focusable, a Stat whose label is the
 * section heading, an EmptyState outside the outline, warning text on the page, and in-page link tabs. */
export const SmallOptions: StoryObj = {
  render: () => {
    const [clicks, setClicks] = React.useState(0);
    const [ready, setReady] = React.useState(false);
    return (
      <Aura.Stack gap={6}>
        <div>
          <Aura.Stack direction="row" gap={3}>
            <Aura.Button
              variant="danger"
              aria-disabled={!ready}
              aria-describedby="erase-why"
              onClick={() => setClicks((n) => n + 1)}
            >
              Erase member
            </Aura.Button>
            <Aura.Checkbox checked={ready} onChange={setReady}>
              I have exported their data
            </Aura.Checkbox>
          </Aura.Stack>
          <p id="erase-why" className="aura-text-caption">
            Export the member’s data first.
          </p>
          <p data-testid="clicks">Erased: {clicks}</p>
          {/* Every variant, gated: hovering changes nothing. */}
          <div data-testid="gated-variants" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {(['primary', 'secondary', 'ghost', 'danger', 'danger-secondary', 'creative'] as const).map((v) => (
              <Aura.Button key={v} variant={v} aria-disabled>
                {'Gated ' + v}
              </Aura.Button>
            ))}
          </div>
        </div>
        <Aura.Grid columns={{ base: 1, md: 3 }} gap={4}>
          <Aura.Stat
            label="Membership"
            headingLevel={2}
            value="Active"
            caption="Gold · renews Oct 2026"
            icon={<IconUsers />}
          />
          <Aura.Stat label="Invoices" headingLevel={2} value={3} href="#invoices" />
          <Aura.Stat label="E-Blasts" headingLevel={2} loading />
        </Aura.Grid>
        <Aura.Card title="Benefits" headingLevel={2}>
          <Aura.EmptyState headingLevel={false} size="sm" title="No benefits" description="None have been used yet." />
        </Aura.Card>
        <p data-testid="owed" style={{ color: 'var(--aura-fg-warning)', fontWeight: 600 }}>
          ฿12,400.00 owed — due 15 Oct 2026
        </p>
        <Aura.Tabs
          label="On this page"
          current="location"
          value="contacts"
          tabs={[
            { id: 'contacts', label: 'Contacts', href: '#contacts' },
            { id: 'invoices', label: 'Invoices', href: '#invoices' },
          ]}
        />
      </Aura.Stack>
    );
  },
};

/* 91: a long form in a Drawer on a phone — a field focused near the bottom or top keeps clear of the edges. */
export const DrawerScrollPadding: StoryObj = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Aura.Button onClick={() => setOpen(true)}>Edit member</Aura.Button>
        <Aura.Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="Edit member"
          footer={<Aura.Button onClick={() => setOpen(false)}>Save</Aura.Button>}
        >
          <Aura.Stack gap={4}>
            {Array.from({ length: 12 }, (_, i) => (
              <Aura.TextField key={i} label={'Field ' + (i + 1)} />
            ))}
          </Aura.Stack>
        </Aura.Drawer>
      </>
    );
  },
};

/* 97, 104: the shell's bar-height token for sticky offsets, and content without the shell's padding. */
export const ShellOptions: StoryObj = {
  render: () => {
    const [compact, setCompact] = React.useState(false);
    const [long, setLong] = React.useState(false);
    const shell = (
      <Aura.AppShell
        contentPadding={false}
        header={
          <>
            <Aura.Button size="sm" variant="secondary" onClick={() => setCompact(!compact)}>
              {compact ? 'Comfortable' : 'Compact'}
            </Aura.Button>
            <Aura.Button size="sm" variant="secondary" onClick={() => setLong(!long)}>
              {long ? 'Short title' : 'Long title'}
            </Aura.Button>
            {long ? (
              <span className="aura-text-label" style={{ minWidth: 0 }}>
                Scandinavian-Thai Precision Engineering and Industrial Supplies Co., Ltd. — member record
              </span>
            ) : null}
          </>
        }
        nav={
          <Aura.SideNav
            value="members"
            header={<strong className="aura-text-label">Chamber OS</strong>}
            sections={[{ title: 'Work', items: [{ id: 'members', label: 'Members', icon: <IconUsers /> }] }]}
          />
        }
      >
        <div data-testid="page" style={{ padding: 16 }}>
          <nav
            data-testid="sticky"
            aria-label="On this page"
            style={{
              position: 'sticky',
              top: 'var(--aura-shell-bar-height)',
              background: 'var(--aura-bg-canvas)',
              padding: '8px 0',
            }}
          >
            <a href="#contacts">Contacts</a>
          </nav>
          <div style={{ height: 1600 }} />
        </div>
        {/* A Container in flush content keeps its own gutters (the shell isn't padding it). */}
        <Aura.Container className="story-flush-container">
          <p>Footer notes</p>
        </Aura.Container>
      </Aura.AppShell>
    );
    return (
      <div style={{ margin: -24 }}>
        {compact ? <Aura.AuraProvider density="compact">{shell}</Aura.AuraProvider> : shell}
      </div>
    );
  },
};

/* 108: amounts right-aligned in the grid, start-aligned under their labels in the cards. */
export const CardAmountsStart: StoryObj = {
  render: () => {
    const rows = [
      { no: 'INV-2026-0141', total: '107,000.00', left: '12,400.00' },
      { no: 'INV-2026-0152', total: '9,630.00', left: '0.00' },
    ];
    const table = (t: string) => (
      <div data-testid={t} style={t === 'amount-cards' ? { width: 360 } : undefined}>
        <Aura.DataTable
          label={t === 'amount-cards' ? 'Invoices (cards)' : 'Invoices'}
          rows={rows}
          rowKey="no"
          stackBelow={640}
          columns={[
            { key: 'no', label: 'INVOICE', width: 180, mono: true },
            { key: 'total', label: 'TOTAL (THB)', width: 160, align: 'end' },
            { key: 'left', label: 'REMAINING (THB)', align: 'end' },
          ]}
        />
      </div>
    );
    return (
      <Aura.Stack gap={6}>
        {table('amount-grid')}
        {table('amount-cards')}
        <div data-testid="amount-cards-loading" style={{ width: 360 }}>
          <Aura.DataTable
            label="Invoices (loading)"
            rows={[]}
            loading
            skeletonRows={2}
            stackBelow={640}
            columns={[
              { key: 'no', label: 'INVOICE', width: 180, mono: true },
              { key: 'total', label: 'TOTAL (THB)', width: 160, align: 'end' },
            ]}
          />
        </div>
      </Aura.Stack>
    );
  },
};
