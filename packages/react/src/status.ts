/* Status word → tone, with no React (shared by StatusPill, DataTable and the server entry). */
import type { StatusTone } from './types.js';

const TONE_WORDS: Record<Exclude<StatusTone, 'neutral'>, string[]> = {
  ready: ['ready', 'done', 'complete', 'completed', 'approved', 'live', 'passed'],
  progress: ['in progress', 'in review', 'review', 'syncing', 'running', 'pending'],
  warning: ['warning', 'problem', 'degraded', 'at risk'],
  blocked: ['blocked', 'failed', 'error', 'rejected', 'on hold', 'cancelled'],
};
/** The tone the pill would pick for a status word. */
export function toneFor(status: unknown): StatusTone {
  const s = String(status == null ? '' : status)
    .trim()
    .toLowerCase();
  for (const t in TONE_WORDS) if (TONE_WORDS[t as keyof typeof TONE_WORDS].indexOf(s) >= 0) return t as StatusTone;
  return 'neutral';
}
export { toneFor as statusTone };
export const TONE_ORDER: Record<StatusTone, number> = { neutral: 0, progress: 1, ready: 2, warning: 3, blocked: 4 };
