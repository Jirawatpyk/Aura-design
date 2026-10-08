/* Built-in UI strings (th / en / sv) with no React, so the server entry can export STRINGS. */
import type * as React from 'react';
import { th } from './strings.th.js';
import { sv } from './strings.sv.js';
/* UI strings built into components. Thai first; English kept for mixed teams.
 * Wrap the app once: <AuraProvider locale="th">. Without a provider everything is English, with Gregorian dates (4.11). */
const n = function (x: number | string) {
  return Number(x).toLocaleString('en');
};
/** Every built-in label. Function entries build the text from their arguments. */
export interface AuraStrings {
  close: string;
  dismiss: string;
  dismissToast: string;
  showPassword: string;
  filters: string;
  search: string;
  clearFilters: string;
  results: (n: number) => string;
  commandMenu: string;
  commandPlaceholder: string;
  commandHint: string;
  errorSummary: (n: number) => string;
  notifications: string;
  mainNav: string;
  breadcrumb: string;
  navigation: string;
  openNav: string;
  collapseNav: string;
  expandNav: string;
  searching: string;
  noMatches: string;
  clear: (what?: string) => string;
  keepTyping: (total: number) => string;
  sortAsc: string;
  sortDesc: string;
  pin: string;
  unpin: string;
  moveLeft: string;
  moveRight: string;
  hideColumn: string;
  resetColumns: string;
  selectRows: string;
  selectAllRows: string;
  deselectAllRows: string;
  selectAll: string;
  selectRow: (k: React.ReactNode) => string;
  selectedCount: (c: number) => string;
  pinned: string;
  columnOptions: (label?: string) => string;
  column: (label?: string) => string;
  columns: string;
  showHideColumns: string;
  empty: string;
  loading: string;
  loadingRows: string;
  range: (a: number | string, b: number | string, total: number) => string;
  page: (p: number, total: number) => string;
  /** Server paging without totalRows (5.2): the range and page when the total isn't known. */
  rangeOpen: (a: number | string, b: number | string) => string;
  pageOpen: (p: number) => string;
  prevPage: string;
  nextPage: string;
  rowCount: (c: number) => string;
  totals: string;
  actions: string;
  optional: string;
  timePlaceholder: string;
  timeInvalid: string;
  timeOutOfRange: (a: number | string, b: number | string) => string;
  /** A time inside the range that isTimeDisabled refuses (5.2). */
  timeUnavailable: string;
  dropFiles: string;
  browse: string;
  browseOne: string;
  remove: (n: number | string) => string;
  fileTooBig: (max?: number | string) => string;
  fileWrongType: string;
  tooManyFiles: (n: number | string) => string;
  colorScheme: string;
  increase: string;
  decrease: string;
  stepDone: string;
  stepOf: (i: number, total: number) => string;
  schemeLight: string;
  schemeDark: string;
  schemeSystem: string;
  uploading: string;
  images: string;
  pagination: string;
  pageN: (p: number) => string;
  accepts: (list?: string, max?: number | string) => string;
  /** Progress with a reserved segment (5.15): "2 of 6 used, 1 reserved". */
  progressReserved: (value: number, reserved: number, max: number) => string;
  /** The collapsed middle of a Breadcrumb (5.15). */
  breadcrumbMore: string;
  /** A Stepper step with `status: 'error'` (5.18). */
  stepError: string;
  /** StatusTile's status words (5.34). */
  statusDown: string;
  statusProblem: string;
  statusMaintenance: string;
  statusOk: string;
}
/** Built-in strings by locale. th and sv also ship as packs (`@jirawatpyk/aura-react/locales/th`, `/sv`, 5.9); in 6.0
 * only en stays built in and a Thai or Swedish app passes its pack to AuraProvider `strings`. */
/** A whole language for AuraProvider `strings` (5.9): every built-in label, and assignable to the prop. */
export type AuraLocalePack = AuraStrings & { [key: string]: string | ((...args: any[]) => string) };
export const STRINGS: { en: AuraStrings; th: AuraStrings; sv: AuraStrings } = {
  en: {
    close: 'Close',
    dismiss: 'Dismiss',
    dismissToast: 'Dismiss notification',
    showPassword: 'Show password',
    filters: 'Filters',
    search: 'Search',
    clearFilters: 'Clear all',
    results: function (n) {
      return n === 1 ? '1 result' : n.toLocaleString('en') + ' results';
    },
    commandMenu: 'Command menu',
    commandPlaceholder: 'Type a command or search…',
    commandHint: '↑↓ to move · Enter to open · Esc to close',
    errorSummary: function (n) {
      return n === 1 ? 'Fix 1 field to continue' : 'Fix ' + n + ' fields to continue';
    },
    notifications: 'Notifications',
    mainNav: 'Main',
    breadcrumb: 'Breadcrumb',
    navigation: 'Navigation',
    openNav: 'Open navigation',
    collapseNav: 'Collapse sidebar',
    expandNav: 'Expand sidebar',
    searching: 'Searching…',
    noMatches: 'No matches',
    clear: function (what) {
      return 'Clear ' + (what || 'selection');
    },
    keepTyping: function (total) {
      return 'Keep typing to narrow ' + n(total) + ' options';
    },
    sortAsc: 'Sort ascending',
    sortDesc: 'Sort descending',
    pin: 'Pin to left',
    unpin: 'Unpin column',
    moveLeft: 'Move left',
    moveRight: 'Move right',
    hideColumn: 'Hide column',
    resetColumns: 'Reset columns',
    selectRows: 'Select rows',
    selectAllRows: 'Select all rows',
    deselectAllRows: 'Deselect all rows',
    selectAll: 'Select all',
    selectRow: function (k) {
      return 'Select ' + k;
    },
    selectedCount: function (c) {
      return n(c) + ' selected';
    },
    pinned: 'Pinned',
    columnOptions: function (label) {
      return label + ' column options';
    },
    column: function (label) {
      return label ? label + ' column' : 'Column';
    },
    columns: 'Columns',
    showHideColumns: 'Show or hide columns',
    empty: 'Nothing here yet',
    loading: 'Loading…',
    loadingRows: 'Loading rows',
    range: function (a, b, total) {
      return a + '–' + b + ' of ' + n(total);
    },
    page: function (p, total) {
      return 'Page ' + p + ' of ' + total;
    },
    rangeOpen: function (a, b) {
      return a + '–' + b + ' of many';
    },
    pageOpen: function (p) {
      return 'Page ' + p;
    },
    prevPage: 'Previous page',
    nextPage: 'Next page',
    totals: 'Totals',
    rowCount: function (c) {
      return n(c) + ' rows';
    },
    actions: 'Actions',
    optional: 'optional',
    timePlaceholder: 'hh:mm',
    timeInvalid: 'Type a time like 09:30',
    timeOutOfRange: function (a, b) {
      return 'Choose a time between ' + a + ' and ' + b;
    },
    timeUnavailable: "That time isn't available. Choose another.",
    dropFiles: 'Drag files here or',
    browse: 'Choose files',
    browseOne: 'Choose a file',
    remove: function (n) {
      return 'Remove ' + n;
    },
    fileTooBig: function (max) {
      return 'Larger than ' + max;
    },
    fileWrongType: 'This file type isn’t accepted',
    tooManyFiles: function (n) {
      return 'Up to ' + n + ' files';
    },
    colorScheme: 'Colour scheme',
    increase: 'Increase',
    decrease: 'Decrease',
    stepDone: 'completed',
    stepOf: function (i, total) {
      return 'Step ' + i + ' of ' + total;
    },
    schemeLight: 'Light',
    schemeDark: 'Dark',
    schemeSystem: 'System',
    uploading: 'Uploading…',
    images: 'Images',
    pagination: 'Pagination',
    pageN: function (p) {
      return 'Page ' + p;
    },
    progressReserved: function (v, r, max) {
      return n(v) + ' of ' + n(max) + ' used, ' + n(r) + ' reserved';
    },
    breadcrumbMore: 'Show the full path',
    stepError: 'has errors',
    statusDown: 'Down',
    statusProblem: 'Problem',
    statusMaintenance: 'Maintenance',
    statusOk: 'OK',
    accepts: function (list, max) {
      return [list, max && 'up to ' + max + ' each'].filter(Boolean).join(', ');
    },
  },
  th: th,
  sv: sv,
};
