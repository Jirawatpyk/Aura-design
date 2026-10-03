import * as React from 'react';
import { FIELD_KEYS, Field, joinDescribedBy } from './Field.js';
import { Icon } from './Icon.js';
import { cx, omit, touchClass, uid } from './internal.js';
import type { TextFieldProps } from './types.js';

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
      labelAddon={props.labelAddon}
      disabled={props.disabled}
      className={cx(touchClass(props.touchHeight), props.className)}
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
          aria-invalid={props.error ? true : (rest as Record<string, any>)['aria-invalid']}
          aria-describedby={joinDescribedBy(id, props, (rest as Record<string, any>)['aria-describedby'])}
        />
        {props.suffix ? <span className="aura-input__suffix">{props.suffix}</span> : null}
      </div>
    </Field>
  );
});
