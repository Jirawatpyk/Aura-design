import * as React from 'react';
import { Drawer } from './Dialog.js';
import { IconButton } from './IconButton.js';
import { cx } from './internal.js';
import { useStrings } from './locale.js';
import { useBreakpoint } from './responsive.js';
import type { AppShellProps } from './types.js';

/** AppShell — side navigation + top bar + content. The nav is fixed from lg (1024px) up and a Drawer below it. */
export const AppShell = React.forwardRef<HTMLDivElement, AppShellProps>(function AppShell(props, ref) {
  const t = useStrings();
  const bp = useBreakpoint();
  const compact = bp === 'base' || bp === 'sm' || bp === 'md';
  const st = React.useState(false),
    open = st[0],
    setOpen = st[1];
  React.useEffect(
    function () {
      if (!compact) setOpen(false);
    },
    [compact],
  );
  const navEl = props.nav as React.ReactElement<{ onChange?: (id: string) => void; className?: string }> | undefined;
  const nav =
    props.nav && React.isValidElement(props.nav) && compact
      ? React.cloneElement(navEl!, {
          onChange: function (id: string) {
            if (navEl!.props.onChange) navEl!.props.onChange(id);
            setOpen(false);
          },
          className: cx(navEl!.props.className, 'is-in-drawer'),
        })
      : props.nav;
  return (
    <div ref={ref} className={cx('aura-shell', compact && 'is-compact', props.className)}>
      {!compact ? <div className="aura-shell__nav">{nav}</div> : null}
      {compact ? (
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
          {nav}
        </Drawer>
      ) : null}
      <div className="aura-shell__main">
        {props.header || compact ? (
          <header className="aura-shell__bar">
            {compact ? (
              <IconButton
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
