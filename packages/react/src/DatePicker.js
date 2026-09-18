import * as React from 'react';
import { useAuraLocale } from './locale.js';
import { createPortal } from 'react-dom';
import { cx, uid, useMaybeControlled, useMounted, useIsoLayoutEffect, trapTab, useMergedRef } from './internal.js';
import { Icon } from './Icon.js';
import { IconButton } from './IconButton.js';
import { Field } from './forms.js';
const h = React.createElement;

/* ---------- date helpers: values are ISO 'YYYY-MM-DD' strings (Gregorian), shown in the chosen calendar ---------- */
var ERA = /^พ\.ศ\.\s?|\s?(BE|พ\.ศ\.)$/g;
var pad = function (n) { return (n < 10 ? '0' : '') + n; };
export function toISO(d) { return d ? d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) : null; }
export function fromISO(s) {
  if (!s) return null;
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
}
function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
function addMonths(d, n) {
  var t = new Date(d.getFullYear(), d.getMonth() + n, 1);
  var last = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
  return new Date(t.getFullYear(), t.getMonth(), Math.min(d.getDate(), last));
}
function same(a, b) { return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
function localeTag(locale, calendar) { return (locale === 'en' ? 'en-GB' : 'th-TH') + '-u-ca-' + (calendar === 'gregory' ? 'gregory' : 'buddhist'); }
var fmtCache = {};
var PRESETS = { short: { day: 'numeric', month: 'short', year: 'numeric' }, long: { day: 'numeric', month: 'long', year: 'numeric' }, numeric: { day: '2-digit', month: '2-digit', year: 'numeric' } };
function fmt(tag, opts, d) {
  var k = tag + JSON.stringify(opts);
  if (!fmtCache[k]) fmtCache[k] = new Intl.DateTimeFormat(tag, opts);
  return fmtCache[k].format(d);
}
/** Format an ISO date for display, e.g. "18 ก.ย. 2569" (th, Buddhist) or "18 Sept 2026" (en, Gregorian). */
export function formatDate(iso, opts) {
  var o = opts || {}, d = fromISO(iso);
  if (!d) return '';
  var f = typeof o.format === 'object' ? o.format : PRESETS[o.format || 'short'];
  return fmt(localeTag(o.locale, o.calendar), f, d)
    .replace(ERA, '');
}
var MONTHS = null;
function monthIndex(word) {
  if (!MONTHS) {
    MONTHS = {};
    ['th-TH', 'en-GB'].forEach(function (tag) { ['short', 'long'].forEach(function (w) {
      for (var i = 0; i < 12; i++) {
        var n = new Intl.DateTimeFormat(tag, { month: w }).format(new Date(2020, i, 1)).toLowerCase().replace(/\.$/, '');
        MONTHS[n] = i; if (/^[a-z]/.test(n)) MONTHS[n.slice(0, 3)] = i;
      }
    }); });
  }
  var k = word.toLowerCase().replace(/\.$/, '');
  return MONTHS[k] != null ? MONTHS[k] : -1;
}
/** Parse typed text: dd/mm/yyyy (Buddhist years ≥ 2400 are converted), d-m-yyyy, d.m.yyyy, yyyy-mm-dd or '18 ก.ย. 2569' / '18 Sep 2026'. */
export function parseDate(text) {
  var s = String(text || '').trim();
  var m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s), y, mo, d;
  if (m) { y = +m[1]; mo = +m[2]; d = +m[3]; }
  else if ((m = /^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/.exec(s))) { d = +m[1]; mo = +m[2]; y = +m[3]; }
  else if ((m = /^(\d{1,2})\s+(\S+)\s+(\d{4})$/.exec(s.replace(ERA, '').trim())) && monthIndex(m[2]) >= 0) { d = +m[1]; mo = monthIndex(m[2]) + 1; y = +m[3]; }
  else return null;
  if (y >= 2400) y -= 543;
  var dt = new Date(y, mo - 1, d);
  return dt.getMonth() === mo - 1 && dt.getDate() === d ? toISO(dt) : null;
}

/* ---------- Calendar ---------- */
export const Calendar = React.forwardRef(function Calendar(props, ref) {
  var ctx = useAuraLocale(), locale = props.locale || ctx.locale || 'th', calendar = props.calendar || ctx.calendar || 'buddhist', tag = localeTag(locale, calendar);
  var weekStart = props.weekStartsOn == null ? 0 : props.weekStartsOn;
  var today = new Date(); today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  var min = fromISO(props.min), max = fromISO(props.max);
  var start = fromISO(props.start), end = fromISO(props.end);
  var focusState = React.useState(fromISO(props.focus) || start || today);
  var focusDate = focusState[0], setFocus = focusState[1];
  var viewState = React.useState('days'), view = viewState[0], setView = viewState[1];
  var hoverState = React.useState(null);
  var gridRef = React.useRef(null), gridMerged = useMergedRef(ref, gridRef), moved = React.useRef(false);
  var th = locale !== 'en';

  function disabled(d) {
    return (min && d < min) || (max && d > max) || (props.isDateDisabled && props.isDateDisabled(toISO(d)));
  }
  React.useEffect(function () {
    if (!moved.current) return;
    moved.current = false;
    var el = gridRef.current && gridRef.current.querySelector('[data-date="' + toISO(focusDate) + '"]');
    if (el) el.focus();
  });
  React.useEffect(function () {
    if (props.autoFocus === false) return;
    var el = gridRef.current && gridRef.current.querySelector('[tabindex="0"]');
    if (el) el.focus();
  }, []);
  function move(d) { moved.current = true; setFocus(d); }

  var first = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
  var lead = (first.getDay() - weekStart + 7) % 7;
  var gridStart = addDays(first, -lead);
  var days = [];
  for (var i = 0; i < 42; i++) days.push(addDays(gridStart, i));
  var weeks = [];
  for (var w = 0; w < 6; w++) weeks.push(days.slice(w * 7, w * 7 + 7));
  if (weeks[5][0].getMonth() !== focusDate.getMonth()) weeks.pop();

  function onKey(e, d) {
    var k = e.key, n = null;
    if (k === 'ArrowLeft') n = addDays(d, -1);
    else if (k === 'ArrowRight') n = addDays(d, 1);
    else if (k === 'ArrowUp') n = addDays(d, -7);
    else if (k === 'ArrowDown') n = addDays(d, 7);
    else if (k === 'Home') n = addDays(d, -((d.getDay() - weekStart + 7) % 7));
    else if (k === 'End') n = addDays(d, 6 - ((d.getDay() - weekStart + 7) % 7));
    else if (k === 'PageUp') n = addMonths(d, e.shiftKey ? -12 : -1);
    else if (k === 'PageDown') n = addMonths(d, e.shiftKey ? 12 : 1);
    else if (k === 'Enter' || k === ' ') { e.preventDefault(); if (!disabled(d)) props.onSelect(toISO(d)); return; }
    if (n) { e.preventDefault(); move(n); }
  }
  var hover = hoverState[0];
  var rangeEnd = end || (props.range && start && hover ? hover : null);
  function inRange(d) {
    if (!props.range || !start || !rangeEnd) return false;
    var a = start < rangeEnd ? start : rangeEnd, b = start < rangeEnd ? rangeEnd : start;
    return d > a && d < b;
  }
  var monthTitle = fmt(tag, { month: 'long', year: 'numeric' }, focusDate).replace(ERA, '');
  var weekdayNames = weeks[0].map(function (d) { return { short: fmt(tag, { weekday: th ? 'narrow' : 'short' }, d), long: fmt(tag, { weekday: 'long' }, d) }; });

  if (view === 'years') {
    var yr = focusDate.getFullYear(), base = yr - (yr % 12);
    var years = []; for (var y = base; y < base + 12; y++) years.push(y);
    return h('div', { className: 'aura-cal', ref: gridMerged },
      h('div', { className: 'aura-cal__head' },
        h(IconButton, { icon: 'chevron-left', label: th ? 'ช่วงปีก่อนหน้า' : 'Previous years', onClick: function () { setFocus(new Date(yr - 12, focusDate.getMonth(), 1)); } }),
        h('button', { type: 'button', className: 'aura-cal__title', onClick: function () { setView('days'); } },
          fmt(tag, { year: 'numeric' }, new Date(base, 0, 1)).replace(ERA, '') + ' – ' + fmt(tag, { year: 'numeric' }, new Date(base + 11, 0, 1)).replace(ERA, '')),
        h(IconButton, { icon: 'chevron-right', label: th ? 'ช่วงปีถัดไป' : 'Next years', onClick: function () { setFocus(new Date(yr + 12, focusDate.getMonth(), 1)); } })),
      h('div', { className: 'aura-cal__years' }, years.map(function (y) {
        var d = new Date(y, focusDate.getMonth(), 1);
        return h('button', { key: y, type: 'button', tabIndex: y === yr ? 0 : -1, className: cx('aura-cal__year', y === yr && 'is-selected'),
          onClick: function () { setFocus(new Date(y, focusDate.getMonth(), Math.min(focusDate.getDate(), 28))); setView('days'); moved.current = true; } },
          fmt(tag, { year: 'numeric' }, d).replace(ERA, ''));
      })));
  }

  return h('div', { className: 'aura-cal', ref: gridMerged },
    h('div', { className: 'aura-cal__head' },
      h(IconButton, { icon: 'chevron-left', label: th ? 'เดือนก่อนหน้า' : 'Previous month', onClick: function () { setFocus(addMonths(focusDate, -1)); } }),
      h('button', { type: 'button', className: 'aura-cal__title', 'aria-live': 'polite', onClick: function () { setView('years'); } }, monthTitle,
        h(Icon, { name: 'chevron-down', size: 14 })),
      h(IconButton, { icon: 'chevron-right', label: th ? 'เดือนถัดไป' : 'Next month', onClick: function () { setFocus(addMonths(focusDate, 1)); } })),
    h('table', { role: 'grid', className: 'aura-cal__grid', 'aria-label': monthTitle },
      h('thead', null, h('tr', null, weekdayNames.map(function (n, i) {
        return h('th', { key: i, scope: 'col', abbr: n.long }, h('span', { 'aria-hidden': true }, n.short));
      }))),
      h('tbody', { onMouseLeave: function () { hoverState[1](null); } }, weeks.map(function (wk, wi) {
        return h('tr', { key: wi }, wk.map(function (d) {
          var iso = toISO(d), out = d.getMonth() !== focusDate.getMonth(), dis = disabled(d);
          var isStart = same(d, start), isEnd = same(d, end) || (!end && props.range && same(d, hover) && start);
          var sel = isStart || same(d, end);
          return h('td', { key: iso, role: 'gridcell', 'aria-selected': sel || undefined,
              className: cx(inRange(d) && 'is-in-range', props.range && isStart && rangeEnd && 'is-range-start', props.range && isEnd && start && 'is-range-end') },
            h('button', {
              type: 'button', 'data-date': iso, tabIndex: same(d, focusDate) ? 0 : -1, disabled: dis,
              'aria-label': fmt(tag, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }, d),
              'aria-current': same(d, today) ? 'date' : undefined, 'aria-pressed': sel || undefined,
              className: cx('aura-cal__day', out && 'is-outside', sel && 'is-selected', same(d, today) && 'is-today'),
              onClick: function () { setFocus(d); props.onSelect(iso); },
              onKeyDown: function (e) { onKey(e, d); },
              onMouseEnter: function () { if (props.range) hoverState[1](d); }
            }, d.getDate()));
        }));
      }))),
    props.footer === false ? null : h('div', { className: 'aura-cal__foot' },
      h('button', { type: 'button', className: 'aura-cal__link', disabled: disabled(today), onClick: function () { move(today); props.onSelect(toISO(today)); } }, th ? 'วันนี้' : 'Today'),
      props.onClear ? h('button', { type: 'button', className: 'aura-cal__link', onClick: props.onClear }, th ? 'ล้าง' : 'Clear') : null));
});

/* ---------- popover field shared by DatePicker and DateRangePicker ---------- */
function useCalendarPopover(boxRef) {
  var openState = React.useState(false), open = openState[0], setOpen = openState[1];
  var pos = React.useState(null), popRef = React.useRef(null), mounted = useMounted();
  function place() {
    if (!boxRef.current) return;
    var r = boxRef.current.getBoundingClientRect(), H = 380;
    var up = window.innerHeight - r.bottom < H && r.top > H;
    var left = Math.max(8, Math.min(r.left, window.innerWidth - 320 - 8));
    pos[1](up ? { left: left, bottom: window.innerHeight - r.top + 4 } : { left: left, top: r.bottom + 4 });
  }
  useIsoLayoutEffect(function () { if (open) place(); }, [open]);
  React.useEffect(function () {
    if (!open) return;
    function outside(e) {
      if (boxRef.current && boxRef.current.contains(e.target)) return;
      if (popRef.current && popRef.current.contains(e.target)) return;
      setOpen(false);
    }
    document.addEventListener('pointerdown', outside, true);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return function () { document.removeEventListener('pointerdown', outside, true); window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); };
  }, [open]);
  return { open: open, setOpen: setOpen, pos: pos[0], popRef: popRef, mounted: mounted };
}

function DateField(props) {
  /* props: id, label…, display, placeholder, onCommit(text), onToggle, open, inputRef, boxRef, disabled, clearable, onClear, dialogId */
  var editState = React.useState(null), editing = editState[0], setEditing = editState[1];
  return h(Field, { id: props.id, label: props.label, hint: props.hint, error: props.error, required: props.required, optional: props.optional, disabled: props.disabled, className: props.className },
    h('div', { ref: props.boxRef, className: cx('aura-input aura-date', props.open && 'is-open') },
      h('input', {
        ref: props.inputRef, id: props.id, type: 'text', inputMode: 'numeric', autoComplete: 'off', className: 'aura-input__control',
        value: editing != null ? editing : props.display, placeholder: props.placeholder, disabled: props.disabled, required: props.required, name: props.name,
        'aria-invalid': props.error ? true : undefined, 'aria-describedby': props.error ? props.id + '-error' : props.hint ? props.id + '-hint' : undefined,
        onChange: function (e) { setEditing(e.target.value); },
        onBlur: function () { if (editing != null) { props.onCommit(editing); setEditing(null); } },
        onKeyDown: function (e) {
          if (e.key === 'Enter' && editing != null) { e.preventDefault(); props.onCommit(editing); setEditing(null); }
          else if (e.key === 'ArrowDown' && (e.altKey || editing == null)) { e.preventDefault(); props.onToggle(true); }
          else if (e.key === 'Escape' && props.open) { e.preventDefault(); props.onToggle(false); }
        }
      }),
      props.clearable !== false && props.hasValue && !props.disabled ? h('button', { type: 'button', tabIndex: -1, className: 'aura-combo__clear', 'aria-label': props.clearLabel, onClick: props.onClear }, h(Icon, { name: 'x' })) : null,
      h('button', { type: 'button', className: 'aura-date__toggle', disabled: props.disabled, 'aria-label': props.toggleLabel, 'aria-haspopup': 'dialog',
        'aria-expanded': props.open, 'aria-controls': props.open ? props.dialogId : undefined,
        onClick: function () { props.onToggle(!props.open); } }, h(Icon, { name: 'calendar' }))));
}

/* DatePicker — one date, typed (dd/mm/yyyy, Buddhist or Christian year) or picked from a calendar.
 * Shows Thai months and Buddhist-era years by default (locale 'th', calendar 'buddhist'). */
export const DatePicker = React.forwardRef(function DatePicker(props, ref) {
  var auto = uid(), id = props.id || auto, dialogId = id + '-cal';
  var ctx = useAuraLocale(), locale = props.locale || ctx.locale || 'th', calendar = props.calendar || ctx.calendar || 'buddhist', th = locale !== 'en';
  var st = useMaybeControlled(props.value, props.defaultValue == null ? null : props.defaultValue, props.onChange);
  var boxRef = React.useRef(null), inputRef = React.useRef(null), inputMerged = useMergedRef(ref, inputRef);
  var pop = useCalendarPopover(boxRef);
  function commit(text) {
    if (!text.trim()) { st[1](null); return; }
    var iso = parseDate(text);
    if (iso) st[1](iso);
  }
  function close() { pop.setOpen(false); if (inputRef.current) inputRef.current.focus(); }
  var cal = pop.open && pop.mounted && pop.pos ? createPortal(
    h('div', { ref: pop.popRef, id: dialogId, role: 'dialog', 'aria-modal': false, 'aria-label': props.label || (th ? 'เลือกวันที่' : 'Choose date'),
        className: 'aura-cal__popover', style: pop.pos, onKeyDown: function (e) { if (e.key === 'Escape') { e.stopPropagation(); close(); } else trapTab(e, pop.popRef.current); } },
      h(Calendar, { locale: locale, calendar: calendar, weekStartsOn: props.weekStartsOn, min: props.min, max: props.max, isDateDisabled: props.isDateDisabled,
        start: st[0], focus: st[0], onSelect: function (iso) { st[1](iso); close(); } })),
    document.body) : null;
  return h(React.Fragment, null,
    h(DateField, {
      id: id, dialogId: dialogId, label: props.label, hint: props.hint, error: props.error, required: props.required, optional: props.optional,
      disabled: props.disabled, className: props.className, name: props.name, boxRef: boxRef, inputRef: inputMerged, open: pop.open,
      display: formatDate(st[0], { locale: locale, calendar: calendar }),
      placeholder: props.placeholder || (th ? 'วว/ดด/ปปปป' : 'dd/mm/yyyy'),
      hasValue: st[0] != null, clearable: props.clearable, onClear: function () { st[1](null); inputRef.current && inputRef.current.focus(); },
      clearLabel: th ? 'ล้างวันที่' : 'Clear date', toggleLabel: th ? 'เปิดปฏิทิน' : 'Open calendar',
      onCommit: commit, onToggle: function (o) { pop.setOpen(o); if (!o && inputRef.current) inputRef.current.focus(); }
    }), cal);
});

/* DateRangePicker — a start and end date chosen on one calendar. value = { start, end } (ISO strings). */
export const DateRangePicker = React.forwardRef(function DateRangePicker(props, ref) {
  var auto = uid(), id = props.id || auto, dialogId = id + '-cal';
  var ctx = useAuraLocale(), locale = props.locale || ctx.locale || 'th', calendar = props.calendar || ctx.calendar || 'buddhist', th = locale !== 'en';
  var st = useMaybeControlled(props.value, props.defaultValue || { start: null, end: null }, props.onChange);
  var v = st[0] || { start: null, end: null };
  var draft = React.useState(null); /* start picked, waiting for end */
  var boxRef = React.useRef(null), inputRef = React.useRef(null), inputMerged = useMergedRef(ref, inputRef);
  var pop = useCalendarPopover(boxRef);
  var o = { locale: locale, calendar: calendar };
  function show(r) {
    if (!r.start) return '';
    if (!r.end) return formatDate(r.start, o) + ' –';
    return formatDate(r.start, o) + ' – ' + formatDate(r.end, o);
  }
  function commit(text) {
    var parts = String(text).split(/\s[–-]\s|\s*–\s*/);
    if (!text.trim()) { st[1]({ start: null, end: null }); return; }
    var a = parseDate(parts[0]), b = parseDate(parts[1] || '');
    if (a && b) st[1](a <= b ? { start: a, end: b } : { start: b, end: a });
  }
  function close() { pop.setOpen(false); draft[1](null); if (inputRef.current) inputRef.current.focus(); }
  function pick(iso) {
    if (!draft[0]) { draft[1](iso); return; }
    var a = draft[0], b = iso;
    st[1](a <= b ? { start: a, end: b } : { start: b, end: a });
    close();
  }
  var cal = pop.open && pop.mounted && pop.pos ? createPortal(
    h('div', { ref: pop.popRef, id: dialogId, role: 'dialog', 'aria-modal': false, 'aria-label': props.label || (th ? 'เลือกช่วงวันที่' : 'Choose dates'),
        className: 'aura-cal__popover', style: pop.pos, onKeyDown: function (e) { if (e.key === 'Escape') { e.stopPropagation(); close(); } else trapTab(e, pop.popRef.current); } },
      h('p', { className: 'aura-cal__hint', 'aria-live': 'polite' }, draft[0] ? (th ? 'เลือกวันสิ้นสุด' : 'Choose the end date') : (th ? 'เลือกวันเริ่มต้น' : 'Choose the start date')),
      h(Calendar, { range: true, locale: locale, calendar: calendar, weekStartsOn: props.weekStartsOn, min: props.min, max: props.max, isDateDisabled: props.isDateDisabled,
        start: draft[0] || v.start, end: draft[0] ? null : v.end, focus: draft[0] || v.start, onSelect: pick })),
    document.body) : null;
  return h(React.Fragment, null,
    h(DateField, {
      id: id, dialogId: dialogId, label: props.label, hint: props.hint, error: props.error, required: props.required, optional: props.optional,
      disabled: props.disabled, className: props.className, name: props.name, boxRef: boxRef, inputRef: inputMerged, open: pop.open,
      display: show(v), placeholder: props.placeholder || (th ? 'วว/ดด/ปปปป – วว/ดด/ปปปป' : 'dd/mm/yyyy – dd/mm/yyyy'),
      hasValue: v.start != null, clearable: props.clearable, onClear: function () { st[1]({ start: null, end: null }); inputRef.current && inputRef.current.focus(); },
      clearLabel: th ? 'ล้างช่วงวันที่' : 'Clear dates', toggleLabel: th ? 'เปิดปฏิทิน' : 'Open calendar',
      onCommit: commit, onToggle: function (op) { pop.setOpen(op); draft[1](null); if (!op && inputRef.current) inputRef.current.focus(); }
    }), cal);
});
