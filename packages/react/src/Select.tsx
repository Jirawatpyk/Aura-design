import * as React from 'react';
import { FIELD_KEYS, Field, describedBy } from './Field.js';
import { Icon } from './Icon.js';
import { cx, omit, uid } from './internal.js';
import type { SelectOption, SelectProps } from './types.js';

const h = React.createElement;

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
