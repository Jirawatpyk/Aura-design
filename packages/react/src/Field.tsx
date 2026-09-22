import * as React from 'react';
import { Icon } from './Icon.js';
import { cx } from './internal.js';
import { useStrings } from './locale.js';
import type { FieldPropsPublic } from './types.js';

const h = React.createElement;

/** Field: label, required/optional marks, the control, then the hint or error line. Wrap a custom control in it. */
export interface FieldComponentProps extends Omit<FieldPropsPublic, 'label'> {
  /** Visible label. Omit only when the control is labelled another way. */
  label?: React.ReactNode;
  /** The control's id: the label points at it, and the hint/error ids derive from it. */
  id?: string;
  children?: React.ReactNode;
  /** Render the label as another element (e.g. `span` for a group of controls) with this id. */
  labelAs?: string;
  labelId?: string;
  disabled?: boolean;
  className?: string;
}

export const Field = React.forwardRef<HTMLDivElement, FieldComponentProps>(function Field(props, ref) {
  const t = useStrings();
  return (
    <div
      ref={ref}
      className={cx('aura-field', props.error && 'is-invalid', props.disabled && 'is-disabled', props.className)}
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
      {props.children}
      {props.error ? (
        <p className="aura-field__error" id={props.id + '-error'}>
          <Icon name="circle-alert" size={14} />
          {props.error}
        </p>
      ) : props.hint ? (
        <p className="aura-field__hint" id={props.id + '-hint'}>
          {props.hint}
        </p>
      ) : null}
    </div>
  );
});

export function describedBy(id: string, p: { error?: React.ReactNode; hint?: React.ReactNode }): string | undefined {
  return p.error ? id + '-error' : p.hint ? id + '-hint' : undefined;
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
];
