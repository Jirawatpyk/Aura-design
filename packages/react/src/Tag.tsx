import * as React from 'react';
import { Icon } from './Icon.js';
import { cx, omit } from './internal.js';
import { useStrings } from './locale.js';
import type { TagProps } from './types.js';

/* ---------- Tag: an interactive chip — removable (onRemove) or selectable (selected + onClick) ---------- */
export const Tag = React.forwardRef<HTMLElement, TagProps>(function Tag(props, ref) {
  const t = useStrings();
  const selectable = props.onClick != null || props.selected != null;
  const rest = omit(props, ['onRemove', 'selected', 'icon', 'className', 'children', 'disabled', 'removeLabel']);
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
        className={cx('aura-tag is-selectable', props.selected && 'is-selected', props.className)}
      >
        {props.selected ? <Icon name="check" size={14} /> : inner[0]}
        {inner[1]}
      </button>
    );
  }
  return (
    <span {...rest} ref={ref} className={cx('aura-tag', props.disabled && 'is-disabled', props.className)}>
      {inner}
      {props.onRemove && !props.disabled ? (
        <button
          type="button"
          className="aura-tag__remove"
          aria-label={props.removeLabel || t.remove(typeof props.children === 'string' ? props.children : '')}
          onClick={props.onRemove}
        >
          <Icon name="x" size={12} />
        </button>
      ) : null}
    </span>
  );
});
