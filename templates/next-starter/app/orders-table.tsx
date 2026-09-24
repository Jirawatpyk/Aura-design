'use client';
/* Column `render` functions can't cross from a Server Component, so the table lives in a client component. */
import * as React from 'react';
import { DataTable, Button, useFormatDate, toast, type DataTableColumn } from '@jirawatpyk/aura-react';

export type Order = { id: string; customer: string; status: string; due: string; amount: number };

/* useFormatDate follows <AuraProvider locale> (th here: 18 ก.ย. 2569); switch the provider and the dates follow. */
const columns = (fmt: ReturnType<typeof useFormatDate>): DataTableColumn[] => [
  { key: 'id', label: 'ID', width: 112, mono: true, sortable: true },
  { key: 'customer', label: 'CUSTOMER', sortable: true },
  { key: 'status', label: 'STATUS', width: 140, pill: true },
  { key: 'due', label: 'DUE', width: 140, sortable: true, render: (r) => fmt(r.due) },
  { key: 'amount', label: 'AMOUNT', width: 120, sortable: true, render: (r) => '฿' + Number(r.amount).toLocaleString('en') },
  { key: 'actions', label: '', width: 120, actions: true,
    render: (r) => <Button variant="secondary" onClick={() => toast({ title: 'เปิด ' + r.id, tone: 'info' })}>เปิด</Button> },
];

export function OrdersTable({ orders }: { orders: Order[] }) {
  const fmt = useFormatDate();
  const cols = React.useMemo(() => columns(fmt), [fmt]);
  return <DataTable label="คำสั่งซื้อ" columns={cols} rows={orders} stackBelow={640} />;
}
