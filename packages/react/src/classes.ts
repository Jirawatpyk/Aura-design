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

/* Badge / Progress tone → class suffix. */
const TONES: string[] = ['neutral', 'accent', 'success', 'warning', 'danger'];

export function tone(t: Tone | undefined): string {
  return TONES.indexOf(t as string) >= 0 ? (t as string) : 'neutral';
}
