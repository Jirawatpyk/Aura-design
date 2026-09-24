import * as React from 'react';
import type { AuraProviderProps } from './types.js';

import { STRINGS } from './strings.js';
import type { AuraStrings } from './strings.js';
export { STRINGS };
export type { AuraStrings };

/** What useAuraLocale returns. `locale` and `calendar` are null outside an AuraProvider. */
export interface AuraLocaleValue {
  locale: 'th' | 'en' | 'sv' | null;
  calendar: 'buddhist' | 'gregory' | null;
  strings: AuraStrings;
  /** The router link set on AuraProvider, if any. */
  linkComponent?: React.ElementType | null | undefined;
  /** The density set on the nearest AuraProvider that sets one (null: none, i.e. comfortable unless an ancestor's data-density says otherwise). */
  density?: 'comfortable' | 'compact' | null | undefined;
}
const LocaleContext = React.createContext<AuraLocaleValue | null>(null);

/** Sets the language of built-in labels (and the default date locale) for everything inside. */
export function AuraProvider(props: AuraProviderProps): React.ReactElement {
  const outer = React.useContext(LocaleContext);
  const density = props.density || (outer && outer.density) || null;
  const value = React.useMemo(
    function (): AuraLocaleValue {
      const base = (props.locale && STRINGS[props.locale]) || STRINGS.en;
      return {
        locale: props.locale || 'en',
        calendar: props.calendar || null,
        strings: props.strings ? (Object.assign({}, base, props.strings) as AuraStrings) : base,
        linkComponent: props.linkComponent || null,
        density: density,
      };
    },
    [props.locale, props.calendar, props.strings, props.linkComponent, density],
  );
  /* density adds one wrapper (display: contents, so layout is unchanged) carrying data-density for the CSS;
   * Dialog, Drawer, Popover and Command read the context and set it on their portal layer too. */
  return (
    <LocaleContext.Provider value={value}>
      {props.density ? (
        <div className="aura-density" data-density={props.density}>
          {props.children}
        </div>
      ) : (
        props.children
      )}
    </LocaleContext.Provider>
  );
}
/** { locale, calendar, strings } from the nearest AuraProvider (English strings when there is none). */
export function useAuraLocale(): AuraLocaleValue {
  return React.useContext(LocaleContext) || { locale: null, calendar: null, strings: STRINGS.en };
}
/** The element to render a link with: the component's own `linkComponent`, else the provider's, else `a`. */
export function useLinkComponent(own?: React.ElementType | null): React.ElementType {
  const ctx = React.useContext(LocaleContext);
  return own || (ctx && ctx.linkComponent) || 'a';
}
/** The provider's density, for portals that render outside its wrapper. */
export function useDensity(): 'comfortable' | 'compact' | undefined {
  const ctx = React.useContext(LocaleContext);
  return (ctx && ctx.density) || undefined;
}
export function useStrings(): AuraStrings {
  return useAuraLocale().strings;
}
