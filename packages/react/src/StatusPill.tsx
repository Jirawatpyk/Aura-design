import * as React from 'react';
import { cx } from './internal.js';
import { Icon } from './Icon.js';
import type { IconName, StatusPillProps, StatusTone } from './types.js';

const TONE_ICON: Record<StatusTone, IconName> = {
  neutral: 'circle',
  progress: 'circle-dot-dashed',
  ready: 'circle-check',
  blocked: 'ban',
};
const TONE_WORDS: Record<Exclude<StatusTone, 'neutral'>, string[]> = {
  ready: ['ready', 'done', 'complete', 'completed', 'approved', 'live', 'passed'],
  progress: ['in progress', 'in review', 'review', 'syncing', 'running', 'pending'],
  blocked: ['blocked', 'failed', 'error', 'rejected', 'on hold', 'cancelled'],
};
/** The tone the pill would pick for a status word. */
export function toneFor(status: unknown): StatusTone {
  const s = String(status == null ? '' : status)
    .trim()
    .toLowerCase();
  for (const t in TONE_WORDS) if (TONE_WORDS[t as keyof typeof TONE_WORDS].indexOf(s) >= 0) return t as StatusTone;
  return 'neutral';
}
export { toneFor as statusTone };
export const TONE_ORDER: Record<StatusTone, number> = { neutral: 0, progress: 1, ready: 2, blocked: 3 };

export const StatusPill = React.forwardRef<HTMLSpanElement, StatusPillProps>(function StatusPill(props, ref) {
  const tone = props.tone || toneFor(props.children);
  return (
    <span ref={ref} className={cx('aura-pill', 'aura-pill--' + tone, props.className)}>
      <Icon name={TONE_ICON[tone] || 'circle'} size={12} />
      {props.children}
    </span>
  );
});
