'use client';
/* AuraProvider with next/link: every AURA link (Button href, Breadcrumb, Pagination, Stat, SideNav, DataTable rows)
 * then navigates client-side. next/link is a function, and functions can't be passed from a Server Component, so
 * the provider lives in this small 'use client' file and the layout (a Server Component) renders it. */
import Link from 'next/link';
import type { ReactNode } from 'react';
import { AuraProvider, Toaster } from '@jirawatpyk/aura-react';
import { th } from '@jirawatpyk/aura-react/locales/th';

export function Providers({ children }: { children: ReactNode }) {
  return (
    /* Thai labels (the pack: from 6.0 only English is built in); dates show พ.ศ. Use locale="en" for English (and
     * Gregorian) — or pass next-intl's locale with that language's pack. */
    <AuraProvider locale="th" strings={th} linkComponent={Link}>
      {children}
      <Toaster />
    </AuraProvider>
  );
}
