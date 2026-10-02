import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.26 addendum 29', parameters: { layout: 'fullscreen' } };
export default meta;

const bar = (text: string) => (
  <div style={{ background: 'var(--aura-bg-selected)', padding: 8, fontSize: 13 }}>{text}</div>
);

/* 126 (Chamber-OS addendum 29): a form board's column at the page's start edge; attributes a layout gate reads. */
export const ContainerAlign: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, paddingBlock: 16 }}>
      <Aura.Container data-testid="centred">{bar('default · centred')}</Aura.Container>
      <Aura.Container
        size="narrow"
        align="start"
        id="board"
        data-slot="layout-container"
        data-variant="form"
        aria-label="Member form"
        as="section"
      >
        {bar('narrow · start')}
      </Aura.Container>
      <div dir="rtl">
        <Aura.Container size="narrow" align="start" data-testid="rtl">
          {bar('narrow · start · RTL')}
        </Aura.Container>
      </div>
    </div>
  ),
};
