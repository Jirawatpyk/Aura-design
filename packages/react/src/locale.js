import * as React from 'react';
const h = React.createElement;

/* UI strings built into components. Thai first; English kept for mixed teams.
 * Wrap the app once: <AuraProvider locale="th">. Without a provider, strings are English and dates are Thai/พ.ศ. (4.1 behaviour). */
var n = function (x) { return Number(x).toLocaleString('en'); };
export var STRINGS = {
  en: {
    close: 'Close', dismiss: 'Dismiss', dismissToast: 'Dismiss notification', notifications: 'Notifications',
    mainNav: 'Main', breadcrumb: 'Breadcrumb', navigation: 'Navigation', openNav: 'Open navigation',
    searching: 'Searching…', noMatches: 'No matches', clear: function (what) { return 'Clear ' + (what || 'selection'); },
    keepTyping: function (total) { return 'Keep typing to narrow ' + n(total) + ' options'; },
    sortAsc: 'Sort ascending', sortDesc: 'Sort descending', pin: 'Pin to left', unpin: 'Unpin column',
    moveLeft: 'Move left', moveRight: 'Move right', hideColumn: 'Hide column', resetColumns: 'Reset columns',
    selectRows: 'Select rows', selectAllRows: 'Select all rows', deselectAllRows: 'Deselect all rows', selectAll: 'Select all',
    selectRow: function (k) { return 'Select ' + k; }, selectedCount: function (c) { return n(c) + ' selected'; },
    pinned: 'Pinned', columnOptions: function (label) { return label + ' column options'; }, column: function (label) { return label ? label + ' column' : 'Column'; },
    columns: 'Columns', showHideColumns: 'Show or hide columns', empty: 'Nothing here yet',
    loading: 'Loading…', loadingRows: 'Loading rows', range: function (a, b, total) { return a + '–' + b + ' of ' + n(total); },
    page: function (p, total) { return 'Page ' + p + ' of ' + total; }, prevPage: 'Previous page', nextPage: 'Next page',
    rowCount: function (c) { return n(c) + ' rows'; }, actions: 'Actions', optional: 'optional',
    timePlaceholder: 'hh:mm', timeInvalid: 'Type a time like 09:30', timeOutOfRange: function (a, b) { return 'Choose a time between ' + a + ' and ' + b; },
    dropFiles: 'Drag files here or', browse: 'Choose files', browseOne: 'Choose a file', remove: function (n) { return 'Remove ' + n; },
    fileTooBig: function (max) { return 'Larger than ' + max; }, fileWrongType: 'This file type isn’t accepted', tooManyFiles: function (n) { return 'Up to ' + n + ' files'; },
    uploading: 'Uploading…', images: 'Images', pagination: 'Pagination', pageN: function (p) { return 'Page ' + p; }, accepts: function (list, max) { return [list, max && 'up to ' + max + ' each'].filter(Boolean).join(', '); },
  },
  th: {
    close: 'ปิด', dismiss: 'ปิด', dismissToast: 'ปิดการแจ้งเตือน', notifications: 'การแจ้งเตือน',
    mainNav: 'เมนูหลัก', breadcrumb: 'เส้นทาง', navigation: 'เมนู', openNav: 'เปิดเมนู',
    searching: 'กำลังค้นหา…', noMatches: 'ไม่พบรายการที่ตรงกัน', clear: function (what) { return 'ล้าง' + (what || 'ที่เลือก'); },
    keepTyping: function (total) { return 'พิมพ์เพิ่มเพื่อกรองจาก ' + n(total) + ' รายการ'; },
    sortAsc: 'เรียงจากน้อยไปมาก', sortDesc: 'เรียงจากมากไปน้อย', pin: 'ตรึงไว้ซ้าย', unpin: 'เลิกตรึงคอลัมน์',
    moveLeft: 'ย้ายไปซ้าย', moveRight: 'ย้ายไปขวา', hideColumn: 'ซ่อนคอลัมน์', resetColumns: 'คืนค่าคอลัมน์',
    selectRows: 'เลือกแถว', selectAllRows: 'เลือกทุกแถว', deselectAllRows: 'ยกเลิกการเลือกทุกแถว', selectAll: 'เลือกทั้งหมด',
    selectRow: function (k) { return 'เลือก ' + k; }, selectedCount: function (c) { return 'เลือก ' + n(c) + ' รายการ'; },
    pinned: 'ตรึงอยู่', columnOptions: function (label) { return 'ตัวเลือกคอลัมน์ ' + label; }, column: function (label) { return label ? 'คอลัมน์ ' + label : 'คอลัมน์'; },
    columns: 'คอลัมน์', showHideColumns: 'แสดงหรือซ่อนคอลัมน์', empty: 'ยังไม่มีข้อมูล',
    loading: 'กำลังโหลด…', loadingRows: 'กำลังโหลดข้อมูล', range: function (a, b, total) { return a + '–' + b + ' จาก ' + n(total); },
    page: function (p, total) { return 'หน้า ' + p + ' / ' + total; }, prevPage: 'หน้าก่อนหน้า', nextPage: 'หน้าถัดไป',
    rowCount: function (c) { return n(c) + ' แถว'; }, actions: 'การจัดการ', optional: 'ไม่บังคับ',
    timePlaceholder: 'ชช:นน', timeInvalid: 'พิมพ์เวลาแบบ 09:30', timeOutOfRange: function (a, b) { return 'เลือกเวลาระหว่าง ' + a + '–' + b + ' น.'; },
    dropFiles: 'ลากไฟล์มาวาง หรือ', browse: 'เลือกไฟล์', browseOne: 'เลือกไฟล์', remove: function (n) { return 'ลบ ' + n; },
    fileTooBig: function (max) { return 'ไฟล์ใหญ่เกิน ' + max; }, fileWrongType: 'ไม่รองรับไฟล์ชนิดนี้', tooManyFiles: function (n) { return 'แนบได้ไม่เกิน ' + n + ' ไฟล์'; },
    uploading: 'กำลังอัปโหลด…', images: 'รูปภาพ', pagination: 'เลขหน้า', pageN: function (p) { return 'หน้า ' + p; }, accepts: function (list, max) { return [list, max && 'ไม่เกิน ' + max + ' ต่อไฟล์'].filter(Boolean).join(' · '); },
  },
};
var LocaleContext = React.createContext(null);

/** Sets the language of built-in labels (and the default date locale) for everything inside. */
export function AuraProvider(props) {
  var value = React.useMemo(function () {
    var base = STRINGS[props.locale] || STRINGS.en;
    return { locale: props.locale || 'en', calendar: props.calendar, strings: props.strings ? Object.assign({}, base, props.strings) : base };
  }, [props.locale, props.calendar, props.strings]);
  return h(LocaleContext.Provider, { value: value }, props.children);
}
/** { locale, calendar, strings } from the nearest AuraProvider (English strings when there is none). */
export function useAuraLocale() {
  return React.useContext(LocaleContext) || { locale: null, calendar: null, strings: STRINGS.en };
}
export function useStrings() { return useAuraLocale().strings; }
