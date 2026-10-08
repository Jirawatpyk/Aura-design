/* Swedish UI strings (5.9: their own module, and the `@jirawatpyk/aura-react/locales/sv` pack). */
import type { AuraLocalePack } from './strings.js';

const nsv = function (x: number | string) {
  return Number(x).toLocaleString('sv-SE');
};
/** Swedish built-in labels: `<AuraProvider locale="sv" strings={sv}>`. */
export const sv: AuraLocalePack = {
  close: 'Stäng',
  dismiss: 'Stäng',
  dismissToast: 'Stäng aviseringen',
  showPassword: 'Visa lösenord',
  filters: 'Filter',
  search: 'Sök',
  clearFilters: 'Rensa alla',
  results: function (n) {
    return n === 1 ? '1 träff' : n.toLocaleString('sv-SE') + ' träffar';
  },
  commandMenu: 'Kommandomeny',
  commandPlaceholder: 'Skriv ett kommando eller sök…',
  commandHint: '↑↓ flytta · Enter öppna · Esc stäng',
  errorSummary: function (n) {
    return n === 1 ? 'Rätta 1 fält för att fortsätta' : 'Rätta ' + n + ' fält för att fortsätta';
  },
  notifications: 'Aviseringar',
  mainNav: 'Huvudmeny',
  breadcrumb: 'Brödsmulor',
  navigation: 'Navigering',
  openNav: 'Öppna menyn',
  collapseNav: 'Fäll ihop sidofältet',
  expandNav: 'Fäll ut sidofältet',
  searching: 'Söker…',
  noMatches: 'Inga träffar',
  clear: function (what) {
    return 'Rensa ' + (what || 'urvalet');
  },
  keepTyping: function (total) {
    return 'Skriv mer för att begränsa ' + nsv(total) + ' alternativ';
  },
  sortAsc: 'Sortera stigande',
  sortDesc: 'Sortera fallande',
  pin: 'Fäst till vänster',
  unpin: 'Lossa kolumnen',
  moveLeft: 'Flytta vänster',
  moveRight: 'Flytta höger',
  hideColumn: 'Dölj kolumnen',
  resetColumns: 'Återställ kolumner',
  selectRows: 'Välj rader',
  selectAllRows: 'Välj alla rader',
  deselectAllRows: 'Avmarkera alla rader',
  selectAll: 'Välj alla',
  selectRow: function (k) {
    return 'Välj ' + k;
  },
  selectedCount: function (c) {
    return nsv(c) + ' valda';
  },
  pinned: 'Fäst',
  columnOptions: function (label) {
    return 'Alternativ för kolumnen ' + label;
  },
  column: function (label) {
    return label ? 'Kolumnen ' + label : 'Kolumn';
  },
  columns: 'Kolumner',
  showHideColumns: 'Visa eller dölj kolumner',
  empty: 'Inget här ännu',
  loading: 'Laddar…',
  loadingRows: 'Laddar rader',
  range: function (a, b, total) {
    return a + '–' + b + ' av ' + nsv(total);
  },
  page: function (p, total) {
    return 'Sida ' + p + ' av ' + total;
  },
  rangeOpen: function (a, b) {
    return a + '–' + b + ' av många';
  },
  pageOpen: function (p) {
    return 'Sida ' + p;
  },
  prevPage: 'Föregående sida',
  nextPage: 'Nästa sida',
  totals: 'Summa',
  rowCount: function (c) {
    return nsv(c) + ' rader';
  },
  actions: 'Åtgärder',
  optional: 'valfritt',
  timePlaceholder: 'tt:mm',
  timeInvalid: 'Skriv en tid som 09:30',
  timeOutOfRange: function (a, b) {
    return 'Välj en tid mellan ' + a + ' och ' + b;
  },
  timeUnavailable: 'Den tiden är inte ledig. Välj en annan.',
  dropFiles: 'Dra filer hit eller',
  browse: 'Välj filer',
  browseOne: 'Välj en fil',
  remove: function (n) {
    return 'Ta bort ' + n;
  },
  fileTooBig: function (max) {
    return 'Större än ' + max;
  },
  fileWrongType: 'Den här filtypen godtas inte',
  tooManyFiles: function (n) {
    return 'Högst ' + n + ' filer';
  },
  colorScheme: 'Färgläge',
  increase: 'Öka',
  decrease: 'Minska',
  stepDone: 'klart',
  stepOf: function (i, total) {
    return 'Steg ' + i + ' av ' + total;
  },
  schemeLight: 'Ljust',
  schemeDark: 'Mörkt',
  schemeSystem: 'System',
  uploading: 'Laddar upp…',
  images: 'Bilder',
  pagination: 'Sidnumrering',
  pageN: function (p) {
    return 'Sida ' + p;
  },
  progressReserved: function (v, r, max) {
    return nsv(v) + ' av ' + nsv(max) + ' använda, ' + nsv(r) + ' reserverade';
  },
  breadcrumbMore: 'Visa hela sökvägen',
  stepError: 'har fel',
  statusDown: 'Nere',
  statusProblem: 'Problem',
  statusMaintenance: 'Underhåll',
  statusOk: 'OK',
  accepts: function (list, max) {
    return [list, max && 'högst ' + max + ' per fil'].filter(Boolean).join(', ');
  },
};
