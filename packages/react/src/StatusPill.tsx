import * as React from 'react';
import { statusPillElement } from './display.js';
import type { StatusPillProps } from './types.js';
export { toneFor, statusTone, TONE_ORDER } from './status.js';

/* The markup lives in display.tsx (5.8), shared with the server entry's StatusPill. */
export const StatusPill = React.forwardRef<HTMLSpanElement, StatusPillProps>(function StatusPill(props, ref) {
  return statusPillElement(props, ref);
});
