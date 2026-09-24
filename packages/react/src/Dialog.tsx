import * as React from 'react';
import { useStrings, useDensity } from './locale.js';
import { createPortal } from 'react-dom';
import { cx, uid, useMergedRef } from './internal.js';
import { IconButton } from './IconButton.js';
import { useModal } from './useModal.js';
import type { DialogProps, DrawerProps } from './types.js';

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(function Dialog(props, ref) {
  const t = useStrings();
  const density = useDensity();
  const own = React.useRef<HTMLDivElement | null>(null),
    merged = useMergedRef(ref, own),
    titleId = uid(),
    descId = uid();
  function close() {
    if (props.dismissible !== false && props.onClose) props.onClose();
  }
  const modal = useModal(props.open, own, {
    autoFocus: props.autoFocus,
    onEscape: close,
    bodySelector: '.aura-dialog__body',
    footSelector: '.aura-dialog__foot',
  });
  if (!modal.ready) return null;
  return createPortal(
    <div className="aura-dialog-layer" data-density={density} onKeyDown={modal.onKeyDown}>
      <div className="aura-scrim" onClick={close} aria-hidden={true} />
      <div
        ref={merged}
        role={props.role || 'dialog'}
        aria-modal={true}
        aria-labelledby={titleId}
        aria-describedby={props.description ? descId : undefined}
        tabIndex={-1}
        className={cx('aura-dialog', 'aura-dialog--' + (props.size || 'md'), props.className)}
      >
        <div className="aura-dialog__head">
          <h2 className="aura-dialog__title" id={titleId}>
            {props.title}
          </h2>
          {props.dismissible !== false ? (
            <IconButton icon="x" label={t.close} className="aura-dialog__close" onClick={close} />
          ) : null}
        </div>
        {props.description ? (
          <p className="aura-dialog__desc" id={descId}>
            {props.description}
          </p>
        ) : null}
        {props.children ? <div className="aura-dialog__body">{props.children}</div> : null}
        {props.footer ? <div className="aura-dialog__foot">{props.footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
});

/* Drawer — a side sheet for detail views and filters. Full width below 640px. */
/** Side panel over the page: record detail, filters, mobile navigation. Modal (focus trap, scroll lock, focus restore). */
export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(function Drawer(props, ref) {
  const t = useStrings();
  const density = useDensity();
  const own = React.useRef<HTMLDivElement | null>(null),
    merged = useMergedRef(ref, own),
    titleId = uid(),
    descId = uid();
  function close() {
    if (props.dismissible !== false && props.onClose) props.onClose();
  }
  const modal = useModal(props.open, own, {
    autoFocus: props.autoFocus,
    onEscape: close,
    bodySelector: '.aura-drawer__body',
    footSelector: '.aura-drawer__foot',
  });
  if (!modal.ready) return null;
  const side = props.side === 'left' ? 'left' : 'right';
  return createPortal(
    <div className="aura-dialog-layer aura-drawer-layer" data-density={density} onKeyDown={modal.onKeyDown}>
      <div className="aura-scrim" onClick={close} aria-hidden={true} />
      <div
        ref={merged}
        role="dialog"
        aria-modal={true}
        aria-labelledby={props.title ? titleId : undefined}
        aria-label={props.title ? undefined : props['aria-label']}
        aria-describedby={props.description ? descId : undefined}
        tabIndex={-1}
        className={cx('aura-drawer', 'aura-drawer--' + side, 'aura-drawer--' + (props.size || 'md'), props.className)}
      >
        {props.title || props.dismissible !== false ? (
          <div className="aura-drawer__head">
            {props.title ? (
              <h2 className="aura-drawer__title" id={titleId}>
                {props.title}
              </h2>
            ) : (
              <span style={{ flex: 1 }} />
            )}
            {props.dismissible !== false ? <IconButton icon="x" label={t.close} onClick={close} /> : null}
          </div>
        ) : null}
        {props.description ? (
          <p className="aura-drawer__desc" id={descId}>
            {props.description}
          </p>
        ) : null}
        <div className="aura-drawer__body">{props.children}</div>
        {props.footer ? <div className="aura-drawer__foot">{props.footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
});
