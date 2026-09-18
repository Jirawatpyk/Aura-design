import * as React from 'react';
import { cx } from './internal.js';
import { Icon } from './Icon.js';
const h = React.createElement;

var TONE_ICON = { neutral: 'circle', progress: 'circle-dot-dashed', ready: 'circle-check', blocked: 'ban' };
var TONE_WORDS = {
  ready: ['ready', 'done', 'complete', 'completed', 'approved', 'live', 'passed'],
  progress: ['in progress', 'in review', 'review', 'syncing', 'running', 'pending'],
  blocked: ['blocked', 'failed', 'error', 'rejected', 'on hold', 'cancelled']
};
export function toneFor(status) {
  var s = String(status == null ? '' : status).trim().toLowerCase();
  for (var t in TONE_WORDS) if (TONE_WORDS[t].indexOf(s) >= 0) return t;
  return 'neutral';
}
export { toneFor as statusTone };
export var TONE_ORDER = { neutral: 0, progress: 1, ready: 2, blocked: 3 };

export const StatusPill = React.forwardRef(function StatusPill(props, ref) {
  var tone = props.tone || toneFor(props.children);
  return h('span', { ref: ref, className: cx('aura-pill', 'aura-pill--' + tone, props.className) },
    h(Icon, { name: TONE_ICON[tone] || 'circle', size: 12 }),
    props.children);
});
