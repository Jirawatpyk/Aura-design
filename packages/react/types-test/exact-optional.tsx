/* Consumers on `exactOptionalPropertyTypes` (Chamber-OS): every optional prop of every exported component must take
 * `undefined`, so `hint={t.hint}` or `icon={x ?? undefined}` compile. Compiled against the published declarations
 * (dist/index.d.ts) with strict + exactOptionalPropertyTypes + noUncheckedIndexedAccess. */
import * as React from 'react';
import * as Aura from '../dist/index';
import * as Server from '../dist/server/index';
import { Button, DataTable, DatePicker, SideNav, TextField } from '../dist/index';
import { IconPlus, IconUsers, allIcons, defineIcon } from '../dist/icons/index';
import { th } from '../dist/locales/th';

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

/* 5.9: the per-icon components and a locale pack fit the published props. */
export function Prep60() {
  Aura.registerIcons(allIcons);
  Aura.registerIcons([IconUsers]);
  const Mine = defineIcon('mine', [['path', { d: 'M4 4h16' }]]);
  return (
    <Aura.AuraProvider locale="th" strings={th}>
      {/* 5.8's override with an untyped parameter still compiles (no implicit any). */}
      <Aura.AuraProvider strings={{ pageN: (n) => 'p' + n }} />
      <Button icon={<IconPlus />}>New</Button>
      <IconUsers size="md" label="Members" />
      <Aura.Icon name={<Mine />} />
      <SideNav items={[{ id: 'a', label: 'A', icon: <IconUsers /> }]} />
    </Aura.AuraProvider>
  );
}

/* 5.9 (Chamber-OS 70, 71): attributes on the Drawer panel and its close button; per-tab attributes, keepMounted, manual. */
export function Addendum9({ open, label }: { open: boolean; label: string | undefined }) {
  return (
    <>
      <Aura.Drawer
        open={open}
        onClose={() => {}}
        title="Pay"
        id="pay"
        data-testid="pay-sheet-content"
        aria-describedby={undefined}
        closeLabel={label}
        closeProps={{ 'data-testid': 'pay-sheet-close', onClick: (e) => e.preventDefault() }}
      />
      <Aura.Tabs
        label="Method"
        keepMounted
        activation="manual"
        variant="segmented"
        fullWidth
        tabs={[
          {
            id: 'card',
            label: 'Card',
            tabProps: { 'aria-label': 'Card — switch payment method', 'data-testid': 'method-card' },
          },
        ]}
      />
    </>
  );
}

/* 5.10 (Chamber-OS 73): a disabled menu item can say why. */
export const addendum10Items: Aura.MenuItem[] = [
  { label: 'Email me a copy', disabled: true, disabledReason: undefined },
  { label: 'Resend', disabled: true, disabledReason: 'Again in 5 min' },
];

/* 5.11 (Chamber-OS 75, 76, 78): row box names, a passed describedby on Checkbox, auto row height; undefined allowed. */
export function Addendum11({ hint, auto }: { hint: string | undefined; auto: boolean }) {
  type Member = { id: string; company: string };
  const rows: Member[] = [{ id: 'M-1', company: 'Acme AB' }];
  return (
    <>
      <Aura.DataTable<Member>
        label="Members"
        rows={rows}
        selectable
        rowSelectLabel={(r) => 'Select ' + r.company}
        rowHeight={auto ? 'auto' : undefined}
      />
      <Aura.DataTable label="Members" rows={rows} rowSelectLabel={undefined} rowHeight={undefined} />
      <Aura.Checkbox aria-describedby={hint} description="D">
        Terms
      </Aura.Checkbox>
    </>
  );
}
// @ts-expect-error rowHeight takes only 'auto' (a number would be a fixed height; use the density token for that)
export const badRowHeight: Aura.DataTableProps['rowHeight'] = 56;

/* 5.12 (Chamber-OS 79): FilterSelect and FilterBar searchGrow; undefined allowed, onChange gets the value. */
export function Addendum12({ status, all }: { status: string | undefined; all: string | undefined }) {
  const [v, setV] = React.useState('all');
  return (
    <Aura.FilterBar search="" onSearchChange={() => {}} searchGrow={undefined}>
      <Aura.FilterSelect label="Status" allLabel={all} options={['all', 'active']} value={v} onChange={setV} />
      <Aura.FilterSelect label="Plan" value={status} defaultValue={undefined} name="plan" disabled={undefined}>
        <option value="">All plans</option>
      </Aura.FilterSelect>
    </Aura.FilterBar>
  );
}
// @ts-expect-error a FilterSelect needs its name (label)
export const noLabel = <Aura.FilterSelect options={['a']} />;
// @ts-expect-error onChange gets the value, not an event
export const eventHandler = <Aura.FilterSelect label="S" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => e} />;

/* 5.13 (Chamber-OS 80–82, 84): card options, static Table align / bordered / card slots, EmptyState tone. */
export function Addendum13({ o, flag }: { o: number | undefined; flag: boolean | undefined }) {
  type Member = { id: string; company: string };
  const rows: Member[] = [{ id: 'M-1', company: 'Acme' }];
  return (
    <>
      <Aura.DataTable<Member>
        label="Members"
        rows={rows}
        hideSelectionInCards={flag}
        columns={[
          { key: 'company', label: 'COMPANY', card: 'title' },
          { key: 'id', label: 'NO.', card: undefined, cardOrder: o },
        ]}
      />
      <Aura.Table caption="Q" align="middle" bordered={flag} stackBelow="sm">
        <Aura.TBody>
          <Aura.Tr>
            <Aura.Td card="title">Acme</Aura.Td>
            <Aura.Td card={undefined}>x</Aura.Td>
            <Aura.Td card="action">
              <Aura.Button size="sm">Review</Aura.Button>
            </Aura.Td>
          </Aura.Tr>
        </Aura.TBody>
      </Aura.Table>
      <Aura.EmptyState tone="danger" bordered title="Failed" data-testid="err" id={undefined} />
    </>
  );
}
// @ts-expect-error card takes only 'hide' | 'field' | 'title' | 'pill'
export const badCard: Aura.DataTableColumn = { key: 'x', label: 'X', card: 'actions' };
// @ts-expect-error Table align is 'top' | 'middle' (the old HTML align attribute is not accepted)
export const badAlign = <Aura.Table caption="Q" align="center" />;

/* 5.14 (Chamber-OS 86, 88, 97, 102, 103, 107): EmptyState title as a paragraph, Stat heading, shell padding, a gated
 * Button, in-page link tabs; undefined allowed. */
export function Addendum15({ level, flag }: { level: 2 | 3 | undefined; flag: boolean | undefined }) {
  return (
    <>
      <Aura.EmptyState title="No benefits" headingLevel={false} />
      <Aura.Stat label="Membership" value="Active" headingLevel={level} />
      <Aura.AppShell contentPadding={flag}>x</Aura.AppShell>
      <Aura.Button aria-disabled={flag}>Erase</Aura.Button>
      <Aura.Tabs label="On this page" current="location" tabs={[{ id: 'a', label: 'A', href: '#a' }]} />
      <Aura.Tabs label="Sections" current={undefined} tabs={[{ id: 'a', label: 'A' }]} />
    </>
  );
}
// @ts-expect-error headingLevel true is not a level
export const badEmpty = <Aura.EmptyState title="x" headingLevel={true} />;
/* 5.14 (Chamber-OS 88, 103): Stat and Avatar from /server; no onClick there. */
export const serverTiles = (
  <>
    <Server.Stat label="Membership" headingLevel={2} value="Active" href="/membership" />
    <Server.Avatar name="Anna Berg" size="sm" />
  </>
);
// @ts-expect-error a server Stat can't take onClick
export const serverClick = <Server.Stat label="x" onClick={() => {}} />;
