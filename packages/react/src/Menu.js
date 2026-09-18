import * as React from 'react';
import { createPortal } from 'react-dom';
import { cx, useIsoLayoutEffect, useMounted, useMergedRef } from './internal.js';
import { Icon } from './Icon.js';
const h = React.createElement;

export const Menu = React.forwardRef(function Menu(props, ref) {
  var own = React.useRef(null), merged = useMergedRef(ref, own);
  var posState = React.useState(null);
  var pos = posState[0], setPos = posState[1];
  var items = props.items || [];
  var mounted = useMounted();
  useIsoLayoutEffect(function () {
    var a = props.anchor, m = own.current;
    if (!a || !m) return;
    var r = a.getBoundingClientRect(), mh = m.offsetHeight, mw = m.offsetWidth;
    var top = r.bottom + 4;
    if (top + mh > window.innerHeight - 8 && r.top - mh - 4 > 8) top = r.top - mh - 4;
    var left = Math.max(8, Math.min(r.right - mw, window.innerWidth - mw - 8));
    setPos({ top: top, left: left });
  }, [props.anchor, mounted]);
  React.useEffect(function () {
    if (!mounted) return;
    var first = own.current && own.current.querySelector('[role^="menuitem"]:not([disabled])');
    if (first && props.autoFocus !== false) first.focus();
    function outside(e) { if (own.current && !own.current.contains(e.target) && !(props.anchor && props.anchor.contains(e.target))) props.onClose(false); }
    function onScroll(e) { if (own.current && !own.current.contains(e.target)) props.onClose(false); }
    document.addEventListener('pointerdown', outside, true);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    return function () {
      document.removeEventListener('pointerdown', outside, true);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
    };
  }, [mounted]);
  function onKeyDown(e) {
    var list = Array.prototype.slice.call(own.current.querySelectorAll('[role^="menuitem"]:not([disabled])'));
    var i = list.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); list[(i + 1) % list.length].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); list[(i - 1 + list.length) % list.length].focus(); }
    else if (e.key === 'Home') { e.preventDefault(); list[0].focus(); }
    else if (e.key === 'End') { e.preventDefault(); list[list.length - 1].focus(); }
    else if (e.key === 'Escape') { e.preventDefault(); props.onClose(true); }
    else if (e.key === 'Tab') { props.onClose(true); }
    e.stopPropagation();
  }
  var el = h('div', {
    ref: merged, role: 'menu', 'aria-label': props.label, className: 'aura-menu', onKeyDown: onKeyDown,
    style: { top: pos ? pos.top : -9999, left: pos ? pos.left : -9999 }
  }, items.map(function (it, i) {
    if (it.separator) return h('div', { key: 's' + i, role: 'separator', className: 'aura-menu__sep' });
    var isCheck = it.checked !== undefined;
    return h('button', {
      key: i, type: 'button', tabIndex: -1, disabled: it.disabled,
      role: isCheck ? 'menuitemcheckbox' : 'menuitem', 'aria-checked': isCheck ? !!it.checked : undefined,
      className: 'aura-menu__item',
      onClick: function () { it.onSelect(); if (!it.keepOpen) props.onClose(true); }
    },
      isCheck ? h('span', { className: cx('aura-menu__check', it.checked && 'is-on') }, it.checked ? h(Icon, { name: 'check', size: 12, strokeWidth: 3 }) : null)
              : (it.icon ? h(Icon, { name: it.icon }) : h('span', { className: 'aura-menu__blank' })),
      h('span', { className: 'aura-menu__label' }, it.label),
      it.hint ? h('span', { className: 'aura-menu__hint' }, it.hint) : null);
  }));
  return mounted ? createPortal(el, document.body) : null;
});
