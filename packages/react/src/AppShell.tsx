import * as React from 'react';
import { Drawer } from './Dialog.js';
import { IconButton } from './IconButton.js';
import { cx, useIsoLayoutEffect, useMergedRef } from './internal.js';
import { useStrings } from './locale.js';
import { useBreakpoint } from './responsive.js';
import { useHideOnScroll } from './scrollHide.js';
import type { AppShellProps } from './types.js';
import { IconMenu } from './icons.js';

type NavElementProps = {
  onAction?: ((id: string) => void) | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  sections?: unknown;
  items?: unknown;
  onChange?: ((id: string) => void) | undefined;
  className?: string | undefined;
  collapsed?: boolean | undefined;
  collapsible?: boolean | undefined;
  headerDivider?: boolean | undefined;
  header?: unknown;
};

/** AppShell — side navigation + top bar + content. The nav is fixed from lg (1024px) up and a Drawer below it.
 * Which one shows is decided in CSS (4.16), so the server's HTML is already right on a phone and nothing shifts on
 * hydration; JavaScript only opens and closes the drawer. */
export const AppShell = React.forwardRef<HTMLDivElement, AppShellProps>(function AppShell(props, ref) {
  const t = useStrings();
  const bp = useBreakpoint();
  const wide = bp === 'lg' || bp === 'xl';
  const st = React.useState(false),
    open = st[0],
    setOpen = st[1];
  /* Growing past lg while the drawer is open: close it (the sidebar is showing now). */
  React.useEffect(
    function () {
      if (wide) setOpen(false);
    },
    [wide],
  );
  const navEl =
    props.nav && React.isValidElement(props.nav) ? (props.nav as React.ReactElement<NavElementProps>) : null;
  /* 5.1.1: an uncontrolled SideNav (defaultValue) is rendered twice — sidebar and drawer — and the drawer's copy
   * unmounts when it closes, so each forgot the current page. AppShell keeps the one value for both. */
  const shared =
    !!navEl &&
    navEl.props.value === undefined &&
    (navEl.props.defaultValue !== undefined || navEl.props.sections !== undefined || navEl.props.items !== undefined);
  const navState = React.useState<string | undefined>(navEl ? navEl.props.defaultValue : undefined);
  function onNav(id: string) {
    if (shared) navState[1](id);
    if (navEl && navEl.props.onChange) navEl.props.onChange(id);
  }
  /* 5.14 (Chamber-OS 104): --aura-shell-bar-height follows the bar's real height (a header that wraps on a phone is
   * taller than 56px; one hidden from lg up is 0). The stylesheet's value is what the server's HTML uses until then. */
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const barRef = React.useRef<HTMLElement | null>(null);
  const mergedRef = useMergedRef(ref, rootRef);
  const hasBar = !!(props.header || props.nav);
  /* 5.33 (DxT Monitor #8): the phone drawer's divided nav header matches the bar, also when the header wraps; the
   * drawer is portalled out of the shell, so it gets the height as its own variable. */
  const barH = React.useState<number | null>(null);
  /* 5.35 (DxT Monitor 13): below lg (where the menu button is) the bar can slide away while the page scrolls down;
   * the bar-height token is 0 meanwhile, so headers pinned under it move up with it. */
  const away = useHideOnScroll(!!props.headerHideOnScroll && hasBar, barRef, '(max-width: 1023.98px)', barH[0] || 56);
  const awayRef = React.useRef(away);
  awayRef.current = away;
  useIsoLayoutEffect(
    function () {
      const root = rootRef.current,
        bar = barRef.current;
      if (!root || !bar) return;
      root.style.setProperty('--aura-shell-bar-height', away ? '0px' : bar.getBoundingClientRect().height + 'px');
    },
    [away],
  );
  useIsoLayoutEffect(
    function () {
      const root = rootRef.current,
        bar = barRef.current;
      if (!root || !bar) return;
      function sync() {
        const h = bar!.getBoundingClientRect().height;
        root!.style.setProperty('--aura-shell-bar-height', awayRef.current ? '0px' : h + 'px');
        if (h > 0) barH[1](Math.round(h));
      }
      sync();
      const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(sync);
      if (ro) ro.observe(bar);
      return function () {
        if (ro) ro.disconnect();
        root.style.removeProperty('--aura-shell-bar-height');
      };
    },
    [hasBar],
  );
  const deskNav = navEl && shared ? React.cloneElement(navEl, { value: navState[0], onChange: onNav }) : props.nav;
  /* The drawer's copy: closes the drawer on navigation, always full width, no collapse toggle. */
  const drawerNav = navEl
    ? React.cloneElement(navEl, {
        value: shared ? navState[0] : navEl.props.value,
        onChange: function (id: string) {
          onNav(id);
          setOpen(false);
        },
        /* 5.16: an action row (Sign out) closes the drawer too. */
        onAction: function (id: string) {
          setOpen(false);
          if (navEl.props.onAction) navEl.props.onAction(id);
        },
        className: cx(navEl.props.className, 'is-in-drawer'),
        collapsed: false,
        collapsible: false,
      })
    : props.nav;
  return (
    <div
      ref={mergedRef}
      className={cx(
        'aura-shell',
        props.bottomNav && 'aura-shell--bottomnav',
        /* 5.14: no top bar at all, or one that only holds the menu button (gone from lg up): the bar-height token is 0. */
        !props.header && !props.nav && 'aura-shell--no-bar',
        !props.header && props.nav && 'aura-shell--menu-bar',
        /* 5.33 (DxT Monitor #6): a header bar for phones only. */
        props.header && props.headerHideFrom === 'lg' && 'aura-shell--menu-bar',
        props.className,
      )}
    >
      {props.nav ? <div className="aura-shell__nav">{deskNav}</div> : null}
      {props.nav ? (
        <Drawer
          open={open}
          onClose={function () {
            setOpen(false);
          }}
          side="left"
          size="nav"
          aria-label={props.navLabel || t.navigation}
          dismissible={true}
          /* 5.33: a 44px close button on phones and touch screens; the divided header's class for the drawer, so it
           * needs no :has(). */
          closeProps={{ touchHeight: true }}
          className={navEl && navEl.props.headerDivider && navEl.props.header ? 'aura-drawer--nav-divided' : undefined}
          style={barH[0] ? ({ '--aura-shell-bar-height': barH[0] + 'px' } as React.CSSProperties) : undefined}
        >
          {drawerNav}
        </Drawer>
      ) : null}
      <div className="aura-shell__main">
        {props.header || props.nav ? (
          <header
            ref={barRef}
            className={cx(
              'aura-shell__bar',
              (!props.header || props.headerHideFrom === 'lg') && 'aura-shell__bar--menu-only',
              props.headerHideOnScroll && 'aura-shell__bar--hides',
              away && 'is-away',
            )}
          >
            {props.nav ? (
              <IconButton
                className="aura-shell__menu"
                icon={<IconMenu />}
                label={props.menuLabel || t.openNav}
                size="md"
                onClick={function () {
                  setOpen(true);
                }}
                aria-expanded={open}
              />
            ) : null}
            <div className="aura-shell__bar-content">{props.header}</div>
          </header>
        ) : null}
        <main
          className={cx('aura-shell__content', props.contentPadding === false && 'is-flush')}
          id={props.mainId || 'main'}
          tabIndex={-1}
        >
          {props.children}
        </main>
        {props.bottomNav || null}
      </div>
    </div>
  );
});
