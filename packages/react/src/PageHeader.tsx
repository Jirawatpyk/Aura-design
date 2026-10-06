import * as React from 'react';
import { cx } from './classes.js';
import type { DataAttributes } from './types.js';

const h = React.createElement;

/** PageHeader (5.32, DxT Monitor request 3): the top of a page — an eyebrow, the page's heading, a meta line and the
 * page's actions. It has no outer padding: inside AppShell, the content padding is the page margin (16px at the sides
 * and 24px top and bottom on phones, 24px from 640px, 32px from 1024px). Stateless, so it is also exported from
 * `/server`. It renders a plain `div`: to name a region by its title, put `aria-labelledby={titleId}` on your own
 * `<section>`, or pass `role="region"` with it. */
export interface PageHeaderProps
  extends
    Pick<React.HTMLAttributes<HTMLElement>, 'id' | 'lang' | 'dir' | 'role'>,
    React.AriaAttributes,
    DataAttributes {
  /** Small mono line above the title — a section or breadcrumb-like context ("Monitor / Sites"). */
  eyebrow?: React.ReactNode | undefined;
  /** 5.33 (DxT Monitor #7): a `<Breadcrumb>` above the title, 4px from it like the eyebrow, in its own `div` (a `nav`
   * can't sit in the eyebrow's `p`) and its own 13px sans. Detail pages show a breadcrumb or an eyebrow; with both,
   * the breadcrumb comes first. */
  breadcrumb?: React.ReactNode | undefined;
  /** The page's heading. */
  title: React.ReactNode;
  /** A line under the title — counts, last update, owner. */
  meta?: React.ReactNode | undefined;
  /** Buttons for the page, bottom-aligned at the end; they wrap below the text on a narrow screen. */
  actions?: React.ReactNode | undefined;
  /** Default 1. Use 2 when the page already has an h1 (e.g. in the AppShell bar). */
  headingLevel?: 1 | 2 | 3 | undefined;
  /** The heading's id, for `aria-labelledby` on the page's region. */
  titleId?: string | undefined;
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
}

export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(function PageHeader(props, ref) {
  const attrs: Record<string, unknown> = {};
  Object.keys(props).forEach(function (k: string) {
    if (k === 'id' || k === 'lang' || k === 'dir' || k === 'role' || /^(aria|data)-/.test(k))
      attrs[k] = (props as unknown as Record<string, unknown>)[k];
  });
  const level = props.headingLevel || 1;
  return h(
    'div',
    Object.assign(attrs, { ref: ref, className: cx('aura-page-header', props.className), style: props.style }),
    h(
      'div',
      { className: 'aura-page-header__text' },
      props.breadcrumb != null && props.breadcrumb !== false
        ? h('div', { className: 'aura-page-header__breadcrumb' }, props.breadcrumb)
        : null,
      props.eyebrow != null && props.eyebrow !== false
        ? h('p', { className: 'aura-page-header__eyebrow' }, props.eyebrow)
        : null,
      h('h' + level, { className: 'aura-page-header__title', id: props.titleId }, props.title),
      props.meta != null && props.meta !== false ? h('div', { className: 'aura-page-header__meta' }, props.meta) : null,
    ),
    props.actions != null && props.actions !== false
      ? h('div', { className: 'aura-page-header__actions' }, props.actions)
      : null,
  );
});
