import * as React from 'react';
import { Icon } from './Icon.js';
import { cx, uid, useMaybeControlled } from './internal.js';
import type { SegmentedControlProps, SegmentedOption } from './types.js';

function toOpt(o: SegmentedOption | string): SegmentedOption {
  return typeof o === 'object' ? o : { value: o, label: o };
}

/** A row of mutually exclusive choices that apply at once. A radio group: one Tab stop, arrow keys move and select. */
export const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  function SegmentedControl(props, ref) {
    const options = (props.options || []).map(toOpt);
    const firstEnabled = options.filter(function (o: SegmentedOption) {
      return !o.disabled;
    })[0];
    const st = useMaybeControlled<string | undefined>(
      props.value,
      props.defaultValue != null ? props.defaultValue : firstEnabled ? firstEnabled.value : undefined,
      props.onChange as ((v: string | undefined) => void) | undefined,
    );
    const value = st[0],
      setValue = st[1];
    const auto = uid(),
      id = props.id || auto;
    const refs = React.useRef<Array<HTMLButtonElement | null>>([]);
    const selIdx = options.findIndex(function (o: SegmentedOption) {
      return o.value === value;
    });
    const tabIdx = selIdx >= 0 && !options[selIdx].disabled ? selIdx : options.indexOf(firstEnabled as SegmentedOption);

    function move(from: number, dir: number) {
      const n = options.length;
      for (let k = 1; k <= n; k++) {
        const i = (((from + dir * k) % n) + n) % n;
        if (!options[i].disabled) {
          setValue(options[i].value);
          const el = refs.current[i];
          if (el) el.focus();
          return;
        }
      }
    }
    function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, i: number) {
      const k = e.key;
      if (k === 'ArrowRight' || k === 'ArrowDown') {
        e.preventDefault();
        move(i, 1);
      } else if (k === 'ArrowLeft' || k === 'ArrowUp') {
        e.preventDefault();
        move(i, -1);
      } else if (k === 'Home') {
        e.preventDefault();
        move(-1, 1);
      } else if (k === 'End') {
        e.preventDefault();
        move(options.length, -1);
      }
    }
    return (
      <div
        ref={ref}
        id={id}
        role="radiogroup"
        aria-label={props.label}
        aria-disabled={props.disabled || undefined}
        className={cx(
          'aura-segmented',
          props.size === 'sm' && 'aura-segmented--sm',
          props.fullWidth && 'is-full',
          props.disabled && 'is-disabled',
          props.className,
        )}
      >
        {options.map(function (o: SegmentedOption, i: number) {
          const on = o.value === value;
          const off = props.disabled || o.disabled;
          return (
            <button
              key={o.value}
              ref={function (el: HTMLButtonElement | null) {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={o.iconOnly ? o.label : undefined}
              title={o.iconOnly ? o.label : undefined}
              tabIndex={i === tabIdx && !props.disabled ? 0 : -1}
              disabled={off}
              className={cx('aura-segmented__option', on && 'is-selected', o.iconOnly && 'is-icon')}
              onClick={function () {
                setValue(o.value);
              }}
              onKeyDown={function (e: React.KeyboardEvent<HTMLButtonElement>) {
                onKeyDown(e, i);
              }}
            >
              {o.icon ? <Icon name={o.icon} /> : null}
              {o.iconOnly ? null : <span>{o.label}</span>}
            </button>
          );
        })}
      </div>
    );
  },
);
