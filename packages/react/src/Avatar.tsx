import * as React from 'react';
import { avatarElement } from './display.js';
import type { AvatarProps } from './types.js';

/* The markup lives in display.tsx (5.14), shared with the server entry's Avatar; this one falls back to the initials
 * when the image fails. */
export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(props, ref) {
  const errState = React.useState<string | null>(null);
  return avatarElement(props, ref, errState[0], function () {
    errState[1](props.src || null);
  });
});
