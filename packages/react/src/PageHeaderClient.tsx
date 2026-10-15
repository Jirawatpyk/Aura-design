import * as React from 'react';
import { PageHeader as StaticPageHeader } from './PageHeader.js';
import type { PageHeaderProps } from './PageHeader.js';
import { devWarnOnce, useMergedRef } from './internal.js';

/* 5.45 (Chamber-OS 150): the main entry's PageHeader is the stateless one plus one effect — while `actionsBarBelow`
 * has made the actions a fixed bar, their height goes to --aura-page-actions-height on <html>, so the page's end and a
 * focused field scroll clear of the bar whatever it holds. The server entry's PageHeader renders the same markup and
 * keeps the CSS's 7rem until a client one takes over. */
const NAME = '--aura-page-actions-height';
/* Bars on the page, newest last: the newest one's height is the one written; when it goes, the one before takes over. */
const bars: Array<() => void> = [];

/* `position: fixed` is relative to an ancestor with a transform, filter, perspective, will-change or paint
 * or layout containment, not to the screen. */
function trapped(el: HTMLElement): boolean {
  for (let p = el.parentElement; p && p !== document.documentElement; p = p.parentElement) {
    const s = getComputedStyle(p);
    if (
      s.transform !== 'none' ||
      s.filter !== 'none' ||
      (s.backdropFilter || 'none') !== 'none' ||
      (s as unknown as { contentVisibility?: string }).contentVisibility === 'auto' ||
      s.perspective !== 'none' ||
      /transform|filter|perspective/.test(s.willChange) ||
      /paint|layout|strict|content/.test(s.contain)
    )
      return true;
  }
  return false;
}

export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(function PageHeader(props, ref) {
  const own = React.useRef<HTMLDivElement | null>(null);
  const merged = useMergedRef(ref, own);
  const bar = props.actionsBarBelow;
  const hasActions = props.actions != null && props.actions !== false;
  React.useEffect(
    function () {
      if ((bar !== 'sm' && bar !== 'md') || !hasActions || !own.current) return;
      const el = own.current.querySelector<HTMLElement>(':scope > .aura-page-header__actions');
      if (!el) return;
      const root = document.documentElement;
      let checked = false;
      function sync() {
        if (bars[bars.length - 1] !== sync) return;
        if (getComputedStyle(el!).position === 'fixed') {
          root.style.setProperty(NAME, el!.offsetHeight + 'px');
          if (!checked && ((checked = true), trapped(el!)))
            devWarnOnce(
              'pageheader-bar-trapped',
              "PageHeader actionsBarBelow: an ancestor has a transform, filter, will-change or paint containment, so the fixed bar is placed against it instead of the screen. Remove it from the page header's ancestors.",
            );
        } else root.style.removeProperty(NAME);
      }
      if (bars.length)
        devWarnOnce(
          'pageheader-bar-twice',
          'PageHeader actionsBarBelow: two bars on one page overlap at the bottom of the screen. Give it to one PageHeader per page.',
        );
      bars.push(sync);
      const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(sync);
      if (ro) ro.observe(el);
      window.addEventListener('resize', sync);
      sync();
      return function () {
        if (ro) ro.disconnect();
        window.removeEventListener('resize', sync);
        bars.splice(bars.indexOf(sync), 1);
        if (bars.length) bars[bars.length - 1]!();
        else root.style.removeProperty(NAME);
      };
    },
    [bar, hasActions],
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
