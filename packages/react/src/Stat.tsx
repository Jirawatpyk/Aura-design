import * as React from 'react';
import { cx } from './internal.js';
import { Icon } from './Icon.js';
import type { StatProps } from './types.js';

/* Stat — one number on a card: label, value, optional change and caption. Dashboards and page summaries.
 * change: { value: '+12%', direction: 'up' | 'down' | 'flat', tone?: 'positive' | 'negative' | 'neutral', label?: 'vs last month' }
 * A rise is not always good (cancellations), so tone is separate from direction; it defaults to up = positive. */
export const Stat = React.forwardRef<HTMLElement, StatProps>(function Stat(props, ref) {
  const ch = props.change;
  const dir = ch && (ch.direction || 'flat');
  const tone = ch && (ch.tone || (dir === 'up' ? 'positive' : dir === 'down' ? 'negative' : 'neutral'));
  const Tag = (props.href ? 'a' : props.onClick ? 'button' : 'div') as React.ElementType;
  const interactive = Tag !== 'div';
  return (
    <Tag
      ref={ref}
      className={cx('aura-stat', interactive && 'is-interactive', props.loading && 'is-loading', props.className)}
      href={props.href}
      onClick={props.onClick}
      type={Tag === 'button' ? 'button' : undefined}
      aria-busy={props.loading || undefined}
    >
      <span className="aura-stat__head">
        <span className="aura-stat__label">{props.label}</span>
        {props.icon ? (
          <span className="aura-stat__icon">
            <Icon name={props.icon} />
          </span>
        ) : null}
      </span>
      {props.loading ? (
        <span className="aura-stat__value">
          <span className="aura-skel aura-stat__skel" />
        </span>
      ) : (
        <span className="aura-stat__value">
          {props.value}
          {props.unit ? <span className="aura-stat__unit">{props.unit}</span> : null}
        </span>
      )}
      {(ch && !props.loading) || props.caption ? (
        <span className="aura-stat__foot">
          {ch && !props.loading ? (
            <span className={cx('aura-stat__change', 'is-' + tone)}>
              <Icon name={dir === 'up' ? 'trending-up' : dir === 'down' ? 'trending-down' : 'minus'} size={14} />
              <span>{ch.value}</span>
            </span>
          ) : null}
          {ch && ch.label && !props.loading ? <span className="aura-stat__caption">{ch.label}</span> : null}
          {props.caption ? <span className="aura-stat__caption">{props.caption}</span> : null}
        </span>
      ) : null}
    </Tag>
  );
});
