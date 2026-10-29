import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

type Args = { look: 'floating' | 'edge' | 'edge-below-sm' | 'default' | 'page-header'; nav: boolean };
const meta: Meta<Args> = {
  title: 'AURA/New in 5.69 Chamber-OS 185',
  parameters: { layout: 'fullscreen' },
  args: { look: 'edge', nav: false },
  argTypes: {
    look: { control: 'inline-radio', options: ['edge', 'edge-below-sm', 'floating', 'default', 'page-header'] },
    nav: { control: 'boolean' },
  },
};
export default meta;

const NAV = [
  { id: 'invoices', label: 'Invoices', icon: 'file-text' as const, href: '#invoices', active: true },
  { id: 'members', label: 'Members', icon: 'users' as const, href: '#members' },
];
const TABS = [
  { id: 'home', label: 'Home', icon: 'house' as const, href: '#home' },
  { id: 'invoices', label: 'Invoices', icon: 'file-text' as const, href: '#invoices' },
];

/* #185: the portal invoice's pay band and E-Blast compose — an ActionBar drawn as PageHeader's edge strip. `look`
 * picks the bar: edge at every width, the edge strip below 640px (edgeBelow="sm"), the floating card (explicit or
 * by default), or PageHeader's own edge bar beside it for comparison. */
function Invoice(props: Args) {
  const pay = (
    <Aura.Button data-testid="pay" touchHeight>
      Pay now
    </Aura.Button>
  );
  const status = 'Amount due 10,700.00 THB · due 22 Oct 2026';
  return (
    <Aura.AppShell
      header={<strong>Member portal</strong>}
      nav={<Aura.SideNav items={NAV} />}
      bottomNav={props.nav ? <Aura.BottomNav items={TABS} defaultValue="invoices" /> : undefined}
    >
      {props.look === 'page-header' ? (
        <Aura.PageHeader
          data-testid="header"
          title="Invoice SC-2026-900001"
          actionsFullWidthBelow="sm"
          actionsBarBelow="sm"
          actionsStatus={status}
          actions={pay}
        />
      ) : (
        <Aura.PageHeader title="Invoice SC-2026-900001" />
      )}
      <form data-testid="form" style={{ display: 'grid', gap: 16, marginTop: 24 }} onSubmit={(e) => e.preventDefault()}>
        {Array.from({ length: 10 }, (_, i) => (
          <Aura.Card key={i} title={'Line ' + (i + 1)}>
            <p className="aura-text-body" style={{ margin: 0 }}>
              Membership fee, corporate plan
            </p>
          </Aura.Card>
        ))}
        <Aura.TextField label="Note to the chamber" />
        <p data-testid="last" style={{ margin: 0 }}>
          End of invoice.
        </p>
        {props.look === 'page-header' ? null : (
          <Aura.ActionBar
            label="Payment"
            status={status}
            look={props.look === 'edge' ? 'edge' : props.look === 'floating' ? 'floating' : undefined}
            edgeBelow={props.look === 'edge-below-sm' ? 'sm' : undefined}
          >
            {pay}
          </Aura.ActionBar>
        )}
      </form>
      <footer data-testid="footer" style={{ marginTop: 24 }}>
        <a href="#terms">Payment terms</a>
      </footer>
    </Aura.AppShell>
  );
}

export const Edge: StoryObj<Args> = { render: (a) => <Invoice {...a} /> };
export const EdgeAboveBottomNav: StoryObj<Args> = { args: { nav: true }, render: (a) => <Invoice {...a} /> };
export const EdgeBelowSm: StoryObj<Args> = { args: { look: 'edge-below-sm' }, render: (a) => <Invoice {...a} /> };
export const Floating: StoryObj<Args> = { args: { look: 'default' }, render: (a) => <Invoice {...a} /> };
export const PageHeaderBar: StoryObj<Args> = { args: { look: 'page-header' }, render: (a) => <Invoice {...a} /> };

/* A bulk bar with nothing selected stays folded away and adds no room; no AppShell, so the body is padded. */
export const IdleBulk: StoryObj = {
  render: () => {
    const [n, setN] = React.useState(0);
    return (
      <div style={{ padding: 16 }}>
        <Aura.Button data-testid="pick" onClick={() => setN(n + 1)}>
          Select a row
        </Aura.Button>
        <p data-testid="after">Rows…</p>
        <Aura.ActionBar look="edge" selected={n} onClearSelection={() => setN(0)}>
          <Aura.Button>Archive</Aura.Button>
        </Aura.ActionBar>
      </div>
    );
  },
};
