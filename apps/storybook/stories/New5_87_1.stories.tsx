import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.87 long action labels' };
export default meta;

/* A label longer than the phone's row — in PageHeader's full-width actions (no IconButton beside it), its pinned strip
 * and ActionBar's edge strip — wraps inside its button (a 22px-cornered box) instead of pushing the page sideways.
 * Labels that fit still share the row as before. */
export const LongActionLabels: StoryObj = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div lang="th" style={{ padding: 16 }}>
      <Aura.PageHeader
        data-testid="header"
        title="สมาชิก"
        actionsFullWidthBelow="sm"
        actions={
          <>
            <Aura.Button data-testid="short-a" variant="secondary">
              แก้ไข
            </Aura.Button>
            <Aura.Button data-testid="short-b" variant="secondary">
              พิมพ์
            </Aura.Button>
            <Aura.Button data-testid="long">ส่งการแจ้งเตือนการต่ออายุสมาชิกให้ผู้ติดต่อทุกคนของบริษัทนี้</Aura.Button>
          </>
        }
      />
    </div>
  ),
};

export const LongStripLabel: StoryObj = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div lang="th" style={{ padding: 16 }}>
      <Aura.PageHeader
        data-testid="strip-header"
        title="ใบแจ้งหนี้"
        actionsBarBelow="sm"
        actions={
          <Aura.Button data-testid="strip-long">
            ชำระเงินทั้งหมดด้วยบัตรเครดิต พร้อมเพย์ หรือการโอนเงินผ่านบัญชีธนาคารของบริษัท
          </Aura.Button>
        }
      />
    </div>
  ),
};

export const LongEdgeLabel: StoryObj = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    /* compact density, no touchHeight: the strip's buttons stay 44px on a phone (5.54/5.55). */
    <Aura.AuraProvider density="compact">
      <div lang="th" style={{ padding: 16 }}>
        <p>รายชื่อสมาชิก</p>
        <Aura.ActionBar edgeBelow="sm" status="เลือก 3 รายการ">
          <Aura.Button data-testid="bar-long" variant="secondary">
            ส่งการแจ้งเตือนการชำระเงินให้สมาชิกทุกคนที่เลือกไว้ในรายการนี้
          </Aura.Button>
          <Aura.Button data-testid="bar-short">บันทึก</Aura.Button>
          <Aura.Button data-testid="bar-sm" size="sm" variant="ghost">
            ยกเลิก
          </Aura.Button>
        </Aura.ActionBar>
      </div>
    </Aura.AuraProvider>
  ),
};
