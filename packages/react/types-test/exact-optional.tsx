/* Consumers on `exactOptionalPropertyTypes` (Chamber-OS): every optional prop of every exported component must take
 * `undefined`, so `hint={t.hint}` or `icon={x ?? undefined}` compile. Compiled against the published declarations
 * (dist/index.d.ts) with strict + exactOptionalPropertyTypes + noUncheckedIndexedAccess. */
import * as React from 'react';
import * as Aura from '../dist/index';
import { Button, DataTable, DatePicker, SideNav, TextField } from '../dist/index';

type Mod = typeof Aura;
type OptionalKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? K : never }[keyof T];
/* true when `{ every optional prop: undefined }` is assignable to the props (each member of a props union checked). */
type TakesUndefined<P> = P extends unknown
  ? { [K in OptionalKeys<P>]: undefined } extends Pick<P, OptionalKeys<P>>
    ? true
    : false
  : never;
type Props<C> = C extends React.JSXElementConstructor<infer P> ? P : never;
/* Names of exported components that fail; must be `never`. */
type Failing = {
  [K in keyof Mod]: K extends Capitalize<K & string>
    ? Mod[K] extends React.JSXElementConstructor<any>
      ? [TakesUndefined<Props<Mod[K]>>] extends [true]
        ? never
        : K
      : never
    : never;
}[keyof Mod];
const allComponentsTakeUndefined: [Failing] extends [never] ? true : Failing = true;
void allComponentsTakeUndefined;
/* The check itself works: a prop typed without `| undefined` is caught. */
const catchesMissingUndefined: TakesUndefined<{ a?: string }> = false;
void catchesMissingUndefined;

/* The call sites from the review, written the way Chamber-OS writes them. */
declare const t: { hint?: string | undefined; icon?: Aura.IconName | undefined };
declare const field: { value: string | undefined; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void };
export function ChamberCallSites() {
  return (
    <>
      <TextField
        label="Company"
        value={field.value}
        onChange={field.onChange}
        hint={t.hint}
        icon={t.icon ?? undefined}
        error={undefined}
      />
      <Button icon={t.icon} loading={undefined} variant={undefined}>
        Save
      </Button>
      <Button href="/x" iconRight={undefined}>
        Open
      </Button>
      <DatePicker label="Due" value={field.value} min={undefined} onChange={undefined} />
      <DataTable label="Rows" rows={[]} pageSize={undefined} density={undefined} height={undefined} />
      <SideNav items={[]} collapsed={undefined} header={undefined} />
    </>
  );
}

/* 5.4: react-hook-form's formState.errors as is, nested objects and field arrays included; a Select named by
 * aria-labelledby (no visible label). */
import { useForm } from 'react-hook-form';
import { FormErrorSummary as RhfSummary, Select as RhfSelect } from '../dist/index';
export function RhfErrors53() {
  const f = useForm<{ province: string; address: { street: string }; items: { name: string }[] }>();
  return (
    <>
      <RhfSummary
        errors={f.formState.errors}
        focusKey={f.formState.submitCount}
        onSelect={(n) => f.setFocus(n as 'province')}
      />
      <RhfSummary errors={[{ field: 'province', message: 'Choose a province' }]} />
      <RhfSummary
        errors={{ address: { street: { message: 'Enter a street' } }, items: [{ name: { message: 'Name item 1' } }] }}
      />
      <span id="ext">Province</span>
      <RhfSelect aria-labelledby="ext" {...f.register('province')} options={['BKK']} />
      <RhfSelect label="Province" options={['BKK']} />
    </>
  );
}

/* 5.4: rows of your own interface, and row callbacks written with it. */
import { DataTable as RowsTable } from '../dist/index';
interface Invoice53 {
  id: string;
  amount: number;
}
export function TypedRows53({ rows, open }: { rows: readonly Invoice53[]; open: (r: Invoice53) => void }) {
  return (
    <RowsTable
      label="Invoices"
      rows={rows}
      onRowActivate={open}
      getRowHref={(r: Invoice53) => '/invoices/' + r.id}
      columns={[
        {
          key: 'amount',
          label: 'AMOUNT',
          render: (r: Invoice53) => r.amount.toFixed(2),
          sortValue: (r: Invoice53) => r.amount,
        },
      ]}
    />
  );
}
