import * as React from 'react';
import { cx } from './internal.js';
import { respVars, space } from './responsive.js';
import type { StackProps } from './types.js';

const h = React.createElement;

/** Stack — one direction, even gaps. direction and gap may be responsive: { base: 'column', md: 'row' }. */
export const Stack = React.forwardRef<HTMLElement, StackProps>(function Stack(props, ref) {
  const style = Object.assign(
    {},
    respVars('aura-stack-dir', props.direction || 'column'),
    respVars('aura-stack-gap', props.gap == null ? 4 : props.gap, space),
    respVars('aura-stack-align', props.align || 'stretch'),
    props.justify ? { justifyContent: props.justify } : null,
    props.wrap ? { flexWrap: 'wrap' } : null,
    props.style,
  );
  return h(props.as || 'div', { ref: ref, className: cx('aura-stack', props.className), style: style }, props.children);
});
