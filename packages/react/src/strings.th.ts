/* Thai UI strings (5.9: their own module, and the `@jirawatpyk/aura-react/locales/th` pack). */
import type { AuraLocalePack } from './strings.js';

const n = function (x: number | string) {
  return Number(x).toLocaleString('en');
};
/** Thai built-in labels: `<AuraProvider locale="th" strings={th}>`. */
export const th: AuraLocalePack = {
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
  rangeOpen: function (a, b) {
    return a + '–' + b + ' จากหลายรายการ';
  },
  pageOpen: function (p) {
    return 'หน้า ' + p;
  },
  prevPage: 'หน้าก่อนหน้า',
  nextPage: 'หน้าถัดไป',
  totals: 'รวม',
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
  timeUnavailable: 'เวลานี้ไม่ว่าง เลือกเวลาอื่น',
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
  progressReserved: function (v, r, max) {
    return 'ใช้แล้ว ' + n(v) + ' จาก ' + n(max) + ' จองไว้ ' + n(r);
  },
  breadcrumbMore: 'แสดงเส้นทางทั้งหมด',
  stepError: 'มีข้อผิดพลาด',
  statusDown: 'ล่ม',
  statusProblem: 'มีปัญหา',
  statusMaintenance: 'ปิดปรับปรุง',
  statusOk: 'ปกติ',
  statusUnknown: 'ยังไม่มีข้อมูล',
  accepts: function (list, max) {
    return [list, max && 'ไม่เกิน ' + max + ' ต่อไฟล์'].filter(Boolean).join(' · ');
  },
};
