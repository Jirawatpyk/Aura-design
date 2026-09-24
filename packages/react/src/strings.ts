/* Built-in UI strings (th / en / sv) with no React, so the server entry can export STRINGS. */
/* UI strings built into components. Thai first; English kept for mixed teams.
 * Wrap the app once: <AuraProvider locale="th">. Without a provider everything is English, with Gregorian dates (4.11). */
const n = function (x: number | string) {
  return Number(x).toLocaleString('en');
};
const nsv = function (x: number | string) {
  return Number(x).toLocaleString('sv-SE');
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
  prevPage: string;
  nextPage: string;
  rowCount: (c: number) => string;
  actions: string;
  optional: string;
  timePlaceholder: string;
  timeInvalid: string;
  timeOutOfRange: (a: number | string, b: number | string) => string;
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
}
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
    prevPage: 'Previous page',
    nextPage: 'Next page',
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
    accepts: function (list, max) {
      return [list, max && 'up to ' + max + ' each'].filter(Boolean).join(', ');
    },
  },
  th: {
    close: 'ปิด',
    dismiss: 'ปิด',
    dismissToast: 'ปิดการแจ้งเตือน',
    showPassword: 'แสดงรหัสผ่าน',
    filters: 'ตัวกรอง',
    search: 'ค้นหา',
    clearFilters: 'ล้างทั้งหมด',
    results: function (n) {
      return n.toLocaleString('en') + ' รายการ';
    },
    commandMenu: 'เมนูคำสั่ง',
    commandPlaceholder: 'พิมพ์คำสั่งหรือค้นหา…',
    commandHint: '↑↓ เลื่อน · Enter เปิด · Esc ปิด',
    errorSummary: function (n) {
      return 'แก้ไข ' + n + ' ช่องก่อนไปต่อ';
    },
    notifications: 'การแจ้งเตือน',
    mainNav: 'เมนูหลัก',
    breadcrumb: 'เส้นทาง',
    navigation: 'เมนู',
    openNav: 'เปิดเมนู',
    collapseNav: 'ย่อแถบเมนู',
    expandNav: 'ขยายแถบเมนู',
    searching: 'กำลังค้นหา…',
    noMatches: 'ไม่พบรายการที่ตรงกัน',
    clear: function (what) {
      return 'ล้าง' + (what || 'ที่เลือก');
    },
    keepTyping: function (total) {
      return 'พิมพ์เพิ่มเพื่อกรองจาก ' + n(total) + ' รายการ';
    },
    sortAsc: 'เรียงจากน้อยไปมาก',
    sortDesc: 'เรียงจากมากไปน้อย',
    pin: 'ตรึงไว้ซ้าย',
    unpin: 'เลิกตรึงคอลัมน์',
    moveLeft: 'ย้ายไปซ้าย',
    moveRight: 'ย้ายไปขวา',
    hideColumn: 'ซ่อนคอลัมน์',
    resetColumns: 'คืนค่าคอลัมน์',
    selectRows: 'เลือกแถว',
    selectAllRows: 'เลือกทุกแถว',
    deselectAllRows: 'ยกเลิกการเลือกทุกแถว',
    selectAll: 'เลือกทั้งหมด',
    selectRow: function (k) {
      return 'เลือก ' + k;
    },
    selectedCount: function (c) {
      return 'เลือก ' + n(c) + ' รายการ';
    },
    pinned: 'ตรึงอยู่',
    columnOptions: function (label) {
      return 'ตัวเลือกคอลัมน์ ' + label;
    },
    column: function (label) {
      return label ? 'คอลัมน์ ' + label : 'คอลัมน์';
    },
    columns: 'คอลัมน์',
    showHideColumns: 'แสดงหรือซ่อนคอลัมน์',
    empty: 'ยังไม่มีข้อมูล',
    loading: 'กำลังโหลด…',
    loadingRows: 'กำลังโหลดข้อมูล',
    range: function (a, b, total) {
      return a + '–' + b + ' จาก ' + n(total);
    },
    page: function (p, total) {
      return 'หน้า ' + p + ' / ' + total;
    },
    prevPage: 'หน้าก่อนหน้า',
    nextPage: 'หน้าถัดไป',
    rowCount: function (c) {
      return n(c) + ' แถว';
    },
    actions: 'การจัดการ',
    optional: 'ไม่บังคับ',
    timePlaceholder: 'ชช:นน',
    timeInvalid: 'พิมพ์เวลาแบบ 09:30',
    timeOutOfRange: function (a, b) {
      return 'เลือกเวลาระหว่าง ' + a + '–' + b + ' น.';
    },
    dropFiles: 'ลากไฟล์มาวาง หรือ',
    browse: 'เลือกไฟล์',
    browseOne: 'เลือกไฟล์',
    remove: function (n) {
      return 'ลบ ' + n;
    },
    fileTooBig: function (max) {
      return 'ไฟล์ใหญ่เกิน ' + max;
    },
    fileWrongType: 'ไม่รองรับไฟล์ชนิดนี้',
    tooManyFiles: function (n) {
      return 'แนบได้ไม่เกิน ' + n + ' ไฟล์';
    },
    colorScheme: 'โหมดสี',
    increase: 'เพิ่ม',
    decrease: 'ลด',
    stepDone: 'เสร็จแล้ว',
    stepOf: function (i, total) {
      return 'ขั้นที่ ' + i + ' จาก ' + total;
    },
    schemeLight: 'สว่าง',
    schemeDark: 'มืด',
    schemeSystem: 'ตามระบบ',
    uploading: 'กำลังอัปโหลด…',
    images: 'รูปภาพ',
    pagination: 'เลขหน้า',
    pageN: function (p) {
      return 'หน้า ' + p;
    },
    accepts: function (list, max) {
      return [list, max && 'ไม่เกิน ' + max + ' ต่อไฟล์'].filter(Boolean).join(' · ');
    },
  },
  sv: {
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
    prevPage: 'Föregående sida',
    nextPage: 'Nästa sida',
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
    accepts: function (list, max) {
      return [list, max && 'högst ' + max + ' per fil'].filter(Boolean).join(', ');
    },
  },
};
