import * as React from 'react';
import { IconButton } from './IconButton.js';
import { cx, useMaybeControlled } from './internal.js';
import { useLinkComponent, useStrings } from './locale.js';
import type { PaginationProps } from './types.js';

/* ---------- Pagination: page links for lists outside DataTable ---------- */
function pageList(page: number, count: number, sib: number): Array<number | string> {
  let out: Array<number | string> = [],
    lo = Math.max(2, page - sib),
    hi = Math.min(count - 1, page + sib);
  if (page - sib <= 3) {
    lo = 2;
    hi = Math.min(count - 1, Math.max(hi, 3 + 2 * sib));
  }
  if (page + sib >= count - 2) {
    hi = count - 1;
    lo = Math.max(2, Math.min(lo, count - 2 - 2 * sib));
  }
  out.push(1);
  if (lo === 3) out.push(2);
  else if (lo > 3) out.push('…a');
  for (let i = lo; i <= hi; i++) out.push(i);
  if (hi === count - 2) out.push(count - 1);
  else if (hi < count - 2) out.push('…b');
  if (count > 1) out.push(count);
  return out;
}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(function Pagination(props, ref) {
  const t = useStrings();
  const count = Math.max(1, props.pageCount || 1);
  const st = useMaybeControlled(props.page, props.defaultPage || 1, props.onChange);
  const page = Math.min(count, Math.max(1, st[0]));
  function go(p: number) {
    if (p >= 1 && p <= count && p !== page) st[1](p);
  }
  const link = props.getHref;
  const Link = useLinkComponent();
  function item(p: number, label: React.ReactNode, extra?: Record<string, unknown>) {
    const common = Object.assign(
      {
        className: cx('aura-page', p === page && 'is-current'),
        'aria-current': p === page ? ('page' as const) : undefined,
        'aria-label': t.pageN(p),
      },
      extra,
    );
    return link ? (
      <Link
        href={link(p)}
        onClick={function (e: React.MouseEvent) {
          if (props.onChange) {
            e.preventDefault();
            go(p);
          }
        }}
        {...common}
      >
        {label}
      </Link>
    ) : (
      <button
        type="button"
        onClick={function () {
          go(p);
        }}
        {...common}
      >
        {label}
      </button>
    );
  }
  return (
    <nav ref={ref} className={cx('aura-pagination', props.className)} aria-label={props.label || t.pagination}>
      <IconButton
        icon="chevron-left"
        label={t.prevPage}
        disabled={page <= 1}
        onClick={function () {
          go(page - 1);
        }}
      />
      <ol className="aura-pagination__list">
        {pageList(page, count, props.siblingCount == null ? 1 : props.siblingCount).map(function (p: number | string) {
          return typeof p === 'number' ? (
            <li key={p}>{item(p, p)}</li>
          ) : (
            <li key={p} className="aura-pagination__gap" aria-hidden={true}>
              {'…'}
            </li>
          );
        })}
      </ol>
      <span className="aura-pagination__compact" aria-hidden={true}>
        {t.page(page, count)}
      </span>
      <IconButton
        icon="chevron-right"
        label={t.nextPage}
        disabled={page >= count}
        onClick={function () {
          go(page + 1);
        }}
      />
    </nav>
  );
});
