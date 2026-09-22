import * as React from 'react';
import { Icon } from './Icon.js';
import { cx, omit, tone } from './internal.js';
import type { BadgeProps } from './types.js';

/* ---------- Badge: a static label or count ---------- */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(props, ref) {
  const rest = omit(props, ['tone', 'variant', 'icon', 'className', 'children']);
  return (
    <span
      {...rest}
      ref={ref}
      className={cx(
        'aura-badge',
        'aura-badge--' + tone(props.tone),
        props.variant === 'solid' && 'is-solid',
        props.variant === 'outline' && 'is-outline',
        props.className,
      )}
    >
      {props.icon ? <Icon name={props.icon} size={12} /> : null}
      {props.children}
    </span>
  );
});
