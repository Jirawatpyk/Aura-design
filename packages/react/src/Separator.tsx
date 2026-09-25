import * as React from 'react';
import { cx } from './internal.js';
import type { SeparatorProps } from './types.js';

/** Separator — a 1px `aura-border-default` rule between groups of content (4.20). Decorative by default (hidden from
 * screen readers); `decorative={false}` makes it a `role="separator"` that is announced. */
export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(function Separator(props, ref) {
  const vertical = props.orientation === 'vertical';
  const decorative = props.decorative !== false;
  return (
    <div
      ref={ref}
      className={cx('aura-separator', vertical && 'aura-separator--vertical', props.className)}
      role={decorative ? 'none' : 'separator'}
      aria-orientation={!decorative && vertical ? 'vertical' : undefined}
      style={
        props.spacing != null
          ? ({ ['--aura-separator-space' as string]: 'var(--aura-space-' + props.spacing + ')' } as React.CSSProperties)
          : undefined
      }
    />
  );
});
