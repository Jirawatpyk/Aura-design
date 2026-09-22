import * as React from 'react';
import { uid, useIsoLayoutEffect, useMergedRef } from './internal.js';
import { createPortal } from 'react-dom';
import type { TooltipProps } from './types.js';

export const Tooltip = React.forwardRef<HTMLSpanElement, TooltipProps>(function Tooltip(props, ref) {
  const id = uid(),
    st = React.useState(false),
    open = props.open !== undefined ? props.open : st[0],
    set = st[1];
  const anchor = React.useRef<HTMLSpanElement | null>(null),
    anchorMerged = useMergedRef(ref, anchor),
    tip = React.useRef<HTMLDivElement | null>(null),
    timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pos = React.useState<{ top: number; left: number } | null>(null);
  function show(now: boolean) {
    clearTimeout(timer.current);
    timer.current = setTimeout(
      function () {
        set(true);
      },
      now ? 0 : props.delay == null ? 400 : props.delay,
    );
  }
  function hide() {
    clearTimeout(timer.current);
    set(false);
  }
  useIsoLayoutEffect(
    function () {
      if (!open || !anchor.current || !tip.current) return;
      const r = anchor.current.getBoundingClientRect(),
        t = tip.current.getBoundingClientRect();
      let side = props.side || 'top',
        top = side === 'top' ? r.top - t.height - 8 : r.bottom + 8;
      if (side === 'top' && top < 8) top = r.bottom + 8;
      const left = Math.max(8, Math.min(r.left + r.width / 2 - t.width / 2, window.innerWidth - t.width - 8));
      pos[1]({ top: top, left: left });
    },
    [open],
  );
  React.useEffect(
    function () {
      if (!open) return;
      function esc(e: KeyboardEvent) {
        if (e.key === 'Escape') hide();
      }
      document.addEventListener('keydown', esc);
      return function () {
        document.removeEventListener('keydown', esc);
      };
    },
    [open],
  );
  const child = React.Children.only(props.children) as React.ReactElement<Record<string, any>>;
  const trigger = (
    <span
      ref={anchorMerged}
      className="aura-tooltip-anchor"
      onMouseEnter={function () {
        show(false);
      }}
      onMouseLeave={hide}
      onFocus={function () {
        show(true);
      }}
      onBlur={hide}
    >
      {React.cloneElement(child, { 'aria-describedby': open ? id : child.props['aria-describedby'] })}
    </span>
  );
  return (
    <React.Fragment>
      {trigger}
      {open
        ? createPortal(
            <div
              ref={tip}
              id={id}
              role="tooltip"
              className="aura-tooltip"
              style={{ top: pos[0] ? pos[0].top : -9999, left: pos[0] ? pos[0].left : -9999 }}
            >
              {props.content}
            </div>,
            document.body,
          )
        : null}
    </React.Fragment>
  );
});
