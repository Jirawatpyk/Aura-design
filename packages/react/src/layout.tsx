import * as React from 'react';
import { useStrings, useAuraLocale } from './locale.js';
import { cx, useMaybeControlled, uid } from './internal.js';
import { Icon } from './Icon.js';
import type { AvatarProps, BreadcrumbProps, CardProps, NavItem, SideNavProps, TabItem, TabsProps } from './types.js';
const h = React.createElement;

export const Card = React.forwardRef<HTMLElement, CardProps>(function Card(props, ref) {
  const creative = props.variant === 'creative';
  return h(
    props.as || 'section',
    {
      ref: ref,
      className: cx(
        'aura-card',
        creative && 'aura-card--creative',
        props.interactive && 'is-interactive',
        props.className,
      ),
      'aria-labelledby': props.title && props.titleId ? props.titleId : undefined,
    },
    props.title || props.actions ? (
      <div className="aura-card__head">
        <div className="aura-card__heading">
          {props.title
            ? h('h' + (props.headingLevel || 3), { className: 'aura-card__title', id: props.titleId }, props.title)
            : null}
          {props.description ? <p className="aura-card__desc">{props.description}</p> : null}
        </div>
        {props.actions ? <div className="aura-card__actions">{props.actions}</div> : null}
      </div>
    ) : null,
    props.children ? <div className="aura-card__body">{props.children}</div> : null,
    props.footer ? <div className="aura-card__foot">{props.footer}</div> : null,
  );
});

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(function Tabs(props, ref) {
  const items = props.tabs || [],
    base = uid();
  const st = useMaybeControlled<string | undefined>(
    props.value,
    props.defaultValue || (items[0] && items[0].id),
    props.onChange as ((id: string | undefined) => void) | undefined,
  );
  const refs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const current =
    items.filter(function (t: TabItem) {
      return t.id === st[0];
    })[0] || items[0];
  function go(i: number) {
    const enabled = items.filter(function (t: TabItem) {
      return !t.disabled;
    });
    const t = enabled[(i + enabled.length) % enabled.length];
    st[1](t.id);
    if (refs.current[t.id]) refs.current[t.id]!.focus();
  }
  return (
    <div ref={ref} className={cx('aura-tabs', props.className)}>
      <div
        role="tablist"
        aria-label={props.label}
        className="aura-tabs__list"
        onKeyDown={function (e: React.KeyboardEvent) {
          const enabled = items.filter(function (t: TabItem) {
              return !t.disabled;
            }),
            i = enabled.indexOf(current);
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            go(i + 1);
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            go(i - 1);
          } else if (e.key === 'Home') {
            e.preventDefault();
            go(0);
          } else if (e.key === 'End') {
            e.preventDefault();
            go(enabled.length - 1);
          }
        }}
      >
        {items.map(function (t: TabItem) {
          const on = current && t.id === current.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={base + '-tab-' + t.id}
              aria-selected={on}
              aria-controls={base + '-panel-' + t.id}
              tabIndex={on ? 0 : -1}
              disabled={t.disabled}
              ref={function (el: HTMLButtonElement | null): void {
                refs.current[t.id] = el;
              }}
              className={cx('aura-tab', on && 'is-active')}
              onClick={function () {
                st[1](t.id);
              }}
            >
              {t.icon ? <Icon name={t.icon} /> : null}
              {t.label}
              {t.count != null ? <span className="aura-tab__count">{t.count}</span> : null}
            </button>
          );
        })}
      </div>
      {current && current.content !== undefined ? (
        <div
          role="tabpanel"
          id={base + '-panel-' + current.id}
          aria-labelledby={base + '-tab-' + current.id}
          tabIndex={0}
          className="aura-tabs__panel"
        >
          {current.content}
        </div>
      ) : null}
    </div>
  );
});

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

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(props, ref) {
  const t = useStrings();
  const items = props.items || [];
  return (
    <nav ref={ref} aria-label={props.label || t.breadcrumb} className={cx('aura-crumbs', props.className)}>
      <ol>
        {items.map(function (it: BreadcrumbProps['items'][number], i: number) {
          const last = i === items.length - 1;
          return (
            <li key={i}>
              {last ? (
                <span aria-current="page" className="aura-crumbs__current">
                  {it.label}
                </span>
              ) : it.href ? (
                <a href={it.href} onClick={it.onClick}>
                  {it.label}
                </a>
              ) : (
                <button type="button" onClick={it.onClick}>
                  {it.label}
                </button>
              )}
              {last ? null : <Icon name="chevron-right" size={12} className="aura-crumbs__sep" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

const AVATAR_TONES = ['progress', 'ready', 'neutral', 'warning'];
function initials(name: string): string {
  const parts = String(name || '?')
    .trim()
    .split(/\s+/);
  return ((parts[0] || '?')[0] + (parts.length > 1 ? parts[parts.length - 1][0] : parts[0][1] || '')).toUpperCase();
}
export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(props, ref) {
  const size = props.size || 'md',
    errState = React.useState(false);
  let hash = 0;
  String(props.name || '')
    .split('')
    .forEach(function (ch) {
      hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
    });
  const tone = AVATAR_TONES[hash % AVATAR_TONES.length];
  return (
    <span
      ref={ref}
      className={cx('aura-avatar', 'aura-avatar--' + size, 'aura-avatar--' + tone, props.className)}
      role="img"
      aria-label={props.name + (props.status ? ', ' + props.status : '')}
    >
      {props.src && !errState[0] ? (
        <img
          src={props.src}
          alt=""
          onError={function () {
            errState[1](true);
          }}
        />
      ) : (
        <span aria-hidden={true}>{initials(props.name)}</span>
      )}
      {props.status === 'online' ? <span className="aura-avatar__status" aria-hidden={true} /> : null}
    </span>
  );
});
