/* The no-flash colour-scheme script as a string, with no React (ColorSchemeScript and the server entry). */
/** `system` follows the operating system and changes with it. */
export type ColorScheme = 'light' | 'dark' | 'system';

export interface ColorSchemeOptions {
  /** localStorage key for the choice. Default `aura-color-scheme`. */
  storageKey?: string | undefined;
  /** Used when nothing is saved. Default `system`. */
  defaultScheme?: ColorScheme | undefined;
}

export const DEFAULT_KEY = 'aura-color-scheme';
export const SCHEMES: ColorScheme[] = ['light', 'dark', 'system'];
export const EVENT = 'aura-color-scheme';

export function valid(v: unknown): v is ColorScheme {
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
