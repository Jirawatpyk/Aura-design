import * as React from 'react';
import { Icon } from './Icon.js';
import { cx, useMaybeControlled } from './internal.js';
import { useStrings } from './locale.js';
import type { NavItem, SideNavProps } from './types.js';

export const SideNav = React.forwardRef<HTMLElement, SideNavProps>(function SideNav(props, ref) {
  const t = useStrings();
  const st = useMaybeControlled<string | undefined>(
    props.value,
    props.defaultValue,
    props.onChange as ((id: string | undefined) => void) | undefined,
  );
  function item(it: NavItem) {
    const on = st[0] === it.id;
    const inner = [
      it.icon ? <Icon key="i" name={it.icon} /> : null,
      <span key="l" className="aura-nav__label">
        {it.label}
      </span>,
      it.count != null ? (
        <span key="c" className="aura-nav__count">
          {it.count}
        </span>
      ) : null,
    ];
    const common = {
      className: cx('aura-nav__item', on && 'is-active'),
      'aria-current': on ? ('page' as const) : undefined,
      onClick: function (e: React.MouseEvent) {
        if (!it.href) e.preventDefault();
        st[1](it.id);
      },
    };
    return (
      <li key={it.id}>
        {it.href ? (
          <a href={it.href} {...common}>
            {inner}
          </a>
        ) : (
          <button type="button" {...common}>
            {inner}
          </button>
        )}
      </li>
    );
  }
  return (
    <nav ref={ref} className={cx('aura-nav', props.className)} aria-label={props.label || t.mainNav}>
      {props.header ? <div className="aura-nav__header">{props.header}</div> : null}
      <div className="aura-nav__scroll">
        {(props.sections || [{ items: props.items || [] }]).map(function (
          s: { title?: string; items: NavItem[] },
          i: number,
        ) {
          return (
            <div key={i} className="aura-nav__section">
              {s.title ? <p className="aura-nav__title">{s.title}</p> : null}
              <ul className="aura-nav__list">{s.items.map(item)}</ul>
            </div>
          );
        })}
      </div>
      {props.footer ? <div className="aura-nav__footer">{props.footer}</div> : null}
    </nav>
  );
});
