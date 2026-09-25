import * as React from 'react';
import { createTheme } from './theme.js';
import { devWarnOnce } from './internal.js';
import type { ThemeOptions } from './types.js';

export interface ThemeStyleProps extends ThemeOptions {
  /** Scope the theme to this selector instead of the whole page (multi-tenant). */
  selector?: string | undefined;
}

/* ThemeStyle — render a project/tenant theme as a <style> element (works in server rendering).
 * <ThemeStyle brand={project.brandColour} /> for the whole page, or selector=".tenant-acme" to scope it. */
export function ThemeStyle(props: ThemeStyleProps): React.ReactElement | null {
  const css = React.useMemo(
    function () {
      /* 5.1.1: a bad tenant colour or selector no longer throws during render (and takes the page down); the
       * page keeps AURA's own colours and a dev notice says why. */
      try {
        return createTheme({
          brand: props.brand,
          signal: props.signal,
          primary: props.primary,
          name: props.name,
        }).css(props.selector);
      } catch (e) {
        devWarnOnce('theme-style', 'ThemeStyle ignored: ' + (e as Error).message);
        return null;
      }
    },
    [props.brand, props.signal, props.primary, props.name, props.selector],
  );
  if (css === null) return null;
  return <style data-aura-theme={props.name || props.brand} dangerouslySetInnerHTML={{ __html: css }} />;
}
