import * as React from 'react';
import { createPortal } from 'react-dom';
import { cx, uid, useIsoLayoutEffect, useMounted, useMergedRef } from './internal.js';
import { Icon } from './Icon.js';
import { useLinkComponent } from './locale.js';
import type { MenuItem, MenuProps } from './types.js';
import { IconCheck } from './icons.js';

/* 5.10 (Chamber-OS 73): disabled items stay in the arrow-key order (aria-disabled, WAI-ARIA APG), so every item is
 * reachable; a menu with no item at all takes focus itself, so Escape and Tab still close it. */
const ITEMS = '[role^="menuitem"]';

/* 5.30: is any part of el visible — inside the viewport and inside every box around it that clips it? A box clips
 * only along the axes its overflow isn't visible, and only an element it contains: a fixed element escapes every box
 * but one that makes a containing block (transform, filter, contain…); an absolute one escapes static boxes. */
function makesBlock(s: CSSStyleDeclaration): boolean {
  return (
    s.transform !== 'none' ||
    s.translate !== 'none' ||
    s.rotate !== 'none' ||
    s.scale !== 'none' ||
    s.filter !== 'none' ||
    (s as CSSStyleDeclaration & { backdropFilter?: string }).backdropFilter !== 'none' ||
    s.perspective !== 'none' ||
    (s as CSSStyleDeclaration & { contentVisibility?: string }).contentVisibility === 'auto' ||
    /paint|layout|strict|content/.test(s.contain) ||
    /transform|translate|rotate|scale|filter|perspective/.test(s.willChange)
  );
}
function inView(el: Element): boolean {
  if (!el.isConnected) return false;
  const r = el.getBoundingClientRect();
  if (r.width === 0 && r.height === 0) return false;
  let top = r.top,
    bottom = r.bottom,
    left = r.left,
    right = r.right;
  let pos = getComputedStyle(el).position;
  for (let p = el.parentElement; p && p !== document.body && p !== document.documentElement; p = p.parentElement) {
    const s = getComputedStyle(p);
    const block = makesBlock(s);
    if (pos === 'fixed' && !block) continue;
    if (pos === 'absolute' && s.position === 'static' && !block) continue;
    if (s.display !== 'contents') {
      const b = p.getBoundingClientRect();
      if (s.overflowX !== 'visible') {
        left = Math.max(left, b.left);
        right = Math.min(right, b.right);
      }
      if (s.overflowY !== 'visible') {
        top = Math.max(top, b.top);
        bottom = Math.min(bottom, b.bottom);
      }
    }
    /* From here on, what clips p clips el. */
    pos = s.position === 'fixed' || s.position === 'absolute' ? s.position : 'static';
  }
  top = Math.max(top, 0);
  left = Math.max(left, 0);
  bottom = Math.min(bottom, window.innerHeight);
  right = Math.min(right, window.innerWidth);
  return bottom > top && right > left;
}

/** Popover list anchored to an element, rendered in a portal. */
export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(function Menu(props, ref) {
  const own = React.useRef<HTMLDivElement | null>(null),
    merged = useMergedRef(ref, own);
  const posState = React.useState<{ top: number; left: number; maxHeight?: number } | null>(null);
  const pos = posState[0],
    setPos = posState[1];
  const items = props.items || [];
  const mounted = useMounted();
  const headerId = uid(),
    itemId = uid();
  const hasHeader = props.header != null && props.header !== false && props.header !== '';
  const Link = useLinkComponent(props.linkComponent);
  /* Placement: below the trigger if it fits, else above; called on open and (5.30) on every scroll and resize. */
  function place(): void {
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
    setPos(function (p) {
      return p && p.top === top && p.left === left && p.maxHeight === maxHeight
        ? p
        : { top: top, left: left, maxHeight: maxHeight };
    });
  }
  const placeRef = React.useRef(place);
  placeRef.current = place;
  /* The listeners below are added once per open: they read the current trigger and onClose through this ref. */
  const live = React.useRef({ anchor: props.anchor, onClose: props.onClose });
  live.current = { anchor: props.anchor, onClose: props.onClose };
  useIsoLayoutEffect(
    function () {
      place();
    },
    [props.anchor, mounted, hasHeader],
  );
  /* A header that appears or goes while open (an async user fetch) rebuilds the items; keep focus in the menu. */
  const hadHeader = React.useRef(hasHeader);
  React.useEffect(
    function () {
      if (hadHeader.current === hasHeader) return;
      hadHeader.current = hasHeader;
      const a = document.activeElement;
      if (own.current && (!a || a === document.body)) {
        const first = own.current.querySelector<HTMLElement>(ITEMS);
        (first || own.current.querySelector<HTMLElement>('[role="menu"]') || own.current).focus();
      }
    },
    [hasHeader],
  );
  React.useEffect(
    function () {
      if (!mounted) return;
      const first = own.current && own.current.querySelector<HTMLElement>(ITEMS);
      if (props.autoFocus !== false) {
        if (first) first.focus();
        else if (own.current) (own.current.querySelector<HTMLElement>('[role="menu"]') || own.current).focus();
      }
      function outside(e: Event) {
        if (
          own.current &&
          !own.current.contains(e.target as Node) &&
          !(props.anchor && props.anchor.contains(e.target as Node))
        )
          props.onClose(false);
      }
      /* 5.30 (Chamber-OS 136): a scroll or resize moves the menu with its trigger, as Popover does — a slight finger
       * drag, the phone's address bar or keyboard no longer close it. Once the trigger is wholly out of view (the
       * viewport, or a box around it that clips it) the menu closes, without taking focus back to it — except inside a
       * Dialog or Drawer, where focus goes back to the trigger without scrolling. */
      function onScroll(e: Event) {
        if (own.current && e.target instanceof Node && own.current.contains(e.target)) return;
        const a = live.current.anchor;
        if (a && !inView(a)) {
          live.current.onClose(false);
          /* Inside a Dialog or Drawer focus must stay in it: back to the trigger, without scrolling to it. */
          if (a instanceof HTMLElement && a.closest('[aria-modal="true"]')) a.focus({ preventScroll: true });
        } else placeRef.current();
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
    const list: HTMLElement[] = Array.prototype.slice.call(own.current!.querySelectorAll(ITEMS));
    const i = list.indexOf(document.activeElement as HTMLElement);
    if (!list.length && e.key !== 'Escape' && e.key !== 'Tab') {
      e.stopPropagation();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      list[(i + 1) % list.length].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      /* From the menu itself (a click on a separator focuses it), Up goes to the last item. */
      list[i < 0 ? list.length - 1 : (i - 1 + list.length) % list.length].focus();
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
        {it.checked ? <Icon name={<IconCheck />} size={12} strokeWidth={3} /> : null}
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
    const reasonId = it.disabled && it.disabledReason ? itemId + '-r' + i : undefined;
    if (reasonId)
      body[2] = (
        /* Hidden from the name (it would be read twice); aria-describedby still reads it. */
        <span key="h" id={reasonId} className="aura-menu__hint aura-menu__reason" aria-hidden={true}>
          {it.disabledReason}
        </span>
      );
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
        aria-disabled={it.disabled ? true : undefined}
        aria-describedby={reasonId}
        role={isRadio ? 'menuitemradio' : isCheck ? 'menuitemcheckbox' : 'menuitem'}
        aria-checked={isRadio || isCheck ? !!it.checked : undefined}
        className={cls}
        onClick={function () {
          /* A disabled item is focusable and announced, but choosing it does nothing and the menu stays open. */
          if (it.disabled) return;
          if (it.onSelect) it.onSelect();
          if (!it.keepOpen) props.onClose(true);
        }}
      >
        {body}
      </button>
    );
  }
  const style = {
    top: pos ? pos.top : -9999,
    left: pos ? pos.left : -9999,
    maxHeight: pos && pos.maxHeight ? pos.maxHeight : undefined,
  };
  const list = groupItems(items).map(function (block, bi) {
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
  });
  /* 5.7: a header sits outside role="menu" (a menu may only hold items, groups and separators) and describes it. */
  const el = hasHeader ? (
    <div ref={merged} className="aura-menu has-header" onKeyDown={onKeyDown} style={style}>
      <div
        className="aura-menu__header"
        id={headerId}
        /* A click on the header text keeps focus on the item, so Escape and the arrows still work. */
        onMouseDown={function (e: React.MouseEvent) {
          e.preventDefault();
        }}
      >
        {props.header}
      </div>
      <div role="menu" tabIndex={-1} aria-label={props.label} aria-describedby={headerId} className="aura-menu__list">
        {list}
      </div>
    </div>
  ) : (
    <div
      ref={merged}
      role="menu"
      tabIndex={-1}
      aria-label={props.label}
      className="aura-menu"
      onKeyDown={onKeyDown}
      style={style}
    >
      {list}
    </div>
  );
  return mounted ? createPortal(el, document.body) : null;
});
