import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.32 icon tips' };
export default meta;

/* 5.32: icon buttons, Pagination's arrows, icon-only segments and cut Tags show their name in AURA's own tip — on
 * hover and on keyboard focus — instead of the browser's native title (no keyboard, no theme, slow). */
export const IconTips: StoryObj = {
  render: () => {
    const [copied, setCopied] = React.useState(false);
    const [page, setPage] = React.useState(3);
    const [on, setOn] = React.useState(false);
    const [clicks, setClicks] = React.useState<string[]>([]);
    const [rows, setRows] = React.useState(['INV-0141', 'INV-0142']);
    return (
      <div style={{ display: 'grid', gap: 24, padding: '64px 24px', maxWidth: 640 }}>
        <div data-testid="toolbar" style={{ display: 'flex', gap: 8 }}>
          <Aura.IconButton icon="pencil" label="Edit invoice" />
          <Aura.IconButton icon="download" label="Download PDF" />
          <Aura.IconButton icon="trash-2" label="Delete invoice" tone="danger" />
          <Aura.IconButton icon="copy" label={copied ? 'Copied' : 'Copy link'} onClick={() => setCopied(true)} />
        </div>
        <div data-testid="wrapped" style={{ display: 'flex', gap: 8 }}>
          <Aura.Tooltip content="Archive moves it out of the list; nothing is deleted.">
            <Aura.IconButton icon="folder" label="Archive" />
          </Aura.Tooltip>
          <Aura.IconButton icon="settings" label="Settings" title="Workspace settings" />
          <Aura.DropdownMenu
            trigger={<Aura.IconButton icon="ellipsis" label="More actions" />}
            items={[{ label: 'Duplicate' }, { label: 'Void', tone: 'danger' }]}
          />
        </div>
        <div data-testid="pager">
          <Aura.Pagination pageCount={8} page={page} onChange={setPage} />
        </div>
        <div data-testid="segments">
          <Aura.SegmentedControl
            label="View"
            options={[
              { value: 'table', label: 'Table view', icon: 'columns-3', iconOnly: true },
              { value: 'cards', label: 'Card view', icon: 'layout-dashboard', iconOnly: true },
            ]}
            defaultValue="table"
          />
        </div>
        <div data-testid="tags" style={{ display: 'flex', gap: 8, maxWidth: 360 }}>
          <Aura.Tag selected={on} onClick={() => setOn(!on)}>
            Branch: Head Office and Bangkok Metropolitan Region
          </Aura.Tag>
          <Aura.Tag>Tier: SME</Aura.Tag>
        </div>
        {/* Row actions 12px apart: the tip over the upper one must not swallow its hover or click. */}
        <div data-testid="rows" style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
          {['Row 1', 'Row 2', 'Row 3'].map((r) => (
            <Aura.IconButton
              key={r}
              icon="ellipsis"
              label={'More for ' + r}
              onClick={() => setClicks((c) => c.concat(r))}
            />
          ))}
          <output data-testid="clicks">{clicks.join(',')}</output>
        </div>
        {/* A focusable container (like AppShell's main) holding an icon button. */}
        <div data-testid="region" tabIndex={-1} style={{ padding: 8 }}>
          <Aura.IconButton icon="pencil" label="Edit in region" />
        </div>
        <div data-testid="removable" style={{ display: 'flex', gap: 8 }}>
          {rows.map((r) => (
            <Aura.IconButton
              key={r}
              icon="trash-2"
              label={'Delete ' + r}
              onKeyDown={(e) => {
                if (e.key === 'Delete') setRows((x) => x.filter((y) => y !== r));
              }}
            />
          ))}
        </div>
        <div lang="th" data-testid="thai">
          <Aura.IconButton icon="pencil" label="แก้ไขใบแจ้งหนี้" />
        </div>
        <div data-testid="edge" style={{ position: 'fixed', top: 4, left: 4 }}>
          <Aura.IconButton icon="menu" label="Open navigation" />
        </div>
      </div>
    );
  },
};
