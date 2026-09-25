import * as React from 'react';
import { cx, devWarnOnce, omit, uid, useMergedRef, useMaybeControlled } from './internal.js';
import { Icon } from './Icon.js';
import type { CheckboxProps } from './types.js';

/* Checkbox — a 16px box. Children are the visible label beside it; `label` alone names a bare box (table rows) and,
 * until 6.0, is not shown — pass `hideLabel` to say that is intended. `description` adds a second line.
 * Controlled (checked + onChange) or not (defaultChecked). onChange gets a boolean. */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(props, ref) {
  const own = React.useRef<HTMLInputElement | null>(null),
    merged = useMergedRef(ref, own);
  const st = useMaybeControlled(props.checked, !!props.defaultChecked, props.onChange);
  const on = !!st[0];
  const auto = uid();
  React.useEffect(function () {
    if (own.current) own.current.indeterminate = !!props.indeterminate;
  });
  const rest = omit(props, [
    'checked',
    'defaultChecked',
    'onChange',
    'indeterminate',
    'label',
    'hideLabel',
    'children',
    'description',
    'className',
    'tabIndex',
    'disabled',
  ]);
  /* The visible text is the children. `label` alone is still only the accessible name in 5.x; 6.0 shows it beside
   * the box like Switch and TextField. A bare box says so with hideLabel. */
  const text = props.children;
  const labelled = text != null && text !== '';
  if (!labelled && props.label && !props.hideLabel)
    devWarnOnce(
      'checkbox-label',
      'Checkbox `label` is only the accessible name: it is not shown. In 6.0 it will be shown beside the box, like Switch and TextField. For visible text now pass it as children; for a bare box (a table row) add `hideLabel`.',
    );
  /* 5.1.1: linked even without an id (a bare hideLabel box lost its description). */
  const descId = props.description ? (props.id || auto) + '-desc' : undefined;
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
      {!labelled && props.description ? (
        <span className="aura-sr-only" id={descId}>
          {props.description}
        </span>
      ) : null}
      {labelled ? (
        <span className="aura-check__text">
          <span className="aura-check__label">{text}</span>
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
