import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.57 Chamber-OS 169' };
export default meta;

/* #169: the body's only control sits in a closed <details>. The modal opens with focus on the <summary> (never on the
 * hidden Copy button), Escape closes it and focus goes back to the trigger; Tab never reaches Copy until it opens. */
const body = (
  <details data-testid="more">
    <summary>Technical details</summary>
    <p>Member ID 10482</p>
    <button type="button" data-testid="copy">
      Copy
    </button>
  </details>
);

function Demo(props: { kind: 'drawer' | 'dialog' }) {
  const [open, setOpen] = React.useState(false);
  const M = props.kind === 'drawer' ? Aura.Drawer : Aura.Dialog;
  return (
    <>
      <Aura.Button data-testid="trigger" onClick={() => setOpen(true)}>
        All company details
      </Aura.Button>
      <M open={open} onClose={() => setOpen(false)} title="Company details">
        {body}
      </M>
    </>
  );
}

export const DrawerClosedDetails: StoryObj = { render: () => <Demo kind="drawer" /> };
export const DialogClosedDetails: StoryObj = { render: () => <Demo kind="dialog" /> };

/* A first control that forwards focus to an inner field (an editor-style wrapper): focus stays on the inner field. */
function Forwarding() {
  const outer = React.useRef<HTMLDivElement>(null);
  const inner = React.useRef<HTMLInputElement>(null);
  React.useLayoutEffect(() => {
    const o = outer.current!;
    const f = (e: FocusEvent) => e.target === o && inner.current!.focus();
    o.addEventListener('focus', f);
    return () => o.removeEventListener('focus', f);
  }, []);
  return (
    <div ref={outer} data-testid="wrapper" tabIndex={0}>
      <input ref={inner} data-testid="inner" aria-label="Note" tabIndex={-1} />
    </div>
  );
}
export const DialogForwardingFirst: StoryObj = {
  render: function Render() {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Aura.Button data-testid="trigger" onClick={() => setOpen(true)}>
          Edit note
        </Aura.Button>
        <Aura.Dialog open={open} onClose={() => setOpen(false)} title="Note">
          <Forwarding />
          {body}
        </Aura.Dialog>
      </>
    );
  },
};

/* An open <details> first in the body: its summary is the first Tab stop, so the Drawer opens there. */
export const DrawerOpenDetails: StoryObj = {
  render: function Render() {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Aura.Button data-testid="trigger" onClick={() => setOpen(true)}>
          Settings
        </Aura.Button>
        <Aura.Drawer open={open} onClose={() => setOpen(false)} title="Settings">
          <details open data-testid="advanced">
            <summary>Advanced</summary>
            <Aura.TextField label="Sender name" data-testid="sender" />
          </details>
        </Aura.Drawer>
      </>
    );
  },
};

/* A Popover whose content is a closed <details> and one button after it: opens on the summary; Tab wraps between
 * the summary and the button, never to Copy. */
export const PopoverClosedDetails: StoryObj = {
  render: () => (
    <Aura.Popover label="Member" trigger={<Aura.Button data-testid="trigger">Member</Aura.Button>}>
      <div style={{ padding: 12 }}>
        {body}
        <button type="button" data-testid="after">
          Open record
        </button>
      </div>
    </Aura.Popover>
  ),
};
