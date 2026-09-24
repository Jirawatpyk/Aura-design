import * as React from 'react';
import { createTheme } from './theme.js';
import type { ThemeOptions } from './types.js';

export interface ThemeStyleProps extends ThemeOptions {
  /** Scope the theme to this selector instead of the whole page (multi-tenant). */
  selector?: string | undefined;
}

/* ThemeStyle — render a project/tenant theme as a <style> element (works in server rendering).
 * <ThemeStyle brand={project.brandColour} /> for the whole page, or selector=".tenant-acme" to scope it. */
export function ThemeStyle(props: ThemeStyleProps): React.ReactElement {
  const css = React.useMemo(
    function () {
      return createTheme({ brand: props.brand, signal: props.signal, primary: props.primary, name: props.name }).css(
        props.selector,
      );
    },
    [props.brand, props.signal, props.primary, props.name, props.selector],
  );
  return <style data-aura-theme={props.name || props.brand} dangerouslySetInnerHTML={{ __html: css }} />;
}
