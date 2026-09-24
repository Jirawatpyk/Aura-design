import * as React from 'react';
import { Icon } from './Icon.js';
import { cx, uid, useMaybeControlled } from './internal.js';
import { useLinkComponent, useStrings } from './locale.js';
import type { NavItem, SideNavProps } from './types.js';

function contains(it: NavItem, id: string | undefined): boolean {
  return (
    !!id &&
    !!it.children &&
    it.children.some(function (c: NavItem) {
      return c.id === id || contains(c, id);
    })
  );
}

/** Side navigation: sections of links or buttons, collapsible groups, counts and badges. Arrow keys move between items. */
export const SideNav = React.forwardRef<HTMLElement, SideNavProps>(function SideNav(props, ref) {
  const t = useStrings();
  const Link = useLinkComponent(props.linkComponent);
  const base = uid();
  const st = useMaybeControlled<string | undefined>(
    props.value,
    props.defaultValue,
    props.onChange as ((id: string | undefined) => void) | undefined,
  );
  const active = st[0];
  const sections = props.sections || [{ items: props.items || [] }];
  /* Open groups: explicitly toggled ones remember their state; untouched ones follow defaultOpen / the active item. */
  const openState = React.useState<Record<string, boolean>>({}),
    toggled = openState[0],
    setToggled = openState[1];
  function isOpen(it: NavItem): boolean {
    if (toggled[it.id] != null) return toggled[it.id];
    return !!it.defaultOpen || contains(it, active);
  }
  /* When navigation moves into a group, open it and keep it open after navigation moves on (no collapse on leaving). */
  React.useEffect(
    function () {
      if (!active) return;
      const next: Record<string, boolean> = {};
      let changed = false;
      sections.forEach(function (s: { items: NavItem[] }) {
        (function walk(list: NavItem[]) {
          list.forEach(function (it: NavItem) {
            if (it.children) {
              if (contains(it, active) && toggled[it.id] !== true) {
                next[it.id] = true;
                changed = true;
              }
              walk(it.children);
            }
          });
        })(s.items);
      });
      if (changed) setToggled(Object.assign({}, toggled, next));
    },
    [active],
  );
  const navRef = React.useRef<HTMLElement | null>(null);
  function onKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    const k = e.key;
    if (k !== 'ArrowDown' && k !== 'ArrowUp' && k !== 'Home' && k !== 'End') return;
    const root = navRef.current;
    if (!root) return;
    const items = Array.prototype.slice.call(root.querySelectorAll('.aura-nav__item')) as HTMLElement[];
    const visible = items.filter(function (el: HTMLElement) {
      return el.offsetParent !== null || el === document.activeElement;
    });
    const i = visible.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    e.preventDefault();
    const j =
      k === 'Home'
        ? 0
        : k === 'End'
          ? visible.length - 1
          : Math.max(0, Math.min(visible.length - 1, i + (k === 'ArrowDown' ? 1 : -1)));
    visible[j].focus();
  }
  function inner(it: NavItem, group: boolean, open: boolean) {
    return [
      it.icon ? <Icon key="i" name={it.icon} /> : null,
      <span key="l" className="aura-nav__label">
        {it.label}
      </span>,
      it.badge != null ? (
        <span key="b" className="aura-nav__badge">
          {it.badge}
        </span>
      ) : null,
      it.count != null ? (
        <span key="c" className="aura-nav__count">
          {it.count}
        </span>
      ) : null,
      group ? <Icon key="g" name="chevron-down" className={cx('aura-nav__chevron', open && 'is-open')} /> : null,
    ];
  }
  function item(it: NavItem, depth: number) {
    if (it.children) {
      const open = isOpen(it);
      const listId = base + '-' + it.id;
      const holdsActive = contains(it, active);
      return (
        <li key={it.id} className="aura-nav__group">
          <button
            type="button"
            className={cx('aura-nav__item', 'aura-nav__item--group', holdsActive && 'has-active')}
            aria-expanded={open}
            aria-controls={listId}
            style={depth ? ({ ['--aura-nav-depth' as string]: depth } as React.CSSProperties) : undefined}
            onClick={function () {
              const next: Record<string, boolean> = Object.assign({}, toggled);
              next[it.id] = !open;
              setToggled(next);
            }}
            onKeyDown={function (e: React.KeyboardEvent) {
              if (e.key === 'ArrowRight' && !open) {
                e.preventDefault();
                setToggled(Object.assign({}, toggled, { [it.id]: true }));
              } else if (e.key === 'ArrowLeft' && open) {
                e.preventDefault();
                setToggled(Object.assign({}, toggled, { [it.id]: false }));
              }
            }}
          >
            {inner(it, true, open)}
          </button>
          <ul id={listId} className="aura-nav__list aura-nav__sub" hidden={!open}>
            {it.children.map(function (c: NavItem) {
              return item(c, depth + 1);
            })}
          </ul>
        </li>
      );
    }
    const on = active === it.id;
    const common = {
      className: cx('aura-nav__item', on && 'is-active'),
      'aria-current': on ? ('page' as const) : undefined,
      style: depth ? ({ ['--aura-nav-depth' as string]: depth } as React.CSSProperties) : undefined,
      onClick: function (e: React.MouseEvent) {
        if (!it.href) e.preventDefault();
        st[1](it.id);
      },
    };
    return (
      <li key={it.id}>
        {it.href ? (
          <Link href={it.href} {...common}>
            {inner(it, false, false)}
          </Link>
        ) : (
          <button type="button" {...common}>
            {inner(it, false, false)}
          </button>
        )}
      </li>
    );
  }
  return (
    <nav
      ref={function (el: HTMLElement | null) {
        navRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) ref.current = el;
      }}
      className={cx('aura-nav', props.className)}
      aria-label={props.label || t.mainNav}
      onKeyDown={onKeyDown}
    >
      {props.header ? <div className="aura-nav__header">{props.header}</div> : null}
      <div className="aura-nav__scroll">
        {sections.map(function (s: { title?: string; items: NavItem[] }, i: number) {
          return (
            <div key={i} className="aura-nav__section">
              {s.title ? <p className="aura-nav__title">{s.title}</p> : null}
              <ul className="aura-nav__list">
                {s.items.map(function (it: NavItem) {
                  return item(it, 0);
                })}
              </ul>
            </div>
          );
        })}
      </div>
      {props.footer ? <div className="aura-nav__footer">{props.footer}</div> : null}
    </nav>
  );
});
