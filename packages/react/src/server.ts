/* @jirawatpyk/aura-react/server — the pure helpers, for Server Components (and any server code): no 'use client',
 * no React. Invoices, receipts and registers rendered on the server format dates and build themes here.
 *
 *   import { formatDate, createTheme } from '@jirawatpyk/aura-react/server';
 *
 * formatDate here defaults to English and the Gregorian calendar, like useFormatDate() without a provider. Pass
 * `{ locale: 'th' }` for Thai with Buddhist-era years. (The package root's plain formatDate() keeps its Thai
 * default until 5.0.) */
import { formatDate as formatDateThaiDefault } from './dates.js';
import type { FormatDateOptions } from './dates.js';
import type { ISODate } from './types.js';

/** Format an ISO date for display: "24 Sept 2026" by default (English, Gregorian); `{ locale: 'th' }` gives
 * "24 ก.ย. 2569", `{ locale: 'sv' }` "24 sep. 2026". Options as in the package root's formatDate. */
export function formatDate(iso: ISODate | null | undefined, opts?: FormatDateOptions): string {
  const o: FormatDateOptions = Object.assign({}, opts);
  if (!o.locale) o.locale = 'en';
  return formatDateThaiDefault(iso, o);
}
export { parseDate, toISO, fromISO } from './dates.js';
export { parseTime, formatBytes } from './text.js';
export { statusTone } from './status.js';
export { STRINGS } from './strings.js';
export { createTheme, contrast, scale as brandScale } from './theme.js';
export { colorSchemeScript } from './colorSchemeScript.js';
export { breakpoints } from './breakpoints.js';
export type { FormatDateOptions } from './dates.js';
export type { AuraStrings } from './strings.js';
export type { ColorScheme, ColorSchemeOptions } from './colorSchemeScript.js';
export type { ISODate, StatusTone, Theme, ThemeCheck, ThemeOptions } from './types.js';
