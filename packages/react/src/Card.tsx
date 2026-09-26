import * as React from 'react';
import { cardElement } from './display.js';
import type { CardProps } from './types.js';

/* The markup lives in display.tsx (5.8), shared with the server entry's Card. */
export const Card = React.forwardRef<HTMLElement, CardProps>(function Card(props, ref) {
  return cardElement(props, ref);
});
