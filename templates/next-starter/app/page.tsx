/* A Server Component: it can load data on the server and hand it to AURA components.
 * AURA's components are client components ('use client' is in the package), so they work here directly. */
import { Container, Stack, Grid, Card, Stat, Alert } from '@jirawatpyk/aura-react';
import { OrdersTable, type Order } from './orders-table';

async function getOrders(): Promise<Order[]> {
  /* Replace with your data source (database, API). */
  return [
    { id: 'ORD-1042', customer: 'คุณสมชาย ใจดี', status: 'Ready', due: '2026-09-18', amount: 3200 },
    { id: 'ORD-1043', customer: 'Anna Lee', status: 'In Progress', due: '2026-09-19', amount: 1850 },
    { id: 'ORD-1044', customer: 'บริษัท ตัวอย่าง จำกัด', status: 'Blocked', due: '2026-09-20', amount: 12900 },
  ];
}

export default async function Page() {
  const orders = await getOrders();
  const total = orders.reduce((s, o) => s + o.amount, 0);
  return (
    <Container>
      <Stack gap={6} style={{ paddingBlock: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', margin: 0 }}>คำสั่งซื้อ</h1>
        <Alert tone="info" title="AURA starter">
          แก้ไฟล์ <code>app/page.tsx</code> ได้เลย — ดูคอมโพเนนต์ทั้งหมดที่ Storybook ของ AURA
        </Alert>
        <Grid columns={{ base: 1, md: 3 }} gap={4}>
          <Stat label="คำสั่งซื้อ" value={orders.length} unit="รายการ" icon="file-text" />
          <Stat label="ยอดรวม" value={'฿' + total.toLocaleString('en')} icon="chart-column" />
          <Stat label="ติดปัญหา" value={orders.filter((o) => o.status === 'Blocked').length} unit="รายการ" icon="circle-alert" />
        </Grid>
        <Card title="รายการล่าสุด" headingLevel={2}>
          <OrdersTable orders={orders} />
        </Card>
      </Stack>
    </Container>
  );
}
