/* 5.5: DataTable is generic over its rows — the row type flows from `rows` into every callback; a mismatch is an error. */
import * as React from 'react';
import { DataTable, type DataTableColumn, type DataTableProps } from '../src/index';
interface Order {
  id: string;
  amount: number;
  owner: string | null;
}
interface Invoice {
  no: number;
  total: string;
}
declare const orders: Order[];
declare const ro: readonly Order[];
declare const anyRows: any[];
declare const setDetail: React.Dispatch<React.SetStateAction<Order | null>>;
const cols: DataTableColumn<Order>[] = [{ key: 'amount', label: 'A', render: (r) => r.amount.toFixed(2) }];
const loose: DataTableColumn[] = [{ key: 'amount', label: 'A', render: (r: Order) => r.amount }];
export const ok = [
  <DataTable
    label="1"
    rows={orders}
    columns={[{ key: 'id', label: 'ID', render: (r) => r.id.toUpperCase(), sortValue: (r) => r.amount }]}
    onRowActivate={(r) => r.owner}
    getRowHref={(r) => '/o/' + r.id}
  />,
  <DataTable label="2" rows={ro} columns={cols} onRowActivate={setDetail} />,
  <DataTable label="3" rows={orders} columns={loose} />,
  <DataTable label="4" rows={anyRows} columns={[{ key: 'x', label: 'X', render: (r) => r.whatever }]} />,
  <DataTable label="5" rows={[]} getRowHref={(r) => '/m/' + r.id} />,
  <DataTable label="6" rows={[{ id: 'a', n: 1 }]} columns={[{ key: 'n', label: 'N', render: (r) => r.n + 1 }]} />,
  <DataTable label="7" rows={orders} />,
];
export const bad = [
  // @ts-expect-error property not on Order
  <DataTable label="b1" rows={orders} columns={[{ key: 'id', label: 'ID', render: (r) => r.nope }]} />,
  // @ts-expect-error callback for an unrelated row type
  <DataTable label="b2" rows={orders} getRowHref={(r: Invoice) => '/i/' + r.no} />,
  // @ts-expect-error columns typed for another row type
  <DataTable label="b3" rows={orders} columns={[] as DataTableColumn<Invoice>[]} />,
];

/* Explicit type argument, and a hand-typed empty table. */
export const explicit = [
  <DataTable<Order> label="e1" rows={[]} columns={cols} />,
  // @ts-expect-error rows of another type than the one named
  <DataTable<Order> label="e2" rows={[] as Invoice[]} />,
];

/* Reading the component's props or wrapping it keeps the untyped default (5.5 review: an `object` constraint broke these). */
function CPWrap(p: React.ComponentProps<typeof DataTable>) {
  return <DataTable {...p} />;
}
const Wrapped = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof DataTable>>((p, ref) => (
  <DataTable ref={ref} {...p} />
));
const Memo = React.memo(DataTable);
function MyTable<T extends Record<string, any>>(p: DataTableProps<T>) {
  return <DataTable {...p} />;
}
export const wrappers = [
  <CPWrap label="w1" rows={orders} columns={[{ key: 'id', label: 'ID', render: (r) => r.id }]} />,
  <Wrapped label="w2" rows={orders} getRowHref={(r) => '/o/' + r.id} />,
  <Memo label="w3" rows={orders} getRowHref={(r) => '/o/' + r.id} />,
  React.createElement(DataTable, { label: 'w4', rows: orders, getRowHref: (r) => '/o/' + r.id }),
  <MyTable label="w5" rows={orders} onRowActivate={(r) => r.amount} />,
  /* A union of arrays: name the row type. */
  <DataTable<Order | Invoice> label="w6" rows={Math.random() > 0.5 ? orders : ([] as Invoice[])} />,
];
