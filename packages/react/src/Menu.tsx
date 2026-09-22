import * as React from 'react';
import { createPortal } from 'react-dom';
import { cx, useIsoLayoutEffect, useMounted, useMergedRef } from './internal.js';
import { Icon } from './Icon.js';
import type { MenuItem, MenuProps } from './types.js';

/** Popover list anchored to an element, rendered in a portal. */
export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(function Menu(props, ref) {
  const own = React.useRef<HTMLDivElement | null>(null),
    merged = useMergedRef(ref, own);
  const posState = React.useState<{ top: number; left: number } | null>(null);
  const pos = posState[0],
    setPos = posState[1];
  const items = props.items || [];
  const mounted = useMounted();
  useIsoLayoutEffect(
    function () {
      const a = props.anchor,
        m = own.current;
      if (!a || !m) return;
      const r = a.getBoundingClientRect(),
        mh = m.offsetHeight,
        mw = m.offsetWidth;
      let top = r.bottom + 4;
      if (top + mh > window.innerHeight - 8 && r.top - mh - 4 > 8) top = r.top - mh - 4;
      const left = Math.max(8, Math.min(r.right - mw, window.innerWidth - mw - 8));
      setPos({ top: top, left: left });
    },
    [props.anchor, mounted],
  );
  React.useEffect(
    function () {
      if (!mounted) return;
      const first = own.current && own.current.querySelector<HTMLElement>('[role^="menuitem"]:not([disabled])');
      if (first && props.autoFocus !== false) first.focus();
      function outside(e: Event) {
        if (
          own.current &&
          !own.current.contains(e.target as Node) &&
          !(props.anchor && props.anchor.contains(e.target as Node))
        )
          props.onClose(false);
      }
      function onScroll(e: Event) {
        if (own.current && !own.current.contains(e.target as Node)) props.onClose(false);
      }
      document.addEventListener('pointerdown', outside, true);
      window.addEventListener('scroll', onScroll, true);
      window.addEventListener('resize', onScroll);
      return function () {
        document.removeEventListener('pointerdown', outside, true);
        window.removeEventListener('scroll', onScroll, true);
        window.removeEventListener('resize', onScroll);
      };
    },
    [mounted],
  );
  function onKeyDown(e: React.KeyboardEvent) {
    const list: HTMLElement[] = Array.prototype.slice.call(
      own.current!.querySelectorAll('[role^="menuitem"]:not([disabled])'),
    );
    const i = list.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      list[(i + 1) % list.length].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      list[(i - 1 + list.length) % list.length].focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      list[0].focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      list[list.length - 1].focus();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      props.onClose(true);
    } else if (e.key === 'Tab') {
      props.onClose(true);
    }
    e.stopPropagation();
  }
  const el = (
    <div
      ref={merged}
      role="menu"
      aria-label={props.label}
      className="aura-menu"
      onKeyDown={onKeyDown}
      style={{ top: pos ? pos.top : -9999, left: pos ? pos.left : -9999 }}
    >
      {items.map(function (it: MenuItem, i: number) {
        if (it.separator) return <div key={'s' + i} role="separator" className="aura-menu__sep" />;
        const isCheck = it.checked !== undefined;
        return (
          <button
            key={i}
            type="button"
            tabIndex={-1}
            disabled={it.disabled}
            role={isCheck ? 'menuitemcheckbox' : 'menuitem'}
            aria-checked={isCheck ? !!it.checked : undefined}
            className="aura-menu__item"
            onClick={function () {
              it.onSelect!();
              if (!it.keepOpen) props.onClose(true);
            }}
          >
            {isCheck ? (
              <span className={cx('aura-menu__check', it.checked && 'is-on')}>
                {it.checked ? <Icon name="check" size={12} strokeWidth={3} /> : null}
              </span>
            ) : it.icon ? (
              <Icon name={it.icon} />
            ) : (
              <span className="aura-menu__blank" />
            )}
            <span className="aura-menu__label">{it.label}</span>
            {it.hint ? <span className="aura-menu__hint">{it.hint}</span> : null}
          </button>
        );
      })}
    </div>
  );
  return mounted ? createPortal(el, document.body) : null;
});
