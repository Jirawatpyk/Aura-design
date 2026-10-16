import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

type Lang = 'en' | 'th' | 'sv';
type Set = 'primary' | 'two' | 'icon' | 'three';
const meta: Meta<{ lang: Lang }> = {
  title: 'AURA/New in 5.48 Chamber-OS 153',
  parameters: { layout: 'fullscreen' },
  args: { lang: 'en' },
  argTypes: { lang: { control: 'inline-radio', options: ['en', 'th', 'sv'] } },
};
export default meta;

const T = {
  en: {
    pay: 'Record payment',
    credit: 'Issue credit note…',
    refund: 'Issue refund…',
    more: 'More actions',
    status: 'Total 10,700.00 THB incl. VAT · due 22 Oct 2026',
    prev: 'Preview',
    del: 'Delete draft',
    issue: 'Issue',
  },
  th: {
    pay: 'บันทึกการชำระ',
    credit: 'ออกใบลดหนี้…',
    refund: 'คืนเงิน…',
    more: 'การดำเนินการเพิ่มเติม',
    status: 'รวม 10,700.00 บาท รวม VAT · ครบกำหนด 22 ต.ค. 2569',
    prev: 'ดูตัวอย่าง',
    del: 'ลบฉบับร่าง',
    issue: 'ออกใบแจ้งหนี้',
  },
  sv: {
    pay: 'Registrera betalning',
    credit: 'Utfärda kreditnota…',
    refund: 'Utfärda återbetalning…',
    more: 'Fler åtgärder',
    status: 'Totalt 10 700,00 THB inkl. moms · förfaller 22 okt 2026',
    prev: 'Förhandsgranska',
    del: 'Radera utkast',
    issue: 'Utfärda',
  },
};
const NAV = [
  { id: 'invoices', label: 'Invoices', icon: 'file-text' as const, href: '#invoices', active: true },
  { id: 'members', label: 'Members', icon: 'users' as const, href: '#members' },
];
const TABS = [
  { id: 'home', label: 'Home', icon: 'house' as const, href: '#home' },
  { id: 'invoices', label: 'Invoices', icon: 'file-text' as const, href: '#invoices' },
];

/* #153: the actionsBarBelow bar is ActionBar's edge strip — full width, on the bottom edge (above a BottomNav), a top
 * border only, the home-indicator inset inside it. actionsBarLook="floating" keeps 5.45's card. */
function Page(props: { lang: Lang; set: Set; floating?: boolean; nav?: boolean }) {
  const t = T[props.lang];
  const more = (
    <Aura.DropdownMenu
      label={t.more}
      items={[{ label: 'Download PDF', onSelect: () => {} }]}
      trigger={<Aura.IconButton data-testid="more" icon="ellipsis" label={t.more} touchHeight />}
    />
  );
  const actions = {
    primary: (
      <>
        <Aura.Button data-testid="a1" touchHeight>
          {t.pay}
        </Aura.Button>
        {more}
      </>
    ),
    two: (
      <>
        <Aura.Button data-testid="a1" variant="secondary" touchHeight>
          {t.credit}
        </Aura.Button>
        <Aura.Button data-testid="a2" variant="secondary" touchHeight>
          {t.refund}
        </Aura.Button>
        {more}
      </>
    ),
    icon: more,
    three: (
      <>
        <Aura.Button data-testid="a1" variant="secondary" touchHeight>
          {t.prev}
        </Aura.Button>
        <Aura.Button data-testid="a2" variant="secondary" touchHeight>
          {t.del}
        </Aura.Button>
        <Aura.Button data-testid="a3" touchHeight>
          {t.issue}
        </Aura.Button>
      </>
    ),
  }[props.set];
  return (
    <div lang={props.lang}>
      <Aura.AppShell
        header={<strong>Chamber-OS</strong>}
        nav={<Aura.SideNav items={NAV} />}
        bottomNav={props.nav ? <Aura.BottomNav items={TABS} defaultValue="invoices" /> : undefined}
      >
        <Aura.PageHeader
          data-testid="header"
          title="Invoice SC-2026-900001"
          actionsFullWidthBelow="sm"
          actionsBarBelow="sm"
          actionsBarLook={props.floating ? 'floating' : undefined}
          actionsStatus={t.status}
          actions={actions}
        />
        <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
          {Array.from({ length: 12 }, (_, i) => (
            <Aura.Card key={i} title={'Line ' + (i + 1)}>
              <p className="aura-text-body" style={{ margin: 0 }}>
                Membership fee, corporate plan
              </p>
            </Aura.Card>
          ))}
          <Aura.TextField label="Internal note" />
          <p data-testid="last" style={{ margin: 0 }}>
            End of invoice.
          </p>
        </div>
      </Aura.AppShell>
    </div>
  );
}

export const PrimaryAndMenu: StoryObj<{ lang: Lang }> = { render: (a) => <Page lang={a.lang} set="primary" /> };
export const TwoActionsAndMenu: StoryObj<{ lang: Lang }> = { render: (a) => <Page lang={a.lang} set="two" /> };
export const MenuOnly: StoryObj<{ lang: Lang }> = { render: (a) => <Page lang={a.lang} set="icon" /> };
export const ThreeActions: StoryObj<{ lang: Lang }> = { render: (a) => <Page lang={a.lang} set="three" /> };
export const AboveBottomNav: StoryObj<{ lang: Lang }> = { render: (a) => <Page lang={a.lang} set="two" nav /> };
export const Floating: StoryObj<{ lang: Lang }> = { render: (a) => <Page lang={a.lang} set="two" floating /> };

/* #154: a short screen (320×256 CSS px: 400% zoom on a 1280×1024 desktop, or a phone held sideways). The header's
 * actions stay in its own row and the form's ActionBar sits at the form's end, so no bar covers a focused field. */
export const ShortScreen: StoryObj<{ lang: Lang }> = {
  render: (a) => {
    const t = T[a.lang];
    return (
      <div lang={a.lang}>
        <Aura.AppShell header={<strong>Chamber-OS</strong>} nav={<Aura.SideNav items={NAV} />}>
          <Aura.PageHeader
            data-testid="header"
            title="Invoice SC-2026-900001"
            actionsFullWidthBelow="sm"
            actionsBarBelow="sm"
            actionsStatus={t.status}
            actions={
              <>
                <Aura.Button variant="secondary" touchHeight>
                  {t.credit}
                </Aura.Button>
                <Aura.DropdownMenu
                  label={t.more}
                  items={[{ label: 'Download PDF', onSelect: () => {} }]}
                  trigger={<Aura.IconButton icon="ellipsis" label={t.more} touchHeight />}
                />
              </>
            }
          />
          <form
            data-testid="form"
            style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 16, marginTop: 24 }}
            onSubmit={(e) => e.preventDefault()}
          >
            {['Reference', 'Contact', 'Email', 'Phone', 'Notes'].map((l) => (
              <Aura.TextField key={l} label={l} />
            ))}
            <Aura.ActionBar status="Unsaved changes">
              <Aura.Button variant="secondary">Cancel</Aura.Button>
              <Aura.Button type="submit">Save</Aura.Button>
            </Aura.ActionBar>
          </form>
        </Aura.AppShell>
      </div>
    );
  },
};
