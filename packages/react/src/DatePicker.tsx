import * as React from 'react';
import { useAuraLocale } from './locale.js';
import { createPortal } from 'react-dom';
import { cx, uid, useMaybeControlled, useMounted, useIsoLayoutEffect, trapTab, useMergedRef } from './internal.js';
import { Icon } from './Icon.js';
import { IconButton } from './IconButton.js';
import { Field } from './Field.js';
import type {
  CalendarProps,
  DateDisplayOptions,
  DatePickerProps,
  DateRange,
  DateRangePickerProps,
  ISODate,
} from './types.js';

type PopoverPos = { left: number; top?: number | undefined; bottom?: number | undefined };
import {
  ERA,
  addDays,
  addMonths,
  dateText,
  defaultCalendar,
  fmt,
  formatDate as formatDateBase,
  fromISO,
  localeTag,
  parseDate,
  same,
  toISO,
  todayIn,
} from './dates.js';
import type { FormatDateOptions } from './dates.js';
export type { FormatDateOptions } from './dates.js';
export { formatDate, parseDate } from './dates.js';

/** formatDate bound to the nearest AuraProvider: its locale and calendar (English, Gregorian without one).
 * Options you pass still win. Use it in components; plain formatDate() stays for code outside React. */
export function useFormatDate(): (iso: ISODate | null | undefined, opts?: FormatDateOptions) => string {
  const ctx = useAuraLocale(),
    locale = ctx.locale || 'en',
    calendar = ctx.calendar;
  return React.useCallback(
    function (iso: ISODate | null | undefined, opts?: FormatDateOptions): string {
      const o: FormatDateOptions = opts || {},
        loc = o.locale || locale;
      return formatDateBase(
        iso,
        Object.assign({}, o, {
          locale: loc,
          calendar: o.calendar || (o.locale ? undefined : calendar) || defaultCalendar(loc),
        }),
      );
    },
    [locale, calendar],
  );
}
/* Whether a date may be chosen: inside min/max ('today' resolved in the time zone) and not disabled. Shared by
 * the calendar grid and typed input (5.1.1: typed dates skipped these checks). */
function allowedDate(
  iso: ISODate,
  o: {
    min?: string | null | undefined;
    max?: string | null | undefined;
    today?: string | null | undefined;
    timeZone?: string | null | undefined;
    isDateDisabled?: ((iso: ISODate) => boolean) | undefined;
  },
): boolean {
  const t = o.min === 'today' || o.max === 'today' ? (o.today && fromISO(o.today) ? o.today : todayIn(o.timeZone)) : '';
  const lo = o.min === 'today' ? t : o.min,
    hi = o.max === 'today' ? t : o.max;
  if (lo && fromISO(lo) && iso < lo) return false;
  if (hi && fromISO(hi) && iso > hi) return false;
  return !(o.isDateDisabled && o.isDateDisabled(iso));
}
export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(function Calendar(props, ref) {
  const ctx = useAuraLocale(),
    locale = props.locale || ctx.locale || 'en',
    calendar = props.calendar || ctx.calendar || defaultCalendar(locale),
    tag = localeTag(locale, calendar);
  const weekStart = props.weekStartsOn == null ? (locale === 'sv' ? 1 : 0) : props.weekStartsOn;
  /* Today in the given time zone (prop, else the provider's, else the browser's), or as given (4.19). */
  /* A malformed `today` is ignored rather than crashing the calendar (5.0.1). */
  const given = props.today && fromISO(props.today) ? props.today : null,
    zone = props.timeZone || ctx.timeZone;
  const todayISO = given || todayIn(zone);
  const today = fromISO(todayISO) as Date;
  /* 5.1.1: a server-rendered calendar without `today` may have been drawn on the server's date (another time zone).
   * Hydration keeps those attributes, so the grid is rebuilt once after hydration from the browser's date. Calendars
   * created in the browser (every DatePicker popover) are mounted from the start and never rebuilt. */
  const mounted = useMounted(),
    gridKey = given || mounted ? 'client' : 'server';
  const min = fromISO(props.min === 'today' ? todayISO : props.min),
    max = fromISO(props.max === 'today' ? todayISO : props.max);
  const start = fromISO(props.start),
    end = fromISO(props.end);
  function disabledAt(d: Date): boolean {
    return !!(
      (min && d < min) ||
      (max && d > max) ||
      (props.isDateDisabled && props.isDateDisabled(toISO(d) as ISODate))
    );
  }
  function select(iso: ISODate | null) {
    if (props.onSelect) props.onSelect(iso);
  }
  /* Open on the value, else today — moved to the nearest day that can be chosen, so the grid always has a
   * reachable tab stop (5.1.1). */
  const focusState = React.useState(function () {
    const d0 = fromISO(props.focus) || start || today;
    if (!disabledAt(d0)) return d0;
    for (let i = 1; i <= 366; i++) {
      if (!disabledAt(addDays(d0, i))) return addDays(d0, i);
      if (!disabledAt(addDays(d0, -i))) return addDays(d0, -i);
    }
    return d0;
  });
  const focusDate = focusState[0],
    setFocus = focusState[1];
  const viewState = React.useState<'days' | 'years'>('days'),
    view = viewState[0],
    setView = viewState[1];
  const hoverState = React.useState<Date | null>(null);
  const gridRef = React.useRef<HTMLDivElement | null>(null),
    gridMerged = useMergedRef(ref, gridRef),
    moved = React.useRef(false);
  const th = locale === 'th';
  const dt = dateText(locale);

  function disabled(d: Date): boolean {
    return disabledAt(d);
  }
  React.useEffect(function () {
    if (!moved.current) return;
    moved.current = false;
    const el = gridRef.current && gridRef.current.querySelector<HTMLElement>('[data-date="' + toISO(focusDate) + '"]');
    if (el) el.focus();
  });
  React.useEffect(
    function () {
      if (props.autoFocus === false) return;
      const el = gridRef.current && gridRef.current.querySelector<HTMLElement>('[tabindex="0"]');
      if (el) el.focus();
    },
    [gridKey],
  );
  function move(d: Date) {
    moved.current = true;
    setFocus(d);
  }

  const first = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
  const lead = (first.getDay() - weekStart + 7) % 7;
  const gridStart = addDays(first, -lead);
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) days.push(addDays(gridStart, i));
  const weeks: Date[][] = [];
  for (let w = 0; w < 6; w++) weeks.push(days.slice(w * 7, w * 7 + 7));
  if (weeks[5][0].getMonth() !== focusDate.getMonth()) weeks.pop();

  function onKey(e: React.KeyboardEvent, d: Date) {
    let k = e.key,
      n: Date | null = null;
    if (k === 'ArrowLeft') n = addDays(d, -1);
    else if (k === 'ArrowRight') n = addDays(d, 1);
    else if (k === 'ArrowUp') n = addDays(d, -7);
    else if (k === 'ArrowDown') n = addDays(d, 7);
    else if (k === 'Home') n = addDays(d, -((d.getDay() - weekStart + 7) % 7));
    else if (k === 'End') n = addDays(d, 6 - ((d.getDay() - weekStart + 7) % 7));
    else if (k === 'PageUp') n = addMonths(d, e.shiftKey ? -12 : -1);
    else if (k === 'PageDown') n = addMonths(d, e.shiftKey ? 12 : 1);
    else if (k === 'Enter' || k === ' ') {
      e.preventDefault();
      if (!disabled(d)) select(toISO(d));
      return;
    }
    if (n) {
      e.preventDefault();
      move(n);
    }
  }
  const hover = hoverState[0];
  const rangeEnd = end || (props.range && start && hover ? hover : null);
  function inRange(d: Date): boolean {
    if (!props.range || !start || !rangeEnd) return false;
    const a = start < rangeEnd ? start : rangeEnd,
      b = start < rangeEnd ? rangeEnd : start;
    return d > a && d < b;
  }
  const monthTitle = fmt(tag, { month: 'long', year: 'numeric' }, focusDate).replace(ERA, '');
  const weekdayNames = weeks[0].map(function (d: Date) {
    return { short: fmt(tag, { weekday: th ? 'narrow' : 'short' }, d), long: fmt(tag, { weekday: 'long' }, d) };
  });

  if (view === 'years') {
    const yr = focusDate.getFullYear(),
      base = yr - (yr % 12);
    const years: number[] = [];
    for (let y = base; y < base + 12; y++) years.push(y);
    return (
      <div className="aura-cal" ref={gridMerged} key={gridKey}>
        <div className="aura-cal__head">
          <IconButton
            icon="chevron-left"
            label={dt.prevYears}
            onClick={function () {
              setFocus(new Date(yr - 12, focusDate.getMonth(), 1));
            }}
          />
          <button
            type="button"
            className="aura-cal__title"
            onClick={function () {
              setView('days');
            }}
          >
            {fmt(tag, { year: 'numeric' }, new Date(base, 0, 1)).replace(ERA, '') +
              ' – ' +
              fmt(tag, { year: 'numeric' }, new Date(base + 11, 0, 1)).replace(ERA, '')}
          </button>
          <IconButton
            icon="chevron-right"
            label={dt.nextYears}
            onClick={function () {
              setFocus(new Date(yr + 12, focusDate.getMonth(), 1));
            }}
          />
        </div>
        <div className="aura-cal__years">
          {years.map(function (y: number) {
            const d = new Date(y, focusDate.getMonth(), 1);
            return (
              <button
                key={y}
                type="button"
                tabIndex={y === yr ? 0 : -1}
                className={cx('aura-cal__year', y === yr && 'is-selected')}
                onClick={function () {
                  setFocus(new Date(y, focusDate.getMonth(), Math.min(focusDate.getDate(), 28)));
                  setView('days');
                  moved.current = true;
                }}
              >
                {fmt(tag, { year: 'numeric' }, d).replace(ERA, '')}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="aura-cal" ref={gridMerged} key={gridKey}>
      <div className="aura-cal__head">
        <IconButton
          icon="chevron-left"
          label={dt.prevMonth}
          onClick={function () {
            setFocus(addMonths(focusDate, -1));
          }}
        />
        <button
          type="button"
          className="aura-cal__title"
          aria-live="polite"
          onClick={function () {
            setView('years');
          }}
        >
          {monthTitle}
          <Icon name="chevron-down" size={14} />
        </button>
        <IconButton
          icon="chevron-right"
          label={dt.nextMonth}
          onClick={function () {
            setFocus(addMonths(focusDate, 1));
          }}
        />
      </div>
      <table role="grid" className="aura-cal__grid" aria-label={monthTitle}>
        <thead>
          <tr>
            {weekdayNames.map(function (n: { short: string; long: string }, i: number) {
              return (
                <th key={i} scope="col" abbr={n.long}>
                  <span aria-hidden={true}>{n.short}</span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody
          onMouseLeave={function () {
            hoverState[1](null);
          }}
        >
          {weeks.map(function (wk: Date[], wi: number) {
            return (
              <tr key={wi}>
                {wk.map(function (d: Date) {
                  const iso = toISO(d),
                    out = d.getMonth() !== focusDate.getMonth(),
                    dis = disabled(d);
                  const isStart = same(d, start),
                    isEnd = same(d, end) || (!end && props.range && same(d, hover) && start);
                  const sel = isStart || same(d, end);
                  return (
                    <td
                      key={iso as string}
                      role="gridcell"
                      aria-selected={sel || undefined}
                      className={cx(
                        inRange(d) && 'is-in-range',
                        props.range && isStart && rangeEnd && 'is-range-start',
                        props.range && isEnd && start && 'is-range-end',
                      )}
                    >
                      <button
                        type="button"
                        data-date={iso}
                        tabIndex={same(d, focusDate) ? 0 : -1}
                        /* aria-disabled, not disabled: a day that can't be chosen stays focusable, so arrow keys
                         * move through it and the grid never loses its tab stop (5.1.1, APG date grid). */
                        aria-disabled={dis || undefined}
                        aria-label={fmt(tag, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }, d)}
                        /* Server and browser ICU can punctuate long dates differently ("Sunday, 30 August" vs "Sunday 30 August"). */
                        suppressHydrationWarning
                        aria-current={same(d, today) ? 'date' : undefined}
                        aria-pressed={sel || undefined}
                        className={cx(
                          'aura-cal__day',
                          out && 'is-outside',
                          sel && 'is-selected',
                          same(d, today) && 'is-today',
                        )}
                        onClick={function () {
                          setFocus(d);
                          if (!dis) select(iso);
                        }}
                        onKeyDown={function (e: React.KeyboardEvent) {
                          onKey(e, d);
                        }}
                        onMouseEnter={function () {
                          if (props.range) hoverState[1](d);
                        }}
                      >
                        {d.getDate()}
                      </button>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {props.footer === false ? null : (
        <div className="aura-cal__foot">
          <button
            type="button"
            className="aura-cal__link"
            disabled={disabled(today)}
            onClick={function () {
              move(today);
              select(toISO(today));
            }}
          >
            {dt.today}
          </button>
          {props.onClear ? (
            <button type="button" className="aura-cal__link" onClick={props.onClear}>
              {dt.clear}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
});

/* ---------- popover field shared by DatePicker and DateRangePicker ---------- */
function useCalendarPopover(boxRef: React.RefObject<HTMLDivElement | null>) {
  const openState = React.useState(false),
    open = openState[0],
    setOpen = openState[1];
  const pos = React.useState<PopoverPos | null>(null),
    popRef = React.useRef<HTMLDivElement | null>(null),
    mounted = useMounted();
  function place() {
    if (!boxRef.current) return;
    const r = boxRef.current.getBoundingClientRect(),
      H = 380;
    const up = window.innerHeight - r.bottom < H && r.top > H;
    const left = Math.max(8, Math.min(r.left, window.innerWidth - 320 - 8));
    pos[1](up ? { left: left, bottom: window.innerHeight - r.top + 4 } : { left: left, top: r.bottom + 4 });
  }
  useIsoLayoutEffect(
    function () {
      if (open) place();
    },
    [open],
  );
  React.useEffect(
    function () {
      if (!open) return;
      function outside(e: Event) {
        if (boxRef.current && boxRef.current.contains(e.target as Node)) return;
        if (popRef.current && popRef.current.contains(e.target as Node)) return;
        setOpen(false);
      }
      document.addEventListener('pointerdown', outside, true);
      window.addEventListener('resize', place);
      window.addEventListener('scroll', place, true);
      return function () {
        document.removeEventListener('pointerdown', outside, true);
        window.removeEventListener('resize', place);
        window.removeEventListener('scroll', place, true);
      };
    },
    [open],
  );
  return { open: open, setOpen: setOpen, pos: pos[0], popRef: popRef, mounted: mounted };
}

interface DateFieldInternalProps {
  id: string;
  dialogId: string;
  label: string;
  hint?: React.ReactNode | undefined;
  error?: React.ReactNode | undefined;
  required?: boolean | undefined;
  optional?: boolean | undefined;
  disabled?: boolean | undefined;
  className?: string | undefined;
  name?: string | undefined;
  open: boolean;
  display: string;
  placeholder: string;
  boxRef: React.Ref<HTMLDivElement>;
  inputRef: React.Ref<HTMLInputElement>;
  hasValue: boolean;
  clearable?: boolean | undefined;
  onClear: () => void;
  clearLabel: string;
  toggleLabel: string;
  onCommit: (text: string) => void;
  onToggle: (open: boolean) => void;
}
function DateField(props: DateFieldInternalProps) {
  /* props: id, label…, display, placeholder, onCommit(text), onToggle, open, inputRef, boxRef, disabled, clearable, onClear, dialogId */
  const editState = React.useState<string | null>(null),
    editing = editState[0],
    setEditing = editState[1];
  return (
    <Field
      id={props.id}
      label={props.label}
      hint={props.hint}
      error={props.error}
      required={props.required}
      optional={props.optional}
      disabled={props.disabled}
      className={props.className}
    >
      <div ref={props.boxRef} className={cx('aura-input aura-date', props.open && 'is-open')}>
        <input
          ref={props.inputRef}
          id={props.id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          className="aura-input__control"
          value={editing != null ? editing : props.display}
          placeholder={props.placeholder}
          disabled={props.disabled}
          required={props.required}
          name={props.name}
          aria-invalid={props.error ? true : undefined}
          aria-describedby={props.error ? props.id + '-error' : props.hint ? props.id + '-hint' : undefined}
          onChange={function (e: React.ChangeEvent<HTMLInputElement>) {
            setEditing(e.target.value);
          }}
          onBlur={function () {
            if (editing != null) {
              props.onCommit(editing);
              setEditing(null);
            }
          }}
          onKeyDown={function (e: React.KeyboardEvent) {
            if (e.key === 'Enter' && editing != null) {
              e.preventDefault();
              props.onCommit(editing);
              setEditing(null);
            } else if (e.key === 'ArrowDown' && (e.altKey || editing == null)) {
              e.preventDefault();
              props.onToggle(true);
            } else if (e.key === 'Escape' && props.open) {
              e.preventDefault();
              props.onToggle(false);
            }
          }}
        />
        {props.clearable !== false && props.hasValue && !props.disabled ? (
          <button
            type="button"
            tabIndex={-1}
            className="aura-combo__clear"
            aria-label={props.clearLabel}
            onClick={props.onClear}
          >
            <Icon name="x" />
          </button>
        ) : null}
        <button
          type="button"
          className="aura-date__toggle"
          disabled={props.disabled}
          aria-label={props.toggleLabel}
          aria-haspopup="dialog"
          aria-expanded={props.open}
          aria-controls={props.open ? props.dialogId : undefined}
          onClick={function () {
            props.onToggle(!props.open);
          }}
        >
          <Icon name="calendar" />
        </button>
      </div>
    </Field>
  );
}

/* DatePicker — one date, typed (dd/mm/yyyy, Buddhist or Christian year) or picked from a calendar.
 * Locale from the prop, else AuraProvider, else English with Gregorian years; Thai (locale 'th') shows Buddhist-era years. */
/** Typed date field + calendar popover. English / Gregorian unless a locale is set; `th` shows Buddhist-era dates (18 ก.ย. 2569) and accepts พ.ศ. or ค.ศ. years. The value is always a Gregorian ISO date. */
export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker(props, ref) {
  const auto = uid(),
    id = props.id || auto,
    dialogId = id + '-cal';
  const ctx = useAuraLocale(),
    locale = props.locale || ctx.locale || 'en',
    calendar = props.calendar || ctx.calendar || defaultCalendar(locale),
    dt = dateText(locale);
  const st = useMaybeControlled<ISODate | null>(
    props.value,
    props.defaultValue == null ? null : props.defaultValue,
    props.onChange,
  );
  const boxRef = React.useRef<HTMLDivElement | null>(null),
    inputRef = React.useRef<HTMLInputElement | null>(null),
    inputMerged = useMergedRef(ref, inputRef);
  const pop = useCalendarPopover(boxRef);
  const limits = {
    min: props.min,
    max: props.max,
    today: props.today,
    timeZone: props.timeZone || ctx.timeZone,
    isDateDisabled: props.isDateDisabled,
  };
  /* A typed date outside min/max (or disabled) isn't taken; the field says why, like TimePicker (5.1.1). */
  const bad = React.useState<string | null>(null);
  /* A new value from anywhere (a pick, the app, a form reset) retires the message about the refused text. */
  React.useEffect(
    function () {
      bad[1](null);
    },
    [st[0]],
  );
  function commit(text: string) {
    bad[1](null);
    if (!text.trim()) {
      st[1](null);
      return;
    }
    const iso = parseDate(text);
    if (!iso) return;
    if (allowedDate(iso, limits)) st[1](iso);
    else bad[1](dt.dateUnavailable);
  }
  function close() {
    pop.setOpen(false);
    if (inputRef.current) inputRef.current.focus();
  }
  const cal =
    pop.open && pop.mounted && pop.pos
      ? createPortal(
          <div
            ref={pop.popRef}
            id={dialogId}
            role="dialog"
            aria-modal={false}
            aria-label={props.label || dt.chooseDate}
            className="aura-cal__popover"
            style={pop.pos}
            onKeyDown={function (e: React.KeyboardEvent) {
              if (e.key === 'Escape') {
                e.stopPropagation();
                close();
              } else trapTab(e, pop.popRef.current);
            }}
          >
            <Calendar
              locale={locale}
              calendar={calendar}
              weekStartsOn={props.weekStartsOn}
              min={props.min}
              max={props.max}
              timeZone={props.timeZone}
              today={props.today}
              isDateDisabled={props.isDateDisabled}
              start={st[0]}
              focus={st[0]}
              onSelect={function (iso: ISODate | null) {
                bad[1](null);
                st[1](iso);
                close();
              }}
            />
          </div>,
          document.body,
        )
      : null;
  return (
    <React.Fragment>
      <DateField
        id={id}
        dialogId={dialogId}
        label={props.label}
        hint={props.hint}
        error={bad[0] || props.error}
        required={props.required}
        optional={props.optional}
        disabled={props.disabled}
        className={props.className}
        name={props.name}
        boxRef={boxRef}
        inputRef={inputMerged}
        open={pop.open}
        display={formatDateBase(st[0], { locale: locale, calendar: calendar })}
        placeholder={props.placeholder || dt.datePlaceholder}
        hasValue={st[0] != null}
        clearable={props.clearable}
        onClear={function () {
          bad[1](null);
          st[1](null);
          inputRef.current && inputRef.current.focus();
        }}
        clearLabel={dt.clearDate}
        toggleLabel={dt.openCalendar}
        onCommit={commit}
        onToggle={function (o: boolean) {
          pop.setOpen(o);
          if (!o && inputRef.current) inputRef.current.focus();
        }}
      />
      {cal}
    </React.Fragment>
  );
});

/* DateRangePicker — a start and end date chosen on one calendar. value = { start, end } (ISO strings). */
export const DateRangePicker = React.forwardRef<HTMLInputElement, DateRangePickerProps>(
  function DateRangePicker(props, ref) {
    const auto = uid(),
      id = props.id || auto,
      dialogId = id + '-cal';
    const ctx = useAuraLocale(),
      locale = props.locale || ctx.locale || 'en',
      calendar = props.calendar || ctx.calendar || defaultCalendar(locale),
      dt = dateText(locale);
    const st = useMaybeControlled<DateRange>(
      props.value,
      props.defaultValue || { start: null, end: null },
      props.onChange,
    );
    const v = st[0] || { start: null, end: null };
    const draft = React.useState<ISODate | null>(null); /* start picked, waiting for end */
    const boxRef = React.useRef<HTMLDivElement | null>(null),
      inputRef = React.useRef<HTMLInputElement | null>(null),
      inputMerged = useMergedRef(ref, inputRef);
    const pop = useCalendarPopover(boxRef);
    const limits = {
      min: props.min,
      max: props.max,
      today: props.today,
      timeZone: props.timeZone || ctx.timeZone,
      isDateDisabled: props.isDateDisabled,
    };
    const o = { locale: locale, calendar: calendar };
    function show(r: DateRange): string {
      if (!r.start) return '';
      if (!r.end) return formatDateBase(r.start, o) + ' –';
      return formatDateBase(r.start, o) + ' – ' + formatDateBase(r.end, o);
    }
    const bad = React.useState<string | null>(null);
    React.useEffect(
      function () {
        bad[1](null);
      },
      [v.start, v.end],
    );
    function commit(text: string) {
      bad[1](null);
      const parts = String(text).split(/\s[–-]\s|\s*–\s*/);
      if (!text.trim()) {
        st[1]({ start: null, end: null });
        return;
      }
      const a = parseDate(parts[0]),
        b = parseDate(parts[1] || '');
      if (a && b && !(allowedDate(a, limits) && allowedDate(b, limits))) bad[1](dt.dateUnavailable);
      else if (a && b) st[1](a <= b ? { start: a, end: b } : { start: b, end: a });
    }
    function close() {
      pop.setOpen(false);
      draft[1](null);
      if (inputRef.current) inputRef.current.focus();
    }
    function pick(iso: ISODate | null) {
      if (!draft[0]) {
        draft[1](iso);
        return;
      }
      const a = draft[0],
        b = iso as ISODate;
      bad[1](null);
      st[1](a <= b ? { start: a, end: b } : { start: b, end: a });
      close();
    }
    const cal =
      pop.open && pop.mounted && pop.pos
        ? createPortal(
            <div
              ref={pop.popRef}
              id={dialogId}
              role="dialog"
              aria-modal={false}
              aria-label={props.label || dt.chooseDates}
              className="aura-cal__popover"
              style={pop.pos}
              onKeyDown={function (e: React.KeyboardEvent) {
                if (e.key === 'Escape') {
                  e.stopPropagation();
                  close();
                } else trapTab(e, pop.popRef.current);
              }}
            >
              <p className="aura-cal__hint" aria-live="polite">
                {draft[0] ? dt.chooseEnd : dt.chooseStart}
              </p>
              <Calendar
                range={true}
                locale={locale}
                calendar={calendar}
                weekStartsOn={props.weekStartsOn}
                min={props.min}
                max={props.max}
                timeZone={props.timeZone}
                today={props.today}
                isDateDisabled={props.isDateDisabled}
                start={draft[0] || v.start}
                end={draft[0] ? null : v.end}
                focus={draft[0] || v.start}
                onSelect={pick}
              />
            </div>,
            document.body,
          )
        : null;
    return (
      <React.Fragment>
        <DateField
          id={id}
          dialogId={dialogId}
          label={props.label}
          hint={props.hint}
          error={bad[0] || props.error}
          required={props.required}
          optional={props.optional}
          disabled={props.disabled}
          className={props.className}
          name={props.name}
          boxRef={boxRef}
          inputRef={inputMerged}
          open={pop.open}
          display={show(v)}
          placeholder={props.placeholder || dt.rangePlaceholder}
          hasValue={v.start != null}
          clearable={props.clearable}
          onClear={function () {
            bad[1](null);
            st[1]({ start: null, end: null });
            inputRef.current && inputRef.current.focus();
          }}
          clearLabel={dt.clearDates}
          toggleLabel={dt.openCalendar}
          onCommit={commit}
          onToggle={function (op: boolean) {
            pop.setOpen(op);
            draft[1](null);
            if (!op && inputRef.current) inputRef.current.focus();
          }}
        />
        {cal}
      </React.Fragment>
    );
  },
);
