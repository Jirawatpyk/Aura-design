import * as React from 'react';
import { useStrings } from './locale.js';
import { cx, omit, useMaybeControlled, uid } from './internal.js';
import { Icon } from './Icon.js';
const h = React.createElement;

export const Field = React.forwardRef(function Field(props, ref) {
  var t = useStrings();
  return h('div', { ref: ref, className: cx('aura-field', props.error && 'is-invalid', props.disabled && 'is-disabled', props.className) },
    props.label ? h(props.labelAs || 'label', { className: 'aura-field__label', htmlFor: props.labelAs ? undefined : props.id, id: props.labelId },
      props.label, props.required ? h('span', { className: 'aura-field__req', 'aria-hidden': true }, ' *') : null,
      props.optional ? h('span', { className: 'aura-field__opt' }, ' (' + t.optional + ')') : null) : null,
    props.children,
    props.error ? h('p', { className: 'aura-field__error', id: props.id + '-error' }, h(Icon, { name: 'circle-alert', size: 14 }), props.error)
      : props.hint ? h('p', { className: 'aura-field__hint', id: props.id + '-hint' }, props.hint) : null);
});
function describedBy(id, p) { return p.error ? id + '-error' : p.hint ? id + '-hint' : undefined; }
var FIELD_KEYS = ['label', 'hint', 'error', 'required', 'optional', 'icon', 'className', 'id', 'suffix', 'options', 'placeholder'];

export const TextField = React.forwardRef(function TextField(props, ref) {
  var auto = uid(), id = props.id || auto;
  var rest = omit(props, FIELD_KEYS);
  return h(Field, { id: id, label: props.label, hint: props.hint, error: props.error, required: props.required, optional: props.optional, disabled: props.disabled, className: props.className },
    h('div', { className: cx('aura-input', props.icon && 'has-icon', props.suffix && 'has-suffix') },
      props.icon ? h(Icon, { name: props.icon, className: 'aura-input__icon' }) : null,
      h('input', Object.assign({ type: 'text' }, rest, {
        ref: ref, id: id, className: 'aura-input__control', placeholder: props.placeholder, required: props.required,
        'aria-invalid': props.error ? true : undefined, 'aria-describedby': describedBy(id, props)
      })),
      props.suffix ? h('span', { className: 'aura-input__suffix' }, props.suffix) : null));
});

export const Textarea = React.forwardRef(function Textarea(props, ref) {
  var auto = uid(), id = props.id || auto;
  var rest = omit(props, FIELD_KEYS);
  return h(Field, { id: id, label: props.label, hint: props.hint, error: props.error, required: props.required, optional: props.optional, disabled: props.disabled, className: props.className },
    h('textarea', Object.assign({ rows: 4 }, rest, {
      ref: ref, id: id, className: 'aura-input aura-textarea', placeholder: props.placeholder, required: props.required,
      'aria-invalid': props.error ? true : undefined, 'aria-describedby': describedBy(id, props)
    })));
});

export const Select = React.forwardRef(function Select(props, ref) {
  var auto = uid(), id = props.id || auto;
  var rest = omit(props, FIELD_KEYS.concat(['children']));
  var opts = (props.options || []).map(function (o) {
    var v = typeof o === 'object' ? o : { value: o, label: o };
    return h('option', { key: v.value, value: v.value, disabled: v.disabled }, v.label);
  });
  if (props.placeholder) opts.unshift(h('option', { key: '__ph', value: '', disabled: true }, props.placeholder));
  var extra = props.value === undefined && props.defaultValue === undefined && props.placeholder ? { defaultValue: '' } : {};
  return h(Field, { id: id, label: props.label, hint: props.hint, error: props.error, required: props.required, optional: props.optional, disabled: props.disabled, className: props.className },
    h('div', { className: cx('aura-input aura-select', props.icon && 'has-icon') },
      props.icon ? h(Icon, { name: props.icon, className: 'aura-input__icon' }) : null,
      h('select', Object.assign(extra, rest, {
        ref: ref, id: id, className: 'aura-input__control', required: props.required,
        'aria-invalid': props.error ? true : undefined, 'aria-describedby': describedBy(id, props)
      }), opts, props.children),
      h(Icon, { name: 'chevron-down', className: 'aura-select__chevron' })));
});

export const RadioGroup = React.forwardRef(function RadioGroup(props, ref) {
  var auto = uid(), id = props.id || auto;
  var st = useMaybeControlled(props.value, props.defaultValue, props.onChange);
  var name = props.name || id;
  return h('fieldset', { ref: ref, className: cx('aura-field aura-radio-group', props.error && 'is-invalid', props.className),
      'aria-describedby': describedBy(id, props), 'aria-invalid': props.error ? true : undefined, disabled: props.disabled },
    props.label ? h('legend', { className: 'aura-field__label' }, props.label, props.required ? h('span', { className: 'aura-field__req', 'aria-hidden': true }, ' *') : null) : null,
    h('div', { className: cx('aura-radio-group__list', props.orientation === 'horizontal' && 'is-horizontal') },
      (props.options || []).map(function (o) {
        var v = typeof o === 'object' ? o : { value: o, label: o };
        return h('label', { key: v.value, className: cx('aura-choice', v.disabled && 'is-disabled') },
          h('input', { type: 'radio', className: 'aura-radio', name: name, value: v.value, disabled: v.disabled,
            checked: st[0] === v.value, onChange: function () { st[1](v.value); } }),
          h('span', { className: 'aura-choice__text' },
            h('span', { className: 'aura-choice__label' }, v.label),
            v.description ? h('span', { className: 'aura-choice__desc' }, v.description) : null));
      })),
    props.error ? h('p', { className: 'aura-field__error', id: id + '-error' }, h(Icon, { name: 'circle-alert', size: 14 }), props.error)
      : props.hint ? h('p', { className: 'aura-field__hint', id: id + '-hint' }, props.hint) : null);
});

export const Switch = React.forwardRef(function Switch(props, ref) {
  var auto = uid(), id = props.id || auto;
  var st = useMaybeControlled(props.checked, !!props.defaultChecked, props.onChange);
  var on = !!st[0];
  return h('div', { className: cx('aura-switch-row', props.disabled && 'is-disabled', props.className) },
    h('button', { ref: ref, type: 'button', role: 'switch', id: id, 'aria-checked': on, disabled: props.disabled,
      'aria-labelledby': props.label ? id + '-label' : undefined, 'aria-label': props.label ? undefined : props['aria-label'],
      'aria-describedby': props.description ? id + '-desc' : undefined,
      className: cx('aura-switch', on && 'is-on'), onClick: function () { st[1](!on); } },
      h('span', { className: 'aura-switch__thumb' })),
    props.label ? h('span', { className: 'aura-choice__text' },
      h('label', { className: 'aura-choice__label', id: id + '-label', htmlFor: id }, props.label),
      props.description ? h('span', { className: 'aura-choice__desc', id: id + '-desc' }, props.description) : null) : null);
});

/* ---------- Feedback ---------- */
