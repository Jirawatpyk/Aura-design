import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.6' };
export default meta;

/* 52: only rows awaiting review can be ticked (Chamber-OS E-Blast queue). */
interface Blast {
  id: string;
  subject: string;
  status: string;
}
const BLASTS: Blast[] = [
  { id: 'EB-1', subject: 'October mixer', status: 'Awaiting marketing review' },
  { id: 'EB-2', subject: 'Trade mission', status: 'In design' },
  { id: 'EB-3', subject: 'Member news', status: 'Awaiting marketing review' },
  { id: 'EB-4', subject: 'Gala save the date', status: 'Member approved' },
  { id: 'EB-5', subject: 'Survey', status: 'Changes requested' },
];
export const SelectableRows: StoryObj = {
  render: () => {
    const [sel, setSel] = React.useState<(string | number)[]>([]);
    return (
      <Aura.Stack gap={3}>
        <Aura.Button variant="secondary" onClick={() => setSel(['EB-2', 'EB-3'])}>
          Pass in EB-2 and EB-3
        </Aura.Button>
        <p className="aura-text-body" data-testid="sel">
          Selected: {sel.join(',') || '—'}
        </p>
        <Aura.DataTable
          label="E-Blast queue"
          rows={BLASTS}
          selectable
          selected={sel}
          onSelectionChange={setSel}
          isRowSelectable={(r) => r.status === 'Awaiting marketing review'}
          rowSelectDisabledLabel={(r) => r.id + ': ' + r.status + ', not selectable'}
          columns={[
            { key: 'id', label: 'ID', width: 90, mono: true },
            { key: 'subject', label: 'SUBJECT', width: 200 },
            { key: 'status', label: 'STATUS' },
          ]}
        />
      </Aura.Stack>
    );
  },
};

/* 53–56: rich toasts with two actions, a top-centred toaster under a 56px bar, Alt+T, focus return. */
export const RichToasts: StoryObj = {
  render: () => {
    const [log, setLog] = React.useState('');
    return (
      <div>
        <div style={{ height: 56, background: 'var(--aura-bg-surface-strong)' }} data-testid="topbar" />
        <Aura.Stack direction="row" gap={2} style={{ padding: 16 }}>
          <Aura.Button
            onClick={() =>
              Aura.toast.warning('2 bills need voiding', {
                id: 'supersede',
                duration: Infinity,
                description: (
                  <>
                    <p>
                      SC-101 — <a href="#sc-101">Open SC-101</a>
                    </p>
                    <p>
                      SC-102 — <a href="#sc-102">Open SC-102</a>
                    </p>
                  </>
                ),
                actions: [
                  { label: 'Void next', dismiss: false, onClick: () => setLog('void next') },
                  { label: 'All bills', href: '#bills' },
                ],
              })
            }
          >
            Supersede warning
          </Aura.Button>
          <Aura.Button
            variant="secondary"
            onClick={() =>
              Aura.toast({ title: 'Invoice sent', action: { label: 'Undo', onClick: () => setLog('undo') } })
            }
          >
            Send invoice
          </Aura.Button>
        </Aura.Stack>
        <p className="aura-text-body" data-testid="log" style={{ padding: '0 16px' }}>
          {log}
        </p>
        <Aura.Toaster position="top-center" offset={64} />
      </div>
    );
  },
};
