import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.83 Chamber-OS 195-196' };
export default meta;

const EVENTS = [
  'Annual Gala 2026',
  'Annual Meeting',
  'Business Breakfast — Bangkok',
  'Business Breakfast — Chiang Mai',
  'Christmas Lunch',
  'Midsummer Party',
];

/* #195: a Combobox with server search (onSearch + loading). One status region stays mounted while the list is open;
 * it says the loading text, then the result count or the empty text. The visible note is unchanged. */
export const ServerSearchAnnounces: StoryObj = {
  render: function Render() {
    const [options, setOptions] = React.useState(EVENTS);
    const [loading, setLoading] = React.useState(false);
    const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    return (
      <div style={{ maxWidth: 360, paddingBottom: 260 }}>
        <Aura.Combobox
          label="Event"
          options={options}
          loading={loading}
          loadingText="Searching events…"
          emptyText="No events match"
          onSearch={(q) => {
            setLoading(true);
            clearTimeout(timer.current);
            timer.current = setTimeout(() => {
              setOptions(EVENTS.filter((e) => e.toLowerCase().includes(q.toLowerCase())));
              setLoading(false);
            }, 400);
          }}
        />
      </div>
    );
  },
};

/* #195 in a Dialog, starting with no options (a server search that loads on typing): the region is inside the dialog,
 * and opening the list says nothing until the person types. */
export const ServerSearchInDialog: StoryObj = {
  render: function Render() {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(false);
    const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    return (
      <>
        <Aura.Button onClick={() => setOpen(true)}>Add invoice line</Aura.Button>
        <Aura.Dialog open={open} onClose={() => setOpen(false)} title="Invoice line">
          <div style={{ paddingBottom: 220 }}>
            <Aura.Combobox
              label="Event"
              options={options}
              loading={loading}
              loadingText="Searching events…"
              emptyText="No events match"
              onSearch={(q) => {
                setLoading(true);
                clearTimeout(timer.current);
                timer.current = setTimeout(() => {
                  setOptions(q ? EVENTS.filter((e) => e.toLowerCase().includes(q.toLowerCase())) : []);
                  setLoading(false);
                }, 300);
              }}
            />
          </div>
        </Aura.Dialog>
      </>
    );
  },
};

/* #196: dismissLabel names the close button for what it dismisses. */
export const AlertDismissLabel: StoryObj = {
  render: function Render() {
    const [shown, setShown] = React.useState([true, true]);
    return (
      <div style={{ display: 'grid', gap: 12, maxWidth: 560 }}>
        {shown[0] ? (
          <Aura.Alert
            tone="warning"
            title="Starter template"
            onDismiss={() => setShown([false, shown[1]!])}
            dismissLabel="Dismiss starter warning for Monthly Newsletter"
          >
            Monthly Newsletter still uses the starter content.
          </Aura.Alert>
        ) : null}
        {shown[1] ? (
          <Aura.Alert tone="info" onDismiss={() => setShown([shown[0]!, false])}>
            Changes are saved as you type.
          </Aura.Alert>
        ) : null}
      </div>
    );
  },
};
