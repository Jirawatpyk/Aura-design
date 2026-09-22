import * as React from 'react';
import { useStrings, useAuraLocale } from './locale.js';
import { createPortal } from 'react-dom';
import { cx, uid, useMergedRef } from './internal.js';
import { IconButton } from './IconButton.js';
import { useModal } from './overlay.js';
import type { DialogProps, DrawerProps } from './types.js';
const h = React.createElement;

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(function Dialog(props, ref) {
  var t = useStrings();
  var own = React.useRef<HTMLDivElement | null>(null), merged = useMergedRef(ref, own), titleId = uid(), descId = uid();
  function close() { if (props.dismissible !== false && props.onClose) props.onClose(); }
  var modal = useModal(props.open, own, { autoFocus: props.autoFocus, onEscape: close, bodySelector: '.aura-dialog__body', footSelector: '.aura-dialog__foot' });
  if (!modal.ready) return null;
  return createPortal(
    h('div', { className: 'aura-dialog-layer', onKeyDown: modal.onKeyDown },
      h('div', { className: 'aura-scrim', onClick: close, 'aria-hidden': true }),
      h('div', { ref: merged, role: props.role || 'dialog', 'aria-modal': true, 'aria-labelledby': titleId,
          'aria-describedby': props.description ? descId : undefined, tabIndex: -1,
          className: cx('aura-dialog', 'aura-dialog--' + (props.size || 'md'), props.className) },
        h('div', { className: 'aura-dialog__head' },
          h('h2', { className: 'aura-dialog__title', id: titleId }, props.title),
          props.dismissible !== false ? h(IconButton, { icon: 'x', label: t.close, className: 'aura-dialog__close', onClick: close }) : null),
        props.description ? h('p', { className: 'aura-dialog__desc', id: descId }, props.description) : null,
        props.children ? h('div', { className: 'aura-dialog__body' }, props.children) : null,
        props.footer ? h('div', { className: 'aura-dialog__foot' }, props.footer) : null)),
    document.body);
});

/* Drawer — a side sheet for detail views and filters. Full width below 640px. */
/** Side panel over the page: record detail, filters, mobile navigation. Modal (focus trap, scroll lock, focus restore). */
export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(function Drawer(props, ref) {
  var t = useStrings();
  var own = React.useRef<HTMLDivElement | null>(null), merged = useMergedRef(ref, own), titleId = uid(), descId = uid();
  function close() { if (props.dismissible !== false && props.onClose) props.onClose(); }
  var modal = useModal(props.open, own, { autoFocus: props.autoFocus, onEscape: close, bodySelector: '.aura-drawer__body', footSelector: '.aura-drawer__foot' });
  if (!modal.ready) return null;
  var side = props.side === 'left' ? 'left' : 'right';
  return createPortal(
    h('div', { className: 'aura-dialog-layer aura-drawer-layer', onKeyDown: modal.onKeyDown },
      h('div', { className: 'aura-scrim', onClick: close, 'aria-hidden': true }),
      h('div', { ref: merged, role: 'dialog', 'aria-modal': true, 'aria-labelledby': props.title ? titleId : undefined,
          'aria-label': props.title ? undefined : props['aria-label'],
          'aria-describedby': props.description ? descId : undefined, tabIndex: -1,
          className: cx('aura-drawer', 'aura-drawer--' + side, 'aura-drawer--' + (props.size || 'md'), props.className) },
        props.title || props.dismissible !== false ? h('div', { className: 'aura-drawer__head' },
          props.title ? h('h2', { className: 'aura-drawer__title', id: titleId }, props.title) : h('span', { style: { flex: 1 } }),
          props.dismissible !== false ? h(IconButton, { icon: 'x', label: t.close, onClick: close }) : null) : null,
        props.description ? h('p', { className: 'aura-drawer__desc', id: descId }, props.description) : null,
        h('div', { className: 'aura-drawer__body' }, props.children),
        props.footer ? h('div', { className: 'aura-drawer__foot' }, props.footer) : null)),
    document.body);
});
