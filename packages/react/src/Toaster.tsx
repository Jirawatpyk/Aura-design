import * as React from 'react';
import { ALERT_ICON } from './Alert.js';
import { Icon } from './Icon.js';
import { IconButton } from './IconButton.js';
import { cx, plainClick, useIsoLayoutEffect, useMounted } from './internal.js';
import { useLinkComponent, useStrings } from './locale.js';
import { createPortal } from 'react-dom';
import type { FeedbackTone, ToastAction, ToastOptions, ToastShorthandOptions } from './types.js';

/* Toasts: Aura.toast({...}) from anywhere; render <Aura.Toaster /> once near the app root. */

/** A toast on screen: its options with the id and tone filled in; `rev` changes when the same id is shown again. */
type ToastEntry = ToastOptions & { id: string; tone: FeedbackTone; rev: number; loading?: boolean | undefined };

/* At most three on screen; the rest wait in `queue`, in order, and move up as slots free (4.19). Nothing is dropped. */
const MAX_VISIBLE = 3;
const toastState: {
  list: ToastEntry[];
  queue: ToastEntry[];
  subs: Array<(list: ToastEntry[]) => void>;
  n: number;
} = {
  list: [],
  queue: [],
  subs: [],
  n: 0,
};
function promote() {
  while (toastState.list.length < MAX_VISIBLE && toastState.queue.length) {
    toastState.list = toastState.list.concat([toastState.queue[0]]);
    toastState.queue = toastState.queue.slice(1);
  }
}

function emitToasts() {
  toastState.subs.forEach(function (f) {
    f(toastState.list.slice());
  });
}

function show(opts: ToastOptions & { loading?: boolean | undefined }): string {
  const id = opts.id || 't' + ++toastState.n;
  const byId = function (t: ToastEntry) {
    return t.id === id;
  };
  const at = toastState.list.findIndex(byId),
    queued = toastState.queue.findIndex(byId);
  const prev = at >= 0 ? toastState.list[at] : queued >= 0 ? toastState.queue[queued] : null;
  const entry = Object.assign({ tone: 'info' as FeedbackTone }, opts, {
    id: id,
    loading: !!opts.loading,
    rev: prev ? prev.rev + 1 : 0,
  }) as ToastEntry;
  if (at >= 0) {
    /* Same id: replace in place, so a loading toast turns into its result without moving or stacking. */
    toastState.list = toastState.list.slice();
    toastState.list[at] = entry;
  } else if (queued >= 0) {
    toastState.queue = toastState.queue.slice();
    toastState.queue[queued] = entry;
  } else if (toastState.list.length < MAX_VISIBLE) toastState.list = toastState.list.concat([entry]);
  else toastState.queue = toastState.queue.concat([entry]);
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
  const keep = function (t: ToastEntry) {
    return t.id !== id;
  };
  toastState.list = toastState.list.filter(keep);
  toastState.queue = toastState.queue.filter(keep);
  promote();
  emitToasts();
};

/* Where focus goes when a toast that holds it closes (5.6): the element the hotkey was pressed on (kept per toast),
 * else the one that had focus when the toast appeared — never <body>. */
const hotkeyOrigin: WeakMap<Element, HTMLElement> = new WeakMap();
function outsideToaster(el: Element | null): HTMLElement | null {
  return el && el !== document.body && !(el as HTMLElement).closest('.aura-toaster') ? (el as HTMLElement) : null;
}

function ToastItem(props: { toast: ToastEntry }) {
  const str = useStrings();
  const Link = useLinkComponent();
  const node = React.useRef<HTMLDivElement | null>(null);
  const origin = React.useRef<HTMLElement | null>(null);
  useIsoLayoutEffect(function () {
    origin.current = outsideToaster(document.activeElement);
    const el = node.current;
    return function () {
      /* Closing while focus is inside it (its action ran, Escape, the close button): hand focus back. */
      if (!el || !el.contains(document.activeElement)) return;
      const back = [hotkeyOrigin.get(el), origin.current].filter(function (b) {
        return !!b && b.isConnected;
      })[0];
      hotkeyOrigin.delete(el);
      setTimeout(function () {
        if (back && back.isConnected && (!document.activeElement || document.activeElement === document.body))
          back.focus();
      }, 0);
    };
  }, []);
  const t = props.toast,
    timer = React.useRef<ReturnType<typeof setTimeout> | null>(null),
    left = React.useRef(t.duration || 5000),
    since = React.useRef(0);
  /* Paused while the pointer is over it OR focus is inside it; leaving one doesn't resume while the other holds. */
  const hover = React.useRef(false),
    focused = React.useRef(false);
  /* Blur doesn't fire when the focused action is removed (the toast updated in place), so check where focus is. */
  function syncFocus() {
    if (focused.current && !(node.current && node.current.contains(document.activeElement))) focused.current = false;
  }
  function start() {
    if (left.current === Infinity || timer.current) return;
    since.current = Date.now();
    timer.current = setTimeout(function () {
      toast.dismiss(t.id);
    }, left.current);
  }
  function resume() {
    syncFocus();
    if (!hover.current && !focused.current) start();
  }
  function pause() {
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
      syncFocus();
      if (!hover.current && !focused.current) start();
      return function () {
        if (timer.current) clearTimeout(timer.current);
      };
    },
    [t.rev],
  );
  const rich = t.description != null && typeof t.description !== 'boolean' && t.description !== '';
  const actions: ToastAction[] = (t.actions && t.actions.length ? t.actions : t.action ? [t.action] : []).slice(0, 2);
  function run(a: ToastAction) {
    if (a.onClick) a.onClick();
    if (a.dismiss !== false) toast.dismiss(t.id);
  }
  return (
    <div
      ref={node}
      onKeyDown={function (e: React.KeyboardEvent) {
        if (e.key === 'Escape') {
          e.stopPropagation();
          toast.dismiss(t.id);
        }
      }}
      className={cx(
        'aura-toast',
        'aura-toast--' + t.tone,
        t.loading && 'is-loading',
        /* Two actions, or one beside a description, go on their own row under the text so it keeps its width. */
        (actions.length > 1 || (actions.length && rich)) && 'has-action-row',
      )}
      role={t.tone === 'danger' ? 'alert' : 'status'}
      aria-busy={t.loading || undefined}
      onMouseEnter={function () {
        hover.current = true;
        pause();
      }}
      onMouseLeave={function () {
        hover.current = false;
        resume();
      }}
      onFocus={function () {
        focused.current = true;
        pause();
      }}
      onBlur={function (e: React.FocusEvent) {
        if (node.current && e.relatedTarget && node.current.contains(e.relatedTarget as Node)) return;
        focused.current = false;
        resume();
      }}
    >
      <Icon
        name={t.loading ? 'loader-circle' : ALERT_ICON[t.tone] || 'info'}
        className={cx('aura-toast__icon', t.loading && 'aura-spin')}
      />
      <div className="aura-toast__body">
        <p className="aura-toast__title">{t.title}</p>
        {rich ? <div className="aura-toast__text">{t.description}</div> : null}
      </div>
      {actions.length ? (
        <div className="aura-toast__actions">
          {actions.map(function (a: ToastAction, i: number) {
            return a.href ? (
              <Link
                key={i}
                href={a.href}
                className="aura-toast__action"
                onClick={function (e: React.MouseEvent) {
                  /* Cmd/Ctrl/middle-click opens a new tab; the toast stays. */
                  if (plainClick(e)) run(a);
                  else if (a.onClick) a.onClick();
                }}
              >
                {a.label}
              </Link>
            ) : (
              <button
                key={i}
                type="button"
                className="aura-toast__action"
                onClick={function () {
                  run(a);
                }}
              >
                {a.label}
              </button>
            );
          })}
        </div>
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
  /** Default `bottom` (bottom right). `top` is top right; `top-center` / `bottom-center` centre the stack (5.6).
   * Below 640px toasts span the width either way. */
  position?: 'bottom' | 'bottom-right' | 'bottom-center' | 'top' | 'top-right' | 'top-center' | undefined;
  /** Distance from the top or bottom edge (5.6), e.g. `64` to clear a 56px top bar; px or any CSS length. Sets
   * `--aura-toaster-offset`; the safe-area inset is added on top. Default 24px (16px below 640px). */
  offset?: number | string | undefined;
  /** Keyboard shortcut to the newest toast (5.6): focuses its action, else its close button, and pauses its timer;
   * Escape closes it and returns focus. Default `"Alt+T"` (matched on the physical key, so macOS Option+T works);
   * `false` turns it off. */
  hotkey?: string | false | undefined;
}

/* "Alt+T" → a matcher on KeyboardEvent.code, so the character a layout or Option produces doesn't matter. */
function hotkeyMatcher(spec: string): (e: KeyboardEvent) => boolean {
  const parts = spec.split('+').map(function (p: string) {
    return p.trim().toLowerCase();
  });
  const key = parts[parts.length - 1] || '';
  const code = /^[a-z]$/.test(key) ? 'Key' + key.toUpperCase() : /^[0-9]$/.test(key) ? 'Digit' + key : null;
  const want = function (m: string) {
    return parts.indexOf(m) >= 0 && parts.indexOf(m) < parts.length - 1;
  };
  return function (e: KeyboardEvent) {
    if (
      e.altKey !== want('alt') ||
      e.ctrlKey !== want('ctrl') ||
      e.shiftKey !== want('shift') ||
      e.metaKey !== (want('meta') || want('cmd'))
    )
      return false;
    return code ? e.code === code : e.key.toLowerCase() === key;
  };
}

export function Toaster(props: ToasterProps = {}): React.ReactElement | null {
  const t = useStrings();
  const mounted = useMounted();
  const s = React.useState<ToastEntry[]>(toastState.list);
  React.useEffect(function () {
    toastState.subs.push(s[1]);
    /* 5.1.1: toasts sent between this component's first render and this effect (a page's own mount effect runs
     * first when <Toaster/> comes after it) reached no subscriber; pick them up now. */
    s[1](toastState.list.slice());
    return function () {
      toastState.subs = toastState.subs.filter(function (f) {
        return f !== s[1];
      });
    };
  }, []);
  const region = React.useRef<HTMLDivElement | null>(null);
  const hotkey = props.hotkey === undefined ? 'Alt+T' : props.hotkey;
  React.useEffect(
    function () {
      if (!hotkey) return;
      const match = hotkeyMatcher(hotkey);
      function onKey(e: KeyboardEvent) {
        if (!e.key || e.repeat || e.isComposing || !match(e) || !region.current) return;
        /* On macOS, Option+letter types a character ("†" for Option+T), so in a text field it's left to the field.
         * Elsewhere Alt+letter types nothing, and matching stays on the key's position (Thai, Russian… layouts). */
        const el = e.target as HTMLElement | null;
        const editable = !!el && (el.isContentEditable || /^(INPUT|TEXTAREA)$/.test(el.tagName || ''));
        const mac = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent || '');
        if (editable && mac && e.altKey && !e.ctrlKey && !e.metaKey && e.key.length === 1) return;
        const items = region.current.querySelectorAll<HTMLElement>('.aura-toast');
        const last = items[items.length - 1];
        if (!last) return;
        const target =
          last.querySelector<HTMLElement>('.aura-toast__action') || last.querySelector<HTMLElement>('button');
        if (!target) return;
        e.preventDefault();
        const from = outsideToaster(document.activeElement);
        if (from) hotkeyOrigin.set(last, from);
        target.focus();
      }
      document.addEventListener('keydown', onKey);
      return function () {
        document.removeEventListener('keydown', onKey);
      };
    },
    [hotkey],
  );
  if (!mounted) return null;
  const pos = props.position || 'bottom';
  const offset = props.offset;
  return createPortal(
    <div
      ref={region}
      className={cx('aura-toaster', pos.indexOf('top') === 0 && 'is-top', /center$/.test(pos) && 'is-center')}
      style={
        offset != null
          ? ({ '--aura-toaster-offset': typeof offset === 'number' ? offset + 'px' : offset } as React.CSSProperties)
          : undefined
      }
      role="region"
      aria-live="polite"
      aria-label={hotkey ? t.notifications + ' (' + hotkey + ')' : t.notifications}
      aria-keyshortcuts={hotkey || undefined}
    >
      {s[0].map(function (t) {
        return <ToastItem key={t.id} toast={t} />;
      })}
    </div>,
    document.body,
  );
}
