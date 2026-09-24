import * as React from 'react';
import { IconButton } from './IconButton.js';
import {
  FOCUSABLE,
  cx,
  trapTab,
  uid,
  useIsoLayoutEffect,
  useMaybeControlled,
  useMergedRef,
  useMounted,
} from './internal.js';
import { useDensity, useStrings } from './locale.js';
import { createPortal } from 'react-dom';
import type { PopoverProps } from './types.js';

/* ---------- Popover: a small non-modal panel anchored to a trigger ---------- */
function position(
  anchor: Element,
  pop: HTMLElement,
  placement: string | undefined,
): { top: number; left: number; side: string } {
  const r = anchor.getBoundingClientRect(),
    pw = pop.offsetWidth,
    ph = pop.offsetHeight,
    vw = window.innerWidth,
    vh = window.innerHeight,
    gap = 6;
  let side = (placement || 'bottom-start').split('-')[0],
    align = (placement || 'bottom-start').split('-')[1] || 'start';
  if (side === 'bottom' && r.bottom + gap + ph > vh - 8 && r.top - gap - ph > 8) side = 'top';
  else if (side === 'top' && r.top - gap - ph < 8 && r.bottom + gap + ph < vh - 8) side = 'bottom';
  const top = side === 'top' ? r.top - gap - ph : r.bottom + gap;
  const left = align === 'end' ? r.right - pw : align === 'center' ? r.left + r.width / 2 - pw / 2 : r.left;
  return { top: Math.max(8, top), left: Math.max(8, Math.min(left, vw - pw - 8)), side: side };
}

export const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(function Popover(props, ref) {
  const t = useStrings();
  const density = useDensity();
  const auto = uid(),
    id = props.id || auto;
  const st = useMaybeControlled(props.open, !!props.defaultOpen, props.onOpenChange);
  const open = !!st[0];
  const wrap = React.useRef<HTMLSpanElement | null>(null),
    pop = React.useRef<HTMLDivElement | null>(null),
    popMerged = useMergedRef(ref, pop);
  const pos = React.useState<{ top: number; left: number; side: string } | null>(null),
    mounted = useMounted();
  function trigger(): HTMLElement | null {
    return (
      wrap.current &&
      (wrap.current.querySelector<HTMLElement>('button, [role="button"], a, input') ||
        (wrap.current.firstElementChild as HTMLElement | null))
    );
  }
  function close(restore: boolean) {
    st[1](false);
    if (restore) {
      const tr = trigger();
      if (tr && tr.focus) tr.focus();
    }
  }
  useIsoLayoutEffect(
    function () {
      if (!open || !pop.current || !trigger()) return;
      function place() {
        if (pop.current && trigger()) pos[1](position(trigger()!, pop.current, props.placement));
      }
      place();
      window.addEventListener('resize', place);
      window.addEventListener('scroll', place, true);
      return function () {
        window.removeEventListener('resize', place);
        window.removeEventListener('scroll', place, true);
      };
    },
    [open, mounted, props.placement],
  );
  React.useEffect(
    function () {
      if (!open || !mounted) return;
      if (props.autoFocus !== false && pop.current) {
        const f =
          pop.current.querySelector<HTMLElement>('[data-autofocus]') ||
          pop.current.querySelector<HTMLElement>(FOCUSABLE);
        (f || pop.current).focus();
      }
      function outside(e: Event) {
        if (pop.current && pop.current.contains(e.target as Node)) return;
        if (wrap.current && wrap.current.contains(e.target as Node)) return;
        close(false);
      }
      document.addEventListener('pointerdown', outside, true);
      return function () {
        document.removeEventListener('pointerdown', outside, true);
      };
    },
    [open, mounted],
  );
  const child = React.Children.only(props.trigger) as React.ReactElement<Record<string, any>>;
  const panel =
    open && mounted
      ? createPortal(
          <div
            ref={popMerged}
            id={id}
            data-density={density}
            role="dialog"
            aria-modal={false}
            aria-label={props.title ? undefined : props.label}
            aria-labelledby={props.title ? id + '-title' : undefined}
            tabIndex={-1}
            className={cx('aura-popover', pos[0] && 'is-' + pos[0].side, props.className)}
            style={Object.assign(
              { top: pos[0] ? pos[0].top : -9999, left: pos[0] ? pos[0].left : -9999 },
              props.width ? { width: props.width } : null,
            )}
            onKeyDown={function (e: React.KeyboardEvent) {
              if (e.key === 'Escape') {
                e.stopPropagation();
                close(true);
              } else trapTab(e, pop.current);
            }}
          >
            {props.title ? (
              <div className="aura-popover__head">
                <p className="aura-popover__title" id={id + '-title'}>
                  {props.title}
                </p>
                <IconButton
                  icon="x"
                  label={t.close}
                  onClick={function () {
                    close(true);
                  }}
                />
              </div>
            ) : null}
            <div className="aura-popover__body">
              {typeof props.children === 'function'
                ? props.children({
                    close: function () {
                      close(true);
                    },
                  })
                : props.children}
            </div>
          </div>,
          document.body,
        )
      : null;
  return (
    <span ref={wrap} className="aura-popover-anchor">
      {React.cloneElement(child, {
        onClick: function (e: React.MouseEvent) {
          if (child.props.onClick) child.props.onClick(e);
          st[1](!open);
        },
        'aria-haspopup': 'dialog',
        'aria-expanded': open,
        'aria-controls': open ? id : undefined,
      })}
      {panel}
    </span>
  );
});
