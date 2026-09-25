import * as React from 'react';
import { cx } from './internal.js';
import { Icon } from './Icon.js';
import type { IconName, StatusPillProps, StatusTone } from './types.js';

const TONE_ICON: Record<StatusTone, IconName> = {
  neutral: 'circle',
  progress: 'circle-dot-dashed',
  ready: 'circle-check',
  warning: 'triangle-alert',
  blocked: 'ban',
};
import { toneFor } from './status.js';
export { toneFor, statusTone, TONE_ORDER } from './status.js';

export const StatusPill = React.forwardRef<HTMLSpanElement, StatusPillProps>(function StatusPill(props, ref) {
  const tone = props.tone || toneFor(props.children);
  return (
    <span ref={ref} className={cx('aura-pill', 'aura-pill--' + tone, props.className)}>
      <Icon name={TONE_ICON[tone] || 'circle'} size={12} />
      {props.children}
    </span>
  );
});
