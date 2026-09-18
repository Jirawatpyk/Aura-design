import * as React from 'react';
import { cx } from './internal.js';
import { Icon } from './Icon.js';
const h = React.createElement;

/* Stat — one number on a card: label, value, optional change and caption. Dashboards and page summaries.
 * change: { value: '+12%', direction: 'up' | 'down' | 'flat', tone?: 'positive' | 'negative' | 'neutral', label?: 'vs last month' }
 * A rise is not always good (cancellations), so tone is separate from direction; it defaults to up = positive. */
export const Stat = React.forwardRef(function Stat(props, ref) {
  var ch = props.change;
  var dir = ch && (ch.direction || 'flat');
  var tone = ch && (ch.tone || (dir === 'up' ? 'positive' : dir === 'down' ? 'negative' : 'neutral'));
  var Tag = props.href ? 'a' : props.onClick ? 'button' : 'div';
  var interactive = Tag !== 'div';
  return h(Tag, {
      ref: ref,
      className: cx('aura-stat', interactive && 'is-interactive', props.loading && 'is-loading', props.className),
      href: props.href, onClick: props.onClick, type: Tag === 'button' ? 'button' : undefined,
      'aria-busy': props.loading || undefined },
    h('span', { className: 'aura-stat__head' },
      h('span', { className: 'aura-stat__label' }, props.label),
      props.icon ? h('span', { className: 'aura-stat__icon' }, h(Icon, { name: props.icon })) : null),
    props.loading
      ? h('span', { className: 'aura-stat__value' }, h('span', { className: 'aura-skel aura-stat__skel' }))
      : h('span', { className: 'aura-stat__value' }, props.value, props.unit ? h('span', { className: 'aura-stat__unit' }, props.unit) : null),
    (ch && !props.loading) || props.caption ? h('span', { className: 'aura-stat__foot' },
      ch && !props.loading ? h('span', { className: cx('aura-stat__change', 'is-' + tone) },
        h(Icon, { name: dir === 'up' ? 'trending-up' : dir === 'down' ? 'trending-down' : 'minus', size: 14 }),
        h('span', null, ch.value)) : null,
      ch && ch.label && !props.loading ? h('span', { className: 'aura-stat__caption' }, ch.label) : null,
      props.caption ? h('span', { className: 'aura-stat__caption' }, props.caption) : null) : null);
});
