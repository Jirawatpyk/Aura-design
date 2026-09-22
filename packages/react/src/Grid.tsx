import * as React from 'react';
import { cx } from './internal.js';
import { respVars, space } from './responsive.js';
import type { GridProps } from './types.js';

const h = React.createElement;

/** Grid — equal columns. columns may be responsive ({ base: 1, md: 2, lg: 3 }), or use minItemWidth to fit as many as fit. */
export const Grid = React.forwardRef<HTMLElement, GridProps>(function Grid(props, ref) {
  const style = Object.assign(
    {},
    respVars('aura-grid-gap', props.gap == null ? 6 : props.gap, space),
    props.minItemWidth
      ? { gridTemplateColumns: 'repeat(auto-fill, minmax(min(' + props.minItemWidth + 'px, 100%), 1fr))' }
      : respVars('aura-grid-cols', props.columns || 1),
    props.style,
  );
  return h(
    props.as || 'div',
    { ref: ref, className: cx('aura-grid-layout', props.minItemWidth && 'is-auto', props.className), style: style },
    props.children,
  );
});
