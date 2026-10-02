import * as React from 'react';
import { Icon } from './Icon.js';
import { cx, devWarnOnce, omit, useIsoLayoutEffect } from './internal.js';
import { Tooltip } from './Tooltip.js';
import { useStrings } from './locale.js';
import type { TagProps } from './types.js';
import { IconCheck, IconX } from './icons.js';

/* The words inside any children (5.10.1): <strong>Acme</strong> AB → "Acme AB", for the remove button's name. */
function textOf(node: React.ReactNode, all?: boolean): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node))
    return node
      .map(function (n) {
        return textOf(n, all);
      })
      .join('');
  if (React.isValidElement(node)) {
    const p = node.props as { children?: React.ReactNode; 'aria-hidden'?: unknown };
    /* Text hidden from screen readers isn't part of what the button removes. */
    return !all && (p['aria-hidden'] === true || p['aria-hidden'] === 'true') ? '' : textOf(p.children, all);
  }
  return '';
}

/* ---------- Tag: an interactive chip — removable (onRemove) or selectable (selected + onClick) ---------- */
export const Tag = React.forwardRef<HTMLElement, TagProps>(function Tag(props, ref) {
  const t = useStrings();
  const selectable = props.onClick != null || props.selected != null;
  const rest = omit(props, [
    'onRemove',
    'selected',
    'icon',
    'className',
    'children',
    'disabled',
    'removeLabel',
    'touchHeight',
  ]);
  /* 5.28 (Chamber-OS 132): when the text is cut (24ch, or a FilterBar row narrower than the chip), the full text
   * shows on hover (title) and, on a removable Tag, on the remove button's hover and focus (Tooltip). Only whether it
   * is cut is state; the text is read from the children at render, so a new label is never stale. */
  const textRef = React.useRef<HTMLSpanElement | null>(null);
  const cutState = React.useState(false),
    isCut = cutState[0];
  const check = React.useCallback(function () {
    const el = textRef.current;
    if (el) cutState[1](el.scrollWidth > el.clientWidth + 1);
  }, []);
  /* After every render (a label change at the same width), and on every resize. */
  useIsoLayoutEffect(check);
  useIsoLayoutEffect(
    function () {
      const el = textRef.current;
      if (!el || typeof ResizeObserver === 'undefined') return;
      const ro = new ResizeObserver(check);
      ro.observe(el);
      return function () {
        ro.disconnect();
      };
    },
    [check],
  );
  /* The hover text is everything shown, hidden-from-screen-readers parts included. */
  const fullText = isCut ? textOf(props.children, true).replace(/\s+/g, ' ').trim() : '';
  const inner = [
    props.icon ? <Icon key="i" name={props.icon} size={14} /> : null,
    <span key="t" ref={textRef} className="aura-tag__text" title={fullText || undefined}>
      {props.children}
    </span>,
  ];
  if (selectable) {
    return (
      <button
        {...rest}
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        aria-pressed={!!props.selected}
        disabled={props.disabled}
        className={cx(
          'aura-tag is-selectable',
          props.selected && 'is-selected',
          props.touchHeight && 'aura-tag--touch',
          props.className,
        )}
      >
        {props.selected ? <Icon name={<IconCheck />} size={14} /> : inner[0]}
        {inner[1]}
      </button>
    );
  }
  const name = props.onRemove && !props.removeLabel ? textOf(props.children).replace(/\s+/g, ' ').trim() : '';
  if (props.onRemove && !props.disabled && !props.removeLabel && !name)
    devWarnOnce(
      'tag-remove-label',
      'Tag: the remove button has no name — its children have no text. Pass removeLabel (e.g. "Remove Acme AB").',
    );
  return (
    <span {...rest} ref={ref} className={cx('aura-tag', props.disabled && 'is-disabled', props.className)}>
      {inner}
      {props.onRemove && !props.disabled
        ? (function () {
            const btn = (
              <button
                type="button"
                className="aura-tag__remove"
                aria-label={props.removeLabel || t.remove(name)}
                onClick={props.onRemove}
              >
                <Icon name={<IconX />} size={12} />
              </button>
            );
            /* Always wrapped, so the button keeps focus when the text starts or stops being cut. */
            return (
              <Tooltip content={fullText} open={fullText ? undefined : false}>
                {btn}
              </Tooltip>
            );
          })()
        : null}
    </span>
  );
});
