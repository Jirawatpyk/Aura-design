/* A second route to show client-side navigation: Breadcrumb, Pagination (page in the URL) and the links on the
 * home page all go through next/link via the AuraProvider in app/providers.tsx. */
import { Container, Stack, Breadcrumb, Card, SideNav, Tabs } from '@jirawatpyk/aura-react';
import { MembersPager } from './members-pager';

const PAGES = 5;

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; view?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.min(PAGES, Math.max(1, Number(sp.page) || 1));
  const view = sp.view === 'renewals' ? 'renewals' : 'all';
  return (
    <Container>
      <Stack gap={6} style={{ paddingBlock: 32 }}>
        <Breadcrumb items={[{ label: 'คำสั่งซื้อ', href: '/' }, { label: 'สมาชิก' }]} />
        {/* SideNav items with href are links through next/link too (items are plain data, fine from a Server Component). */}
        <div style={{ maxWidth: 240, height: 140 }}>
          <SideNav
            label="ส่วนงาน"
            value="members"
            items={[
              { id: 'orders', label: 'คำสั่งซื้อ', icon: 'file-text', href: '/' },
              { id: 'members', label: 'สมาชิก', icon: 'users', href: '/members' },
            ]}
          />
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', margin: 0 }}>สมาชิก</h1>
        {/* Tabs whose items all have href render as a nav of links (4.19): each one is a route, marked aria-current. */}
        <Tabs
          label="มุมมองสมาชิก"
          value={view}
          tabs={[
            { id: 'all', label: 'ทั้งหมด', href: '/members' },
            { id: 'renewals', label: 'รอต่ออายุ', href: '/members?view=renewals' },
          ]}
        />
        <Card title={'หน้า ' + page} headingLevel={2}>
          <p data-testid="members-page">Members page {page}</p>
          <MembersPager page={page} pageCount={PAGES} />
        </Card>
      </Stack>
    </Container>
  );
}
