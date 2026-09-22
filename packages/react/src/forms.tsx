import * as React from 'react';
import { useStrings } from './locale.js';
import { cx, omit, useMaybeControlled, uid } from './internal.js';
import { Icon } from './Icon.js';
import type {
  ChoiceOption,
  FieldPropsPublic,
  RadioGroupProps,
  SelectOption,
  SelectProps,
  SwitchProps,
  TextareaProps,
  TextFieldProps,
} from './types.js';

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
const h = React.createElement;

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
function describedBy(id: string, p: { error?: React.ReactNode; hint?: React.ReactNode }): string | undefined {
  return p.error ? id + '-error' : p.hint ? id + '-hint' : undefined;
}
const FIELD_KEYS: string[] = [
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

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(function TextField(props, ref) {
  const auto = uid(),
    id = props.id || auto;
  const rest = omit(props, FIELD_KEYS);
  return (
    <Field
      id={id}
      label={props.label}
      hint={props.hint}
      error={props.error}
      required={props.required}
      optional={props.optional}
      disabled={props.disabled}
      className={props.className}
    >
      <div className={cx('aura-input', props.icon && 'has-icon', props.suffix && 'has-suffix')}>
        {props.icon ? <Icon name={props.icon} className="aura-input__icon" /> : null}
        <input
          type="text"
          {...rest}
          ref={ref}
          id={id}
          className="aura-input__control"
          placeholder={props.placeholder}
          required={props.required}
          aria-invalid={props.error ? true : undefined}
          aria-describedby={describedBy(id, props)}
        />
        {props.suffix ? <span className="aura-input__suffix">{props.suffix}</span> : null}
      </div>
    </Field>
  );
});

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(props, ref) {
  const auto = uid(),
    id = props.id || auto;
  const rest = omit(props, FIELD_KEYS);
  return (
    <Field
      id={id}
      label={props.label}
      hint={props.hint}
      error={props.error}
      required={props.required}
      optional={props.optional}
      disabled={props.disabled}
      className={props.className}
    >
      <textarea
        rows={4}
        {...rest}
        ref={ref}
        id={id}
        className="aura-input aura-textarea"
        placeholder={props.placeholder}
        required={props.required}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={describedBy(id, props)}
      />
    </Field>
  );
});

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(props, ref) {
  const auto = uid(),
    id = props.id || auto;
  const rest = omit(props, FIELD_KEYS.concat(['children']));
  const opts = (props.options || []).map(function (o: SelectOption) {
    const v: Exclude<SelectOption, string> = typeof o === 'object' ? o : { value: o, label: o };
    return (
      <option key={v.value} value={v.value} disabled={v.disabled}>
        {v.label}
      </option>
    );
  });
  if (props.placeholder)
    opts.unshift(
      <option key="__ph" value="" disabled={true}>
        {props.placeholder}
      </option>,
    );
  const extra =
    props.value === undefined && props.defaultValue === undefined && props.placeholder ? { defaultValue: '' } : {};
  return (
    <Field
      id={id}
      label={props.label}
      hint={props.hint}
      error={props.error}
      required={props.required}
      optional={props.optional}
      disabled={props.disabled}
      className={props.className}
    >
      <div className={cx('aura-input aura-select', props.icon && 'has-icon')}>
        {props.icon ? <Icon name={props.icon} className="aura-input__icon" /> : null}
        {h(
          'select',
          Object.assign(extra, rest, {
            ref: ref,
            id: id,
            className: 'aura-input__control',
            required: props.required,
            'aria-invalid': props.error ? true : undefined,
            'aria-describedby': describedBy(id, props),
          }),
          opts,
          props.children,
        )}
        <Icon name="chevron-down" className="aura-select__chevron" />
      </div>
    </Field>
  );
});

export const RadioGroup = React.forwardRef<HTMLFieldSetElement, RadioGroupProps>(function RadioGroup(props, ref) {
  const auto = uid(),
    id = props.id || auto;
  const st = useMaybeControlled<string | undefined>(
    props.value,
    props.defaultValue,
    props.onChange as ((value: string | undefined) => void) | undefined,
  );
  const name = props.name || id;
  return (
    <fieldset
      ref={ref}
      className={cx('aura-field aura-radio-group', props.error && 'is-invalid', props.className)}
      aria-describedby={describedBy(id, props)}
      aria-invalid={props.error ? true : undefined}
      disabled={props.disabled}
    >
      {props.label ? (
        <legend className="aura-field__label">
          {props.label}
          {props.required ? (
            <span className="aura-field__req" aria-hidden={true}>
              {' *'}
            </span>
          ) : null}
        </legend>
      ) : null}
      <div className={cx('aura-radio-group__list', props.orientation === 'horizontal' && 'is-horizontal')}>
        {(props.options || []).map(function (o: ChoiceOption) {
          const v: Exclude<ChoiceOption, string> = typeof o === 'object' ? o : { value: o, label: o };
          return (
            <label key={v.value} className={cx('aura-choice', v.disabled && 'is-disabled')}>
              <input
                type="radio"
                className="aura-radio"
                name={name}
                value={v.value}
                disabled={v.disabled}
                checked={st[0] === v.value}
                onChange={function () {
                  st[1](v.value);
                }}
              />
              <span className="aura-choice__text">
                <span className="aura-choice__label">{v.label}</span>
                {v.description ? <span className="aura-choice__desc">{v.description}</span> : null}
              </span>
            </label>
          );
        })}
      </div>
      {props.error ? (
        <p className="aura-field__error" id={id + '-error'}>
          <Icon name="circle-alert" size={14} />
          {props.error}
        </p>
      ) : props.hint ? (
        <p className="aura-field__hint" id={id + '-hint'}>
          {props.hint}
        </p>
      ) : null}
    </fieldset>
  );
});

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(function Switch(props, ref) {
  const auto = uid(),
    id = props.id || auto;
  const st = useMaybeControlled(props.checked, !!props.defaultChecked, props.onChange);
  const on = !!st[0];
  return (
    <div className={cx('aura-switch-row', props.disabled && 'is-disabled', props.className)}>
      <button
        ref={ref}
        type="button"
        role="switch"
        id={id}
        aria-checked={on}
        disabled={props.disabled}
        aria-labelledby={props.label ? id + '-label' : undefined}
        aria-label={props.label ? undefined : props['aria-label']}
        aria-describedby={props.description ? id + '-desc' : undefined}
        className={cx('aura-switch', on && 'is-on')}
        onClick={function () {
          st[1](!on);
        }}
      >
        <span className="aura-switch__thumb" />
      </button>
      {props.label ? (
        <span className="aura-choice__text">
          <label className="aura-choice__label" id={id + '-label'} htmlFor={id}>
            {props.label}
          </label>
          {props.description ? (
            <span className="aura-choice__desc" id={id + '-desc'}>
              {props.description}
            </span>
          ) : null}
        </span>
      ) : null}
    </div>
  );
});

/* ---------- Feedback ---------- */
