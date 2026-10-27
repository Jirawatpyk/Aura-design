import * as React from 'react';
import { Checkbox } from './Checkbox.js';
import { describedBy } from './Field.js';
import { Icon } from './Icon.js';
import { cx, touchClass, uid, useMaybeControlled } from './internal.js';
import { useStrings } from './locale.js';
import type { CheckboxGroupProps, ChoiceOption } from './types.js';
import { IconCircleAlert } from './icons.js';

/* 5.67 (Chamber-OS 183): CheckboxGroup — RadioGroup's many-choice twin. One fieldset named by its legend, one hint,
 * one error; the value is the ticked options' values in option order, whatever order they were ticked in. */
export const CheckboxGroup = React.forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(
  function CheckboxGroup(props, ref) {
    const t = useStrings();
    const auto = uid(),
      id = props.id || auto;
    const st = useMaybeControlled<string[]>(props.value, props.defaultValue || [], props.onChange);
    const picked = st[0] || [];
    const opts = (props.options || []).map(function (o: ChoiceOption): Exclude<ChoiceOption, string> {
      return typeof o === 'object' ? o : { value: o, label: o };
    });
    const name = props.name || id;
    /* As RadioGroup (5.1.1): focus() on the fieldset lands on the first ticked box, else the first enabled one. */
    const setRef = React.useCallback(
      function (el: HTMLFieldSetElement | null) {
        if (el)
          el.focus = function (o?: FocusOptions) {
            const b =
              el.querySelector<HTMLInputElement>('input[type="checkbox"]:checked:not(:disabled)') ||
              el.querySelector<HTMLInputElement>('input[type="checkbox"]:not(:disabled)');
            if (b) b.focus(o);
          };
        if (typeof ref === 'function') ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLFieldSetElement | null>).current = el;
      },
      [ref],
    );
    return (
      <fieldset
        ref={setRef}
        className={cx(
          'aura-field aura-radio-group aura-checkbox-group',
          props.error && 'is-invalid',
          touchClass(props.touchHeight),
          props.className,
        )}
        aria-describedby={describedBy(id, props)}
        disabled={props.disabled}
      >
        {props.label ? (
          <legend className="aura-field__label">
            {props.label}
            {props.required ? (
              <>
                <span className="aura-field__req" aria-hidden={true}>
                  {' *'}
                </span>
                {/* role=group takes no aria-required and a native required on each box would demand all of them:
                 * the group's name says it instead ("Membership categories (required)"). */}
                <span className="aura-sr-only">{' (' + t.required + ')'}</span>
              </>
            ) : null}
          </legend>
        ) : null}
        <div className={cx('aura-radio-group__list', props.orientation === 'horizontal' && 'is-horizontal')}>
          {opts.map(function (v: Exclude<ChoiceOption, string>) {
            return (
              <Checkbox
                key={v.value}
                name={name}
                value={v.value}
                checked={picked.indexOf(v.value) >= 0}
                disabled={props.disabled || v.disabled}
                description={v.description}
                touchHeight={props.touchHeight}
                aria-invalid={props.error ? true : undefined}
                aria-describedby={props.error ? id + '-error' : undefined}
                onChange={function (on: boolean) {
                  /* option order; values not among the options (archived, still loading) are kept after them */
                  const known = opts.map(function (o) {
                    return o.value;
                  });
                  const next = known
                    .filter(function (val: string) {
                      return val === v.value ? on : picked.indexOf(val) >= 0;
                    })
                    .concat(
                      picked.filter(function (val: string) {
                        return known.indexOf(val) < 0;
                      }),
                    );
                  st[1](next);
                }}
              >
                {v.label}
              </Checkbox>
            );
          })}
        </div>
        {props.error ? (
          <p className="aura-field__error" id={id + '-error'}>
            <Icon name={<IconCircleAlert />} size={14} />
            {props.error}
          </p>
        ) : props.hint ? (
          <p className="aura-field__hint" id={id + '-hint'}>
            {props.hint}
          </p>
        ) : null}
      </fieldset>
    );
  },
);
