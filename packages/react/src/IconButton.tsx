import * as React from 'react';
import { cx, omit } from './internal.js';
import { Icon } from './Icon.js';
import { useAutoTip } from './autoTip.js';
import type { IconButtonProps } from './types.js';

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(props, ref) {
  const rest = omit(props, ['icon', 'label', 'className', 'size', 'tone', 'touchHeight', 'variant', 'pressed']);
  /* 5.32: the name shows in AURA's shared tip (hover and keyboard focus), not a native title. A `title` you pass
   * yourself is kept as is, without the AURA tip. */
  useAutoTip();
  const own = props.title !== undefined;
  return (
    <button
      {...rest}
      ref={ref}
      type={props.type || 'button'}
      aria-label={props.label}
      /* 5.65 (Chamber-OS 180): pressed sets aria-pressed (a toggle); an aria-pressed you pass is kept without it. */
      aria-pressed={props.pressed != null ? props.pressed : props['aria-pressed']}
      data-aura-tip={own ? undefined : props.label}
      className={cx(
        'aura-icon-btn',
        props.tone === 'danger' && 'aura-icon-btn--danger',
        props.variant === 'outline' && 'aura-icon-btn--outline',
        props.touchHeight && 'aura-icon-btn--touch',
        props.className,
      )}
    >
      <Icon name={props.icon} size={props.size || 'sm'} />
    </button>
  );
});

/* Menu — a small popover list rendered in a portal so table clipping can't cut it. */
