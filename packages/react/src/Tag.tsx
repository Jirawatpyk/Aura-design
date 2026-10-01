import * as React from 'react';
import { Icon } from './Icon.js';
import { cx, devWarnOnce, omit } from './internal.js';
import { useStrings } from './locale.js';
import type { TagProps } from './types.js';
import { IconCheck, IconX } from './icons.js';

/* The words inside any children (5.10.1): <strong>Acme</strong> AB → "Acme AB", for the remove button's name. */
function textOf(node: React.ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (React.isValidElement(node)) {
    const p = node.props as { children?: React.ReactNode; 'aria-hidden'?: unknown };
    /* Text hidden from screen readers isn't part of what the button removes. */
    return p['aria-hidden'] === true || p['aria-hidden'] === 'true' ? '' : textOf(p.children);
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
  const inner = [
    props.icon ? <Icon key="i" name={props.icon} size={14} /> : null,
    <span key="t" className="aura-tag__text">
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
      {props.onRemove && !props.disabled ? (
        <button
          type="button"
          className="aura-tag__remove"
          aria-label={props.removeLabel || t.remove(name)}
          onClick={props.onRemove}
        >
          <Icon name={<IconX />} size={12} />
        </button>
      ) : null}
    </span>
  );
});
