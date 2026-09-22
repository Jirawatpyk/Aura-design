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
