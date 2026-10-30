import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.74 Chamber-OS 193', parameters: { layout: 'fullscreen' } };
export default meta;

const NAV = [{ id: 'invoices', label: 'Invoices', icon: 'file-text' as const, href: '#invoices', active: true }];

/* #193: the portal invoice's pay bar hides (never unmounts) once paying succeeds — Pay now roots the pay sheet, whose
 * confirmation is still on screen. With nothing but the status left, the strip and its page padding go. */
function Invoice(props: { bar?: boolean; plain?: boolean; floating?: boolean; gate?: boolean }) {
  const [paid, setPaid] = React.useState(false);
  const [open, setOpen] = React.useState(!props.gate);
  React.useEffect(() => {
    if (!props.gate) return;
    const t = setTimeout(() => setOpen(true), 400);
    return () => clearTimeout(t);
  }, [props.gate]);
  const pay = (
    <section data-slot="pay-bar" hidden={paid}>
      <Aura.Button data-testid="pay" touchHeight onClick={() => setPaid(true)}>
        Pay now
      </Aura.Button>
    </section>
  );
  const pdf = (
    <Aura.Button data-testid="pdf" variant="secondary" touchHeight hidden={props.plain && paid}>
      Invoice PDF
    </Aura.Button>
  );
  return (
    <div data-testid="gate" style={{ visibility: open ? 'visible' : 'hidden' }}>
      <Aura.AppShell header={<strong>Member portal</strong>} nav={<Aura.SideNav items={NAV} />}>
        <Aura.PageHeader
          data-testid="header"
          title="Invoice SC-2026-900001"
          actionsBarBelow={props.bar === false ? undefined : 'sm'}
          actionsBarLook={props.floating ? 'floating' : undefined}
          actionsStatus="Amount due ฿10,700.00 · due 22 Oct 2026"
          actions={
            props.plain ? (
              <>
                {pdf}
                {pay}
              </>
            ) : (
              pdf
            )
          }
          actionsBar={props.plain ? undefined : pay}
        />
        <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
          <Aura.Button data-testid="toggle" variant="ghost" onClick={() => setPaid(!paid)}>
            {paid ? 'Undo paid' : 'Mark paid'}
          </Aura.Button>
          {Array.from({ length: 8 }, (_, i) => (
            <Aura.Card key={i} title={'Line ' + (i + 1)}>
              <p className="aura-text-body" style={{ margin: 0 }}>
                Membership fee
              </p>
            </Aura.Card>
          ))}
        </div>
      </Aura.AppShell>
    </div>
  );
}

export const PayBarHides: StoryObj = { render: () => <Invoice /> };
/* The same page without actionsBarBelow — the padding a page has with no bar. */
export const NoBar: StoryObj = { render: () => <Invoice bar={false} /> };
/* The plain actionsBarBelow bar (no actionsBar): every action hidden once paid. */
export const PlainBarHides: StoryObj = { render: () => <Invoice plain /> };
export const FloatingBarHides: StoryObj = { render: () => <Invoice floating /> };
/* A page-enter gate (visibility: hidden, lifted by a timer with no event): the bar is not taken for empty. */
export const VisibilityGate: StoryObj = { render: () => <Invoice gate /> };
