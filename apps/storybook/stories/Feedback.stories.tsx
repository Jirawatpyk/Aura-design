import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/Feedback' };
export default meta;

export const Alerts: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 640 }}>
      <Aura.Alert tone="info" title="Tokens update on Friday">AURA 4.1 adds form, overlay and layout tokens.</Aura.Alert>
      <Aura.Alert tone="success" title="Published to npm" onDismiss={() => {}}>@aura/tokens 4.1.0 is live.</Aura.Alert>
      <Aura.Alert tone="warning" title="3 components still use hex colours">Token-lint will fail the build from the next release.</Aura.Alert>
      <Aura.Alert tone="danger" title="Contrast check failed">Fix the pair before merging.</Aura.Alert>
    </div>
  ),
};
export const StatusPills: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {['To Do', 'In Progress', 'Ready', 'Blocked'].map((s) => <Aura.StatusPill key={s}>{s}</Aura.StatusPill>)}
    </div>
  ),
};
export const Toasts: StoryObj = {
  render: () => (
    <div>
      <Aura.Toaster />
      <Aura.Button variant="secondary" onClick={() => Aura.toast({ tone: 'success', title: 'Token published', description: 'aura-fg-danger is live in 4.1.0.' })}>Show Toast</Aura.Button>
    </div>
  ),
};
export const Tooltips: StoryObj = {
  render: () => (
    <div style={{ paddingTop: 48, display: 'flex', gap: 12 }}>
      <Aura.Tooltip content="Copy token name" open><Aura.IconButton icon="copy" label="Copy" /></Aura.Tooltip>
      <Aura.Tooltip content="Download tokens.json"><Aura.IconButton icon="download" label="Download" /></Aura.Tooltip>
    </div>
  ),
};
export const DialogConfirm: StoryObj = {
  render: function Render() {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Aura.Button variant="secondary" icon="trash-2" onClick={() => setOpen(true)}>Delete Token</Aura.Button>
        <Aura.Dialog open={open} onClose={() => setOpen(false)} size="sm" role="alertdialog"
          title="Delete aura-accent-lime?" description="Three components use this token."
          footer={<>
            <Aura.Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Aura.Button>
            <Aura.Button onClick={() => setOpen(false)}>Delete Token</Aura.Button>
          </>} />
      </>
    );
  },
};
