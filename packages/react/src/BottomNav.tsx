import * as React from 'react';
import { Icon } from './Icon.js';
import { cx, useMaybeControlled } from './internal.js';
import { useLinkComponent, useStrings } from './locale.js';
import type { BottomNavItem, BottomNavProps } from './types.js';

/** BottomNav — a phone tab bar: icon over a short label, a count or dot, the current page marked. Fixed to the bottom,
 * padded for the home indicator, with a spacer of the same height in the flow so nothing sits under it. Which
 * breakpoints show it is decided in CSS, so the server's HTML is already right and nothing shifts on hydration. */
export const BottomNav = React.forwardRef<HTMLElement, BottomNavProps>(function BottomNav(props, ref) {
  const t = useStrings();
  const Link = useLinkComponent(props.linkComponent);
  const st = useMaybeControlled<string | undefined>(
    props.value,
    props.defaultValue,
    props.onChange as ((id: string | undefined) => void) | undefined,
  );
  const active = st[0];
  const hide = props.hideFrom === false ? 'always' : 'below-' + (props.hideFrom || 'lg');
  return (
    <>
      <div className={cx('aura-bottomnav-spacer', 'aura-bottomnav--' + hide)} aria-hidden="true" />
      <nav
        ref={ref}
        className={cx('aura-bottomnav', 'aura-bottomnav--' + hide, props.className)}
        aria-label={props.label || t.mainNav}
      >
        <ul className="aura-bottomnav__list">
          {props.items.map(function (it: BottomNavItem) {
            const on = active === it.id;
            const count = it.count != null && it.count > 0 ? (it.count > 99 ? '99+' : String(it.count)) : null;
            const common = {
              className: cx('aura-bottomnav__item', on && 'is-active'),
              'aria-current': on ? ('page' as const) : undefined,
              onClick: function (e: React.MouseEvent) {
                if (!it.href) e.preventDefault();
                st[1](it.id);
              },
            };
            const inner = [
              <span key="i" className="aura-bottomnav__icon">
                <Icon name={it.icon} size="md" />
                {count ? (
                  <span className="aura-bottomnav__count" aria-hidden="true">
                    {count}
                  </span>
                ) : it.badge ? (
                  <span className="aura-bottomnav__dot" aria-hidden="true" />
                ) : null}
              </span>,
              <span key="l" className="aura-bottomnav__label">
                {it.label}
              </span>,
              count || (it.badge && it.badgeLabel) ? (
                <span key="s" className="aura-sr-only">
                  {' (' + (count || it.badgeLabel) + ')'}
                </span>
              ) : null,
            ];
            return (
              <li key={it.id} className="aura-bottomnav__cell">
                {it.href ? (
                  <Link href={it.href} {...common}>
                    {inner}
                  </Link>
                ) : (
                  <button type="button" {...common}>
                    {inner}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
});
