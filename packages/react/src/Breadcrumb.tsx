import * as React from 'react';
import { Icon } from './Icon.js';
import { cx } from './internal.js';
import { useLinkComponent, useStrings } from './locale.js';
import type { BreadcrumbProps } from './types.js';

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(props, ref) {
  const t = useStrings();
  const Link = useLinkComponent(props.linkComponent);
  const items = props.items || [];
  return (
    <nav ref={ref} aria-label={props.label || t.breadcrumb} className={cx('aura-crumbs', props.className)}>
      <ol>
        {items.map(function (it: BreadcrumbProps['items'][number], i: number) {
          const last = i === items.length - 1;
          return (
            <li key={i}>
              {last ? (
                <span aria-current="page" className="aura-crumbs__current">
                  {it.label}
                </span>
              ) : it.href ? (
                <Link href={it.href} onClick={it.onClick}>
                  {it.label}
                </Link>
              ) : it.onClick ? (
                <button type="button" onClick={it.onClick}>
                  {it.label}
                </button>
              ) : (
                /* 5.7: a segment with no page and no action is text, not a button that does nothing. */
                <span className="aura-crumbs__text">{it.label}</span>
              )}
              {last ? null : <Icon name="chevron-right" size={12} className="aura-crumbs__sep" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});
