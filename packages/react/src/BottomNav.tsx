import * as React from 'react';
import { Icon } from './Icon.js';
import { cx, devWarnOnce, plainClick, useMaybeControlled } from './internal.js';
import { useLinkComponent, useStrings } from './locale.js';
import type { BottomNavItem, BottomNavProps } from './types.js';
import { useHideOnScroll } from './scrollHide.js';
import { breakpoints } from './breakpoints.js';

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
  /* 5.35 (DxT Monitor 14): slides away while the page scrolls down, wherever it shows; the offset viewport ActionBars
   * and toasts sit on drops with it (the spacer stays, so nothing shifts). */
  const own = React.useRef<HTMLElement | null>(null);
  const hf = props.hideFrom === false ? null : props.hideFrom || 'lg';
  const away = useHideOnScroll(
    !!props.hideOnScroll,
    own,
    hf ? '(max-width: ' + (breakpoints[hf] - 0.02) + 'px)' : 'all',
    64,
  );
  const setRef = React.useCallback(
    function (el: HTMLElement | null) {
      own.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = el;
    },
    [ref],
  );
  return (
    <>
      <div className={cx('aura-bottomnav-spacer', 'aura-bottomnav--' + hide)} aria-hidden="true" />
      <nav
        ref={setRef}
        className={cx(
          'aura-bottomnav',
          'aura-bottomnav--' + hide,
          props.hideOnScroll && 'aura-bottomnav--hides',
          away && 'is-away',
          props.className,
        )}
        aria-label={props.label || t.mainNav}
      >
        <ul className="aura-bottomnav__list">
          {props.items.map(function (it: BottomNavItem) {
            /* 5.32: the full name must contain the visible label (WCAG 2.5.3), so speech input can say what it sees. */
            if (
              it.ariaLabel &&
              typeof it.label === 'string' &&
              it.ariaLabel.toLowerCase().indexOf(it.label.toLowerCase()) < 0
            )
              devWarnOnce(
                'bottomnav-label-' + it.id,
                'BottomNav: ariaLabel "' +
                  it.ariaLabel +
                  '" should contain the visible label "' +
                  it.label +
                  '" (WCAG 2.5.3).',
              );
            const on = active === it.id;
            const count = it.count != null && it.count > 0 ? (it.count > 99 ? '99+' : String(it.count)) : null;
            const suffix = count || (it.badge && it.badgeLabel) ? ' (' + (count || it.badgeLabel) + ')' : '';
            const common = {
              className: cx('aura-bottomnav__item', on && 'is-active'),
              /* 5.7: a full name when the label is shortened; the count / badge words still follow. 5.32 (WCAG 2.5.3;
               * axe 4.14): as content — the full name sr-only, the short label aria-hidden — not aria-label. */
              'aria-current': on ? ('page' as const) : undefined,
              onClick: function (e: React.MouseEvent) {
                if (!it.href) e.preventDefault();
                else if (!plainClick(e)) return; /* opening in a new tab doesn't change this page (5.1.1) */
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
              it.ariaLabel ? (
                <span key="n" className="aura-sr-only">
                  {it.ariaLabel + suffix}
                </span>
              ) : null,
              <span key="l" className="aura-bottomnav__label" aria-hidden={it.ariaLabel ? true : undefined}>
                {it.label}
              </span>,
              suffix && !it.ariaLabel ? (
                <span key="s" className="aura-sr-only">
                  {suffix}
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
