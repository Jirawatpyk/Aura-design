import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.62 Chamber-OS 177' };
export default meta;

/* #177: the member Dashboard's header — the member number, plan and status chips in `meta` — laid out as a wrapping
 * row 8px apart; a plain-text meta stays a line. */
export const MetaChips: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 32 }}>
      <div data-testid="chips">
        <Aura.PageHeader
          title="Welcome back, Anna"
          meta={
            <>
              <Aura.Badge variant="outline">Member No. 10482</Aura.Badge>
              <Aura.Badge variant="solid">Corporate Gold</Aura.Badge>
              <Aura.StatusPill tone="ready">Full benefits</Aura.StatusPill>
            </>
          }
        />
      </div>
      <div data-testid="sentence">
        <Aura.PageHeader
          title="Budget 2027"
          meta={
            <>
              Last edited by <strong>Anna</strong> {3} min ago in <a href="#finance">Finance</a>.
            </>
          }
        />
      </div>
      <div data-testid="text">
        <Aura.PageHeader title="Members" meta="128 members · updated 3 min ago" />
      </div>
    </div>
  ),
};
