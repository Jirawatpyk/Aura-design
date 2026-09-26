import * as React from 'react';
import { badgeElement } from './display.js';
import type { BadgeProps } from './types.js';

/* ---------- Badge: a static label or count ---------- */
/* The markup lives in display.tsx (5.8), shared with the server entry's Badge. */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(props, ref) {
  return badgeElement(props, ref);
});
