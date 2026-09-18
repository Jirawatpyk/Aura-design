import * as React from 'react';
import { FOCUSABLE, useMounted } from './internal.js';

/* Shared modal behaviour for Dialog and Drawer: mount after hydration, move focus in, lock page scroll,
 * trap Tab, close on Escape, and hand focus back to whatever opened it. */
export function useModal(open, ref, opts) {
  var mounted = useMounted();
  var prev = React.useRef(null);
  var o = opts || {};
  React.useEffect(function () {
    if (!open || !mounted) return;
    prev.current = document.activeElement;
    var body = document.body, overflow = body.style.overflow;
    body.style.overflow = 'hidden';
    var el = ref.current;
    var target = el && (el.querySelector('[data-autofocus]') || el.querySelector(o.bodySelector + ' ' + FOCUSABLE) || el.querySelector(o.footSelector + ' ' + FOCUSABLE) || el);
    if (target && o.autoFocus !== false) target.focus();
    return function () { body.style.overflow = overflow; if (prev.current && prev.current.focus) prev.current.focus(); };
  }, [open, mounted]);
  function onKeyDown(e) {
    if (e.key === 'Escape') { e.stopPropagation(); if (o.onEscape) o.onEscape(); return; }
    if (e.key !== 'Tab' || !ref.current) return;
    var list = Array.prototype.slice.call(ref.current.querySelectorAll(FOCUSABLE));
    if (!list.length) { e.preventDefault(); return; }
    var first = list[0], last = list[list.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  return { ready: open && mounted, onKeyDown: onKeyDown };
}
