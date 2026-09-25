import * as React from 'react';
import { createPortal } from 'react-dom';
import { cx, useIsoLayoutEffect, useMounted, useMergedRef } from './internal.js';
import { Icon } from './Icon.js';
import { useLinkComponent } from './locale.js';
import type { MenuItem, MenuProps } from './types.js';

/** Popover list anchored to an element, rendered in a portal. */
export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(function Menu(props, ref) {
  const own = React.useRef<HTMLDivElement | null>(null),
    merged = useMergedRef(ref, own);
  const posState = React.useState<{ top: number; left: number; maxHeight?: number } | null>(null);
  const pos = posState[0],
    setPos = posState[1];
  const items = props.items || [];
  const mounted = useMounted();
  const Link = useLinkComponent(props.linkComponent);
  useIsoLayoutEffect(
    function () {
      const a = props.anchor,
        m = own.current;
      if (!a || !m) return;
      const r = a.getBoundingClientRect(),
        mh = m.scrollHeight,
        mw = m.offsetWidth,
        below = window.innerHeight - r.bottom - 12,
        above = r.top - 12;
      /* Below if it fits, else above if it fits, else the roomier side, scrolling (5.1.1: it ran off-screen). */
      let top = r.bottom + 4,
        maxHeight: number | undefined;
      if (mh > below) {
        if (mh <= above) top = r.top - mh - 4;
        else if (above > below) {
          maxHeight = above;
          top = r.top - above - 4;
        } else maxHeight = below;
      }
      const left = Math.max(8, Math.min(r.right - mw, window.innerWidth - mw - 8));
      setPos({ top: top, left: left, maxHeight: maxHeight });
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
    } else if (e.key === ' ' && document.activeElement && document.activeElement.tagName === 'A') {
      /* Space on a link item activates it like the other items (it scrolled the page, closing the menu). */
      e.preventDefault();
      (document.activeElement as HTMLElement).click();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      props.onClose(true);
    } else if (e.key === 'Tab') {
      props.onClose(true);
    }
    e.stopPropagation();
  }
  /* Consecutive radio items that share a `group` go in one labelled role="group" (4.19). */
  function groupItems(list: MenuItem[]) {
    const out: Array<{ group: string | null; items: Array<{ it: MenuItem; i: number }> }> = [];
    list.forEach(function (it: MenuItem, i: number) {
      const g = it.type === 'radio' && it.group ? it.group : null;
      const last = out[out.length - 1];
      if (last && last.group === g && g !== null) last.items.push({ it: it, i: i });
      else out.push({ group: g, items: [{ it: it, i: i }] });
    });
    return out;
  }
  function renderItem(it: MenuItem, i: number) {
    if (it.separator) return <div key={'s' + i} role="separator" className="aura-menu__sep" />;
    const isRadio = it.type === 'radio';
    const isCheck = !isRadio && it.checked !== undefined;
    const lead = isRadio ? (
      <span className={cx('aura-menu__radio', it.checked && 'is-on')} />
    ) : isCheck ? (
      <span className={cx('aura-menu__check', it.checked && 'is-on')}>
        {it.checked ? <Icon name="check" size={12} strokeWidth={3} /> : null}
      </span>
    ) : it.icon ? (
      <Icon name={it.icon} />
    ) : (
      <span className="aura-menu__blank" />
    );
    const body = [
      <React.Fragment key="l">{lead}</React.Fragment>,
      <span key="t" className="aura-menu__label">
        {it.label}
      </span>,
      it.hint ? (
        <span key="h" className="aura-menu__hint">
          {it.hint}
        </span>
      ) : null,
    ];
    const cls = cx('aura-menu__item', it.tone === 'danger' && 'aura-menu__item--danger');
    if (it.href && !it.disabled)
      return (
        <Link
          key={i}
          href={it.href}
          target={it.target}
          rel={it.target === '_blank' ? 'noreferrer' : undefined}
          tabIndex={-1}
          role="menuitem"
          className={cls}
          onClick={function (e: React.MouseEvent) {
            if (it.onSelect) it.onSelect();
            /* From the keyboard (detail 0) focus goes back to the trigger, not to <body> (5.1.1). */
            props.onClose(e.detail === 0);
          }}
        >
          {body}
        </Link>
      );
    return (
      <button
        key={i}
        type="button"
        tabIndex={-1}
        disabled={it.disabled}
        role={isRadio ? 'menuitemradio' : isCheck ? 'menuitemcheckbox' : 'menuitem'}
        aria-checked={isRadio || isCheck ? !!it.checked : undefined}
        className={cls}
        onClick={function () {
          if (it.onSelect) it.onSelect();
          if (!it.keepOpen) props.onClose(true);
        }}
      >
        {body}
      </button>
    );
  }
  const el = (
    <div
      ref={merged}
      role="menu"
      aria-label={props.label}
      className="aura-menu"
      onKeyDown={onKeyDown}
      style={{
        top: pos ? pos.top : -9999,
        left: pos ? pos.left : -9999,
        maxHeight: pos && pos.maxHeight ? pos.maxHeight : undefined,
      }}
    >
      {groupItems(items).map(function (block, bi) {
        const rendered = block.items.map(function (x) {
          return renderItem(x.it, x.i);
        });
        return block.group ? (
          <div key={'g' + bi} role="group" aria-label={block.group} className="aura-menu__group">
            {rendered}
          </div>
        ) : (
          <React.Fragment key={'f' + bi}>{rendered}</React.Fragment>
        );
      })}
    </div>
  );
  return mounted ? createPortal(el, document.body) : null;
});
