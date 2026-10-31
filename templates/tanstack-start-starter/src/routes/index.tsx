/* Orders: rendered on the server by TanStack Start, then hydrated. Every link here — Button, Stat, StatusTile,
 * DataTable rows and pager, a DropdownMenu item, a toast action — goes through AuraLink (src/components/aura-link.tsx). */
import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  Alert,
  Button,
  Card,
  ColorSchemeToggle,
  Container,
  DataTable,
  DropdownMenu,
  Grid,
  Stack,
  Stat,
  StatusTile,
  toast,
  useFormatDate,
  type DataTableColumn,
} from '@jirawatpyk/aura-react';
import { formatDate } from '@jirawatpyk/aura-react/server';
import { IconArrowRight, IconChartColumn, IconCircleAlert, IconFileText } from '@jirawatpyk/aura-react/icons';

type Order = { id: string; customer: string; status: string; due: string; amount: number };

/* Replace with your data source: a loader runs on the server for the first request and in the browser after. */
const getOrders = (): Order[] => [
  { id: 'ORD-1042', customer: 'คุณสมชาย ใจดี', status: 'Ready', due: '2026-09-18', amount: 3200 },
  { id: 'ORD-1043', customer: 'Anna Lee', status: 'In Progress', due: '2026-09-19', amount: 1850 },
  { id: 'ORD-1044', customer: 'บริษัท ตัวอย่าง จำกัด', status: 'Blocked', due: '2026-09-20', amount: 12900 },
];

const PAGE_SIZE = 2;

export const Route = createFileRoute('/')({
  validateSearch: (s: Record<string, unknown>): { page?: number } => {
    const page = Number(s.page);
    return Number.isInteger(page) && page > 1 ? { page } : {};
  },
  loader: () => ({ orders: getOrders() }),
  component: OrdersPage,
});

function OrdersPage() {
  const { orders } = Route.useLoaderData();
  const { page = 1 } = Route.useSearch();
  const fmt = useFormatDate();
  const total = orders.reduce((s, o) => s + o.amount, 0);
  const columns = React.useMemo<DataTableColumn[]>(
    () => [
      { key: 'id', label: 'ID', width: 112, mono: true },
      { key: 'customer', label: 'CUSTOMER' },
      { key: 'status', label: 'STATUS', width: 140, pill: true },
      { key: 'due', label: 'DUE', width: 140, render: (r) => fmt(r.due) },
      { key: 'amount', label: 'AMOUNT', width: 120, render: (r) => '฿' + Number(r.amount).toLocaleString('en') },
    ],
    [fmt],
  );
  return (
    <Container>
      <Stack gap={6} style={{ paddingBlock: 32 }}>
        <div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}
        >
          <h1 style={{ fontFamily: 'var(--font-display)', margin: 0 }}>คำสั่งซื้อ</h1>
          <Stack direction="row" gap={3} align="center">
            <Button href="/members" variant="secondary" iconRight={<IconArrowRight />}>
              สมาชิก
            </Button>
            <DropdownMenu
              label="ไปที่"
              trigger={<Button variant="ghost">ไปที่</Button>}
              items={[{ label: 'รอต่ออายุ', href: '/members?view=renewals' }]}
            />
            <ColorSchemeToggle />
          </Stack>
        </div>
        <Alert tone="info" title="AURA starter">
          แก้ไฟล์ <code>src/routes/index.tsx</code> ได้เลย — ดูคอมโพเนนต์ทั้งหมดที่ Storybook ของ AURA
        </Alert>
        <Grid columns={{ base: 1, md: 3 }} gap={4}>
          <Stat label="คำสั่งซื้อ" value={orders.length} unit="รายการ" icon={<IconFileText />} />
          <Stat label="ยอดรวม" value={'฿' + total.toLocaleString('en')} icon={<IconChartColumn />} />
          <Stat
            label="ติดปัญหา"
            value={orders.filter((o) => o.status === 'Blocked').length}
            unit="รายการ"
            icon={<IconCircleAlert />}
            href="/members"
          />
        </Grid>
        <StatusTile status="ok" title="api.example.co.th" value="99.98%" meta="30 วัน" href="/members?view=renewals" />
        <p className="aura-text-caption" data-testid="as-of" style={{ margin: 0 }}>
          {'ข้อมูล ณ ' + formatDate('2026-09-24', { locale: 'th', format: 'long' })}
        </p>
        <Card title="รายการล่าสุด" headingLevel={2}>
          {/* Row links and pager links go through AuraLink: client-side, open in a new tab with ⌘/Ctrl. */}
          <DataTable
            label="คำสั่งซื้อ"
            columns={columns}
            rows={orders}
            stackBelow={640}
            pageSize={PAGE_SIZE}
            page={page}
            getPageHref={(p) => (p > 1 ? '/?page=' + p : '/')}
            getRowHref={(r) => '/members?order=' + r.id}
          />
        </Card>
        <div>
          <Button
            variant="secondary"
            onClick={() =>
              toast({ title: 'บันทึกแล้ว', tone: 'success', actions: [{ label: 'ดูสมาชิก', href: '/members' }] })
            }
          >
            บันทึก
          </Button>
        </div>
      </Stack>
    </Container>
  );
}
