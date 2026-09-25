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
      const vw = window.innerWidth,
        vh = window.innerHeight,
        gap = 8,
        m = 8;
      let side = props.side || 'top';
      /* Flip to the opposite side when the preferred one is clipped and the other has room (4.20: left and right too). */
      if (side === 'top' && r.top - t.height - gap < m && r.bottom + gap + t.height <= vh - m) side = 'bottom';
      else if (side === 'bottom' && r.bottom + gap + t.height > vh - m && r.top - t.height - gap >= m) side = 'top';
      else if (side === 'left' && r.left - t.width - gap < m && r.right + gap + t.width <= vw - m) side = 'right';
      else if (side === 'right' && r.right + gap + t.width > vw - m && r.left - t.width - gap >= m) side = 'left';
      const clampX = function (x: number) {
        return Math.max(m, Math.min(x, vw - t.width - m));
      };
      const clampY = function (y: number) {
        return Math.max(m, Math.min(y, vh - t.height - m));
      };
      let top: number, left: number;
      if (side === 'top' || side === 'bottom') {
        top = side === 'top' ? r.top - t.height - gap : r.bottom + gap;
        left = clampX(r.left + r.width / 2 - t.width / 2);
      } else {
        left = side === 'left' ? r.left - t.width - gap : r.right + gap;
        left = clampX(left);
        top = clampY(r.top + r.height / 2 - t.height / 2);
      }
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
