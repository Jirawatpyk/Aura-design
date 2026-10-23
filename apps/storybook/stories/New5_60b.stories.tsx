import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.60 Chamber-OS 174-175', parameters: { layout: 'fullscreen' } };
export default meta;

const PLANS = [
  { name: 'Diamond Partnership', tier: 'Corporate', year: 2026, members: 12, fee: '450,000.00', status: 'Active' },
  { name: 'Gold Membership', tier: 'Corporate', year: 2026, members: 84, fee: '95,000.00', status: 'Active' },
  { name: 'Scandinavian Hospitality', tier: 'Partner', year: 2025, members: 7, fee: '60,000.00', status: 'Closed' },
  { name: 'Starter', tier: 'SME', year: 2026, members: 41, fee: '18,000.00', status: 'Active' },
];

/* #174: the plans list in a 703px box (a 1024px page with the sidebar open). Words wrap whole; the document number
 * (wrap="none") stays on one line; the URL column (wrap="anywhere") may break inside a word. */
export const PlansList: StoryObj = {
  render: () => (
    <div data-testid="box" style={{ width: 703, padding: 0 }}>
      <Aura.Table caption="Plans" captionHidden>
        <Aura.THead>
          <Aura.Tr>
            <Aura.Th>Plan</Aura.Th>
            <Aura.Th numeric>Members</Aura.Th>
            <Aura.Th numeric>Annual fee (THB)</Aura.Th>
            <Aura.Th>Invoice</Aura.Th>
            <Aura.Th>Status</Aura.Th>
          </Aura.Tr>
        </Aura.THead>
        <Aura.TBody>
          {PLANS.map((p, i) => (
            <Aura.Tr key={p.name}>
              <Aura.Td data-testid={'name-' + i}>{p.name}</Aura.Td>
              <Aura.Td numeric>{p.members}</Aura.Td>
              <Aura.Td numeric>{p.fee}</Aura.Td>
              <Aura.Td wrap="none" mono data-testid={'doc-' + i}>
                {'SC-00007' + i}
              </Aura.Td>
              <Aura.Td>{p.status}</Aura.Td>
            </Aura.Tr>
          ))}
        </Aura.TBody>
      </Aura.Table>
      <div data-testid="urls" style={{ width: 320, marginTop: 24 }}>
        <Aura.Table caption="Sites" captionHidden>
          <Aura.TBody>
            <Aura.Tr>
              <Aura.Td wrap="anywhere" data-testid="url">
                https://scandinavian-thai-precision-engineering.co.th/members
              </Aura.Td>
              <Aura.Td>Active</Aura.Td>
            </Aura.Tr>
          </Aura.TBody>
        </Aura.Table>
      </div>
    </div>
  ),
};

/* #175: a stickyHeader Table wider than its box, under a 56px shell bar offset. The table scrolls sideways in its box,
 * so its header can't pin to the page: it sits in flow above the first row. */
export const WideSticky: StoryObj = {
  render: () => (
    <div style={{ ['--aura-shell-bar-height' as string]: '56px', padding: 16 }}>
      <div data-testid="wide" style={{ width: 360 }}>
        <Aura.Table caption="Plans (wide)" captionHidden stickyHeader>
          <Aura.THead>
            <Aura.Tr>
              {['Plan', 'Tier', 'Year', 'Members', 'Annual fee (THB)', 'Invoice', 'Status'].map((h) => (
                <Aura.Th key={h} wrap="none">
                  {h}
                </Aura.Th>
              ))}
            </Aura.Tr>
          </Aura.THead>
          <Aura.TBody>
            {PLANS.map((p) => (
              <Aura.Tr key={p.name}>
                {[p.name, p.tier, p.year, p.members, p.fee, 'SC-000071', p.status].map((v, j) => (
                  <Aura.Td key={j} wrap="none">
                    {v}
                  </Aura.Td>
                ))}
              </Aura.Tr>
            ))}
          </Aura.TBody>
        </Aura.Table>
      </div>
      <div style={{ height: 1200 }} />
    </div>
  ),
};
