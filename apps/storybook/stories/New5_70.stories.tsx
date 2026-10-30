import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import type { AnyPaginationProps, CursorPaginationProps, PaginationProps } from '@aura/react';
import { Aura } from './aura';

/* 5.70: PaginationProps stays the numbered props, so a wrapper that picks from or extends it still compiles (this file
 * is type-checked). */
type Wrapped = Omit<PaginationProps, 'className'> & { tone?: string };
interface MyPager extends PaginationProps {
  extra?: boolean;
}
const wrapped: Wrapped = { pageCount: 3 };
const mine: MyPager = { pageCount: PaginationProps_count(3) };
function PaginationProps_count(n: PaginationProps['pageCount']): number {
  return n;
}
const any: AnyPaginationProps[] = [wrapped, mine, { mode: 'cursor', nextHref: '#n' } satisfies CursorPaginationProps];
void any;

const meta: Meta = { title: 'AURA/New in 5.70 Chamber-OS 186–190' };
export default meta;

/* A stand-in for a router's Link: marks what it renders. */
const RouterLink = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  function RouterLink(props, ref) {
    return <a ref={ref} data-router="" {...props} />;
  },
);

/* #186: a passed aria-disabled / aria-busy is merged with loading's, on Button and (aria-disabled) IconButton. */
export const ButtonStates: StoryObj = {
  render: function Render() {
    const [clicks, setClicks] = React.useState(0);
    const hit = () => setClicks((n) => n + 1);
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <Aura.Button data-testid="cooldown" loading={false} aria-disabled onClick={hit}>
          Resend invoice
        </Aura.Button>
        <Aura.Button data-testid="sending" loading aria-disabled={false} onClick={hit}>
          Resend invoice
        </Aura.Button>
        <Aura.Button data-testid="busy" aria-busy onClick={hit}>
          Refreshing
        </Aura.Button>
        <Aura.IconButton data-testid="icon-cooldown" icon="pencil" label="Resend" aria-disabled onClick={hit} />
        <Aura.IconButton data-testid="icon-live" icon="pencil" label="Refresh" onClick={hit} />
        <Aura.Button data-testid="link-cooldown" href="#resent" aria-disabled onClick={hit}>
          Resend link
        </Aura.Button>
        <output data-testid="clicks">{clicks}</output>
      </div>
    );
  },
};

/* #187: keyset (cursor) lists — First / Previous / Next with a status line, no page numbers. */
export const CursorPagination: StoryObj = {
  render: function Render() {
    const [page, setPage] = React.useState(0);
    return (
      <div style={{ display: 'grid', gap: 24, maxWidth: 640 }}>
        <div data-testid="links">
          <Aura.Pagination
            mode="cursor"
            label="Audit log pages"
            nextHref="#after=evt_50"
            status="Showing 50 of 1,240"
          />
        </div>
        <div data-testid="buttons">
          <Aura.Pagination
            mode="cursor"
            label="E-Blast pages"
            onFirst={() => setPage(0)}
            onPrevious={() => setPage(page - 1)}
            onNext={() => setPage(page + 1)}
            hasFirst={page > 0}
            hasPrevious={page > 0}
            hasNext={page < 2}
            status={'Batch ' + (page + 1)}
          />
        </div>
        <div data-testid="forward">
          <Aura.Pagination
            mode="cursor"
            label="Change requests"
            showFirst={false}
            nextHref="#next"
            linkComponent={RouterLink}
          />
        </div>
      </div>
    );
  },
};

/* #188: a plain Table with a sortable column — a button, and a server-sorted link. */
export const SortableTh: StoryObj = {
  render: function Render() {
    const [dir, setDir] = React.useState<'ascending' | 'descending'>('ascending');
    const rows = ['Nordic Trade AB', 'Siam Steel', 'Bangkok Bakers'].sort((a, b) =>
      dir === 'ascending' ? a.localeCompare(b) : b.localeCompare(a),
    );
    return (
      <Aura.Table aria-label="Pending review">
        <Aura.THead>
          <Aura.Tr>
            <Aura.Th
              data-testid="member"
              sort={dir}
              onSort={() => setDir(dir === 'ascending' ? 'descending' : 'ascending')}
            >
              Member
            </Aura.Th>
            <Aura.Th data-testid="submitted" sort="none" sortHref="?sort=submitted" linkComponent={RouterLink}>
              Submitted
            </Aura.Th>
            <Aura.Th data-testid="amount" numeric sort="descending">
              Amount
            </Aura.Th>
            <Aura.Th data-testid="plain">Notes</Aura.Th>
          </Aura.Tr>
        </Aura.THead>
        <Aura.TBody>
          {rows.map((r) => (
            <Aura.Tr key={r}>
              <Aura.Td>{r}</Aura.Td>
              <Aura.Td>2026-10-2{r.length % 9}</Aura.Td>
              <Aura.Td numeric>{r.length * 1000}</Aura.Td>
              <Aura.Td>—</Aura.Td>
            </Aura.Tr>
          ))}
        </Aura.TBody>
      </Aura.Table>
    );
  },
};

/* #189: Spinner outside a button, and StatusPill busy. */
export const Spinners: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 16 }}>
      <p
        data-testid="inline"
        className="aura-text-body"
        style={{ margin: 0, display: 'flex', gap: 8, alignItems: 'center' }}
      >
        <Aura.Spinner size="sm" /> Preparing your receipt…
      </p>
      <div
        data-testid="panel"
        style={{ display: 'flex', gap: 16, alignItems: 'center', color: 'var(--aura-fg-accent)' }}
      >
        <Aura.Spinner size="lg" label="Processing payment" />
        <Aura.Spinner data-testid="md" />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <Aura.Button data-testid="btn" loading>
          Pay now
        </Aura.Button>
        <Aura.StatusPill data-testid="pill" tone="progress" busy>
          Waiting for payment
        </Aura.StatusPill>
        <Aura.StatusPill data-testid="pill-plain" tone="progress">
          Waiting for payment
        </Aura.StatusPill>
      </div>
    </div>
  ),
};

/* #190: FileUpload as a single button — the app sends the file and reports progress. */
export const UploadButton: StoryObj = {
  render: function Render() {
    const [picked, setPicked] = React.useState<string[]>([]);
    const [progress, setProgress] = React.useState<number | null | undefined>(undefined);
    const ref = React.useRef<HTMLInputElement | null>(null);
    return (
      <div style={{ display: 'grid', gap: 24, maxWidth: 420 }}>
        <div data-testid="logo">
          <Aura.FileUpload
            variant="button"
            label="Invoice logo"
            hint="Shown at the top of every invoice."
            buttonLabel="Upload logo"
            accept="image/png,image/jpeg"
            maxSize={200 * 1024}
            name="logo"
            required
            ref={ref}
            onSelect={(files) => {
              setPicked((p) => p.concat(files.map((f) => f.name)));
              setProgress(40);
            }}
            progress={progress}
          />
        </div>
        <output data-testid="picked">{JSON.stringify(picked)}</output>
        <Aura.Button data-testid="indeterminate" variant="ghost" onClick={() => setProgress(null)}>
          Indeterminate
        </Aura.Button>
        <Aura.Button data-testid="focus-field" variant="ghost" onClick={() => ref.current && ref.current.focus()}>
          Focus the field (as a form library does)
        </Aura.Button>
        <form data-testid="cert-form" onSubmit={(e) => e.preventDefault()}>
          <Aura.FileUpload variant="button" label="Zero-rate certificate" accept=".pdf" name="cert" required />
          <Aura.Button data-testid="save" type="submit">
            Save
          </Aura.Button>
        </form>
        <div data-testid="zone">
          <Aura.FileUpload label="Attachments" accept="image/*,.pdf" multiple />
        </div>
      </div>
    );
  },
};
