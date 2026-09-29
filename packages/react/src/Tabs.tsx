import * as React from 'react';
import { Icon } from './Icon.js';
import { cx, devWarnOnce, omit, uid, useMaybeControlled } from './internal.js';
import { useLinkComponent } from './locale.js';
import type { TabItem, TabsProps } from './types.js';

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(function Tabs(props, ref) {
  const items = props.tabs || [],
    base = uid();
  const asLinks =
    items.length > 0 &&
    items.every(function (t: TabItem) {
      return !!t.href;
    });
  /* 5.1.1: tabs start on the first enabled one (a disabled first tab left the list with no tab stop). Route tabs
   * have no fallback, and value={undefined} there means "no tab is this page". */
  const firstOn = items.filter(function (t: TabItem) {
    return !t.disabled;
  })[0];
  const st = useMaybeControlled<string | undefined>(
    props.value,
    props.defaultValue || (asLinks ? undefined : firstOn && firstOn.id),
    props.onChange as ((id: string | undefined) => void) | undefined,
  );
  const cur = asLinks && 'value' in props ? props.value : st[0];
  const refs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const current =
    items.filter(function (t: TabItem) {
      return t.id === cur;
    })[0] ||
    firstOn ||
    items[0];
  const Link = useLinkComponent(props.linkComponent);
  /* 5.9 (Chamber-OS 71): with manual activation the arrows move focus, not the selection; the roving tab stop follows
   * focus and goes back to the selected tab when focus leaves the list. */
  const manual = props.activation === 'manual';
  /* 5.10 (Chamber-OS 72): the segmented look reuses SegmentedControl's classes on the same DOM. */
  const seg = props.variant === 'segmented';
  const fw = props.fullWidth;
  /* 5.15 (Chamber-OS 90): underline tabs share the width too, and either look can do so only below a breakpoint. */
  const listCls = cx(
    'aura-tabs__list',
    seg && 'aura-segmented',
    fw === true && (seg ? 'is-full' : 'is-fill'),
    typeof fw === 'string' && (seg ? 'is-full-' : 'is-fill-') + fw,
  );
  const tabCls = function (on: boolean | undefined, extra?: string) {
    return cx('aura-tab', on && 'is-active', seg && 'aura-segmented__option', seg && on && 'is-selected', extra);
  };
  const rootCls = cx('aura-tabs', seg && 'aura-tabs--segmented');
  const [focusId, setFocusId] = React.useState<string | null>(null);
  items.forEach(function (t: TabItem) {
    const al = t.tabProps && t.tabProps['aria-label'];
    if (al && al.toLowerCase().indexOf(String(t.label).toLowerCase()) !== 0)
      devWarnOnce(
        'tab-label-in-name',
        'Tabs: tabProps aria-label "' +
          al +
          '" should start with the visible label "' +
          t.label +
          '" so voice control finds the tab (WCAG 2.5.3 Label in Name).',
      );
  });
  /* Section tabs that are routes (4.19): links in a nav, the current one marked as the page, no panels. Links are
   * reached with Tab (not arrows) — they're navigation, not a tab widget. */
  if (asLinks)
    return (
      <nav
        ref={ref as React.Ref<HTMLElement>}
        aria-label={props.label}
        className={cx(rootCls, 'aura-tabs--links', props.className)}
      >
        <div className={listCls}>
          {items.map(function (t: TabItem) {
            /* Only an exact match is the current page (5.0.1): a route with no tab of its own marks none. */
            const on = t.id === cur;
            const inner = [
              t.icon ? <Icon key="i" name={t.icon} /> : null,
              t.label,
              t.count != null ? (
                <span key="c" className="aura-tab__count">
                  {t.count}
                </span>
              ) : null,
            ];
            /* A link or a span: drop the attributes that only mean something on a button. */
            const own = omit(t.tabProps || {}, [
              'type',
              'disabled',
              'form',
              'formAction',
              'formEncType',
              'formMethod',
              'formNoValidate',
              'formTarget',
              'name',
              'value',
            ]);
            return t.disabled ? (
              <span
                {...omit(own, ['onClick'])}
                key={t.id}
                className={cx(tabCls(false), 'is-disabled', own.className)}
                aria-disabled={true}
              >
                {inner}
              </span>
            ) : (
              <Link
                {...own}
                key={t.id}
                href={t.href}
                className={tabCls(on, own.className)}
                aria-current={on ? props.current || 'page' : undefined}
                onClick={function (e: React.MouseEvent<HTMLButtonElement>) {
                  if (own.onClick) own.onClick(e);
                  /* A new-tab click (modifier or middle button) leaves this page as it is. */
                  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
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
    if (manual) setFocusId(t.id);
    else st[1](t.id);
    if (refs.current[t.id]) refs.current[t.id]!.focus();
  }
  /* The tab holding the tab stop: the focused one while moving manually, else the selected one. */
  const stop =
    (manual &&
      focusId &&
      items.filter(function (t: TabItem) {
        return t.id === focusId && !t.disabled;
      })[0]) ||
    current;
  return (
    <div ref={ref} className={cx(rootCls, props.className)}>
      <div
        role="tablist"
        aria-label={props.label}
        className={listCls}
        onBlur={
          manual
            ? function (e: React.FocusEvent<HTMLDivElement>) {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusId(null);
              }
            : undefined
        }
        onKeyDown={function (e: React.KeyboardEvent) {
          const enabled = items.filter(function (t: TabItem) {
              return !t.disabled;
            }),
            /* Move from the tab that has focus (after a press without a click it can differ from the tab stop). */
            focused = enabled.filter(function (t: TabItem) {
              return refs.current[t.id] === e.target;
            })[0],
            i = enabled.indexOf((focused || stop) as TabItem);
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
          const own = t.tabProps || {};
          return (
            <button
              {...own}
              key={t.id}
              type="button"
              role="tab"
              id={base + '-tab-' + t.id}
              aria-selected={on}
              aria-controls={base + '-panel-' + t.id}
              tabIndex={stop && t.id === stop.id ? 0 : -1}
              disabled={t.disabled}
              ref={function (el: HTMLButtonElement | null): void {
                refs.current[t.id] = el;
              }}
              className={tabCls(on, own.className)}
              onFocus={
                manual
                  ? function (e: React.FocusEvent<HTMLButtonElement>) {
                      if (own.onFocus) own.onFocus(e);
                      setFocusId(t.id);
                    }
                  : own.onFocus
              }
              onClick={function (e: React.MouseEvent<HTMLButtonElement>) {
                if (own.onClick) own.onClick(e);
                if (e.defaultPrevented) return;
                /* Manual: choosing the tab that is already selected does nothing (no second payment started). */
                if (manual && current && t.id === current.id) return;
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
      {props.keepMounted ? (
        /* 5.9: every panel stays in the DOM (same node across switches); the inactive ones are hidden. */
        items.map(function (t: TabItem) {
          if (t.content === undefined) return null;
          const on = current && t.id === current.id;
          return (
            <div
              key={t.id}
              role="tabpanel"
              id={base + '-panel-' + t.id}
              aria-labelledby={base + '-tab-' + t.id}
              tabIndex={0}
              hidden={!on}
              className="aura-tabs__panel"
            >
              {t.content}
            </div>
          );
        })
      ) : current && current.content !== undefined ? (
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
