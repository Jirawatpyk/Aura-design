import * as React from 'react';
import { Icon } from './Icon.js';
import { cx } from './internal.js';
import { useStrings } from './locale.js';
import type { StepItem, StepperProps } from './types.js';

/** Progress through a multi-step flow. Completed steps can link back; the current one has aria-current="step". */
export const Stepper = React.forwardRef<HTMLElement, StepperProps>(function Stepper(props, ref) {
  const t = useStrings();
  const steps = props.steps || [];
  let at = -1;
  steps.forEach(function (s: StepItem, i: number) {
    if (s.id === props.current) at = i;
  });
  if (at < 0) at = 0;
  const vertical = props.orientation === 'vertical';
  const cur = steps[at];
  return (
    <nav
      ref={ref}
      aria-label={props.label}
      className={cx('aura-stepper', vertical ? 'aura-stepper--vertical' : 'aura-stepper--horizontal', props.className)}
    >
      <ol className="aura-stepper__list">
        {steps.map(function (s: StepItem, i: number) {
          const state = i < at ? 'done' : i === at ? 'current' : 'upcoming';
          const marker = (
            <span className="aura-stepper__marker" aria-hidden={true}>
              {state === 'done' ? <Icon name="check" /> : i + 1}
            </span>
          );
          const text = (
            <span className="aura-stepper__text">
              <span className="aura-stepper__label">
                {s.label}
                {state === 'done' ? <span className="aura-sr-only">{', ' + t.stepDone}</span> : null}
              </span>
              {s.description ? <span className="aura-stepper__desc">{s.description}</span> : null}
            </span>
          );
          const clickable = state === 'done' && !!props.onStepClick;
          return (
            <li
              key={s.id}
              className={cx('aura-stepper__item', 'is-' + state)}
              aria-current={state === 'current' ? ('step' as const) : undefined}
            >
              {clickable ? (
                <button
                  type="button"
                  className="aura-stepper__step aura-focusable"
                  onClick={function () {
                    props.onStepClick!(s.id);
                  }}
                >
                  {marker}
                  {text}
                </button>
              ) : (
                <span className="aura-stepper__step">
                  {marker}
                  {text}
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {!vertical && cur ? (
        <p className="aura-stepper__compact" aria-hidden={true}>
          <span className="aura-stepper__count">{t.stepOf(at + 1, steps.length)}</span>
          <span className="aura-stepper__compact-label">{cur.label}</span>
        </p>
      ) : null}
    </nav>
  );
});
