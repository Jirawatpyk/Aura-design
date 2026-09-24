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
