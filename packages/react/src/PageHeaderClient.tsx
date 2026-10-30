import * as React from 'react';
import { PageHeader as StaticPageHeader } from './PageHeader.js';
import type { PageHeaderProps } from './PageHeader.js';
import { barStack, devWarnOnce, fixedTrapped as trapped, useMergedRef } from './internal.js';

/* 5.45 (Chamber-OS 150): the main entry's PageHeader is the stateless one plus one effect — while `actionsBarBelow`
 * has made the actions a fixed bar, their height goes to --aura-page-actions-height on <html>, so the page's end and a
 * focused field scroll clear of the bar whatever it holds. The server entry's PageHeader renders the same markup and
 * keeps the CSS's 7rem until a client one takes over. */
/* Bars on the page, newest last: the newest one fixed and on screen writes its height; when it goes or is hidden (a
 * tab panel, 5.73), the one before takes over. */
const bars = barStack(
  '--aura-page-actions-height',
  function () {
    devWarnOnce(
      'pageheader-bar-twice',
      'PageHeader actionsBarBelow: two bars are on screen at once and overlap at the bottom of the screen. Give it to one PageHeader per page (one per tab panel is fine: only the shown one counts).',
    );
  },
  function () {
    marks.forEach(function (m) {
      m();
    });
  },
);

/* 5.74 (Chamber-OS 193): a bar is empty when nothing in it but the status line is shown — each other child (looking
 * through display: contents wrappers) is `hidden`, display: none, visibility: hidden while the bar itself is visible,
 * or visually hidden text (an aria-describedby note), and no text sits in it. Judged by each child's own style, not
 * checkVisibility(), which would see the bar's own hiding. */
const UNSEEN = '.aura-page-header__status, .sr-only, .aura-sr-only, .visually-hidden, .screen-reader-text';
function noneShown(el: HTMLElement, barVisible: boolean): boolean {
  for (let n = el.firstChild; n; n = n.nextSibling) {
    if (n.nodeType === 3) {
      if ((n.textContent || '').trim()) return false;
      continue;
    }
    if (n.nodeType !== 1) continue;
    const c = n as HTMLElement;
    if (c.hidden || c.matches(UNSEEN)) continue;
    const s = getComputedStyle(c);
    if (s.display === 'none') continue;
    /* visibility is inherited: it hides a child only when the bar itself is visible (not under a hidden gate) */
    if (barVisible && (s.visibility === 'hidden' || s.visibility === 'collapse')) continue;
    /* an inline visually hidden box (Radix's VisuallyHidden: position absolute and clipped), as 5.61 */
    const inline = c.getAttribute('style') || '';
    if (/position:\s*absolute/.test(inline) && /clip/.test(inline)) continue;
    if (s.display === 'contents' && noneShown(c, barVisible)) continue;
    return false;
  }
  return true;
}
/* Every mounted bar's check, re-run whenever the bars are re-read (a click, a key, a focus move, a transition, a
 * history change), so a visibility gate lifted with no mutation or resize is seen too. */
const marks = new Set<() => void>();

export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(function PageHeader(props, ref) {
  const own = React.useRef<HTMLDivElement | null>(null);
  const merged = useMergedRef(ref, own);
  const bar = props.actionsBarBelow;
  const hasActions =
    (props.actions != null && props.actions !== false) || (props.actionsBar != null && props.actionsBar !== false);
  /* 5.71: with actionsBar only that part is the bar. */
  const split = props.actionsBar != null && props.actionsBar !== false;
  React.useEffect(
    function () {
      if ((bar !== 'sm' && bar !== 'md') || !hasActions || !own.current) return;
      const el = own.current.querySelector<HTMLElement>(
        split ? ':scope > .aura-page-header__actions > .aura-page-header__bar' : ':scope > .aura-page-header__actions',
      );
      if (!el) return;
      const head = own.current;
      let checked = false;
      /* 5.74: data-aura-bar="empty" on the header (React doesn't own it) drops the strip and the page's bar padding in
       * CSS, and its 0 height leaves the variable at 0px; "shown" overrides the CSS-only guess made before hydration. */
      function mark() {
        const empty = noneShown(el!, getComputedStyle(el!).visibility === 'visible');
        const state = empty ? 'empty' : 'shown';
        if (head.getAttribute('data-aura-bar') !== state) head.setAttribute('data-aura-bar', state);
      }
      function sync() {
        mark();
        bars.write();
        if (!checked && getComputedStyle(el!).position === 'fixed' && ((checked = true), trapped(el!)))
          devWarnOnce(
            'pageheader-bar-trapped',
            "PageHeader actionsBarBelow: an ancestor has a transform, filter, will-change or paint containment, so the fixed bar is placed against it instead of the screen. Remove it from the page header's ancestors.",
          );
      }
      mark();
      marks.add(mark);
      bars.add(el);
      /* A child shown or hidden (its hidden attribute, a class, a style) or added or removed. */
      const mo =
        typeof MutationObserver === 'undefined'
          ? null
          : new MutationObserver(function () {
              /* one check per frame, however busy the bar's content */
              if (!frame) frame = requestAnimationFrame(later);
            });
      let frame = 0;
      function later() {
        frame = 0;
        sync();
      }
      if (mo)
        mo.observe(el, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['hidden', 'class', 'style'],
        });
      const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(sync);
      if (ro) ro.observe(el, { box: 'border-box' });
      window.addEventListener('resize', sync);
      /* 5.49 (Chamber-OS 155): a change of the browser's text size can pin or release the bar with no resize event;
       * the bar's own size changes then, so the observer above catches it. */
      sync();
      return function () {
        if (ro) ro.disconnect();
        if (mo) mo.disconnect();
        if (frame) cancelAnimationFrame(frame);
        marks.delete(mark);
        window.removeEventListener('resize', sync);
        head.removeAttribute('data-aura-bar');
        bars.remove(el);
      };
    },
    [bar, hasActions, split],
  );
  /* 5.46 (Chamber-OS 151): focusTitleOnMount — the heading takes focus once, when the header mounts, without scrolling. */
  const focusTitle = !!props.focusTitleOnMount;
  React.useEffect(function () {
    if (!focusTitle || !own.current) return;
    const t = own.current.querySelector<HTMLElement>('.aura-page-header__title');
    if (t) t.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <StaticPageHeader {...props} ref={merged} />;
});
