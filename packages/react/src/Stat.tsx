import * as React from 'react';
import { useLinkComponent } from './locale.js';
import { statElement } from './display.js';
import type { StatProps } from './types.js';

/* Stat — one number on a card: label, value, optional change and caption. Dashboards and page summaries.
 * change: { value: '+12%', direction: 'up' | 'down' | 'flat', tone?: 'positive' | 'negative' | 'neutral', label?: 'vs last month' }
 * A rise is not always good (cancellations), so tone is separate from direction; it defaults to up = positive.
 * The markup lives in display.tsx (5.14), shared with the server entry's Stat. */
export const Stat = React.forwardRef<HTMLElement, StatProps>(function Stat(props, ref) {
  const Link = useLinkComponent(props.linkComponent);
  return statElement(props, ref, Link);
});
