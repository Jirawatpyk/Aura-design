import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.44 Chamber-OS 149' };
export default meta;

const MORE = [
  { label: 'Download PDF', onSelect: () => {} },
  { label: 'Void invoice', tone: 'danger' as const, onSelect: () => {} },
];
const more = (label: string) => (
  <Aura.DropdownMenu
    label={label}
    items={MORE}
    trigger={<Aura.IconButton icon="ellipsis" label={label} variant="outline" touchHeight />}
  />
);
function Invoice(props: { id: string; credit: string; refund: string; more: string; lang?: string }) {
  return (
    <div data-testid={props.id} lang={props.lang}>
      <Aura.PageHeader
        title="SC-2026-000119"
        meta="Paid · 12,400 SEK"
        actionsFullWidthBelow="sm"
        actions={
          <>
            <Aura.Button variant="secondary" touchHeight>
              {props.credit}
            </Aura.Button>
            <Aura.Button variant="secondary" touchHeight>
              {props.refund}
            </Aura.Button>
            {more(props.more)}
          </>
        }
      />
    </div>
  );
}

/* #149: the paid invoice's actions on a phone — two outlined actions and the ⋯ menu share one row. The buttons wrap
 * their labels inside (never "Issue cred…"); the ⋯ keeps 44px at the end. In Thai and Swedish too. */
export const InvoiceActions: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 40, padding: 16 }}>
      <Invoice id="en" credit="Issue credit note…" refund="Issue refund…" more="More actions" />
      <Invoice id="th" lang="th" credit="ออกใบลดหนี้…" refund="คืนเงิน…" more="การดำเนินการเพิ่มเติม" />
      <Invoice id="sv" lang="sv" credit="Utfärda kreditnota…" refund="Utfärda återbetalning…" more="Fler åtgärder" />
      {/* A manager sees only the ⋯: it keeps its size. */}
      <div data-testid="lone">
        <Aura.PageHeader title="SC-2026-000120" actionsFullWidthBelow="sm" actions={more('More actions')} />
      </div>
      {/* No icon button: as in 5.37, the third action takes a row of its own. */}
      <div data-testid="three">
        <Aura.PageHeader
          title="api.example.co.th"
          actionsFullWidthBelow="sm"
          actions={
            <>
              <Aura.Button variant="secondary">Mute</Aura.Button>
              <Aura.Button variant="secondary">Maintenance</Aura.Button>
              <Aura.Button>Edit monitors</Aura.Button>
            </>
          }
        />
      </div>
    </div>
  ),
};
