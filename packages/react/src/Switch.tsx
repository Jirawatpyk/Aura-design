import * as React from 'react';
import { cx, uid, useMaybeControlled } from './internal.js';
import type { SwitchProps } from './types.js';

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(function Switch(props, ref) {
  const auto = uid(),
    id = props.id || auto;
  const st = useMaybeControlled(props.checked, !!props.defaultChecked, props.onChange);
  const on = !!st[0];
  return (
    <div
      className={cx('aura-switch-row', props.disabled && 'is-disabled', props.className)}
      onClick={function (e: React.MouseEvent<HTMLDivElement>) {
        /* The whole row is the target (44px on touch); the switch and its <label> already toggle by themselves. */
        const t = e.target as HTMLElement;
        if (props.disabled || t.closest('button, label, a, input')) return;
        st[1](!on);
      }}
    >
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
