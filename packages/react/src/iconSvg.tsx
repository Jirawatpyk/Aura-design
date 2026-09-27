import * as React from 'react';
import { cx } from './classes.js';
import type { IconProps } from './types.js';
const h = React.createElement;

/** One SVG child: element name and its attributes. */
export type IconShape = [string, Record<string, string>];
/** An AURA icon component from `@jirawatpyk/aura-react/icons` (5.9), e.g. `IconUsers`. */
export type AuraIcon = React.ForwardRefExoticComponent<Omit<IconProps, 'name'> & React.RefAttributes<SVGSVGElement>> & {
  /** The icon's path data. */
  readonly auraShapes: IconShape[];
  /** Its name in the set, e.g. `users`. */
  readonly iconName: string;
};

const SIZES: Record<string, number> = { sm: 16, md: 20, lg: 24 };
export function iconSize(size: IconProps['size']): number {
  return SIZES[size as string] || (size as number) || 16;
}

/** The <svg> of a built-in icon. Shared by <Icon name="…"> and the per-icon components so both give the same HTML. */
export function iconSvg(
  shapes: IconShape[],
  props: Omit<IconProps, 'name'>,
  ref: React.Ref<SVGSVGElement> | undefined,
): React.ReactElement {
  const size = iconSize(props.size);
  const a11y: React.SVGProps<SVGSVGElement> = props.label
    ? { role: 'img', 'aria-label': props.label }
    : { 'aria-hidden': true, focusable: 'false' };
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={props.strokeWidth || 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx('aura-icon', props.className)}
      {...a11y}
    >
      {shapes.map(function (s, i) {
        const attrs: Record<string, string | number> = { key: i };
        for (const k in s[1]) attrs[k === 'stroke-width' ? 'strokeWidth' : k] = s[1][k];
        return h(s[0], attrs);
      })}
    </svg>
  );
}

/** Makes an icon component from path data (24×24, stroked in currentColor, like Lucide). The per-icon exports are
 * built with it; use it for an icon of your own that should look and behave exactly like AURA's. */
export function defineIcon(name: string, shapes: IconShape[]): AuraIcon {
  const C = React.forwardRef<SVGSVGElement, Omit<IconProps, 'name'>>(function AuraIcon(props, ref) {
    return iconSvg(shapes, props, ref);
  });
  C.displayName =
    'Icon' +
    name
      .split('-')
      .map(function (p) {
        return p.charAt(0).toUpperCase() + p.slice(1);
      })
      .join('');
  return Object.assign(C, { auraShapes: shapes, iconName: name });
}

/** The path data behind an icon element made by defineIcon (a per-icon component), else null. */
export function shapesOf(el: unknown): IconShape[] | null {
  if (!React.isValidElement(el)) return null;
  const t = el.type as { auraShapes?: IconShape[] } | string;
  return (typeof t !== 'string' && t && t.auraShapes) || null;
}
