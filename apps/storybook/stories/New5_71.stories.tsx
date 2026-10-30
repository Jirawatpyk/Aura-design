import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.71 Chamber-OS 191', parameters: { layout: 'fullscreen' } };
export default meta;

const NAV = [{ id: 'invoices', label: 'Invoices', icon: 'file-text' as const, href: '#invoices', active: true }];
const TABS = [
  { id: 'home', label: 'Home', icon: 'house' as const, href: '#home' },
  { id: 'invoices', label: 'Invoices', icon: 'file-text' as const, href: '#invoices' },
];

/* #191: the member portal's invoice — four header actions, only Pay now (one element: it roots the pay sheet) in the
 * phone bar with the amount due; the downloads stay in the page, full width. */
function Invoice(props: { nav?: boolean; floating?: boolean; extras?: boolean }) {
  return (
    <Aura.AppShell
      header={<strong>Member portal</strong>}
      nav={<Aura.SideNav items={NAV} />}
      bottomNav={props.nav ? <Aura.BottomNav items={TABS} defaultValue="invoices" /> : undefined}
    >
      <Aura.PageHeader
        data-testid="header"
        title="Invoice SC-2026-900001"
        actionsFullWidthBelow="sm"
        actionsBarBelow="sm"
        actionsBarLook={props.floating ? 'floating' : undefined}
        actionsStatus="Amount due ฿10,700.00 · due 22 Oct 2026"
        actions={
          <>
            <Aura.Button data-testid="pdf" variant="secondary" icon="download" touchHeight>
              Invoice PDF
            </Aura.Button>
            <Aura.Button data-testid="receipt" variant="secondary" icon="download" touchHeight>
              Receipt
            </Aura.Button>
            <Aura.Button data-testid="email" variant="secondary" touchHeight>
              Email me a copy
            </Aura.Button>
          </>
        }
        actionsBar={
          <>
            {props.extras ? (
              <>
                <span className="aura-sr-only" id="pay-note">
                  Card, PromptPay or bank transfer
                </span>
                <Aura.IconButton data-testid="share" icon="ellipsis" label="Share invoice" touchHeight />
              </>
            ) : null}
            <Aura.Dialog
              title="Pay invoice SC-2026-900001"
              trigger={
                <Aura.Button data-testid="pay" touchHeight>
                  Pay now
                </Aura.Button>
              }
            >
              <p className="aura-text-body">The pay sheet.</p>
            </Aura.Dialog>
          </>
        }
      />
      <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
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
      </div>
    </Aura.AppShell>
  );
}

export const PayBar: StoryObj = { render: () => <Invoice /> };
export const PayBarAboveBottomNav: StoryObj = { render: () => <Invoice nav /> };
export const PayBarFloating: StoryObj = { render: () => <Invoice floating /> };
/* A visually hidden note and an IconButton in actionsBar keep 5.61's full-width rules. */
export const PayBarExtras: StoryObj = { render: () => <Invoice extras /> };
