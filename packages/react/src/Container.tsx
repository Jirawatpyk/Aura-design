import * as React from 'react';
import { cx } from './internal.js';

const h = React.createElement;

/** Centred page column. */
export interface ContainerProps {
  /** `narrow` caps it at aura-container-narrow (720px). Default `default` (1280px). */
  size?: 'default' | 'narrow';
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/** Container — centres content up to aura-container-max (1280px) with responsive side padding. */
export const Container = React.forwardRef<HTMLElement, ContainerProps>(function Container(props, ref) {
  return h(
    props.as || 'div',
    {
      ref: ref,
      className: cx('aura-container', props.size === 'narrow' && 'is-narrow', props.className),
      style: props.style,
    },
    props.children,
  );
});
