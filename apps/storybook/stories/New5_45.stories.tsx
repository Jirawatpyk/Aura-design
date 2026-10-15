import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.45 Chamber-OS 150', parameters: { layout: 'fullscreen' } };
export default meta;

const NAV = [
  { id: 'invoices', label: 'Invoices', icon: 'file-text' as const, href: '#invoices', active: true },
  { id: 'members', label: 'Members', icon: 'users' as const, href: '#members' },
];
const TEXT = {
  en: {
    credit: 'Issue credit note…',
    refund: 'Issue refund…',
    more: 'More actions for SC-2026-900001',
    status: 'Total 10,700.00 THB incl. VAT · due 22 Oct 2026',
  },
  th: {
    credit: 'ออกใบลดหนี้…',
    refund: 'คืนเงิน…',
    more: 'การดำเนินการเพิ่มเติม',
    status: 'รวม 10,700.00 บาท รวม VAT · ครบกำหนด 22 ต.ค. 2569',
  },
  sv: {
    credit: 'Utfärda kreditnota…',
    refund: 'Utfärda återbetalning…',
    more: 'Fler åtgärder',
    status: 'Totalt 10 700,00 THB inkl. moms · förfaller 22 okt 2026',
  },
};

/* #150: the invoice page. Below 640px the header's actions — the same elements, rendered once — are a bar at the
 * bottom of the screen under the status line; from 640px they sit in the header. The page's end scrolls clear. */
function Invoice(props: { lang: 'en' | 'th' | 'sv'; role?: 'manager' | 'draft' }) {
  const t = TEXT[props.lang];
  const [open, setOpen] = React.useState(false);
  const more = (
    <Aura.DropdownMenu
      label={t.more}
      items={[{ label: 'Download PDF', onSelect: () => {} }]}
      trigger={<Aura.IconButton data-testid="more" icon="ellipsis" label={t.more} variant="outline" touchHeight />}
    />
  );
  const actions =
    props.role === 'manager' ? (
      more
    ) : props.role === 'draft' ? (
      <>
        <Aura.Button data-testid="preview" variant="secondary" touchHeight>
          Preview
        </Aura.Button>
        <Aura.Button data-testid="delete" variant="secondary" touchHeight>
          Delete draft
        </Aura.Button>
        <Aura.Button data-testid="issue" touchHeight>
          Issue
        </Aura.Button>
      </>
    ) : (
      <>
        <Aura.Button data-testid="credit" variant="secondary" touchHeight onClick={() => setOpen(true)}>
          {t.credit}
        </Aura.Button>
        <Aura.Button data-testid="refund" variant="secondary" touchHeight>
          {t.refund}
        </Aura.Button>
        {more}
      </>
    );
  return (
    <div lang={props.lang}>
      <Aura.AppShell header={<strong>Chamber-OS</strong>} nav={<Aura.SideNav items={NAV} />}>
        <Aura.PageHeader
          data-testid="header"
          title="Invoice SC-2026-900001"
          meta="Paid"
          actionsFullWidthBelow="sm"
          actionsBarBelow="sm"
          actionsStatus={t.status}
          actions={actions}
        />
        <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
          {Array.from({ length: 14 }, (_, i) => (
            <Aura.Card key={i} title={'Line ' + (i + 1)}>
              <p className="aura-text-body" style={{ margin: 0 }}>
                Membership fee, corporate plan
              </p>
            </Aura.Card>
          ))}
          <Aura.TextField data-testid="note" label="Internal note" />
          <p data-testid="last" style={{ margin: 0 }}>
            End of invoice.
          </p>
        </div>
        <Aura.Dialog open={open} onClose={() => setOpen(false)} title="Issue credit note">
          Credit note for SC-2026-900001.
        </Aura.Dialog>
      </Aura.AppShell>
    </div>
  );
}

export const InvoiceEn: StoryObj = { render: () => <Invoice lang="en" /> };
export const InvoiceTh: StoryObj = { render: () => <Invoice lang="th" /> };
export const InvoiceSv: StoryObj = { render: () => <Invoice lang="sv" /> };
/* A read-only role: only the ⋯ — the status and the ⋯ share one row. */
export const Manager: StoryObj = { render: () => <Invoice lang="en" role="manager" /> };
/* A draft: three text actions, no ⋯ — they wrap as ActionBar's do, the main one last. */
export const Draft: StoryObj = { render: () => <Invoice lang="en" role="draft" /> };
