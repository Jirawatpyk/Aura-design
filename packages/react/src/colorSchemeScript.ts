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
  /* `<` escaped so a key can't close the inline <script> (5.1.1). */
  const key = JSON.stringify((options && options.storageKey) || DEFAULT_KEY).replace(/</g, '\\u003c');
  const fallback = JSON.stringify((options && options.defaultScheme) || 'system').replace(/</g, '\\u003c');
  return (
    '(function(){try{var s=localStorage.getItem(' +
    key +
    ');' +
    "if(s!=='light'&&s!=='dark'&&s!=='system')s=" +
    fallback +
    ';' +
    'var d=document.documentElement;d.setAttribute("data-theme",s);' +
    "var m=window.matchMedia('(prefers-color-scheme: dark)');" +
    "d.classList.toggle('dark',s==='dark'||(s==='system'&&m.matches));" +
    /* 5.1.1: keep the Tailwind .dark class following the OS while the scheme is system, even on pages without
     * ColorSchemeToggle or useColorScheme (the class used to stick at its first-paint value). */
    "if(m.addEventListener)m.addEventListener('change',function(e){" +
    "if(d.getAttribute('data-theme')==='system')d.classList.toggle('dark',e.matches)});" +
    '}catch(e){}})();'
  );
}
