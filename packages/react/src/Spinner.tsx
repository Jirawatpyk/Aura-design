import * as React from 'react';
import { spinnerElement } from './display.js';
import type { SpinnerProps } from './types.js';

/* 5.70 (Chamber-OS 189): the markup lives in display.tsx, shared with the server entry's Spinner. */
export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(props, ref) {
  return spinnerElement(props, ref);
});
