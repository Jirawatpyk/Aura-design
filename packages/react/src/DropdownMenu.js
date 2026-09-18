import * as React from 'react';
import { Menu } from './Menu.js';
import { useMergedRef } from './internal.js';
const h = React.createElement;

/* DropdownMenu — a trigger that opens a Menu. `trigger` is one element (usually a Button or IconButton);
 * it gets aria-haspopup / aria-expanded and the click handler. */
export const DropdownMenu = React.forwardRef(function DropdownMenu(props, ref) {
  var st = React.useState(null), anchor = st[0], setAnchor = st[1];
  var wrap = React.useRef(null), wrapMerged = useMergedRef(ref, wrap);
  var child = React.Children.only(props.trigger);
  function toggle(e) {
    if (child.props.onClick) child.props.onClick(e);
    var el = wrap.current && (wrap.current.querySelector('button, [role="button"], a') || wrap.current);
    setAnchor(anchor ? null : el);
  }
  function onKeyDown(e) {
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !anchor) {
      e.preventDefault();
      setAnchor(wrap.current.querySelector('button, [role="button"], a') || wrap.current);
    }
  }
  return h('span', { ref: wrapMerged, className: 'aura-dropdown', onKeyDown: onKeyDown },
    React.cloneElement(child, { onClick: toggle, 'aria-haspopup': 'menu', 'aria-expanded': anchor ? true : false }),
    anchor ? h(Menu, {
      anchor: anchor, label: props.label, items: props.items,
      onClose: function (restore) { setAnchor(null); if (restore && anchor.focus) anchor.focus(); }
    }) : null);
});
