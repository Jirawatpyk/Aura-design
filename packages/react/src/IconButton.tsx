import * as React from 'react';
import { cx, omit } from './internal.js';
import { Icon } from './Icon.js';
import type { IconButtonProps } from './types.js';

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(props, ref) {
  const rest = omit(props, ['icon', 'label', 'className', 'size']);
  return (
    <button
      {...rest}
      ref={ref}
      type={props.type || 'button'}
      aria-label={props.label}
      title={props.label}
      className={cx('aura-icon-btn', props.className)}
    >
      <Icon name={props.icon} size={props.size || 'sm'} />
    </button>
  );
});

/* Menu — a small popover list rendered in a portal so table clipping can't cut it. */
