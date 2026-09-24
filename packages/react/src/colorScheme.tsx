import * as React from 'react';
import { useStrings } from './locale.js';
import { IconButton } from './IconButton.js';
import { DropdownMenu } from './DropdownMenu.js';

/* Light / dark / system colour scheme.
 * The tokens do the work: <html data-theme="light|dark|system"> (system follows prefers-color-scheme in CSS).
 * This module only chooses the attribute, remembers the choice, keeps the Tailwind `.dark` class in step, and
 * applies the saved choice before first paint (ColorSchemeScript) so there is no flash of the wrong scheme. */

/** `system` follows the operating system and changes with it. */
export type ColorScheme = 'light' | 'dark' | 'system';

export interface ColorSchemeOptions {
  /** localStorage key for the choice. Default `aura-color-scheme`. */
  storageKey?: string | undefined;
  /** Used when nothing is saved. Default `system`. */
  defaultScheme?: ColorScheme | undefined;
}

const DEFAULT_KEY = 'aura-color-scheme';
const SCHEMES: ColorScheme[] = ['light', 'dark', 'system'];
const EVENT = 'aura-color-scheme';

function valid(v: unknown): v is ColorScheme {
  return typeof v === 'string' && (SCHEMES as string[]).indexOf(v) >= 0;
}

/** The script ColorSchemeScript renders, as a string — for frameworks that want it in a raw <head> template. */
export function colorSchemeScript(options?: ColorSchemeOptions): string {
  const key = JSON.stringify((options && options.storageKey) || DEFAULT_KEY);
  const fallback = JSON.stringify((options && options.defaultScheme) || 'system');
  return (
    '(function(){try{var s=localStorage.getItem(' +
    key +
    ');' +
    "if(s!=='light'&&s!=='dark'&&s!=='system')s=" +
    fallback +
    ';' +
    'var d=document.documentElement;d.setAttribute("data-theme",s);' +
    "var dark=s==='dark'||(s==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);" +
    'd.classList.toggle("dark",dark);}catch(e){}})();'
  );
}

/** Put in <head>: applies the saved colour scheme before the page paints. Server-rendering safe. */
export function ColorSchemeScript(
  props: ColorSchemeOptions & {
    /** Nonce for a nonce-based Content-Security-Policy (script-src 'nonce-…'). */
    nonce?: string | undefined;
  },
): React.ReactElement {
  return (
    <script
      data-aura-color-scheme=""
      nonce={props.nonce}
      dangerouslySetInnerHTML={{ __html: colorSchemeScript(props) }}
    />
  );
}

function systemDark(): boolean {
  return (
    typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}
function readScheme(fallback: ColorScheme): ColorScheme {
  if (typeof document === 'undefined') return fallback;
  const attr = document.documentElement.getAttribute('data-theme');
  return valid(attr) ? attr : fallback;
}
function apply(scheme: ColorScheme) {
  const d = document.documentElement;
  d.setAttribute('data-theme', scheme);
  d.classList.toggle('dark', scheme === 'dark' || (scheme === 'system' && systemDark()));
}

/** Current colour scheme and a setter. `resolved` is what is on screen (system resolved to light or dark). */
export interface ColorSchemeState {
  scheme: ColorScheme;
  resolved: 'light' | 'dark';
  setScheme: (scheme: ColorScheme) => void;
}

/** Read and change the colour scheme. Every component using it stays in sync, and `system` follows OS changes. */
export function useColorScheme(options?: ColorSchemeOptions): ColorSchemeState {
  const key = (options && options.storageKey) || DEFAULT_KEY;
  const fallback = (options && options.defaultScheme) || 'system';
  const subscribe = React.useCallback(
    function (cb: () => void) {
      const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
      function onSystem() {
        if (readScheme(fallback) === 'system') apply('system');
        cb();
      }
      if (mq) mq.addEventListener('change', onSystem);
      window.addEventListener(EVENT, cb);
      window.addEventListener('storage', cb);
      return function () {
        if (mq) mq.removeEventListener('change', onSystem);
        window.removeEventListener(EVENT, cb);
        window.removeEventListener('storage', cb);
      };
    },
    [fallback],
  );
  /* One string snapshot so React can compare it: "scheme|resolved". */
  const snapshot = React.useSyncExternalStore(
    subscribe,
    function () {
      const s = readScheme(fallback);
      return s + '|' + (s === 'dark' || (s === 'system' && systemDark()) ? 'dark' : 'light');
    },
    function () {
      return fallback + '|light';
    },
  );
  const parts = snapshot.split('|');
  const setScheme = React.useCallback(
    function (next: ColorScheme) {
      if (!valid(next)) return;
      try {
        localStorage.setItem(key, next);
      } catch (e) {
        /* private mode: the choice lasts for this page only */
      }
      apply(next);
      window.dispatchEvent(new Event(EVENT));
    },
    [key],
  );
  return { scheme: parts[0] as ColorScheme, resolved: parts[1] as 'light' | 'dark', setScheme: setScheme };
}

export interface ColorSchemeToggleProps extends ColorSchemeOptions {
  /** Accessible name of the button. Default: the built-in "Colour scheme" label. */
  label?: string | undefined;
}

/** Icon button with a menu: Light, Dark, System. Shows a sun or a moon for what is on screen. */
export function ColorSchemeToggle(props: ColorSchemeToggleProps): React.ReactElement {
  const t = useStrings();
  const cs = useColorScheme(props);
  const names: Record<ColorScheme, string> = { light: t.schemeLight, dark: t.schemeDark, system: t.schemeSystem };
  const label = props.label || t.colorScheme;
  return (
    <DropdownMenu
      label={label}
      trigger={<IconButton icon={cs.resolved === 'dark' ? 'moon' : 'sun'} label={label + ': ' + names[cs.scheme]} />}
      items={SCHEMES.map(function (s) {
        return {
          label: names[s],
          checked: cs.scheme === s,
          onSelect: function () {
            cs.setScheme(s);
          },
        };
      })}
    />
  );
}
