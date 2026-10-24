import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.61 Chamber-OS 176' };
export default meta;

/* #176: a full-width actions row with a visually hidden description beside a button (aria-describedby), as on the
 * admin credit-note page. Below 640px the description keeps its 1px box and the page doesn't scroll sideways. */
export const HiddenDescription: StoryObj = {
  render: () => (
    <>
      {/* Tailwind's sr-only, as an app defines it */}
      <style>
        {
          '.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }'
        }
      </style>
      <Aura.PageHeader
        title="Credit note CN-2026-0044"
        actionsFullWidthBelow="sm"
        actions={
          <>
            <Aura.Button variant="secondary">Download PDF</Aura.Button>
            <Aura.Button aria-describedby="email-desc">Email a copy</Aura.Button>
            <span id="email-desc" className="aura-sr-only" data-testid="desc">
              Sends the credit note as a PDF to the billing contact on file, Nordic Timber Oy accounts payable
              department.
            </span>
            {/* Radix / React Aria VisuallyHidden: inline styles only, no class */}
            <span
              data-testid="desc-inline"
              style={{
                position: 'absolute',
                border: 0,
                width: 1,
                height: 1,
                padding: 0,
                margin: -1,
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
              }}
            >
              Inline-styled visually hidden text as Radix renders it, long enough to widen the page if it took a share.
            </span>
            <span className="sr-only" data-testid="desc-tw">
              Tailwind-style visually hidden text that is just as long as the other one, in English, Swedish and Thai.
            </span>
          </>
        }
      />
    </>
  ),
};

/* The same actions in PageHeader's phone bar (actionsBarBelow). */
export const HiddenDescriptionBar: StoryObj = {
  render: () => (
    <Aura.PageHeader
      title="Credit note CN-2026-0044"
      actionsBarBelow="sm"
      actions={
        <>
          <Aura.Button variant="secondary">Download PDF</Aura.Button>
          <Aura.Button aria-describedby="email-desc-bar">Email a copy</Aura.Button>
          <span id="email-desc-bar" className="aura-sr-only" data-testid="desc">
            Sends the credit note as a PDF to the billing contact on file, Nordic Timber Oy accounts payable department.
          </span>
        </>
      }
    />
  ),
};
