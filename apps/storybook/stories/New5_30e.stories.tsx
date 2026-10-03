import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.30 addenda 39-40' };
export default meta;

const ITEMS = [
  { label: 'Send reminder', icon: 'mail' as const },
  { label: 'Mark paid', icon: 'check' as const },
  { label: 'Void', icon: 'trash-2' as const },
];

/* 136 (Chamber-OS addendum 39): an open menu moves with its trigger on scroll and resize, and closes only once the
 * trigger is out of view — the page's, or a scrolling box's around it. */
function InDialog() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Aura.Button variant="secondary" onClick={() => setOpen(true)}>
        Open dialog
      </Aura.Button>
      <Aura.Dialog open={open} onClose={() => setOpen(false)} title="Invoice INV-0141">
        <div data-testid="dialog-scroll" style={{ height: 200, overflow: 'auto' }}>
          <Aura.DropdownMenu trigger={<Aura.Button variant="secondary">Dialog actions</Aura.Button>} items={ITEMS} />
          <div style={{ height: 800 }} />
        </div>
      </Aura.Dialog>
    </>
  );
}

export const MenuOnScroll: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <InDialog />
      {/* A fixed bar inside a scrolling wrapper: the wrapper doesn't clip it, so a page scroll keeps its menu open. */}
      <div data-testid="fixed-wrap" style={{ height: 60, overflow: 'auto' }}>
        <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 5 }}>
          <Aura.DropdownMenu trigger={<Aura.Button variant="secondary">Bar actions</Aura.Button>} items={ITEMS} />
        </div>
      </div>
      {/* overflow-x: clip only clips sideways: a trigger below the 40px box is still in view. */}
      <div style={{ height: 40, overflowX: 'clip' }}>
        <div style={{ height: 40 }} />
        <Aura.DropdownMenu trigger={<Aura.Button variant="secondary">Below a clip</Aura.Button>} items={ITEMS} />
      </div>
      <div data-testid="page-menu">
        <Aura.DropdownMenu trigger={<Aura.Button variant="secondary">Invoice actions</Aura.Button>} items={ITEMS} />
      </div>
      <div data-testid="box" style={{ height: 160, overflow: 'auto', border: '1px solid var(--aura-border-default)' }}>
        <div style={{ height: 40 }} />
        <Aura.DropdownMenu trigger={<Aura.Button variant="secondary">Row actions</Aura.Button>} items={ITEMS} />
        <div style={{ height: 600 }} />
      </div>
      {/* 137 (Chamber-OS addendum 40): StatusPill is 500 whatever its parent's weight; Badge stays 600. */}
      <h1 data-testid="heading" style={{ display: 'flex', gap: 12, alignItems: 'center', fontWeight: 700 }}>
        INV-2026-0141 <Aura.StatusPill tone="ready">Paid</Aura.StatusPill> <Aura.Badge>Corporate</Aura.Badge>
      </h1>
      <p data-testid="plain">
        <Aura.StatusPill tone="blocked">Overdue</Aura.StatusPill>
      </p>
      <div style={{ height: 2000 }} />
    </div>
  ),
};
