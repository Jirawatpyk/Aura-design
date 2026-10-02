import * as React from 'react';
import { createPortal } from 'react-dom';
import { Calendar, allowedDate, useCalendarPopover } from './DatePicker.js';
import { Button } from './Button.js';
import { Icon } from './Icon.js';
import { IconChevronDown } from './icons.js';
import { cx, trapTab, uid, useMaybeControlled, useMergedRef } from './internal.js';
import { useAuraLocale } from './locale.js';
import { dateText, defaultCalendar, formatDateRange } from './dates.js';
import type { DateRange, FilterDateRangeProps, ISODate } from './types.js';

const NONE: DateRange = { start: null, end: null };

/** A compact date-range filter for FilterBar (5.30, Chamber-OS 128): a face like FilterSelect's — "Submitted Any
 * time ▾" — that opens the range calendar, with optional presets, in one click. `onChange` runs once a range is
 * complete, a preset is picked or the range is cleared; never on a lone start day. */
export const FilterDateRange = React.forwardRef<HTMLButtonElement, FilterDateRangeProps>(
  function FilterDateRange(props, ref) {
    const auto = uid(),
      id = props.id || auto,
      dialogId = id + '-cal';
    const ctx = useAuraLocale(),
      locale = props.locale || ctx.locale || 'en',
      calendar = props.calendar || ctx.calendar || defaultCalendar(locale),
      dt = dateText(locale);
    const st = useMaybeControlled<DateRange>(props.value, props.defaultValue || NONE, props.onChange);
    /* A range needs both ends (a start alone reads as "Any time" everywhere); ends given backwards are swapped. */
    const raw = st[0] || NONE;
    const v: DateRange =
      raw.start && raw.end ? (raw.start <= raw.end ? raw : { start: raw.end, end: raw.start }) : NONE;
    const draft = React.useState<ISODate | null>(null);
    const boxRef = React.useRef<HTMLDivElement | null>(null),
      faceRef = React.useRef<HTMLButtonElement | null>(null);
    const pop = useCalendarPopover(boxRef);
    const anyLabel = props.anyLabel || dt.anyTime;
    const value = v.start && v.end ? formatDateRange(v.start, v.end, { locale: locale, calendar: calendar }) : anyLabel;
    const setFace = useMergedRef(ref, faceRef);
    const limits = {
      min: props.min,
      max: props.max,
      today: props.today,
      timeZone: props.timeZone || ctx.timeZone,
      isDateDisabled: props.isDateDisabled,
    };
    function close() {
      pop.setOpen(false);
      draft[1](null);
      if (faceRef.current) faceRef.current.focus();
    }
    function choose(r: DateRange) {
      /* Picking what is already chosen just closes: no second onChange (a duplicate URL entry). */
      if (r.start !== raw.start || r.end !== raw.end) st[1](r);
      close();
    }
    function pick(iso: ISODate | null) {
      if (!iso) return;
      if (!draft[0]) {
        draft[1](iso);
        return;
      }
      const a = draft[0];
      choose(a <= iso ? { start: a, end: iso } : { start: iso, end: a });
    }
    const isAny = !v.start || !v.end;
    /* data-*, aria-* and style reach the face button (test hooks, a description), as on FilterSelect. */
    const attrs: Record<string, unknown> = {};
    Object.keys(props).forEach(function (k: string) {
      if (k === 'style' || (/^(aria|data)-/.test(k) && k !== 'aria-label'))
        attrs[k] = (props as unknown as Record<string, unknown>)[k];
    });
    const presetBtn = function (label: string, r: DateRange, on: boolean, key: string) {
      return (
        <Button
          key={key}
          size="sm"
          variant="ghost"
          touchHeight
          disabled={!!r.start && !!r.end && !(allowedDate(r.start, limits) && allowedDate(r.end, limits))}
          className={cx('aura-filterdate__preset', on && 'is-selected')}
          aria-pressed={on}
          onClick={function () {
            choose(r);
          }}
        >
          {label}
        </Button>
      );
    };
    const cal =
      pop.open && pop.mounted && pop.pos
        ? createPortal(
            <div
              ref={pop.popRef}
              id={dialogId}
              role="dialog"
              aria-modal={false}
              aria-label={props.label}
              className="aura-cal__popover aura-filterdate__pop"
              /* Never taller than the room left on its side of the face (a short phone screen). */
              style={Object.assign({}, pop.pos, {
                maxHeight: window.innerHeight - (pop.pos.top != null ? pop.pos.top : (pop.pos.bottom as number)) - 8,
              })}
              onKeyDown={function (e: React.KeyboardEvent) {
                if (e.key === 'Escape') {
                  e.stopPropagation();
                  close();
                } else trapTab(e, pop.popRef.current);
              }}
            >
              <div className="aura-filterdate__presets">
                {presetBtn(anyLabel, NONE, isAny, '__any')}
                {(props.presets || []).map(function (p, i) {
                  return presetBtn(
                    p.label,
                    p.range,
                    !isAny && p.range.start === v.start && p.range.end === v.end,
                    'p' + i,
                  );
                })}
              </div>
              <div>
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
                  footer={false}
                  onSelect={pick}
                />
              </div>
            </div>,
            document.body,
          )
        : null;
    return (
      <React.Fragment>
        <div
          ref={boxRef}
          className={cx('aura-filterselect', pop.open && 'is-open', props.disabled && 'is-disabled', props.className)}
        >
          <button
            {...attrs}
            ref={setFace}
            id={id}
            type="button"
            className="aura-filterselect__face"
            disabled={props.disabled}
            aria-label={props['aria-label'] || props.label + ': ' + value}
            aria-haspopup="dialog"
            aria-expanded={pop.open}
            aria-controls={pop.open ? dialogId : undefined}
            onClick={function () {
              pop.setOpen(!pop.open);
              draft[1](null);
            }}
          >
            <span className="aura-filterselect__name">{props.label}</span>
            <span className="aura-filterselect__value">{value}</span>
            <Icon name={<IconChevronDown />} className="aura-filterselect__chevron" />
          </button>
        </div>
        {cal}
      </React.Fragment>
    );
  },
);
