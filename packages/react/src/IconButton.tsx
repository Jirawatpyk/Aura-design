import * as React from 'react';
import { cx, omit } from './internal.js';
import { Icon } from './Icon.js';
import type { IconButtonProps } from './types.js';
const h = React.createElement;

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(props, ref) {
  var rest = omit(props, ['icon', 'label', 'className', 'size']);
  return h('button', Object.assign({}, rest, {
    ref: ref,
    type: props.type || 'button', 'aria-label': props.label, title: props.label,
    className: cx('aura-icon-btn', props.className)
  }), h(Icon, { name: props.icon, size: props.size || 'sm' }));
});

/* Menu — a small popover list rendered in a portal so table clipping can't cut it. */
