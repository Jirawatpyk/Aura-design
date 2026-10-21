import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

type Lang = 'en' | 'th' | 'sv';
const meta: Meta<{ lang: Lang }> = {
  title: 'AURA/New in 5.53 Chamber-OS 165',
  args: { lang: 'sv' },
  argTypes: { lang: { control: 'inline-radio', options: ['en', 'th', 'sv'] } },
};
export default meta;

const T = {
  en: { title: 'Send the e-blast for approval', resend: 'Send for approval again', cancel: 'Cancel' },
  th: { title: 'ส่งอีเมลเพื่อขออนุมัติ', resend: 'ส่งเพื่อขออนุมัติอีกครั้งพร้อมหมายเหตุ', cancel: 'ยกเลิก' },
  sv: { title: 'Skicka utskicket för godkännande', resend: 'Skicka för godkännande igen', cancel: 'Avbryt' },
};

/* #165: a compact page's Dialog. Below 640px its footer buttons stack, full width, at least 44px tall with no
 * touchHeight, and a long label wraps; from 640px the footer is as before (right-aligned, density height, one line). */
export const SheetFooter: StoryObj<{ lang: Lang }> = {
  render: (a) => (
    <Aura.AuraProvider density="compact">
      <div lang={a.lang}>
        <Aura.Dialog
          open
          onClose={() => {}}
          title={T[a.lang].title}
          footer={
            <>
              <Aura.Button variant="secondary">{T[a.lang].cancel}</Aura.Button>
              <Aura.Button size="sm">{T[a.lang].resend}</Aura.Button>
              <Aura.Button>{T[a.lang].resend}</Aura.Button>
              {/* a footer button a Tooltip wraps gets the same treatment */}
              <Aura.Tooltip content="Sends the draft back to the member">
                <Aura.Button variant="secondary">{T[a.lang].resend}</Aura.Button>
              </Aura.Tooltip>
            </>
          }
        >
          <p>The member asked for changes to the subject line.</p>
        </Aura.Dialog>
      </div>
    </Aura.AuraProvider>
  ),
};

/* #165: fullWidth="below-sm" — an action row that stacks on phones and sits inline above; "below-md" up to 768px. */
export const FullWidthBelow: StoryObj<{ lang: Lang }> = {
  render: (a) => (
    <Aura.AuraProvider density="compact">
      <div lang={a.lang} style={{ padding: 16, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 16 }}>
        <div data-testid="row" style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Aura.Button fullWidth="below-sm">{T[a.lang].resend}</Aura.Button>
          <Aura.Button fullWidth="below-sm" variant="secondary" touchHeight>
            {T[a.lang].cancel}
          </Aura.Button>
          <Aura.Button fullWidth="below-md" variant="ghost" size="sm">
            {T[a.lang].resend}
          </Aura.Button>
        </div>
        <div data-testid="narrow" style={{ width: 200 }}>
          <Aura.Button fullWidth="below-sm">{T[a.lang].resend}</Aura.Button>
        </div>
        <div data-testid="link">
          <Aura.Button href="#approve" fullWidth="below-sm">
            {T[a.lang].resend}
          </Aura.Button>
        </div>
      </div>
    </Aura.AuraProvider>
  ),
};

/* #165 (review): a Drawer's footer on a phone — buttons stay in their row, wrap a long label, at least 44px. */
export const DrawerFooter: StoryObj<{ lang: Lang }> = {
  render: (a) => (
    <Aura.AuraProvider density="compact">
      <div lang={a.lang}>
        <Aura.Drawer
          open
          onClose={() => {}}
          title={T[a.lang].title}
          footer={
            <>
              <Aura.Button variant="secondary">{T[a.lang].cancel}</Aura.Button>
              <Aura.Button>{T[a.lang].resend}</Aura.Button>
            </>
          }
        >
          <p>The member asked for changes to the subject line.</p>
        </Aura.Drawer>
      </div>
    </Aura.AuraProvider>
  ),
};
