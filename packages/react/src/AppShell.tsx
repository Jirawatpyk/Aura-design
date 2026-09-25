import * as React from 'react';
import { Drawer } from './Dialog.js';
import { IconButton } from './IconButton.js';
import { cx } from './internal.js';
import { useStrings } from './locale.js';
import { useBreakpoint } from './responsive.js';
import type { AppShellProps } from './types.js';

type NavElementProps = {
  value?: string | undefined;
  defaultValue?: string | undefined;
  sections?: unknown;
  items?: unknown;
  onChange?: ((id: string) => void) | undefined;
  className?: string | undefined;
  collapsed?: boolean | undefined;
  collapsible?: boolean | undefined;
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
  const deskNav = navEl && shared ? React.cloneElement(navEl, { value: navState[0], onChange: onNav }) : props.nav;
  /* The drawer's copy: closes the drawer on navigation, always full width, no collapse toggle. */
  const drawerNav = navEl
    ? React.cloneElement(navEl, {
        value: shared ? navState[0] : navEl.props.value,
        onChange: function (id: string) {
          onNav(id);
          setOpen(false);
        },
        className: cx(navEl.props.className, 'is-in-drawer'),
        collapsed: false,
        collapsible: false,
      })
    : props.nav;
  return (
    <div ref={ref} className={cx('aura-shell', props.bottomNav && 'aura-shell--bottomnav', props.className)}>
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
        >
          {drawerNav}
        </Drawer>
      ) : null}
      <div className="aura-shell__main">
        {props.header || props.nav ? (
          <header className={cx('aura-shell__bar', !props.header && 'aura-shell__bar--menu-only')}>
            {props.nav ? (
              <IconButton
                className="aura-shell__menu"
                icon="menu"
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
        <main className="aura-shell__content" id={props.mainId || 'main'}>
          {props.children}
        </main>
        {props.bottomNav || null}
      </div>
    </div>
  );
});
