/* Demo data for the orders pilot — deterministic, no network. Neutral on purpose: any business with
 * customers, orders, a team and a status flow. */
import type { ComboboxOption, ISODate, StatusTone } from '@aura/react';

export interface Order {
  id: string;
  customer: string;
  branch: string;
  date: ISODate;
  time: string;
  category: string;
  priority: string;
  owner: string;
  status: string;
  amount: number;
}
export const STAFF: ComboboxOption[] = [
  { value: 's1', label: 'กมล ศรีวงศ์', description: 'ทีมขาย · สาขาสยาม', keywords: ['kamon', 'siam'] },
  { value: 's2', label: 'ธนพร ใจงาม', description: 'ทีมขาย · สาขาอารีย์', keywords: ['thanaporn', 'ari'] },
  { value: 's3', label: 'Alex Morgan', description: 'ลูกค้าองค์กร', keywords: ['enterprise'] },
  { value: 's4', label: 'ปิยะ รุ่งเรือง', description: 'ทีมจัดส่ง · สาขาบางนา', keywords: ['piya', 'bangna'] },
  { value: 's5', label: 'นภัส ทองดี', description: 'ทีมจัดส่ง · ออนไลน์', keywords: ['napat', 'online'] },
  { value: 's6', label: 'วรรณา แก้วใส', description: 'ลาพักถึง 30 ก.ย.', keywords: ['wanna'], disabled: true },
];
export const CATEGORIES = ['สินค้า', 'บริการ', 'สมาชิกรายปี', 'ค่าติดตั้ง'];
export const PRIORITIES = [{ value: 'normal', label: 'ปกติ' }, { value: 'express', label: 'ด่วน' }, { value: 'rush', label: 'ด่วนพิเศษ' }];
const CUSTOMERS = ['คุณสมชาย ใจดี', 'Anna Lee', 'คุณวิภา รักดี', 'คุณธนา พงษ์ไทย', 'Mark Chen', 'คุณปิยะ สุขใจ', 'คุณอรุณี ศรีงาม', 'Yuki Tanaka', 'คุณกิตติ มั่นคง', 'คุณนภา ฟ้าใส'];
const BRANCHES = ['สาขาสยาม', 'สาขาอารีย์', 'สาขาบางนา', 'ออนไลน์', 'สาขาเชียงใหม่', 'สาขาภูเก็ต'];
export const STATUSES = ['Backlog', 'In Progress', 'Ready', 'Blocked'];
const STATUS_TH: Record<string, string> = { Backlog: 'รอยืนยัน', 'In Progress': 'กำลังดำเนินการ', Ready: 'เสร็จสิ้น', Blocked: 'ยกเลิก' };
export const statusLabel = (s: string): string => STATUS_TH[s] || s;
export const TONE: Record<string, StatusTone> = { 'รอยืนยัน': 'neutral', 'กำลังดำเนินการ': 'progress', 'เสร็จสิ้น': 'ready', 'ยกเลิก': 'blocked' };
export const priorityLabel = (v: string): string => PRIORITIES.find((p) => p.value === v)?.label || v;

function iso(d: Date): ISODate { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
export function makeOrders(n = 48): Order[] {
  const out: Order[] = [];
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < n; i++) {
    const d = new Date(2026, 8, 1 + Math.floor(rnd() * 40));
    out.push({
      id: 'ORD-' + (1040 + i),
      customer: CUSTOMERS[Math.floor(rnd() * CUSTOMERS.length)]!,
      branch: BRANCHES[Math.floor(rnd() * BRANCHES.length)]!,
      date: iso(d),
      time: ['08:00', '09:00', '10:30', '13:00', '15:00'][Math.floor(rnd() * 5)]!,
      category: CATEGORIES[Math.floor(rnd() * CATEGORIES.length)]!,
      priority: PRIORITIES[Math.floor(rnd() * 3)]!.value,
      owner: STAFF[Math.floor(rnd() * 5)]!.value,
      status: statusLabel(STATUSES[Math.floor(rnd() * 4)]!),
      amount: 500 + Math.floor(rnd() * 46) * 100,
    });
  }
  return out;
}
