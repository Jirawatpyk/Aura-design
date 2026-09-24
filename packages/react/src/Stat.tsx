import * as React from 'react';
import { cx } from './internal.js';
import { Icon } from './Icon.js';
import { useLinkComponent } from './locale.js';
import type { StatProps } from './types.js';

/* Stat — one number on a card: label, value, optional change and caption. Dashboards and page summaries.
 * change: { value: '+12%', direction: 'up' | 'down' | 'flat', tone?: 'positive' | 'negative' | 'neutral', label?: 'vs last month' }
 * A rise is not always good (cancellations), so tone is separate from direction; it defaults to up = positive. */
export const Stat = React.forwardRef<HTMLElement, StatProps>(function Stat(props, ref) {
  const ch = props.change;
  const dir = ch && (ch.direction || 'flat');
  const tone = ch && (ch.tone || (dir === 'up' ? 'positive' : dir === 'down' ? 'negative' : 'neutral'));
  const Link = useLinkComponent(props.linkComponent);
  /* Tabular figures only when the value is a number or a formatted amount ("฿31,900", "38,520.00 THB", "4.2k", "12%"):
   * on words they widen hyphens and spaces ("under-used"). A three-letter currency code is allowed. */
  const v = props.value;
  const numeric =
    typeof v === 'number' ||
    (typeof v === 'string' &&
      /\d/.test(v) &&
      /^[\s\d.,:+\-\u2212%()\u0E3F$\u20AC\u00A3\u00A5kKmMbB]+$/.test(v.replace(/\b[A-Z]{3}\b/g, '')));
  const Tag = (props.href ? Link : props.onClick ? 'button' : 'div') as React.ElementType;
  const interactive = !!(props.href || props.onClick);
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
        <span className={cx('aura-stat__value', numeric && 'is-numeric')}>
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
