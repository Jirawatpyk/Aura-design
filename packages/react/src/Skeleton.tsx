import * as React from 'react';
import { cx } from './internal.js';
import type { SkeletonProps } from './types.js';

/* ---------- Skeleton: placeholder shapes while content loads ---------- */
export const Skeleton = React.forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(props, ref) {
  const v = props.variant || 'text';
  if (v === 'text' && (props.lines || 1) > 1) {
    const n = props.lines as number,
      rows: React.ReactElement[] = [];
    for (let i = 0; i < n; i++)
      rows.push(<span key={i} className="aura-skel aura-skel--text" style={{ width: i === n - 1 ? '60%' : '100%' }} />);
    return (
      <span
        ref={ref}
        className={cx('aura-skel-lines', props.className)}
        aria-hidden={true}
        style={props.width ? { width: props.width } : undefined}
      >
        {rows}
      </span>
    );
  }
  const style: { width?: number | string; height?: number | string } = { width: props.width, height: props.height };
  if (v === 'circle') {
    style.width = style.height = props.size || props.width || 40;
  }
  return (
    <span ref={ref} aria-hidden={true} className={cx('aura-skel', 'aura-skel--' + v, props.className)} style={style} />
  );
});
