import * as React from 'react';

/* 5.35 (DxT Monitor 13, 14): a bar that slides away while the page scrolls down and comes back on the way up. Hidden
 * only after the page has moved past `from` px and kept going down for 8px; back after 8px up, near the top, when the
 * media query stops matching, and while focus is inside the bar (a keyboard user never loses it). The page scrolls
 * the window (AppShell's main is not a scroller). */
const STEP = 8;

export function useHideOnScroll(
  enabled: boolean,
  el: React.RefObject<HTMLElement | null>,
  media: string,
  from: number,
): boolean {
  const st = React.useState(false),
    hidden = st[0],
    setHidden = st[1];
  React.useEffect(
    function () {
      if (!enabled || typeof window === 'undefined') {
        setHidden(false);
        return;
      }
      const mq = window.matchMedia ? window.matchMedia(media) : null;
      let last = window.scrollY,
        lastH = window.innerHeight,
        resizedAt = -1e9,
        run = 0;
      function update() {
        const y = window.scrollY,
          dy = y - last;
        last = y;
        const node = el.current;
        if (
          (mq && !mq.matches) ||
          y <= from ||
          (node && document.activeElement && node.contains(document.activeElement))
        ) {
          run = 0;
          setHidden(false);
          return;
        }
        /* A phone's address bar sliding in or out resizes the viewport; at the end of the page that clamps the scroll
         * position (the page "scrolls up" by the bar's height) without the user moving. Not a direction, whether the
         * scroll event comes before or after the resize. The checks above still run first: a rotation past lg or a
         * resize near the top shows the bar. */
        if (window.innerHeight !== lastH || performance.now() - resizedAt < 150) {
          lastH = window.innerHeight;
          resizedAt = performance.now();
          run = 0;
          return;
        }
        /* iOS rubber-banding past the bottom scrolls "up": ignore movement beyond the end of the page. */
        if (y + window.innerHeight > document.documentElement.scrollHeight + 1) return;
        run = dy > 0 === run > 0 ? run + dy : dy;
        if (run > STEP) setHidden(true);
        else if (run < -STEP) setHidden(false);
      }
      /* Focus moving into an away bar (Tab from the content): the browser has already scrolled the page to where the
       * bar sits in the flow (a jump of hundreds of px). Put the bar back at once and the page where it was: the bar is
       * pinned to the edge, so the focused control is in view there. */
      /* Only a Tab press moves the page back: app code that scrolls and then focuses the bar (back to top, then the
       * search) keeps its own scroll. The flag lasts until the next frame. */
      let tabbing = false;
      function onKey(e: KeyboardEvent) {
        if (e.key !== 'Tab') return;
        tabbing = true;
        requestAnimationFrame(function () {
          tabbing = false;
        });
      }
      function reveal() {
        const n = el.current;
        if (n && n.classList.contains('is-away')) {
          n.classList.remove('is-away');
          if (tabbing && window.scrollY < last) window.scrollTo(window.scrollX, last);
        }
        setHidden(false);
      }
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      document.addEventListener('keydown', onKey, true);
      const node = el.current;
      if (node) node.addEventListener('focusin', reveal);
      if (mq && mq.addEventListener) mq.addEventListener('change', update);
      return function () {
        window.removeEventListener('scroll', update);
        window.removeEventListener('resize', update);
        document.removeEventListener('keydown', onKey, true);
        if (node) node.removeEventListener('focusin', reveal);
        if (mq && mq.removeEventListener) mq.removeEventListener('change', update);
      };
    },
    [enabled, el, media, from],
  );
  return enabled && hidden;
}
