import * as React from 'react';
import { cx, omit, useMergedRef, useMaybeControlled } from './internal.js';
import { Icon } from './Icon.js';
import type { CheckboxProps } from './types.js';

/* Checkbox — a 16px box. Without children it is a bare box named by `label` (table rows).
 * With children it is a form choice: the text sits beside the box and names it; `description` adds a second line.
 * Controlled (checked + onChange) or not (defaultChecked). onChange gets a boolean. */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(props, ref) {
  const own = React.useRef<HTMLInputElement | null>(null),
    merged = useMergedRef(ref, own);
  const st = useMaybeControlled(props.checked, !!props.defaultChecked, props.onChange);
  const on = !!st[0];
  React.useEffect(function () {
    if (own.current) own.current.indeterminate = !!props.indeterminate;
  });
  const rest = omit(props, [
    'checked',
    'defaultChecked',
    'onChange',
    'indeterminate',
    'label',
    'children',
    'description',
    'className',
    'tabIndex',
    'disabled',
  ]);
  const labelled = props.children != null;
  const descId = props.description && props.id ? props.id + '-desc' : undefined;
  return (
    <label
      className={cx('aura-check', labelled && 'aura-check--labelled', props.disabled && 'is-disabled', props.className)}
      onClick={function (e: React.MouseEvent) {
        e.stopPropagation();
      }}
    >
      <input
        {...rest}
        ref={merged}
        type="checkbox"
        className="aura-check__input"
        checked={on}
        tabIndex={props.tabIndex}
        disabled={props.disabled}
        aria-describedby={descId}
        aria-label={labelled ? undefined : props.label}
        onChange={function (e: React.ChangeEvent<HTMLInputElement>) {
          st[1](e.target.checked);
        }}
      />
      <span className="aura-check__box" aria-hidden={true}>
        {props.indeterminate ? (
          <Icon name="minus" size={12} strokeWidth={3} />
        ) : on ? (
          <Icon name="check" size={12} strokeWidth={3} />
        ) : null}
      </span>
      {labelled ? (
        <span className="aura-check__text">
          <span className="aura-check__label">{props.children}</span>
          {props.description ? (
            <span className="aura-check__desc" id={descId}>
              {props.description}
            </span>
          ) : null}
        </span>
      ) : null}
    </label>
  );
});
