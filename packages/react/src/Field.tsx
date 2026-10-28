import * as React from 'react';
import { Icon } from './Icon.js';
import { cx } from './internal.js';
import { useStrings } from './locale.js';
import type { FieldPropsPublic } from './types.js';
import { IconCircleAlert } from './icons.js';

const h = React.createElement;

/** Field: label, required/optional marks, the control, then the hint or error line. Wrap a custom control in it. */
export interface FieldComponentProps extends Omit<FieldPropsPublic, 'label'> {
  /** Visible label. Omit only when the control is labelled another way. */
  label?: React.ReactNode | undefined;
  /** The control's id: the label points at it, and the hint/error ids derive from it. */
  id?: string | undefined;
  children?: React.ReactNode | undefined;
  /** 5.68 (Chamber-OS 184): announce the error line when it appears — for an error shown as the user types or ticks,
   * not on submit. The error `<p>` gets `aria-live="polite"` and stays in the page, empty, while there is no error, so
   * the first message is read too. Off by default: an error shown on submit, with focus moved to the field, is read
   * already, and a live line would read it twice. Your control should still point at `{id}-error` in its
   * `aria-describedby` while there is an error (TextField and the others do), so the message stays its description. */
  errorLive?: boolean | undefined;
  /** 5.31 (Chamber-OS addendum 41): a node between the label and the control, in a `.aura-field__addon` box with the
   * id `{id}-addon`. TextField and Textarea add that id to the input's `aria-describedby`; a custom control should too. */
  labelAddon?: React.ReactNode | undefined;
  /** Render the label as another element (e.g. `span` for a group of controls) with this id. */
  labelAs?: string | undefined;
  labelId?: string | undefined;
  disabled?: boolean | undefined;
  /** 5.50 (Chamber-OS 156): the danger look without a message (`is-invalid`, no error line). Set `aria-invalid` on
   * your control yourself; `error` still renders its message. */
  invalid?: boolean | undefined;
  className?: string | undefined;
}

export const Field = React.forwardRef<HTMLDivElement, FieldComponentProps>(function Field(props, ref) {
  const t = useStrings();
  return (
    <div
      ref={ref}
      className={cx(
        'aura-field',
        (props.error || props.invalid) && 'is-invalid',
        props.disabled && 'is-disabled',
        props.className,
      )}
    >
      {props.label
        ? h(
            props.labelAs || 'label',
            { className: 'aura-field__label', htmlFor: props.labelAs ? undefined : props.id, id: props.labelId },
            props.label,
            props.required ? (
              <span className="aura-field__req" aria-hidden={true}>
                {' *'}
              </span>
            ) : null,
            props.optional ? <span className="aura-field__opt">{' (' + t.optional + ')'}</span> : null,
          )
        : null}
      {hasAddon(props.labelAddon) ? (
        <div className="aura-field__addon" id={props.id + '-addon'}>
          {props.labelAddon}
        </div>
      ) : null}
      {props.children}
      {fieldNote(props.id, props.error, props.hint, props.errorLive)}
    </div>
  );
});

export function describedBy(
  id: string,
  p: { error?: React.ReactNode | undefined; hint?: React.ReactNode | undefined },
): string | undefined {
  return p.error ? id + '-error' : p.hint ? id + '-hint' : undefined;
}

/* The hint or error line under a field, group or not. 5.68 (Chamber-OS 184): with `live` the error <p> is always
 * rendered, `aria-live="polite"`, empty (and visually hidden, out of the field's gap) until there is an error, so a
 * message that appears is announced; the hint shows while there is none. Without `live`, as before: one or the other. */
export function fieldNote(
  id: string | undefined,
  error: React.ReactNode,
  hint: React.ReactNode,
  live?: boolean | undefined,
): React.ReactNode {
  const err = error ? (
    <>
      <Icon name={<IconCircleAlert />} size={14} />
      {error}
    </>
  ) : null;
  const hintLine = hint ? (
    <p className="aura-field__hint" id={id + '-hint'}>
      {hint}
    </p>
  ) : null;
  if (!live)
    return err ? (
      <p className="aura-field__error" id={id + '-error'}>
        {err}
      </p>
    ) : (
      hintLine
    );
  return (
    <>
      {err ? null : hintLine}
      {/* no id, no id: a Field without one would put "undefined-error" in the page even with no error */}
      <p className="aura-field__error" id={id == null ? undefined : id + '-error'} aria-live="polite">
        {err}
      </p>
    </>
  );
}

/* 5.31: is there an addon to render? Not for null, undefined, booleans or '' (a `cond && x` that came out falsy). */
export function hasAddon(n: React.ReactNode): boolean {
  return n != null && typeof n !== 'boolean' && n !== '';
}

/* 5.31: the addon first (it sits above the input), then the error or hint, then the caller's own ids — each once. */
export function joinDescribedBy(
  id: string,
  p: {
    error?: React.ReactNode | undefined;
    hint?: React.ReactNode | undefined;
    labelAddon?: React.ReactNode | undefined;
    labelAddonDescribes?: boolean | undefined;
  },
  own: unknown,
): string | undefined {
  const ids = [
    hasAddon(p.labelAddon) && p.labelAddonDescribes !== false ? id + '-addon' : '',
    describedBy(id, p) || '',
  ].concat(typeof own === 'string' ? own.split(/\s+/) : []);
  const out: string[] = [];
  ids.forEach(function (x) {
    if (x && out.indexOf(x) < 0) out.push(x);
  });
  return out.join(' ') || undefined;
}

export const FIELD_KEYS: string[] = [
  'label',
  'hint',
  'error',
  'required',
  'optional',
  'icon',
  'className',
  'id',
  'suffix',
  'options',
  'placeholder',
  'touchHeight',
  'labelAddon',
  'labelAddonDescribes',
  'invalid',
];
