import * as React from 'react';
import { FIELD_KEYS, Field, joinDescribedBy } from './Field.js';
import { cx, omit, touchClass, uid } from './internal.js';
import type { TextareaProps } from './types.js';

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
      labelAddon={props.labelAddon}
      disabled={props.disabled}
      className={cx(touchClass(props.touchHeight), props.className)}
    >
      <textarea
        rows={4}
        {...rest}
        ref={ref}
        id={id}
        className="aura-input aura-textarea"
        placeholder={props.placeholder}
        required={props.required}
        aria-invalid={props.error ? true : (rest as Record<string, any>)['aria-invalid']}
        aria-describedby={joinDescribedBy(id, props, (rest as Record<string, any>)['aria-describedby'])}
      />
    </Field>
  );
});
