import * as React from 'react';
import { Button } from './Button.js';
import { cx } from './internal.js';
import { useStrings } from './locale.js';
import type { ActionBarProps } from './types.js';

/** ActionBar — a bar stuck to the bottom of the screen or of a card: a status line and the form's or selection's
 * actions. It is `position: sticky`, so it stays in the flow at the end of its parent and never covers the last field. */
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
