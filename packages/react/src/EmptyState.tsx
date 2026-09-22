import * as React from 'react';
import { Icon } from './Icon.js';
import { cx } from './internal.js';
import type { EmptyStateProps } from './types.js';

const h = React.createElement;

/* ---------- EmptyState: nothing to show yet, and what to do about it ---------- */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(props, ref) {
  const HT = ('h' + (props.headingLevel || 3)) as React.ElementType;
  return (
    <div
      ref={ref}
      className={cx('aura-empty', props.size === 'sm' && 'is-sm', props.bordered && 'is-bordered', props.className)}
    >
      <span className="aura-empty__icon" aria-hidden={true}>
        <Icon name={props.icon || 'inbox'} size={props.size === 'sm' ? 'md' : 'lg'} />
      </span>
      <HT className="aura-empty__title">{props.title}</HT>
      {props.description ? <p className="aura-empty__text">{props.description}</p> : null}
      {props.action ? <div className="aura-empty__action">{props.action}</div> : null}
    </div>
  );
});
