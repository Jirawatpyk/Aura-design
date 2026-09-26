import * as React from 'react';
import { emptyStateElement } from './display.js';
import type { EmptyStateProps } from './types.js';

/* ---------- EmptyState: nothing to show yet, and what to do about it ---------- */
/* The markup lives in display.tsx (5.8), shared with the server entry's EmptyState. */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(props, ref) {
  return emptyStateElement(props, ref);
});
