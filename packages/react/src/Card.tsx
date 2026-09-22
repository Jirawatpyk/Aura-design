import * as React from 'react';
import { cx } from './internal.js';
import type { CardProps } from './types.js';

const h = React.createElement;

export const Card = React.forwardRef<HTMLElement, CardProps>(function Card(props, ref) {
  const creative = props.variant === 'creative';
  return h(
    props.as || 'section',
    {
      ref: ref,
      className: cx(
        'aura-card',
        creative && 'aura-card--creative',
        props.interactive && 'is-interactive',
        props.className,
      ),
      'aria-labelledby': props.title && props.titleId ? props.titleId : undefined,
    },
    props.title || props.actions ? (
      <div className="aura-card__head">
        <div className="aura-card__heading">
          {props.title
            ? h('h' + (props.headingLevel || 3), { className: 'aura-card__title', id: props.titleId }, props.title)
            : null}
          {props.description ? <p className="aura-card__desc">{props.description}</p> : null}
        </div>
        {props.actions ? <div className="aura-card__actions">{props.actions}</div> : null}
      </div>
    ) : null,
    props.children ? <div className="aura-card__body">{props.children}</div> : null,
    props.footer ? <div className="aura-card__foot">{props.footer}</div> : null,
  );
});
