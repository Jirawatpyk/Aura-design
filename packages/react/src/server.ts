/* @jirawatpyk/aura-react/server — the pure helpers and (5.8) the stateless display components, for Server Components
 * (and any server code): no 'use client', no hooks. Invoices, receipts and registers rendered on the server format dates and build themes here.
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

/* 5.8 (Chamber-OS 68): stateless display components a Server Component can render without turning into a client
 * reference — the same HTML as the root components for the same props. Alert has no `onDismiss` here (a close button
 * needs the client); Button is `buttonClass()` on your own link. They import React (as any component does) but no
 * hooks or context. */
export {
  ServerAlert as Alert,
  ServerCard as Card,
  ServerStatusPill as StatusPill,
  ServerBadge as Badge,
  ServerEmptyState as EmptyState,
  buttonClass,
} from './display.js';
export { Icon } from './Icon.js';
export type {
  AlertProps,
  BadgeProps,
  CardProps,
  EmptyStateProps,
  FeedbackTone,
  IconInput,
  IconName,
  IconProps,
  StatusPillProps,
} from './types.js';
