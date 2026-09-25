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
  /** The time zone set on the nearest AuraProvider that sets one (4.19). */
  timeZone?: string | null | undefined;
}
const LocaleContext = React.createContext<AuraLocaleValue | null>(null);

/** Sets the language of built-in labels (and the default date locale) for everything inside. */
export function AuraProvider(props: AuraProviderProps): React.ReactElement {
  const outer = React.useContext(LocaleContext);
  const density = props.density || (outer && outer.density) || null;
  const timeZone = props.timeZone || (outer && outer.timeZone) || null;
  /* 5.1.1: a nested provider (say, one that only sets density) inherits what it doesn't set — locale, calendar,
   * strings and the router link — instead of resetting them to English. A new locale brings its own strings and
   * calendar. */
  const value = React.useMemo(
    function (): AuraLocaleValue {
      const own = !!props.locale || !outer || !outer.locale;
      const base = own ? (props.locale && STRINGS[props.locale]) || STRINGS.en : (outer as AuraLocaleValue).strings;
      return {
        locale: props.locale || (outer && outer.locale) || 'en',
        calendar: props.calendar || (own ? null : (outer as AuraLocaleValue).calendar),
        strings: props.strings ? (Object.assign({}, base, props.strings) as AuraStrings) : base,
        linkComponent: props.linkComponent || (outer && outer.linkComponent) || null,
        density: density,
        timeZone: timeZone,
      };
    },
    [props.locale, props.calendar, props.strings, props.linkComponent, density, timeZone, outer],
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
