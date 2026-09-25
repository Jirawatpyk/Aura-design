/* Date helpers with no React: ISO 'YYYY-MM-DD' values (Gregorian) shown in th / en / sv and the Buddhist or
 * Gregorian calendar. Shared by DatePicker / Calendar and the server entry (@jirawatpyk/aura-react/server). */
import type { DateDisplayOptions, ISODate } from './types.js';

/** Options for formatDate: locale/calendar plus a preset or any Intl.DateTimeFormat options. */
export type FormatDateOptions = DateDisplayOptions & {
  format?: 'short' | 'long' | 'numeric' | Intl.DateTimeFormatOptions | undefined;
};

/* ---------- date helpers: values are ISO 'YYYY-MM-DD' strings (Gregorian), shown in the chosen calendar ---------- */
export const ERA = /^พ\.ศ\.\s?|\s?(BE|พ\.ศ\.)$/g;
export const pad = function (n: number) {
  return (n < 10 ? '0' : '') + n;
};
export function toISO(d: Date | null | undefined): ISODate | null {
  return d ? d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) : null;
}
export function fromISO(s: ISODate | null | undefined): Date | null {
  if (!s) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
}
export function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}
export function addMonths(d: Date, n: number): Date {
  const t = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
  return new Date(t.getFullYear(), t.getMonth(), Math.min(d.getDate(), last));
}
export function same(a: Date | null | undefined, b: Date | null | undefined): boolean {
  return (
    !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  );
}
export const TAGS: Record<string, string> = { th: 'th-TH', en: 'en-GB', sv: 'sv-SE' };
/** The calendar when none is set: Gregorian for Swedish, Buddhist for Thai and English (as before 4.10). */
export function defaultCalendar(locale: string | null | undefined): 'buddhist' | 'gregory' {
  /* พ.ศ. only for Thai; the era is display only (values stay Gregorian ISO dates). */
  return locale === 'th' ? 'buddhist' : 'gregory';
}
export function localeTag(locale: string | null | undefined, calendar: string | null | undefined): string {
  const cal = calendar || defaultCalendar(locale);
  return (TAGS[locale || 'en'] || 'en-GB') + '-u-ca-' + (cal === 'gregory' ? 'gregory' : 'buddhist');
}
/* Built-in text of the date components, by date locale (independent of AuraProvider strings, which default to English). */
export type DateText = {
  prevYears: string;
  nextYears: string;
  prevMonth: string;
  nextMonth: string;
  today: string;
  clear: string;
  chooseDate: string;
  datePlaceholder: string;
  clearDate: string;
  openCalendar: string;
  chooseDates: string;
  rangePlaceholder: string;
  clearDates: string;
  chooseStart: string;
  chooseEnd: string;
  /** Typed date outside min/max or disabled (5.1.1). */
  dateUnavailable: string;
};
export const DATE_TEXT: Record<string, DateText> = {
  th: {
    prevYears: 'ช่วงปีก่อนหน้า',
    nextYears: 'ช่วงปีถัดไป',
    prevMonth: 'เดือนก่อนหน้า',
    nextMonth: 'เดือนถัดไป',
    today: 'วันนี้',
    clear: 'ล้าง',
    chooseDate: 'เลือกวันที่',
    datePlaceholder: 'วว/ดด/ปปปป',
    clearDate: 'ล้างวันที่',
    openCalendar: 'เปิดปฏิทิน',
    chooseDates: 'เลือกช่วงวันที่',
    rangePlaceholder: 'วว/ดด/ปปปป – วว/ดด/ปปปป',
    clearDates: 'ล้างช่วงวันที่',
    chooseStart: 'เลือกวันเริ่มต้น',
    chooseEnd: 'เลือกวันสิ้นสุด',
    dateUnavailable: 'เลือกวันที่นี้ไม่ได้ ลองเปิดปฏิทินดูวันที่เลือกได้',
  },
  en: {
    prevYears: 'Previous years',
    nextYears: 'Next years',
    prevMonth: 'Previous month',
    nextMonth: 'Next month',
    today: 'Today',
    clear: 'Clear',
    chooseDate: 'Choose date',
    datePlaceholder: 'DD/MM/YYYY',
    clearDate: 'Clear date',
    openCalendar: 'Open calendar',
    chooseDates: 'Choose dates',
    rangePlaceholder: 'DD/MM/YYYY – DD/MM/YYYY',
    clearDates: 'Clear dates',
    chooseStart: 'Choose the start date',
    chooseEnd: 'Choose the end date',
    dateUnavailable: "That date can't be chosen. Open the calendar to see the dates you can pick.",
  },
  sv: {
    prevYears: 'Tidigare år',
    nextYears: 'Senare år',
    prevMonth: 'Föregående månad',
    nextMonth: 'Nästa månad',
    today: 'Idag',
    clear: 'Rensa',
    chooseDate: 'Välj datum',
    datePlaceholder: 'åååå-mm-dd',
    clearDate: 'Rensa datum',
    openCalendar: 'Öppna kalendern',
    chooseDates: 'Välj datum',
    rangePlaceholder: 'åååå-mm-dd – åååå-mm-dd',
    clearDates: 'Rensa datumen',
    chooseStart: 'Välj startdatum',
    chooseEnd: 'Välj slutdatum',
    dateUnavailable: 'Det datumet går inte att välja. Öppna kalendern för att se vilka datum som går.',
  },
};
export function dateText(locale: string | null | undefined): DateText {
  return DATE_TEXT[locale || 'en'] || DATE_TEXT.en;
}
export const fmtCache: Record<string, Intl.DateTimeFormat> = {};
export const PRESETS: Record<string, Intl.DateTimeFormatOptions> = {
  short: { day: 'numeric', month: 'short', year: 'numeric' },
  long: { day: 'numeric', month: 'long', year: 'numeric' },
  numeric: { day: '2-digit', month: '2-digit', year: 'numeric' },
};
export function fmt(tag: string, opts: Intl.DateTimeFormatOptions, d: Date): string {
  const k = tag + JSON.stringify(opts);
  if (!fmtCache[k]) fmtCache[k] = new Intl.DateTimeFormat(tag, opts);
  return fmtCache[k].format(d);
}
/** Format an ISO date for display: "18 Sept 2026" by default (English, Gregorian — 5.0); `{ locale: 'th' }` gives
 * "18 ก.ย. 2569" (Buddhist era), `{ locale: 'sv' }` "18 sep. 2026". The same function from the package root and from
 * `/server`. In components, `useFormatDate()` follows the AuraProvider's locale instead. */
export function formatDate(iso: ISODate | null | undefined, opts?: FormatDateOptions): string {
  const o: FormatDateOptions = opts || {},
    d = fromISO(iso);
  if (!d) return '';
  const f = typeof o.format === 'object' ? o.format : PRESETS[o.format || 'short'];
  /* A plain function has no provider to read: English unless `locale` says otherwise (5.0; Thai before). */
  const loc = o.locale || 'en';
  return fmt(localeTag(loc, o.calendar || defaultCalendar(loc)), f, d).replace(ERA, '');
}
export let MONTHS: Record<string, number> | null = null;
export function monthIndex(word: string): number {
  if (!MONTHS) {
    MONTHS = {};
    ['th-TH', 'en-GB', 'sv-SE'].forEach(function (tag: string) {
      (['short', 'long'] as const).forEach(function (w: 'short' | 'long') {
        for (let i = 0; i < 12; i++) {
          const n = new Intl.DateTimeFormat(tag, { month: w })
            .format(new Date(2020, i, 1))
            .toLowerCase()
            .replace(/\.$/, '');
          MONTHS![n] = i;
          if (/^[a-zåäö]/.test(n)) MONTHS![n.slice(0, 3)] = i;
        }
      });
    });
  }
  const k = word.toLowerCase().replace(/\.$/, '');
  return MONTHS[k] != null ? MONTHS[k] : -1;
}
/** Parse typed text: dd/mm/yyyy (Buddhist years ≥ 2400 are converted), d-m-yyyy, d.m.yyyy, yyyy-mm-dd or '18 ก.ย. 2569' / '18 Sep 2026'. */
export function parseDate(text: string | null | undefined): ISODate | null {
  const s = String(text || '').trim();
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s),
    y: number,
    mo: number,
    d: number;
  if (m) {
    y = +m[1];
    mo = +m[2];
    d = +m[3];
  } else if ((m = /^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/.exec(s))) {
    d = +m[1];
    mo = +m[2];
    y = +m[3];
  } else if ((m = /^(\d{1,2})\s+(\S+)\s+(\d{4})$/.exec(s.replace(ERA, '').trim())) && monthIndex(m[2]) >= 0) {
    d = +m[1];
    mo = monthIndex(m[2]) + 1;
    y = +m[3];
  } else return null;
  if (y >= 2400) y -= 543;
  const dt = new Date(y, mo - 1, d);
  return dt.getMonth() === mo - 1 && dt.getDate() === d ? toISO(dt) : null;
}

/* ---------- Calendar ---------- */

/** Today as an ISO date in an IANA time zone (e.g. `Asia/Bangkok`), or in the runtime's own zone without one. (4.19) */
export function todayIn(timeZone?: string | null): ISODate {
  const now = new Date();
  if (!timeZone) return toISO(now) as ISODate;
  /* en-CA formats as YYYY-MM-DD. An unknown zone throws in Intl: fall back to the runtime's own date (5.0.1). */
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now);
  } catch (e) {
    return toISO(now) as ISODate;
  }
}
