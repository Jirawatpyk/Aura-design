'use client';
/* AuraProvider with next/link: every AURA link (Button href, Breadcrumb, Pagination, Stat, SideNav, DataTable rows)
 * then navigates client-side. next/link is a function, and functions can't be passed from a Server Component, so
 * the provider lives in this small 'use client' file and the layout (a Server Component) renders it. */
import Link from 'next/link';
import type { ReactNode } from 'react';
import { AuraProvider, Toaster } from '@jirawatpyk/aura-react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    /* Thai built-in labels; dates show พ.ศ. Use locale="en" for English (and Gregorian) — or pass next-intl's locale. */
    <AuraProvider locale="th" linkComponent={Link}>
      {children}
      <Toaster />
    </AuraProvider>
  );
}
