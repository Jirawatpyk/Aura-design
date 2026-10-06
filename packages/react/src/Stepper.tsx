import * as React from 'react';
import { Icon } from './Icon.js';
import { cx, uid } from './internal.js';
import { useStrings } from './locale.js';
import type { StepItem, StepperProps } from './types.js';
import { IconCheck, IconCircleAlert } from './icons.js';

/** Progress through a multi-step flow. Completed steps can link back; the current one has aria-current="step". */
export const Stepper = React.forwardRef<HTMLElement, StepperProps>(function Stepper(props, ref) {
  const t = useStrings();
  const idBase = uid();
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
          /* 5.18 (Chamber-OS 112): an error step keeps its state (place, clickability, aria-current) and says so. */
          const error = s.status === 'error';
          const marker = (
            <span className="aura-stepper__marker" aria-hidden={true}>
              {error ? <Icon name={<IconCircleAlert />} /> : state === 'done' ? <Icon name={<IconCheck />} /> : i + 1}
            </span>
          );
          const note = error ? t.stepError : state === 'done' ? t.stepDone : '';
          const clickable = state === 'done' && !!props.onStepClick;
          /* 5.18: a clickable step with a text label is named "Fees, has errors" outright. From its content, Chrome
           * would read "Fees , has errors" (it puts a space before the absolutely positioned sr-only note); the
           * description, part of that content name before, becomes the button's description. */
          const named =
            clickable && (typeof s.label === 'string' || typeof s.label === 'number') && String(s.label).trim() !== '';
          const descId = idBase + '-step-' + i;
          /* 5.32 (WCAG 2.5.3; axe 4.14): a named step is named from its content — one sr-only span with the whole
           * name, the visible label and description aria-hidden (the description still read through
           * aria-describedby) — instead of aria-label over visible text that includes the description. */
          const text = (
            <span className="aura-stepper__text">
              {named ? <span className="aura-sr-only">{String(s.label) + (note ? ', ' + note : '')}</span> : null}
              <span className="aura-stepper__label" aria-hidden={named ? true : undefined}>
                {s.label}
                {note && !named ? <span className="aura-sr-only">{', ' + note}</span> : null}
              </span>
              {s.description ? (
                <span
                  className="aura-stepper__desc"
                  id={named ? descId : undefined}
                  aria-hidden={named ? true : undefined}
                >
                  {s.description}
                </span>
              ) : null}
            </span>
          );
          return (
            <li
              key={s.id}
              className={cx('aura-stepper__item', 'is-' + state, error && 'is-error')}
              aria-current={state === 'current' ? ('step' as const) : undefined}
            >
              {clickable ? (
                <button
                  type="button"
                  className="aura-stepper__step aura-focusable"
                  aria-describedby={named && s.description ? descId : undefined}
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
          <span className="aura-stepper__count">
            {t.stepOf(at + 1, steps.length)}
            {cur.status === 'error' ? <span className="aura-stepper__count-error">{' — ' + t.stepError}</span> : null}
          </span>
          <span className="aura-stepper__compact-label">{cur.label}</span>
        </p>
      ) : null}
    </nav>
  );
});
