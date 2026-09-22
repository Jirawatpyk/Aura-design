import * as React from 'react';
import { createPortal } from 'react-dom';
import { cx, uid, useMaybeControlled, useMounted, useIsoLayoutEffect, useMergedRef } from './internal.js';
import { useStrings } from './locale.js';
import { Icon } from './Icon.js';
import { Field } from './forms.js';
import type { TimePickerProps } from './types.js';

type PopoverPos = { left: number; width: number; top?: number; bottom?: number; maxHeight: number };
const h = React.createElement;

function pad(n: number): string { return (n < 10 ? '0' : '') + n; }
function toMin(t: string | null | undefined): number | null { var m = /^(\d{2}):(\d{2})$/.exec(t || ''); return m ? +m[1] * 60 + +m[2] : null; }
function fromMin(n: number): string { return pad(Math.floor(n / 60)) + ':' + pad(n % 60); }

/** Parse typed time: 9 · 09 · 930 · 0930 · 9:30 · 9.30 · 09.30 น. · 9:30 pm → "HH:mm" (24-hour) or null. */
export function parseTime(text: string | null | undefined): string | null {
  var s = String(text || '').trim().toLowerCase().replace(/\s*(น\.?|นาฬิกา)$/, '').trim();
  var pm = /\s*(pm|p\.m\.)$/.test(s), am = /\s*(am|a\.m\.)$/.test(s);
  s = s.replace(/\s*(am|pm|a\.m\.|p\.m\.)$/, '');
  var m = /^(\d{1,2})(?:[:.](\d{2}))?$/.exec(s) || /^(\d{1,2})(\d{2})$/.exec(s);
  if (!m) return null;
  var hh = +m[1], mm = m[2] ? +m[2] : 0;
  if (pm && hh < 12) hh += 12;
  if (am && hh === 12) hh = 0;
  if (hh > 23 || mm > 59) return null;
  return pad(hh) + ':' + pad(mm);
}

/* TimePicker — a time field with a list of slots (step minutes between min and max). Value "HH:mm", 24-hour.
 * People can type any time (9, 930, 9.30); the list is a shortcut, not a limit — except min/max and isTimeDisabled. */
export const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(function TimePicker(props, ref) {
  var t = useStrings();
  var auto = uid(), id = props.id || auto, listId = id + '-list';
  var st = useMaybeControlled<string | null>(props.value, props.defaultValue == null ? null : props.defaultValue, props.onChange);
  var value = st[0];
  var step = props.step || 30, lo = toMin(props.min) != null ? toMin(props.min) as number : 0, hi = toMin(props.max) != null ? toMin(props.max) as number : 24 * 60 - 1;
  var slots = React.useMemo(function () {
    var out: string[] = [];
    for (var m = lo; m <= hi; m += step) out.push(fromMin(m));
    return out;
  }, [lo, hi, step]);
  function blocked(v: string): boolean | undefined { var n = toMin(v); return n == null || n < lo || n > hi || (props.isTimeDisabled && props.isTimeDisabled(v)); }
  var openState = React.useState(false), open = openState[0], setOpen = openState[1];
  var editState = React.useState<string | null>(null), editing = editState[0], setEditing = editState[1];
  var aState = React.useState(0), active = aState[0], setActive = aState[1];
  var errState = React.useState<React.ReactNode>(null);
  var pos = React.useState<PopoverPos | null>(null);
  var boxRef = React.useRef<HTMLDivElement | null>(null), inputRef = React.useRef<HTMLInputElement | null>(null), listRef = React.useRef<HTMLDivElement | null>(null), inputMerged = useMergedRef(ref, inputRef);
  var mounted = useMounted();

  function nearest(v: string): number {
    var n = toMin(v); if (n == null) return 0;
    var best = 0; slots.forEach(function (s: string, i: number) { if (Math.abs(toMin(s)! - n!) < Math.abs(toMin(slots[best])! - n!)) best = i; });
    return best;
  }
  function place() {
    if (!boxRef.current) return;
    var r = boxRef.current.getBoundingClientRect(), below = window.innerHeight - r.bottom - 8, up = below < 200 && r.top > below;
    pos[1]({ left: r.left, width: Math.max(r.width, 160), top: up ? undefined : r.bottom + 4, bottom: up ? window.innerHeight - r.top + 4 : undefined, maxHeight: Math.min(280, (up ? r.top : below) - 8) });
  }
  useIsoLayoutEffect(function () { if (open) place(); }, [open]);
  React.useEffect(function () {
    if (!open) return;
    function outside(e: Event) { if ((boxRef.current && boxRef.current.contains(e.target as Node)) || (listRef.current && listRef.current.contains(e.target as Node))) return; setOpen(false); }
    function onScroll(e: Event) { if (!listRef.current || !listRef.current.contains(e.target as Node)) place(); }
    document.addEventListener('pointerdown', outside, true); window.addEventListener('scroll', onScroll, true); window.addEventListener('resize', place);
    return function () { document.removeEventListener('pointerdown', outside, true); window.removeEventListener('scroll', onScroll, true); window.removeEventListener('resize', place); };
  }, [open]);
  React.useEffect(function () {
    if (!open || !listRef.current) return;
    var el = listRef.current.querySelector<HTMLElement>('[data-idx="' + active + '"]');
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  function show() { if (open || props.disabled || props.readOnly) return; setActive(nearest(value || props.suggest || fromMin(lo))); setOpen(true); }
  function commit(v: string | null): boolean {
    if (v == null) { errState[1](null); st[1](null); return true; }
    if (blocked(v)) { errState[1](t.timeOutOfRange(fromMin(lo), fromMin(hi))); return false; }
    errState[1](null); st[1](v); return true;
  }
  function choose(i: number) { var v = slots[i]; if (!v || blocked(v)) return; commit(v); setEditing(null); setOpen(false); if (inputRef.current) inputRef.current.focus(); }
  function commitTyped() {
    if (editing == null) return;
    var txt = editing.trim();
    if (!txt) commit(null);
    else { var v = parseTime(txt); if (v) commit(v); else errState[1](t.timeInvalid); }
    setEditing(null);
  }
  function move(d: number) {
    var i = active;
    for (var k = 0; k < slots.length; k++) { i = Math.min(slots.length - 1, Math.max(0, i + d)); if (!blocked(slots[i])) break; }
    setActive(i);
  }
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    var k = e.key;
    if (k === 'ArrowDown') { e.preventDefault(); if (!open) show(); else move(1); }
    else if (k === 'ArrowUp') { e.preventDefault(); if (!open) show(); else move(-1); }
    else if (k === 'Home' && open) { e.preventDefault(); setActive(0); }
    else if (k === 'End' && open) { e.preventDefault(); setActive(slots.length - 1); }
    else if (k === 'PageDown' && open) { e.preventDefault(); move(Math.max(1, Math.round(60 / step))); }
    else if (k === 'PageUp' && open) { e.preventDefault(); move(-Math.max(1, Math.round(60 / step))); }
    else if (k === 'Enter') {
      if (editing != null) { e.preventDefault(); commitTyped(); setOpen(false); }
      else if (open) { e.preventDefault(); choose(active); }
    }
    else if (k === 'Escape') { if (open) { e.preventDefault(); e.stopPropagation(); setOpen(false); setEditing(null); } }
    else if (k === 'Tab') { if (open) setOpen(false); }
  }
  var error = errState[0] || props.error;  // the message about what was just typed wins
  var list = open && mounted && pos[0] ? createPortal(
    h('div', { ref: listRef, className: 'aura-combo__popover aura-time__popover', style: pos[0] },
      h('ul', { id: listId, role: 'listbox', 'aria-label': props.label, className: 'aura-combo__list' },
        slots.map(function (s: string, i: number) {
          var dis = blocked(s), sel = s === value;
          return h('li', { key: s, id: id + '-opt-' + i, role: 'option', 'data-idx': i, 'aria-selected': sel, 'aria-disabled': dis || undefined,
            className: cx('aura-combo__option aura-time__option', i === active && 'is-active', sel && 'is-selected', dis && 'is-disabled'),
            onPointerDown: function (e: React.PointerEvent) { e.preventDefault(); }, onClick: function () { choose(i); },
            onPointerMove: function () { if (active !== i) setActive(i); } },
            h('span', { className: 'aura-combo__label' }, s),
            sel ? h(Icon, { name: 'check', className: 'aura-combo__check' }) : null);
        }))),
    document.body) : null;

  return h(Field, { id: id, label: props.label, hint: props.hint, error: error, required: props.required, optional: props.optional, disabled: props.disabled, className: props.className },
    h('div', { ref: boxRef, className: cx('aura-input aura-combo aura-time has-icon', open && 'is-open') },
      h(Icon, { name: 'clock', className: 'aura-input__icon' }),
      h('input', {
        ref: inputMerged, id: id, type: 'text', role: 'combobox', inputMode: 'numeric', autoComplete: 'off', className: 'aura-input__control',
        'aria-expanded': open, 'aria-controls': listId, 'aria-autocomplete': 'none',
        'aria-activedescendant': open && editing == null ? id + '-opt-' + active : undefined,
        'aria-invalid': error ? true : undefined, 'aria-describedby': error ? id + '-error' : props.hint ? id + '-hint' : undefined,
        placeholder: props.placeholder || t.timePlaceholder, disabled: props.disabled, readOnly: props.readOnly, required: props.required, name: props.name,
        value: editing != null ? editing : value || '',
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
          setEditing(e.target.value);
          var v = parseTime(e.target.value);
          if (v) { if (!open) show(); setActive(nearest(v)); }
        },
        onClick: show, onKeyDown: onKeyDown,
        onBlur: function () { setTimeout(function () { if (listRef.current && listRef.current.contains(document.activeElement)) return; commitTyped(); setOpen(false); }, 0); }
      }),
      props.clearable !== false && value != null && !props.disabled ? h('button', {
        type: 'button', className: 'aura-combo__clear', 'aria-label': t.clear(props.label), tabIndex: -1,
        onClick: function () { commit(null); setEditing(null); if (inputRef.current) inputRef.current.focus(); }
      }, h(Icon, { name: 'x' })) : null,
      h('button', { type: 'button', tabIndex: -1, 'aria-hidden': true, className: 'aura-combo__toggle',
        onPointerDown: function (e: React.PointerEvent) { e.preventDefault(); }, onClick: function () { if (open) setOpen(false); else { show(); inputRef.current && inputRef.current.focus(); } } },
        h(Icon, { name: 'chevron-down' }))),
    list);
});
