/* Demo data for the bookings pilot — deterministic, no network. */
export const MAIDS = [
  { value: 'm1', label: 'สมศรี ใจดี', description: 'สุขุมวิท · 4.9★', keywords: ['somsri', 'sukhumvit'] },
  { value: 'm2', label: 'มาลี ทองคำ', description: 'สาทร · 4.8★', keywords: ['malee', 'sathorn'] },
  { value: 'm3', label: 'Anna Santos', description: 'สีลม · 4.7★', keywords: ['silom'] },
  { value: 'm4', label: 'บุญมี ศรีสุข', description: 'นนทบุรี · 4.9★', keywords: ['boonmee', 'nonthaburi'] },
  { value: 'm5', label: 'ประไพ วงศ์ใหญ่', description: 'อารีย์ · 4.6★', keywords: ['prapai', 'ari'] },
  { value: 'm6', label: 'จันทร์เพ็ญ แก้วใส', description: 'ลาพักถึง 30 ก.ย.', keywords: ['janpen'], disabled: true },
];
export const SERVICES = ['ทำความสะอาดทั่วไป', 'Deep clean', 'ย้ายเข้า/ย้ายออก', 'รีดผ้า'];
const CUSTOMERS = ['คุณสมชาย ใจดี', 'Anna Lee', 'คุณวิภา รักดี', 'คุณธนา พงษ์ไทย', 'Mark Chen', 'คุณปิยะ สุขใจ', 'คุณอรุณี ศรีงาม', 'Yuki Tanaka', 'คุณกิตติ มั่นคง', 'คุณนภา ฟ้าใส'];
const AREAS = ['สุขุมวิท 31', 'สาทร 12', 'สีลม 9', 'อารีย์ 4', 'ทองหล่อ 10', 'รัชดา 32'];
export const STATUSES = ['Backlog', 'In Progress', 'Ready', 'Blocked'];
const STATUS_TH = { Backlog: 'รอยืนยัน', 'In Progress': 'กำลังทำ', Ready: 'เสร็จแล้ว', Blocked: 'ยกเลิก' };
export const statusLabel = (s) => STATUS_TH[s] || s;
export const TONE = { 'รอยืนยัน': 'neutral', 'กำลังทำ': 'progress', 'เสร็จแล้ว': 'ready', 'ยกเลิก': 'blocked' };

function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
export function makeBookings(n = 48) {
  const out = [];
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < n; i++) {
    const d = new Date(2026, 8, 1 + Math.floor(rnd() * 40));
    const maid = MAIDS[Math.floor(rnd() * 5)];
    const hours = [2, 3, 4][Math.floor(rnd() * 3)];
    out.push({
      id: 'BK-' + (1040 + i),
      customer: CUSTOMERS[Math.floor(rnd() * CUSTOMERS.length)],
      area: AREAS[Math.floor(rnd() * AREAS.length)],
      date: iso(d),
      time: ['08:00', '09:00', '10:30', '13:00', '15:00'][Math.floor(rnd() * 5)],
      service: SERVICES[Math.floor(rnd() * SERVICES.length)],
      hours,
      maid: maid.value,
      status: statusLabel(STATUSES[Math.floor(rnd() * 4)]),
      amount: hours * 350 + Math.floor(rnd() * 3) * 100,
    });
  }
  return out;
}
