/* A second route: Breadcrumb, SideNav, link Tabs, Pagination (page in the URL), a sortable header link and
 * BottomNav — all through AuraLink via the AuraProvider in __root.tsx. */
import { createFileRoute } from '@tanstack/react-router';
import {
  BottomNav,
  Breadcrumb,
  Card,
  Container,
  Pagination,
  SideNav,
  Stack,
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
  Tabs,
} from '@jirawatpyk/aura-react';
import { IconFileText, IconUsers } from '@jirawatpyk/aura-react/icons';

const PAGES = 5;

type MembersSearch = { page?: number; view?: 'renewals'; order?: string; sort?: 'name' };

export const Route = createFileRoute('/members')({
  validateSearch: (s: Record<string, unknown>): MembersSearch => {
    const out: MembersSearch = {};
    const page = Number(s.page);
    if (Number.isInteger(page) && page > 1) out.page = Math.min(PAGES, page);
    if (s.view === 'renewals') out.view = 'renewals';
    if (typeof s.order === 'string') out.order = s.order;
    if (s.sort === 'name') out.sort = 'name';
    return out;
  },
  component: MembersPage,
});

function MembersPage() {
  const { page = 1, view, order, sort } = Route.useSearch();
  const names = ['Anna Lee', 'คุณสมชาย ใจดี', 'บริษัท ตัวอย่าง จำกัด'];
  if (sort === 'name') names.sort((a, b) => a.localeCompare(b, 'th'));
  return (
    <Container>
      <Stack gap={6} style={{ paddingBlock: 32 }}>
        <Breadcrumb items={[{ label: 'คำสั่งซื้อ', href: '/' }, { label: 'สมาชิก' }]} />
        <div style={{ maxWidth: 240, height: 140 }}>
          <SideNav
            label="ส่วนงาน"
            value="members"
            items={[
              { id: 'orders', label: 'คำสั่งซื้อ', icon: <IconFileText />, href: '/' },
              { id: 'members', label: 'สมาชิก', icon: <IconUsers />, href: '/members' },
            ]}
          />
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', margin: 0 }}>สมาชิก</h1>
        {order ? <p data-testid="order">{'คำสั่งซื้อ ' + order}</p> : null}
        {/* Tabs whose items all have href render as a nav of links: each one is a URL, marked aria-current. */}
        <Tabs
          label="มุมมองสมาชิก"
          value={view === 'renewals' ? 'renewals' : 'all'}
          tabs={[
            { id: 'all', label: 'ทั้งหมด', href: '/members' },
            { id: 'renewals', label: 'รอต่ออายุ', href: '/members?view=renewals' },
          ]}
        />
        <Card title={'หน้า ' + page} headingLevel={2}>
          <p data-testid="members-page">Members page {page}</p>
          <Pagination page={page} pageCount={PAGES} getHref={(p) => (p > 1 ? '/members?page=' + p : '/members')} />
        </Card>
        <Table aria-label="รายชื่อ">
          <THead>
            <Tr>
              <Th sort={sort === 'name' ? 'ascending' : 'none'} sortHref="/members?sort=name">
                ชื่อ
              </Th>
            </Tr>
          </THead>
          <TBody>
            {names.map((n) => (
              <Tr key={n}>
                <Td>{n}</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
        {/* On a phone a bottom bar; links too. */}
        <BottomNav
          value="members"
          items={[
            { id: 'orders', label: 'คำสั่งซื้อ', icon: <IconFileText />, href: '/' },
            { id: 'members', label: 'สมาชิก', icon: <IconUsers />, href: '/members' },
          ]}
        />
      </Stack>
    </Container>
  );
}
