import * as React from 'react';
import { cx } from './internal.js';
import type { DataAttributes } from './types.js';

const h = React.createElement;

/** Centred page column. To name it (`aria-label`), render a landmark with `as="section"` (or `main`, `nav`): a
 * plain `div` may not carry a name. */
export interface ContainerProps
  extends Pick<React.HTMLAttributes<HTMLElement>, 'id' | 'lang' | 'dir'>, React.AriaAttributes, DataAttributes {
  /** `narrow` caps it at aura-container-narrow (720px). Default `default` (1280px). */
  size?: 'default' | 'narrow' | undefined;
  /** `start` puts the column at the start edge (left; right in RTL) instead of centring it — a form board beside
   * the page's start (5.26, Chamber-OS 126). Default `center`. */
  align?: 'center' | 'start' | undefined;
  as?: keyof React.JSX.IntrinsicElements | undefined;
  /** Utilities that set `max-width` or `margin` (e.g. `max-w-[672px] mx-0`) are supported with `styles.layer.css`,
   * where a utility beats `.aura-container` (5.26). */
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
  children?: React.ReactNode | undefined;
}

/** Container — centres content up to aura-container-max (1280px) with responsive side padding. */
export const Container = React.forwardRef<HTMLElement, ContainerProps>(function Container(props, ref) {
  /* 5.26 (Chamber-OS 126): id, lang, dir, aria-* and data-* reach the element (a data-slot a layout gate reads). */
  const attrs: Record<string, unknown> = {};
  Object.keys(props).forEach(function (k: string) {
    if (k === 'id' || k === 'lang' || k === 'dir' || /^(aria|data)-/.test(k))
      attrs[k] = (props as unknown as Record<string, unknown>)[k];
  });
  return h(
    props.as || 'div',
    Object.assign(attrs, {
      ref: ref,
      className: cx(
        'aura-container',
        props.size === 'narrow' && 'is-narrow',
        props.align === 'start' && 'is-start',
        props.className,
      ),
      style: props.style,
    }),
    props.children,
  );
});
