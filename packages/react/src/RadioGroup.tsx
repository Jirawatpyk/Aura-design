import * as React from 'react';
import { describedBy } from './Field.js';
import { Icon } from './Icon.js';
import { cx, uid, useMaybeControlled } from './internal.js';
import type { ChoiceOption, RadioGroupProps } from './types.js';

export const RadioGroup = React.forwardRef<HTMLFieldSetElement, RadioGroupProps>(function RadioGroup(props, ref) {
  const auto = uid(),
    id = props.id || auto;
  const st = useMaybeControlled<string | undefined>(
    props.value,
    props.defaultValue,
    props.onChange as ((value: string | undefined) => void) | undefined,
  );
  const name = props.name || id;
  /* 5.1.1: the ref is still the fieldset, but its focus() moves to the checked radio (else the first enabled one),
   * so react-hook-form's setFocus and focus-on-error land on the group. */
  const setRef = React.useCallback(
    function (el: HTMLFieldSetElement | null) {
      if (el)
        el.focus = function (opts?: FocusOptions) {
          const r =
            el.querySelector<HTMLInputElement>('input[type="radio"]:checked') ||
            el.querySelector<HTMLInputElement>('input[type="radio"]:not(:disabled)');
          if (r) r.focus(opts);
        };
      if (typeof ref === 'function') ref(el);
      else if (ref) (ref as React.MutableRefObject<HTMLFieldSetElement | null>).current = el;
    },
    [ref],
  );
  return (
    <fieldset
      ref={setRef}
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
                required={props.required || undefined}
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
