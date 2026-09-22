import * as React from 'react';
import { useStrings, useAuraLocale } from './locale.js';
import { createPortal } from 'react-dom';
import { cx, uid, useMounted, useIsoLayoutEffect, useMergedRef } from './internal.js';
import { Icon } from './Icon.js';
import { IconButton } from './IconButton.js';
import type { AlertProps, FeedbackTone, IconName, ToastOptions, TooltipProps } from './types.js';
const h = React.createElement;

export var ALERT_ICON: Record<FeedbackTone, IconName> = { info: 'info', success: 'circle-check', warning: 'triangle-alert', danger: 'circle-alert' };

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  var t = useStrings();
  var tone = props.tone || 'info';
  return h('div', { ref: ref, className: cx('aura-alert', 'aura-alert--' + tone, props.className),
      role: tone === 'danger' || tone === 'warning' ? 'alert' : 'status' },
    h(Icon, { name: ALERT_ICON[tone], className: 'aura-alert__icon' }),
    h('div', { className: 'aura-alert__body' },
      props.title ? h('p', { className: 'aura-alert__title' }, props.title) : null,
      props.children ? h('div', { className: 'aura-alert__text' }, props.children) : null,
      props.action ? h('div', { className: 'aura-alert__action' }, props.action) : null),
    props.onDismiss ? h(IconButton, { icon: 'x', label: t.dismiss, className: 'aura-alert__close', onClick: props.onDismiss }) : null);
});

/* Toasts: Aura.toast({...}) from anywhere; render <Aura.Toaster /> once near the app root. */

/** A toast on screen: its options with the id and tone filled in. */
type ToastEntry = ToastOptions & { id: string; tone: FeedbackTone };
var toastState: { list: ToastEntry[]; subs: Array<(list: ToastEntry[]) => void>; n: number } = { list: [], subs: [], n: 0 };
function emitToasts() { toastState.subs.forEach(function (f) { f(toastState.list.slice()); }); }
/** Show a toast; returns its id. Needs <Toaster /> mounted once. */
export function toast(opts: ToastOptions | string): string {
  if (typeof opts === 'string') opts = { title: opts };
  var id = opts.id || 't' + (++toastState.n);
  toastState.list = toastState.list.filter(function (t) { return t.id !== id; }).concat([Object.assign({ tone: 'info' }, opts, { id: id })]).slice(-3);
  emitToasts();
  return id;
}
toast.dismiss = function (id: string) { toastState.list = toastState.list.filter(function (t) { return t.id !== id; }); emitToasts(); };

function ToastItem(props: { toast: ToastEntry }) {
  var str = useStrings();
  var t = props.toast, timer = React.useRef<ReturnType<typeof setTimeout> | null>(null), left = React.useRef(t.duration || 5000), since = React.useRef(0);
  function start() { if (left.current === Infinity) return; since.current = Date.now(); timer.current = setTimeout(function () { toast.dismiss(t.id); }, left.current); }
  function pause() { if (timer.current) { clearTimeout(timer.current); timer.current = null; left.current -= Date.now() - since.current; } }
  React.useEffect(function () { start(); return pause; }, []);
  return h('div', { className: cx('aura-toast', 'aura-toast--' + t.tone), role: t.tone === 'danger' ? 'alert' : 'status',
      onMouseEnter: pause, onMouseLeave: start, onFocus: pause, onBlur: start },
    h(Icon, { name: ALERT_ICON[t.tone] || 'info', className: 'aura-toast__icon' }),
    h('div', { className: 'aura-toast__body' },
      h('p', { className: 'aura-toast__title' }, t.title),
      t.description ? h('p', { className: 'aura-toast__text' }, t.description) : null),
    t.action ? h('button', { type: 'button', className: 'aura-toast__action',
      onClick: function () { t.action!.onClick && t.action!.onClick(); toast.dismiss(t.id); } }, t.action.label) : null,
    h(IconButton, { icon: 'x', label: str.dismissToast, className: 'aura-toast__close', onClick: function () { toast.dismiss(t.id); } }));
}
export interface ToasterProps {
  /** Default `bottom`. */
  position?: 'bottom' | 'top';
}
export function Toaster(props: ToasterProps): React.ReactElement | null {
  var t = useStrings();
  var mounted = useMounted();
  var s = React.useState<ToastEntry[]>(toastState.list);
  React.useEffect(function () {
    toastState.subs.push(s[1]);
    return function () { toastState.subs = toastState.subs.filter(function (f) { return f !== s[1]; }); };
  }, []);
  if (!mounted) return null;
  return createPortal(h('div', { className: cx('aura-toaster', props && props.position === 'top' && 'is-top'), role: 'region', 'aria-live': 'polite', 'aria-label': t.notifications },
    s[0].map(function (t) { return h(ToastItem, { key: t.id, toast: t }); })), document.body);
}

export const Tooltip = React.forwardRef<HTMLSpanElement, TooltipProps>(function Tooltip(props, ref) {
  var id = uid(), st = React.useState(false), open = props.open !== undefined ? props.open : st[0], set = st[1];
  var anchor = React.useRef<HTMLSpanElement | null>(null), anchorMerged = useMergedRef(ref, anchor), tip = React.useRef<HTMLDivElement | null>(null), timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  var pos = React.useState<{ top: number; left: number } | null>(null);
  function show(now: boolean) { clearTimeout(timer.current); timer.current = setTimeout(function () { set(true); }, now ? 0 : (props.delay == null ? 400 : props.delay)); }
  function hide() { clearTimeout(timer.current); set(false); }
  useIsoLayoutEffect(function () {
    if (!open || !anchor.current || !tip.current) return;
    var r = anchor.current.getBoundingClientRect(), t = tip.current.getBoundingClientRect();
    var side = props.side || 'top', top = side === 'top' ? r.top - t.height - 8 : r.bottom + 8;
    if (side === 'top' && top < 8) top = r.bottom + 8;
    var left = Math.max(8, Math.min(r.left + r.width / 2 - t.width / 2, window.innerWidth - t.width - 8));
    pos[1]({ top: top, left: left });
  }, [open]);
  React.useEffect(function () {
    if (!open) return;
    function esc(e: KeyboardEvent) { if (e.key === 'Escape') hide(); }
    document.addEventListener('keydown', esc);
    return function () { document.removeEventListener('keydown', esc); };
  }, [open]);
  var child = React.Children.only(props.children) as React.ReactElement<Record<string, any>>;
  var trigger = h('span', { ref: anchorMerged, className: 'aura-tooltip-anchor',
      onMouseEnter: function () { show(false); }, onMouseLeave: hide,
      onFocus: function () { show(true); }, onBlur: hide },
    React.cloneElement(child, { 'aria-describedby': open ? id : child.props['aria-describedby'] }));
  return h(React.Fragment, null, trigger,
    open ? createPortal(h('div', { ref: tip, id: id, role: 'tooltip', className: 'aura-tooltip',
      style: { top: pos[0] ? pos[0].top : -9999, left: pos[0] ? pos[0].left : -9999 } }, props.content), document.body) : null);
});
