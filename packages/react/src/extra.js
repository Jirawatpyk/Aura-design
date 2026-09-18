import * as React from 'react';
import { createPortal } from 'react-dom';
import { cx, omit, uid, useMaybeControlled, useMergedRef, useMounted, useIsoLayoutEffect, trapTab, FOCUSABLE } from './internal.js';
import { useStrings } from './locale.js';
import { Icon } from './Icon.js';
import { IconButton } from './IconButton.js';
const h = React.createElement;
var TONES = ['neutral', 'accent', 'success', 'warning', 'danger'];
function tone(t) { return TONES.indexOf(t) >= 0 ? t : 'neutral'; }

/* ---------- Badge: a static label or count ---------- */
export const Badge = React.forwardRef(function Badge(props, ref) {
  var rest = omit(props, ['tone', 'variant', 'icon', 'className', 'children']);
  return h('span', Object.assign({}, rest, { ref: ref, className: cx('aura-badge', 'aura-badge--' + tone(props.tone), props.variant === 'solid' && 'is-solid', props.variant === 'outline' && 'is-outline', props.className) }),
    props.icon ? h(Icon, { name: props.icon, size: 12 }) : null, props.children);
});

/* ---------- Tag: an interactive chip — removable (onRemove) or selectable (selected + onClick) ---------- */
export const Tag = React.forwardRef(function Tag(props, ref) {
  var t = useStrings();
  var selectable = props.onClick != null || props.selected != null;
  var rest = omit(props, ['onRemove', 'selected', 'icon', 'className', 'children', 'disabled', 'removeLabel']);
  var inner = [props.icon ? h(Icon, { key: 'i', name: props.icon, size: 14 }) : null, h('span', { key: 't', className: 'aura-tag__text' }, props.children)];
  if (selectable) {
    return h('button', Object.assign({}, rest, { ref: ref, type: 'button', 'aria-pressed': !!props.selected, disabled: props.disabled,
      className: cx('aura-tag is-selectable', props.selected && 'is-selected', props.className) }),
      props.selected ? h(Icon, { name: 'check', size: 14 }) : inner[0], inner[1]);
  }
  return h('span', Object.assign({}, rest, { ref: ref, className: cx('aura-tag', props.disabled && 'is-disabled', props.className) }), inner,
    props.onRemove && !props.disabled ? h('button', { type: 'button', className: 'aura-tag__remove', 'aria-label': props.removeLabel || t.remove(typeof props.children === 'string' ? props.children : ''), onClick: props.onRemove },
      h(Icon, { name: 'x', size: 12 })) : null);
});

/* ---------- Progress: determinate (value) or indeterminate (no value) ---------- */
export const Progress = React.forwardRef(function Progress(props, ref) {
  var auto = uid(), id = props.id || auto;
  var max = props.max || 100, det = props.value != null;
  var pct = det ? Math.max(0, Math.min(100, (props.value / max) * 100)) : 0;
  var shown = props.valueLabel != null ? props.valueLabel : det ? Math.round(pct) + '%' : null;
  return h('div', { ref: ref, className: cx('aura-progress', 'aura-progress--' + tone(props.tone || 'accent'), props.size === 'sm' && 'is-sm', props.className) },
    props.label || (props.showValue && shown) ? h('div', { className: 'aura-progress__head' },
      props.label ? h('span', { className: 'aura-progress__label', id: id + '-label' }, props.label) : h('span'),
      props.showValue && shown ? h('span', { className: 'aura-progress__value' }, shown) : null) : null,
    h('div', { className: cx('aura-progress__track', !det && 'is-indeterminate'), role: 'progressbar',
      'aria-labelledby': props.label ? id + '-label' : undefined, 'aria-label': props.label ? undefined : props['aria-label'],
      'aria-valuemin': det ? 0 : undefined, 'aria-valuemax': det ? max : undefined, 'aria-valuenow': det ? props.value : undefined,
      'aria-valuetext': det && props.valueLabel != null ? String(props.valueLabel) : undefined },
      h('span', { className: 'aura-progress__bar', style: det ? { width: pct + '%' } : undefined })),
    props.hint ? h('p', { className: 'aura-progress__hint' }, props.hint) : null);
});

/* ---------- Skeleton: placeholder shapes while content loads ---------- */
export const Skeleton = React.forwardRef(function Skeleton(props, ref) {
  var v = props.variant || 'text';
  if (v === 'text' && (props.lines || 1) > 1) {
    var n = props.lines, rows = [];
    for (var i = 0; i < n; i++) rows.push(h('span', { key: i, className: 'aura-skel aura-skel--text', style: { width: i === n - 1 ? '60%' : '100%' } }));
    return h('span', { ref: ref, className: cx('aura-skel-lines', props.className), 'aria-hidden': true, style: props.width ? { width: props.width } : undefined }, rows);
  }
  var style = { width: props.width, height: props.height };
  if (v === 'circle') { style.width = style.height = props.size || props.width || 40; }
  return h('span', { ref: ref, 'aria-hidden': true, className: cx('aura-skel', 'aura-skel--' + v, props.className), style: style });
});

/* ---------- EmptyState: nothing to show yet, and what to do about it ---------- */
export const EmptyState = React.forwardRef(function EmptyState(props, ref) {
  var HT = 'h' + (props.headingLevel || 3);
  return h('div', { ref: ref, className: cx('aura-empty', props.size === 'sm' && 'is-sm', props.bordered && 'is-bordered', props.className) },
    h('span', { className: 'aura-empty__icon', 'aria-hidden': true }, h(Icon, { name: props.icon || 'inbox', size: props.size === 'sm' ? 'md' : 'lg' })),
    h(HT, { className: 'aura-empty__title' }, props.title),
    props.description ? h('p', { className: 'aura-empty__text' }, props.description) : null,
    props.action ? h('div', { className: 'aura-empty__action' }, props.action) : null);
});

/* ---------- Pagination: page links for lists outside DataTable ---------- */
function pageList(page, count, sib) {
  var out = [], lo = Math.max(2, page - sib), hi = Math.min(count - 1, page + sib);
  if (page - sib <= 3) { lo = 2; hi = Math.min(count - 1, Math.max(hi, 3 + 2 * sib)); }
  if (page + sib >= count - 2) { hi = count - 1; lo = Math.max(2, Math.min(lo, count - 2 - 2 * sib)); }
  out.push(1);
  if (lo === 3) out.push(2); else if (lo > 3) out.push('…a');
  for (var i = lo; i <= hi; i++) out.push(i);
  if (hi === count - 2) out.push(count - 1); else if (hi < count - 2) out.push('…b');
  if (count > 1) out.push(count);
  return out;
}
export const Pagination = React.forwardRef(function Pagination(props, ref) {
  var t = useStrings();
  var count = Math.max(1, props.pageCount || 1);
  var st = useMaybeControlled(props.page, props.defaultPage || 1, props.onChange);
  var page = Math.min(count, Math.max(1, st[0]));
  function go(p) { if (p >= 1 && p <= count && p !== page) st[1](p); }
  var link = props.getHref;
  function item(p, label, extra) {
    var common = Object.assign({ className: cx('aura-page', p === page && 'is-current'), 'aria-current': p === page ? 'page' : undefined, 'aria-label': t.pageN(p) }, extra);
    return link ? h('a', Object.assign({ href: link(p), onClick: function (e) { if (props.onChange) { e.preventDefault(); go(p); } } }, common), label)
      : h('button', Object.assign({ type: 'button', onClick: function () { go(p); } }, common), label);
  }
  return h('nav', { ref: ref, className: cx('aura-pagination', props.className), 'aria-label': props.label || t.pagination },
    h(IconButton, { icon: 'chevron-left', label: t.prevPage, disabled: page <= 1, onClick: function () { go(page - 1); } }),
    h('ol', { className: 'aura-pagination__list' }, pageList(page, count, props.siblingCount == null ? 1 : props.siblingCount).map(function (p) {
      return typeof p === 'number' ? h('li', { key: p }, item(p, p)) : h('li', { key: p, className: 'aura-pagination__gap', 'aria-hidden': true }, '…');
    })),
    h('span', { className: 'aura-pagination__compact', 'aria-hidden': true }, t.page(page, count)),
    h(IconButton, { icon: 'chevron-right', label: t.nextPage, disabled: page >= count, onClick: function () { go(page + 1); } }));
});

/* ---------- Accordion: stacked sections that open and close ---------- */
export const Accordion = React.forwardRef(function Accordion(props, ref) {
  var auto = uid(), base = props.id || auto;
  var multiple = props.type === 'multiple';
  var st = useMaybeControlled(props.value, props.defaultValue != null ? props.defaultValue : multiple ? [] : null, props.onChange);
  var open = multiple ? (st[0] || []) : st[0] ? [st[0]] : [];
  var HT = 'h' + (props.headingLevel || 3);
  var items = props.items || [];
  function toggle(id) {
    var isOpen = open.indexOf(id) >= 0;
    if (multiple) st[1](isOpen ? open.filter(function (x) { return x !== id; }) : open.concat([id]));
    else st[1](isOpen ? (props.collapsible === false ? id : null) : id);
  }
  function onKey(e) {
    var btns = Array.prototype.slice.call(e.currentTarget.querySelectorAll(':scope > .aura-accordion__item > .aura-accordion__heading > button:not([disabled])'));
    var i = btns.indexOf(document.activeElement), k = e.key, n = null;
    if (i < 0) return;
    if (k === 'ArrowDown') n = btns[(i + 1) % btns.length];
    else if (k === 'ArrowUp') n = btns[(i - 1 + btns.length) % btns.length];
    else if (k === 'Home') n = btns[0];
    else if (k === 'End') n = btns[btns.length - 1];
    if (n) { e.preventDefault(); n.focus(); }
  }
  return h('div', { ref: ref, className: cx('aura-accordion', props.className), onKeyDown: onKey },
    items.map(function (it) {
      var on = open.indexOf(it.id) >= 0, bid = base + '-btn-' + it.id, pid = base + '-panel-' + it.id;
      return h('div', { key: it.id, className: cx('aura-accordion__item', on && 'is-open') },
        h(HT, { className: 'aura-accordion__heading' },
          h('button', { type: 'button', id: bid, 'aria-expanded': on, 'aria-controls': pid, disabled: it.disabled, onClick: function () { toggle(it.id); } },
            it.icon ? h(Icon, { name: it.icon, className: 'aura-accordion__lead' }) : null,
            h('span', { className: 'aura-accordion__title' }, it.title,
              it.description ? h('span', { className: 'aura-accordion__desc' }, it.description) : null),
            h(Icon, { name: 'chevron-down', className: 'aura-accordion__chevron' }))),
        h('div', { id: pid, role: 'region', 'aria-labelledby': bid, className: 'aura-accordion__panel', hidden: !on }, it.content));
    }));
});

/* ---------- Popover: a small non-modal panel anchored to a trigger ---------- */
function position(anchor, pop, placement) {
  var r = anchor.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight, vw = window.innerWidth, vh = window.innerHeight, gap = 6;
  var side = (placement || 'bottom-start').split('-')[0], align = (placement || 'bottom-start').split('-')[1] || 'start';
  if (side === 'bottom' && r.bottom + gap + ph > vh - 8 && r.top - gap - ph > 8) side = 'top';
  else if (side === 'top' && r.top - gap - ph < 8 && r.bottom + gap + ph < vh - 8) side = 'bottom';
  var top = side === 'top' ? r.top - gap - ph : r.bottom + gap;
  var left = align === 'end' ? r.right - pw : align === 'center' ? r.left + r.width / 2 - pw / 2 : r.left;
  return { top: Math.max(8, top), left: Math.max(8, Math.min(left, vw - pw - 8)), side: side };
}
export const Popover = React.forwardRef(function Popover(props, ref) {
  var t = useStrings();
  var auto = uid(), id = props.id || auto;
  var st = useMaybeControlled(props.open, !!props.defaultOpen, props.onOpenChange);
  var open = !!st[0];
  var wrap = React.useRef(null), pop = React.useRef(null), popMerged = useMergedRef(ref, pop);
  var pos = React.useState(null), mounted = useMounted();
  function trigger() { return wrap.current && (wrap.current.querySelector('button, [role="button"], a, input') || wrap.current.firstElementChild); }
  function close(restore) { st[1](false); if (restore) { var tr = trigger(); if (tr && tr.focus) tr.focus(); } }
  useIsoLayoutEffect(function () {
    if (!open || !pop.current || !trigger()) return;
    function place() { if (pop.current && trigger()) pos[1](position(trigger(), pop.current, props.placement)); }
    place();
    window.addEventListener('resize', place); window.addEventListener('scroll', place, true);
    return function () { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); };
  }, [open, mounted, props.placement]);
  React.useEffect(function () {
    if (!open || !mounted) return;
    if (props.autoFocus !== false && pop.current) { var f = pop.current.querySelector('[data-autofocus]') || pop.current.querySelector(FOCUSABLE); (f || pop.current).focus(); }
    function outside(e) { if (pop.current && pop.current.contains(e.target)) return; if (wrap.current && wrap.current.contains(e.target)) return; close(false); }
    document.addEventListener('pointerdown', outside, true);
    return function () { document.removeEventListener('pointerdown', outside, true); };
  }, [open, mounted]);
  var child = React.Children.only(props.trigger);
  var panel = open && mounted ? createPortal(
    h('div', { ref: popMerged, id: id, role: 'dialog', 'aria-modal': false, 'aria-label': props.title ? undefined : props.label, 'aria-labelledby': props.title ? id + '-title' : undefined,
      tabIndex: -1, className: cx('aura-popover', pos[0] && 'is-' + pos[0].side, props.className),
      style: Object.assign({ top: pos[0] ? pos[0].top : -9999, left: pos[0] ? pos[0].left : -9999 }, props.width ? { width: props.width } : null),
      onKeyDown: function (e) { if (e.key === 'Escape') { e.stopPropagation(); close(true); } else trapTab(e, pop.current); } },
      props.title ? h('div', { className: 'aura-popover__head' },
        h('p', { className: 'aura-popover__title', id: id + '-title' }, props.title),
        h(IconButton, { icon: 'x', label: t.close, onClick: function () { close(true); } })) : null,
      h('div', { className: 'aura-popover__body' }, typeof props.children === 'function' ? props.children({ close: function () { close(true); } }) : props.children)),
    document.body) : null;
  return h('span', { ref: wrap, className: 'aura-popover-anchor' },
    React.cloneElement(child, { onClick: function (e) { if (child.props.onClick) child.props.onClick(e); st[1](!open); }, 'aria-haspopup': 'dialog', 'aria-expanded': open, 'aria-controls': open ? id : undefined }),
    panel);
});
