import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { IconPlus, IconTrash2, IconUsers, IconHouse, IconFileText, IconSettings } from '@aura/react/icons';
import { th } from '@aura/react/locales/th';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.9' };
export default meta;

/* Icons as components (ready for 6.0): the same <svg> as the name, and only the icons imported are bundled. */
export const IconComponents: StoryObj = {
  render: () => (
    <Aura.Stack gap={4}>
      <Aura.Stack direction="row" gap={3} align="center" wrap>
        <Aura.Button icon={<IconPlus />}>New invoice</Aura.Button>
        <Aura.Button variant="secondary" icon="plus" data-testid="by-name">
          New invoice
        </Aura.Button>
        <Aura.IconButton icon={<IconTrash2 />} tone="danger" label="Delete row" />
        <Aura.Badge icon={<IconUsers />}>12 members</Aura.Badge>
        <IconUsers size="lg" label="Members" />
      </Aura.Stack>
      <div style={{ display: 'flex', height: 220 }}>
        <Aura.SideNav
          defaultValue="home"
          items={[
            { id: 'home', label: 'Home', icon: <IconHouse /> },
            { id: 'inv', label: 'Invoices', icon: <IconFileText />, count: 4 },
            { id: 'set', label: 'Settings', icon: <IconSettings /> },
          ]}
        />
      </div>
    </Aura.Stack>
  ),
};

/* A locale pack: the Thai strings passed to AuraProvider, as 6.0 will need. */
export const LocalePack: StoryObj = {
  render: () => (
    <Aura.AuraProvider locale="th" strings={th}>
      <Aura.Stack gap={4} style={{ maxWidth: 520 }}>
        <Aura.Pagination pageCount={8} defaultPage={3} />
        <Aura.Alert tone="info" onDismiss={() => {}} title="ต่ออายุสมาชิก">
          ใบแจ้งหนี้ฉบับใหม่พร้อมแล้ว
        </Aura.Alert>
      </Aura.Stack>
    </Aura.AuraProvider>
  ),
};
