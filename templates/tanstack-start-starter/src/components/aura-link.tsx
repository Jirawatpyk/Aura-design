/* AURA's links through TanStack Router.
 *
 * AURA renders every link it owns (Button href, Breadcrumb, Tabs, Menu items, BottomNav, Pagination, Stat,
 * StatusTile, SideNav, Th sortHref, DataTable rows and pager, toast actions) with `linkComponent` and gives it a plain
 * `href` — a path, a query (`?page=2`) or a full URL — plus its own className, aria-current and handlers.
 *
 * Why not pass TanStack's <Link> itself: it stamps aria-current="page" and data-status="active" on every link its own
 * matcher calls active, and its default match treats a link's query as a subset of the URL's — on /members?page=3
 * the page 1 link (/members) and the "All" tab are "current" too. AURA already sets aria-current where it belongs
 * (the page you are on, the chosen tab, the SideNav item). So this is a plain <a> that
 * hands same-origin clicks to router.navigate({ href }) and preloads the route on hover and focus, like <Link>
 * with defaultPreload: 'intent'. New-tab clicks (⌘/Ctrl/Shift/Alt, middle button), target="_blank", download and
 * other origins stay with the browser. */
import * as React from 'react';
import { useRouter } from '@tanstack/react-router';

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

/** The router path for an href on this origin, or null when the browser should handle it (another origin, a
 * scheme such as mailto:, or a #fragment on the page you are on). */
function routerHref(href: string | undefined): string | null {
  if (href == null || typeof window === 'undefined') return null;
  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return null;
  }
  const here = window.location;
  if (url.origin !== here.origin) return null;
  if (url.hash && url.pathname === here.pathname && url.search === here.search) return null;
  return url.pathname + url.search + url.hash;
}

export const AuraLink = React.forwardRef<HTMLAnchorElement, AnchorProps>(function AuraLink(
  { href, onClick, onMouseEnter, onFocus, ...rest },
  ref,
) {
  const router = useRouter();
  const preload = () => {
    const to = routerHref(href);
    /* preloadRoute takes the same options as navigate; its type asks for `to`, but an `href` is built the same way. */
    if (to) router.preloadRoute({ href: to } as Parameters<typeof router.preloadRoute>[0]).catch(() => undefined);
  };
  return (
    <a
      ref={ref}
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const target = e.currentTarget.getAttribute('target');
        if ((target && target !== '_self') || e.currentTarget.hasAttribute('download')) return;
        const to = routerHref(href);
        if (!to) return;
        e.preventDefault();
        void router.navigate({ href: to });
      }}
      onMouseEnter={(e) => {
        onMouseEnter?.(e);
        preload();
      }}
      onFocus={(e) => {
        onFocus?.(e);
        preload();
      }}
    />
  );
});
