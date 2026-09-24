'use client';
/* getHref is a function, so Pagination is rendered from a client component; the page itself stays on the server. */
import { Pagination } from '@jirawatpyk/aura-react';

export function MembersPager({ page, pageCount }: { page: number; pageCount: number }) {
  return <Pagination page={page} pageCount={pageCount} getHref={(p) => '/members?page=' + p} />;
}
