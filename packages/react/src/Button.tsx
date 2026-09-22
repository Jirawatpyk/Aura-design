import * as React from 'react';
import { cx, omit } from './internal.js';
import { Icon } from './Icon.js';
import type { ButtonProps } from './types.js';
const h = React.createElement;

/** AURA pill button. Enterprise (`primary`, `secondary`) for product UI; `creative` for marketing moments only. */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  var variant = props.variant || 'primary';
  var loading = !!props.loading;
  var rest = omit(props, ['variant', 'className', 'children', 'type', 'icon', 'iconRight', 'loading', 'onClick']);
  return h('button', Object.assign({}, rest, {
    ref: ref,
    type: props.type || 'button',
    className: cx('aura-btn', 'aura-btn--' + variant, loading && 'is-loading', props.className),
    'aria-busy': loading || undefined,
    'aria-disabled': loading || undefined,
    onClick: loading ? function (e: React.MouseEvent<HTMLButtonElement>) { e.preventDefault(); } : props.onClick
  }),
    loading ? h(Icon, { name: 'loader-circle', className: 'aura-spin' })
            : (props.icon ? h(Icon, { name: props.icon }) : null),
    props.children,
    props.iconRight && !loading ? h(Icon, { name: props.iconRight }) : null);
});

/* Status — four tones, each a fill + word + icon (never colour alone). */
