import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.80 TanStack Start' };
export default meta;

const ROWS = Array.from({ length: 6 }, (_, i) => ({
  id: 'INV-' + (1001 + i),
  member: ['Nordic Foods AB', 'Siam Tea Co.', 'Acme AB', 'Baltic Oy', 'Chiang Mai Craft', 'Lund Design'][i],
  amount: (i + 1) * 1200 + ' THB',
}));
const COLS = [
  { key: 'id', label: 'Invoice', width: 140, mono: true },
  { key: 'member', label: 'Member' },
  { key: 'amount', label: 'Amount', width: 140 },
];

/* A DataTable whose pages are URLs (getPageHref), under a client-side router — as with next/link or the TanStack
 * Start starter's AuraLink: the link click changes the page in place, no document load. PageDown / PageUp in the
 * grid follow the pager links, and the focus moves to the new page's first row (5.80; it fell to <body>). */
export const LinkPagingUnderARouter: StoryObj = {
  render: function Render() {
    const [url, setUrl] = React.useState('?page=1');
    const page = Number(new URLSearchParams(url).get('page')) || 1;
    const RouterLink = React.useMemo(
      () =>
        React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(function RouterLink(
          { href, onClick, ...rest },
          ref,
        ) {
          return (
            <a
              ref={ref}
              href={href}
              {...rest}
              onClick={(e) => {
                onClick?.(e);
                if (e.defaultPrevented || !href) return;
                e.preventDefault();
                /* A router renders the next page a moment later. */
                setTimeout(() => setUrl(href), 50);
              }}
            />
          );
        }),
      [],
    );
    return (
      <div style={{ maxWidth: 640 }}>
        <p data-testid="url">{url}</p>
        <Aura.DataTable
          label="Invoices"
          columns={COLS}
          rows={ROWS.slice((page - 1) * 2, page * 2)}
          rowKey="id"
          pageSize={2}
          manual
          totalRows={ROWS.length}
          page={page}
          getPageHref={(p) => '?page=' + p}
          linkComponent={RouterLink}
        />
      </div>
    );
  },
};
