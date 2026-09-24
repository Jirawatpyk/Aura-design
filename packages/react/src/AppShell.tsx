import * as React from 'react';
import { Drawer } from './Dialog.js';
import { IconButton } from './IconButton.js';
import { cx } from './internal.js';
import { useStrings } from './locale.js';
import { useBreakpoint } from './responsive.js';
import type { AppShellProps } from './types.js';

type NavElementProps = {
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
  /* The drawer's copy: closes the drawer on navigation, always full width, no collapse toggle. */
  const drawerNav = navEl
    ? React.cloneElement(navEl, {
        onChange: function (id: string) {
          if (navEl.props.onChange) navEl.props.onChange(id);
          setOpen(false);
        },
        className: cx(navEl.props.className, 'is-in-drawer'),
        collapsed: false,
        collapsible: false,
      })
    : props.nav;
  return (
    <div ref={ref} className={cx('aura-shell', props.className)}>
      {props.nav ? <div className="aura-shell__nav">{props.nav}</div> : null}
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
      </div>
    </div>
  );
});
