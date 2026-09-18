import * as React from 'react';
import { createTheme } from './theme.js';
const h = React.createElement;

/* ThemeStyle — render a project/tenant theme as a <style> element (works in server rendering).
 * <ThemeStyle brand={project.brandColour} /> for the whole page, or selector=".tenant-acme" to scope it. */
export function ThemeStyle(props) {
  var css = React.useMemo(function () {
    return createTheme({ brand: props.brand, signal: props.signal, primary: props.primary, name: props.name }).css(props.selector);
  }, [props.brand, props.signal, props.primary, props.name, props.selector]);
  return h('style', { 'data-aura-theme': props.name || props.brand, dangerouslySetInnerHTML: { __html: css } });
}
