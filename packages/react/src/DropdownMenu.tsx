import * as React from 'react';
import { Menu } from './Menu.js';
import { useMergedRef } from './internal.js';
import type { DropdownMenuProps } from './types.js';

/* DropdownMenu — a trigger that opens a Menu. `trigger` is one element (usually a Button or IconButton);
 * it gets aria-haspopup / aria-expanded and the click handler. */
/** A trigger that opens a Menu. ArrowDown / ArrowUp on the trigger also opens it. */
export const DropdownMenu = React.forwardRef<HTMLSpanElement, DropdownMenuProps>(function DropdownMenu(props, ref) {
  const st = React.useState<HTMLElement | null>(null),
    anchor = st[0],
    setAnchor = st[1];
  const wrap = React.useRef<HTMLSpanElement | null>(null),
    wrapMerged = useMergedRef(ref, wrap);
  const child = React.Children.only(props.trigger) as React.ReactElement<Record<string, any>>;
  function toggle(e: React.MouseEvent) {
    if (child.props.onClick) child.props.onClick(e);
    const el = wrap.current && (wrap.current.querySelector<HTMLElement>('button, [role="button"], a') || wrap.current);
    setAnchor(anchor ? null : el);
  }
  function onKeyDown(e: React.KeyboardEvent) {
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !anchor) {
      e.preventDefault();
      setAnchor(wrap.current!.querySelector<HTMLElement>('button, [role="button"], a') || wrap.current);
    }
  }
  return (
    <span ref={wrapMerged} className="aura-dropdown" onKeyDown={onKeyDown}>
      {React.cloneElement(child, { onClick: toggle, 'aria-haspopup': 'menu', 'aria-expanded': anchor ? true : false })}
      {anchor ? (
        <Menu
          anchor={anchor}
          label={props.label as string}
          items={props.items}
          linkComponent={props.linkComponent}
          onClose={function (restore: boolean) {
            setAnchor(null);
            if (restore && typeof anchor!.focus === 'function') anchor!.focus();
          }}
        />
      ) : null}
    </span>
  );
});
