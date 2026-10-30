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
const bars = barStack('--aura-page-actions-height', function () {
  devWarnOnce(
    'pageheader-bar-twice',
    'PageHeader actionsBarBelow: two bars are on screen at once and overlap at the bottom of the screen. Give it to one PageHeader per page (one per tab panel is fine: only the shown one counts).',
  );
});

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
      let checked = false;
      function sync() {
        bars.write();
        if (!checked && getComputedStyle(el!).position === 'fixed' && ((checked = true), trapped(el!)))
          devWarnOnce(
            'pageheader-bar-trapped',
            "PageHeader actionsBarBelow: an ancestor has a transform, filter, will-change or paint containment, so the fixed bar is placed against it instead of the screen. Remove it from the page header's ancestors.",
          );
      }
      bars.add(el);
      const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(sync);
      if (ro) ro.observe(el, { box: 'border-box' });
      window.addEventListener('resize', sync);
      /* 5.49 (Chamber-OS 155): a change of the browser's text size can pin or release the bar with no resize event;
       * the bar's own size changes then, so the observer above catches it. */
      sync();
      return function () {
        if (ro) ro.disconnect();
        window.removeEventListener('resize', sync);
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
