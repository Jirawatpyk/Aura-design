import * as React from 'react';
import { ALERT_ICON } from './Alert.js';
import { Icon } from './Icon.js';
import { IconButton } from './IconButton.js';
import { cx, useMounted } from './internal.js';
import { useStrings } from './locale.js';
import { createPortal } from 'react-dom';
import type { FeedbackTone, ToastOptions, ToastShorthandOptions } from './types.js';

/* Toasts: Aura.toast({...}) from anywhere; render <Aura.Toaster /> once near the app root. */

/** A toast on screen: its options with the id and tone filled in; `rev` changes when the same id is shown again. */
type ToastEntry = ToastOptions & { id: string; tone: FeedbackTone; rev: number; loading?: boolean | undefined };

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

function show(opts: ToastOptions & { loading?: boolean | undefined }): string {
  const id = opts.id || 't' + ++toastState.n;
  const at = toastState.list.findIndex(function (t) {
    return t.id === id;
  });
  const entry = Object.assign({ tone: 'info' as FeedbackTone }, opts, {
    id: id,
    loading: !!opts.loading,
    rev: at >= 0 ? toastState.list[at].rev + 1 : 0,
  }) as ToastEntry;
  if (at >= 0) {
    /* Same id: replace in place, so a loading toast turns into its result without moving or stacking. */
    toastState.list = toastState.list.slice();
    toastState.list[at] = entry;
  } else toastState.list = toastState.list.concat([entry]).slice(-3);
  emitToasts();
  return id;
}
/** Show a toast; returns its id. Needs `<Toaster />` mounted once. */
export function toast(opts: ToastOptions | string): string {
  return show(typeof opts === 'string' ? { title: opts } : opts);
}
function shorthand(tone: FeedbackTone) {
  return function (title: string, opts?: ToastShorthandOptions): string {
    return show(Object.assign({}, opts, { title: title, tone: tone }));
  };
}
/** Tone shorthands: `toast.success('Saved')`, `toast.error('Could not save', { description })`. */
toast.success = shorthand('success');
toast.error = shorthand('danger');
toast.warning = shorthand('warning');
toast.info = shorthand('info');
/** A spinner toast that stays until the same `id` is shown again with a result:
 * `const id = toast.loading('Saving'); … toast.success('Saved', { id })`. Returns the id. */
toast.loading = function (title: string, opts?: ToastShorthandOptions): string {
  return show(
    Object.assign({}, opts, { title: title, tone: 'info' as FeedbackTone, loading: true, duration: Infinity }),
  );
};
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
  const hover = React.useRef(false);
  function start() {
    if (left.current === Infinity || timer.current) return;
    since.current = Date.now();
    timer.current = setTimeout(function () {
      toast.dismiss(t.id);
    }, left.current);
  }
  function resume() {
    hover.current = false;
    start();
  }
  function pause() {
    hover.current = true;
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
      left.current -= Date.now() - since.current;
    }
  }
  /* A new rev (the same id shown again) restarts the clock with the new duration. */
  React.useEffect(
    function () {
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
      left.current = t.duration || 5000;
      if (!hover.current) start();
      return function () {
        if (timer.current) clearTimeout(timer.current);
      };
    },
    [t.rev],
  );
  return (
    <div
      className={cx('aura-toast', 'aura-toast--' + t.tone, t.loading && 'is-loading')}
      role={t.tone === 'danger' ? 'alert' : 'status'}
      aria-busy={t.loading || undefined}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
    >
      <Icon
        name={t.loading ? 'loader-circle' : ALERT_ICON[t.tone] || 'info'}
        className={cx('aura-toast__icon', t.loading && 'aura-spin')}
      />
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
  position?: 'bottom' | 'top' | undefined;
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
