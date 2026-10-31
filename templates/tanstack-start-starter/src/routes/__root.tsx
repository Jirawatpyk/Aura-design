/* The document: AURA's CSS, the colour scheme before first paint, and AuraProvider with the TanStack link adapter,
 * so every AURA link navigates through the router. */
import type { ReactNode } from 'react';
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router';
/* AURA: fonts (self-hosted from the package, so a font-src 'self' CSP is enough), tokens (light + dark), then
 * component styles. Your brand theme (optional) goes after them. `?url` gives Vite's built file for a <link>. */
import fontsCss from '@jirawatpyk/aura-tokens/aura-fonts.local.css?url';
import tokensCss from '@jirawatpyk/aura-tokens/aura.css?url';
import auraCss from '@jirawatpyk/aura-react/styles.css?url';
import appCss from '../styles.css?url';
import { AuraProvider, ColorSchemeScript, Toaster } from '@jirawatpyk/aura-react';
import { th } from '@jirawatpyk/aura-react/locales/th';
import { AuraLink } from '../components/aura-link';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'AURA starter' },
      { name: 'description', content: 'TanStack Start + AURA Design System' },
    ],
    links: [
      { rel: 'stylesheet', href: fontsCss },
      { rel: 'stylesheet', href: tokensCss },
      { rel: 'stylesheet', href: auraCss },
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    ],
  }),
  shellComponent: RootDocument,
  component: () => (
    /* Thai labels (the pack: from 6.0 only English is built in); dates show พ.ศ. Use locale="en" for English. */
    <AuraProvider locale="th" strings={th} linkComponent={AuraLink}>
      <Outlet />
      <Toaster />
    </AuraProvider>
  ),
});

function RootDocument({ children }: { children: ReactNode }) {
  return (
    /* ColorSchemeScript sets data-theme before paint, so React sees a changed <html>: that is expected. */
    <html lang="th" data-theme="system" suppressHydrationWarning>
      <head>
        <HeadContent />
        {/* Light / dark / system: applies the saved choice before first paint (no flash). */}
        <ColorSchemeScript />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
