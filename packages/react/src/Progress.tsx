import * as React from 'react';
import { cx, tone, uid } from './internal.js';
import type { ProgressProps } from './types.js';

/* ---------- Progress: determinate (value) or indeterminate (no value) ---------- */
export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(function Progress(props, ref) {
  const auto = uid(),
    id = props.id || auto;
  const max = props.max || 100,
    det = props.value != null;
  const pct = det ? Math.max(0, Math.min(100, (props.value! / max) * 100)) : 0;
  const shown = props.valueLabel != null ? props.valueLabel : det ? Math.round(pct) + '%' : null;
  return (
    <div
      ref={ref}
      className={cx(
        'aura-progress',
        'aura-progress--' + tone(props.tone || 'accent'),
        props.size === 'sm' && 'is-sm',
        props.className,
      )}
    >
      {props.label || (props.showValue && shown) ? (
        <div className="aura-progress__head">
          {props.label ? (
            <span className="aura-progress__label" id={id + '-label'}>
              {props.label}
            </span>
          ) : (
            <span />
          )}
          {props.showValue && shown ? <span className="aura-progress__value">{shown}</span> : null}
        </div>
      ) : null}
      <div
        className={cx('aura-progress__track', !det && 'is-indeterminate')}
        role="progressbar"
        aria-labelledby={props.label ? id + '-label' : undefined}
        aria-label={props.label ? undefined : props['aria-label']}
        aria-valuemin={det ? 0 : undefined}
        aria-valuemax={det ? max : undefined}
        aria-valuenow={det ? props.value : undefined}
        aria-valuetext={det && props.valueLabel != null ? String(props.valueLabel) : undefined}
      >
        <span className="aura-progress__bar" style={det ? { width: pct + '%' } : undefined} />
      </div>
      {props.hint ? <p className="aura-progress__hint">{props.hint}</p> : null}
    </div>
  );
});
