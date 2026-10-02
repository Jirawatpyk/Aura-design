import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.28' };
export default meta;

const LONG_A = 'Member: Midsommar Hospitality and Conference Centre Co., Ltd. (Head Office, Bangkok)';
const LONG_B = 'Member: Midsommar Hospitality and Conference Centre Co., Ltd. (Branch Office, Chiang Mai)';

/* 132–133 (Chamber-OS addenda 35–36): applied-filter chips at their text's width, the full text when cut, and a
 * touch-height "Clear all". */
export const FilterChips: StoryObj = {
  render: () => {
    const [q, setQ] = React.useState('');
    const [long, setLong] = React.useState(LONG_A);
    const none = () => {};
    return (
      <div style={{ display: 'grid', gap: 16 }}>
        <Aura.FilterBar
          label="Request filters"
          search={q}
          onSearchChange={setQ}
          searchLabel="Search requests"
          filters={[
            { id: 'sub', label: 'Submitted: 28 Aug – 3 Sept 2026', onRemove: none },
            { id: 'mem', label: 'Member: Midsommar Hospitality Co., Ltd.', onRemove: none },
            { id: 'plan', label: 'Plan: Premium Corporate (2026)', onRemove: none },
            {
              id: 'long',
              label: long,
              onRemove: none,
            },
          ]}
          onClearAll={none}
        />
        {/* Inside a wrapper in a grid: a long chip mustn't widen the page. */}
        <div style={{ display: 'grid' }}>
          <div data-testid="wrapped-bar">
            <Aura.FilterBar
              label="Wrapped filters"
              filters={[{ id: 'w', label: long, onRemove: none }]}
              onClearAll={none}
            />
          </div>
        </div>
        <Aura.Button size="sm" variant="secondary" onClick={() => setLong(LONG_B)}>
          Rename
        </Aura.Button>
        <div data-testid="plain">
          <Aura.Tag onRemove={none}>Member: Midsommar Hospitality Co., Ltd.</Aura.Tag>
        </div>
      </div>
    );
  },
};
