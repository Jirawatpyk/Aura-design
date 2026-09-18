import * as React from 'react';
import { cx, omit } from './internal.js';
import { Icon } from './Icon.js';
const h = React.createElement;

export const Button = React.forwardRef(function Button(props, ref) {
  var variant = props.variant || 'primary';
  var loading = !!props.loading;
  var rest = omit(props, ['variant', 'className', 'children', 'type', 'icon', 'iconRight', 'loading', 'onClick']);
  return h('button', Object.assign({}, rest, {
    ref: ref,
    type: props.type || 'button',
    className: cx('aura-btn', 'aura-btn--' + variant, loading && 'is-loading', props.className),
    'aria-busy': loading || undefined,
    'aria-disabled': loading || undefined,
    onClick: loading ? function (e) { e.preventDefault(); } : props.onClick
  }),
    loading ? h(Icon, { name: 'loader-circle', className: 'aura-spin' })
            : (props.icon ? h(Icon, { name: props.icon }) : null),
    props.children,
    props.iconRight && !loading ? h(Icon, { name: props.iconRight }) : null);
});

/* Status — four tones, each a fill + word + icon (never colour alone). */
