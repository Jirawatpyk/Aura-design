import * as React from 'react';
import { Icon } from './Icon.js';
import { cx, uid } from './internal.js';
import { useStrings } from './locale.js';
import type { FormErrorItem, FormErrorSummaryProps } from './types.js';

function items(errors: FormErrorSummaryProps['errors']): FormErrorItem[] {
  if (Array.isArray(errors)) return errors;
  const out: FormErrorItem[] = [];
  for (const k in errors || {}) {
    const e = errors[k];
    if (e && e.message) out.push({ field: k, message: e.message });
  }
  return out;
}
function fieldElement(field: string): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  return (
    document.getElementById(field) ||
    (document.querySelector('[name="' + field.replace(/"/g, '\\"') + '"]') as HTMLElement | null)
  );
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
    React.useEffect(
      function () {
        const has = list.length > 0;
        if (has && box.current) box.current.focus();
      },
      /* focus when errors first appear, and again whenever focusKey changes (each submit) */
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [list.length > 0, props.focusKey],
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
