import * as React from 'react';
import { Icon } from './Icon.js';
import { cx, uid, useMaybeControlled } from './internal.js';
import { useLinkComponent } from './locale.js';
import type { TabItem, TabsProps } from './types.js';

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
  const Link = useLinkComponent(props.linkComponent);
  /* Section tabs that are routes (4.19): links in a nav, the current one marked as the page, no panels. Links are
   * reached with Tab (not arrows) — they're navigation, not a tab widget. */
  const asLinks =
    items.length > 0 &&
    items.every(function (t: TabItem) {
      return !!t.href;
    });
  if (asLinks)
    return (
      <nav
        ref={ref as React.Ref<HTMLElement>}
        aria-label={props.label}
        className={cx('aura-tabs aura-tabs--links', props.className)}
      >
        <div className="aura-tabs__list">
          {items.map(function (t: TabItem) {
            const on = current && t.id === current.id;
            const inner = [
              t.icon ? <Icon key="i" name={t.icon} /> : null,
              t.label,
              t.count != null ? (
                <span key="c" className="aura-tab__count">
                  {t.count}
                </span>
              ) : null,
            ];
            return t.disabled ? (
              <span key={t.id} className="aura-tab is-disabled" aria-disabled={true}>
                {inner}
              </span>
            ) : (
              <Link
                key={t.id}
                href={t.href}
                className={cx('aura-tab', on && 'is-active')}
                aria-current={on ? 'page' : undefined}
                onClick={function () {
                  st[1](t.id);
                }}
              >
                {inner}
              </Link>
            );
          })}
        </div>
      </nav>
    );
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
