import * as React from 'react';
import { useStrings, useDensity } from './locale.js';
import { createPortal } from 'react-dom';
import { cx, devWarnOnce, omit, uid, useMaybeControlled, useMergedRef } from './internal.js';
import { IconButton } from './IconButton.js';
import { useModal } from './useModal.js';
import type { DialogProps, DrawerProps } from './types.js';
import { IconX } from './icons.js';

/* 5.16: what closes the Dialog around a component — a Save or Cancel inside a Dialog that opens itself (`trigger`). */
const DialogClose = React.createContext<(() => void) | null>(null);
/** Inside a Dialog's body or footer: a function that closes it (5.16) — also when `dismissible={false}`, which only
 * turns off Escape, the scrim and ×. Outside a Dialog it does nothing. Use it for Cancel and Save in a Dialog that
 * has a `trigger` and no `open`. */
export function useDialogClose(): () => void {
  return React.useContext(DialogClose) || function () {};
}

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(function Dialog(props, ref) {
  const t = useStrings();
  const density = useDensity();
  const own = React.useRef<HTMLDivElement | null>(null),
    merged = useMergedRef(ref, own),
    titleId = uid(),
    descId = uid();
  /* 5.16 (Chamber-OS 101): with a `trigger` and no `open`, the Dialog keeps its own open state. */
  const openState = useMaybeControlled<boolean>(props.open, false, null),
    open = openState[0];
  if (props.open === undefined && !props.trigger)
    devWarnOnce('dialog-no-open', 'Dialog has neither `open` nor `trigger`, so it can never open. Pass one of them.');
  const trigId = uid();
  /* The app's own close (useDialogClose: Save, Cancel) — always allowed. */
  function closeNow() {
    if (props.open === undefined) openState[1](false);
    if (props.onClose) props.onClose();
  }
  /* Escape, the scrim and ×: only while dismissible. */
  function close() {
    if (props.dismissible === false) return;
    closeNow();
  }
  /* 5.7: an alertdialog (a confirmation, often with a typed reason) ignores scrim clicks unless asked. */
  const scrimCloses =
    props.dismissible !== false &&
    (props.dismissOnScrim !== undefined ? props.dismissOnScrim : props.role !== 'alertdialog');
  const modal = useModal(open, own, {
    autoFocus: props.autoFocus,
    onEscape: close,
    bodySelector: '.aura-dialog__body',
    footSelector: '.aura-dialog__foot',
    /* With a trigger, focus goes back to it even where a click doesn't focus buttons (Safari). */
    finalFocus: props.trigger
      ? function () {
          const ff = props.finalFocus;
          const to = ff ? (typeof ff === 'function' ? ff() : ff.current) : null;
          return to || (document.querySelector('[data-aura-trigger="' + trigId + '"]') as HTMLElement | null);
        }
      : props.finalFocus,
    onCloseComplete: props.onCloseComplete,
  });
  const trig = props.trigger;
  const trigger =
    trig && React.isValidElement(trig)
      ? React.cloneElement(trig as React.ReactElement<Record<string, unknown>>, {
          'aria-haspopup': 'dialog',
          'aria-expanded': open,
          'data-aura-trigger': trigId,
          onClick: function (e: React.MouseEvent) {
            const own = (trig.props as { onClick?: (e: React.MouseEvent) => void }).onClick;
            if (own) own(e);
            if (e.defaultPrevented) return;
            if (props.open === undefined) openState[1](true);
            if (props.onOpen) props.onOpen();
          },
        })
      : null;
  if (!modal.ready) return trigger;
  /* id, data-* and aria-* reach the panel; the dialog semantics stay AURA's. */
  const rest = omit(props, [
    'open',
    'onClose',
    'title',
    'description',
    'children',
    'footer',
    'size',
    'dismissible',
    'dismissOnScrim',
    'role',
    'autoFocus',
    'className',
    'trigger',
    'onOpen',
    'finalFocus',
    'onCloseComplete',
    'aria-labelledby',
    'aria-describedby',
    'aria-modal',
  ]);
  const panel = createPortal(
    <div className="aura-dialog-layer" data-density={density} onKeyDown={modal.onKeyDown}>
      <div
        className="aura-scrim"
        onClick={scrimCloses ? close : undefined}
        /* A scrim that doesn't close keeps focus in the dialog, so Escape still works after a stray click. */
        onMouseDown={
          scrimCloses
            ? undefined
            : function (e: React.MouseEvent) {
                e.preventDefault();
              }
        }
        aria-hidden={true}
      />
      <div
        {...rest}
        ref={merged}
        role={props.role || 'dialog'}
        aria-modal={true}
        aria-labelledby={titleId}
        aria-describedby={cx(props.description ? descId : '', props['aria-describedby']) || undefined}
        tabIndex={-1}
        className={cx('aura-dialog', 'aura-dialog--' + (props.size || 'md'), props.className)}
      >
        <div className="aura-dialog__head">
          <h2 className="aura-dialog__title" id={titleId}>
            {props.title}
          </h2>
          {props.dismissible !== false ? (
            <IconButton icon={<IconX />} label={t.close} className="aura-dialog__close" onClick={close} />
          ) : null}
        </div>
        {props.description ? (
          <p className="aura-dialog__desc" id={descId}>
            {props.description}
          </p>
        ) : null}
        <DialogClose.Provider value={closeNow}>
          {props.children ? <div className="aura-dialog__body">{props.children}</div> : null}
          {props.footer ? <div className="aura-dialog__foot">{props.footer}</div> : null}
        </DialogClose.Provider>
      </div>
    </div>,
    document.body,
  );
  return trigger ? (
    <>
      {trigger}
      {panel}
    </>
  ) : (
    panel
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
    finalFocus: props.finalFocus,
    onCloseComplete: props.onCloseComplete,
  });
  if (!modal.ready) return null;
  const side = props.side === 'left' ? 'left' : 'right';
  /* 5.9 (Chamber-OS 70): other attributes (id, data-*, aria-*) go on the panel; the dialog semantics stay AURA's. */
  const rest = omit(props, [
    'open',
    'onClose',
    'side',
    'size',
    'title',
    'description',
    'children',
    'footer',
    'dismissible',
    'dismissOnScrim',
    'autoFocus',
    'aria-label',
    'aria-describedby',
    'aria-labelledby',
    'className',
    'closeLabel',
    'closeProps',
    'finalFocus',
    'onCloseComplete',
  ]);
  const drawerScrimCloses = props.dismissible !== false && props.dismissOnScrim !== false;
  return createPortal(
    <div className="aura-dialog-layer aura-drawer-layer" data-density={density} onKeyDown={modal.onKeyDown}>
      <div
        className="aura-scrim"
        onClick={drawerScrimCloses ? close : undefined}
        onMouseDown={
          !drawerScrimCloses
            ? function (e: React.MouseEvent) {
                e.preventDefault();
              }
            : undefined
        }
        aria-hidden={true}
      />
      <div
        {...rest}
        ref={merged}
        role="dialog"
        aria-modal={true}
        aria-labelledby={props.title ? titleId : props['aria-labelledby']}
        aria-label={props.title ? undefined : props['aria-label']}
        aria-describedby={cx(props.description ? descId : '', props['aria-describedby']) || undefined}
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
            {props.dismissible !== false ? (
              <IconButton
                {...props.closeProps}
                icon={<IconX />}
                label={props.closeLabel || t.close}
                onClick={function (e: React.MouseEvent<HTMLButtonElement>) {
                  const own = props.closeProps && props.closeProps.onClick;
                  if (own) own(e);
                  if (!e.defaultPrevented) close();
                }}
              />
            ) : null}
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
