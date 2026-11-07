import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.88 Chamber-OS 206' };
export default meta;

const ROWS = Array.from({ length: 12 }, (_, i) => ({ id: 'EB-' + (101 + i), subject: 'E-Blast ' + (i + 1) }));

/* #206: while a modal Dialog (or alert dialog, Drawer, Command) is open, the page behind it is inert — out of the
 * accessibility tree and unclickable — except live regions (the ActionBar's status, the Toaster). Restored on close. */
export const InertBehind: StoryObj = {
  parameters: { layout: 'fullscreen' },
  render: function Render() {
    const [open, setOpen] = React.useState(false);
    const [second, setSecond] = React.useState(false);
    const [drawer, setDrawer] = React.useState(false);
    /* Content that React swaps behind the open dialog (a list that finished loading). */
    const [late, setLate] = React.useState(0);
    React.useEffect(() => {
      if (!open) return;
      const t = setTimeout(() => setLate((n) => n + 1), 700); // after the inert walk (an idle moment, ≤ 200ms)
      return () => clearTimeout(t);
    }, [open]);
    return (
      <div style={{ padding: 16 }}>
        <Aura.Toaster />
        <div data-testid="page">
          <h1 style={{ margin: '0 0 12px' }}>Review queue</h1>
          <div
            data-testid="own-inert"
            ref={(e) => {
              if (e) e.setAttribute('inert', '');
            }}
          >
            <Aura.Button variant="secondary">Locked by the app</Aura.Button>
          </div>
          <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
            <Aura.Button data-testid="open" onClick={() => setOpen(true)}>
              Approve selected
            </Aura.Button>
            <Aura.Button data-testid="open-drawer" variant="secondary" onClick={() => setDrawer(true)}>
              Filters
            </Aura.Button>
          </div>
          <div key={late} data-testid="late-box">
            <Aura.Button data-testid="late" variant="ghost" size="sm">
              Loaded {late}
            </Aura.Button>
            {late > 0 ? (
              <span role="status" data-testid="late-status">
                Loaded again
              </span>
            ) : null}
          </div>
          <Aura.DataTable
            label="E-Blasts"
            rows={ROWS}
            rowKey="id"
            columns={[
              { key: 'id', label: 'ID', width: 120 },
              { key: 'subject', label: 'Subject' },
              {
                key: 'act',
                label: 'Actions',
                actions: true,
                width: 120,
                render: () => (
                  <Aura.Button size="sm" variant="secondary">
                    Approve
                  </Aura.Button>
                ),
              },
            ]}
          />
          <Aura.ActionBar status="3 selected">
            <Aura.Button data-testid="bar-btn">Approve selected</Aura.Button>
          </Aura.ActionBar>
        </div>
        <Aura.Dialog
          role="alertdialog"
          open={open}
          onClose={() => setOpen(false)}
          title="Approve 3 E-Blasts?"
          footer={
            <>
              <Aura.Button data-testid="cancel" variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Aura.Button>
              <Aura.Button data-testid="more" variant="secondary" onClick={() => setSecond(true)}>
                Details
              </Aura.Button>
              <Aura.Button
                data-testid="toast"
                onClick={() => {
                  Aura.toast('Approved 3 E-Blasts');
                }}
              >
                Approve
              </Aura.Button>
            </>
          }
        >
          They are sent at the scheduled time.
        </Aura.Dialog>
        <Aura.Dialog
          open={second}
          onClose={() => setSecond(false)}
          title="Details"
          footer={
            <Aura.Button data-testid="close-second" onClick={() => setSecond(false)}>
              Close
            </Aura.Button>
          }
        >
          Three E-Blasts to 1,204 members.
        </Aura.Dialog>
        <Aura.Drawer open={drawer} onClose={() => setDrawer(false)} title="Filters">
          <Aura.Button data-testid="close-drawer" onClick={() => setDrawer(false)}>
            Done
          </Aura.Button>
        </Aura.Drawer>
      </div>
    );
  },
};

/* #206: a dialog and a nested dialog open in the same first render (a deep link): the inner one stays live. */
export const NestedOnLoad: StoryObj = {
  render: function Render() {
    const [outer, setOuter] = React.useState(true);
    const [inner, setInner] = React.useState(true);
    return (
      <div>
        <Aura.Button data-testid="behind">Behind</Aura.Button>
        <Aura.Dialog open={outer} onClose={() => setOuter(false)} title="Invoice SC-2026-900001">
          The invoice.
          <Aura.Dialog
            open={inner}
            onClose={() => setInner(false)}
            title="Send reminder"
            footer={
              <Aura.Button data-testid="inner-close" onClick={() => setInner(false)}>
                Close
              </Aura.Button>
            }
          >
            Send a reminder to Acme AB?
          </Aura.Dialog>
        </Aura.Dialog>
      </div>
    );
  },
};
