import * as React from 'react';
import { Field, describedBy } from './Field.js';
import { Icon } from './Icon.js';
import { cx, uid, useMaybeControlled } from './internal.js';
import { useStrings } from './locale.js';
import type { NumberFieldProps } from './types.js';

function decimalsOf(n: number): number {
  const s = String(n);
  const i = s.indexOf('.');
  return i < 0 ? 0 : s.length - i - 1;
}
/** "12,500.5" / "฿ 1 200" / "-3" → a number; anything that isn't a number → NaN. */
function parse(text: string): number {
  const s = text.replace(/[,\s ]/g, '');
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return NaN;
  return Number(s);
}

/** Number input with thousands separators, +/− buttons and arrow keys (ARIA spinbutton). */
export const NumberField = React.forwardRef<HTMLInputElement, NumberFieldProps>(function NumberField(props, ref) {
  const t = useStrings();
  const auto = uid(),
    id = props.id || auto;
  const step = props.step || 1;
  const decimals = props.decimals != null ? props.decimals : decimalsOf(step);
  const st = useMaybeControlled<number | null>(
    props.value,
    props.defaultValue == null ? null : props.defaultValue,
    props.onChange,
  );
  const value = st[0],
    setValue = st[1];
  /* While focused the person edits a draft; it is formatted (and clamped) when they leave. */
  const draftState = React.useState<string | null>(null),
    draft = draftState[0],
    setDraft = draftState[1];

  function fmt(n: number | null): string {
    if (n == null || isNaN(n)) return '';
    return n.toLocaleString('en', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }
  function fit(n: number): number {
    let v = n;
    if (props.min != null && v < props.min) v = props.min;
    if (props.max != null && v > props.max) v = props.max;
    const f = Math.pow(10, decimals);
    return Math.round(v * f) / f;
  }
  function nudge(by: number) {
    if (props.disabled || props.readOnly) return;
    const base = value == null ? (props.min != null && props.min > 0 ? props.min - by : 0) : value;
    const next = fit(base + by);
    setValue(next);
    setDraft(null);
  }
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const k = e.key;
    let by = 0;
    if (k === 'ArrowUp') by = step;
    else if (k === 'ArrowDown') by = -step;
    else if (k === 'PageUp') by = step * 10;
    else if (k === 'PageDown') by = -step * 10;
    else if (k === 'Home' && props.min != null) {
      e.preventDefault();
      setValue(props.min);
      setDraft(null);
      return;
    } else if (k === 'End' && props.max != null) {
      e.preventDefault();
      setValue(props.max);
      setDraft(null);
      return;
    }
    if (by) {
      e.preventDefault();
      nudge(by);
    }
  }
  const atMin = value != null && props.min != null && value <= props.min;
  const atMax = value != null && props.max != null && value >= props.max;
  const affixText = function (x: React.ReactNode) {
    return typeof x === 'string' || typeof x === 'number' ? String(x) : '';
  };
  const valueText =
    value == null ? undefined : [affixText(props.prefix), fmt(value), affixText(props.suffix)].join(' ').trim();
  const stepper = props.stepper !== false && !props.readOnly;
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
      <div className={cx('aura-input aura-number', stepper && 'has-stepper')}>
        {props.prefix != null ? (
          <span className="aura-number__affix" aria-hidden={true}>
            {props.prefix}
          </span>
        ) : null}
        <input
          ref={ref}
          id={id}
          type="text"
          role="spinbutton"
          inputMode={decimals > 0 || (props.min != null && props.min < 0) ? 'decimal' : 'numeric'}
          autoComplete="off"
          className="aura-input__control"
          name={props.name}
          placeholder={props.placeholder}
          disabled={props.disabled}
          readOnly={props.readOnly}
          required={props.required}
          aria-valuenow={value == null ? undefined : value}
          aria-valuemin={props.min}
          aria-valuemax={props.max}
          aria-valuetext={valueText}
          aria-invalid={props.error ? true : undefined}
          aria-describedby={describedBy(id, props)}
          value={draft != null ? draft : fmt(value)}
          onFocus={function () {
            setDraft(fmt(value));
          }}
          onChange={function (e: React.ChangeEvent<HTMLInputElement>) {
            const text = e.target.value;
            setDraft(text);
            if (!text.trim()) setValue(null);
            else {
              const n = parse(text);
              if (!isNaN(n)) setValue(n);
            }
          }}
          onBlur={function (e: React.FocusEvent<HTMLInputElement>) {
            /* draft == null: the last change came from a key or button and is already committed. */
            const n = draft == null ? value : !draft.trim() ? null : parse(draft);
            if (n == null) {
              if (value != null) setValue(null);
            } else if (!isNaN(n)) {
              const f = fit(n);
              if (f !== value) setValue(f);
            }
            setDraft(null);
            if (props.onBlur) props.onBlur(e);
          }}
          onKeyDown={onKeyDown}
        />
        {props.suffix != null ? (
          <span className="aura-number__affix" aria-hidden={true}>
            {props.suffix}
          </span>
        ) : null}
        {stepper ? (
          <span className="aura-number__steps">
            <button
              type="button"
              tabIndex={-1}
              className="aura-number__step"
              aria-label={t.decrease}
              aria-controls={id}
              disabled={props.disabled || atMin}
              onPointerDown={function (e: React.PointerEvent) {
                e.preventDefault();
              }}
              onClick={function () {
                nudge(-step);
              }}
            >
              <Icon name="minus" />
            </button>
            <button
              type="button"
              tabIndex={-1}
              className="aura-number__step"
              aria-label={t.increase}
              aria-controls={id}
              disabled={props.disabled || atMax}
              onPointerDown={function (e: React.PointerEvent) {
                e.preventDefault();
              }}
              onClick={function () {
                nudge(step);
              }}
            >
              <Icon name="plus" />
            </button>
          </span>
        ) : null}
      </div>
    </Field>
  );
});
