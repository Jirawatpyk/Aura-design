import * as React from 'react';
import { ALERT_ICON } from './Alert.js';
import { Icon } from './Icon.js';
import { IconButton } from './IconButton.js';
import { cx, useMounted } from './internal.js';
import { useStrings } from './locale.js';
import { createPortal } from 'react-dom';
import type { FeedbackTone, ToastOptions } from './types.js';

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
