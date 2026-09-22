import * as React from 'react';
import { useStrings, useAuraLocale } from './locale.js';
import { createPortal } from 'react-dom';
import { cx, uid, useMounted, useIsoLayoutEffect, useMergedRef } from './internal.js';
import { Icon } from './Icon.js';
import { IconButton } from './IconButton.js';
import type { AlertProps, FeedbackTone, IconName, ToastOptions, TooltipProps } from './types.js';

export const ALERT_ICON: Record<FeedbackTone, IconName> = {
  info: 'info',
  success: 'circle-check',
  warning: 'triangle-alert',
  danger: 'circle-alert',
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  const t = useStrings();
  const tone = props.tone || 'info';
  return (
    <div
      ref={ref}
      className={cx('aura-alert', 'aura-alert--' + tone, props.className)}
      role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'}
    >
      <Icon name={ALERT_ICON[tone]} className="aura-alert__icon" />
      <div className="aura-alert__body">
        {props.title ? <p className="aura-alert__title">{props.title}</p> : null}
        {props.children ? <div className="aura-alert__text">{props.children}</div> : null}
        {props.action ? <div className="aura-alert__action">{props.action}</div> : null}
      </div>
      {props.onDismiss ? (
        <IconButton icon="x" label={t.dismiss} className="aura-alert__close" onClick={props.onDismiss} />
      ) : null}
    </div>
  );
});

/* Toasts: Aura.toast({...}) from anywhere; render <Aura.Toaster /> once near the app root. */

/** A toast on screen: its options with the id and tone filled in. */
type ToastEntry = ToastOptions & { id: string; tone: FeedbackTone };
const toastState: { list: ToastEntry[]; subs: Array<(list: ToastEntry[]) => void>; n: number } = {
  list: [],
  subs: [],
  n: 0,
};
function emitToasts() {
  toastState.subs.forEach(function (f) {
    f(toastState.list.slice());
  });
}
/** Show a toast; returns its id. Needs `<Toaster />` mounted once. */
export function toast(opts: ToastOptions | string): string {
  if (typeof opts === 'string') opts = { title: opts };
  const id = opts.id || 't' + ++toastState.n;
  toastState.list = toastState.list
    .filter(function (t) {
      return t.id !== id;
    })
    .concat([Object.assign({ tone: 'info' }, opts, { id: id })])
    .slice(-3);
  emitToasts();
  return id;
}
toast.dismiss = function (id: string) {
  toastState.list = toastState.list.filter(function (t) {
    return t.id !== id;
  });
  emitToasts();
};

function ToastItem(props: { toast: ToastEntry }) {
  const str = useStrings();
  const t = props.toast,
    timer = React.useRef<ReturnType<typeof setTimeout> | null>(null),
    left = React.useRef(t.duration || 5000),
    since = React.useRef(0);
  function start() {
    if (left.current === Infinity) return;
    since.current = Date.now();
    timer.current = setTimeout(function () {
      toast.dismiss(t.id);
    }, left.current);
  }
  function pause() {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
      left.current -= Date.now() - since.current;
    }
  }
  React.useEffect(function () {
    start();
    return pause;
  }, []);
  return (
    <div
      className={cx('aura-toast', 'aura-toast--' + t.tone)}
      role={t.tone === 'danger' ? 'alert' : 'status'}
      onMouseEnter={pause}
      onMouseLeave={start}
      onFocus={pause}
      onBlur={start}
    >
      <Icon name={ALERT_ICON[t.tone] || 'info'} className="aura-toast__icon" />
      <div className="aura-toast__body">
        <p className="aura-toast__title">{t.title}</p>
        {t.description ? <p className="aura-toast__text">{t.description}</p> : null}
      </div>
      {t.action ? (
        <button
          type="button"
          className="aura-toast__action"
          onClick={function () {
            t.action!.onClick && t.action!.onClick();
            toast.dismiss(t.id);
          }}
        >
          {t.action.label}
        </button>
      ) : null}
      <IconButton
        icon="x"
        label={str.dismissToast}
        className="aura-toast__close"
        onClick={function () {
          toast.dismiss(t.id);
        }}
      />
    </div>
  );
}
export interface ToasterProps {
  /** Default `bottom`. */
  position?: 'bottom' | 'top';
}
export function Toaster(props: ToasterProps): React.ReactElement | null {
  const t = useStrings();
  const mounted = useMounted();
  const s = React.useState<ToastEntry[]>(toastState.list);
  React.useEffect(function () {
    toastState.subs.push(s[1]);
    return function () {
      toastState.subs = toastState.subs.filter(function (f) {
        return f !== s[1];
      });
    };
  }, []);
  if (!mounted) return null;
  return createPortal(
    <div
      className={cx('aura-toaster', props && props.position === 'top' && 'is-top')}
      role="region"
      aria-live="polite"
      aria-label={t.notifications}
    >
      {s[0].map(function (t) {
        return <ToastItem key={t.id} toast={t} />;
      })}
    </div>,
    document.body,
  );
}

export const Tooltip = React.forwardRef<HTMLSpanElement, TooltipProps>(function Tooltip(props, ref) {
  const id = uid(),
    st = React.useState(false),
    open = props.open !== undefined ? props.open : st[0],
    set = st[1];
  const anchor = React.useRef<HTMLSpanElement | null>(null),
    anchorMerged = useMergedRef(ref, anchor),
    tip = React.useRef<HTMLDivElement | null>(null),
    timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pos = React.useState<{ top: number; left: number } | null>(null);
  function show(now: boolean) {
    clearTimeout(timer.current);
    timer.current = setTimeout(
      function () {
        set(true);
      },
      now ? 0 : props.delay == null ? 400 : props.delay,
    );
  }
  function hide() {
    clearTimeout(timer.current);
    set(false);
  }
  useIsoLayoutEffect(
    function () {
      if (!open || !anchor.current || !tip.current) return;
      const r = anchor.current.getBoundingClientRect(),
        t = tip.current.getBoundingClientRect();
      let side = props.side || 'top',
        top = side === 'top' ? r.top - t.height - 8 : r.bottom + 8;
      if (side === 'top' && top < 8) top = r.bottom + 8;
      const left = Math.max(8, Math.min(r.left + r.width / 2 - t.width / 2, window.innerWidth - t.width - 8));
      pos[1]({ top: top, left: left });
    },
    [open],
  );
  React.useEffect(
    function () {
      if (!open) return;
      function esc(e: KeyboardEvent) {
        if (e.key === 'Escape') hide();
      }
      document.addEventListener('keydown', esc);
      return function () {
        document.removeEventListener('keydown', esc);
      };
    },
    [open],
  );
  const child = React.Children.only(props.children) as React.ReactElement<Record<string, any>>;
  const trigger = (
    <span
      ref={anchorMerged}
      className="aura-tooltip-anchor"
      onMouseEnter={function () {
        show(false);
      }}
      onMouseLeave={hide}
      onFocus={function () {
        show(true);
      }}
      onBlur={hide}
    >
      {React.cloneElement(child, { 'aria-describedby': open ? id : child.props['aria-describedby'] })}
    </span>
  );
  return (
    <React.Fragment>
      {trigger}
      {open
        ? createPortal(
            <div
              ref={tip}
              id={id}
              role="tooltip"
              className="aura-tooltip"
              style={{ top: pos[0] ? pos[0].top : -9999, left: pos[0] ? pos[0].left : -9999 }}
            >
              {props.content}
            </div>,
            document.body,
          )
        : null}
    </React.Fragment>
  );
});
