/* Class-name and prop helpers with no React (5.8): shared by the components and the server entry's display
 * components, so `@jirawatpyk/aura-react/server` doesn't pull in the hooks in internal.tsx. */
import type { Tone } from './types.js';

export function cx(...parts: Array<string | number | bigint | boolean | null | undefined>): string;
export function cx(): string {
  return Array.prototype.filter.call(arguments, Boolean).join(' ');
}
export function omit<T extends object, K extends string>(src: T, keys: readonly K[]): Omit<T, K> {
  const out: Record<string, unknown> = {};
  for (const k in src)
    if (Object.prototype.hasOwnProperty.call(src, k) && (keys as readonly string[]).indexOf(k) < 0)
      out[k] = (src as Record<string, unknown>)[k];
  return out as Omit<T, K>;
}

/* 5.30 (Chamber-OS 135): a field's or choice row's `touchHeight` → its class. */
export function touchClass(t: boolean | 'always' | undefined): string | false {
  return t === 'always' ? 'is-touch-always' : !!t && 'is-touch';
}

/* Badge / Progress tone → class suffix. */
const TONES: string[] = ['neutral', 'accent', 'success', 'warning', 'danger'];

export function tone(t: Tone | undefined): string {
  return TONES.indexOf(t as string) >= 0 ? (t as string) : 'neutral';
}

/* Development-only notices, once per key (5.1). Bundlers replace process.env.NODE_ENV; without one (the window.Aura
 * script) the lookup throws and nothing is printed. */
declare const process: { env: { NODE_ENV?: string } };
const warned: Record<string, boolean> = {};
export function devWarnOnce(key: string, message: string): void {
  if (warned[key]) return;
  let dev = false;
  try {
    dev = process.env.NODE_ENV !== 'production';
  } catch (e) {
    dev = false;
  }
  if (!dev) return;
  warned[key] = true;
  console.warn('[AURA] ' + message);
}
