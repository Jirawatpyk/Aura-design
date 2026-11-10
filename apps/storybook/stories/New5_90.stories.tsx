import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.90 Chamber-OS 210' };
export default meta;

/* #210: below 640px the page list is hidden and "Page 2 of 4" is the only status — now read by screen readers too. */
export const CompactPageStatus: StoryObj = {
  render: function Render() {
    const [page, setPage] = React.useState(2);
    return (
      <div style={{ padding: 16 }}>
        <Aura.Pagination label="Invoices pages" pageCount={4} page={page} onChange={setPage} />
      </div>
    );
  },
};
