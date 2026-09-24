/* Text helpers with no React: file sizes and typed times (shared by FileUpload, TimePicker and the server entry). */
/** 1536 → "1.5 KB". */
export function formatBytes(n: number | null | undefined): string {
  if (n == null) return '';
  if (n < 1024) return n + ' B';
  let u = ['KB', 'MB', 'GB'],
    i = -1;
  do {
    n /= 1024;
    i++;
  } while (n >= 1024 && i < u.length - 1);
  return (n >= 10 || Math.round(n) === n ? Math.round(n) : n.toFixed(1)) + ' ' + u[i];
}

function pad2(n: number): string {
  return (n < 10 ? '0' : '') + n;
}

/** Parse typed time: 9 · 09 · 930 · 0930 · 9:30 · 9.30 · 09.30 น. · 9:30 pm → "HH:mm" (24-hour) or null. */
export function parseTime(text: string | null | undefined): string | null {
  let s = String(text || '')
    .trim()
    .toLowerCase()
    .replace(/\s*(น\.?|นาฬิกา)$/, '')
    .trim();
  const pm = /\s*(pm|p\.m\.)$/.test(s),
    am = /\s*(am|a\.m\.)$/.test(s);
  s = s.replace(/\s*(am|pm|a\.m\.|p\.m\.)$/, '');
  const m = /^(\d{1,2})(?:[:.](\d{2}))?$/.exec(s) || /^(\d{1,2})(\d{2})$/.exec(s);
  if (!m) return null;
  let hh = +m[1],
    mm = m[2] ? +m[2] : 0;
  if (pm && hh < 12) hh += 12;
  if (am && hh === 12) hh = 0;
  if (hh > 23 || mm > 59) return null;
  return pad2(hh) + ':' + pad2(mm);
}
