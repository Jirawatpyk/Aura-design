import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.26 addendum 32', parameters: { layout: 'fullscreen' } };
export default meta;

const ROWS = Array.from({ length: 40 }, (_, i) => ({
  id: 'P-' + (100 + i),
  plan: 'Plan ' + (i + 1),
  fee: '฿' + (i + 1) * 1000,
}));
const Plans = (p: { sticky?: boolean; maxHeight?: number; bleed?: boolean; caption: string; wide?: boolean }) => (
  <Aura.Table caption={p.caption} captionHidden stickyHeader={p.sticky} maxHeight={p.maxHeight} bleed={p.bleed}>
    <Aura.THead>
      <Aura.Tr>
        <Aura.Th>PLAN</Aura.Th>
        <Aura.Th>FEE</Aura.Th>
        {p.wide ? <Aura.Th style={{ minWidth: 900 }}>NOTES</Aura.Th> : null}
      </Aura.Tr>
    </Aura.THead>
    <Aura.TBody>
      {ROWS.map((r) => (
        <Aura.Tr key={r.id}>
          <Aura.Td>{r.plan}</Aura.Td>
          <Aura.Td>{r.fee}</Aura.Td>
          {p.wide ? <Aura.Td>Renews yearly</Aura.Td> : null}
        </Aura.Tr>
      ))}
    </Aura.TBody>
  </Aura.Table>
);

/* 129 (Chamber-OS addendum 32): /admin/plans — column labels pinned under the shell's top bar while the page scrolls. */
export const StickyHeaderPage: StoryObj = {
  render: () => (
    <Aura.AppShell header={<strong>Chamber OS</strong>}>
      <Aura.Card data-testid="card">
        <div className="aura-text-caption">Status All</div>
        <Plans caption="Plans" sticky bleed />
      </Aura.Card>
      <div style={{ height: 600 }} />
    </Aura.AppShell>
  ),
};

/* In a box: maxHeight scrolls the rows inside it; and the default (no stickyHeader) stays put. */
export const StickyHeaderBox: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 24, padding: 24 }}>
      <div data-testid="box">
        <Plans caption="Boxed plans" sticky maxHeight={240} />
      </div>
      <div data-testid="wide" style={{ maxWidth: 480 }}>
        <Plans caption="Wide plans" sticky wide />
      </div>
      <div data-testid="grow" style={{ maxWidth: 480 }}>
        <Plans caption="Growing plans" sticky />
      </div>
      <div data-testid="stacked">
        <Aura.Table
          caption="Stacked plans"
          captionHidden
          stickyHeader
          maxHeight={200}
          stackBelow="md"
          stackStyle="cards"
        >
          <Aura.THead>
            <Aura.Tr>
              <Aura.Th>PLAN</Aura.Th>
              <Aura.Th>FEE</Aura.Th>
            </Aura.Tr>
          </Aura.THead>
          <Aura.TBody>
            {ROWS.slice(0, 8).map((r) => (
              <Aura.Tr key={r.id}>
                <Aura.Td>{r.plan}</Aura.Td>
                <Aura.Td>{r.fee}</Aura.Td>
              </Aura.Tr>
            ))}
          </Aura.TBody>
        </Aura.Table>
        <p data-testid="after">After the table</p>
      </div>
      <div data-testid="plain">
        <Plans caption="Plain plans" />
      </div>
    </div>
  ),
};
