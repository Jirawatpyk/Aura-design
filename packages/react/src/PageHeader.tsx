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
  /** 5.37 (DxT Monitor #17): below this breakpoint (`sm` 640px, `md` 768px, `lg` 1024px) the actions take the whole
   * row under the text, 12px apart, and its buttons share each line in equal widths unless a label needs more (a trigger inside a DropdownMenu,
   * Tooltip or Popover too; IconButtons keep their size) — a single Button or your own grid spans the row. Wider
   * than that, the actions hug their content at the end as before. */
  actionsFullWidthBelow?: 'sm' | 'md' | 'lg' | undefined;
  /** 5.41 (DxT Monitor #20): below this breakpoint the title moves out of sight — still the page's heading for screen
   * readers — and the breadcrumb and eyebrow are hidden, for phone layouts that show the title in the top bar. The
   * meta line and actions stay; with no meta, the actions start the header. */
  titleHideBelow?: 'sm' | 'md' | 'lg' | undefined;
  /** 5.45 (Chamber-OS 150): below this breakpoint (`sm` 640px, `md` 768px) the same `actions` — rendered once, so a
   * dialog trigger or test id is never doubled — become a bar fixed to the bottom of the screen with ActionBar's look:
   * above a BottomNav, clear of the home indicator, `actionsStatus` as its status line. The page's end and a focused
   * field scroll clear of it (AppShell's content, or the body, gains the bar's height). With an IconButton among them
   * the actions share one row, labels wrapping inside the buttons (as `actionsFullWidthBelow`, Chamber-OS 149); with only icon
   * buttons the status and the icons share one row. From the breakpoint up nothing changes. Use it for a detail page's
   * own actions (Issue credit note…, ⋯) — one per page. The bar is `position: fixed`: no ancestor of the header may
   * have a transform, filter, backdrop-filter, will-change, paint/layout containment or `content-visibility: auto`, or it is placed
   * against that ancestor instead of the screen — the main entry warns in development. */
  actionsBarBelow?: 'sm' | 'md' | undefined;
  /** 5.45: the bar's status line ("Total 10,700.00 THB incl. VAT · due 22 Oct 2026"), shown only while the actions are
   * a bar, in a polite live region. */
  actionsStatus?: React.ReactNode | undefined;
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
  const below = props.actionsFullWidthBelow;
  const hide = props.titleHideBelow;
  const hasMeta = props.meta != null && props.meta !== false;
  const hasActions = props.actions != null && props.actions !== false;
  /* No actions, no bar — and no space reserved for one at the page's end. */
  const bar =
    hasActions && (props.actionsBarBelow === 'sm' || props.actionsBarBelow === 'md') ? props.actionsBarBelow : null;
  return h(
    'div',
    Object.assign(attrs, {
      ref: ref,
      className: cx(
        'aura-page-header',
        (below === 'sm' || below === 'md' || below === 'lg') && 'aura-page-header--actions-full-below-' + below,
        (hide === 'sm' || hide === 'md' || hide === 'lg') && 'aura-page-header--title-hide-below-' + hide,
        (hide === 'sm' || hide === 'md' || hide === 'lg') && !hasMeta && 'has-no-meta',
        bar && 'aura-page-header--actions-bar-below-' + bar,
        props.className,
      ),
      style: props.style,
    }),
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
      ? h(
          'div',
          { className: 'aura-page-header__actions' },
          bar && props.actionsStatus != null && props.actionsStatus !== false
            ? h('div', { className: 'aura-page-header__status', role: 'status' }, props.actionsStatus)
            : null,
          props.actions,
        )
      : null,
  );
});
