import * as React from 'react';
import { FOCUSABLE, useMounted } from './internal.js';

/* Shared modal behaviour for Dialog and Drawer: mount after hydration, move focus in, lock page scroll,
 * trap Tab, close on Escape, and hand focus back to whatever opened it. */
export interface ModalOptions {
  /** Selector of the body part that should receive focus first. */
  bodySelector?: string | undefined;
  /** Selector of the footer, focused when the body has nothing focusable. */
  footSelector?: string | undefined;
  autoFocus?: boolean | undefined;
  onEscape?: (() => void) | undefined;
}
/* 5.1.1: one page-scroll lock shared by every open modal. Each modal used to save and restore body overflow on its
 * own, so two dialogs closing out of order left the page locked. */
let locks = 0,
  savedOverflow = '';
function lockScroll(): () => void {
  const body = document.body;
  if (locks === 0) savedOverflow = body.style.overflow;
  locks++;
  body.style.overflow = 'hidden';
  let done = false;
  return function () {
    if (done) return;
    done = true;
    locks--;
    if (locks === 0) body.style.overflow = savedOverflow;
  };
}
/* The controls Tab can actually reach: not tabindex=-1 (roving tabs, closed groups' children) and not hidden. */
function tabbable(el: HTMLElement): HTMLElement[] {
  const all = Array.prototype.filter.call(el.querySelectorAll<HTMLElement>(FOCUSABLE), function (c: HTMLElement) {
    return c.tabIndex >= 0;
  }) as HTMLElement[];
  const shown = all.filter(function (c: HTMLElement) {
    return c.getClientRects().length > 0;
  });
  /* No layout at all (jsdom in unit tests): don't treat every control as hidden. */
  return shown.length ? shown : all;
}
export function useModal(
  open: boolean | undefined,
  ref: React.RefObject<HTMLElement | null>,
  opts?: ModalOptions,
): { ready: boolean; onKeyDown: (e: React.KeyboardEvent) => void } {
  const mounted = useMounted();
  const prev = React.useRef<HTMLElement | null>(null);
  const o = opts || {};
  React.useEffect(
    function () {
      if (!open || !mounted) return;
      prev.current = document.activeElement as HTMLElement | null;
      const unlock = lockScroll();
      const el = ref.current;
      /* The first control in the Tab order inside a part. FOCUSABLE is a selector list, so every part is scoped
       * (5.1: before, `button` alone matched the header's close button). Skip tabindex=-1 (roving tabs, segments)
       * and anything hidden. */
      const firstIn = function (scope: string | undefined): HTMLElement | null {
        if (!scope || !el) return null;
        const sel = FOCUSABLE.split(',')
          .map(function (s: string) {
            return scope + ' ' + s;
          })
          .join(',');
        const list = el.querySelectorAll<HTMLElement>(sel);
        for (let i = 0; i < list.length; i++)
          if (list[i].tabIndex >= 0 && list[i].getClientRects().length > 0) return list[i];
        return null;
      };
      const target =
        el &&
        (el.querySelector<HTMLElement>('[data-autofocus]') || firstIn(o.bodySelector) || firstIn(o.footSelector) || el);
      if (target && o.autoFocus !== false) target.focus();
      return function () {
        unlock();
        if (prev.current && prev.current.focus) prev.current.focus();
      };
    },
    [open, mounted],
  );
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      e.stopPropagation();
      if (o.onEscape) o.onEscape();
      return;
    }
    if (e.key !== 'Tab' || !ref.current || e.defaultPrevented) return;
    /* A panel portaled out of the dialog (Popover, a date picker's calendar) keeps its own Tab order; its key presses
     * still bubble here through React. */
    if (!ref.current.contains(e.target as Node)) return;
    /* 5.1.1: wrap between the first and last *reachable* controls; the raw list ended on a tabindex=-1 or hidden
     * control, so Tab from the real last one left the dialog. */
    const list = tabbable(ref.current);
    if (!list.length) {
      e.preventDefault();
      return;
    }
    const first = list[0],
      last = list[list.length - 1],
      active = document.activeElement as HTMLElement | null,
      stray = active === ref.current;
    if (e.shiftKey && (active === first || stray)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (active === last || stray)) {
      e.preventDefault();
      first.focus();
    }
  }
  return { ready: !!open && mounted, onKeyDown: onKeyDown };
}
