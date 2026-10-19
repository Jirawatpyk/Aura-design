import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

type Lang = 'en' | 'th' | 'sv';
const meta: Meta<{ lang: Lang }> = {
  title: 'AURA/New in 5.52 Chamber-OS 164',
  args: { lang: 'en' },
  argTypes: { lang: { control: 'inline-radio', options: ['en', 'th', 'sv'] } },
};
export default meta;

/* One column list for the page (widths are shares that add up to 100%, so the loaded table's own layout keeps them): the loaded Table, its loading state and the server TableSkeleton all read it, so
 * they can't drift (Chamber-OS 164). */
type Col = {
  key: string;
  label: string;
  width?: string;
  numeric?: boolean;
  card?: 'title' | 'action';
  skeleton?: { lines?: 1 | 2; kind?: 'text' | 'pill' | 'action'; touch?: boolean };
};
const COLS: Col[] = [
  { key: 'member', label: 'Member', width: '26%', card: 'title', skeleton: { lines: 2 } },
  { key: 'plan', label: 'Plan', width: '12%' },
  { key: 'stage', label: 'Stage', width: '18%', skeleton: { kind: 'pill' } },
  { key: 'owner', label: 'Owner', width: '18%' },
  { key: 'fee', label: 'Fee (THB)', width: '12%', numeric: true },
  { key: 'actions', label: 'Actions', width: '14%', card: 'action', skeleton: { kind: 'action', touch: true } },
];
const ROWS = [
  {
    member: 'Nordic Foods Co., Ltd.',
    sub: 'Corporate · since 2019',
    plan: 'Gold',
    stage: 'Active',
    owner: 'Anna Berg',
    fee: '107,000.00',
  },
  {
    member: 'Siam Volvo Parts',
    sub: 'SME · since 2022',
    plan: 'Silver',
    stage: 'Lapsed',
    owner: 'Somchai P.',
    fee: '53,500.00',
  },
  {
    member: 'Lund Design Studio',
    sub: 'Individual · since 2024',
    plan: 'Basic',
    stage: 'Pending',
    owner: 'Erik Lund',
    fee: '10,700.00',
  },
];

/* A function, not a component: Table reads the head's cells (labels, widths, skeleton hints) from its direct THead. */
function head() {
  return (
    <Aura.THead>
      <Aura.Tr>
        {COLS.map((c) => (
          <Aura.Th
            key={c.key}
            numeric={c.numeric}
            card={c.card}
            skeleton={c.skeleton}
            style={c.width ? { width: c.width } : undefined}
          >
            {c.label}
          </Aura.Th>
        ))}
      </Aura.Tr>
    </Aura.THead>
  );
}

function Loaded() {
  return (
    <Aura.Table caption="Members" captionHidden stackBelow="sm">
      {head()}
      <Aura.TBody>
        {ROWS.map((r) => (
          <Aura.Tr key={r.member}>
            <Aura.Td card="title">
              {r.member}
              <br />
              <span className="aura-text-caption">{r.sub}</span>
            </Aura.Td>
            <Aura.Td>{r.plan}</Aura.Td>
            <Aura.Td>
              <Aura.StatusPill>{r.stage}</Aura.StatusPill>
            </Aura.Td>
            <Aura.Td>{r.owner}</Aura.Td>
            <Aura.Td numeric>{r.fee}</Aura.Td>
            <Aura.Td card="action">
              <Aura.Button size="sm" variant="secondary" touchHeight>
                Open
              </Aura.Button>
            </Aura.Td>
          </Aura.Tr>
        ))}
      </Aura.TBody>
    </Aura.Table>
  );
}

/* #164: the same list loaded, loading (Table `loading`), and as the server's TableSkeleton. Every column's left edge
 * matches; below 640px all three stack into the same cards. */
export const LoadingTable: StoryObj<{ lang: Lang }> = {
  parameters: { layout: 'fullscreen' },
  render: (a) => (
    <div lang={a.lang} style={{ padding: 16, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 24 }}>
      <p className="aura-text-caption" role="status">
        Loading members…
      </p>
      <div data-testid="loaded">
        <Loaded />
      </div>
      <div data-testid="loading">
        <Aura.Table caption="Members" captionHidden stackBelow="sm" loading loadingRows={8}>
          {head()}
          <Aura.TBody>
            <Aura.Tr>
              <Aura.Td>never shown</Aura.Td>
            </Aura.Tr>
          </Aura.TBody>
        </Aura.Table>
      </div>
      <div data-testid="server">
        <Aura.TableSkeleton
          rows={8}
          stackBelow="sm"
          columns={COLS.map((c) => ({
            label: c.label,
            width: c.width,
            numeric: c.numeric,
            card: c.card,
            skeleton: c.skeleton,
          }))}
        />
      </div>
    </div>
  ),
};
