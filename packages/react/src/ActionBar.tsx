import * as React from 'react';
import { Button } from './Button.js';
import { barStack, cx, devWarnOnce, fixedTrapped } from './internal.js';
import { useStrings } from './locale.js';
import type { ActionBarProps } from './types.js';

/** ActionBar — a bar stuck to the bottom of the screen or of a card: a status line and the form's or selection's
 * actions. It is `position: sticky`, so it stays in the flow at the end of its parent and never covers the last field.
 * 5.69 (Chamber-OS 185): `look="edge"` / `edgeBelow` make a viewport bar PageHeader's edge strip — fixed, the screen's
 * full width — and the page gains its height at the end, as PageHeader's bar does, so it still never covers it. */
/* Edge bars on the page: the newest one fixed and on screen writes its height (5.72, 5.73: a bar in a hidden tab is
 * skipped — display: none, visibility: hidden or content-visibility: hidden). */
const edges = barStack('--aura-actionbar-height');
export const ActionBar = React.forwardRef<HTMLDivElement, ActionBarProps>(function ActionBar(props, ref) {
  const t = useStrings();
  const bulk = props.selected != null;
  const idle = bulk && !props.selected;
  const count = bulk && props.selected ? t.selectedCount(props.selected) : null;
  /* 5.20: `start` counts only when it renders something (not null, false, true or ''). */
  const hasStart = React.Children.toArray(props.start).some(function (c) {
    return c !== '';
  });
  /* Where focus came from before it entered the bar: Clear hides the bar's buttons, so focus goes back there. */
  const cameFrom = React.useRef<HTMLElement | null>(null);
  const own = React.useRef<HTMLDivElement | null>(null);
  const viewport = (props.position || 'viewport') === 'viewport';
  const edge = !viewport ? null : props.look === 'edge' ? 'all' : props.edgeBelow || null;
  if (props.look === 'edge' && props.edgeBelow && viewport)
    devWarnOnce(
      'actionbar-edge-both',
      'ActionBar: look="edge" draws the edge strip at every width, so edgeBelow does nothing. Pass edgeBelow alone for a strip on a phone and the floating card above it.',
    );
  /* 5.69: while the edge strip is fixed (the CSS decides: width, a screen taller than 30rem, not an idle bulk bar),
   * <html> gets its height as --aura-actionbar-height: the page's end is padded by it (the shell's content, else the
   * body) and scroll-padding-bottom keeps a focused field clear, whatever the bar holds. */
  React.useEffect(
    function () {
      const el = own.current;
      if (!edge || !el) return;
      let checked = false;
      function sync() {
        edges.write();
        if (!checked && getComputedStyle(el!).position === 'fixed' && ((checked = true), fixedTrapped(el!)))
          devWarnOnce(
            'actionbar-edge-trapped',
            'ActionBar look="edge": an ancestor has a transform, filter, will-change or paint containment, so the fixed strip is placed against it instead of the screen. Remove it from the bar\'s ancestors.',
          );
      }
      edges.add(el);
      /* border-box: the home-indicator padding changes with the BottomNav (hideOnScroll, data-aura-hide-bottomnav)
       * while the content box stays the same. */
      const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(sync);
      if (ro) ro.observe(el, { box: 'border-box' });
      window.addEventListener('resize', sync);
      sync();
      return function () {
        if (ro) ro.disconnect();
        window.removeEventListener('resize', sync);
        edges.remove(el);
      };
    },
    [edge, idle],
  );
  function clear() {
    props.onClearSelection!();
    setTimeout(function () {
      const back = cameFrom.current;
      const a = document.activeElement;
      if ((!a || a === document.body || !a.isConnected) && back && back.isConnected) back.focus();
    }, 0);
  }
  return (
    <div
      ref={function (el: HTMLDivElement | null) {
        own.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) ref.current = el;
      }}
      onFocus={function (e: React.FocusEvent) {
        const from = e.relatedTarget as HTMLElement | null;
        if (from && own.current && !own.current.contains(from)) cameFrom.current = from;
      }}
      role="region"
      aria-label={props.label || t.actions}
      /* Not while an idle bulk bar is folded away: the tabs would be gone with nothing in their place. */
      data-aura-hide-bottomnav={props.hidesBottomNav && !idle ? '' : undefined}
      className={cx(
        'aura-actionbar',
        'aura-actionbar--' + (props.position || 'viewport'),
        edge && (edge === 'all' ? 'aura-actionbar--edge' : 'aura-actionbar--edge-below-' + edge),
        idle && 'is-idle',
        props.className,
      )}
    >
      <div className={cx('aura-actionbar__inner', hasStart && 'has-start')}>
        {/* Always rendered, so a change of text is announced. */}
        <div className="aura-actionbar__status" role="status">
          {count}
          {count && props.status ? ' · ' : null}
          {props.status}
        </div>
        {!idle && hasStart ? <div className="aura-actionbar__start">{props.start}</div> : null}
        {!idle ? (
          <div className="aura-actionbar__actions">
            {count && props.onClearSelection ? (
              <Button variant="ghost" size="sm" touchHeight={props.touchHeight} onClick={clear}>
                {t.clear()}
              </Button>
            ) : null}
            {props.children}
          </div>
        ) : null}
      </div>
    </div>
  );
});
