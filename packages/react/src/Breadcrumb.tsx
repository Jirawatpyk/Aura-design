import * as React from 'react';
import { Icon } from './Icon.js';
import { cx } from './internal.js';
import { useLinkComponent, useStrings } from './locale.js';
import type { BreadcrumbProps } from './types.js';
import { IconChevronRight } from './icons.js';

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(props, ref) {
  const t = useStrings();
  const Link = useLinkComponent(props.linkComponent);
  const items = props.items || [];
  /* 5.15 (Chamber-OS 94): below `collapseBelow` the middle items hide in CSS and a "…" button stands in for them.
   * Choosing it shows the whole trail and moves focus to the first item it revealed. The choice belongs to this
   * trail: a new one (the next page, in a layout that keeps the Breadcrumb mounted) starts collapsed again. */
  const collapsible = !!props.collapseBelow && items.length > 2;
  const trail = items
    .map(function (it: BreadcrumbProps['items'][number]) {
      return it.label + '\u0001' + (it.href || '');
    })
    .join('\u0002');
  const st = React.useState<string | null>(null),
    expanded = st[0] === trail,
    setExpanded = function () {
      st[1](trail);
    };
  const listRef = React.useRef<HTMLOListElement | null>(null);
  const focusNext = React.useRef(false);
  React.useEffect(
    function () {
      if (!expanded || !focusNext.current) return;
      focusNext.current = false;
      /* The first revealed link or button; if the revealed items are all plain text, the first of them (made
       * focusable for this), so focus doesn't fall to the page when the "…" button goes. */
      const ol = listRef.current;
      if (!ol) return;
      let target = ol.querySelector('.aura-crumbs__middle a, .aura-crumbs__middle button') as HTMLElement | null;
      if (!target) {
        target = ol.querySelector('.aura-crumbs__middle > *') as HTMLElement | null;
        if (target) target.tabIndex = -1;
      }
      if (target) target.focus();
    },
    [expanded],
  );
  const sep = <Icon name={<IconChevronRight />} size={12} className="aura-crumbs__sep" />;
  const more =
    collapsible && !expanded ? (
      <li key="more" className="aura-crumbs__more">
        <button
          type="button"
          aria-label={t.breadcrumbMore}
          onClick={function () {
            focusNext.current = true;
            setExpanded();
          }}
        >
          …
        </button>
        {sep}
      </li>
    ) : null;
  const out: React.ReactNode[] = [];
  items.forEach(function (it: BreadcrumbProps['items'][number], i: number) {
    const last = i === items.length - 1;
    const lp = it.linkProps || {};
    const plain = lp as React.HTMLAttributes<HTMLElement>;
    /* The item's own onClick runs after one passed in linkProps (a test hook or analytics). */
    const own = lp.onClick as ((e: React.MouseEvent<HTMLElement>) => void) | undefined;
    const click =
      own || it.onClick
        ? function (e: React.MouseEvent<HTMLElement>) {
            if (own) own(e);
            if (it.onClick) it.onClick();
          }
        : undefined;
    out.push(
      <li
        key={i}
        {...it.itemProps}
        className={
          cx(it.itemProps && it.itemProps.className, collapsible && !last && i > 0 && 'aura-crumbs__middle') ||
          undefined
        }
      >
        {last ? (
          <span {...plain} aria-current="page" className={cx('aura-crumbs__current', lp.className)}>
            {it.label}
          </span>
        ) : it.href ? (
          <Link {...lp} href={it.href} onClick={click}>
            {it.label}
          </Link>
        ) : it.onClick ? (
          <button {...(lp as React.ButtonHTMLAttributes<HTMLButtonElement>)} type="button" onClick={click}>
            {it.label}
          </button>
        ) : (
          /* 5.7: a segment with no page and no action is text, not a button that does nothing. */
          <span {...plain} className={cx('aura-crumbs__text', lp.className)}>
            {it.label}
          </span>
        )}
        {last ? null : sep}
      </li>,
    );
    if (i === 0 && more) out.push(more);
  });
  return (
    <nav
      ref={ref}
      aria-label={props.label || t.breadcrumb}
      className={cx(
        'aura-crumbs',
        collapsible && !expanded && 'aura-crumbs--collapse-' + props.collapseBelow,
        props.className,
      )}
    >
      <ol ref={listRef}>{out}</ol>
    </nav>
  );
});
