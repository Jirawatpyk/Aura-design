import type { Metadata } from 'next';
import type { ReactNode } from 'react';
/* AURA: fonts (self-hosted from the package, so a font-src 'self' CSP is enough), tokens (light + dark), then
 * component styles. Your brand theme (optional) goes after them. */
import '@jirawatpyk/aura-tokens/aura-fonts.local.css';
import '@jirawatpyk/aura-tokens/aura.css';
import '@jirawatpyk/aura-react/styles.css';
import { AuraProvider, ColorSchemeScript, Toaster } from '@jirawatpyk/aura-react';
import './globals.css';

export const metadata: Metadata = { title: 'AURA starter', description: 'Next.js + AURA Design System' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    /* ColorSchemeScript sets data-theme before paint, so React sees a changed <html>: that is expected. */
    <html lang="th" data-theme="system" suppressHydrationWarning>
      <head>
        {/* Light / dark / system: applies the saved choice before first paint (no flash). */}
        <ColorSchemeScript />
      </head>
      <body>
        {/* Thai built-in labels; dates show พ.ศ. by default. Use locale="en" for English labels. */}
        <AuraProvider locale="th">
          {children}
          <Toaster />
        </AuraProvider>
      </body>
    </html>
  );
}
