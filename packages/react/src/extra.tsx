import * as React from 'react';
import { createPortal } from 'react-dom';
import {
  cx,
  omit,
  uid,
  useMaybeControlled,
  useMergedRef,
  useMounted,
  useIsoLayoutEffect,
  trapTab,
  FOCUSABLE,
} from './internal.js';
import { useStrings } from './locale.js';
import { Icon } from './Icon.js';
import { IconButton } from './IconButton.js';
import type {
  AccordionItem,
  AccordionProps,
  BadgeProps,
  EmptyStateProps,
  PaginationProps,
  PopoverProps,
  ProgressProps,
  SkeletonProps,
  TagProps,
  Tone,
} from './types.js';
const TONES: string[] = ['neutral', 'accent', 'success', 'warning', 'danger'];
function tone(t: Tone | undefined): string {
  return TONES.indexOf(t as string) >= 0 ? (t as string) : 'neutral';
}

/* ---------- Badge: a static label or count ---------- */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(props, ref) {
  const rest = omit(props, ['tone', 'variant', 'icon', 'className', 'children']);
  return (
    <span
      {...rest}
      ref={ref}
      className={cx(
        'aura-badge',
        'aura-badge--' + tone(props.tone),
        props.variant === 'solid' && 'is-solid',
        props.variant === 'outline' && 'is-outline',
        props.className,
      )}
    >
      {props.icon ? <Icon name={props.icon} size={12} /> : null}
      {props.children}
    </span>
  );
});

/* ---------- Tag: an interactive chip — removable (onRemove) or selectable (selected + onClick) ---------- */
export const Tag = React.forwardRef<HTMLElement, TagProps>(function Tag(props, ref) {
  const t = useStrings();
  const selectable = props.onClick != null || props.selected != null;
  const rest = omit(props, ['onRemove', 'selected', 'icon', 'className', 'children', 'disabled', 'removeLabel']);
  const inner = [
    props.icon ? <Icon key="i" name={props.icon} size={14} /> : null,
    <span key="t" className="aura-tag__text">
      {props.children}
    </span>,
  ];
  if (selectable) {
    return (
      <button
        {...rest}
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        aria-pressed={!!props.selected}
        disabled={props.disabled}
        className={cx('aura-tag is-selectable', props.selected && 'is-selected', props.className)}
      >
        {props.selected ? <Icon name="check" size={14} /> : inner[0]}
        {inner[1]}
      </button>
    );
  }
  return (
    <span {...rest} ref={ref} className={cx('aura-tag', props.disabled && 'is-disabled', props.className)}>
      {inner}
      {props.onRemove && !props.disabled ? (
        <button
          type="button"
          className="aura-tag__remove"
          aria-label={props.removeLabel || t.remove(typeof props.children === 'string' ? props.children : '')}
          onClick={props.onRemove}
        >
          <Icon name="x" size={12} />
        </button>
      ) : null}
    </span>
  );
});

/* ---------- Progress: determinate (value) or indeterminate (no value) ---------- */
export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(function Progress(props, ref) {
  const auto = uid(),
    id = props.id || auto;
  const max = props.max || 100,
    det = props.value != null;
  const pct = det ? Math.max(0, Math.min(100, (props.value! / max) * 100)) : 0;
  const shown = props.valueLabel != null ? props.valueLabel : det ? Math.round(pct) + '%' : null;
  return (
    <div
      ref={ref}
      className={cx(
        'aura-progress',
        'aura-progress--' + tone(props.tone || 'accent'),
        props.size === 'sm' && 'is-sm',
        props.className,
      )}
    >
      {props.label || (props.showValue && shown) ? (
        <div className="aura-progress__head">
          {props.label ? (
            <span className="aura-progress__label" id={id + '-label'}>
              {props.label}
            </span>
          ) : (
            <span />
          )}
          {props.showValue && shown ? <span className="aura-progress__value">{shown}</span> : null}
        </div>
      ) : null}
      <div
        className={cx('aura-progress__track', !det && 'is-indeterminate')}
        role="progressbar"
        aria-labelledby={props.label ? id + '-label' : undefined}
        aria-label={props.label ? undefined : props['aria-label']}
        aria-valuemin={det ? 0 : undefined}
        aria-valuemax={det ? max : undefined}
        aria-valuenow={det ? props.value : undefined}
        aria-valuetext={det && props.valueLabel != null ? String(props.valueLabel) : undefined}
      >
        <span className="aura-progress__bar" style={det ? { width: pct + '%' } : undefined} />
      </div>
      {props.hint ? <p className="aura-progress__hint">{props.hint}</p> : null}
    </div>
  );
});

/* ---------- Skeleton: placeholder shapes while content loads ---------- */
export const Skeleton = React.forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(props, ref) {
  const v = props.variant || 'text';
  if (v === 'text' && (props.lines || 1) > 1) {
    const n = props.lines as number,
      rows: React.ReactElement[] = [];
    for (let i = 0; i < n; i++)
      rows.push(<span key={i} className="aura-skel aura-skel--text" style={{ width: i === n - 1 ? '60%' : '100%' }} />);
    return (
      <span
        ref={ref}
        className={cx('aura-skel-lines', props.className)}
        aria-hidden={true}
        style={props.width ? { width: props.width } : undefined}
      >
        {rows}
      </span>
    );
  }
  const style: { width?: number | string; height?: number | string } = { width: props.width, height: props.height };
  if (v === 'circle') {
    style.width = style.height = props.size || props.width || 40;
  }
  return (
    <span ref={ref} aria-hidden={true} className={cx('aura-skel', 'aura-skel--' + v, props.className)} style={style} />
  );
});

/* ---------- EmptyState: nothing to show yet, and what to do about it ---------- */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(props, ref) {
  const HT = ('h' + (props.headingLevel || 3)) as React.ElementType;
  return (
    <div
      ref={ref}
      className={cx('aura-empty', props.size === 'sm' && 'is-sm', props.bordered && 'is-bordered', props.className)}
    >
      <span className="aura-empty__icon" aria-hidden={true}>
        <Icon name={props.icon || 'inbox'} size={props.size === 'sm' ? 'md' : 'lg'} />
      </span>
      <HT className="aura-empty__title">{props.title}</HT>
      {props.description ? <p className="aura-empty__text">{props.description}</p> : null}
      {props.action ? <div className="aura-empty__action">{props.action}</div> : null}
    </div>
  );
});

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
      <a
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
      </a>
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

/* ---------- Accordion: stacked sections that open and close ---------- */
export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(function Accordion(props, ref) {
  const auto = uid(),
    base = props.id || auto;
  const multiple = props.type === 'multiple';
  const st = useMaybeControlled<string | null | string[]>(
    props.value,
    props.defaultValue != null ? props.defaultValue : multiple ? [] : null,
    props.onChange,
  );
  const open: string[] = multiple ? (st[0] as string[]) || [] : st[0] ? [st[0] as string] : [];
  const HT = ('h' + (props.headingLevel || 3)) as React.ElementType;
  const items = props.items || [];
  function toggle(id: string) {
    const isOpen = open.indexOf(id) >= 0;
    if (multiple)
      st[1](
        isOpen
          ? open.filter(function (x: string) {
              return x !== id;
            })
          : open.concat([id]),
      );
    else st[1](isOpen ? (props.collapsible === false ? id : null) : id);
  }
  function onKey(e: React.KeyboardEvent<HTMLDivElement>) {
    const btns: HTMLElement[] = Array.prototype.slice.call(
      e.currentTarget.querySelectorAll(
        ':scope > .aura-accordion__item > .aura-accordion__heading > button:not([disabled])',
      ),
    );
    let i = btns.indexOf(document.activeElement as HTMLElement),
      k = e.key,
      n: HTMLElement | null = null;
    if (i < 0) return;
    if (k === 'ArrowDown') n = btns[(i + 1) % btns.length];
    else if (k === 'ArrowUp') n = btns[(i - 1 + btns.length) % btns.length];
    else if (k === 'Home') n = btns[0];
    else if (k === 'End') n = btns[btns.length - 1];
    if (n) {
      e.preventDefault();
      n.focus();
    }
  }
  return (
    <div ref={ref} className={cx('aura-accordion', props.className)} onKeyDown={onKey}>
      {items.map(function (it: AccordionItem) {
        const on = open.indexOf(it.id) >= 0,
          bid = base + '-btn-' + it.id,
          pid = base + '-panel-' + it.id;
        return (
          <div key={it.id} className={cx('aura-accordion__item', on && 'is-open')}>
            <HT className="aura-accordion__heading">
              <button
                type="button"
                id={bid}
                aria-expanded={on}
                aria-controls={pid}
                disabled={it.disabled}
                onClick={function () {
                  toggle(it.id);
                }}
              >
                {it.icon ? <Icon name={it.icon} className="aura-accordion__lead" /> : null}
                <span className="aura-accordion__title">
                  {it.title}
                  {it.description ? <span className="aura-accordion__desc">{it.description}</span> : null}
                </span>
                <Icon name="chevron-down" className="aura-accordion__chevron" />
              </button>
            </HT>
            <div id={pid} role="region" aria-labelledby={bid} className="aura-accordion__panel" hidden={!on}>
              {it.content}
            </div>
          </div>
        );
      })}
    </div>
  );
});

/* ---------- Popover: a small non-modal panel anchored to a trigger ---------- */
function position(
  anchor: Element,
  pop: HTMLElement,
  placement: string | undefined,
): { top: number; left: number; side: string } {
  const r = anchor.getBoundingClientRect(),
    pw = pop.offsetWidth,
    ph = pop.offsetHeight,
    vw = window.innerWidth,
    vh = window.innerHeight,
    gap = 6;
  let side = (placement || 'bottom-start').split('-')[0],
    align = (placement || 'bottom-start').split('-')[1] || 'start';
  if (side === 'bottom' && r.bottom + gap + ph > vh - 8 && r.top - gap - ph > 8) side = 'top';
  else if (side === 'top' && r.top - gap - ph < 8 && r.bottom + gap + ph < vh - 8) side = 'bottom';
  const top = side === 'top' ? r.top - gap - ph : r.bottom + gap;
  const left = align === 'end' ? r.right - pw : align === 'center' ? r.left + r.width / 2 - pw / 2 : r.left;
  return { top: Math.max(8, top), left: Math.max(8, Math.min(left, vw - pw - 8)), side: side };
}
export const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(function Popover(props, ref) {
  const t = useStrings();
  const auto = uid(),
    id = props.id || auto;
  const st = useMaybeControlled(props.open, !!props.defaultOpen, props.onOpenChange);
  const open = !!st[0];
  const wrap = React.useRef<HTMLSpanElement | null>(null),
    pop = React.useRef<HTMLDivElement | null>(null),
    popMerged = useMergedRef(ref, pop);
  const pos = React.useState<{ top: number; left: number; side: string } | null>(null),
    mounted = useMounted();
  function trigger(): HTMLElement | null {
    return (
      wrap.current &&
      (wrap.current.querySelector<HTMLElement>('button, [role="button"], a, input') ||
        (wrap.current.firstElementChild as HTMLElement | null))
    );
  }
  function close(restore: boolean) {
    st[1](false);
    if (restore) {
      const tr = trigger();
      if (tr && tr.focus) tr.focus();
    }
  }
  useIsoLayoutEffect(
    function () {
      if (!open || !pop.current || !trigger()) return;
      function place() {
        if (pop.current && trigger()) pos[1](position(trigger()!, pop.current, props.placement));
      }
      place();
      window.addEventListener('resize', place);
      window.addEventListener('scroll', place, true);
      return function () {
        window.removeEventListener('resize', place);
        window.removeEventListener('scroll', place, true);
      };
    },
    [open, mounted, props.placement],
  );
  React.useEffect(
    function () {
      if (!open || !mounted) return;
      if (props.autoFocus !== false && pop.current) {
        const f =
          pop.current.querySelector<HTMLElement>('[data-autofocus]') ||
          pop.current.querySelector<HTMLElement>(FOCUSABLE);
        (f || pop.current).focus();
      }
      function outside(e: Event) {
        if (pop.current && pop.current.contains(e.target as Node)) return;
        if (wrap.current && wrap.current.contains(e.target as Node)) return;
        close(false);
      }
      document.addEventListener('pointerdown', outside, true);
      return function () {
        document.removeEventListener('pointerdown', outside, true);
      };
    },
    [open, mounted],
  );
  const child = React.Children.only(props.trigger) as React.ReactElement<Record<string, any>>;
  const panel =
    open && mounted
      ? createPortal(
          <div
            ref={popMerged}
            id={id}
            role="dialog"
            aria-modal={false}
            aria-label={props.title ? undefined : props.label}
            aria-labelledby={props.title ? id + '-title' : undefined}
            tabIndex={-1}
            className={cx('aura-popover', pos[0] && 'is-' + pos[0].side, props.className)}
            style={Object.assign(
              { top: pos[0] ? pos[0].top : -9999, left: pos[0] ? pos[0].left : -9999 },
              props.width ? { width: props.width } : null,
            )}
            onKeyDown={function (e: React.KeyboardEvent) {
              if (e.key === 'Escape') {
                e.stopPropagation();
                close(true);
              } else trapTab(e, pop.current);
            }}
          >
            {props.title ? (
              <div className="aura-popover__head">
                <p className="aura-popover__title" id={id + '-title'}>
                  {props.title}
                </p>
                <IconButton
                  icon="x"
                  label={t.close}
                  onClick={function () {
                    close(true);
                  }}
                />
              </div>
            ) : null}
            <div className="aura-popover__body">
              {typeof props.children === 'function'
                ? props.children({
                    close: function () {
                      close(true);
                    },
                  })
                : props.children}
            </div>
          </div>,
          document.body,
        )
      : null;
  return (
    <span ref={wrap} className="aura-popover-anchor">
      {React.cloneElement(child, {
        onClick: function (e: React.MouseEvent) {
          if (child.props.onClick) child.props.onClick(e);
          st[1](!open);
        },
        'aria-haspopup': 'dialog',
        'aria-expanded': open,
        'aria-controls': open ? id : undefined,
      })}
      {panel}
    </span>
  );
});
