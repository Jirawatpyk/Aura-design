import * as React from 'react';
import { Icon } from './Icon.js';
import { IconButton } from './IconButton.js';
import { cx, plainClick, useMaybeControlled } from './internal.js';
import { useAutoTip } from './autoTip.js';
import { useLinkComponent, useStrings } from './locale.js';
import type { AnyPaginationProps, CursorPaginationProps, PaginationProps } from './types.js';
import { IconChevronLeft, IconChevronRight } from './icons.js';

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

/* 5.70 (Chamber-OS 187): a keyset / cursor list's First / Previous / Next — real links through the router (or buttons
 * for callbacks), a disabled end a span (with an href) or a disabled button, out of the tab order; no page numbers. */
function cursorNav(
  props: CursorPaginationProps,
  ref: React.ForwardedRef<HTMLElement>,
  Link: React.ElementType,
  t: ReturnType<typeof useStrings>,
) {
  /* A list of links shows a disabled end as a span (a link can't be disabled); a list of buttons, a disabled button. */
  const links = props.firstHref != null || props.previousHref != null || props.nextHref != null;
  function step(
    key: string,
    href: string | undefined,
    on: (() => void) | undefined,
    has: boolean | undefined,
    label: string,
    rel: string | undefined,
    icon: React.ReactElement | null,
    after: boolean,
  ) {
    const body = (
      <>
        {icon && !after ? <Icon name={icon} size="sm" /> : null}
        <span>{label}</span>
        {icon && after ? <Icon name={icon} size="sm" /> : null}
      </>
    );
    const cls = 'aura-page aura-page--step';
    if (has === false || (!href && !on))
      return links ? (
        <span key={key} className={cls} role="link" aria-disabled={true}>
          {body}
        </span>
      ) : (
        <button key={key} type="button" className={cls} disabled={true}>
          {body}
        </button>
      );
    if (href != null)
      return (
        <Link
          key={key}
          href={href}
          rel={rel}
          className={cls}
          onClick={function (e: React.MouseEvent) {
            if (on && plainClick(e)) {
              e.preventDefault();
              on();
            }
          }}
        >
          {body}
        </Link>
      );
    return (
      <button key={key} type="button" className={cls} onClick={on}>
        {body}
      </button>
    );
  }
  return (
    <nav
      ref={ref}
      className={cx('aura-pagination', 'aura-pagination--cursor', props.className)}
      aria-label={props.label || t.pagination}
    >
      {props.status != null && props.status !== false && props.status !== '' ? (
        <span className="aura-pagination__status">{props.status}</span>
      ) : null}
      <span className="aura-pagination__steps">
        {props.showFirst === false
          ? null
          : step('first', props.firstHref, props.onFirst, props.hasFirst, t.firstPage, undefined, null, false)}
        {step(
          'prev',
          props.previousHref,
          props.onPrevious,
          props.hasPrevious,
          t.prevPage,
          'prev',
          <IconChevronLeft />,
          false,
        )}
        {step('next', props.nextHref, props.onNext, props.hasNext, t.nextPage, 'next', <IconChevronRight />, true)}
      </span>
    </nav>
  );
}

export const Pagination = React.forwardRef<HTMLElement, AnyPaginationProps>(function Pagination(all, ref) {
  const t = useStrings();
  useAutoTip();
  const props = all as PaginationProps;
  const count = Math.max(1, props.pageCount || 1);
  const st = useMaybeControlled(props.page, props.defaultPage || 1, props.onChange);
  const page = Math.min(count, Math.max(1, st[0]));
  function go(p: number) {
    if (p >= 1 && p <= count && p !== page) st[1](p);
  }
  const link = props.getHref;
  const Link = useLinkComponent(props.linkComponent);
  if (all.mode === 'cursor') return cursorNav(all, ref, Link, t);
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
          if (props.onChange && plainClick(e)) {
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
  /* Previous / next: links through the router when getHref is set (4.17), otherwise buttons; a disabled arrow at
   * either end is always a button (a link can't be disabled). */
  function arrow(p: number, icon: React.ReactElement, label: string, rel: string, disabled: boolean) {
    if (!link || disabled)
      return (
        <IconButton
          icon={icon}
          label={label}
          disabled={disabled}
          onClick={function () {
            go(p);
          }}
        />
      );
    return (
      <Link
        href={link(p)}
        rel={rel}
        className="aura-icon-btn"
        aria-label={label}
        data-aura-tip={label}
        onClick={function (e: React.MouseEvent) {
          if (props.onChange && plainClick(e)) {
            e.preventDefault();
            go(p);
          }
        }}
      >
        <Icon name={icon} size="sm" />
      </Link>
    );
  }
  return (
    <nav ref={ref} className={cx('aura-pagination', props.className)} aria-label={props.label || t.pagination}>
      {arrow(page - 1, <IconChevronLeft />, t.prevPage, 'prev', page <= 1)}
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
      {arrow(page + 1, <IconChevronRight />, t.nextPage, 'next', page >= count)}
    </nav>
  );
});
