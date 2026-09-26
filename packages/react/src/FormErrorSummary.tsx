import * as React from 'react';
import { Icon } from './Icon.js';
import { cx, uid } from './internal.js';
import { useStrings } from './locale.js';
import type { FormErrorItem, FormErrorSummaryProps } from './types.js';

function items(errors: FormErrorSummaryProps['errors']): FormErrorItem[] {
  if (Array.isArray(errors)) return errors;
  /* 5.1.1: react-hook-form nests errors for `address.street` and field arrays (`items.0.name`); walk them and use the
   * dotted name, which is what register() put on the input. */
  const out: FormErrorItem[] = [];
  function walk(e: unknown, path: string, depth: number) {
    if (!e || typeof e !== 'object' || depth > 8) return;
    const o = e as Record<string, unknown>;
    if (o.message) out.push({ field: path, message: o.message as React.ReactNode });
    for (const k in o) {
      if (k === 'ref' || k === 'type' || k === 'types' || k === 'message') continue;
      walk(o[k], path ? path + '.' + k : k, depth + 1);
    }
  }
  walk(errors, '', 0);
  return out;
}
function fieldElement(field: string): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  const byId = document.getElementById(field);
  if (byId) return byId;
  const named = document.querySelector<HTMLElement>('[name="' + field.replace(/"/g, '\\"') + '"]');
  /* A hidden input carries the value for a control that can't (Combobox, 5.1.1): focus the visible control beside it. */
  if (named && named.getAttribute('type') === 'hidden') {
    const box = named.closest('.aura-field') || named.parentElement;
    return (
      (box &&
        box.querySelector<HTMLElement>(
          'input:not([type="hidden"]), [role="combobox"], select, textarea, button:not([tabindex="-1"])',
        )) ||
      named
    );
  }
  return named;
}

/* FormErrorSummary — after a failed submit, a danger panel at the top of the form lists every problem as a link
 * to its field. It takes focus so keyboard and screen-reader users start from the list (GOV.UK pattern). */
export const FormErrorSummary = React.forwardRef<HTMLDivElement, FormErrorSummaryProps>(
  function FormErrorSummary(props, ref) {
    const t = useStrings();
    const auto = uid(),
      id = props.id || auto;
    const list = items(props.errors);
    const box = React.useRef<HTMLDivElement | null>(null);
    /* 5.7.3 (Chamber-OS 65): with `focusKey`, focus follows submits only. A new key arms one focus, taken as soon as
     * the list has errors (at once for client errors, later for a server error set after a valid submit); typing
     * disarms it. The list emptying and refilling while someone types (react-hook-form re-validating onChange)
     * never pulls focus out of their field — WCAG 3.2.2. The key at mount arms nothing (errors already there at mount
     * are focused once). Typing, a click or a key press elsewhere disarms it, so a later live error (a blur-validated
     * field, a picker set through setValue) can't take focus. Without `focusKey`, it focuses when errors first appear. */
    const keyed = props.focusKey !== undefined;
    const lastKey = React.useRef<{ v: unknown } | null>(null),
      armed = React.useRef(false),
      hadErrors = React.useRef(false);
    const has = list.length > 0;
    React.useEffect(
      function () {
        const appeared = has && !hadErrors.current;
        hadErrors.current = has;
        if (!keyed) {
          lastKey.current = null;
          if (appeared && box.current) box.current.focus();
          return;
        }
        if (!lastKey.current) {
          lastKey.current = { v: props.focusKey };
          armed.current = has; /* at mount: only errors that are already there */
        } else if (!Object.is(lastKey.current.v, props.focusKey)) {
          lastKey.current = { v: props.focusKey };
          armed.current = true;
        }
        if (armed.current && has && box.current) {
          armed.current = false;
          box.current.focus();
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [has, props.focusKey, keyed],
    );
    React.useEffect(
      function () {
        if (!keyed) return;
        function disarm() {
          armed.current = false;
        }
        /* A submit's own click or Enter comes before its new key, so it re-arms right after. */
        const events = ['input', 'change', 'keydown', 'pointerdown'];
        events.forEach(function (n) {
          document.addEventListener(n, disarm, true);
        });
        return function () {
          events.forEach(function (n) {
            document.removeEventListener(n, disarm, true);
          });
        };
      },
      [keyed],
    );
    if (!list.length) return null;
    return (
      <div
        ref={function (el: HTMLDivElement | null) {
          box.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }}
        id={id}
        tabIndex={-1}
        role="alert"
        aria-labelledby={id + '-title'}
        className={cx('aura-alert aura-alert--danger aura-error-summary', props.className)}
      >
        <Icon name="circle-alert" className="aura-alert__icon" />
        <div className="aura-alert__body">
          <h2 className="aura-alert__title" id={id + '-title'}>
            {props.title || t.errorSummary(list.length)}
          </h2>
          <ul className="aura-error-summary__list">
            {list.map(function (e: FormErrorItem) {
              return (
                <li key={e.field}>
                  <a
                    href={'#' + e.field}
                    onClick={function (ev: React.MouseEvent) {
                      ev.preventDefault();
                      if (props.onSelect) {
                        props.onSelect(e.field);
                        return;
                      }
                      const el = fieldElement(e.field);
                      if (el) {
                        el.scrollIntoView({ block: 'center' });
                        el.focus();
                      }
                    }}
                  >
                    {e.message}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  },
);
