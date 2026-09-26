---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

DataTable is generic over its rows: the type of `rows` types every `render`, `sortValue`, `getRowHref` and `onRowActivate`, so typos inside callbacks and callbacks written for another row type are compile errors. `DataTableColumn<Row>` types a column list declared on its own; `<DataTable<Order> …>` names the type; `rows={[]}`, untyped rows and `ComponentProps<typeof DataTable>` / `memo` / wrappers keep the untyped default. Type-level changes: a union of arrays (`cond ? orders : invoices`) needs `<DataTable<Order | Invoice>>`; `Record<string, unknown>[]` rows give `render` `unknown` values; `typeof DataTable` is a generic function type instead of `ForwardRefExoticComponent` (it still takes `ref`). Nothing changes at run time.
