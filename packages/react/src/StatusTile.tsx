import * as React from 'react';
import { useLinkComponent, useStrings } from './locale.js';
import { useAutoTip } from './autoTip.js';
import { devWarnOnce } from './classes.js';
import { statusTileElement } from './tiles.js';
import type { StatusTileProps } from './types.js';

const useIsoLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

/** StatusTile (5.34, DxT Monitor S06): one monitored thing — a status icon and tint, a two-line title, a value at the
 * top right, a short meta line and marker icons. With `href` the whole tile is one link, named by everything it
 * says. Put tiles in a TileGrid. Also exported from `/server` (status word in English unless `statusLabel`). */
export const StatusTile = React.forwardRef<HTMLElement, StatusTileProps>(function StatusTile(props, ref) {
  const Link = useLinkComponent(props.linkComponent);
  const t = useStrings();
  useAutoTip();
  if (!props.href && (props['aria-label'] || props['aria-labelledby']))
    devWarnOnce(
      'status-tile-label',
      'StatusTile `aria-label` needs `href`: without a link the tile is a plain box, where a name is not allowed.',
    );
  /* A title cut at two lines shows its full text in AURA's tip on hover and keyboard focus (aria-hidden: the link
   * already says it). The ref is on AURA's own title span, never the consumer's link component (which may not
   * forward refs). The attribute is set on the element, not through React, so server HTML and hydration match. */
  const titleRef = React.useRef<HTMLSpanElement | null>(null);
  const check = React.useCallback(function () {
    const el = titleRef.current;
    if (!el) return;
    const cut = el.scrollHeight > el.clientHeight + 1;
    const text = (el.textContent || '').replace(/,$/, '').trim();
    if (cut && text) el.setAttribute('data-aura-tip', text);
    else el.removeAttribute('data-aura-tip');
  }, []);
  /* Re-check when the title changes; the observer (one per tile) re-checks when its width changes. */
  useIsoLayoutEffect(check, [props.title, check]);
  /* …and when its width or its own text changes (a title component with state), and once the web fonts are in. The
   * span remounts when the tile turns into a link or back, so the observers follow `href`. */
  const linked = !!props.href;
  React.useEffect(
    function () {
      const el = titleRef.current;
      if (!el) return;
      let live = true;
      const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(check) : null;
      const mo = typeof MutationObserver !== 'undefined' ? new MutationObserver(check) : null;
      if (ro) ro.observe(el);
      if (mo) mo.observe(el, { characterData: true, childList: true, subtree: true });
      if (document.fonts && document.fonts.ready)
        document.fonts.ready.then(function () {
          if (live) check();
        });
      return function () {
        live = false;
        if (ro) ro.disconnect();
        if (mo) mo.disconnect();
      };
    },
    [check, linked],
  );
  return statusTileElement(props, ref, Link, t, titleRef);
});
