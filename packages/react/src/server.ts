/* @jirawatpyk/aura-react/server — the pure helpers, for Server Components (and any server code): no 'use client',
 * no React. Invoices, receipts and registers rendered on the server format dates and build themes here.
 *
 *   import { formatDate, createTheme } from '@jirawatpyk/aura-react/server';
 *
 * formatDate defaults to English and the Gregorian calendar, like useFormatDate() without a provider; pass
 * `{ locale: 'th' }` for Thai with Buddhist-era years. Since 5.0 it is the same function as the package root's. */
export { formatDate, parseDate, toISO, fromISO, todayIn } from './dates.js';
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
