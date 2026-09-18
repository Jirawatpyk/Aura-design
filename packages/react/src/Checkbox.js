import * as React from 'react';
import { cx, omit, useMergedRef, useMaybeControlled } from './internal.js';
import { Icon } from './Icon.js';
const h = React.createElement;

/* Checkbox — a 16px box. Without children it is a bare box named by `label` (table rows).
 * With children it is a form choice: the text sits beside the box and names it; `description` adds a second line.
 * Controlled (checked + onChange) or not (defaultChecked). onChange gets a boolean. */
export const Checkbox = React.forwardRef(function Checkbox(props, ref) {
  var own = React.useRef(null), merged = useMergedRef(ref, own);
  var st = useMaybeControlled(props.checked, !!props.defaultChecked, props.onChange);
  var on = !!st[0];
  React.useEffect(function () { if (own.current) own.current.indeterminate = !!props.indeterminate; });
  var rest = omit(props, ['checked', 'defaultChecked', 'onChange', 'indeterminate', 'label', 'children', 'description', 'className', 'tabIndex', 'disabled']);
  var labelled = props.children != null;
  var descId = props.description && props.id ? props.id + '-desc' : undefined;
  return h('label', { className: cx('aura-check', labelled && 'aura-check--labelled', props.disabled && 'is-disabled', props.className), onClick: function (e) { e.stopPropagation(); } },
    h('input', Object.assign({}, rest, { ref: merged, type: 'checkbox', className: 'aura-check__input', checked: on,
      tabIndex: props.tabIndex, disabled: props.disabled, 'aria-describedby': descId,
      'aria-label': labelled ? undefined : props.label, onChange: function (e) { st[1](e.target.checked); } })),
    h('span', { className: 'aura-check__box', 'aria-hidden': true },
      props.indeterminate ? h(Icon, { name: 'minus', size: 12, strokeWidth: 3 })
        : on ? h(Icon, { name: 'check', size: 12, strokeWidth: 3 }) : null),
    labelled ? h('span', { className: 'aura-check__text' },
      h('span', { className: 'aura-check__label' }, props.children),
      props.description ? h('span', { className: 'aura-check__desc', id: descId }, props.description) : null) : null);
});
