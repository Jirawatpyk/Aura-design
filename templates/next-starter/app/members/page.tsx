/* A second route to show client-side navigation: Breadcrumb, Pagination (page in the URL) and the links on the
 * home page all go through next/link via the AuraProvider in app/providers.tsx. */
import { Container, Stack, Breadcrumb, Card } from '@jirawatpyk/aura-react';
import { MembersPager } from './members-pager';

const PAGES = 5;

export default async function MembersPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = Math.min(PAGES, Math.max(1, Number((await searchParams).page) || 1));
  return (
    <Container>
      <Stack gap={6} style={{ paddingBlock: 32 }}>
        <Breadcrumb items={[{ label: 'คำสั่งซื้อ', href: '/' }, { label: 'สมาชิก' }]} />
        <h1 style={{ fontFamily: 'var(--font-display)', margin: 0 }}>สมาชิก</h1>
        <Card title={'หน้า ' + page} headingLevel={2}>
          <p data-testid="members-page">Members page {page}</p>
          <MembersPager page={page} pageCount={PAGES} />
        </Card>
      </Stack>
    </Container>
  );
}
