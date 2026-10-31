import * as React from 'react';

/* 5.35 (DxT Monitor 13, 14): a bar that slides away while the page scrolls down and comes back on the way up. Hidden
 * only after the page has moved past `from` px and kept going down for 8px; back after 8px up, near the top, when the
 * media query stops matching, and while keyboard focus is inside the bar (a keyboard user never loses it; 5.81: a
 * tap's focus doesn't count). The page scrolls the window (AppShell's main is not a scroller). */
const STEP = 8;

/* 5.81 (DxT Monitor 24): focus in the bar holds it only when it came from the keyboard. A tap on a tab focuses its
 * link (Chrome / Android) and, with client-side navigation, the bar stays mounted with that focus on the next page —
 * it then never hid. The hook notes whether focus entered the bar right after a pointer press (`:focus-visible`
 * can't tell: WebKit leaves it off links focused with Tab). A text field holds the bar however it was focused, and
 * focus moved with the keyboard (Tab into or within the bar) counts as keyboard focus. Keys that only scroll the page
 * (Space, PageDown) leave a tap's focus a tap's. */
const TEXT_ENTRY =
  'textarea, select, [contenteditable=""], [contenteditable="true"], [contenteditable="plaintext-only"], input:not([type]), input[type="text"], input[type="search"], input[type="email"], input[type="url"], input[type="tel"], input[type="number"], input[type="password"]';

export function useHideOnScroll(
  enabled: boolean,
  el: React.RefObject<HTMLElement | null>,
  media: string,
  from: number,
): boolean {
  const st = React.useState(false),
    hidden = st[0],
    setHidden = st[1];
  /* 5.81: when the last pointer press was (event time) and whether focus entered the bar from one — kept across
   * re-runs of the effect (AppShell's `from` is the measured bar height, which changes). */
  const tap = React.useRef({ pressedAt: -1e9, focus: false });
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
      /* WebKit scrolls a focused control into view after focusin, not before (Chromium), and to a sticky bar's place in
       * the flow: catch that scroll too, for a moment after a Tab into the bar. */
      let restore: { y: number; until: number } | null = null;
      function holdsBar(node: HTMLElement | null): boolean {
        const a = document.activeElement;
        if (!node || !a || !node.contains(a)) return false;
        return !tap.current.focus || a.matches(TEXT_ENTRY);
      }
      function update() {
        if (restore) {
          const r = restore;
          if (performance.now() > r.until || window.scrollY >= r.y - 1) restore = null;
          else {
            restore = null;
            last = r.y;
            window.scrollTo(window.scrollX, r.y);
            return;
          }
        }
        const y = window.scrollY,
          dy = y - last;
        last = y;
        const node = el.current;
        if ((mq && !mq.matches) || y <= from || holdsBar(node)) {
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
      /* The user's own scrolling (wheel, touch, a press, a scrolling key) is never put back. */
      function disarm() {
        restore = null;
      }
      function onPress(e: PointerEvent) {
        restore = null;
        tap.current.pressedAt = e.timeStamp;
      }
      function onKey(e: KeyboardEvent) {
        /* A focus that follows a key (Tab, Enter on a control that moves focus) is keyboard focus. */
        tap.current.pressedAt = -1e9;
        if (e.key !== 'Tab' && e.code !== 'Tab') {
          if (e.key !== 'Shift') restore = null;
          return;
        }
        tabbing = true;
        requestAnimationFrame(function () {
          tabbing = false;
        });
      }
      function reveal(e: FocusEvent) {
        tap.current.focus = e.timeStamp - tap.current.pressedAt < 1000;
        const n = el.current;
        if (n && n.classList.contains('is-away')) {
          n.classList.remove('is-away');
          if (tabbing) {
            if (window.scrollY < last) window.scrollTo(window.scrollX, last);
            else restore = { y: last, until: performance.now() + 400 };
          }
        }
        setHidden(false);
      }
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      document.addEventListener('keydown', onKey, true);
      window.addEventListener('wheel', disarm, { passive: true, capture: true });
      window.addEventListener('touchstart', disarm, { passive: true, capture: true });
      window.addEventListener('pointerdown', onPress, true);
      const node = el.current;
      if (node) node.addEventListener('focusin', reveal);
      if (mq && mq.addEventListener) mq.addEventListener('change', update);
      return function () {
        window.removeEventListener('scroll', update);
        window.removeEventListener('resize', update);
        document.removeEventListener('keydown', onKey, true);
        window.removeEventListener('wheel', disarm, true);
        window.removeEventListener('touchstart', disarm, true);
        window.removeEventListener('pointerdown', onPress, true);
        if (node) node.removeEventListener('focusin', reveal);
        if (mq && mq.removeEventListener) mq.removeEventListener('change', update);
      };
    },
    [enabled, el, media, from],
  );
  return enabled && hidden;
}
